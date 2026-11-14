# Goldenrod Apiary 🍯

![Frontend Only](https://img.shields.io/badge/Architecture-Frontend%20Only-f0a818?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-2b1a0c?style=flat-square)

> Small-batch raw honey, strained once and jarred the week it is harvested from hives we know by name.

A modern, high-performance static webpage UI for **Goldenrod Apiary**, an artisanal boutique honey brand. Features a bespoke typographic design system, dynamic honey-drip SVG visual filters, and a shopping cart experience with local storage persistence.

---

## 🚀 Quick Start / How to Run

This project is built with **zero dependencies** (pure Vanilla HTML5, CSS3, and modern ES6 JavaScript). There are **no build steps, no compilers, and no `npm install` needed**—it runs immediately out of the box!

### Method 1: Local HTTP Server with Python (Recommended)
Running through a local web server ensures all SVG matrix filters, web fonts, and assets load smoothly without local file CORS restrictions:

```bash
# 1. Open your terminal in this project folder
cd /path/to/HoneyBrand

# 2. Start a local server (Python 3)
python3 -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### Method 2: VS Code Live Server Extension
1. Open this folder in **VS Code**.
2. Install the **Live Server** extension (`ritwickdey.liveserver`) if not already installed.
3. Right-click [`index.html`](file:///Users/adi/HoneyBrand/index.html) in the file explorer and select **"Open with Live Server"**.
4. The page will open automatically at `http://127.0.0.1:5500`.

---

### Method 3: Instant Browser Open (Direct File)
You can directly open the file in your default browser:

- **macOS:**
  ```bash
  open index.html
  ```
- **Windows:**
  ```bash
  start index.html
  ```
- **Linux:**
  ```bash
  xdg-open index.html
  ```
*Or simply double-click `index.html` in Finder / File Explorer.*

---

### Method 4: Node.js `npx serve`
If you have Node.js installed:
```bash
npx serve .
```

---

## 📁 Project Structure

```text
HoneyBrand/
├── index.html           # Main semantic HTML5 markup & SVG filter definitions
├── css/
│   └── style.css        # Clean, modular stylesheet & design tokens
├── js/
│   └── main.js          # Interactive cart, mobile navigation, toast alerts, & modal
├── assets/
│   ├── favicon.svg          # Goldenrod honeycomb brand icon
│   ├── og-image.svg         # 1200x630 vector graphic for social media sharing
│   └── marketing-banner.jpg # High-res editorial commercial marketing showcase banner
├── manifest.json        # Web App Manifest for progressive browser support
├── robots.txt           # Search crawler directives
├── sitemap.xml          # XML sitemap for SEO discovery
└── README.md            # Comprehensive project documentation
```

---

## 🎨 Design System & Color Palette

The interface is inspired by raw unfiltered wildflower honey, beeswax, and natural meadow flora:

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--honey` | `#F0A818` | Primary brand accent & hero background |
| `--amber` | `#C97A06` | Deep golden hue for accents & gradients |
| `--ink` | `#2B1A0C` | Deep bee-black for text, headings, and primary buttons |
| `--wax` | `#FFF1C2` | Warm parchment beeswax tone for surfaces & cards |
| `--meadow` | `#1F3320` | Rich botanical green for footer |
| `--leaf` | `#8FB070` | Subtle herbal tint for inputs and borders |

### Typography
- **Headings & Accents:** `Bricolage Grotesque` (Google Fonts)
- **Body & Longform:** `Newsreader` (Google Fonts)

---

## ✨ Features

- **Interactive Shopping Cart:**
  - Slide-out drawer with backdrop blur.
  - Add to Cart with live quantity badge counter bounce animation.
  - Increment, decrement, and item removal controls.
  - Subtotal and automatic tax / shipping calculation.
  - Dynamic **Free Shipping Meter** with real-time progress bar (Free shipping over ₹1,000).
  - `localStorage` persistence across page reloads.
- **Micro-Interactions & Feedback:**
  - Instant button feedback with green checkmark state.
  - Non-intrusive floating toast notifications for user actions.
  - Animated checkout confirmation modal.
- **Visuals & 3D Interactive Honey Jar:**
  - True 3D perspective stage with dynamic multi-axis transformations (`translate3d`, `rotateX`, `rotateY`, `rotateZ`, `scale3d`).
  - **Scroll-Progress Position Locking**: The honey jar pops forward and upward continuously with scroll progress. Leaving scrolling midway keeps the jar held at that exact 3D popped position without snapping back.
  - Reversing scroll pops the jar smoothly back down to its resting baseline at the top of the page.
  - Dynamic 3D contact shadow that shrinks, diffuses, and shifts opacity with elevation.
  - Interactive mouse parallax tilt across the hero section.
  - Click / tap "boing" pop impulse with haptic-style reaction.
  - Custom SVG goo matrix filter (`#goo`) rendering real-time organic honey drip flow.
- **Fully Responsive & Accessible:**
  - Mobile hamburger menu drawer with smooth toggle animations.
  - Semantic HTML5 structure with complete ARIA labels (`aria-expanded`, `aria-label`, `aria-modal`).
  - Native support for `prefers-reduced-motion`.
  - Accessible keyboard navigation (`Esc` to dismiss modals and cart drawer).
- **SEO & Social Ready:**
  - Open Graph and Twitter Card tags.
  - Favicon and Web App Manifest configured.
  - `robots.txt` and `sitemap.xml` included.

---

## 🐝 Honey Harvests Catalog

1. **Wildflower (₹449, 340 g)** – Golden and floral, with a mild citrus finish.
2. **Acacia (₹529, 340 g)** – Pale and clear, light on the tongue, and slow to set.
3. **Forest (₹599, 340 g)** – Dark and malty, with a long, savory finish.

