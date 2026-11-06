# Sai Metal And Tube — Website

Single-page website for Sai Metal And Tube, a stainless steel pipe manufacturer in Ahmedabad, Gujarat.
Plain HTML, CSS and JavaScript. **No build step and no framework.** Open it, edit it, deploy it.

---

## 1. Run it on your computer

You need a local web server (opening `index.html` by double-click works too, but a server is closer to the live site).

```bash
# Option A: Node.js installed
npm run dev            # opens on http://localhost:5173

# Option B: Python installed
python -m http.server 5173
```

An internet connection is required: the 3D, animation and font libraries load from public CDNs (see section 5).

## 2. Deploy to Vercel (your current host)

1. Create a GitHub repository and upload every file in this folder (keep the folder structure).
2. In Vercel: **Add New → Project → Import** that repository.
3. Framework preset: **Other**. Build command: *(leave empty)*. Output directory: *(leave empty / root)*.
4. Deploy. `vercel.json` applies the security headers automatically.

If you use a custom domain, replace `https://sai-metal-and-tube-three.vercel.app/` in `index.html` (canonical, og:url, og:image, JSON-LD), `robots.txt` and `sitemap.xml`.

## 3. Files

```
index.html                 Page markup: every section, dialog and drawer
assets/css/styles.css      All styling: tokens, layout, dark + light themes, responsive rules
assets/js/theme-init.js    Applies saved light/dark theme before first paint (no flash)
assets/js/main.js          All behaviour: data, catalogue, calculator, payments, currency, 3D, background, cursor, scroll
assets/img/favicon.svg     Logo mark used as the browser icon
assets/img/og-image.png    1200×630 preview shown when the link is shared (WhatsApp, LinkedIn…)
vercel.json                Security headers (CSP, HSTS, X-Frame-Options…) and caching
robots.txt, sitemap.xml    Search engines
package.json               Only a local "dev" script; there are no dependencies to install
```

## 4. What to edit (all near the top of `assets/js/main.js`)

| What | Where | Notes |
|---|---|---|
| Phone, WhatsApp, email | `const CONTACT` | WhatsApp in international format without `+`, e.g. `919800000000`. Adds a "Send on WhatsApp" button to the requirement list automatically. |
| Bank details (India + SWIFT) | `PAY_DETAILS.bank` | Empty fields show a lock and "With your quote". Filled fields appear with Copy buttons. |
| Name on cheques/account | `PAY_DETAILS.payee` | Confirm the exact registered name. |
| Online methods & status | `PAY_DETAILS.online` | `status`: `available`, `soon` or `request`. |
| Payment cards | `const PAYMENT` | Updates the Payment section, company plate and Enquire step together. |
| Exchange rates | `CURRENCIES` and `FX_DATE` | Static reference rates (₹ per 1 unit). Update periodically. |
| Products and prices | `const P` | `[name, category, 3D shape, size label, price in ₹ or null, 'kg' or 'piece']` |
| Profile story text | `const PROFILES` | Text shown in the pinned "Profiles" section. |
| Grade use-cases | `const USES` | Buttons in the Grades section. |

Prices and dates that appear in the HTML (trust bar, Grades) use `data-inr` attributes and convert automatically; the "Rates updated 10 Oct 2026" text is in `index.html`.

## 5. Libraries (exact versions — do not upgrade blindly)

| Library | Version | Used for |
|---|---|---|
| Three.js | 0.158.0 (UMD build) | 3D pipes, forming/welding scene, product renders |
| GSAP + ScrollTrigger | 3.12.5 | Text reveals, counters, scroll-scrubbed route, magnetic buttons |
| Lenis | 1.1.13 | Smooth wheel scrolling (touch stays native) |
| Google Fonts | — | Archivo (variable, width 62–125), Playfair Display italic, JetBrains Mono |

They load from `cdn.jsdelivr.net` and `cdnjs.cloudflare.com`. To self-host instead, download the same files into `assets/vendor/`, update the four `<script src>` lines at the bottom of `index.html`, and remove the CDN hosts from the CSP in `vercel.json`.

## 6. Security notes

* `vercel.json` sends a strict Content-Security-Policy: scripts only from this site and the two CDNs; no framing; no plugins.
* Data saved in the visitor's browser (requirement list, theme, currency) is validated and escaped when read back.
* All external links use `rel="noopener noreferrer"`.
* The page has no server, forms that post data, or database. Enquiries go through IndiaMART (and WhatsApp once configured).
* The old site's `/api/reviews` endpoint published reviews without moderation. It is not part of this project.

## 7. Browser support

Latest Chrome, Edge, Safari and Firefox on desktop and mobile. Without WebGL the page still works with a static background. `prefers-reduced-motion` turns off animation. The circular theme reveal uses the View Transitions API where available and falls back to an instant switch.
