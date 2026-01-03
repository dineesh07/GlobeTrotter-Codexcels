import { registerUser } from '../services/auth';

export const Signup = () => {
  const container = document.createElement('div');
  container.className = 'auth-container';

  container.innerHTML = `
    <div class="card auth-card">
      <div style="margin-bottom: 1.5rem; text-align: left;">
        <a href="#" id="back-home" style="font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Home
        </a>
      </div>
      <h2>Start Your Adventure</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Create an account to build your dream itinerary.</p>
      
      <form id="signup-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <input type="text" id="first-name" placeholder="First Name" required />
            <input type="text" id="last-name" placeholder="Last Name" required />
        </div>
        <input type="email" id="email" placeholder="Email Address" required />
        <input type="text" id="phone" placeholder="Phone Number" />
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <input type="text" id="city" placeholder="City" />
            <input type="text" id="country" placeholder="Country" />
        </div>
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit" class="btn" style="width: 100%;">Sign Up</button>
      </form>
      
      <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
        Already have an account? <a href="#" id="go-to-login">Log in</a>
      </p>
      <div id="error-message" style="color: #ef4444; margin-top: 1rem; display: none;"></div>
    </div>
  `;

  const form = container.querySelector('#signup-form');
  const errorMsg = container.querySelector('#error-message');
  const loginLink = container.querySelector('#go-to-login');
  const backBtn = container.querySelector('#back-home');

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.navigateTo('home');
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.navigateTo('login');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#email').value;
    const password = container.querySelector('#password').value;

    const firstName = container.querySelector('#first-name').value;
    const lastName = container.querySelector('#last-name').value;
    const phone = container.querySelector('#phone').value;
    const city = container.querySelector('#city').value;
    const country = container.querySelector('#country').value;

    const btn = container.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Creating Account...';
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
      await registerUser(email, password, {
        firstName, lastName, phone, city, country
      });
      // Auth observer in main.js will handle redirect
    } catch (error) {
      console.error(error);
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });

  return container;
};
