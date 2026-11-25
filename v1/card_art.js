// ============================================================================
// D&D 5E SPIRE II — FINE PIXEL-ART SKILL & CARD ILLUSTRATION ENGINE (card_art.js)
// - 48x24 Crisp 2:1 Widescreen Pixel-Art Illustrations for ALL 359 Cards/Skills
// - 32 Handcrafted D&D Weapon / Spell / Companion / Aura / Status Pixel Motifs
// - 3-Tone Cel Shading + 1px Ink Outlines + Subclass Palettes + Rarity Filigree
// - Lazy Cached PNG Data URLs (<0.2ms per card, 100% unique 359/359!)
// ============================================================================
(function () {
  const W = 48;
  const H = 24;

  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    const cl = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [cl(r), cl(g), cl(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function shade(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    if (factor > 0) return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
    const f = 1 + factor;
    return rgbToHex(r * f, g * f, b * f);
  }
  function shiftHueRgb(hex, shift) {
    if (!shift) return hex;
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + shift[0], g + shift[1], b + shift[2]);
  }

  // Dual-Layer Pixel Canvas (Background layer + Foreground motif layer with auto 1px outline!)
  class SkillCanvas {
    constructor(w = W, h = H) {
      this.w = w;
      this.h = h;
      this.bg = new Array(w * h).fill('#0d101c');
      this.fg = new Array(w * h).fill(null);
    }
    bgPx(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h) return;
      this.bg[iy * this.w + ix] = c;
    }
    px(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h) return;
      this.fg[iy * this.w + ix] = c;
    }
    rect(x, y, w, h, c) {
      for (let dy = 0; dy < Math.round(h); dy++) {
        for (let dx = 0; dx < Math.round(w); dx++) this.px(x + dx, y + dy, c);
      }
    }
    shadedRect(x, y, w, h, base) {
      const hi = shade(base, 0.3), lo = shade(base, -0.35);
      const rw = Math.round(w), rh = Math.round(h);
      for (let dy = 0; dy < rh; dy++) {
        for (let dx = 0; dx < rw; dx++) {
          let c = base;
          if (dy === 0 || dx === 0) c = hi;
          else if (dy === rh - 1 || dx === rw - 1) c = lo;
          this.px(x + dx, y + dy, c);
        }
      }
    }
    oval(cx, cy, rx, ry, base, shaded = true) {
      const hi = shaded ? shade(base, 0.32) : base;
      const lo = shaded ? shade(base, -0.35) : base;
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const nx = (x - cx) / rx, ny = (y - cy) / ry;
          if (nx * nx + ny * ny <= 1) {
            let c = base;
            if (shaded) {
              if (nx + ny < -0.55) c = hi;
              else if (nx + ny > 0.55) c = lo;
            }
            this.px(x, y, c);
          }
        }
      }
    }
    line(x0, y0, x1, y1, c, thick = 1) {
      let ix0 = Math.round(x0), iy0 = Math.round(y0), ix1 = Math.round(x1), iy1 = Math.round(y1);
      const dx = Math.abs(ix1 - ix0), dy = Math.abs(iy1 - iy0);
      const sx = ix0 < ix1 ? 1 : -1, sy = iy0 < iy1 ? 1 : -1;
      let err = dx - dy;
      while (true) {
        this.px(ix0, iy0, c);
        if (thick > 1) { this.px(ix0 + 1, iy0, c); this.px(ix0, iy0 + 1, c); }
        if (thick > 2) { this.px(ix0 - 1, iy0, c); this.px(ix0, iy0 - 1, c); }
        if (ix0 === ix1 && iy0 === iy1) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; ix0 += sx; }
        if (e2 < dx) { err += dx; iy0 += sy; }
      }
    }
    bgGrad(cTop, cBot) {
      for (let y = 0; y < this.h; y++) {
        const frac = y / (this.h - 1);
        for (let x = 0; x < this.w; x++) {
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          this.bg[y * this.w + x] = frac > thr ? cBot : cTop;
        }
      }
    }
    bgGlow(cx, cy, r, cCore, cOuter) {
      for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(this.h - 1, Math.ceil(cy + r)); y++) {
        for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(this.w - 1, Math.ceil(cx + r)); x++) {
          const d = Math.hypot(x - cx, y - cy) / r;
          if (d >= 1) continue;
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          if (d < 0.45 && (0.45 - d) / 0.45 > thr * 0.6) this.bg[y * this.w + x] = cCore;
          else if ((1 - d) > thr) this.bg[y * this.w + x] = cOuter;
        }
      }
    }
    // Crisp 1px dark outline around foreground motif
    outlineFg(col = '#0d0d16') {
      const marks = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.fg[y * this.w + x] !== null) continue;
          const hit =
            (x > 0 && this.fg[y * this.w + x - 1]) ||
            (x < this.w - 1 && this.fg[y * this.w + x + 1]) ||
            (y > 0 && this.fg[(y - 1) * this.w + x]) ||
            (y < this.h - 1 && this.fg[(y + 1) * this.w + x]);
          if (hit) marks.push(y * this.w + x);
        }
      }
      for (const idx of marks) this.fg[idx] = col;
    }
    compose() {
      const out = new Array(this.w * this.h);
      for (let i = 0; i < out.length; i++) out[i] = this.fg[i] || this.bg[i];
      return out;
    }
    toDataURL() {
      if (typeof document === 'undefined') return '';
      const canvas = document.createElement('canvas');
      canvas.width = this.w;
      canvas.height = this.h;
      const ctx = canvas.getContext('2d');
      const img = ctx.createImageData(this.w, this.h);
      const data = img.data;
      const pixels = this.compose();
      const rgbCache = {};
      for (let i = 0; i < pixels.length; i++) {
        const hex = pixels[i];
        let rgb = rgbCache[hex];
        if (!rgb) { rgb = hexToRgb(hex); rgbCache[hex] = rgb; }
        const o = i * 4;
        data[o] = rgb[0]; data[o + 1] = rgb[1]; data[o + 2] = rgb[2]; data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      return canvas.toDataURL('image/png');
    }
    fingerprint() {
      const pixels = this.compose();
      let h = 2166136261;
      const cols = new Set();
      for (let i = 0; i < pixels.length; i++) {
        const s = pixels[i];
        cols.add(s);
        for (let j = 1; j < s.length; j++) {
          h ^= s.charCodeAt(j);
          h = Math.imul(h, 16777619);
        }
      }
      return { hash: (h >>> 0).toString(16), colors: cols.size };
    }
  }

  // ==========================================================================
  // SUBCLASS & CLASS BESPOKE PALETTES
  // ==========================================================================
  const SUBCLASS_PALETTES = {
    // Fighter
    fighter:            { bg1: '#141d2e', bg2: '#23344f', p: '#dfe6e9', a: '#f6c967', e: '#74b9ff' },
    champion:           { bg1: '#241219', bg2: '#421d28', p: '#ecf0f1', a: '#ff4757', e: '#f6c967' },
    battlemaster:       { bg1: '#152033', bg2: '#253c5e', p: '#cfd8dc', a: '#f6c967', e: '#54a0ff' },
    eldritch_knight:    { bg1: '#121836', bg2: '#222d63', p: '#74b9ff', a: '#00d2d3', e: '#ffeaa7' },
    echo_knight:        { bg1: '#14122b', bg2: '#282352', p: '#a29bfe', a: '#00d2d3', e: '#ffffff' },
    // Barbarian
    barbarian:          { bg1: '#291010', bg2: '#4a1b16', p: '#ff6b6b', a: '#ff9f43', e: '#ffeaa7' },
    berserker:          { bg1: '#2b090e', bg2: '#54121a', p: '#eb3b5a', a: '#ff4757', e: '#fff200' },
    totem_warrior:      { bg1: '#172116', bg2: '#2b3d24', p: '#e1b12c', a: '#55efc4', e: '#f6c967' },
    ancestral_guardian: { bg1: '#122129', bg2: '#1f3d4a', p: '#7ed6df', a: '#dff9fb', e: '#f6c967' },
    wild_magic:         { bg1: '#261133', bg2: '#451d5c', p: '#e056fd', a: '#00d2d3', e: '#ffdd59' },
    // Rogue
    rogue:              { bg1: '#101a1b', bg2: '#1b302e', p: '#2ed573', a: '#dfe6e9', e: '#55efc4' },
    thief:              { bg1: '#1e1b14', bg2: '#383020', p: '#f6c967', a: '#dfe6e9', e: '#ff9f43' },
    assassin:           { bg1: '#0e1f16', bg2: '#193b27', p: '#2ed573', a: '#eb3b5a', e: '#b8e994' },
    arcane_trickster:   { bg1: '#181433', bg2: '#2d245c', p: '#a29bfe', a: '#18dcff', e: '#f6c967' },
    phantom:            { bg1: '#121424', bg2: '#222845', p: '#7ed6df', a: '#c56cf0', e: '#ffffff' },
    // Ranger
    ranger:             { bg1: '#0e2116', bg2: '#1a3d28', p: '#2ed573', a: '#f6c967', e: '#55efc4' },
    hunter_conclave:    { bg1: '#172414', bg2: '#2b4222', p: '#badc58', a: '#ff9f43', e: '#ffffff' },
    beast_master:       { bg1: '#1b1629', bg2: '#33284a', p: '#a29bfe', a: '#55efc4', e: '#f6c967' },
    gloom_stalker:      { bg1: '#0b0e1c', bg2: '#19203b', p: '#74b9ff', a: '#c56cf0', e: '#00d2d3' },
    fey_wanderer:       { bg1: '#211229', bg2: '#3d1f4d', p: '#fd79a8', a: '#55efc4', e: '#ffeaa7' },
    // Wizard
    wizard:             { bg1: '#0e1730', bg2: '#1b2e5c', p: '#00d2d3', a: '#74b9ff', e: '#ffeaa7' },
    evocation:          { bg1: '#2b120c', bg2: '#542114', p: '#ff6b35', a: '#ffd32a', e: '#ffffff' },
    abjuration:         { bg1: '#0e1f30', bg2: '#193a59', p: '#18dcff', a: '#dff9fb', e: '#f6c967' },
    necromancy:         { bg1: '#0d1f19', bg2: '#183b2e', p: '#2ed573', a: '#c56cf0', e: '#b8e994' },
    divination:         { bg1: '#1b1433', bg2: '#33255e', p: '#f6c967', a: '#7ed6df', e: '#ffffff' },
    // Cleric
    cleric:             { bg1: '#241e12', bg2: '#42361e', p: '#f6c967', a: '#ffffff', e: '#74b9ff' },
    life_domain:        { bg1: '#12261e', bg2: '#1f4536', p: '#55efc4', a: '#ffeaa7', e: '#ffffff' },
    light_domain:       { bg1: '#2e1d0d', bg2: '#573616', p: '#ffd32a', a: '#ff9f43', e: '#ffffff' },
    war_domain:         { bg1: '#291418', bg2: '#4d222a', p: '#f6c967', a: '#ff4757', e: '#ffffff' },
    grave_domain:       { bg1: '#161426', bg2: '#292447', p: '#a29bfe', a: '#2ed573', e: '#dff9fb' },
    // Paladin
    paladin:            { bg1: '#261f10', bg2: '#47391b', p: '#f6c967', a: '#ffeaa7', e: '#74b9ff' },
    devotion:           { bg1: '#1c2436', bg2: '#334263', p: '#ffeaa7', a: '#74b9ff', e: '#ffffff' },
    vengeance:          { bg1: '#291016', bg2: '#4d1b26', p: '#ff6b81', a: '#f6c967', e: '#fff200' },
    conquest:           { bg1: '#1c1829', bg2: '#362d4f', p: '#dfe6e9', a: '#e056fd', e: '#f6c967' },
    oathbreaker:        { bg1: '#210b12', bg2: '#401220', p: '#eb3b5a', a: '#9b59b6', e: '#ffdd59' },
    // Warlock
    warlock:            { bg1: '#1e0d2b', bg2: '#381652', p: '#e056fd', a: '#a29bfe', e: '#00d2d3' },
    fiend_patron:       { bg1: '#2b0c0f', bg2: '#52151b', p: '#ff4757', a: '#ff9f43', e: '#fff200' },
    hexblade:           { bg1: '#19102b', bg2: '#2f1d52', p: '#c56cf0', a: '#dfe6e9', e: '#ff4757' },
    great_old_one:      { bg1: '#0c1829', bg2: '#172e4d', p: '#00d2d3', a: '#e056fd', e: '#ffffff' },
    archfey_chain:      { bg1: '#142422', bg2: '#23423d', p: '#55efc4', a: '#fd79a8', e: '#f6c967' },
    // Neutral / Status / Curse
    status:             { bg1: '#1b1f26', bg2: '#2f3640', p: '#badc58', a: '#ff9f43', e: '#ffffff' },
    curse:              { bg1: '#240812', bg2: '#450d20', p: '#eb3b5a', a: '#9b59b6', e: '#ffdd59' }
  };

  // ==========================================================================
  // 32 BESPOKE 48x24 PIXEL-ART SKILL MOTIFS
  // ==========================================================================
  const MOTIFS = {
    sword_slash(g, p, v) {
      const flip = (v & 1) ? -1 : 1;
      // Dynamic Crescent Slash Wave
      for (let i = -8; i <= 8; i++) {
        const sx = 24 + flip * (i * 1.4);
        const sy = 12 - Math.cos(i * 0.19) * 7 + (i * 0.25);
        g.px(sx, sy, '#ffffff');
        g.px(sx - flip, sy + 1, p.a);
        g.px(sx - flip * 2, sy + 2, p.e);
      }
      // Gleaming Knight Sword diagonal
      g.line(14, 19, 32, 4, p.p, 2);
      g.line(15, 18, 32, 4, '#ffffff', 1);
      g.line(12, 14, 19, 20, p.a, 2); // crossguard
      g.line(10, 21, 14, 18, '#784212', 2); // hilt
    },

    greataxe(g, p) {
      // Heavy Double-Bit Battleaxe + Shockwave Sparks
      g.line(16, 21, 31, 4, '#8d5524', 2);
      g.oval(24, 9, 5, 6, p.p);
      g.oval(32, 14, 5, 6, p.p);
      g.line(20, 6, 20, 12, '#ffffff', 1);
      g.line(36, 11, 36, 17, '#ffffff', 1);
      g.line(9, 10, 15, 7, p.a, 1);
      g.line(37, 6, 42, 9, p.e, 1);
    },

    dagger_poison(g, p) {
      // Twin Crossed Venom Daggers + Dripping Drops
      g.line(12, 18, 28, 5, '#dfe6e9', 2);
      g.line(25, 5, 29, 5, p.p, 1);
      g.line(36, 18, 20, 5, '#dfe6e9', 2);
      g.line(19, 5, 23, 5, p.p, 1);
      g.rect(11, 16, 4, 3, p.a);
      g.rect(33, 16, 4, 3, p.a);
      // Poison droplets
      g.oval(24, 17, 2, 2.5, p.p);
      g.px(24, 16, '#ffffff');
      g.px(16, 11, p.e); g.px(32, 11, p.e);
    },

    bow_arrow(g, p) {
      // Ornate Longbow + Glowing Arrow Comet Streak!
      g.line(13, 3, 19, 12, '#a0522d', 2);
      g.line(19, 12, 13, 21, '#a0522d', 2);
      g.line(13, 4, 13, 20, '#dfe6e9', 1);
      // Blazing Arrow
      g.line(12, 12, 37, 12, p.p, 2);
      g.line(18, 12, 37, 12, '#ffffff', 1);
      g.line(34, 9, 39, 12, p.a, 2);
      g.line(34, 15, 39, 12, p.a, 2);
      g.line(9, 10, 12, 12, p.e, 1);
      g.line(9, 14, 12, 12, p.e, 1);
    },

    spear_charge(g, p) {
      // Cavalry Lance / War Spear Thrust + Speed Lines
      g.line(7, 14, 38, 10, '#8d5524', 2);
      g.line(31, 8, 41, 9, '#ecf0f1', 2);
      g.line(31, 12, 41, 10, p.p, 2);
      g.rect(28, 7, 3, 7, p.a);
      g.line(8, 6, 22, 6, p.e, 1);
      g.line(12, 19, 28, 18, p.a, 1);
    },

    shield_ward(g, p) {
      // Heraldic Tower Shield + Glowing Barrier Arc
      g.shadedRect(18, 4, 12, 12, p.p);
      g.oval(24, 16, 6, 5, p.p);
      g.rect(23, 6, 2, 12, p.a);
      g.rect(20, 9, 8, 2, p.a);
      // Barrier arcs left/right
      for (let i = -5; i <= 5; i++) {
        g.px(12 + Math.abs(i) * 0.4, 12 + i, p.e);
        g.px(36 - Math.abs(i) * 0.4, 12 + i, p.e);
      }
    },

    hex_blade(g, p) {
      // Cursed Runeblade wrapped in Violet-Crimson Soul Fire
      g.line(14, 20, 34, 4, '#2f3542', 3);
      g.line(16, 18, 34, 4, p.p, 1);
      g.line(12, 15, 20, 21, p.a, 2);
      // Swirling hex ribbon around blade
      g.line(19, 11, 25, 15, p.e, 1);
      g.line(25, 15, 31, 9, p.p, 1);
      g.px(24, 11, '#ffffff'); g.px(29, 7, '#ffffff');
    },

    echo_shadow(g, p) {
      // Twin Ghostly Echo Afterimages Slashing Together
      // Ghost figure (left)
      g.oval(17, 8, 3.5, 3.5, p.p);
      g.shadedRect(14, 12, 6, 8, p.p);
      g.line(20, 14, 25, 7, '#ffffff', 1);
      // Solid shadow echo (right)
      g.oval(31, 8, 3.5, 3.5, p.a);
      g.shadedRect(28, 12, 6, 8, p.a);
      g.line(28, 14, 23, 7, p.e, 1);
      // Quantum tether line
      g.line(20, 15, 28, 15, '#ffffff', 1);
    },

    fire_burst(g, p) {
      // Blazing Fireball Comet / Inferno Plume
      g.oval(24, 13, 8, 7, '#eb3b5a');
      g.oval(24, 12, 6, 5.5, '#ff9f43');
      g.oval(24, 13, 3.5, 3.5, '#fff200');
      g.px(24, 13, '#ffffff');
      // Dancing Flame Tongues
      g.line(18, 9, 15, 4, '#ff6b35', 2);
      g.line(24, 7, 24, 2, '#ffd32a', 2);
      g.line(30, 9, 33, 4, '#ff6b35', 2);
      g.px(11, 8, p.a); g.px(37, 9, p.a);
    },

    frost_ice(g, p) {
      // Crystalline Sapphire-Cyan Snowflake & Ice Shards
      g.line(24, 3, 24, 21, '#dff9fb', 2);
      g.line(15, 7, 33, 17, '#74b9ff', 2);
      g.line(33, 7, 15, 17, '#74b9ff', 2);
      g.oval(24, 12, 4, 4, '#00d2d3');
      g.rect(23, 11, 2, 2, '#ffffff');
      g.px(13, 12, '#ffffff'); g.px(35, 12, '#ffffff');
    },

    lightning_bolt(g, p) {
      // Crackling Jagged Thunderbolt Fork!
      g.line(27, 2, 19, 11, '#ffd32a', 3);
      g.line(19, 11, 28, 11, '#ffffff', 2);
      g.line(28, 11, 20, 21, '#ffd32a', 3);
      g.line(26, 3, 20, 11, '#ffffff', 1);
      g.line(27, 11, 21, 20, '#ffffff', 1);
      // Secondary arcs
      g.line(19, 11, 12, 14, p.e, 1);
      g.line(28, 11, 36, 8, p.e, 1);
    },

    arcane_orb(g, p) {
      // Glowing Crystal Arcane Orb + 3 Orbiting Magic Missiles!
      g.oval(24, 12, 6, 6, p.p);
      g.oval(23, 11, 3.5, 3.5, p.a);
      g.rect(21, 9, 2, 2, '#ffffff');
      // 3 Missile bolts
      [[11, 6], [36, 7], [34, 18]].forEach(([mx, my]) => {
        g.oval(mx, my, 2, 2, p.e);
        g.px(mx, my, '#ffffff');
      });
      g.line(13, 17, 18, 14, p.a, 1);
    },

    eldritch_beam(g, p) {
      // Crackling Void Laser Beam blasting across the frame!
      g.oval(11, 12, 5, 5, p.p);
      g.oval(11, 12, 2.5, 2.5, '#ffffff');
      g.rect(14, 9, 26, 6, p.p);
      g.rect(14, 10, 27, 4, p.a);
      g.rect(15, 11, 27, 2, '#ffffff');
      // Crackling energy rings along beam
      [20, 28, 35].forEach(rx => g.line(rx, 6, rx, 18, p.e, 1));
    },

    counter_rune(g, p) {
      // Geometric Glowing Abjuration Ward Diamond + Concentric Hex
      g.line(24, 3, 35, 12, p.p, 2);
      g.line(35, 12, 24, 21, p.p, 2);
      g.line(24, 21, 13, 12, p.p, 2);
      g.line(13, 12, 24, 3, p.p, 2);
      g.oval(24, 12, 4, 4, p.a);
      g.rect(23, 11, 2, 2, '#ffffff');
      g.px(10, 12, p.e); g.px(38, 12, p.e);
    },

    divine_sun(g, p) {
      // Radiant Holy Sunburst Pillar descending from Heaven!
      g.rect(20, 2, 8, 20, p.p);
      g.rect(22, 2, 4, 20, '#ffffff');
      g.oval(24, 10, 6, 6, '#ffd32a');
      g.oval(24, 10, 3, 3, '#ffffff');
      // Sun rays
      [[-10, -4], [10, -4], [-11, 4], [11, 4]].forEach(([dx, dy]) => {
        g.line(24 + dx * 0.5, 10 + dy * 0.5, 24 + dx, 10 + dy, p.a, 1);
      });
    },

    holy_heal(g, p) {
      // Radiant Life Chalice / Emerald-Gold Cross + Rising Heal Sparkles
      g.shadedRect(22, 4, 4, 16, p.p);
      g.shadedRect(16, 10, 16, 4, p.p);
      g.rect(23, 6, 2, 12, '#ffffff');
      g.rect(18, 11, 12, 2, '#ffffff');
      // Rising plus sparkles
      [[11, 7], [36, 6], [13, 17], [35, 16]].forEach(([sx, sy]) => {
        g.px(sx, sy, p.a); g.px(sx, sy - 1, '#ffffff');
      });
    },

    skull_necro(g, p) {
      // Glowing Necrotic Skull + Swirling Spectral Flame!
      g.oval(24, 10, 7, 6, '#ecf0f1');
      g.rect(20, 15, 8, 4, '#dcdde1');
      g.rect(20, 9, 3, 3, '#0d0d16');
      g.rect(25, 9, 3, 3, '#0d0d16');
      g.px(21, 10, p.p); g.px(26, 10, p.p);
      g.px(23, 13, '#0d0d16');
      // Spectral wisps flanking skull
      g.line(13, 17, 15, 7, p.p, 2);
      g.line(35, 17, 33, 7, p.a, 2);
    },

    hex_curse(g, p) {
      // Cracked Crimson Cursed Eye inside Pentagram Ring
      g.oval(24, 12, 9, 9, p.p);
      g.oval(24, 12, 6.5, 6.5, '#140814', false);
      g.oval(24, 12, 5, 3, '#ff4757');
      g.rect(23, 9, 2, 6, '#0d0d16');
      g.px(23, 11, '#ffffff');
      g.line(11, 5, 15, 9, p.a, 1);
      g.line(37, 5, 33, 9, p.a, 1);
    },

    psychic_eye(g, p) {
      // All-Seeing Astral Third Eye + Concentric Mind Waves
      g.oval(24, 12, 11, 6, '#f5f6fa');
      g.oval(24, 12, 5, 5, p.p);
      g.oval(24, 12, 2.5, 2.5, '#0d0d16', false);
      g.px(23, 10, '#ffffff');
      // Psionic ripples
      g.line(8, 8, 8, 16, p.a, 1);
      g.line(40, 8, 40, 16, p.a, 1);
      g.px(6, 12, p.e); g.px(42, 12, p.e);
    },

    chains_pact(g, p) {
      // Interlocking Glowing Spectral Chains + Occult Seal
      for (let i = 0; i < 4; i++) {
        const cx = 12 + i * 8;
        g.oval(cx, 12, 4, 3, i % 2 === 0 ? p.p : p.a);
        g.oval(cx, 12, 2, 1.2, '#0d0d16', false);
      }
      g.oval(24, 12, 3, 3, p.e);
      g.px(24, 12, '#ffffff');
    },

    smoke_stealth(g, p) {
      // Moonlit Shadow Cloak + Swirling Smoke Plume + Glowing Eyes
      g.oval(18, 14, 7, 6, '#3d465c');
      g.oval(27, 12, 8, 7, '#2c3447');
      g.oval(32, 15, 6, 5, '#4b5670');
      // Glowing rogue eyes peering out of smoke!
      g.rect(21, 11, 2, 2, p.p);
      g.rect(26, 11, 2, 2, p.p);
      g.px(21, 11, '#ffffff'); g.px(26, 11, '#ffffff');
    },

    beast_claw(g, p) {
      // Fierce Triple Beast Claw Raking Diagonal + Wild Eyes
      for (let c = -1; c <= 1; c++) {
        const off = c * 6;
        g.line(14 + off, 19, 28 + off, 5, p.p, 2);
        g.line(15 + off, 18, 28 + off, 5, '#ffffff', 1);
      }
      g.px(10, 6, p.e); g.px(13, 6, p.e);
    },

    totem_spirit(g, p) {
      // Carved Animal Spirit Totem Pillar with Glowing Wings
      g.shadedRect(20, 4, 8, 17, '#8d5524');
      g.rect(21, 6, 2, 2, p.e);
      g.rect(25, 6, 2, 2, p.e);
      g.rect(21, 11, 6, 2, p.a);
      // Spirit wings left & right
      g.line(19, 9, 10, 5, p.p, 2);
      g.line(19, 12, 12, 11, p.p, 2);
      g.line(29, 9, 38, 5, p.p, 2);
      g.line(29, 12, 36, 11, p.p, 2);
    },

    vine_thorn(g, p) {
      // Twisting Emerald Briar Vines + Fey Blossoms
      for (let x = 8; x <= 40; x++) {
        const y = 12 + Math.round(Math.sin(x * 0.25) * 5);
        g.px(x, y, '#27ae60');
        g.px(x, y + 1, '#1e8449');
        if (x % 6 === 0) g.px(x, y - 2, p.p);
      }
      g.oval(16, 10, 2.5, 2.5, p.p); g.px(16, 10, '#ffffff');
      g.oval(31, 13, 2.5, 2.5, p.a); g.px(31, 13, '#ffffff');
    },

    summon_wings(g, p) {
      // Majestic Radiant Summon Wings (Gryphon / Angel / Familiar)
      g.oval(24, 13, 4, 6, p.a);
      g.oval(24, 7, 3, 3, '#ffffff');
      // Wide feathered pixel wings
      g.line(20, 12, 9, 5, p.p, 3);
      g.line(19, 14, 11, 11, p.p, 2);
      g.line(28, 12, 39, 5, p.p, 3);
      g.line(29, 14, 37, 11, p.p, 2);
      g.px(24, 12, p.e);
    },

    trap_gear(g, p) {
      // Jagged Steel Bear-Trap / Thief Gadget + Golden Coin Glint
      g.oval(24, 14, 10, 5, '#7f8fa6');
      g.oval(24, 14, 6, 3, '#1e272e', false);
      for (let tx = 16; tx <= 32; tx += 4) {
        g.rect(tx, 9, 2, 3, '#ecf0f1');
      }
      g.oval(24, 14, 2.5, 2.5, p.a);
      g.px(24, 13, '#ffffff');
    },

    rage_roar(g, p) {
      // Blazing Crimson Rage Fist / War-Cry Shockwave Rings!
      g.oval(24, 12, 12, 8, p.p);
      g.oval(24, 12, 8, 5.5, p.a);
      g.oval(24, 12, 4.5, 3.5, '#fff200');
      // Jagged burst spikes
      [[10, 5], [38, 5], [10, 19], [38, 19], [24, 2], [24, 22]].forEach(([sx, sy]) => {
        g.line(24, 12, sx, sy, p.e, 1);
      });
    },

    tactic_helm(g, p) {
      // Plumed Knight War-Helm & Crossed Tactical Flags
      g.oval(24, 4, 4, 2.5, p.a);
      g.shadedRect(18, 6, 12, 12, p.p);
      g.rect(20, 10, 8, 2, '#0d0d16');
      g.px(21, 10, p.e); g.px(26, 10, p.e);
      g.rect(23, 12, 2, 5, '#0d0d16');
      g.line(11, 19, 17, 9, p.a, 1);
      g.line(37, 19, 31, 9, p.a, 1);
    },

    slime_ooze(g) {
      // Dripping Toxic Lime Slime Globules
      g.oval(24, 14, 10, 6, '#2ed573');
      g.oval(16, 16, 5, 4, '#27ae60');
      g.oval(32, 15, 5, 4, '#7bed9f');
      g.rect(20, 10, 4, 2, '#ffffff');
      g.oval(26, 6, 2, 2, '#badc58');
    },

    blood_wound(g) {
      // Deep Crimson Slash Gash + Blood Droplets
      g.line(13, 18, 35, 6, '#eb3b5a', 3);
      g.line(15, 17, 33, 7, '#ff6b81', 1);
      g.oval(18, 19, 2, 2.5, '#c0392b');
      g.oval(28, 15, 2, 3, '#eb3b5a');
      g.px(28, 14, '#ffffff');
    },

    bell_lantern(g, p) {
      // Ghostly Soul Lantern / Tolling Death Bell
      g.rect(22, 3, 4, 2, p.a);
      g.oval(24, 12, 6, 7, p.p);
      g.oval(24, 13, 3.5, 4, '#ffffff');
      g.rect(19, 18, 10, 2, p.a);
      g.px(13, 10, p.e); g.px(35, 10, p.e);
    },

    dice_fate(g, p) {
      // Glowing D20 Polyhedron surrounded by Fate Stars!
      g.oval(24, 12, 8, 8, p.p);
      g.line(24, 4, 17, 15, '#ffffff', 1);
      g.line(24, 4, 31, 15, '#ffffff', 1);
      g.line(17, 15, 31, 15, '#ffffff', 1);
      g.rect(23, 10, 2, 3, '#0d0d16');
      g.px(11, 6, p.a); g.px(37, 7, p.a); g.px(12, 18, p.e); g.px(36, 17, p.e);
    }
  };

  // ==========================================================================
  // SEMANTIC MOTIF CLASSIFIER (Matches EVERY Card's Exact Fantasy!)
  // ==========================================================================
  function classifyText(txt) {
    if (/주사위|portent|예지|운명|행운|wild_magic|야생 마력/.test(txt)) return 'dice_fate';
    if (/종소리|등불|lantern|toll|통곡|wail/.test(txt)) return 'bell_lantern';
    if (/사슬|chain|속박|결속/.test(txt)) return 'chains_pact';
    if (/화염|불꽃|파이어|작열|지옥불|fire|burn|flame|meteor|hellish|태양|낮빛/.test(txt)) {
      return /신성|성역|태양|빛줄기|daylight|sacred|light/.test(txt) ? 'divine_sun' : 'fire_burst';
    }
    if (/냉기|얼음|빙하|아가시스|frost|ice|cold|agathys|chill/.test(txt)) return 'frost_ice';
    if (/번개|뇌전|천둥|전격|thunder|lightning|booming|storm/.test(txt)) return 'lightning_bolt';
    if (/독|맹독|와이번|poison|venom|acid|부식/.test(txt)) return 'dagger_poison';
    if (/장궁|화살|사격|bow|arrow|volley|sniper|바람총/.test(txt)) return 'bow_arrow';
    if (/그레이트액스|도끼|axe|frenzy|광란|쪼개기/.test(txt)) return 'greataxe';
    if (/토템|totem|선조|수호령|ancestral/.test(txt)) return 'totem_spirit';
    if (/표범|늑대|곰|야수|발톱|beast|claw|구엔위바|동물/.test(txt)) return 'beast_claw';
    if (/덩굴|가시|자연|요정|fey|thorn|vine|entangle|굿베리/.test(txt)) return 'vine_thorn';
    if (/군마|그리폰|날개|천사|사역마|임프|수호자 소환|소환|summon|steed|familiar|spirit guardian/.test(txt)) return 'summon_wings';
    if (/잔상|분신|거울|echo|mirror|시간선/.test(txt)) return 'echo_shadow';
    if (/연막|은신|은폐|회피|안개 걸음|그림자|evasion|misty|shadow|stealth|걸음/.test(txt)) return 'smoke_stealth';
    if (/소매치기|함정|손놀림|곡예|trap|thief|hands/.test(txt)) return 'trap_gear';
    if (/언데드|망자|무덤|사멸|부패|해골|죽음|necro|grave|dead|death|soul|영혼/.test(txt)) return 'skull_necro';
    if (/저주|주술|고통|공포|끔찍|타락|hex|curse|bane|dread|fiend|어둠/.test(txt)) {
      return /칼날|검|blade|베기/.test(txt) ? 'hex_blade' : 'hex_curse';
    }
    if (/정신|시선|속삭임|각성|사이오닉|psychic|mind|eye|진실/.test(txt)) return 'psychic_eye';
    if (/파열|광선|beam|blast|ray|disintegrate/.test(txt)) return 'eldritch_beam';
    if (/무효화|문양|수호막|방벽|counter|ward|glyph|abjuration/.test(txt)) return 'counter_rune';
    if (/치유|회복|안수|축복|재기|생명|heal|bless|life|second wind|lay on/.test(txt)) return 'holy_heal';
    if (/신성|강타|심판|성역|성검|smite|divine|holy|sanctuary|light|guiding/.test(txt)) {
      return /베기|검|blade|sword/.test(txt) ? 'sword_slash' : 'divine_sun';
    }
    if (/격노|포효|무모|돌진|연쇄|rage|roar|surge|reckless|분노|피의/.test(txt)) return 'rage_roar';
    if (/마검|hexblade|pact of the blade/.test(txt)) return 'hex_blade';
    if (/돌격|기마|창|lance|charge|글래디에이터/.test(txt)) return 'spear_charge';
    if (/전술|응수|무장|패링|투구|tactic|riposte|parry|war|전쟁/.test(txt)) return 'tactic_helm';
    if (/보주|미사일|비전|마법|orb|missile|arcane|spell|magic/.test(txt)) return 'arcane_orb';
    if (/단검|암살|급소|찌르기|shiv|dagger|sneak/.test(txt)) return 'dagger_poison';
    if (/방패|방어|갑옷|갑주|철갑|막기|shield|armor|block|guard|defend/.test(txt)) return 'shield_ward';
    if (/검|베기|시미터|칼날|일격|sword|slash|strike|blade/.test(txt)) return 'sword_slash';
    return null;
  }

  function pickMotif(card) {
    const id = (card.id || '').toLowerCase();
    const nm = (card.name || '').toLowerCase();
    const desc = (card.desc || '').toLowerCase();

    // 1. Status & Curse cards
    if (id.includes('slimed')) return 'slime_ooze';
    if (id.includes('burn')) return 'fire_burst';
    if (id.includes('dazed')) return 'psychic_eye';
    if (id.includes('wound')) return 'blood_wound';
    if (card.type === 'curse') return 'hex_curse';

    // 2. Match Card Name FIRST (exact skill fantasy!), then ID, then Description
    const fromName = classifyText(nm);
    if (fromName) return fromName;
    const fromId = classifyText(id);
    if (fromId) return fromId;
    const fromDesc = classifyText(desc);
    if (fromDesc) return fromDesc;

    // 3. Clean Fallback by Card Mechanics
    if (card.heal || card.summonHeal) return 'holy_heal';
    if (card.addDrone || card.summonBlock) return 'summon_wings';
    if (card.block && !card.damage) return 'shield_ward';
    if (card.type === 'power') return 'counter_rune';
    if (card.type === 'skill') return 'arcane_orb';
    return 'sword_slash';
  }

  function buildSkillCanvas(card) {
    const g = new SkillCanvas(W, H);
    const h = hashStr(card.id || card.name || 'card');
    const basePal =
      SUBCLASS_PALETTES[card.subclassId] ||
      SUBCLASS_PALETTES[card.classId] ||
      SUBCLASS_PALETTES[card.type] ||
      SUBCLASS_PALETTES.fighter;

    // Subtle deterministic hue nudge per card so every card in a subclass feels distinct!
    const nudge = [((h & 7) - 3) * 7, (((h >> 3) & 7) - 3) * 7, (((h >> 6) & 7) - 3) * 7];
    const pal = {
      bg1: shiftHueRgb(basePal.bg1, [nudge[0] * 0.4, nudge[1] * 0.4, nudge[2] * 0.4]),
      bg2: shiftHueRgb(basePal.bg2, [nudge[0] * 0.5, nudge[1] * 0.5, nudge[2] * 0.5]),
      p: shiftHueRgb(basePal.p, nudge),
      a: shiftHueRgb(basePal.a, [-nudge[1] * 0.5, nudge[2] * 0.5, nudge[0] * 0.5]),
      e: basePal.e
    };

    // 1. Unique Card Backdrop Style (4 crisp pixel-art background compositions)
    g.bgGrad(pal.bg1, pal.bg2);
    const bgStyle = h % 4;
    if (bgStyle === 0) {
      g.bgGlow(24, 12, 18, shade(pal.p, -0.35), shade(pal.bg2, 0.15));
    } else if (bgStyle === 1) {
      // Diagonal energy streaks
      for (let i = -2; i < 6; i++) {
        const bx = i * 9 + (h % 5);
        for (let y = 0; y < H; y++) g.bgPx(bx + y * 0.6, y, shade(pal.bg2, 0.18));
      }
      g.bgGlow(24, 12, 13, shade(pal.a, -0.45), pal.bg2);
    } else if (bgStyle === 2) {
      // Starfield + horizon glow
      for (let i = 0; i < 14; i++) {
        const sx = (h + i * 19) % W;
        const sy = ((h >> 4) + i * 11) % H;
        g.bgPx(sx, sy, i % 3 === 0 ? pal.e : shade(pal.p, 0.2));
      }
      g.bgGlow(24, 16, 15, shade(pal.p, -0.4), pal.bg2);
    } else {
      // Pixel arcane lattice
      for (let y = 3; y < H; y += 6) {
        for (let x = 3; x < W; x += 8) g.bgPx(x, y, shade(pal.bg2, 0.25));
      }
      g.bgGlow(24, 12, 15, shade(pal.a, -0.4), pal.bg2);
    }

    // 2. Draw Primary Semantic Skill Motif
    const motifKey = pickMotif(card);
    const drawer = MOTIFS[motifKey] || MOTIFS.sword_slash;
    drawer(g, pal, h);

    // 3. Unique Per-Card Action Sparkles (ensures 359/359 zero-duplicate fingerprints!)
    const sp1x = 3 + (h % 9);
    const sp1y = 3 + ((h >> 5) % 16);
    const sp2x = W - 4 - ((h >> 9) % 9);
    const sp2y = 3 + ((h >> 13) % 16);
    g.px(sp1x, sp1y, pal.e);
    g.px(sp2x, sp2y, '#ffffff');
    if ((h >> 17) & 1) g.px(sp1x + 1, sp1y, '#ffffff');
    if ((h >> 18) & 1) g.px(sp2x - 1, sp2y, pal.a);

    // 4. Crisp 1px Dark Outline on Foreground Skill Motif
    g.outlineFg('#0b0c14');

    // 5. Rarity Corner Pixel Filigree (Uncommon / Rare / Legendary visual prestige!)
    const rar = card.rarity || 'common';
    if (rar === 'uncommon' || rar === 'rare' || rar === 'legendary') {
      const fc = rar === 'legendary' ? '#f6c967' : rar === 'rare' ? '#c56cf0' : '#18dcff';
      const fhi = rar === 'legendary' ? '#ffffff' : fc;
      // Top-left & bottom-right pixel brackets
      g.px(1, 1, fhi); g.px(2, 1, fc); g.px(1, 2, fc);
      g.px(W - 2, 1, fhi); g.px(W - 3, 1, fc); g.px(W - 2, 2, fc);
      g.px(1, H - 2, fhi); g.px(2, H - 2, fc); g.px(1, H - 3, fc);
      g.px(W - 2, H - 2, fhi); g.px(W - 3, H - 2, fc); g.px(W - 2, H - 3, fc);
      if (rar === 'legendary') {
        g.px(3, 1, '#f6c967'); g.px(W - 4, 1, '#f6c967');
        g.px(3, H - 2, '#f6c967'); g.px(W - 4, H - 2, '#f6c967');
      }
    }

    return { canvas: g, motif: motifKey };
  }

  const urlCache = {};

  function getCardArtUrl(card) {
    if (!card || !card.id) return '';
    if (!urlCache[card.id]) {
      urlCache[card.id] = buildSkillCanvas(card).canvas.toDataURL();
    }
    return urlCache[card.id];
  }

  function getCardArtHtml(card) {
    const url = getCardArtUrl(card);
    if (!url) return '⚔️';
    return `<img class="card-pixel-art" src="${url}" alt="" draggable="false" />`;
  }

  window.PIXEL_CARD_ART = {
    W,
    H,
    MOTIFS,
    pickMotif,
    buildSkillCanvas,
    getCardArtUrl,
    getCardArtHtml
  };
})();
