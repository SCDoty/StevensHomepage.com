(function () {
    const EXOTIC_ARMOR_SOURCE = 'Exotic engrams from endgame activities · focus at Rahool (Tower)';
    const CLASS_ITEM_SOURCE = 'Dual Destiny exotic mission (2-player, The Final Shape)';

    // Weapon library — referenced by key from each build
    const W = {
        // Kinetic / Strand / Stasis slot
        fatebringer:    { name: 'Fatebringer', type: 'Kinetic Hand Cannon', slot: 'Kinetic', el: 'kinetic', source: 'Vault of Glass raid' },
        outbreak:       { name: 'Outbreak Perfected', type: 'Kinetic Pulse Rifle', slot: 'Kinetic', el: 'kinetic', exotic: true, source: 'Zero Hour exotic mission' },
        rufus:          { name: "Rufus's Fury", type: 'Strand Auto Rifle', slot: 'Kinetic', el: 'strand', source: 'Root of Nightmares raid' },
        quicksilver:    { name: 'Quicksilver Storm', type: 'Strand Auto Rifle', slot: 'Kinetic', el: 'strand', exotic: true, source: 'Exotic Archive (Collections)' },
        deliverance:    { name: 'Deliverance', type: 'Stasis Fusion Rifle', slot: 'Kinetic', el: 'stasis', source: 'Vow of the Disciple raid' },
        agers:          { name: "Ager's Scepter", type: 'Stasis Trace Rifle', slot: 'Kinetic', el: 'stasis', exotic: true, source: 'Exotic Archive (Collections)' },
        // Energy slot
        sunshot:        { name: 'Sunshot', type: 'Solar Hand Cannon', slot: 'Energy', el: 'solar', exotic: true, source: 'Exotic Archive (Collections)' },
        zaouli:         { name: "Zaouli's Bane", type: 'Solar Hand Cannon', slot: 'Energy', el: 'solar', source: "King's Fall raid" },
        nation:         { name: 'Nation of Beasts', type: 'Solar Hand Cannon', slot: 'Energy', el: 'solar', source: 'Last Wish raid' },
        riskrunner:     { name: 'Riskrunner', type: 'Arc SMG', slot: 'Energy', el: 'arc', exotic: true, source: 'Exotic Archive (Collections)' },
        trinity:        { name: 'Trinity Ghoul', type: 'Arc Bow', slot: 'Energy', el: 'arc', exotic: true, source: 'Exotic Archive (Collections)' },
        swordbreaker:   { name: 'Swordbreaker', type: 'Arc Shotgun', slot: 'Energy', el: 'arc', source: "Crota's End raid" },
        forbearance:    { name: 'Forbearance', type: 'Arc Wave Grenade Launcher', slot: 'Energy', el: 'arc', source: 'Vow of the Disciple raid' },
        graviton:       { name: 'Graviton Lance', type: 'Void Pulse Rifle', slot: 'Energy', el: 'void', exotic: true, source: 'Exotic Archive (Collections)' },
        obligation:     { name: 'Collective Obligation', type: 'Void Pulse Rifle', slot: 'Energy', el: 'void', exotic: true, source: 'Vow of the Disciple raid' },
        oversoul:       { name: 'Oversoul Edict', type: 'Void Pulse Rifle', slot: 'Energy', el: 'void', source: "Crota's End raid" },
        wordofcrota:    { name: 'Word of Crota', type: 'Void Hand Cannon', slot: 'Energy', el: 'void', source: "Crota's End raid" },
        // Power slot
        apex:           { name: 'Apex Predator', type: 'Solar Rocket Launcher', slot: 'Power', el: 'solar', source: 'Last Wish raid' },
        gjallarhorn:    { name: 'Gjallarhorn', type: 'Solar Rocket Launcher', slot: 'Power', el: 'solar', exotic: true, source: 'Grasp of Avarice dungeon' },
        cataclysmic:    { name: 'Cataclysmic', type: 'Solar Linear Fusion Rifle', slot: 'Power', el: 'solar', source: 'Vow of the Disciple raid' },
        thunderlord:    { name: 'Thunderlord', type: 'Arc Machine Gun', slot: 'Power', el: 'arc', exotic: true, source: 'Exotic Archive (Collections)' },
        anarchy:        { name: 'Anarchy', type: 'Arc Grenade Launcher', slot: 'Power', el: 'arc', exotic: true, source: 'Exotic Archive (Collections)' },
        edgetransit:    { name: 'Edge Transit', type: 'Void Grenade Launcher', slot: 'Power', el: 'void', source: 'Vow of the Disciple raid' },
        qullim:         { name: "Qullim's Terminus", type: 'Void Machine Gun', slot: 'Power', el: 'void', source: "King's Fall raid" },
        corrective:     { name: 'Corrective Measure', type: 'Void Machine Gun', slot: 'Power', el: 'void', source: 'Vault of Glass raid' },
        detchaos:       { name: 'Deterministic Chaos', type: 'Void Machine Gun', slot: 'Power', el: 'void', exotic: true, source: 'Exotic Archive (Collections)' },
        coldcomfort:    { name: 'Cold Comfort', type: 'Stasis Rocket Launcher', slot: 'Power', el: 'stasis', source: 'Spire of the Watcher dungeon' },
        euphony:        { name: 'Euphony', type: 'Strand Linear Fusion Rifle', slot: 'Power', el: 'strand', exotic: true, source: "Salvation's Edge raid" }
    };

    // Legendary armor sets — 2 pieces give the first bonus, 4 pieces give both
    const S = {
        promised:      { name: 'Promised', source: "Salvation's Edge raid",
                         two: ['Stable Resonance', 'Defeating a powerful enemy grants damage resistance and bonus weapon damage.'],
                         four: ['Resonance Redirection', 'During Stable Resonance, weapon damage sometimes fires a burst that exhausts targets.'] },
        greathunt:     { name: 'Great Hunt', source: 'Last Wish raid',
                         two: ['Taken Barrier', 'Grenade kills briefly reduce incoming damage.'],
                         four: ['Taken Armaments', 'Grenade kills build Heavy ammo.'] },
        pantheos:      { name: 'Pantheos Resplendent', source: 'Pantheon',
                         two: ['Well Prepared', 'Ammo pickups grant Armor Charge, raising Health.'],
                         four: ['Down the Line', 'Sustained damage on bosses and Champions boosts weapon damage.'] },
        atheon:        { name: "Atheon's Memory", source: 'Vault of Glass raid',
                         two: ['Radiolaria Breach', 'After grabbing an Orb, your next shield break grants bonus Health.'],
                         four: ['Collective Power', 'While a subclass buff is active, sustained damage creates Orbs of Power.'] },
        crota:         { name: "Crota's Memory", source: "Crota's End raid",
                         two: ['Cursed Fist', 'Melee kills trigger a Cursed Thrall explosion.'],
                         four: ['Power of the Son', 'Staying in combat builds flinch and damage resistance.'] },
        apostate:      { name: "Apostate's Blade", source: 'Pit of Heresy dungeon',
                         two: ['Regenerative Threshold', 'Finishers store a heal for your next shield break.'],
                         four: ['Melee Conduction', 'With Radiant, Restoration or Cure, melee hits scorch.'] },
        legacy:        { name: "Legacy's Oath", source: 'Deep Stone Crypt raid',
                         two: ['Augmented Servos', 'Powered melee kills release a disorienting pulse.'],
                         four: ['God-Like Judgment', 'Breaking an enemy shield or casting your Super fires homing missiles.'] },
        nezarec:       { name: "Nezarec's Nightmare", source: 'Root of Nightmares raid',
                         two: ['Bad Dreams', 'Kills on debuffed enemies (scorched, jolted, frozen, weakened, suspended…) can spawn Orbs.'],
                         four: ['Dream-Devourer', 'Finishers on powerful enemies grant Devour.'] },
        collective:    { name: 'Collective Psyche', source: 'The Desert Perpetual raid',
                         two: ['Accretion', 'Ammo pickups stack faster weapon swap speed.'],
                         four: ['Doppler Effect', 'Suspend, unravel and sever last longer, as do Radiant and Restoration on you.'] },
        wayward:       { name: 'Wayward Psyche', source: 'The Desert Perpetual (Epic) raid',
                         two: ['Special Relativity', 'Ammo pickups reload your stowed Special weapon.'],
                         four: ['Superluminal Motion', 'After Super damage, health and shields regenerate while moving.'] },
        techeun:       { name: "Techeun's Regalia", source: 'Shattered Throne dungeon',
                         two: ['Queensfoil Rush', 'Finishers grant an overshield and release a slowing burst.'],
                         four: ['Truth to Power', 'Dealing damage builds damage resistance; max stacks speed up abilities.'] },
        takenking:     { name: 'Taken King', source: 'Ghosts of the Deep dungeon',
                         two: ['The Ceremony', 'Finishers and revives start a ritual that boosts Super energy.'],
                         four: ['Lucent Swarm', 'Orb pickups extend the ritual; ability kills can spawn Arc moths.'] },
        darkage:       { name: 'Dark Age', source: "Warlord's Ruin dungeon",
                         two: ['Taking Initiative', 'Melee and Sword hits stack handling and reload speed.'],
                         four: ['Healing Initiative', 'With stacks, your class ability creates a healing aura.'] },
        flain:         { name: 'Flain', source: 'Sundered Doctrine dungeon',
                         two: ['Sinew Stitching', 'Taking damage can spawn a Threadling.'],
                         four: ['Knit Together', 'After a shield break, your next Threadling hits heal you.'] },
        spacewalk:     { name: 'Spacewalk', source: "Vesper's Host dungeon",
                         two: ['Augmented Armaments', 'Primary weapons deal more damage to disoriented enemies.'],
                         four: ['Augmented Explosives', 'Grenades release an extra disorienting pulse.'] },
        coda:          { name: 'CODA', source: 'Prophecy dungeon',
                         two: ['Between Poles', 'Light kills grant Light Polarity; Darkness or Kinetic kills grant Dark Polarity.'],
                         four: ['So Very Thin', 'Light kills give grenade energy, Darkness kills give melee energy; alternating grants damage resistance.'] },
        thunderhead:   { name: 'Thunderhead', source: 'Neomuna activities',
                         two: ['License to Thrill', 'Using a grenade grants stacking close-range damage resistance.'],
                         four: ['Lethal Weave', 'Killing unraveled enemies grants grenade energy.'] },
        firstascent:   { name: 'First Ascent', source: 'Pale Heart activities',
                         two: ["Stack 'Em Up", 'Kills with different elements speed up Transcendence energy.'],
                         four: ["Burn 'Em Down", 'During Transcendence, grenades refund escalating grenade energy.'] },
        oryx:          { name: "Oryx's Memory", source: "King's Fall raid",
                         two: ['Iron Sharpens Iron', 'Kills on powerful enemies add ammo progress.'],
                         four: ['Ascendant Escape', 'After a powerful-enemy kill, your next shield break turns you invisible.'] },
        ironbattalion: { name: 'Iron Battalion', source: 'Iron Banner',
                         two: ['Primary Honing', 'Primary weapons gain handling, reload and damage against non-boss enemies.'],
                         four: ['Supercyclical', 'Kills during your Super refund Super energy when it ends.'] },
        seventh:       { name: 'Seventh Seraph', source: 'Vanguard Ops',
                         two: ["Rasputin's Wrath", 'Area or Solar kills grant Warmind Charges (+Weapons and Grenade stats).'],
                         four: ["Rasputin's Reprisal", 'With charges, killing powerful enemies releases a Solar blast that heals allies.'] }
    };

    // [main 4-piece set, alternative] per build, keyed by build name
    const SET_PICKS = {
        hunter: {
            'Golden Gun Burst':        [['promised', 'Bonus weapon damage after big kills, plus damage resistance.'], ['ironbattalion', 'Kills during Golden Gun refund Super.']],
            'Ignition Knives':         [['seventh', 'Ignitions are area kills — constant Warmind Charges and healing blasts.'], ['apostate', 'Knife and melee hits scorch while Radiant.']],
            'Radiant Hand Cannons':    [['promised', 'Stacks weapon damage on top of Radiant.'], ['collective', 'Keeps Radiant up longer.']],
            'Combination Blow Punch':  [['crota', 'Punch kills explode and you get tankier the longer you fight.'], ['darkage', 'Melee hits speed reloads; dodge heals.']],
            'Arc Staff Super':         [['ironbattalion', 'Arc Staff kills refund Super energy.'], ['takenking', 'Finishers between supers build Super.']],
            'Blinding Ascension':      [['techeun', 'Overshields and damage resistance for close-range play.'], ['spacewalk', 'Primaries hit harder on disoriented enemies.']],
            'Invisibility & Volatile': [['oryx', 'More invisibility after big kills.'], ['nezarec', 'Volatile and weakened kills spawn Orbs.']],
            'Tether Support':          [['nezarec', 'Weakened kills spawn Orbs, which feed your Super.'], ['takenking', 'Finishers and revives boost Super.']],
            'Team Invisibility':       [['oryx', 'Extra invisibility after big kills.'], ['darkage', 'Smoke Bomb creates a healing aura.']],
            'Duskfield Freeze':        [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['nezarec', 'Slowed and frozen kills spawn Orbs.']],
            'Shatter Damage':          [['nezarec', 'Frozen kills spawn Orbs.'], ['promised', 'Bonus weapon damage after big kills.']],
            'Suspend Control':         [['collective', 'Suspend and unravel last longer.'], ['thunderhead', 'Unraveled kills refund grenade energy.']],
            'Threaded Specter Clones': [['darkage', 'Every decoy also drops a healing aura.'], ['thunderhead', 'Unraveled kills refund grenade energy.']],
            'Exotic Class Item':       [['firstascent', 'Built for Prismatic — faster Transcendence and grenade refunds.'], ['coda', 'Alternating Light and Dark kills refund abilities.']],
            'Combination Blow':        [['coda', 'Dark kills refund melee and alternating gives damage resistance.'], ['crota', 'Punch kills explode.']]
        },
        titan: {
            'Sunspot Restoration':     [['collective', 'Restoration lasts longer.'], ['apostate', 'Melee hits scorch while Restoration is up.']],
            'Consecration Melee':      [['crota', 'Melee kills explode; damage resistance in long fights.'], ['apostate', 'Melee hits scorch while Radiant.']],
            'Burning Maul DPS':        [['promised', 'Bonus weapon damage between supers.'], ['ironbattalion', 'Maul kills refund Super.']],
            'Thundercrash DPS':        [['promised', 'Bonus weapon damage between supers.'], ['takenking', 'Finishers boost Super energy.']],
            'Knockout Punch':          [['crota', 'Punch kills explode; damage resistance in long fights.'], ['legacy', 'Powered melee kills disorient nearby enemies.']],
            'Pulse Grenade Loop':      [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Overshield Shield Throw': [['crota', 'Melee kills explode; damage resistance in long fights.'], ['nezarec', 'Weakened and volatile kills spawn Orbs.']],
            'Ward of Dawn Support':    [['takenking', 'Finishers and revives boost Super.'], ['atheon', 'Orbs while your subclass buff is up.']],
            'Volatile Rockets':        [['promised', 'Bonus weapon damage after big kills.'], ['pantheos', 'Sustained boss damage boosts weapon damage.']],
            'Crystal Shatter':         [['nezarec', 'Frozen kills spawn Orbs.'], ['techeun', 'Finisher overshields and damage resistance.']],
            'Overshield Tank':         [['techeun', 'Stacks more damage resistance on top of the overshield.'], ['greathunt', 'Grenade kills give damage resistance.']],
            'Suspend Slam':            [['collective', 'Suspend lasts longer.'], ['thunderhead', 'Unraveled kills refund grenade energy.']],
            'Banner of War':           [['crota', 'Melee kills explode; damage resistance in long fights.'], ['darkage', 'Melee hits speed reloads; barricade heals.']],
            'Exotic Class Item':       [['firstascent', 'Built for Prismatic — faster Transcendence and grenade refunds.'], ['coda', 'Alternating Light and Dark kills refund abilities.']],
            'Diamond Lance':           [['coda', 'Stasis (Dark) and Solar (Light) kills alternate for energy and damage resistance.'], ['crota', 'Melee kills explode.']]
        },
        warlock: {
            'Well of Radiance Support':  [['takenking', 'Finishers and revives boost Super.'], ['atheon', 'Orbs while your subclass buff is up.']],
            'Grenade Spam':              [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['seventh', 'Solar kills raise Grenade stat.']],
            'Starfire Fusion Grenades':  [['seventh', 'Solar area kills raise Weapons and Grenade stats.'], ['promised', 'Bonus weapon damage after big kills.']],
            'Arc Soul / Ionic Traces':   [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['spacewalk', 'Grenades release an extra disorienting pulse.']],
            'Chaos Reach DPS':           [['ironbattalion', 'Chaos Reach kills refund Super.'], ['wayward', 'Regenerate while moving after Super damage.']],
            'Ionic Sentry':              [['nezarec', 'Jolted kills spawn Orbs.'], ['spacewalk', 'Grenades release an extra disorienting pulse.']],
            'Chaos Accelerant Grenades': [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Nova Bomb / Devour':        [['nezarec', 'Finishers grant Devour; debuffed kills spawn Orbs.'], ['takenking', 'Finishers boost Super.']],
            'Bleak Watcher Turrets':     [['nezarec', 'Slowed and frozen kills spawn Orbs.'], ['greathunt', 'Grenade kills give damage resistance and Heavy ammo.']],
            "Winter's Wrath Freeze":     [['ironbattalion', "Winter's Wrath kills refund Super."], ['nezarec', 'Frozen kills spawn Orbs.']],
            'Threadling Swarm':          [['flain', 'Even more threadlings, and they heal you.'], ['thunderhead', 'Unraveled kills refund grenade energy.']],
            'Wanderer Suspend':          [['thunderhead', 'Grenade damage resistance; unraveled kills refund grenades.'], ['collective', 'Suspend and unravel last longer.']],
            'Exotic Class Item':         [['firstascent', 'Built for Prismatic — faster Transcendence and grenade refunds.'], ['coda', 'Alternating Light and Dark kills refund abilities.']],
            'Bleak Watcher Grenades':    [['coda', 'Stasis (Dark) and Solar (Light) kills alternate for energy and damage resistance.'], ['firstascent', 'Faster Transcendence and grenade refunds.']]
        }
    };

    // build: [name, description, aspects, exotic armor {name, slot, why, source?}, stat priority, weapons [key, why]]
    const B = (name, desc, aspects, armor, stats, weapons) => ({ name, desc, aspects, armor, stats, weapons });

    const SUBCLASSES = [
        { key: 'solar', name: 'Solar' }, { key: 'arc', name: 'Arc' }, { key: 'void', name: 'Void' },
        { key: 'stasis', name: 'Stasis' }, { key: 'strand', name: 'Strand' }, { key: 'prismatic', name: 'Prismatic' }
    ];

    const DATA = {
        hunter: { name: 'Hunter', builds: {
            solar: [
                B('Golden Gun Burst', 'One massive Golden Gun shot for boss damage. Build Radiant and stack weapon buffs before the shot.',
                    ['Knock \'Em Down', 'Gunpowder Gamble'],
                    { name: 'Celestial Nighthawk', slot: 'Helmet', why: 'Turns Golden Gun into a single huge-damage shot.' },
                    ['Super', 'Weapons'],
                    [['fatebringer', 'Add clear between supers.'], ['zaouli', 'Incandescent hand cannon that spreads scorch.'], ['apex', 'Top-tier legendary rocket for burst damage.']]),
                B('Ignition Knives', 'Throwing knives that scorch and ignite. Melee regen keeps the knives coming.',
                    ['Knock \'Em Down', 'On Your Mark'],
                    { name: "Caliban's Hand", slot: 'Gauntlets', why: 'Proximity knife ignites on hit — chain explosions through packs.' },
                    ['Melee', 'Grenade'],
                    [['fatebringer', 'Explosive Payload pairs well with the ignite theme.'], ['nation', 'Solar hand cannon for Radiant damage.'], ['cataclysmic', 'Solar linear fusion for bosses.']]),
                B('Radiant Hand Cannons', 'Weapon-focused: Lucky Pants hand cannon damage with Radiant uptime.',
                    ['On Your Mark', 'Gunpowder Gamble'],
                    { name: 'Lucky Pants', slot: 'Leg Armor', why: 'Hand cannons ready instantly and gain stacking damage on swap.' },
                    ['Weapons', 'Class'],
                    [['fatebringer', 'Lucky Pants-boosted primary.'], ['zaouli', 'Second hand cannon so you always have one ready.'], ['gjallarhorn', 'Wolfpack Rounds buff the whole fireteam.']])
            ],
            arc: [
                B('Combination Blow Punch', 'Melee loop: kills with Combination Blow refund the melee and heal you.',
                    ['Flow State', 'Lethal Current'],
                    { name: "Liar's Handshake", slot: 'Gauntlets', why: 'Big damage and healing on Combination Blow with Cross Counter.' },
                    ['Melee', 'Class'],
                    [['fatebringer', 'Long-range backup primary.'], ['swordbreaker', 'Close-range shotgun to match the punch range.'], ['thunderlord', 'Ammo-efficient Arc heavy.']]),
                B('Arc Staff Super', 'Spam Arc Staff with fast super regen for add clear and survivability.',
                    ['Flow State', 'Lethal Current'],
                    { name: "Raiju's Harness", slot: 'Chest Armor', why: 'Extends Arc Staff and fires lightning bolts on dodge.' },
                    ['Super', 'Class'],
                    [['fatebringer', 'Primary between supers.'], ['forbearance', 'Chain Reaction wave grenade launcher clears adds.'], ['thunderlord', 'Arc heavy that jolts.']]),
                B('Blinding Ascension', 'Defensive Amplified play: blind and jolt enemies with Ascension and dodge.',
                    ['Ascension', 'Flow State'],
                    { name: 'Gifted Conviction', slot: 'Chest Armor', why: 'Dodge jolts nearby enemies and grants damage resistance.' },
                    ['Health', 'Class'],
                    [['fatebringer', 'Reliable kinetic primary.'], ['forbearance', 'Arc add clear.'], ['anarchy', 'Arc trap rounds for passive boss damage.']])
            ],
            void: [
                B('Invisibility & Volatile', 'Stay invisible, then make enemies volatile with Void weapons and finishers.',
                    ['Stylish Executioner', 'Vanishing Step'],
                    { name: "Gyrfalcon's Hauberk", slot: 'Chest Armor', why: 'Leaving invisibility gives your Void weapons Volatile Rounds.' },
                    ['Class', 'Weapons'],
                    [['fatebringer', 'Kinetic primary.'], ['oversoul', 'Void pulse rifle that benefits from Volatile Rounds.'], ['edgetransit', 'Void heavy grenade launcher.']]),
                B('Tether Support', 'Weaken bosses with Shadowshot and keep supers coming.',
                    ['Trapper\'s Ambush', 'On the Prowl'],
                    { name: 'Orpheus Rig', slot: 'Leg Armor', why: 'Deadfall tethers refund super energy for each enemy hit.' },
                    ['Super', 'Health'],
                    [['fatebringer', 'Kinetic primary.'], ['obligation', 'Void exotic that weakens and steals buffs.'], ['qullim', 'Void machine gun for sustained boss damage.']]),
                B('Team Invisibility', 'Keep the whole fireteam invisible — great for objective-heavy encounters.',
                    ['Vanishing Step', 'Trapper\'s Ambush'],
                    { name: 'Omnioculus', slot: 'Chest Armor', why: 'Smoke Bomb makes allies invisible and gives an extra charge.' },
                    ['Class', 'Health'],
                    [['outbreak', 'Nanite swarms for add clear.'], ['wordofcrota', 'Void hand cannon.'], ['edgetransit', 'Void heavy grenade launcher.']])
            ],
            stasis: [
                B('Duskfield Freeze', 'Defensive control: Duskfield grenades slow, freeze and reduce enemy damage.',
                    ['Grim Harvest', 'Touch of Winter'],
                    { name: 'Renewal Grasps', slot: 'Gauntlets', why: 'Bigger Duskfields that weaken enemies and protect allies.' },
                    ['Grenade', 'Health'],
                    [['agers', 'Stasis trace rifle that slows enemies.'], ['swordbreaker', 'Close-range energy shotgun.'], ['coldcomfort', 'Stasis rocket launcher.']]),
                B('Shatter Damage', 'Freeze and shatter enemies with Shatterdive for heavy damage.',
                    ['Shatterdive', 'Winter\'s Shroud'],
                    { name: 'Mask of Bakris', slot: 'Helmet', why: 'Damage buff against slowed and frozen targets.' },
                    ['Class', 'Weapons'],
                    [['deliverance', 'Stasis fusion that freezes targets.'], ['wordofcrota', 'Energy hand cannon.'], ['coldcomfort', 'Stasis rocket launcher.']])
            ],
            strand: [
                B('Suspend Control', 'Lock down rooms by suspending enemies with grapple and Strand weapons.',
                    ['Ensnaring Slam', 'Widow\'s Silk'],
                    { name: "Cyrtarachne's Facade", slot: 'Helmet', why: 'Grappling grants Woven Mail damage resistance.' },
                    ['Class', 'Health'],
                    [['rufus', 'Strand auto rifle that unravels targets.'], ['swordbreaker', 'Energy shotgun.'], ['euphony', 'Strand exotic linear fusion.']]),
                B('Threaded Specter Clones', 'Decoys pull aggro and explode into threadlings.',
                    ['Threaded Specter', 'Whirling Maelstrom'],
                    { name: 'The Sixth Coyote', slot: 'Chest Armor', why: 'Two class ability charges means two decoys.' },
                    ['Class', 'Melee'],
                    [['quicksilver', 'Strand exotic auto rifle with grenade and rocket shots.'], ['wordofcrota', 'Energy hand cannon.'], ['edgetransit', 'Heavy grenade launcher.']])
            ],
            prismatic: [
                B('Exotic Class Item', 'Mix two exotic perks on the Relativism cloak. Build into Transcendence for grenade and melee spam.',
                    ['Stylish Executioner', 'Gunpowder Gamble'],
                    { name: 'Relativism', slot: 'Class Item', why: 'Two exotic perks on one cloak — the most flexible Prismatic build.', source: CLASS_ITEM_SOURCE },
                    ['Grenade', 'Class'],
                    [['rufus', 'Strand primary to build Transcendence.'], ['graviton', 'Void exotic for Light-side energy.'], ['edgetransit', 'Heavy grenade launcher.']]),
                B('Combination Blow', 'Combination Blow punches with Prismatic Light and Dark buffs.',
                    ['Ascension', 'Winter\'s Shroud'],
                    { name: "Liar's Handshake", slot: 'Gauntlets', why: 'Combination Blow healing and damage.' },
                    ['Melee', 'Class'],
                    [['fatebringer', 'Kinetic primary.'], ['graviton', 'Void exotic primary.'], ['apex', 'Solar heavy rocket.']])
            ]
        }},
        titan: { name: 'Titan', builds: {
            solar: [
                B('Sunspot Restoration', 'Near-permanent Restoration from Sol Invictus sunspots. Very hard to kill.',
                    ['Sol Invictus', 'Roaring Flames'],
                    { name: 'Loreley Splendor Helm', slot: 'Helmet', why: 'Makes a healing sunspot when you\'re low on health.' },
                    ['Health', 'Melee'],
                    [['fatebringer', 'Kinetic primary.'], ['sunshot', 'Explosive Solar hand cannon for add clear.'], ['apex', 'Legendary Solar rocket.']]),
                B('Consecration Melee', 'Slam and cleave with Consecration, then burn with Roaring Flames.',
                    ['Consecration', 'Roaring Flames'],
                    { name: 'Synthoceps', slot: 'Gauntlets', why: 'Large melee damage buff when surrounded.' },
                    ['Melee', 'Class'],
                    [['fatebringer', 'Kinetic primary.'], ['zaouli', 'Incandescent hand cannon.'], ['cataclysmic', 'Solar linear fusion for bosses.']]),
                B('Burning Maul DPS', 'Super-focused boss damage with Burning Maul.',
                    ['Roaring Flames', 'Sol Invictus'],
                    { name: 'Pyrogale Gauntlets', slot: 'Gauntlets', why: 'Turns the Burning Maul slam into a fire tornado for burst damage.' },
                    ['Super', 'Weapons'],
                    [['fatebringer', 'Kinetic primary.'], ['nation', 'Solar hand cannon.'], ['gjallarhorn', 'Wolfpack rounds for the fireteam.']])
            ],
            arc: [
                B('Thundercrash DPS', 'One huge Thundercrash for boss damage.',
                    ['Knockout', 'Touch of Thunder'],
                    { name: 'Cuirass of the Falling Star', slot: 'Chest Armor', why: 'Big boost to Thundercrash damage.' },
                    ['Super', 'Weapons'],
                    [['fatebringer', 'Kinetic primary.'], ['forbearance', 'Arc wave grenade launcher.'], ['thunderlord', 'Arc exotic heavy.']]),
                B('Knockout Punch', 'Thunderclap and Knockout punches that delete enemies and heal you.',
                    ['Knockout', 'Juggernaut'],
                    { name: 'Point-Contact Cannon Brace', slot: 'Gauntlets', why: 'Thunderclap kills fire chain lightning.' },
                    ['Melee', 'Health'],
                    [['fatebringer', 'Kinetic primary.'], ['swordbreaker', 'Close-range shotgun.'], ['thunderlord', 'Arc exotic heavy.']]),
                B('Pulse Grenade Loop', 'Abilities refund each other, so Pulse Grenades come back quickly.',
                    ['Touch of Thunder', 'Knockout'],
                    { name: 'Heart of Inmost Light', slot: 'Chest Armor', why: 'Using one ability empowers the other two.' },
                    ['Grenade', 'Melee'],
                    [['fatebringer', 'Kinetic primary.'], ['riskrunner', 'Arc SMG with damage resistance.'], ['corrective', 'Machine gun for sustained damage.']])
            ],
            void: [
                B('Overshield Shield Throw', 'Throw Sentinel Shield nonstop and keep Void overshields up.',
                    ['Controlled Demolition', 'Offensive Bulwark'],
                    { name: 'Doom Fang Pauldron', slot: 'Gauntlets', why: 'Void melee kills grant super energy and shield throws.' },
                    ['Melee', 'Super'],
                    [['fatebringer', 'Kinetic primary.'], ['oversoul', 'Void pulse rifle.'], ['edgetransit', 'Void heavy grenade launcher.']]),
                B('Ward of Dawn Support', 'Raid support: Ward of Dawn with team damage buffs and blinding.',
                    ['Bastion', 'Offensive Bulwark'],
                    { name: 'Helm of Saint-14', slot: 'Helmet', why: 'Ward of Dawn blinds enemies and gives allies overshields.' },
                    ['Super', 'Health'],
                    [['fatebringer', 'Kinetic primary.'], ['wordofcrota', 'Void hand cannon.'], ['gjallarhorn', 'Wolfpack rounds for the fireteam.']]),
                B('Volatile Rockets', 'Rocket-focused weapons build that makes enemies volatile.',
                    ['Controlled Demolition', 'Bastion'],
                    { name: 'Hazardous Propulsion', slot: 'Chest Armor', why: 'Fires bonus rockets when you use your class ability.' },
                    ['Weapons', 'Class'],
                    [['fatebringer', 'Kinetic primary.'], ['obligation', 'Void exotic that weakens and steals buffs.'], ['edgetransit', 'Void heavy grenade launcher.']])
            ],
            stasis: [
                B('Crystal Shatter', 'Create Stasis crystals with your barricade and shatter them for damage.',
                    ['Tectonic Harvest', 'Howl of the Storm'],
                    { name: 'Hoarfrost-Z', slot: 'Chest Armor', why: 'Barricade becomes a wall of Stasis crystals.' },
                    ['Class', 'Melee'],
                    [['deliverance', 'Stasis fusion that freezes targets.'], ['swordbreaker', 'Energy shotgun.'], ['coldcomfort', 'Stasis rocket launcher.']]),
                B('Overshield Tank', 'Stay alive with Stasis crystal overshields.',
                    ['Tectonic Harvest', 'Cryoclasm'],
                    { name: 'Icefall Mantle', slot: 'Gauntlets', why: 'Swaps your barricade for a strong but slow overshield.' },
                    ['Health', 'Grenade'],
                    [['agers', 'Stasis trace rifle.'], ['wordofcrota', 'Energy hand cannon.'], ['coldcomfort', 'Stasis rocket launcher.']])
            ],
            strand: [
                B('Suspend Slam', 'Drengr\'s Lash and slams suspend whole groups.',
                    ['Drengr\'s Lash', 'Into the Fray'],
                    { name: 'Abeyant Leap', slot: 'Leg Armor', why: 'Drengr\'s Lash suspends instead of tracking and gains energy.' },
                    ['Class', 'Health'],
                    [['rufus', 'Strand auto rifle.'], ['oversoul', 'Energy pulse rifle.'], ['euphony', 'Strand exotic linear fusion.']]),
                B('Banner of War', 'Melee kills empower Banner of War and heal your team.',
                    ['Banner of War', 'Flechette Storm'],
                    { name: 'Wishful Ignorance', slot: 'Gauntlets', why: 'Big Frenzied Blade melee damage buff.' },
                    ['Melee', 'Health'],
                    [['quicksilver', 'Strand exotic auto rifle.'], ['swordbreaker', 'Energy shotgun.'], ['edgetransit', 'Heavy grenade launcher.']])
            ],
            prismatic: [
                B('Exotic Class Item', 'Two exotic perks on the Stoicism mark. Consecration plus Knockout for melee damage.',
                    ['Consecration', 'Knockout'],
                    { name: 'Stoicism', slot: 'Class Item', why: 'Two exotic perks on one mark — the most flexible Prismatic build.', source: CLASS_ITEM_SOURCE },
                    ['Melee', 'Health'],
                    [['fatebringer', 'Kinetic primary.'], ['graviton', 'Void exotic primary.'], ['apex', 'Solar heavy rocket.']]),
                B('Diamond Lance', 'Freeze with Diamond Lance, then Consecrate to shatter.',
                    ['Diamond Lance', 'Consecration'],
                    { name: 'Synthoceps', slot: 'Gauntlets', why: 'Melee damage buff when surrounded.' },
                    ['Melee', 'Class'],
                    [['deliverance', 'Stasis fusion.'], ['zaouli', 'Solar hand cannon.'], ['gjallarhorn', 'Wolfpack rounds for the fireteam.']])
            ]
        }},
        warlock: { name: 'Warlock', builds: {
            solar: [
                B('Well of Radiance Support', 'Raid support: Well of Radiance healing and a team damage buff.',
                    ['Touch of Flame', 'Heat Rises'],
                    { name: 'Phoenix Protocol', slot: 'Chest Armor', why: 'Kills and assists inside Well refund super energy.' },
                    ['Super', 'Health'],
                    [['fatebringer', 'Kinetic primary.'], ['zaouli', 'Solar hand cannon.'], ['gjallarhorn', 'Wolfpack rounds for the fireteam.']]),
                B('Grenade Spam', 'Sunbracers make your grenades free for a while after a melee kill.',
                    ['Touch of Flame', 'Hellion'],
                    { name: 'Sunbracers', slot: 'Gauntlets', why: 'Unlimited Solar grenades after a Solar melee kill.' },
                    ['Grenade', 'Melee'],
                    [['fatebringer', 'Kinetic primary.'], ['sunshot', 'Explosive Solar hand cannon.'], ['apex', 'Solar rocket.']]),
                B('Starfire Fusion Grenades', 'Two fusion grenade charges with fast regen. Good burst damage on bosses.',
                    ['Touch of Flame', 'Heat Rises'],
                    { name: 'Starfire Protocol', slot: 'Chest Armor', why: 'Extra fusion grenade charge; weapon damage refunds grenade energy.' },
                    ['Grenade', 'Weapons'],
                    [['fatebringer', 'Kinetic primary.'], ['nation', 'Solar hand cannon.'], ['cataclysmic', 'Solar linear fusion.']])
            ],
            arc: [
                B('Arc Soul / Ionic Traces', 'Use grenades to get an Arc Soul and stay Amplified.',
                    ['Arc Soul', 'Electrostatic Mind'],
                    { name: 'Getaway Artist', slot: 'Gauntlets', why: 'Use an Arc grenade to create an empowered Arc Soul.' },
                    ['Grenade', 'Class'],
                    [['fatebringer', 'Kinetic primary.'], ['riskrunner', 'Arc SMG with damage resistance.'], ['corrective', 'Machine gun.']]),
                B('Chaos Reach DPS', 'Long Chaos Reach beams with fast super regen.',
                    ['Electrostatic Mind', 'Lightning Surge'],
                    { name: 'Geomag Stabilizers', slot: 'Leg Armor', why: 'Extends Chaos Reach and fills the last bit of super energy.' },
                    ['Super', 'Grenade'],
                    [['fatebringer', 'Kinetic primary.'], ['forbearance', 'Arc wave grenade launcher.'], ['thunderlord', 'Arc exotic heavy.']]),
                B('Ionic Sentry', 'Ionic Sentry turrets plus Fallen Sunstar Ionic Traces keep your abilities up.',
                    ['Ionic Sentry', 'Electrostatic Mind'],
                    { name: 'Fallen Sunstar', slot: 'Helmet', why: 'Ionic Traces give more energy and make more traces.' },
                    ['Grenade', 'Melee'],
                    [['fatebringer', 'Kinetic primary.'], ['trinity', 'Arc exotic bow that chains lightning.'], ['corrective', 'Machine gun.']])
            ],
            void: [
                B('Chaos Accelerant Grenades', 'Overcharged Void grenades with fast regen.',
                    ['Chaos Accelerant', 'Child of the Old Gods'],
                    { name: 'Contraverse Hold', slot: 'Gauntlets', why: 'Charged grenades give damage resistance and refund energy.' },
                    ['Grenade', 'Health'],
                    [['fatebringer', 'Kinetic primary.'], ['obligation', 'Void exotic that weakens enemies.'], ['edgetransit', 'Void heavy grenade launcher.']]),
                B('Nova Bomb / Devour', 'Devour sustain and Void kills that speed up your abilities.',
                    ['Feed the Void', 'Child of the Old Gods'],
                    { name: "Nezarec's Sin", slot: 'Helmet', why: 'Void kills speed up all ability regen.' },
                    ['Super', 'Grenade'],
                    [['fatebringer', 'Kinetic primary.'], ['oversoul', 'Void pulse rifle.'], ['detchaos', 'Void exotic machine gun that weakens.']])
            ],
            stasis: [
                B('Bleak Watcher Turrets', 'Turn Stasis grenades into turrets that freeze everything.',
                    ['Bleak Watcher', 'Iceflare Bolts'],
                    { name: 'Osmiomancy Gloves', slot: 'Gauntlets', why: 'Extra Coldsnap charge and faster Bleak Watcher regen.' },
                    ['Grenade', 'Class'],
                    [['deliverance', 'Stasis fusion.'], ['wordofcrota', 'Energy hand cannon.'], ['coldcomfort', 'Stasis rocket.']]),
                B("Winter's Wrath Freeze", 'Shatter whole rooms with Winter\'s Wrath and boost Stasis team damage.',
                    ['Glacial Harvest', 'Frostpulse'],
                    { name: 'Ballidorse Wrathweavers', slot: 'Gauntlets', why: 'Winter\'s Wrath grants allies Stasis weapon damage.' },
                    ['Super', 'Grenade'],
                    [['agers', 'Stasis trace rifle.'], ['zaouli', 'Energy hand cannon.'], ['coldcomfort', 'Stasis rocket.']])
            ],
            strand: [
                B('Threadling Swarm', 'Spam threadlings that seek out and kill enemies on their own.',
                    ['Weaver\'s Call', 'Mindspun Invocation'],
                    { name: 'Swarmers', slot: 'Leg Armor', why: 'More threadlings that hit harder.' },
                    ['Grenade', 'Class'],
                    [['rufus', 'Strand auto rifle.'], ['oversoul', 'Energy pulse rifle.'], ['euphony', 'Strand exotic linear fusion.']]),
                B('Wanderer Suspend', 'Tangles detonate and suspend enemies. Weapon kills boost your grenades.',
                    ['The Wanderer', 'Weavewalk'],
                    { name: "Verity's Brow", slot: 'Helmet', why: 'Weapon kills that match your subclass increase grenade damage and regen.' },
                    ['Grenade', 'Health'],
                    [['quicksilver', 'Strand exotic auto rifle.'], ['swordbreaker', 'Energy shotgun.'], ['edgetransit', 'Heavy grenade launcher.']])
            ],
            prismatic: [
                B('Exotic Class Item', 'Two exotic perks on the Solipsism bond. Feed the Void plus Bleak Watcher.',
                    ['Feed the Void', 'Bleak Watcher'],
                    { name: 'Solipsism', slot: 'Class Item', why: 'Two exotic perks on one bond — the most flexible Prismatic build.', source: CLASS_ITEM_SOURCE },
                    ['Grenade', 'Health'],
                    [['rufus', 'Strand primary for Dark energy.'], ['graviton', 'Void exotic primary.'], ['edgetransit', 'Heavy grenade launcher.']]),
                B('Bleak Watcher Grenades', 'Prismatic Bleak Watcher turrets alongside Hellion.',
                    ['Bleak Watcher', 'Hellion'],
                    { name: 'Osmiomancy Gloves', slot: 'Gauntlets', why: 'Faster Bleak Watcher turrets.' },
                    ['Grenade', 'Class'],
                    [['deliverance', 'Stasis fusion.'], ['zaouli', 'Solar hand cannon.'], ['coldcomfort', 'Stasis rocket.']])
            ]
        }}
    };

    const state = { cls: 'hunter', sub: 'solar', build: 0 };

    // restore from URL hash, e.g. #titan/strand/1
    const [hCls, hSub, hBuild] = location.hash.slice(1).split('/');
    if (DATA[hCls]) state.cls = hCls;
    if (DATA[state.cls].builds[hSub]) state.sub = hSub;
    if (DATA[state.cls].builds[state.sub][+hBuild]) state.build = +hBuild;

    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    function tab(label, active, el, onClick) {
        const b = document.createElement('button');
        b.className = 'd2-tab' + (active ? ' active' : '') + (el ? ' el-' + el : '');
        b.textContent = label;
        b.addEventListener('click', onClick);
        return b;
    }

    function gearCard(slot, name, exotic, type, why, source, el) {
        return `<div class="gear el-${el}">
            <div class="gear-slot">${esc(slot)}</div>
            <div class="gear-name${exotic ? ' gear-exotic' : ''}">${esc(name)}</div>
            <div class="gear-type">${esc(type)}</div>
            <div class="gear-why">${esc(why)}</div>
            <div class="gear-source">${esc(source)}</div>
        </div>`;
    }

    function setCard(set, why, main) {
        return `<div class="gear el-${state.sub}">
            <div class="gear-slot">${main ? 'Main pick · run 4 pieces' : 'Alternative · or mix 2 + 2'}</div>
            <div class="gear-name">${esc(set.name)}</div>
            <div class="gear-why">${esc(why)}</div>
            <div class="set-bonus"><b>2pc · ${esc(set.two[0])}</b> — ${esc(set.two[1])}</div>
            <div class="set-bonus"><b>4pc · ${esc(set.four[0])}</b> — ${esc(set.four[1])}</div>
            <div class="gear-source">${esc(set.source)}</div>
        </div>`;
    }

    function render() {
        history.replaceState(null, '', `#${state.cls}/${state.sub}/${state.build}`);

        const classTabs = document.getElementById('class-tabs');
        classTabs.replaceChildren(...Object.entries(DATA).map(([key, c]) =>
            tab(c.name, key === state.cls, null, () => { state.cls = key; state.build = 0; render(); })));

        const subTabs = document.getElementById('subclass-tabs');
        subTabs.replaceChildren(...SUBCLASSES.map(s =>
            tab(s.name, s.key === state.sub, s.key, () => { state.sub = s.key; state.build = 0; render(); })));

        const builds = DATA[state.cls].builds[state.sub];
        const buildTabs = document.getElementById('build-tabs');
        buildTabs.replaceChildren(...builds.map((b, i) =>
            tab(b.name, i === state.build, state.sub, () => { state.build = i; render(); })));

        const b = builds[state.build];
        const detail = document.getElementById('build-detail');
        detail.className = 'el-' + state.sub;
        detail.innerHTML = `
            <div class="bd-title">${esc(b.name)}</div>
            <div class="bd-desc">${esc(b.desc)}</div>
            <div class="bd-aspects">${b.aspects.map(a => `<span class="bd-chip">${esc(a)}</span>`).join('')}</div>

            <div class="bd-section">Weapons</div>
            <div class="gear-grid">
                ${b.weapons.map(([key, why]) => {
                    const w = W[key];
                    return gearCard(w.slot, w.name, w.exotic, w.type, why, w.source, w.el);
                }).join('')}
            </div>

            <div class="bd-section">Exotic Armor</div>
            <div class="gear-grid">
                ${gearCard(b.armor.slot, b.armor.name, true, DATA[state.cls].name + ' Exotic', b.armor.why, b.armor.source || EXOTIC_ARMOR_SOURCE, state.sub)}
            </div>

            <div class="bd-section">Legendary Armor Sets</div>
            <div class="gear-grid">
                ${SET_PICKS[state.cls][b.name].map(([key, why], i) => setCard(S[key], why, i === 0)).join('')}
            </div>

            <div class="bd-section">Stat Priority</div>
            <div class="stat-row">
                ${b.stats.map(s => `<span class="bd-chip">${esc(s)}</span>`).join('<span class="stat-arrow">›</span>')}
            </div>`;
    }

    render();
})();
