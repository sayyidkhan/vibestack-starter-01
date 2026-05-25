# Vibe Coding — presentation

Minimal Slidev deck (8 slides) for teaching vibe coding with the VibeStack starter.

## Live

**https://presentation-vibestack-starter-01.vercel.app**

Template app for demos: **https://vibestack-starter-01.vercel.app/**

---

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

Output: `presentation/dist/`

## Deploy on Vercel

This folder is a **separate** Vercel project (root directory = `presentation`).

```bash
vercel --prod
```

Config: `vercel.json` (build → `dist/`).

## Edit slides

Open `slides.md` — each `---` starts a new slide.

### Goto slide list (bottom-left)

Slidev’s built-in **Goto** panel (`g` key) can show a slide list. Custom CSS in `styles/index.css` hides it when closed and moves it to the **bottom-left** so it does not cover slide content.

To remove it entirely, add to `styles/index.css`:

```css
#slidev-goto-dialog { display: none !important; }
```

Add images under `public/`:

```md
![alt](/image-name.png)
```

## Export PDF (optional)

```bash
npm run export
```
