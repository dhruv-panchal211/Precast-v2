#!/usr/bin/env bash
#
# Stratoform — production deploy, run on the VPS (via the forced command
# /usr/local/bin/stratoform-deploy, triggered by .github/workflows/ci.yml).
#
# The caller checks out the target commit before invoking this script; doing
# the checkout here would mean rewriting the file bash is currently reading.
#
# Safe to run by hand:  cd /var/www/stratoform && bash scripts/deploy.sh
set -euo pipefail

APP_DIR="/var/www/stratoform"
PM2_NAME="stratoform"
PORT="3004"
export NEXT_TELEMETRY_DISABLED=1

cd "$APP_DIR"

echo "==> Deploying $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

echo "==> Installing dependencies"
# npm ci fails hard if package-lock.json drifted from package.json.
npm ci --no-audit --no-fund

# Build into a scratch directory and swap it in only on success, so a failed
# build never deletes the chunks the running server is still serving.
echo "==> Building"
rm -rf .next-staged
NEXT_DIST_DIR=.next-staged npx next build

echo "==> Swapping in the new build"
rm -rf .next-previous
[ -d .next-build ] && mv .next-build .next-previous
mv .next-staged .next-build

echo "==> Reloading pm2"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save >/dev/null

echo "==> Health check"
for i in $(seq 1 20); do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/" || true)
  if [ "$code" = "200" ]; then
    echo "==> Healthy (HTTP $code) after ${i}s"
    rm -rf .next-previous
    exit 0
  fi
  sleep 1
done

# Roll the filesystem back to the previous build and reload against it, so the
# site returns to the last known-good version instead of staying down.
echo "==> Unhealthy after 20s — rolling back" >&2
if [ -d .next-previous ]; then
  rm -rf .next-build
  mv .next-previous .next-build
  pm2 startOrReload ecosystem.config.cjs --update-env
  echo "==> Rolled back to the previous build" >&2
fi
exit 1
