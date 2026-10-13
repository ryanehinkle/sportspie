# SportsPie 🥧

Guess the professional or FBS college football team from **the color proportions of its logo**, rather than the logo itself.

**Site:** https://ryanehinkle.github.io/sportspie/

## Gameplay

- 262 teams across the **NFL (32), NHL (32), NBA (30), MLB (30), and 2026 FBS college football (138)**.
- **Daily challenge:** just two categories: **Pro** (NFL / NHL / NBA / MLB) and **CFB** (all 138 FBS schools). Each has one repeatable six-guess daily puzzle.
- Puzzles reset at **12:00 AM in the player's local timezone**, not UTC. The first puzzle is **#1 on October 13, 2026**; the number increases daily.
- **Unlimited:** play as many randomized puzzles as you like, with individual NFL, NHL, NBA, MLB, CFB and All filters.
- Searchable team autocomplete, **optional click-to-reveal hints** (up to five per round), six-guess limit, reveal screen, result sharing, and locally saved daily win statistics / streaks.
- Hints never reveal themselves after wrong guesses. A **Hint** button reveals each clue only on demand, including before the first guess.
- Saved hint tracking includes hints used, rounds using hints, hint-free wins, and average hints per completed round, separately for Pro, CFB, and each Unlimited league filter. Per-round usage persists across refreshes and is included in the end screen and shared results. Previous finished games are not retrospectively scored as hint-free.
- Responsive mobile and desktop layout, keyboard support, and reduced-motion support.

## How the colors are calculated

During GitHub Pages deployment, all 262 verified primary logo images are downloaded from ESPN's publicly accessible team-logo CDN and saved as self-hosted assets. The 2026 CFB roster is curated from the 138 current FBS programs (including Sacramento State and North Dakota State) and is matched against ESPN's NCAA logo IDs. SportsPie reads the image at its full native resolution, removes transparent pixels and flat outside backgrounds, weights partially transparent edge pixels by opacity, groups similar shades, and calculates each significant color's share of the visible logo. This provides pie slices **derived from actual logo pixels**. Processed palettes are cached in browser local storage.

The ESPN public teams API is used at deployment time to resolve current primary professional team logo image URLs when available. SportsPie uses the original-resolution image without resizing, merges near-identical anti-aliased shades, and assigns every visible pixel (including opacity-weighted edges) to its nearest dominant logo color. If loading, CORS, or analysis fails, a **Retry loading logo colors** control appears instead of inventing proportions. Palettes are versioned so new color calculations replace stale browser caches while leaving results and statistics intact. The app is static and does not use a server, sign-ins, trackers, or a database. The build checks all 262 images before publishing; the deployed game uses the same image source for its pie, guess history, and answer reveal, and does not need cross-origin requests to ESPN for primary assets.

## GitHub Pages setup

This repository includes a GitHub Actions deployment workflow.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included **Deploy SportsPie** workflow deploys the site automatically on each push to the main branch. You can also run it from the **Actions** tab.

No build command, environment variables, or npm packages are needed.

## Note

SportsPie is an independent, unofficial fan project. Team names and logos belong to their respective teams and leagues. The site is not affiliated with or endorsed by ESPN, the NFL, NHL, NBA, or MLB.

## Keeping team images correct

Run `node scripts/build-assets.mjs` from the repository root before serving locally. This generates `cfb-teams.js`, `logo-sources.js`, and `assets/logos/{league}/{id}.png`. GitHub Actions runs the same step and **fails deployment if any primary image is unavailable** rather than showing a broken or mismatched logo. The source list of 138 FBS programs lives in `data/fbs-2026.json`; adapt it annually when teams change divisions. Logo/regression validation runs with `node --test tests/palette.test.cjs tests/team-catalog.test.cjs` after assets are built.

## Display

The pie uses crisp, antialiased SVG arcs rather than rasterized CSS gradient wedges. Desktop gameplay fits inside the visible browser height (no page scrolling); on narrow phone screens the two panels stack to keep the controls usable. The larger color-percentage legend sits directly below the pie, and a centered countdown displays the next **local** midnight. The game header shows the local date and puzzle number in Daily mode; Unlimited uses a minimal single title.
