document.addEventListener("DOMContentLoaded", () => {
    // Fetch statistics data
    fetch('http://localhost:3000/stats')
        .then(response => response.json())
        .then(stats => renderStats(stats))
        .catch(error => console.error('Error fetching statistics:', error));

    // Fetch recent activity data
    fetch('http://localhost:3000/recent-activity') 
        .then(response => response.json())
        .then(recentActivity => renderRecentActivity(recentActivity))
        .catch(error => console.error('Error fetching recent activity:', error));
});

function renderStats(stats) {
    const statsSection = document.getElementById('statsSection');
    const statsContainer = document.createElement('div');

    stats.forEach(stat => {
        const statBox = document.createElement('div');
        statBox.className = 'stat-box';
        statBox.innerHTML = `<h3>${stat.title}</h3><p>${stat.value}</p>`;
        statsContainer.appendChild(statBox);
    });

    statsSection.appendChild(statsContainer);
}

function renderRecentActivity(recentActivity) {
    const recentActivityList = document.getElementById('recentActivityList');

    recentActivity.forEach(activity => {
        const listItem = document.createElement('li');
        listItem.textContent = activity;
        recentActivityList.appendChild(listItem);
    });
}
