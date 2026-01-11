#!/bin/bash
# Clean archives from junk content

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
ARCHIVES_DIR="$repo_root/src/content/archives"

if [ ! -d "$ARCHIVES_DIR" ]; then
  echo "Archives dir not found: $ARCHIVES_DIR" >&2
  exit 1
fi

shopt -s nullglob

for file in "$ARCHIVES_DIR"/*.md; do
  echo "Cleaning: $(basename "$file")"

  # Create temp file
  tmp_file=$(mktemp)

  # Process file: remove junk patterns
  awk '
  BEGIN { in_frontmatter = 0; frontmatter_count = 0; skip_block = 0 }

  # Track frontmatter
  /^---$/ {
    frontmatter_count++
    if (frontmatter_count == 1) { in_frontmatter = 1 }
    if (frontmatter_count == 2) { in_frontmatter = 0 }
    print
    next
  }

  # Always print frontmatter
  in_frontmatter { print; next }

  # Skip junk patterns
  /^Обновить$/ { next }
  /^Обновлено / { next }
  /— реклама на сайте/ { next }
  /Ещё больше интересных видео/ { next }
  /Время на прочтение/ { next }
  /Охват и читатели/ { next }
  /открытий.*показов/ { next }
  /^\*   \[Наши\]/ { next }
  /^\*   [0-9][0-9]:[0-9][0-9]$/ { next }
  /^\*   [0-9]+ [а-яА-Я]+ [0-9]+$/ { next }
  /Всё о кино и аниме/ { next }
  /!\[Аватарка пользователя/ { next }
  /!\[Логотип компании/ { next }
  /habrastorage.org.*avatars/ { next }
  /\/ru\/users\// { next }
  /\/author\// { next }
  /\/company\// { next }
  /\/authors\// { next }
  /\/ru\/hubs\// { next }
  /youtube.com\/channel/ { next }
  /^для$/ { next }
  /^[0-9]+$/ { next }
  /^\[$/ { next }
  /^\]$/ { next }
  /медиакит.*контакты/ { next }

  # Skip duplicate h1 after content starts (not the first one after ---)
  /^# / {
    if (seen_h1 > 0 && NR > frontmatter_end + 10) {
      # This is likely a duplicate, skip it
      next
    }
    seen_h1++
  }

  # Track end of frontmatter
  frontmatter_count == 2 && !frontmatter_end_set {
    frontmatter_end = NR
    frontmatter_end_set = 1
  }

  # Print everything else
  { print }
  ' "$file" > "$tmp_file"

  # Replace original
  mv "$tmp_file" "$file"
done

echo "Done cleaning archives!"
