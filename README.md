# Nuha's Secret Store ♡

> *"everything you deserve — but unfortunately… ₹0"*

A dark, romantic, gothic birthday website for **Nuha** — built as a fake luxury store where everything is free because it can't be bought.

---

## Live Demo

Deploy to GitHub Pages → Settings → Pages → Deploy from branch `master` / root `/`

Your site will be live at:
```
https://<your-username>.github.io/<repository-name>/
```

---

## Project Structure

```
├── index.html              Main site (all sections)
├── style.css               Full stylesheet (CSS variables, animations, responsive)
├── script.js               Cart logic, product data, Spotify integration
├── assets/
│   └── images/
│       ├── moodboard_bg.jpg    Gothic moodboard background
│       └── card_texture.jpg    Product card texture overlay
└── README.md
```

---

## Customization Checklist

### 1. Your Personal Birthday Message
Open [`index.html`](index.html) and find:
```html
<!-- EDIT THIS: YOUR PERSONAL BIRTHDAY MESSAGE FOR NUHA -->
```
Replace `[YOUR PERSONAL BIRTHDAY MESSAGE HERE]` with your message.

### 2. Spotify Playlist
Open [`script.js`](script.js) and find:
```js
const spotifyPlaylistUrl = "PASTE SPOTIFY LINK HERE";
```
Replace with your Spotify playlist URL (e.g. `https://open.spotify.com/playlist/...`).

### 3. Color Theme
All colors are CSS variables at the top of [`style.css`](style.css):
```css
:root {
  --clr-void:     #090016;
  --clr-deep:     #28193D;
  --clr-mid:      #46315C;
  --clr-muted:    #69507B;
  --clr-soft:     #8D769A;
  /* ... */
}
```

### 4. Products
Edit the `products` array in [`script.js`](script.js) to change names, descriptions, or SKUs.

---

## Features

| Feature | Details |
|---|---|
| 🛒 Cart | Add/remove, quantity controls, localStorage persistence |
| ✓ Order flow | Place Order → animated confirmation → birthday section |
| 🎵 Playlist | One-click Spotify opener |
| 📱 Responsive | 320px → 1440px+ tested breakpoints |
| ♿ Accessible | Semantic HTML, ARIA labels, keyboard nav, focus states |
| ✦ Animations | Twinkle stars, heartbeat, vinyl spin, scroll reveal, hover glow |
| 🖤 No backend | Pure static HTML/CSS/JS — works on GitHub Pages |

---

## GitHub Pages Deployment

```bash
git add .
git commit -m "launch: Nuha's Secret Store ♡"
git push origin master
```

Then in your GitHub repo → **Settings** → **Pages** → Source: `Deploy from branch` → Branch: `master` → Folder: `/ (root)` → **Save**.

---

*Made with ❤️ · No refunds · Lifetime warranty*
