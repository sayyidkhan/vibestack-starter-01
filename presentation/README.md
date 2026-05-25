# Vibe Coding — presentation

Minimal Slidev deck (8 slides) for teaching vibe coding with the VibeStack starter.

## Local

```bash
cd presentation
npm install
npm run dev
```

- Arrow keys / space: next slide
- `o`: overview mode
- `f`: fullscreen

## Build static site

```bash
npm run build
```

Output: `presentation/dist/` — deploy this folder.

## Deploy on Vercel (recommended)

1. Vercel → **Add New Project** → same GitHub repo
2. Set **Root Directory** to `presentation`
3. Framework: Vercel auto-detects from `presentation/vercel.json`
4. Deploy

You get a separate URL (e.g. `vibestack-slides.vercel.app`) without touching the main app deploy.

## Edit slides

Open `slides.md` — each `---` starts a new slide. Keep bullets short; add screenshots by dropping images in `presentation/public/` and using:

```md
![alt](/image-name.png)
```

## Export PDF (optional)

```bash
npm run export
```
