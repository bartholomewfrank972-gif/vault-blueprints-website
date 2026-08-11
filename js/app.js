/* ============================================================
   TechVault — Application shell: routing, rendering, UI.
   A dependency-free vanilla-JS SPA using hash routing.
   ============================================================ */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const app = $('#app');

  const money = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ratingStars = r => {
    const full = Math.floor(r), half = r - full >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(5 - full - half);
  };

  /* ---------- Toasts ---------- */
  const toasts = $('#toasts');
  const toast = (msg, type = 'success') => {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    toasts.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3200);
  };

  /* ---------- Header / badges ---------- */
  const refreshBadges = () => {
    const wc = Store.wishlist().length, cc = Store.cartCount();
    const wb = $('[data-badge="wishlist"]'), cb = $('[data-badge="cart"]');
    if (wb) { wb.hidden = wc === 0; wb.textContent = wc; }
    if (cb) { cb.hidden = cc === 0; cb.textContent = cc; }
  };

  /* ---------- Search ---------- */
  const searchInput = $('#searchInput'), resultsBox = $('#searchResults');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) { resultsBox.hidden = true; return; }
    const hits = Store.products().filter(p => (p.name + ' ' + p.brand + ' ' + p.category + ' ' + p.tags.join(' ')).toLowerCase().includes(q)).slice(0, 6);
    resultsBox.hidden = hits.length === 0;
    resultsBox.innerHTML = hits.map(p => `
      <a class="sr-item" href="#/product/${p.id}" data-nav>
        <img src="${p.img}" alt="">
        <span><b>${p.name}</b><small>${p.brand} · ${money(p.price)}</small></span>
      </a>`).join('') || '<div class="sr-empty">No matches for “' + q + '”</div>';
  });
  document.addEventListener('click', e => { if (!e.target.closest('.header-search')) resultsBox.hidden = true; });

  /* ---------- Product card ---------- */
  const productCard = p => {
    const wished = Store.isWished(p.id);
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `
      <article class="card" data-product="${p.id}">
        <div class="card-media">
          <a href="#/product/${p.id}" data-nav>
            <img src="${p.img}" alt="${p.name}" loading="lazy">
          </a>
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          ${discount ? `<span class="badge discount">-${discount}%</span>` : ''}
          <button class="wish-btn ${wished ? 'on' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist">
            ${wished ? '♥' : '♡'}
          </button>
          <button class="quick-add" data-add="${p.id}" data-qty="1">+ Quick Add</button>
        </div>
        <div class="card-body">
          <div class="card-cat">${p.brand}</div>
          <h3 class="card-title"><a href="#/product/${p.id}" data-nav>${p.name}</a></h3>
          <div class="card-rate"><span class="stars">${ratingStars(p.rating)}</span> ${p.rating} (${p.reviews})</div>
          <div class="card-price">
            <span class="price">${money(p.price)}</span>
            ${p.oldPrice ? `<s class="old">${money(p.oldPrice)}</s>` : ''}
          </div>
        </div>
      </article>`;
  };

  /* ---------- Hero ---------- */
  const heroView = () => `
    <section class="hero">
      <div class="hero-bg" style="background-image:url('img/hero/hero.jpg')"></div>
      <div class="container hero-inner">
        <span class="hero-eyebrow">⚡ New season · New tech</span>
        <h1 class="hero-title">Big &amp; <em>Powerful</em> Tech,<br>One Vault.</h1>
        <p class="hero-sub">Thousands of products. Unbeatable deals. Free shipping over ${money(FREE_SHIPPING_THRESHOLD)}.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#/shop" data-nav>Shop now</a>
          <a class="btn btn-ghost" href="#/shop?cat=deals" data-nav>View deals</a>
        </div>
        <div class="hero-stats">
          <div><b>12k+</b><span>Products</span></div>
          <div><b>150k</b><span>Customers</span></div>
          <div><b>4.8★</b><span>Avg rating</span></div>
        </div>
      </div>
    </section>`;

  /* ---------- Home ---------- */
  const homeView = () => {
    const featured = Store.products().filter(p => p.featured).slice(0, 8);
    const deals = Store.products().filter(p => p.oldPrice).slice(0, 4);
    const cats = CATEGORIES.map(c => {
      const img = { audio:'headphones', wearables:'smartwatch', laptops:'laptop', phones:'phone', cameras:'camera', accessories:'keyboard', monitors:'monitor', drones:'drone', gaming:'console' }[c.id];
      return `<a class="cat-tile" href="#/shop?cat=${c.id}" data-nav>
        <img src="img/products/${img}.jpg" alt="${c.name}"><span>${c.name}</span></a>`;
    }).join('');
    return `
      ${heroView()}
      <section class="container section">
        <div class="cat-grid">${cats}</div>
      </section>
      <section class="container section">
        <div class="section-head">
          <h2>Featured Picks</h2><a class="btn btn-ghost btn-sm" href="#/shop?cat=featured" data-nav>See all →</a>
        </div>
        <div class="grid">${featured.map(productCard).join('')}</div>
      </section>
      <section class="deals-band">
        <div class="container deals-inner">
          <div><h2>Deals of the week</h2><p>Limited-time savings on top tech.</p></div>
          <a class="btn btn-light" href="#/shop?cat=deals" data-nav>Shop deals →</a>
        </div>
      </section>
      <section class="container section">
        <div class="grid">${deals.map(productCard).join('')}</div>
      </section>
      <section class="container perks">
        <div class="perk"><span>🚚</span><div><b>Fast, free shipping</b><small>On orders over ${money(FREE_SHIPPING_THRESHOLD)}</small></div></div>
        <div class="perk"><span>↩️</span><div><b>30-day returns</b><small>No-hassle guarantee</small></div></div>
        <div class="perk"><span>🔒</span><div><b>Secure checkout</b><small>Encrypted &amp; safe</small></div></div>
        <div class="perk"><span>💬</span><div><b>24/7 support</b><small>Real humans, always</small></div></div>
      </section>`;
  };

  /* ---------- Shop ---------- */
  const shopState = { q: '', cat: '', brand: '', maxPrice: 0, minRating: 0, sort: 'featured', page: 1, inStock: false };
  const shopView = (params) => {
    const brands = [...new Set(Store.products().map(p => p.brand))];
    const maxP = Math.max(...Store.products().map(p => p.price));
    return `
      <section class="container shop">
        <aside class="shop-filters" id="filters">
          <h3>Filters</h3>
          <button class="btn btn-ghost btn-sm" id="clearFilters">Reset all</button>
          <div class="f-group"><label>Category</label>
            <select id="fCat">
              <option value="">All categories</option>
              ${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select></div>
          <div class="f-group"><label>Brand</label>
            <select id="fBrand">
              <option value="">All brands</option>
              ${brands.map(b => `<option>${b}</option>`).join('')}
            </select></div>
          <div class="f-group"><label>Max price: <b id="priceLabel">${money(maxP)}</b></label>
            <input type="range" id="fPrice" min="0" max="${maxP}" step="10" value="${maxP}"></div>
          <div class="f-group"><label>Min rating</label>
            <select id="fRating">
              <option value="0">Any</option>
              <option value="4.5">4.5★ &amp; up</option>
              <option value="4.0">4.0★ &amp; up</option>
              <option value="3.5">3.5★ &amp; up</option>
            </select></div>
          <label class="f-check"><input type="checkbox" id="fStock"> In stock only</label>
        </aside>
        <div class="shop-main">
          <div class="shop-toolbar">
            <h2 id="shopTitle">All Products</h2>
            <div class="toolbar-right">
              <span class="result-count" id="resultCount"></span>
              <select id="sortSelect">
                <option value="featured">Sort: Featured</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
                <option value="rating">Top rated</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
          <div class="grid" id="shopGrid"></div>
          <div class="pager" id="pager"></div>
        </div>
      </section>`;
  };

  const applyFilters = (params = {}) => {
    Object.assign(shopState, { q:'', cat:'', brand:'', maxPrice:0, minRating:0, sort:'featured', page:1, inStock:false });
    shopState.cat = params.cat || '';
    shopState.q = params.q || '';
  };

  const renderShop = () => {
    const $grid = $('#shopGrid'), $count = $('#resultCount'), $pager = $('#pager'), $title = $('#shopTitle');
    if (!$grid) return;
    let list = Store.products().filter(p => {
      if (shopState.cat && shopState.cat !== 'featured' && shopState.cat !== 'deals' && p.category !== shopState.cat) return false;
      if (shopState.cat === 'featured' && !p.featured) return false;
      if (shopState.cat === 'deals' && !p.oldPrice) return false;
      if (shopState.brand && p.brand !== shopState.brand) return false;
      if (shopState.maxPrice && p.price > shopState.maxPrice) return false;
      if (shopState.minRating && p.rating < shopState.minRating) return false;
      if (shopState.inStock && !p.inStock) return false;
      if (shopState.q && !(p.name + ' ' + p.brand + ' ' + p.category + ' ' + p.tags.join(' ')).toLowerCase().includes(shopState.q.toLowerCase())) return false;
      return true;
    });
    const sortMap = {
      featured: (a,b) => (b.featured - a.featured) || (b.rating - a.rating),
      priceAsc: (a,b) => a.price - b.price,
      priceDesc: (a,b) => b.price - a.price,
      rating: (a,b) => b.rating - a.rating,
      name: (a,b) => a.name.localeCompare(b.name),
    };
    list.sort(sortMap[shopState.sort] || sortMap.featured);
    $title.textContent = shopState.cat === 'deals' ? 'Deals' : shopState.cat === 'featured' ? 'Featured' : (shopState.cat ? CATEGORIES.find(c=>c.id===shopState.cat)?.name || 'Shop' : 'All Products');
    $count.textContent = list.length + ' product' + (list.length === 1 ? '' : 's');
    const perPage = 12, pages = Math.max(1, Math.ceil(list.length / perPage));
    shopState.page = Math.min(shopState.page, pages);
    const slice = list.slice((shopState.page - 1) * perPage, shopState.page * perPage);
    $grid.innerHTML = slice.length ? slice.map(productCard).join('') : '<div class="empty-state"><h3>No products found</h3><p>Try adjusting your filters.</p><button class="btn btn-primary" id="resetFromEmpty">Reset filters</button></div>';
    $pager.innerHTML = pages > 1 ? Array.from({length: pages}, (_,i)=>`<button class="pg ${i+1===shopState.page?'active':''}" data-page="${i+1}">${i+1}</button>`).join('') : '';
  };

  const wireFilters = () => {
    renderShop();
    $('#fCat').onchange = e => { shopState.cat = e.target.value; shopState.page = 1; renderShop(); };
    $('#fBrand').onchange = e => { shopState.brand = e.target.value; shopState.page = 1; renderShop(); };
    $('#fPrice').oninput = e => { shopState.maxPrice = +e.target.value; $('#priceLabel').textContent = money(shopState.maxPrice); shopState.page = 1; renderShop(); };
    $('#fRating').onchange = e => { shopState.minRating = +e.target.value; shopState.page = 1; renderShop(); };
    $('#fStock').onchange = e => { shopState.inStock = e.target.checked; shopState.page = 1; renderShop(); };
    $('#sortSelect').onchange = e => { shopState.sort = e.target.value; shopState.page = 1; renderShop(); };
    $('#clearFilters').onclick = () => {
      $('#fCat').value=''; $('#fBrand').value=''; $('#fRating').value='0'; $('#fStock').checked=false;
      const maxP = Math.max(...Store.products().map(p=>p.price));
      $('#fPrice').value=maxP; $('#priceLabel').textContent = money(maxP);
      Object.assign(shopState, {cat:'',brand:'',maxPrice:0,minRating:0,inStock:false,page:1}); renderShop();
    };
    $('#pager').onclick = e => { const b=e.target.closest('[data-page]'); if(b){ shopState.page=+b.dataset.page; renderShop(); window.scrollTo({top:0,behavior:'smooth'});} };
  };

  /* ---------- Product detail ---------- */
  const productView = (id) => {
    const p = Store.productById(id);
    if (!p) return `<div class="container section empty-state"><h3>Product not found</h3><a class="btn btn-primary" href="#/shop" data-nav>Back to shop</a></div>`;
    const wished = Store.isWished(id);
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `
      <section class="container section">
        <nav class="crumbs"><a href="#/" data-nav>Home</a> › <a href="#/shop" data-nav>Shop</a> › <a href="#/shop?cat=${p.category}" data-nav>${CATEGORIES.find(c=>c.id===p.category)?.name}</a> › <span>${p.name}</span></nav>
        <div class="pdp">
          <div class="pdp-media">
            <div class="pdp-img"><img src="${p.img}" alt="${p.name}"></div>
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
            ${discount ? `<span class="badge discount">-${discount}%</span>` : ''}
          </div>
          <div class="pdp-info">
            <div class="card-cat">${p.brand}</div>
            <h1>${p.name}</h1>
            <div class="pdp-rate"><span class="stars">${ratingStars(p.rating)}</span> <b>${p.rating}</b> · ${p.reviews} reviews</div>
            <div class="pdp-price">
              <span class="price">${money(p.price)}</span>
              ${p.oldPrice ? `<s class="old">${money(p.oldPrice)}</s> <span class="save">You save ${money(p.oldPrice - p.price)}</span>` : ''}
            </div>
            <p class="pdp-desc">${p.description}</p>
            <div class="pdp-stock ${p.inStock === false ? 'out' : ''}">${p.inStock === false ? 'Out of stock' : '✓ In stock · Ships today'}</div>
            <div class="pdp-buy">
              <div class="qty"><button data-qminus>−</button><input type="number" id="qtyInput" value="1" min="1" max="99"><button data-qplus>+</button></div>
              <button class="btn btn-primary btn-lg" id="addPdp" ${p.inStock === false ? 'disabled' : ''}>Add to Cart — ${money(p.price)}</button>
              <button class="icon-btn big ${wished ? 'on' : ''}" id="wishPdp" aria-label="Wishlist">${wished ? '♥' : '♡'}</button>
            </div>
            <div class="pdp-actions">
              <button class="btn btn-ghost" id="buyNow" ${p.inStock === false ? 'disabled' : ''}>Buy it now →</button>
            </div>
            <ul class="pdp-specs">
              ${Object.entries(p.specs || {}).map(([k,v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('')}
            </ul>
          </div>
        </div>
      </section>`;
  };
  const wirePdp = (id) => {
    const p = Store.productById(id); if (!p) return;
    const qtyInput = $('#qtyInput');
    $('#addPdp').onclick = () => { Store.addToCart(id, +qtyInput.value); refreshBadges(); openCart(); toast(`${p.name} added to cart`); };
    $('#buyNow').onclick = () => { Store.addToCart(id, +qtyInput.value); refreshBadges(); location.hash = '#/checkout'; };
    $('#wishPdp').onclick = (e) => { const on = Store.toggleWishlist(id); e.target.textContent = on ? '♥' : '♡'; e.target.classList.toggle('on', on); refreshBadges(); toast(on ? 'Saved to wishlist' : 'Removed from wishlist'); };
    $('#qtyInput').onchange = e => { if (e.target.value < 1) e.target.value = 1; };
    $('#addPdp').parentElement.querySelector('[data-qminus]').onclick = () => { if (qtyInput.value > 1) qtyInput.value = +qtyInput.value - 1; };
    $('#addPdp').parentElement.querySelector('[data-qplus]').onclick = () => { if (qtyInput.value < 99) qtyInput.value = +qtyInput.value + 1; };
  };

  /* ---------- Cart drawer ---------- */
  const cartDrawer = $('#cartDrawer'), scrim = $('#scrim');
  const openCart = () => { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); scrim.hidden = false; renderDrawer(); };
  const closeCart = () => { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); scrim.hidden = true; };
  const renderDrawer = () => {
    const lines = Store.cart();
    const body = $('#drawerBody'), footer = $('#drawerFooter');
    $('#drawerCount').textContent = Store.cartCount();
    if (!lines.length) {
      body.innerHTML = '<div class="empty-state small"><span>🛒</span><p>Your cart is empty.</p><a class="btn btn-primary" href="#/shop" data-nav>Start shopping</a></div>';
      footer.innerHTML = '';
      return;
    }
    body.innerHTML = lines.map(l => {
      const p = Store.productById(l.id); if (!p) return '';
      return `<div class="dline">
        <img src="${p.img}" alt="">
        <div class="dline-info"><a href="#/product/${p.id}" data-nav>${p.name}</a><div>${money(p.price)}</div>
          <div class="qty mini"><button data-dminus="${p.id}">−</button><span>${l.qty}</span><button data-dplus="${p.id}">+</button></div></div>
        <button class="icon-btn" data-dremove="${p.id}" aria-label="Remove">&times;</button>
      </div>`;
    }).join('');
    footer.innerHTML = cartFooterHtml(true);
  };
  const cartFooterHtml = (fromDrawer) => {
    const subtotal = Store.cartSubtotal();
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
    const promo = Store.promo();
    let discount = 0;
    if (promo) {
      if (promo.type === 'percent') discount = subtotal * promo.value / 100;
      if (promo.type === 'freeship') { /* handled in shipping */ }
    }
    const effectiveShip = promo && promo.type === 'freeship' ? 0 : shipping;
    const total = subtotal - discount + effectiveShip + subtotal * TAX_RATE;
    const btn = fromDrawer
      ? `<a class="btn btn-primary btn-block" href="#/checkout" data-nav onclick="document.getElementById('cartDrawer').classList.remove('open');document.getElementById('scrim').hidden=true">Checkout — ${money(Math.max(0,total))}</a>`
      : `<button class="btn btn-primary btn-block" id="goCheckout">Checkout — ${money(Math.max(0,total))}</button>`;
    const promoHtml = fromDrawer
      ? `<form class="promo-form" id="promoForm"><input id="promoInput" placeholder="Promo code"><button class="btn btn-ghost btn-sm" type="submit">Apply</button></form>`
      : `<form class="promo-form" id="promoFormCart"><input id="promoInput" placeholder="Promo code"><button class="btn btn-ghost btn-sm" type="submit">Apply</button></form>`;
    return `
      ${promo ? `<div class="promo-active">✔ Code <b>${promo.code}</b> applied (${promo.label}) <button class="icon-btn" id="clearPromoBtn">&times;</button></div>` : promoHtml}
      <div class="totals">
        <div><span>Subtotal</span><b>${money(subtotal)}</b></div>
        ${discount ? `<div class="disc"><span>Discount (${promo.code})</span><b>−${money(discount)}</b></div>` : ''}
        <div><span>Shipping</span><b>${effectiveShip === 0 ? 'FREE' : money(effectiveShip)}</b></div>
        <div><span>Tax (8%)</span><b>${money(subtotal * TAX_RATE)}</b></div>
        <div class="grand"><span>Total</span><b>${money(Math.max(0,total))}</b></div>
      </div>
      ${btn}`;
  };
  $('#drawerBody').addEventListener('click', e => {
    const rm = e.target.closest('[data-dremove]');
    const minus = e.target.closest('[data-dminus]');
    const plus = e.target.closest('[data-dplus]');
    if (rm) { Store.removeFromCart(rm.dataset.dremove); refreshBadges(); renderDrawer(); }
    if (minus) { const l = Store.cart().find(i=>i.id===minus.dataset.dminus); Store.setQty(l.id, l.qty-1); refreshBadges(); renderDrawer(); }
    if (plus) { const l = Store.cart().find(i=>i.id===plus.dataset.dplus); Store.setQty(l.id, l.qty+1); refreshBadges(); renderDrawer(); }
  });
  $('#drawerFooter').addEventListener('click', e => {
    if (e.target.closest('#clearPromoBtn')) { Store.clearPromo(); renderDrawer(); }
  });
  $('#drawerFooter').addEventListener('submit', e => {
    const form = e.target.closest('.promo-form'); if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input');
    if (Store.applyPromo(input.value)) toast('Promo applied!'); else toast('Invalid promo code', 'error');
    input.value = ''; renderDrawer();
  });
  $('#drawerClose').onclick = closeCart;
  scrim.onclick = closeCart;

  /* ---------- Cart page ---------- */
  const cartView = () => {
    const lines = Store.cart();
    if (!lines.length) return `<div class="container section empty-state"><span style="font-size:3rem">🛒</span><h2>Your cart is empty</h2><p>Fill it with powerful tech.</p><a class="btn btn-primary" href="#/shop" data-nav>Browse products</a></div>`;
    return `
      <section class="container section">
        <h1 class="page-title">Your Cart</h1>
        <div class="cart-layout">
          <div class="cart-lines">
            ${lines.map(l => { const p = Store.productById(l.id); return `
              <div class="cart-line">
                <a href="#/product/${p.id}" data-nav><img src="${p.img}" alt=""></a>
                <div class="cl-info">
                  <a href="#/product/${p.id}" data-nav><b>${p.name}</b></a>
                  <div class="card-cat">${p.brand}</div>
                  <div class="cl-price">${money(p.price)}</div>
                </div>
                <div class="qty"><button data-cminus="${p.id}">−</button><span>${l.qty}</span><button data-cplus="${p.id}">+</button></div>
                <div class="cl-line-total">${money(p.price * l.qty)}</div>
                <button class="icon-btn" data-remove="${p.id}" aria-label="Remove">&times;</button>
              </div>`; }).join('')}
            <div class="cart-actions">
              <a class="btn btn-ghost" href="#/shop" data-nav>← Continue shopping</a>
              <button class="btn btn-ghost danger" id="clearCart">Clear cart</button>
            </div>
          </div>
          <aside class="cart-summary card">
            <h3>Order Summary</h3>
            <div id="summaryBody"></div>
          </aside>
        </div>
      </section>`;
  };
  const renderSummaryContainers = () => {
    const html = cartFooterHtml(false);
    const sb = $('#summaryBody'); if (sb) sb.innerHTML = html;
    const cs = $('#coSummary'); if (cs) cs.innerHTML = html;
    wireSummary();
  };
  const wireCart = () => renderSummaryContainers();
  const wireSummary = () => {
    const go = $('#goCheckout'); if (go) go.onclick = () => { location.hash = '#/checkout'; };
    const clearP = $('#clearPromoBtn'); if (clearP) clearP.onclick = () => { Store.clearPromo(); renderSummaryContainers(); };
    const form = $('#promoFormCart'); if (form) form.onsubmit = e => {
      e.preventDefault(); const inp = form.querySelector('input');
      if (Store.applyPromo(inp.value)) toast('Promo applied!'); else toast('Invalid promo code','error');
      inp.value = ''; renderSummaryContainers();
    };
  };
  $('#app').addEventListener('click', e => {
    const rm = e.target.closest('[data-remove]');
    const cminus = e.target.closest('[data-cminus]');
    const cplus = e.target.closest('[data-cplus]');
    if (rm) { Store.removeFromCart(rm.dataset.remove); refreshBadges(); onCartPage() ? route() : renderDrawer(); }
    if (cminus) { const l = Store.cart().find(i=>i.id===cminus.dataset.cminus); Store.setQty(l.id, l.qty-1); refreshBadges(); onCartPage() ? route() : renderDrawer(); }
    if (cplus) { const l = Store.cart().find(i=>i.id===cplus.dataset.cplus); Store.setQty(l.id, l.qty+1); refreshBadges(); onCartPage() ? route() : renderDrawer(); }
  });
  const onCartPage = () => location.hash.replace(/^#\/?/, '').split('?')[0] === 'cart';
  const wireCartPage = () => {
    const cc = $('#clearCart'); if (cc) cc.onclick = () => { Store.clearCart(); refreshBadges(); route(); };
  };

  /* ---------- Checkout ---------- */
  const checkoutView = () => {
    if (!Store.cart().length) return `<div class="container section empty-state"><h2>Nothing to check out</h2><a class="btn btn-primary" href="#/shop" data-nav>Shop now</a></div>`;
    return `
      <section class="container section">
        <h1 class="page-title">Checkout</h1>
        <div class="checkout-layout">
          <div class="co-form">
            <h3>Contact</h3>
            <div class="field"><label>Email</label><input type="email" id="coEmail" placeholder="you@email.com" required></div>
            <h3>Shipping address</h3>
            <div class="field"><label>Full name</label><input id="coName" placeholder="Jane Doe" required></div>
            <div class="field"><label>Address</label><input id="coAddr" placeholder="123 Market St" required></div>
            <div class="row">
              <div class="field"><label>City</label><input id="coCity" placeholder="Lagos" required></div>
              <div class="field"><label>Postal code</label><input id="coZip" placeholder="100001" required></div>
            </div>
            <h3>Payment (demo)</h3>
            <div class="field"><label>Card number</label><input id="coCard" placeholder="4242 4242 4242 4242" inputmode="numeric" maxlength="19" required></div>
            <div class="row">
              <div class="field"><label>Expiry</label><input id="coExp" placeholder="MM/YY" maxlength="5" required></div>
              <div class="field"><label>CVC</label><input id="coCvc" placeholder="123" maxlength="3" inputmode="numeric" required></div>
            </div>
            <div class="field"><label>Promo code (optional)</label><input id="coPromo" placeholder="e.g. VAULT10"></div>
            <button class="btn btn-primary btn-block btn-lg" id="placeOrder">Place order</button>
          </div>
          <aside class="cart-summary card">
            <h3>Order Summary</h3>
            <div id="coSummary"></div>
          </aside>
        </div>
      </section>`;
  };
  const wireCheckout = () => {
    if (!$('#placeOrder')) return;
    $('#coSummary').innerHTML = cartFooterHtml(false);
    wireSummary();
    $('#placeOrder').onclick = () => {
      const email = $('#coEmail').value.trim(), name = $('#coName').value.trim(),
        addr = $('#coAddr').value.trim(), city = $('#coCity').value.trim(),
        zip = $('#coZip').value.trim(), card = $('#coCard').value.trim();
      if (!email || !name || !addr || !city || !zip || !card) { toast('Please fill in all required fields', 'error'); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Enter a valid email', 'error'); return; }
      if ($('#coPromo').value.trim() && !Store.applyPromo($('#coPromo').value.trim())) { toast('Invalid promo code','error'); return; }
      const subtotal = Store.cartSubtotal();
      const promo = Store.promo();
      let discount = 0;
      if (promo && promo.type === 'percent') discount = subtotal * promo.value / 100;
      const shipping = (promo && promo.type === 'freeship') || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
      const tax = subtotal * TAX_RATE;
      const total = subtotal - discount + shipping + tax;
      const items = Store.cart().map(i => ({ ...i, product: Store.productById(i.id) }));
      const order = Store.placeOrder({
        email, name, addr, city, zip,
        items, subtotal, discount, shipping, tax, total,
        promo: promo ? promo.code : null, status: 'Processing',
      });
      refreshBadges();
      location.hash = '#/order/' + order.id;
      toast('Order placed successfully! 🎉');
    };
  };

  /* ---------- Order confirmation ---------- */
  const orderView = (id) => {
    const o = Store.orders().find(x => x.id === id);
    if (!o) return `<div class="container section empty-state"><h2>Order not found</h2><a class="btn btn-primary" href="#/shop" data-nav>Shop</a></div>`;
    return `
      <section class="container section">
        <div class="order-confirm">
          <div class="oc-ico">✓</div>
          <h1>Thank you, ${o.name.split(' ')[0]}!</h1>
          <p>Your order <b>${o.id}</b> is confirmed. A receipt was sent to ${o.email}.</p>
          <div class="oc-meta">
            <div><span>Status</span><b class="pill ${o.status.toLowerCase()}">${o.status}</b></div>
            <div><span>Date</span><b>${new Date(o.date).toLocaleDateString()}</b></div>
            <div><span>Total</span><b>${money(o.total)}</b></div>
          </div>
          <div class="oc-items">
            ${o.items.map(i => `<div class="oc-line"><img src="${i.product.img}" alt=""><span>${i.product.name} × ${i.qty}</span><b>${money(i.product.price * i.qty)}</b></div>`).join('')}
          </div>
          <div class="oc-cta">
            <a class="btn btn-primary" href="#/shop" data-nav>Continue shopping</a>
            <a class="btn btn-ghost" href="#/orders" data-nav>My orders</a>
          </div>
        </div>
      </section>`;
  };

  /* ---------- Orders (customer) ---------- */
  const ordersView = () => {
    const list = Store.orders();
    if (!list.length) return `<div class="container section empty-state"><h2>No orders yet</h2><a class="btn btn-primary" href="#/shop" data-nav>Start shopping</a></div>`;
    return `
      <section class="container section">
        <h1 class="page-title">My Orders</h1>
        <div class="order-list">
          ${list.map(o => `
            <div class="order-row">
              <div><b>${o.id}</b><small>${new Date(o.date).toLocaleString()}</small></div>
              <div><span class="pill ${o.status.toLowerCase()}">${o.status}</span></div>
              <div><b>${money(o.total)}</b></div>
              <div class="order-thumbs">${o.items.slice(0,4).map(i=>`<img src="${i.product.img}" alt="">`).join('')}</div>
            </div>`).join('')}
        </div>
      </section>`;
  };

  /* ---------- Wishlist ---------- */
  const wishlistView = () => {
    const items = Store.wishlist().map(Store.productById).filter(Boolean);
    if (!items.length) return `<div class="container section empty-state"><span style="font-size:3rem">♡</span><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here.</p><a class="btn btn-primary" href="#/shop" data-nav>Explore products</a></div>`;
    return `<section class="container section"><h1 class="page-title">Your Wishlist</h1><div class="grid">${items.map(productCard).join('')}</div></section>`;
  };

  /* ---------- Admin ---------- */
  const adminView = () => {
    const session = Store.session();
    if (!session) {
      return `
        <section class="container section auth">
          <form class="card auth-card" id="adminLogin">
            <h2>🔐 Admin Portal</h2>
            <p>Sign in to manage products and orders.</p>
            <div class="field"><label>Username</label><input id="aUser" value="admin" required></div>
            <div class="field"><label>Password</label><input type="password" id="aPass" value="admin123" required></div>
            <button class="btn btn-primary btn-block" type="submit">Sign in</button>
            <small class="hint">Demo credentials: <code>admin</code> / <code>admin123</code></small>
          </form>
        </section>`;
    }
    const products = Store.products(), orders = Store.orders();
    const revenue = orders.reduce((s,o)=>s+o.total,0);
    const units = orders.reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0);
    return `
      <section class="container section">
        <div class="admin-head">
          <h1 class="page-title">Admin Dashboard</h1>
          <div><a class="btn btn-primary" href="#/admin/product/new" data-nav>+ Add product</a>
          <button class="btn btn-ghost" id="adminLogout">Log out</button></div>
        </div>
        <div class="stat-grid">
          <div class="stat card"><span>📦</span><b>${products.length}</b><small>Products</small></div>
          <div class="stat card"><span>🧾</span><b>${orders.length}</b><small>Orders</small></div>
          <div class="stat card"><span>💰</span><b>${money(revenue)}</b><small>Revenue</small></div>
          <div class="stat card"><span>🔢</span><b>${units}</b><small>Units sold</small></div>
        </div>
        <h2 class="sub">Products (${products.length})</h2>
        <div class="admin-table card">
          <div class="at-head"><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span></div>
          ${products.map(p => `
            <div class="at-row">
              <span class="at-prod"><img src="${p.img}" alt=""><b>${p.name}</b></span>
              <span>${CATEGORIES.find(c=>c.id===p.category)?.name||p.category}</span>
              <span>${money(p.price)}</span>
              <span>${p.inStock === false ? '❌' : '✓'}</span>
              <span class="at-actions">
                <a class="btn btn-ghost btn-sm" href="#/admin/product/${p.id}" data-nav>Edit</a>
                ${Store.isBaseProduct(p.id) ? '<small title="Base product">🔒</small>' : `<button class="btn btn-ghost btn-sm danger" data-del="${p.id}">Delete</button>`}
              </span>
            </div>`).join('')}
        </div>
        <h2 class="sub">Recent Orders</h2>
        <div class="admin-table card">
          <div class="at-head"><span>Order</span><span>Customer</span><span>Total</span><span>Status</span></div>
          ${orders.slice(0,12).map(o => `
            <div class="at-row">
              <span><b>${o.id}</b></span>
              <span>${o.name}<br><small>${o.email}</small></span>
              <span>${money(o.total)}</span>
              <span><select data-os="${o.id}">
                ${['Processing','Shipped','Delivered','Cancelled'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
              </select></span>
            </div>`).join('') || '<div class="at-row"><span>No orders yet</span></div>'
        }
        </div>
      </section>`;
  };
  const adminFormView = (id) => {
    const p = id && id !== 'new' ? Store.productById(id) : null;
    const isEdit = !!p;
    const d = p || { id:'', name:'', brand:'TechVault', price:0, oldPrice:0, rating:4.5, reviews:0, category:'audio', tags:[], featured:false, badge:'', img:'', short:'', description:'', specs:{}, inStock:true };
    return `
      <section class="container section">
        <h1 class="page-title">${isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <form class="card admin-form" id="productForm">
          <div class="field"><label>Name *</label><input id="pName" value="${d.name}" required></div>
          <div class="row">
            <div class="field"><label>Brand *</label><input id="pBrand" value="${d.brand}" required></div>
            <div class="field"><label>Category *</label><select id="pCat">${CATEGORIES.map(c=>`<option ${c.id===d.category?'selected':''} value="${c.id}">${c.name}</option>`).join('')}</select></div>
          </div>
          <div class="row">
            <div class="field"><label>Price *</label><input type="number" id="pPrice" value="${d.price}" min="0" step="0.01" required></div>
            <div class="field"><label>Old price (for deals)</label><input type="number" id="pOld" value="${d.oldPrice||''}" min="0" step="0.01"></div>
          </div>
          <div class="row">
            <div class="field"><label>Image URL</label><input id="pImg" value="${d.img}" placeholder="img/products/…"></div>
            <div class="field"><label>Badge</label><input id="pBadge" value="${d.badge}"></div>
          </div>
          <div class="field"><label>Short description</label><input id="pShort" value="${d.short}"></div>
          <div class="field"><label>Full description</label><textarea id="pDesc" rows="3">${d.description}</textarea></div>
          <label class="f-check"><input type="checkbox" id="pFeatured" ${d.featured?'checked':''}> Featured</label>
          <label class="f-check"><input type="checkbox" id="pStock" ${d.inStock!==false?'checked':''}> In stock</label>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">${isEdit ? 'Save changes' : 'Create product'}</button>
            <a class="btn btn-ghost" href="#/admin" data-nav>Cancel</a>
          </div>
        </form>
      </section>`;
  };
  const wireAdmin = () => {
    const login = $('#adminLogin');
    if (login) login.onsubmit = e => {
      e.preventDefault();
      const u = $('#aUser').value, p = $('#aPass').value;
      if (Store.ADMINS[u] && Store.ADMINS[u] === p) { Store.setSession({ user: u, name: u }); route(); toast('Welcome, admin!'); }
      else toast('Invalid credentials', 'error');
    };
    const logout = $('#adminLogout');
    if (logout) logout.onclick = () => { Store.setSession(null); route(); toast('Logged out'); };
    $$('[data-os]').forEach(sel => sel.onchange = e => { Store.updateOrderStatus(e.target.dataset.os, e.target.value); toast('Order updated'); });
    $$('[data-del]').forEach(b => b.onclick = () => { if (Store.deleteProduct(b.dataset.del)) { toast('Product deleted'); route(); } else toast('Cannot delete base product','error'); });
  };
  const wireAdminForm = (id) => {
    const form = $('#productForm'); if (!form) return;
    form.onsubmit = e => {
      e.preventDefault();
      const existing = id && id !== 'new' ? Store.productById(id) : null;
      const base = existing || { reviews: 0, rating: 4.5, oldPrice: 0, tags: [], specs: {} };
      const product = {
        ...base,
        id: existing ? existing.id : 'p_' + Date.now().toString(36),
        name: $('#pName').value.trim(),
        brand: $('#pBrand').value.trim(),
        category: $('#pCat').value,
        price: +$('#pPrice').value,
        oldPrice: +$('#pOld').value || 0,
        img: $('#pImg').value.trim() || 'img/products/headphones.jpg',
        badge: $('#pBadge').value.trim(),
        short: $('#pShort').value.trim(),
        description: $('#pDesc').value.trim(),
        featured: $('#pFeatured').checked,
        inStock: $('#pStock').checked,
      };
      Store.saveProduct(product);
      toast(existing ? 'Product updated' : 'Product created');
      location.hash = '#/admin';
    };
  };

  /* ---------- Router ---------- */
  const parseHash = () => {
    const h = location.hash.replace(/^#\/?/, '');
    const [pathPart, query] = h.split('?');
    const segs = pathPart.split('/').filter(Boolean);
    const params = {};
    if (query) query.split('&').forEach(kv => { const [k,v]=kv.split('='); params[decodeURIComponent(k)] = decodeURIComponent(v||''); });
    return { segs, params };
  };

  const route = () => {
    const { segs, params } = parseHash();
    let html = '';
    let fn = null, arg = null;
    if (segs.length === 0) { html = homeView(); }
    else if (segs[0] === 'shop') { applyFilters(params); html = shopView(params); fn = wireFilters; }
    else if (segs[0] === 'product') { html = productView(segs[1]); fn = () => wirePdp(segs[1]); }
    else if (segs[0] === 'cart') { html = cartView(); fn = () => { wireCart(); wireCartPage(); }; }
    else if (segs[0] === 'checkout') { html = checkoutView(); fn = wireCheckout; }
    else if (segs[0] === 'order') { html = orderView(segs[1]); }
    else if (segs[0] === 'orders') { html = ordersView(); }
    else if (segs[0] === 'wishlist') { html = wishlistView(); }
    else if (segs[0] === 'admin' && segs[1] === 'product') { html = adminFormView(segs[2]); fn = () => wireAdminForm(segs[2]); }
    else if (segs[0] === 'admin' && !segs[1]) { html = adminView(); fn = wireAdmin; }
    else html = `<div class="container section empty-state"><h2>Page not found</h2><a class="btn btn-primary" href="#/" data-nav>Home</a></div>`;

    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo({ top: 0 });
    closeCart();
    $$('#mobileMenu').forEach(m => { m.hidden = true; });
    if (fn) fn();
    refreshBadges();
  };

  /* ---------- Global delegated events ---------- */
  app.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    const wish = e.target.closest('[data-wish]');
    const page = e.target.closest('[data-page]');
    const emptyReset = e.target.closest('#resetFromEmpty');
    if (add) { const id = add.dataset.add; Store.addToCart(id, +add.dataset.qty); refreshBadges(); openCart(); toast('Added to cart'); }
    if (wish) { const id = wish.dataset.wish; const on = Store.toggleWishlist(id); wish.classList.toggle('on', on); wish.innerHTML = on ? '♥' : '♡'; refreshBadges(); toast(on ? 'Saved to wishlist' : 'Removed from wishlist'); }
    if (page && $('#shopGrid')) { shopState.page = +page.dataset.page; renderShop(); window.scrollTo({top:0,behavior:'smooth'}); }
    if (emptyReset) { $('#clearFilters')?.click(); }
  });
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]');
    if (nav) { closeCart(); resultsBox.hidden = true; searchInput.value = ''; }
  });

  /* ---------- Header / misc ---------- */
  const header = $('#siteHeader');
  const onScroll = () => { header.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  $('#navToggle').onclick = () => {
    const m = $('#mobileMenu');
    m.hidden = !m.hidden;
    $('#navToggle').setAttribute('aria-expanded', String(!m.hidden));
  };
  $('#promoClose').onclick = () => { $('#promoBar').style.display = 'none'; };
  $('#newsletterForm').onsubmit = e => { e.preventDefault(); toast('Thanks for subscribing!'); e.target.reset(); };
  $('#year').textContent = new Date().getFullYear();

  window.addEventListener('hashchange', route);
  route();
  refreshBadges();
})();
