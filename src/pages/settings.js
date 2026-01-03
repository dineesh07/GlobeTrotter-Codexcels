import { auth } from '../services/firebase';
import { updateProfile } from "firebase/auth";

export const UserSettings = (user) => {
    const container = document.createElement('div');
    container.className = 'settings-container';

    container.innerHTML = `
    <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
      <button id="back-btn" class="btn btn-secondary" style="margin-bottom: 2rem;">&larr; Back to Dashboard</button>
      
      <div class="card">
        <h2>User Settings</h2>
        
        <form id="settings-form">
           <div style="margin-bottom: 1rem;">
             <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">Display Name</label>
             <input type="text" id="display-name" value="${user.displayName || ''}" placeholder="Your Name" />
           </div>

           <div style="margin-bottom: 1rem;">
             <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">Email</label>
             <input type="email" value="${user.email}" disabled style="opacity: 0.7; cursor: not-allowed;" />
             <small style="color: var(--text-muted);">Email cannot be changed.</small>
           </div>
           
           <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
             <button type="submit" class="btn">Save Changes</button>
           </div>
        </form>
      </div>
    </div>
  `;

    const backBtn = container.querySelector('#back-btn');
    backBtn.onclick = () => window.navigateTo('dashboard');

    const form = container.querySelector('#settings-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const newName = container.querySelector('#display-name').value;
        const btn = form.querySelector('button');

        btn.textContent = "Saving...";
        btn.disabled = true;

        try {
            await updateProfile(auth.currentUser, {
                displayName: newName
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile: " + error.message);
        } finally {
            btn.textContent = "Save Changes";
            btn.disabled = false;
        }
    };

    return container;
};
