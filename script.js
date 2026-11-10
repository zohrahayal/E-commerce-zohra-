const defaultProducts = [
  {id:1,name:"Classic Everyday Tote",category:"Fashion",price:189,oldPrice:229,rating:4.8,badge:"Bestseller",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Minimal Gold Watch",category:"Fashion",price:349,oldPrice:399,rating:4.7,badge:"Popular",image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Soft Knit Sweater",category:"Fashion",price:279,oldPrice:0,rating:4.6,badge:"New",image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Wireless Headphones",category:"Electronics",price:499,oldPrice:599,rating:4.9,badge:"Top rated",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Smart Watch",category:"Electronics",price:429,oldPrice:0,rating:4.5,badge:"New",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Portable Speaker",category:"Electronics",price:259,oldPrice:299,rating:4.6,badge:"Sale",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Daily Glow Skincare Set",category:"Beauty",price:219,oldPrice:0,rating:4.8,badge:"Bestseller",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Rose Beauty Serum",category:"Beauty",price:139,oldPrice:169,rating:4.7,badge:"Sale",image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80"},
  {id:9,name:"Ceramic Coffee Set",category:"Home",price:179,oldPrice:0,rating:4.9,badge:"Lovely pick",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80"},
  {id:10,name:"Cozy Table Lamp",category:"Home",price:299,oldPrice:349,rating:4.5,badge:"Sale",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"},
  {id:11,name:"Soft Cushion Cover",category:"Home",price:89,oldPrice:0,rating:4.4,badge:"New",image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80"},
  {id:12,name:"Yoga Mat",category:"Sports",price:159,oldPrice:189,rating:4.8,badge:"Popular",image:"https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=700&q=80"},
  {id:13,name:"Reusable Water Bottle",category:"Sports",price:99,oldPrice:0,rating:4.6,badge:"Everyday",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"},
  {id:14,name:"Running Sneakers",category:"Sports",price:389,oldPrice:449,rating:4.7,badge:"Sale",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
  {id:15,name:"Sunglasses",category:"Fashion",price:149,oldPrice:0,rating:4.5,badge:"Summer",image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"},
  {id:16,name:"Desk Organizer",category:"Home",price:119,oldPrice:139,rating:4.3,badge:"Useful",image:"https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=80"}
];
const PRODUCTS_KEY = "zohaProducts", USERS_KEY = "zohaUsers", ORDERS_KEY = "zohaOrders";
let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "null") ||
  defaultProducts.map(p => ({...p, description: `A carefully selected ${p.name.toLowerCase()} from our ${p.category} collection. Quality-first, made for everyday life.`}));

const $ = (selector) => document.querySelector(selector);
const productsContainer = $("#productsContainer");
let activeCategory = "All";
let searchTerm = "";
let showingWishlist = false;
let cart = JSON.parse(localStorage.getItem("zohaCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("zohaWishlist") || "[]");
let session = JSON.parse(localStorage.getItem("zohaSession") || "null");
let authMode = "login";
let notificationTimer;

function shuffleProducts(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
let randomizedProducts = shuffleProducts(products);
function syncProducts() { randomizedProducts = shuffleProducts(products); renderProducts(); }

function formatPrice(price) { return `${price.toLocaleString("en-US")} DH`; }
function showNotification(message) {
  const note = $("#notification");
  note.textContent = message;
  note.classList.add("show");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => note.classList.remove("show"), 2400);
}
function currentProducts() {
  let list = showingWishlist ? products.filter(p => wishlist.includes(p.id)) : [...randomizedProducts];
  if (!showingWishlist && activeCategory !== "All") list = list.filter(p => p.category === activeCategory);
  if (searchTerm) list = list.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(searchTerm));
  const sort = $("#sortSelect").value;
  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  if (sort === "rating") list.sort((a,b) => b.rating-a.rating);
  return list;
}
function renderProducts() {
  const list = currentProducts();
  productsContainer.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/600x600/F3E6D5/800020?text=ZohaHayal'">
        <span class="product-badge">${product.badge}</span>
        <button class="quick-btn" data-preview="${product.id}"><i class="fa-regular fa-eye"></i> Quick view</button>
        <button class="heart-btn ${wishlist.includes(product.id) ? "active" : ""}" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist"><i class="fa-${wishlist.includes(product.id) ? "solid" : "regular"} fa-heart"></i></button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 data-preview="${product.id}">${product.name}</h3>
        <div class="rating">★★★★★ <span>${product.rating}</span></div>
        <div class="product-bottom"><div><span class="price">${formatPrice(product.price)}</span>${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}</div><button class="add-btn" data-add="${product.id}" aria-label="Add ${product.name} to cart"><i class="fa-solid fa-plus"></i></button></div>
      </div>
    </article>`).join("");
  $("#resultsCount").textContent = `Showing ${list.length} product${list.length === 1 ? "" : "s"}${showingWishlist ? " in your wishlist" : ""}`;
  $("#noResults").hidden = list.length !== 0;
  $("#clearSearch").hidden = !searchTerm && !showingWishlist;
}
function setCategory(category) {
  activeCategory = category;
  showingWishlist = false;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.category === category));
  renderProducts();
}
function saveCart() { localStorage.setItem("zohaCart", JSON.stringify(cart)); }
function updateCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  $("#cartCount").textContent = count;
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  $("#cartTotal").textContent = formatPrice(total);
  if (!cart.length) {
    $("#cartItems").innerHTML = '<p class="empty-cart">Your cart is empty. Find something you love!</p>';
  } else {
    $("#cartItems").innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div><h4>${item.name}</h4><p>${formatPrice(item.price)}</p>
          <div class="quantity"><button data-qty="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="1" data-id="${item.id}" aria-label="Increase quantity">+</button></div>
        </div>
        <button class="remove-item" data-remove="${item.id}" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>
      </div>`).join("");
  }
}
function addToCart(id, qty = 1) {
  const product = products.find(p => p.id === Number(id));
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += qty;
  else cart.push({...product, quantity:qty});
  saveCart(); updateCart(); showNotification(`${product.name} added to your cart`);
}
function openCart() { $("#cartSidebar").classList.add("open"); $("#cartOverlay").classList.add("open"); }
function closeCart() { $("#cartSidebar").classList.remove("open"); $("#cartOverlay").classList.remove("open"); }
function toggleWishlist(id) {
  id = Number(id);
  if (wishlist.includes(id)) wishlist = wishlist.filter(item => item !== id);
  else wishlist.push(id);
  localStorage.setItem("zohaWishlist", JSON.stringify(wishlist));
  renderProducts();
  showNotification(wishlist.includes(id) ? "Added to your wishlist" : "Removed from your wishlist");
}
function openAuth(mode = "login") {
  setAuthMode(mode); $("#authModal").hidden = false; $("#authMessage").textContent = "";
}
function closeAuth() { $("#authModal").hidden = true; }
function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  $("#authTitle").textContent = registering ? "Create your account" : "Welcome back!";
  $("#authDescription").textContent = registering ? "Join the ZohaHayal community." : "Login to your account.";
  $("#nameField").hidden = !registering;
  $("#fullName").required = registering;
  $("#authSubmit").textContent = registering ? "Create account" : "Login";
  $("#showLogin").classList.toggle("active", !registering);
  $("#showRegister").classList.toggle("active", registering);
}
function updateUserLabel() {
  $("#userLabel").textContent = session?.name ? session.name.split(" ")[0] : "Login";
  $("#logoutBtn").hidden = !session;
  $("#adminBtn").hidden = !(session && session.role === "admin");
}

$("#filterButtons").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});
document.querySelectorAll("[data-category-jump]").forEach(button => button.addEventListener("click", () => {
  setCategory(button.dataset.categoryJump);
  $("#products").scrollIntoView({behavior:"smooth"});
}));
productsContainer.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const heart = event.target.closest("[data-wishlist]");
  const prev = event.target.closest("[data-preview]");
  if (add) addToCart(add.dataset.add);
  if (heart) toggleWishlist(heart.dataset.wishlist);
  if (prev && !add && !heart) openPreview(prev.dataset.preview);
});
$("#searchForm").addEventListener("submit", event => {
  event.preventDefault(); searchTerm = $("#searchInput").value.trim().toLowerCase();
  showingWishlist = false; renderProducts(); $("#products").scrollIntoView({behavior:"smooth"});
});
$("#searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase(); showingWishlist = false; renderProducts();
});
$("#clearSearch").addEventListener("click", () => {
  searchTerm = ""; $("#searchInput").value = ""; showingWishlist = false; renderProducts();
});
$("#sortSelect").addEventListener("change", renderProducts);
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);
$("#cartItems").addEventListener("click", event => {
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");
  if (qty) {
    const item = cart.find(p => p.id === Number(qty.dataset.id));
    item.quantity += Number(qty.dataset.qty);
    if (item.quantity <= 0) cart = cart.filter(p => p.id !== item.id);
    saveCart(); updateCart();
  }
  if (remove) { cart = cart.filter(p => p.id !== Number(remove.dataset.remove)); saveCart(); updateCart(); }
});
$("#wishlistBtn").addEventListener("click", () => {
  showingWishlist = true; activeCategory = "All"; searchTerm = ""; $("#searchInput").value = "";
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.category === "All"));
  renderProducts(); $("#products").scrollIntoView({behavior:"smooth"});
});
$("#loginBtn").addEventListener("click", () => session ? showNotification(`Hello, ${session.name}!`) : openAuth("login"));
$("#closeAuth").addEventListener("click", closeAuth);
$("#authModal").addEventListener("click", event => { if (event.target === $("#authModal")) closeAuth(); });
$("#showLogin").addEventListener("click", () => setAuthMode("login"));
$("#showRegister").addEventListener("click", () => setAuthMode("register"));
// ---- Accounts (client-side demo: use a real backend before going live) ----
const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
async function hashPw(pw, email) {
  if (!(window.crypto && crypto.subtle)) return btoa(unescape(encodeURIComponent(email + pw)));
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`zoha|${email}|${pw}`));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
async function ensureAdmin() {
  if (getUsers().some(u => u.role === "admin")) return;
  const email = "admin@zohahayal.com";
  saveUsers([...getUsers(), {name: "Admin", email, role: "admin", hash: await hashPw("Admin@123", email), created: Date.now()}]);
}
$("#authForm").addEventListener("submit", async event => {
  event.preventDefault();
  const email = $("#authEmail").value.trim().toLowerCase(), password = $("#authPassword").value, name = $("#fullName").value.trim();
  const msg = $("#authMessage"), users = getUsers();
  if (authMode === "register") {
    if (!name) { msg.textContent = "Please enter your name."; return; }
    if (users.some(u => u.email === email)) { msg.textContent = "This email is already registered."; return; }
    saveUsers([...users, {name, email, role: "customer", hash: await hashPw(password, email), created: Date.now()}]);
    session = {name, email, role: "customer"};
  } else {
    const user = users.find(u => u.email === email);
    if (!user || user.hash !== await hashPw(password, email)) { msg.textContent = "Incorrect email or password."; return; }
    session = {name: user.name, email, role: user.role};
  }
  localStorage.setItem("zohaSession", JSON.stringify(session));
  updateUserLabel(); closeAuth(); $("#authForm").reset();
  showNotification(session.role === "admin" ? "Welcome, admin!" : `Welcome, ${session.name.split(" ")[0]}!`);
});
$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) { showNotification("Your cart is empty."); return; }
  closeCart();
  if (!session) { openAuth("login"); $("#authMessage").textContent = "Please login to place your order."; return; }
  $("#ckName").value = session.name; $("#checkoutModal").hidden = false;
});
$("#closeCheckout").addEventListener("click", () => $("#checkoutModal").hidden = true);
$("#checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  const order = {
    id: "ZH-" + (1001 + orders.length), date: Date.now(), email: session.email,
    customer: $("#ckName").value.trim(), phone: $("#ckPhone").value.trim(), city: $("#ckCity").value.trim(), address: $("#ckAddress").value.trim(),
    items: cart.map(i => ({id: i.id, name: i.name, price: i.price, quantity: i.quantity})),
    total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0), status: "Pending"
  };
  orders.push(order); localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  cart = []; saveCart(); updateCart(); $("#checkoutModal").hidden = true; event.target.reset();
  showNotification(`Order ${order.id} placed. Pay on delivery!`);
});
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault(); showNotification("Thank you for subscribing!"); event.target.reset();
});
$("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
$("#navLinks").addEventListener("click", event => { if (event.target.closest("a")) $("#navLinks").classList.remove("open"); });
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeAuth(); closeCart(); } });

