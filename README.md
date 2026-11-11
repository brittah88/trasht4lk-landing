# TRASHTALKSTUDiOZ — Landing Board

The landing page for **TRASHTALKSTUDiOZ** and the **TRASHTALK** creator coin on Zora / Base.
A toxic-neon poster board with pinned notes and stickers you can rearrange and rewrite right in the browser.

No framework, no build step — three files (`index.html`, `styles.css`, `script.js`) that run on any static host
(GitHub Pages, Vercel, Netlify).

## Preview locally

```bash
python3 -m http.server 8000
```

Visitor view: http://localhost:8000
Editor view: http://localhost:8000/?edit

## Add your links

Open `script.js` and fill in the `LINKS` block near the top:

```js
const LINKS = {
  zora: 'https://zora.co/@yourname',
  zoraCoin: 'https://zora.co/coin/...',
  x: 'https://x.com/yourname',
  ...
};
```

Any link left as `''` shows up dimmed with a "soon" tag instead of a dead link.

## Edit the board

1. Open the page with `?edit` on the end of the URL. The toolbar only appears for you — visitors never see it.
2. Click **Edit Mode**, then drag notes and stickers, or click into them to change the text.
   Use **+ Add Note** / **+ Add Sticker** for more. Your draft is saved in your browser as you go.
3. Click **Export Layout**. It downloads a `layout.json` file.
4. Upload `layout.json` to the repo, next to `index.html`. Every visitor now sees your layout.

**Reset** throws away your browser draft and goes back to the published layout.

> Edits only go live when `layout.json` is in the repo. Until then, visitors see the built-in default layout in `script.js`.

## License

MIT
