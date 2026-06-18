let radarMap = null;

function weatherInfo(code, isDay) {
    if (code === 0)  return { icon: isDay ? '☀️' : '🌙', desc: 'Clear' };
    if (code <= 2)   return { icon: '⛅', desc: 'Partly cloudy' };
    if (code === 3)  return { icon: '☁️', desc: 'Overcast' };
    if (code <= 49)  return { icon: '🌫️', desc: 'Foggy' };
    if (code <= 55)  return { icon: '🌦️', desc: 'Drizzle' };
    if (code <= 65)  return { icon: '🌧️', desc: 'Rain' };
    if (code <= 77)  return { icon: '❄️', desc: 'Snow' };
    if (code <= 82)  return { icon: '🌧️', desc: 'Rain showers' };
    if (code <= 86)  return { icon: '🌨️', desc: 'Snow showers' };
    if (code <= 99)  return { icon: '⛈️', desc: 'Thunderstorm' };
    return { icon: '🌡️', desc: 'Unknown' };
}

function loadWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weathercode,is_day,windspeed_10m` +
        `&hourly=temperature_2m,weathercode,precipitation_probability` +
        `&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto&forecast_days=2`;

    fetch(url).then(r => r.json()).then(data => {
        const cur = data.current;
        const info = weatherInfo(cur.weathercode, cur.is_day);
        const temp = Math.round(cur.temperature_2m);
        const wind = Math.round(cur.windspeed_10m);
        const nowMs = Date.now();
        const { time: times, temperature_2m: temps, weathercode: codes, precipitation_probability: precips } = data.hourly;

        let hourlyHTML = '';
        let count = 0;
        for (let i = 0; i < times.length && count < 12; i++) {
            const t = new Date(times[i]);
            if (t.getTime() < nowMs - 30 * 60 * 1000) continue;
            const hHour = t.getHours();
            const hInfo = weatherInfo(codes[i], hHour >= 6 && hHour < 20 ? 1 : 0);
            const label = count === 0 ? 'Now' : t.toLocaleTimeString([], { hour: 'numeric', hour12: true });
            const precip = precips[i] > 0 ? `<div class="hour-precip">${precips[i]}%</div>` : '';
            hourlyHTML += `<div class="hour-card">
                <div class="hour-time">${label}</div>
                <div class="hour-icon">${hInfo.icon}</div>
                <div class="hour-temp">${Math.round(temps[i])}°</div>
                ${precip}
            </div>`;
            count++;
        }

        document.getElementById('weather-widget').innerHTML = `
            <button id="radar-toggle" title="Toggle radar map">📡 Radar</button>
            <div id="weather-current" title="Open Weather.com">
                <div id="weather-icon">${info.icon}</div>
                <div>
                    <div id="weather-temp">${temp}°F</div>
                    <div id="weather-desc">${info.desc} · ${wind} mph</div>
                </div>
            </div>
            <div id="hourly-scroll">${hourlyHTML}</div>`;

        document.getElementById('weather-current').addEventListener('click', function () {
            window.open('https://weather.com/weather/today/l/' + lat + ',' + lon, '_blank');
        });

        document.getElementById('radar-toggle').addEventListener('click', function (e) {
            e.stopPropagation();
            const panel = document.getElementById('radar-panel');
            const isOpen = panel.classList.toggle('open');
            document.getElementById('weather-widget').classList.toggle('radar-open', isOpen);
            this.style.background = isOpen ? 'rgba(79,195,247,0.18)' : '';
            if (isOpen && !radarMap) {
                initRadarMap(lat, lon);
            } else if (isOpen && radarMap) {
                setTimeout(() => radarMap.invalidateSize(), 350);
            }
        });

    }).catch(() => {
        document.getElementById('weather-widget').innerHTML =
            '<p id="weather-error">Could not load weather data.</p>';
    });
}

function initRadarMap(lat, lon) {
    loadLeaflet(() => {
        radarMap = L.map('radar-map', { zoomControl: true })
                   .setView([lat, lon], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 12
        }).addTo(radarMap);

        fetch('https://api.rainviewer.com/public/weather-maps.json')
            .then(r => r.json())
            .then(data => {
                const latest = data.radar.past[data.radar.past.length - 1];
                L.tileLayer(
                    `https://tilecache.rainviewer.com${latest.path}/256/{z}/{x}/{y}/2/1_1.png`,
                    {
                        tileSize: 256,
                        opacity: 0.6,
                        attribution: '<a href="https://www.rainviewer.com">Rain Viewer</a>'
                    }
                ).addTo(radarMap);
            })
            .catch(() => {})
            .finally(() => {
                L.circleMarker([lat, lon], {
                    radius: 8,
                    fillColor: '#8ab4f8',
                    fillOpacity: 1,
                    color: '#131416',
                    weight: 2.5,
                    pane: 'markerPane'
                }).addTo(radarMap);
            });

        setTimeout(() => radarMap.invalidateSize(), 350);
    });
}

function loadLeaflet(cb) {
    if (window.L) { cb(); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = cb;
    document.head.appendChild(script);
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
        () => {
            document.getElementById('weather-widget').innerHTML =
                '<p id="weather-error">Enable location access to see weather.</p>';
        }
    );
} else {
    document.getElementById('weather-widget').innerHTML =
        '<p id="weather-error">Geolocation not supported.</p>';
}
