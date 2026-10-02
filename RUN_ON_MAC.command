#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required. Install Python 3 and run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi

PORT=8080
while lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT+1))
done

LOG="/tmp/liquidity-clock-http-$PORT.log"
python3 -m http.server "$PORT" --bind 127.0.0.1 >"$LOG" 2>&1 &
PID=$!
cleanup(){ kill "$PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

sleep 1
URL="http://127.0.0.1:$PORT/index.html"

if open -Ra "Google Chrome" >/dev/null 2>&1; then
  open -a "Google Chrome" "$URL"
else
  open "$URL"
fi

echo ""
echo "Liquidity Clock is running:"
echo "$URL"
echo ""
echo "Use a DEVELOPMENT Phantom wallet only."
echo "Flow: Connect Phantom -> Fund Devnet -> Execute Devnet Proof."
echo "Keep this Terminal window open while testing."
echo "Press Ctrl+C when finished."
echo ""
wait "$PID"
