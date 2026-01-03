import { getRecentTrips } from '../services/firestore';

export const Community = () => {
  const container = document.createElement('div');
  container.className = 'community-container';

  container.innerHTML = `
    <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
           <button id="back-btn" class="btn btn-secondary">&larr; Dashboard</button>
           <h1 style="margin: 0;">Community Hub</h1>
        </div>
      </header>
      
      <div style="margin-bottom: 2rem;">
         <p style="color: var(--text-muted);">Explore trips created by other travelers.</p>
      </div>
      
      <div id="community-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        <p>Loading inspiration...</p>
      </div>
    </div>
  `;

  const grid = container.querySelector('#community-grid');
  const backBtn = container.querySelector('#back-btn');
  backBtn.onclick = () => window.navigateTo('dashboard');

  // Async Fetch
  (async () => {
    try {
      const trips = await getRecentTrips();

      if (trips.length === 0) {
        grid.innerHTML = '<p>No public trips found yet.</p>';
      } else {
        grid.innerHTML = trips.map(trip => `
                <div class="card trip-card" data-id="${trip.id}" style="cursor: pointer; transition: transform 0.2s;">
                  <div style="height: 120px; background: url('${trip.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}') center/cover no-repeat; border-radius: var(--radius-md); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                  </div>
                  <h3 style="margin-bottom: 0.5rem;">${trip.name}</h3>
                  <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                     by User ${trip.userId ? trip.userId.substring(0, 6) : 'Unknown'}...
                  </p>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                      ${trip.stops ? trip.stops.slice(0, 3).map(s => `<span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">${s.city}</span>`).join('') : ''}
                  </div>
                </div>
              `).join('');

        // Navigate to PUBLIC view for these trips
        container.querySelectorAll('.trip-card').forEach(card => {
          card.onclick = () => window.navigateTo('public-trip', { tripId: card.dataset.id });
        });
      }
    } catch (error) {
      console.error(error);
      grid.innerHTML = '<p class="error">Failed to load community trips.</p>';
    }
  })();

  return container;
};