renderProducts(); updateCart(); updateUserLabel(); ensureAdmin();

/* ===== Product preview, logout and admin dashboard ===== */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const getOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
const saveProducts = () => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
// Re-checks the role against the user store (client-side only; real security needs a server).
const isAdmin = () => !!session && getUsers().some(u => u.email === session.email && u.role === "admin");

/* ---------- Product preview ---------- */
let previewQty = 1, previewId = null;
function openPreview(id) {
  const p = products.find(x => x.id === Number(id));
  if (!p) return;
  previewId = p.id; previewQty = 1;
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const liked = wishlist.includes(p.id);
  $("#previewBody").innerHTML = `
    <div class="preview-grid">
      <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.src='https://placehold.co/600x600/F3E6D5/800020?text=ZohaHayal'">
      <div class="preview-info">
        <span class="product-category">${esc(p.category)}</span>
        <h2>${esc(p.name)}</h2>
        <div class="rating">★★★★★ <span>${esc(p.rating)}</span></div>
        <p class="preview-price"><strong>${formatPrice(p.price)}</strong>${p.oldPrice ? ` <span class="old-price">${formatPrice(p.oldPrice)}</span> <em>-${off}%</em>` : ""}</p>
        <p class="preview-desc">${esc(p.description || "")}</p>
        <div class="preview-actions">
          <div class="quantity"><button id="pvMinus" aria-label="Decrease">−</button><span id="pvQty">1</span><button id="pvPlus" aria-label="Increase">+</button></div>
          <button class="primary-btn" id="pvAdd"><i class="fa-solid fa-bag-shopping"></i> Add to cart</button>
          <button class="pv-heart ${liked ? "active" : ""}" id="pvHeart" aria-label="Wishlist"><i class="fa-${liked ? "solid" : "regular"} fa-heart"></i></button>
        </div>
      </div>
    </div>`;
  $("#previewModal").hidden = false;
}
const closePreview = () => $("#previewModal").hidden = true;
$("#closePreview").addEventListener("click", closePreview);
$("#previewModal").addEventListener("click", e => { if (e.target === $("#previewModal")) closePreview(); });
$("#previewBody").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.id === "pvMinus") previewQty = Math.max(1, previewQty - 1);
  if (b.id === "pvPlus") previewQty = Math.min(20, previewQty + 1);
  if (b.id === "pvAdd") { addToCart(previewId, previewQty); closePreview(); openCart(); return; }
  if (b.id === "pvHeart") { toggleWishlist(previewId); openPreview(previewId); return; }
  $("#pvQty").textContent = previewQty;
});

