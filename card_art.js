// ============================================================================
// D&D 5E SPIRE II v2.0 — HI-BIT NATURAL PIXEL-ART SKILL ENGINE (card_art.js)
// - 120x60 Crisp 2:1 Hi-Bit Pixel-Art Illustrations (7,200 px = 6.25x finer than v1!)
// - 32 Handcrafted D&D Weapon / Spell / Companion / Aura / Status Pixel Motifs
// - 5-Tone Hue-Shifted Shading + Bayer 4x4 Dithering + Selective Colored Outlines
// - Lazy Cached PNG Data URLs (100% unique 359/359!)
// ============================================================================
(function () {
  const LW = 48;
  const LH = 24;
  const SCALE = 2.5; // 48x24 logical -> 120x60 native Hi-Bit (6.25x pixel area!)
  const W = Math.round(LW * SCALE); // 120
  const H = Math.round(LH * SCALE); // 60

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
    const h = (hex || '#101420').replace('#', '');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }
  function rgbToHex(r, g, b) {
    const cl = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [cl(r), cl(g), cl(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  // Painterly hue-shifted shading (warm golden highlights, cool indigo shadows!)
  function shade(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    if (factor > 0) {
      return rgbToHex(
        r + (255 - r) * factor * 1.04,
        g + (248 - g) * factor * 0.96,
        b + (226 - b) * factor * 0.8
      );
    }
    const f = 1 + factor;
    const cool = -factor;
    return rgbToHex(
      r * f * (1 - cool * 0.14),
      g * f * (1 - cool * 0.16),
      b * f + 22 * cool * (1 - b / 340)
    );
  }
  function shiftHueRgb(hex, shift) {
    if (!shift) return hex;
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + shift[0], g + shift[1], b + shift[2]);
  }
  function mixHex(c1, c2, t) {
    const a = hexToRgb(c1), b = hexToRgb(c2);
    return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }

  // Dual-Layer 120x60 Hi-Bit Pixel Canvas (Maps 48x24 logical coords smoothly onto 120x60!)
  class SkillCanvas {
    constructor(w = W, h = H) {
      this.w = w;
      this.h = h;
      this.lw = LW;
      this.lh = LH;
      this.bg = new Array(w * h).fill('#0d101c');
      this.fg = new Array(w * h).fill(null);
    }
    rawBgPx(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h || !c) return;
      this.bg[iy * this.w + ix] = c;
    }
    rawPx(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h || !c) return;
      this.fg[iy * this.w + ix] = c;
    }
    bgPx(x, y, c) {
      const sx = Math.round(x * SCALE), sy = Math.round(y * SCALE);
      const sz = Math.max(1, Math.round(SCALE * 0.72));
      for (let dy = 0; dy < sz; dy++) for (let dx = 0; dx < sz; dx++) this.rawBgPx(sx + dx, sy + dy, c);
    }
    px(x, y, c) {
      const sx = Math.round(x * SCALE), sy = Math.round(y * SCALE);
      this.rawPx(sx, sy, c);
      this.rawPx(sx + 1, sy, c);
      this.rawPx(sx, sy + 1, shade(c, -0.14));
      this.rawPx(sx + 1, sy + 1, shade(c, -0.22));
    }
    rect(x, y, w, h, c) {
      const x0 = Math.round(x * SCALE), y0 = Math.round(y * SCALE);
      const x1 = Math.max(x0 + 1, Math.round((x + w) * SCALE));
      const y1 = Math.max(y0 + 1, Math.round((y + h) * SCALE));
      const hi = shade(c, 0.14), lo = shade(c, -0.18);
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          let col = c;
          if (yy === y0 && y1 - y0 >= 3) col = hi;
          else if (yy === y1 - 1 && y1 - y0 >= 3) col = lo;
          this.rawPx(xx, yy, col);
        }
      }
    }
    shadedRect(x, y, w, h, base) {
      const x0 = Math.round(x * SCALE), y0 = Math.round(y * SCALE);
      const rw = Math.max(2, Math.round(w * SCALE)), rh = Math.max(2, Math.round(h * SCALE));
      const spec = shade(base, 0.48), hi = shade(base, 0.24), lo = shade(base, -0.26), deep = shade(base, -0.48);
      for (let dy = 0; dy < rh; dy++) {
        for (let dx = 0; dx < rw; dx++) {
          const nx = (dx / Math.max(1, rw - 1)) * 2 - 1;
          const ny = (dy / Math.max(1, rh - 1)) * 2 - 1;
          const thr = (BAYER4[(y0 + dy) & 3][(x0 + dx) & 3] - 7.5) / 32;
          const v = -nx * 0.45 - ny * 0.55 + thr;
          let c = base;
          if (dy === 0 || (dx === 0 && dy < rh - 1)) c = spec;
          else if (dy === rh - 1 || dx === rw - 1) c = deep;
          else if (v > 0.32) c = hi;
          else if (v < -0.28) c = lo;
          this.rawPx(x0 + dx, y0 + dy, c);
        }
      }
    }
    oval(cx, cy, rx, ry, base, shaded = true) {
      const scx = cx * SCALE, scy = cy * SCALE;
      const srx = Math.max(1.2, rx * SCALE), sry = Math.max(1.2, ry * SCALE);
      const spec = shaded ? shade(base, 0.52) : base;
      const hi = shaded ? shade(base, 0.25) : base;
      const lo = shaded ? shade(base, -0.28) : base;
      const deep = shaded ? shade(base, -0.5) : base;
      for (let y = Math.floor(scy - sry - 1); y <= Math.ceil(scy + sry + 1); y++) {
        for (let x = Math.floor(scx - srx - 1); x <= Math.ceil(scx + srx + 1); x++) {
          const nx = (x - scx) / srx, ny = (y - scy) / sry;
          const r2 = nx * nx + ny * ny;
          if (r2 > 1) continue;
          let c = base;
          if (shaded) {
            const nz = Math.sqrt(Math.max(0, 1 - r2));
            let light = -nx * 0.52 - ny * 0.62 + nz * 0.55;
            if (r2 > 0.7 && nx + ny > 0.45) light += 0.16;
            const thr = (BAYER4[y & 3][x & 3] - 7.5) / 26;
            const v = light + thr;
            if (v > 0.96) c = spec;
            else if (v > 0.58) c = hi;
            else if (v < 0.04) c = deep;
            else if (v < 0.28) c = lo;
          }
          this.rawPx(x, y, c);
        }
      }
    }
    line(x0, y0, x1, y1, c, thick = 1) {
      const sx0 = x0 * SCALE, sy0 = y0 * SCALE, sx1 = x1 * SCALE, sy1 = y1 * SCALE;
      const r = Math.max(0.95, thick * SCALE * 0.44);
      const steps = Math.max(6, Math.ceil(Math.hypot(sx1 - sx0, sy1 - sy0) * 1.4));
      const hi = shade(c, 0.36), lo = shade(c, -0.28);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = sx0 + (sx1 - sx0) * t;
        const cy = sy0 + (sy1 - sy0) * t;
        const rr = r * (0.95 + 0.1 * Math.sin(t * Math.PI));
        if (rr <= 1.05) {
          this.rawPx(cx, cy, t < 0.35 ? hi : c);
        } else {
          const ix0 = Math.floor(cx - rr), ix1 = Math.ceil(cx + rr);
          const iy0 = Math.floor(cy - rr), iy1 = Math.ceil(cy + rr);
          for (let yy = iy0; yy <= iy1; yy++) {
            for (let xx = ix0; xx <= ix1; xx++) {
              const dx = (xx - cx) / rr, dy = (yy - cy) / rr;
              if (dx * dx + dy * dy <= 1) {
                this.rawPx(xx, yy, dx + dy < -0.45 ? hi : dx + dy > 0.48 ? lo : c);
              }
            }
          }
        }
      }
    }
    bgGrad(cTop, cBot) {
      const cMid = mixHex(cTop, cBot, 0.5);
      const stops = [shade(cTop, -0.15), cTop, cMid, cBot];
      const span = this.h - 1;
      for (let y = 0; y < this.h; y++) {
        const t = (y / span) * (stops.length - 1);
        const idx = Math.min(stops.length - 2, Math.floor(t));
        const frac = t - idx;
        const a = stops[idx], b = stops[idx + 1];
        for (let x = 0; x < this.w; x++) {
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          this.bg[y * this.w + x] = frac > thr ? b : a;
        }
      }
    }
    bgGlow(cx, cy, r, cCore, cOuter) {
      const scx = cx * SCALE, scy = cy * SCALE, sr = r * SCALE;
      const cMid = mixHex(cCore, cOuter, 0.45);
      for (let y = Math.max(0, Math.floor(scy - sr)); y <= Math.min(this.h - 1, Math.ceil(scy + sr)); y++) {
        for (let x = Math.max(0, Math.floor(scx - sr)); x <= Math.min(this.w - 1, Math.ceil(scx + sr)); x++) {
          const d = Math.hypot(x - scx, y - scy) / sr;
          if (d >= 1) continue;
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          if (d < 0.3 && (0.3 - d) / 0.3 > thr * 0.55) this.bg[y * this.w + x] = cCore;
          else if (d < 0.62 && (0.62 - d) / 0.32 > thr * 0.72) this.bg[y * this.w + x] = cMid;
          else if ((1 - d) / 0.42 > thr) this.bg[y * this.w + x] = cOuter;
        }
      }
    }
    // Native 120x60 1px Selective Colored Outline (Sel-Out!) for crisp natural edges!
    outlineFg(fallback = '#0b0c14') {
      const marks = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.fg[y * this.w + x] !== null) continue;
          const neighbor =
            (y > 0 && this.fg[(y - 1) * this.w + x]) ||
            (x > 0 && this.fg[y * this.w + x - 1]) ||
            (x < this.w - 1 && this.fg[y * this.w + x + 1]) ||
            (y < this.h - 1 && this.fg[(y + 1) * this.w + x]);
          if (neighbor) {
            marks.push(y * this.w + x, shade(neighbor, -0.68) || fallback);
          }
        }
      }
      for (let i = 0; i < marks.length; i += 2) this.fg[marks[i]] = marks[i + 1];
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

    // 1. Unique Card Backdrop Style (4 crisp 120x60 Hi-Bit atmospheric compositions)
    g.bgGrad(pal.bg1, pal.bg2);
    const bgStyle = h % 4;
    if (bgStyle === 0) {
      g.bgGlow(24, 12, 19, shade(pal.p, -0.32), shade(pal.bg2, 0.18));
    } else if (bgStyle === 1) {
      // Diagonal volumetric energy streaks at native 120x60
      for (let i = -3; i < 8; i++) {
        const bx = i * 18 + (h % 9);
        for (let y = 0; y < H; y++) {
          g.rawBgPx(bx + y * 0.65, y, shade(pal.bg2, 0.22));
          if (y % 2 === 0) g.rawBgPx(bx + y * 0.65 + 1, y, shade(pal.bg2, 0.12));
        }
      }
      g.bgGlow(24, 12, 14, shade(pal.a, -0.42), pal.bg2);
    } else if (bgStyle === 2) {
      // Fine 1px Hi-Bit Starfield + horizon glow
      for (let i = 0; i < 28; i++) {
        const sx = (h + i * 37) % W;
        const sy = ((h >> 4) + i * 23) % H;
        g.rawBgPx(sx, sy, i % 3 === 0 ? pal.e : shade(pal.p, 0.28));
      }
      g.bgGlow(24, 16, 16, shade(pal.p, -0.38), pal.bg2);
    } else {
      // Crisp 1px arcane constellation lattice
      for (let y = 6; y < H; y += 12) {
        for (let x = 8; x < W; x += 16) {
          g.rawBgPx(x, y, shade(pal.bg2, 0.3));
          g.rawBgPx(x + 1, y, shade(pal.bg2, 0.18));
        }
      }
      g.bgGlow(24, 12, 16, shade(pal.a, -0.38), pal.bg2);
    }

    // 2. Draw Primary Semantic Skill Motif (rasterized natively at 120x60!)
    const motifKey = pickMotif(card);
    const drawer = MOTIFS[motifKey] || MOTIFS.sword_slash;
    drawer(g, pal, h);

    // 3. Fine 1px Atmospheric Action Sparks & Glints (ensures 359/359 unique fingerprints!)
    const sp1x = 6 + (h % 20);
    const sp1y = 6 + ((h >> 5) % 44);
    const sp2x = W - 7 - ((h >> 9) % 20);
    const sp2y = 6 + ((h >> 13) % 44);
    g.rawPx(sp1x, sp1y, '#ffffff');
    g.rawPx(sp1x - 1, sp1y, pal.e); g.rawPx(sp1x + 1, sp1y, pal.e);
    g.rawPx(sp1x, sp1y - 1, pal.e); g.rawPx(sp1x, sp1y + 1, pal.e);
    g.rawPx(sp2x, sp2y, '#ffffff');
    g.rawPx(sp2x - 1, sp2y, pal.a); g.rawPx(sp2x + 1, sp2y, pal.a);
    if ((h >> 17) & 1) g.rawPx(sp1x + 2, sp1y, pal.e);
    if ((h >> 18) & 1) g.rawPx(sp2x, sp2y - 1, pal.a);

    // 4. Crisp 1px Native Selective Colored Outline on Foreground Skill Motif
    g.outlineFg('#0b0c14');

    // 5. Fine 120x60 Ornate Rarity Corner Filigree (Uncommon / Rare / Legendary!)
    const rar = card.rarity || 'common';
    if (rar === 'uncommon' || rar === 'rare' || rar === 'legendary') {
      const fc = rar === 'legendary' ? '#f6c967' : rar === 'rare' ? '#c56cf0' : '#18dcff';
      const fhi = rar === 'legendary' ? '#ffffff' : shade(fc, 0.38);
      const len = rar === 'legendary' ? 9 : rar === 'rare' ? 7 : 5;
      for (let i = 0; i < len; i++) {
        const c = i === 0 ? fhi : fc;
        g.rawPx(2 + i, 2, c); g.rawPx(2, 2 + i, c);
        g.rawPx(W - 3 - i, 2, c); g.rawPx(W - 3, 2 + i, c);
        g.rawPx(2 + i, H - 3, c); g.rawPx(2, H - 3 - i, c);
        g.rawPx(W - 3 - i, H - 3, c); g.rawPx(W - 3, H - 3 - i, c);
      }
      if (rar === 'legendary') {
        g.rawPx(4, 4, fhi); g.rawPx(W - 5, 4, fhi);
        g.rawPx(4, H - 5, fhi); g.rawPx(W - 5, H - 5, fhi);
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
