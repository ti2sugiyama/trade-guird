#!/usr/bin/env python3
"""Collect daily price data from Yahoo Finance and store as CSV.

Designed for low request pressure: one symbol at a time with long pacing.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import random
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import List, Tuple

YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"


def parse_ymd_date(value: str, name: str) -> dt.date:
    try:
        return dt.date.fromisoformat(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError(f"{name} must be YYYY-MM-DD: {value}") from exc


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Collect Yahoo daily prices to CSV")
    parser.add_argument("--symbols-file", required=True, help="Text file: one symbol per line")
    parser.add_argument("--out-dir", default="data/collector", help="Output directory")
    parser.add_argument("--days", type=int, default=60, help="Keep latest N daily rows per symbol")
    parser.add_argument(
        "--range",
        dest="range_value",
        default="3mo",
        help="Yahoo range parameter (default: 3mo)",
    )
    parser.add_argument(
        "--start-date",
        default="",
        help="Start date (inclusive) in YYYY-MM-DD. When set, fetch by date window instead of --range.",
    )
    parser.add_argument(
        "--end-date",
        default="",
        help="End date (inclusive) in YYYY-MM-DD. Requires --start-date.",
    )
    parser.add_argument("--interval", default="1d", help="Yahoo interval parameter (default: 1d)")
    parser.add_argument(
        "--window-hours",
        type=float,
        default=8.0,
        help="Spread symbol requests over this window (default: 8.0)",
    )
    parser.add_argument(
        "--min-delay-sec",
        type=float,
        default=20.0,
        help="Minimum delay between symbol requests (default: 20s)",
    )
    parser.add_argument("--max-retries", type=int, default=2, help="Retries per symbol (default: 2)")
    parser.add_argument(
        "--retry-wait-sec",
        type=float,
        default=90.0,
        help="Base wait before retry (default: 90s)",
    )
    parser.add_argument(
        "--timeout-sec",
        type=float,
        default=20.0,
        help="HTTP timeout seconds (default: 20)",
    )
    parser.add_argument(
        "--append-suffix",
        default="",
        help="Suffix appended when symbol has no dot, e.g. .T",
    )
    parser.add_argument("--seed", type=int, default=42, help="Random seed for retry jitter")
    args = parser.parse_args()

    if args.end_date and not args.start_date:
        parser.error("--end-date requires --start-date")

    if args.start_date:
        start_date = parse_ymd_date(args.start_date, "--start-date")
        end_date = parse_ymd_date(args.end_date, "--end-date") if args.end_date else dt.date.today()
        if end_date < start_date:
            parser.error("--end-date must be same or later than --start-date")

        args.start_date = start_date.isoformat()
        args.end_date = end_date.isoformat()

    return args


def load_symbols(path: Path, suffix: str) -> List[str]:
    symbols: List[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        symbol = line
        if suffix and "." not in symbol:
            symbol = f"{symbol}{suffix}"
        symbols.append(symbol)
    unique_symbols = list(dict.fromkeys(symbols))
    return unique_symbols


def fetch_symbol(
    symbol: str,
    range_value: str,
    start_date: str,
    end_date: str,
    interval: str,
    timeout_sec: float,
) -> List[Tuple[str, float, float, float, float, int]]:
    query_params = {
        "interval": interval,
        "includePrePost": "false",
        "events": "div,splits",
    }

    if start_date:
        start_dt = dt.datetime.fromisoformat(start_date).replace(tzinfo=dt.timezone.utc)
        end_dt = dt.datetime.fromisoformat(end_date).replace(tzinfo=dt.timezone.utc)
        # Yahoo period2 is exclusive; +1 day to include end date in daily bars.
        query_params["period1"] = str(int(start_dt.timestamp()))
        query_params["period2"] = str(int((end_dt + dt.timedelta(days=1)).timestamp()))
    else:
        query_params["range"] = range_value

    params = urllib.parse.urlencode(query_params)
    url = YAHOO_CHART_URL.format(symbol=urllib.parse.quote(symbol, safe="")) + f"?{params}"
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; market-data-collector/1.0)",
            "Accept": "application/json",
        },
    )

    with urllib.request.urlopen(request, timeout=timeout_sec) as response:
        payload = json.loads(response.read().decode("utf-8"))

    result = payload.get("chart", {}).get("result")
    error = payload.get("chart", {}).get("error")
    if error:
        raise RuntimeError(f"Yahoo error: {error}")
    if not result:
        raise RuntimeError("Yahoo response missing result")

    item = result[0]
    timestamps = item.get("timestamp") or []
    quote = ((item.get("indicators") or {}).get("quote") or [{}])[0]
    opens = quote.get("open") or []
    highs = quote.get("high") or []
    lows = quote.get("low") or []
    closes = quote.get("close") or []
    volumes = quote.get("volume") or []

    rows: List[Tuple[str, float, float, float, float, int]] = []
    for ts, o, h, l, c, v in zip(timestamps, opens, highs, lows, closes, volumes):
        if None in (o, h, l, c, v):
            continue
        date = dt.datetime.utcfromtimestamp(ts).date().isoformat()
        rows.append((date, float(o), float(h), float(l), float(c), int(v)))
    return rows


def sleep_until(target_ts: float) -> None:
    now = time.time()
    if target_ts > now:
        time.sleep(target_ts - now)


def main() -> int:
    args = parse_args()
    random.seed(args.seed)

    symbols_path = Path(args.symbols_file)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    symbols = load_symbols(symbols_path, args.append_suffix)
    if not symbols:
        print("No symbols loaded.", file=sys.stderr)
        return 2

    now = dt.datetime.now(dt.timezone.utc)
    stamp = now.strftime("%Y%m%d_%H%M%S")
    csv_path = out_dir / f"prices_{stamp}.csv"
    failed_path = out_dir / f"failed_symbols_{stamp}.txt"
    report_path = out_dir / f"run_report_{stamp}.json"

    window_sec = max(0.0, args.window_hours * 3600.0)
    target_interval = window_sec / len(symbols) if symbols else 0.0
    delay_sec = max(args.min_delay_sec, target_interval)

    print(f"Symbols: {len(symbols)}")
    print(f"Delay between symbols: {delay_sec:.1f} sec")
    print(f"Output: {csv_path}")

    success_count = 0
    failed: List[Tuple[str, str]] = []
    total_rows = 0
    start_ts = time.time()
    next_slot = start_ts

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["symbol", "date", "open", "high", "low", "close", "volume", "fetched_at_utc"])

        for idx, symbol in enumerate(symbols, start=1):
            sleep_until(next_slot)

            last_error = ""
            rows: List[Tuple[str, float, float, float, float, int]] = []

            for attempt in range(args.max_retries + 1):
                try:
                    rows = fetch_symbol(
                        symbol,
                        args.range_value,
                        args.start_date,
                        args.end_date,
                        args.interval,
                        args.timeout_sec,
                    )
                    if not rows:
                        raise RuntimeError("No rows returned")
                    break
                except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, RuntimeError, ValueError) as exc:
                    last_error = str(exc)
                    if attempt >= args.max_retries:
                        break
                    wait_sec = args.retry_wait_sec * (2 ** attempt) + random.uniform(0, 15)
                    print(f"[{idx}/{len(symbols)}] {symbol} retry {attempt + 1}/{args.max_retries} in {wait_sec:.1f}s")
                    time.sleep(wait_sec)

            if rows:
                trimmed = rows[-args.days :]
                fetched_at = dt.datetime.now(dt.timezone.utc).isoformat()
                for row in trimmed:
                    writer.writerow([symbol, *row, fetched_at])
                total_rows += len(trimmed)
                success_count += 1
                print(f"[{idx}/{len(symbols)}] OK {symbol} rows={len(trimmed)}")
            else:
                failed.append((symbol, last_error))
                print(f"[{idx}/{len(symbols)}] NG {symbol} error={last_error}")

            next_slot += delay_sec

    with failed_path.open("w", encoding="utf-8") as f:
        for symbol, reason in failed:
            f.write(f"{symbol}\t{reason}\n")

    elapsed = time.time() - start_ts
    report = {
        "started_at_utc": now.isoformat(),
        "finished_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "symbols_total": len(symbols),
        "symbols_succeeded": success_count,
        "symbols_failed": len(failed),
        "rows_written": total_rows,
        "days_requested": args.days,
        "yahoo_range": args.range_value,
        "start_date": args.start_date,
        "end_date": args.end_date,
        "interval": args.interval,
        "window_hours": args.window_hours,
        "delay_sec": delay_sec,
        "elapsed_sec": elapsed,
        "files": {
            "prices_csv": str(csv_path),
            "failed_symbols": str(failed_path),
            "run_report": str(report_path),
        },
    }
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Done: success={success_count}, failed={len(failed)}, rows={total_rows}, elapsed={elapsed:.1f}s")
    print(f"Report: {report_path}")

    return 0 if success_count > 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