/* ---------- Logout ---------- */
$("#logoutBtn").addEventListener("click", () => {
  session = null; localStorage.removeItem("zohaSession");
  updateUserLabel(); closeAdmin(); showNotification("You have been logged out.");
});

/* ---------- Admin dashboard ---------- */
let adminTab = "overview", editingId = null;
$("#adminBtn").addEventListener("click", openAdmin);
document.addEventListener("keydown", e => { if (e.key === "Escape") { closePreview(); $("#checkoutModal").hidden = true; } });

function openAdmin() {
  if (!isAdmin()) { showNotification("Admin access only."); return; }
  $("#adminPanel").hidden = false; document.body.style.overflow = "hidden"; renderAdmin();
}
function closeAdmin() { $("#adminPanel").hidden = true; document.body.style.overflow = ""; }

function orderTable(list, editable) {
  if (!list.length) return '<p class="muted">No orders yet.</p>';
  return `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>${list.map(o => `
    <tr><td>${esc(o.id)}</td><td>${new Date(o.date).toLocaleDateString()}</td>
    <td>${esc(o.customer)}<br><small>${esc(o.phone)} · ${esc(o.city)}</small><br><small>${esc(o.address)}</small></td>
    <td>${o.items.map(i => `${esc(i.name)} ×${i.quantity}`).join("<br>")}</td><td>${formatPrice(o.total)}</td>
    <td>${editable ? `<select data-order="${esc(o.id)}">${["Pending","Shipped","Delivered","Cancelled"].map(s => `<option${s === o.status ? " selected" : ""}>${s}</option>`).join("")}</select>` : `<span class="status ${esc(o.status)}">${esc(o.status)}</span>`}</td></tr>`).join("")}</tbody></table></div>`;
}

