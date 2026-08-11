# ⚡ TechVault — Big & Powerful E‑commerce Store

A full-featured, dependency‑free **static** e‑commerce storefront for tech/electronics.
Built with vanilla HTML, CSS and JavaScript (no frameworks, no build step, no backend) —
it runs by simply opening `index.html`, and persists everything to the browser's `localStorage`.

## ✨ Features

**Catalog & browsing**
- Product grid with cards, ratings, badges, sale discounts and "quick add"
- Product detail pages with full descriptions, spec tables and quantity picker
- 9 categories, category landing tiles, and a Featured/Deals section
- Powerful shop page: **search, filters** (category, brand, max price, min rating, in‑stock) **and sorting**
- Live header search with autocomplete dropdown

**Shopping**
- Slide‑in cart drawer with quantity controls and remove
- Dedicated cart page with order summary
- **Promo codes** (`VAULT10`, `WELCOME15`, `SHIPFREE`, `TECH25`) and a persistent promo bar
- Wishlist with heart toggles and a wishlist page

**Checkout & orders**
- Full checkout form with validation (contact, shipping, payment)
- Order confirmation screen, customer "My Orders" list
- Order status pills (Processing → Shipped → Delivered / Cancelled)

**Admin portal** (`admin` / `admin123`)
- Login‑protected dashboard with stats (products, orders, revenue, units sold)
- **Product management**: edit base products, add new products, delete custom ones
- **Order management**: change order status directly from the table

**Polish**
- Fully responsive (mobile menu, adaptive grids)
- Toast notifications, empty states, breadcrumbs
- Custom product photography and a branded hero

## 🗂 Project structure

```
index.html          App shell (header, nav, drawer, footer)
css/styles.css      Design system & responsive styles
js/data.js          Product catalog, categories, promo definitions
js/store.js         State + localStorage persistence (cart, wishlist, orders, admin)
js/app.js           Router, rendering, and all UI logic
img/products/       Product images
img/hero/           Hero background
```

## 🧪 Tests

A headless smoke test (`/tmp` during development, not shipped) verifies routing,
filtering, search, cart, promo, checkout, orders and the admin flows against jsdom.

## ▶️ Run

```bash
# Any static server works:
python3 -m http.server 8080 --bind 0.0.0.0
# then open http://localhost:8080
```

No real transactions occur — this is a demo storefront.

---
© 2026 TechVault. A demo e‑commerce store.
