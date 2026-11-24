// ============================================================================
// D&D 5E SPIRE II — ANIMATED PIXEL-ART SPRITE ENGINE (sprites.js)
// - 8 Unique 16x16 2-Frame Pixel Art Heroes (Fighter..Warlock)
// - 82 Unique 16x16 / 20x20 2-Frame Pixel Art Monsters (ZERO duplicates!)
// - Authentic Retro 2-Frame Stepping + Float / Heavy / Agile / Squish Motions
// ============================================================================
(function () {
  // Compile a 16x16 (or WxH) ASCII pixel grid into merged horizontal SVG <rect> runs for ultra-fast crisp rendering!
  function compileGrid(rows, pal) {
    const rects = [];
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        if (ch === '.' || ch === ' ' || !pal[ch]) {
          x++;
          continue;
        }
        let run = 1;
        while (x + run < row.length && row[x + run] === ch) run++;
        rects.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${pal[ch]}"/>`);
        x += run;
      }
    }
    return rects.join('');
  }

  // Build crisp 2-frame animated pixel SVG with optional glow/shadow & motion class
  function buildPixelSvg(f1Rows, f2Rows, pal, opts = {}) {
    const h = f1Rows.length;
    const w = f1Rows[0].length;
    const motion = opts.motion || 'px-motion-agile';
    const isBoss = !!opts.isBoss;
    const aura = opts.aura || '';
    const extraF1 = opts.extraF1 || '';
    const extraF2 = opts.extraF2 || '';
    const shadowY = h - 1;
    const auraSvg = aura
      ? `<ellipse cx="${w / 2}" cy="${h * 0.56}" rx="${w * 0.42}" ry="${h * 0.36}" fill="${aura}" opacity="0.22" class="px-aura"/>`
      : '';
    return (
      `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" class="pixel-sprite ${motion}${isBoss ? ' px-boss' : ''}" aria-hidden="true">` +
      auraSvg +
      `<rect x="${Math.floor(w * 0.22)}" y="${shadowY}" width="${Math.ceil(w * 0.56)}" height="1" fill="rgba(0,0,0,0.45)"/>` +
      `<g class="px-f1">${compileGrid(f1Rows, pal)}${extraF1}</g>` +
      `<g class="px-f2">${compileGrid(f2Rows, pal)}${extraF2}</g>` +
      `</svg>`
    );
  }

  // Helper: shift rows down by 1px for classic RPG idle bob, or modify specific rows
  function bobRows(rows) {
    const empty = '.'.repeat(rows[0].length);
    return [empty, ...rows.slice(0, rows.length - 1)];
  }

  // Helper: deterministic hash for subtle per-enemy unique crest/markings if sharing an archetype family
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // ==========================================================================
  // 1. ALL 8 PLAYABLE D&D 5E HEROES (16x16 BESPOKE 2-FRAME PIXEL ART)
  // ==========================================================================
  const HERO_SPRITES = {
    fighter: () => {
      const pal = {
        k: '#141923', s: '#cfd8dc', d: '#78909c', r: '#e74c3c', g: '#f6c967',
        f: '#f5cba7', b: '#2c3e50', w: '#ffffff', c: '#54a0ff'
      };
      const f1 = [
        '......rrr.......',
        '.....rrkrr......',
        '....ksssssk.....',
        '....ksdkdsk.....',
        '....ksssssk...w.',
        '.....kfffk...ws.',
        '...kbbgggbbk.ws.',
        '..kscbsssbcsksk.',
        '..kscbsssbcskgk.',
        '..ksgbsssbgskk..',
        '..kscbsssbcsk...',
        '...kkbsssbbk....',
        '....kss.ssk.....',
        '....kdd.ddk.....',
        '...kbbk.kbbk....',
        '................'
      ];
      const f2 = [
        '................',
        '.....rrrr.......',
        '....ksssssk...w.',
        '....ksdkdsk..ws.',
        '....ksssssk..ws.',
        '.....kfffk..wsk.',
        '...kbbgggbbkggk.',
        '..kscbsssbcskk..',
        '..kscbsssbcsk...',
        '..ksgbsssbgsk...',
        '..kscbsssbcsk...',
        '...kkbsssbbk....',
        '....kss.ssk.....',
        '....kdd.ddk.....',
        '...kbbk.kbbk....',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-heavy', aura: '#74b9ff' });
    },

    barbarian: () => {
      const pal = {
        k: '#1a1114', f: '#e0a97c', d: '#a86b43', h: '#f5f6fa', r: '#ff4757',
        b: '#5c3424', s: '#b2bec3', w: '#ffffff', g: '#f6c967', p: '#2d1e1c'
      };
      const f1 = [
        '..hh........hh..',
        '...hk.kkkk.kh...',
        '...kkbbbbbbkk.ss',
        '....kbffffbk.sws',
        '....kfkffkfk.sws',
        '....kffffffk..sk',
        '...kffrrrrffk.bk',
        '..kffffffffffkbk',
        '..kffrffffrffkb.',
        '..kffkggggkffk..',
        '...kkbbbbbbkk...',
        '....kbb..bbk....',
        '....kff..ffk....',
        '...kbbk..kbbk...',
        '...kppk..kppk...',
        '................'
      ];
      const f2 = [
        '................',
        '..hh........hh..',
        '...hk.kkkk.kh.ss',
        '...kkbbbbbbkksws',
        '....kbffffbk.sws',
        '....kfrffrfk..sk',
        '....kffffffk..bk',
        '..kfffggggfffkbk',
        '..kffrffffrffkb.',
        '..kffkbbbbkffk..',
        '...kkbbbbbbkk...',
        '....kbb..bbk....',
        '....kff..ffk....',
        '...kbbk..kbbk...',
        '...kppk..kppk...',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-heavy', aura: '#ff4757' });
    },

    rogue: () => {
      const pal = {
        k: '#0d0f17', c: '#2c2f42', d: '#1b1d2b', g: '#2ed573', f: '#e8c3a2',
        s: '#dfe6e9', p: '#55efc4', b: '#4a3525', w: '#ffffff'
      };
      const f1 = [
        '.....kkkkk......',
        '....kccccck.....',
        '...kcckkkcck....',
        '...kckgkfkck....',
        '...kcckkkcck....',
        '..kcccckcccck...',
        '.kccddcccdcck.p.',
        '.kcdccccccdcksp.',
        '.gskcbbbbcksksk.',
        '.pk.kcccck..kk..',
        '....kcdcck......',
        '...kcc..cck.....',
        '...kdd..ddk.....',
        '..kbbk..kbbk....',
        '................',
        '................'
      ];
      const f2 = [
        '................',
        '.....kkkkk......',
        '....kccccck.....',
        '...kcckkkcck....',
        '...kckpkfkck..p.',
        '...kcckkkcck.sp.',
        '..kcccckccccksk.',
        '.gskcdccccdckk..',
        '.pk.kbbbbk......',
        '....kcccck......',
        '...kcc..cck.....',
        '...kcd..dck.....',
        '...kdd..ddk.....',
        '..kbbk..kbbk....',
        '................',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-agile', aura: '#2ed573' });
    },

    ranger: () => {
      const pal = {
        k: '#101d15', g: '#27ae60', d: '#196f3d', f: '#f3d1b0', b: '#8e5a33',
        w: '#ffffff', c: '#55efc4', y: '#f6c967', s: '#dfe6e9'
      };
      const f1 = [
        '.....kkkkk......',
        '....kgggggk.....',
        '...kggfffggk.b..',
        '...kgfkfkfgk.bb.',
        '...kggfffggk..b.',
        '..kggggggggk.sb.',
        '..kgddgygddkcwsb',
        '..kggbgggbggk.b.',
        '...kgggggggk.bb.',
        '...kgbgggbk..b..',
        '....kgg.ggk.....',
        '....kdd.ddk.....',
        '...kbbk.kbbk....',
        '...kbbk.kbbk....',
        '................',
        '................'
      ];
      const f2 = [
        '................',
        '.....kkkkk......',
        '....kgggggk..b..',
        '...kggfffggk.bb.',
        '...kgfkfkfgk..b.',
        '...kggfffggk.sb.',
        '..kggggggggkcwsb',
        '..kgddgygddk..b.',
        '..kggbgggbggkbb.',
        '...kgggggggk.b..',
        '....kgg.ggk.....',
        '....kdd.ddk.....',
        '...kbbk.kbbk....',
        '...kbbk.kbbk....',
        '................',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-agile', aura: '#55efc4' });
    },

    wizard: () => {
      const pal = {
        k: '#0e1428', b: '#2e86de', d: '#1b4f72', y: '#f6c967', w: '#f5f6fa',
        f: '#f5cba7', c: '#00d2d3', p: '#a29bfe', r: '#7d5fff'
      };
      const f1 = [
        '.......kk.......',
        '......kbbk......',
        '.....kbbybk...c.',
        '....kbbbbbbk.cwc',
        '..kkbbbbbbbbk.c.',
        '....kfkffkfk..y.',
        '....kwwwwwwk..y.',
        '...kbbwwwwbbk.y.',
        '..kbbbbyybbbbky.',
        '..kbddbbbbddk.y.',
        '..kbbbbbbbbbk.y.',
        '...kbbbbbbbk..y.',
        '...kddbbbddk....',
        '...kbbk.kbbk....',
        '................',
        '................'
      ];
      const f2 = [
        '.......kk.....p.',
        '......kbbk...pwp',
        '.....kbbybk...p.',
        '....kbbbbbbk..y.',
        '..kkbbbbbbbbk.y.',
        '....kfkffkfk..y.',
        '....kwwwwwwk..y.',
        '...kbbwwwwbbk.y.',
        '..kbbbbyybbbbky.',
        '..kbddbbbbddk.y.',
        '..kbbbbbbbbbk...',
        '...kbbbbbbbk....',
        '...kddbbbddk....',
        '...kbbk.kbbk....',
        '................',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-float', aura: '#00d2d3' });
    },

    cleric: () => {
      const pal = {
        k: '#1a1626', y: '#f6c967', w: '#ffffff', s: '#dfe6e9', f: '#f5cba7',
        b: '#74b9ff', g: '#ffd32a', r: '#e67e22'
      };
      const f1 = [
        '....yyyyyyyy....',
        '....y......y....',
        '....kwwyywwk..g.',
        '....kwfkkfwk.gyg',
        '....kffffffk..g.',
        '...kwwwyywwwk.y.',
        '..kwwbyyyybwwky.',
        '..kwswyyyywswwy.',
        '..kwwwyyyywwwky.',
        '...kwwwyywwwk...',
        '...kwwwwwwwwk...',
        '...kssw..wssk...',
        '...kyyk..kyyk...',
        '................',
        '................',
        '................'
      ];
      const f2 = [
        '.....gggggg.....',
        '....g......g..w.',
        '....kwwyywwk.wgw',
        '....kwfkkfwk..g.',
        '....kffffffk..y.',
        '...kwwwyywwwk.y.',
        '..kwwbyyyybwwky.',
        '..kwswyyyywswwy.',
        '..kwwwyyyywwwk..',
        '...kwwwyywwwk...',
        '...kwwwwwwwwk...',
        '...kssw..wssk...',
        '...kyyk..kyyk...',
        '................',
        '................',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-float', aura: '#ffeaa7' });
    },

    paladin: () => {
      const pal = {
        k: '#161622', y: '#f6c967', w: '#ffffff', s: '#dcdde1', r: '#eb3b5a',
        b: '#3498db', g: '#ffd32a', d: '#7f8fa6'
      };
      const f1 = [
        '..w..kkkk..w....',
        '..wwkyyyykw.....',
        '...kyskkysk...w.',
        '...kyyyyyyk..wg.',
        '...kksssskk..wg.',
        '..krrgyygrrk.wg.',
        '.kywsyyyywskggk.',
        '.kywgyyyygywkk..',
        '.kywsyyyywsk....',
        '..kkryyyyrrk....',
        '...kyy..yyk.....',
        '...kss..ssk.....',
        '..kyyk..kyyk....',
        '................',
        '................',
        '................'
      ];
      const f2 = [
        '................',
        '..w..kkkk..w..w.',
        '..wwkyyyykw..wg.',
        '...kyskkysk..wg.',
        '...kyyyyyyk..wg.',
        '...kksssskk.ggk.',
        '..krrgyygrrkk...',
        '.kywsyyyywsk....',
        '.kywgyyyygyw....',
        '.kywsyyyywsk....',
        '..kkryyyyrrk....',
        '...kyy..yyk.....',
        '...kss..ssk.....',
        '..kyyk..kyyk....',
        '................',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-heavy', aura: '#f6c967' });
    },

    warlock: () => {
      const pal = {
        k: '#0c0814', p: '#9b59b6', v: '#e056fd', d: '#3c1e5a', r: '#ff4757',
        w: '#ffffff', g: '#f6c967', s: '#2c193d'
      };
      const f1 = [
        '..v........v....',
        '...vk.kk.kv.....',
        '...kkppppkk...v.',
        '...kpkkkkpk..vwv',
        '...kpvkkvpk...v.',
        '...kppkkppk..kp.',
        '..kppddddppk.kv.',
        '..kpdppppdpk.kp.',
        '..kppvppvppkk...',
        '...kppppppk.....',
        '...kpddddpk.....',
        '..kpp.pp.ppk....',
        '..kdd....ddk....',
        '................',
        '................',
        '................'
      ];
      const f2 = [
        '..v........v..w.',
        '...vk.kk.kv..vwv',
        '...kkppppkk..pvp',
        '...kpkkkkpk...v.',
        '...kprkkrpk..kp.',
        '...kppkkppk..kv.',
        '..kppddddppkkp..',
        '..kpdppppdpk....',
        '..kppvppvppk....',
        '...kppppppk.....',
        '...kpddddpk.....',
        '..kpp.pp.ppk....',
        '..kdd....ddk....',
        '................',
        '................',
        '................'
      ];
      return buildPixelSvg(f1, f2, pal, { motion: 'px-motion-float', aura: '#e056fd' });
    }
  };

  // ==========================================================================
  // 2. MONSTER PIXEL ARCHETYPES (28 Distinct Silhouettes x Unique Palettes/Accents = 82 UNIQUE SPRITES!)
  // ==========================================================================
  const TEMPLATES = {
    beholder: {
      motion: 'px-motion-float',
      f1: [
        '.e....e...e...e.',
        '..p..p....p..p..',
        '...pp.kkkk.pp...',
        '...kkppppppkk...',
        '..kppwwwwwwppk..',
        '.kppwwaaaawwppk.',
        '.kppwaakkaawppk.',
        '.kppwwaaaawwppk.',
        '..kppwwwwwwppk..',
        '..kppddddddppk..',
        '...kpkwwwwkpk...',
        '...kpwkkkkwpk...',
        '....kppppppk....',
        '.....kkkkkk.....',
        '................',
        '................'
      ],
      f2: [
        '..e..e.....e..e.',
        '..p...p...p..p..',
        '...pp.kkkk.pp...',
        '...kkppppppkk...',
        '..kppwwwwwwppk..',
        '.kppwwaaaawwppk.',
        '.kppwaakkaawppk.',
        '.kppwwaaaawwppk.',
        '..kppwwwwwwppk..',
        '..kppddddddppk..',
        '...kpwkkkkwpk...',
        '...kpkwwwwkpk...',
        '....kppppppk....',
        '.....kkkkkk.....',
        '................',
        '................'
      ]
    },

    dragon: {
      motion: 'px-motion-float',
      f1: [
        'kk..........kk..',
        'kppk..kk..kppk..',
        'kpppk.kpk.kpppk.',
        '.kpppkpapkpppk..',
        '..kpppeeppppk...',
        '..kpppkkpppk....',
        '...kppaaappk..a.',
        '...kppaaappk.aa.',
        '....kpppppk..a..',
        '...kppaaappk....',
        '...kpp..ppk.....',
        '..kpp....ppk....',
        '..kddk..kddk....',
        '.kwwk....kwwk...',
        '................',
        '................'
      ],
      f2: [
        '................',
        '......kk........',
        '.kk...kpk...kk..',
        'kpppk.papk.kpppk',
        'kpppppeepppppppk',
        '.kppppkkppppppk.',
        '..kkppaaapppkk.a',
        '...kppaaappk..aa',
        '....kpppppk...a.',
        '...kppaaappk....',
        '...kpp..ppk.....',
        '..kpp....ppk....',
        '..kddk..kddk....',
        '.kwwk....kwwk...',
        '................',
        '................'
      ]
    },

    tiamat: {
      motion: 'px-motion-float',
      f1: [
        '.rr..bb..gg..ww.',
        'rkr.bkb.gkg.wkw.',
        '.rk..bk..gk..wk.',
        'kk.kk.kk.kk.kk..',
        'kddkrkbbkgkwkddk',
        'kdddkrrrrrrkdddk',
        '.kdddrryyrrdddk.',
        '..kkdrryyrrdkk..',
        '...kddryyrddk...',
        '...kddryyrddk...',
        '....kddrrddk....',
        '...kdd....ddk...',
        '..kdd......ddk..',
        '..kwwk....kwwk..',
        '................',
        '................'
      ],
      f2: [
        'rr..bb....gg..ww',
        'rkr..bkb.gkg.wkw',
        '.rk..bk..gk..wk.',
        'kk.kk.kk.kk.kk..',
        'kddkrkbbkgkwkddk',
        'kdddkrrrrrrkdddk',
        'kddddrryyrrddddk',
        '.kdddrryyrrdddk.',
        '...kddryyrddk...',
        '...kddryyrddk...',
        '....kddrrddk....',
        '...kdd....ddk...',
        '..kdd......ddk..',
        '..kwwk....kwwk..',
        '................',
        '................'
      ]
    },

    mindflayer: {
      motion: 'px-motion-float',
      f1: [
        '.....kkkkkk.....',
        '....kppppppk....',
        '...kppppppppk...',
        '...kppekkeppk...',
        '...kppppppppk...',
        '...kp.p..p.pk...',
        '..kddp.pp.pddk..',
        '.kddd.p..p.dddk.',
        '.kdddaaaaaadddk.',
        '..kddddddddddk..',
        '..kddaddddaddk..',
        '...kddddddddk...',
        '...kddk..kddk...',
        '....kk....kk....',
        '................',
        '................'
      ],
      f2: [
        '.....kkkkkk.....',
        '....kppppppk....',
        '...kppppppppk...',
        '...kppekkeppk...',
        '...kppppppppk...',
        '...k.pp..pp.k...',
        '..kdd.p..p.ddk..',
        '.kdddp.pp.pdddk.',
        '.kdddaaaaaadddk.',
        '..kddddddddddk..',
        '..kddaddddaddk..',
        '...kddddddddk...',
        '...kddk..kddk...',
        '....kk....kk....',
        '................',
        '................'
      ]
    },

    brain: {
      motion: 'px-motion-squish',
      f1: [
        '....kkkkkkkk....',
        '..kkppppppppkk..',
        '.kppapappapappk.',
        'kppappppppappppk',
        'kppppaappapppppk',
        'kppappppppappppk',
        '.kppappppappppk.',
        '..kkddddddddkk..',
        '...k.d.dd.d.k...',
        '..k..d.dd.d..k..',
        '..e..e....e..e..',
        '................',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '...kkkkkkkkkk...',
        '.kkppppppppppkk.',
        'kppappppppappppk',
        'kppapappapappppk',
        'kppppaappapppppk',
        'kppappppppappppk',
        '.kkddddddddddkk.',
        '..k.d..dd..d.k..',
        '...e..e..e..e...',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    spider: {
      motion: 'px-motion-agile',
      f1: [
        '.....kkkkkk.....',
        '....kppppppk....',
        '.k..kppaaapk..k.',
        'k.k.kppaaapk.k.k',
        '..kk.kppppk.kk..',
        '.k..kkddddkk..k.',
        'k..kddeddeddk..k',
        '...kddddddddk...',
        '..k.kddwwddk.k..',
        '.k...kkkkkk...k.',
        'k..k........k..k',
        '...k........k...',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.....kkkkkk.....',
        'k...kppppppk...k',
        '.k..kppaaapk..k.',
        '..kk.kppapk.kk..',
        '.k..kkddddkk..k.',
        '...kddeddeddk...',
        '..k.kddddddk.k..',
        '.k..kddwwddk..k.',
        'k....kkkkkk....k',
        '..k..........k..',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    slime: {
      motion: 'px-motion-squish',
      f1: [
        '................',
        '................',
        '...kkkkkkkkkk...',
        '..kppppppppppk..',
        '..kppwwwwppppk..',
        '..kppwkkwppppk..',
        '..kppwwwwppapk..',
        '..kpppppappppk..',
        '..kpppappppppk..',
        '..kppddddppppk..',
        '..kddddddddddk..',
        '..kkkkkkkkkkkk..',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '................',
        '................',
        '..kkkkkkkkkkkk..',
        '.kppppppppppppk.',
        '.kpppwwwwpppppk.',
        '.kpppwkkwpppppk.',
        '.kpppwwwwppappk.',
        '.kppppppapppppk.',
        '.kppppddddppppk.',
        '.kddddddddddddk.',
        '.kkkkkkkkkkkkkk.',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    mimic: {
      motion: 'px-motion-agile',
      f1: [
        '................',
        '................',
        '..kkkkkkkkkkkk..',
        '.kppppaaapppppk.',
        '.kppppaaapppppk.',
        '.kaaaaaaaaaaaak.',
        '.kppppaaapppppk.',
        '.kddddaaadddddk.',
        '.kddddaaadddddk.',
        '.kddddaaadddddk.',
        '.kkkkkkkkkkkkkk.',
        '................',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '..kkkkkkkkkkkk..',
        '.kppppaaapppppk.',
        '.kwwkwwkwwkwwkk.',
        '.kkeeekkkkeeekk.',
        '.krrkrrrrrrkrrk.',
        '.krrrraaaarrrrk.',
        '.kwwkwwkwwkwwkk.',
        '.kaaaaaaaaaaaak.',
        '.kddddaaadddddk.',
        '.kddddaaadddddk.',
        '.kkkkkkkkkkkkkk.',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    goblin: {
      motion: 'px-motion-agile',
      f1: [
        '................',
        '.....kkkkkk.....',
        '..kkkppppppkkk..',
        '...kkpekkepkk...',
        '....kppppppk....',
        '....kppwwppk..w.',
        '...kkddddddkk.w.',
        '..kppddddddppkw.',
        '..kppdaaaadppka.',
        '...kkddddddkk...',
        '....kdd..ddk....',
        '....kpp..ppk....',
        '...kddk..kddk...',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '................',
        '..kkkppppppkkk..',
        '...kkpekkepkk.w.',
        '....kppppppk..w.',
        '....kppwwppk.wa.',
        '...kkddddddkkk..',
        '..kppddddddppk..',
        '..kppdaaaadppk..',
        '...kkddddddkk...',
        '....kdd..ddk....',
        '....kpp..ppk....',
        '...kddk..kddk...',
        '................',
        '................',
        '................'
      ]
    },

    brute: {
      motion: 'px-motion-heavy',
      f1: [
        '....kkkkkkkk....',
        '...kppppppppk...',
        '..kpppekkepppk..',
        '..kpppwkkwpppk..',
        '..kppppppppppk..',
        '.kppppddddppppk.',
        'kppppdaaaadppppk',
        'kpppppddddpppppk',
        'kppkppppppppkppk',
        '.kk.kddddddk.kk.',
        '....kdd..ddk....',
        '...kppp..pppk...',
        '...kddk..kddk...',
        '..kdddk..kdddk..',
        '................',
        '................'
      ],
      f2: [
        '................',
        '....kkkkkkkk....',
        '...kppppppppk...',
        '..kpppekkepppk..',
        '..kpppwkkwpppk..',
        '.kppppddddppppk.',
        'kppppdaaaadppppk',
        'kpppppddddpppppk',
        'kppkppppppppkppk',
        '.kk.kddddddk.kk.',
        '....kdd..ddk....',
        '...kppp..pppk...',
        '...kddk..kddk...',
        '..kdddk..kdddk..',
        '................',
        '................'
      ]
    },

    ettin: {
      motion: 'px-motion-heavy',
      f1: [
        '.kkkkk....kkkkk.',
        'kpppppk..kpppppk',
        'kpekepk..kpekepk',
        'kpppppk..kpppppk',
        '.kkppppkkppppkk.',
        'kppppddddddppppk',
        'kpppdaaaaaadpppk',
        'kppppddddddppppk',
        'kppkppppppppkppk',
        '.kk.kddddddk.kk.',
        '....kdd..ddk....',
        '...kppp..pppk...',
        '...kddk..kddk...',
        '..kdddk..kdddk..',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.kkkkk....kkkkk.',
        'kpppppk..kpppppk',
        'kpekepk..kpekepk',
        '.kkppppkkppppkk.',
        'kppppddddddppppk',
        'kpppdaaaaaadpppk',
        'kppppddddddppppk',
        'kppkppppppppkppk',
        '.kk.kddddddk.kk.',
        '....kdd..ddk....',
        '...kppp..pppk...',
        '...kddk..kddk...',
        '..kdddk..kdddk..',
        '................',
        '................'
      ]
    },

    skeleton: {
      motion: 'px-motion-agile',
      f1: [
        '.....kkkkkk.....',
        '....kwwwwwwk....',
        '....kwkwwkwk....',
        '....kwwwwwwk..a.',
        '.....kwkkwk..aw.',
        '....kkwwwwkk.aw.',
        '...kppwwwwppkaw.',
        '..kppkdkkdkppkk.',
        '..kppkwwwwkppk..',
        '...kk.kwwk.kk...',
        '.....kwwwwk.....',
        '....kww..wwk....',
        '....kdd..ddk....',
        '...kddk..kddk...',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.....kkkkkk.....',
        '....kwwwwwwk..a.',
        '....kwewwewk.aw.',
        '....kwwwwwwk.aw.',
        '.....kwkkwk.awk.',
        '...kppwwwwppkk..',
        '..kppkdkkdkppk..',
        '..kppkwwwwkppk..',
        '...kk.kwwk.kk...',
        '.....kwwwwk.....',
        '....kww..wwk....',
        '....kdd..ddk....',
        '...kddk..kddk...',
        '................',
        '................'
      ]
    },

    wraith: {
      motion: 'px-motion-float',
      f1: [
        '.....kkkkkk.....',
        '....kppppppk....',
        '...kppkkkkppk...',
        '...kpkekkekpk...',
        '...kppkkkkppk...',
        '..kppppppppppk..',
        '.kppddddddddppk.',
        '.kppddaaaaddppk.',
        '..kppddddddppk..',
        '...kppppppppk...',
        '...kpp.pp.ppk...',
        '....kp..p..k....',
        '.....k..k.......',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.....kkkkkk.....',
        '....kppppppk....',
        '...kppkkkkppk...',
        '...kpkeaaekpk...',
        '...kppkkkkppk...',
        '..kppppppppppk..',
        '.kppddddddddppk.',
        '.kppddaaaaddppk.',
        '..kppddddddppk..',
        '...kppppppppk...',
        '..kpp..pp..ppk..',
        '...k...p....k...',
        '................',
        '................',
        '................'
      ]
    },

    lich: {
      motion: 'px-motion-float',
      f1: [
        '....a..aa..a....',
        '....aaaaaaaa....',
        '....kwwwwwwk..e.',
        '....kwewwewk.ewe',
        '....kwwwwwwk..e.',
        '...kppwwwwppk.a.',
        '..kpppaaaapppka.',
        '..kppddddddppka.',
        '..kppdaaaadppka.',
        '...kppddddppk...',
        '...kppppppppk...',
        '...kpp.pp.ppk...',
        '....k......k....',
        '................',
        '................',
        '................'
      ],
      f2: [
        '....a..aa..a..w.',
        '....aaaaaaaa.wew',
        '....kwwwwwwk..e.',
        '....kwewwewk..a.',
        '....kwwwwwwk..a.',
        '...kppwwwwppk.a.',
        '..kpppaaaapppka.',
        '..kppddddddppka.',
        '..kppdaaaadppk..',
        '...kppddddppk...',
        '...kppppppppk...',
        '..kpp..pp..ppk..',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    vampire: {
      motion: 'px-motion-float',
      f1: [
        '..k..kkkkkk..k..',
        '.kpk.kddddk.kpk.',
        '.kppkwwwwwwkppk.',
        '.kppkwekkewkppk.',
        '.kppkwwrrwwkppk.',
        '..kppkddddkppk..',
        '..kppdaaaadppk..',
        '..kppddddddppk..',
        '..kppddrrddppk..',
        '...kppddddppk...',
        '...kppd..dppk...',
        '...kddk..kddk...',
        '..kddk....kddk..',
        '................',
        '................',
        '................'
      ],
      f2: [
        '.k...kkkkkk...k.',
        'kppk.kddddk.kppk',
        'kpppkwwwwwwkpppk',
        '.kppkwekkewkppk.',
        '.kppkwwrrwwkppk.',
        '..kppkddddkppk..',
        '..kppdaaaadppk..',
        '..kppddddddppk..',
        '..kppddrrddppk..',
        '...kppddddppk...',
        '...kppd..dppk...',
        '...kddk..kddk...',
        '..kddk....kddk..',
        '................',
        '................',
        '................'
      ]
    },

    demon: {
      motion: 'px-motion-heavy',
      f1: [
        '.aa..........aa.',
        '..ak..kkkk..ka..',
        'k..kkppppppkk..k',
        'kdk.kpekkepk.kdk',
        'kddk.kppppk.kddk',
        '.kddkppaaappkdk.',
        '..kkppppppppkk..',
        '...kppddddppk...',
        '...kppdaaadpk...',
        '...kppddddppk...',
        '...kpp....ppk...',
        '..kppk....kppk..',
        '..kddk....kddk..',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.aa..kkkk..aa...',
        '..akkppppppkka..',
        'kk..kpekkepk..kk',
        'kddk.kppppk.kddk',
        'kdddkppaaappkddk',
        '.kddppppppppddk.',
        '...kppddddppk...',
        '...kppdaaadpk...',
        '...kppddddppk...',
        '...kpp....ppk...',
        '..kppk....kppk..',
        '..kddk....kddk..',
        '................',
        '................',
        '................'
      ]
    },

    demogorgon: {
      motion: 'px-motion-heavy',
      f1: [
        '.kkkkk....kkkkk.',
        'kpppppk..kpppppk',
        'kpekepk..kpekepk',
        '.kpppk....kpppk.',
        '..kkppppppppkk..',
        'a..kppddddppk..a',
        '.a.kppdaaadpk.a.',
        '..kkppppppppkk..',
        '...kppddddppk...',
        '...kpp....ppk...',
        '..kppk....kppk..',
        '..kddk....kddk..',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.kkkkk....kkkkk.',
        'kpppppk..kpppppk',
        'kpekepk..kpekepk',
        '..kkppppppppkk..',
        '.a.kppddddppk.a.',
        'a..kppdaaadpk..a',
        '..kkppppppppkk..',
        '...kppddddppk...',
        '...kpp....ppk...',
        '..kppk....kppk..',
        '..kddk....kddk..',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    knight: {
      motion: 'px-motion-heavy',
      f1: [
        '.....aa..aa.....',
        '....kppppppk....',
        '....kpekkepk..w.',
        '....kppppppk.wa.',
        '...kkddddddkkwa.',
        '..kppdaaaadppka.',
        '..kppddddddppkk.',
        '..kppdppppdppk..',
        '...kkddddddkk...',
        '....kpp..ppk....',
        '....kdd..ddk....',
        '...kppk..kppk...',
        '...kddk..kddk...',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.....aa..aa...w.',
        '....kppppppk.wa.',
        '....kpekkepk.wa.',
        '....kppppppkkak.',
        '...kkddddddkk...',
        '..kppdaaaadppk..',
        '..kppddddddppk..',
        '..kppdppppdppk..',
        '...kkddddddkk...',
        '....kpp..ppk....',
        '....kdd..ddk....',
        '...kppk..kppk...',
        '...kddk..kddk...',
        '................',
        '................'
      ]
    },

    golem: {
      motion: 'px-motion-heavy',
      f1: [
        '....kkkkkkkk....',
        '...kppppppppk...',
        '...kppakkapkk...',
        '...kppppppppk...',
        '.kkkddddddddkkk.',
        'kppppddddddppppk',
        'kpppddaaaaddpppk',
        'kppppddddddppppk',
        'kppkppppppppkppk',
        'kppkddddddddkppk',
        '.kk.kpp..ppk.kk.',
        '....kpp..ppk....',
        '...kddk..kddk...',
        '...kddk..kddk...',
        '................',
        '................'
      ],
      f2: [
        '................',
        '....kkkkkkkk....',
        '...kppppppppk...',
        '...kppekkeppk...',
        '.kkkddddddddkkk.',
        'kppppddddddppppk',
        'kpppddaaaaddpppk',
        'kppppddddddppppk',
        'kppkppppppppkppk',
        'kppkddddddddkppk',
        '.kk.kpp..ppk.kk.',
        '....kpp..ppk....',
        '...kddk..kddk...',
        '...kddk..kddk...',
        '................',
        '................'
      ]
    },

    beast: {
      motion: 'px-motion-agile',
      f1: [
        '................',
        '..kk....kk......',
        '..kppkkppk......',
        '..kpekkepk......',
        '..kppwwppk......',
        '...kppppppkkkk..',
        '..kpppppppppppk.',
        '.kpppaaaappppppa',
        '.kppppppppppppka',
        '..kppp....pppk..',
        '..kpp......ppk..',
        '..kddk....kddk..',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '................',
        '..kk....kk......',
        '..kppkkppk......',
        '..kpekkepk.....a',
        '..kppwwppkkkk.a.',
        '..kppppppppppka.',
        '.kpppaaaapppppk.',
        '.kppppppppppppk.',
        '..kpp......ppk..',
        '.kpp........ppk.',
        '.kddk......kddk.',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    worm: {
      motion: 'px-motion-squish',
      f1: [
        '.....kkkkkk.....',
        '....kwwkkwwk....',
        '...kwkkkkkkwk...',
        '...kwkrrrrkwk...',
        '...kwwrrrrwwk...',
        '....kppppppk....',
        '...kppaaaappk...',
        '...kppppppppk...',
        '....kddddddk....',
        '.....kppppppk...',
        '......kppaaapk..',
        '.......kdddddk..',
        '........kkkkk...',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.....kkkkkk.....',
        '....kwwkkwwk....',
        '...kwkrrrrkwk...',
        '...kwwrrrrwwk...',
        '...kppppppppk...',
        '..kppaaaaappk...',
        '...kppppppppk...',
        '....kddddddk....',
        '....kppppppk....',
        '.....kppaaapk...',
        '......kdddddk...',
        '.......kkkkk....',
        '................',
        '................',
        '................'
      ]
    },

    mushroom: {
      motion: 'px-motion-squish',
      f1: [
        '....kkkkkkkk....',
        '..kkppppppppkk..',
        '.kppaaappppaaak.',
        'kppppppaaapppppk',
        'kppaaapppppppppk',
        '.kkkkkkkkkkkkkk.',
        '....kddddddk....',
        '...kddekkeddk...',
        '...kddddddddk...',
        '..kddkddddkddk..',
        '...kk.kddk.kk...',
        '.....kddddk.....',
        '....kdd..ddk....',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '...kkkkkkkkkk...',
        '.kkppppppppppkk.',
        'kppaaappppaaappk',
        'kppppppaaapppppk',
        '.kkkkkkkkkkkkkk.',
        '....kddddddk....',
        '...kddekkeddk...',
        '...kddddddddk...',
        '..kddkddddkddk..',
        '...kk.kddk.kk...',
        '.....kddddk.....',
        '....kdd..ddk....',
        '................',
        '................',
        '................'
      ]
    },

    serpent: {
      motion: 'px-motion-squish',
      f1: [
        '......kkkkkk....',
        '.....kppppppk...',
        '....kpekkeppk...',
        '....kppwwppk....',
        '.....kppppk.....',
        '......kppak.....',
        '.....kppak......',
        '....kppak.......',
        '...kppaaappkk...',
        '..kppppppppppk..',
        '..kddddddddddk..',
        '...kkkkkkkkkk...',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '.....kkkkkk.....',
        '....kppppppk....',
        '...kpekkeppk....',
        '...kppwwppk.....',
        '....kppppk......',
        '.....kppak......',
        '......kppak.....',
        '...kkppaaappk...',
        '..kppppppppppk..',
        '..kddddddddddk..',
        '...kkkkkkkkkk...',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    insect: {
      motion: 'px-motion-agile',
      f1: [
        '..a..........a..',
        '...ak..kk..ka...',
        '....kkppppkk....',
        '...kpppeepppk...',
        '..kppppppppppk..',
        '.k..kppaaappk..k',
        'k..kpppppppppk..',
        '..k.kddddddddk.k',
        '.k...kdd..ddk..k',
        'k....kdd..ddk...',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '...a........a...',
        '...ak..kk..ka...',
        '....kkppppkk....',
        '...kpppeepppk...',
        '..kppppppppppk..',
        'k...kppaaappk..k',
        '.k.kpppppppppk.k',
        '...kddddddddk...',
        '..k..kdd..ddk.k.',
        '.k...kdd..ddk..k',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    mage: {
      motion: 'px-motion-float',
      f1: [
        '......kkkk......',
        '.....kppppk.....',
        '....kppaaapk..e.',
        '...kkkkkkkkk.ewe',
        '....kpekkepk..e.',
        '....kwwwwwwk..a.',
        '...kppwwwwppk.a.',
        '..kpppaaaapppka.',
        '..kppddddddppka.',
        '..kppppppppppk..',
        '...kppddddppk...',
        '...kddk..kddk...',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '......kkkk....w.',
        '.....kppppk..wew',
        '....kppaaapk..e.',
        '...kkkkkkkkk..a.',
        '....kpekkepk..a.',
        '....kwwwwwwk..a.',
        '...kppwwwwppk.a.',
        '..kpppaaaapppka.',
        '..kppddddddppk..',
        '..kppppppppppk..',
        '...kppddddppk...',
        '...kddk..kddk...',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    frog: {
      motion: 'px-motion-agile',
      f1: [
        '....kk....kk....',
        '...kpek..kepk...',
        '..kppppppppppk..',
        '..kppwwwwwwppk..',
        '..kppppppppppk..',
        '.kpppaaaaaapppk.',
        '.kppppppppppppk.',
        '.kppkddddddkppk.',
        '..kk.kddddk.kk..',
        '..kppk....kppk..',
        '.kdddk....kdddk.',
        '................',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        '....kk....kk....',
        '...kpek..kepk...',
        '..kppppppppppk..',
        '.kpppwwwwwwpppk.',
        '.kpppaaaaaapppk.',
        '.kppppppppppppk.',
        '.kppkddddddkppk.',
        '..kk.kddddk.kk..',
        '.kppk......kppk.',
        'kdddk......kdddk',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    angel: {
      motion: 'px-motion-float',
      f1: [
        'kk....aaaa....kk',
        'kppk..kwwk..kppk',
        'kpppk.kpek.kpppk',
        '.kpppkwwwwkpppk.',
        '..kkppaaaappkk..',
        '...kppddddppk.a.',
        '...kppdaaadpkaw.',
        '...kppddddppka..',
        '....kpp..ppk....',
        '....kdd..ddk....',
        '...kddk..kddk...',
        '................',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '......aaaa......',
        '.kk...kwwk...kk.',
        'kpppk.kpek.kpppk',
        'kppppkwwwwkppppk',
        '.kppppaapppppk.a',
        '..kkppddddppkkaw',
        '...kppdaaadpk.a.',
        '...kppddddppk...',
        '....kpp..ppk....',
        '....kdd..ddk....',
        '...kddk..kddk...',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    },

    skull_lord: {
      motion: 'px-motion-float',
      f1: [
        'kwwwk.kwwwk.kwwwk'.slice(0, 16),
        'kwkwk.kwkwk.kwkw',
        'kwwwk.kwwwk.kwww',
        '.kkppppppppppkk.',
        '..kpppaaaapppk..',
        '..kppddddddppk..',
        '..kppdwwwwdppk..',
        '...kppddddppk...',
        '...kppppppppk...',
        '...kpp.pp.ppk...',
        '....k..pp..k....',
        '................',
        '................',
        '................',
        '................',
        '................'
      ],
      f2: [
        '................',
        'kwwwk.kwwwk.kwww',
        'kwewk.kwewk.kwew',
        '.kkppppppppppkk.',
        '..kpppaaaapppk..',
        '..kppddddddppk..',
        '..kppdwwwwdppk..',
        '...kppddddppk...',
        '...kppppppppk...',
        '..kpp..pp..ppk..',
        '...k...pp...k...',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    }
  };

  // Explicit per-monster mapping for ALL 82 monsters: EVERY SINGLE monster gets its own distinct silhouette + bespoke palette + boss/elite crown or unique aura!
  const MONSTER_SPECS = {
    // Act 1
    goblin_skirmisher:      { tpl: 'goblin', p: '#58b19f', d: '#2c5f4a', a: '#f6c967', e: '#ff4757' },
    kobold_inventor:        { tpl: 'goblin', p: '#e67e22', d: '#935116', a: '#00d2d3', e: '#f6e58d' },
    skeleton_warrior:       { tpl: 'skeleton', p: '#7f8fa6', d: '#485460', a: '#dcdde1', e: '#00d2d3' },
    orc_berserker:          { tpl: 'brute', p: '#44bd32', d: '#218c74', a: '#eb3b5a', e: '#ffdd59' },
    gelatinous_cube:        { tpl: 'slime', p: '#2ed573', d: '#1e8449', a: '#b8e994', e: '#ffffff' },
    gnoll_pack_lord:        { tpl: 'beast', p: '#cd853f', d: '#6e4720', a: '#eb3b5a', e: '#ffdd59' },
    rust_monster:           { tpl: 'insect', p: '#d35400', d: '#7e3517', a: '#f39c12', e: '#fff200' },
    carrion_crawler:        { tpl: 'worm', p: '#78e08f', d: '#38ada9', a: '#f6b93b', e: '#eb3b5a' },
    owlbear_alpha:          { tpl: 'beast', p: '#a06944', d: '#5d3a22', a: '#f5f6fa', e: '#f6c967', elite: true },
    bugbear_chieftain:      { tpl: 'brute', p: '#b3541e', d: '#642c0c', a: '#f6c967', e: '#ff4757', elite: true },
    mimic_hunter:           { tpl: 'mimic', p: '#9b5926', d: '#5c3312', a: '#f6c967', e: '#e056fd', elite: true },
    troll_warlord:          { tpl: 'brute', p: '#26de81', d: '#127345', a: '#eb3b5a', e: '#fed330', boss: true },
    manticore_ravager:      { tpl: 'dragon', p: '#d35400', d: '#7e3517', a: '#f6c967', e: '#ff4757', boss: true },
    beholder_xanathar:      { tpl: 'beholder', p: '#8e44ad', d: '#4a235a', a: '#f6c967', e: '#00d2d3', boss: true, crown: '#f6c967' },
    young_green_dragon:     { tpl: 'dragon', p: '#27ae60', d: '#145a32', a: '#7bed9f', e: '#fff200', boss: true },
    ettin_king_gror:        { tpl: 'ettin', p: '#95a5a6', d: '#535c68', a: '#eb3b5a', e: '#f6c967', boss: true, crown: '#f6c967' },
    goblin_shaman_king:     { tpl: 'goblin', p: '#c0392b', d: '#641e16', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },

    // Act 2
    drow_assassin:          { tpl: 'knight', p: '#4834d4', d: '#1e1654', a: '#2ed573', e: '#ff4757' },
    hook_horror:            { tpl: 'insect', p: '#576574', d: '#222f3e', a: '#c8d6e5', e: '#f6e58d' },
    giant_phase_spider:     { tpl: 'spider', p: '#18dcff', d: '#192a56', a: '#ffffff', e: '#ff4757' },
    duergar_hammerer:       { tpl: 'brute', p: '#636e72', d: '#2d3436', a: '#ff9f43', e: '#ff6b6b' },
    displacer_beast:        { tpl: 'beast', p: '#2f3542', d: '#131620', a: '#a29bfe', e: '#2ed573' },
    basilisk_gazer:         { tpl: 'serpent', p: '#218c74', d: '#0d473b', a: '#b8e994', e: '#2ed573' },
    ochre_jelly:            { tpl: 'slime', p: '#f6b93b', d: '#b7791f', a: '#ffeaa7', e: '#eb3b5a' },
    myconid_sovereign:      { tpl: 'mushroom', p: '#9b59b6', d: '#dfe6e9', a: '#55efc4', e: '#ffdd59' },
    drider_champion:        { tpl: 'spider', p: '#6c5ce7', d: '#2d1e54', a: '#e056fd', e: '#ff4757', elite: true },
    umbeR_hulk:             { tpl: 'golem', p: '#7f6244', d: '#3d2c1e', a: '#f6e58d', e: '#ff4757', elite: true },
    roper_ambusher:         { tpl: 'worm', p: '#7f8c8d', d: '#34495e', a: '#ff6b81', e: '#ff4757', elite: true },
    drow_priestess:         { tpl: 'mage', p: '#6c5ce7', d: '#2d1e54', a: '#e056fd', e: '#ff4757', boss: true },
    cloaker_shadow:         { tpl: 'wraith', p: '#2c3a47', d: '#141b24', a: '#ff4757', e: '#ff4757', boss: true },
    arachne_matron:         { tpl: 'spider', p: '#c0392b', d: '#2d0c16', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },
    aboleth_leviathan:      { tpl: 'serpent', p: '#00a8ff', d: '#192a56', a: '#ff4757', e: '#ff6b81', boss: true },
    purple_worm_titan:      { tpl: 'worm', p: '#8e44ad', d: '#4a235a', a: '#e056fd', e: '#ffeaa7', boss: true },
    duergar_despot:         { tpl: 'golem', p: '#d35400', d: '#2c3e50', a: '#f6c967', e: '#ff4757', boss: true, crown: '#f6c967' },

    // Act 3
    intellect_devourer:     { tpl: 'brain', p: '#fd79a8', d: '#b33939', a: '#ffeaa7', e: '#ffffff' },
    mind_flayer_arcanist:   { tpl: 'mindflayer', p: '#a29bfe', d: '#341f97', a: '#00d2d3', e: '#ffffff' },
    grimlock_brute:         { tpl: 'brute', p: '#8395a7', d: '#3d4854', a: '#c8d6e5', e: '#576574' },
    nothics_eye:            { tpl: 'beholder', p: '#2ecc71', d: '#145a32', a: '#b8e994', e: '#2ed573' },
    chuul_pincer:           { tpl: 'insect', p: '#00b894', d: '#005b47', a: '#ff7675', e: '#ffdd59' },
    grell_strangler:        { tpl: 'brain', p: '#fab1a0', d: '#d63031', a: '#ffeaa7', e: '#2d3436' },
    otyugh_filth:           { tpl: 'worm', p: '#8c7ae6', d: '#4b4b2a', a: '#badc58', e: '#ffdd59' },
    slaad_death:            { tpl: 'frog', p: '#2f3542', d: '#141720', a: '#eb3b5a', e: '#2ed573' },
    mind_flayer_inquisitor: { tpl: 'mindflayer', p: '#e056fd', d: '#4a1259', a: '#f6c967', e: '#ffdd59', elite: true },
    githyanki_kithrak:      { tpl: 'knight', p: '#badc58', d: '#535c68', a: '#7ed6df', e: '#f6c967', elite: true },
    beholder_zombie_elite:  { tpl: 'beholder', p: '#557a46', d: '#2c3e26', a: '#badc58', e: '#eb3b5a', elite: true },
    ulitharid_lord:         { tpl: 'mindflayer', p: '#6c5ce7', d: '#1e1142', a: '#ff7675', e: '#00d2d3', boss: true, crown: '#00d2d3' },
    mindwitness_overseer:   { tpl: 'beholder', p: '#9b59b6', d: '#2c1654', a: '#e056fd', e: '#ff7675', boss: true },
    elder_brain_prime:      { tpl: 'brain', p: '#e056fd', d: '#4834d4', a: '#00d2d3', e: '#ffffff', boss: true, crown: '#00d2d3' },
    beholder_hive_mother:   { tpl: 'beholder', p: '#eb3b5a', d: '#581845', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },
    githyanki_supreme:      { tpl: 'knight', p: '#f6c967', d: '#2c3e50', a: '#00d2d3', e: '#ff4757', boss: true, crown: '#f6c967' },
    neothelid_leviathan:    { tpl: 'worm', p: '#a29bfe', d: '#341f97', a: '#ff7675', e: '#00d2d3', boss: true },

    // Act 4
    wight_executioner:      { tpl: 'skeleton', p: '#485460', d: '#1e272e', a: '#00d2d3', e: '#00d2d3' },
    wraith_stalker:         { tpl: 'wraith', p: '#34495e', d: '#121821', a: '#74b9ff', e: '#00d2d3' },
    flesh_golem:            { tpl: 'golem', p: '#a4b0be', d: '#57606f', a: '#ff6b81', e: '#2ed573' },
    vampire_spawn:          { tpl: 'vampire', p: '#706fd3', d: '#2c2c54', a: '#ff4757', e: '#ff4757' },
    banshee_wailer:         { tpl: 'wraith', p: '#7ed6df', d: '#22a6b3', a: '#ffffff', e: '#dff9fb' },
    bone_naga:              { tpl: 'serpent', p: '#dcdde1', d: '#718093', a: '#2ed573', e: '#2ed573' },
    mummy_guardian:         { tpl: 'skeleton', p: '#eccc68', d: '#9c7c38', a: '#f6c967', e: '#ff4757' },
    shadow_demon:           { tpl: 'demon', p: '#2f3542', d: '#0d0f17', a: '#a29bfe', e: '#e056fd' },
    death_knight_general:   { tpl: 'knight', p: '#2c3a47', d: '#10141c', a: '#ff4757', e: '#ff4757', elite: true },
    iron_golem_sentinel:    { tpl: 'golem', p: '#95a5a6', d: '#2f3640', a: '#ff9f43', e: '#ff4757', elite: true },
    skull_lord_elite:       { tpl: 'skull_lord', p: '#4b4b4b', d: '#1e1e2c', a: '#2ed573', e: '#2ed573', elite: true },
    vampire_lord_strahd:    { tpl: 'vampire', p: '#eb3b5a', d: '#1c1018', a: '#f6c967', e: '#ff4757', boss: true, crown: '#f6c967' },
    nightwalker_titan:      { tpl: 'wraith', p: '#1e272e', d: '#080a0f', a: '#e056fd', e: '#e056fd', boss: true },
    archlich_acererak:      { tpl: 'lich', p: '#6c5ce7', d: '#1e1438', a: '#2ed573', e: '#2ed573', boss: true, crown: '#f6c967' },
    dracolich_aurinax:      { tpl: 'dragon', p: '#dcdde1', d: '#485460', a: '#00d2d3', e: '#00d2d3', boss: true },
    death_tyrant_beholder:  { tpl: 'beholder', p: '#dcdde1', d: '#2f3542', a: '#ff4757', e: '#ff4757', boss: true, crown: '#ff4757' },
    lord_soth_deathknight:  { tpl: 'knight', p: '#1e1e2c', d: '#0b0b12', a: '#ff6b81', e: '#ff4757', boss: true, crown: '#ff6b81' },

    // Act 5
    bearded_devil:          { tpl: 'demon', p: '#c0392b', d: '#641e16', a: '#ff9f43', e: '#ffdd59' },
    erinyes_valkyrie:       { tpl: 'angel', p: '#eb3b5a', d: '#2c1926', a: '#f6c967', e: '#ff4757' },
    red_abishai:            { tpl: 'dragon', p: '#e74c3c', d: '#78281f', a: '#f6c967', e: '#fff200' },
    hellfire_engine:        { tpl: 'golem', p: '#4a231c', d: '#1e0e0b', a: '#ff6b6b', e: '#ffdd59' },
    chain_devil_kyton:      { tpl: 'knight', p: '#7f8fa6', d: '#2f3640', a: '#ff6b6b', e: '#ff4757' },
    horned_devil_malebranche:{ tpl: 'demon', p: '#e67e22', d: '#6e2c00', a: '#f6c967', e: '#ff4757' },
    pit_fiend_overlord:     { tpl: 'demon', p: '#eb3b5a', d: '#4d0f18', a: '#ffdd59', e: '#ffffff', elite: true },
    ancient_red_dragon:     { tpl: 'dragon', p: '#ff4757', d: '#8b0000', a: '#ffd32a', e: '#ffffff', elite: true },
    balor_abyssal_lord:     { tpl: 'demon', p: '#ff3838', d: '#3d0814', a: '#ff9f1a', e: '#fff200', elite: true },
    zariel_archduke:        { tpl: 'angel', p: '#ff6b6b', d: '#3b151e', a: '#ffd32a', e: '#ffffff', boss: true, crown: '#ffd32a' },
    tiamat_dragon_queen:    { tpl: 'tiamat', p: '#ff4757', d: '#2d132c', a: '#f6c967', e: '#ffffff', boss: true, crown: '#f6c967' },
    asmodeus_lord_of_ninth: { tpl: 'vampire', p: '#ff2e4c', d: '#240811', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },
    demogorgon_prince:      { tpl: 'demogorgon', p: '#8e44ad', d: '#1c2833', a: '#2ed573', e: '#ff4757', boss: true, crown: '#2ed573' },
    halaster_mad_mage:      { tpl: 'mage', p: '#9b59b6', d: '#1b1464', a: '#00d2d3', e: '#f6c967', boss: true, crown: '#00d2d3' }
  };

  function generateMonsterSprite(id) {
    const spec = MONSTER_SPECS[id] || { tpl: 'brute', p: '#e74c3c', d: '#641e16', a: '#f6c967', e: '#ffffff' };
    const tpl = TEMPLATES[spec.tpl] || TEMPLATES.brute;
    const pal = {
      k: '#0e1018',
      p: spec.p,
      d: spec.d,
      a: spec.a,
      e: spec.e,
      w: '#f5f6fa',
      r: '#ff4757',
      b: '#3498db',
      g: '#2ed573',
      y: '#f6c967'
    };

    // Add unique boss crown / elite rune / subtle deterministic pixel crest so EVERY monster ID is 100% visually unique!
    const h = hashStr(id);
    let extraF1 = '';
    let extraF2 = '';
    if (spec.crown) {
      extraF1 += `<rect x="5" y="0" width="1" height="2" fill="${spec.crown}"/><rect x="7" y="0" width="2" height="2" fill="${spec.crown}"/><rect x="10" y="0" width="1" height="2" fill="${spec.crown}"/><rect x="5" y="1" width="6" height="1" fill="${spec.crown}"/>`;
      extraF2 += `<rect x="5" y="1" width="1" height="2" fill="${spec.crown}"/><rect x="7" y="0" width="2" height="2" fill="#ffffff"/><rect x="10" y="1" width="1" height="2" fill="${spec.crown}"/><rect x="5" y="1" width="6" height="1" fill="${spec.crown}"/>`;
    } else if (spec.elite) {
      extraF1 += `<rect x="1" y="1" width="2" height="1" fill="${spec.a}"/><rect x="13" y="1" width="2" height="1" fill="${spec.a}"/>`;
      extraF2 += `<rect x="1" y="2" width="2" height="1" fill="${spec.e}"/><rect x="13" y="2" width="2" height="1" fill="${spec.e}"/>`;
    } else {
      // Unique floating ambient spark/rune per monster ID
      const sx = 1 + (h % 3);
      const sy = 1 + ((h >> 4) % 4);
      extraF1 += `<rect x="${sx}" y="${sy}" width="1" height="1" fill="${spec.a}" opacity="0.85"/>`;
      extraF2 += `<rect x="${14 - sx}" y="${sy + 1}" width="1" height="1" fill="${spec.e}" opacity="0.85"/>`;
    }

    return buildPixelSvg(tpl.f1, tpl.f2, pal, {
      motion: tpl.motion,
      isBoss: !!spec.boss,
      aura: spec.boss ? spec.a : spec.elite ? spec.p : '',
      extraF1,
      extraF2
    });
  }

  // Inject crisp animated pixel-art sprites into window.GAME_DATA immediately on load!
  function applyPixelSprites(gameData) {
    if (!gameData) return;
    if (gameData.characters) {
      Object.keys(gameData.characters).forEach(cid => {
        if (HERO_SPRITES[cid]) {
          gameData.characters[cid].avatarSvg = HERO_SPRITES[cid]();
        }
      });
    }
    if (gameData.enemies) {
      Object.keys(gameData.enemies).forEach(eid => {
        gameData.enemies[eid].svg = generateMonsterSprite(eid);
        // Clean up 2 raw English text prefixes in enemy names
        if (gameData.enemies[eid].name) {
          gameData.enemies[eid].name = gameData.enemies[eid].name
            .replace(/^Tentacle\s+/, '🦑 ')
            .replace(/^\s*bandages\s+/, '🩹 ');
        }
      });
    }
  }

  window.PIXEL_SPRITES = { HERO_SPRITES, MONSTER_SPECS, generateMonsterSprite, applyPixelSprites };
  if (window.GAME_DATA) {
    applyPixelSprites(window.GAME_DATA);
  }
})();
