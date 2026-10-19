// BW Parkway (MD 295) traffic between I-95/I-495 (Capital Beltway, Greenbelt) and MD 100.
// Data: Maryland CHART public export feeds. CHART sends no CORS headers, so a direct
// browser fetch is usually blocked; we fall back to a public CORS proxy. If neither
// works, the sensor/incident sections stay hidden and only the live map shows.
(function () {
    const CHART = 'https://chartexp1.sha.maryland.gov/CHARTExportClientService/';
    const PROXIES = [
        u => u,
        u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    ];

    // Sensor IDs on MD 295, ordered south to north.
    const SENSORS = [
        { id: 'S316021', label: 'Greenbelt Rd' },
        { id: 'S316023', label: 'Powder Mill Rd' },
        { id: 'S316019', label: 'MD 197', dir: 'NORTH' },
        { id: 'S316020', label: 'MD 197', dir: 'SOUTH' },
        { id: 'S502013', label: 'Brock Bridge Rd' },
        { id: 'S502014', label: 'MD 32' },
    ];

    // Bounding box around the corridor from the Beltway to MD 100.
    const BOX = { latMin: 38.985, latMax: 39.175, lonMin: -76.90, lonMax: -76.72 };

    async function getJSON(path) {
        const url = CHART + path;
        for (const wrap of PROXIES) {
            try {
                const ctrl = new AbortController();
                const t = setTimeout(() => ctrl.abort(), 8000);
                const r = await fetch(wrap(url), { signal: ctrl.signal });
                clearTimeout(t);
                if (r.ok) return (await r.json()).data || [];
            } catch (e) { /* try next */ }
        }
        return null;
    }

    function speedClass(mph) {
        if (mph >= 50) return 'fast';
        if (mph >= 30) return 'slow';
        return 'jam';
    }

    function validSpeed(s) {
        return typeof s === 'number' && s >= 0 && s < 200;
    }

    function renderSensors(tss) {
        const byId = {};
        tss.forEach(s => { byId[s.name] = s; });
        const rows = {};
        SENSORS.forEach(cfg => {
            const s = byId[cfg.id];
            if (!s || s.opStatus !== 'OK') return;
            const row = rows[cfg.label] || (rows[cfg.label] = { NORTH: null, SOUTH: null });
            (s.zones || []).forEach(z => {
                if (cfg.dir && z.direction !== cfg.dir) return;
                if (validSpeed(z.speed) && (z.direction === 'NORTH' || z.direction === 'SOUTH')) {
                    row[z.direction] = z.speed;
                }
            });
        });
        const labels = Object.keys(rows).filter(l => rows[l].NORTH !== null || rows[l].SOUTH !== null);
        if (!labels.length) return false;

        const cell = v => v === null
            ? '<span class="bw-speed none">—</span>'
            : `<span class="bw-speed ${speedClass(v)}">${Math.round(v)}</span>`;
        // Display north to south, top to bottom.
        document.getElementById('bw-sensors').innerHTML =
            '<div class="bw-row bw-head"><span>Location</span><span>NB</span><span>SB</span></div>' +
            labels.reverse().map(l =>
                `<div class="bw-row"><span>${l}</span>${cell(rows[l].NORTH)}${cell(rows[l].SOUTH)}</div>`
            ).join('');
        return true;
    }

    function renderIncidents(events) {
        const list = document.getElementById('bw-incidents');
        const hits = events.filter(e =>
            !e.closed &&
            e.lat >= BOX.latMin && e.lat <= BOX.latMax &&
            e.lon >= BOX.lonMin && e.lon <= BOX.lonMax &&
            /295|BALTIMORE.?WASHINGTON|BW PKWY|B-W PKWY/i.test(e.description || e.name || '')
        );
        list.innerHTML = '';
        if (!hits.length) {
            list.innerHTML = '<li class="bw-clear">No reported incidents</li>';
            return;
        }
        hits.forEach(e => {
            const li = document.createElement('li');
            li.textContent = e.description || e.name;
            list.appendChild(li);
        });
    }

    async function load() {
        const [tss, events] = await Promise.all([
            getJSON('getTSSMapDataJSON.do'),
            getJSON('getEventMapDataJSON.do'),
        ]);
        const live = document.getElementById('bw-live');
        let any = false;
        if (tss && renderSensors(tss)) any = true;
        if (events) { renderIncidents(events); any = true; }
        live.style.display = any ? 'block' : 'none';
        if (any) {
            document.getElementById('bw-updated').textContent =
                'Updated ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        }
    }

    load();
    setInterval(load, 5 * 60 * 1000);
})();
