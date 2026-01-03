import { destinations } from '../data/destinations';

export const Search = () => {
    const container = document.createElement('div');
    container.className = 'search-container';

    container.innerHTML = `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
           <button id="back-btn" class="btn btn-secondary">&larr; Dashboard</button>
           <h2 style="margin: 0;">Discover Destinations</h2>
        </div>
      </header>
      
      <div class="card" style="margin-bottom: 2rem;">
         <input type="text" id="search-input" placeholder="Search for cities, activities, or landmarks..." style="width: 100%; padding: 1rem; font-size: 1.1rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: var(--text-main); border-radius: var(--radius-md);">
      </div>
      
      <div id="search-results">
         <!-- Results will appear here -->
         <p style="color: var(--text-muted); text-align: center;">Try searching for "Paris", "Tokyo", or "Beach".</p>
      </div>

      <!-- Details Modal -->
      <div class="modal-overlay" id="search-modal">
          <div class="modal-content">
              <button class="close-modal" id="search-close-modal">&times;</button>
              <img src="" alt="" class="modal-image" id="search-modal-img">
              <div class="modal-details">
                  <h2 id="search-modal-title">Destination Name</h2>
                  <p class="modal-desc" id="search-modal-desc">Description goes here.</p>
                  
                  <div class="modal-info-row">
                      <div class="info-item">
                          <span class="info-label">Avg. Cost</span>
                          <span class="info-value" id="search-modal-cost">₹0</span>
                      </div>
                  </div>

                  <h3 id="search-modal-spots-title">Important Places to Visit</h3>
                  <ul class="spots-list" id="search-modal-spots">
                      <!-- Spots list -->
                  </ul>
              </div>
          </div>
      </div>
    </div>
  `;

    const backBtn = container.querySelector('#back-btn');
    backBtn.onclick = () => window.navigateTo('dashboard');

    const input = container.querySelector('#search-input');
    const results = container.querySelector('#search-results');

    // Mock Data
    const mockData = [
        ...destinations.map(d => ({
            name: d.name,
            type: 'Destination',
            desc: d.desc,
            image: d.image,
            cost: d.cost,
            id: d.id
        })),
        { name: "Scuba Diving", type: "Activity", desc: "Explore the underwater world." },
        { name: "Hiking", type: "Activity", desc: "Mountain trails and nature walks." }
    ];

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length < 2) {
            results.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Try searching for "Paris", "Tokyo", or "Beach".</p>';
            return;
        }

        const filtered = mockData.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.type.toLowerCase().includes(term)
        );

        if (filtered.length === 0) {
            results.innerHTML = '<p style="text-align: center;">No results found.</p>';
        } else {
            results.innerHTML = filtered.map(item => `
            <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--secondary-color); display: flex; gap: 1rem; padding: 1rem;">
               ${item.image ? `<img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);" alt="${item.name}">` : ''}
               <div style="flex: 1;">
                   <div style="display: flex; justify-content: space-between; align-items: start;">
                       <div>
                           <h3 style="margin: 0; font-size: 1.2rem;">${item.name}</h3>
                           <small style="color: var(--primary-color); text-transform: uppercase; font-size: 0.7rem;">${item.type}</small>
                           <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.9rem;">${item.desc}</p>
                           ${item.cost ? `<p style="font-weight: bold; margin-top: 0.25rem;">${item.cost}</p>` : ''}
                       </div>
                       <button class="btn btn-secondary view-details-btn" data-id="${item.id || ''}" style="font-size: 0.8rem;">View Details</button>
                   </div>
               </div>
            </div>
          `).join('');
        }
    });

    // Modal Logic
    const modal = container.querySelector('#search-modal');
    const closeBtn = container.querySelector('#search-close-modal');

    // Event Delegation for View Details
    results.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details-btn')) {
            const id = e.target.getAttribute('data-id');
            if (!id) return; // Handle non-destination items if needed

            const item = mockData.find(d => d.id == id);
            if (item) {
                container.querySelector('#search-modal-img').src = item.image;
                container.querySelector('#search-modal-title').textContent = item.name;
                container.querySelector('#search-modal-desc').textContent = item.desc;
                container.querySelector('#search-modal-cost').textContent = item.cost;

                const spotsList = container.querySelector('#search-modal-spots');

                // Fetch spots from original destination object
                const originalDest = destinations.find(d => d.id == id);
                if (originalDest && originalDest.spots) {
                    spotsList.innerHTML = originalDest.spots.map(spot => `<li>${spot}</li>`).join('');
                    container.querySelector('#search-modal-spots-title').style.display = 'block';
                } else {
                    spotsList.innerHTML = '';
                    container.querySelector('#search-modal-spots-title').style.display = 'none';
                }
                modal.classList.add('open');
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    return container;
};
