# Vault Blueprints Website

A mobile-first static storefront and product-preview website for Vault Blueprints.

## Project structure

- `index.html` — homepage, product cards, search, category filters, FAQs, and contact link.
- `product.css` — shared responsive styles, product-page layouts, and accessibility states.
- `products/index.html` — directory of product-preview pages.
- `products/<product-slug>/index.html` — individual product information pages.
- `sitemap.xml` — public URL discovery for search engines.
- `robots.txt` — crawler access instructions.
- `404.html` — branded not-found page (supported by common static hosts).

## Product pages

1. AI Freelance Work Manager — `/products/ai-freelance-work-manager/`
2. AI-Powered PDF Income Blueprint — `/products/ai-powered-pdf-income-blueprint/`
3. Job Search Command Center — `/products/job-search-command-center/`
4. Money Control Blueprint — `/products/money-control-blueprint/`
5. Overseas Husband Distance Trap — `/products/overseas-husband-distance-trap/`
6. Silent Wife Trap — `/products/silent-wife-trap/`
7. The Fireside Wife — `/products/the-fireside-wife/`
8. When Your Child Stops Talking — `/products/when-your-child-stops-talking/`

## Preview locally

The site has no build step or package installation requirement. From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Test the homepage, each product page, search/filter controls, mobile navigation, and the 404 route using your static host's preview or a deliberately invalid URL.

## Deployment notes

This is a static HTML/CSS/JavaScript project. It can be deployed as a static site from the repository root on a compatible host such as Vercel. No framework preset or build command is needed; use the repository root as the output directory if the host requests one.

After deployment:
- Confirm the homepage and all eight product URLs load over HTTPS.
- Confirm `/sitemap.xml`, `/robots.txt`, and the host's 404 handling.
- Add the verified production property to Google Search Console and submit the sitemap.
- Test the site on a narrow phone viewport and a desktop viewport.

## Store readiness

The current pages are product previews, not a completed digital-commerce flow. Product prices, checkout destinations, payment confirmation, and secure file delivery must be added only after the chosen provider's product and delivery details are verified. Do not present a preview page as a completed purchase flow.

Before enabling sales, test a complete purchase using the chosen provider's supported test process, confirm the buyer receives the correct file, and publish clear support, refund, and privacy information appropriate to the actual business setup.

## Maintenance

- Keep product slugs consistent across homepage links, preview catalogue, and `sitemap.xml`.
- When adding or removing a public page, update the sitemap.
- Keep real downloadable files and private credentials out of the public repository.
- Review all product claims and page copy before launch.
