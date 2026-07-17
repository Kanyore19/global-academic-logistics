// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Inquiry form — submits to Netlify Forms so submissions reach the admin dashboard/email
const form = document.getElementById('inquiryForm');
const formNote = document.getElementById('formNote');

function encodeFormData(formElement) {
  return new URLSearchParams(new FormData(formElement)).toString();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Honeypot: a hidden field real visitors never fill in. If it's populated,
  // the submission came from an automated bot — silently drop it.
  const honeypot = document.getElementById('company');
  if (honeypot && honeypot.value.trim() !== '') {
    form.reset();
    return;
  }

  if (!form.checkValidity()) {
    formNote.textContent = 'Please fill in your name and email so we can reach you.';
    formNote.style.color = '#B0413E';
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formNote.textContent = 'Sending…';
  formNote.style.color = '';

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormData(form)
  })
    .then(() => {
      formNote.textContent = 'Thanks — your request has been received. We\'ll be in touch within one business day.';
      formNote.style.color = '#2E6B4F';
      form.reset();
    })
    .catch(() => {
      formNote.textContent = 'Something went wrong sending this. Please try again, or reach us directly via WhatsApp/Telegram below.';
      formNote.style.color = '#B0413E';
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
