#!/bin/bash
# scripts/run-full-sweep.sh
# Full paginated price sync sweep across all indexed perfumes.
#
# Usage:
#   bash scripts/run-full-sweep.sh
#
# Env vars (all optional):
#   SYNC_LIMIT             perfumes per batch for sync-prices.ts (default: 20)
#   BATCH_DELAY_SECONDS    seconds to wait between full batches (default: 30)
#   MAX_BATCHES            safety ceiling — stops after this many batches (default: 100)

set -euo pipefail

# ── Config ─────────────────────────────────────────────────────────────────────
SYNC_LIMIT="${SYNC_LIMIT:-20}"
BATCH_DELAY_SECONDS="${BATCH_DELAY_SECONDS:-30}"
MAX_BATCHES="${MAX_BATCHES:-100}"

echo ""
echo "=== [run-full-sweep] Starting sweep ==="
echo "  SYNC_LIMIT           = ${SYNC_LIMIT}"
echo "  BATCH_DELAY_SECONDS  = ${BATCH_DELAY_SECONDS}"
echo "  MAX_BATCHES          = ${MAX_BATCHES}"
echo "  Note: sweep assumes relative data stability during run"
echo ""

OFFSET=0
BATCH_NUM=0

while [ "${BATCH_NUM}" -lt "${MAX_BATCHES}" ]; do
  echo "--- Batch ${BATCH_NUM} | offset=${OFFSET} ---"

  # Step 1: check how many perfumes are in this slice
  SLICE_COUNT=$(SLICE_OFFSET="${OFFSET}" SLICE_LIMIT="${SYNC_LIMIT}" \
    npx dotenv-cli -e .env.local -- npx tsx scripts/check-slice-count.ts)

  # Step 2: empty slice → sweep complete
  if [ "${SLICE_COUNT}" -eq 0 ]; then
    echo "[run-full-sweep] Slice is empty — sweep complete."
    break
  fi

  echo "[run-full-sweep] Perfumes in slice: ${SLICE_COUNT}"

  # Step 3: run sync for this slice
  SYNC_LIMIT="${SYNC_LIMIT}" SYNC_OFFSET="${OFFSET}" \
    npx dotenv-cli -e .env.local -- npx tsx scripts/sync-prices.ts

  # Step 4: advance counters
  OFFSET=$(( OFFSET + SYNC_LIMIT ))
  BATCH_NUM=$(( BATCH_NUM + 1 ))

  # Step 5: delay only if there may be more batches and this was a full slice
  if [ "${BATCH_NUM}" -lt "${MAX_BATCHES}" ] && [ "${SLICE_COUNT}" -eq "${SYNC_LIMIT}" ]; then
    echo "[run-full-sweep] Waiting ${BATCH_DELAY_SECONDS}s before next batch..."
    sleep "${BATCH_DELAY_SECONDS}"
  fi
done

# ── Post-loop ──────────────────────────────────────────────────────────────────
if [ "${BATCH_NUM}" -ge "${MAX_BATCHES}" ]; then
  echo "[run-full-sweep] WARNING: reached MAX_BATCHES (${MAX_BATCHES}) — sweep may be incomplete"
fi

echo ""
echo "=== [run-full-sweep] Done | total batches run: ${BATCH_NUM} ==="
