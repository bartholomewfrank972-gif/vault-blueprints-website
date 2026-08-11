/* ============================================================
   TechVault — State & persistence layer.
   Everything (cart, wishlist, orders, admin edits) lives in
   localStorage so the static site behaves like a real store.
   ============================================================ */

const Store = (() => {
  const KEYS = {
    cart: 'tv_cart',
    wishlist: 'tv_wishlist',
    orders: 'tv_orders',
    products: 'tv_products',   // admin overrides
    promo: 'tv_promo',
    session: 'tv_session',
  };

  const get = (key, fallback) => {
    try {
      const raw = localStorage.getItem(KEYS[key]);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const set = (key, val) => {
    try { localStorage.setItem(KEYS[key], JSON.stringify(val)); } catch (e) { /* ignore quota */ }
  };

  /* ---- Products (admin overrides merged over base catalog) ---- */
  const products = () => {
    const overrides = get('products', {});
    return BASE_PRODUCTS.map(p => overrides[p.id] ? { ...p, ...overrides[p.id] } : p)
      .concat(Object.keys(overrides)
        .filter(id => !BASE_PRODUCTS.some(p => p.id === id))
        .map(id => overrides[id]));
  };
  const productById = id => products().find(p => p.id === id);
  const saveProduct = (product) => {
    const overrides = get('products', {});
    overrides[product.id] = product;
    set('products', overrides);
  };
  const deleteProduct = (id) => {
    if (BASE_PRODUCTS.some(p => p.id === id)) return false; // protect base catalog
    const overrides = get('products', {});
    delete overrides[id];
    set('products', overrides);
    return true;
  };
  const isBaseProduct = id => BASE_PRODUCTS.some(p => p.id === id);

  /* ---- Cart ---- */
  const cart = () => get('cart', []);
  const cartCount = () => cart().reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () => cart().reduce((s, i) => {
    const p = productById(i.id);
    return p ? s + p.price * i.qty : s;
  }, 0);
  const addToCart = (id, qty = 1) => {
    const p = productById(id); if (!p) return;
    const c = cart();
    const line = c.find(i => i.id === id);
    if (line) line.qty = Math.min(99, line.qty + qty);
    else c.push({ id, qty });
    set('cart', c);
  };
  const setQty = (id, qty) => {
    let c = cart();
    if (qty <= 0) c = c.filter(i => i.id !== id);
    else { const l = c.find(i => i.id === id); if (l) l.qty = Math.min(99, qty); }
    set('cart', c);
  };
  const removeFromCart = id => set('cart', cart().filter(i => i.id !== id));
  const clearCart = () => set('cart', []);

  /* ---- Wishlist ---- */
  const wishlist = () => get('wishlist', []);
  const isWished = id => wishlist().includes(id);
  const toggleWishlist = id => {
    let w = wishlist();
    if (w.includes(id)) w = w.filter(x => x !== id); else w.push(id);
    set('wishlist', w);
    return w.includes(id);
  };

  /* ---- Promo ---- */
  const promo = () => get('promo', null);
  const applyPromo = code => {
    const promo = PROMOS[String(code || '').trim().toUpperCase()];
    if (promo) { set('promo', { code: String(code).trim().toUpperCase(), ...promo }); return true; }
    return false;
  };
  const clearPromo = () => set('promo', null);

  /* ---- Orders ---- */
  const orders = () => get('orders', []);
  const placeOrder = (order) => {
    const list = orders();
    list.unshift({ ...order, id: 'TV-' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString() });
    set('orders', list);
    clearCart(); clearPromo();
    return list[0];
  };
  const updateOrderStatus = (id, status) => {
    const list = orders().map(o => o.id === id ? { ...o, status } : o);
    set('orders', list);
  };

  /* ---- Session (current user for admin + checkout) ---- */
  const session = () => get('session', null);
  const setSession = (user) => set('session', user);

  const ADMINS = { admin: 'admin123' };

  return {
    ADMINS,
    products, productById, saveProduct, deleteProduct, isBaseProduct,
    cart, cartCount, cartSubtotal, addToCart, setQty, removeFromCart, clearCart,
    wishlist, isWished, toggleWishlist,
    promo, applyPromo, clearPromo,
    orders, placeOrder, updateOrderStatus,
    session, setSession,
  };
})();