function productForm() {
  const p = products.find(x => x.id === editingId) || {category: "Fashion"};
  const cats = ["Fashion","Electronics","Beauty","Home","Sports"];
  return `<form id="productForm" class="admin-form"><h3>${editingId ? "Edit product" : "Add product"}</h3>
    <label>Name<input name="name" required value="${esc(p.name)}"></label>
    <label>Category<select name="category">${cats.map(c => `<option${c === p.category ? " selected" : ""}>${c}</option>`).join("")}</select></label>
    <div class="row"><label>Price (DH)<input name="price" type="number" min="1" step="1" required value="${esc(p.price)}"></label>
    <label>Old price (optional)<input name="oldPrice" type="number" min="0" step="1" value="${esc(p.oldPrice || "")}"></label></div>
    <label>Badge<input name="badge" placeholder="New, Sale…" value="${esc(p.badge)}"></label>
    <label>Image URL<input name="image" type="url" required value="${esc(p.image)}"></label>
    <label>Description<textarea name="description" rows="3">${esc(p.description)}</textarea></label>
    <div class="row"><button class="primary-btn" type="submit">${editingId ? "Save changes" : "Add product"}</button>${editingId ? '<button type="button" class="ghost-btn" data-admin-cancel>Cancel</button>' : ""}</div></form>`;
}

