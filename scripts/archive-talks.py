#!/usr/bin/env python3
"""Archive talks/videos listed in scripts/talks.json into archive/videos/<id>/.

Idempotent: entries with a .done marker are skipped. Safe to re-run after
editing talks.json — only new or previously-failed entries are fetched.

Requires: yt-dlp on PATH (brew install yt-dlp).
"""
from __future__ import annotations

import datetime as dt
import json
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = REPO_ROOT / "scripts" / "talks.json"
OUT_DIR = REPO_ROOT / "archive" / "videos"


def run_ytdlp(url: str, talk_dir: Path) -> bool:
    cmd = [
        "yt-dlp",
        "--no-progress",
        "--no-playlist",
        "--ignore-errors",
        "-f", "bv*+ba/b",
        "--merge-output-format", "mp4",
        "--write-info-json",
        "--write-description",
        "--write-thumbnail",
        "--write-subs",
        "--write-auto-subs",
        "--sub-langs", "ru.*,en.*",
        "--convert-subs", "vtt",
        "-o", str(talk_dir / "%(id)s.%(ext)s"),
        url,
    ]
    result = subprocess.run(cmd)
    return result.returncode == 0


def main() -> int:
    if shutil.which("yt-dlp") is None:
        print("error: yt-dlp not found. Install with: brew install yt-dlp", file=sys.stderr)
        return 1
    if not MANIFEST.exists():
        print(f"error: manifest not found at {MANIFEST}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with MANIFEST.open(encoding="utf-8") as f:
        data = json.load(f)

    talks = [t for t in data.get("talks", []) if t.get("sources")]
    total = len(talks)
    ok = skipped = failed = 0

    for t in talks:
        tid = t["id"]
        sources = t["sources"]
        talk_dir = OUT_DIR / tid
        talk_dir.mkdir(parents=True, exist_ok=True)
        done_marker = talk_dir / ".done"

        if done_marker.exists():
            print(f"== [{tid}] already archived — skip")
            skipped += 1
            continue

        print(f"== [{tid}] downloading ({len(sources)} source(s))")
        success = False
        for url in sources:
            print(f"   -> {url}")
            if run_ytdlp(url, talk_dir):
                success = True
                break
            print("   !! source failed, trying next", file=sys.stderr)

        if success:
            done_marker.write_text(dt.datetime.now(dt.timezone.utc).isoformat() + "\n")
            ok += 1
        else:
            print(f"!! [{tid}] all sources failed", file=sys.stderr)
            failed += 1

    print()
    print(f"done: {ok} ok, {skipped} skipped, {failed} failed (of {total} total)")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
