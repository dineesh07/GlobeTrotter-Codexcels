import { getTrip } from '../services/firestore';
import { renderBudgetChart } from '../components/budgetChart';

export const PublicTrip = (user, params) => {
  const container = document.createElement('div');
  container.className = 'public-trip-container';
  const tripId = params.tripId;

  if (!tripId) {
    container.innerHTML = '<p class="error">Trip ID missing.</p>';
    return container;
  }

  container.innerHTML = `
    <div style="padding: 2rem; padding-bottom: 5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
         <div style="display: flex; align-items: center; gap: 1rem;">
             <button id="back-btn" class="btn btn-secondary" style="padding: 0.5rem 1rem;">&larr; Back</button>
             <span style="font-weight: bold; font-size: 1.2rem;">GlobeTrotter</span>
         </div>
         <button id="login-btn" class="btn btn-secondary">Create Your Own Trip</button>
      </div>

      <div id="loading-indicator">Loading Trip...</div>
      
      <div id="trip-content" style="display: none;">
        <header id="trip-header" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding: 2rem; border-radius: var(--radius-lg); position: relative; overflow: hidden; color: white;">
           <div class="header-overlay" style="position: absolute; inset: 0; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)); z-index: 0;"></div>
           <div style="position: relative; z-index: 1; text-align: center;">
             <h1 id="trip-name" style="margin-bottom: 0.5rem; font-size: 2.5rem; text-shadow: 0 2px 4px black;"></h1>
             <p id="trip-dates" style="opacity: 0.9; font-size: 1.1rem;"></p>
             <p id="trip-desc" style="font-style: italic; opacity: 0.8; margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto;"></p>
           </div>
        </header>

        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: 768px) { grid-template-columns: 2fr 1fr; }">
          <!-- Left: Itinerary Timeline -->
          <div>
            <h2 style="margin-bottom: 1.5rem;">Itinerary</h2>
            <div id="stops-list" style="display: flex; flex-direction: column; gap: 1rem;">
               <!-- Stops will go here -->
            </div>
          </div>

          <!-- Right: Summary -->
          <div>
             <div class="card" style="position: sticky; top: 1rem;">
               <h3>Trip Overview</h3>
               <div style="position: relative; height: 300px; width: 100%; max-width: 300px; margin: 0 auto 1rem auto;">
                  <canvas id="budget-chart"></canvas>
               </div>
               <ul style="padding-left: 1.2rem; color: var(--text-muted);">
                 <li>Duration: <span id="duration-days">0</span> days</li>
                 <li>Stops: <span id="stops-count">0</span></li>
                 <li>Total Est. Cost: <span id="trip-budget" style="color: var(--primary-color); font-weight: bold;">₹0</span></li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- Logic ---
  const loginBtn = container.querySelector('#login-btn');
  loginBtn.onclick = () => window.navigateTo('login');

  const backBtn = container.querySelector('#back-btn');
  backBtn.onclick = () => window.navigateTo('community');

  const content = container.querySelector('#trip-content');
  const loading = container.querySelector('#loading-indicator');
  const stopsList = container.querySelector('#stops-list');

  const loadData = async () => {
    try {
      const trip = await getTrip(tripId);

      if (trip.imageUrl) {
        container.querySelector('#trip-header').style.background = `url('${trip.imageUrl}') center/cover no-repeat`;
      } else {
        container.querySelector('#trip-header').style.background = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`;
        container.querySelector('.header-overlay').style.display = 'block';
        container.querySelector('#trip-header').style.color = 'white';
      }

      container.querySelector('#trip-name').textContent = trip.name;
      container.querySelector('#trip-dates').textContent = `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`;
      container.querySelector('#trip-desc').textContent = trip.description || '';

      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      container.querySelector('#duration-days').textContent = days;
      container.querySelector('#trip-budget').textContent = `₹${(trip.budget || 0).toLocaleString()}`;

      // Render Stops
      if (!trip.stops || trip.stops.length === 0) {
        stopsList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No stops in this trip.</p>';
      } else {
        trip.stops.sort((a, b) => new Date(a.arrival) - new Date(b.arrival));
        container.querySelector('#stops-count').textContent = trip.stops.length;

        stopsList.innerHTML = trip.stops.map((stop, index) => {
          const activitiesHtml = (stop.activities || []).map(act => `
                <div style="background: rgba(255,255,255,0.05); padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <span>${act.name} <small style="color: var(--text-muted);">(${act.type})</small></span>
                </div>
            `).join('');

          return `
              <div class="card" style="border-left: 4px solid var(--secondary-color);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                   <h3 style="margin: 0;">${stop.city}</h3>
                   <span style="font-size: 0.9rem; color: var(--text-muted);">
                     ${new Date(stop.arrival).toLocaleDateString()} - ${new Date(stop.departure).toLocaleDateString()}
                   </span>
                </div>
                <div style="margin-top: 1rem;">
                   ${activitiesHtml}
                </div>
              </div>
            `;
        }).join('');

        // Render Chart
        requestAnimationFrame(() => {
          const canvas = container.querySelector('#budget-chart');
          // Ensure the parent has relative positioning for Chart.js responsiveness
          canvas.parentElement.style.position = 'relative';
          renderBudgetChart(canvas, trip.stops);
        });
      }

      loading.style.display = 'none';
      content.style.display = 'block';
    } catch (error) {
      console.error(error);
      loading.innerHTML = '<p style="color: #ef4444;">Error loading trip. It may not exist or is private.</p>';
    }
  };

  loadData();

  return container;
};
