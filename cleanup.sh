#!/bin/bash
# Ask Seba — Cleanup script (Git-First, safe)
# Run only after approval. Backup first.

set -e
DATE=$(date +%Y%m%d)
BRANCH="cleanup-$DATE"
ARCHIVE_DIR="docs/archive/$DATE"

echo "=== 1) Backup + Branch ==="
git add .
git status --short
read -p "Commit all as pre-cleanup backup? (y/n) " -n 1 -r; echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git commit -m "Pre-cleanup backup: $(date)" || true
fi
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

echo "=== 2) Create archive ==="
mkdir -p "$ARCHIVE_DIR"
[ -d "docs/ui-snapshot" ] && mv docs/ui-snapshot "$ARCHIVE_DIR/" 2>/dev/null || true
[ -d "8files-manus" ]     && mv 8files-manus "$ARCHIVE_DIR/" 2>/dev/null || true
[ -d "docs/ux-audit" ]    && mv docs/ux-audit "$ARCHIVE_DIR/" 2>/dev/null || true
[ -d "docs/ui" ]          && mv docs/ui "$ARCHIVE_DIR/" 2>/dev/null || true

echo "=== 3) Safe delete (backup/old only; untrack or remove from disk) ==="
for f in \
  src/app/globals.css.backup \
  src/app/layout.tsx.backup \
  src/components/landing/HeroSection.tsx.old \
  src/middleware.backup \
  next.config.ts.backup \
  tailwind.config.ts.backup \
  ; do
  if [ -f "$f" ]; then
    git rm --cached "$f" 2>/dev/null || true
    rm -f "$f"
    echo "Removed: $f"
  fi
done
# Prisma backups: optional (keep if you want rollback)
# rm -f prisma/schema.prisma.backup_20260123_162103 prisma/seed.ts.bak_20260123_163532

echo "=== 4) Test ==="
npm run build
npm run lint
npm run dev &
PID=$!
sleep 8
kill $PID 2>/dev/null || true

echo "=== 5) Commit + Push ==="
git add .
git status --short
git commit -m "Cleanup: archive ui-snapshot/manus, remove .backup/.old files"
echo "Push with: git push origin $BRANCH"