function renderAdmin() {
  const orders = getOrders(), users = getUsers();
  const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  let body = "";
  if (adminTab === "overview") {
    body = `<div class="stat-grid">${[["Revenue", formatPrice(revenue)], ["Orders", orders.length], ["Products", products.length], ["Customers", users.filter(u => u.role !== "admin").length]]
      .map(([l, v]) => `<div class="stat"><small>${l}</small><strong>${v}</strong></div>`).join("")}</div><h3>Recent orders</h3>${orderTable(orders.slice(-5).reverse(), false)}`;
  } else if (adminTab === "products") {
    body = `<div class="admin-split">${productForm()}<div class="table-wrap"><table><thead><tr><th></th><th>Product</th><th>Price</th><th></th></tr></thead><tbody>${products.map(p => `
      <tr><td><img class="thumb" src="${esc(p.image)}" alt=""></td><td>${esc(p.name)}<br><small>${esc(p.category)}</small></td><td>${formatPrice(p.price)}</td>
      <td class="actions"><button data-admin-edit="${p.id}" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button data-admin-del="${p.id}" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join("")}</tbody></table></div></div>`;
  } else if (adminTab === "orders") {
    body = orderTable([...orders].reverse(), true);
  } else {
    body = `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th></tr></thead><tbody>${users.map(u => `
      <tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${new Date(u.created).toLocaleDateString()}</td>
      <td><select data-role="${esc(u.email)}"${u.email === session.email ? " disabled" : ""}><option${u.role === "customer" ? " selected" : ""}>customer</option><option${u.role === "admin" ? " selected" : ""}>admin</option></select></td></tr>`).join("")}</tbody></table></div>`;
  }
  $("#adminPanel").innerHTML = `
    <div class="admin-top"><h2><i class="fa-solid fa-gauge-high"></i> Admin dashboard</h2><button data-admin-close aria-label="Close dashboard"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="admin-tabs">${["overview","products","orders","users"].map(t => `<button class="${t === adminTab ? "active" : ""}" data-admin-tab="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}</div>
    <div class="admin-body">${body}</div>`;
}

$("#adminPanel").addEventListener("click", e => {
  if (!isAdmin()) return;
  const t = e.target.closest("[data-admin-tab],[data-admin-close],[data-admin-edit],[data-admin-del],[data-admin-cancel]");
  if (!t) return;
  if (t.dataset.adminClose !== undefined) return closeAdmin();
  if (t.dataset.adminTab) { adminTab = t.dataset.adminTab; editingId = null; }
  if (t.dataset.adminEdit) editingId = Number(t.dataset.adminEdit);
  if (t.dataset.adminCancel !== undefined) editingId = null;
  if (t.dataset.adminDel) {
    const p = products.find(x => x.id === Number(t.dataset.adminDel));
    if (p && confirm(`Delete "${p.name}"?`)) { products = products.filter(x => x.id !== p.id); saveProducts(); syncProducts(); showNotification("Product deleted"); }
  }
  renderAdmin();
});
$("#adminPanel").addEventListener("change", e => {
  if (!isAdmin()) return;
  if (e.target.dataset.order) {
    const orders = getOrders(), o = orders.find(x => x.id === e.target.dataset.order);
    if (o) { o.status = e.target.value; localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); showNotification("Order status updated"); }
  }
  if (e.target.dataset.role) {
    const users = getUsers(), u = users.find(x => x.email === e.target.dataset.role);
    if (u) { u.role = e.target.value; saveUsers(users); showNotification("Role updated"); }
  }
});
$("#adminPanel").addEventListener("submit", e => {
  if (e.target.id !== "productForm" || !isAdmin()) return;
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const data = {name: f.name.trim(), category: f.category, price: Number(f.price), oldPrice: Number(f.oldPrice) || 0, badge: f.badge.trim(), image: f.image.trim(), description: f.description.trim()};
  if (editingId) products = products.map(p => p.id === editingId ? {...p, ...data} : p);
  else products.push({id: Math.max(0, ...products.map(p => p.id)) + 1, rating: 4.5, ...data});
  saveProducts(); syncProducts(); showNotification(editingId ? "Product updated" : "Product added");
  editingId = null; renderAdmin();
});
