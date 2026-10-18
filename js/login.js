/* Login page (demo only - any username and password is accepted). */

const loginFormElement = document.getElementById('loginFormElement');
const loginForm = document.getElementById('loginForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const loginBtn = document.getElementById('loginBtn');

loginFormElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  errorMessage.classList.remove('active');

  if (!username || !password) {
    errorMessage.textContent = 'Please fill in all fields';
    errorMessage.classList.add('active');
    return;
  }

  // Stop double submissions and pretend to process the order
  loginBtn.disabled = true;
  loginBtn.textContent = 'Processing...';
  setTimeout(() => showSuccessMessage(username), 800);
});

function showSuccessMessage(email) {
  const orderId = 'ORD-' + Math.random().toString(36).slice(2, 11).toUpperCase();

  document.getElementById('orderId').textContent = orderId;
  document.getElementById('orderEmail').textContent = email;

  loginForm.classList.add('hidden');
  successMessage.classList.add('active');
}

/* Called by the "Continue shopping" button on the success screen */
function redirectToHome() {
  window.location.href = '../index.html';
}
