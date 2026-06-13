# Lucknow Taxi & Rental — Static Website

A production-ready, SEO-optimized, fully responsive taxi business website built with
**HTML5 + CSS3 + Bootstrap 5 + Vanilla JavaScript + Google Places API**.
No React, no backend, no database, no payment gateway. Inquiries go straight to your
**mobile** via WhatsApp (and optionally email).

---

## 1. Folder Structure

```
LucknowTaxi/
├── index.html              ← Home (hero + booking inquiry form)
├── about.html              ← About Us
├── fleet.html              ← Fleet (Sedan / SUV / Innova / Traveller)
├── services.html           ← Services
├── routes.html             ← Routes listing (links to route pages)
├── contact.html            ← Contact form + Google Map
├── 404.html                ← Not-found page
├── sitemap.xml             ← SEO sitemap
├── robots.txt              ← Crawler rules
├── README.md               ← This file
├── assets/
│   ├── css/style.css       ← All site styles (theme colours here)
│   ├── js/main.js          ← Form → WhatsApp/Email, nav, helpers
│   ├── js/places.js        ← Google Places autocomplete
│   └── images/             ← SVG car illustrations, hero, favicon
└── route-template/
    ├── _route-template.html      ← REUSABLE template ({{TOKENS}} to replace)
    ├── lucknow-to-kanpur.html    ← Example route page (full)
    ├── lucknow-to-ayodhya.html   ← Example route page (full)
    └── lucknow-to-prayagraj.html ← Example route page (full)
```

---

## 2. Page Wireframe (Home)

```
┌─────────────────────────────────────────────┐
│ Topbar: 24x7 · Phone · Email                 │
│ Sticky Navbar: Logo | Menu | Call WA GetFare │
├─────────────────────────────────────────────┤
│ HERO  (left: headline + badges + CTAs)       │
│       (right: BOOKING INQUIRY FORM)          │
├─────────────────────────────────────────────┤
│ Trust strip (12+ yrs · 50+ cars · rides)     │
│ Services (6 cards)                           │
│ Why Choose Us (6 cards)                      │
│ Fleet preview (4 cards)                      │
│ Popular Routes (6 cards → route pages)       │
│ How it works (3 steps)                       │
│ Testimonials (3) · FAQ (accordion)           │
│ CTA banner                                   │
│ Footer (links + contact + social)            │
├─────────────────────────────────────────────┤
│ Floating WhatsApp + Call  (all screens)      │
│ Mobile bottom bar: Call | WhatsApp | GetFare │
└─────────────────────────────────────────────┘
```

---

## 3. ⭐ Get INSTANT Inquiries on Your Mobile

When a visitor submits the form, you can receive the lead in several ways.
**Option 1 (WhatsApp) is already wired up and active** — it's the fastest way to get
the lead directly in your pocket.

### Option 1 — WhatsApp (ACTIVE by default) ✅
On submit, the site builds a prefilled message and opens
`https://wa.me/916392000833?text=...`. The customer taps send, and the inquiry
lands in **your WhatsApp** instantly. Example message:

```
🚕 New Taxi Inquiry — Lucknow Taxi & Rental
📍 Pickup: Lucknow
🎯 Drop: Kanpur
📅 Date: 2026-06-20
⏰ Time: 10:00
🛣️ Trip Type: One Way
🚗 Vehicle: Sedan
👤 Name: Rahul
📞 Mobile: 9876543210
```
Nothing to configure — just keep `BIZ.phone` correct in `assets/js/main.js`.

### Option 2 — Email via FormSubmit (no signup) 📧
Free, no account. The lead arrives in your inbox → enable Gmail/Outlook **push
notifications** on your phone for instant alerts. To use it, replace the form's
default JS submit with a normal POST form:

