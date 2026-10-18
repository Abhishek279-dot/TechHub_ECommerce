const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  contactStatus.textContent =
    'Thanks! Your message is ready to be connected to a support backend.';
  contactForm.reset();
});
