(function () {
    const widget = document.getElementById('worldcup-widget');
    const container = document.getElementById('wc-matches');
    let refreshTimer = null;

    const FLAG = {
        'USA':'US','MEX':'MX','CAN':'CA','BRA':'BR','ARG':'AR',
        'FRA':'FR','ENG':'GB','GER':'DE','ESP':'ES','POR':'PT',
        'NED':'NL','BEL':'BE','CRO':'HR','SEN':'SN','MAR':'MA',
        'JPN':'JP','AUS':'AU','KOR':'KR','URU':'UY','COL':'CO',
        'ECU':'EC','CHI':'CL','PAR':'PY','PER':'PE','VEN':'VE',
        'PAN':'PA','CRC':'CR','HON':'HN','GTM':'GT','JAM':'JM',
        'TRI':'TT','ITA':'IT','SUI':'CH','AUT':'AT','POL':'PL',
        'CZE':'CZ','HUN':'HU','SRB':'RS','UKR':'UA','DEN':'DK',
        'SWE':'SE','NOR':'NO','TUR':'TR','GRE':'GR','ROU':'RO',
        'ALB':'AL','SVN':'SI','SVK':'SK','WAL':'GB','SCO':'GB',
        'GHA':'GH','NGA':'NG','CMR':'CM','CIV':'CI','EGY':'EG',
        'TUN':'TN','ALG':'DZ','RSA':'ZA','SAU':'SA','IRN':'IR',
        'IRQ':'IQ','QAT':'QA','UAE':'AE','CHN':'CN','NZL':'NZ',
        'MAL':'MY','THA':'TH','IDN':'ID',
    };

    function flag(abbr) {
        const iso = FLAG[abbr];
        if (!iso || iso.length !== 2) return '';
        return String.fromCodePoint(
            0x1F1E6 + iso.charCodeAt(0) - 65,
            0x1F1E6 + iso.charCodeAt(1) - 65
        ) + ' ';
    }

    function shortName(team) {
        return team.shortDisplayName || team.displayName;
    }

    function render(events) {
        clearTimeout(refreshTimer);

        if (!events || !events.length) {
            widget.style.display = 'none';
            return;
        }

        widget.style.display = '';
        container.innerHTML = '';
        let hasLive = false;

        events.forEach(function (ev) {
            const comp = ev.competitions[0];
            const home = comp.competitors.find(function (c) { return c.homeAway === 'home'; }) || comp.competitors[0];
            const away = comp.competitors.find(function (c) { return c.homeAway === 'away'; }) || comp.competitors[1];
            const sName = ev.status.type.name;
            const sDetail = ev.status.type.shortDetail;
            const isLive = sName === 'STATUS_IN_PROGRESS';
            const isFinal = sName === 'STATUS_FINAL';
            if (isLive) hasLive = true;

            let col1HTML, midHTML;
            if (isFinal || isLive) {
                col1HTML = isLive
                    ? '<span class="wc-live">' + sDetail + '</span>'
                    : '<span class="wc-ft">FT</span>';
                midHTML = '<span class="wc-num">' + home.score + '</span>'
                        + '<span class="wc-dash">–</span>'
                        + '<span class="wc-num">' + away.score + '</span>';
            } else {
                const t = new Date(ev.date);
                col1HTML = '<span class="wc-time">'
                    + t.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                    + '</span>';
                midHTML = '<span class="wc-vs">vs</span>';
            }

            const row = document.createElement('div');
            row.className = 'wc-match';
            row.innerHTML =
                '<span class="wc-col1">' + col1HTML + '</span>'
                + '<span class="wc-team wc-home">' + flag(home.team.abbreviation) + shortName(home.team) + '</span>'
                + '<span class="wc-mid">' + midHTML + '</span>'
                + '<span class="wc-team wc-away">' + flag(away.team.abbreviation) + shortName(away.team) + '</span>';
            container.appendChild(row);
        });

        if (hasLive) {
            refreshTimer = setTimeout(load, 60000);
        }
    }

    function load() {
        fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard')
            .then(function (r) { return r.json(); })
            .then(function (d) { render(d.events); })
            .catch(function () { widget.style.display = 'none'; });
    }

    load();
})();
