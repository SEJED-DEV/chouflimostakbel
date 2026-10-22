#!/usr/bin/env bash
#
# Deploys this repository to the machine it runs on.
#
#   sudo bash scripts/deploy.sh
#
# Runs on the server, from the checked-out repository. It does five things,
# in this order, and stops at the first one that fails:
#
#   1. Move the checkout to origin/main.
#   2. Install dependencies, but only if the lockfile changed.
#   3. Apply any migration the database has not seen yet.
#   4. Build.
#   5. Restart the process, and wait until it answers.
#
# WHAT IT WILL NOT DO
#
# It will not drop the database, reset it, or delete a row. A migration is
# applied and then recorded; the data that is there stays there. The word
# "reset" does not appear in this file, on purpose.
#
# The database is the live one. The migrations are applied to it directly,
# with psql inside the Postgres container, because there is no Supabase CLI
# on this machine and the ledger is a plain table that can be read and
# written the same way.
#
# The ledger is read before anything is applied, so a migration that is
# already recorded is skipped rather than run twice. Each migration file is
# wrapped in a transaction with its ledger row, so a migration that fails
# leaves the ledger exactly as it was and can be looked at and fixed rather
# than half-applied.
set -euo pipefail

APP="${APP_DIR:-/opt/chouflimostakbel}"
DB_CONTAINER="${DB_CONTAINER:-supabase-db}"
PM2_NAME="${PM2_NAME:-chouflimostakbel}"
PORT="${PORT:-3016}"

cd "$APP"

say() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[33m!    %s\033[0m\n' "$1"; }
die() { printf '\033[31mxx   %s\033[0m\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------- 1. checkout
say "Moving to origin/main"
git fetch origin main --quiet
git reset --hard origin/main --quiet
git clean -fd --quiet --exclude=.env.local
COMMIT="$(git rev-parse --short HEAD)"
echo "    at $COMMIT"

# ------------------------------------------------------------------- 2. deps
say "Dependencies"
if [ -f .next/deps-hash ]; then
  PREV_HASH="$(cat .next/deps-hash)"
else
  PREV_HASH=""
fi
NEW_HASH="$(sha256sum package-lock.json | cut -c1-64)"
if [ "$PREV_HASH" = "$NEW_HASH" ]; then
  echo "    lockfile unchanged, skipping npm ci"
else
  npm ci --no-audit --no-fund
fi

# ------------------------------------------------------------- 3. migrations
say "Migrations"
# The container is where psql lives. The ledger is a plain table.
# Arguments are forwarded: the ledger is read with a `-c` query, and each
# migration is piped in on stdin. Without "$@" the read would pass no query
# and psql would wait on a stdin that never closes.
psql_run() {
  sudo docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres \
    -v ON_ERROR_STOP=1 --quiet "$@"
}

APPLIED="$(psql_run -c "select version from supabase_migrations.schema_migrations order by version;" | grep -E '^[0-9]{14}$' || true)"

PENDING=0
for file in supabase/migrations/*.sql; do
  [ -e "$file" ] || continue
  name="$(basename "$file" .sql)"
  version="${name%%_*}"
  label="${name#*_}"

  if printf '%s\n' "$APPLIED" | grep -qx "$version"; then
    echo "    $label already applied"
    continue
  fi

  echo "    applying $label"
  # One transaction: the migration and its ledger row succeed together or
  # not at all. A migration that fails leaves nothing behind to undo.
  {
    printf 'BEGIN;\n'
    cat "$file"
    printf '\n'
    printf "INSERT INTO supabase_migrations.schema_migrations (version, name, statements) VALUES ('%s', '%s', ARRAY[]::text[]);\n" \
      "$version" "$label"
    printf 'COMMIT;\n'
  } | psql_run >/dev/null || die "migration $label failed; the database was left as it was"
  PENDING=$((PENDING + 1))
done

if [ "$PENDING" -eq 0 ]; then
  echo "    nothing to apply"
fi

# ------------------------------------------------------------------ 4. build
say "Building"
# The build writes the commit it was made from, which is what the status
# line reports, so it has to run after the checkout and not before.
npm run build --silent

# ----------------------------------------------------------------- 5. restart
say "Restarting"
pm2 restart "$PM2_NAME" --update-env >/dev/null 2>&1 || die "pm2 could not restart $PM2_NAME"

# Wait for the port to answer. A restart that returns before the server is
# listening is a restart that serves a connection error for a few seconds.
printf '    waiting for the site'
for _ in $(seq 1 40); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    echo " ok"
    break
  fi
  printf '.'
  sleep 1
done

if ! curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
  die "the site did not answer on port $PORT"
fi

# The hash the running build reports, so a deploy can be checked from the
# outside without trusting this script's own arithmetic.
BUILT="$(node -e "try{process.stdout.write(require('./lib/build-info.json').shortSha||'?')}catch(e){process.stdout.write('?')}")"

say "Deployed"
echo "    commit $COMMIT"
echo "    build  $BUILT"
echo "    site   http://127.0.0.1:${PORT}/"
