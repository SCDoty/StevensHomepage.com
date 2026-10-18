(function () {
    const EXOTIC_ARMOR_SOURCE = 'Exotic engrams from endgame activities · focus at Rahool (Tower)';
    const CLASS_ITEM_SOURCE = 'Dual Destiny exotic mission (2-player, The Final Shape)';

    // Exotic perk text, verbatim from the Bungie API manifest
    const PERKS = {
        "Winterbite": [["Big Frigid Glaive", "Fires a large ball of energy that locks onto nearby targets and freezes them. Strong against Stagger Unstoppable Champions."], ["Weighted Edge", "This weapon's melee attacks deal increased damage and slow targets when loaded with ammo."], ["Tilting at Windmills", "Blocking damage with your shield increases movement speed while shielding."]],
        "Dragon's Breath": [["Composite Propellant", "Rockets embed themselves in struck targets and periodically eject incendiary fuel that inflicts Scorch. The longer this weapon goes without firing, the more fuel the next rocket contains. Strong against Stagger Unstoppable Champions."], ["High Octane", "Igniting nearby targets partially replenishes fuel. This weapon refills itself from reserves upon gaining maximum fuel."]],
        "Le Monarque": [["Poison Arrows", "Arrows fired while perfectly drawn become poison arrows. Precision hits with poison arrows stun the combatant and spread poison to nearby ones. Strong against Disruption Overload Champions."], ["Snapshot Sights", "Faster time to aim down sights."]],
        "Bastion": [["Saint's Fists", "Rapidly fires 3 spreads of pure force.\nAfter a successful melee hit, this weapon gains increased damage, reduced charge time, and improved reload speed for a short duration. Hitting a target with most of the pellets in a burst increases melee damage for a short duration."], ["Breakthrough", "This weapon fires staggering projectiles. Strong against Unstoppable Champions."]],
        "Abeyant Leap": [["Puppeteer's Control", "Improves Drengr's Lash and spawns additional projectiles. These projectiles track targets more aggressively, travel farther, and suspend stronger. Gain Woven Mail when you suspend a target."]],
        "Ager's Scepter": [["Ager's Call", "Final blows with this weapon generate a slowing burst around the defeated target."], ["Rega's Refrain", "Stasis final blows transfer ammo to this weapon's magazine from reserves."]],
        "Anarchy": [["Arc Traps", "Grenades stick to surfaces and chain Arc bolts to other mines."]],
        "Ballidorse Wrathweavers": [["Hearts of Ice", "Targets frozen by your Winter's Wrath Super take increased Shatter damage. Allies in range of your Winter's Wrath shockwave and Frostpulse gain Frost Armor and deal increased damage with Stasis weapons. Granting these buffs to allies grants you Super energy."]],
        "Caliban's Hand": [["Roast 'Em", "Your Proximity Knife scorches targets it damages with its explosions, or ignites targets on final blow.\nAfter throwing a Proximity Knife, you gain increased melee regeneration until the knife explodes. Gain a small amount of melee energy when your Scorch damages a target, and Ignition final blows fully refund melee energy and can overflow into an additional knife charge."]],
        "Celestial Nighthawk": [["Hawkeye Hack", "Precision final blows reduce the cooldown of your Super. Modifies Golden Gun to fire a single, high-damage shot. Targets defeated by that shot give you Super energy and explode."]],
        "Collective Obligation": [["Void Leech", "This weapon stores Void debuffs when damaging foes, leeching them directly when the target is suppressed, weakened, or volatile. Once charged, Alternate Weapon Action to cause damage from this weapon and to apply the stored debuffs."], ["Umbral Sustenance", "This weapon's magazine is automatically reloaded when you gain Devour, a Void overshield, or become invisible."]],
        "Contraverse Hold": [["Chaotic Exchanger", "Resist incoming damage while charging your Void grenade with Chaos Accelerant. Charged Void grenades return grenade energy on a hit and apply Weaken."]],
        "Cuirass of the Falling Star": [["Glorious Charge", "Greatly increases your Thundercrash damage and grants you damage resistance after impact. Melee final blows while amplified grant you Super energy."]],
        "Cyrtarachne's Facade": [["Acrobat's Focus", "Activating Grapple grants Woven Mail. While active, Woven Mail provides flinch resistance and health when defeating targets."]],
        "Deterministic Chaos": [["Vexadecimal", "Strong against Shield-Piercing Barrier Champions. While holding down the trigger, every fourth Heavy Metal projectile also weakens targets on impact. Releasing the trigger after a Vexadecimal projectile partially reloads this weapon's magazine from reserves."], ["Heavy Metal", "While holding down the trigger, every fourth bullet becomes a heavy projectile that makes targets volatile on impact."]],
        "Doom Fang Pauldron": [["Horns of Doom", "Defeating targets with Void damage has a chance to grant an escalating bonus to damage with Void weapons. Defeating targets with Void melee grants Super energy.\nWhile Sentinel Shield is active, defeating targets with melee attacks recharges Shield Throw, which extends your Super on hitting a target."]],
        "Euphony": [["Unwound", "Dealing sustained damage with this weapon spawns Threadlings at your target's location."], ["Spindle", "Threadling damage increases this weapon's damage."]],
        "Fallen Sunstar": [["Ionic Conductor", "Ionic traces you create move faster and grant you additional ability energy. Nearby allies also gain ability energy when you collect an ionic trace."]],
        "Geomag Stabilizers": [["Close Enough", "Damaging targets with Chaos Reach extends its duration. Collecting Ionic Traces grants you energy for Chaos Reach. Sprinting while near max Bolt Charge will grant stacks over time."]],
        "Getaway Artist": [["Dynamic Duo", "Grenade: Convert your Arc grenade into a Arc Soul and become amplified. The Arc Soul functions as an autonomous turret."]],
        "Gifted Conviction": [["The Gift of Certainty", "Activating Ascension or Tempest Strike throws bouncing explosives at nearby targets that jolt and damage them. Jolting nearby targets grants you damage resistance."]],
        "Final Warning": [["All at Once", "Holding down the trigger marks targets within range and loads multiple bullets, which fire in a burst with increased stability on trigger release. Hitting a marked target with a fully charged burst will unravel them."], ["Pick Your Poison", "Hipfiring: Projectiles will track marked targets, dealing increased body shot damage on impact.\nAiming: Projectiles have greatly increased velocity and cause extra damage when dealing precision final blows to marked targets."]],
        "Gjallarhorn": [["Wolfpack Rounds", "Rounds fired split into tracking micro-missiles upon detonation."], ["Pack Hunter", "Gain increased handling and reload speed when standing near allies. Firing this weapon also grants Wolfpack Rounds to nearby allies wielding non-Exotic Rocket Launchers."]],
        "Graviton Lance": [["Black Hole", "Second shot of a burst rips a hole through space-time, doing high damage and recoil with no falloff."], ["Cosmology", "Kills with this weapon cause enemy targets to detonate and spawn Void projectiles that track targets."]],
        "Gyrfalcon's Hauberk": [["See Me, Feel Me", "Your Void weapons gain Volatile Rounds after you emerge from being invisible. When you are invisible and defeat a combatant while using a finisher, all of your weapons gain bonus damage; you and your nearby allies gain a reserve overshield and improved class ability regeneration. These reserve overshields can be deployed by using a class ability."]],
        "Hazardous Propulsion": [["Danger Close", "Weapon precision hits or final blows have a chance to load a Kinetic Exodus micro-missile. Activating your class ability fires loaded Exodus micro-missiles. Damaging targets with Exodus micro-missiles temporarily increases the damage you deal with other micro-missiles and Rocket Launchers."]],
        "Heart of Inmost Light": [["Overflowing Light", "Using an ability (grenade, melee, or Barricade) empowers the other two abilities. Empowered means abilities have faster regen, melees and grenades do more damage, and Barricades have more hit points."]],
        "Helm of Saint-14": [["Starless Night", "Weapons of Light persists after exiting Ward of Dawn. While Weapons of Light is active, final blows or sustained damage grant stacks of The Saint; Void and Kinetic damage sources also trigger a suppressing burst.\nPicking up Ward of Dawn consumes all stacks of The Saint and extends its duration based on how many stacks were consumed."]],
        "Hoarfrost-Z": [["Glacial Fortification", "While you have a Stasis Super equipped, your Barricade becomes a wall of Stasis crystals that slows nearby targets when created. Standing behind this barricade will grant you and your allies increased weapon reload speed, stability, and range."]],
        "Icefall Mantle": [["Glacial Guard", "While you have a Stasis Super equipped, rapid Stasis final blows grant Frost Armor. You heal a small amount whenever you gain Frost Armor. Replaces your class ability with a burst of Stasis energy that freezes nearby combatants, slows nearby opponents, and grants you increased Frost Armor."]],
        "Liar's Handshake": [["Cross Counter", "Using your Arc melee ability or being hit by a melee attack will allow you to follow up with an extremely powerful melee counterpunch that will heal you."]],
        "Loreley Splendor Helm": [["Cauterizing Flame", "While you have a Solar Super equipped, casting your Barricade or becoming critically wounded with full class ability energy creates a Sunspot at your location."]],
        "Lucky Pants": [["Illegally Modded Holster", "Improves sprint, slide, and airborne effectiveness while a Hand Cannon is equipped. For a short time after being drawn, Hand Cannons ready faster, are more accurate, and each hit against a combatant increases Hand Cannon damage."]],
        "Mask of Bakris": [["Light Shift", "While you have a Stasis or Arc Super equipped, your Dodge becomes a longer range, faster moving shift that partially cloaks you during use. After shifting, your Stasis and Arc weapons gain a stacking damage bonus for a short time. Final blows with this bonus active refund class ability energy."]],
        "Nezarec's Sin": [["Abyssal Extractors", "Void final blows increase ability energy recharge rate. Combatants affected by Soul Siphon are suppressed. Defeating suppressed targets grants more time to Abyssal Extractors."]],
        "Omnioculus": [["Beyond The Veil", "You gain a second Smoke Bomb charge and have damage resistance while invisible. When you make an ally invisible, they gain damage resistance while invisible and you gain melee energy."]],
        "Orpheus Rig": [["Uncanny Arrows", "Provides ability energy for each target tethered by Deadfall anchors. Moebius Quiver has an additional shot."]],
        "Osmiomancy Gloves": [["Fervid Coldsnap", "Your Coldsnap grenades have an additional charge that recharges quicker on hits. The seeker spawned from Coldsnap grenades travels farther."]],
        "Outbreak Perfected": [["The Corruption Spreads", "This weapon creates SIVA nanite swarms on rapid hits and precision kills."], ["Parasitism", "This weapon does more damage to enemies based on the number of SIVA nanites that attach to them."]],
        "Phoenix Protocol": [["Battle-Hearth", "Kills and assists you make while standing in your Well of Radiance return Super energy."]],
        "Point-Contact Cannon Brace": [["Hammer of the Gods", "Defeating targets with your Thunderclap melee restores melee energy. Targets near you when you use your Thunderclap suffer lightning strikes and become jolted; being amplified increases the damage of these lightning strikes."]],
        "Pyrogale Gauntlets": [["Percussive Flames", "Modifies Burning Maul into a single, high-damage slam of your hammer that creates several cyclones of flame. Consecration's second slam creates a cyclone of flame."]],
        "Quicksilver Storm": [["Missile Tracers", "Landing multiple hits turns your next shot into a homing micro-missile."], ["Grenade Chaser", "Landing multiple Missile Tracers loads a grenade. Alternate Weapon Action to switch into Grenade Launcher mode."], ["Catalyst", "This weapon's damage type becomes Strand. Final blows with grenades from this weapon create Tangles."]],
        "Raiju's Harness": [["Mobius Conduit", "Activating Gathering Storm calls down lightning on all nearby targets, jolting them while also amplifying allies. Defeating Arc debuffed targets grants a small amount of Gathering Storm energy."]],
        "Renewal Grasps": [["Depths of Duskfield", "Your Duskfield grenades have a much larger effect radius. Allies inside the Duskfield gain Frost Armor and targets inside the area deal reduced damage."]],
        "Riskrunner": [["Arc Conductor", "When taking Arc Damage, this weapon becomes more powerful and resists incoming Arc Damage. Kills extend the time in this overcharged state."], ["Superconductor", "When Arc Conductor is active, shots fired have the chance to become chain lightning and return ammo."]],
        "Starfire Protocol": [["Fusion Harness", "Fusion Grenades have an additional charge and recharge from empowered weapon damage, with empowered weapon final blows granting more energy. Defeating targets with Fusion Grenades grant Rift energy."]],
        "Sunbracers": [["Helium Spirals", "Increases the duration of Solar Grenades. Solar melee kills grant unlimited Solar Grenade energy for a brief time."]],
        "Sunshot": [["Sunburn", "This weapon fires explosive rounds and highlights targets that take damage from Sunshot."], ["Sun Blast", "Targets defeated with Sunshot explode in Solar energy, scorching other nearby targets."]],
        "Swarmers": [["Swarmers", "Destroying a Tangle spawns a Threadling. Your Threadlings unravel targets that they damage."]],
        "Synthoceps": [["Biotic Enhancements", "When you're surrounded, gain increased melee and Super damage, as well as improved weapon handling and reload speed."]],
        "The Sixth Coyote": [["Double Dodge", "Gain a second dodge charge. Shortly after dodging, your next weapon final blow spawns an Orb of Power."]],
        "Tessellation": [["Property: Undecidable", "This weapon adapts its damage type to match your equipped grenade. Final blows grant grenade and Transcendence energy."], ["Property: Irreducible", "Alternate Weapon Action: Consume your grenade to load a large projectile that generates an elemental explosion on impact and deals increased damage while Transcendence is active."], ["Catalyst", "Targets near the blast of Property: Irreducible are afflicted with an elemental effect matching your equipped grenade's damage type."]],
        "Thunderlord": [["Reign Havoc", "Final blows with this weapon generate stunning lighting strikes from above. Lightning strikes grant a stack of Bolt Charge. Strong against Disruption Overload Champions."], ["Lightning Rounds", "This weapon fires faster and more accurately the longer the trigger is held. Continuous damage generates stunning lightning strikes."]],
        "Trinity Ghoul": [["Split Electron", "Fires an arrow that splits when released. Aiming down sights and fully drawing the bow both decrease the spread."], ["Lightning Rod", "Precision kills grant the next shot chain-lightning capabilities."]],
        "Verity's Brow": [["The Fourth Magic", "Weapon final blows with a damage type matching your grenade grant Death Throes, which provide a grenade damage bonus and grant you grenade energy. When you have Death Throes and throw a grenade, nearby allies gain greatly increased grenade regeneration for a short time."]],
        "Wishful Ignorance": [["Wish-Dragon's Talons", "Gain an additional Frenzied Blade charge. Frenzied Blade and Flechette Storm briefly increase their damage with each strike. Pulses from your Banner of War return melee energy based on the number of allies healed."]]
    };

    // Weapon library — element, type, slot and source verified against the Bungie API manifest.
    // raid: true marks raid-only gear; noRaid names the stand-in (same slot and champion role) used when raid gear is off.
    // champ: set only for exotics whose own perk stuns a champion; everything else gets its champion role from ARTIFACT below.
    const W = {
        // Kinetic slot (Kinetic, Strand, Stasis)
        fatebringer:    { name: 'Fatebringer', type: 'Kinetic Hand Cannon', slot: 'Kinetic', el: 'kinetic', source: 'Vault of Glass raid', raid: true, noRaid: 'midnightcoup' },
        midnightcoup:   { name: 'Midnight Coup', type: 'Kinetic Hand Cannon', slot: 'Kinetic', el: 'kinetic', source: 'Into the Light' },
        outbreak:       { name: 'Outbreak Perfected', type: 'Kinetic Pulse Rifle', slot: 'Kinetic', el: 'kinetic', exotic: true, source: 'Exotic Archive at the Tower' },
        blastfurnace:   { name: 'Blast Furnace', type: 'Kinetic Pulse Rifle', slot: 'Kinetic', el: 'kinetic', source: 'Into the Light' },
        mintretro:      { name: 'Mint Retrograde', type: 'Strand Pulse Rifle', slot: 'Kinetic', el: 'strand', source: 'Pinnacle Ops' },
        euphony:        { name: 'Euphony', type: 'Strand Linear Fusion Rifle', slot: 'Kinetic', el: 'strand', exotic: true, source: "Salvation's Edge raid", raid: true, noRaid: 'bastion' },
        bastion:        { name: 'Bastion', type: 'Kinetic Fusion Rifle', slot: 'Kinetic', el: 'kinetic', exotic: true, champ: 'Unstoppable', source: 'Exotic Archive at the Tower' },
        deliverance:    { name: 'Deliverance', type: 'Stasis Fusion Rifle', slot: 'Kinetic', el: 'stasis', source: 'Vow of the Disciple raid', raid: true, noRaid: 'riptide' },
        riptide:        { name: 'Riptide', type: 'Stasis Fusion Rifle', slot: 'Kinetic', el: 'stasis', source: 'Lord Shaxx (Crucible vendor)' },
        rapacious:      { name: 'Rapacious Appetite', type: 'Stasis Submachine Gun', slot: 'Kinetic', el: 'stasis', source: 'Ghosts of the Deep dungeon' },
        // Energy slot (Solar, Arc, Void)
        sunshot:        { name: 'Sunshot', type: 'Solar Hand Cannon', slot: 'Energy', el: 'solar', exotic: true, source: 'Exotic engrams' },
        zaouli:         { name: "Zaouli's Bane", type: 'Solar Hand Cannon', slot: 'Energy', el: 'solar', source: "King's Fall raid · Pantheon", raid: true, noRaid: 'lunashowl' },
        lunashowl:      { name: "Luna's Howl", type: 'Solar Hand Cannon', slot: 'Energy', el: 'solar', source: 'Into the Light · Crucible' },
        nosurvivors:    { name: 'No Survivors', type: 'Solar Submachine Gun', slot: 'Energy', el: 'solar', source: 'Ghosts of the Deep dungeon · Rite of the Nine' },
        axiallacuna:    { name: 'Axial Lacuna', type: 'Solar Fusion Rifle', slot: 'Energy', el: 'solar', source: 'Exploring the Pale Heart' },
        riskrunner:     { name: 'Riskrunner', type: 'Arc Submachine Gun', slot: 'Energy', el: 'arc', exotic: true, source: 'Exotic engrams' },
        trinity:        { name: 'Trinity Ghoul', type: 'Arc Combat Bow', slot: 'Energy', el: 'arc', exotic: true, source: 'Exotic engrams' },
        cruelmercy:     { name: 'Cruel Mercy', type: 'Arc Pulse Rifle', slot: 'Energy', el: 'arc', source: 'Nightfall' },
        loadedquestion: { name: 'Loaded Question', type: 'Arc Fusion Rifle', slot: 'Energy', el: 'arc', source: 'Nightfall' },
        graviton:       { name: 'Graviton Lance', type: 'Void Pulse Rifle', slot: 'Energy', el: 'void', exotic: true, source: 'Exotic engrams' },
        obligation:     { name: 'Collective Obligation', type: 'Void Pulse Rifle', slot: 'Energy', el: 'void', exotic: true, source: 'Vow of the Disciple raid', raid: true, noRaid: 'graviton' },
        lemonarque:     { name: 'Le Monarque', type: 'Void Combat Bow', slot: 'Energy', el: 'void', exotic: true, champ: 'Overload', source: 'Exotic Archive at the Tower' },
        elsies:         { name: "Elsie's Rifle", type: 'Void Pulse Rifle', slot: 'Energy', el: 'void', source: 'Into the Light' },
        wordofcrota:    { name: 'Word of Crota', type: 'Void Hand Cannon', slot: 'Energy', el: 'void', source: "Crota's End raid", raid: true, noRaid: 'ikelos' },
        ikelos:         { name: 'IKELOS_HC_v1.0.2', type: 'Void Hand Cannon', slot: 'Energy', el: 'void', source: 'Prophecy dungeon' },
        tessellation:   { name: 'Tessellation', type: 'Fusion Rifle', slot: 'Energy', el: 'prismatic', exotic: true, note: 'Element matches your equipped grenade', source: 'Pre-order bonus (The Final Shape) · Collections' },
        // Power slot
        cataclysmic:    { name: 'Cataclysmic', type: 'Solar Linear Fusion Rifle', slot: 'Power', el: 'solar', source: 'Vow of the Disciple raid', raid: true, noRaid: 'stormchaser' },
        dragonsbreath:  { name: "Dragon's Breath", type: 'Solar Rocket Launcher', slot: 'Power', el: 'solar', exotic: true, champ: 'Unstoppable', source: 'Season Pass reward · Collections' },
        stormchaser:    { name: 'Stormchaser', type: 'Arc Linear Fusion Rifle', slot: 'Power', el: 'arc', source: 'Duality dungeon' },
        thunderlord:    { name: 'Thunderlord', type: 'Arc Machine Gun', slot: 'Power', el: 'arc', exotic: true, champ: 'Overload', source: 'Exotic engrams' },
        terminus:       { name: 'Terminus Horizon', type: 'Arc Machine Gun', slot: 'Power', el: 'arc', source: 'Spire of the Watcher dungeon · Rite of the Nine' },
        taipan:         { name: 'Taipan-4fr', type: 'Void Linear Fusion Rifle', slot: 'Power', el: 'void', source: 'Legendary engrams · vendor rank-ups' },
        corrective:     { name: 'Corrective Measure', type: 'Void Machine Gun', slot: 'Power', el: 'void', source: 'Vault of Glass raid', raid: true, noRaid: 'hammerhead' },
        hammerhead:     { name: 'Hammerhead', type: 'Void Machine Gun', slot: 'Power', el: 'void', source: 'Into the Light' },
        detchaos:       { name: 'Deterministic Chaos', type: 'Void Machine Gun', slot: 'Power', el: 'void', exotic: true, champ: 'Barrier', source: '"What Remains" exotic quest' },
        qullim:         { name: "Qullim's Terminus", type: 'Stasis Machine Gun', slot: 'Power', el: 'stasis', source: "King's Fall raid", raid: true, noRaid: 'ulterior' },
        ulterior:       { name: 'Ulterior Observation', type: 'Stasis Machine Gun', slot: 'Power', el: 'stasis', source: 'Exploring Kepler' },
        suspectum:      { name: 'Suspectum-4fr', type: 'Stasis Linear Fusion Rifle', slot: 'Power', el: 'stasis', source: 'Legendary engrams · vendor rank-ups' },
        winterbite:     { name: 'Winterbite', type: 'Stasis Glaive', slot: 'Power', el: 'stasis', exotic: true, champ: 'Unstoppable', source: 'Strider exotic quest' },
        promemoria:     { name: 'Pro Memoria', type: 'Strand Machine Gun', slot: 'Power', el: 'strand', source: 'Exploring the Pale Heart' }
    };

    // Champion mods on the current seasonal artifact (Implement of Curiosity, Monument of Triumph).
    // Update this table when the season changes.
    const ARTIFACT_NAME = 'Implement of Curiosity';
    const ARTIFACT = {
        'Hand Cannon': ['Barrier', 'Anti-Barrier Hand Cannon'],
        'Sniper Rifle': ['Barrier', 'Anti-Barrier Sniper Rifle'],
        'Machine Gun': ['Barrier', 'Shield-Shattering Rounds'],
        'Pulse Rifle': ['Overload', 'Overload Pulse Rifle'],
        'Submachine Gun': ['Overload', 'Overload Submachine Gun'],
        'Combat Bow': ['Unstoppable', 'Unstoppable Bow'],
        'Fusion Rifle': ['Unstoppable', 'Stunning Fusion'],
        'Linear Fusion Rifle': ['Unstoppable', 'Stunning Fusion']
    };
    const champOf = w => w.champ ? [w.champ, 'built into its exotic perk']
        : (([c, mod]) => c ? [c, `artifact mod: ${mod}`] : [null, null])(ARTIFACT[Object.keys(ARTIFACT).find(t => w.type.endsWith(t))] || []);

    // Legendary armor sets — 2 pieces give the first bonus, 4 pieces give both
    const S = {
        promised:      { name: 'Promised', source: "Salvation's Edge raid", raid: true,
                         two: ['Stable Resonance', 'Defeating a powerful enemy grants damage resistance and bonus weapon damage.'],
                         four: ['Resonance Redirection', 'During Stable Resonance, weapon damage sometimes fires a burst that exhausts targets.'] },
        greathunt:     { name: 'Great Hunt', source: 'Last Wish raid', raid: true,
                         two: ['Taken Barrier', 'Grenade kills briefly reduce incoming damage.'],
                         four: ['Taken Armaments', 'Grenade kills build Heavy ammo.'] },
        pantheos:      { name: 'Pantheos Resplendent', source: 'Pantheon', raid: true,
                         two: ['Well Prepared', 'Ammo pickups grant Armor Charge, raising Health.'],
                         four: ['Down the Line', 'Sustained damage on bosses and Champions boosts weapon damage.'] },
        atheon:        { name: "Atheon's Memory", source: 'Vault of Glass raid', raid: true,
                         two: ['Radiolaria Breach', 'After grabbing an Orb, your next shield break grants bonus Health.'],
                         four: ['Collective Power', 'While a subclass buff is active, sustained damage creates Orbs of Power.'] },
        crota:         { name: "Crota's Memory", source: "Crota's End raid", raid: true,
                         two: ['Cursed Fist', 'Melee kills trigger a Cursed Thrall explosion.'],
                         four: ['Power of the Son', 'Staying in combat builds flinch and damage resistance.'] },
        apostate:      { name: "Apostate's Blade", source: 'Pit of Heresy dungeon',
                         two: ['Regenerative Threshold', 'Finishers store a heal for your next shield break.'],
                         four: ['Melee Conduction', 'With Radiant, Restoration or Cure, melee hits scorch.'] },
        legacy:        { name: "Legacy's Oath", source: 'Deep Stone Crypt raid', raid: true,
                         two: ['Augmented Servos', 'Powered melee kills release a disorienting pulse.'],
                         four: ['God-Like Judgment', 'Breaking an enemy shield or casting your Super fires homing missiles.'] },
        nezarec:       { name: "Nezarec's Nightmare", source: 'Root of Nightmares raid', raid: true,
                         two: ['Bad Dreams', 'Kills on debuffed enemies (scorched, jolted, frozen, weakened, suspended…) can spawn Orbs.'],
                         four: ['Dream-Devourer', 'Finishers on powerful enemies grant Devour.'] },
        collective:    { name: 'Collective Psyche', source: 'The Desert Perpetual raid', raid: true,
                         two: ['Accretion', 'Ammo pickups stack faster weapon swap speed.'],
                         four: ['Doppler Effect', 'Suspend, unravel and sever last longer, as do Radiant and Restoration on you.'] },
        wayward:       { name: 'Wayward Psyche', source: 'The Desert Perpetual (Epic) raid', raid: true,
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
        oryx:          { name: "Oryx's Memory", source: "King's Fall raid", raid: true,
                         two: ['Iron Sharpens Iron', 'Kills on powerful enemies add ammo progress.'],
                         four: ['Ascendant Escape', 'After a powerful-enemy kill, your next shield break turns you invisible.'] },
        ironbattalion: { name: 'Iron Battalion', source: 'Iron Banner',
                         two: ['Primary Honing', 'Primary weapons gain handling, reload and damage against non-boss enemies.'],
                         four: ['Supercyclical', 'Kills during your Super refund Super energy when it ends.'] },
        seventh:       { name: 'Seventh Seraph', source: 'Vanguard Ops',
                         two: ["Rasputin's Wrath", 'Area or Solar kills grant Warmind Charges (+Weapons and Grenade stats).'],
                         four: ["Rasputin's Reprisal", 'With charges, killing powerful enemies releases a Solar blast that heals allies.'] },
        veritas:       { name: 'Veritas', source: 'Throne World activities',
                         two: ['Lucent Transmutation', 'Finishers or back-to-back powered melee kills create an Elemental pickup for your Light subclass.'],
                         four: ['Lucent Tithes', 'Finishers on powerful enemies heal you and summon Void moths.'] },
        wildwood:      { name: 'Wildwood', source: 'EDZ activities',
                         two: ['Watchtower', 'Precision kills while aiming down sights grant damage resistance until you stop aiming.'],
                         four: ['Field Expertise', 'Precision kills stack reload speed, target acquisition and damage against non-boss enemies.'] },
        ferropotent:   { name: 'Ferropotent', source: 'Vanguard Ops',
                         two: ['Rapid Repair', 'When your shields start regenerating, gain brief flinch and damage resistance.'],
                         four: ['Built from Scratch', 'With low reserves, weapon kills build ammo: Primary feeds Special, Special feeds Heavy.'] },
        reverie:       { name: 'Reverie Dawn', source: 'Dreaming City activities',
                         two: ['A Wish for Protection', 'Dealing heavy damage quickly creates a Protective Wish that reduces hits taken and boosts reload and flinch resistance.'],
                         four: ['A Wish Fulfilled', 'When the Protective Wish expires, it cures you.'] },
        crystocrene:   { name: 'Crystocrene', source: 'Europa activities',
                         two: ['Resupply', 'After being out of combat, your next kill grants ammo progress and an Orb of Power.'],
                         four: ['From the Storm', 'While out of combat, slowly gain Frost Armor until you re-enter combat.'] }
    };

    // Armor sets per build in order of preference — the top two are shown,
    // skipping raid sets when raid gear is turned off
    const SET_PICKS = {
        hunter: {
            'Golden Gun Burst':        [['promised', 'Bonus weapon damage after big kills, plus damage resistance.'], ['ironbattalion', 'Kills during Golden Gun refund Super.'], ['wildwood', 'Precision kills stack damage and reload speed.']],
            'Ignition Knives':         [['seventh', 'Ignitions are area kills — constant Warmind Charges and healing blasts.'], ['apostate', 'Knife and melee hits scorch while Radiant.']],
            'Radiant Hand Cannons':    [['promised', 'Stacks weapon damage on top of Radiant.'], ['collective', 'Keeps Radiant up longer.'], ['wildwood', 'Precision hand cannon kills stack damage and reload speed.'], ['ferropotent', 'Damage resistance when shields regen; kills build ammo.']],
            'Combination Blow Punch':  [['crota', 'Punch kills explode and you get tankier the longer you fight.'], ['darkage', 'Melee hits speed reloads; dodge heals.'], ['veritas', 'Punch kills create Arc pickups; finishers heal.']],
            'Gathering Storm':         [['ironbattalion', 'Gathering Storm kills refund Super energy.'], ['takenking', 'Finishers between supers build Super.']],
            'Blinding Ascension':      [['techeun', 'Overshields and damage resistance for close-range play.'], ['spacewalk', 'Primaries hit harder on disoriented enemies.']],
            'Invisibility & Volatile': [['oryx', 'More invisibility after big kills.'], ['nezarec', 'Volatile and weakened kills spawn Orbs.'], ['techeun', 'Invisible finishers also grant an overshield.'], ['darkage', 'Every dodge drops a healing aura.']],
            'Tether Support':          [['nezarec', 'Weakened kills spawn Orbs, which feed your Super.'], ['takenking', 'Finishers and revives boost Super.'], ['ironbattalion', 'Kills during your Super refund Super energy.']],
            'Team Invisibility':       [['oryx', 'Extra invisibility after big kills.'], ['darkage', 'Every dodge drops a healing aura.'], ['techeun', 'Finishers grant an overshield and damage resistance.']],
            'Duskfield Freeze':        [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['nezarec', 'Slowed and frozen kills spawn Orbs.'], ['crystocrene', 'Stasis-themed set: free Frost Armor and Orbs between fights.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Shatter Damage':          [['nezarec', 'Frozen kills spawn Orbs.'], ['promised', 'Bonus weapon damage after big kills.'], ['crystocrene', 'Stasis-themed set: free Frost Armor and Orbs between fights.'], ['darkage', 'Every dodge drops a healing aura.']],
            'Suspend Control':         [['collective', 'Suspend and unravel last longer.'], ['thunderhead', 'Unraveled kills refund grenade energy.'], ['techeun', 'Finishers grant an overshield and damage resistance.']],
            'Threaded Specter Clones': [['darkage', 'Every decoy also drops a healing aura.'], ['thunderhead', 'Unraveled kills refund grenade energy.']],
            'Exotic Class Item':       [['firstascent', 'Built for Prismatic — faster Transcendence and grenade refunds.'], ['coda', 'Alternating Light and Dark kills refund abilities.']],
            'Combination Blow':        [['coda', 'Dark kills refund melee and alternating gives damage resistance.'], ['crota', 'Punch kills explode.'], ['veritas', 'Punch kills create Elemental pickups; finishers heal.']]
        },
        titan: {
            'Sunspot Restoration':     [['collective', 'Restoration lasts longer.'], ['apostate', 'Melee hits scorch while Restoration is up.'], ['reverie', 'Heavy damage bursts reduce hits taken, then cure you.']],
            'Consecration Melee':      [['crota', 'Melee kills explode; damage resistance in long fights.'], ['apostate', 'Melee hits scorch while Radiant.'], ['veritas', 'Melee kills create Solar pickups; finishers heal.']],
            'Burning Maul DPS':        [['promised', 'Bonus weapon damage between supers.'], ['ironbattalion', 'Maul kills refund Super.'], ['takenking', 'Finishers boost Super energy.']],
            'Thundercrash DPS':        [['promised', 'Bonus weapon damage between supers.'], ['takenking', 'Finishers boost Super energy.'], ['ironbattalion', 'Kills during your Super refund Super energy.']],
            'Knockout Punch':          [['crota', 'Punch kills explode; damage resistance in long fights.'], ['legacy', 'Powered melee kills disorient nearby enemies.'], ['veritas', 'Punch kills create Arc pickups; finishers heal.'], ['darkage', 'Melee hits speed reloads; barricade heals.']],
            'Pulse Grenade Loop':      [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['thunderhead', 'Each grenade grants close-range damage resistance.'], ['spacewalk', 'Grenades release an extra disorienting pulse.']],
            'Overshield Shield Throw': [['crota', 'Melee kills explode; damage resistance in long fights.'], ['nezarec', 'Weakened and volatile kills spawn Orbs.'], ['veritas', 'Melee kills create Void pickups; finishers heal.'], ['darkage', 'Melee hits speed reloads; barricade heals.']],
            'Ward of Dawn Support':    [['takenking', 'Finishers and revives boost Super.'], ['atheon', 'Orbs while your subclass buff is up.'], ['darkage', 'Barricade drops a healing aura for the team.']],
            'Volatile Rockets':        [['promised', 'Bonus weapon damage after big kills.'], ['pantheos', 'Sustained boss damage boosts weapon damage.'], ['wildwood', 'Precision kills stack damage and reload speed.'], ['ferropotent', 'Damage resistance when shields regen; kills build Heavy ammo.']],
            'Crystal Shatter':         [['nezarec', 'Frozen kills spawn Orbs.'], ['techeun', 'Finisher overshields and damage resistance.'], ['crystocrene', 'Stasis-themed set: free Frost Armor and Orbs between fights.']],
            'Overshield Tank':         [['techeun', 'Stacks more damage resistance on top of the overshield.'], ['greathunt', 'Grenade kills give damage resistance.'], ['crystocrene', 'More Frost Armor between fights.']],
            'Suspend Slam':            [['collective', 'Suspend lasts longer.'], ['thunderhead', 'Unraveled kills refund grenade energy.'], ['techeun', 'Finishers grant an overshield and damage resistance.']],
            'Banner of War':           [['crota', 'Melee kills explode; damage resistance in long fights.'], ['darkage', 'Melee hits speed reloads; barricade heals.'], ['techeun', 'Finishers grant an overshield and damage resistance.']],
            'Exotic Class Item':       [['firstascent', 'Built for Prismatic — faster Transcendence and grenade refunds.'], ['coda', 'Alternating Light and Dark kills refund abilities.']],
            'Diamond Lance':           [['coda', 'Stasis (Dark) and Solar (Light) kills alternate for energy and damage resistance.'], ['crota', 'Melee kills explode.'], ['firstascent', 'Faster Transcendence and grenade refunds.']]
        },
        warlock: {
            'Well of Radiance Support':  [['takenking', 'Finishers and revives boost Super.'], ['atheon', 'Orbs while your subclass buff is up.'], ['reverie', 'Heavy damage bursts reduce hits taken, then cure you.']],
            'Grenade Spam':              [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['seventh', 'Solar kills raise Grenade stat.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Starfire Fusion Grenades':  [['seventh', 'Solar area kills raise Weapons and Grenade stats.'], ['promised', 'Bonus weapon damage after big kills.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Arc Soul / Ionic Traces':   [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['spacewalk', 'Grenades release an extra disorienting pulse.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Chaos Reach DPS':           [['ironbattalion', 'Chaos Reach kills refund Super.'], ['wayward', 'Regenerate while moving after Super damage.'], ['takenking', 'Finishers boost Super energy.']],
            'Ionic Sentry':              [['nezarec', 'Jolted kills spawn Orbs.'], ['spacewalk', 'Grenades release an extra disorienting pulse.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            'Chaos Accelerant Grenades': [['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['thunderhead', 'Each grenade grants close-range damage resistance.'], ['spacewalk', 'Grenades release an extra disorienting pulse.']],
            'Nova Bomb / Devour':        [['nezarec', 'Finishers grant Devour; debuffed kills spawn Orbs.'], ['takenking', 'Finishers boost Super.'], ['ironbattalion', 'Nova kills refund Super energy.']],
            'Bleak Watcher Turrets':     [['nezarec', 'Slowed and frozen kills spawn Orbs.'], ['greathunt', 'Grenade kills give damage resistance and Heavy ammo.'], ['crystocrene', 'Stasis-themed set: free Frost Armor and Orbs between fights.'], ['thunderhead', 'Each grenade grants close-range damage resistance.']],
            "Winter's Wrath Freeze":     [['ironbattalion', "Winter's Wrath kills refund Super."], ['nezarec', 'Frozen kills spawn Orbs.'], ['crystocrene', 'Stasis-themed set: free Frost Armor and Orbs between fights.']],
            'Threadling Swarm':          [['flain', 'Even more threadlings, and they heal you.'], ['thunderhead', 'Unraveled kills refund grenade energy.']],
            'Wanderer Suspend':          [['thunderhead', 'Grenade damage resistance; unraveled kills refund grenades.'], ['collective', 'Suspend and unravel last longer.'], ['flain', 'Taking damage spawns threadlings that heal you.']],
            'Exotic Class Item':         [['firstascent', 'Built for Prismatic — faster Transcendence and grenade refunds.'], ['coda', 'Alternating Light and Dark kills refund abilities.']],
            'Bleak Watcher Grenades':    [['coda', 'Stasis (Dark) and Solar (Light) kills alternate for energy and damage resistance.'], ['firstascent', 'Faster Transcendence and grenade refunds.']]
        }
    };

    // build: [name, description, aspects, exotic armor {name, slot, why, source?}, stat priority, weapon keys [kinetic, energy, power], non-raid overrides]
    const B = (name, desc, aspects, armor, stats, weapons, noRaid = {}) => ({ name, desc, aspects, armor, stats, weapons, noRaid });

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
                    ['fatebringer', 'nosurvivors', 'dragonsbreath']),
                B('Ignition Knives', 'Throwing knives that scorch and ignite. Melee regen keeps the knives coming.',
                    ['Knock \'Em Down', 'On Your Mark'],
                    { name: "Caliban's Hand", slot: 'Gauntlets', why: 'Proximity knife ignites on hit — chain explosions through packs.' },
                    ['Melee', 'Grenade'],
                    ['outbreak', 'zaouli', 'cataclysmic']),
                B('Radiant Hand Cannons', 'Weapon-focused: Lucky Pants hand cannon damage with Radiant uptime.',
                    ['On Your Mark', 'Gunpowder Gamble'],
                    { name: 'Lucky Pants', slot: 'Leg Armor', why: 'Hand cannons ready instantly and gain stacking damage on swap.' },
                    ['Weapons', 'Class'],
                    ['blastfurnace', 'sunshot', 'cataclysmic'])
            ],
            arc: [
                B('Combination Blow Punch', 'Melee loop: kills with Combination Blow refund the melee and heal you.',
                    ['Flow State', 'Lethal Current'],
                    { name: "Liar's Handshake", slot: 'Gauntlets', why: 'Big damage and healing on Combination Blow with Cross Counter.' },
                    ['Melee', 'Class'],
                    ['fatebringer', 'riskrunner', 'stormchaser']),
                B('Gathering Storm', 'Call down Gathering Storm often: it jolts everything nearby and amplifies your team, and Arc-debuffed kills feed it back.',
                    ['Flow State', 'Lethal Current'],
                    { name: "Raiju's Harness", slot: 'Chest Armor', why: 'Gathering Storm hits every nearby target and amplifies allies.' },
                    ['Super', 'Class'],
                    ['fatebringer', 'loadedquestion', 'thunderlord']),
                B('Blinding Ascension', 'Defensive Amplified play: blind and jolt enemies with Ascension and dodge.',
                    ['Ascension', 'Flow State'],
                    { name: 'Gifted Conviction', slot: 'Chest Armor', why: 'Dodge jolts nearby enemies and grants damage resistance.' },
                    ['Health', 'Class'],
                    ['blastfurnace', 'trinity', 'terminus'])
            ],
            void: [
                B('Invisibility & Volatile', 'Stay invisible, then make enemies volatile with Void weapons and finishers.',
                    ['Stylish Executioner', 'Vanishing Step'],
                    { name: "Gyrfalcon's Hauberk", slot: 'Chest Armor', why: 'Leaving invisibility gives your Void weapons Volatile Rounds.' },
                    ['Class', 'Weapons'],
                    ['fatebringer', 'graviton', 'taipan']),
                B('Tether Support', 'Weaken bosses with Shadowshot and keep supers coming.',
                    ['Trapper\'s Ambush', 'On the Prowl'],
                    { name: 'Orpheus Rig', slot: 'Leg Armor', why: 'Deadfall tethers refund super energy for each enemy hit.' },
                    ['Super', 'Health'],
                    ['deliverance', 'obligation', 'corrective']),
                B('Team Invisibility', 'Keep the whole fireteam invisible — great for objective-heavy encounters.',
                    ['Vanishing Step', 'Trapper\'s Ambush'],
                    { name: 'Omnioculus', slot: 'Chest Armor', why: 'Smoke Bomb makes allies invisible and gives an extra charge.' },
                    ['Class', 'Health'],
                    ['outbreak', 'wordofcrota', 'taipan'])
            ],
            stasis: [
                B('Duskfield Freeze', 'Defensive control: Duskfield grenades slow, freeze and reduce enemy damage.',
                    ['Grim Harvest', 'Touch of Winter'],
                    { name: 'Renewal Grasps', slot: 'Gauntlets', why: 'Bigger Duskfields that weaken enemies and protect allies.' },
                    ['Grenade', 'Health'],
                    ['rapacious', 'trinity', 'qullim']),
                B('Shatter Damage', 'Freeze and shatter enemies with Shatterdive for heavy damage.',
                    ['Shatterdive', 'Winter\'s Shroud'],
                    { name: 'Mask of Bakris', slot: 'Helmet', why: 'Damage buff against slowed and frozen targets.' },
                    ['Class', 'Weapons'],
                    ['deliverance', 'riskrunner', 'qullim'])
            ],
            strand: [
                B('Suspend Control', 'Lock down rooms by suspending enemies with grapple and Strand weapons.',
                    ['Ensnaring Slam', 'Widow\'s Silk'],
                    { name: "Cyrtarachne's Facade", slot: 'Helmet', why: 'Grappling grants Woven Mail damage resistance.' },
                    ['Class', 'Health'],
                    ['euphony', 'elsies', 'promemoria']),
                B('Threaded Specter Clones', 'Decoys pull aggro and explode into threadlings.',
                    ['Threaded Specter', 'Whirling Maelstrom'],
                    { name: 'The Sixth Coyote', slot: 'Chest Armor', why: 'Two class ability charges means two decoys.' },
                    ['Class', 'Melee'],
                    ['mintretro', 'tessellation', 'promemoria'])
            ],
            prismatic: [
                B('Exotic Class Item', 'Mix two exotic perks on the Relativism cloak. Build into Transcendence for grenade and melee spam.',
                    ['Stylish Executioner', 'Gunpowder Gamble'],
                    { name: 'Relativism', slot: 'Class Item', why: 'Two exotic perks on one cloak — the most flexible Prismatic build.', source: CLASS_ITEM_SOURCE },
                    ['Grenade', 'Class'],
                    ['fatebringer', 'graviton', 'stormchaser']),
                B('Combination Blow', 'Combination Blow punches with Prismatic Light and Dark buffs.',
                    ['Ascension', 'Winter\'s Shroud'],
                    { name: "Liar's Handshake", slot: 'Gauntlets', why: 'Combination Blow healing and damage.' },
                    ['Melee', 'Class'],
                    ['blastfurnace', 'tessellation', 'hammerhead'])
            ]
        }},
        titan: { name: 'Titan', builds: {
            solar: [
                B('Sunspot Restoration', 'Near-permanent Restoration from Sol Invictus sunspots. Very hard to kill.',
                    ['Sol Invictus', 'Roaring Flames'],
                    { name: 'Loreley Splendor Helm', slot: 'Helmet', why: 'Makes a healing sunspot when you\'re low on health.' },
                    ['Health', 'Melee'],
                    ['fatebringer', 'nosurvivors', 'dragonsbreath']),
                B('Consecration Melee', 'Slam and cleave with Consecration, then burn with Roaring Flames.',
                    ['Consecration', 'Roaring Flames'],
                    { name: 'Synthoceps', slot: 'Gauntlets', why: 'Large melee damage buff when surrounded.' },
                    ['Melee', 'Class'],
                    ['outbreak', 'zaouli', 'cataclysmic']),
                B('Burning Maul DPS', 'Super-focused boss damage with Burning Maul.',
                    ['Roaring Flames', 'Sol Invictus'],
                    { name: 'Pyrogale Gauntlets', slot: 'Gauntlets', why: 'Turns the Burning Maul slam into a fire tornado for burst damage.' },
                    ['Super', 'Weapons'],
                    ['fatebringer', 'axiallacuna', 'thunderlord'])
            ],
            arc: [
                B('Thundercrash DPS', 'One huge Thundercrash for boss damage.',
                    ['Knockout', 'Touch of Thunder'],
                    { name: 'Cuirass of the Falling Star', slot: 'Chest Armor', why: 'Big boost to Thundercrash damage.' },
                    ['Super', 'Weapons'],
                    ['fatebringer', 'loadedquestion', 'thunderlord']),
                B('Knockout Punch', 'Thunderclap and Knockout punches that delete enemies and heal you.',
                    ['Knockout', 'Juggernaut'],
                    { name: 'Point-Contact Cannon Brace', slot: 'Gauntlets', why: 'Thunderclap kills fire chain lightning.' },
                    ['Melee', 'Health'],
                    ['fatebringer', 'riskrunner', 'stormchaser']),
                B('Pulse Grenade Loop', 'Abilities refund each other, so Pulse Grenades come back quickly.',
                    ['Touch of Thunder', 'Knockout'],
                    { name: 'Heart of Inmost Light', slot: 'Chest Armor', why: 'Using one ability empowers the other two.' },
                    ['Grenade', 'Melee'],
                    ['blastfurnace', 'trinity', 'terminus'])
            ],
            void: [
                B('Overshield Shield Throw', 'Throw Sentinel Shield nonstop and keep Void overshields up.',
                    ['Controlled Demolition', 'Offensive Bulwark'],
                    { name: 'Doom Fang Pauldron', slot: 'Gauntlets', why: 'Void melee kills grant super energy and shield throws.' },
                    ['Melee', 'Super'],
                    ['fatebringer', 'graviton', 'taipan']),
                B('Ward of Dawn Support', 'Raid support: Ward of Dawn with team damage buffs and blinding.',
                    ['Bastion', 'Offensive Bulwark'],
                    { name: 'Helm of Saint-14', slot: 'Helmet', why: 'Ward of Dawn blinds enemies and gives allies overshields.' },
                    ['Super', 'Health'],
                    ['outbreak', 'wordofcrota', 'taipan']),
                B('Volatile Rockets', 'Rocket-focused weapons build that makes enemies volatile.',
                    ['Controlled Demolition', 'Bastion'],
                    { name: 'Hazardous Propulsion', slot: 'Chest Armor', why: 'Fires bonus rockets when you use your class ability.' },
                    ['Weapons', 'Class'],
                    ['deliverance', 'obligation', 'corrective'])
            ],
            stasis: [
                B('Crystal Shatter', 'Create Stasis crystals with your barricade and shatter them for damage.',
                    ['Tectonic Harvest', 'Howl of the Storm'],
                    { name: 'Hoarfrost-Z', slot: 'Chest Armor', why: 'Barricade becomes a wall of Stasis crystals.' },
                    ['Class', 'Melee'],
                    ['deliverance', 'riskrunner', 'qullim']),
                B('Overshield Tank', 'Stay alive with Stasis crystal overshields.',
                    ['Tectonic Harvest', 'Cryoclasm'],
                    { name: 'Icefall Mantle', slot: 'Gauntlets', why: 'Swaps your barricade for a strong but slow overshield.' },
                    ['Health', 'Grenade'],
                    ['rapacious', 'wordofcrota', 'winterbite'])
            ],
            strand: [
                B('Suspend Slam', 'Drengr\'s Lash and slams suspend whole groups.',
                    ['Drengr\'s Lash', 'Into the Fray'],
                    { name: 'Abeyant Leap', slot: 'Leg Armor', why: 'Drengr\'s Lash suspends instead of tracking and gains energy.' },
                    ['Class', 'Health'],
                    ['euphony', 'cruelmercy', 'promemoria']),
                B('Banner of War', 'Melee kills empower Banner of War and heal your team.',
                    ['Banner of War', 'Flechette Storm'],
                    { name: 'Wishful Ignorance', slot: 'Gauntlets', why: 'Big Frenzied Blade melee damage buff.' },
                    ['Melee', 'Health'],
                    ['mintretro', 'tessellation', 'promemoria'])
            ],
            prismatic: [
                B('Exotic Class Item', 'Two exotic perks on the Stoicism mark. Consecration plus Knockout for melee damage.',
                    ['Consecration', 'Knockout'],
                    { name: 'Stoicism', slot: 'Class Item', why: 'Two exotic perks on one mark — the most flexible Prismatic build.', source: CLASS_ITEM_SOURCE },
                    ['Melee', 'Health'],
                    ['fatebringer', 'graviton', 'stormchaser']),
                B('Diamond Lance', 'Freeze with Diamond Lance, then Consecrate to shatter.',
                    ['Diamond Lance', 'Consecration'],
                    { name: 'Synthoceps', slot: 'Gauntlets', why: 'Melee damage buff when surrounded.' },
                    ['Melee', 'Class'],
                    ['rapacious', 'sunshot', 'suspectum'])
            ]
        }},
        warlock: { name: 'Warlock', builds: {
            solar: [
                B('Well of Radiance Support', 'Raid support: Well of Radiance healing and a team damage buff.',
                    ['Touch of Flame', 'Heat Rises'],
                    { name: 'Phoenix Protocol', slot: 'Chest Armor', why: 'Kills and assists inside Well refund super energy.' },
                    ['Super', 'Health'],
                    ['outbreak', 'zaouli', 'cataclysmic']),
                B('Grenade Spam', 'Sunbracers make your grenades free for a while after a melee kill.',
                    ['Touch of Flame', 'Hellion'],
                    { name: 'Sunbracers', slot: 'Gauntlets', why: 'Unlimited Solar grenades after a Solar melee kill.' },
                    ['Grenade', 'Melee'],
                    ['fatebringer', 'nosurvivors', 'dragonsbreath']),
                B('Starfire Fusion Grenades', 'Two fusion grenade charges with fast regen. Good burst damage on bosses.',
                    ['Touch of Flame', 'Heat Rises'],
                    { name: 'Starfire Protocol', slot: 'Chest Armor', why: 'Extra fusion grenade charge; weapon damage refunds grenade energy.' },
                    ['Grenade', 'Weapons'],
                    ['fatebringer', 'axiallacuna', 'thunderlord'])
            ],
            arc: [
                B('Arc Soul / Ionic Traces', 'Use grenades to get an Arc Soul and stay Amplified.',
                    ['Arc Soul', 'Electrostatic Mind'],
                    { name: 'Getaway Artist', slot: 'Gauntlets', why: 'Use an Arc grenade to create an empowered Arc Soul.' },
                    ['Grenade', 'Class'],
                    ['fatebringer', 'riskrunner', 'stormchaser']),
                B('Chaos Reach DPS', 'Long Chaos Reach beams with fast super regen.',
                    ['Electrostatic Mind', 'Lightning Surge'],
                    { name: 'Geomag Stabilizers', slot: 'Leg Armor', why: 'Extends Chaos Reach and fills the last bit of super energy.' },
                    ['Super', 'Grenade'],
                    ['fatebringer', 'loadedquestion', 'thunderlord']),
                B('Ionic Sentry', 'Ionic Sentry turrets plus Fallen Sunstar Ionic Traces keep your abilities up.',
                    ['Ionic Sentry', 'Electrostatic Mind'],
                    { name: 'Fallen Sunstar', slot: 'Helmet', why: 'Ionic Traces give more energy and make more traces.' },
                    ['Grenade', 'Melee'],
                    ['blastfurnace', 'trinity', 'terminus'])
            ],
            void: [
                B('Chaos Accelerant Grenades', 'Overcharged Void grenades with fast regen.',
                    ['Chaos Accelerant', 'Child of the Old Gods'],
                    { name: 'Contraverse Hold', slot: 'Gauntlets', why: 'Charged grenades give damage resistance and refund energy.' },
                    ['Grenade', 'Health'],
                    ['fatebringer', 'obligation', 'taipan']),
                B('Nova Bomb / Devour', 'Devour sustain and Void kills that speed up your abilities.',
                    ['Feed the Void', 'Child of the Old Gods'],
                    { name: "Nezarec's Sin", slot: 'Helmet', why: 'Void kills speed up all ability regen.' },
                    ['Super', 'Grenade'],
                    ['deliverance', 'elsies', 'detchaos'])
            ],
            stasis: [
                B('Bleak Watcher Turrets', 'Turn Stasis grenades into turrets that freeze everything.',
                    ['Bleak Watcher', 'Iceflare Bolts'],
                    { name: 'Osmiomancy Gloves', slot: 'Gauntlets', why: 'Extra Coldsnap charge and faster Bleak Watcher regen.' },
                    ['Grenade', 'Class'],
                    ['deliverance', 'lemonarque', 'qullim']),
                B("Winter's Wrath Freeze", 'Shatter whole rooms with Winter\'s Wrath and boost Stasis team damage.',
                    ['Glacial Harvest', 'Frostpulse'],
                    { name: 'Ballidorse Wrathweavers', slot: 'Gauntlets', why: 'Winter\'s Wrath grants allies Stasis weapon damage.' },
                    ['Super', 'Grenade'],
                    ['rapacious', 'wordofcrota', 'winterbite'])
            ],
            strand: [
                B('Threadling Swarm', 'Spam threadlings that seek out and kill enemies on their own.',
                    ['Weaver\'s Call', 'Mindspun Invocation'],
                    { name: 'Swarmers', slot: 'Leg Armor', why: 'More threadlings that hit harder.' },
                    ['Grenade', 'Class'],
                    ['euphony', 'elsies', 'promemoria']),
                B('Wanderer Suspend', 'Tangles detonate and suspend enemies. Weapon kills boost your grenades.',
                    ['The Wanderer', 'Weavewalk'],
                    { name: "Verity's Brow", slot: 'Helmet', why: 'Weapon kills that match your subclass increase grenade damage and regen.' },
                    ['Grenade', 'Health'],
                    ['mintretro', 'tessellation', 'promemoria'])
            ],
            prismatic: [
                B('Exotic Class Item', 'Two exotic perks on the Solipsism bond. Feed the Void plus Bleak Watcher.',
                    ['Feed the Void', 'Bleak Watcher'],
                    { name: 'Solipsism', slot: 'Class Item', why: 'Two exotic perks on one bond — the most flexible Prismatic build.', source: CLASS_ITEM_SOURCE },
                    ['Grenade', 'Health'],
                    ['fatebringer', 'graviton', 'stormchaser']),
                B('Bleak Watcher Grenades', 'Prismatic Bleak Watcher turrets alongside Hellion.',
                    ['Bleak Watcher', 'Hellion'],
                    { name: 'Osmiomancy Gloves', slot: 'Gauntlets', why: 'Faster Bleak Watcher turrets.' },
                    ['Grenade', 'Class'],
                    ['rapacious', 'tessellation', 'qullim'])
            ]
        }}
    };

    // Subclass setup per build: [super, class ability, movement, melee, grenade, fragments]
    const LOADOUTS = {
        hunter: {
            "Golden Gun Burst": ["Golden Gun: Marksman", "Marksman's Dodge", "Triple Jump", "Weighted Throwing Knife", "Swarm Grenade", ["Ember of Torches", "Ember of Solace", "Ember of Searing", "Ember of Beams"]],
            "Ignition Knives": ["Blade Barrage", "Gambler's Dodge", "Triple Jump", "Proximity Explosive Knife", "Swarm Grenade", ["Ember of Searing", "Ember of Ashes", "Ember of Char", "Ember of Eruption", "Ember of Torches"]],
            "Radiant Hand Cannons": ["Golden Gun: Marksman", "Marksman's Dodge", "Triple Jump", "Knife Trick", "Swarm Grenade", ["Ember of Torches", "Ember of Solace", "Ember of Empyrean", "Ember of Tempering", "Ember of Searing"]],
            "Combination Blow Punch": ["Storm's Edge", "Gambler's Dodge", "Strafe Jump", "Combination Blow", "Arcbolt Grenade", ["Spark of Resistance", "Spark of Frequency", "Spark of Feedback", "Spark of Amplitude"]],
            "Gathering Storm": ["Gathering Storm", "Gambler's Dodge", "Triple Jump", "Combination Blow", "Arcbolt Grenade", ["Spark of Shock", "Spark of Ions", "Spark of Discharge", "Spark of Amplitude"]],
            "Blinding Ascension": ["Storm's Edge", "Gambler's Dodge", "Blink", "Disorienting Blow", "Flashbang Grenade", ["Spark of Beacons", "Spark of Brilliance", "Spark of Resistance", "Spark of Frequency", "Spark of Shock"]],
            "Invisibility & Volatile": ["Shadowshot: Deadfall", "Gambler's Dodge", "Triple Jump", "Snare Bomb", "Vortex Grenade", ["Echo of Persistence", "Echo of Obscurity", "Echo of Starvation", "Echo of Instability"]],
            "Tether Support": ["Shadowshot: Deadfall", "Gambler's Dodge", "Triple Jump", "Snare Bomb", "Suppressor Grenade", ["Echo of Harvest", "Echo of Persistence", "Echo of Undermining", "Echo of Reprisal", "Echo of Starvation"]],
            "Team Invisibility": ["Shadowshot: Deadfall", "Gambler's Dodge", "Triple Jump", "Snare Bomb", "Vortex Grenade", ["Echo of Persistence", "Echo of Obscurity", "Echo of Reprisal", "Echo of Vigilance"]],
            "Duskfield Freeze": ["Silence and Squall", "Gambler's Dodge", "Triple Jump", "Withering Blade", "Duskfield Grenade", ["Whisper of Durance", "Whisper of Shards", "Whisper of Bonds", "Whisper of Refraction"]],
            "Shatter Damage": ["Silence and Squall", "Gambler's Dodge", "Triple Jump", "Withering Blade", "Coldsnap Grenade", ["Whisper of Fissures", "Whisper of Rending", "Whisper of Shards", "Whisper of Bonds", "Whisper of Refraction", "Whisper of Durance"]],
            "Suspend Control": ["Silkstrike", "Gambler's Dodge", "Triple Jump", "Threaded Spike", "Grapple", ["Thread of Wisdom", "Thread of Mind", "Thread of Continuity", "Thread of Warding", "Thread of Binding"]],
            "Threaded Specter Clones": ["Silkstrike", "Gambler's Dodge", "Triple Jump", "Threaded Spike", "Threadling Grenade", ["Thread of Evolution", "Thread of Mind", "Thread of Rebirth", "Thread of Generation", "Thread of Finality"]],
            "Exotic Class Item": ["Golden Gun: Marksman", "Gambler's Dodge", "Triple Jump", "Threaded Spike", "Magnetic Grenade", ["Facet of Balance", "Facet of Courage", "Facet of Protection", "Facet of Dawn", "Facet of Hope"]],
            "Combination Blow": ["Storm's Edge", "Gambler's Dodge", "Triple Jump", "Combination Blow", "Duskfield Grenade", ["Facet of Dawn", "Facet of Blessing", "Facet of Protection", "Facet of Balance"]]
        },
        titan: {
            "Sunspot Restoration": ["Hammer of Sol", "Rally Barricade", "Catapult Lift", "Throwing Hammer", "Healing Grenade", ["Ember of Solace", "Ember of Empyrean", "Ember of Torches", "Ember of Searing"]],
            "Consecration Melee": ["Hammer of Sol", "Rally Barricade", "Catapult Lift", "Hammer Strike", "Thermite Grenade", ["Ember of Searing", "Ember of Ashes", "Ember of Eruption", "Ember of Char", "Ember of Torches"]],
            "Burning Maul DPS": ["Burning Maul", "Rally Barricade", "Catapult Lift", "Throwing Hammer", "Thermite Grenade", ["Ember of Combustion", "Ember of Searing", "Ember of Solace", "Ember of Torches"]],
            "Thundercrash DPS": ["Thundercrash", "Thruster", "Catapult Lift", "Thunderclap", "Pulse Grenade", ["Spark of Volts", "Spark of Resistance", "Spark of Amplitude", "Spark of Frequency"]],
            "Knockout Punch": ["Thundercrash", "Thruster", "Catapult Lift", "Thunderclap", "Pulse Grenade", ["Spark of Feedback", "Spark of Resistance", "Spark of Frequency", "Spark of Volts"]],
            "Pulse Grenade Loop": ["Thundercrash", "Thruster", "Catapult Lift", "Ballistic Slam", "Pulse Grenade", ["Spark of Magnitude", "Spark of Shock", "Spark of Ions", "Spark of Resistance"]],
            "Overshield Shield Throw": ["Sentinel Shield", "Rally Barricade", "Catapult Lift", "Shield Throw", "Suppressor Grenade", ["Echo of Leeching", "Echo of Exchange", "Echo of Vigilance", "Echo of Persistence"]],
            "Ward of Dawn Support": ["Ward of Dawn", "Towering Barricade", "Catapult Lift", "Shield Throw", "Suppressor Grenade", ["Echo of Persistence", "Echo of Reprisal", "Echo of Undermining", "Echo of Harvest", "Echo of Provision"]],
            "Volatile Rockets": ["Twilight Arsenal", "Rally Barricade", "Catapult Lift", "Shield Throw", "Vortex Grenade", ["Echo of Instability", "Echo of Undermining", "Echo of Harvest", "Echo of Persistence", "Echo of Provision"]],
            "Crystal Shatter": ["Glacial Quake", "Towering Barricade", "Catapult Lift", "Shiver Strike", "Glacier Grenade", ["Whisper of Fissures", "Whisper of Shards", "Whisper of Chains", "Whisper of Rending"]],
            "Overshield Tank": ["Glacial Quake", "Rally Barricade", "Catapult Lift", "Shiver Strike", "Glacier Grenade", ["Whisper of Rime", "Whisper of Chains", "Whisper of Torment", "Whisper of Fractures", "Whisper of Shards"]],
            "Suspend Slam": ["Bladefury", "Rally Barricade", "Catapult Lift", "Frenzied Blade", "Shackle Grenade", ["Thread of Wisdom", "Thread of Mind", "Thread of Continuity", "Thread of Warding", "Thread of Fury"]],
            "Banner of War": ["Bladefury", "Rally Barricade", "Catapult Lift", "Frenzied Blade", "Shackle Grenade", ["Thread of Propagation", "Thread of Warding", "Thread of Transmutation", "Thread of Continuity"]],
            "Exotic Class Item": ["Thundercrash", "Thruster", "Catapult Lift", "Thunderclap", "Pulse Grenade", ["Facet of Protection", "Facet of Dawn", "Facet of Blessing", "Facet of Balance"]],
            "Diamond Lance": ["Glacial Quake", "Thruster", "Catapult Lift", "Shiver Strike", "Glacier Grenade", ["Facet of Ruin", "Facet of Command", "Facet of Protection", "Facet of Devotion", "Facet of Courage"]]
        },
        warlock: {
            "Well of Radiance Support": ["Well of Radiance", "Healing Rift", "Burst Glide", "Incinerator Snap", "Healing Grenade", ["Ember of Benevolence", "Ember of Mercy", "Ember of Solace", "Ember of Torches"]],
            "Grenade Spam": ["Song of Flame", "Phoenix Dive", "Burst Glide", "Incinerator Snap", "Solar Grenade", ["Ember of Ashes", "Ember of Char", "Ember of Searing", "Ember of Resolve"]],
            "Starfire Fusion Grenades": ["Song of Flame", "Empowering Rift", "Burst Glide", "Incinerator Snap", "Fusion Grenade", ["Ember of Ashes", "Ember of Char", "Ember of Blistering", "Ember of Resolve"]],
            "Arc Soul / Ionic Traces": ["Stormtrance", "Healing Rift", "Burst Glide", "Chain Lightning", "Storm Grenade", ["Spark of Ions", "Spark of Discharge", "Spark of Shock", "Spark of Magnitude"]],
            "Chaos Reach DPS": ["Chaos Reach", "Healing Rift", "Burst Glide", "Ball Lightning", "Storm Grenade", ["Spark of Ions", "Spark of Discharge", "Spark of Shock", "Spark of Amplitude", "Spark of Magnitude"]],
            "Ionic Sentry": ["Stormtrance", "Healing Rift", "Burst Glide", "Chain Lightning", "Pulse Grenade", ["Spark of Ions", "Spark of Discharge", "Spark of Shock", "Spark of Amplitude"]],
            "Chaos Accelerant Grenades": ["Nova Bomb: Vortex", "Healing Rift", "Burst Glide", "Pocket Singularity", "Vortex Grenade", ["Echo of Undermining", "Echo of Remnants", "Echo of Provision", "Echo of Harvest", "Echo of Instability"]],
            "Nova Bomb / Devour": ["Nova Bomb: Cataclysm", "Healing Rift", "Burst Glide", "Pocket Singularity", "Vortex Grenade", ["Echo of Starvation", "Echo of Persistence", "Echo of Harvest", "Echo of Undermining", "Echo of Expulsion"]],
            "Bleak Watcher Turrets": ["Winter's Wrath", "Healing Rift", "Burst Glide", "Penumbral Blast", "Coldsnap Grenade", ["Whisper of Shards", "Whisper of Refraction", "Whisper of Bonds", "Whisper of Durance"]],
            "Winter's Wrath Freeze": ["Winter's Wrath", "Healing Rift", "Burst Glide", "Penumbral Blast", "Coldsnap Grenade", ["Whisper of Shards", "Whisper of Bonds", "Whisper of Conduction", "Whisper of Chains", "Whisper of Rime"]],
            "Threadling Swarm": ["Needlestorm", "Healing Rift", "Burst Glide", "Arcane Needle", "Threadling Grenade", ["Thread of Evolution", "Thread of Rebirth", "Thread of Generation", "Thread of Finality"]],
            "Wanderer Suspend": ["Needlestorm", "Healing Rift", "Burst Glide", "Arcane Needle", "Shackle Grenade", ["Thread of Continuity", "Thread of Wisdom", "Thread of Mind", "Thread of Generation", "Thread of Warding"]],
            "Exotic Class Item": ["Song of Flame", "Healing Rift", "Burst Glide", "Arcane Needle", "Coldsnap Grenade", ["Facet of Balance", "Facet of Courage", "Facet of Command", "Facet of Purpose"]],
            "Bleak Watcher Grenades": ["Winter's Wrath", "Healing Rift", "Burst Glide", "Penumbral Blast", "Coldsnap Grenade", ["Facet of Command", "Facet of Courage", "Facet of Balance", "Facet of Ruin"]]
        }
    };

    // Aspect and fragment text, verbatim from the Bungie API manifest
    const SUBCLASS_TEXT = {
        "Arc Soul": "Cast your Rift to create an Arc Soul that fires at targets in front of you. Allies can pass through your Rift to get an Arc Soul. Your Rift charges faster when allies are near.\nWhile amplified, your Arc Souls are supercharged and gain increased fire rate.\nArc Soul damage is scaled by the enhanced benefit of the Grenade stat.",
        "Ascension": "Air Move While airborne, consume your class ability energy to summon your Arc Staff, propelling yourself upward and creating a burst of energy around you that amplifies allies and jolts targets.\nThis ability's damage increases with your Class stat when your Class stat is 100 or higher.",
        "Banner of War": "Defeat a target with a melee attack, finisher, or Sword to raise a Banner of War that pulses with energy, periodically healing nearby allies and increasing melee and Sword damage.\nTargets defeated by you and nearby allies charge the banner, increasing the speed of its pulses.",
        "Bastion": "Cast your Super to grant Overshield to nearby allies.\nCasting your Barricade grants Overshield to yourself and nearby allies and empowers it, enabling it to slowly regenerate the Overshield of allies bunkering behind it and extend their Overshield duration.",
        "Bleak Watcher": "Grenade: Hold to convert your grenade into a Stasis turret that fires slowing projectiles at nearby targets.",
        "Chaos Accelerant": "Grenade: Overcharge your grenade, making it deadlier and more effective.\nVortex Grenade: Increases the size, linger duration, and pull of the vortex.\nAxion Bolt: Detonates twice and has enhanced seekers.\nScatter Grenade: Submunitions track to nearby targets.\nMagnetic Grenade, Spike Grenade, Voidwall Grenade, and Suppressor Grenade: Releases a short-range Void blast. Cooldown is reduced.\nGrants an additional grenade charge.",
        "Child of the Old Gods": "Cast your rift to create a Void Soul. When you damage a target with a weapon, your Void Soul flies to them and drains them, doing damage and weakening them. Combatants affected by the Soul are also briefly suppressed.\nWhen a target is being drained, you are granted grenade and melee energy (if running Healing Rift) or health (if running Empowering Rift).\nDefeating a target who is being drained by your Void Soul grants class ability energy.\nThe Void Soul's damage is scaled by the enhanced benefit of the Grenade stat.",
        "Consecration": "While sliding, activate your charged melee ability to launch a wave of Solar energy forward, damaging and scorching targets in front of you as you leap into the air.\nWhile airborne, activate your charged melee again to slam to the ground and create a second larger wave of damaging Solar energy. If the wave hits a scorched target, they ignite.",
        "Controlled Demolition": "Hitting a target with a Void ability or Volatile explosion makes them volatile. Further damage to a volatile target causes them to explode. Grants you and nearby allies health when volatile targets explode near you.",
        "Cryoclasm": "Your slide distance is greatly increased. Sliding releases a wave that shatters Stasis crystals or frozen targets on contact, along with any other frozen targets nearby.",
        "Diamond Lance": "Shatter or defeat targets with Stasis abilities or weapons to create a Stasis lance.\nShoot: Throw the lance to freeze targets on impact.\nMelee: Slam the lance to the ground to freeze targets in a small area.",
        "Drengr's Lash": "Activate your Barricade ability to create a ripple in reality that travels forward along the ground, suspending and damaging the targets it hits.\nFinal blows on targets affected by Suspend, Unravel, or Sever grant class ability energy.\nThis ability's damage increases with your Class stat when your Class stat is 100 or higher.\nActivate Thruster to create an unstable knot of Strand matter that detonates after a short delay, suspending and damaging targets.\nFinal blows on targets affected by elemental debuffs grant Thruster energy.",
        "Echo of Exchange": "Melee final blows grant grenade energy.\n+10 Melee ▲",
        "Echo of Expulsion": "Void ability final blows cause targets to explode.\n+10 Super ▲",
        "Echo of Harvest": "Defeating weakened targets creates an Orb of Power and a Void Breach.",
        "Echo of Instability": "Defeating targets with grenades grants Volatile Rounds to your Void weapons.\n+10 Melee ▲",
        "Echo of Leeching": "Melee final blows start health regeneration for you and nearby allies.\n+10 Health ▲",
        "Echo of Obscurity": "Finisher final blows grant Invisibility.\n+10 Class ▲",
        "Echo of Persistence": "Void buffs applied to you (Invisibility, Overshield, and Devour) have increased duration.\n-10 Class ▼\n-10 Weapon ▼\n-10 Health ▼",
        "Echo of Provision": "Damaging targets with grenades grants melee energy.\n+10 Grenade ▲",
        "Echo of Remnants": "Your lingering grenade effects (Vortex Grenade, Void Wall, Void Spike, and Axion Bolt) have increased duration.",
        "Echo of Reprisal": "Final blows when surrounded by combatants grant Super energy.",
        "Echo of Starvation": "Picking up a Void Breach or an Orb of Power grants Devour.\n-10 Class ▼",
        "Echo of Undermining": "Your Void grenades weaken targets.\n-10 Grenade ▼",
        "Echo of Vigilance": "Defeating a target while your shields are depleted grants you a temporary Void overshield.",
        "Electrostatic Mind": "Defeating targets with Arc abilities or defeating jolted or blinded targets creates an Ionic Trace.\nCollecting an Ionic Trace makes you amplified.",
        "Ember of Ashes": "You apply more scorch stacks to targets.",
        "Ember of Beams": "Your Solar Super projectiles have stronger target acquisition.\n+10 Super ▲",
        "Ember of Benevolence": "Applying restoration, cure, or radiant to allies grants increased grenade, melee, and class ability regeneration for a short duration.\n-10 Grenade ▼",
        "Ember of Blistering": "Defeating targets with Solar ignitions grants grenade energy.",
        "Ember of Char": "Your Solar ignitions spread scorch to affected targets.\n+10 Grenade ▲",
        "Ember of Combustion": "Final blows with a Solar Super causes targets to ignite and creates a Firesprite.\n+10 Melee ▲",
        "Ember of Empyrean": "Solar weapon or ability final blows extend the duration of restoration and radiant effects applied to you.\n-10 Health ▼",
        "Ember of Eruption": "Your Solar ignitions have increased area of effect.\n+10 Melee ▲",
        "Ember of Mercy": "When you revive an ally, you and other nearby allies gain restoration.\nPicking up a Firesprite grants restoration.\n+10 Health ▲",
        "Ember of Resolve": "Solar grenade final blows cure you.",
        "Ember of Searing": "Defeating scorched targets grants melee energy and creates a Firesprite.\n+10 Class ▲",
        "Ember of Solace": "Radiant and restoration effects applied to you have increased duration.",
        "Ember of Tempering": "Solar weapon final blows grant you and your allies increased health for a short duration. Stacks 3 times.\nWhile Ember of Tempering is active, your weapons have increased airborne effectiveness, and your Solar weapon final blows create a Firesprite.\n-10 Class ▼",
        "Ember of Torches": "Powered melee attacks against combatants make you and nearby allies radiant.\n-10 Grenade ▼",
        "Ensnaring Slam": "Activate your air move to consume your class ability energy and dive to the ground, suspending all nearby targets on impact.\nSuspending combatants with this ability grants you Woven Mail.\nThis ability's damage increases with your Class stat when your Class stat is 100 or higher.",
        "Facet of Balance": "Rapidly defeating targets with Light damage grants melee energy. Rapidly defeating targets with Darkness damage grants grenade energy.",
        "Facet of Blessing": "Melee final blows start health regeneration. While transcendent, melee final blows start health regeneration for you and nearby allies.",
        "Facet of Command": "Freezing or suppressing a target reloads your equipped weapons and increases weapon stability, aim assist, and airborne effectiveness.\nDefeating frozen or suppressed targets creates a Stasis Shard or Void Breach.",
        "Facet of Courage": "Your Arc, Solar, and Void abilities deal increased damage to targets afflicted with Darkness debuffs.\n+10 Grenade ▲",
        "Facet of Dawn": "Powered melee hits against targets makes you radiant. Powered melee final blows make you and nearby allies radiant.\n-10 Melee ▼",
        "Facet of Devotion": "Defeating targets afflicted with Stasis or Strand debuffs grants bonus Light Transcendence energy.\n+10 Melee ▲",
        "Facet of Hope": "While you have an elemental buff, your class ability regenerates more quickly.",
        "Facet of Protection": "While surrounded by combatants, you are more resistant to incoming damage. While transcendent, the effect is increased.\n+10 Melee ▲",
        "Facet of Purpose": "Picking up an Orb of Power grants either Bolt Charge, Restoration, Frost Armor, Woven Mail, or Overshield based on the damage type of your equipped Super.\n-10 Class ▼",
        "Facet of Ruin": "Increases the size and damage of the burst when you shatter a Stasis crystal or frozen target, and increases the area of effect of Solar ignitions.\n+10 Weapon ▲",
        "Feed the Void": "Defeat a target with a Void ability to activate Devour.\nYour Devour effects are improved, restoring additional health and grenade energy.",
        "Flechette Storm": "While sliding, activate your charged melee ability to leap into the air, knocking nearby targets away and dealing damage.\nWhile airborne, activate your charged melee again to launch a cluster of damaging, unraveling projectiles. Repeatedly activating melee will chain additional throws.",
        "Flow State": "Defeating a jolted target makes you amplified.\nWhile you are amplified, your dodge recharges more quickly, you are more resilient while dodging, and your reload speed is greatly increased.",
        "Frostpulse": "Casting your Rift generates a shockwave that freezes nearby targets, granting you Frost Armor when it does so.\nFreezing combatants generates class ability energy.",
        "Glacial Harvest": "Picking up Stasis shards grants stacks of Frost Armor.\nWhile you have Frost Armor, defeating combatants with Stasis or Kinetic weapons may cause them to shatter, damaging other nearby foes. The shatter chance increases with your Frost Armor stacks.\nTaking damage while you have Frost Armor generates grenade energy.",
        "Grim Harvest": "Picking up Stasis shards grants stacks of Frost Armor.\nWhile you have Frost Armor, defeating combatants with Stasis or Kinetic weapons may cause them to shatter, damaging nearby foes. The shatter chance increases with your Frost Armor stacks.\nTaking damage while you have Frost Armor generates class ability energy.",
        "Gunpowder Gamble": "Defeat targets to charge up an improvised Solar explosive.\nGrenade: Throw a Solar explosive that can be shot in mid-air to cause an ignition.",
        "Heat Rises": "You can fire weapons, melee, and throw grenades while gliding.\nGrenade: Hold to consume your grenade, gaining Heat Rises and releasing a burst of healing energy that cures nearby allies. The strength of the burst is increased when a Healing Grenade is consumed.\nFinal blows while airborne increase the duration of Heat Rises and grant melee energy.",
        "Hellion": "Activate your class ability to summon a Solar mortar that lobs flaming projectiles at distant targets. Targets damaged by the mortar are scorched.\nHellion damage is scaled by the enhanced benefit of the Grenade stat.",
        "Howl of the Storm": "While sliding, activate your charged melee ability to launch a wave of Stasis energy forward that freezes enemy combatants, slows enemy players, and creates Stasis crystals.\nGrants an additional melee charge.",
        "Iceflare Bolts": "Shattering a frozen target spawns seekers that track and freeze other nearby targets.",
        "Into the Fray": "Destroying a Tangle or casting your Super grants Woven Mail for nearby allies.\nWhile you have Woven Mail, your melee regeneration rate is increased.",
        "Ionic Sentry": "Defeat targets with Kinetic or Arc weapons or Arc abilities to charge up an Arc turret that periodically chains lightning between nearby targets, granting a stack of Bolt Charge with each hit.\nGrenade: Deploy the Ionic Sentry, blinding nearby targets on initial impact.\nIonic Sentry damage is scaled by the enhanced benefit of the Grenade stat.",
        "Juggernaut": "With full class ability energy and after sprinting for a short time, you gain a frontal shield that blocks incoming damage. When the frontal shield breaks, your class ability energy is depleted. When the frontal shield takes damage, you gain a stack of Bolt Charge.\nWhile amplified, the shield blocks significantly more damage before breaking.",
        "Knock 'Em Down": "Your Solar Supers are enhanced. Deadshot Golden Gun has damage resistance, Marksman Golden Gun has increased duration, and Blade Barrage launches more projectiles.\nWhile radiant, final blows with your equipped Throwing Knife fully refund your melee energy.",
        "Knockout": "Critically wounding a target or breaking their shield infuses your melee attacks with Arc energy and increases your melee range against combatants and melee damage against combatants and Guardians for a short time.\nDefeating targets with melee attacks makes you amplified and restores a portion of your health. Defeating more powerful combatants increases the amount of health restored.",
        "Lethal Current": "After dodging, your next melee attack has increased lunge range, jolts the target, and creates a damaging aftershock.\nDamaging any jolted target with melee attacks also blinds them.",
        "Lightning Surge": "While sliding, activate your charged melee ability to blink forward, calling down lightning strikes that jolt targets as you rematerialize. This ability also makes you amplified and grants Bolt Charge.",
        "Mindspun Invocation": "Your grapple, Shackle Grenade, Threadling Grenade, and Slicewire Grenade have enhanced functionality.\nYour grapple melee spawns three Threadlings.\nGrenade: Hold to consume your Shackle Grenade and activate Weaver's Trance. Final blows while Weaver's Trance is active create a suspending detonation.\nGrenade: Hold to charge your Threadling Grenade, causing it to weave a Threadling Nest at the impact location that repeatedly spawns Threadlings.\nGrenade: Hold to charge your Slicewire Grenade. The grenade's final detonation will launch submunitions and leave a Tangle in its wake.",
        "Offensive Bulwark": "While you have an Overshield or are inside Ward of Dawn, final blows grant grenade and melee energy, you have increased melee range and damage, and melee final blows restore a small portion of your Overshield and extend its duration.\nYou gain an additional Shield Throw while in Sentinel Shield.",
        "On Your Mark": "Activating your class ability or landing precision hits grants you and nearby allies increased reload speed and Weapons stat for a short duration. Stacks ten times.\nFinal blows while at ten stacks cure you.",
        "On the Prowl": "Periodically marks a nearby combatant as a priority target for you and your team. Entering invisibility immediately marks a target.\nDefeating priority targets creates a weakening cloud of smoke that makes you and allies invisible when passing through it.\nWhen priority targets are defeated, you and nearby allies gain increased weapon reload speed and stability for a short duration and are granted grenade, melee, and class ability energy.",
        "Roaring Flames": "Final blows with Solar abilities or ignitions increase the damage of your Solar abilities. Stacks 3 times.",
        "Shatterdive": "Activate while midair to quickly descend and shatter nearby targets on impact. Shattering targets grants you Frost Armor.",
        "Sol Invictus": "Solar ability final blows, Hammer of Sol impacts, and defeating scorched targets creates Sunspots. Your abilities regenerate faster, and your Super drains more slowly while standing in a Sunspot.\nSunspots apply scorch and deal damage to targets inside. Entering a Sunspot applies restoration.",
        "Spark of Amplitude": "Rapidly defeating targets while you are amplified creates an Orb of Power.",
        "Spark of Beacons": "While you are amplified, your Arc Special or Heavy ammo weapon final blows create a blinding explosion.",
        "Spark of Brilliance": "Defeating a blinded target with precision damage creates a blinding explosion.\n+10 Super ▲",
        "Spark of Discharge": "Arc weapon final blows have a chance to create an Ionic Trace.\nCollecting an Ionic Trace grants you a stack of Bolt Charge.\n-10 Melee ▼",
        "Spark of Feedback": "Taking melee damage briefly increases your outgoing melee damage.\n+10 Health ▲",
        "Spark of Frequency": "Melee hits increase your equipped weapon's reload speed and stability for a short duration.\nWhile amplified, the effects are increased and you gain increased stacks of Bolt Charge from all sources.",
        "Spark of Ions": "Defeating a jolted target or defeating a target with Bolt Charge creates an Ionic Trace.",
        "Spark of Magnitude": "Your lingering Arc grenades (Lightning Grenade, Pulse Grenade, and Storm Grenade) have extended duration.",
        "Spark of Resistance": "While surrounded by combatants, you are more resistant to incoming damage.\n+10 Melee ▲",
        "Spark of Shock": "Your Arc grenades jolt targets.\n-10 Grenade ▼",
        "Spark of Volts": "Finishers make you amplified and grant you a stack of Bolt Charge.\n+10 Class ▲",
        "Stylish Executioner": "Defeating a weakened, suppressed, or volatile target grants Invisibility and Truesight.\nAfter performing a Stylish Execution, your next melee attack while invisible weakens targets.",
        "Tectonic Harvest": "Picking up Stasis shards grants stacks of Frost Armor.\nWhile you have Frost Armor, defeating combatants with Stasis or Kinetic weapons may cause them to shatter, damaging other nearby combatants. The shatter chance increases with your Frost Armor stacks.\nTaking damage while you have Frost Armor generates melee energy.",
        "The Wanderer": "Tangles you throw attach to targets and detonate into a suspending burst. Destroying a Tangle creates a suspending burst after a short delay.\nThreadling final blows create Tangles or reduce your current Tangle cooldown.",
        "Thread of Binding": "Super final blows emit a suspending burst from the target.\n+10 Health ▲",
        "Thread of Continuity": "Suspend, unravel, and sever effects applied to targets have increased duration.",
        "Thread of Evolution": "Threadlings travel farther and deal additional damage.\n+10 Super ▲",
        "Thread of Finality": "Finisher final blows create Threadlings.\n+10 Class ▲",
        "Thread of Fury": "Damaging targets with a Tangle grants melee energy.\n-10 Melee ▼",
        "Thread of Generation": "Dealing damage generates grenade energy.\n-10 Grenade ▼",
        "Thread of Mind": "Defeating suspended targets grants class ability energy.",
        "Thread of Propagation": "Powered melee final blows grant your Strand weapons Unraveling Rounds.\n+10 Melee ▲",
        "Thread of Rebirth": "Strand weapon final blows have a chance to create a Threadling.",
        "Thread of Transmutation": "While you have Woven Mail, weapon final blows create a Tangle.\n+10 Melee ▲",
        "Thread of Warding": "Picking up an Orb of Power grants Woven Mail.\n-10 Health ▼",
        "Thread of Wisdom": "Defeating suspended targets creates an Orb of Power.",
        "Threaded Specter": "Activating your class ability leaves behind a decoy woven from Strand matter that draws the attention of nearby combatants.\nAfter taking significant damage or when combatants approach, the decoy detonates, dealing damage and releasing Threadlings that seek out and attack nearby foes.\nThis ability's damage increases with your Class stat when your Class stat is 100 or higher.",
        "Touch of Flame": "Your Healing, Solar, Firebolt, and Fusion Grenades have enhanced functionality.\nHealing Grenade: Improves the strength of cure and restoration effects applied. Consuming a Healing Grenade with Heat Rises also applies restoration to nearby allies.\nSolar Grenade: Increases linger duration. Periodically emits blobs of lava around its perimeter.\nFirebolt Grenade: Increases target search radius and maximum target count.\nFusion Grenade: Explodes twice.",
        "Touch of Thunder": "Your Flashbang, Pulse, Lightning, and Storm Grenades have enhanced functionality.\nFlashbang Grenade: Emits an additional blinding detonation on bounce.\nPulse Grenade: Creates Ionic Traces periodically as it damages targets and increases in damage over time.\nLightning Grenade: Grants an additional grenade charge, jolts targets hit by the initial blast, and grants Bolt Charge when it causes damage.\nStorm Grenade: After detonating, creates a roaming thundercloud that tracks nearby targets and fires bolts of lightning at foes beneath it.",
        "Touch of Winter": "Your Glacier, Duskfield, Coldsnap, and Shatter grenades have enhanced functionality.\nGlacier Grenade: Adds a Stasis crystal and changes the formation.\nDuskfield Grenade: Increases slow-field size and creates a small Stasis crystal on impact.\nColdsnap Grenade: Seekers duplicate after freezing a target and create a Stasis crystal on detonation.\nShatter Grenade: Creates additional shrapnel projectiles on detonation. Hitting frozen targets with this grenade refunds some grenade energy.",
        "Trapper's Ambush": "Activate your air move to consume your class ability energy and dive to the ground, damaging targets on impact. Damage is greatly increased if striking while you have any Void status effect.\nDamaging opponents with this ability heals you. Defeating combatants with this ability grants Devour.\nThis ability's damage increases with your Class stat when your Class stat is 100 or higher.",
        "Vanishing Step": "Dodging makes you invisible.",
        "Weaver's Call": "Activate your class ability to weave three Threadlings and deploy any Threadlings you have perched.\nDealing damage and defeating targets generates perched Threadlings.",
        "Weavewalk": "Air Dodge: Dodge while airborne to consume your melee energy and enter the weave, gaining damage resistance from combatants and players. Reactivate your air dodge or cast your Rift to exit the weave, generating Woven Mail for you and nearby allies.\nWhile in the weave, your melee energy is drained and you generate perched Threadlings over time. Threadling hits generate ability energy.",
        "Whirling Maelstrom": "Destroying a Tangle will weave a violent, writhing mass of Strand fibers. The Strand mass seeks out and damages targets, emitting Unraveling projectiles when it defeats them.",
        "Whisper of Bonds": "Defeating frozen targets generates an Orb of Power.\n-10 Super ▼",
        "Whisper of Chains": "Defeating targets while you have Frost Armor has a chance to create a Stasis shard.\n+10 Class ▲",
        "Whisper of Conduction": "Nearby Stasis shards track to your position.\n+10 Super ▲\n+10 Health ▲",
        "Whisper of Durance": "Slow that you apply to targets lasts longer. For those abilities that linger, their duration will also increase.\n+10 Melee ▲",
        "Whisper of Fissures": "Increases the damage and size of the burst of Stasis when you destroy a Stasis crystal or defeat a frozen target.",
        "Whisper of Fractures": "Shattering a frozen target with a melee attack grants a stack of Frost Armor.",
        "Whisper of Refraction": "Defeating slowed or frozen targets grants you class ability energy.",
        "Whisper of Rending": "Primary ammo weapons do increased damage to Stasis crystals and frozen targets.",
        "Whisper of Rime": "Your Frost Armor has increased duration and maximum stack count.",
        "Whisper of Shards": "Shattering a Stasis crystal temporarily boosts your grenade recharge rate. Shattering additional Stasis crystals increases the duration of this benefit.",
        "Whisper of Torment": "You gain grenade energy each time you take damage from targets. Having Frost Armor increases the amount of energy gained.\n-10 Grenade ▼",
        "Widow's Silk": "You have an additional grenade charge.\nYour Grappling Hook creates a Grapple Tangle at the grapple point.",
        "Winter's Shroud": "Dodging slows nearby targets.\nSlowing targets briefly increases your class ability regeneration."
    };

    // Icons and subclass art from the Bungie API manifest (paths under bungie.net/common/destiny2_content/)
    const BNET = 'https://www.bungie.net/common/destiny2_content/';
    const SUBCLASS_ART = {"hunter": {"stasis": {"name": "Revenant", "icon": "icons/6e441ffa8c8171ce9caf71e51b72fc19.png", "art": "screenshots/873720784.jpg"}, "void": {"name": "Nightstalker", "icon": "icons/32b112a9460e6f0e2b9ee15dc53fe1c1.png", "art": "screenshots/2453351420.jpg"}, "solar": {"name": "Gunslinger", "icon": "icons/fedcb91b7ab0584c12f0e9fec730702b.png", "art": "screenshots/2240888816.jpg"}, "arc": {"name": "Arcstrider", "icon": "icons/949af7a61d60a8e6071282daafa9e6e9.png", "art": "screenshots/2328211300.jpg"}, "strand": {"name": "Threadrunner", "icon": "icons/41c0024ce809085ac16f4e0777ea0ac4.png", "art": "screenshots/3785442599.jpg"}, "prismatic": {"name": "Prismatic Hunter", "icon": "icons/fab506e62fa4f188bfe2fb6d56b39614.png", "art": "screenshots/4282591831.jpg"}}, "titan": {"stasis": {"name": "Behemoth", "icon": "icons/6e441ffa8c8171ce9caf71e51b72fc19.png", "art": "screenshots/613647804.jpg"}, "void": {"name": "Sentinel", "icon": "icons/32b112a9460e6f0e2b9ee15dc53fe1c1.png", "art": "screenshots/2842471112.jpg"}, "solar": {"name": "Sunbreaker", "icon": "icons/fedcb91b7ab0584c12f0e9fec730702b.png", "art": "screenshots/2550323932.jpg"}, "arc": {"name": "Striker", "icon": "icons/949af7a61d60a8e6071282daafa9e6e9.png", "art": "screenshots/2932390016.jpg"}, "strand": {"name": "Berserker", "icon": "icons/41c0024ce809085ac16f4e0777ea0ac4.png", "art": "screenshots/242419885.jpg"}, "prismatic": {"name": "Prismatic Titan", "icon": "icons/c1740d829e62afc40a9e57af4e3cad4c.png", "art": "screenshots/1616346845.jpg"}}, "warlock": {"stasis": {"name": "Shadebinder", "icon": "icons/6e441ffa8c8171ce9caf71e51b72fc19.png", "art": "screenshots/3291545503.jpg"}, "void": {"name": "Voidwalker", "icon": "icons/32b112a9460e6f0e2b9ee15dc53fe1c1.png", "art": "screenshots/2849050827.jpg"}, "solar": {"name": "Dawnblade", "icon": "icons/fedcb91b7ab0584c12f0e9fec730702b.png", "art": "screenshots/3941205951.jpg"}, "arc": {"name": "Stormcaller", "icon": "icons/949af7a61d60a8e6071282daafa9e6e9.png", "art": "screenshots/3168997075.jpg"}, "strand": {"name": "Broodweaver", "icon": "icons/41c0024ce809085ac16f4e0777ea0ac4.png", "art": "screenshots/4204413574.jpg"}, "prismatic": {"name": "Prismatic Warlock", "icon": "icons/652406349e99e3db0c3198f78af4eeae.png", "art": "screenshots/3893112950.jpg"}}};
    const ABILITY_ICONS = {
        "hunter/stasis": {"Marksman's Dodge": "icons/6148e0135ab295e24888a4b083e4e480.png", "Gambler's Dodge": "icons/5bb832a0d1719210c76442528d9ca1ac.png", "Strafe Jump": "icons/1eeb42a2f303c00ded47299ca91aa72f.png", "Triple Jump": "icons/7d5eb73f61509271037f810480a2e804.png", "Silence and Squall": "icons/a8bbee32ce8f259e7b9e112c0c8a401a.png", "Withering Blade": "icons/d4dbdba1bbc4f102f865b14dc2ec186f.png", "Glacier Grenade": "icons/08b4d8632636f78c57425b844d7b42e4.png", "Duskfield Grenade": "icons/5ed90305d6131582eb76abd99c487826.png", "Coldsnap Grenade": "icons/ff53139f18628530891598936e7a8c13.png", "Shatter Grenade": "icons/4017951cb20f7e81158b062f74af1cd2.png", "Winter's Shroud": "icons/edf787affb7089495610e8f8c770d323.png", "Shatterdive": "icons/a177413a2eea2ddbefde9c9111ecd04a.png", "Grim Harvest": "icons/aedf0a4a86c5dc63ab810879662b417a.png", "Touch of Winter": "icons/b8e7bcaa96ec08540ff225a6d113a0d8.png", "Whisper of Fissures": "icons/9eaa93107ad40372c335ce495273c318.png", "Whisper of Refraction": "icons/5c9285f7b0320f56a560ce9c0aa65043.png", "Whisper of Durance": "icons/263713a8639fb73350c13b5b520fefa2.png", "Whisper of Bonds": "icons/12b591b2720cc265d800e870484f6d5b.png", "Whisper of Shards": "icons/5fa98c6e62d008621119d1b394e9cae9.png", "Whisper of Chains": "icons/d764e09a79be71fb5d37e612e610cf18.png", "Whisper of Torment": "icons/0f69591331f4def8ab2a4bb27c55b2aa.png", "Whisper of Fractures": "icons/a28274406a8a0e7ec916a33ec830ba6f.png", "Whisper of Conduction": "icons/2d84a595d269762c434718e34d2e7d78.png", "Whisper of Rending": "icons/a315a6aaba35eba7f021fbea22e5e0ba.png", "Whisper of Rime": "icons/0ec49820a6de05851c099cf7fb5d7554.png", "Glacial Quake": "icons/3c522f849a7d4d86d5224d7d5d5671a4.png", "Winter's Wrath": "icons/c9f25c8f6d5e647366ffc4f71a825961.png"},
        "titan/stasis": {"Towering Barricade": "icons/04e9c35e9f14147ce3898cea505dc7cf.png", "Rally Barricade": "icons/d29754d40cae05f736b8318b1654dc9a.png", "Catapult Lift": "icons/22167767b81dea77781871eeb1e7d3de.png", "Glacial Quake": "icons/3c522f849a7d4d86d5224d7d5d5671a4.png", "Shiver Strike": "icons/1f34b1d2eb5377ac68346cb42db6f008.png", "Glacier Grenade": "icons/08b4d8632636f78c57425b844d7b42e4.png", "Duskfield Grenade": "icons/5ed90305d6131582eb76abd99c487826.png", "Coldsnap Grenade": "icons/ff53139f18628530891598936e7a8c13.png", "Shatter Grenade": "icons/4017951cb20f7e81158b062f74af1cd2.png", "Cryoclasm": "icons/784d860ee0cf74b4afff93f2ffbd4d83.png", "Tectonic Harvest": "icons/590dc7e1ceaf43b5ca55bd6d3aaa2739.png", "Howl of the Storm": "icons/cc2ac1ffdba3d5dc32afdaef4b002505.png", "Diamond Lance": "icons/663ed4baf3983fa13d5daf766ae60bd4.png", "Whisper of Fissures": "icons/9eaa93107ad40372c335ce495273c318.png", "Whisper of Refraction": "icons/5c9285f7b0320f56a560ce9c0aa65043.png", "Whisper of Durance": "icons/263713a8639fb73350c13b5b520fefa2.png", "Whisper of Bonds": "icons/12b591b2720cc265d800e870484f6d5b.png", "Whisper of Shards": "icons/5fa98c6e62d008621119d1b394e9cae9.png", "Whisper of Chains": "icons/d764e09a79be71fb5d37e612e610cf18.png", "Whisper of Torment": "icons/0f69591331f4def8ab2a4bb27c55b2aa.png", "Whisper of Fractures": "icons/a28274406a8a0e7ec916a33ec830ba6f.png", "Whisper of Conduction": "icons/2d84a595d269762c434718e34d2e7d78.png", "Whisper of Rending": "icons/a315a6aaba35eba7f021fbea22e5e0ba.png", "Whisper of Rime": "icons/0ec49820a6de05851c099cf7fb5d7554.png", "Silence and Squall": "icons/a8bbee32ce8f259e7b9e112c0c8a401a.png", "Winter's Wrath": "icons/c9f25c8f6d5e647366ffc4f71a825961.png"},
        "warlock/stasis": {"Healing Rift": "icons/5af22b96589e8e20148a711d46b90ff3.png", "Empowering Rift": "icons/3208b3698319d9ef6c771c583ed0e36a.png", "Burst Glide": "icons/63af5e661089e6a1abbbe70186573a50.png", "Winter's Wrath": "icons/c9f25c8f6d5e647366ffc4f71a825961.png", "Penumbral Blast": "icons/f77faacb093918106f28b2b49e168264.png", "Glacier Grenade": "icons/08b4d8632636f78c57425b844d7b42e4.png", "Duskfield Grenade": "icons/5ed90305d6131582eb76abd99c487826.png", "Coldsnap Grenade": "icons/ff53139f18628530891598936e7a8c13.png", "Shatter Grenade": "icons/4017951cb20f7e81158b062f74af1cd2.png", "Iceflare Bolts": "icons/ab67bdd1cdbc7d0f925707c6343d4d54.png", "Frostpulse": "icons/3a8e991dae47b351c45b9c182e9050e4.png", "Bleak Watcher": "icons/51d335e369d83d303203448c75fce439.png", "Glacial Harvest": "icons/5fc9529c49b1d81ebeb7ed67779e6170.png", "Whisper of Fissures": "icons/9eaa93107ad40372c335ce495273c318.png", "Whisper of Refraction": "icons/5c9285f7b0320f56a560ce9c0aa65043.png", "Whisper of Durance": "icons/263713a8639fb73350c13b5b520fefa2.png", "Whisper of Bonds": "icons/12b591b2720cc265d800e870484f6d5b.png", "Whisper of Shards": "icons/5fa98c6e62d008621119d1b394e9cae9.png", "Whisper of Chains": "icons/d764e09a79be71fb5d37e612e610cf18.png", "Whisper of Torment": "icons/0f69591331f4def8ab2a4bb27c55b2aa.png", "Whisper of Fractures": "icons/a28274406a8a0e7ec916a33ec830ba6f.png", "Whisper of Conduction": "icons/2d84a595d269762c434718e34d2e7d78.png", "Whisper of Rending": "icons/a315a6aaba35eba7f021fbea22e5e0ba.png", "Whisper of Rime": "icons/0ec49820a6de05851c099cf7fb5d7554.png", "Silence and Squall": "icons/a8bbee32ce8f259e7b9e112c0c8a401a.png", "Glacial Quake": "icons/3c522f849a7d4d86d5224d7d5d5671a4.png"},
        "hunter/void": {"Marksman's Dodge": "icons/17c8532ba08411f2cad7fe8a443a63d0.jpg", "Gambler's Dodge": "icons/06f00a7fbe80686a21c95d53e1506ed1.jpg", "Triple Jump": "icons/733d623b28e7c56d2e1aa4f5d9aae685.jpg", "Strafe Jump": "icons/1e236c74f7d5193df3472765245ca55c.jpg", "Shadowshot: Deadfall": "icons/61feac4f1271ba6cecc29cc50e20ab5a.png", "Snare Bomb": "icons/df5d0a9f49f37de0cb781b8d2fd70516.jpg", "Void Spike": "icons/7dabddafe91884860ed108c440cc9591.jpg", "Void Wall": "icons/a905c46ea9edc45f2773b30b719bd6dc.jpg", "Suppressor Grenade": "icons/17372092d1add4cf52bb4862037b418c.jpg", "Vortex Grenade": "icons/12997544665705bbbd94742268ce7091.jpg", "Scatter Grenade": "icons/562f1b6ca7ecda82248f4b02e833d211.jpg", "Magnetic Grenade": "icons/72966b5c97e45d8668483f2263138613.jpg", "Axion Bolt": "icons/3ecbc1ab120d80d0aa322c0a18fa22a1.jpg", "Trapper's Ambush": "icons/e91760df2b81d191da9e2c62cb3fcda7.jpg", "Vanishing Step": "icons/f23323d11f0ad79781f91c70f4c644ac.jpg", "Stylish Executioner": "icons/ed7f8c49b77fa46f4eec87a3c167c4b1.jpg", "On the Prowl": "icons/9afb3b5fb819f4427122736712c5dab6.jpg", "Echo of Vigilance": "icons/91e0f86be9e41faf06994faf41d818af.jpg", "Echo of Expulsion": "icons/d6500235bb175f0fc3752cab0a170fd2.jpg", "Echo of Provision": "icons/1c16b5205d6a648b9898cce6ac3a01b3.jpg", "Echo of Exchange": "icons/e5a6ac0f38df212a40dc541bb46f354f.jpg", "Echo of Remnants": "icons/ce12bd0f246e834c8f7e102079814bf9.jpg", "Echo of Reprisal": "icons/6a0118280ba432e796048648993d7765.jpg", "Echo of Undermining": "icons/b114e9d97c42a68b19ab7876a221b354.jpg", "Echo of Persistence": "icons/914309029085289921f77d8207765150.jpg", "Echo of Leeching": "icons/6aa22ca5ba309f264af5231969ec840a.jpg", "Echo of Instability": "icons/0ad46f9c0c14535c4d5776daf48e871e.jpg", "Echo of Harvest": "icons/6bd23524f7129761043724acbe90c7b5.jpg", "Echo of Obscurity": "icons/7d711ce4bcfb264da29c289ff70b9876.jpg", "Echo of Starvation": "icons/19219ecd56fef82e9ead65aed8fea63a.jpg"},
        "titan/void": {"Towering Barricade": "icons/8042b480c9dea2fc3301e15e7695feaf.jpg", "Rally Barricade": "icons/dbf616cee47329f90049fa84655790b8.jpg", "Catapult Lift": "icons/b00e7edf76ae296eee2cca55c3a57fa6.jpg", "Sentinel Shield": "icons/a929ea604d638e5e99125e48f76989e2.png", "Ward of Dawn": "icons/1caf1eccf1072969ab93bd35fde62599.png", "Twilight Arsenal": "icons/ad8fd9cd668f4d980b29e26ade9e4369.png", "Shield Throw": "icons/18ba97e43f603ca3cbc1507255992d39.jpg", "Void Spike": "icons/7dabddafe91884860ed108c440cc9591.jpg", "Void Wall": "icons/a905c46ea9edc45f2773b30b719bd6dc.jpg", "Suppressor Grenade": "icons/17372092d1add4cf52bb4862037b418c.jpg", "Vortex Grenade": "icons/12997544665705bbbd94742268ce7091.jpg", "Scatter Grenade": "icons/562f1b6ca7ecda82248f4b02e833d211.jpg", "Magnetic Grenade": "icons/72966b5c97e45d8668483f2263138613.jpg", "Axion Bolt": "icons/3ecbc1ab120d80d0aa322c0a18fa22a1.jpg", "Controlled Demolition": "icons/ab2545998f350de7b29549d2b19996e2.jpg", "Bastion": "icons/5428b311ff07d2bacb073e551ed2bea1.jpg", "Offensive Bulwark": "icons/68683d4544848844a1fe0acdf7417019.jpg", "Echo of Vigilance": "icons/91e0f86be9e41faf06994faf41d818af.jpg", "Echo of Expulsion": "icons/d6500235bb175f0fc3752cab0a170fd2.jpg", "Echo of Provision": "icons/1c16b5205d6a648b9898cce6ac3a01b3.jpg", "Echo of Exchange": "icons/e5a6ac0f38df212a40dc541bb46f354f.jpg", "Echo of Remnants": "icons/ce12bd0f246e834c8f7e102079814bf9.jpg", "Echo of Reprisal": "icons/6a0118280ba432e796048648993d7765.jpg", "Echo of Undermining": "icons/b114e9d97c42a68b19ab7876a221b354.jpg", "Echo of Persistence": "icons/914309029085289921f77d8207765150.jpg", "Echo of Leeching": "icons/6aa22ca5ba309f264af5231969ec840a.jpg", "Echo of Instability": "icons/0ad46f9c0c14535c4d5776daf48e871e.jpg", "Echo of Harvest": "icons/6bd23524f7129761043724acbe90c7b5.jpg", "Echo of Obscurity": "icons/7d711ce4bcfb264da29c289ff70b9876.jpg", "Echo of Starvation": "icons/19219ecd56fef82e9ead65aed8fea63a.jpg"},
        "warlock/void": {"Healing Rift": "icons/12e2bcbfb817e4f67ec6eeda111c0790.jpg", "Empowering Rift": "icons/7ed7831666e47cd300a5b1529584c18c.jpg", "Burst Glide": "icons/88d1827b19c92ccc9c6aea0e62369f24.jpg", "Blink": "icons/6930fabff4175da3425bfe9e1c4b2c54.jpg", "Nova Bomb: Vortex": "icons/e9dc1cc0179cda4d2445845cf8992a7e.png", "Nova Bomb: Cataclysm": "icons/b1efa0eaa710653d85e2fcf5321047fb.png", "Pocket Singularity": "icons/afd8d014a0cf2e76a73172beae7ef0ee.jpg", "Void Spike": "icons/7dabddafe91884860ed108c440cc9591.jpg", "Void Wall": "icons/a905c46ea9edc45f2773b30b719bd6dc.jpg", "Suppressor Grenade": "icons/17372092d1add4cf52bb4862037b418c.jpg", "Vortex Grenade": "icons/12997544665705bbbd94742268ce7091.jpg", "Scatter Grenade": "icons/562f1b6ca7ecda82248f4b02e833d211.jpg", "Magnetic Grenade": "icons/72966b5c97e45d8668483f2263138613.jpg", "Axion Bolt": "icons/3ecbc1ab120d80d0aa322c0a18fa22a1.jpg", "Chaos Accelerant": "icons/5a8a03d4876d34a89db6aedf6189ab86.jpg", "Feed the Void": "icons/178bb0e78e55c5b960aa6f42660b9b66.jpg", "Child of the Old Gods": "icons/ced6965ddcda23fdc728639aaf0ebd4d.jpg", "Soul Siphon": "icons/36932a691aaeab872af392d4a1d8eba8.jpg", "Echo of Vigilance": "icons/91e0f86be9e41faf06994faf41d818af.jpg", "Echo of Expulsion": "icons/d6500235bb175f0fc3752cab0a170fd2.jpg", "Echo of Provision": "icons/1c16b5205d6a648b9898cce6ac3a01b3.jpg", "Echo of Exchange": "icons/e5a6ac0f38df212a40dc541bb46f354f.jpg", "Echo of Remnants": "icons/ce12bd0f246e834c8f7e102079814bf9.jpg", "Echo of Reprisal": "icons/6a0118280ba432e796048648993d7765.jpg", "Echo of Undermining": "icons/b114e9d97c42a68b19ab7876a221b354.jpg", "Echo of Persistence": "icons/914309029085289921f77d8207765150.jpg", "Echo of Leeching": "icons/6aa22ca5ba309f264af5231969ec840a.jpg", "Echo of Instability": "icons/0ad46f9c0c14535c4d5776daf48e871e.jpg", "Echo of Harvest": "icons/6bd23524f7129761043724acbe90c7b5.jpg", "Echo of Obscurity": "icons/7d711ce4bcfb264da29c289ff70b9876.jpg", "Echo of Starvation": "icons/19219ecd56fef82e9ead65aed8fea63a.jpg"},
        "hunter/solar": {"Marksman's Dodge": "icons/a87b7b80d34f93fecf446486e9e683e7.jpg", "Gambler's Dodge": "icons/a701bc92b729da5331aee944106912cf.jpg", "Triple Jump": "icons/e919562f619672aae70ede8fc29e9bad.jpg", "Strafe Jump": "icons/66fcf6f378ae895674ea601637166d28.jpg", "Golden Gun: Marksman": "icons/52f2eb1fefa20e9c7b064c190855d588.png", "Blade Barrage": "icons/0b01a6ddceb7b0e2e86ebcb7a6a83eaa.png", "Knife Trick": "icons/d9607f7db9d1f53b16af6ee6f6bcb428.jpg", "Weighted Throwing Knife": "icons/5875031ec666d94d7358a0c7d3a1191f.jpg", "Proximity Explosive Knife": "icons/3616d8241a759780586c0869fa1b3d1e.jpg", "Swarm Grenade": "icons/0c322768dd41ac416e04dac131cf5fb5.jpg", "Thermite Grenade": "icons/e4aa73bf21f3da3e22f9e07475e2e614.jpg", "Solar Grenade": "icons/720bf9cc73dce537c5ee5577e0edcf9b.jpg", "Fusion Grenade": "icons/37a4f29aa2ef6ffcdee1a8eb6b5bfade.jpg", "Firebolt Grenade": "icons/bb77ba17b16192e7f383bc10a71bf014.jpg", "Healing Grenade": "icons/d7fa54aea967c101aeafcbc1163508d6.jpg", "Knock 'Em Down": "icons/01a74478066a61232e0eb0d71d56d89c.jpg", "On Your Mark": "icons/6b1ce964c0d1dc6beba3083353efc3f6.jpg", "Gunpowder Gamble": "icons/765402ea0cdaa799f62fe46b57ad8437.jpg", "Ember of Mercy": "icons/5ca8c8de03f981b9c984a1f2bdea0f61.jpg", "Ember of Resolve": "icons/24b60501785856e2898417115e3b2afd.jpg", "Ember of Benevolence": "icons/0b5cf537c6ad5d80cbdd3675d0e7134d.jpg", "Ember of Beams": "icons/2f12ba3df56de7c0e2790f481cb29a52.jpg", "Ember of Empyrean": "icons/be99d52c12f9359fc948b4563f74e712.jpg", "Ember of Combustion": "icons/45476d85d0e6aeded810f217a0627afb.jpg", "Ember of Torches": "icons/1ef2e34dad0d52c762ed96e8c932dc38.jpg", "Ember of Char": "icons/a299dde35bfcd830923458846d7a64f3.jpg", "Ember of Tempering": "icons/cddc93648f0917dc8bd6663d38d7c379.jpg", "Ember of Blistering": "icons/52dc6ef9a4b0642e36551542b3a2936e.jpg", "Ember of Solace": "icons/fb46711e0dff2bc2f55c21271e838fe2.jpg", "Ember of Eruption": "icons/8734774377b5e73a84ed045a78ce232c.jpg", "Ember of Ashes": "icons/82203cd4545f6dccc3b231d138664ecd.jpg", "Ember of Searing": "icons/7312346d93dc0e84d46e539a10aebb52.jpg"},
        "titan/solar": {"Towering Barricade": "icons/b727baee6fe4228fbe35743a3bb199a9.jpg", "Rally Barricade": "icons/278392023803641890167602fef8bb4f.jpg", "Catapult Lift": "icons/837b14251d5b776849065059c6594a75.jpg", "Hammer of Sol": "icons/9d1fd669f61cce4abd35dbefd22ba90c.png", "Burning Maul": "icons/a0391bd2a8cf73c58cec261961db0136.png", "Throwing Hammer": "icons/2db60293ac428ae066a5bb2fed04f6e7.jpg", "Hammer Strike": "icons/c05584046992239cbbd0d319228058b8.jpg", "Thermite Grenade": "icons/e4aa73bf21f3da3e22f9e07475e2e614.jpg", "Solar Grenade": "icons/720bf9cc73dce537c5ee5577e0edcf9b.jpg", "Swarm Grenade": "icons/0c322768dd41ac416e04dac131cf5fb5.jpg", "Fusion Grenade": "icons/37a4f29aa2ef6ffcdee1a8eb6b5bfade.jpg", "Firebolt Grenade": "icons/bb77ba17b16192e7f383bc10a71bf014.jpg", "Healing Grenade": "icons/d7fa54aea967c101aeafcbc1163508d6.jpg", "Roaring Flames": "icons/208e4d0d635832dd78288de5532fe062.jpg", "Sol Invictus": "icons/1552df4d776b01d9f8c00d6c910aec97.jpg", "Consecration": "icons/5c71b63e8b653cd63a2ae0d8a8c64979.jpg", "Ember of Mercy": "icons/5ca8c8de03f981b9c984a1f2bdea0f61.jpg", "Ember of Resolve": "icons/24b60501785856e2898417115e3b2afd.jpg", "Ember of Benevolence": "icons/0b5cf537c6ad5d80cbdd3675d0e7134d.jpg", "Ember of Beams": "icons/2f12ba3df56de7c0e2790f481cb29a52.jpg", "Ember of Empyrean": "icons/be99d52c12f9359fc948b4563f74e712.jpg", "Ember of Combustion": "icons/45476d85d0e6aeded810f217a0627afb.jpg", "Ember of Torches": "icons/1ef2e34dad0d52c762ed96e8c932dc38.jpg", "Ember of Char": "icons/a299dde35bfcd830923458846d7a64f3.jpg", "Ember of Tempering": "icons/cddc93648f0917dc8bd6663d38d7c379.jpg", "Ember of Blistering": "icons/52dc6ef9a4b0642e36551542b3a2936e.jpg", "Ember of Solace": "icons/fb46711e0dff2bc2f55c21271e838fe2.jpg", "Ember of Eruption": "icons/8734774377b5e73a84ed045a78ce232c.jpg", "Ember of Ashes": "icons/82203cd4545f6dccc3b231d138664ecd.jpg", "Ember of Searing": "icons/7312346d93dc0e84d46e539a10aebb52.jpg"},
        "warlock/solar": {"Healing Rift": "icons/1cf5b4574886d65d39e4016d798c96a6.jpg", "Empowering Rift": "icons/88925f27c4a89905a3bde07f9602763c.jpg", "Phoenix Dive": "icons/344563b4a5bee94734c4499ef83a6ac2.jpg", "Burst Glide": "icons/f7b19afecf6554f32225e80cc57d4fac.jpg", "Well of Radiance": "icons/2f3615ddcd86ab7c50653d2d1847c3bf.png", "Song of Flame": "icons/ed2e5deb9b67c0120468ee136f98f2b2.png", "Incinerator Snap": "icons/e9dee44a01ea409afe80a939b6341843.jpg", "Solar Grenade": "icons/720bf9cc73dce537c5ee5577e0edcf9b.jpg", "Thermite Grenade": "icons/e4aa73bf21f3da3e22f9e07475e2e614.jpg", "Swarm Grenade": "icons/0c322768dd41ac416e04dac131cf5fb5.jpg", "Fusion Grenade": "icons/37a4f29aa2ef6ffcdee1a8eb6b5bfade.jpg", "Firebolt Grenade": "icons/bb77ba17b16192e7f383bc10a71bf014.jpg", "Healing Grenade": "icons/d7fa54aea967c101aeafcbc1163508d6.jpg", "Heat Rises": "icons/d647fd2019707f044ce97b52f802e465.jpg", "Touch of Flame": "icons/d6b44fe69ff876449e732b52b7d9d334.jpg", "Hellion": "icons/3514bec04e2464b2f48e1bd025afc668.jpg", "Ember of Mercy": "icons/5ca8c8de03f981b9c984a1f2bdea0f61.jpg", "Ember of Resolve": "icons/24b60501785856e2898417115e3b2afd.jpg", "Ember of Benevolence": "icons/0b5cf537c6ad5d80cbdd3675d0e7134d.jpg", "Ember of Beams": "icons/2f12ba3df56de7c0e2790f481cb29a52.jpg", "Ember of Empyrean": "icons/be99d52c12f9359fc948b4563f74e712.jpg", "Ember of Combustion": "icons/45476d85d0e6aeded810f217a0627afb.jpg", "Ember of Torches": "icons/1ef2e34dad0d52c762ed96e8c932dc38.jpg", "Ember of Char": "icons/a299dde35bfcd830923458846d7a64f3.jpg", "Ember of Tempering": "icons/cddc93648f0917dc8bd6663d38d7c379.jpg", "Ember of Blistering": "icons/52dc6ef9a4b0642e36551542b3a2936e.jpg", "Ember of Solace": "icons/fb46711e0dff2bc2f55c21271e838fe2.jpg", "Ember of Eruption": "icons/8734774377b5e73a84ed045a78ce232c.jpg", "Ember of Ashes": "icons/82203cd4545f6dccc3b231d138664ecd.jpg", "Ember of Searing": "icons/7312346d93dc0e84d46e539a10aebb52.jpg"},
        "hunter/arc": {"Gambler's Dodge": "icons/7ad146429d1375f825841d33641650ac.jpg", "Marksman's Dodge": "icons/a0c91a37b3f1ad57da0e4e64ded13569.jpg", "Triple Jump": "icons/fb5c90f3df4b9e1d4dede6d807f34ed6.jpg", "Strafe Jump": "icons/43b8b5a84ec3bbdc78fb83427f743962.jpg", "Blink": "icons/df3f7482cf7667181369db14b7115f38.jpg", "Arc Staff": "icons/435489f514e2bf88d25c452a96f2dff9.png", "Gathering Storm": "icons/edf23f2e6951efcab4c4b10630b6f7c4.png", "Storm's Edge": "icons/515dafc7f95e310e26bf3189f640231c.png", "Combination Blow": "icons/a7ff3045c06a03649199c6b8e185d7a3.jpg", "Disorienting Blow": "icons/0ac85c928868a34d47dba95dcff2da2a.jpg", "Arcbolt Grenade": "icons/04c36b4cfebda156a8eca2b257e3ce4f.jpg", "Lightning Grenade": "icons/fd8f038f2d0a62c6a43024767998f383.jpg", "Storm Grenade": "icons/9f4ace2bd6ab050148f54ff6f4ce9a0f.jpg", "Flashbang Grenade": "icons/937015647a56bc422dd87fe784465548.jpg", "Pulse Grenade": "icons/11837de6306d28df467178af097d748b.jpg", "Flow State": "icons/83c6b789cfbe88a92f1d247ebf4ff62f.jpg", "Tempest Strike": "icons/e216e32eaf026208ef4638f2f274e2dc.jpg", "Lethal Current": "icons/aec5d87a0d36729045b0ab0baffb8620.jpg", "Ascension": "icons/3bfe666002e12ec6ea3d0c3661f81f31.jpg", "Spark of Beacons": "icons/8924af183dc3e6200536171a72c9fd77.jpg", "Spark of Resistance": "icons/d92e1a6770ebbb509ceda1c6ab545e43.jpg", "Spark of Shock": "icons/2f49889b1fe7bcf01ef12b2cdc0fb511.jpg", "Spark of Ions": "icons/2a7f5d325fc745877be70c443427d15b.jpg", "Spark of Discharge": "icons/c883bf91f42e9c4b9c9ddce1ba2d2de5.jpg", "Spark of Frequency": "icons/4979f2f84c3da353c19815106267beb9.jpg", "Spark of Magnitude": "icons/0b39167c8fc628482dea26cf43d78ec9.jpg", "Spark of Amplitude": "icons/4138dfce109db20c49877c08852f13a8.jpg", "Spark of Feedback": "icons/58a935c2948d5f20d060bc87a0ad25d2.jpg", "Spark of Volts": "icons/bb6175746eecf3160a591efe343a3fdf.jpg", "Spark of Brilliance": "icons/d38a4297cfe3ec89427f68ef92b076e5.jpg"},
        "titan/arc": {"Towering Barricade": "icons/44389de78b61efe84346a87ed55a5f80.jpg", "Rally Barricade": "icons/095be27fd5f742a241fe77176e80cfdf.jpg", "Thruster": "icons/24fec20486dcadb8be276226b56c5500.jpg", "Catapult Lift": "icons/32bfe820d982e00fac25c9aab277ebc3.jpg", "Thundercrash": "icons/adb140aba83a6c14345852531d4ee2e0.png", "Thunderclap": "icons/45e77f67fbb1e12c36972cd923f7b9e0.jpg", "Ballistic Slam": "icons/c9e36caa03cdb0d8dfcacc57f0e01938.jpg", "Pulse Grenade": "icons/11837de6306d28df467178af097d748b.jpg", "Lightning Grenade": "icons/fd8f038f2d0a62c6a43024767998f383.jpg", "Storm Grenade": "icons/9f4ace2bd6ab050148f54ff6f4ce9a0f.jpg", "Flashbang Grenade": "icons/937015647a56bc422dd87fe784465548.jpg", "Arcbolt Grenade": "icons/04c36b4cfebda156a8eca2b257e3ce4f.jpg", "Touch of Thunder": "icons/2e639c65526c331f1d97623d51ca3a09.jpg", "Juggernaut": "icons/046dc9f5d7a897b38d12a05ab837f5c7.jpg", "Knockout": "icons/e0fdf5c4c4dc10d6ee63365bf7d70821.jpg", "Spark of Beacons": "icons/8924af183dc3e6200536171a72c9fd77.jpg", "Spark of Resistance": "icons/d92e1a6770ebbb509ceda1c6ab545e43.jpg", "Spark of Shock": "icons/2f49889b1fe7bcf01ef12b2cdc0fb511.jpg", "Spark of Ions": "icons/2a7f5d325fc745877be70c443427d15b.jpg", "Spark of Discharge": "icons/c883bf91f42e9c4b9c9ddce1ba2d2de5.jpg", "Spark of Frequency": "icons/4979f2f84c3da353c19815106267beb9.jpg", "Spark of Magnitude": "icons/0b39167c8fc628482dea26cf43d78ec9.jpg", "Spark of Amplitude": "icons/4138dfce109db20c49877c08852f13a8.jpg", "Spark of Feedback": "icons/58a935c2948d5f20d060bc87a0ad25d2.jpg", "Spark of Volts": "icons/bb6175746eecf3160a591efe343a3fdf.jpg", "Spark of Brilliance": "icons/d38a4297cfe3ec89427f68ef92b076e5.jpg"},
        "warlock/arc": {"Healing Rift": "icons/21c913ded4a635f654ee47bed3d780be.jpg", "Empowering Rift": "icons/9b08ff451b1b63c88096bc32698c62a0.jpg", "Burst Glide": "icons/83a6090aa638a9d756d5ef03e48b7843.jpg", "Stormtrance": "icons/31a0445d352fd44b62c9a8dd2752ccdf.png", "Chaos Reach": "icons/b54195b2d82a31ae970ca85fb7fb0be7.png", "Chain Lightning": "icons/f07bbec19064eec2de3d02e3b700cfc2.jpg", "Ball Lightning": "icons/5539f0c752919a84714366dcb3fe6893.jpg", "Storm Grenade": "icons/9f4ace2bd6ab050148f54ff6f4ce9a0f.jpg", "Lightning Grenade": "icons/fd8f038f2d0a62c6a43024767998f383.jpg", "Flashbang Grenade": "icons/937015647a56bc422dd87fe784465548.jpg", "Pulse Grenade": "icons/11837de6306d28df467178af097d748b.jpg", "Arcbolt Grenade": "icons/04c36b4cfebda156a8eca2b257e3ce4f.jpg", "Arc Soul": "icons/767a0f26b7b3a790a82bb243eb6707b4.jpg", "Lightning Surge": "icons/5730fd352ae02a03290387ea81d39468.jpg", "Electrostatic Mind": "icons/724434eedd3aeb7cc2799090cd9c3b08.jpg", "Ionic Sentry": "icons/fbf0964f25f9f126e6a47bd6ee53a550.jpg", "Spark of Beacons": "icons/8924af183dc3e6200536171a72c9fd77.jpg", "Spark of Resistance": "icons/d92e1a6770ebbb509ceda1c6ab545e43.jpg", "Spark of Shock": "icons/2f49889b1fe7bcf01ef12b2cdc0fb511.jpg", "Spark of Ions": "icons/2a7f5d325fc745877be70c443427d15b.jpg", "Spark of Discharge": "icons/c883bf91f42e9c4b9c9ddce1ba2d2de5.jpg", "Spark of Frequency": "icons/4979f2f84c3da353c19815106267beb9.jpg", "Spark of Magnitude": "icons/0b39167c8fc628482dea26cf43d78ec9.jpg", "Spark of Amplitude": "icons/4138dfce109db20c49877c08852f13a8.jpg", "Spark of Feedback": "icons/58a935c2948d5f20d060bc87a0ad25d2.jpg", "Spark of Volts": "icons/bb6175746eecf3160a591efe343a3fdf.jpg", "Spark of Brilliance": "icons/d38a4297cfe3ec89427f68ef92b076e5.jpg"},
        "hunter/strand": {"Marksman's Dodge": "icons/6148e0135ab295e24888a4b083e4e480.png", "Gambler's Dodge": "icons/5bb832a0d1719210c76442528d9ca1ac.png", "Triple Jump": "icons/7d5eb73f61509271037f810480a2e804.png", "Strafe Jump": "icons/1eeb42a2f303c00ded47299ca91aa72f.png", "Silkstrike": "icons/3da7e8684b09600e90ea5c16f1edebe0.png", "Threaded Spike": "icons/46620e1f142778a0d429be7a12c39f21.png", "Grapple": "icons/5d65ba9eb04c2f3760eba0b5eec9be8a.jpg", "Slicewire Grenade": "icons/f4e6254963db69408d94ae00f579a82e.jpg", "Shackle Grenade": "icons/a2c73298753fdd565a22d3d6712820ab.jpg", "Threadling Grenade": "icons/18a14aeac121b2a5c8699556b63e38fd.jpg", "Widow's Silk": "icons/87de51bca878ac633a107e805426e95c.jpg", "Ensnaring Slam": "icons/5e777fa7e6fe7c1ae0574c91639bee10.jpg", "Threaded Specter": "icons/f0311771bc0f771779301102d62c0ae0.jpg", "Whirling Maelstrom": "icons/ab8095cdd657b0cd66452ddb44ef01e1.jpg", "Thread of Mind": "icons/a7a1b83217ee3fe2ee11c477705389b2.jpg", "Thread of Fury": "icons/0e8b8974d2f17e25c085703bef8a3b53.jpg", "Thread of Finality": "icons/1e61bee1b4607fea83a6d3d01dfb8bce.jpg", "Thread of Warding": "icons/9937046794352b7c7ce31340ac7832ba.jpg", "Thread of Wisdom": "icons/e78cbb486a636c94a46a6e6183978249.jpg", "Thread of Rebirth": "icons/6f8f98e361fb4265c885ae3447b498ef.jpg", "Thread of Transmutation": "icons/d80a220ddab3e3be2641517ad3049915.jpg", "Thread of Propagation": "icons/d42d64ff749d858b6c72c5dc4b775797.jpg", "Thread of Evolution": "icons/c86847f148a9e86459dac50ba36da591.jpg", "Thread of Binding": "icons/73a3a289acb7b91ee236d9d9a9bdee1b.jpg", "Thread of Generation": "icons/2cf005bea9e145747a62fa27dc2caa0e.jpg", "Thread of Continuity": "icons/384da9161d140e14030e417aae613266.jpg"},
        "titan/strand": {"Towering Barricade": "icons/04e9c35e9f14147ce3898cea505dc7cf.png", "Rally Barricade": "icons/d29754d40cae05f736b8318b1654dc9a.png", "Catapult Lift": "icons/22167767b81dea77781871eeb1e7d3de.png", "Bladefury": "icons/228496331415f6854ef589f33c2a2622.png", "Frenzied Blade": "icons/7cccab938e8218821aed5d76740f61e9.png", "Grapple": "icons/5d65ba9eb04c2f3760eba0b5eec9be8a.jpg", "Slicewire Grenade": "icons/f4e6254963db69408d94ae00f579a82e.jpg", "Shackle Grenade": "icons/a2c73298753fdd565a22d3d6712820ab.jpg", "Threadling Grenade": "icons/18a14aeac121b2a5c8699556b63e38fd.jpg", "Into the Fray": "icons/1a3b8a7df1d3b68d70c88ca97932ea12.jpg", "Drengr's Lash": "icons/921a526761ce27c1f419d0bc1aafbf5f.jpg", "Flechette Storm": "icons/106bf863f701bf09ac51fe023f477bb6.jpg", "Banner of War": "icons/fe233d1b109122cec31208633e8e9851.jpg", "Thread of Mind": "icons/a7a1b83217ee3fe2ee11c477705389b2.jpg", "Thread of Fury": "icons/0e8b8974d2f17e25c085703bef8a3b53.jpg", "Thread of Finality": "icons/1e61bee1b4607fea83a6d3d01dfb8bce.jpg", "Thread of Warding": "icons/9937046794352b7c7ce31340ac7832ba.jpg", "Thread of Wisdom": "icons/e78cbb486a636c94a46a6e6183978249.jpg", "Thread of Rebirth": "icons/6f8f98e361fb4265c885ae3447b498ef.jpg", "Thread of Transmutation": "icons/d80a220ddab3e3be2641517ad3049915.jpg", "Thread of Propagation": "icons/d42d64ff749d858b6c72c5dc4b775797.jpg", "Thread of Evolution": "icons/c86847f148a9e86459dac50ba36da591.jpg", "Thread of Binding": "icons/73a3a289acb7b91ee236d9d9a9bdee1b.jpg", "Thread of Generation": "icons/2cf005bea9e145747a62fa27dc2caa0e.jpg", "Thread of Continuity": "icons/384da9161d140e14030e417aae613266.jpg"},
        "warlock/strand": {"Healing Rift": "icons/5af22b96589e8e20148a711d46b90ff3.png", "Empowering Rift": "icons/3208b3698319d9ef6c771c583ed0e36a.png", "Burst Glide": "icons/63af5e661089e6a1abbbe70186573a50.png", "Needlestorm": "icons/2e486aef07bd3551c35807f416ba0b6c.png", "Arcane Needle": "icons/e996524beb9d4371b1adc1212a6accdf.png", "Grapple": "icons/5d65ba9eb04c2f3760eba0b5eec9be8a.jpg", "Slicewire Grenade": "icons/f4e6254963db69408d94ae00f579a82e.jpg", "Shackle Grenade": "icons/a2c73298753fdd565a22d3d6712820ab.jpg", "Threadling Grenade": "icons/18a14aeac121b2a5c8699556b63e38fd.jpg", "Weaver's Call": "icons/5d38da97f92b3bdfef333a418ab8caf5.jpg", "Mindspun Invocation": "icons/277c475b9d3a3c1d167626b1bf9815ca.jpg", "The Wanderer": "icons/9d7be0c24d6dc7f041289e3b08ecff5e.jpg", "Weavewalk": "icons/b736858e50cbf0ffcdfe9a2d3d70e839.jpg", "Thread of Mind": "icons/a7a1b83217ee3fe2ee11c477705389b2.jpg", "Thread of Fury": "icons/0e8b8974d2f17e25c085703bef8a3b53.jpg", "Thread of Finality": "icons/1e61bee1b4607fea83a6d3d01dfb8bce.jpg", "Thread of Warding": "icons/9937046794352b7c7ce31340ac7832ba.jpg", "Thread of Wisdom": "icons/e78cbb486a636c94a46a6e6183978249.jpg", "Thread of Rebirth": "icons/6f8f98e361fb4265c885ae3447b498ef.jpg", "Thread of Transmutation": "icons/d80a220ddab3e3be2641517ad3049915.jpg", "Thread of Propagation": "icons/d42d64ff749d858b6c72c5dc4b775797.jpg", "Thread of Evolution": "icons/c86847f148a9e86459dac50ba36da591.jpg", "Thread of Binding": "icons/73a3a289acb7b91ee236d9d9a9bdee1b.jpg", "Thread of Generation": "icons/2cf005bea9e145747a62fa27dc2caa0e.jpg", "Thread of Continuity": "icons/384da9161d140e14030e417aae613266.jpg"},
        "hunter/prismatic": {"Gambler's Dodge": "icons/f4190b3803b5ab33c08838dc8e22bf60.png", "Marksman's Dodge": "icons/a340122b47c35efc613d89438e9ec7e4.png", "Triple Jump": "icons/d928a3ef4498d2a714d69ba81f45ac25.png", "Strafe Jump": "icons/2cd8dc264af1af2c293b2b009dc3ed46.png", "Blink": "icons/df3f7482cf7667181369db14b7115f38.jpg", "Silence and Squall": "icons/a8bbee32ce8f259e7b9e112c0c8a401a.png", "Storm's Edge": "icons/515dafc7f95e310e26bf3189f640231c.png", "Shadowshot: Deadfall": "icons/61feac4f1271ba6cecc29cc50e20ab5a.png", "Golden Gun: Marksman": "icons/52f2eb1fefa20e9c7b064c190855d588.png", "Silkstrike": "icons/3da7e8684b09600e90ea5c16f1edebe0.png", "Withering Blade": "icons/d4dbdba1bbc4f102f865b14dc2ec186f.png", "Snare Bomb": "icons/df5d0a9f49f37de0cb781b8d2fd70516.jpg", "Knife Trick": "icons/d9607f7db9d1f53b16af6ee6f6bcb428.jpg", "Combination Blow": "icons/a7ff3045c06a03649199c6b8e185d7a3.jpg", "Threaded Spike": "icons/46620e1f142778a0d429be7a12c39f21.png", "Swarm Grenade": "icons/0c322768dd41ac416e04dac131cf5fb5.jpg", "Grapple": "icons/5d65ba9eb04c2f3760eba0b5eec9be8a.jpg", "Magnetic Grenade": "icons/72966b5c97e45d8668483f2263138613.jpg", "Arcbolt Grenade": "icons/04c36b4cfebda156a8eca2b257e3ce4f.jpg", "Duskfield Grenade": "icons/5ed90305d6131582eb76abd99c487826.png", "Transcendence": "icons/cecb681426570c4cdde540284e6407c4.jpg", "Ascension": "icons/3bfe666002e12ec6ea3d0c3661f81f31.jpg", "Stylish Executioner": "icons/ed7f8c49b77fa46f4eec87a3c167c4b1.jpg", "Gunpowder Gamble": "icons/765402ea0cdaa799f62fe46b57ad8437.jpg", "Winter's Shroud": "icons/edf787affb7089495610e8f8c770d323.png", "Threaded Specter": "icons/f0311771bc0f771779301102d62c0ae0.jpg", "Facet of Devotion": "icons/923682dba15fcb9685f195d25eff1b95.png", "Facet of Hope": "icons/4be1e24b8d7073827be07dfc066b2517.png", "Facet of Courage": "icons/536765c9ed5e2f53268859591e8e9acf.png", "Facet of Balance": "icons/43fa2cf618e74671d0e652640c1ce4bc.png", "Facet of Command": "icons/24e6282bf3ee1c2a53717ed085cec441.png", "Facet of Dawn": "icons/684547ed1f97efdca37df4f1a5c5e699.png", "Facet of Protection": "icons/b6d90ee669fc1fef2e22ff95188be313.png", "Facet of Blessing": "icons/ba3a11d30e571278caf81e1ab4a220de.png", "Facet of Purpose": "icons/7a6b1d98544eb4a8512c6be0b6486456.png", "Facet of Ruin": "icons/058a2677d6742227811e81d8c4354270.png"},
        "titan/prismatic": {"Towering Barricade": "icons/1486c22fb9b3b73e6318812f10349c1a.png", "Rally Barricade": "icons/dfe44718169a017a86b8d8cab0d4e18a.png", "Thruster": "icons/24fec20486dcadb8be276226b56c5500.jpg", "Catapult Lift": "icons/c09cce402f29548803f4a3f352b03f14.png", "Bladefury": "icons/228496331415f6854ef589f33c2a2622.png", "Twilight Arsenal": "icons/ad8fd9cd668f4d980b29e26ade9e4369.png", "Hammer of Sol": "icons/9d1fd669f61cce4abd35dbefd22ba90c.png", "Thundercrash": "icons/adb140aba83a6c14345852531d4ee2e0.png", "Glacial Quake": "icons/3c522f849a7d4d86d5224d7d5d5671a4.png", "Thunderclap": "icons/45e77f67fbb1e12c36972cd923f7b9e0.jpg", "Shield Throw": "icons/18ba97e43f603ca3cbc1507255992d39.jpg", "Shiver Strike": "icons/1f34b1d2eb5377ac68346cb42db6f008.png", "Hammer Strike": "icons/c05584046992239cbbd0d319228058b8.jpg", "Frenzied Blade": "icons/7cccab938e8218821aed5d76740f61e9.png", "Shackle Grenade": "icons/a2c73298753fdd565a22d3d6712820ab.jpg", "Glacier Grenade": "icons/08b4d8632636f78c57425b844d7b42e4.png", "Pulse Grenade": "icons/11837de6306d28df467178af097d748b.jpg", "Thermite Grenade": "icons/e4aa73bf21f3da3e22f9e07475e2e614.jpg", "Suppressor Grenade": "icons/17372092d1add4cf52bb4862037b418c.jpg", "Transcendence": "icons/cecb681426570c4cdde540284e6407c4.jpg", "Consecration": "icons/5c71b63e8b653cd63a2ae0d8a8c64979.jpg", "Knockout": "icons/e0fdf5c4c4dc10d6ee63365bf7d70821.jpg", "Diamond Lance": "icons/663ed4baf3983fa13d5daf766ae60bd4.png", "Drengr's Lash": "icons/921a526761ce27c1f419d0bc1aafbf5f.jpg", "Facet of Devotion": "icons/923682dba15fcb9685f195d25eff1b95.png", "Facet of Hope": "icons/4be1e24b8d7073827be07dfc066b2517.png", "Facet of Courage": "icons/536765c9ed5e2f53268859591e8e9acf.png", "Facet of Balance": "icons/43fa2cf618e74671d0e652640c1ce4bc.png", "Facet of Command": "icons/24e6282bf3ee1c2a53717ed085cec441.png", "Facet of Dawn": "icons/684547ed1f97efdca37df4f1a5c5e699.png", "Facet of Protection": "icons/b6d90ee669fc1fef2e22ff95188be313.png", "Facet of Blessing": "icons/ba3a11d30e571278caf81e1ab4a220de.png", "Facet of Purpose": "icons/7a6b1d98544eb4a8512c6be0b6486456.png", "Facet of Ruin": "icons/058a2677d6742227811e81d8c4354270.png"},
        "warlock/prismatic": {"Healing Rift": "icons/d2b480f1161f83a84476f0e097c78096.png", "Empowering Rift": "icons/bd415a1fb6bd0f2323f4b8b2c72ba8a1.png", "Phoenix Dive": "icons/344563b4a5bee94734c4499ef83a6ac2.jpg", "Burst Glide": "icons/656aa34f9a71bd3621b5719bd779b337.png", "Blink": "icons/6930fabff4175da3425bfe9e1c4b2c54.jpg", "Winter's Wrath": "icons/c9f25c8f6d5e647366ffc4f71a825961.png", "Song of Flame": "icons/ed2e5deb9b67c0120468ee136f98f2b2.png", "Nova Bomb: Cataclysm": "icons/b1efa0eaa710653d85e2fcf5321047fb.png", "Stormtrance": "icons/31a0445d352fd44b62c9a8dd2752ccdf.png", "Needlestorm": "icons/2e486aef07bd3551c35807f416ba0b6c.png", "Penumbral Blast": "icons/f77faacb093918106f28b2b49e168264.png", "Arcane Needle": "icons/e996524beb9d4371b1adc1212a6accdf.png", "Pocket Singularity": "icons/afd8d014a0cf2e76a73172beae7ef0ee.jpg", "Incinerator Snap": "icons/e9dee44a01ea409afe80a939b6341843.jpg", "Chain Lightning": "icons/f07bbec19064eec2de3d02e3b700cfc2.jpg", "Vortex Grenade": "icons/12997544665705bbbd94742268ce7091.jpg", "Healing Grenade": "icons/d7fa54aea967c101aeafcbc1163508d6.jpg", "Storm Grenade": "icons/9f4ace2bd6ab050148f54ff6f4ce9a0f.jpg", "Coldsnap Grenade": "icons/ff53139f18628530891598936e7a8c13.png", "Threadling Grenade": "icons/18a14aeac121b2a5c8699556b63e38fd.jpg", "Transcendence": "icons/cecb681426570c4cdde540284e6407c4.jpg", "Hellion": "icons/3514bec04e2464b2f48e1bd025afc668.jpg", "Feed the Void": "icons/178bb0e78e55c5b960aa6f42660b9b66.jpg", "Lightning Surge": "icons/5730fd352ae02a03290387ea81d39468.jpg", "Bleak Watcher": "icons/51d335e369d83d303203448c75fce439.png", "Weaver's Call": "icons/5d38da97f92b3bdfef333a418ab8caf5.jpg", "Facet of Devotion": "icons/923682dba15fcb9685f195d25eff1b95.png", "Facet of Hope": "icons/4be1e24b8d7073827be07dfc066b2517.png", "Facet of Courage": "icons/536765c9ed5e2f53268859591e8e9acf.png", "Facet of Balance": "icons/43fa2cf618e74671d0e652640c1ce4bc.png", "Facet of Command": "icons/24e6282bf3ee1c2a53717ed085cec441.png", "Facet of Dawn": "icons/684547ed1f97efdca37df4f1a5c5e699.png", "Facet of Protection": "icons/b6d90ee669fc1fef2e22ff95188be313.png", "Facet of Blessing": "icons/ba3a11d30e571278caf81e1ab4a220de.png", "Facet of Purpose": "icons/7a6b1d98544eb4a8512c6be0b6486456.png", "Facet of Ruin": "icons/058a2677d6742227811e81d8c4354270.png"}
    };
    const ITEM_ICONS = {
        "Abeyant Leap": "icons/8ca0dc9ac4166580356aa2d1f243e009.jpg",
        "Axial Lacuna": "icons/089861a0a0bf4203b6100eee944a55f6.jpg",
        "Ballidorse Wrathweavers": "icons/0b6052a09f8d04089eda67529392d770.jpg",
        "Bastion": "icons/805009e0c67a2dcf4f4f7bffb2dba493.jpg",
        "Blast Furnace": "icons/c394cdcf034778c2b0663b170d853437.jpg",
        "Caliban's Hand": "icons/b963098bb34446a4119fccf6e3cdbfe8.jpg",
        "Cataclysmic": "icons/a180748fde0e20e450b841663c388833.jpg",
        "Celestial Nighthawk": "icons/a7c3ee955c5e8b1c20122206d1bf60ff.jpg",
        "Collective Obligation": "icons/238ab90ba2f858ebb8a5a1797a13fdd4.jpg",
        "Contraverse Hold": "icons/b667fa414b7d70ed4fe8b34296c76cbb.jpg",
        "Corrective Measure": "icons/38b4251825652c4f5464aa3ac2139d1b.jpg",
        "Cruel Mercy": "icons/083bc1321b57585daf016ada26536504.jpg",
        "Cuirass of the Falling Star": "icons/23e3d07bead2936a80612419f3ee9f94.jpg",
        "Cyrtarachne's Facade": "icons/cc4f9b05185e4430b6c0ca42cc7a5c1d.jpg",
        "Deliverance": "icons/b32b09e7a3e0cf827ca1bea39dc71d05.jpg",
        "Deterministic Chaos": "icons/d657cc9dae47ecaec19038f18f335c18.jpg",
        "Doom Fang Pauldron": "icons/5978e308b12744fbe33c11d3296f51e9.jpg",
        "Dragon's Breath": "icons/49197babe16ed546cec94b26b44f3447.jpg",
        "Elsie's Rifle": "icons/650626700685cb16112301c7741352ad.jpg",
        "Euphony": "icons/fe16110003f0cc75145eed012458a667.jpg",
        "Fallen Sunstar": "icons/54d230429642573df3c8030ba90fec0e.jpg",
        "Fatebringer": "icons/7741689cbc1102aa9fc742b33a106f19.jpg",
        "Geomag Stabilizers": "icons/395d6f306e29ddf0afdd5b1ffaaf1e5f.jpg",
        "Getaway Artist": "icons/a2350076ae19cf474a88a0c2a440c93f.jpg",
        "Gifted Conviction": "icons/4365fd49261fb81d069d0db10acb9fd4.jpg",
        "Graviton Lance": "icons/ce9043979a6e35bf4d3952f5cf251a49.jpg",
        "Gyrfalcon's Hauberk": "icons/e6e10342a97eb3f6b974399ef7214e75.jpg",
        "Hammerhead": "icons/0f000cfde2e1f725ba85955efac540ff.jpg",
        "Hazardous Propulsion": "icons/54ff2f91d443bac8714037a2d37c77d7.jpg",
        "Heart of Inmost Light": "icons/34f23604746fc260a2153e93ccfaec7f.jpg",
        "Helm of Saint-14": "icons/00da519dfd936447edd44bd0e472d229.jpg",
        "Hoarfrost-Z": "icons/e1c35c4941cc7848e2b5de7bacd17232.jpg",
        "IKELOS_HC_v1.0.2": "icons/eb545cf6330f410dfaa5e65412757e5d.jpg",
        "Icefall Mantle": "icons/8c6e9159014b670c7e316aee4b1df3a8.jpg",
        "Le Monarque": "icons/5f858cb4661c605d18e3dc0b62cc4aaa.jpg",
        "Liar's Handshake": "icons/39a2f16e2f092e37f21eb5f61f107594.jpg",
        "Loaded Question": "icons/8ed31fb8f06478487327cdb091b5c4cb.jpg",
        "Loreley Splendor Helm": "icons/aeda17ea7c8071b1156258b09f4219f3.jpg",
        "Lucky Pants": "icons/fa501bf3740c6b0cdc91f2cafd0547a3.jpg",
        "Luna's Howl": "icons/cd404cce024df3c87a25d1465021ce5f.jpg",
        "Mask of Bakris": "icons/d2fdd193c4536cbc9cdaa82e24b7125a.jpg",
        "Midnight Coup": "icons/a16c0c62d2153cb59ca7dd5565d66d6a.jpg",
        "Mint Retrograde": "icons/fcb3832c5d129eb787c2fff1506f70c3.jpg",
        "Nezarec's Sin": "icons/5f4c4d8bdfc4099ce76f13998d977796.jpg",
        "No Survivors": "icons/68e6dcff48514d8b331072aad550e923.jpg",
        "Omnioculus": "icons/9b5e31b72b4c2b7061a7857eba7f8863.jpg",
        "Orpheus Rig": "icons/4abdc33a8ff869fc7bdcbdc83fbaba01.jpg",
        "Osmiomancy Gloves": "icons/50c84155502586d5b852ce853131ee48.jpg",
        "Outbreak Perfected": "icons/a1b6a5f3e52878610397249986300b23.jpg",
        "Phoenix Protocol": "icons/5ab8760ee8ef440f317ae4a95d047d07.jpg",
        "Point-Contact Cannon Brace": "icons/1a871899e9657793c57c3916ee69d19f.jpg",
        "Pro Memoria": "icons/3b8ed9a644e1b4c0ddcee06de3ce403c.jpg",
        "Pyrogale Gauntlets": "icons/aed35bae5c7983884ca5a4809e78def2.jpg",
        "Qullim's Terminus": "icons/7e045bc7b88d478a54913ddc6bd7f373.jpg",
        "Raiju's Harness": "icons/fdc99d915e90a5992549ebe33c85d2c9.jpg",
        "Rapacious Appetite": "icons/bfd7f8d9a9ab08749b0e67458f93ba87.jpg",
        "Relativism": "icons/58ae63b773059e5bd7a4d43298f73a50.jpg",
        "Renewal Grasps": "icons/4943351eeea32eacd98c50e33c840416.jpg",
        "Riptide": "icons/a1af4517596c2722904a3bccf6251de2.jpg",
        "Riskrunner": "icons/0b7fa10956ee9f16899ce1838c3c0e31.jpg",
        "Solipsism": "icons/7b57cd041db1987c3f566b96535daf9f.jpg",
        "Starfire Protocol": "icons/e101d5271789720c8930459168603398.jpg",
        "Stoicism": "icons/9db95c112130c018f823f394668cfb5a.jpg",
        "Stormchaser": "icons/0b3c602c10a80fcc5c688f6298e53fc6.jpg",
        "Sunbracers": "icons/220fda89a88058f84725ff1df39a9f5e.jpg",
        "Sunshot": "icons/f45a7d8e52bf0d88bbd43d4354878313.jpg",
        "Suspectum-4fr": "icons/70bea113574eff7b0211a4f28f54b7a3.jpg",
        "Swarmers": "icons/6913d8a2546e53f6bbcba482e487477b.jpg",
        "Synthoceps": "icons/9f51bbad83aeb142eb56d9faf7440662.jpg",
        "Taipan-4fr": "icons/70bea113574eff7b0211a4f28f54b7a3.jpg",
        "Terminus Horizon": "icons/00cca0594c0db3371104f01ab9c0bbd2.jpg",
        "Tessellation": "icons/1c2e9282803d516be01561423a0ea282.jpg",
        "The Sixth Coyote": "icons/fe62cafbd9124a2ee12d35dbe6fdde3a.jpg",
        "Thunderlord": "icons/4a08027f7b5752f84d183ecc61682c3e.jpg",
        "Trinity Ghoul": "icons/ab33a7c7024299b28d8c6410d63e5bb5.jpg",
        "Ulterior Observation": "icons/37d354aff739dc5ca55873d106291f8a.jpg",
        "Verity's Brow": "icons/e3a0690cafbf8109a34231f70476c8a0.jpg",
        "Winterbite": "icons/fdc14f2b28c77f9627f0629fdb540b76.jpg",
        "Wishful Ignorance": "icons/e276ddbfe120ed49c38f24a5390143e1.jpg",
        "Word of Crota": "icons/4b9f5e2f929b5f7c1730e28ec880b989.jpg",
        "Zaouli's Bane": "icons/d11aa112b88dc2cbf48706fdad606710.jpg"
    };
    const STAT_ICONS = {"Health": "icons/717b8b218cc14325a54869bef21d2964.png", "Melee": "icons/fa534aca76d7f2d7e7b4ba4df4271b42.png", "Grenade": "icons/065cdaabef560e5808e821cefaeaa22c.png", "Super": "icons/585ae4ede9c3da96b34086fccccdc8cd.png", "Class": "icons/7eb845acb5b3a4a9b7e0b2f05f5c43f1.png", "Weapons": "icons/bc69675acdae9e6b9a68a02fb4d62e07.png"};

    const state = { cls: 'hunter', sub: 'solar', build: 0, raid: true, mode: 'curated' };

    // restore from URL hash, e.g. #titan/strand/1 or #titan/strand/1/noraid
    const [hCls, hSub, hBuild, ...hFlags] = location.hash.slice(1).split('/');
    if (DATA[hCls]) state.cls = hCls;
    if (DATA[state.cls].builds[hSub]) state.sub = hSub;
    if (DATA[state.cls].builds[state.sub][+hBuild]) state.build = +hBuild;
    if (hFlags.includes('noraid')) state.raid = false;
    if (hFlags.includes('custom') && window.D2Custom) state.mode = 'custom';

    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    // stat modifier lines like "+10 Melee ▲" get their own styling
    const textHtml = t => esc(t || '').split('\n').map(l => /^[+-]\d+ .*[▲▼]$/.test(l) ? `<span class="stat-mod${l[0] === '-' ? ' neg' : ''}">${l}</span>` : l).join('<br>');
    const img = (path, cls = '') => path ? `<img class="${cls}" src="${BNET}${path}" alt="" loading="lazy">` : '';
    const ELEMENT_NAMES = { solar: 'Solar', arc: 'Arc', void: 'Void', stasis: 'Stasis', strand: 'Strand', prismatic: 'Prismatic' };

    function button(className, html, active, onClick) {
        const b = document.createElement('button');
        b.className = className + (active ? ' active' : '');
        b.innerHTML = html;
        b.addEventListener('click', onClick);
        return b;
    }

    // In-game style item card: rarity-coloured header with icon, then body
    function itemCard({ slot, name, rarity, type, icon, champ, how, perks, why, source, footer }) {
        return `<article class="item ${rarity}">
            <header class="item-head">
                ${icon ? img(icon, 'item-icon') : '<div class="item-icon set-icon"></div>'}
                <div class="item-title">
                    <div class="item-name">${esc(name)}</div>
                    <div class="item-type">${esc(type)}</div>
                </div>
                <div class="item-slot">${esc(slot)}</div>
            </header>
            <div class="item-body">
                ${champ ? `<div class="champ champ-${champ.toLowerCase()}"><span class="champ-dot"></span>${champ}<span class="champ-how">${esc(how)}</span></div>` : ''}
                ${why ? `<div class="item-why">${esc(why)}</div>` : ''}
                ${perks ? perks.map(([p, t]) => `<div class="perk"><div class="perk-name">${esc(p)}</div><div class="perk-text">${textHtml(t)}</div></div>`).join('') : ''}
                ${footer || ''}
                <div class="item-source">${esc(source)}</div>
            </div>
        </article>`;
    }

    function render() {
        history.replaceState(null, '', `#${state.cls}/${state.sub}/${state.build}${state.raid ? '' : '/noraid'}${state.mode === 'custom' ? '/custom' : ''}`);
        const art = SUBCLASS_ART[state.cls][state.sub];
        document.body.className = 'el-' + state.sub;
        document.getElementById('bg').style.backgroundImage = `url("${BNET}${art.art}")`;

        document.getElementById('class-tabs').replaceChildren(...Object.entries(DATA).map(([key, c]) =>
            button('nav-tab', esc(c.name), key === state.cls, () => { state.cls = key; state.build = 0; render(); })));

        document.getElementById('subclass-tabs').replaceChildren(...SUBCLASSES.map(s =>
            button(`sub-tab el-${s.key}`, `${img(SUBCLASS_ART[state.cls][s.key].icon)}<span>${s.name}</span>`, s.key === state.sub,
                () => { state.sub = s.key; state.build = 0; render(); })));

        const builds = DATA[state.cls].builds[state.sub];
        document.getElementById('build-tabs').replaceChildren(...builds.map((b, i) =>
            button('build-tab', `<span class="build-num">${String(i + 1).padStart(2, '0')}</span>${esc(b.name)}`, i === state.build,
                () => { state.build = i; render(); })));

        const modeTabs = document.getElementById('mode-tabs');
        if (window.D2Custom) modeTabs.replaceChildren(
            button('seg', 'Curated builds', state.mode === 'curated', () => { state.mode = 'curated'; render(); }),
            button('seg', 'Build your own', state.mode === 'custom', () => { state.mode = 'custom'; render(); }));
        document.getElementById('build-tabs').hidden = state.mode === 'custom';

        document.getElementById('raid-tabs').replaceChildren(
            button('seg', 'Raid gear', state.raid, () => { state.raid = true; render(); }),
            button('seg', 'No raids', !state.raid, () => { state.raid = false; render(); }));

        document.getElementById('hero-kicker').textContent = `${DATA[state.cls].name} · ${ELEMENT_NAMES[state.sub]}`;
        document.getElementById('hero-title').textContent = art.name;

        if (state.mode === 'custom') {
            window.D2Custom.render(document.getElementById('build-detail'), {
                state, rerender: render, W, S, PERKS, ARTIFACT, ARTIFACT_NAME, BNET, STAT_ICONS, EXOTIC_ARMOR_SOURCE,
                itemCard, esc, textHtml, img, className: DATA[state.cls].name,
                curated: () => { const cb = builds[state.build]; return { lo: LOADOUTS[state.cls][cb.name], aspects: cb.aspects, name: cb.name }; }
            });
            return;
        }

        const b = builds[state.build];
        const lo = LOADOUTS[state.cls][b.name];
        const icons = ABILITY_ICONS[state.cls + '/' + state.sub];

        const weapons = b.weapons.map(key => {
            const w = W[state.raid ? key : (b.noRaid[key] || W[key].noRaid || key)];
            const [champ, how] = champOf(w);
            return itemCard({
                slot: w.slot, name: w.name, rarity: w.exotic ? 'exotic' : 'legendary',
                type: w.type + (w.note ? ` · ${w.note}` : ''), icon: ITEM_ICONS[w.name],
                champ, how, perks: w.exotic ? PERKS[w.name] : null, source: w.source
            });
        }).join('');

        const armor = itemCard({
            slot: b.armor.slot, name: b.armor.name, rarity: 'exotic', type: DATA[state.cls].name + ' Exotic ' + b.armor.slot,
            icon: ITEM_ICONS[b.armor.name], perks: PERKS[b.armor.name], why: PERKS[b.armor.name] ? null : b.armor.why,
            source: b.armor.source || EXOTIC_ARMOR_SOURCE
        });

        const sets = SET_PICKS[state.cls][b.name].filter(([key]) => state.raid || !S[key].raid).slice(0, 2)
            .map(([key, why], i) => itemCard({
                slot: i === 0 ? 'Main · 4 pieces' : 'Alt · or 2 + 2', name: S[key].name, rarity: 'legendary set',
                type: 'Legendary Armor Set', why, source: S[key].source,
                perks: [['2-Piece · ' + S[key].two[0], S[key].two[1]], ['4-Piece · ' + S[key].four[0], S[key].four[1]]]
            })).join('');

        const abilities = ['Super', 'Class Ability', 'Movement', 'Melee', 'Grenade'].map((label, i) => `
            <div class="ability${i === 0 ? ' super' : ''}">
                <div class="ability-icon">${img(icons[lo[i]])}</div>
                <div class="ability-label">${label}</div>
                <div class="ability-name">${esc(lo[i])}</div>
            </div>`).join('');

        document.getElementById('build-detail').innerHTML = `
            <div class="build-head">
                <h2>${esc(b.name)}</h2>
                <p>${esc(b.desc)}</p>
            </div>

            <div class="columns">
                <section class="panel">
                    <h3 class="panel-title">Abilities</h3>
                    <div class="abilities">${abilities}</div>

                    <h3 class="panel-title">Aspects</h3>
                    <div class="aspects">
                        ${b.aspects.map(a => `<div class="aspect">
                            <div class="aspect-icon">${img(icons[a])}</div>
                            <div><div class="aspect-name">${esc(a)}</div><div class="aspect-text">${textHtml(SUBCLASS_TEXT[a])}</div></div>
                        </div>`).join('')}
                    </div>

                    <h3 class="panel-title">Fragments <span class="panel-count">${lo[5].length} slots</span></h3>
                    <div class="fragments">
                        ${lo[5].map(f => `<div class="fragment">
                            <div class="fragment-icon">${img(icons[f])}</div>
                            <div><div class="fragment-name">${esc(f)}</div><div class="fragment-text">${textHtml(SUBCLASS_TEXT[f])}</div></div>
                        </div>`).join('')}
                    </div>

                    <h3 class="panel-title">Stat Priority</h3>
                    <div class="stats">
                        ${b.stats.map((st, i) => `<div class="stat">
                            <span class="stat-rank">${i + 1}</span>${img(STAT_ICONS[st], 'stat-icon')}<span>${esc(st)}</span>
                        </div>`).join('')}
                    </div>
                </section>

                <section class="panel">
                    <h3 class="panel-title">Weapons <span class="panel-count">One per champion · ${ARTIFACT_NAME}</span></h3>
                    <div class="items">${weapons}</div>

                    <h3 class="panel-title">Exotic Armor</h3>
                    <div class="items">${armor}</div>

                    <h3 class="panel-title">Legendary Armor Sets</h3>
                    <div class="items">${sets}</div>
                </section>
            </div>`;
    }

    render();
})();
