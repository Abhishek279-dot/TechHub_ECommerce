/* Shared cart logic - used by the home page and every product page.
   The cart is saved in localStorage so it survives page changes. */

const CART_KEY = 'techHubCart';

const cart = {
  items: [],

  load() {
    try {
      const savedItems = JSON.parse(localStorage.getItem(CART_KEY));
      this.items = Array.isArray(savedItems)
        ? savedItems.filter(
            (item) =>
              item &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              Number.isFinite(Number(item.price)) &&
              Number(item.price) >= 0 &&
              Number.isInteger(Number(item.quantity)) &&
              Number(item.quantity) > 0
          ).map((item) => ({
            ...item,
            price: Number(item.price),
            quantity: Number(item.quantity),
          }))
        : [];
    } catch {
      this.items = [];
    }
  },

  save() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    } catch {
      // Keep the in-memory cart usable when storage is blocked or unavailable.
    }
  },

  /** Add a product, or increase its quantity if it is already in the cart. */
  add({ id, name, price, image }, quantity = 1) {
    quantity = Math.max(1, Number.parseInt(quantity, 10) || 1);
    const existing = this.items.find((item) => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ id, name, price: Number(price), image, quantity });
    }
    this.save();
    return existing || this.items[this.items.length - 1];
  },

  changeQuantity(id, change) {
    const item = this.items.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
      this.remove(id);
    } else {
      this.save();
    }
  },

  remove(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  get count() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
};

cart.load();

/** Small toast message at the top-right of the screen. */
function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `cart-notification ${type}`;

  const icon = document.createElement('span');
  icon.textContent = type === 'success' ? '✅' : '❌';

  const text = document.createElement('span');
  text.textContent = message;

  toast.append(icon, text);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/** Make text safe to put inside innerHTML. */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