```html
<form action="https://formsubmit.co/info@lucknowtaxi.com" method="POST" class="booking-form-email">
  <input type="hidden" name="_subject" value="New Taxi Inquiry - Lucknow Taxi">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_captcha" value="false">
  <!-- ...your pickup/drop/date/etc inputs with name="" ... -->
  <button type="submit">Get Best Fare</button>
</form>
```
First submission triggers a one-time email to confirm your address.

### Option 3 — Web3Forms (recommended for email + works with current JS) 🔑
Already supported in `main.js`. Get a free access key at **web3forms.com**, then paste
it into `assets/js/main.js`:

```js
const BIZ = { ... web3formsKey: 'YOUR-WEB3FORMS-ACCESS-KEY', ... };
```
Now every form submit **also** sends the lead to your email (in addition to WhatsApp).
Web3Forms can be connected to **Slack / Telegram / Zapier** for push alerts too.

### Option 4 — Google Forms 📝
Create a Google Form, get its `formResponse` POST URL and the `entry.xxx` field IDs,
then submit silently. Responses collect in a Google Sheet (install the Google Forms /
Sheets app for mobile notifications). Pattern:

```js
fetch('https://docs.google.com/forms/d/e/FORM_ID/formResponse', {
  method: 'POST', mode: 'no-cors',
  body: new URLSearchParams({ 'entry.111': data.pickup, 'entry.222': data.drop /* ... */ })
});
```

> **Best combo:** keep **WhatsApp (Option 1)** as primary + add **Web3Forms (Option 3)**
> key so you have an email backup of every lead. Both already work together in `main.js`.

---

## 4. Google Places API (Pickup & Drop Autocomplete)

1. Go to <https://console.cloud.google.com/> → create a project.
2. Enable **Maps JavaScript API** and **Places API**.
3. Create an **API key** → under *Application restrictions* choose **HTTP referrers**
   and add `https://lucknowtaxi.com/*` (and each route subdomain).
4. In `index.html` and `contact.html`, replace `YOUR_GOOGLE_MAPS_API_KEY` in:
   ```html
   <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&loading=async&callback=initAutocomplete"></script>
   ```
5. Any input with class `places-autocomplete` gets India-restricted, Lucknow-biased
   suggestions (see `assets/js/places.js`).

> **Graceful fallback:** if the key is missing or the quota is exceeded, the pickup/drop
> fields still work as plain text inputs — the form never breaks.

> **Billing note:** Places Autocomplete requires a billing account, but Google gives a
> recurring free monthly credit that covers low-traffic small-business sites.

---

## 5. Creating 50+ Route Pages

1. Copy `route-template/_route-template.html` → `lucknow-to-<city>.html`.
2. Find-and-replace the `{{TOKENS}}` (full list is in the comment at the top of that file):
   `{{CITY}}`, `{{SLUG}}`, `{{DISTANCE}}`, `{{TIME}}`, `{{HIGHWAY}}`,
   `{{FARE_SEDAN}}`, `{{FARE_SUV}}`, `{{FARE_INNOVA}}`, `{{FARE_TT}}`,
   `{{ATTR_1..4}}`, `{{ATTR_DESC_1..4}}`, `{{INTRO_PARA}}`.
3. Write **unique** intro content/FAQs for each city (Google penalises duplicate pages).
4. Add the page to `sitemap.xml`.
5. Link it from `routes.html`.

Two ways to publish route pages:
- **Subfolder (simplest):** keep them in `/route-template/` and link as-is. URLs look
  like `lucknowtaxi.com/route-template/lucknow-to-kanpur.html`.
- **Subdomain (your SEO plan):** create `lucknow-to-kanpur.lucknowtaxi.com` and upload
  the page as that subdomain's `index.html`. The canonical tags in the templates already
  point to the subdomain form — see Deployment §7.

---

## 6. SEO Strategy (already built in)

