// Dashboard Component
import { getUserTrips } from '../services/firestore';
import { logoutUser } from '../services/auth';

export const Dashboard = (user) => {
  const container = document.createElement('div');
  container.className = 'dashboard-container';

  // Banner Image
  const bannerImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const bannerHtml = `
    <div style="
        height: 250px; 
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.6), rgba(124, 58, 237, 0.5)), url('${bannerImage}') center/cover no-repeat;
        border-radius: var(--radius-lg);
        margin-bottom: 3rem;
        display: flex;
        align-items: center;
        padding: 3rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        position: relative;
        overflow: hidden;
    ">
        <div style="position: relative; z-index: 2;">
            <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem;">Welcome Back</p>
            <h1 style="color: white; font-size: 3rem; font-weight: 800; letter-spacing: -0.02em; margin: 0;">${user.displayName || 'Traveler'}</h1>
            <p style="color: rgba(255,255,255,0.9); margin-top: 0.5rem; font-size: 1.1rem; max-width: 600px;">Ready to explore your next adventure?</p>
        </div>
        <!-- Decorative Circle -->
        <div style="position: absolute; right: -50px; bottom: -50px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.1);"></div>
    </div>
  `;

  container.innerHTML = `
    <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <img src="/src/assets/logo_v2.png" alt="GlobeTrotter Logo" style="height: 48px; width: auto;">
                <span style="font-weight: bold; font-size: 1.5rem; color: var(--primary-color);">GlobeTrotter</span>
            </div>
            <nav style="display: flex; gap: 1rem;">
                <a href="#" id="nav-dashboard" style="color: var(--primary-color); text-decoration: none; border-bottom: 2px solid var(--primary-color); font-weight: 600;">Home</a>
                <a href="#" id="nav-community" style="color: var(--text-muted); text-decoration: none; font-weight: 500; transition: color 0.2s;">Community</a>
                <a href="#" id="nav-search" style="color: var(--text-muted); text-decoration: none; font-weight: 500; transition: color 0.2s;">Discover</a>
            </nav>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button id="settings-btn" class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Settings</button>
          <button id="logout-btn" class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Log Out</button>
        </div>
      </header>
      
      ${bannerHtml}

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
         <div id="tabs" style="display: flex; gap: 0.5rem; background: white; padding: 0.5rem; border-radius: 999px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color);">
            <button class="tab-btn active" data-tab="all">All Trips</button>
            <button class="tab-btn" data-tab="ongoing">Ongoing</button>
            <button class="tab-btn" data-tab="upcoming">Upcoming</button>
            <button class="tab-btn" data-tab="completed">Completed</button>
         </div>
         <button id="new-trip-btn" class="btn" style="padding: 0.8rem 1.5rem; border-radius: 999px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
            + Plan New Trip
         </button>
      </div>
      
      <div id="trips-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        <p>Loading trips...</p>
      </div>
    </div>
  `;

  // Styles for tabs
  const style = document.createElement('style');
  style.textContent = `
    .tab-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 0.95rem;
        cursor: pointer;
        padding: 0.6rem 1.2rem;
        border-radius: 999px;
        transition: all 0.2s ease;
        font-weight: 500;
    }
    .tab-btn.active {
        background: var(--primary-color);
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }
    .tab-btn:hover:not(.active) {
        background: var(--bg-color);
        color: var(--text-main);
    }
  `;
  container.appendChild(style);

  // Logic
  const tripsGrid = container.querySelector('#trips-grid');
  const logoutBtn = container.querySelector('#logout-btn');
  const settingsBtn = container.querySelector('#settings-btn');
  const newTripBtn = container.querySelector('#new-trip-btn');
  const activeTabs = container.querySelectorAll('.tab-btn');

  let allTrips = [];

  const renderTrips = (filter) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const filtered = allTrips.filter(trip => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      if (filter === 'ongoing') return start <= now && end >= now;
      if (filter === 'upcoming') return start > now;
      if (filter === 'completed') return end < now;
      return true;
    });

    if (filtered.length === 0) {
      tripsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
                <p>No ${filter !== 'all' ? filter : ''} trips found.</p>
                ${filter === 'all' || filter === 'upcoming' ? '<p>Start your next adventure!</p>' : ''}
            </div>
          `;
      return;
    }

    tripsGrid.innerHTML = filtered.map(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const isUpcoming = startDate > now;
      const isOngoing = startDate <= now && endDate >= now;
      const status = isOngoing ? 'Ongoing' : (isUpcoming ? 'Upcoming' : 'Completed');
      const statusColor = isOngoing ? '#10b981' : (isUpcoming ? '#3b82f6' : '#94a3b8');

      return `
        <div class="card trip-card" data-id="${trip.id}" style="
            cursor: pointer; 
            transition: all 0.3s ease; 
            padding: 0; 
            overflow: hidden; 
            border: 1px solid var(--border-color);
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
            display: flex; 
            flex-direction: column;
        ">
          <div style="height: 180px; position: relative;">
            <img src="${trip.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" 
                alt="${trip.name}" 
                style="width: 100%; height: 100%; object-fit: cover;"
            >
            <span style="
                position: absolute; 
                top: 1rem; 
                right: 1rem; 
                background: rgba(255, 255, 255, 0.95); 
                color: ${statusColor}; 
                font-size: 0.75rem; 
                padding: 0.3rem 0.8rem; 
                border-radius: 999px; 
                font-weight: 700; 
                text-transform: uppercase; 
                letter-spacing: 0.05em;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
                ${status}
            </span>
          </div>
          
          <div style="padding: 1.5rem;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 700;">${trip.name}</h3>
            
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: auto;">
                 <span style="font-size: 0.9rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    ${trip.stops ? trip.stops.length : 0} Stops
                 </span>
                 <span style="color: var(--primary-color); font-weight: 600; font-size: 0.9rem;">View Trip &rarr;</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.trip-card').forEach(card => {
      card.onclick = () => window.navigateTo('trip-details', { tripId: card.dataset.id });
    });
  };

  activeTabs.forEach(tab => {
    tab.onclick = () => {
      activeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTrips(tab.dataset.tab);
    };
  });

  logoutBtn.onclick = async () => {
    try { await logoutUser(); } catch (e) { console.error(e); }
  };

  settingsBtn.onclick = () => window.navigateTo('settings');
  newTripBtn.onclick = () => window.navigateTo('create-trip');

  // Nav Links
  container.querySelector('#nav-community').onclick = (e) => { e.preventDefault(); window.navigateTo('community'); };
  container.querySelector('#nav-search').onclick = (e) => { e.preventDefault(); window.navigateTo('search'); };

  (async () => {
    try {
      allTrips = await getUserTrips(user.uid);
      renderTrips('all');
    } catch (error) {
      console.error("Error fetching trips:", error);
      tripsGrid.innerHTML = '<p class="error">Failed to load trips.</p>';
    }
  })();

  return container;
};
