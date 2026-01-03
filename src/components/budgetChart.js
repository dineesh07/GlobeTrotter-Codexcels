import Chart from 'chart.js/auto';

export const renderBudgetChart = (canvasElement, stops) => {
    // Aggregate data
    const labels = [];
    const data = [];
    const colors = [
        '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444'
    ];

    // Group by Stop (City)
    stops.forEach(stop => {
        labels.push(stop.city);
        let stopCost = 0;
        if (stop.activities) {
            stopCost = stop.activities.reduce((sum, act) => sum + (act.cost || 0), 0);
        }
        data.push(stopCost);
    });

    // If no data, show empty state or don't render?
    // We'll render even if 0 to show the chart.

    new Chart(canvasElement, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cost per City',
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Expenses by City',
                    color: '#f8fafc',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
};
