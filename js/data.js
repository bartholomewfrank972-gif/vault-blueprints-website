/* ============================================================
   TechVault — Product catalog, categories and promo definitions.
   ============================================================ */

const CATEGORIES = [
  { id: 'audio',      name: 'Audio' },
  { id: 'wearables',  name: 'Wearables' },
  { id: 'laptops',    name: 'Laptops' },
  { id: 'phones',     name: 'Phones' },
  { id: 'cameras',    name: 'Cameras' },
  { id: 'accessories',name: 'Accessories' },
  { id: 'monitors',   name: 'Monitors' },
  { id: 'drones',     name: 'Drones' },
  { id: 'gaming',     name: 'Gaming' },
];

/* Internal catalog. The store persists admin edits/creates in
   localStorage, which overrides entries here by id. */
const BASE_PRODUCTS = [
  {
    id: 'headphones', name: 'Aurora Wireless Headphones', brand: 'TechVault',
    price: 249, oldPrice: 299, rating: 4.8, reviews: 1284,
    category: 'audio', tags: ['wireless', 'anc', 'premium'], featured: true, badge: 'Bestseller',
    img: 'img/products/headphones.jpg',
    short: 'Studio-grade active noise cancelling headphones with 40h battery and spatial audio.',
    description: 'Dive into sound with adaptive active noise cancellation, plush memory-foam earcups and a 40-hour battery. Multipoint Bluetooth 5.3 lets you switch seamlessly between laptop and phone, while spatial audio makes every track feel cinematic.',
    specs: { 'Driver': '40mm dynamic', 'Battery': '40h (ANC on)', 'Bluetooth': '5.3', 'Weight': '254g', 'Charging': 'USB-C' },
  },
  {
    id: 'smartwatch', name: 'Pulse Smartwatch Pro', brand: 'TechVault',
    price: 329, oldPrice: 0, rating: 4.6, reviews: 742,
    category: 'wearables', tags: ['fitness', 'gps'], featured: false, badge: 'New',
    img: 'img/products/smartwatch.jpg',
    short: 'Always-on AMOLED fitness watch with dual-band GPS, ECG and 10-day battery.',
    description: 'Track heart rate, ECG, blood oxygen and sleep with clinical-grade sensors. Dual-band GPS locks on fast for runs and rides, and the bright AMOLED display stays readable in direct sun. Water resistant to 50m.',
    specs: { 'Display': '1.4" AMOLED', 'Battery': '10 days', 'GPS': 'Dual-band', 'Water': '5 ATM', 'Sensors': 'ECG, SpO2' },
  },
  {
    id: 'laptop', name: 'NovaBook Ultra 14', brand: 'Nova',
    price: 1299, oldPrice: 0, rating: 4.9, reviews: 2108,
    category: 'laptops', tags: ['ultrabook', 'thin'], featured: true, badge: 'Editor\'s Choice',
    img: 'img/products/laptop.jpg',
    short: 'A featherweight 14" ultrabook with a 2.8K OLED, all-day battery and silent cooling.',
    description: 'At 1.1kg with a 2.8K OLED touch display, the NovaBook Ultra disappears into your bag. The latest-generation chip keeps creative workloads flying, and the all-day 21-hour battery means you can leave the charger at home.',
    specs: { 'Display': '14" 2.8K OLED', 'Weight': '1.1 kg', 'Battery': '21h', 'Memory': '32GB LPDDR5', 'Storage': '1TB SSD' },
  },
  {
    id: 'phone', name: 'Photon X5', brand: 'Photon',
    price: 999, oldPrice: 1099, rating: 4.7, reviews: 3312,
    category: 'phones', tags: ['flagship', 'camera'], featured: true, badge: 'Hot',
    img: 'img/products/phone.jpg',
    short: 'Flagship smartphone with a pro triple camera, titanium frame and 5,000mAh battery.',
    description: 'The Photon X5 pairs a pro-grade triple camera system with a 120Hz LTPO display wrapped in a titanium frame. Capture 8K video, charge to 50% in 15 minutes, and enjoy 5 years of guaranteed OS updates.',
    specs: { 'Display': '6.7" 120Hz LTPO', 'Camera': '50MP triple', 'Battery': '5,000mAh', 'Charging': '120W', 'Frame': 'Titanium' },
  },
  {
    id: 'speaker', name: 'EchoSphere Smart Speaker', brand: 'EchoSphere',
    price: 129, oldPrice: 0, rating: 4.5, reviews: 956,
    category: 'audio', tags: ['smart', 'room-filling'], featured: false, badge: '',
    img: 'img/products/speaker.jpg',
    short: 'Room-filling 360° smart speaker with voice control and immersive 3D sound.',
    description: 'Omnidirectional sound fills any room with 360° drivers and a bass radiator tuned for punch. Built-in voice assistant answers questions, controls your home and plays music from any service.',
    specs: { 'Power': '30W', 'Voice': 'Built-in', 'Connect': 'Wi-Fi + BT 5.0', '360° audio': 'Yes', 'Mics': '4x far-field' },
  },
  {
    id: 'camera', name: 'Vista 4K Action Cam', brand: 'Vista',
    price: 399, oldPrice: 0, rating: 4.4, reviews: 618,
    category: 'cameras', tags: ['action', '4k'], featured: false, badge: '',
    img: 'img/products/camera.jpg',
    short: 'Rugged 4K/60 action camera with HyperSteady stabilization and waterproof housing.',
    description: 'Capture adventures in crisp 4K at 60fps with HyperSteady image stabilization. The included waterproof housing protects down to 40m, and front + back touchscreens make framing effortless.',
    specs: { 'Video': '4K/60', 'Stabilization': 'HyperSteady', 'Waterproof': '40m (case)', 'Screens': 'Front + back', 'Battery': '150 min' },
  },
  {
    id: 'keyboard', name: 'Kinetic RGB Keyboard', brand: 'Kinetic',
    price: 149, oldPrice: 179, rating: 4.7, reviews: 1845,
    category: 'accessories', tags: ['mechanical', 'rgb'], featured: false, badge: 'Sale',
    img: 'img/products/keyboard.jpg',
    short: 'Hot-swappable mechanical keyboard with per-key RGB, gasket mount and PBT caps.',
    description: 'A gasket-mounted, hot-swappable mechanical keyboard with smooth pre-lubed switches and double-shot PBT keycaps. Per-key RGB shines through a south-facing layout, and it connects wired, 2.4GHz or Bluetooth.',
    specs: { 'Layout': '75% compact', 'Switches': 'Hot-swap', 'Connection': 'Wired / 2.4G / BT', 'Keycaps': 'PBT', 'Battery': '4000mAh' },
  },
  {
    id: 'mouse', name: 'Zephyr Wireless Mouse', brand: 'Zephyr',
    price: 79, oldPrice: 0, rating: 4.3, reviews: 1210,
    category: 'accessories', tags: ['wireless', 'ergonomic'], featured: false, badge: '',
    img: 'img/products/mouse.jpg',
    short: 'Featherweight 59g wireless gaming mouse with 18K DPI sensor and 90h battery.',
    description: 'At just 59g, the Zephyr disappears in your hand. A 26K DPI optical sensor, optical switches rated for 100M clicks and a 90-hour battery make it a pro favourite.',
    specs: { 'Weight': '59g', 'Sensor': '26K DPI', 'Battery': '90h', 'Connection': '2.4GHz / BT', 'Buttons': '6' },
  },
  {
    id: 'monitor', name: 'Prism 27" 4K Monitor', brand: 'Prism',
    price: 449, oldPrice: 529, rating: 4.8, reviews: 873,
    category: 'monitors', tags: ['4k', 'usb-c'], featured: true, badge: 'Sale',
    img: 'img/products/monitor.jpg',
    short: '27" 4K IPS monitor with 98% DCI-P3, USB-C power delivery and eye-care tech.',
    description: 'Brilliant 4K on a 27-inch IPS panel with 98% DCI-P3 colour for accurate creative work. USB-C delivers 90W of power to your laptop, and TÜV-certified eye-care tech keeps long sessions comfortable.',
    specs: { 'Panel': '27" IPS 4K', 'Colour': '98% DCI-P3', 'USB-C': '90W PD', 'HDR': 'HDR400', 'Refresh': '60Hz' },
  },
  {
    id: 'drone', name: 'Falcon 4K Drone', brand: 'Falcon',
    price: 799, oldPrice: 0, rating: 4.6, reviews: 502,
    category: 'drones', tags: ['camera', 'foldable'], featured: false, badge: '',
    img: 'img/products/drone.jpg',
    short: 'Foldable camera drone with 4K/60, 3-axis gimbal and 34-minute flight time.',
    description: 'Pack cinematic 4K/60 video into a 249g foldable frame. The 3-axis gimbal keeps shots buttery, obstacle sensing keeps you safe, and 34 minutes of flight time means more time in the air.',
    specs: { 'Video': '4K/60', 'Gimbal': '3-axis', 'Flight time': '34 min', 'Range': '12 km', 'Weight': '249 g' },
  },
  {
    id: 'console', name: 'Titan Console', brand: 'Titan',
    price: 499, oldPrice: 0, rating: 4.9, reviews: 4210,
    category: 'gaming', tags: ['4k120', 'ssd'], featured: true, badge: 'Best Seller',
    img: 'img/products/console.jpg',
    short: 'Next-gen gaming console with 4K/120 gameplay, ray tracing and a 1TB SSD.',
    description: 'Play the biggest games in stunning 4K at up to 120fps with hardware ray tracing. A custom 1TB NVMe SSD slashes load times, and whisper-quiet cooling keeps the action intense.',
    specs: { 'Resolution': 'Up to 8K/120', 'Storage': '1TB NVMe', 'Ray tracing': 'Hardware', 'Controller': 'Wireless', 'Cooling': 'Vapor chamber' },
  },
  {
    id: 'earbuds', name: 'Aero True Wireless Earbuds', brand: 'Aero',
    price: 159, oldPrice: 199, rating: 4.5, reviews: 2390,
    category: 'audio', tags: ['wireless', 'anc'], featured: false, badge: 'Sale',
    img: 'img/products/earbuds.jpg',
    short: 'Compact ANC earbuds with wireless charging, IPX5 and a 32-hour total battery.',
    description: 'Feather-light earbuds with active noise cancelling and a transparency mode for when you need to hear the world. The pocketable case adds wireless charging and up to 32 hours total playtime.',
    specs: { 'ANC': 'Adaptive', 'Battery': '8h + 24h case', 'Charging': 'Qi wireless', 'Water': 'IPX5', 'Bluetooth': '5.3' },
  },
];

/* Promo codes: code -> { type, value, label } */
const PROMOS = {
  VAULT10: { type: 'percent', value: 10, label: '10% off your order' },
  WELCOME15: { type: 'percent', value: 15, label: '15% off your order' },
  SHIPFREE: { type: 'freeship', value: 0, label: 'Free shipping' },
  TECH25: { type: 'percent', value: 25, label: '25% off orders over $250' },
};

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FLAT = 9.99;
const TAX_RATE = 0.08; // 8% sales tax
