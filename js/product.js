/* Product detail pages: image gallery, tabs, quantity, add to cart, buy now.
   One script for every product page - the product data is read from the page itself.
   Needs js/cart.js to be loaded first. */

const LOGIN_URL = '../pages/login.html';

const mainImage = document.getElementById('mainImage');
const quantityInput = document.getElementById('quantity');

// The product's own picture (the cart always shows this one, even after clicking a thumbnail).
// Saved relative to the site root (index.html), e.g. images/products/go-pro/gopro1.png
const productImage = mainImage.getAttribute('src').replace('../', '');

/* ---------- Image gallery ---------- */

document.querySelectorAll('.thumbnail').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    mainImage.src = thumb.getAttribute('src');
    mainImage.alt = thumb.alt;
    document.querySelectorAll('.thumbnail').forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

/* ---------- Tabs ---------- */

document.querySelectorAll('.tab-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach((b) => b.classList.remove('active'));
    document.getElementById(button.dataset.tab).classList.add('active');
    button.classList.add('active');
  });
});

/* ---------- Quantity ---------- */

document.querySelectorAll('[data-qty]').forEach((button) => {
  button.addEventListener('click', () => {
    const min = parseInt(quantityInput.min, 10) || 1;
    const max = parseInt(quantityInput.max, 10) || 10;
    const next = (parseInt(quantityInput.value, 10) || 1) + Number(button.dataset.qty);
    quantityInput.value = Math.min(max, Math.max(min, next));
  });
});

/* ---------- Add to cart / Buy now ---------- */

function getProduct() {
  return {
    // The page file name is the product id, so it matches the card on the home page
    id: location.pathname.split('/').pop().replace('.html', '').toLowerCase(),
    name: document.querySelector('.product-name').textContent.trim(),
    price: parseInt(document.querySelector('.current-price').textContent.replace(/\D/g, ''), 10),
    image: productImage,
  };
}

document.querySelector('.add-to-cart-btn').addEventListener('click', (event) => {
  const product = getProduct();
  const quantity = parseInt(quantityInput.value, 10) || 1;
  cart.add(product, quantity);
  showNotification(`${product.name} added to cart!`);

  const button = event.currentTarget;
  button.classList.add('added');
  button.textContent = 'Added! ✓';
  setTimeout(() => {
    button.classList.remove('added');
    button.textContent = 'Add to Cart';
  }, 2000);
});

document.querySelector('.buy-now-btn').addEventListener('click', () => {
  window.location.href = LOGIN_URL;
});
