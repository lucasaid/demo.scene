# demo.scene

A Gatsby site built for a showcase of DOS BBS intros, crack intros, and demos from the 90s.

## What it does

Each demo runs in-browser via a DOS emulator (js-dos). The site has three modes:

- **Grid view** (`/`) — browse all demos with screenshots
- **Demo player** (`/:slug`) — watch an individual demo
- **TV mode** (`/tv`) — auto-advancing slideshow that cycles through demos randomly

Demo metadata (title, year, DOS command, keypresses, NSFW flag, etc.) lives in `content/data.json`. Pages are generated from that file at build time.

## Running locally

```bash
npm install
npm run develop   # http://localhost:8000
```

```bash
npm run build     # production build
npm run serve     # serve the production build
npm run clean     # clear Gatsby cache
```
