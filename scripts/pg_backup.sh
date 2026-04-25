#!/usr/bin/env bash
# Daily pg_dump of the bentor database. Rotates files older than RETENTION_DAYS.
# Invoked by ~/Library/LaunchAgents/com.bentor.dashboard-backup.plist.
set -euo pipefail

REPO_DIR="/Users/reiser/Projects/atlantis/investment-dashboard"
BACKUP_DIR="${BENTOR_BACKUP_DIR:-$HOME/Backups/bentor}"
RETENTION_DAYS="${BENTOR_BACKUP_RETENTION_DAYS:-30}"
PG_DUMP="${PG_DUMP:-/opt/homebrew/opt/postgresql@16/bin/pg_dump}"

mkdir -p "$BACKUP_DIR"

if [[ -f "$REPO_DIR/.env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_DIR/.env.local"
  set +a
fi
: "${DATABASE_URL:=postgres://bentor:bentor_local_dev_only@localhost:5432/bentor}"

ts="$(date +%Y-%m-%d_%H%M%S)"
out="$BACKUP_DIR/bentor-$ts.sql.gz"

"$PG_DUMP" --no-owner --no-acl --format=plain "$DATABASE_URL" | gzip -9 > "$out.tmp"
mv "$out.tmp" "$out"

find "$BACKUP_DIR" -name 'bentor-*.sql.gz' -type f -mtime "+$RETENTION_DAYS" -delete

size="$(du -h "$out" | cut -f1)"
printf '%s ok %s (%s)\n' "$(date -u +%FT%TZ)" "$out" "$size"
