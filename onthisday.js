(function () {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

    document.getElementById('otd-label').textContent =
        'On This Day · ' + MONTHS[now.getMonth()] + ' ' + day;

    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`)
        .then(r => r.json())
        .then(data => {
            const events = (data.events || []).sort((a, b) => a.year - b.year);
            const picked = pick(events, 5);
            const list = document.getElementById('otd-list');

            picked.forEach(e => {
                const li = document.createElement('li');

                const yearSpan = document.createElement('span');
                yearSpan.className = 'otd-year';
                yearSpan.textContent = e.year;
                li.appendChild(yearSpan);

                const page = e.pages && e.pages[0];
                const url = page && page.content_urls &&
                            page.content_urls.desktop && page.content_urls.desktop.page;

                if (url) {
                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.className = 'otd-link';
                    a.textContent = e.text;
                    li.appendChild(a);
                } else {
                    li.appendChild(document.createTextNode(e.text));
                }

                list.appendChild(li);
            });
        })
        .catch(() => {
            document.getElementById('otd-widget').style.display = 'none';
        });

    function pick(arr, n) {
        if (arr.length <= n) return arr;
        const step = arr.length / n;
        return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
    }
})();
