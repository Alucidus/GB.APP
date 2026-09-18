const TABLES={"Attack Roll": [["Range","Standard","Called (+5)","Sniper (own curve)"],["120cm+","18+","23+ (effectively impossible — only a Nat 20 exception could ever reach it)","12+"],["90-120cm (Sniper sweet spot)","15+","20+","9+"],["60-90cm","12+","17+","12+"],["30-60cm","9+","14+","15+"],["Under 30cm","6+","11+","18+"]],"Hit Location": [["Roll (d10)","Location","Odds"],["1","Head","10%"],["2-3","Left Arm","20%"],["4-5","Right Arm","20%"],["6","Left Leg","10%"],["7","Right Leg","10%"],["8-10","Chest","30%"]],"Rolled Dodge": [["Range","Roll Needed"],["90cm+","7+"],["60-90cm","10+"],["30-60cm","14+"],["Under 30cm","18+"]],"Melee Clash": [["Difference","Result"],["0-1","Block/Parry — nothing happens"],["2-6","Hit — deals the winner's equipped weapon's Normal Hit damage (Section 1)"],["7+","Critical — the winner chooses one of two options (see below)"]],"AP Costs": [["Action","AP Cost"],["Ballistic weapon attack","1"],["Movement","1 per movement increment — no cap, a unit may spend its entire AP pool on Movement if the player chooses, giving up all attacks/abilities that turn to do so"],["Beam weapon attack","2"],["Called Shot","Same as the weapon used — no extra AP cost"],["Ballistic Spray and Pray","2"],["Beam Spray and Pray","3"],["System Override (Crystal Body)","Matches whatever weapon is being stolen"],["Drawing / switching to a different weapon","1 (or the weapon's own listed cost — see Section 1)"]],"Squad Splash": [["Roll (d10)","Casualties"],["1-3","1"],["4-6","2"],["7-8","3"],["9","4"],["10","5"]],"Ship vs Ship": [["Range","To hit"],["150-180cm","9+"],["120-150cm","7+"],["90-120cm","5+"],["60-90cm","4+"],["Under 60cm","3+"]],"Ship Hit Location": [["Roll","Location"],["1-7","Hull"],["8-9","Thrusters"],["10","Bridge"]],"Machine Guns": [["Mode","Targets","Roll","Damage","AP"],["Burst Fire — Ballistic MG","1 target","3d6: 4+ at 60cm+, 3+ at 30-60cm, 2+ under 30cm","1 per hit die, all to one rolled hit location","1"],["Burst Fire — Beam MG","1 target","3d6: same bands","2 per hit die, all to one rolled hit location","2"],["Spray and Pray — Ballistic MG","Everyone in a 45° cone, 30cm long (friend or foe)","1d6 per target by its own distance: same bands","2 to all 6 locations","2"],["Spray and Pray — Beam MG","Everyone in a 45° cone, 30cm long (friend or foe)","1d6 per target by its own distance: same bands","3 to all 6 locations","3"],["Notes","Every target gets its normal Dodge/Block","Spray and Pray: once per activation, instead of the standard attack","Submachine guns: Burst Fire only — no Spray and Pray","F91's MG grants Point Defense instead"]],"Destruction": [["Location lost","Effect"],["Arm","That arm's weapons disabled for the game"],["One leg","Movement halved"],["Both legs","Fully immobilised"],["Head","−2 to all rolls. Gundam-tier also lose all Free Dodges (2 rolled Dodges remain)"],["Chest","Dead — the kill condition"],["All four limbs","Down — immobilised and unarmed, but alive"]]};
const UNITS=[
 {
  "id": "gm-rgm-79-origin",
  "name": "GM (RGM-79, Origin)",
  "tier": "Grunt",
  "dp": 500,
  "faction": "federation",
  "bg": "grey",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "—",
    "kind": "none",
    "text": "No unique ability — the true baseline mass-production Federation Grunt, mirroring Zaku II's role on the Zeon side."
   }
  ],
  "weapons": [
   {
    "name": "Beam Spray Gun",
    "y": 68.2,
    "dmg": "4",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Head Vulcans",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "GM",
  "portrait": "gm"
 },
 {
  "id": "jesta-rgm-96x",
  "name": "Jesta (RGM-96X)",
  "tier": "Veteran/Custom Grunt",
  "dp": 650,
  "faction": "federation",
  "bg": "grey",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Improved Thrust System",
    "kind": "none",
    "text": "Passive: +10cm Movement per AP (20cm → 30cm/AP), reflecting its purpose-built role of matching the Unicorn Gundam's speed despite being a mass-production Grunt-tier frame.",
    "fx": {
     "movePlus": 10
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield Missiles",
    "y": 78.7,
    "dmg": "2",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Jesta",
  "portrait": "jesta"
 },
 {
  "id": "blue-destiny-unit-1-rx-79bd-1",
  "name": "Blue Destiny Unit 1 (RX-79BD-1)",
  "tier": "Veteran/Custom Grunt",
  "dp": 650,
  "faction": "federation",
  "bg": "grey",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "EXAM System",
    "kind": "auto",
    "text": "Triggers automatically the moment her Shield is destroyed (reaches 0 HP) — this is not a player-declared charge like other units' overdrive abilities; it activates whether the pilot wants it to or not. Losing the Shield means she's now fully exposed with nothing left standing between her and incoming fire, and that's the moment of genuine danger that pushes her into Berserk Mode — a cleaner, more reliable trigger than a Chest HP percentage, which would barely register given her small 5-point Chest pool. Optical sensors glow red while active.\n\nWhile active:\n• Dual Beam Sabers gain +4 Melee Roll Bonus and 3/6 damage (Normal/Critical) — matching the game's existing top melee tier (GN Sword/Beam Axe), not exceeding it.\n• The unit must initiate melee combat every turn if any target — friendly or enemy — is within range. It cannot hold back, play defensively, or decline to engage while EXAM is active.\n• Berserk risk: each time it initiates melee while active, roll a d20. On a 1-3, the attack targets the nearest unit regardless of side instead of whatever target was intended — if an ally is closer than any enemy, Blue Destiny attacks them instead. This is the real, mechanical version of the unit's canon nickname, \"Blue Death.\"\n\nDeactivation: EXAM stays active until the Shield is restored (e.g., via Base of Operations repair, Core Rulebook Section 7.5) or the engagement ends. There is no clean \"turn off\" — this is an emergency response the pilot doesn't control once triggered, and since a destroyed Shield doesn't come back mid-fight on its own, EXAM effectively stays on for the rest of that engagement once it starts.",
    "trigger": "shieldDown",
    "fx": {
     "meleeRoll": 4,
     "meleeDmg": "3/6"
    },
    "berserk": {
     "die": "d20",
     "fail": "1-3",
     "failText": "BERSERK — this attack targets the NEAREST unit, friend or foe",
     "passText": "EXAM check passed — attack your chosen target"
    }
   },
   {
    "name": "Spray and Pray",
    "kind": "none",
    "fx": {
     "ap": 2
    },
    "cdText": "2 dmg · all 6",
    "popKind": "Weapon option · 100mm Machine Gun",
    "text": "Uses the 100mm Machine Gun, instead of its standard attack.\n\nFire in a 45° cone, 30cm long. Every unit in the cone — friend or foe — is a target: roll a d6 for each by its own distance (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm). No pooling or reassigning. Each target may Dodge or Block. A hit deals 2 damage to all 6 locations.\n\n2 AP · once per activation · Rulebook Section 8. Tap the AP to spend it."
   }
  ],
  "weapons": [
   {
    "name": "100mm Machine Gun",
    "y": 68.2,
    "dmg": "3d6×1",
    "ap": "1",
    "range": "90cm",
    "limit": null,
    "text": "BURST FIRE: roll 3d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 1 damage, all to one rolled hit location. One Dodge/Block covers the whole burst.\n\nAlso fires SPRAY AND PRAY — see the Spray and Pray skill.",
    "spray": "ballistic"
   },
   {
    "name": "Chest Vulcans",
    "y": 73.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Dual Beam Sabers",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "damage: 2/4 (Normal/Critical)  ",
    "boost": {
     "when": "EXAM System",
     "dmg": "3/6",
     "note": "+4 Melee Roll Bonus while EXAM is active"
    }
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Blue Destiny Unit 1",
  "portrait": "blue-destiny"
 },
 {
  "id": "rx-79-g-sw-slave-wraith-mobile-suit-gundam-side-story-missing-link-crossover",
  "name": "RX-79[G]SW Slave Wraith (Mobile Suit Gundam Side Story: Missing Link crossover)",
  "tier": "Veteran/Custom Grunt",
  "dp": 650,
  "faction": "federation",
  "bg": "grey",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Wearable Armor",
    "kind": "none",
    "text": "Passive: reduces all incoming ballistic/projectile damage by 1 (minimum 1 damage still applies) — covers standard Ballistic weapons and Bazooka-tier ordnance alike. Has no effect against beam weapons, reflecting how the mounted reactive-armor explosives can only disrupt the physical structure of an incoming projectile, not a beam with no mass to diffuse. Mounted on the pauldrons — this prototype system was later formally adopted by the RGM-79FP GM Striker."
   },
   {
    "name": "Point Defense (Vulcans)",
    "kind": "none",
    "text": "Standard, per Core Rulebook Section 8 — free reaction, no AP, to shoot down an incoming Homing Missile (12+ on d20)."
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Chest Vulcans",
    "y": 73.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber x2",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "ap: 1 (or 2 for Advantage)  "
   },
   {
    "name": "Rocket Launcher",
    "y": 83.3,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Slave Wraith",
  "portrait": "slave-wraith"
 },
 {
  "id": "gm-sniper-ii-rgm-79sp",
  "name": "GM Sniper II (RGM-79SP)",
  "tier": "Veteran/Custom Grunt",
  "dp": 750,
  "faction": "federation",
  "bg": "grey",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Precision Targeting Visor",
    "kind": "none",
    "text": "Grants Precision Optics: Called Shot penalty reduced from +5 to +2, reflecting its dedicated head-mounted sniper sensor system."
   }
  ],
  "weapons": [
   {
    "name": "Sniper Rifle",
    "y": 68.2,
    "dmg": "7",
    "ap": "2",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Pistol",
    "y": 73.7,
    "dmg": "3",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "ap: 1 (or 2 for Advantage)  "
   },
   {
    "name": "Head Vulcans",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "GM Sniper II",
  "portrait": "gm-sniper-ii"
 },
 {
  "id": "rx-78-2-gundam",
  "name": "RX-78-2 Gundam",
  "tier": "Flagship",
  "dp": 1000,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Point Defense",
    "kind": "none",
    "text": "**Point Defense (from Vulcans)** — free reaction, no AP, once per incoming Homing Missile: roll a d20, **12+** shoots it down before it hits. No other unique abilities. The RX-78-2 is the baseline Flagship-tier unit with no signature mechanic, relying on solid all-around stats rather than a specialist system. It is the reference point the rest of the roster is measured against."
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Hyper Bazooka",
    "y": 83.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 12,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 12,
  "short": "RX-78-2 Gundam",
  "portrait": "rx-78-2"
 },
 {
  "id": "gundam-ex",
  "name": "Gundam EX",
  "tier": "Flagship",
  "dp": 1000,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Point Defense",
    "kind": "none",
    "text": "**Point Defense (from Vulcans)** — free reaction, no AP, once per incoming Homing Missile: roll a d20, **12+** shoots it down before it hits. No other unique abilities. The RX-78-2 is the baseline Flagship-tier unit with no signature mechanic, relying on solid all-around stats rather than a specialist system. It is the reference point the rest of the roster is measured against."
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Hyper Bazooka",
    "y": 83.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 12,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 12,
  "short": "Gundam EX",
  "portrait": "gundam-ex"
 },
 {
  "id": "gundam-mk-ii-rx-178",
  "name": "Gundam Mk-II (RX-178)",
  "tier": "Flagship",
  "dp": 1000,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "35cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Point Defense",
    "kind": "none",
    "text": "**Point Defense (from Vulcan Pod)** — free reaction, no AP, once per incoming Homing Missile: roll a d20, **12+** shoots it down before it hits. No other unique abilities. The Mk-II's edge is structural rather than a special mechanic: as the first movable-frame design it simply moves better than its contemporaries, reflected in its **+5cm/AP** Movement bonus over the Hero baseline."
   },
   {
    "name": "Anti-Beam Coating",
    "kind": "counter",
    "text": "Standard Shield (12 HP). Chassis also carries an **Anti-Beam Coating** (8 HP pool, 360°, -1 to incoming beam damage — see Section 4.2)",
    "max": 8,
    "tracks": "pool"
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Heat Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 2
   },
   {
    "name": "Vulcan Pod",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Hyper Bazooka",
    "y": 83.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 12,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 12,
  "short": "Gundam Mk-II",
  "portrait": "gundam-mk-ii"
 },
 {
  "id": "rx-78xx-gundam-pixy",
  "name": "RX-78XX Gundam Pixy",
  "tier": "Flagship",
  "dp": 1300,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Overwhelming Mobility",
    "kind": "none",
    "text": "Passive: **+10cm Movement per AP** (30cm → 40cm), reflecting the significant weight savings from removing the core block and space thrusters entirely.",
    "fx": {
     "movePlus": 10
    }
   },
   {
    "name": "Beam Stealth Coat",
    "kind": "toggle",
    "text": "Grants access to Stealth Stance (Core Rulebook Section 9.6), toggleable at will. While active, the physical model is replaced by a marker with a 60cm detection radius (Average tier). Movement while stealthed is capped at up to 2 AP spent per turn. No weapons are Stealth-tagged — firing any weapon forces a full reveal for the rest of that turn and the following enemy turn, automatically returning to Stealth Stance at the start of Pixy's own next turn.",
    "fx": {
     "stealth": 60,
     "moveCap": 2
    }
   },
   {
    "name": "Spray and Pray",
    "kind": "none",
    "fx": {
     "ap": 2
    },
    "cdText": "2 dmg · all 6",
    "popKind": "Weapon option · Bullpup MG",
    "text": "Uses the Bullpup MG, instead of its standard attack.\n\nFire in a 45° cone, 30cm long. Every unit in the cone — friend or foe — is a target: roll a d6 for each by its own distance (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm). No pooling or reassigning. Each target may Dodge or Block. A hit deals 2 damage to all 6 locations.\n\n2 AP · once per activation · Rulebook Section 8. Tap the AP to spend it."
   }
  ],
  "weapons": [
   {
    "name": "90mm Submachine Gun",
    "y": 68.2,
    "dmg": "4d6×1",
    "ap": "1",
    "range": "60cm",
    "limit": null,
    "text": "BURST FIRE (enhanced): roll 4d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 1 damage, all to one rolled hit location.\n\nNo Spray and Pray — submachine guns only use Burst Fire."
   },
   {
    "name": "Bullpup MG",
    "y": 73.7,
    "dmg": "3d6×1",
    "ap": "1",
    "range": "90cm",
    "limit": null,
    "text": "BURST FIRE: roll 3d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 1 damage, all to one rolled hit location. One Dodge/Block covers the whole burst.\n\nAlso fires SPRAY AND PRAY — see the Spray and Pray skill.",
    "spray": "ballistic"
   },
   {
    "name": "Throwable Beam Dagger",
    "y": 78.7,
    "dmg": "4",
    "ap": "1",
    "range": "30cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcan Guns",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 12,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 12,
  "short": "Gundam Pixy",
  "portrait": "gundam-pixy"
 },
 {
  "id": "msn-00100-hyaku-shiki",
  "name": "MSN-00100 Hyaku Shiki",
  "tier": "Super Flagship",
  "dp": 1400,
  "faction": "federation",
  "bg": "blue",
  "ap": 3,
  "move": "40cm",
  "dodges": 0,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Anti-Beam Coating",
    "kind": "counter",
    "text": "Passive. The famous gold ablative finish, and the roster's definitive example of the Anti-Beam Coating trait (Core Rulebook Section 4.2).\n\nIncoming beam damage is reduced by 1 (minimum 1), and the remainder drains an 8 HP coating pool covering all 360°. The coating is the outermost layer, so it absorbs beam hits before the Shield or Limb Health is touched. At 0 it has burned away for the rest of the game, taking the -1 with it — beams then strike the Shield or Limb Health at full value.\n\nNo effect at all against ballistic weapons, physical melee, or explosives, which bypass it entirely.",
    "max": 8,
    "tracks": "pool"
   },
   {
    "name": "IDE System",
    "kind": "none",
    "text": "Grants the Precision Optics trait: Called Shot penalty reduced from +5 to +2 (see Core Rulebook Section 3.2). Reflects the suit's dedicated precision-aiming sensor visor."
   },
   {
    "name": "Vulcans: Point Defense",
    "kind": "none",
    "text": "Standard per Core Rulebook Section 8 — free reaction to shoot down an incoming Homing Missile (12+ on d20). No AP cost.",
    "fx": {
     "ap": 0
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "ap: 1 (or 2 for Advantage)  "
   },
   {
    "name": "Clay Bazooka",
    "y": 78.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "Hyaku Shiki",
  "portrait": "hyaku-shiki"
 },
 {
  "id": "rx-80pr-pale-rider-mobile-suit-gundam-side-story-missing-link-crossover",
  "name": "RX-80PR Pale Rider (Mobile Suit Gundam Side Story: Missing Link crossover)",
  "tier": "Super Flagship",
  "dp": 1450,
  "faction": "federation",
  "bg": "blue",
  "ap": 2,
  "move": "20cm",
  "dodges": 0,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "HADES",
    "kind": "toggle",
    "text": "Player's choice, activatable at any time on the unit's own turn. While active, grants all three of the following simultaneously:\n• Weakened NT-D Buff: Free Dodges 0 → 3 (no AP bonus, unlike a standard NT-D System)\n• Dual Strike: rolls 2d20 instead of 1 in every Melee Clash exchange, using the same resolution as Nightingale's Hidden Arms — compare the opponent's roll against the higher die first; only check the lower die if the higher one loses\n• +3 to every ranged attack roll\n\nRisk check — roll a d20 the moment HADES is activated, and again at the start of every turn it remains active, to avoid 2 Chest damage. The threshold escalates with each check: 6+ (on activation) → 8+ (next turn) → 10+ → 12+ → +2 each turn after.\n\nDeactivation: entirely the player's choice, freely turned off at any time.",
    "fx": {
     "ap": 0,
     "dodgesSet": 3,
     "rangedPlus": 3,
     "tag": "DUAL STRIKE",
     "risk": {
      "die": "d20",
      "start": 6,
      "step": 2,
      "loc": "chest",
      "dmg": 2
     }
    }
   },
   {
    "name": "Spike Shield",
    "kind": "none",
    "text": "Passive, always active: whenever this unit successfully performs a Shield Bash (Core Rulebook Section 7.1 — cost now equal to the attacker's own equipped melee weapon's Critical damage value), the defender also takes **1 damage** from the mounted pile bunker's impact, on top of the normal Bash effect."
   },
   {
    "name": "Point Defense (Vulcans)",
    "kind": "none",
    "text": "Standard, per Core Rulebook Section 8 — free reaction, no AP, to shoot down an incoming Homing Missile (12+ on d20)."
   }
  ],
  "weapons": [
   {
    "name": "Hyper Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "180mm Cannon",
    "y": 73.7,
    "dmg": "4",
    "ap": "2",
    "range": "120cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Hyper Bazooka",
    "y": 78.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "Pale Rider",
  "portrait": "pale-rider"
 },
 {
  "id": "rx-78gp01fb-gundam-zephyranthes-full-burnern-mobile-suit-gundam-0083-stardust-memory",
  "name": "RX-78GP01Fb Gundam \"Zephyranthes\" Full Burnern (Mobile Suit Gundam 0083: Stardust Memory)",
  "tier": "Super Flagship",
  "dp": 1700,
  "faction": "federation",
  "bg": "blue",
  "ap": 3,
  "move": "30cm",
  "dodges": 3,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Overwhelming Mobility",
    "kind": "none",
    "text": "Passive: **+10cm Movement per AP** (30cm → 40cm), reflecting the Full Burnern's shoulder vernier pods, extended thruster nozzles, and reconfigured Core Fighter boost pods.",
    "fx": {
     "movePlus": 10
    }
   },
   {
    "name": "Enhanced Dodges",
    "kind": "none",
    "text": "Passive: **3 Free Dodges per turn** (up from the standard 2), reflecting the improved 180° turning time and overall evasive agility of the Full Burnern configuration."
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber x2",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1/2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "ap: 1 (single) / 2 (dual, Advantage)  "
   },
   {
    "name": "—",
    "y": 78.7,
    "dmg": "—",
    "ap": "—",
    "range": "—",
    "limit": null,
    "text": ""
   },
   {
    "name": "—",
    "y": 83.7,
    "dmg": "—",
    "ap": "—",
    "range": "—",
    "limit": null,
    "text": ""
   },
   {
    "name": "Head Vulcans",
    "y": 88,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "GP01Fb Zephyranthes",
  "portrait": "gp01fb"
 },
 {
  "id": "rx-9-c-narrative-gundam-c-packs",
  "name": "RX-9/C Narrative Gundam C-Packs",
  "tier": "Superweapon",
  "dp": 2200,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "NT-D System",
    "kind": "mode",
    "text": "3 charges per game, each lasting 3 turns while active: Free Dodges 2 → 4, +1 AP. On a natural 1 while active, the unit takes 2 Chest damage and the mode ends early. After it ends, a 3-turn cooldown applies before it can be activated again.\n\nIdentical to Banshee Norn's standard implementation. The Narrative was the psycho-frame test machine that preceded the RX-93 Nu Gundam, so it runs the baseline system rather than any enhanced variant.",
    "duration": 3,
    "charges": 3,
    "fx": {
     "dodgesSet": 4,
     "apPlus": 1
    }
   }
  ],
  "weapons": [
   {
    "name": "C-Equip Beam Rifle",
    "y": 68.2,
    "dmg": "6",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 14,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 14,
  "short": "Narrative C-Packs",
  "portrait": "narrative"
 },
 {
  "id": "f91-gundam-f91",
  "name": "F91 Gundam F91",
  "tier": "Superweapon",
  "dp": 2450,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 3,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Bio-Computer System",
    "kind": "none",
    "text": "Passive. Grants Precision Optics: Called Shot penalty reduced from +5 to +2, available to any pilot — the Bio-Computer relays targeting and tactical data directly regardless of who's at the controls. If piloted by a Newtype/Coordinator-rank Custom Pilot or higher, also grants +1 to all ranged and melee rolls on top of the Called Shot reduction — reflecting the system's true function as a \"reversed psycommu\" that reads and amplifies a Newtype's own reactions, something a Stock Pilot or lower-rank Custom Pilot can't access."
   },
   {
    "name": "Heat Venting Burst",
    "kind": "mode",
    "text": "3 charges per game. Grants +10cm Movement per AP for that turn (same bonus as Boost Stance), but unlike Boost Stance, she can still attack normally the same turn — representing a controlled, deliberate venting burst rather than a full committed sprint. Also grants -2 to Dodge target number from activation until the enemy's following turn ends (clears on the second End Turn) — the shed-armor afterimage effect genuinely confuses enemy targeting systems while active, not just a visual flourish. Stacks with her passive Agile (-2), meaning a turn with an active Heat Venting Burst charge puts her at -4 total to Dodge target number. Once a charge is spent, it's gone — flat game-long cap, no per-turn cooldown. Reflects F91's canon \"Flash Step\": armor ablating away to vent extreme heat, fast enough to leave an afterimage that throws off targeting systems.",
    "duration": 1,
    "charges": 3,
    "fx": {
     "movePlus": 10,
     "dodgeMod": -2
    }
   },
   {
    "name": "Agile (Dodge Bonus)",
    "kind": "none",
    "text": "Passive: **-2 to Dodge target number**, all range bands (e.g., 30-60cm drops from 15+ to 13+). Combined with her boosted 3 Free Dodges baseline (Base Stats above), this reflects F91's canon reputation for extreme speed and evasion without overselling it to the level of a dedicated evasion specialist like Sinanju.",
    "fx": {
     "dodgeMod": -2
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Ballistic MG",
    "y": 73.7,
    "dmg": "3d6×1",
    "ap": "1",
    "range": "90cm",
    "limit": null,
    "text": "BURST FIRE: roll 3d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 1 damage, all to one rolled hit location. One Dodge/Block covers the whole burst.\n\nNo Spray and Pray — this gun grants Point Defense instead (free reaction, no AP, 12+ on a d20 to shoot down an incoming Homing Missile)."
   },
   {
    "name": "VSBR (Low-Speed)",
    "y": 78.7,
    "dmg": "10",
    "ap": "2",
    "range": "90cm",
    "limit": {
     "kind": "cooldown",
     "turns": 1,
     "group": "vsbr"
    },
    "text": ""
   },
   {
    "name": "VSBR (High-Speed)",
    "y": 83.7,
    "dmg": "4",
    "ap": "2",
    "range": "60cm",
    "limit": {
     "kind": "cooldown",
     "turns": 1,
     "group": "vsbr"
    },
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 88,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   }
  ],
  "regen": 3,
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "Gundam F91",
  "portrait": "f91"
 },
 {
  "id": "nu-gundam-rx-93",
  "name": "Nu Gundam (RX-93)",
  "tier": "Superweapon",
  "dp": 2530,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Fin Funnels",
    "kind": "none",
    "text": "Standard Funnels rule (Section 8): up to 3 targets, 60cm, 2 damage each, 2 AP. **Requires a roll to hit per target**, Dodge/Block apply normally. **No charge limit** — usable every turn, unlike other units' rare Funnel-based ultimates, reflecting the Fin Funnels' built-in generators giving them genuinely longer operational duration than standard E-cap funnels.",
    "apText": "2 AP"
   },
   {
    "name": "Newtype Resonance",
    "kind": "none",
    "text": "Passive, unconditional: +1 to all rolls. Unlike Sazabi's Newtype-gated bonus, this works with any pilot — reflecting how deeply the psycoframe is integrated with Amuro specifically, one of the strongest Newtypes in the setting.",
    "fx": {
     "rollPlus": 1
    }
   },
   {
    "name": "Ultimate Defense Field",
    "kind": "counter",
    "text": "2 charges per game, split: 1 use reserved for himself, 1 use reserved for an ally — not a shared, freely-flexible pool. Reactive — declared after an enemy's attack is rolled/declared but before damage resolves, same timing window as a normal Block. When the self-charge is spent, Nu Gundam himself becomes completely immune to every attack for the remainder of that turn. When the ally-charge is spent, a single chosen ally within 90cm becomes completely immune to every attack for the remainder of that turn instead. Either way, the immunity covers everything — standard attacks, Funnels, and automatic/no-roll effects like Fatum-01 Ram Assault. Cost: whoever was protected cannot attack on their own next turn — only Move. If Nu Gundam protects an ally, he personally loses nothing except the charge itself; he only pays the attack-cost if he chooses to protect himself.",
    "max": 2,
    "tracks": "charges",
    "charges": 2
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Nu Beam Saber",
    "y": 73.7,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 20cm",
    "limit": null,
    "text": "",
    "meleeBonus": 4
   },
   {
    "name": "Hyper Bazooka",
    "y": 78.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Nu Gundam",
  "portrait": "nu-gundam"
 },
 {
  "id": "unicorn-gundam-02-banshee-norn-rx-0-n",
  "name": "Unicorn Gundam 02 Banshee Norn (RX-0[N])",
  "tier": "Superweapon",
  "dp": 2900,
  "faction": "federation",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "NT-D System (Standard)",
    "kind": "mode",
    "text": "3 charges per game, each lasting 3 turns while active: Free Dodges 2 → 4, +1 AP. On a natural 1 while active, the unit takes 2 Chest damage and the mode ends early. After it ends, a 3-turn cooldown applies before it can be activated again. (Standard version — less souped-up than Crystal Body's Luminous Crystal Form, which adds a flat roll bonus this version doesn't have.)",
    "duration": 3,
    "charges": 3,
    "fx": {
     "dodgesSet": 4,
     "apPlus": 1
    }
   },
   {
    "name": "Armed Armor XC (Mobility)",
    "kind": "none",
    "text": "Passive, always active while equipped: +10cm Movement per AP, reflecting its canon speed comparable to a Base Jabber.",
    "fx": {
     "movePlus": 10
    }
   },
   {
    "name": "Beam Magnum Absorption",
    "kind": "none",
    "text": "Passive, requires the Beam Magnum to be equipped. The first Critical Hit she takes in melee, per Clash, is automatically negated — the Beam Jutte, a short beam blade stored in the Revolving Launcher attachment, snaps out to catch the enemy's strike when there's no time to draw the main Beam Saber (or if it's been lost entirely). No lasting damage to the Magnum itself, and this works regardless of whether the weapon is currently on its 1-turn firing cooldown, since this is about the Jutte's catching function rather than the Magnum's firing capability. Once used in a given Clash, any subsequent Critical in that same Clash resolves normally — but disengaging and entering a fresh Clash (even against the same opponent) resets it."
   }
  ],
  "weapons": [
   {
    "name": "Beam Magnum",
    "y": 68.2,
    "dmg": "9/+2SH",
    "ap": "2",
    "range": "Unlimited",
    "limit": {
     "kind": "cooldown",
     "turns": 1
    },
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "AA-DE Mega Cannon",
    "y": 78.7,
    "dmg": "3",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Rev. Launcher (BOP/Bomb)",
    "y": 88,
    "dmg": "1/4",
    "ap": "2",
    "range": "60/40cm",
    "limit": null,
    "text": "\n\nAlso on this row — Revolving Launcher — Micro Hide Bomb: 4 dmg, 2 AP, 40cm."
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 18,
  "short": "Banshee Norn",
  "portrait": "banshee-norn"
 },
 {
  "id": "xi-gundam-gundam",
  "name": "Xi Gundam (Ξ Gundam)",
  "tier": "Myth",
  "dp": 3000,
  "faction": "spacenoid",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 9,
   "leftArm": 9,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Funnel Missiles",
    "kind": "none",
    "text": "Psycommu-guided missiles that track and explode on impact. Uses the Funnels Dice Pool system (Core Rulebook Section 8) — 3-die pool (3 targets max), 60cm, 2 damage each, 2 AP. Roll all 3d6 at once, assign eligible successes to targets by range band, stacking allowed. Unlike standard Funnels, once a die's hit is assigned to a target, that target cannot Dodge it (Free or rolled) — only Blockable, same as Snipers/Homing Missiles, reflecting their tracking, explosive nature.",
    "apText": "2 AP"
   },
   {
    "name": "Multi Missile Volley",
    "kind": "counter",
    "text": "The forearm and knee-mounted missile launchers fire in a concentrated barrage. 3 charges per game, 2 AP per use, single target only — no spreading across multiple targets, unlike Funnel Missiles, which makes this the focus-fire option instead of the spread option. Uses the Dice Pool system (Core Rulebook Section 8): roll a 6d6 pool against the target's range band. Each die that successfully hits deals 1 damage to all 6 of the target's locations simultaneously — a single connecting die alone deals 6 total damage spread across the whole body, with up to 6 dice potentially connecting per use. Same restriction as Funnel Missiles: the target gets no Dodge of any kind against this attack — only Block.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 2
    }
   },
   {
    "name": "Flight Form",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP to transform either direction. While transformed: immune to melee entirely, Movement doubles to 60cm per AP. Already priced into this unit's DP cost above.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   },
   {
    "name": "Minovsky Flight Sys.",
    "kind": "counter",
    "text": "Once per game. Usable as a free action, at any point in the game — including outside Xi Gundam's own turn, and even to instantly break out of an active Melee Clash. No AP cost, no roll. Xi Gundam repositions anywhere on the board instantly. Bypasses Grab entirely — even a successful Grab holding Xi Gundam in place cannot stop this, since it represents genuine instantaneous displacement rather than normal movement.",
    "fx": {
     "ap": 0
    },
    "max": 1,
    "tracks": "charges",
    "charges": 1
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield Beam Cannon",
    "y": 83.7,
    "dmg": "2",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 18,
  "short": "Xi Gundam",
  "portrait": "xi"
 },
 {
  "id": "rx-97-nh-gundam-night-hawk",
  "name": "RX-97-NH Gundam Night Hawk",
  "tier": "Myth",
  "dp": 3000,
  "faction": "federation",
  "bg": "blue360",
  "ap": 4,
  "move": "40cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 6,
   "leftArm": 6,
   "rightLeg": 6,
   "leftLeg": 6
  },
  "abilities": [
   {
    "name": "RAPTOR Pod 1",
    "kind": "pod",
    "pod": 0,
    "apText": "2 / Free",
    "text": "Remote Ambush Psycommu Tactical Ordnance Rack. Psycommu-controlled missile batteries that detach and position themselves independently across the battlespace, letting Night Hawk engage from the front while concealed pods saturate a target's flanks or rear. Pilots call them Funnel Pods.\n\nDeployment. Each pod may be detached and placed as its own marker anywhere within 120cm of Night Hawk, limited by movement. Deployed pods move freely under the player's control at the same rate as the real unit, and share Night Hawk's 45cm detection radius.\n\nHologram Projection. Every deployed pod projects a full hologram of Night Hawk, so its marker is indistinguishable from the real one. The controlling player writes down which marker is genuine on their unit sheet, hidden from the opponent — marker positions stay public, only the identity is concealed, so there is nothing to dispute.\n\nMissile Volley. Range 60cm from the pod's own position. Roll a 6d6 pool; each success deals 1 damage to all six of the target's locations simultaneously. Undodgeable — no Free Dodge and no rolled Dodge — and Block only, exactly as other tracking, explosive munitions (Section 8). Fired two ways:\n• Active Fire — Night Hawk spends AP to launch deliberately. The pod is revealed and its hologram collapses.\n• Ambush Reaction — if an enemy forces a reveal on a pod's marker, it fires as a free reaction, no AP. They walked into it.\n\nAfter firing, a revealed pod follows the same reveal cycle as Night Hawk itself: it is targetable for the rest of that turn and the whole of the following enemy turn, then returns to Night Hawk at the start of its next turn and may be redeployed. Each pod has 18 HP and can be destroyed outright while exposed — losing one costs Night Hawk half its firepower and one of its decoys permanently."
   },
   {
    "name": "RAPTOR Pod 2",
    "kind": "pod",
    "pod": 1,
    "apText": "2 / Free",
    "text": "Remote Ambush Psycommu Tactical Ordnance Rack. Psycommu-controlled missile batteries that detach and position themselves independently across the battlespace, letting Night Hawk engage from the front while concealed pods saturate a target's flanks or rear. Pilots call them Funnel Pods.\n\nDeployment. Each pod may be detached and placed as its own marker anywhere within 120cm of Night Hawk, limited by movement. Deployed pods move freely under the player's control at the same rate as the real unit, and share Night Hawk's 45cm detection radius.\n\nHologram Projection. Every deployed pod projects a full hologram of Night Hawk, so its marker is indistinguishable from the real one. The controlling player writes down which marker is genuine on their unit sheet, hidden from the opponent — marker positions stay public, only the identity is concealed, so there is nothing to dispute.\n\nMissile Volley. Range 60cm from the pod's own position. Roll a 6d6 pool; each success deals 1 damage to all six of the target's locations simultaneously. Undodgeable — no Free Dodge and no rolled Dodge — and Block only, exactly as other tracking, explosive munitions (Section 8). Fired two ways:\n• Active Fire — Night Hawk spends AP to launch deliberately. The pod is revealed and its hologram collapses.\n• Ambush Reaction — if an enemy forces a reveal on a pod's marker, it fires as a free reaction, no AP. They walked into it.\n\nAfter firing, a revealed pod follows the same reveal cycle as Night Hawk itself: it is targetable for the rest of that turn and the whole of the following enemy turn, then returns to Night Hawk at the start of its next turn and may be redeployed. Each pod has 18 HP and can be destroyed outright while exposed — losing one costs Night Hawk half its firepower and one of its decoys permanently."
   },
   {
    "name": "Low-Observability",
    "kind": "toggle",
    "text": "Grants Stealth Stance (Core Rulebook Section 9.6), toggleable at will. The physical model is replaced by a marker with a 45cm detection radius — Strong tier, a meaningful step beyond the Gundam Pixy's 60cm baseline that the technology was developed from. Movement while stealthed is capped at 2 AP per turn, as normal.\n\nThe Stalker Beam Rifle is Stealth-tagged and fires from the marker without revealing. Every other weapon forces a full reveal on use.",
    "fx": {
     "stealth": 45,
     "moveCap": 2
    },
    "apText": "Toggle"
   },
   {
    "name": "Anti-Beam Coating",
    "kind": "none",
    "apText": "Passive",
    "cdText": "8 HP · shield box",
    "text": "See Section 4.2. Incoming beam damage is reduced by **1** (minimum 1), and the remainder drains an **8 HP pool** covering all 360°, absorbed before Limb Health. At 0 the coating is burned away for the rest of the game. Ballistic weapons, physical melee and explosives bypass it entirely. It cannot Shield Bash, so Night Hawk uses **Limb Bash** (Section 7.1) for melee control."
   },
   {
    "name": "Ambush Protocol",
    "kind": "none",
    "text": "Night Hawk carries the Ambush Protocol specialization at Tier 1 as a chassis feature (Section 11). It fires once per reveal cycle — the moment the unit transitions from stealthed to revealed — granting one of two options:\n• Free counter-attack against whatever caused the reveal, or anyone else inside the detection radius. Standard attack, no bonus at this tier.\n• Melee Charge Surge — double the equipped melee weapon's Charge Range (Cold Fusion Sabers 15cm → 30cm) and immediately initiate a Melee Clash against the revealer, with +5 on the first exchange, or an automatic Critical if the reveal placement puts Night Hawk behind them.\n\nA pilot with the Stealth specialization may raise this to Tiers 2-4 normally.",
    "apText": "Free",
    "cdText": "Tier 1"
   }
  ],
  "weapons": [
   {
    "name": "Nightlance MPC",
    "y": 68.2,
    "dmg": "7",
    "ap": "2",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Stalker Rifle",
    "y": 73.7,
    "dmg": "5",
    "ap": "2",
    "range": "90cm [S]",
    "limit": null,
    "text": ""
   },
   {
    "name": "Cold Fusion Saber x2",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1-2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "draw: 1 AP (one) / 2 AP (both)  "
   },
   {
    "name": "RAPTOR Volley",
    "y": 83.7,
    "dmg": "6d6/1",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3,
    "label": "Anti-Beam Coating",
    "coverage": "360"
   }
  ],
  "short": "Night Hawk",
  "pods": {
   "count": 2,
   "hp": 18,
   "label": "RAPTOR Pod",
   "states": [
    "STOWED",
    "DEPLOYED",
    "REVEALED"
   ],
   "note": "Each pod is a separate marker projecting a hologram of Night Hawk. Revealed pods are targetable for the rest of that turn and the whole following enemy turn, then return and may be redeployed. 18 HP each; destroyed while exposed is permanent.",
   "slots": [
    {
     "row": 0
    },
    {
     "row": 1
    }
   ]
  },
  "shieldTotal": 8,
  "portrait": "night-hawk"
 },
 {
  "id": "gundam-astray-red-frame-flight-unit-mbf-p02",
  "name": "Gundam Astray Red Frame (Flight Unit) (MBF-P02)",
  "tier": "Flagship",
  "dp": 1200,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Flight Unit",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP to transform either direction. While transformed: immune to melee entirely, Movement doubles to 60cm per AP.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   },
   {
    "name": "Gerbera Throw",
    "kind": "none",
    "text": "Once per turn, may make a ranged attack instead of melee by throwing the Gerbera Straight — 30cm range, 4 damage, 1 AP. **Requires a roll to hit**, standard ranged attack roll based on range, and the target may Dodge or Block it normally."
   }
  ],
  "weapons": [
   {
    "name": "Gerbera Straight",
    "y": 68.2,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 3
   },
   {
    "name": "Beam Rifle",
    "y": 73.7,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "BuCUE Head",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 20cm",
    "limit": null,
    "text": "",
    "meleeBonus": 3
   }
  ],
  "shields": [
   {
    "hp": 12,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 12,
  "short": "Astray Red Frame",
  "portrait": "astray-red-frame"
 },
 {
  "id": "mbf-02-strike-rouge",
  "name": "MBF-02 Strike Rouge",
  "tier": "Flagship",
  "dp": 1300,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "40cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Phase Shift Armour",
    "kind": "counter",
    "text": "Passive. See Faction Armour Traits, Section 8 of the Core Rulebook.\n• Ballistic weapons and physical melee cannot touch Limb Health while PS is active — they drain the 16 HP Phase Shift pool instead.\n• Beam weapons ignore it entirely, dealing full damage straight to Limb Health with no power drain.\n• At 0 the armour shuts down permanently and the unit takes full damage from every source for the rest of the game — the classic Cosmic Era image of a Gundam losing its colour mid-battle.\n\nStrike Rouge is battery-powered, so it would normally carry the reduced 12-point pool rather than a nuclear unit's 24. Its power extender raises that to 16 — a genuine improvement over a standard first-generation suit, and the reason its armour phase-shifts red rather than the Strike's blue, but still well short of what a Hyper-Deuterion reactor sustains.",
    "max": 16,
    "tracks": "pool"
   }
  ],
  "weapons": [
   {
    "name": "57mm Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber x2",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1-2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "draw: 1 AP (one) / 2 AP (both)  "
   },
   {
    "name": "Armor Schneider x2",
    "y": 78.7,
    "dmg": "1/2",
    "ap": "1",
    "range": "Melee 10cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Igelstellung CIWS",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 12,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 12,
  "short": "Strike Rouge",
  "portrait": "strike-rouge"
 },
 {
  "id": "gundam-jiyan-altron",
  "name": "Gundam Jiyan Altron",
  "tier": "Super Flagship",
  "dp": 1700,
  "faction": "neutral",
  "bg": "blue",
  "ap": 3,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Twin Jiyan Fang",
    "kind": "none",
    "text": "Extendable dragon-fang-style arms. Functions per the Whip/Chain rule (Core Rulebook Section 8). Can initiate melee from 30cm away without closing full distance. Once per turn, instead of attacking, may spend 1 AP to attempt a pull on a target unit within 30cm — requires a roll to hit, standard melee attack roll using Jiyan Altron's own Melee Roll Bonus, and the target may attempt a Dodge in response. On a successful hit, the target is pulled 30cm toward Jiyan Altron; on a miss or a successful Dodge, nothing happens."
   },
   {
    "name": "Sokyoku Silk Road",
    "kind": "none",
    "text": "Once per game. Requires 2 prior successful hits (of any kind) landed by Jiyan Altron earlier in the game to \"charge\" — track on a simple counter. Once charged, may be declared as a full-turn action (costs all remaining AP, minimum 2): automatic hit against a Grunt-tier target; against a Hero-tier target, resolve as a single contested d20 roll. On a successful hit, deals 7 Chest damage directly, ignoring both Shield HP and Free Dodges entirely — nothing can prevent the damage from landing once the hit connects. Executed with the GN Claw Container (borrowed from Seravee Gundam Scheherazade) equipped in the right hand, enhancing the base Ryukorodo technique — reflecting its canon reputation as on par with EX Calibur, a genuinely top-tier finisher."
   }
  ],
  "weapons": [
   {
    "name": "Wolf-Ken/Tiger-Ken",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Dual Fang Blades",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 3
   }
  ],
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "Gundam Jiyan Altron",
  "portrait": "jiyan-altron"
 },
 {
  "id": "ac-nightfall-custom-armored-core-vi-crossover",
  "name": "AC Nightfall (Custom, Armored Core VI crossover)",
  "tier": "Superweapon",
  "dp": 2120,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Assault Armor",
    "kind": "counter",
    "text": "2 charges per game. Reactive — triggered in response to an incoming ranged attack (e.g., a unit walking into an enemy's Overwatch arc). Once triggered:\n• Negation persists for the rest of that turn — every incoming ranged attack (ballistic or beam) for the remainder of the turn is automatically negated, not just the one that triggered it.\n• AoE Shockwave fires once immediately on trigger: every unit within a 30cm radius (friend or foe, centered on self) takes 4 damage to all 6 locations — undodgeable, only Blockable, matching standard AoE treatment (same structure as Banshee Norn's Micro Hide Bomb).\n• Cost: the unit cannot attack for the rest of that same turn — the defensive posture consumes that turn's own offensive potential.\n\nRepresents Assault Armor's actual in-game function: a pulse explosion centered on the AC, canceling out incoming enemy fire while creating a damaging area-of-effect shockwave.",
    "max": 2,
    "tracks": "charges",
    "charges": 2
   }
  ],
  "weapons": [
   {
    "name": "Arquebus Beam Linear Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Pulse Blade",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 3
   },
   {
    "name": "Songbird Double Barrel Cannon",
    "y": 78.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   }
  ],
  "regen": 3,
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "AC Nightfall",
  "portrait": "ac-nightfall"
 },
 {
  "id": "asw-g-xx-gundam-vidar",
  "name": "ASW-G-XX Gundam Vidar",
  "tier": "Superweapon",
  "dp": 2250,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Nano-Laminate (24)",
    "kind": "counter",
    "text": "Passive, and the defining trait of every Post Disaster mobile suit that carries the coating. Nano-laminate disperses beam energy so effectively that it made beam weapons militarily obsolete in its era.\n• All beam weapons deal a flat 2 damage against a Nano-Laminate unit, regardless of their listed value. A Beam Magnum's 9, a Beam Sniper's 7, and a single funnel die's 2 are all reduced to 2.\n• This includes beam melee weapons. A Beam Saber, Beam Dagger, or Beam Axe/Tomahawk landing a Critical in a Melee Clash deals 2, not its listed 4 or 6.\n• Damage is absorbed by the 24 HP Nano-Laminate pool, which covers all 360° — there is no facing arc, since it is plating across the whole machine rather than a held shield.\n• Once the pool reaches 0 the coating has burned away, and beam weapons deal their full listed damage to Limb Health for the rest of the game.\n• Ballistic weapons and physical melee weapons ignore Nano-Laminate entirely. Rifles, Bazookas, Snipers, Vulcans, and physical blades — Sword, Heat Axe/Heat Hawk, Spear/Lance, GN Sword, Bare Hands — strike Limb Health directly and never touch the pool.\n\nThe correct counter is ballistic fire at range. Beam weapons of any kind, ranged or melee, are the wrong tool while the coating holds. Physical melee bypasses it completely, but closing to melee plays directly into Alaya-Vijnana Type E and Vidar's whole design — so an opponent capable of it is choosing between two bad options. Staying at distance and grinding the suit down with solid rounds avoids both problems, which is exactly how Post Disaster warfare works in the setting.",
    "max": 24,
    "tracks": "pool"
   },
   {
    "name": "Alaya-Vijnana Type E",
    "kind": "mode",
    "text": "3 charges per game, each lasting 3 turns. Free to activate, no AP cost.\n\nWhile active, and while Vidar is locked in a Melee Clash against exactly one opponent:\n• +3 to all Melee Clash exchange rolls, stacking on top of the equipped weapon's own Roll Bonus\n• +10cm Charge Range on all melee weapons\n\nThe bonus switches off the instant a third unit joins the Clash — an ally of Vidar's or a second enemy, it makes no difference — and returns if the fight becomes one-on-one again.\n\nGaelio has no Alaya-Vijnana implant, so Gjallarhorn built him a proxy: Type E runs on the preserved brain of Ein Dalton, the soldier who died protecting him. When engaged, the system takes over Gaelio's body and pilots the suit in his stead, with Gaelio retaining only target selection. It is as effective as the true Alaya-Vijnana, and its documented weakness is precise — most effective in one-on-one battle, with genuine difficulty tracking a battlefield melee.",
    "duration": 3,
    "charges": 3,
    "fx": {
     "ap": 0,
     "meleeRoll": 3,
     "chargeRange": 10
    }
   }
  ],
  "weapons": [
   {
    "name": "110mm Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Handgun x2",
    "y": 73.7,
    "dmg": "3",
    "ap": "1",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Burst Saber",
    "y": 78.7,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 4
   },
   {
    "name": "Hunter Edges",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "0",
    "range": "Melee 0cm",
    "limit": null,
    "text": "draw: 0 AP — always equipped  "
   }
  ],
  "shields": [],
  "short": "Gundam Vidar",
  "portrait": "vidar"
 },
 {
  "id": "gf13-001nhii-master-gundam",
  "name": "GF13-001NHII Master Gundam",
  "tier": "Superweapon",
  "dp": 2400,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Darkness Finger",
    "kind": "none",
    "text": "The telescopic forearm blade functions as a melee weapon with Reach (can initiate melee from 15cm away without closing full distance) and doubles as a Whip/Chain weapon (Core Rulebook Section 8). When Master Gundam wins a Melee Clash round using the Darkness Finger, it may choose to Entangle instead of dealing normal damage: the target is immobilized (cannot spend AP on movement) for 1 full turn."
   },
   {
    "name": "DG Cell Regeneration",
    "kind": "none",
    "text": "Passive. At the end of each of Master Gundam's turns, it regenerates 1 point of Health to a single damaged location of its choice — representing Master Asia's controlled use of the DG Cells for self-repair, deliberately restrained rather than full-body. Does not apply if the Chest was reduced to 0 that turn.",
    "eot": "DG Cell Regeneration: +1 HP to one damaged location of your choice"
   },
   {
    "name": "Sekiha Tenkyoken",
    "kind": "counter",
    "text": "Once per game. Requires 2 prior successful melee hits landed by Master Gundam earlier in the game to charge — track on a simple counter. Once charged, may be declared as a full-turn action (costs all remaining AP, minimum 2): automatic hit against a Grunt-tier target; against a Hero-tier target, resolve as a single contested d20 roll. On a successful hit, deals 7 Chest damage directly. Unlike Jiyan Altron's Sokyoku Silk Road, this is a projected energy technique rather than a physical grapple — a Free Dodge can still be spent to avoid it entirely.",
    "max": 1,
    "tracks": "charges",
    "fx": {
     "ap": "all",
     "apNote": "Full-turn action — costs all remaining AP, minimum 2"
    }
   }
  ],
  "weapons": [
   {
    "name": "Darkness Finger",
    "y": 68.2,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 3
   },
   {
    "name": "Master Cloth",
    "y": 73.7,
    "dmg": "1/2",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Master Gundam",
  "portrait": "master-gundam"
 },
 {
  "id": "infinite-justice-gundam-zgmf-x19a",
  "name": "Infinite Justice Gundam (ZGMF-X19A)",
  "tier": "Superweapon",
  "dp": 2500,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Fatum-01 Cannons",
    "kind": "none",
    "text": "The detachable support unit's twin rapid-fire beam cannons function as an always-available extra ranged option: 60cm range, 3 damage, 2 AP. **Requires a roll to hit**, standard ranged attack roll based on range, and the target may Dodge or Block it normally, same as any standard weapon."
   },
   {
    "name": "Fatum-01 Ram Assault",
    "kind": "none",
    "text": "Once per game: Fatum-01 detaches and rams a target within 30cm, dealing **8 damage to a random location automatically, no roll needed**. Infinite Justice may immediately follow up with a normal Beam Saber attack against the same target that same turn if in range."
   },
   {
    "name": "Phase Shift Armour",
    "kind": "counter",
    "text": "Passive. See Faction Armour Traits, Section 8 of the Core Rulebook.\n• Ballistic weapons and physical melee cannot touch Limb Health while PS is active — Rifles, Bazookas, Snipers, Vulcans, CIWS, Swords, Heat Axes, Spears, GN Swords and bare hands all drain the 24 HP Phase Shift power pool instead.\n• Beam weapons ignore it entirely, dealing full damage straight to Limb Health with no power drain at all.\n• At 0 the armour shuts down permanently and the unit takes full damage from every source for the rest of the game.\n\nThis unit is nuclear-powered (Hyper-Deuterion engine), granting the full 24-point pool — considerably longer operation than a first-generation battery suit's 12, though not unlimited.",
    "max": 24,
    "tracks": "pool"
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Dual Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "2",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Boomerang",
    "y": 78.7,
    "dmg": "2",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "CIWS",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Infinite Justice Gundam",
  "portrait": "infinite-justice"
 },
 {
  "id": "gn-001-gundam-exia-mobile-suit-gundam-00",
  "name": "GN-001 Gundam Exia (Mobile Suit Gundam 00)",
  "tier": "Superweapon",
  "dp": 2685,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Dual-Wield Matrix",
    "kind": "matrix",
    "text": "Exia can pair its melee weapons in three distinct ways. Drawing a pair costs 2 AP (1 per weapon, as in the Dual Beam Sabers rule, Section 7.1). The GN Sword cannot be paired with anything.\n\nParries. A parry is spent after an exchange has been resolved against Exia. It turns that result into a Block/Parry, so no damage is dealt. Parries refresh at the start of every 4-exchange segment, and unused parries do not carry over. If several enemies are in the Clash, the parries are shared across all of them.\n\n- GN Beam Dagger ×2 — Dagger Guard (defensive). One exchange die at +3 for 1/2 damage. 2 parries per segment, and each can cancel any hit: a Normal Hit or a Critical, including a natural 20 and whichever Critical option the opponent chose.\n- GN Long Blade + GN Short Blade — Blade & Parry (balanced). The Long Blade exchange is rolled with Advantage (2d20, take the higher) at +3 for 2/4 damage. 1 parry per segment, which works against Normal Hits only; Criticals cannot be parried.\n- GN Beam Saber ×2 — Twin Sabers (aggressive). Rolled with Advantage at +4 (up from the standard +3) for 2/4 damage. No parries.\n\nEach blade can still be drawn on its own at its listed stats, for 1 AP.",
    "options": [
     {
      "id": "dagger",
      "name": "Dagger Guard",
      "label": "DAGGERS",
      "parries": 2,
      "weapons": [
       "GN Beam Dagger x2"
      ],
      "desc": "GN Beam Dagger ×2 · +3, 1/2 · 2 parries per segment — any hit, Criticals included",
      "strip": "DAGGER GUARD · PARRIES STOP ANY HIT"
     },
     {
      "id": "blade",
      "name": "Blade & Parry",
      "label": "BLADES",
      "parries": 1,
      "weapons": [
       "GN Long Blade",
       "GN Short Blade"
      ],
      "desc": "GN Long Blade + GN Short Blade · Long Blade with Advantage, +3, 2/4 · 1 parry per segment — Normal Hits only",
      "strip": "BLADE & PARRY · LONG BLADE ADVANTAGE +3 · PARRY NORMAL HITS"
     },
     {
      "id": "saber",
      "name": "Twin Sabers",
      "label": "SABERS",
      "parries": 0,
      "weapons": [
       "GN Beam Saber x2"
      ],
      "tag": "ADV +4",
      "desc": "GN Beam Saber ×2 · Advantage at +4, 2/4 · no parries",
      "strip": "TWIN SABERS · ADVANTAGE +4"
     }
    ],
    "fx": {
     "ap": 2
    }
   },
   {
    "name": "Trans-Am",
    "kind": "mode",
    "text": "3 charges per game. Player's choice, activatable on the unit's own turn.\n\nActive phase (2 turns): +5 to every roll (melee and ranged alike), +15cm Movement per AP.\n\nAuto-cancel: if the unit takes a hit from any attack while Trans-Am is active, the mode shuts off immediately, even mid-window. Tap ACTIVE to switch it off when that happens.\n\nBurnout phase (1 turn, triggered by either natural expiration or auto-cancel): -5 to every roll. Movement returns to normal immediately — only rolls are penalised.",
    "duration": 2,
    "charges": 3,
    "fx": {
     "ap": 0,
     "rollPlus": 5,
     "movePlus": 15,
     "burnout": {
      "turns": 1,
      "rollPlus": -5
     }
    }
   },
   {
    "name": "Vulcans: Point Defense",
    "kind": "none",
    "text": "Standard, per Core Rulebook Section 8 — free reaction, no AP, to shoot down an incoming Homing Missile (12+ on d20). *From the head-mounted GN Vulcan ×2.*"
   }
  ],
  "weapons": [
   {
    "name": "GN Sword",
    "y": 68.2,
    "dmg": "5·3/6",
    "ap": "2",
    "range": "90cm / 30cm",
    "limit": null,
    "text": "Two modes on one weapon (Rifle · Sword):\n• Rifle Mode — 90cm, 5 damage, 2 AP — standard Beam Rifle stats.\n• Sword Mode — Melee 3/6, 2 AP, +4 Melee Roll Bonus, 30cm Charge Range.\n1 AP to switch modes. Cannot be paired with any other weapon."
   },
   {
    "name": "GN Long Blade",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "+3 Melee Roll Bonus, 15cm Charge Range."
   },
   {
    "name": "GN Short Blade",
    "y": 78.7,
    "dmg": "1/2",
    "ap": "1",
    "range": "Melee 10cm",
    "limit": null,
    "text": "+1 Melee Roll Bonus, 10cm Charge Range."
   },
   {
    "name": "GN Beam Saber x2",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "1-2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "+3 Melee Roll Bonus, 15cm Charge Range. 1 AP for one, 2 AP for the pair. +4 when drawn as a pair — see Twin Sabers (Dual-Wield Matrix)."
   },
   {
    "name": "GN Beam Dagger x2",
    "y": 88.3,
    "dmg": "1/2",
    "ap": "1-2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "+3 Melee Roll Bonus, 15cm Charge Range. Short beam blades stored in the hips. 1 AP for one, 2 AP for the pair — see Dagger Guard (Dual-Wield Matrix)."
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Gundam Exia",
  "portrait": "exia"
 },
 {
  "id": "rising-freedom-gundam-stts-909",
  "name": "Rising Freedom Gundam (STTS-909)",
  "tier": "Superweapon",
  "dp": 2700,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "HiMAT Full Burst",
    "kind": "counter",
    "text": "3 charges per game: every ranged weapon this unit has may be fired that turn regardless of normal AP costs. Each weapon still resolves as a fully normal attack — its own standard attack roll, range bands, and Dodge/Block reactions all apply exactly as usual; the ability only bypasses the AP cost, not the resolution itself. Same concept as Strike Freedom's Full Burst, built from Rail Cannons + Agni Cannon + Beam Rifles instead of DRAGOONs — no DRAGOON/Funnels-equivalent ability at all, deliberately traded away for full ground/space versatility with no restrictions anywhere in this kit.",
    "max": 3,
    "tracks": "charges",
    "charges": 3
   },
   {
    "name": "MA Mode",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP to transform either direction. While transformed: immune to melee entirely, Movement doubles to 60cm per AP.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   },
   {
    "name": "Phase Shift Armour",
    "kind": "counter",
    "text": "Passive. See Faction Armour Traits, Section 8 of the Core Rulebook.\n• Ballistic weapons and physical melee cannot touch Limb Health while PS is active — Rifles, Bazookas, Snipers, Vulcans, CIWS, Swords, Heat Axes, Spears, GN Swords and bare hands all drain the 24 HP Phase Shift power pool instead.\n• Beam weapons ignore it entirely, dealing full damage straight to Limb Health with no power drain at all.\n• At 0 the armour shuts down permanently and the unit takes full damage from every source for the rest of the game.\n\nThis unit is nuclear-powered (Hyper-Deuterion engine), granting the full 24-point pool — considerably longer operation than a first-generation battery suit's 12, though not unlimited.",
    "max": 24,
    "tracks": "pool"
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Dual Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "2",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield Boomerang",
    "y": 78.7,
    "dmg": "3/2/4",
    "ap": "2/1",
    "range": "30cm/Melee",
    "limit": null,
    "text": "damage: 3 (ranged) or 2/4 (melee) · range: 30cm (ranged) / Melee  "
   },
   {
    "name": "Rail Cannons",
    "y": 83.7,
    "dmg": "3",
    "ap": "1",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Agni Cannon",
    "y": 88,
    "dmg": "6",
    "ap": "2",
    "range": "Unlimited",
    "limit": null,
    "text": "\n\nAlso on this row — CIWS: 1 dmg, 1 AP, 20cm only."
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Rising Freedom Gundam",
  "portrait": "rising-freedom"
 },
 {
  "id": "strike-freedom-gundam-zgmf-x20a",
  "name": "Strike Freedom Gundam (ZGMF-X20A)",
  "tier": "Superweapon",
  "dp": 2800,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Super DRAGOON System",
    "kind": "none",
    "text": "Uses the **Funnels Dice Pool system** (Core Rulebook Section 8) — 4-die pool (4 targets max), 2 damage each, 2 AP. Roll all 4d6 at once, assign eligible successes to targets by range band, stacking allowed. **Cannot be used in ground/atmosphere battles — space and colony-interior only.** This is a technical limitation of the remote-control signal, not a political or legal restriction.",
    "apText": "2 AP"
   },
   {
    "name": "Full Burst Mode",
    "kind": "counter",
    "text": "**3 charges per game:** every ranged weapon this unit has may be fired that turn regardless of normal AP costs — a true \"everything at once\" alpha strike. **Each weapon still resolves as a fully normal attack**, using its normal stats — its own standard attack roll, range bands, and Dodge/Block reactions all apply exactly as usual; the ability only bypasses the AP cost, not the resolution itself.",
    "max": 3,
    "tracks": "charges",
    "charges": 3
   },
   {
    "name": "Phase Shift Armour",
    "kind": "counter",
    "text": "Passive. See Faction Armour Traits, Section 8 of the Core Rulebook.\n• Ballistic weapons and physical melee cannot touch Limb Health while PS is active — Rifles, Bazookas, Snipers, Vulcans, CIWS, Swords, Heat Axes, Spears, GN Swords and bare hands all drain the 24 HP Phase Shift power pool instead.\n• Beam weapons ignore it entirely, dealing full damage straight to Limb Health with no power drain at all.\n• At 0 the armour shuts down permanently and the unit takes full damage from every source for the rest of the game.\n\nThis unit is nuclear-powered (Hyper-Deuterion engine), granting the full 24-point pool — considerably longer operation than a first-generation battery suit's 12, though not unlimited.",
    "max": 24,
    "tracks": "pool"
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Multi-Phase Cannon",
    "y": 73.7,
    "dmg": "4",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Railguns",
    "y": 78.7,
    "dmg": "3",
    "ap": "1",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "CIWS",
    "y": 88,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "regen": 3,
  "shields": [
   {
    "hp": 14,
    "x": 80.4,
    "y": 69.8
   },
   {
    "hp": 14,
    "x": 94.5,
    "y": 69.8
   }
  ],
  "shieldTotal": 28,
  "short": "Strike Freedom Gundam",
  "portrait": "strike-freedom"
 },
 {
  "id": "unicorn-gundam-luminous-crystal-body",
  "name": "Unicorn Gundam [Luminous Crystal Body]",
  "tier": "Myth",
  "dp": 3000,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 4,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 9,
   "leftArm": 9,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Luminous Crystal Form",
    "kind": "mode",
    "text": "Free action to activate at the start of any turn. 3 charges per game, usable at any point, not required to be consecutive.\n\nEach charge, while active (3 turns):\n• Free Dodges: 4 → 6\n• +1 AP\n• +2 to all dice rolls\n• I-Field Force Field active: 18 HP, 180° coverage — functions exactly like a normal shield (ranged Block, melee Shield Block, Shield Bash all available per Core Rulebook Section 4.2 and 7.1) for the duration of the charge. Does not carry over or refresh between charges — each new activation grants a fresh 18 HP field, and whatever remained from a previous charge does not persist.\n• Instability risk: at the end of each active turn, roll a d20 — on a natural 1, take 2 Chest damage and the form ends early immediately.\n\nAfter the form ends (naturally or from instability failure): 3-turn cooldown before it can be reactivated. During cooldown, Crystal Body sits at base stats — 4 Free Dodges, no shield or I-Field at all, no safety net.",
    "duration": 3,
    "charges": 3,
    "fx": {
     "ap": 0,
     "apPlus": 1,
     "rollPlus": 2,
     "dodgesSet": 6,
     "grantsShield": {
      "hp": 18,
      "coverage": "180",
      "refreshOnActivate": true
     }
    },
    "eot": "Luminous Crystal Form instability: roll a d20 — natural 1 = 2 Chest damage and the form ends",
    "eotWhen": "active"
   },
   {
    "name": "Temporal Anchor",
    "kind": "counter",
    "text": "Once per game. At the start of any round, record current Limb Health (all five locations) + position. Anchor lasts 3 rounds. Rewind (free action, anytime before expiry): reset all Limb Health values and position to the recorded values — no damage effect. Immediately after Rewind resolves, roll a d20 — on a 1-2, take 2 Chest damage from the strain.",
    "fx": {
     "ap": 0
    },
    "max": 1,
    "tracks": "charges",
    "charges": 1
   },
   {
    "name": "System Override",
    "kind": "none",
    "text": "Usable every turn, no cap on target tier. AP cost is whatever the stolen weapon normally costs (e.g., 2 AP if hijacking a unit's Beam Rifle, 1 AP if hijacking a Bazooka or Vulcans) — not a flat cost of its own. Declare one enemy unit within 120cm and in LOS — takeover is automatic, no roll to initiate. Make one attack using the target's own weapon (its range/damage/AP values), rolling to-hit with Crystal Body's own pilot/dice bonuses (including active Luminous Crystal Form bonus, if up). Target of the attack is controller's choice, including the hijacked unit's own allies. Control reverts after the single attack resolves."
   }
  ],
  "weapons": [
   {
    "name": "Beam Saber",
    "y": 68.2,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "damage: 2/4 (Normal/Critical)  "
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3,
    "when": "Luminous Crystal Form"
   }
  ],
  "shieldTotal": 18,
  "short": "Luminous Crystal Body",
  "portrait": "luminous-crystal-body"
 },
 {
  "id": "unicorn-gundam-03-phenex-rx-0-n",
  "name": "Unicorn Gundam 03 Phenex (RX-0[N])",
  "tier": "Myth",
  "dp": 3000,
  "faction": "neutral",
  "bg": "phenex",
  "ap": 4,
  "move": "30cm",
  "dodges": 4,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Permanent NT-D",
    "kind": "none",
    "text": "Always active — no charges, no cooldown, cannot be turned off. This is baked into her Base Stats above (4 Free Dodges, and the +2 roll bonus noted there) rather than being a separate activatable Skill, since it's never \"off\" to begin with. Reflects Rita Bernal's total resonance with the psychoframe — the pilot-machine boundary effectively no longer exists, so the suit stays in a permanent heightened state rather than cycling through activation windows like other Unicorn-lineage units.\n\n+2 to all ranged and melee rolls, always in effect."
   },
   {
    "name": "Armed Armor DE (Send/Recall)",
    "kind": "none",
    "text": "Each Armed Armor DE can independently be sent to protect an ally or recalled, on top of always remaining available for Weapon Mode (see Weapons table above).\n• Send to Ally: 1 AP. Target ally must be within 90cm of the Phenex at the time. That DE becomes a Standard Shield (18 HP, Myth tier) for the chosen ally, lasting indefinitely — no duration limit, stays until recalled.\n• Recall: 1 AP, anytime, any distance. Returns the DE to the Phenex.\n• Both DEs can be sent to two different allies simultaneously (2 AP total), each independently recallable on its own schedule.\n• Real cost: the Phenex's own shield coverage depends on having at least one DE \"home.\" If both are sent away at the same time, the Phenex herself has zero shield until at least one is recalled."
   },
   {
    "name": "Wings of Light",
    "kind": "counter",
    "text": "1 charge per game. Reactive — declared after an enemy's ranged attack is rolled/declared but before damage resolves, same timing window as a normal Block. Every allied unit within 60cm of the Phenex at that moment becomes completely immune to that specific attack — the whole thing is negated, regardless of how many targets it would have hit or how much damage it would have dealt. Does not work against melee — Melee Clash damage still resolves normally. Represents the Phenex generating enormous wings of light, matching the scale of its canon moment neutralizing a critical Helium-3 explosion that threatened to destroy everyone nearby.",
    "max": 1,
    "tracks": "charges",
    "charges": 1
   }
  ],
  "weapons": [
   {
    "name": "Armed Armor DE (Weapon)",
    "y": 68.2,
    "dmg": "6 ea",
    "ap": "2",
    "range": "Unlimited",
    "limit": null,
    "text": "ap: 2 (total)  "
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "damage: 2/4 (Normal/Critical)  "
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.91,
    "y": 66.32
   },
   {
    "hp": 18,
    "x": 80.97,
    "y": 80.97
   }
  ],
  "short": "Phenex",
  "shieldTotal": 36,
  "lendable": {
   "count": 2,
   "hp": 18,
   "label": "Armed Armor DE",
   "range": "90cm",
   "ap": 1
  },
  "ring": {
   "cx": 87.36,
   "cy": 73.6,
   "rIn": 3.78,
   "rOut": 4.58,
   "segments": 2
  },
  "portrait": "phenex"
 },
 {
  "id": "oz-13ms-gundam-epyon",
  "name": "OZ-13MS Gundam Epyon",
  "tier": "Myth",
  "dp": 3000,
  "faction": "neutral",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 9,
   "leftArm": 9,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Full Output",
    "kind": "toggle",
    "text": "Unlimited use. Costs 1 AP to switch in either direction. Epyon begins every game in standard mode; going to Full Output is a deliberate act, not a reflex, which is why it costs an action.\n\nIn Full Output:\n• Beam Sword rises from 3/6 to 5 / 10\n• Charge Range extends from 20cm to 30cm\n• Guillotine becomes available (below)\n• Sanity Collapse risk rises sharply — see Ability 4\n\nA 10-damage Critical destroys any Head outright and kills any Chest up to Super Flagship tier in a single exchange. Note that switching costs 1 AP, so a turn spent entering Full Output leaves only 3 AP — not enough for a Guillotine, which means the sweep can only be used from a turn that began in Full Output already.",
    "fx": {
     "ap": 1,
     "meleeDmg": "5 / 10",
     "chargeRange": 10,
     "unlocks": "Guillotine"
    }
   },
   {
    "name": "Guillotine",
    "kind": "counter",
    "text": "3 charges per game, 4 AP each. Epyon extends the blade to maximum and carves a single enormous arc through everything in front of it.\n• Area: a box 30cm wide by 60cm long, projected forward from Epyon\n• Damage: 12 to all six locations on every unit caught inside\n• No attack roll — it automatically connects with everything in the box\n• Block only. No Free Dodge and no Rolled Dodge; nothing evades a sweep that wide\n• Hits friend and foe alike\n• No self-damage, unlike Wing Zero's Combined Beam — the trade is reach. Wing Zero can level a line across the entire board and hurts itself doing it; Epyon has to be standing right there",
    "max": 3,
    "tracks": "charges",
    "fx": {
     "ap": 4
    },
    "requires": "Full Output",
    "charges": 3
   },
   {
    "name": "Epyon System",
    "kind": "counter",
    "text": "A modified ZERO System built from data Treize gathered on the Gundams. Unlike Wing Zero's version, which can read and counter an opponent, the Epyon System only ever drives its own pilot forward. **6 charges per game, free action.** Reroll **one of Epyon's own d20 rolls** — attack, Dodge, Block, or Melee Clash exchange — and take the new result. **It cannot reroll an opponent's dice.**",
    "max": 6,
    "tracks": "charges",
    "charges": 6,
    "fx": {
     "ap": 0
    }
   },
   {
    "name": "Sanity Collapse",
    "kind": "none",
    "text": "The system floods the pilot with more battlefield data than a human can process, and the first thing to go is the ability to tell friend from enemy. Heero, unable to master it, went on a killing spree and destroyed even retreating suits.\n\nTrigger: Epyon rolls a natural 1 in standard mode, or a natural 1-10 while in Full Output, on any Melee Clash exchange die.\n\nEffect: for the remainder of that Melee Clash, Epyon's exchange die is compared against every unit in the Clash — enemies and allies alike. Each comparison resolves completely normally and independently, so a single roll might Critical the enemy, land a Normal Hit on one ally, and lose outright to another.\n• Allies may Shield Block as they would against any melee hit\n• Allies never deal damage back to Epyon — they are defending themselves, not fighting it\n• Enemies are still hit normally. Epyon has not switched sides; it has stopped distinguishing anyone\n• Fighting alone, nothing happens — a berserk duellist with no allies present is simply a duellist\n\nThis is the mechanical expression of Treize's philosophy. Epyon is built for honourable single combat, and it punishes anyone who tries to gang up alongside it. The interaction with the Epyon System is deliberate: the rerolls double as a leash, and a pilot can spend charges specifically to reroll away an incoming Sanity Collapse trigger — though a reroll landing in the same range triggers it anyway and wastes the charge."
   },
   {
    "name": "Mobile Armour",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP either direction. While transformed into the dragon-like Mobile Armour: **immune to melee entirely, Movement doubles to 60cm per AP.** Worth noting the irony — transforming makes a melee-only machine unable to fight at all. It is purely a repositioning tool, used to cross ground fast and drop back into Mobile Suit mode in reach of something.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Sword (std)",
    "y": 68.2,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 20cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Sword (FULL)",
    "y": 73.7,
    "dmg": "5/10",
    "ap": "—",
    "range": "Melee 30cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Heat Rod (pull)",
    "y": 78.7,
    "dmg": "—",
    "ap": "1",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 18,
  "short": "Gundam Epyon",
  "portrait": "epyon"
 },
 {
  "id": "wing-zero-xxxg-00w0",
  "name": "Wing Zero (XXXG-00W0)",
  "tier": "Myth",
  "dp": 3000,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 9,
   "leftArm": 9,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Zero System",
    "kind": "counter",
    "text": "3 charges per game, free action: reroll any one d20 roll (yours or an opponent's — representing the system foreseeing and countering their action) and take the new result.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 0
    }
   },
   {
    "name": "TBR Combined Beam",
    "kind": "counter",
    "text": "Unlimited range · 4 AP · 14 damage to all 6 locations.\n\n3 charges/game. No attack roll needed — automatically connects with everyone caught in the 30cm-wide line, Dodge/Block per target are still the only way to stop it. Deals 14 damage to all 6 locations simultaneously on anyone it connects with. Heavy Arms — if Blocked, costs the shield 14 HP (its own damage value). Requires both arms intact — losing either permanently disables this mode. Structural Overload: the rifle's own output is too great for Wing Zero's frame to bear — every use deals 4 damage to all 6 of Wing Zero's own locations, cumulative across each use that game (canon-accurate to Endless Waltz, where firing the Combined Beam repeatedly caused Wing Zero's own arm to fail and ultimately destroyed the unit from the inside). By the 3rd use in a single game, this self-inflicted damage alone (12 cumulative) exceeds every limb's HP (9) and approaches Chest's own HP (12).",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 4,
     "selfAll": 4
    }
   },
   {
    "name": "Neo-Bird Mode (Transformation)",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP to transform either direction. While transformed: immune to melee entirely, Movement doubles to 60cm per AP.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   },
   {
    "name": "Agile (Dodge Bonus)",
    "kind": "none",
    "text": "Passive: **-2 to Dodge target number**, all range bands (e.g., 30-60cm drops from 15+ to 13+). Reflects the Gundam Wing lineage's reputation for extreme thruster-driven evasion — a smaller bonus than Sinanju's since the Zero System already covers some of this niche through its reroll mechanic.",
    "fx": {
     "dodgeMod": -2
    }
   }
  ],
  "weapons": [
   {
    "name": "TBR Dual Attack",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Machine Cannons",
    "y": 78.7,
    "dmg": "2",
    "ap": "1",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Wing Vulcan",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 18,
  "short": "Wing Zero",
  "portrait": "wing-zero"
 },
 {
  "id": "wing-zero-custom-xxxg-00w0",
  "name": "Wing Zero Custom (XXXG-00W0)",
  "tier": "Myth",
  "dp": 3000,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 9,
   "leftArm": 9,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Zero System",
    "kind": "counter",
    "text": "3 charges per game, free action: reroll any one d20 roll (yours or an opponent's — representing the system foreseeing and countering their action) and take the new result.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 0
    }
   },
   {
    "name": "TBR Combined Beam",
    "kind": "counter",
    "text": "Unlimited range · 4 AP · 14 damage to all 6 locations.\n\n3 charges/game. No attack roll needed — automatically connects with everyone caught in the 30cm-wide line, Dodge/Block per target are still the only way to stop it. Deals 14 damage to all 6 locations simultaneously on anyone it connects with. Heavy Arms — if Blocked, costs the shield 14 HP (its own damage value). Requires both arms intact — losing either permanently disables this mode. Structural Overload: the rifle's own output is too great for Wing Zero Custom's frame to bear — every use deals 4 damage to all 6 of Wing Zero Custom's own locations, cumulative across each use that game (canon-accurate to Endless Waltz, where firing the Combined Beam repeatedly caused Wing Zero Custom's own arm to fail and ultimately destroyed the unit from the inside). By the 3rd use in a single game, this self-inflicted damage alone (12 cumulative) exceeds every limb's HP (9) and approaches Chest's own HP (12).",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 4,
     "selfAll": 4
    }
   },
   {
    "name": "Neo-Bird Mode (Transformation)",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP to transform either direction. While transformed: immune to melee entirely, Movement doubles to 60cm per AP.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   },
   {
    "name": "Agile (Dodge Bonus)",
    "kind": "none",
    "text": "Passive: **-2 to Dodge target number**, all range bands (e.g., 30-60cm drops from 15+ to 13+). Reflects the Gundam Wing lineage's reputation for extreme thruster-driven evasion — a smaller bonus than Sinanju's since the Zero System already covers some of this niche through its reroll mechanic.",
    "fx": {
     "dodgeMod": -2
    }
   }
  ],
  "weapons": [
   {
    "name": "TBR Dual Attack",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Machine Cannons",
    "y": 78.7,
    "dmg": "2",
    "ap": "1",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Wing Vulcan",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 18,
  "short": "Wing Zero Custom",
  "portrait": "wing-zero-custom"
 },
 {
  "id": "zgmf-x42s-destiny-gundam",
  "name": "ZGMF-X42S Destiny Gundam",
  "tier": "Myth",
  "dp": 3100,
  "faction": "neutral",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 16,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Phase Shift Armour",
    "kind": "counter",
    "text": "Passive. See Faction Armour Traits, Section 8 of the Core Rulebook.\n• Ballistic weapons and physical melee cannot touch Limb Health while PS is active — they drain the 24 HP Phase Shift power pool instead.\n• Beam weapons ignore it entirely, dealing full damage straight to Limb Health with no power drain.\n• At 0 the armour shuts down permanently and the unit takes full damage from every source for the rest of the game.\n\nNuclear-powered via its Hyper-Deuterion engine, granting the full 24-point pool.",
    "max": 24,
    "tracks": "pool"
   },
   {
    "name": "Wings of Light",
    "kind": "mode",
    "text": "3 charges per game, each lasting one turn. Free to activate, no AP cost.\n\nThe Voiture Lumiere thruster unfolds into the Wings of Light, and the Mirage Colloid system spreads particles in its wake — at those speeds the trail resolves into visible afterimages that confuse sensors, targeting systems and the naked eye alike. The two only function together; there are no afterimages without the speed that produces them.\n\nWhile active:\n• +20cm Movement per AP — 30cm becomes 50cm per AP, or 200cm across a full turn\n• -4 to Dodge target numbers — 90% dodge at long range, dropping to 35% under 30cm\n• +1 Free Dodge — 3 for that turn, as an attack strikes an afterimage instead\n• Attacks normally, unlike Boost Stance\n\nVoiture Lumiere Charge. While Wings of Light is active, initiating a Melee Clash deals 4 damage to the target immediately, before the first exchange is rolled — Destiny arrives at full thruster speed and rams before the blades meet.\n• Blockable — absorbed into Shield HP as normal if the shield is up and in arc\n• Not Dodgeable — no Free Dodge, no Rolled Dodge. Nothing sidesteps something closing at 50cm per AP\n• If the target has no shield, or its shield is already destroyed, the 4 damage goes straight to the Chest\n• Once per Clash — disengaging and re-initiating in the same turn does not trigger it again\n• This is a beam effect (Voiture Lumiere is a light-based drive), so against Nano-Laminate Armour it is reduced to a flat 2 and drains the coating rather than reaching the Chest\n\nThe defensive numbers deliberately fall off at close range. Canon is explicit that this manoeuvre worked devastatingly against large, slow targets but poorly against units of comparable mobility — an opponent fast enough to stay inside 30cm is exactly the one the afterimages struggle to shake.",
    "duration": 1,
    "charges": 3,
    "fx": {
     "ap": 0,
     "dodgesPlus": 1,
     "movePlus": 20,
     "dodgeMod": -4,
     "meleeCharge": 4
    }
   }
  ],
  "weapons": [
   {
    "name": "MA-BAR73/S Rifle",
    "y": 68.2,
    "dmg": "6",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "M2000GX Cannon",
    "y": 73.7,
    "dmg": "7",
    "ap": "2",
    "range": "Sniper",
    "limit": null,
    "text": ""
   },
   {
    "name": "Flash-Edge x2 (thr)",
    "y": 78.7,
    "dmg": "3",
    "ap": "1 ea",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Arondight (melee)",
    "y": 83.7,
    "dmg": "4/8",
    "ap": "2",
    "range": "Melee 30cm",
    "limit": null,
    "text": "damage: **4 / 8**  "
   },
   {
    "name": "Palma Fiocina (melee)",
    "y": 88.3,
    "dmg": "2/4",
    "ap": "0",
    "range": "Melee 0cm",
    "limit": null,
    "text": "draw: 0 AP — always equipped · charge: **0cm**  \n\nAlso on this row — Flash-Edge 2 (blade mode): 2 / 4 dmg, +1 melee roll, 0 AP equip, 10cm charge."
   }
  ],
  "regen": 3,
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "Destiny Gundam",
  "portrait": "destiny"
 },
 {
  "id": "zgmf-x666s-legend-gundam",
  "name": "ZGMF-X666S Legend Gundam",
  "tier": "Myth",
  "dp": 3200,
  "faction": "neutral",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "DRAGOON System",
    "kind": "none",
    "text": "Legend carries ten pods in two distinct classes, fired as separate Dice Pool attacks (Section 8). Each pool is its own action with its own AP cost.\n\n| Pool | Pods | Dice | Damage | Range | AP |\n|---|---|---|---|---|---|\n| GDU-X5 Mobile Beam Assault Cannon | 8 small | 8d6 | 1 per success | 60cm | 2 |\n| GDU-X7 Mobile Beam Assault Cannon | 2 large | 2d6 | 5 per success | 30cm | 2 |\n\nGDU-X5 — eight small pods, two beam guns each, mounted six on the backpack and two on the side skirt armour. With eight dice this is Legend's spread weapon: it can engage up to eight separate targets in a single action, or stack dice to grind down a shield.\n\nGDU-X7 — two large pods with five beam guns and four beam spikes each. The spikes penetrate Positron Reflectors, the Earth Alliance's premier defensive technology, so in game terms a GDU-X7 hit cannot be Shield Blocked at all. It remains fully dodgeable — Free Dodges and Rolled Dodges work normally — and stacking both dice on one target still grants that target only a single Dodge reaction for the whole stack. The 30cm range is the trade: the pods must close and ram to drive the spikes home, which means Legend has to enter melee initiation range to use its best weapon.\n\nEarth capability. Unlike every other DRAGOON-equipped machine, Legend never loses this system under gravity. The pods cannot detach and manoeuvre in atmosphere, but the backpack pivots to horizontal, the skirt armour moves, and each GDU-X5 sits on a rotatable mount — so all ten pods still fire from the hull in various directions. Legend simply becomes a mobile artillery platform rather than an all-range attacker. There is no mechanical penalty; both pools function normally in ground battles."
   },
   {
    "name": "Full Barrage",
    "kind": "counter",
    "text": "3 charges per game: every ranged weapon Legend has may be fired in the same turn, regardless of normal AP costs — both DRAGOON pools, the Beam Rifle, and the CIWS together. That is 7 AP of attacks on a unit with 4.\n\nEach weapon still resolves as a fully normal attack — its own attack roll, its own range band, and the target's normal Dodge/Block reactions all apply exactly as usual. The ability bypasses the AP cost, not the resolution.\n\nMaximum output is 25 damage across up to eleven separate targets; realistically closer to 17 against a single one.",
    "max": 3,
    "tracks": "charges",
    "charges": 3
   },
   {
    "name": "Phase Shift Armour",
    "kind": "counter",
    "text": "Passive. See Faction Armour Traits, Section 8 of the Core Rulebook.\n• Ballistic weapons and physical melee cannot touch Limb Health while PS is active — Rifles, Bazookas, Snipers, Vulcans, CIWS, Swords, Heat Axes, Spears, GN Swords and bare hands all drain the 24 HP Phase Shift power pool instead.\n• Beam weapons ignore it entirely, dealing full damage straight to Limb Health with no power drain at all.\n• At 0 the armour shuts down permanently and the unit takes full damage from every source for the rest of the game.\n\nThis unit is nuclear-powered (Hyper-Deuterion engine), granting the full 24-point pool — considerably longer operation than a first-generation battery suit's 12, though not unlimited.",
    "max": 24,
    "tracks": "pool"
   }
  ],
  "weapons": [
   {
    "name": "MA-BAR78F Rifle",
    "y": 68.2,
    "dmg": "6",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "GDU-X5 x8",
    "y": 73.7,
    "dmg": "8d6/1",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "GDU-X7 x2",
    "y": 78.7,
    "dmg": "2d6/5",
    "ap": "2",
    "range": "30cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "CIWS (Vulcans)",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Javelin x2",
    "y": 88.3,
    "dmg": "2/4",
    "ap": "1-2",
    "range": "Melee 20cm",
    "limit": null,
    "text": "draw: 1 AP (one) / 2 AP (both)  "
   }
  ],
  "regen": 3,
  "shields": [
   {
    "hp": 13,
    "x": 80.4,
    "y": 69.8
   },
   {
    "hp": 13,
    "x": 94.5,
    "y": 69.8
   }
  ],
  "shieldTotal": 26,
  "short": "Legend Gundam",
  "portrait": "legend"
 },
 {
  "id": "gundam-turn-a-gundam",
  "name": "∀ Gundam / Turn A Gundam",
  "tier": "Unknown Class",
  "dp": 3500,
  "faction": "neutral",
  "bg": "blue",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 9,
   "chest": 16,
   "rightArm": 13,
   "leftArm": 13,
   "rightLeg": 13,
   "leftLeg": 13
  },
  "abilities": [
   {
    "name": "Nanomachine Regeneration",
    "kind": "none",
    "text": "Passive, always active. At the end of every one of Turn A's turns, it regenerates **1 point of Health to each damaged location** (up to that location's maximum), representing the nanomachines repairing the frame across the board rather than just one spot. Does not apply to a location that hit 0 that turn, and does not apply at all if the Chest was reduced to 0 (unit is Dead).",
    "eot": "Nanomachine Regeneration: +1 HP to every damaged location (not one that hit 0 this turn)"
   },
   {
    "name": "I-Field Deflection",
    "kind": "none",
    "text": "Once per turn, as a free reaction, Turn A may attempt to deflect one incoming ranged attack (beam or physical) instead of Dodging or Blocking. Roll a d20 — on 13+, the attack is redirected into another unit of the controller's choice within range of the original shot (including the original attacker's allies). On a failed roll, the attack resolves normally against Turn A. Does not apply against the Melee Clash system."
   },
   {
    "name": "Moonlight Butterfly",
    "kind": "counter",
    "text": "Once per game. Not an instant kill button — requires commitment and gives the opponent a real window to respond.\n\n1. Charging: At the start of a turn, Turn A may declare it is charging Moonlight Butterfly instead of taking any other action. Turn A cannot move, attack, or use Dodges/Deflection while charging, and is fully vulnerable during this turn.\n2. Activation: At the start of Turn A's next turn, Moonlight Butterfly triggers automatically. Every enemy unit within a 60cm radius must roll a d20 — on 10 or below, that unit is instantly removed from the game (no roll to resist, no saves). On 11+, the unit takes 6 Chest damage and is pushed to the edge of the radius.\n3. Aftermath: Immediately after resolving, Turn A is Exhausted for 2 turns — reduced to 1 AP, 0 Free Dodges, and cannot use I-Field Deflection.",
    "max": 1,
    "tracks": "charges"
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Gundam Hammer",
    "y": 78.7,
    "dmg": "3/5",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [],
  "short": "Turn A Gundam",
  "portrait": "turn-a"
 },
 {
  "id": "zaku-ii-ms-06",
  "name": "Zaku II (MS-06)",
  "tier": "Grunt",
  "dp": 500,
  "faction": "spacenoid",
  "bg": "green",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Spray and Pray",
    "kind": "none",
    "fx": {
     "ap": 2
    },
    "cdText": "2 dmg · all 6",
    "popKind": "Weapon option · Zaku Machine Gun",
    "text": "Uses the Zaku Machine Gun, instead of its standard attack.\n\nFire in a 45° cone, 30cm long. Every unit in the cone — friend or foe — is a target: roll a d6 for each by its own distance (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm). No pooling or reassigning. Each target may Dodge or Block. A hit deals 2 damage to all 6 locations.\n\n2 AP · once per activation · Rulebook Section 8. Tap the AP to spend it."
   }
  ],
  "weapons": [
   {
    "name": "Zaku Machine Gun",
    "y": 68.2,
    "dmg": "3d6×1",
    "ap": "1",
    "range": "90cm",
    "limit": null,
    "text": "BURST FIRE: roll 3d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 1 damage, all to one rolled hit location. One Dodge/Block covers the whole burst.\n\nAlso fires SPRAY AND PRAY — see the Spray and Pray skill.",
    "spray": "ballistic"
   },
   {
    "name": "Heat Hawk",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Zaku II",
  "portrait": "zaku-ii"
 },
 {
  "id": "gouf-ms-07b",
  "name": "Gouf (MS-07B)",
  "tier": "Veteran/Custom Grunt",
  "dp": 600,
  "faction": "spacenoid",
  "bg": "green",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Heat Rod Grapple",
    "kind": "none",
    "text": "Instead of a normal attack, the Heat Rod can be used to grapple a target within its 20cm Charge Range. Requires a roll to land — standard melee attack roll using the Heat Rod's +2 bonus, needing 6+ (under 30cm band). Costs 1 AP, same as a normal Heat Rod attack.\n• If the attack roll misses, nothing happens.\n• If it hits, the target may attempt a Rolled Dodge (needing 15+ at this range) instead of taking the shock effect.\n• If the Dodge succeeds, the grapple fails — but the target has used one of their 2 Rolled Dodges for the turn.\n• If the Dodge fails, the grapple lands and strips the target's remaining Rolled Dodge for that turn too — leaving them with zero Dodges left against any follow-up attacks that round, unless they can Block.",
    "fx": {
     "ap": 1
    }
   },
   {
    "name": "Improved Ground Mobility",
    "kind": "none",
    "text": "Passive: +5cm Movement per AP (20cm → 25cm/AP), reflecting its canon reputation for outclassing Zaku II in speed.",
    "fx": {
     "movePlus": 5
    }
   },
   {
    "name": "Spray and Pray",
    "kind": "none",
    "fx": {
     "ap": 2
    },
    "cdText": "2 dmg · all 6",
    "popKind": "Weapon option · Forearm Machine Gun",
    "text": "Uses the Forearm Machine Gun, instead of its standard attack.\n\nFire in a 45° cone, 30cm long. Every unit in the cone — friend or foe — is a target: roll a d6 for each by its own distance (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm). No pooling or reassigning. Each target may Dodge or Block. A hit deals 2 damage to all 6 locations.\n\n2 AP · once per activation · Rulebook Section 8. Tap the AP to spend it."
   }
  ],
  "weapons": [
   {
    "name": "Forearm Machine Gun",
    "y": 68.2,
    "dmg": "3d6×1",
    "ap": "1",
    "range": "90cm",
    "limit": null,
    "text": "BURST FIRE: roll 3d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 1 damage, all to one rolled hit location. One Dodge/Block covers the whole burst.\n\nAlso fires SPRAY AND PRAY — see the Spray and Pray skill.",
    "spray": "ballistic"
   },
   {
    "name": "Heat Rod",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 20cm",
    "limit": null,
    "text": "",
    "meleeBonus": 2
   },
   {
    "name": "Heat Sword",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "",
    "meleeBonus": 3
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Gouf",
  "portrait": "gouf"
 },
 {
  "id": "rick-dom-ms-09r",
  "name": "Rick Dom (MS-09R)",
  "tier": "Veteran/Custom Grunt",
  "dp": 650,
  "faction": "spacenoid",
  "bg": "green",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Scattering Beam Gun",
    "kind": "none",
    "text": "Once per turn, instead of a normal attack: fires at a target within 20cm. **Requires a roll to hit** (6+, under-30cm band). Deals no damage, but on a hit, inflicts **-2 to the target's next attack roll** — representing the blinding flash and temporary beam/I-field disruption described in canon."
   }
  ],
  "weapons": [
   {
    "name": "Giant Bazooka",
    "y": 68.2,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Heat Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 20cm",
    "limit": null,
    "text": "",
    "meleeBonus": 2
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Rick Dom",
  "portrait": "rick-dom"
 },
 {
  "id": "zaku-i-sniper-type-ms-05l",
  "name": "Zaku I Sniper Type (MS-05L)",
  "tier": "Veteran/Custom Grunt",
  "dp": 675,
  "faction": "spacenoid",
  "bg": "green",
  "ap": 3,
  "move": "15cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Bracing",
    "kind": "none",
    "text": "Conditional passive. If the unit spends 0 AP on Movement that turn, the Beam Sniper Rifle's Called Shot penalty drops from +5 to +2. Represents the foldable right knee pad deploying as a stabilizer when kneeling into firing position — a genuine stable platform, but one that requires committing to a spot rather than moving and shooting. Unlike GM Sniper II's always-on Precision Targeting Visor, this only applies on turns the unit doesn't move at all."
   }
  ],
  "weapons": [
   {
    "name": "Beam Sniper Rifle",
    "y": 68.2,
    "dmg": "7",
    "ap": "2",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Head Vulcans",
    "y": 73.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Zaku I Sniper Type",
  "portrait": "zaku-i-sniper"
 },
 {
  "id": "geara-zulu-ams-129",
  "name": "Geara Zulu (AMS-129)",
  "tier": "Veteran/Custom Grunt",
  "dp": 700,
  "faction": "spacenoid",
  "bg": "green",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 3,
   "chest": 5,
   "rightArm": 4,
   "leftArm": 4,
   "rightLeg": 4,
   "leftLeg": 4
  },
  "abilities": [
   {
    "name": "Piercing Stab",
    "kind": "counter",
    "text": "1 charge per game. When Geara Zulu lands a Critical with the Beam Hawk (7+ on the Melee Clash exchange) and the target attempts to spend their Free Block to cancel it, the pilot may reactively switch the weapon's dual beam emitters to stabbing mode: the Free Block fails to cancel the Critical, and it connects anyway — the enemy committed their Block thinking they were safe, and the piercing spike gets through regardless. Outside of this specific trigger, the Beam Hawk behaves as a completely normal melee weapon (Slash mode, no special interaction).",
    "max": 1,
    "tracks": "charges",
    "charges": 1
   },
   {
    "name": "Spray and Pray",
    "kind": "none",
    "fx": {
     "ap": 3
    },
    "cdText": "MG · 3 dmg · all 6",
    "popKind": "Weapon option · Beam Weapon (MG/Rifle)",
    "text": "Uses the Beam Weapon (MG/Rifle) in MG mode, instead of its standard attack.\n\nFire in a 45° cone, 30cm long. Every unit in the cone — friend or foe — is a target: roll a d6 for each by its own distance (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm). No pooling or reassigning. Each target may Dodge or Block. A hit deals 3 damage to all 6 locations.\n\n3 AP · once per activation · Rulebook Section 8. Tap the AP to spend it."
   }
  ],
  "weapons": [
   {
    "name": "Beam Weapon (MG/Rifle)",
    "y": 68.2,
    "dmg": "3d6×2/5",
    "ap": "2",
    "range": "60/90cm",
    "limit": null,
    "text": "Free choice of mode each shot, no extra AP.\nRIFLE MODE: 90cm, 5 damage.\nMG MODE — BURST FIRE: roll 3d6 against one target (4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm); each hit die deals 2 damage, all to one rolled hit location. One Dodge/Block covers the whole burst.\n\nAlso fires SPRAY AND PRAY (MG mode) — see the Spray and Pray skill.",
    "spray": "beam"
   },
   {
    "name": "Beam Hawk",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield Missiles",
    "y": 78.7,
    "dmg": "2",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 8,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 8,
  "short": "Geara Zulu",
  "portrait": "geara-zulu"
 },
 {
  "id": "rx-78gp02a-gundam-physalis-mobile-suit-gundam-0083-stardust-memory",
  "name": "RX-78GP02A Gundam \"Physalis\" (Mobile Suit Gundam 0083: Stardust Memory)",
  "tier": "Super Flagship",
  "dp": 1900,
  "faction": "spacenoid",
  "bg": "red",
  "ap": 3,
  "move": "20cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Atomic Bazooka",
    "kind": "counter",
    "text": "1 charge per game, 2 AP to fire (the same as any other bazooka). Deploys the two-piece atomic bazooka (front half stored in the shield, back half shoulder-mounted) and fires the single Mk-82 nuclear warhead at a chosen point on the battlefield. Damage is tiered by distance from the blast center:\n\n| Distance from Center | Damage (all 6 locations) |\n|---|---|\n| 0-30cm | 15 |\n| 30-60cm | 10 |\n| 60-90cm | 5 |\n\nHits every unit caught within the 90cm radius — friend or foe alike, with no exceptions. Undodgeable, only Blockable, matching standard AoE treatment.",
    "max": 1,
    "tracks": "charges",
    "charges": 1,
    "fx": {
     "ap": 2
    }
   }
  ],
  "weapons": [
   {
    "name": "135mm Anti-Ship Rifle",
    "y": 68.2,
    "dmg": "2",
    "ap": "1",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Head Vulcans",
    "y": 73.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber x2",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1/2",
    "range": "Melee 15cm",
    "limit": null,
    "text": "ap: 1 (single) / 2 (dual, Advantage)  "
   },
   {
    "name": "—",
    "y": 83.7,
    "dmg": "—",
    "ap": "—",
    "range": "—",
    "limit": null,
    "text": ""
   },
   {
    "name": "—",
    "y": 88,
    "dmg": "—",
    "ap": "—",
    "range": "—",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "GP02A Physalis",
  "portrait": "gp02a"
 },
 {
  "id": "rozen-zulu-yams-132",
  "name": "Rozen Zulu (YAMS-132)",
  "tier": "Super Flagship",
  "dp": 1950,
  "faction": "spacenoid",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 9,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Psycho Jammer (NT-D Interrupt)",
    "kind": "counter",
    "text": "**1 charge per game, reactive.** When an enemy attempts to activate an NT-D-style ability (Luminous Crystal Form, NT-D System, or similar transformation-buff), Rozen Zulu may jam the activation: it fails entirely, and critically, **it still consumes one of the target's limited charges** for that ability — a wasted activation attempt with nothing gained.",
    "max": 1,
    "tracks": "charges",
    "charges": 1
   },
   {
    "name": "Funnel Jamming (Reactive)",
    "kind": "counter",
    "text": "3 charges per game. Whenever any enemy unit within 60cm of Rozen Zulu attempts a Funnel-family attack, the pilot may react and spend a charge to jam it: every die in that attack's Funnel Dice Pool now needs 5+ to hit, overriding the normal d6 range bands (Section 8) entirely — even from point-blank range, where those dice would otherwise land on a 2+. Protects any ally within range, not just Rozen Zulu itself, and is resolved per-attack rather than locking onto one target for the whole game.",
    "max": 3,
    "tracks": "charges",
    "charges": 3
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield MPC Combined",
    "y": 73.7,
    "dmg": "5",
    "ap": "3",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield MPC Scatter",
    "y": 78.7,
    "dmg": "3",
    "ap": "3",
    "range": "40cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 13,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 13,
  "short": "Rozen Zulu",
  "portrait": "rozen-zulu"
 },
 {
  "id": "sinanju-stein-msn-06s-2",
  "name": "Sinanju Stein (MSN-06S-2)",
  "tier": "Superweapon",
  "dp": 2070,
  "faction": "spacenoid",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Overwhelming Mobility",
    "kind": "none",
    "text": "Passive: **+10cm Movement per AP** (down from the original Sinanju's +15cm), reflecting the Stein variant's heavier frame trading some of that exceptional speed for grappling durability.",
    "fx": {
     "movePlus": 10
    }
   },
   {
    "name": "Bio-Sensor Precision",
    "kind": "none",
    "text": "Passive, unconditional: +1 to all rolls. Same as the original Sinanju — built specifically around ace pilot capability rather than requiring a specific pilot rank.",
    "fx": {
     "rollPlus": 1
    }
   },
   {
    "name": "Attachment Bazooka",
    "kind": "counter",
    "text": "3 AP, **3 charges per game**. Fires the Beam Rifle and the mounted Rocket Bazooka simultaneously at **2 separate targets** in one bundled action — one target takes the Beam Rifle's 5 damage, the other takes the Rocket Bazooka's 3 damage. Each target still gets its own normal attack roll and Dodge/Block reaction.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 3
    }
   },
   {
    "name": "Exceptionally Agile",
    "kind": "none",
    "text": "Passive: **-4 to Dodge target number**, all range bands. Unchanged from the original Sinanju — the frame is heavier and slower to move, but no less precise when actually dodging an incoming hit.",
    "fx": {
     "dodgeMod": -4
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Rocket Bazooka",
    "y": 73.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber x2",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": "ap: 1 (single) / 2 (dual)  "
   },
   {
    "name": "—",
    "y": 83.7,
    "dmg": "—",
    "ap": "—",
    "range": "—",
    "limit": null,
    "text": ""
   },
   {
    "name": "Head Vulcans",
    "y": 88,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Sinanju Stein",
  "portrait": "sinanju-stein"
 },
 {
  "id": "sinanju-msn-06s",
  "name": "Sinanju (MSN-06S)",
  "tier": "Superweapon",
  "dp": 2200,
  "faction": "spacenoid",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 3,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 10,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Overwhelming Mobility",
    "kind": "none",
    "text": "Passive: +15cm Movement per AP, reflecting its canon reputation as the single most mobile unit in the setting.",
    "fx": {
     "movePlus": 15
    }
   },
   {
    "name": "Bio-Sensor Precision",
    "kind": "none",
    "text": "Passive, unconditional: +1 to all rolls. Unlike Delta Zayin's Newtype-gated bonus, this is baked into Sinanju's core design (built specifically around ace pilot Full Frontal) rather than requiring a specific pilot rank.",
    "fx": {
     "rollPlus": 1
    }
   },
   {
    "name": "Attachment Bazooka",
    "kind": "counter",
    "text": "3 AP, 3 charges per game. Fires the Beam Rifle and the mounted Rocket Bazooka simultaneously at 2 separate targets in one bundled action — one target takes the Beam Rifle's 5 damage, the other takes the Rocket Bazooka's 3 damage (combined total output: 8 damage split across both hits, not 8 to each). Each target still gets its own normal attack roll and Dodge/Block reaction — this bundles two existing weapons into one action rather than creating a new guaranteed-hit effect.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 3
    }
   },
   {
    "name": "Exceptionally Agile",
    "kind": "none",
    "text": "Passive: **-4 to Dodge target number**, all range bands (e.g., 30-60cm drops from 15+ to 11+). Reflects its canon reputation as the single hardest unit in the setting to actually land a hit on.",
    "fx": {
     "dodgeMod": -4
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Rocket Bazooka",
    "y": 73.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Tomahawks",
    "y": 78.7,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 20cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 83.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Head Vulcans",
    "y": 88,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Sinanju",
  "portrait": "sinanju"
 },
 {
  "id": "kshatriya-nz-666",
  "name": "Kshatriya (NZ-666)",
  "tier": "Superweapon",
  "dp": 2275,
  "faction": "spacenoid",
  "bg": "red360",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 6,
   "chest": 14,
   "rightArm": 6,
   "leftArm": 6,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Funnels x6 (Enhanced)",
    "kind": "none",
    "text": "6-die pool (6 targets max), 60cm, 2 damage each, 2 AP, usable once per turn. Uses the standard Funnels Dice Pool system (Core Rulebook Section 8) — roll all 6d6 at once, assign eligible successes to targets by range band, stacking allowed. Set at 6 to match the canon capacity of a single Quad-Wing binder alone — kept modest compared to her old raw total-suit count (previously 24) specifically because stacking makes a large pool dangerous for single-target burst; Kshatriya's funnel-swarm identity is expressed through her other abilities instead of raw pool size. The once-per-turn cap specifically prevents spending all 4 AP on two separate activations to stack both pools onto one target for 24 damage in a single turn — no other unit's single-turn ceiling comes close to that number, so this keeps her in line with the rest of the roster.",
    "apText": "2 AP"
   },
   {
    "name": "Saturation",
    "kind": "none",
    "text": "8-die pool (8 targets max), 90cm range (extended from the standard 60cm), 2 damage each, 2 AP. Uses the same Funnels Dice Pool system, with one key restriction: no stacking — each success must go to a separate target, one hit per unit maximum. Trades away focus-fire potential entirely in exchange for genuinely wide board coverage and extended reach, showing off the scale of Kshatriya's funnel swarm without recreating the single-target burst risk a larger stacking-capable pool would cause. A real tactical choice against the standard Funnels attack: concentrate damage on one target (x6, stacking, 60cm) or blanket up to 8 separate targets at range (Saturation, no stacking, 90cm).",
    "apText": "2 AP"
   }
  ],
  "weapons": [
   {
    "name": "Mega Particle Cannon",
    "y": 68.2,
    "dmg": "5",
    "ap": "3",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "MPC Scatter Mode",
    "y": 73.7,
    "dmg": "3",
    "ap": "3",
    "range": "40cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcan Gun",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 7,
    "x": 80.91,
    "y": 66.32
   },
   {
    "hp": 7,
    "x": 93.8,
    "y": 66.45
   },
   {
    "hp": 7,
    "x": 80.97,
    "y": 80.97
   },
   {
    "hp": 7,
    "x": 93.8,
    "y": 80.98
   }
  ],
  "shieldTotal": 28,
  "short": "Kshatriya",
  "ring": {
   "cx": 87.36,
   "cy": 73.6,
   "rIn": 3.78,
   "rOut": 4.58,
   "segments": 4
  },
  "portrait": "kshatriya"
 },
 {
  "id": "delta-zayin-dz-001",
  "name": "Delta Zayin (DZ-001)",
  "tier": "Superweapon",
  "dp": 2400,
  "faction": "federation",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 11,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Adaptive Shield",
    "kind": "dualmode",
    "text": "The shield carries psycho-frame panels that synchronize with the pilot, letting it toggle between two modes. Unlike a per-turn choice, switching costs 1 AP and persists until switched back.\n• I-Field Mode (Defense) — the default state. The first incoming hit each turn is Blocked completely free — no Shield HP cost for that hit. Any additional hits that same turn fall back to normal rules (standard Shield Block, costing Shield HP as usual, or a rolled Dodge).\n• Funnel Cannon Mode (Offense). Switching in costs 1 AP once. While active: gains a bonus ranged attack every turn for free (60cm range, 3 damage, no AP cost) — requires a roll to hit, standard attack roll based on range, same as any normal ranged weapon, and the target may Dodge or Block it normally — but Blocking now costs normal Shield HP (Section 4.2) like any standard shield, instead of being free.\n• Switching back to I-Field Mode costs another 1 AP, loses the bonus attack, restores free blocking.\n\nThe real tradeoff: I-Field Mode gives one guaranteed free block every turn with no extra offense; Funnel Cannon Mode adds a free attack every turn, but loses that guaranteed free block, putting the shield's 16 HP genuinely at risk of running out over time, same as any other unit's shield.",
    "fx": {
     "ap": 1
    },
    "modes": [
     {
      "id": "ifield",
      "label": "I-FIELD",
      "use": "free block",
      "refill": "end",
      "strip": "I-FIELD · 1st HIT BLOCKED FREE",
      "stripUsed": "I-FIELD · FREE BLOCK USED",
      "tip": "First incoming hit each turn is Blocked with no Shield HP cost. Refills when you tap End My Turn."
     },
     {
      "id": "cannon",
      "label": "CANNON",
      "use": "bonus shot",
      "refill": "start",
      "strip": "CANNON · FREE SHOT 60cm 3 dmg · BLOCKS COST HP",
      "stripUsed": "CANNON · SHOT USED · BLOCKS COST HP",
      "tip": "One free ranged attack each turn: 60cm, 3 damage, roll to hit, target may Dodge/Block. Refills at Start My Turn."
     }
    ]
   },
   {
    "name": "Psycho-Frame Sync",
    "kind": "none",
    "text": "Passive. While piloted by a Custom Pilot ranked Newtype/Coordinator or higher (Section 11.6), Delta Zayin gains **+1 to all ranged and melee rolls** — the psycho-frame resonating with a genuine Newtype's abilities. No effect with a Stock Pilot or a Custom Pilot below Newtype rank."
   },
   {
    "name": "Wave Rider Mode",
    "kind": "toggle",
    "text": "Standard Transformation rule (Section 8). Costs 2 AP to transform either direction. While transformed: immune to melee entirely, Movement doubles to 60cm per AP. Already priced into this unit's DP cost above.",
    "fx": {
     "ap": 2,
     "moveSet": 60
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 73.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcans",
    "y": 78.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Delta Zayin",
  "portrait": "delta-zayin"
 },
 {
  "id": "sazabi-msn-04",
  "name": "Sazabi (MSN-04)",
  "tier": "Superweapon",
  "dp": 2550,
  "faction": "spacenoid",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "head",
  "limb": {
   "head": 8,
   "chest": 8,
   "rightArm": 8,
   "leftArm": 8,
   "rightLeg": 8,
   "leftLeg": 8
  },
  "abilities": [
   {
    "name": "Funnels",
    "kind": "none",
    "text": "Standard rule (Section 8): up to 3 targets, 60cm, 2 damage each, 2 AP. **Requires a roll to hit, one per target** (standard attack roll based on range), and each target may Dodge or Block it normally, same as any standard ranged attack.",
    "apText": "2 AP"
   },
   {
    "name": "Psycho-Frame Sync",
    "kind": "none",
    "text": "Passive: while piloted by a Custom Pilot ranked Newtype/Coordinator or higher (Section 11.6), Sazabi gains +1 to all ranged and melee rolls."
   },
   {
    "name": "Mega Particle Cannon",
    "kind": "counter",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 3
    },
    "text": "40cm, 45° cone · 4 damage · 3 AP · 3 charges per game.\n\nNo attack roll needed — it automatically connects with anyone caught in the cone. Dodge and Block are still allowed."
   }
  ],
  "weapons": [
   {
    "name": "Beam Shot Rifle",
    "y": 68.2,
    "dmg": "4/3",
    "ap": "2/3",
    "range": "60cm/30cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Tomahawk",
    "y": 73.7,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 20cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Shield Missiles",
    "y": 83.7,
    "dmg": "2",
    "ap": "1",
    "range": "20cm only",
    "limit": {
     "kind": "charges",
     "max": 3
    },
    "text": "20cm · 2 damage · 1 AP · 3 charges per game. Not dodgeable — only Blockable, same logic as Homing Missiles."
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 16,
  "short": "Sazabi",
  "portrait": "sazabi"
 },
 {
  "id": "sinanju-zero-msn-06s-custom",
  "name": "Sinanju Zero (MSN-06S Custom)",
  "tier": "Superweapon",
  "dp": 2650,
  "faction": "spacenoid",
  "bg": "red360",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 10,
   "rightArm": 7,
   "leftArm": 7,
   "rightLeg": 7,
   "leftLeg": 7
  },
  "abilities": [
   {
    "name": "Overwhelming Mobility",
    "kind": "none",
    "text": "Passive: **+10cm Movement per AP** (down from the original Sinanju's +15cm), reflecting the added mass of the wing/shield system trading away some of that signature speed.",
    "fx": {
     "movePlus": 10
    }
   },
   {
    "name": "Bio-Sensor Precision",
    "kind": "none",
    "text": "Passive, unconditional: +1 to all rolls. Unchanged from the original Sinanju — built around ace-pilot capability rather than requiring a specific pilot rank.",
    "fx": {
     "rollPlus": 1
    }
   },
   {
    "name": "Attachment Bazooka",
    "kind": "counter",
    "text": "3 AP, **3 charges per game**. Fires the Beam Rifle and the mounted Rocket Bazooka simultaneously at **2 separate targets** in one bundled action — one target takes the Beam Rifle's 5 damage, the other takes the Rocket Bazooka's 3 damage. Each target still gets its own normal attack roll and Dodge/Block reaction.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 3
    }
   },
   {
    "name": "Exceptionally Agile",
    "kind": "none",
    "text": "Passive: **-2 to Dodge target number**, all range bands. Reduced from the original Sinanju's -4, reflecting a genuinely heavier frame that's harder to move quickly despite retaining excellent piloting precision.",
    "fx": {
     "dodgeMod": -2
    }
   },
   {
    "name": "Zero System",
    "kind": "counter",
    "text": "**3 charges per game, free action:** reroll any one d20 roll — yours or an opponent's — and take the new result, representing the system foreseeing and countering their action. Exact copy of Wing Zero's own Zero System.",
    "max": 3,
    "tracks": "charges",
    "charges": 3,
    "fx": {
     "ap": 0
    }
   }
  ],
  "weapons": [
   {
    "name": "Beam Rifle",
    "y": 68.2,
    "dmg": "5",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Rocket Bazooka",
    "y": 73.7,
    "dmg": "3",
    "ap": "2",
    "range": "90cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Tomahawk",
    "y": 78.7,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 20cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Razor Feather Funnels",
    "y": 83.7,
    "dmg": "3 ea",
    "ap": "2",
    "range": "60cm",
    "limit": null,
    "text": "4-die Dice Pool, usable once per turn (12 damage ceiling if all connect). Standard Funnels targeting — roll to hit per target, Dodge/Block apply normally. The wing feathers detach and slice through targets under psycommu control, dealing genuine cutting damage rather than a standard beam tag."
   },
   {
    "name": "Head Vulcans",
    "y": 88,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": ""
   }
  ],
  "shields": [
   {
    "hp": 16,
    "x": 80.91,
    "y": 66.32
   },
   {
    "hp": 16,
    "x": 93.8,
    "y": 66.45
   },
   {
    "hp": 12,
    "x": 80.97,
    "y": 80.97
   },
   {
    "hp": 12,
    "x": 93.8,
    "y": 80.98
   }
  ],
  "shieldTotal": 56,
  "short": "Sinanju Zero",
  "ring": {
   "cx": 87.36,
   "cy": 73.6,
   "rIn": 3.78,
   "rOut": 4.58,
   "segments": 4
  },
  "portrait": "sinanju-zero"
 },
 {
  "id": "nightingale-msn-04ii",
  "name": "Nightingale (MSN-04II)",
  "tier": "Myth",
  "dp": 3350,
  "faction": "spacenoid",
  "bg": "red",
  "ap": 4,
  "move": "30cm",
  "dodges": 2,
  "kill": "chest",
  "limb": {
   "head": 5,
   "chest": 12,
   "rightArm": 9,
   "leftArm": 9,
   "rightLeg": 9,
   "leftLeg": 9
  },
  "abilities": [
   {
    "name": "Hidden Arms: Dual Strike",
    "kind": "none",
    "text": "Permanent, always active — no AP cost, no charges. Nightingale's concealed hidden-arm manipulators, each carrying their own Beam Saber, allow it to strike twice per Melee Clash exchange. In every exchange, Nightingale rolls 2d20 instead of the standard 1, with its Melee Roll Bonus applying to both. Compare the opponent's single roll against Nightingale's higher roll first. If the opponent's roll beats or ties Nightingale's higher roll, that's the only comparison made — Nightingale's lower roll is never checked, since the opponent has already answered for her stronger attack. If the opponent's roll loses to Nightingale's higher roll, it is then also compared against Nightingale's lower roll, producing a second, independent outcome — meaning the opponent can be Hit or Critically Hit twice from the two separate comparisons. This is the general rule for any unit with a genuine double-melee-attack ability (roll N dice instead of 1): the defender's single roll is compared against the attacker's dice from highest to lowest, stopping as soon as the defender wins or ties one of them.",
    "fx": {
     "ap": 0
    }
   },
   {
    "name": "Funnels x10 (Enhanced)",
    "kind": "none",
    "text": "Up to **4 targets** (up from the standard 3), 60cm, **3 damage each** (up from the standard 2), 2 AP. Requires a roll to hit per target, Dodge/Block apply normally. Reflects genuinely carrying double the funnel count of a standard unit like Sazabi (10 funnels vs. 5).",
    "apText": "2 AP"
   },
   {
    "name": "Mega Particle Cannon",
    "kind": "none",
    "apText": "3 AP",
    "cdText": "No limit",
    "text": "Abdominal Mega Particle Cannon — 40cm, 45° cone · 5 damage · 3 AP. Built-in fixed armament with no charge limit — usable every turn."
   },
   {
    "name": "Psycho-Frame Sync",
    "kind": "none",
    "text": "Passive: while piloted by a Custom Pilot ranked Newtype/Coordinator or higher (Section 11.6), Nightingale gains +1 to all ranged and melee rolls."
   }
  ],
  "weapons": [
   {
    "name": "Mega Beam Rifle",
    "y": 68.2,
    "dmg": "7",
    "ap": "2",
    "range": "Unlimited",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Tomahawk",
    "y": 73.7,
    "dmg": "3/6",
    "ap": "2",
    "range": "Melee 20cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Beam Saber",
    "y": 78.7,
    "dmg": "2/4",
    "ap": "1",
    "range": "Melee 15cm",
    "limit": null,
    "text": ""
   },
   {
    "name": "Vulcan Cannons",
    "y": 83.7,
    "dmg": "1",
    "ap": "1",
    "range": "20cm only",
    "limit": null,
    "text": "\n\nAlso on this row — Shield Missiles: 2 dmg, 1 AP, 20cm."
   },
   {
    "name": "Shield Missiles",
    "y": 88.3,
    "dmg": "2",
    "ap": "1",
    "range": "20cm",
    "limit": {
     "kind": "charges",
     "max": 3
    },
    "text": "20cm · 2 damage · 1 AP · 3 charges per game. Not dodgeable — only Blockable."
   }
  ],
  "shields": [
   {
    "hp": 18,
    "x": 80.5,
    "y": 57.3
   }
  ],
  "shieldTotal": 18,
  "short": "Nightingale",
  "portrait": "nightingale"
 }
];
