#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch as a single
# overwriting commit. Run by hand whenever a deploy is wanted; there is no CI,
# and the branch keeps no history (each deploy force-pushes a fresh commit).
set -euo pipefail

remote="$(git remote get-url origin)"

pnpm build

cd dist
git init -q
git add -A
git commit -q -m "deploy $(date -u +%FT%TZ)"
git push -f -q "$remote" HEAD:gh-pages
rm -rf .git

echo "deployed dist/ to gh-pages"
