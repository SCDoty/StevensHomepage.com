function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent =
        `${(h % 12) || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
    document.getElementById('greeting').textContent =
        h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

updateClock();
setInterval(updateClock, 30000);
document.getElementById('search-input').focus();
