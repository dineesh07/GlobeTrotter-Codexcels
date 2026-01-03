import { loginUser } from '../services/auth';

export const Login = () => {
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
      <h2>Welcome Back</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Log in to continue planning your journey.</p>
      
      <form id="login-form">
        <input type="email" id="email" placeholder="Email Address" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit" class="btn" style="width: 100%;">Log In</button>
      </form>
      
      <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
        Don't have an account? <a href="#" id="go-to-signup">Sign up</a>
      </p>
      <div id="error-message" style="color: #ef4444; margin-top: 1rem; display: none;"></div>
    </div>
  `;

  // Attach Styles for this component specifically if needed, 
  // but global styles should cover it.

  const form = container.querySelector('#login-form');
  const errorMsg = container.querySelector('#error-message');
  const signupLink = container.querySelector('#go-to-signup');
  const backBtn = container.querySelector('#back-home');

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.navigateTo('home');
  });

  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.navigateTo('signup');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#email').value;
    const password = container.querySelector('#password').value;

    // Simple UI feedback
    const btn = container.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Logging in...';
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
      await loginUser(email, password);
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
