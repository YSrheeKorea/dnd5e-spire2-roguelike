// ============================================================================
// D&D 5E SPIRE II — FINE SD DEFORMED PIXEL-ART ENGINE (sprites.js)
// - 32x32 High-Detail SD (2.5-Head Chibi) Pixel Art for All 8 Heroes & 62 Enemies
// - 40x40 Ultra-Detail SD Pixel Art for All 20 Act Bosses & Midbosses
// - 3-Tone Cel Shading + Crisp 1px Ink Outlines + Expressive Anime Eyes + 2-Frame Motion
// - 90/90 100% Unique Sprites (ZERO duplicates!)
// ============================================================================
(function () {
  // Color shading helpers (auto-generate crisp pixel highlight & deep shadow tones!)
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [clamp(r), clamp(g), clamp(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function shade(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    if (factor > 0) {
      return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
    }
    const f = 1 + factor;
    return rgbToHex(r * f, g * f, b * f);
  }
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // Integer-Grid Pixel Art Canvas (zero blur, 3-tone shading, automatic 1px outline!)
  class PixelCanvas {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.buf = new Array(w * h).fill(null);
    }
    px(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h) return;
      this.buf[iy * this.w + ix] = c;
    }
    get(x, y) {
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) return null;
      return this.buf[y * this.w + x];
    }
    rect(x, y, w, h, c) {
      const x0 = Math.round(x), y0 = Math.round(y);
      for (let dy = 0; dy < Math.round(h); dy++) {
        for (let dx = 0; dx < Math.round(w); dx++) this.px(x0 + dx, y0 + dy, c);
      }
    }
    shadedRect(x, y, w, h, base) {
      const hi = shade(base, 0.28), lo = shade(base, -0.32);
      const x0 = Math.round(x), y0 = Math.round(y), rw = Math.round(w), rh = Math.round(h);
      for (let dy = 0; dy < rh; dy++) {
        for (let dx = 0; dx < rw; dx++) {
          let c = base;
          if (dy === 0 || dx === 0) c = hi;
          else if (dy === rh - 1 || dx === rw - 1) c = lo;
          this.px(x0 + dx, y0 + dy, c);
        }
      }
    }
    oval(cx, cy, rx, ry, base, shaded = true) {
      const hi = shaded ? shade(base, 0.3) : base;
      const lo = shaded ? shade(base, -0.34) : base;
      const x0 = Math.floor(cx - rx - 1), x1 = Math.ceil(cx + rx + 1);
      const y0 = Math.floor(cy - ry - 1), y1 = Math.ceil(cy + ry + 1);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const nx = (x - cx) / rx, ny = (y - cy) / ry;
          const d = nx * nx + ny * ny;
          if (d <= 1.0) {
            let c = base;
            if (shaded) {
              if (nx + ny < -0.58) c = hi;
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
        if (ix0 === ix1 && iy0 === iy1) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; ix0 += sx; }
        if (e2 < dx) { err += dx; iy0 += sy; }
      }
    }
    // Crisp Chibi/SD Anime Eye (2x3 with white specular glint!)
    chibiEye(x, y, iris, dark = '#12131c', blink = false) {
      if (blink) {
        this.rect(x, y + 1, 2, 1, dark);
        return;
      }
      this.px(x, y, dark);
      this.px(x + 1, y, '#ffffff'); // specular glint
      this.px(x, y + 1, iris);
      this.px(x + 1, y + 1, dark);
      this.px(x, y + 2, shade(iris, 0.35));
      this.px(x + 1, y + 2, iris);
    }
    // Fierce Glowing Monster Eye
    glowEye(x, y, color, big = false) {
      if (big) {
        this.rect(x, y, 3, 2, color);
        this.px(x + 1, y, '#ffffff');
      } else {
        this.rect(x, y, 2, 2, color);
        this.px(x, y, '#ffffff');
      }
    }
    // Crisp 1px dark outline around entire painted silhouette (MapleStory / Guardian Tales style!)
    outline(color = '#12101c') {
      const toMark = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.buf[y * this.w + x] !== null) continue;
          if (
            this.get(x - 1, y) !== null ||
            this.get(x + 1, y) !== null ||
            this.get(x, y - 1) !== null ||
            this.get(x, y + 1) !== null
          ) {
            toMark.push(y * this.w + x);
          }
        }
      }
      for (const idx of toMark) this.buf[idx] = color;
    }
    // Compile horizontal same-color runs into ultra-compact crisp SVG rects
    toRects() {
      const out = [];
      for (let y = 0; y < this.h; y++) {
        let x = 0;
        const rowOff = y * this.w;
        while (x < this.w) {
          const c = this.buf[rowOff + x];
          if (!c) { x++; continue; }
          let run = 1;
          while (x + run < this.w && this.buf[rowOff + x + run] === c) run++;
          out.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${c}"/>`);
          x += run;
        }
      }
      return out.join('');
    }
  }

  function renderAnimatedSprite(w, h, drawFn, opts = {}) {
    const c1 = new PixelCanvas(w, h);
    const c2 = new PixelCanvas(w, h);
    drawFn(c1, 0);
    drawFn(c2, 1);
    c1.outline(opts.outlineColor || '#10101a');
    c2.outline(opts.outlineColor || '#10101a');

    const motion = opts.motion || 'px-motion-agile';
    const isBoss = !!opts.isBoss;
    const aura = opts.aura || '';
    const auraSvg = aura
      ? `<ellipse cx="${w / 2}" cy="${h * 0.56}" rx="${w * 0.42}" ry="${h * 0.36}" fill="${aura}" opacity="0.2" class="px-aura"/>`
      : '';
    return (
      `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" class="pixel-sprite ${motion}${isBoss ? ' px-boss' : ''}" aria-hidden="true">` +
      auraSvg +
      `<ellipse cx="${w / 2}" cy="${h - 2}" rx="${Math.round(w * 0.28)}" ry="1.6" fill="rgba(0,0,0,0.5)"/>` +
      `<g class="px-f1">${c1.toRects()}</g>` +
      `<g class="px-f2">${c2.toRects()}</g>` +
      `</svg>`
    );
  }

  // ==========================================================================
  // 1. ALL 8 HEROES — FINE 32x32 SD DEFORMED CHIBI PIXEL ART (2.5-HEAD RATIO!)
  // ==========================================================================
  function drawChibiBase(c, f, cfg) {
    const cx = 15;
    const bob = f === 1 ? 1 : 0;
    const skin = cfg.skin || '#f7d2b4';

    // Flowing Back Cape
    if (cfg.cape) {
      c.oval(cx - 1 - f, 21 + bob, 7.5, 6.5, cfg.cape);
      c.rect(cx - 7 - f, 23 + bob, 13, 4, shade(cfg.cape, -0.2));
    }

    // Chibi Legs & Boots (stepping slightly on f=1)
    c.shadedRect(cx - 4, 24, 3, 4, cfg.pants || '#2f3640');
    c.shadedRect(cx + 2, 24, 3, 4, cfg.pants || '#2f3640');
    c.shadedRect(cx - 5, 27 - (f ? 0 : 0), 4, 3, cfg.boots || '#4a3525');
    c.shadedRect(cx + 2, 27, 4, 3, cfg.boots || '#4a3525');

    // Compact Heroic Torso (10x8)
    c.shadedRect(cx - 4, 17 + bob, 9, 8, cfg.armor);
    // Belt & Golden Buckle
    c.rect(cx - 4, 22 + bob, 9, 2, cfg.belt || '#3d2b1f');
    c.rect(cx - 1, 22 + bob, 3, 2, cfg.trim || '#f6c967');
    // Chest Emblem / Pauldrons
    c.shadedRect(cx - 7, 17 + bob, 4, 4, cfg.pauldron || cfg.armor);
    c.shadedRect(cx + 4, 17 + bob, 4, 4, cfg.pauldron || cfg.armor);
    if (cfg.chestAccent) c.rect(cx - 1, 18 + bob, 3, 3, cfg.chestAccent);

    // Big Expressive Chibi Head (14x11)
    c.oval(cx, 11 + bob, 6.5, 5.5, skin);
    // Subtle rosy cheeks
    c.px(cx - 4, 13 + bob, '#f29e9e');
    c.px(cx + 4, 13 + bob, '#f29e9e');

    // Cute Anime Chibi Eyes
    if (!cfg.noEyes) {
      c.chibiEye(cx - 4, 10 + bob, cfg.eye || '#2e86de');
      c.chibiEye(cx + 2, 10 + bob, cfg.eye || '#2e86de');
    }

    // Hair / Hat / Helm overlay callback
    if (cfg.drawHeadgear) cfg.drawHeadgear(c, cx, bob, f);

    // Hands & Signature Weapons callback
    if (cfg.drawGear) cfg.drawGear(c, cx, bob, f);
  }

  const HERO_SPRITES = {
    fighter: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#b2bec3', pauldron: '#95a5a6', cape: '#c0392b', trim: '#f6c967',
          chestAccent: '#e74c3c', boots: '#576574', eye: '#3498db',
          drawHeadgear: (c, cx, b, f) => {
            // Crimson Plume waving on helm
            c.oval(cx - 1 - f, 3 + b, 3.5, 2.2, '#e74c3c');
            c.oval(cx + 1, 4 + b, 2.5, 1.8, '#ff6b81');
            // Steel Knight Helmet framing expressive face
            c.oval(cx, 8 + b, 7, 3.5, '#cfd8dc');
            c.rect(cx - 7, 8 + b, 2, 5, '#95a5a6');
            c.rect(cx + 6, 8 + b, 2, 5, '#95a5a6');
            c.rect(cx - 5, 7 + b, 11, 1, '#f6c967');
            c.rect(cx, 6 + b, 1, 4, '#7f8fa6');
          },
          drawGear: (c, cx, b, f) => {
            // Left: Royal Kite Shield with Gold Cross
            c.shadedRect(cx - 11, 17 + b, 6, 9, '#2e86de');
            c.rect(cx - 10, 18 + b, 4, 7, '#54a0ff');
            c.rect(cx - 9, 19 + b, 2, 5, '#f6c967');
            c.rect(cx - 10, 20 + b, 4, 2, '#f6c967');
            // Right: Gleaming Broadsword (raises slightly on f=1)
            const sy = 6 + b - f * 2;
            c.rect(cx + 9, sy, 2, 13, '#ecf0f1');
            c.rect(cx + 9, sy, 1, 12, '#ffffff');
            c.rect(cx + 7, sy + 12, 6, 2, '#f6c967');
            c.rect(cx + 9, sy + 14, 2, 3, '#7f5539');
          }
        });
      }, { motion: 'px-motion-heavy', aura: '#74b9ff' }),

    barbarian: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          skin: '#e0a278', armor: '#d9966b', pauldron: '#6d4c41', belt: '#5d4037',
          trim: '#f6c967', pants: '#4e342e', boots: '#3e2723', eye: '#ff4757',
          drawHeadgear: (c, cx, b) => {
            // Wild spiky dark mane + Fierce Horned Iron Crown
            c.oval(cx, 7 + b, 7.2, 3.2, '#3d251e');
            c.rect(cx - 6, 8 + b, 13, 2, '#636e72');
            c.line(cx - 6, 8 + b, cx - 10, 3 + b, '#f5f6fa', 2);
            c.line(cx + 6, 8 + b, cx + 10, 3 + b, '#f5f6fa', 2);
            // Red Rage War-Paint Stripes on chest & cheeks
            c.rect(cx - 3, 19 + b, 7, 1, '#ff4757');
            c.rect(cx - 2, 20 + b, 5, 1, '#eb3b5a');
          },
          drawGear: (c, cx, b, f) => {
            // Massive Double-Bit Greataxe pulsing with crimson rage
            const ay = 5 + b - f * 2;
            c.line(cx + 9, ay + 2, cx + 9, ay + 20, '#8d5524', 2);
            c.oval(cx + 6, ay + 5, 3.5, 4.5, '#b2bec3');
            c.oval(cx + 12, ay + 5, 3.5, 4.5, '#b2bec3');
            c.rect(cx + 3, ay + 3, 1, 5, f ? '#ff4757' : '#ffffff');
            c.rect(cx + 15, ay + 3, 1, 5, f ? '#ff4757' : '#ffffff');
          }
        });
      }, { motion: 'px-motion-heavy', aura: '#ff4757' }),

    rogue: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#2c3147', pauldron: '#1e2233', cape: '#1b1e2e', belt: '#4a3525',
          trim: '#2ed573', boots: '#1a1c29', eye: '#2ed573',
          drawHeadgear: (c, cx, b, f) => {
            // Shadow Cowl Hood + Crimson/Dark Face Mask + Flowing Scarf
            c.oval(cx, 9 + b, 7.5, 6.2, '#25293d');
            c.oval(cx, 11 + b, 5.2, 4.0, '#141722');
            c.oval(cx, 11 + b, 4.6, 2.2, '#f3d1b0', false);
            c.chibiEye(cx - 4, 10 + b, '#2ed573');
            c.chibiEye(cx + 2, 10 + b, '#2ed573');
            // Mask covering lower face
            c.rect(cx - 5, 13 + b, 11, 3, '#1e2233');
            // Flowing scarf tail
            c.line(cx - 5, 16 + b, cx - 11 - f, 19 + b, '#2ed573', 2);
          },
          drawGear: (c, cx, b, f) => {
            // Twin Poisoned Curved Daggers
            c.line(cx - 8, 20 + b, cx - 12, 15 + b - f, '#dfe6e9', 2);
            c.px(cx - 12, 14 + b - f, '#2ed573');
            c.line(cx + 8, 19 + b, cx + 13, 14 + b + f, '#dfe6e9', 2);
            c.px(cx + 13, 13 + b + f, '#55efc4');
          }
        });
      }, { motion: 'px-motion-agile', aura: '#2ed573' }),

    ranger: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#27ae60', pauldron: '#196f3d', cape: '#145a32', belt: '#784212',
          trim: '#f6c967', pants: '#34495e', boots: '#5d4037', eye: '#55efc4',
          drawHeadgear: (c, cx, b) => {
            // Elven Forest Hood + Silver Flowing Bangs (Drizzt!) + Pointed Ears
            c.oval(cx, 8 + b, 7.4, 4.6, '#1e8449');
            c.rect(cx - 6, 9 + b, 13, 2, '#ecf0f1'); // silver hair fringe
            c.rect(cx - 7, 10 + b, 2, 5, '#dfe6e9');
            c.rect(cx + 6, 10 + b, 2, 5, '#dfe6e9');
            c.px(cx - 8, 11 + b, '#f7d2b4'); // pointed elven ear
            c.px(cx + 8, 11 + b, '#f7d2b4');
          },
          drawGear: (c, cx, b, f) => {
            // Ornate Silver Longbow + Glowing Emerald Arrow
            const bx = cx + 9;
            c.line(bx - 1, 9 + b, bx + 3, 15 + b, '#a0522d', 2);
            c.line(bx + 3, 15 + b, bx + 3, 22 + b, '#a0522d', 2);
            c.line(bx + 3, 22 + b, bx - 1, 27 + b, '#a0522d', 2);
            c.line(bx - 1, 10 + b, bx - 1, 26 + b, '#dfe6e9', 1);
            // Glowing Magic Arrow pulled slightly on f=1
            c.line(bx - 4 - f, 18 + b, bx + 5, 18 + b, '#55efc4', 1);
            c.rect(bx + 4, 17 + b, 2, 3, '#ffffff');
          }
        });
      }, { motion: 'px-motion-agile', aura: '#55efc4' }),

    wizard: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#2e86de', pauldron: '#1b4f72', cape: '#192a56', belt: '#f6c967',
          trim: '#00d2d3', chestAccent: '#f6c967', boots: '#1b4f72', eye: '#00d2d3',
          drawHeadgear: (c, cx, b, f) => {
            // Flowing white sage beard
            c.oval(cx, 15 + b, 4.5, 2.8, '#f5f6fa');
            // Iconic Floppy Starry Pointed Wizard Hat!
            c.oval(cx, 8 + b, 9.5, 2.2, '#2e86de');
            c.line(cx - 6, 7 + b, cx + 1 + f, 1 + b, '#2e86de', 4);
            c.line(cx + 5, 7 + b, cx + 1 + f, 1 + b, '#1b4f72', 3);
            c.rect(cx - 6, 7 + b, 13, 1, '#f6c967'); // gold hatband
            c.px(cx - 2, 4 + b, '#f6c967'); // star
            c.px(cx + 2, 5 + b, '#ffeaa7');
          },
          drawGear: (c, cx, b, f) => {
            // Tall Arcane Staff + Floating Pulsing Crystal
            const sx = cx + 10;
            c.rect(sx, 10 + b, 2, 19, '#784212');
            c.oval(sx + 1, 8 + b - f, 3.2, 3.2, f ? '#a29bfe' : '#00d2d3');
            c.rect(sx, 7 + b - f, 2, 2, '#ffffff');
            // Orbiting mini arcane spark
            c.px(sx - 4 + f * 7, 6 + b, '#ffeaa7');
          }
        });
      }, { motion: 'px-motion-float', aura: '#00d2d3' }),

    cleric: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#f5f6fa', pauldron: '#f6c967', cape: '#74b9ff', belt: '#f6c967',
          trim: '#ffd32a', chestAccent: '#f6c967', boots: '#f6c967', eye: '#f39c12',
          drawHeadgear: (c, cx, b, f) => {
            // Floating Golden Pixel Halo!
            c.rect(cx - 4, 2 + b - f, 9, 1, '#ffd32a');
            c.rect(cx - 5, 3 + b - f, 2, 1, '#ffeaa7');
            c.rect(cx + 4, 3 + b - f, 2, 1, '#ffeaa7');
            // Warm Blonde Hair + Gold Circlet
            c.oval(cx, 7 + b, 7, 3.5, '#f6c967');
            c.rect(cx - 7, 8 + b, 2, 7, '#f1c40f');
            c.rect(cx + 6, 8 + b, 2, 7, '#f1c40f');
            c.rect(cx - 4, 8 + b, 9, 1, '#ffffff');
          },
          drawGear: (c, cx, b, f) => {
            // Radiant Sun Morningstar Mace
            const mx = cx + 10;
            c.rect(mx, 12 + b, 2, 14, '#b7791f');
            c.oval(mx + 1, 10 + b - f, 3.5, 3.5, '#ffd32a');
            c.px(mx + 1, 5 + b - f, '#ffffff');
            c.px(mx + 5, 10 + b - f, '#ffffff');
            c.px(mx - 3, 10 + b - f, '#ffffff');
          }
        });
      }, { motion: 'px-motion-float', aura: '#ffeaa7' }),

    paladin: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#f6c967', pauldron: '#ffeaa7', cape: '#eb3b5a', belt: '#b7791f',
          trim: '#ffffff', chestAccent: '#ffffff', boots: '#f6c967', eye: '#3498db',
          drawHeadgear: (c, cx, b, f) => {
            // Golden Winged Greathelm!
            c.oval(cx, 7 + b, 7, 3.5, '#f6c967');
            c.rect(cx - 7, 8 + b, 2, 5, '#ffd32a');
            c.rect(cx + 6, 8 + b, 2, 5, '#ffd32a');
            // Twin White Angel Wings on Helm sides
            c.line(cx - 7, 8 + b, cx - 12, 3 + b - f, '#ffffff', 2);
            c.line(cx + 7, 8 + b, cx + 12, 3 + b - f, '#ffffff', 2);
          },
          drawGear: (c, cx, b, f) => {
            // Left: Holy Tower Shield
            c.shadedRect(cx - 11, 16 + b, 6, 10, '#f5f6fa');
            c.rect(cx - 9, 17 + b, 2, 8, '#f6c967');
            c.rect(cx - 10, 19 + b, 4, 2, '#f6c967');
            // Right: Blazing Sunblade Greatsword
            const sy = 4 + b - f * 2;
            c.rect(cx + 9, sy, 3, 15, '#ffeaa7');
            c.rect(cx + 10, sy, 1, 14, '#ffffff');
            c.rect(cx + 7, sy + 14, 7, 2, '#f6c967');
            c.rect(cx + 9, sy + 16, 3, 3, '#c0392b');
          }
        });
      }, { motion: 'px-motion-heavy', aura: '#f6c967' }),

    warlock: () =>
      renderAnimatedSprite(32, 32, (c, f) => {
        drawChibiBase(c, f, {
          armor: '#5b2c6f', pauldron: '#3c1e5a', cape: '#211033', belt: '#1a0c29',
          trim: '#e056fd', chestAccent: '#e056fd', boots: '#1a0c29', eye: '#e056fd',
          drawHeadgear: (c, cx, b) => {
            // Horned Occult Hood + Shadowed Face + Glowing Magenta Eyes
            c.oval(cx, 9 + b, 7.6, 6.4, '#4a235a');
            c.oval(cx, 11 + b, 5.2, 4.2, '#14091f', false);
            c.glowEye(cx - 4, 10 + b, '#e056fd');
            c.glowEye(cx + 2, 10 + b, '#e056fd');
            // Curved Demon Horns piercing hood
            c.line(cx - 5, 5 + b, cx - 9, 1 + b, '#e056fd', 2);
            c.line(cx + 5, 5 + b, cx + 9, 1 + b, '#e056fd', 2);
          },
          drawGear: (c, cx, b, f) => {
            // Floating Eldritch Grimoire + Crackling Void Flame
            const gx = cx + 9, gy = 14 + b - f * 2;
            c.shadedRect(gx - 1, gy + 2, 6, 7, '#2c193d');
            c.rect(gx, gy + 3, 4, 5, '#f5f6fa');
            c.oval(gx + 2, gy - 2, 3.2, 3.6, f ? '#ff4757' : '#e056fd');
            c.rect(gx + 1, gy - 3, 2, 2, '#ffffff');
          }
        });
      }, { motion: 'px-motion-float', aura: '#e056fd' })
  };

  // ==========================================================================
  // 2. FINE 32x32 / 40x40 SD DEFORMED MONSTER DRAWERS (ALL 82 MONSTERS UNIQUE!)
  // ==========================================================================
  const MONSTER_DRAWERS = {
    beholder(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.56);
      const r = Math.floor(c.w * 0.27);
      // 6 Curved Waving Eyestalks!
      const stalks = [
        [-r - 3, -r - 3 - f], [-r + 1, -r - 6 + f], [0, -r - 7 - f],
        [r - 1, -r - 6 + f], [r + 3, -r - 3 - f], [-r - 4, -2 + f], [r + 4, -2 - f]
      ];
      stalks.forEach(([dx, dy]) => {
        c.line(cx + dx * 0.55, cy + dy * 0.55, cx + dx, cy + dy, s.p, 2);
        c.oval(cx + dx, cy + dy, 2.1, 2.1, '#ffffff', false);
        c.px(cx + dx, cy + dy, s.e);
      });
      // Round Shaded Beholder Body
      c.oval(cx, cy, r, r - 1, s.p);
      // Giant Glossy Central Eye!
      const er = Math.max(4, Math.floor(r * 0.52));
      c.oval(cx, cy - 2, er, er - 1, '#f5f6fa', false);
      c.oval(cx, cy - 2, Math.floor(er * 0.65), Math.floor(er * 0.65), s.a);
      c.oval(cx, cy - 2, Math.max(1.5, er * 0.32), Math.max(1.5, er * 0.35), '#0e1018', false);
      c.rect(cx - 2, cy - 4, 2, 2, '#ffffff');
      // Jagged Grinning Maw
      c.rect(cx - Math.floor(r * 0.6), cy + Math.floor(r * 0.38), Math.floor(r * 1.2), 3, '#1a0a14');
      for (let tx = -Math.floor(r * 0.5); tx <= Math.floor(r * 0.45); tx += 3) {
        c.px(cx + tx, cy + Math.floor(r * 0.38) + (f ? 1 : 0), '#ffffff');
      }
    },

    dragon(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.55);
      const wf = f ? 4 : -3;
      // Sweeping Webbed Wings (flapping F1 <-> F2)
      c.line(cx - 4, cy - 1, cx - Math.floor(c.w * 0.44), cy - 8 + wf, s.d, 3);
      c.line(cx + 4, cy - 1, cx + Math.floor(c.w * 0.44), cy - 8 + wf, s.d, 3);
      c.oval(cx - Math.floor(c.w * 0.28), cy - 2 + Math.floor(wf * 0.5), 6, 4.5, s.d);
      c.oval(cx + Math.floor(c.w * 0.28), cy - 2 + Math.floor(wf * 0.5), 6, 4.5, s.d);
      // Curled Tail
      c.line(cx + 5, cy + 7, cx + 13, cy + 4 - f, s.p, 2);
      c.px(cx + 14, cy + 3 - f, s.a);
      // Chibi Plated Dragon Body & Belly
      c.oval(cx, cy + 4, 6.5, 7, s.p);
      c.oval(cx, cy + 5, 4, 5, s.a);
      // Sturdy Legs + Claws
      c.shadedRect(cx - 6, cy + 8, 4, 4, s.d);
      c.shadedRect(cx + 3, cy + 8, 4, 4, s.d);
      // Expressive SD Dragon Head + Horns + Snout
      c.oval(cx, cy - 6 + f, 7, 5.5, s.p);
      c.line(cx - 5, cy - 10 + f, cx - 9, cy - 14 + f, s.a, 2);
      c.line(cx + 5, cy - 10 + f, cx + 9, cy - 14 + f, s.a, 2);
      c.chibiEye(cx - 4, cy - 7 + f, s.e);
      c.chibiEye(cx + 2, cy - 7 + f, s.e);
      // Glowing Breath Ember
      c.rect(cx - 2, cy - 2 + f, 5, 2, f ? s.e : s.a);
    },

    tiamat(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.62);
      const wf = f ? 4 : -4;
      // Colossal Dark Dragon Wings
      c.oval(cx - 13, cy - 3 + wf, 8, 6, '#3d1530');
      c.oval(cx + 13, cy - 3 + wf, 8, 6, '#3d1530');
      // Armored Dragon Queen Body
      c.oval(cx, cy + 3, 9, 8.5, '#4a1936');
      c.oval(cx, cy + 4, 5.5, 6, '#f6c967');
      c.shadedRect(cx - 7, cy + 10, 5, 5, '#2d1022');
      c.shadedRect(cx + 3, cy + 10, 5, 5, '#2d1022');
      // ALL 5 CHROMATIC DRAGON HEADS (Red, Blue, Green, Black, White)!
      const heads = [
        { dx: -13, dy: -11 + f, col: '#ff4757', eye: '#fff200' },
        { dx: -7,  dy: -16 - f, col: '#2e86de', eye: '#00d2d3' },
        { dx: 0,   dy: -18 + f, col: '#2ed573', eye: '#ffeaa7' },
        { dx: 7,   dy: -16 - f, col: '#2f3542', eye: '#ff4757' },
        { dx: 13,  dy: -11 + f, col: '#ecf0f1', eye: '#74b9ff' }
      ];
      heads.forEach(hd => {
        c.line(cx + hd.dx * 0.35, cy - 3, cx + hd.dx, cy + hd.dy + 2, hd.col, 3);
        c.oval(cx + hd.dx, cy + hd.dy, 3.6, 3.2, hd.col);
        c.px(cx + hd.dx - 1, cy + hd.dy, hd.eye);
        c.px(cx + hd.dx + 1, cy + hd.dy, hd.eye);
      });
    },

    mindflayer(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // High-Collared Illithid Robe
      c.oval(cx, Math.floor(c.h * 0.68) + b, 7, 8, s.d);
      c.shadedRect(cx - 7, Math.floor(c.h * 0.44) + b, 15, 4, s.a);
      // Bulbous Squid Head
      c.oval(cx, Math.floor(c.h * 0.31) + b, 7.2, 6.2, s.p);
      // Luminous Psionic Eyes
      c.glowEye(cx - 4, Math.floor(c.h * 0.3) + b, s.e);
      c.glowEye(cx + 2, Math.floor(c.h * 0.3) + b, s.e);
      // 4 Wriggling Face Tentacles
      for (let i = -3; i <= 3; i += 2) {
        const sway = (i < 0 ? -1 : 1) * (f ? 2 : 0);
        c.line(cx + i, Math.floor(c.h * 0.4) + b, cx + i + sway, Math.floor(c.h * 0.56) + b, s.p, 2);
      }
      // Floating Psionic Orb
      c.oval(cx + 10, Math.floor(c.h * 0.45) - f * 2, 3, 3, s.a);
      c.px(cx + 10, Math.floor(c.h * 0.45) - f * 2, '#ffffff');
    },

    brain(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.46) + f;
      const rx = Math.floor(c.w * 0.33), ry = Math.floor(c.h * 0.25);
      // Glowing Psionic Aura Rings / Legs
      for (let lx = -rx + 2; lx <= rx - 2; lx += 4) {
        c.line(cx + lx, cy + ry - 1, cx + lx + (f ? 1 : -1), cy + ry + 7, s.d, 2);
      }
      // Convoluted Brain Lobes
      c.oval(cx, cy, rx, ry, s.p);
      c.oval(cx - Math.floor(rx * 0.4), cy - 2, rx * 0.45, ry * 0.55, shade(s.p, 0.25));
      c.oval(cx + Math.floor(rx * 0.4), cy - 2, rx * 0.45, ry * 0.55, shade(s.p, 0.25));
      // Brain groove lines
      c.line(cx, cy - ry + 2, cx, cy + ry - 2, s.d, 1);
      c.line(cx - rx + 3, cy, cx - 2, cy - 2, s.d, 1);
      c.line(cx + 2, cy + 1, cx + rx - 3, cy - 1, s.d, 1);
      // Glowing Psionic Core Eyes
      c.glowEye(cx - 4, cy + 1, s.e);
      c.glowEye(cx + 2, cy + 1, s.e);
    },

    spider(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.56);
      const sc = c.w >= 40 ? 1.2 : 1;
      // 8 Jointed Scuttling Pixel Legs!
      for (let i = 0; i < 4; i++) {
        const yOff = (-4 + i * 3) * sc;
        const step = (i % 2 === f) ? -2 : 2;
        c.line(cx - 5 * sc, cy + yOff, cx - 12 * sc, cy + yOff - 3 + step, s.d, 2);
        c.line(cx - 12 * sc, cy + yOff - 3 + step, cx - 14 * sc, cy + yOff + 4 + step, s.d, 1);
        c.line(cx + 5 * sc, cy + yOff, cx + 12 * sc, cy + yOff - 3 - step, s.d, 2);
        c.line(cx + 12 * sc, cy + yOff - 3 - step, cx + 14 * sc, cy + yOff + 4 - step, s.d, 1);
      }
      // Plump Shaded Abdomen with Crimson/Gold Hourglass
      c.oval(cx, cy - 4 * sc + f, 7.5 * sc, 6.5 * sc, s.p);
      c.rect(cx - 2, cy - 6 * sc + f, 5, 2, s.a);
      c.rect(cx - 1, cy - 4 * sc + f, 3, 2, s.a);
      // Spider Head + Cluster of 4 Glowing Eyes + Fangs
      c.oval(cx, cy + 4 * sc, 5.5 * sc, 4.5 * sc, s.d);
      c.px(cx - 3, cy + 3 * sc, s.e); c.px(cx - 1, cy + 2 * sc, s.e);
      c.px(cx + 1, cy + 2 * sc, s.e); c.px(cx + 3, cy + 3 * sc, s.e);
      c.rect(cx - 2, cy + 7 * sc, 1, 2, '#ffffff');
      c.rect(cx + 2, cy + 7 * sc, 1, 2, '#ffffff');
    },

    slime(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.56);
      const sw = f ? 2 : 0, sh = f ? -2 : 0;
      // Translucent Gel Body
      c.shadedRect(cx - 9 - sw, cy - 8 - sh, 19 + sw * 2, 17 + sh, s.p);
      // Glossy top-left shine
      c.rect(cx - 7 - sw, cy - 6 - sh, 5, 2, '#ffffff');
      c.rect(cx - 7 - sw, cy - 4 - sh, 2, 4, s.a);
      // Floating Pixel Skull & Sword trapped inside!
      c.oval(cx + 1, cy - 1 - f, 3.5, 3, '#f5f6fa', false);
      c.px(cx, cy - 1 - f, '#12131c');
      c.px(cx + 2, cy - 1 - f, '#12131c');
      c.line(cx - 5, cy + 4, cx + 5, cy + 2, '#dfe6e9', 1);
    },

    mimic(c, f, s) {
      const cx = Math.floor(c.w / 2), cy = Math.floor(c.h * 0.58);
      // Wooden & Gold Chest Base
      c.shadedRect(cx - 10, cy, 21, 9, s.p);
      c.rect(cx - 10, cy, 21, 2, s.a);
      c.rect(cx - 2, cy, 5, 4, s.a);
      if (f === 0) {
        // Lid closed with glowing eyes peeking through crack!
        c.shadedRect(cx - 10, cy - 7, 21, 7, shade(s.p, 0.15));
        c.rect(cx - 10, cy - 1, 21, 2, '#140812');
        c.glowEye(cx - 5, cy - 2, s.e);
        c.glowEye(cx + 3, cy - 2, s.e);
      } else {
        // Lid snapped wide open with fangs & purple tongue!
        c.shadedRect(cx - 11, cy - 12, 23, 6, shade(s.p, 0.2));
        c.rect(cx - 9, cy - 6, 19, 7, '#4a0e24');
        for (let tx = -7; tx <= 7; tx += 3) {
          c.rect(cx + tx, cy - 6, 2, 2, '#ffffff');
          c.rect(cx + tx, cy - 1, 2, 2, '#ffffff');
        }
        c.oval(cx + 2, cy - 2, 4, 2.5, s.e);
        c.glowEye(cx - 6, cy - 10, '#ffdd59');
        c.glowEye(cx + 4, cy - 10, '#ffdd59');
      }
    },

    goblin(c, f, s) {
      const cx = Math.floor(c.w / 2), oy = c.h - 32, b = f + oy;
      // Compact SD Goblin Body + Leather Tunic
      c.shadedRect(cx - 4, 23 + oy, 3, 5, s.d);
      c.shadedRect(cx + 2, 23 + oy, 3, 5, s.d);
      c.shadedRect(cx - 5, 17 + b, 11, 7, s.d);
      c.rect(cx - 5, 21 + b, 11, 2, s.a);
      // Big Chibi Head + Huge Pointed Goblin Ears!
      c.line(cx - 6, 11 + b, cx - 13, 8 + b - f, s.p, 3);
      c.line(cx + 6, 11 + b, cx + 13, 8 + b - f, s.p, 3);
      c.oval(cx, 11 + b, 6.5, 5.5, s.p);
      c.chibiEye(cx - 4, 10 + b, s.e);
      c.chibiEye(cx + 2, 10 + b, s.e);
      // Jagged Grin & Crude Spear/Dagger
      c.rect(cx - 2, 14 + b, 5, 1, '#ffffff');
      c.line(cx + 8, 22 + b, cx + 12, 8 + b - f * 2, '#8d5524', 2);
      c.rect(cx + 11, 6 + b - f * 2, 3, 4, '#dfe6e9');
    },

    brute(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Massive Heavy SD Shoulders & Torso
      c.shadedRect(cx - 6, Math.floor(c.h * 0.72), 5, 6, s.d);
      c.shadedRect(cx + 2, Math.floor(c.h * 0.72), 5, 6, s.d);
      c.oval(cx, Math.floor(c.h * 0.56) + b, 9.5, 7.5, s.p);
      c.shadedRect(cx - 8, Math.floor(c.h * 0.62) + b, 17, 3, s.d);
      c.rect(cx - 2, Math.floor(c.h * 0.62) + b, 5, 3, s.a);
      // Fierce Big Head + Tusks
      c.oval(cx, Math.floor(c.h * 0.31) + b, 7, 5.5, s.p);
      c.chibiEye(cx - 4, Math.floor(c.h * 0.28) + b, s.e);
      c.chibiEye(cx + 2, Math.floor(c.h * 0.28) + b, s.e);
      c.rect(cx - 4, Math.floor(c.h * 0.39) + b, 2, 3, '#ffffff');
      c.rect(cx + 3, Math.floor(c.h * 0.39) + b, 2, 3, '#ffffff');
      // Giant Club / Cleaver
      c.line(cx + 10, Math.floor(c.h * 0.64) + b, cx + 13, Math.floor(c.h * 0.22) - f * 2, '#6d4c41', 3);
      c.oval(cx + 13, Math.floor(c.h * 0.22) - f * 2, 3.5, 4, s.a);
    },

    ettin(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      c.shadedRect(cx - 7, Math.floor(c.h * 0.72), 6, 7, s.d);
      c.shadedRect(cx + 2, Math.floor(c.h * 0.72), 6, 7, s.d);
      c.oval(cx, Math.floor(c.h * 0.56) + b, 11, 8.5, s.p);
      c.rect(cx - 9, Math.floor(c.h * 0.62) + b, 19, 3, s.a);
      // TWO DISTINCT CHIBI GIANT HEADS!
      c.oval(cx - 6, Math.floor(c.h * 0.28) + b, 5.2, 4.8, s.p);
      c.oval(cx + 6, Math.floor(c.h * 0.28) - b, 5.2, 4.8, s.p);
      c.glowEye(cx - 8, Math.floor(c.h * 0.26) + b, s.e);
      c.glowEye(cx - 5, Math.floor(c.h * 0.26) + b, s.e);
      c.glowEye(cx + 4, Math.floor(c.h * 0.26) - b, s.e);
      c.glowEye(cx + 7, Math.floor(c.h * 0.26) - b, s.e);
      // Dual Spiked Clubs
      c.line(cx - 13, Math.floor(c.h * 0.6), cx - 15, Math.floor(c.h * 0.28) + f * 2, '#784212', 3);
      c.line(cx + 13, Math.floor(c.h * 0.6), cx + 15, Math.floor(c.h * 0.28) - f * 2, '#784212', 3);
    },

    skeleton(c, f, s) {
      const cx = Math.floor(c.w / 2), oy = c.h - 32, b = f + oy;
      // Ribcage & Armor
      c.rect(cx - 3, 23 + oy, 2, 5, '#e8e8e8');
      c.rect(cx + 2, 23 + oy, 2, 5, '#e8e8e8');
      c.shadedRect(cx - 4, 17 + b, 9, 6, s.p);
      c.rect(cx - 3, 18 + b, 7, 1, '#f5f6fa');
      c.rect(cx - 3, 20 + b, 7, 1, '#f5f6fa');
      // Detailed SD Skull
      c.oval(cx, 10 + b, 6.2, 5.4, '#f5f6fa');
      c.rect(cx - 3, 14 + b, 7, 3, '#dcdde1');
      c.rect(cx - 4, 9 + b, 3, 3, '#10101a');
      c.rect(cx + 2, 9 + b, 3, 3, '#10101a');
      c.px(cx - 3, 10 + b, s.e);
      c.px(cx + 3, 10 + b, s.e);
      // Curved Scimitar / Shield
      c.line(cx + 8, 20 + b, cx + 12, 7 + b - f * 2, '#ecf0f1', 2);
      c.shadedRect(cx - 10, 17 + b, 5, 7, s.d);
    },

    wraith(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Ethereal Swirling Spectral Shroud
      c.oval(cx, Math.floor(c.h * 0.52) + b, 8, 9, s.p);
      c.line(cx - 5, Math.floor(c.h * 0.72) + b, cx - 8 - f, Math.floor(c.h * 0.88), s.d, 2);
      c.line(cx, Math.floor(c.h * 0.74) + b, cx + f, Math.floor(c.h * 0.9), s.p, 3);
      c.line(cx + 5, Math.floor(c.h * 0.72) + b, cx + 8 + f, Math.floor(c.h * 0.88), s.d, 2);
      // Hooded Void Face + Burning Spectral Eyes
      c.oval(cx, Math.floor(c.h * 0.3) + b, 6.8, 5.8, s.d);
      c.oval(cx, Math.floor(c.h * 0.33) + b, 4.5, 3.8, '#090910', false);
      c.glowEye(cx - 3, Math.floor(c.h * 0.31) + b, s.e);
      c.glowEye(cx + 2, Math.floor(c.h * 0.31) + b, s.e);
      // Spectral Claws
      c.line(cx - 8, Math.floor(c.h * 0.5) + b, cx - 12, Math.floor(c.h * 0.44) - f, s.a, 2);
      c.line(cx + 8, Math.floor(c.h * 0.5) + b, cx + 12, Math.floor(c.h * 0.44) + f, s.a, 2);
    },

    lich(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Ornate Royal Lich Robes + Gold Trim
      c.oval(cx, Math.floor(c.h * 0.64) + b, 9, 10, s.p);
      c.rect(cx - 2, Math.floor(c.h * 0.46) + b, 5, 14, s.a);
      // Glowing Skeletal Skull + Golden Crown
      c.oval(cx, Math.floor(c.h * 0.31) + b, 6.5, 5.5, '#ecf0f1');
      c.rect(cx - 4, Math.floor(c.h * 0.3) + b, 3, 3, '#10101a');
      c.rect(cx + 2, Math.floor(c.h * 0.3) + b, 3, 3, '#10101a');
      c.px(cx - 3, Math.floor(c.h * 0.31) + b, s.e);
      c.px(cx + 3, Math.floor(c.h * 0.31) + b, s.e);
      // Phylactery Necrotic Staff
      const sx = cx + 12;
      c.rect(sx, Math.floor(c.h * 0.28) + b, 2, 22, '#4a235a');
      c.oval(sx + 1, Math.floor(c.h * 0.22) - f * 2, 4, 4, s.e);
      c.rect(sx, Math.floor(c.h * 0.21) - f * 2, 2, 2, '#ffffff');
    },

    vampire(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Dramatic High-Collar Crimson Cape
      c.oval(cx, Math.floor(c.h * 0.58) + b, 10 + f, 10, s.p);
      c.line(cx - 9, Math.floor(c.h * 0.26) + b, cx - 5, Math.floor(c.h * 0.42) + b, s.p, 3);
      c.line(cx + 9, Math.floor(c.h * 0.26) + b, cx + 5, Math.floor(c.h * 0.42) + b, s.p, 3);
      // Aristocratic Dark Suit + Gold Cravat
      c.shadedRect(cx - 5, Math.floor(c.h * 0.46) + b, 11, 12, s.d);
      c.rect(cx - 1, Math.floor(c.h * 0.47) + b, 3, 5, s.a);
      // Pale Noble Chibi Face + Slick Hair + Glowing Red Eyes + Fangs
      c.oval(cx, Math.floor(c.h * 0.3) + b, 6.4, 5.5, '#f2e8eb');
      c.oval(cx, Math.floor(c.h * 0.22) + b, 6.8, 3, '#1b1b26');
      c.chibiEye(cx - 4, Math.floor(c.h * 0.29) + b, s.e);
      c.chibiEye(cx + 2, Math.floor(c.h * 0.29) + b, s.e);
      c.px(cx - 1, Math.floor(c.h * 0.38) + b, '#ffffff');
      c.px(cx + 2, Math.floor(c.h * 0.38) + b, '#ffffff');
    },

    demon(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      const wf = f ? 3 : -3;
      // Bat-Demon Wings
      c.oval(cx - 11, Math.floor(c.h * 0.44) + wf, 6, 5, s.d);
      c.oval(cx + 11, Math.floor(c.h * 0.44) + wf, 6, 5, s.d);
      // Muscular Fiend Body
      c.shadedRect(cx - 6, Math.floor(c.h * 0.72), 4, 6, s.d);
      c.shadedRect(cx + 3, Math.floor(c.h * 0.72), 4, 6, s.d);
      c.oval(cx, Math.floor(c.h * 0.56) + b, 8, 7, s.p);
      c.rect(cx - 6, Math.floor(c.h * 0.62) + b, 13, 2, s.a);
      // Horned Demon Head
      c.oval(cx, Math.floor(c.h * 0.32) + b, 6.5, 5.4, s.p);
      c.line(cx - 5, Math.floor(c.h * 0.24) + b, cx - 10, Math.floor(c.h * 0.12) + b, s.a, 2);
      c.line(cx + 5, Math.floor(c.h * 0.24) + b, cx + 10, Math.floor(c.h * 0.12) + b, s.a, 2);
      c.glowEye(cx - 4, Math.floor(c.h * 0.31) + b, s.e);
      c.glowEye(cx + 2, Math.floor(c.h * 0.31) + b, s.e);
      // Hellfire Blade
      c.line(cx + 9, Math.floor(c.h * 0.58) + b, cx + 14, Math.floor(c.h * 0.24) - f * 2, s.a, 2);
    },

    demogorgon(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Twin Tentacle Arms
      c.line(cx - 8, Math.floor(c.h * 0.52), cx - 16, Math.floor(c.h * 0.38) + f * 3, s.a, 3);
      c.line(cx + 8, Math.floor(c.h * 0.52), cx + 16, Math.floor(c.h * 0.38) - f * 3, s.a, 3);
      c.oval(cx, Math.floor(c.h * 0.58) + b, 9.5, 8.5, s.p);
      c.shadedRect(cx - 7, Math.floor(c.h * 0.74), 5, 6, s.d);
      c.shadedRect(cx + 3, Math.floor(c.h * 0.74), 5, 6, s.d);
      // Twin Mandrill Demon Heads!
      c.oval(cx - 6, Math.floor(c.h * 0.28) + b, 5.2, 4.8, s.p);
      c.oval(cx + 6, Math.floor(c.h * 0.28) - b, 5.2, 4.8, s.p);
      c.glowEye(cx - 8, Math.floor(c.h * 0.26) + b, s.e);
      c.glowEye(cx + 6, Math.floor(c.h * 0.26) - b, s.e);
    },

    knight(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      c.oval(cx - 1, Math.floor(c.h * 0.62) + b, 8, 7, s.d); // cape
      c.shadedRect(cx - 5, Math.floor(c.h * 0.73), 4, 6, s.d);
      c.shadedRect(cx + 2, Math.floor(c.h * 0.73), 4, 6, s.d);
      c.shadedRect(cx - 6, Math.floor(c.h * 0.46) + b, 13, 9, s.p);
      c.rect(cx - 1, Math.floor(c.h * 0.48) + b, 3, 6, s.a);
      // Dark Horned Greathelm + Glowing Visor Eyes
      c.oval(cx, Math.floor(c.h * 0.3) + b, 6.5, 5.6, s.p);
      c.rect(cx - 5, Math.floor(c.h * 0.3) + b, 11, 3, '#0c0d14');
      c.glowEye(cx - 4, Math.floor(c.h * 0.3) + b, s.e);
      c.glowEye(cx + 2, Math.floor(c.h * 0.3) + b, s.e);
      c.line(cx - 5, Math.floor(c.h * 0.22) + b, cx - 9, Math.floor(c.h * 0.12) + b, s.a, 2);
      c.line(cx + 5, Math.floor(c.h * 0.22) + b, cx + 9, Math.floor(c.h * 0.12) + b, s.a, 2);
      // Runeblade
      c.rect(cx + 10, Math.floor(c.h * 0.18) + b - f * 2, 3, 15, s.a);
      c.rect(cx + 11, Math.floor(c.h * 0.18) + b - f * 2, 1, 14, '#ffffff');
    },

    golem(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Heavy Blocky Armored Construct
      c.shadedRect(cx - 7, Math.floor(c.h * 0.72), 5, 7, s.d);
      c.shadedRect(cx + 3, Math.floor(c.h * 0.72), 5, 7, s.d);
      c.shadedRect(cx - 10, Math.floor(c.h * 0.42) + b, 21, 11, s.p);
      c.shadedRect(cx - 13, Math.floor(c.h * 0.46) + b, 4, 9, s.d);
      c.shadedRect(cx + 10, Math.floor(c.h * 0.46) + b, 4, 9, s.d);
      // Glowing Core Furnace / Rune on Chest
      c.oval(cx, Math.floor(c.h * 0.55) + b, 3.5, 3.5, f ? s.e : s.a);
      // Compact Heavy Head
      c.shadedRect(cx - 6, Math.floor(c.h * 0.24) + b, 13, 7, s.p);
      c.glowEye(cx - 4, Math.floor(c.h * 0.29) + b, s.e);
      c.glowEye(cx + 2, Math.floor(c.h * 0.29) + b, s.e);
    },

    beast(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Fierce SD Quadruped Beast (Owlbear / Displacer Beast / Gnoll)
      c.oval(cx + 2, 19 + b, 8.5, 6, s.p);
      c.oval(cx + 2, 20 + b, 5.5, 4, s.a);
      c.shadedRect(cx - 5, 23 - f, 3, 5, s.d);
      c.shadedRect(cx + 7, 23 + f, 3, 5, s.d);
      // Tail whipping
      c.line(cx + 9, 17 + b, cx + 14, 11 - f * 2, s.a, 2);
      // Expressive Big Beast Head + Ears
      c.oval(cx - 5, 13 + b, 6.2, 5.5, s.p);
      c.line(cx - 9, 9 + b, cx - 10, 5 + b, s.d, 2);
      c.line(cx - 2, 9 + b, cx - 1, 5 + b, s.d, 2);
      c.chibiEye(cx - 9, 12 + b, s.e);
      c.chibiEye(cx - 4, 12 + b, s.e);
      c.rect(cx - 7, 15 + b, 3, 2, s.a);
    },

    worm(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Segmented Coiled Underground Titan Worm
      c.oval(cx + 5, Math.floor(c.h * 0.72), 7.5, 5, s.d);
      c.oval(cx + 1, Math.floor(c.h * 0.62) + b, 8, 5.5, s.p);
      c.oval(cx - 2, Math.floor(c.h * 0.48) + b, 8, 6, s.p);
      // Giant Circular Toothed Maw!
      c.oval(cx - 3, Math.floor(c.h * 0.31) + b, 7.5, 6.5, s.p);
      c.oval(cx - 3, Math.floor(c.h * 0.31) + b, 4.5, 4, '#2b0916', false);
      for (let ang = 0; ang < 8; ang++) {
        const a = (Math.PI * 2 * ang) / 8 + (f ? 0.2 : 0);
        c.px(cx - 3 + Math.cos(a) * 4.5, Math.floor(c.h * 0.31) + b + Math.sin(a) * 4, '#ffffff');
      }
    },

    mushroom(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Plump Myconid Stem + Glowing Eyes
      c.oval(cx, 21 + b, 5.5, 6.5, s.d);
      c.chibiEye(cx - 3, 19 + b, s.e);
      c.chibiEye(cx + 2, 19 + b, s.e);
      // Oversized Glowing Spotted Mushroom Cap!
      c.oval(cx, 12 + b, 11 + f, 6, s.p);
      c.oval(cx - 5, 11 + b, 2.2, 2, s.a);
      c.oval(cx + 4, 10 + b, 2.5, 2, s.a);
      c.oval(cx, 13 + b, 2, 1.5, s.a);
      // Floating glowing spores
      c.px(cx - 10, 7 - f, s.a);
      c.px(cx + 10, 8 + f, s.e);
    },

    serpent(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Coiled Naga / Basilisk / Aboleth Body
      c.oval(cx, Math.floor(c.h * 0.72), 10.5, 4.5, s.d);
      c.oval(cx + (f ? 1 : -1), Math.floor(c.h * 0.6), 8.5, 4, s.p);
      c.line(cx + 2, Math.floor(c.h * 0.56), cx - 1, Math.floor(c.h * 0.34) + b, s.p, 4);
      // Hooded Viper Head + Glowing Eyes + Forked Tongue
      c.oval(cx - 1, Math.floor(c.h * 0.3) + b, 6.5, 5, s.p);
      c.glowEye(cx - 4, Math.floor(c.h * 0.29) + b, s.e);
      c.glowEye(cx + 1, Math.floor(c.h * 0.29) + b, s.e);
      if (f) c.line(cx - 1, Math.floor(c.h * 0.39), cx - 1, Math.floor(c.h * 0.45), '#ff4757', 1);
    },

    insect(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      // Antennae / Pincers
      c.line(cx - 5, 11 + b, cx - 11, 5 + b - f, s.a, 2);
      c.line(cx + 5, 11 + b, cx + 11, 5 + b + f, s.a, 2);
      // Carapace Body + Legs
      for (let i = -1; i <= 1; i++) {
        c.line(cx - 6, 19 + i * 3, cx - 12, 22 + i * 3 + (i % 2 === f ? -1 : 1), s.d, 2);
        c.line(cx + 6, 19 + i * 3, cx + 12, 22 + i * 3 - (i % 2 === f ? -1 : 1), s.d, 2);
      }
      c.oval(cx, 19 + b, 7.5, 6.5, s.p);
      c.oval(cx, 12 + b, 5.5, 4.5, s.d);
      c.glowEye(cx - 3, 11 + b, s.e);
      c.glowEye(cx + 2, 11 + b, s.e);
    },

    mage(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      c.oval(cx, Math.floor(c.h * 0.66) + b, 8.5, 9.5, s.p);
      c.rect(cx - 2, Math.floor(c.h * 0.5) + b, 5, 12, s.a);
      c.oval(cx, Math.floor(c.h * 0.34) + b, 6.2, 5.2, '#f0d8c8');
      // Tall Evil Wizard Hat
      c.oval(cx, Math.floor(c.h * 0.24) + b, 9.5, 2.2, s.d);
      c.line(cx - 5, Math.floor(c.h * 0.22) + b, cx + 2, Math.floor(c.h * 0.06) + b, s.p, 4);
      c.chibiEye(cx - 4, Math.floor(c.h * 0.33) + b, s.e);
      c.chibiEye(cx + 2, Math.floor(c.h * 0.33) + b, s.e);
      // Arcane Staff
      const sx = cx + 11;
      c.rect(sx, Math.floor(c.h * 0.3) + b, 2, 20, s.d);
      c.oval(sx + 1, Math.floor(c.h * 0.24) - f * 2, 3.5, 3.5, s.a);
      c.px(sx + 1, Math.floor(c.h * 0.24) - f * 2, '#ffffff');
    },

    frog(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f * 2;
      // Chaos Slaad Toad Demon
      c.shadedRect(cx - 8, 23, 5, 5, s.d);
      c.shadedRect(cx + 4, 23, 5, 5, s.d);
      c.oval(cx, 19 - b, 9.5, 7, s.p);
      c.oval(cx, 20 - b, 6, 4.5, s.a);
      c.oval(cx - 5, 11 - b, 3.2, 3.2, s.p);
      c.oval(cx + 5, 11 - b, 3.2, 3.2, s.p);
      c.glowEye(cx - 6, 10 - b, s.e);
      c.glowEye(cx + 4, 10 - b, s.e);
      c.rect(cx - 5, 16 - b, 11, 2, '#ffffff');
    },

    angel(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      const wf = f ? 4 : -3;
      // Blazing Fallen Angel Wings
      c.oval(cx - 12, Math.floor(c.h * 0.42) + wf, 7.5, 6, s.p);
      c.oval(cx + 12, Math.floor(c.h * 0.42) + wf, 7.5, 6, s.p);
      // Armored Valkyrie Body + Flowing Battle Skirt & Greaves
      c.shadedRect(cx - 5, Math.floor(c.h * 0.48) + b, 11, 11, s.d);
      c.oval(cx, Math.floor(c.h * 0.78) + b, 6.5, 4.5, s.p);
      c.shadedRect(cx - 4, Math.floor(c.h * 0.8) + b, 3, 4, s.a);
      c.shadedRect(cx + 2, Math.floor(c.h * 0.8) + b, 3, 4, s.a);
      c.rect(cx - 1, Math.floor(c.h * 0.49) + b, 3, 12, s.a);
      // Halo & Face
      c.rect(cx - 5, Math.floor(c.h * 0.14) + b, 11, 2, s.a);
      c.oval(cx, Math.floor(c.h * 0.3) + b, 6, 5.2, '#f5e1d3');
      c.chibiEye(cx - 4, Math.floor(c.h * 0.29) + b, s.e);
      c.chibiEye(cx + 2, Math.floor(c.h * 0.29) + b, s.e);
      // Blazing Flail / Greatsword
      c.rect(cx + 10, Math.floor(c.h * 0.2) + b - f * 2, 3, 18, s.a);
      c.rect(cx + 11, Math.floor(c.h * 0.2) + b - f * 2, 1, 16, '#ffffff');
    },

    skull_lord(c, f, s) {
      const cx = Math.floor(c.w / 2), b = f;
      c.oval(cx, 21 + b, 8.5, 8.5, s.d);
      c.rect(cx - 2, 16 + b, 5, 11, s.a);
      // THREE FLOATING SKULLS!
      [[-7, 10 + b], [0, 8 - b], [7, 10 + b]].forEach(([dx, sy]) => {
        c.oval(cx + dx, sy, 4, 3.6, '#ecf0f1');
        c.px(cx + dx - 1, sy, s.e);
        c.px(cx + dx + 1, sy, s.e);
      });
    }
  };

  // Motion mapping by monster silhouette
  const MOTION_BY_TPL = {
    beholder: 'px-motion-float', dragon: 'px-motion-float', tiamat: 'px-motion-float',
    mindflayer: 'px-motion-float', wraith: 'px-motion-float', lich: 'px-motion-float',
    vampire: 'px-motion-float', mage: 'px-motion-float', angel: 'px-motion-float',
    skull_lord: 'px-motion-float',
    brute: 'px-motion-heavy', ettin: 'px-motion-heavy', demon: 'px-motion-heavy',
    demogorgon: 'px-motion-heavy', knight: 'px-motion-heavy', golem: 'px-motion-heavy',
    brain: 'px-motion-squish', slime: 'px-motion-squish', worm: 'px-motion-squish',
    mushroom: 'px-motion-squish', serpent: 'px-motion-squish',
    spider: 'px-motion-agile', mimic: 'px-motion-agile', goblin: 'px-motion-agile',
    skeleton: 'px-motion-agile', beast: 'px-motion-agile', insect: 'px-motion-agile',
    frog: 'px-motion-agile'
  };

  // Explicit per-monster visual specifications for ALL 82 monsters (ZERO duplicates!)
  const MONSTER_SPECS = {
    // Act 1
    goblin_skirmisher:       { tpl: 'goblin', p: '#58b19f', d: '#2c5f4a', a: '#f6c967', e: '#ff4757' },
    kobold_inventor:         { tpl: 'goblin', p: '#e67e22', d: '#935116', a: '#00d2d3', e: '#f6e58d' },
    skeleton_warrior:        { tpl: 'skeleton', p: '#7f8fa6', d: '#485460', a: '#dcdde1', e: '#00d2d3' },
    orc_berserker:           { tpl: 'brute', p: '#44bd32', d: '#218c74', a: '#eb3b5a', e: '#ffdd59' },
    gelatinous_cube:         { tpl: 'slime', p: '#2ed573', d: '#1e8449', a: '#b8e994', e: '#ffffff' },
    gnoll_pack_lord:         { tpl: 'beast', p: '#cd853f', d: '#6e4720', a: '#eb3b5a', e: '#ffdd59' },
    rust_monster:            { tpl: 'insect', p: '#d35400', d: '#7e3517', a: '#f39c12', e: '#fff200' },
    carrion_crawler:         { tpl: 'worm', p: '#78e08f', d: '#38ada9', a: '#f6b93b', e: '#eb3b5a' },
    owlbear_alpha:           { tpl: 'beast', p: '#a06944', d: '#5d3a22', a: '#f5f6fa', e: '#f6c967', elite: true },
    bugbear_chieftain:       { tpl: 'brute', p: '#b3541e', d: '#642c0c', a: '#f6c967', e: '#ff4757', elite: true },
    mimic_hunter:            { tpl: 'mimic', p: '#9b5926', d: '#5c3312', a: '#f6c967', e: '#e056fd', elite: true },
    troll_warlord:           { tpl: 'brute', p: '#26de81', d: '#127345', a: '#eb3b5a', e: '#fed330', boss: true },
    manticore_ravager:       { tpl: 'dragon', p: '#d35400', d: '#7e3517', a: '#f6c967', e: '#ff4757', boss: true },
    beholder_xanathar:       { tpl: 'beholder', p: '#8e44ad', d: '#4a235a', a: '#f6c967', e: '#00d2d3', boss: true, crown: '#f6c967' },
    young_green_dragon:      { tpl: 'dragon', p: '#27ae60', d: '#145a32', a: '#7bed9f', e: '#fff200', boss: true },
    ettin_king_gror:         { tpl: 'ettin', p: '#95a5a6', d: '#535c68', a: '#eb3b5a', e: '#f6c967', boss: true, crown: '#f6c967' },
    goblin_shaman_king:      { tpl: 'goblin', p: '#c0392b', d: '#641e16', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },

    // Act 2
    drow_assassin:           { tpl: 'knight', p: '#4834d4', d: '#1e1654', a: '#2ed573', e: '#ff4757' },
    hook_horror:             { tpl: 'insect', p: '#576574', d: '#222f3e', a: '#c8d6e5', e: '#f6e58d' },
    giant_phase_spider:      { tpl: 'spider', p: '#18dcff', d: '#192a56', a: '#ffffff', e: '#ff4757' },
    duergar_hammerer:        { tpl: 'brute', p: '#636e72', d: '#2d3436', a: '#ff9f43', e: '#ff6b6b' },
    displacer_beast:         { tpl: 'beast', p: '#2f3542', d: '#131620', a: '#a29bfe', e: '#2ed573' },
    basilisk_gazer:          { tpl: 'serpent', p: '#218c74', d: '#0d473b', a: '#b8e994', e: '#2ed573' },
    ochre_jelly:             { tpl: 'slime', p: '#f6b93b', d: '#b7791f', a: '#ffeaa7', e: '#eb3b5a' },
    myconid_sovereign:       { tpl: 'mushroom', p: '#9b59b6', d: '#dfe6e9', a: '#55efc4', e: '#ffdd59' },
    drider_champion:         { tpl: 'spider', p: '#6c5ce7', d: '#2d1e54', a: '#e056fd', e: '#ff4757', elite: true },
    umbeR_hulk:              { tpl: 'golem', p: '#7f6244', d: '#3d2c1e', a: '#f6e58d', e: '#ff4757', elite: true },
    roper_ambusher:          { tpl: 'worm', p: '#7f8c8d', d: '#34495e', a: '#ff6b81', e: '#ff4757', elite: true },
    drow_priestess:          { tpl: 'mage', p: '#6c5ce7', d: '#2d1e54', a: '#e056fd', e: '#ff4757', boss: true },
    cloaker_shadow:          { tpl: 'wraith', p: '#2c3a47', d: '#141b24', a: '#ff4757', e: '#ff4757', boss: true },
    arachne_matron:          { tpl: 'spider', p: '#c0392b', d: '#2d0c16', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },
    aboleth_leviathan:       { tpl: 'serpent', p: '#00a8ff', d: '#192a56', a: '#ff4757', e: '#ff6b81', boss: true },
    purple_worm_titan:       { tpl: 'worm', p: '#8e44ad', d: '#4a235a', a: '#e056fd', e: '#ffeaa7', boss: true },
    duergar_despot:          { tpl: 'golem', p: '#d35400', d: '#2c3e50', a: '#f6c967', e: '#ff4757', boss: true, crown: '#f6c967' },

    // Act 3
    intellect_devourer:      { tpl: 'brain', p: '#fd79a8', d: '#b33939', a: '#ffeaa7', e: '#ffffff' },
    mind_flayer_arcanist:    { tpl: 'mindflayer', p: '#a29bfe', d: '#341f97', a: '#00d2d3', e: '#ffffff' },
    grimlock_brute:          { tpl: 'brute', p: '#8395a7', d: '#3d4854', a: '#c8d6e5', e: '#576574' },
    nothics_eye:             { tpl: 'beholder', p: '#2ecc71', d: '#145a32', a: '#b8e994', e: '#2ed573' },
    chuul_pincer:            { tpl: 'insect', p: '#00b894', d: '#005b47', a: '#ff7675', e: '#ffdd59' },
    grell_strangler:         { tpl: 'brain', p: '#fab1a0', d: '#d63031', a: '#ffeaa7', e: '#2d3436' },
    otyugh_filth:            { tpl: 'worm', p: '#8c7ae6', d: '#4b4b2a', a: '#badc58', e: '#ffdd59' },
    slaad_death:             { tpl: 'frog', p: '#2f3542', d: '#141720', a: '#eb3b5a', e: '#2ed573' },
    mind_flayer_inquisitor:  { tpl: 'mindflayer', p: '#e056fd', d: '#4a1259', a: '#f6c967', e: '#ffdd59', elite: true },
    githyanki_kithrak:       { tpl: 'knight', p: '#badc58', d: '#535c68', a: '#7ed6df', e: '#f6c967', elite: true },
    beholder_zombie_elite:   { tpl: 'beholder', p: '#557a46', d: '#2c3e26', a: '#badc58', e: '#eb3b5a', elite: true },
    ulitharid_lord:          { tpl: 'mindflayer', p: '#6c5ce7', d: '#1e1142', a: '#ff7675', e: '#00d2d3', boss: true, crown: '#00d2d3' },
    mindwitness_overseer:    { tpl: 'beholder', p: '#9b59b6', d: '#2c1654', a: '#e056fd', e: '#ff7675', boss: true },
    elder_brain_prime:       { tpl: 'brain', p: '#e056fd', d: '#4834d4', a: '#00d2d3', e: '#ffffff', boss: true, crown: '#00d2d3' },
    beholder_hive_mother:    { tpl: 'beholder', p: '#eb3b5a', d: '#581845', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },
    githyanki_supreme:       { tpl: 'knight', p: '#f6c967', d: '#2c3e50', a: '#00d2d3', e: '#ff4757', boss: true, crown: '#f6c967' },
    neothelid_leviathan:     { tpl: 'worm', p: '#a29bfe', d: '#341f97', a: '#ff7675', e: '#00d2d3', boss: true },

    // Act 4
    wight_executioner:       { tpl: 'skeleton', p: '#485460', d: '#1e272e', a: '#00d2d3', e: '#00d2d3' },
    wraith_stalker:          { tpl: 'wraith', p: '#34495e', d: '#121821', a: '#74b9ff', e: '#00d2d3' },
    flesh_golem:             { tpl: 'golem', p: '#a4b0be', d: '#57606f', a: '#ff6b81', e: '#2ed573' },
    vampire_spawn:           { tpl: 'vampire', p: '#706fd3', d: '#2c2c54', a: '#ff4757', e: '#ff4757' },
    banshee_wailer:          { tpl: 'wraith', p: '#7ed6df', d: '#22a6b3', a: '#ffffff', e: '#dff9fb' },
    bone_naga:               { tpl: 'serpent', p: '#dcdde1', d: '#718093', a: '#2ed573', e: '#2ed573' },
    mummy_guardian:          { tpl: 'skeleton', p: '#eccc68', d: '#9c7c38', a: '#f6c967', e: '#ff4757' },
    shadow_demon:            { tpl: 'demon', p: '#2f3542', d: '#0d0f17', a: '#a29bfe', e: '#e056fd' },
    death_knight_general:    { tpl: 'knight', p: '#2c3a47', d: '#10141c', a: '#ff4757', e: '#ff4757', elite: true },
    iron_golem_sentinel:     { tpl: 'golem', p: '#95a5a6', d: '#2f3640', a: '#ff9f43', e: '#ff4757', elite: true },
    skull_lord_elite:        { tpl: 'skull_lord', p: '#4b4b4b', d: '#1e1e2c', a: '#2ed573', e: '#2ed573', elite: true },
    vampire_lord_strahd:     { tpl: 'vampire', p: '#eb3b5a', d: '#1c1018', a: '#f6c967', e: '#ff4757', boss: true, crown: '#f6c967' },
    nightwalker_titan:       { tpl: 'wraith', p: '#1e272e', d: '#080a0f', a: '#e056fd', e: '#e056fd', boss: true },
    archlich_acererak:       { tpl: 'lich', p: '#6c5ce7', d: '#1e1438', a: '#2ed573', e: '#2ed573', boss: true, crown: '#f6c967' },
    dracolich_aurinax:       { tpl: 'dragon', p: '#dcdde1', d: '#485460', a: '#00d2d3', e: '#00d2d3', boss: true },
    death_tyrant_beholder:   { tpl: 'beholder', p: '#dcdde1', d: '#2f3542', a: '#ff4757', e: '#ff4757', boss: true, crown: '#ff4757' },
    lord_soth_deathknight:   { tpl: 'knight', p: '#1e1e2c', d: '#0b0b12', a: '#ff6b81', e: '#ff4757', boss: true, crown: '#ff6b81' },

    // Act 5
    bearded_devil:           { tpl: 'demon', p: '#c0392b', d: '#641e16', a: '#ff9f43', e: '#ffdd59' },
    erinyes_valkyrie:        { tpl: 'angel', p: '#eb3b5a', d: '#2c1926', a: '#f6c967', e: '#ff4757' },
    red_abishai:             { tpl: 'dragon', p: '#e74c3c', d: '#78281f', a: '#f6c967', e: '#fff200' },
    hellfire_engine:         { tpl: 'golem', p: '#4a231c', d: '#1e0e0b', a: '#ff6b6b', e: '#ffdd59' },
    chain_devil_kyton:       { tpl: 'knight', p: '#7f8fa6', d: '#2f3640', a: '#ff6b6b', e: '#ff4757' },
    horned_devil_malebranche:{ tpl: 'demon', p: '#e67e22', d: '#6e2c00', a: '#f6c967', e: '#ff4757' },
    pit_fiend_overlord:      { tpl: 'demon', p: '#eb3b5a', d: '#4d0f18', a: '#ffdd59', e: '#ffffff', elite: true },
    ancient_red_dragon:      { tpl: 'dragon', p: '#ff4757', d: '#8b0000', a: '#ffd32a', e: '#ffffff', elite: true },
    balor_abyssal_lord:      { tpl: 'demon', p: '#ff3838', d: '#3d0814', a: '#ff9f1a', e: '#fff200', elite: true },
    zariel_archduke:         { tpl: 'angel', p: '#ff6b6b', d: '#3b151e', a: '#ffd32a', e: '#ffffff', boss: true, crown: '#ffd32a' },
    tiamat_dragon_queen:     { tpl: 'tiamat', p: '#ff4757', d: '#2d132c', a: '#f6c967', e: '#ffffff', boss: true, crown: '#f6c967' },
    asmodeus_lord_of_ninth:  { tpl: 'vampire', p: '#ff2e4c', d: '#240811', a: '#f6c967', e: '#ffdd59', boss: true, crown: '#f6c967' },
    demogorgon_prince:       { tpl: 'demogorgon', p: '#8e44ad', d: '#1c2833', a: '#2ed573', e: '#ff4757', boss: true, crown: '#2ed573' },
    halaster_mad_mage:       { tpl: 'mage', p: '#9b59b6', d: '#1b1464', a: '#00d2d3', e: '#f6c967', boss: true, crown: '#00d2d3' }
  };

  function generateMonsterSprite(id) {
    const spec = MONSTER_SPECS[id] || { tpl: 'brute', p: '#e74c3c', d: '#641e16', a: '#f6c967', e: '#ffffff' };
    const drawer = MONSTER_DRAWERS[spec.tpl] || MONSTER_DRAWERS.brute;
    const size = spec.boss ? 40 : 32;
    const h = hashStr(id);

    return renderAnimatedSprite(
      size,
      size,
      (c, f) => {
        drawer(c, f, spec);
        // Unique Boss Crown / Elite Floating Runes / Monster Sparkle Crest
        const cx = Math.floor(size / 2);
        if (spec.crown) {
          c.rect(cx - 5, 2 + f, 11, 2, spec.crown);
          c.rect(cx - 5, 1 + f, 2, 2, spec.crown);
          c.rect(cx - 1, 0 + f, 3, 3, f ? '#ffffff' : spec.crown);
          c.rect(cx + 4, 1 + f, 2, 2, spec.crown);
        } else if (spec.elite) {
          c.rect(2, 3 + f, 2, 2, spec.a);
          c.rect(size - 4, 3 - f, 2, 2, spec.e);
        } else {
          const sx = 2 + (h % 4);
          const sy = 2 + ((h >> 4) % 5);
          c.px(f ? size - 1 - sx : sx, sy + f, spec.a);
        }
      },
      {
        motion: MOTION_BY_TPL[spec.tpl] || 'px-motion-agile',
        isBoss: !!spec.boss,
        aura: spec.boss ? spec.a : spec.elite ? spec.p : ''
      }
    );
  }

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
