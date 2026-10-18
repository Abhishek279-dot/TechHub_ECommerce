/* Home page: sliders, product dropdown, cart sidebar, search and scrolling.
   Needs js/cart.js to be loaded first. */

const LOGIN_URL = 'pages/login.html';

/* ---------- Sliders ---------- */

if (typeof Swiper === 'function') {
  new Swiper('.top-slider', {
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 2500, disableOnInteraction: false },
    navigation: {
      nextEl: '.top-slider .swiper-button-next',
      prevEl: '.top-slider .swiper-button-prev',
    },
  });

  new Swiper('.banner-image-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 800,
    autoplay: { delay: 2000, disableOnInteraction: false },
    pagination: { el: '.banner-image-pagination', clickable: true },
    navigation: {
      nextEl: '.banner-image-swiper .swiper-button-next',
      prevEl: '.banner-image-swiper .swiper-button-prev',
    },
  });
}

/* ---------- Cart sidebar ---------- */

const cartSidebar = document.getElementById('cartSidebar');
const cartBadge = document.getElementById('cartCount');
const cartItemsBox = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');

function renderCart({ animate = true } = {}) {
  cartBadge.textContent = cart.count;
  cartTotalEl.textContent = cart.total;

  if (animate) {
    cartBadge.classList.add('updated');
    setTimeout(() => cartBadge.classList.remove('updated'), 600);
  }

  if (cart.items.length === 0) {
    cartItemsBox.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    return;
  }

  cartItemsBox.innerHTML = cart.items
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
        <div class="item-details">
          <h4 class="item-name">${escapeHtml(item.name)}</h4>
          <p class="item-price">₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
          <div class="quantity-controls">
            <button class="qty-btn" data-action="cart-decrease" data-id="${escapeHtml(item.id)}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="cart-increase" data-id="${escapeHtml(item.id)}">+</button>
            <button class="remove-btn" data-action="cart-remove" data-id="${escapeHtml(item.id)}">🗑️</button>
          </div>
        </div>
      </div>`
    )
    .join('');
}

function addProductFromCard(card, button) {
  const { id, name, price, image } = card.dataset;
  const item = cart.add({ id, name, price, image });

  showNotification(
    item.quantity > 1 ? `${name} quantity updated! (${item.quantity})` : `${name} added to cart!`
  );
  renderCart();

  button.classList.add('added');
  button.textContent = 'Added! ✓';
  setTimeout(() => {
    button.classList.remove('added');
    button.textContent = 'Add to Cart';
  }, 2000);
}

function checkout() {
  if (cart.items.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert(`Checkout successful! Total: ₹${cart.total}\nThank you for shopping with TechHub India!`);
  cart.clear();
  renderCart({ animate: false });
  cartSidebar.classList.remove('open');
}

/* ---------- Click handling (one listener for the whole page) ---------- */

const deviceDropdown = document.getElementById('deviceDropdown');

document.addEventListener('click', (event) => {
  const actionEl = event.target.closest('[data-action]');
  const action = actionEl?.dataset.action;
  const card = event.target.closest('.product-card');

  // Close the product dropdown when clicking anywhere outside it
  if (!event.target.closest('.dropdown')) {
    deviceDropdown.classList.remove('open');
  }

  switch (action) {
    case 'toggle-cart':
      event.preventDefault();
      cartSidebar.classList.toggle('open');
      return;
    case 'checkout':
      checkout();
      return;
    case 'cart-increase':
      cart.changeQuantity(actionEl.dataset.id, 1);
      renderCart({ animate: false });
      return;
    case 'cart-decrease':
      cart.changeQuantity(actionEl.dataset.id, -1);
      renderCart({ animate: false });
      return;
    case 'cart-remove':
      cart.remove(actionEl.dataset.id);
      renderCart({ animate: false });
      showNotification('Item removed from cart', 'error');
      return;
    case 'toggle-dropdown':
      deviceDropdown.classList.toggle('open');
      return;
    case 'scroll-top':
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    case 'add-to-cart':
      addProductFromCard(card, actionEl);
      return;
    case 'buy-now':
      window.location.href = LOGIN_URL;
      return;
  }

  // Clicking anywhere else on a product card opens its detail page
  if (card) window.location.href = card.dataset.href;
});

/* ---------- Scroll-to-top button ---------- */

const scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});

/* ---------- Product search ---------- */

const searchInput = document.getElementById('productSearch');
const searchBtn = document.getElementById('searchBtn');

// Words a customer might type -> a word that appears in the product titles
const SEARCH_ALIASES = {
  speaker: ['audio', 'music', 'sound', 'bass'],
  cable: ['cabal', 'usb', 'wire', 'typec'],
  holder: ['stand'],
  earbuds: ['buds'],
  powerbank: ['battery', 'portablecharger'],
  charger: ['adapter'],
  gopro: ['camera'],
  s25: ['samsung', 'galaxy'],
};

const normalize = (text) => text.toLowerCase().replace(/[\s-]/g, '');

function resolveSearchTerm(query) {
  const term = normalize(query);
  for (const [word, aliases] of Object.entries(SEARCH_ALIASES)) {
    if (aliases.includes(term)) return word;
  }
  return term;
}

function performSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    showNotification('Please type something to search', 'error');
    return;
  }

  const term = resolveSearchTerm(query);
  const match = [...document.querySelectorAll('.product-card')].find((card) => {
    const title = normalize(card.querySelector('.product-title').textContent);
    return title.includes(normalize(query)) || title.includes(term);
  });

  if (!match) {
    showNotification('Product not found! Try: speaker, cable, holder, earbuds, watch, charger', 'error');
  } else {
    document.querySelectorAll('.search-blink').forEach((card) => card.classList.remove('search-blink'));
    match.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Start the blink after the scroll has finished
    setTimeout(() => {
      match.classList.add('search-blink');
      setTimeout(() => match.classList.remove('search-blink'), 2400);
    }, 1000);
    showNotification(`Found: ${match.querySelector('.product-title').textContent}`);
  }

  searchInput.value = '';
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') performSearch();
});

/* ---------- Start ---------- */

renderCart({ animate: false });
