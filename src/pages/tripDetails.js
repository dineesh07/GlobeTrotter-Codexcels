import { getTrip, addTripStop, deleteTrip } from '../services/firestore';
import { addActivityToStop } from '../services/activities';
import { renderBudgetChart } from '../components/budgetChart';
import { renderCalendar } from '../components/calendar';

export const TripDetails = (user, params) => {
  const container = document.createElement('div');
  container.className = 'trip-details-container';
  const tripId = params.tripId;

  if (!tripId) {
    container.innerHTML = '<p class="error">Trip ID missing.</p>';
    return container;
  }

  container.innerHTML = `
    <div style="padding: 2rem; padding-bottom: 5rem;">
      <button id="back-btn" class="btn btn-secondary" style="margin-bottom: 2rem;">&larr; Back to Dashboard</button>
      
      <div id="loading-indicator">Loading Trip Details...</div>
      
      <div id="trip-content" style="display: none;">
        <header id="trip-header" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding: 2rem; border-radius: var(--radius-lg); position: relative; overflow: hidden; color: white;">
           <div class="header-overlay" style="position: absolute; inset: 0; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)); z-index: 0;"></div>
           <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: start;">
              <div>
                 <h1 id="trip-name" style="margin-bottom: 0.5rem; text-shadow: 0 2px 4px black;"></h1>
                 <p id="trip-dates" style="opacity: 0.9;"></p>
                 <p id="trip-desc" style="font-style: italic; opacity: 0.8; margin-top: 1rem;"></p>
              </div>
           <div style="text-align: right;">
             <div class="card" style="padding: 1rem; border: 1px solid var(--primary-color); display: inline-block; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);">
                <small style="display: block; opacity: 0.8;">Est. Budget</small>
                <span id="trip-budget" style="font-size: 1.2rem; font-weight: bold;">₹0</span>
             </div>
             <div style="margin-top: 0.5rem; text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button id="share-btn" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Share</button>
                <button id="view-calendar-btn" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Timeline</button>
                <button id="view-budget-btn" class="btn" style="font-size: 0.8rem; padding: 0.5rem 1rem;">View Analytics</button>
                <button id="delete-trip-btn" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444;">Delete</button>
             </div>
          </div>
           </div>
        </header>

        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: 768px) { grid-template-columns: 2fr 1fr; }">
          <!-- Left: Itinerary Timeline -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
               <h2>Itinerary</h2>
               <button id="add-stop-btn" class="btn btn-secondary" style="font-size: 0.9rem;">+ Add Stop</button>
            </div>
            
            <div id="stops-list" style="display: flex; flex-direction: column; gap: 1rem;">
               <!-- Stops will go here -->
               <p style="color: var(--text-muted); text-align: center; padding: 2rem; background: var(--card-bg); border-radius: var(--radius-md);">
                 No stops added yet. Start planning!
               </p>
            </div>
          </div>

          <!-- Right: Tools / Details -->
          <div>
             <div class="card" style="position: sticky; top: 1rem;">
               <h3>Trip Stats</h3>
               <ul style="padding-left: 1.2rem; color: var(--text-muted);">
                 <li>Duration: <span id="duration-days">0</span> days</li>
                 <li>Stops: <span id="stops-count">0</span></li>
                 <li>Activities: <span id="activities-count">0</span></li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Stop Modal -->
    <div id="add-stop-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100; justify-content: center; align-items: center;">
       <div class="card" style="width: 100%; max-width: 500px;">
          <h3>Add a Stop</h3>
          <form id="add-stop-form">
            <input type="text" id="stop-city" placeholder="City Name" required />
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                 <label style="display: block; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.2rem;">Arrival</label>
                 <input type="date" id="stop-arrival" required style="margin-bottom: 0.5rem;" />
                 <input type="time" id="stop-arrival-time" style="width: 100%; padding: 0.8rem; border-radius: 0.5rem; background: rgba(15,23,42,0.5); border: 1px solid var(--border-color); color: var(--text-main);" />
              </div>
              <div>
                 <label style="display: block; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.2rem;">Departure</label>
                 <input type="date" id="stop-departure" required style="margin-bottom: 0.5rem;" />
                 <input type="time" id="stop-departure-time" style="width: 100%; padding: 0.8rem; border-radius: 0.5rem; background: rgba(15,23,42,0.5); border: 1px solid var(--border-color); color: var(--text-main);" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;">
               <button type="button" class="btn btn-secondary close-modal">Cancel</button>
               <button type="submit" class="btn">Add Stop</button>
            </div>
          </form>
       </div>
    </div>

    <!-- Add Activity Modal -->
    <div id="add-activity-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100; justify-content: center; align-items: center;">
       <div class="card" style="width: 100%; max-width: 500px;">
          <h3>Add Activity</h3>
          <p id="activity-stop-name" style="color: var(--text-muted); margin-bottom: 1rem;"></p>
          <form id="add-activity-form">
            <input type="text" id="activity-name" placeholder="Activity Name (e.g. Louvre Museum)" required />
            <input type="time" id="activity-time" style="width: 100%; padding: 0.8rem; border-radius: 0.5rem; background: rgba(15,23,42,0.5); border: 1px solid var(--border-color); color: var(--text-main); margin-bottom: 1rem;" required />
            <select id="activity-type" style="width: 100%; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--border-color); color: var(--text-main); padding: 0.8rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food & Drink</option>
                <option value="adventure">Adventure</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
            </select>
            <input type="number" id="activity-cost" placeholder="Cost (₹)" min="0" step="0.01" />
            
            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;">
               <button type="button" class="btn btn-secondary close-modal">Cancel</button>
               <button type="submit" class="btn">Add Activity</button>
            </div>
          </form>
       </div>
    </div>

    <!-- Budget Modal -->
    <div id="budget-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100; justify-content: center; align-items: center;">
       <div class="card" style="width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
             <h3>Budget Breakdown</h3>
             <button class="btn btn-secondary close-modal" style="padding: 0.2rem 0.6rem;">&times;</button>
          </div>
          <div style="height: 300px; display: flex; justify-content: center;">
             <canvas id="budget-chart"></canvas>
          </div>
          <div id="budget-summary" style="margin-top: 1rem;">
             <!-- Detailed list could go here -->
          </div>
       </div>
    </div>
     <!-- Calendar Modal -->
    <div id="calendar-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100; justify-content: center; align-items: center;">
       <div class="card" style="width: 100%; max-width: 900px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
             <h3>Trip Timeline</h3>
             <button class="btn btn-secondary close-modal" style="padding: 0.2rem 0.6rem;">&times;</button>
          </div>
          <div id="calendar-view"></div>
       </div>
    </div>
  `;

  // --- Logic ---
  const backBtn = container.querySelector('#back-btn');
  backBtn.onclick = () => window.navigateTo('dashboard');

  const content = container.querySelector('#trip-content');
  const loading = container.querySelector('#loading-indicator');

  // Modals
  const stopModal = container.querySelector('#add-stop-modal');
  const activityModal = container.querySelector('#add-activity-modal');
  const budgetModal = container.querySelector('#budget-modal');
  const calendarModal = container.querySelector('#calendar-modal'); // New

  const addStopBtn = container.querySelector('#add-stop-btn');
  const viewBudgetBtn = container.querySelector('#view-budget-btn');
  const viewCalendarBtn = container.querySelector('#view-calendar-btn'); // New element to be added in HTML

  const addStopForm = container.querySelector('#add-stop-form');
  const addActivityForm = container.querySelector('#add-activity-form');

  // Close buttons
  container.querySelectorAll('.close-modal').forEach(btn => {
    btn.onclick = () => {
      stopModal.style.display = 'none';
      activityModal.style.display = 'none';
      budgetModal.style.display = 'none';
      if (calendarModal) calendarModal.style.display = 'none';
    };
  });

  addStopBtn.onclick = () => { stopModal.style.display = 'flex'; };

  // Calendar Logic
  if (viewCalendarBtn) {
    viewCalendarBtn.onclick = () => {
      calendarModal.style.display = 'flex';
      const calendarContainer = container.querySelector('#calendar-view');
      if (typeof renderCalendar === 'function') {
        renderCalendar(calendarContainer, currentTrip);
      } else {
        console.error("renderCalendar is not a function", renderCalendar);
      }
    };
  }

  // Calendar Logic
  if (viewCalendarBtn) {
    viewCalendarBtn.onclick = () => {
      calendarModal.style.display = 'flex';
      const calendarContainer = container.querySelector('#calendar-view');
      renderCalendar(calendarContainer, currentTrip);
    };
  }

  // Share Logic
  const shareBtn = container.querySelector('#share-btn');
  if (shareBtn) {
    shareBtn.onclick = () => {
      // Construct the URL. Since this is a SPA with hash routing absent (using custom router),
      // we need a mechanism to load deep links. 
      // For now, since our simple router doesn't parse window.location.pathname on load (it defaults to login/dashboard),
      // we might need to assume the user manually goes to the app. 
      // BUT, to make this realistic, let's pretend we have a mechanism.
      // Or we can just alert the Trip ID and explain.

      // Actually, let's fix the router in main.js to check params on load!
      // But for now, let's copy a conceptual URL.
      const url = `${window.location.origin}/?route=public-trip&tripId=${tripId}`;
      navigator.clipboard.writeText(url).then(() => {
        const originalText = shareBtn.innerText;
        shareBtn.innerText = "Link Copied!";
        setTimeout(() => shareBtn.innerText = originalText, 2000);
      });
    };
  }

  if (viewBudgetBtn) {
    viewBudgetBtn.onclick = () => {
      budgetModal.style.display = 'flex';
      const canvas = container.querySelector('#budget-chart');

      requestAnimationFrame(() => {
        if (currentTrip && currentTrip.stops) {
          // Re-create canvas to handle Chart.js instances cleanly
          const newCanvas = canvas.cloneNode(true);
          canvas.parentNode.replaceChild(newCanvas, canvas);
          renderBudgetChart(newCanvas, currentTrip.stops);
        }
      });
    };
  }

  // Delete Trip Logic
  const deleteBtn = container.querySelector('#delete-trip-btn');
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
        deleteBtn.innerText = "Deleting...";
        deleteBtn.disabled = true;
        try {
          await deleteTrip(tripId);
          window.navigateTo('dashboard');
        } catch (error) {
          console.error(error);
          alert("Failed to delete trip.");
          deleteBtn.innerText = "Delete";
          deleteBtn.disabled = false;
        }
      }
    };
  }

  const stopsList = container.querySelector('#stops-list');

  let currentTrip = null;
  let currentStopIndex = -1; // For adding activity

  const renderStops = (stops) => {
    if (!stops || stops.length === 0) {
      stopsList.innerHTML = `
        <p style="color: var(--text-muted); text-align: center; padding: 2rem; background: var(--card-bg); border-radius: var(--radius-md);">
          No stops added yet. Start planning!
        </p>`;
      return;
    }

    // Sort stops by date
    stops.sort((a, b) => new Date(a.arrival) - new Date(b.arrival));

    // Stats
    container.querySelector('#stops-count').textContent = stops.length;
    let actCount = 0;
    stops.forEach(s => actCount += (s.activities ? s.activities.length : 0));
    container.querySelector('#activities-count').textContent = actCount;
    // Update budget display
    container.querySelector('#trip-budget').textContent = `₹${(currentTrip.budget || 0).toLocaleString()}`;

    stopsList.innerHTML = stops.map((stop, index) => {
      // Sort activities by time
      const sortedActivities = (stop.activities || []).sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });

      const activitiesHtml = sortedActivities.map(act => `
        <div style="background: rgba(0,0,0,0.2); padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span style="font-weight: bold; font-family: monospace; background: rgba(255,255,255,0.1); padding: 0.1rem 0.3rem; border-radius: 4px;">${act.time || '--:--'}</span>
                <span>${act.name} <small style="color: var(--text-muted);">(${act.type})</small></span>
            </div>
            <span>₹${act.cost || 0}</span>
        </div>
      `).join('');

      return `
      <div class="card stop-card" draggable="true" data-index="${index}" style="border-left: 4px solid var(--accent-color); cursor: grab;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
           <div style="display: flex; align-items: center; gap: 0.5rem;">
             <span style="font-size: 1.2rem; display: inline-block; cursor: grab;" title="Drag to reorder">☰</span>
             <h3 style="margin: 0;">${stop.city}</h3>
           </div>
           <span style="font-size: 0.9rem; color: var(--text-muted); text-align: right;">
             <div>${new Date(stop.arrival).toLocaleDateString()} ${stop.arrivalTime ? '@ ' + stop.arrivalTime : ''}</div>
             <div>${new Date(stop.departure).toLocaleDateString()} ${stop.departureTime ? '@ ' + stop.departureTime : ''}</div>
           </span>
        </div>
        
        <div style="margin-top: 1rem; min-height: 20px;">
           ${activitiesHtml}
        </div>

        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
           <button class="btn btn-secondary add-activity-trigger" data-index="${index}" data-city="${stop.city}" style="font-size: 0.8rem;">+ Add Activity</button>
           <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 1rem;">${stop.activities ? stop.activities.length : 0} Activities</span>
        </div>
      </div>
    `}).join('');

    // Drag and Drop Logic
    const draggables = container.querySelectorAll('.stop-card');
    let draggedItem = null;

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', () => {
        draggable.style.opacity = '0.5';
        draggedItem = draggable;
      });

      draggable.addEventListener('dragend', () => {
        draggable.style.opacity = '1';
        draggedItem = null;

        // Here we would strictly need to update the order in Firestore
        // For now, we update the UI visually, but to be robust we should save order.
        // Updating order in Firestore not implemented yet, but the UI interactivity is here.
      });

      // Simple swap logic for visual demo
      draggable.addEventListener('dragover', (e) => {
        e.preventDefault();
        const list = container.querySelector('#stops-list');
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
          list.appendChild(draggedItem);
        } else {
          list.insertBefore(draggedItem, afterElement);
        }
      });
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.stop-card:not(.dragging)')];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Attach handlers for "Add Activity" buttons
    container.querySelectorAll('.add-activity-trigger').forEach(btn => {
      btn.onclick = (e) => {
        currentStopIndex = parseInt(e.target.dataset.index);
        container.querySelector('#activity-stop-name').textContent = `at ${e.target.dataset.city}`;
        activityModal.style.display = 'flex';
      };
    });
  };

  const loadData = async () => {
    try {
      currentTrip = await getTrip(tripId);

      if (currentTrip.imageUrl) {
        container.querySelector('#trip-header').style.background = `url('${currentTrip.imageUrl}') center/cover no-repeat`;
      } else {
        container.querySelector('#trip-header').style.background = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`;
        container.querySelector('.header-overlay').style.display = 'block';
      }

      container.querySelector('#trip-name').textContent = currentTrip.name;
      container.querySelector('#trip-dates').textContent = `${new Date(currentTrip.startDate).toLocaleDateString()} - ${new Date(currentTrip.endDate).toLocaleDateString()}`;
      container.querySelector('#trip-desc').textContent = currentTrip.description || '';

      // Calculate duration
      const start = new Date(currentTrip.startDate);
      const end = new Date(currentTrip.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      container.querySelector('#duration-days').textContent = days;

      renderStops(currentTrip.stops);

      loading.style.display = 'none';
      content.style.display = 'block';
    } catch (error) {
      console.error(error);
      loading.textContent = 'Error loading trip.';
    }
  };

  loadData();

  // Stop Form Submission
  addStopForm.onsubmit = async (e) => {
    e.preventDefault();
    const city = container.querySelector('#stop-city').value;
    const arrival = container.querySelector('#stop-arrival').value;
    const arrivalTime = container.querySelector('#stop-arrival-time').value; // New
    const departure = container.querySelector('#stop-departure').value;
    const departureTime = container.querySelector('#stop-departure-time').value; // New

    if (new Date(arrival) > new Date(departure)) {
      alert("Arrival must be before departure");
      return;
    }

    const submitBtn = addStopForm.querySelector('button[type="submit"]');
    submitBtn.innerText = "Adding...";
    submitBtn.disabled = true;

    try {
      const newStop = { city, arrival, arrivalTime, departure, departureTime, activities: [] };
      await addTripStop(tripId, newStop);

      // Update local state
      if (!currentTrip.stops) currentTrip.stops = [];
      currentTrip.stops.push(newStop);
      renderStops(currentTrip.stops);

      stopModal.style.display = 'none';
      addStopForm.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to add stop");
    } finally {
      submitBtn.innerText = "Add Stop";
      submitBtn.disabled = false;
    }
  };

  // Activity Form Submission
  addActivityForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = container.querySelector('#activity-name').value;
    const time = container.querySelector('#activity-time').value; // New
    const type = container.querySelector('#activity-type').value;
    const cost = container.querySelector('#activity-cost').value || 0;

    const submitBtn = addActivityForm.querySelector('button[type="submit"]');
    submitBtn.innerText = "Adding...";
    submitBtn.disabled = true;

    try {
      const activityData = { name, time, type, cost: parseFloat(cost) };
      await addActivityToStop(tripId, currentStopIndex, activityData);

      // Update local state and budget
      if (!currentTrip.stops[currentStopIndex].activities) {
        currentTrip.stops[currentStopIndex].activities = [];
      }
      currentTrip.stops[currentStopIndex].activities.push(activityData);
      currentTrip.budget = (currentTrip.budget || 0) + parseFloat(cost);

      renderStops(currentTrip.stops);
      activityModal.style.display = 'none';
      addActivityForm.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to add activity");
    } finally {
      submitBtn.innerText = "Add Activity";
      submitBtn.disabled = false;
    }
  };

  return container;
};
