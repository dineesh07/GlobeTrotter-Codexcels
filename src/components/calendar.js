export const renderCalendar = (containerElement, trip) => {
    // Simple Horizontal Calendar / Timeline

    if (!trip || !trip.stops) {
        containerElement.innerHTML = '';
        return;
    }

    const stops = trip.stops.sort((a, b) => new Date(a.arrival) - new Date(b.arrival));
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    // Calculate total duration
    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    containerElement.innerHTML = `
    <div style="overflow-x: auto; padding: 1rem 0;">
      <div style="display: flex; gap: 2px; min-width: ${duration * 40}px;">
         ${generateDays(startDate, duration, stops)}
      </div>
    </div>
  `;
};

const generateDays = (start, duration, stops) => {
    let html = '';

    for (let i = 0; i < duration; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);

        const dateStr = current.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        // Find if this day belongs to a stop
        // Simplistic check: if current date is within arrival-departure of a stop
        const activeStop = stops.find(stop => {
            const arr = new Date(stop.arrival);
            const dep = new Date(stop.departure);
            // Normalize time
            arr.setHours(0, 0, 0, 0);
            dep.setHours(0, 0, 0, 0);
            return current >= arr && current <= dep;
        });

        const bg = activeStop ? 'var(--primary-color)' : '#334155';
        const label = activeStop ? activeStop.city : '';

        html += `
          <div style="
            flex: 1; 
            min-width: 40px; 
            height: 100px; 
            background: ${bg}; 
            margin-right: 2px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0;
            position: relative;
            opacity: ${activeStop ? 1 : 0.4};
          ">
             <span style="font-size: 0.7rem; color: #fff;">${dateStr}</span>
             ${label ? `<span style="font-size: 0.6rem; writing-mode: vertical-rl; text-orientation: mixed; color: #fff; max-height: 60px; overflow: hidden;">${label}</span>` : ''}
          </div>
        `;
    }
    return html;
};
