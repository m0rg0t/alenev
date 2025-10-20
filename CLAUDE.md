# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Anton Lenev built with Astro 5.14+. The site showcases different aspects of Anton's work and interests:
- **IT**: Development projects, talks, and technical articles
- **Podcasts**: "Cosplay and Other Things" podcast
- **Audiobooks**: Voice narration work on Litres platform
- **Cosplay**: Photos and videos of costume creations
- **Publications**: Articles and media mentions
- **Other**: VK Mini apps, Yandex skills, and various side projects

The site is bilingual (Russian/English) with Russian as the default language.

## Development Commands

```bash
# Start development server (http://localhost:4321)
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview
```

## Project Structure

```
src/
├── pages/          # Route pages
│   ├── index.astro           # Homepage (Russian)
│   ├── it.astro             # IT projects page
│   ├── podcasts.astro       # Podcasts page
│   ├── audiobooks.astro     # Audiobooks page
│   ├── cosplay.astro        # Cosplay gallery page
│   ├── publications.astro   # Publications & articles
│   ├── other.astro          # Other projects
│   └── en/                  # English versions
│       └── index.astro      # English homepage
├── layouts/
│   └── BaseLayout.astro     # Main layout with navigation
├── components/              # Reusable components
├── content/                 # Content collections
│   └── cosplay/            # Cosplay content (auto-generated collection)
└── i18n.ts                 # Internationalization utilities
```

## Architecture

### Internationalization (i18n)

The site uses Astro's built-in i18n routing:
- **Default locale**: Russian (`ru`)
- **Supported locales**: `ru`, `en`
- **Routing**: Default locale has no prefix (e.g., `/`, `/it`), English has `/en` prefix (e.g., `/en`, `/en/it`)

Translation utilities in `src/i18n.ts`:
- `languages`: Available language labels
- `ui`: Translation dictionaries for both languages
- `getLangFromUrl()`: Extract current language from URL
- `useTranslations()`: Get translation function for specific language

### Layout System

**BaseLayout.astro** provides:
- Responsive navigation with all category links
- Language switcher (RU/EN)
- Dark theme with CSS custom properties
- Sticky header with smooth scrolling
- Consistent footer

CSS Variables:
```css
--color-bg: Background color
--color-surface: Card/surface color
--color-text: Primary text color
--color-text-muted: Secondary text color
--color-primary: Primary accent (blue)
--color-accent: Secondary accent (cyan)
```

### Content Organization

Each category page follows a consistent pattern:
1. Hero section with page title and description
2. Main content sections organized by topic
3. Links to external resources and projects
4. Responsive grid layouts for cards/items
5. Hover effects and smooth transitions

**Cosplay page** features:
- Project cards with descriptions and links
- Photo gallery with responsive grid
- Image hover effects with scaling

### Important Notes

- The old site generator (using OpenAI) has been moved to `backup/` folder
- Content is currently hardcoded in pages (no CMS)
- Site uses Astro 5.14.7 features
- Runtime: Bun
- No client-side JavaScript framework (pure Astro)
- Responsive design with mobile-first approach

## Adding New Content

To add content to existing pages:
1. Edit the corresponding `.astro` file in `src/pages/` (Russian) or `src/pages/en/` (English)
2. Follow the existing HTML structure and CSS classes
3. Use the same card/project patterns for consistency
4. Add links with `target="_blank" rel="noopener"` for external resources

## Deployment

Build command: `bun run build`
Output directory: `dist/`

The site generates static HTML files suitable for any static hosting provider.
