(function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

    document.getElementById('calendar-month-year').textContent = MONTHS[month] + ' ' + year;

    const grid = document.getElementById('calendar-grid');

    DAYS.forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-header';
        el.textContent = d;
        grid.appendChild(el);
    });

    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div'));
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        const el = document.createElement('div');
        el.className = 'cal-day' + (d === today ? ' cal-today' : '');
        el.textContent = d;
        grid.appendChild(el);
    }
})();
