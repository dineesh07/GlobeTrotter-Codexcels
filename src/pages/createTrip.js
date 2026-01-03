import { createTrip } from '../services/firestore';
import { uploadTripImage } from '../services/storage';

export const CreateTrip = (user) => {
  const container = document.createElement('div');
  container.className = 'create-trip-container';

  // Back button functionality
  const goBack = () => window.navigateTo('dashboard');

  container.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto;">
      <button id="back-btn" class="btn btn-secondary" style="margin-bottom: 2rem;">&larr; Back to Dashboard</button>
      
      <div class="card">
        <h2>Plan a New Trip</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Where to next? Start by naming your adventure.</p>
        
        <form id="create-trip-form">
          <div style="margin-bottom: 1rem; text-align: left;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">Trip Name</label>
            <input type="text" id="trip-name" placeholder="e.g. Summer in Europe" required />
          </div>

          <div style="margin-bottom: 1rem; text-align: left;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">Cover Photo</label>
            <input type="file" id="trip-image" accept="image/*" style="width: 100%; padding: 0.5rem; background: rgba(15,23,42,0.5); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-main);" />
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="text-align: left;">
              <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">Start Date</label>
              <input type="date" id="start-date" required />
            </div>
            <div style="text-align: left;">
              <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">End Date</label>
              <input type="date" id="end-date" required />
            </div>
          </div>
          
          <div style="margin-bottom: 1rem; text-align: left;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">Description (Optional)</label>
            <input type="text" id="description" placeholder="A brief note about this trip..." />
          </div>
          
          <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
            <button type="button" id="cancel-btn" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn">Create Trip</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('#create-trip-form');
  const backBtn = container.querySelector('#back-btn');
  const cancelBtn = container.querySelector('#cancel-btn');

  backBtn.onclick = goBack;
  cancelBtn.onclick = goBack;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Uploading & Creating...';
    btn.disabled = true;

    try {
      const imageFile = container.querySelector('#trip-image').files[0];
      let imageUrl = null;

      // 1. Upload Image if present
      if (imageFile) {
        imageUrl = await uploadTripImage(imageFile);
      }

      // 2. Create Trip
      const tripData = {
        name: container.querySelector('#trip-name').value,
        startDate: container.querySelector('#start-date').value,
        endDate: container.querySelector('#end-date').value,
        description: container.querySelector('#description').value,
        imageUrl: imageUrl
      };

      // Race between createTrip and a 10s timeout
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Check your internet connection.")), 20000)
      );

      await Promise.race([
        createTrip(user.uid, tripData),
        timeout
      ]);

      // Success!
      window.navigateTo('dashboard');
    } catch (error) {
      console.error("Trip creation error:", error);
      alert(`Failed to create trip: ${error.message}`);

      // Reset button
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });

  return container;
};
