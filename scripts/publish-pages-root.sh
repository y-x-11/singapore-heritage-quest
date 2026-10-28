#!/usr/bin/env bash
# Copy Vite dist onto repo root so legacy GitHub Pages (main /) serves index.html + 404.html.
set -euo pipefail

DIST="${1:-apps/web-dashboard/dist}"
ROOT="${2:-.}"

if [[ ! -f "$DIST/index.html" || ! -f "$DIST/404.html" ]]; then
  echo "Missing dist/index.html or dist/404.html — run web-dashboard build first." >&2
  exit 1
fi

publish_item() {
  local name="$1"
  if [[ -e "$DIST/$name" ]]; then
    rm -rf "$ROOT/$name"
    cp -a "$DIST/$name" "$ROOT/$name"
  fi
}

for name in index.html 404.html favicon.png favicon-192.png assets games locations; do
  publish_item "$name"
done

touch "$ROOT/.nojekyll"
echo "Published dashboard bundle from $DIST to $ROOT"
