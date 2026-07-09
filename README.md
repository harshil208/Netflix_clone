# StreamFlix

A Netflix-style streaming interface built with **vanilla HTML, CSS and JavaScript** — no framework, no build step. Multiple profiles, a browsable catalog, a working detail modal, and a simulated fullscreen player that streams real Creative-Commons clips (with a canvas fallback when offline).

Its headline feature is **Vibe Match**: pick a mood and how much time you have, and the catalog re-scores itself instantly — entirely in the browser, with nothing sent anywhere.

---

## Features

- **Profiles & a Kids gate** — four profiles, each with its own My List, ratings and watch progress. The Kids profile only ever sees titles rated TV-PG / PG-13 and below.
- **Vibe Match (the USP)** — mood + time-per-sitting chips that filter and rank titles on the fly. Runs 100% client-side, so no viewing signals leave the device.
- **Browse** — a rotating hero billboard, horizontal rows (Trending, ranked Top 10, genre rows), and live search across titles, tags and cast.
- **Detail modal** — synopsis, cast, similar titles, and a season/episode picker for series.
- **Simulated player** — play/pause, scrub, skip ±10s, speed control, captions, "Skip Intro", and autoplay-next-episode. Plays real CC sample videos; falls back to an animated canvas if the network is blocked.
- **Continue Watching & My List** — resume rows driven by per-profile progress, plus add/remove and thumbs up/down.
- **Auth** — sign-up / sign-in with session persistence.
- **Responsive & accessible-ish** — adapts down to mobile widths and respects `prefers-reduced-motion`.

## Tech stack

Plain HTML5, modern CSS (custom properties, grid, `clamp()`), and framework-free ES2020+ JavaScript. State lives in memory per session; auth persists via `localStorage` with an in-memory fallback. Fonts from Google Fonts, artwork seeded from picsum.photos, sample video from the Blender open-movie project.

## Project structure

```
streamflix/
├── index.html            # markup + all <link>/<script> wiring
├── css/
│   ├── variables.css     # design tokens (load first)
│   ├── reset.css         # base reset + toast component
│   ├── navbar.css
│   ├── hero.css
│   ├── cards.css
│   ├── modal.css
│   ├── auth.css
│   ├── player.css
│   ├── vibe.css
│   ├── footer.css
│   └── responsive.css    # breakpoints + reduced-motion (load last)
├── js/
│   ├── utils.js          # $ helper, toasts, formatting  (loads first)
│   ├── data.js           # catalog, artwork, video sources
│   ├── storage.js        # localStorage persistence
│   ├── profile.js        # profile state + profile gate
│   ├── notifications.js
│   ├── cards.js          # rendering, rows, view switching
│   ├── continueWatching.js
│   ├── myList.js
│   ├── modal.js
│   ├── recommendations.js# Vibe Match engine
│   ├── search.js
│   ├── navbar.js
│   ├── player.js         # simulated streaming player
│   ├── auth.js
│   └── app.js            # hero rotation + boot  (loads last)
├── README.md
├── .gitignore
└── LICENSE
```

> Scripts are ordered by dependency in `index.html`: `utils.js` (which defines the `$` helper) loads first and `app.js` (which boots the app) loads last. Keep that order if you add or move files.

## Getting started

No build tooling required. Because the browser blocks `fetch`/module behaviour on `file://`, serve the folder rather than double-clicking the HTML:

```bash
# any static server works — pick one
python3 -m http.server 8000
#   or
npx serve .
```

Then open `http://localhost:8000`.

## Notes & disclaimers

- **Playback is simulated.** The player uses public Creative-Commons clips for demonstration; the app is a UI showcase, not a real streaming service.
- **The catalog is fictional.** All titles, descriptions and artwork are placeholders.
- **Auth is not secure.** Credentials sit in `localStorage` behind a trivial non-cryptographic hash — fine for a demo, never for anything real.

## License

Released under the MIT License — see [LICENSE](LICENSE).
