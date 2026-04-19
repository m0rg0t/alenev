# TODO

## Repository size: prune `.git` history

Current state (after cleanup commit that moved JPG originals out of `public/cosplay/`):
- Working tree: shrunk by ~609 MB (JPG originals moved to `archive/cosplay-originals-jpg/`, gitignored).
- `.git` directory: **still holds every historical blob** (~700 MB) — deleting files from HEAD does not remove them from history.

To actually reclaim the space on GitHub and for future clones, run a history rewrite:

```bash
# Install git-filter-repo (one-time)
brew install git-filter-repo

# From a fresh clone (NOT the working repo):
git clone --mirror git@github.com:m0rg0t/alenev.git alenev-mirror.git
cd alenev-mirror.git

# Drop every *.jpg under public/cosplay/ from the entire history
git filter-repo --invert-paths --path-glob 'public/cosplay/**/*.jpg'

# Force-push the rewritten history
git push --force
```

**Warnings:**
- Destructive. Rewrites SHAs — every open PR, every local clone, every fork needs re-sync.
- Coordinate with collaborators first. Do NOT do this mid-review cycle.
- Back up `archive/cosplay-originals-jpg/` off-repo before the rewrite (keep a copy on disk / Dropbox / R2).
- After the rewrite, `git gc --prune=now --aggressive` on the mirror.

## Alternative: move images to CDN

Longer-term, consider moving `public/cosplay/` and `public/archives/` to an object store + image CDN (Cloudflare R2 + Images, S3 + CloudFront, imagekit, bunny). Benefits:
- Repo stays small.
- Automatic responsive/WebP/AVIF delivery.
- Smaller Astro build artifacts.

Astro supports remote images via `<Image>` from `astro:assets` with `image.domains` allowlist in `astro.config.mjs`.
