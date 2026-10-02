#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required. Install Python 3 and run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi

RAW_BASE="https://raw.githubusercontent.com/rostys-fintech/rostys-fintech/liquidity-clock"
CORE_FILES=(index.html styles.css custom.css engine.js solana-adapter.js app.js)
OPTIONAL_FILES=(favicon.svg site.webmanifest favicon-32.png favicon.ico apple-touch-icon.png og-card.png)

echo "Syncing latest Liquidity Clock build from GitHub..."
SYNC_OK=1
for f in "${CORE_FILES[@]}"; do
  tmp=".${f}.tmp"
  if curl -fL --connect-timeout 8 --max-time 20 -sS "$RAW_BASE/$f" -o "$tmp"; then
    mv "$tmp" "$f"
    echo "  updated $f"
  else
    rm -f "$tmp"
    echo "  WARNING: could not update $f"
    SYNC_OK=0
  fi
done
for f in "${OPTIONAL_FILES[@]}"; do
  tmp=".${f}.tmp"
  if curl -fL --connect-timeout 8 --max-time 20 -sS "$RAW_BASE/$f" -o "$tmp"; then
    mv "$tmp" "$f"
  else
    rm -f "$tmp"
  fi
done

if [ "$SYNC_OK" -eq 1 ]; then
  echo "Latest build synced."
else
  echo "Continuing with available local files. If the UI looks old, check internet access and rerun."
fi

PORT=8080
STAMP=$(date +%s)
URL="http://127.0.0.1:$PORT/index.html?v=$STAMP"
BASE_URL="http://127.0.0.1:$PORT/index.html"

open_url(){
  if open -Ra "Google Chrome" >/dev/null 2>&1; then
    open -a "Google Chrome" "$URL"
  else
    open "$URL"
  fi
}

if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  if curl -fsS "$BASE_URL" 2>/dev/null | grep -q "LIQUIDITY"; then
    echo "Liquidity Clock is already running on port $PORT. Opening the refreshed build."
    open_url
    exit 0
  fi
  echo "Port $PORT is already used by another app."
  echo "Close that app/process and run this launcher again."
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
echo "$BASE_URL"
echo ""
echo "Flow: Timing Stress -> Run Live Solana Proof."
echo "The app tries Devnet first and Testnet second automatically."
echo "If public test funding is unavailable, the app will show SIGNED / NOT BROADCAST and keep the treasury state unchanged."
echo "No Phantom, manual faucet step, or mainnet funds are required."
echo "Keep this Terminal window open while testing."
echo "Press Ctrl+C when finished."
echo ""
wait "$PID"
