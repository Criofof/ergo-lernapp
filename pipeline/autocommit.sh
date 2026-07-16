#!/usr/bin/env bash
# Engmaschiger Auto-Checkpoint: committet alle INTERVAL s neue/geänderte Dateien.
# Läuft bis max ITER Iterationen oder bis 'pipeline/.stopcommit' existiert.
cd "$(dirname "$0")/.."
INTERVAL=${1:-180}
ITER=${2:-80}
for i in $(seq 1 "$ITER"); do
  [ -f pipeline/.stopcommit ] && { echo "stop-Datei gefunden, beende."; break; }
  if [ -n "$(git status --porcelain)" ]; then
    n=$(git status --porcelain | wc -l)
    git add -A >/dev/null 2>&1
    git commit -q -m "auto-checkpoint $(date '+%Y-%m-%d %H:%M') ($n Dateien)" >/dev/null 2>&1 && echo "committed $n @ $(date '+%H:%M:%S')"
  fi
  sleep "$INTERVAL"
done
