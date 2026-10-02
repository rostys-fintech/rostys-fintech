#!/bin/bash
cd "$(dirname "$0")"
PORT=8080
python3 -m http.server "$PORT" >/tmp/liquidity-clock-http.log 2>&1 &
PID=$!
sleep 1
open "http://localhost:$PORT"
echo "Liquidity Clock running at http://localhost:$PORT"
echo "Server PID: $PID"
echo "Close this window or press Ctrl+C when finished."
wait $PID
