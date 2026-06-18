(function () {
    const SOUNDS = {
        wilhelm: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg',
        awooga:  'https://bigsoundbank.com/UPLOAD/ogg/0679.ogg',
        fart:    'https://upload.wikimedia.org/wikipedia/commons/c/cf/Fart.ogg'
    };

    function play(url) {
        var a = new Audio(url);
        a.volume = 0.7;
        return a.play();
    }

    // Page-load Wilhelm scream — try immediately, fall back to first click
    function attemptScream() {
        play(SOUNDS.wilhelm).catch(function () {
            document.addEventListener('click', function onFirst() {
                play(SOUNDS.wilhelm).catch(function () {});
                document.removeEventListener('click', onFirst);
            }, { once: true });
        });
    }

    if (document.readyState === 'complete') {
        attemptScream();
    } else {
        window.addEventListener('load', attemptScream);
    }

    document.getElementById('btn-wilhelm').addEventListener('click', function () {
        play(SOUNDS.wilhelm).catch(function () {});
    });
    document.getElementById('btn-awooga').addEventListener('click', function () {
        play(SOUNDS.awooga).catch(function () {});
    });
    document.getElementById('btn-fart').addEventListener('click', function () {
        play(SOUNDS.fart).catch(function () {});
    });
})();
