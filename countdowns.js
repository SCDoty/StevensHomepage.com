function pad(n) { return String(n).padStart(2, '0'); }

function renderTimer(elId, targetDate) {
    const el = document.getElementById(elId);
    if (!el) return;

    function tick() {
        const diff = targetDate - Date.now();
        if (diff <= 0) {
            el.innerHTML = '<span class="cd-live">LIVE NOW</span>';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.innerHTML = `
            <div class="cd-unit"><div class="cd-num">${pad(d)}</div><div class="cd-lbl">Days</div></div>
            <div class="cd-unit"><div class="cd-num">${pad(h)}</div><div class="cd-lbl">Hrs</div></div>
            <div class="cd-unit"><div class="cd-num">${pad(m)}</div><div class="cd-lbl">Min</div></div>
            <div class="cd-unit"><div class="cd-num">${pad(s)}</div><div class="cd-lbl">Sec</div></div>`;
    }
    tick();
    setInterval(tick, 1000);
}

// ── F1 NEXT RACE ──
fetch('https://api.jolpi.ca/ergast/f1/current/next.json')
    .then(r => r.json())
    .then(data => {
        const race = data.MRData.RaceTable.Races[0];
        if (!race) return;
        document.getElementById('f1-event').textContent = race.raceName;
        document.getElementById('f1-competition').textContent = 'FIA Formula One World Championship';
        const timeStr = race.time ? race.time.replace('Z', '') : '00:00:00';
        const raceDate = new Date(`${race.date}T${timeStr}Z`);
        const localDate = raceDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        const localTime = raceDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        document.getElementById('f1-sub').textContent =
            `${race.Circuit.circuitName} · ${localDate} at ${localTime}`;
        renderTimer('f1-timer', raceDate);
    })
    .catch(() => {
        document.getElementById('f1-event').textContent = 'Could not load race data';
    });

// ── LIVERPOOL NEXT GAME ──
(async function loadLFC() {
    const TEAM_ID = 364;
    const now = new Date();
    const future = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '');
    const dateRange = `${fmt(now)}-${fmt(future)}`;

    const leagues = [
        { slug: 'eng.1',          name: 'Premier League' },
        { slug: 'uefa.champions', name: 'Champions League' },
        { slug: 'eng.fa',         name: 'FA Cup' },
        { slug: 'eng.league_cup', name: 'EFL Cup' }
    ];

    let next = null;

    for (const league of leagues) {
        try {
            const r = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.slug}/scoreboard?dates=${dateRange}&limit=200`
            );
            const data = await r.json();
            for (const ev of (data.events || [])) {
                const comp = ev.competitions && ev.competitions[0];
                if (!comp) continue;
                const state = comp.status && comp.status.type && comp.status.type.state;
                if (state !== 'pre') continue;
                const lfcComp = comp.competitors.find(c => Number(c.id) === TEAM_ID || (c.team && Number(c.team.id) === TEAM_ID));
                if (!lfcComp) continue;
                const gameDate = new Date(ev.date);
                if (gameDate <= now) continue;
                if (!next || gameDate < next.date) {
                    const opp = comp.competitors.find(c => Number(c.id) !== TEAM_ID && !(c.team && Number(c.team.id) === TEAM_ID));
                    next = {
                        date: gameDate,
                        league: league.name,
                        oppName: opp && opp.team ? opp.team.displayName : 'TBD',
                        venue: comp.venue ? comp.venue.fullName : '',
                        isHome: lfcComp.homeAway === 'home'
                    };
                }
            }
        } catch (e) { /* skip failed leagues */ }
    }

    if (!next) {
        document.getElementById('lfc-event').textContent = 'No upcoming fixtures found';
        return;
    }

    const matchup = next.isHome
        ? `Liverpool vs ${next.oppName}`
        : `${next.oppName} vs Liverpool`;
    document.getElementById('lfc-event').textContent = matchup;
    document.getElementById('lfc-competition').textContent = next.league;
    const localDate = next.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const localTime = next.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    document.getElementById('lfc-sub').textContent =
        `${next.venue ? next.venue + ' · ' : ''}${localDate} at ${localTime}`;
    renderTimer('lfc-timer', next.date);
})();
