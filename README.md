# SportsPie 🥧

Guess the professional sports team from **the color proportions of its logo**, rather than the logo itself.

**Site:** https://ryanehinkle.github.io/sportspie/

## Gameplay

- 124 teams across the **NFL (32), NHL (32), NBA (30), MLB (30)**.
- Filter by any league or play with all four leagues combined.
- **Daily challenge:** one repeatable puzzle per UTC day and league selection, with six guesses. Five independent daily puzzles (All / NFL / NHL / NBA / MLB).
- **Unlimited:** keep playing randomly chosen logo puzzles.
- Searchable team autocomplete, progressively unlocked clues, six-guess limit, reveal screen, result sharing, and locally saved daily win statistics / streaks.
- Responsive mobile and desktop layout, keyboard support, and reduced-motion support.

## How the colors are calculated

Logo images are downloaded from ESPN's publicly accessible team-logo CDN. SportsPie draws the logo on an offscreen canvas, excludes transparent/anti-aliased pixels, groups similar colors, and calculates the relative area covered by each significant color. This provides pie slices **derived from actual logo pixels**. Processed palettes are cached in browser local storage.

The ESPN public teams API is used only to resolve current logo image URLs when available. If image loading, CORS, or pixel analysis fails, a **clearly marked approximate palette** based on team brand colors keeps the game playable. The app is fully static and doesn't use a server, sign-ins, trackers, or a database. Internet access is needed for first-time logo retrieval.

## GitHub Pages setup

This repository includes a GitHub Actions deployment workflow.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included **Deploy SportsPie** workflow deploys the site automatically on each push to the main branch. You can also run it from the **Actions** tab.

No build command, environment variables, or npm packages are needed.

## Note

SportsPie is an independent, unofficial fan project. Team names and logos belong to their respective teams and leagues. The site is not affiliated with or endorsed by ESPN, the NFL, NHL, NBA, or MLB.
