(function () {
    const TODAY = new Date().toISOString().slice(0, 10);
    const CACHE_KEY = 'qotd_v1';

    function render(q) {
        document.getElementById('quote-text').textContent = '“' + q.quote + '”';
        document.getElementById('quote-author').textContent = '— ' + q.author;
    }

    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.date === TODAY) {
        render(cached.quote);
        return;
    }

    fetch('https://dummyjson.com/quotes/random')
        .then(r => r.json())
        .then(q => {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ date: TODAY, quote: q }));
            render(q);
        })
        .catch(() => {
            document.getElementById('quote-widget').style.display = 'none';
        });
})();
