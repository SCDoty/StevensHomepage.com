// Demo key — get your own free key at developer.wmata.com
const WMATA_KEY = 'e13626d03d8e4c03ac07f95541b3091b';

fetch(`https://api.wmata.com/Incidents.svc/json/Incidents?api_key=${WMATA_KEY}`)
    .then(r => r.json())
    .then(data => {
        const alerts = (data.Incidents || []).filter(inc =>
            inc.LinesAffected && inc.LinesAffected.includes('OR')
        );
        if (!alerts.length) return;
        const el = document.getElementById('metro-alert');
        const list = document.getElementById('metro-alert-list');
        list.innerHTML = '';
        alerts.forEach(a => {
            const li = document.createElement('li');
            li.textContent = a.Description;
            list.appendChild(li);
        });
        el.style.display = 'block';
    })
    .catch(() => {});
