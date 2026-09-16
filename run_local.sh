#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8765}"
echo "打开 http://127.0.0.1:${PORT}/ （按 Ctrl+C 停止）"
exec python3 -m http.server "$PORT" --bind 127.0.0.1 --directory docs
