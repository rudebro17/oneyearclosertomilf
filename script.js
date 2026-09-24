/* ═══════════════════════════════════════════════════════════
   NUHA'S SECRET STORE — script.js
   Cart logic, product rendering, order confirmation, Spotify
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   SPOTIFY PLAYLIST URL
   ── PASTE YOUR SPOTIFY PLAYLIST LINK HERE ──
   Example: "https://open.spotify.com/playlist/37i9dQZF1DX0..."
   ───────────────────────────────────────────────────────────── */
const spotifyPlaylistUrl = "https://open.spotify.com/playlist/7sWx89PCG8WVYfu3Qn7y6j?si=EDYLdYYwR-WTJbVeDATM9w&utm_source=whatsapp&pi=uh4EEoznRAigt";

/* ─────────────────────────────────────────────────────────────
   PRODUCT DATA
   Each product has: id, no (display number), name, desc, sku
   All prices are ₹0 because that's the point.
   ───────────────────────────────────────────────────────────── */
const products = [
  {
    id: 1,
    no: "NO. 001",
    name: "Being Loved Forever",
    desc: "Unlimited love. No expiration date.",
    sku: "SKU-NUH-4EVR-∞",
    motif: "♡",
  },
  {
    id: 2,
    no: "NO. 002",
    name: "Unlimited Hugs",
    desc: "Redeemable whenever you need one.",
    sku: "SKU-NUH-HUG-∞",
    motif: "✦",
  },
  {
    id: 3,
    no: "NO. 003",
    name: "Lifetime Compliments",
    desc: "Unlimited admiration and occasional flirting.",
    sku: "SKU-NUH-CMPL-∞",
    motif: "★",
  },
  {
    id: 4,
    no: "NO. 004",
    name: "Random I Love You's",
    desc: "May arrive at completely random times.",
    sku: "SKU-NUH-ILY-∞",
    motif: "✧",
  },
  {
    id: 5,
    no: "NO. 005",
    name: "One Emergency Cuddle",
    desc: "Valid during bad days, stressful nights, and whenever you need me.",
    sku: "SKU-NUH-CUDL-001",
    motif: "⛓",
  },
  {
    id: 6,
    no: "NO. 006",
    name: "A Lifetime Supply of Me",
    desc: "Limited edition. Non-refundable. Permanent subscription.",
    sku: "SKU-NUH-ME-∞",
    motif: "🌹",
  },
];

/* ─────────────────────────────────────────────────────────────
   CART STATE
   Persisted to localStorage so it survives page refresh.
   ───────────────────────────────────────────────────────────── */

/** @type {{ id: number, quantity: number }[]} */
let cart = [];

const STORAGE_KEY = "nuha-cart";

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore storage errors in private mode
  }
}

/* ─────────────────────────────────────────────────────────────
   CART HELPERS
   ───────────────────────────────────────────────────────────── */
function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  renderCart();
  updateCartCount();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  renderCart();
  updateCartCount();
}

function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/* ─────────────────────────────────────────────────────────────
   CART RENDER
   Builds the cart sidebar item list from current cart state.
   ───────────────────────────────────────────────────────────── */
function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty-msg");

  if (!cartItemsEl) return;

  // Clear existing items (keep empty message element)
  const oldItems = cartItemsEl.querySelectorAll(".cart-item");
  oldItems.forEach((el) => el.remove());

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "";
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) return;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.setAttribute("role", "listitem");
    itemEl.innerHTML = `
      <div>
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-sku">${product.sku}</p>
      </div>
      <div class="cart-item-qty">
        <button
          class="qty-btn"
          aria-label="Decrease quantity of ${product.name}"
          data-action="decrease"
          data-id="${product.id}"
        >−</button>
        <span class="qty-num" aria-label="Quantity: ${cartItem.quantity}">${cartItem.quantity}</span>
        <button
          class="qty-btn"
          aria-label="Increase quantity of ${product.name}"
          data-action="increase"
          data-id="${product.id}"
        >+</button>
      </div>
      <button
        class="cart-item-remove"
        aria-label="Remove ${product.name} from cart"
        data-id="${product.id}"
      >✕</button>
    `;
    cartItemsEl.appendChild(itemEl);

    // Qty buttons
    itemEl.querySelector('[data-action="decrease"]').addEventListener("click", () =>
      changeQty(product.id, -1)
    );
    itemEl.querySelector('[data-action="increase"]').addEventListener("click", () =>
      changeQty(product.id, 1)
    );
    itemEl.querySelector(".cart-item-remove").addEventListener("click", () =>
      removeFromCart(product.id)
    );
  });
}

/* ─────────────────────────────────────────────────────────────
   CART COUNT BADGE
   ───────────────────────────────────────────────────────────── */
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;
  const total = getTotalItems();
  countEl.textContent = total;
  // Animate
  countEl.style.transform = "scale(1.3)";
  setTimeout(() => {
    countEl.style.transform = "scale(1)";
  }, 200);
}

