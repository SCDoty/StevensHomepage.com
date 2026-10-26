// Build-your-own mode: pick any super, abilities, aspects and fragments, and get gear recommendations
// inferred from what the build focuses on. Every option, exotic and perk carries tags inferred from its
// in-game text (see destiny-custom-data.js); the picks add up to a build profile, and gear is scored against it.
(function () {
    const D = window.D2_CUSTOM_DATA;
    if (!D) return;

    const TAG_LABELS = {
        grenade: 'Grenades', melee: 'Melee', class: 'Class Ability', super: 'Super', weapons: 'Weapons', survival: 'Survivability',
        scorch: 'Scorch', ignition: 'Ignitions', radiant: 'Radiant', restoration: 'Restoration / Cure', firesprite: 'Firesprites',
        jolt: 'Jolt', amplified: 'Amplified', blind: 'Blind / Disorient', ionic: 'Ionic Traces', bolt: 'Bolt Charge',
        volatile: 'Volatile', weaken: 'Weaken', suppress: 'Suppress', invisibility: 'Invisibility', overshield: 'Overshield',
        devour: 'Devour', breach: 'Void Breaches', slow: 'Slow', freeze: 'Freeze', shatter: 'Shatter / Crystals',
        frostarmor: 'Frost Armor', shard: 'Stasis Shards', suspend: 'Suspend', unravel: 'Unravel', sever: 'Sever',
        threadling: 'Threadlings', wovenmail: 'Woven Mail', tangle: 'Tangles', transcendence: 'Transcendence',
        orb: 'Orbs of Power', finisher: 'Finishers'
    };
    const SURVIVAL_TAGS = ['survival', 'restoration', 'overshield', 'wovenmail', 'frostarmor', 'devour'];
    const ABILITY_KINDS = [['super', 'Super'], ['class', 'Class Ability'], ['move', 'Movement'], ['melee', 'Melee'], ['grenade', 'Grenade']];
    const CHAMPS = ['Barrier', 'Overload', 'Unstoppable'];
    const SLOTS = ['Kinetic', 'Energy', 'Power'];
    // Nezarec's Nightmare rewards kills on any debuffed target, not just the examples its text lists
    const SET_TAGS = Object.assign({}, D.SET_TAGS, {
        nezarec: [...new Set([...(D.SET_TAGS.nezarec || []), 'volatile', 'slow', 'unravel', 'sever', 'blind', 'suppress', 'ignition'])]
    });
    // Older names exotic perk text still uses for current abilities
    const ALIASES = { 'Proximity Explosive Knife': ['Proximity Knife'], 'Snare Bomb': ['Smoke Bomb'] };
    // Legendary perks by name, for scoring what each legendary weapon can roll (LEG[].r)
    const PERK = Object.fromEntries(D.WPERKS.map(p => [p.n, p]));
    // rollable perks rank legendaries that share an element, slot and champion; the bonus levels off below 3
    // so it never outweighs the +4 for matching your element
    const LEG_PERK_MAX = 3;
    const perkBonus = raw => LEG_PERK_MAX * raw / (raw + 4);

    let picked = null; // option name shown in the info box
    const storageKey = (cls, sub) => `d2custom:${cls}/${sub}`;
    const load = (cls, sub) => { try { return JSON.parse(localStorage.getItem(storageKey(cls, sub))); } catch (e) { return null; } };
    const save = (cls, sub, build) => { try { localStorage.setItem(storageKey(cls, sub), JSON.stringify(build)); } catch (e) { /* storage unavailable */ } };

    function optionsFor(cls, sub) {
        const o = D.OPTIONS[`${cls}/${sub}`];
        return Object.assign({}, o, { fragments: o.fragments.map(n => D.FRAGMENTS[sub][n]) });
    }
    const find = (list, name) => list.find(x => x.n === name);
    const capacity = (opts, aspects) => aspects.reduce((sum, a) => sum + ((find(opts.aspects, a) || {}).c || 0), 0);

    // Start from the curated build currently selected, so there is something to tweak
    function defaultBuild(opts, ctx) {
        const { lo, aspects } = ctx.curated();
        const pick = (kind, name) => (find(opts[kind], name) || opts[kind][0] || {}).n;
        return {
            super: pick('super', lo[0]), class: pick('class', lo[1]), move: pick('move', lo[2]),
            melee: pick('melee', lo[3]), grenade: pick('grenade', lo[4]),
            aspects: aspects.filter(a => find(opts.aspects, a)), fragments: lo[5].filter(f => find(opts.fragments, f))
        };
    }

    function validate(build, opts) {
        for (const [kind] of ABILITY_KINDS) if (!find(opts[kind], build[kind])) build[kind] = (opts[kind][0] || {}).n;
        build.aspects = (build.aspects || []).filter(a => find(opts.aspects, a)).slice(0, 2);
        build.fragments = (build.fragments || []).filter(f => find(opts.fragments, f)).slice(0, capacity(opts, build.aspects));
        return build;
    }

    // ── build profile ──
    function profile(build, opts, sub) {
        const tags = {};
        const add = (list, w) => (list || []).forEach(t => { tags[t] = (tags[t] || 0) + w; });
        const chosen = [];
        for (const [kind] of ABILITY_KINDS) {
            const o = find(opts[kind], build[kind]);
            if (!o) continue;
            chosen.push(o);
            // an ability's own type says nothing about focus (every build has a grenade), its other effects do
            if (kind !== 'move') add(o.t.filter(t => t !== kind), 1);
        }
        build.aspects.forEach(a => { const o = find(opts.aspects, a); chosen.push(o); add(o.t, 3); });
        const statMods = {};
        build.fragments.forEach(f => {
            const o = find(opts.fragments, f);
            add(o.t, 1.5);
            for (const m of o.d.matchAll(/([+-]\d+) (Weapons?|Health|Class|Grenade|Super|Melee) [▲▼]/g)) {
                const stat = m[2] === 'Weapon' ? 'Weapons' : m[2];
                statMods[stat] = (statMods[stat] || 0) + Number(m[1]);
            }
        });
        const elements = sub === 'prismatic'
            ? [...new Set(chosen.map(o => o.e).filter(Boolean))]
            : [sub];
        const names = new Set(), forced = new Set();
        chosen.forEach(o => aliasesOf(o.n).forEach(a => names.add(a)));
        // a subclass with only one melee or super gives no choice, so exotics built around it shouldn't get a big boost
        for (const [kind] of ABILITY_KINDS) if (opts[kind].length === 1) aliasesOf(opts[kind][0].n).forEach(a => forced.add(a));
        const abilityStat = {};
        for (const kind of ['grenade', 'melee', 'class', 'super']) {
            const o = find(opts[kind], build[kind]);
            if (o) abilityStat[kind] = o.t.filter(t => !GENERIC.has(t)).reduce((s, t) => s + (tags[t] || 0), 0) * 0.4;
        }
        return { tags, elements, statMods, names, forced, abilityStat };
    }

    // Strongest matches count most and extra matches add less, so a focused item beats one that lists every tag.
    // Generic tags (grenade, melee...) count half as much as specific ones like Threadlings or Volatile.
    const GENERIC = new Set(['grenade', 'melee', 'class', 'super', 'weapons', 'survival', 'orb', 'finisher']);
    const scoreTags = (list, prof) => (list || [])
        .map(t => (prof.tags[t] || 0) * (GENERIC.has(t) ? 0.5 : 1))
        .sort((a, b) => b - a)
        .reduce((s, v, i) => s + v / (i + 1), 0);
    const topMatches = (list, prof, n = 3) => (list || []).filter(t => prof.tags[t])
        .sort((a, b) => prof.tags[b] - prof.tags[a]).slice(0, n).map(t => TAG_LABELS[t] || t);
    const elName = e => e[0].toUpperCase() + e.slice(1);
    // "Golden Gun: Marksman" is also referred to as "Golden Gun"; "Coldsnap Grenade" as "Coldsnap grenades"
    const aliasesOf = n => [n, ...(n.includes(':') ? [n.split(':')[0]] : []), ...(n.endsWith(' Grenade') ? [n.replace(/ Grenade$/, ' grenade')] : []), ...(ALIASES[n] || [])];

    // Every super/ability/aspect name of this class, for spotting exotics built around one of them
    function mentionables(cls) {
        const names = new Set();
        for (const [key, o] of Object.entries(D.OPTIONS)) {
            if (!key.startsWith(cls + '/')) continue;
            for (const kind of ['super', 'class', 'melee', 'grenade', 'aspects']) {
                for (const x of o[kind]) {
                    if (/^(Solar|Arc|Void|Stasis|Strand) Grenade$/.test(x.n)) continue; // too generic to mean "built around"
                    aliasesOf(x.n).forEach(a => names.add(a));
                }
            }
        }
        return [...names];
    }
    const mentions = (text, names) => names.filter(n => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${n.endsWith(' grenade') ? 's?' : ''}\\b`, n.endsWith(' grenade') ? 'i' : '').test(text));

    function recommendArmor(cls, prof) {
        const names = mentionables(cls);
        return Object.entries(D.ARMOR[cls]).map(([name, a]) => {
            const text = a.p.map(p => p[1]).join(' ');
            const mentioned = mentions(text, names);
            const hits = mentioned.filter(n => prof.names.has(n));
            if (mentioned.length && !hits.length) return null; // built around something this build doesn't use
            if (a.e.length && !a.e.some(e => prof.elements.includes(e))) return null; // wrong element
            const chosenHits = hits.filter(n => !prof.forced.has(n));
            // being built around an ability you chose is the strongest signal, so it scales with the build's top focus
            const builtAround = Math.max(6, 0.8 * Math.max(0, ...Object.values(prof.tags)));
            const score = scoreTags(a.t, prof) + chosenHits.length * builtAround + (hits.length - chosenHits.length) + (a.e.length ? 2 : 0);
            const why = [];
            if (hits.length) why.push(`Built around ${hits.join(' and ')}, which you have equipped.`);
            const m = topMatches(a.t, prof);
            if (m.length) why.push(`Feeds your build's focus on ${m.join(', ')}.`);
            return { name, a, score, why: why.join(' ') };
        }).filter(x => x && x.score > 0).sort((x, y) => y.score - x.score).slice(0, 3);
    }

    function recommendWeapons(prof, ctx) {
        const champOf = w => w.ch || (ctx.ARTIFACT[w.wt] || [])[0] || null;
        const elMatch = w => prof.elements.includes(w.el) || (w.flex === 'strand' && prof.elements.includes('strand')) || w.flex === 'grenade';
        const allowed = w => ctx.state.raid || !(w.raid || /raid/i.test(w.src));
        const exotics = Object.entries(D.WEAP).map(([n, w]) => Object.assign({ n, exotic: true }, w))
            .filter(w => w.sl && champOf(w) && allowed(w))
            .map(w => Object.assign(w, { score: scoreTags(w.t, prof) * 0.8 + (elMatch(w) ? 4 : 0) + (w.el === 'kinetic' ? 1 : 0) + 1 }));
        // a legendary rolls one perk per column, so it scores the best perk it can roll in each column for this build
        const rollPicks = w => (w.r || []).map(col => col.map(n => ({ n, s: scoreTags((PERK[n] || {}).t, prof) }))
            .sort((a, b) => b.s - a.s)[0]).filter(x => x && x.s > 0);
        const legends = D.LEG.filter(w => champOf(w) && allowed(w))
            .map(w => { const roll = rollPicks(w);
                return Object.assign({}, w, { roll, score: perkBonus(roll.reduce((s, x) => s + x.s, 0))
                    + (elMatch(w) ? 4 : 0) + (w.el === 'kinetic' ? 1 : 0) + (w.raid ? 1 : 0) + 1 }); });
        const isPrimary = w => (window.D2_AMMO || {})[w.n] === 'primary';
        const best = (list, slot, champ, primary) => list.filter(w => w.sl === slot && champOf(w) === champ && (!primary || isPrimary(w))).sort((a, b) => b.score - a.score)[0];

        // every loadout needs a Primary ammo weapon, so one slot (pri) is restricted to Primary picks
        let top = null;
        const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
        for (const p of perms) {
            for (let ex = 0; ex < 3; ex++) for (let pri = 0; pri < 3; pri++) {
                const pick = SLOTS.map((slot, i) => best(i === ex ? exotics : legends, slot, CHAMPS[p[i]], i === pri));
                if (pick.some(w => !w)) continue;
                const total = pick.reduce((s, w) => s + w.score, 0);
                if (!top || total > top.total) top = { total, pick };
            }
        }
        if (!top) return [];
        return top.pick.map(w => {
            const why = [];
            if (elMatch(w)) why.push(w.flex === 'grenade' ? 'Its element follows your grenade.' : `${elName(w.el)} damage, so its kills count for your ${prof.elements.map(elName).join('/')} fragments and aspects.`);
            const m = topMatches(w.t, prof);
            if (w.exotic && m.length) why.push(`Its perks feed ${m.join(', ')}.`);
            if (w.roll && w.roll.length) why.push(`Look for a roll with ${w.roll.map(x => x.n).join(' + ')}.`);
            return Object.assign({}, w, { champ: champOf(w), why: why.join(' ') });
        });
    }

    function recommendPerks(prof) {
        return D.WPERKS.filter(p => !p.e.length || p.e.some(e => prof.elements.includes(e)))
            .map(p => ({ p, score: scoreTags(p.t, prof) + (p.e.length && p.e.length < 5 ? 2 : 0) }))
            .filter(x => x.score > 0).sort((a, b) => b.score - a.score)
            .filter((x, i, all) => x.score >= all[0].score * 0.5).slice(0, 5)
            .map(({ p }) => Object.assign({ why: topMatches(p.t, prof, 2).join(', ') }, p));
    }

    // Artifact: score every artifact's perks against the build and keep the best one. You slot `slots` perks;
    // column 2 and 3 perks only fit the last `late` slots, and at most `top` can come from column 3.
    // weapons: [{ wt: 'Hand Cannon', el: 'arc' }]
    function recommendArtifact(prof, weapons, grenade, sub) {
        const A = D.ARTI;
        if (!A) return null;
        const els = sub === 'prismatic' ? [...prof.elements, 'prismatic'] : prof.elements;
        const fits = p => (!p.e || p.e.some(e => els.includes(e) || weapons.some(w => w.el === e)))
            && (!p.wt || weapons.some(w => p.wt.includes(w.wt)))
            && (!p.we || weapons.some(w => p.we.includes(w.el)))
            && (!p.g || p.g.includes(grenade));
        // a perk tied to your weapons or grenade is a sure fit, so it gets a bonus on top of its tags
        const score = p => fits(p) ? scoreTags(p.t, prof) + (p.wt || p.we || p.g ? 2 : 0) : 0;

        const ranked = A.list.map(a => {
            const cols = a.cols.map((c, ci) => c.map(p => ({ p, col: ci + 1, s: score(p) })).filter(x => x.s > 0).sort((x, y) => y.s - x.s));
            const sum = (list, k) => list.slice(0, k).reduce((s, x) => s + x.s, 0);
            let best = { total: 0, k: [0, 0, 0] };
            for (let k3 = 0; k3 <= Math.min(A.top, cols[2].length); k3++)
                for (let k2 = 0; k2 <= Math.min(A.late - k3, cols[1].length); k2++) {
                    const k1 = Math.min(A.slots - k2 - k3, cols[0].length);
                    const total = sum(cols[0], k1) + sum(cols[1], k2) + sum(cols[2], k3);
                    if (total > best.total) best = { total, k: [k1, k2, k3] };
                }
            const picks = cols.flatMap((c, ci) => c.slice(0, best.k[ci])).map(x => {
                const m = topMatches(x.p.t, prof, 2);
                const why = [x.p.wt || x.p.we || x.p.g ? 'Works with your loadout.' : '', m.length ? `Feeds ${m.join(', ')}.` : ''].filter(Boolean).join(' ');
                return Object.assign({ col: x.col, why }, x.p);
            });
            return { a, total: best.total, picks };
        }).sort((x, y) => y.total - x.total);

        const top = ranked[0];
        // fill any slots nothing scored for, keeping to the slot rules, then lay the picks out in slot order:
        // slots 1-2 hold column 1 perks, the last five hold the rest
        const picks = top.picks.slice();
        const late = () => picks.filter(p => p.col > 1).length;
        for (const [ci, c] of top.a.cols.entries()) for (const p of c) {
            if (picks.length >= A.slots || picks.some(x => x.n === p.n)) continue;
            if (ci > 0 && (late() >= A.late || (ci === 2 && picks.filter(x => x.col === 3).length >= A.top))) continue;
            if (!fits(p)) continue;
            picks.push(Object.assign({ col: ci + 1, why: 'Filler: nothing else stands out, so any perk works here.', filler: true }, p));
        }
        const first = picks.filter(p => p.col === 1).slice(0, A.slots - A.late);
        const slots = [...first, ...picks.filter(p => !first.includes(p)).sort((x, y) => x.col - y.col)];
        return { name: top.a.n, icon: top.a.i, slots, total: A.slots,
            alts: ranked.slice(1, 3).filter(r => r.total >= top.total * 0.75).map(r => r.a.n) };
    }

    function artifactHtml(rec, ctx) {
        if (!rec) return '';
        const lead = rec.total - D.ARTI.late;
        return `<h3 class="panel-title">Artifact <span class="panel-count">recommended · equip one</span></h3>
            <div class="art-head">${ctx.img(rec.icon, 'art-icon')}<div>
                <div class="art-name">${ctx.esc(rec.name)}</div>
                <div class="wperk-text">${rec.alts.length ? `Also a good fit: ${rec.alts.map(ctx.esc).join(', ')}.` : 'Clearly the best artifact for this build.'}</div></div></div>
            <div class="art-slots">${rec.slots.map((p, i) => `<div class="art-slot${p.filler ? ' filler' : ''}" title="${ctx.esc(p.n)}">
                <span class="art-slot-num">${i + 1}</span>${ctx.img(p.i, 'art-slot-icon')}
                <span class="art-slot-name">${ctx.esc(p.n)}</span><span class="art-slot-col">Col ${p.col}</span></div>`).join('')}</div>
            <p class="art-rule">Slots 1-${lead} take column 1 perks only. Slots ${lead + 1}-${rec.total} take any column, with at most ${D.ARTI.top} from column 3.</p>
            <div class="wperks">${rec.slots.map((p, i) => `<div class="wperk">${ctx.img(p.i, 'wperk-icon')}<div>
                <div class="wperk-name">${ctx.esc(p.n)} <span class="wperk-why">Slot ${i + 1} · Column ${p.col}${p.why ? ' · ' + ctx.esc(p.why) : ''}</span></div>
                <div class="wperk-text">${ctx.textHtml(p.d)}</div></div></div>`).join('')}</div>`;
    }

    function recommendSets(prof, ctx) {
        return Object.entries(ctx.S).filter(([key, s]) => ctx.state.raid || !s.raid)
            .map(([key, s]) => {
                const tags = SET_TAGS[key] || [];
                const score = scoreTags(tags, prof);
                return { key, s, score, why: topMatches(tags, prof).join(', ') };
            })
            .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
    }

    function statPriority(prof) {
        const t = prof.tags;
        const survival = SURVIVAL_TAGS.reduce((s, k) => s + (t[k] || 0), 0);
        const scores = {
            Grenade: (t.grenade || 0) + (prof.abilityStat.grenade || 0), Melee: (t.melee || 0) + (prof.abilityStat.melee || 0),
            Class: (t.class || 0) + (prof.abilityStat.class || 0), Super: (t.super || 0) + (prof.abilityStat.super || 0),
            Weapons: (t.weapons || 0) + 1, Health: survival * 0.6
        };
        for (const [k, v] of Object.entries(prof.statMods)) scores[k] += v / 10;
        return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
    }

    // ── UI ──
    const KIND_LABELS = { super: 'Super', class: 'Class Ability', move: 'Movement', melee: 'Melee', grenade: 'Grenade', aspects: 'Aspect', fragments: 'Fragment' };

    function tile(kind, o, selected, disabled, ctx, extra = '') {
        const type = KIND_LABELS[kind] + (kind === 'aspects' ? ` · ${o.c} fragment slots` : '');
        return `<button class="opt${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}" data-kind="${kind}" data-name="${ctx.esc(o.n)}"
            data-tip-type="${ctx.esc(type)}" aria-label="${ctx.esc(o.n)}">
            ${ctx.img(o.i)}<span class="opt-name">${ctx.esc(o.n)}</span>${extra}</button>`;
    }

    function render(container, ctx) {
        const { state, esc, textHtml, img, itemCard } = ctx;
        const opts = optionsFor(state.cls, state.sub);
        const build = validate(load(state.cls, state.sub) || defaultBuild(opts, ctx), opts);
        const cap = capacity(opts, build.aspects);
        const prof = profile(build, opts, state.sub);

        const focus = Object.entries(prof.tags).filter(([t]) => TAG_LABELS[t]).sort((a, b) => b[1] - a[1]).slice(0, 7);
        const maxFocus = focus.length ? focus[0][1] : 1;
        const info = picked && [...ABILITY_KINDS.map(([k]) => opts[k]).flat(), ...opts.aspects, ...opts.fragments].find(o => o.n === picked);

        const editor = `
            ${ABILITY_KINDS.map(([kind, label]) => `
                <h3 class="panel-title">${label}</h3>
                <div class="opt-grid">${opts[kind].map(o => tile(kind, o, build[kind] === o.n, false, ctx)).join('')}</div>`).join('')}

            <h3 class="panel-title">Aspects <span class="panel-count">${build.aspects.length} / 2</span></h3>
            <div class="opt-grid">${opts.aspects.map(o => tile('aspects', o, build.aspects.includes(o.n), false, ctx,
                `<span class="opt-cap">+${o.c}</span>`)).join('')}</div>

            <h3 class="panel-title">Fragments <span class="panel-count">${build.fragments.length} / ${cap} slots</span></h3>
            <div class="opt-grid small">${opts.fragments.map(o => tile('fragments', o, build.fragments.includes(o.n),
                !build.fragments.includes(o.n) && build.fragments.length >= cap, ctx)).join('')}</div>

            <div class="opt-info">${info
                ? `<div class="opt-info-name">${esc(info.n)}</div><div class="opt-info-text">${textHtml(info.d)}</div>`
                : '<div class="opt-info-text">Tap any option to read what it does. Hover works too.</div>'}</div>
            <button class="reset" data-kind="reset">Reset to “${esc(ctx.curated().name)}”</button>`;

        let recs;
        if (!build.aspects.length) {
            recs = '<p class="empty">Pick at least one aspect to get recommendations.</p>';
        } else {
            const armor = recommendArmor(state.cls, prof);
            const weapons = recommendWeapons(prof, ctx);
            const wperks = recommendPerks(prof);
            const artifact = recommendArtifact(prof, weapons.map(w => ({ wt: w.wt, el: w.el })), build.grenade, state.sub);
            const sets = recommendSets(prof, ctx);
            const stats = statPriority(prof);
            recs = `
                <h3 class="panel-title">Build Focus <span class="panel-count">inferred from your picks</span></h3>
                <div class="focus">${focus.map(([t, v]) => `<div class="focus-row">
                    <span class="focus-label">${TAG_LABELS[t]}</span>
                    <span class="focus-bar"><span style="width:${Math.round(v / maxFocus * 100)}%"></span></span></div>`).join('')}</div>

                <h3 class="panel-title">Stat Priority</h3>
                <div class="stats">${stats.map((st, i) => `<div class="stat"><span class="stat-rank">${i + 1}</span>${img(ctx.STAT_ICONS[st], 'stat-icon')}<span>${st}</span></div>`).join('')}</div>

                <h3 class="panel-title">Exotic Armor <span class="panel-count">best fit first</span></h3>
                <div class="items">${armor.length ? armor.map((x, i) => itemCard({
                    slot: i === 0 ? 'Best fit' : `Option ${i + 1}`, name: x.name, rarity: 'exotic', type: `${ctx.className} Exotic ${x.a.s}`,
                    icon: x.a.i, perks: x.a.p, why: x.why, source: x.a.src || ctx.EXOTIC_ARMOR_SOURCE
                })).join('') : '<p class="empty">No exotic armor stands out for this mix. Any stat-focused exotic works.</p>'}</div>

                <h3 class="panel-title">Weapons <span class="panel-count">One per champion · ${ctx.ARTIFACT_NAME}</span></h3>
                <div class="items">${weapons.map(w => itemCard({
                    slot: w.sl, name: w.n, rarity: w.exotic ? 'exotic' : 'legendary', type: w.ty, icon: w.i,
                    champ: w.champ, how: w.ch ? 'built into its exotic perk' : `artifact mod for ${w.wt}s`,
                    perks: w.exotic ? w.p : null, why: w.why, source: w.src, origin: !w.exotic, weapon: true
                })).join('')}</div>

                ${wperks.length ? `<h3 class="panel-title">Legendary Perks to Look For</h3>
                <div class="wperks">${wperks.map(p => `<div class="wperk">${img(p.i, 'wperk-icon')}<div>
                    <div class="wperk-name">${esc(p.n)} <span class="wperk-why">${esc(p.why)}</span></div>
                    <div class="wperk-text">${textHtml(p.d)}</div></div></div>`).join('')}</div>` : ''}

                ${artifactHtml(artifact, ctx)}

                <h3 class="panel-title">Legendary Armor Sets</h3>
                <div class="items">${sets.length ? sets.map((x, i) => itemCard({
                    slot: i === 0 ? 'Main · 4 pieces' : 'Alt · or 2 + 2', name: x.s.name, rarity: 'legendary set', type: 'Legendary Armor Set',
                    why: x.why ? `Matches your focus on ${x.why}.` : '', source: x.s.source,
                    perks: [['2-Piece · ' + x.s.two[0], x.s.two[1]], ['4-Piece · ' + x.s.four[0], x.s.four[1]]]
                })).join('') : '<p class="empty">No set lines up with this focus. Pick sets for the stats you need.</p>'}</div>`;
        }

        container.innerHTML = `
            <div class="build-head">
                <h2>Build Your Own</h2>
                <p>Pick your super, abilities, aspects and fragments. Recommendations update as you go, based on what your picks focus on: grenades, melee, Threadlings, Volatile and so on. Your build is saved in this browser.</p>
            </div>
            <div class="columns">
                <section class="panel editor">${editor}</section>
                <section class="panel">${recs}</section>
            </div>`;

        container.onclick = e => {
            const btn = e.target.closest('button[data-kind]');
            if (!btn) return;
            const kind = btn.dataset.kind, name = btn.dataset.name;
            if (kind === 'reset') {
                try { localStorage.removeItem(storageKey(state.cls, state.sub)); } catch (err) { /* storage unavailable */ }
                picked = null;
                return ctx.rerender();
            }
            picked = name;
            if (kind === 'aspects') {
                build.aspects = build.aspects.includes(name) ? build.aspects.filter(a => a !== name) : [...build.aspects, name].slice(-2);
            } else if (kind === 'fragments') {
                if (build.fragments.includes(name)) build.fragments = build.fragments.filter(f => f !== name);
                else if (build.fragments.length < capacity(opts, build.aspects)) build.fragments.push(name);
            } else {
                build[kind] = name;
            }
            save(state.cls, state.sub, validate(build, opts));
            ctx.rerender();
        };
    }

    // In-game style hover tooltip with the option's full text (touch devices use the info box instead)
    let tipEl = null, tipCtx = null;
    function showTip(btn, x, y) {
        const opts = tipCtx && optionsFor(tipCtx.state.cls, tipCtx.state.sub);
        const o = opts && [...ABILITY_KINDS.map(([k]) => opts[k]).flat(), ...opts.aspects, ...opts.fragments].find(o => o.n === btn.dataset.name);
        if (!o) return;
        if (!tipEl) { tipEl = document.createElement('div'); tipEl.id = 'opt-tip'; document.body.appendChild(tipEl); }
        tipEl.innerHTML = `<div class="tip-head">${tipCtx.img(o.i, 'tip-icon')}<div><div class="tip-name">${tipCtx.esc(o.n)}</div>
            <div class="tip-type">${tipCtx.esc(btn.dataset.tipType)}</div></div></div>
            <div class="tip-body">${tipCtx.textHtml(o.d || 'No description.')}</div>`;
        tipEl.hidden = false;
        moveTip(x, y);
    }
    function moveTip(x, y) {
        if (!tipEl || tipEl.hidden) return;
        const pad = 16, w = tipEl.offsetWidth, h = tipEl.offsetHeight;
        const left = x + pad + w > window.innerWidth ? x - pad - w : x + pad;
        const top = Math.min(y + pad, window.innerHeight - h - 8);
        tipEl.style.left = Math.max(8, left) + 'px';
        tipEl.style.top = Math.max(8, top) + 'px';
    }
    const hideTip = () => { if (tipEl) tipEl.hidden = true; };
    document.addEventListener('mouseover', e => {
        const btn = e.target.closest && e.target.closest('.opt[data-name]');
        if (btn) showTip(btn, e.clientX, e.clientY); else hideTip();
    });
    document.addEventListener('mousemove', e => moveTip(e.clientX, e.clientY));
    document.addEventListener('scroll', hideTip, true);

    // Artifact pick for a curated build: lo is its LOADOUTS entry, weapons as in recommendArtifact
    function curatedArtifact(ctx, lo, aspects, weapons) {
        const opts = optionsFor(ctx.state.cls, ctx.state.sub);
        const build = validate({ super: lo[0], class: lo[1], move: lo[2], melee: lo[3], grenade: lo[4], aspects: [...aspects], fragments: [...lo[5]] }, opts);
        return artifactHtml(recommendArtifact(profile(build, opts, ctx.state.sub), weapons, build.grenade, ctx.state.sub), ctx);
    }

    window.D2Custom = { render: (container, ctx) => { tipCtx = ctx; hideTip(); render(container, ctx); }, artifact: curatedArtifact };
})();