- ✅ Unique **SEO title + meta description** per page (keyword-rich).
- ✅ **Open Graph** + **Twitter** cards for social sharing.
- ✅ **Canonical** URLs on every page.
- ✅ **Schema markup:** TaxiService/LocalBusiness, FAQPage, BreadcrumbList, Service,
  per-route TaxiService + Offer.
- ✅ Proper **H1→H6** hierarchy (one H1 per page).
- ✅ **sitemap.xml** + **robots.txt**.
- ✅ **Core Web Vitals:** preconnect to fonts/CDN, `loading="lazy"` + width/height on
  images (no layout shift), lightweight SVG illustrations, system font fallback.
- ✅ Mobile-first responsive layout.

**After deploy:**
1. Verify the domain in **Google Search Console** + submit `sitemap.xml`.
2. Create a **Google Business Profile** (Maps) for "Lucknow Taxi & Rental".
3. Validate structured data at <https://search.google.com/test/rich-results>.
4. Target one primary keyword per route page (e.g. *"Lucknow to Kanpur taxi"*).
5. Build local citations (Justdial, Sulekha, IndiaMART) with the same NAP
   (Name, Address, Phone).

---

## 7. Deployment — Hostinger / cPanel

### A. Main site (lucknowtaxi.com)
1. Log in to **hPanel/cPanel** → **File Manager**.
2. Open `public_html/`.
3. Upload **all** files/folders from `LucknowTaxi/` (you can zip the folder, upload the
   zip, then **Extract** inside `public_html`). Make sure `index.html` sits directly in
   `public_html/`, not in a subfolder.
4. Visit `https://lucknowtaxi.com` — done.
5. Enable **free SSL** (hPanel → SSL) so the site loads on `https://`.
6. Force HTTPS + set the 404 page by creating `public_html/.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ErrorDocument 404 /404.html
   ```

### B. Route subdomains (lucknow-to-kanpur.lucknowtaxi.com)
1. hPanel → **Subdomains** → create `lucknow-to-kanpur` (root auto-creates a folder,
   e.g. `public_html/lucknow-to-kanpur/`).
2. Upload `lucknow-to-kanpur.html` there **renamed to `index.html`**.
3. Because the page uses `../assets/...` paths, either:
   - upload a copy of the `assets/` folder into the subdomain root, **or**
   - edit the subdomain page's asset paths to the absolute
     `https://lucknowtaxi.com/assets/...` (recommended — single source, better caching).
4. Repeat per route. (Tip: keep one `assets/` on the main domain and use absolute URLs
   in every subdomain page so you only maintain CSS/JS in one place.)

### C. Quick local preview
Open `index.html` directly in a browser, or run a tiny static server:
```bash
# from the LucknowTaxi folder
python -m http.server 8080      # then open http://localhost:8080
```

---

## 8. Customisation Cheat-Sheet

| Want to change… | Edit |
|---|---|
| Phone / WhatsApp / Email | `assets/js/main.js` (`BIZ`) **and** the `tel:`/`wa.me`/`mailto:` links in each HTML |
| Brand colours | `assets/css/style.css` → `:root` variables (`--primary`, `--secondary`) |
| Fares / vehicles | `fleet.html` and the route pages |
| Add a route | Copy `_route-template.html`, replace tokens, add to `sitemap.xml` + `routes.html` |
| Real car photos | Drop JPG/WEBP into `assets/images/` and swap the `<img src>` |
| Map location | `contact.html` → the Google Maps `<iframe>` `q=` value |

---

## 9. Replace These Before Going Live

- [ ] `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` + `contact.html`
- [ ] (Optional) `web3formsKey` in `assets/js/main.js` for email backup
- [ ] Real vehicle photos + a proper `assets/images/og-image.jpg` (1200×630)
- [ ] Confirm phone **+91-6392000833** everywhere is correct
- [ ] Social profile links in the footer
- [ ] Office address + map pin on `contact.html`

---

**Built for:** Lucknow Taxi & Rental · +91-6392000833 · info@lucknowtaxi.com · Open 24x7
