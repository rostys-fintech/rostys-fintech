#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required. Install Python 3 and run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi

PORT=8080
URL="http://127.0.0.1:$PORT/index.html"

open_url(){
  if open -Ra "Google Chrome" >/dev/null 2>&1; then
    open -a "Google Chrome" "$URL"
  else
    open "$URL"
  fi
}

if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  if curl -fsS "$URL" 2>/dev/null | grep -q "LIQUIDITY"; then
    echo "Liquidity Clock is already running on port $PORT."
    open_url
    exit 0
  fi
  echo "Port $PORT is already used by another app."
  echo "Close that app/process and run this launcher again so Liquidity Clock keeps the same browser origin and Devnet demo address."
  read -r -p "Press Enter to close..."
  exit 1
fi

LOG="/tmp/liquidity-clock-http-$PORT.log"
python3 -m http.server "$PORT" --bind 127.0.0.1 >"$LOG" 2>&1 &
PID=$!
cleanup(){ kill "$PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

sleep 1
open_url

echo ""
echo "Liquidity Clock is running:"
echo "$URL"
echo ""
echo "Flow: Timing Stress -> Run Live Devnet Proof."
echo "If the public Devnet faucet is rate-limited, use the in-app funding fallback once; the same demo address is kept in this browser."
echo "Keep this Terminal window open while testing."
echo "Press Ctrl+C when finished."
echo ""
wait "$PID"
