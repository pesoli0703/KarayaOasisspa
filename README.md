# KÁRÁYÁ OASIS SPA — landing page

A single-page, production-ready landing page for **Káráyá Oasis Spa**, 6A Ayo Jagun Street,
Lekki Phase 1, Lagos, Nigeria.

Built as a lightweight static site — plain HTML, CSS and vanilla JavaScript. No build step,
no framework, no backend. Open `index.html` or serve the folder.

## Run locally

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

## Deploying

Upload the repository root to any static host (Netlify, Vercel, Cloudflare Pages, cPanel,
GitHub Pages). The entry point is `index.html`; `robots.txt` and `sitemap.xml` are included.
Before going live, make sure the domain `karayaoasispa.com.ng` points at the host — the
canonical URL, Open Graph tags and structured data all reference it.

## Structure

```
index.html                 the whole landing page (all sections, real prices)
robots.txt · sitemap.xml   search engine files
assets/css/styles.css      design system + all styles
assets/js/main.js          navigation, menu tabs, lightbox, WhatsApp links, reviews
assets/img/brand/          official logo, transparent variants, favicons
assets/img/photos/         optimised page photography (WebP + JPEG)
assets/img/source/         original generated photography (not referenced by the page)
```

## What is real vs. what needs editing

**Prices, treatments and packages** are transcribed exactly from the spa's supplied price
lists. Nothing was invented. Durations are shown only where the spa supplied them
(the body scrubs are listed at 30 minutes; other durations are omitted rather than guessed).

**Photography** is AI-generated and used as illustrative imagery — the gallery states this
explicitly. Replace the files in `assets/img/photos/` with real photographs of the spa when
they are available, keeping the same file names and aspect ratios.

**Placeholders to confirm before launch** (marked in the page source with comments or a
small ✳ note in the FAQ):

- Opening hours — FAQ “What are your opening hours?”
- Payment methods — FAQ “Which payment methods do you accept?”
- Deposit policy — FAQ “Do I need to pay a deposit?”
- Cancellation window — FAQ “Can I reschedule or cancel?”
- Guest reviews — the testimonials section intentionally shows an empty state

## Editing prices or treatments

Each price appears once in `index.html`. Open it, search for the treatment name and edit the
`<span class="menu-item__price">` text, e.g. `₦60,000`. If you change a treatment name, also
update the `data-wa-treatment` attribute on its “Reserve” link so the WhatsApp message quotes
the new name — the page rebuilds every WhatsApp link from that attribute.

## WhatsApp booking

All booking buttons open `https://wa.me/2348103858549` with a pre-filled message:

- General: “Hello KÁRÁYÁ OASIS SPA. I would like to enquire about booking a spa experience.”
- Treatment: “Hello KÁRÁYÁ OASIS SPA. I would like to make an appointment for [Treatment]. Please provide available dates and times.”

The links are pre-filled in the HTML (so they work with JavaScript disabled) and are rebuilt
by `main.js` from each button's `data-wa-*` attribute.

## Adding verified guest reviews

In `assets/js/main.js`, find `var TESTIMONIALS = [];` and add entries:

```js
var TESTIMONIALS = [
  { quote: "The massage was exceptional…", name: "Adaeze O.", rating: 5 }
];
```

Only add reviews that real guests have given and agreed to publish. When at least one entry
exists, the empty-state panel is hidden and the review cards render automatically.

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus states, ARIA on tabs, accordion and lightbox.
- `prefers-reduced-motion` respected (animations disabled, content shown immediately).
- Progressive enhancement: without JavaScript the full menu, prices and WhatsApp links still work.
- Hero image preloaded; all other imagery lazy-loaded; WebP with JPEG fallback and `srcset`.
- System-independent fonts loaded from Google Fonts with serif/sans fallbacks.