/* ─────────────────────────────────────────────────────────────
   CART OPEN / CLOSE
   ───────────────────────────────────────────────────────────── */
function openCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const backdrop = document.getElementById("cart-backdrop");
  const toggle = document.getElementById("cart-toggle");
  if (!sidebar) return;
  sidebar.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");
  if (backdrop) backdrop.classList.add("active");
  if (toggle) toggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const backdrop = document.getElementById("cart-backdrop");
  const toggle = document.getElementById("cart-toggle");
  if (!sidebar) return;
  sidebar.classList.remove("open");
  sidebar.setAttribute("aria-hidden", "true");
  if (backdrop) backdrop.classList.remove("active");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

/* ─────────────────────────────────────────────────────────────
   ORDER CONFIRMATION
   Hides the store, shows the confirmation section.
   ───────────────────────────────────────────────────────────── */
function placeOrder() {
  if (cart.length === 0) return;

  closeCart();

  // Small delay for cart close animation
  setTimeout(() => {
    const storeSection = document.getElementById("store");
    const orderSection = document.getElementById("order-confirmation");

    if (storeSection) storeSection.style.opacity = "0.4";
    if (orderSection) {
      orderSection.classList.remove("hidden");
      orderSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Clear cart after ordering
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
  }, 400);
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT GRID RENDER
   Injects product cards into #product-grid from products array.
   ───────────────────────────────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "product-card reveal";
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", product.name);
    card.style.transitionDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <p class="product-no">${product.no}</p>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <p class="product-sku">${product.sku}</p>
      <div class="product-price-row">
        <span class="product-price">₹0</span>
        <span class="product-original-price">₹∞</span>
      </div>
      <button
        class="add-to-cart-btn"
        id="atc-${product.id}"
        data-id="${product.id}"
        aria-label="Add ${product.name} to cart"
      >
        ADD TO CART
      </button>
    `;

    grid.appendChild(card);

    // Add to cart button
    card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
      addToCart(product.id);
      // Visual feedback
      const btn = e.currentTarget;
      btn.textContent = "✓ ADDED";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "ADD TO CART";
        btn.classList.remove("added");
      }, 1500);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   SPOTIFY BUTTON
   Opens spotifyPlaylistUrl in a new tab.
   ───────────────────────────────────────────────────────────── */
function initPlaylistButton() {
  const btn = document.getElementById("playlist-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (spotifyPlaylistUrl && spotifyPlaylistUrl !== "PASTE SPOTIFY LINK HERE") {
      window.open(spotifyPlaylistUrl, "_blank", "noopener,noreferrer");
    } else {
      // Friendly reminder if URL not set
      alert(
        "♡ Playlist link not set yet!\n\nOpen script.js and paste your Spotify playlist URL into:\n\nconst spotifyPlaylistUrl = \"...\""
      );
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   VINYL RECORD INTERACTION
   Spins the vinyl on hover/click.
   ───────────────────────────────────────────────────────────── */
function initVinyl() {
  const vinyl = document.querySelector(".vinyl-disc");
  if (!vinyl) return;
  vinyl.addEventListener("click", () => vinyl.classList.toggle("playing"));
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
   Adds .revealed class to .reveal elements when they enter the viewport.
   ───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!("IntersectionObserver" in window)) {
    // Fallback: just show everything
    elements.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   KEYBOARD ACCESSIBILITY
   Close cart on Escape key.
   ───────────────────────────────────────────────────────────── */
function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
}

/* ─────────────────────────────────────────────────────────────
   SECTION REVEAL ON LOAD
   Adds reveal class to section headers & other key elements.
   ───────────────────────────────────────────────────────────── */
function addRevealClasses() {
  // Section headers
  document.querySelectorAll(".section-header, .playlist-content, .birthday-header, .birthday-letter, .playlist-text").forEach((el) => {
    el.classList.add("reveal");
  });

  // Moodboard cards stagger
  const moodGrid = document.querySelector(".moodboard-grid");
  if (moodGrid) moodGrid.classList.add("reveal-stagger");
}

/* ─────────────────────────────────────────────────────────────
   INIT — runs after DOM is ready
   ───────────────────────────────────────────────────────────── */
function init() {
  loadCart();
  addRevealClasses();
  renderProducts();
  renderCart();
  updateCartCount();

  /* Cart toggle */
  document.getElementById("cart-toggle")?.addEventListener("click", openCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document.getElementById("cart-backdrop")?.addEventListener("click", closeCart);

  /* Place order */
  document.getElementById("place-order-btn")?.addEventListener("click", placeOrder);

  /* Spotify playlist button */
  initPlaylistButton();

  /* Vinyl */
  initVinyl();

  /* Scroll reveal */
  initScrollReveal();

  /* Keyboard nav */
  initKeyboard();
}

/* Wait for DOM */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
