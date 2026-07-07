# Mission Manifest

A launch tracker that pulls live data from the [Launch Library 2 API](https://thespacedevs.com/llapi) to display upcoming and past rocket launches. Cards show mission details, launch provider, countdown timers, and a slide-in detail drawer with vehicle stats and launch site info.

## Tech

- Vanilla JS (ES modules)
- SCSS compiled to CSS
- Launch Library 2 API (`lldev.thespacedevs.com`)

## Getting started

Requires [Node.js](https://nodejs.org) for the SCSS compiler.

**Install dependencies**

```bash
npm install
```

**Compile SCSS once**

```bash
npm run build
```

**Watch for SCSS changes during development**

```bash
npm run watch
```

Then open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
```

> The project uses native ES modules (`type="module"`), so `index.html` must be served over HTTP — opening the file directly via `file://` will cause module import errors in most browsers.
