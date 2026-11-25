// ============================================================================
// D&D 5E SPIRE II v2.0 — HI-BIT NATURAL PIXEL-ART ENGINE (sprites.js)
// - 80x80 Hi-Bit Pixel Art (6,400 px = 6.25x finer than v1 32x32!) for 8 Heroes & 62 Monsters
// - 96x96 Ultra-Detail Hi-Bit Pixel Art (9,216 px = 5.76x finer than v1 40x40!) for 20 Bosses
// - 5-Tone Hue-Shifted Color Ramps + Ordered Bayer 4x4 Dithering + Rim Lighting
// - Selective Colored Outlines (Sel-Out) + Expressive 6x7 Hi-Bit Eyes + Organic Tapered Anatomy
// - Blazing-Fast Offscreen Canvas -> Crisp Pixelated PNG 2-Frame Sprites (90/90 100% Unique!)
// ============================================================================
(function () {
  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function clamp(v, lo = 0, hi = 255) {
    return v < lo ? lo : v > hi ? hi : Math.round(v);
  }

  function hexToRgb(hex) {
    const h = (hex || '#808080').replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16) || 0,
      parseInt(h.slice(2, 4), 16) || 0,
      parseInt(h.slice(4, 6), 16) || 0
    ];
  }

  function rgbToHex(r, g, b) {
    return '#' + [clamp(r), clamp(g), clamp(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // Painterly Hue-Shifted Shading (warm golden highlights, cool indigo/plum shadows!)
  function hueShade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    if (amt >= 0) {
      return rgbToHex(
        r + (255 - r) * amt * 1.05,
        g + (248 - g) * amt * 0.96,
        b + (222 - b) * amt * 0.78
      );
    }
    const f = 1 + amt; // 0..1
    const cool = -amt;
    return rgbToHex(
      r * f * (1 - cool * 0.14),
      g * f * (1 - cool * 0.16),
      b * f + 24 * cool * (1 - b / 340)
    );
  }

  function makeRamp(baseHex) {
    return {
      spec: hueShade(baseHex, 0.56),
      hi: hueShade(baseHex, 0.26),
      base: baseHex,
      lo: hueShade(baseHex, -0.28),
      deep: hueShade(baseHex, -0.54)
    };
  }

  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function hash2d(x, y, seed = 17) {
    let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  // Shared reusable offscreen canvas for fast PNG export in browser
  let _sharedCanvas = null;
  let _sharedCtx = null;
  function getExportCanvas(w, h) {
    if (typeof document === 'undefined' || typeof document.createElement !== 'function') return null;
    if (!_sharedCanvas) {
      _sharedCanvas = document.createElement('canvas');
      _sharedCtx = _sharedCanvas.getContext ? _sharedCanvas.getContext('2d') : null;
    }
    if (!_sharedCtx) return null;
    if (_sharedCanvas.width !== w || _sharedCanvas.height !== h) {
      _sharedCanvas.width = w;
      _sharedCanvas.height = h;
    }
    return { canvas: _sharedCanvas, ctx: _sharedCtx };
  }

  // ==========================================================================
  // HI-BIT NATURAL PIXEL CANVAS (80x80 / 96x96 RGBA Buffer + Hue-Shifted Primitives)
  // ==========================================================================
  class HiBitCanvas {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.data = new Uint8ClampedArray(w * h * 4);
      this._rgbCache = {};
    }

    _rgb(hex) {
      let c = this._rgbCache[hex];
      if (!c) {
        c = hexToRgb(hex);
        this._rgbCache[hex] = c;
      }
      return c;
    }

    px(x, y, hex, alpha = 255) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h || !hex) return;
      const [r, g, b] = this._rgb(hex);
      const off = (iy * this.w + ix) * 4;
      if (alpha >= 255 || this.data[off + 3] === 0) {
        this.data[off] = r;
        this.data[off + 1] = g;
        this.data[off + 2] = b;
        this.data[off + 3] = alpha;
      } else {
        const a = alpha / 255;
        const ia = 1 - a;
        this.data[off] = clamp(r * a + this.data[off] * ia);
        this.data[off + 1] = clamp(g * a + this.data[off + 1] * ia);
        this.data[off + 2] = clamp(b * a + this.data[off + 2] * ia);
        this.data[off + 3] = Math.min(255, Math.round(this.data[off + 3] + alpha * ia));
      }
    }

    hasPx(x, y) {
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) return false;
      return this.data[(y * this.w + x) * 4 + 3] > 20;
    }

    getRgb(x, y) {
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) return null;
      const off = (y * this.w + x) * 4;
      if (this.data[off + 3] <= 20) return null;
      return [this.data[off], this.data[off + 1], this.data[off + 2]];
    }

    rect(x, y, w, h, hex, alpha = 255) {
      const x0 = Math.round(x), y0 = Math.round(y);
      const rw = Math.round(w), rh = Math.round(h);
      for (let dy = 0; dy < rh; dy++) {
        for (let dx = 0; dx < rw; dx++) this.px(x0 + dx, y0 + dy, hex, alpha);
      }
    }

    // 3D-lit beveled armor plate / tunic / shield with subtle Bayer gradient & specular rim
    plate(x, y, w, h, baseHex, opts = {}) {
      const ramp = makeRamp(baseHex);
      const x0 = Math.round(x), y0 = Math.round(y);
      const rw = Math.max(1, Math.round(w)), rh = Math.max(1, Math.round(h));
      const round = opts.round || 0;
      const metallic = !!opts.metallic;
      for (let dy = 0; dy < rh; dy++) {
        for (let dx = 0; dx < rw; dx++) {
          if (round > 0) {
            const cx = dx < round ? round - dx : dx >= rw - round ? dx - (rw - round - 1) : 0;
            const cy = dy < round ? round - dy : dy >= rh - round ? dy - (rh - round - 1) : 0;
            if (cx * cx + cy * cy > round * round + 0.5) continue;
          }
          const nx = (dx / Math.max(1, rw - 1)) * 2 - 1;
          const ny = (dy / Math.max(1, rh - 1)) * 2 - 1;
          const light = -nx * 0.45 - ny * 0.55;
          const thr = (BAYER4[(y0 + dy) & 3][(x0 + dx) & 3] - 7.5) / 36;
          const val = light + thr;
          let col = ramp.base;
          if (dy === 0 || (dx === 0 && dy < rh - 1)) col = metallic ? ramp.spec : ramp.hi;
          else if (dy === rh - 1 || dx === rw - 1) col = ramp.deep;
          else if (metallic && Math.abs(nx + ny + 0.35) < 0.22) col = ramp.spec;
          else if (val > 0.34) col = ramp.hi;
          else if (val < -0.32) col = ramp.lo;
          if (opts.texture && hash2d(x0 + dx, y0 + dy, 31) > 0.86) {
            col = val > 0 ? ramp.hi : ramp.lo;
          }
          this.px(x0 + dx, y0 + dy, col);
        }
      }
      if (opts.trim) {
        this.rect(x0 + 1, y0 + rh - 2, rw - 2, 1, opts.trim);
      }
    }

    // Spherical 3D-lit natural oval with Bayer 4x4 dithering, specular highlight & rim bounce
    oval(cx, cy, rx, ry, baseHex, opts = {}) {
      const ramp = makeRamp(baseHex);
      const shaded = opts.shaded !== false;
      const metallic = !!opts.metallic;
      const dither = opts.dither !== false;
      const tex = opts.texture || null; // 'scale' | 'fur' | 'stone'
      const x0 = Math.floor(cx - rx - 1), x1 = Math.ceil(cx + rx + 1);
      const y0 = Math.floor(cy - ry - 1), y1 = Math.ceil(cy + ry + 1);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const nx = (x - cx) / rx;
          const ny = (y - cy) / ry;
          const r2 = nx * nx + ny * ny;
          if (r2 > 1.0) continue;
          if (!shaded) {
            this.px(x, y, baseHex, opts.alpha || 255);
            continue;
          }
          const nz = Math.sqrt(Math.max(0, 1 - r2));
          let light = -nx * 0.52 - ny * 0.62 + nz * 0.56;
          // Subtle rim bounce on bottom-right edge
          if (r2 > 0.72 && nx + ny > 0.45) light += 0.18;
          if (tex === 'scale') {
            const sc = ((x >> 1) + ((y >> 1) & 1)) & 1;
            if ((y % 3 === 0 && sc) || (x % 3 === 0 && !sc)) light -= 0.18;
          } else if (tex === 'fur') {
            light += (hash2d(x, y >> 1, 73) - 0.5) * 0.34;
          } else if (tex === 'stone') {
            light += (hash2d(x, y, 91) - 0.5) * 0.28;
          }
          const b = dither ? (BAYER4[y & 3][x & 3] - 7.5) / 28 : 0;
          const v = light + b;
          let col = ramp.base;
          if (v > (metallic ? 0.88 : 1.02)) col = ramp.spec;
          else if (v > 0.58) col = ramp.hi;
          else if (v < 0.02) col = ramp.deep;
          else if (v < 0.26) col = ramp.lo;
          this.px(x, y, col, opts.alpha || 255);
        }
      }
    }

    // Tapered organic limb / horn / tentacle / wing bone / dragon neck
    capsule(x0, y0, x1, y1, r0, r1, baseHex, opts = {}) {
      const ramp = makeRamp(baseHex);
      const steps = Math.max(6, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = x0 + (x1 - x0) * t;
        const cy = y0 + (y1 - y0) * t;
        const r = r0 + (r1 - r0) * t;
        if (r <= 0.75) {
          this.px(cx, cy, t < 0.5 ? ramp.hi : ramp.base);
        } else {
          this.oval(cx, cy, r, r, baseHex, { shaded: opts.shaded !== false, metallic: opts.metallic, texture: opts.texture });
        }
      }
    }

    // Curved quadratic bezier stroke with taper (great for capes, horns, tendrils, hair locks!)
    curve(x0, y0, cx, cy, x1, y1, r0, r1, baseHex, opts = {}) {
      const steps = Math.max(10, Math.ceil((Math.hypot(cx - x0, cy - y0) + Math.hypot(x1 - cx, y1 - cy)) * 1.4));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const it = 1 - t;
        const px = it * it * x0 + 2 * it * t * cx + t * t * x1;
        const py = it * it * y0 + 2 * it * t * cy + t * t * y1;
        const r = r0 + (r1 - r0) * t;
        if (r <= 0.8) this.px(px, py, baseHex);
        else this.oval(px, py, r, r, baseHex, { shaded: opts.shaded !== false, metallic: opts.metallic });
      }
    }

    // Flowing draped fantasy cape with vertical cloth folds & trim hem
    cape(cx, topY, botY, topW, botW, baseHex, sway = 0, trimHex = null) {
      const ramp = makeRamp(baseHex);
      const h = Math.max(4, Math.round(botY - topY));
      for (let dy = 0; dy <= h; dy++) {
        const t = dy / h;
        const y = Math.round(topY + dy);
        const halfW = (topW + (botW - topW) * Math.pow(t, 0.85)) * 0.5;
        const shift = sway * t * t;
        const xStart = Math.round(cx - halfW + shift);
        const xEnd = Math.round(cx + halfW + shift);
        for (let x = xStart; x <= xEnd; x++) {
          const u = (x - (cx + shift)) / Math.max(1, halfW); // -1..1
          const fold = Math.sin(u * 7.5 + t * 1.6);
          const thr = (BAYER4[y & 3][x & 3] - 7.5) / 28;
          const v = fold * 0.48 - t * 0.25 - u * 0.2 + thr;
          let col = ramp.base;
          if (v > 0.35) col = ramp.hi;
          else if (v < -0.35) col = ramp.deep;
          else if (v < -0.08) col = ramp.lo;
          if (trimHex && dy >= h - 2 && dy <= h - 1) col = trimHex;
          this.px(x, y, col);
        }
      }
    }

    // Detailed tapered fantasy blade / greatsword / runeblade with fuller & crossguard
    sword(cx, topY, botY, halfW, bladeHex, guardHex, gripHex, glowHex = null) {
      const ramp = makeRamp(bladeHex);
      const len = Math.max(8, Math.round(botY - topY));
      const tipLen = Math.max(4, Math.round(halfW * 2.4));
      for (let dy = 0; dy < len; dy++) {
        const y = Math.round(topY + dy);
        const wFactor = dy < tipLen ? Math.max(0.25, dy / tipLen) : 1.0;
        const hw = Math.max(1, Math.round(halfW * wFactor));
        for (let dx = -hw; dx <= hw; dx++) {
          let col = dx < 0 ? ramp.spec : dx === 0 ? ramp.base : ramp.lo;
          if (dx === -hw) col = '#ffffff';
          if (glowHex && dx === 0 && dy > tipLen && dy < len - 3 && (dy % 3 !== 0)) col = glowHex;
          this.px(cx + dx, y, col);
        }
      }
      // Crossguard + Pommel
      this.plate(cx - halfW * 2.8, botY, halfW * 5.6 + 1, 3, guardHex, { metallic: true, round: 1 });
      this.plate(cx - 1.5, botY + 3, 3, 7, gripHex, { round: 1 });
      this.oval(cx, botY + 11, 2.3, 2.1, guardHex, { metallic: true });
    }

    // Soft radial magical/fire glow with Bayer dithering
    glow(cx, cy, r, coreHex, midHex, outerHex = null) {
      const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(this.w - 1, Math.ceil(cx + r));
      const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(this.h - 1, Math.ceil(cy + r));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x - cx, y - cy) / r;
          if (d >= 1) continue;
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          if (d < 0.28) this.px(x, y, coreHex, 235);
          else if (d < 0.62 && (0.62 - d) / 0.34 > thr * 0.7) this.px(x, y, midHex, 170);
          else if (outerHex && (1 - d) / 0.38 > thr * 0.85) this.px(x, y, outerHex, 105);
        }
      }
    }

    // Expressive 6x7 Hi-Bit Anime/Fantasy Eye (supports ALL 6 emotions!)
    hiBitEye(x, y, irisHex, opts = {}) {
      const ix = Math.round(x), iy = Math.round(y);
      const emo = opts.emotion || 'neutral';
      const side = opts.side || 'left'; // 'left' | 'right'
      const lash = opts.lash || '#181425';
      const ramp = makeRamp(irisHex);

      if (emo === 'happy') {
        // Warm happy curved crescent eyes (^ ^) with golden lower gleam!
        this.rect(ix + 1, iy + 2, 3, 1, lash);
        this.px(ix, iy + 3, lash);
        this.px(ix + 4, iy + 3, lash);
        this.rect(ix + 1, iy + 3, 3, 1, ramp.hi);
        this.px(ix + 2, iy + 1, '#fff6cc', 180);
        return;
      }

      // Eyebrow ridge shaped by emotion
      if (emo === 'angry') {
        if (side === 'left') {
          this.rect(ix, iy - 2, 2, 1, lash);
          this.rect(ix + 2, iy - 1, 3, 1, lash);
        } else {
          this.rect(ix + 3, iy - 2, 2, 1, lash);
          this.rect(ix, iy - 1, 3, 1, lash);
        }
      } else if (emo === 'sad') {
        if (side === 'left') {
          this.rect(ix, iy - 1, 3, 1, lash);
          this.rect(ix + 3, iy - 2, 2, 1, lash);
        } else {
          this.rect(ix + 2, iy - 1, 3, 1, lash);
          this.rect(ix, iy - 2, 2, 1, lash);
        }
      } else if (emo === 'surprised') {
        this.rect(ix, iy - 3, 5, 1, lash);
      } else if (emo === 'smug') {
        this.rect(ix, iy - 1, 5, 1, lash);
      }

      const eyeH = emo === 'surprised' ? 6 : emo === 'smug' || emo === 'angry' ? 4 : 5;
      const topOff = emo === 'smug' || emo === 'angry' ? 1 : 0;

      // Curved upper lash
      this.rect(ix, iy + topOff, 5, 1, lash);
      this.px(ix - 1, iy + topOff + 1, lash);
      this.px(ix + 5, iy + topOff + 1, lash);
      // Sclera background
      this.rect(ix, iy + topOff + 1, 5, eyeH, '#f4f6fc');
      this.rect(ix, iy + topOff + 1, 5, 1, '#d3dae8');
      // 3-tone Iris
      const ox = ix + 1;
      const irisH = Math.max(3, eyeH - 1);
      this.rect(ox, iy + topOff + 1, 3, 1, emo === 'angry' ? '#ff4757' : ramp.deep);
      this.rect(ox, iy + topOff + 2, 3, Math.max(1, irisH - 2), ramp.base);
      this.rect(ox, iy + topOff + irisH, 3, 1, ramp.hi);
      // Pupil (smaller when surprised, sharper when angry/smug)
      this.rect(ox + 1, iy + topOff + 2, 1, emo === 'surprised' ? 1 : 2, '#11101b');
      // Dual specular catchlights
      this.px(ox, iy + topOff + 2, '#ffffff');
      this.px(ox + 2, iy + topOff + irisH, emo === 'surprised' ? '#ffffff' : ramp.spec);
      // Tear glint for sad emotion!
      if (emo === 'sad') {
        this.rect(ix, iy + eyeH, 2, 1, '#74b9ff');
        this.px(ix, iy + eyeH + 1, '#dff9fb');
      }
      // Subtle lower lash hint
      this.rect(ix + 1, iy + topOff + eyeH + 1, 3, 1, hueShade(lash, 0.22), 140);
    }

    // Emotion Pixel-Art Emblem & Aura Overlay (distinct per emotion, works even on hooded/skull faces!)
    emotionOverlay(cx, bob, f, emotion = 'neutral') {
      if (emotion === 'neutral') return;
      if (emotion === 'happy') {
        // Twin floating golden 4-point sparkles ✨
        const sy = 12 + bob - f * 2;
        this.glow(cx + 19, sy, 5.5, '#ffffff', '#ffd32a', '#ff9f43');
        this.rect(cx + 18, sy, 3, 1, '#ffffff');
        this.rect(cx + 19, sy - 1, 1, 3, '#ffffff');
        this.glow(cx - 19, sy + 5, 4.2, '#ffffff', '#ffeaa7');
        this.rect(cx - 20, sy + 5, 3, 1, '#fff6cc');
        this.rect(cx - 19, sy + 4, 1, 3, '#fff6cc');
      } else if (emotion === 'angry') {
        // Crimson anime anger vein mark 💢 + rising rage sparks!
        const ax = cx + 17, ay = 13 + bob - f;
        this.glow(ax, ay, 6.5, '#ffdd59', '#ff4757', '#b33939');
        this.rect(ax - 2, ay - 2, 2, 1, '#ff4757'); this.rect(ax - 1, ay - 3, 1, 2, '#ff4757');
        this.rect(ax + 1, ay - 2, 2, 1, '#ff4757'); this.rect(ax + 1, ay - 3, 1, 2, '#ff4757');
        this.rect(ax - 2, ay + 1, 2, 1, '#ff4757'); this.rect(ax - 1, ay + 1, 1, 2, '#ff4757');
        this.rect(ax + 1, ay + 1, 2, 1, '#ff4757'); this.rect(ax + 1, ay + 1, 1, 2, '#ff4757');
        this.px(cx - 18, 17 + bob - f * 2, '#ff6b6b');
        this.px(cx - 20, 13 + bob - f * 3, '#ffd32a');
      } else if (emotion === 'sad') {
        // Shimmering blue anime sweat/teardrop + cool blue melancholy mist 💧
        const tx = cx + 16, ty = 15 + bob + f * 2;
        this.glow(tx, ty + 2, 5.5, '#dff9fb', '#74b9ff', '#2e86de');
        this.oval(tx, ty + 3, 2.3, 2.8, '#74b9ff');
        this.px(tx, ty, '#74b9ff');
        this.px(tx - 1, ty + 2, '#ffffff');
        this.oval(cx - 17, 20 + bob + f * 2, 1.4, 2.2, '#74b9ff', { alpha: 180 });
      } else if (emotion === 'surprised') {
        // Bright golden-cyan shock exclamation & radial surprise bolts ❗⚡
        const sx = cx + 18, sy = 10 + bob - f * 2;
        this.glow(sx, sy + 3, 6.5, '#ffffff', '#ffd32a', '#00d2d3');
        this.rect(sx - 1, sy - 1, 3, 6, '#ffd32a');
        this.rect(sx, sy, 1, 4, '#ffffff');
        this.rect(sx - 1, sy + 7, 3, 2, '#ffd32a');
        this.capsule(cx - 17, 13 + bob, cx - 22, 9 + bob - f, 1.1, 0.5, '#00d2d3');
        this.capsule(cx - 18, 18 + bob, cx - 23, 17 + bob, 1.1, 0.5, '#ffd32a');
      } else if (emotion === 'smug') {
        // Confident diagonal heroic/devilish star gleam 😏✨
        const gx = cx - 18, gy = 13 + bob - f;
        this.glow(gx, gy, 6.5, '#ffffff', '#e056fd', '#f6c967');
        this.rect(gx - 3, gy, 7, 1, '#fff6cc');
        this.rect(gx, gy - 3, 1, 7, '#fff6cc');
        this.px(gx, gy, '#ffffff');
        this.px(cx + 18, 17 + bob + f, '#f6c967');
      }
    }

    // Fierce Glowing Monster Eye
    glowEye(x, y, colHex, r = 2.6) {
      this.glow(x, y, r * 1.9, '#ffffff', colHex, hueShade(colHex, -0.35));
      this.oval(x, y, r, r * 0.85, colHex, { shaded: false });
      this.px(x - 0.6, y - 0.5, '#ffffff');
      this.px(x + 0.4, y - 0.5, '#ffffff');
    }

    // Natural Layered Hair Cap with Specular Halo Band & Flowing Bangs
    hairCap(cx, cy, rx, ry, baseHex, opts = {}) {
      const ramp = makeRamp(baseHex);
      const x0 = Math.floor(cx - rx - 2), x1 = Math.ceil(cx + rx + 2);
      const y0 = Math.floor(cy - ry - 2), y1 = Math.ceil(cy + ry + 3);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const nx = (x - cx) / rx;
          const ny = (y - cy) / ry;
          const strand = Math.sin((x - cx) * 0.9) * 0.14;
          if (ny > 0.35 && Math.abs(nx) < 0.72) {
            // Parted anime bangs hanging down over forehead
            const bangEnd = 0.42 + Math.abs(Math.sin((x - cx) * 0.55)) * 0.55;
            if (ny > bangEnd) continue;
          }
          if (nx * nx + ny * ny > 1.0 + strand) continue;
          let col = ramp.base;
          // Bright curved anime specular hair sheen!
          if (ny > -0.58 && ny < -0.22 && Math.abs(nx) < 0.72 && ((x + y) & 1 || Math.abs(ny + 0.4) < 0.1)) {
            col = ramp.spec;
          } else if (ny < -0.15) {
            col = ramp.hi;
          } else if (ny > 0.35 || Math.abs(nx) > 0.75) {
            col = ramp.lo;
          }
          if ((x - cx) % 4 === 0 && ny > -0.1) col = ramp.deep;
          this.px(x, y, col);
        }
      }
      if (opts.sideLocks) {
        const len = opts.sideLocks;
        this.curve(cx - rx + 1, cy, cx - rx - 2, cy + len * 0.5, cx - rx + 1, cy + len, 2.8, 1.3, baseHex);
        this.curve(cx + rx - 1, cy, cx + rx + 2, cy + len * 0.5, cx + rx - 1, cy + len, 2.8, 1.3, baseHex);
      }
    }

    // Clean Cel-Shaded Polygon (triangles, armor plates, snouts, blades, capes, anime jaws!)
    poly(pts, baseHex, opts = {}) {
      if (!pts || pts.length < 3) return;
      const ramp = makeRamp(baseHex);
      const shaded = opts.shaded !== false;
      const metallic = !!opts.metallic;
      const alpha = opts.alpha || 255;
      let minX = this.w, minY = this.h, maxX = -1, maxY = -1;
      for (let i = 0; i < pts.length; i++) {
        if (pts[i][0] < minX) minX = pts[i][0];
        if (pts[i][0] > maxX) maxX = pts[i][0];
        if (pts[i][1] < minY) minY = pts[i][1];
        if (pts[i][1] > maxY) maxY = pts[i][1];
      }
      const x0 = Math.max(0, Math.floor(minX)), x1 = Math.min(this.w - 1, Math.ceil(maxX));
      const y0 = Math.max(0, Math.floor(minY)), y1 = Math.min(this.h - 1, Math.ceil(maxY));
      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const n = pts.length;
      for (let y = y0; y <= y1; y++) {
        const py = y + 0.5;
        const nodes = [];
        for (let i = 0, j = n - 1; i < n; j = i++) {
          const yi = pts[i][1], yj = pts[j][1];
          if ((yi < py && yj >= py) || (yj < py && yi >= py)) {
            nodes.push(pts[i][0] + ((py - yi) / (yj - yi)) * (pts[j][0] - pts[i][0]));
          }
        }
        if (nodes.length < 2) continue;
        nodes.sort((a, b) => a - b);
        for (let k = 0; k < nodes.length - 1; k += 2) {
          const sx = Math.max(x0, Math.ceil(nodes[k] - 0.5));
          const ex = Math.min(x1, Math.floor(nodes[k + 1] + 0.5));
          for (let x = sx; x <= ex; x++) {
            if (!shaded) {
              this.px(x, y, baseHex, alpha);
              continue;
            }
            const nx = ((x - minX) / spanX) * 2 - 1;
            const ny = ((y - minY) / spanY) * 2 - 1;
            let v = -nx * 0.42 - ny * 0.58;
            if (opts.texture === 'scale') {
              const sc = ((x >> 1) + ((y >> 1) & 1)) & 1;
              if (y % 4 === 0 && sc) v -= 0.28;
            }
            let col = ramp.base;
            if (metallic && Math.abs(nx + ny + 0.32) < 0.22) col = ramp.spec;
            else if (v > (metallic ? 0.52 : 0.62)) col = ramp.spec;
            else if (v > 0.22) col = ramp.hi;
            else if (v < -0.44) col = ramp.deep;
            else if (v < -0.14) col = ramp.lo;
            if (opts.rim && ny > 0.55 && nx > 0.15) col = opts.rim;
            this.px(x, y, col, alpha);
          }
        }
      }
      if (opts.outline) {
        for (let i = 0; i < n; i++) {
          const a = pts[i], b = pts[(i + 1) % n];
          this.line(a[0], a[1], b[0], b[1], opts.outline, 1);
        }
      }
    }

    // Crisp Pixel Line (for anime hair strands, armor seams, wing ribs, weapons!)
    line(x0, y0, x1, y1, hex, thick = 1, alpha = 255) {
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
      const r = thick <= 1 ? 0 : (thick - 1) * 0.5;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x0 + (x1 - x0) * t;
        const y = y0 + (y1 - y0) * t;
        if (r <= 0.1) {
          this.px(x, y, hex, alpha);
        } else {
          this.oval(x, y, r, r, hex, { shaded: false, alpha });
        }
      }
    }

    // Layer-by-Layer Crisp Anime Ink Contour + Blit (separates overlapping body parts cleanly!)
    ink(drawSubFn, inkHex = '#171124') {
      const sub = new HiBitCanvas(this.w, this.h);
      drawSubFn(sub);
      sub.inkOutline(inkHex);
      const sd = sub.data;
      const td = this.data;
      for (let i = 0; i < sd.length; i += 4) {
        const sa = sd[i + 3];
        if (sa === 0) continue;
        if (sa >= 250 || td[i + 3] === 0) {
          td[i] = sd[i];
          td[i + 1] = sd[i + 1];
          td[i + 2] = sd[i + 2];
          td[i + 3] = sa;
        } else {
          const a = sa / 255, ia = 1 - a;
          td[i] = clamp(sd[i] * a + td[i] * ia);
          td[i + 1] = clamp(sd[i + 1] * a + td[i + 1] * ia);
          td[i + 2] = clamp(sd[i + 2] * a + td[i + 2] * ia);
          td[i + 3] = Math.min(255, Math.round(td[i + 3] + sa * ia));
        }
      }
    }

    // Crisp 1px Dark Anime Ink Contour (tinted 25% toward adjacent interior pixel!)
    inkOutline(baseInkHex = '#171124') {
      const [ir, ig, ib] = this._rgb(baseInkHex);
      const w = this.w, h = this.h;
      const marks = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const off = (y * w + x) * 4;
          if (this.data[off + 3] > 28) continue;
          const n =
            this.getRgb(x, y - 1) ||
            this.getRgb(x - 1, y) ||
            this.getRgb(x + 1, y) ||
            this.getRgb(x, y + 1);
          if (!n) continue;
          marks.push(
            off,
            clamp(ir * 0.72 + n[0] * 0.22),
            clamp(ig * 0.72 + n[1] * 0.20),
            clamp(ib * 0.72 + n[2] * 0.25)
          );
        }
      }
      for (let i = 0; i < marks.length; i += 4) {
        const off = marks[i];
        this.data[off] = marks[i + 1];
        this.data[off + 1] = marks[i + 2];
        this.data[off + 2] = marks[i + 3];
        this.data[off + 3] = 255;
      }
    }

    // Jagged Scalloped JRPG Bat/Dragon Wing (replaces ugly oval wings!)
    batWing(ox, oy, dir, span, height, memHex, boneHex, flap = 0) {
      const s = dir >= 0 ? 1 : -1;
      const elbowX = ox + s * span * 0.44;
      const elbowY = oy - height * 0.72 + flap * 0.45;
      const tipX = ox + s * span;
      const tipY = oy - height * 0.38 + flap;
      const f2X = ox + s * span * 0.78;
      const f2Y = oy + height * 0.22 + flap * 0.7;
      const f3X = ox + s * span * 0.48;
      const f3Y = oy + height * 0.34 + flap * 0.35;
      const rootX = ox + s * span * 0.14;
      const rootY = oy + height * 0.24;

      // Concave scalloped membrane arches between finger tips
      const sc1X = (tipX + f2X) * 0.5 - s * span * 0.08;
      const sc1Y = (tipY + f2Y) * 0.5 - height * 0.16;
      const sc2X = (f2X + f3X) * 0.5 - s * span * 0.05;
      const sc2Y = (f2Y + f3Y) * 0.5 - height * 0.18;
      const sc3X = (f3X + rootX) * 0.5;
      const sc3Y = (f3Y + rootY) * 0.5 - height * 0.14;

      this.ink(sub => {
        sub.poly([
          [ox, oy],
          [elbowX, elbowY],
          [tipX, tipY],
          [sc1X, sc1Y],
          [f2X, f2Y],
          [sc2X, sc2Y],
          [f3X, f3Y],
          [sc3X, sc3Y],
          [rootX, rootY]
        ], memHex);
        // Inner translucent warm membrane gleam
        const memHi = hueShade(memHex, 0.26);
        sub.poly([
          [ox + s * span * 0.16, oy + height * 0.02],
          [elbowX, elbowY + height * 0.16],
          [f2X - s * span * 0.14, f2Y - height * 0.18],
          [f3X - s * span * 0.06, f3Y - height * 0.22]
        ], memHi, { shaded: false, alpha: 145 });
        // Crisp wing arm & finger ribs
        sub.capsule(ox, oy, elbowX, elbowY, 2.0, 1.8, boneHex);
        sub.capsule(elbowX, elbowY, tipX, tipY, 1.8, 0.8, boneHex);
        sub.line(elbowX, elbowY, f2X, f2Y, hueShade(boneHex, -0.22), 1.4);
        sub.line(elbowX, elbowY, f3X, f3Y, hueShade(boneHex, -0.22), 1.3);
        // Wing thumb claw at elbow apex
        sub.line(elbowX, elbowY, elbowX + s * 2.5, elbowY - 3.5, '#f5f6fa', 1.2);
      });
    }

    // Layered Feathered Subculture Anime Angel Wing (replaces oval angel wings!)
    featherWing(ox, oy, dir, span, height, featherHex, tipHex, flap = 0) {
      const s = dir >= 0 ? 1 : -1;
      this.ink(sub => {
        // 5 long graceful primary feathers fanning down-outward
        for (let i = 0; i < 5; i++) {
          const t = i / 4;
          const fx = ox + s * span * (1.0 - t * 0.34);
          const fy = oy - height * (0.48 - t * 0.72) + flap * (1.0 - t * 0.4);
          const bx = ox + s * span * (0.25 + t * 0.12);
          const by = oy - height * (0.36 - t * 0.36) + flap * 0.35;
          sub.poly([
            [bx, by - 2.2],
            [fx, fy],
            [fx - s * 3.2, fy + 3.4],
            [bx - s * 1.2, by + 2.8]
          ], i === 0 ? tipHex : featherHex);
        }
        // Upper shoulder wing coverts (plump layered plume crest)
        sub.poly([
          [ox, oy + 2],
          [ox + s * span * 0.34, oy - height * 0.56 + flap * 0.45],
          [ox + s * span * 0.72, oy - height * 0.46 + flap * 0.75],
          [ox + s * span * 0.46, oy - height * 0.08 + flap * 0.35],
          [ox + s * span * 0.14, oy + height * 0.16]
        ], hueShade(featherHex, 0.24));
      });
    }

    // Sleek Pointed-Chin Subculture Anime Head (V-jawline, luminous eyes, rosy cheeks!)
    animeHead(cx, cy, sc, skinHex, opts = {}) {
      const emo = opts.emotion || 'neutral';
      const facing = opts.facing || 0; // -1 left 3/4, 0 front, +1 right 3/4
      const fx = facing * 1.8 * sc;
      const rw = 10.6 * sc;
      const rh = 10.4 * sc;

      // Sculpted anime face contour (rounded crown -> soft cheeks -> tapered chin!)
      this.ink(sub => {
        sub.poly([
          [cx - rw * 0.86, cy - rh * 0.52],
          [cx - rw * 0.48, cy - rh * 0.94],
          [cx + rw * 0.48, cy - rh * 0.94],
          [cx + rw * 0.86, cy - rh * 0.52],
          [cx + rw * 0.94, cy + rh * 0.12],
          [cx + rw * 0.68, cy + rh * 0.62],
          [cx + fx * 0.4, cy + rh * 0.96],
          [cx - rw * 0.68, cy + rh * 0.62],
          [cx - rw * 0.94, cy + rh * 0.12]
        ], skinHex);
        // Soft forehead shadow under bangs
        sub.rect(cx - rw * 0.75, cy - rh * 0.45, rw * 1.5, 2.2 * sc, hueShade(skinHex, -0.14), 120);
        // Rosy subculture anime blush!
        const blushCol = emo === 'angry' ? '#ff6b6b' : emo === 'sad' ? '#a29bfe' : '#f48fa0';
        const blushAlpha = emo === 'happy' ? 210 : emo === 'sad' ? 95 : 150;
        sub.oval(cx - 5.8 * sc + fx, cy + 3.2 * sc, 2.2 * sc, 1.1 * sc, blushCol, { shaded: false, alpha: blushAlpha });
        sub.oval(cx + 5.8 * sc + fx, cy + 3.2 * sc, 2.2 * sc, 1.1 * sc, blushCol, { shaded: false, alpha: blushAlpha });
        // Delicate anime nose dot
        sub.px(cx + fx * 1.1, cy + 2.4 * sc, hueShade(skinHex, -0.26));
        // Expressive mouth
        const mCol = hueShade(skinHex, -0.48);
        const mx = cx + fx * 0.9, my = cy + 5.6 * sc;
        if (emo === 'happy') {
          sub.rect(mx - 2.4 * sc, my, 5 * sc, 1, mCol);
          sub.rect(mx - 1.6 * sc, my + 1, 3.4 * sc, 1.6 * sc, '#e66767');
          sub.rect(mx - 1.6 * sc, my + 1, 3.4 * sc, 1, '#ffffff');
        } else if (emo === 'angry') {
          sub.rect(mx - 2.4 * sc, my, 5 * sc, 1.8 * sc, '#2d0b14');
          sub.rect(mx - 1.6 * sc, my, 3.4 * sc, 1, '#ffffff');
        } else if (emo === 'sad') {
          sub.rect(mx - 1.8 * sc, my + 0.5, 3.8 * sc, 1, mCol);
          sub.px(mx - 2.4 * sc, my + 1.5, mCol);
          sub.px(mx + 2.4 * sc, my + 1.5, mCol);
        } else if (emo === 'surprised') {
          sub.oval(mx, my + 0.8 * sc, 1.8 * sc, 1.8 * sc, '#3c1020', { shaded: false });
          sub.oval(mx, my + 1.2 * sc, 1.1 * sc, 0.9 * sc, '#e66767', { shaded: false });
        } else if (emo === 'smug') {
          sub.rect(mx - 2 * sc, my + 0.8, 3 * sc, 1, mCol);
          sub.rect(mx + 1 * sc, my, 2.2 * sc, 1, mCol);
        } else if (opts.fangs) {
          sub.rect(mx - 2.2 * sc, my, 4.6 * sc, 1, mCol);
          sub.px(mx - 1.8 * sc, my + 1, '#ffffff');
          sub.px(mx + 1.8 * sc, my + 1, '#ffffff');
        } else {
          sub.rect(mx - 1.8 * sc, my, 3.8 * sc, 1, mCol);
        }
        // Expressive Luminous Anime Eyes
        if (!opts.noEyes) {
          sub.hiBitEye(cx - 7.4 * sc + fx, cy - 2.4 * sc, opts.eye || '#2e86de', { emotion: emo, side: 'left' });
          sub.hiBitEye(cx + 2.4 * sc + fx, cy - 2.4 * sc, opts.eye || '#2e86de', { emotion: emo, side: 'right' });
        }
      });
    }

    // Layered Pointed Anime Hair (pass layer:'back' BEFORE animeHead, layer:'front' AFTER animeHead!)
    animeHair(cx, cy, sc, hairHex, opts = {}) {
      const ramp = makeRamp(hairHex);
      const backLen = opts.backLen || 0;
      const sideLen = opts.sideLen || 11;
      const spiky = !!opts.spiky;
      const layer = opts.layer || 'both';

      if ((layer === 'back' || layer === 'both') && backLen > 0) {
        this.ink(sub => {
          sub.poly([
            [cx - 11.5 * sc, cy - 5 * sc],
            [cx + 11.5 * sc, cy - 5 * sc],
            [cx + 16 * sc, cy + backLen * sc],
            [cx + 9 * sc, cy + (backLen - 2) * sc],
            [cx + 4 * sc, cy + (backLen + 3.5) * sc],
            [cx - 3 * sc, cy + (backLen + 3.5) * sc],
            [cx - 9 * sc, cy + (backLen - 2) * sc],
            [cx - 15 * sc, cy + backLen * sc]
          ], ramp.lo);
          // Flowing hair strand shadow lines
          sub.line(cx - 7 * sc, cy + 4 * sc, cx - 9 * sc, cy + (backLen - 1) * sc, ramp.deep, 1);
          sub.line(cx + 6 * sc, cy + 4 * sc, cx + 8 * sc, cy + (backLen - 1) * sc, ramp.deep, 1);
        });
      }

      if (layer === 'front' || layer === 'both') {
        this.ink(sub => {
          // Crown hair volume + delicate parted anime bangs falling cleanly OVER forehead!
          sub.poly([
            [cx - 11.8 * sc, cy - 1 * sc],
            [cx - 11.0 * sc, cy - 8.0 * sc],
            [cx - 4.8 * sc, cy - 12.2 * sc],
            [cx + 4.8 * sc, cy - 12.2 * sc],
            [cx + 11.0 * sc, cy - 8.0 * sc],
            [cx + 11.8 * sc, cy - 1 * sc],
            [cx + 8.6 * sc, cy - 5.2 * sc],
            [cx + 5.2 * sc, cy - 1.4 * sc],
            [cx + 2.8 * sc, cy - 5.8 * sc],
            [cx - 0.6 * sc, cy - 0.8 * sc],
            [cx - 3.6 * sc, cy - 5.8 * sc],
            [cx - 6.8 * sc, cy - 1.6 * sc],
            [cx - 9.0 * sc, cy - 5.0 * sc]
          ], hairHex);
          if (spiky) {
            sub.poly([[cx - 9 * sc, cy - 8 * sc], [cx - 15 * sc, cy - 13 * sc], [cx - 4 * sc, cy - 11 * sc]], ramp.hi);
            sub.poly([[cx - 2 * sc, cy - 11 * sc], [cx + 2 * sc, cy - 16 * sc], [cx + 5 * sc, cy - 11 * sc]], ramp.hi);
            sub.poly([[cx + 6 * sc, cy - 9 * sc], [cx + 15 * sc, cy - 12 * sc], [cx + 11 * sc, cy - 5 * sc]], hairHex);
          }
          // Tapered cheek-framing anime side locks
          sub.poly([
            [cx - 11.8 * sc, cy - 5 * sc],
            [cx - 8.6 * sc, cy - 3 * sc],
            [cx - 9.2 * sc, cy + sideLen * sc],
            [cx - 12.2 * sc, cy + (sideLen - 3) * sc]
          ], ramp.lo);
          sub.poly([
            [cx + 8.6 * sc, cy - 3 * sc],
            [cx + 11.8 * sc, cy - 5 * sc],
            [cx + 12.2 * sc, cy + (sideLen - 3) * sc],
            [cx + 9.2 * sc, cy + sideLen * sc]
          ], ramp.lo);
          // Iconic bright curved anime hair highlight
          sub.line(cx - 7.4 * sc, cy - 7.6 * sc, cx - 2.4 * sc, cy - 9.0 * sc, ramp.spec, 1.5);
          sub.line(cx + 1.6 * sc, cy - 9.0 * sc, cx + 6.6 * sc, cy - 7.6 * sc, ramp.spec, 1.4);
        });
      }
    }

    // Sculpted Gothic Anime Skull (rounded cranium, hollow cheeks, dark sockets, nasal cavity & jaw!)
    animeSkull(cx, cy, sc, boneHex, eyeHex) {
      this.ink(sub => {
        // Cranium dome + sculpted cheekbones + jaw
        sub.oval(cx, cy - 2.2 * sc, 10.6 * sc, 9.2 * sc, boneHex, { dither: false });
        sub.poly([
          [cx - 10.2 * sc, cy - 1 * sc], [cx + 10.2 * sc, cy - 1 * sc],
          [cx + 8.5 * sc, cy + 5.2 * sc], [cx + 5.6 * sc, cy + 9.6 * sc],
          [cx - 5.6 * sc, cy + 9.6 * sc], [cx - 8.5 * sc, cy + 5.2 * sc]
        ], boneHex);
        // Hollowed cheekbone shadows
        sub.poly([[cx - 9.4 * sc, cy + 3.2 * sc], [cx - 6.2 * sc, cy + 4.4 * sc], [cx - 6.8 * sc, cy + 7.2 * sc]], hueShade(boneHex, -0.35), { shaded: false });
        sub.poly([[cx + 9.4 * sc, cy + 3.2 * sc], [cx + 6.2 * sc, cy + 4.4 * sc], [cx + 6.8 * sc, cy + 7.2 * sc]], hueShade(boneHex, -0.35), { shaded: false });
        // Deep dark eye sockets + fierce glowing soul fires
        sub.oval(cx - 4.8 * sc, cy + 0.2 * sc, 3.4 * sc, 3.3 * sc, '#0d0b18', { shaded: false });
        sub.oval(cx + 3.8 * sc, cy + 0.2 * sc, 3.4 * sc, 3.3 * sc, '#0d0b18', { shaded: false });
        sub.glowEye(cx - 4.8 * sc, cy + 0.2 * sc, eyeHex, 1.8 * sc);
        sub.glowEye(cx + 3.8 * sc, cy + 0.2 * sc, eyeHex, 1.8 * sc);
        // Dark inverted-V nasal cavity
        sub.poly([[cx - 0.5 * sc, cy + 2.6 * sc], [cx + 1.0 * sc, cy + 5.4 * sc], [cx - 2.0 * sc, cy + 5.4 * sc]], '#12101e', { shaded: false });
        // Crisp skull teeth line
        sub.rect(cx - 4.6 * sc, cy + 6.8 * sc, 8.6 * sc, 1.2 * sc, '#12101e');
        for (let tx = -3; tx <= 3; tx += 2.2) {
          sub.line(cx + tx * sc, cy + 6.4 * sc, cx + tx * sc, cy + 9.2 * sc, '#12101e', 1);
        }
      });
    }

    // Fierce 3/4 Anime JRPG Dragon Head (sleek curved horns, tapered snout, glowing eye, sharp fangs!)
    dragonHead(cx, cy, sc, dir, pHex, dHex, aHex, eHex, f = 0) {
      const s = dir >= 0 ? 1 : -1;
      const jawOpen = (f ? 2.4 : 1.0) * sc;
      // Sleek curved swept-back horns (NO blocky bars!)
      this.ink(sub => {
        sub.curve(cx - s * 2 * sc, cy - 5 * sc, cx - s * 10 * sc, cy - 11 * sc, cx - s * 16 * sc, cy - 17 * sc, 2.8 * sc, 0.7 * sc, aHex);
        sub.curve(cx + s * 1 * sc, cy - 6 * sc, cx - s * 5 * sc, cy - 13 * sc, cx - s * 10 * sc, cy - 19 * sc, 2.6 * sc, 0.7 * sc, hueShade(aHex, 0.16));
      });
      // Sculpted angular dragon head + jaw + fangs
      this.ink(sub => {
        // Lower jaw
        sub.poly([
          [cx - s * 4 * sc, cy + 2.5 * sc],
          [cx + s * 10 * sc, cy + 2.5 * sc + jawOpen],
          [cx + s * 12 * sc, cy + 5.5 * sc + jawOpen],
          [cx - s * 3 * sc, cy + 6.8 * sc]
        ], dHex);
        // Dark crimson mouth interior
        sub.poly([
          [cx + s * 1 * sc, cy + 1 * sc],
          [cx + s * 12.5 * sc, cy + 1 * sc],
          [cx + s * 10.5 * sc, cy + 4.2 * sc + jawOpen],
          [cx + s * 1 * sc, cy + 3.8 * sc]
        ], '#340919', { shaded: false });
        // Tapered upper snout + angular brow ridge
        sub.poly([
          [cx - s * 7 * sc, cy - 3.5 * sc],
          [cx - s * 2 * sc, cy - 8.0 * sc],
          [cx + s * 6 * sc, cy - 6.2 * sc],
          [cx + s * 15.5 * sc, cy - 1.4 * sc],
          [cx + s * 14.5 * sc, cy + 2.2 * sc],
          [cx + s * 2 * sc, cy + 2.6 * sc],
          [cx - s * 6 * sc, cy + 3.8 * sc]
        ], pHex, { texture: 'scale' });
        // Cheek frill spikes
        sub.poly([[cx - s * 5 * sc, cy - 0.5 * sc], [cx - s * 12 * sc, cy + 2.2 * sc], [cx - s * 5 * sc, cy + 4.6 * sc]], aHex);
        // Crisp white fangs
        sub.line(cx + s * 11.5 * sc, cy + 2.0 * sc, cx + s * 11.0 * sc, cy + 4.6 * sc, '#ffffff', 1.3);
        sub.line(cx + s * 7.8 * sc, cy + 2.0 * sc, cx + s * 7.5 * sc, cy + 4.0 * sc, '#ffffff', 1.2);
        sub.line(cx + s * 9.5 * sc, cy + 4.6 * sc + jawOpen, cx + s * 9.8 * sc, cy + 2.6 * sc + jawOpen, '#ffffff', 1.1);
        // Fierce angular slit glowing eye
        sub.line(cx + s * 1 * sc, cy - 4.4 * sc, cx + s * 7.2 * sc, cy - 2.2 * sc, '#140f20', 1.5);
        sub.glowEye(cx + s * 4.2 * sc, cy - 2.0 * sc, eHex, 2.0 * sc);
        sub.px(cx + s * 13 * sc, cy - 1.0 * sc, '#140f20');
      });
    }

    // Ornate 5-Spire Anime Dark-Fantasy Boss Crown (replaces flat blocky rectangle!)
    bossCrown(cx, y, sc, crownHex, gemHex, f = 0) {
      this.ink(sub => {
        sub.poly([
          [cx - 11 * sc, y + 6 * sc],
          [cx - 13 * sc, y - 1 * sc],
          [cx - 7 * sc, y + 2.5 * sc],
          [cx - 5 * sc, y - 3.5 * sc],
          [cx - 2 * sc, y + 2 * sc],
          [cx, y - 5.5 * sc],
          [cx + 2 * sc, y + 2 * sc],
          [cx + 5 * sc, y - 3.5 * sc],
          [cx + 7 * sc, y + 2.5 * sc],
          [cx + 13 * sc, y - 1 * sc],
          [cx + 11 * sc, y + 6 * sc]
        ], crownHex, { metallic: true });
        sub.oval(cx, y + 3.2 * sc, 2.2 * sc, 2.2 * sc, f ? '#ffffff' : gemHex, { shaded: false });
        sub.px(cx - 6 * sc, y + 3.4 * sc, gemHex);
        sub.px(cx + 6 * sc, y + 3.4 * sc, gemHex);
      });
    }

    // Selective Colored Outline (Sel-Out): crisp dark anime ink outer silhouette!
    selOut(fallbackHex = '#151022') {
      this.inkOutline(fallbackHex);
    }

    // Ground contact shadow painted cleanly underneath feet
    groundShadow(cx, cy, rx, ry) {
      const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(this.w - 1, Math.ceil(cx + rx));
      const y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(this.h - 1, Math.ceil(cy + ry));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const off = (y * this.w + x) * 4;
          if (this.data[off + 3] > 20) continue;
          const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
          if (d <= 1) {
            this.data[off] = 8;
            this.data[off + 1] = 7;
            this.data[off + 2] = 18;
            this.data[off + 3] = d < 0.62 ? 135 : 70;
          }
        }
      }
    }

    // Fast RGBA buffer fingerprint (used for Node.js tests & uniqueness checks)
    checksum() {
      let h = 2166136261;
      for (let i = 0; i < this.data.length; i += 4) {
        if (this.data[i + 3] === 0) continue;
        h ^= (this.data[i] << 16) | (this.data[i + 1] << 8) | this.data[i + 2] ^ i;
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(36);
    }

    toDataUrl() {
      const exp = getExportCanvas(this.w, this.h);
      if (exp) {
        const img = exp.ctx.createImageData(this.w, this.h);
        img.data.set(this.data);
        exp.ctx.putImageData(img, 0, 0);
        return exp.canvas.toDataURL('image/png');
      }
      // Deterministic lightweight fallback for headless Node.js audits
      return `data:image/png;base64,HIBIT_${this.w}x${this.h}_${this.checksum()}`;
    }
  }

  function renderAnimatedSprite(w, h, drawFn, opts = {}) {
    const c1 = new HiBitCanvas(w, h);
    const c2 = new HiBitCanvas(w, h);
    drawFn(c1, 0);
    drawFn(c2, 1);
    c1.selOut();
    c2.selOut();
    c1.groundShadow(w / 2, h - 4, w * 0.28, 3.2);
    c2.groundShadow(w / 2, h - 4, w * 0.26, 3.0);

    const url1 = c1.toDataUrl();
    const url2 = c2.toDataUrl();
    const motion = opts.motion || 'px-motion-agile';
    const isBoss = !!opts.isBoss;
    const aura = opts.aura || '';
    const auraHtml = aura
      ? `<span class="px-aura-glow" style="background:radial-gradient(circle, ${aura}55 0%, ${aura}00 72%);"></span>`
      : '';
    return (
      `<div class="pixel-sprite px-hibit ${motion}${isBoss ? ' px-boss' : ''}" data-res="${w}x${h}" aria-hidden="true">` +
      auraHtml +
      `<img class="px-frame px-f1" src="${url1}" alt="" decoding="async">` +
      `<img class="px-frame px-f2" src="${url2}" alt="" decoding="async">` +
      `</div>`
    );
  }

  // ==========================================================================
  // 1. SLEEK 4-HEAD ANIME PIXEL BASE (for fallback NPCs: Withers, Raphael, Volo)
  // ==========================================================================
  function drawHiBitHeroBase(c, f, cfg) {
    const cx = 40;
    const bob = f ? 1.5 : 0;
    const skin = cfg.skin || '#f6d2b6';
    const emo = cfg.emotion || 'neutral';

    // Flowing Back Cape (ink-outlined silhouette!)
    if (cfg.cape) {
      c.ink(sub => {
        sub.cape(cx + 1, 38 + bob, 73, 22, 36, cfg.cape, f ? 3.5 : 1.5, cfg.capeTrim || cfg.trim);
      });
    }

    // Sleek 4-Head Anime Boots & Tapered Legs
    c.ink(sub => {
      sub.poly([[cx - 9, 53], [cx - 3, 53], [cx - 4, 65], [cx - 10, 65]], cfg.pants || '#25293a');
      sub.poly([[cx + 3, 53], [cx + 9, 53], [cx + 10, 65], [cx + 4, 65]], cfg.pants || '#25293a');
      sub.poly([[cx - 11, 63], [cx - 3, 63], [cx - 3, 73], [cx - 13, 73], [cx - 12, 68]], cfg.boots || '#3c2a1e', { metallic: !!cfg.metalBoots });
      sub.poly([[cx + 3, 63], [cx + 11, 63], [cx + 12, 73], [cx + 2, 73], [cx + 3, 68]], cfg.boots || '#3c2a1e', { metallic: !!cfg.metalBoots });
    });

    // Tapered Anime Coat / Tunic / Armored Torso
    c.ink(sub => {
      if (cfg.tunicSkirt) {
        sub.poly([
          [cx - 9, 50 + bob], [cx + 9, 50 + bob],
          [cx + 14, 68 + bob], [cx - 14, 68 + bob]
        ], cfg.tunicSkirt);
        if (cfg.trim) sub.line(cx - 13, 66 + bob, cx + 13, 66 + bob, cfg.trim, 1.5);
      }
      sub.poly([
        [cx - 10, 38 + bob], [cx + 10, 38 + bob],
        [cx + 8, 53 + bob], [cx - 8, 53 + bob]
      ], cfg.armor, { metallic: !!cfg.metalArmor });
      // Crisp Belt & Buckle
      sub.plate(cx - 9, 49 + bob, 19, 4, cfg.belt || '#362318', { round: 1 });
      sub.plate(cx - 3, 48 + bob, 6, 5, cfg.trim || '#f6c967', { metallic: true, round: 1 });
      if (cfg.chestAccent) {
        sub.poly([[cx, 40 + bob], [cx + 4, 44 + bob], [cx, 48 + bob], [cx - 4, 44 + bob]], cfg.chestAccent, { metallic: true });
      }
    });

    // Layered Shoulders & Tapered Arms
    c.ink(sub => {
      sub.poly([[cx - 16, 40 + bob], [cx - 9, 37 + bob], [cx - 9, 45 + bob], [cx - 15, 45 + bob]], cfg.pauldron || cfg.armor, { metallic: !!cfg.metalArmor });
      sub.poly([[cx + 9, 37 + bob], [cx + 16, 40 + bob], [cx + 15, 45 + bob], [cx + 9, 45 + bob]], cfg.pauldron || cfg.armor, { metallic: !!cfg.metalArmor });
      sub.capsule(cx - 13, 45 + bob, cx - 16, 54 + bob, 2.6, 2.2, cfg.sleeve || cfg.armor);
      sub.capsule(cx + 13, 45 + bob, cx + 16, 53 + bob - f, 2.6, 2.2, cfg.sleeve || cfg.armor);
      sub.oval(cx - 16, 55 + bob, 2.5, 2.3, cfg.glove || skin, { metallic: !!cfg.metalArmor });
      sub.oval(cx + 16, 54 + bob - f, 2.5, 2.3, cfg.glove || skin, { metallic: !!cfg.metalArmor });
    });

    // Slender Neck + Pointed-Chin Anime Head (matches our 160x160 hero proportions!)
    c.plate(cx - 3, 34 + bob, 7, 5, hueShade(skin, -0.22));
    c.animeHead(cx, 25 + bob, 1.0, skin, {
      emotion: emo,
      facing: -1,
      eye: cfg.eye || '#2e86de',
      noEyes: !!cfg.noEyes
    });

    if (cfg.drawHeadgear) {
      c.ink(sub => cfg.drawHeadgear(sub, cx, bob, f, emo));
    }
    if (cfg.drawGear) {
      c.ink(sub => cfg.drawGear(sub, cx, bob, f, emo));
    }
    c.emotionOverlay(cx, bob, f, emo);
  }

  const EMOTIONS = ['neutral', 'happy', 'angry', 'sad', 'surprised', 'smug'];
  const EMOTION_META = {
    neutral:   { id: 'neutral',   label: '평온',   icon: '🙂', color: '#dfe6e9' },
    happy:     { id: 'happy',     label: '기쁨',   icon: '😊', color: '#ffd32a' },
    angry:     { id: 'angry',     label: '분노',   icon: '😤', color: '#ff4757' },
    sad:       { id: 'sad',       label: '슬픔',   icon: '😢', color: '#74b9ff' },
    surprised: { id: 'surprised', label: '놀람',   icon: '😲', color: '#00d2d3' },
    smug:      { id: 'smug',      label: '자신감', icon: '😏', color: '#e056fd' }
  };

  // Motion Pools: EVERY situation has >= 2 distinct animated motions (30 total across 14 situations!)
  const MOTION_POOLS = {
    // 6 Emotion Dialogue / Reaction Motions (2 distinct per emotion = 12)
    emo_neutral:   ['mot-neutral-breathe', 'mot-neutral-nod'],
    emo_happy:     ['mot-happy-hop',       'mot-happy-sway'],
    emo_angry:     ['mot-angry-stomp',     'mot-angry-tremble'],
    emo_sad:       ['mot-sad-droop',       'mot-sad-sigh'],
    emo_surprised: ['mot-surprised-jump',  'mot-surprised-recoil'],
    emo_smug:      ['mot-smug-tilt',       'mot-smug-flourish'],
    // 8 Combat & Gameplay Situation Motions (2~3 distinct per situation = 18)
    player_attack: ['mot-atk-slash',       'mot-atk-leap',        'mot-atk-thrust'],
    player_skill:  ['mot-skill-guard',     'mot-skill-chant'],
    player_power:  ['mot-power-ascend',    'mot-power-burst'],
    player_hit:    ['mot-hit-knockback',   'mot-hit-stagger'],
    enemy_attack:  ['mot-enemy-lunge',     'mot-enemy-slam',      'mot-enemy-pounce'],
    enemy_hit:     ['mot-ehit-shake',      'mot-ehit-recoil'],
    enemy_buff:    ['mot-ebuff-roar',      'mot-ebuff-levitate'],
    victory:       ['mot-win-cheer',       'mot-win-salute'],
    // 6 Card-Specific & Rarity-Scaled Skill Motion Pools (Common = simple -> Legendary = spectacular!)
    card_common_atk:   ['mot-common-jab',    'mot-common-tap'],
    card_common_skill: ['mot-common-guard',  'mot-common-focus'],
    card_uncommon_atk: ['mot-atk-flurry',    'mot-atk-bow',        'mot-atk-cast'],
    card_rare_atk:     ['mot-rare-cleave',   'mot-rare-barrage',   'mot-rare-meteor'],
    card_rare_skill:   ['mot-rare-aegis',    'mot-rare-awakening'],
    card_legendary:    ['mot-leg-omnislash', 'mot-leg-cataclysm',  'mot-leg-eclipse', 'mot-leg-divine']
  };

  const ALL_MOTION_CLASSES = Object.values(MOTION_POOLS).flat();
  const _motionCycle = {};

  function pickMotion(situation, forceIdx = -1) {
    const pool = MOTION_POOLS[situation] || MOTION_POOLS.emo_neutral;
    if (forceIdx >= 0) return pool[forceIdx % pool.length];
    const next = (_motionCycle[situation] || 0) % pool.length;
    _motionCycle[situation] = next + 1;
    return pool[next];
  }

  const HERO_SPRITES = {
    fighter: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#aeb9c4', pauldron: '#95a5b5', cape: '#c0392b', trim: '#f6c967',
          chestAccent: '#e74c3c', boots: '#576574', eye: '#3498db', metalArmor: true, metalBoots: true,
          drawHeadgear: (c, cx, b, f) => {
            c.curve(cx, 12 + b, cx - 8 - f * 2, 4 + b, cx - 16 - f * 2, 10 + b, 5.2, 2.0, '#e74c3c');
            c.curve(cx + 2, 11 + b, cx - 4 - f, 6 + b, cx - 10 - f, 9 + b, 3.2, 1.2, '#ff7675');
            c.oval(cx, 18 + b, 15.5, 8.8, '#cfd8dc', { metallic: true });
            c.plate(cx - 15, 19 + b, 5, 14, '#95a5b5', { metallic: true, round: 1 });
            c.plate(cx + 11, 19 + b, 5, 14, '#95a5b5', { metallic: true, round: 1 });
            c.plate(cx - 13, 17 + b, 27, 3, '#f6c967', { metallic: true });
            c.plate(cx - 1, 14 + b, 3, 11, '#7f8fa6', { metallic: true });
          },
          drawGear: (c, cx, b, f) => {
            c.plate(cx - 28, 41 + b, 15, 22, '#2e86de', { metallic: true, round: 3 });
            c.plate(cx - 26, 43 + b, 11, 18, '#54a0ff', { metallic: true, round: 2 });
            c.plate(cx - 22, 45 + b, 3, 14, '#f6c967', { metallic: true });
            c.plate(cx - 25, 49 + b, 9, 3, '#f6c967', { metallic: true });
            const sy = 12 + b - f * 3;
            c.sword(cx + 23, sy, sy + 34, 3, '#dfe6e9', '#f6c967', '#6d4c41', '#74b9ff');
          }
        });
      }, { motion: 'px-motion-heavy', aura: '#74b9ff' }),

    barbarian: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          skin: '#dfa074', armor: '#d48f63', pauldron: '#6d4c41', belt: '#5d4037',
          trim: '#f6c967', pants: '#4e342e', boots: '#3e2723', eye: '#ff4757', tunicSkirt: '#5d4037',
          drawHeadgear: (c, cx, b) => {
            c.hairCap(cx, 18 + b, 16, 10, '#3a221c', { sideLocks: 13 });
            c.plate(cx - 15, 18 + b, 31, 4, '#636e72', { metallic: true, round: 1 });
            c.curve(cx - 14, 19 + b, cx - 22, 14 + b, cx - 23, 6 + b, 3.6, 1.0, '#f5f6fa');
            c.curve(cx + 14, 19 + b, cx + 22, 14 + b, cx + 23, 6 + b, 3.6, 1.0, '#f5f6fa');
            c.rect(cx - 8, 44 + b, 17, 2, '#ff4757');
            c.rect(cx - 6, 48 + b, 13, 2, '#eb3b5a');
            c.rect(cx - 11, 31 + b, 4, 2, '#ff4757');
            c.rect(cx + 8, 31 + b, 4, 2, '#ff4757');
          },
          drawGear: (c, cx, b, f) => {
            const ay = 10 + b - f * 3;
            c.capsule(cx + 22, ay + 6, cx + 22, ay + 52, 2.2, 2.2, '#784212');
            c.oval(cx + 15, ay + 15, 7.5, 11, '#b2bec3', { metallic: true });
            c.oval(cx + 29, ay + 15, 7.5, 11, '#b2bec3', { metallic: true });
            c.plate(cx + 19, ay + 10, 7, 10, '#636e72', { metallic: true, round: 1 });
            if (f) {
              c.glow(cx + 10, ay + 15, 6, '#ffffff', '#ff4757', '#eb3b5a');
              c.glow(cx + 34, ay + 15, 6, '#ffffff', '#ff4757', '#eb3b5a');
            }
          }
        });
      }, { motion: 'px-motion-heavy', aura: '#ff4757' }),

    rogue: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#2c3147', pauldron: '#1e2233', cape: '#1b1e2e', belt: '#4a3525',
          trim: '#2ed573', boots: '#1a1c29', eye: '#2ed573', noEyes: true,
          drawHeadgear: (c, cx, b, f, emo) => {
            c.oval(cx, 23 + b, 17, 14.5, '#25293d');
            c.oval(cx, 27 + b, 12.2, 9.6, '#141722', { shaded: false });
            c.oval(cx, 27 + b, 11, 5.2, '#f3d1b0');
            c.hiBitEye(cx - 10, 24 + b, '#2ed573', { emotion: emo, side: 'left' });
            c.hiBitEye(cx + 5, 24 + b, '#2ed573', { emotion: emo, side: 'right' });
            c.plate(cx - 11, 31 + b, 23, 8, '#1e2233', { round: 2, trim: '#2ed573' });
            c.curve(cx - 10, 39 + b, cx - 22 - f * 2, 42 + b, cx - 30 - f * 3, 49 + b, 3.6, 1.5, '#2ed573');
          },
          drawGear: (c, cx, b, f) => {
            c.curve(cx - 18, 54 + b, cx - 26, 46 + b - f * 2, cx - 30, 36 + b - f * 2, 2.6, 0.9, '#dfe6e9', { metallic: true });
            c.glow(cx - 30, 36 + b - f * 2, 5, '#ffffff', '#2ed573', '#1e8449');
            c.curve(cx + 18, 52 + b, cx + 26, 44 + b + f * 2, cx + 31, 34 + b + f * 2, 2.6, 0.9, '#dfe6e9', { metallic: true });
            c.glow(cx + 31, 34 + b + f * 2, 5, '#ffffff', '#55efc4', '#2ed573');
          }
        });
      }, { motion: 'px-motion-agile', aura: '#2ed573' }),

    ranger: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#249454', pauldron: '#196f3d', cape: '#145a32', belt: '#784212',
          trim: '#f6c967', pants: '#34495e', boots: '#5d4037', eye: '#55efc4', tunicSkirt: '#1e8449',
          drawHeadgear: (c, cx, b) => {
            c.capsule(cx - 13, 27 + b, cx - 19, 24 + b, 2.2, 0.8, '#f6d2b6');
            c.capsule(cx + 13, 27 + b, cx + 19, 24 + b, 2.2, 0.8, '#f6d2b6');
            c.hairCap(cx, 20 + b, 15.2, 9.8, '#e8eef5', { sideLocks: 15 });
            c.curve(cx - 16, 22 + b, cx, 7 + b, cx + 16, 22 + b, 4.6, 4.6, '#1e8449');
            c.plate(cx - 12, 16 + b, 25, 2, '#f6c967', { metallic: true });
          },
          drawGear: (c, cx, b, f) => {
            const bx = cx + 22;
            c.curve(bx - 3, 20 + b, bx + 11, 44 + b, bx - 3, 68 + b, 2.8, 2.8, '#9b5926');
            c.capsule(bx - 3, 22 + b, bx - 4 - f * 2, 44 + b, 0.7, 0.7, '#ecf0f1', { shaded: false });
            c.capsule(bx - 4 - f * 2, 44 + b, bx - 3, 66 + b, 0.7, 0.7, '#ecf0f1', { shaded: false });
            c.capsule(bx - 8 - f * 2, 44 + b, bx + 13, 44 + b, 1.2, 1.2, '#55efc4', { shaded: false });
            c.glow(bx + 13, 44 + b, 6.5, '#ffffff', '#55efc4', '#2ed573');
          }
        });
      }, { motion: 'px-motion-agile', aura: '#55efc4' }),

    wizard: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#2874c5', pauldron: '#1b4f72', cape: '#192a56', belt: '#f6c967',
          trim: '#00d2d3', chestAccent: '#f6c967', boots: '#1b4f72', eye: '#00d2d3', tunicSkirt: '#1e5ba0',
          drawHeadgear: (c, cx, b, f) => {
            c.oval(cx, 37 + b, 9.5, 6.2, '#f0f4f8', { texture: 'fur' });
            c.oval(cx, 41 + b, 5.5, 4.5, '#dfe6e9', { texture: 'fur' });
            c.oval(cx, 19 + b, 22, 4.8, '#2874c5');
            c.curve(cx - 13, 18 + b, cx - 2, 7 + b, cx + 6 + f * 2, 3 + b, 9.5, 1.8, '#2874c5');
            c.plate(cx - 13, 16 + b, 27, 3, '#f6c967', { metallic: true });
            c.px(cx - 5, 10 + b, '#ffeaa7');
            c.px(cx + 3, 12 + b, '#f6c967');
          },
          drawGear: (c, cx, b, f) => {
            const sx = cx + 24;
            c.capsule(sx, 24 + b, sx, 72, 2.2, 2.0, '#784212');
            c.glow(sx, 19 + b - f * 2, 10, '#ffffff', f ? '#a29bfe' : '#00d2d3', '#2e86de');
            c.oval(sx, 19 + b - f * 2, 5.2, 6.2, f ? '#a29bfe' : '#00d2d3', { metallic: true });
            c.oval(sx - 1, 17 + b - f * 2, 1.8, 2.0, '#ffffff', { shaded: false });
            c.glow(sx + (f ? 8 : -8), 15 + b, 3.5, '#ffffff', '#ffeaa7');
          }
        });
      }, { motion: 'px-motion-float', aura: '#00d2d3' }),

    cleric: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#eef2f7', pauldron: '#f6c967', cape: '#5ea8f0', belt: '#f6c967',
          trim: '#ffd32a', chestAccent: '#f6c967', boots: '#d4a017', eye: '#f39c12',
          metalArmor: true, tunicSkirt: '#dfe6ee',
          drawHeadgear: (c, cx, b, f) => {
            c.glow(cx, 7 + b - f * 2, 11, '#ffffff', '#ffd32a', '#f6c967');
            c.oval(cx, 7 + b - f * 2, 10.5, 2.4, '#ffd32a', { metallic: true });
            c.oval(cx, 7 + b - f * 2, 7.2, 1.1, '#1a2038', { shaded: false, alpha: 0 });
            c.hairCap(cx, 19 + b, 15.6, 10.2, '#f2c14e', { sideLocks: 18 });
            c.plate(cx - 11, 18 + b, 23, 2, '#ffffff', { metallic: true });
          },
          drawGear: (c, cx, b, f) => {
            const mx = cx + 23;
            c.capsule(mx, 28 + b, mx, 66, 2.1, 1.9, '#b7791f', { metallic: true });
            c.glow(mx, 22 + b - f * 2, 11, '#ffffff', '#ffd32a', '#ff9f43');
            c.oval(mx, 22 + b - f * 2, 6.2, 6.2, '#ffd32a', { metallic: true });
            for (let a = 0; a < 8; a++) {
              const ang = (Math.PI * 2 * a) / 8 + (f ? 0.2 : 0);
              c.capsule(mx + Math.cos(ang) * 5, 22 + b - f * 2 + Math.sin(ang) * 5, mx + Math.cos(ang) * 10, 22 + b - f * 2 + Math.sin(ang) * 10, 1.4, 0.5, '#ffeaa7');
            }
          }
        });
      }, { motion: 'px-motion-float', aura: '#ffeaa7' }),

    paladin: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#f2c14e', pauldron: '#ffeaa7', cape: '#d6304c', belt: '#b7791f',
          trim: '#ffffff', chestAccent: '#ffffff', boots: '#e1b12c', eye: '#3498db',
          metalArmor: true, metalBoots: true,
          drawHeadgear: (c, cx, b, f) => {
            c.oval(cx, 18 + b, 15.6, 9.2, '#f6c967', { metallic: true });
            c.plate(cx - 15, 19 + b, 5, 14, '#e1b12c', { metallic: true, round: 1 });
            c.plate(cx + 11, 19 + b, 5, 14, '#e1b12c', { metallic: true, round: 1 });
            c.curve(cx - 15, 20 + b, cx - 25, 14 + b - f * 2, cx - 29, 6 + b - f * 2, 4.2, 1.4, '#ffffff');
            c.curve(cx - 15, 23 + b, cx - 23, 19 + b - f * 2, cx - 26, 13 + b - f * 2, 3.0, 1.0, '#dfe6e9');
            c.curve(cx + 15, 20 + b, cx + 25, 14 + b - f * 2, cx + 29, 6 + b - f * 2, 4.2, 1.4, '#ffffff');
            c.curve(cx + 15, 23 + b, cx + 23, 19 + b - f * 2, cx + 26, 13 + b - f * 2, 3.0, 1.0, '#dfe6e9');
          },
          drawGear: (c, cx, b, f) => {
            c.plate(cx - 28, 39 + b, 15, 26, '#f5f6fa', { metallic: true, round: 3 });
            c.plate(cx - 22, 42 + b, 3, 20, '#f6c967', { metallic: true });
            c.plate(cx - 26, 48 + b, 11, 3, '#f6c967', { metallic: true });
            const sy = 9 + b - f * 3;
            c.glow(cx + 23, sy + 16, 12, '#ffffff', '#ffeaa7', '#f6c967');
            c.sword(cx + 23, sy, sy + 37, 3.4, '#ffeaa7', '#f6c967', '#c0392b', '#ffffff');
          }
        });
      }, { motion: 'px-motion-heavy', aura: '#f6c967' }),

    warlock: (emotion = 'neutral') =>
      renderAnimatedSprite(80, 80, (c, f) => {
        drawHiBitHeroBase(c, f, {
          emotion,
          armor: '#5b2c6f', pauldron: '#3c1e5a', cape: '#211033', belt: '#1a0c29',
          trim: '#e056fd', chestAccent: '#e056fd', boots: '#1a0c29', eye: '#e056fd',
          noEyes: true, tunicSkirt: '#3c1e5a',
          drawHeadgear: (c, cx, b, f, emo) => {
            c.oval(cx, 23 + b, 17.5, 15.2, '#4a235a');
            c.oval(cx, 27 + b, 12.2, 10.2, '#12081c', { shaded: false });
            const ec = emo === 'angry' ? '#ff4757' : emo === 'happy' ? '#ffd32a' : emo === 'sad' ? '#74b9ff' : emo === 'surprised' ? '#00d2d3' : '#e056fd';
            const er = emo === 'surprised' ? 3.5 : emo === 'happy' ? 2.1 : 2.8;
            c.glowEye(cx - 7, 26 + b, ec, er);
            c.glowEye(cx + 7, 26 + b, ec, er);
            c.curve(cx - 11, 13 + b, cx - 20, 9 + b, cx - 22, 3 + b, 3.6, 1.0, '#e056fd');
            c.curve(cx + 11, 13 + b, cx + 20, 9 + b, cx + 22, 3 + b, 3.6, 1.0, '#e056fd');
          },
          drawGear: (c, cx, b, f) => {
            const gx = cx + 23, gy = 38 + b - f * 3;
            c.plate(gx - 6, gy + 5, 13, 15, '#2c193d', { round: 2, trim: '#f6c967' });
            c.plate(gx - 4, gy + 7, 9, 11, '#f4efe6', { round: 1 });
            c.glow(gx, gy - 4, 11, '#ffffff', f ? '#ff4757' : '#e056fd', '#6c5ce7');
            c.curve(gx, gy + 2, gx - 3 + f * 4, gy - 6, gx + (f ? 2 : -2), gy - 13, 5.5, 1.2, f ? '#ff4757' : '#e056fd');
          }
        });
      }, { motion: 'px-motion-float', aura: '#e056fd' })
  };

  // ==========================================================================
  // 1B. GENUINE 160x160 SUBCULTURE ANIME PIXEL-ART RENDERER (6-EMOTION FX!)
  // ==========================================================================
  const ANIME_SPRITE_VER = '18';
  const EMOTION_PIXEL_FX = {
    neutral: '',
    happy:
      `<span class="px-emo-fx px-emo-happy" aria-hidden="true">` +
      `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">` +
      `<rect x="4" y="1" width="2" height="6" fill="#ffd32a"/><rect x="2" y="3" width="6" height="2" fill="#ffd32a"/><rect x="4" y="3" width="2" height="2" fill="#ffffff"/>` +
      `<rect x="11" y="6" width="2" height="5" fill="#ff9ff3"/><rect x="9" y="8" width="6" height="1" fill="#ff9ff3"/><rect x="11" y="8" width="2" height="1" fill="#ffffff"/>` +
      `<rect x="2" y="11" width="2" height="2" fill="#ffeaa7"/>` +
      `</svg></span>`,
    angry:
      `<span class="px-emo-fx px-emo-angry" aria-hidden="true">` +
      `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">` +
      `<rect x="2" y="2" width="12" height="12" rx="2" fill="#2d0910" opacity="0.72"/>` +
      `<rect x="4" y="4" width="3" height="2" fill="#ff4757"/><rect x="5" y="4" width="2" height="3" fill="#ff4757"/>` +
      `<rect x="9" y="4" width="3" height="2" fill="#ff4757"/><rect x="9" y="4" width="2" height="3" fill="#ff4757"/>` +
      `<rect x="4" y="10" width="3" height="2" fill="#ff4757"/><rect x="5" y="9" width="2" height="3" fill="#ff4757"/>` +
      `<rect x="9" y="10" width="3" height="2" fill="#ff4757"/><rect x="9" y="9" width="2" height="3" fill="#ff4757"/>` +
      `<rect x="7" y="7" width="2" height="2" fill="#ffeaa7"/>` +
      `</svg></span>`,
    sad:
      `<span class="px-emo-fx px-emo-sad" aria-hidden="true">` +
      `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">` +
      `<rect x="7" y="2" width="2" height="2" fill="#0984e3"/>` +
      `<rect x="6" y="4" width="4" height="3" fill="#74b9ff"/>` +
      `<rect x="5" y="7" width="6" height="5" fill="#0984e3"/>` +
      `<rect x="6" y="7" width="4" height="4" fill="#74b9ff"/>` +
      `<rect x="6" y="12" width="4" height="2" fill="#0984e3"/>` +
      `<rect x="6" y="6" width="2" height="3" fill="#ffffff"/>` +
      `</svg></span>`,
    surprised:
      `<span class="px-emo-fx px-emo-surprised" aria-hidden="true">` +
      `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">` +
      `<rect x="5" y="1" width="6" height="10" fill="#13192c" opacity="0.8"/>` +
      `<rect x="6" y="2" width="4" height="8" fill="#00d2d3"/><rect x="7" y="2" width="2" height="7" fill="#ffffff"/>` +
      `<rect x="6" y="11" width="4" height="4" fill="#13192c" opacity="0.8"/>` +
      `<rect x="7" y="12" width="2" height="2" fill="#ffd32a"/>` +
      `<rect x="1" y="4" width="3" height="1" fill="#ffd32a"/><rect x="12" y="4" width="3" height="1" fill="#ffd32a"/>` +
      `</svg></span>`,
    smug:
      `<span class="px-emo-fx px-emo-smug" aria-hidden="true">` +
      `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">` +
      `<rect x="7" y="1" width="2" height="14" fill="#e056fd"/>` +
      `<rect x="1" y="7" width="14" height="2" fill="#e056fd"/>` +
      `<rect x="5" y="5" width="6" height="6" fill="#f6c967"/>` +
      `<rect x="7" y="3" width="2" height="10" fill="#ffffff"/>` +
      `<rect x="3" y="7" width="10" height="2" fill="#ffffff"/>` +
      `</svg></span>`
  };

  const HERO_ANIME_ART = {
    fighter:   { src: `assets/chars/fighter.png?v=${ANIME_SPRITE_VER}`,   motion: 'px-motion-heavy', aura: '#74b9ff' },
    barbarian: { src: `assets/chars/barbarian.png?v=${ANIME_SPRITE_VER}`, motion: 'px-motion-heavy', aura: '#ff4757' },
    rogue:     { src: `assets/chars/rogue.png?v=${ANIME_SPRITE_VER}`,     motion: 'px-motion-agile', aura: '#2ed573' },
    ranger:    { src: `assets/chars/ranger.png?v=${ANIME_SPRITE_VER}`,    motion: 'px-motion-agile', aura: '#55efc4' },
    wizard:    { src: `assets/chars/wizard.png?v=${ANIME_SPRITE_VER}`,    motion: 'px-motion-float', aura: '#00d2d3' },
    cleric:    { src: `assets/chars/cleric.png?v=${ANIME_SPRITE_VER}`,    motion: 'px-motion-float', aura: '#ffeaa7' },
    paladin:   { src: `assets/chars/paladin.png?v=${ANIME_SPRITE_VER}`,   motion: 'px-motion-heavy', aura: '#f6c967' },
    warlock:   { src: `assets/chars/warlock.png?v=${ANIME_SPRITE_VER}`,   motion: 'px-motion-float', aura: '#e056fd' }
  };

  function renderAnimeSprite(imgPath, emotion = 'neutral', opts = {}) {
    const emo = EMOTION_META[emotion] ? emotion : 'neutral';
    const motion = opts.motion || 'px-motion-agile';
    const aura = opts.aura || '';
    const auraHtml = aura
      ? `<span class="px-aura-glow" style="background:radial-gradient(circle, ${aura}48 0%, ${aura}00 72%);"></span>`
      : '';
    const fxHtml = EMOTION_PIXEL_FX[emo] || '';
    return (
      `<div class="pixel-sprite px-hibit px-anime-art ${motion}" data-res="160x160" data-emo="${emo}" aria-hidden="true">` +
      auraHtml +
      `<img class="px-frame px-f1" src="${imgPath}" alt="" decoding="async">` +
      `<img class="px-frame px-f2 px-anime-bob" src="${imgPath}" alt="" decoding="async">` +
      fxHtml +
      `</div>`
    );
  }

  // Lazy Cache for all 8 Heroes x 6 Emotions = 48 unique 160x160 Anime Pixel-Art Emotion Assets!
  const _heroEmotionCache = {};
  function getHeroEmotionSprite(charId, emotion = 'neutral') {
    const cid = HERO_SPRITES[charId] ? charId : 'fighter';
    const emo = EMOTION_META[emotion] ? emotion : 'neutral';
    const key = `${cid}::${emo}`;
    if (!_heroEmotionCache[key]) {
      const anime = HERO_ANIME_ART[cid];
      if (anime) {
        _heroEmotionCache[key] = renderAnimeSprite(anime.src, emo, {
          motion: anime.motion,
          aura: anime.aura
        });
      } else {
        _heroEmotionCache[key] = HERO_SPRITES[cid](emo);
      }
    }
    return _heroEmotionCache[key];
  }

  // ==========================================================================
  // 2. SUBCULTURE ANIME PIXEL-ART MONSTERS & BOSSES (80x80 / 96x96, ALL 82 UNIQUE!)
  //    - Layer-by-layer crisp 1px dark ink contours + clean cel-shading
  //    - 3/4 left-facing JRPG battle stances matching the 160x160 anime heroes!
  // ==========================================================================
  const MONSTER_DRAWERS = {
    beholder(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, r = c.w * 0.25, sc = c.w / 80;
      const stalks = [
        [-25, -24 - f * 3], [-15, -31 + f * 2], [-3, -34 - f * 3],
        [10, -31 + f * 3], [22, -25 - f * 2], [-27, -7 + f * 3], [26, -8 - f * 3]
      ];
      // Back sinuous armored eyestalks
      stalks.forEach(([dx, dy], idx) => {
        c.ink(sub => {
          sub.curve(cx + dx * 0.45 * sc, cy + dy * 0.45 * sc, cx + dx * 0.8 * sc, cy + (dy * 0.9 - 5) * sc, cx + dx * sc, cy + dy * sc, 3.2 * sc, 1.8 * sc, idx % 2 ? s.p : s.d);
          sub.oval(cx + dx * sc, cy + dy * sc, 3.8 * sc, 3.6 * sc, '#f5f6fa', { dither: false });
          sub.glowEye(cx + (dx - 0.8) * sc, cy + dy * sc, s.e, 1.6 * sc);
        });
      });
      // Sculpted chitinous tyrant orb + brow armor plates + sinister grinning maw
      c.ink(sub => {
        sub.oval(cx, cy, r, r * 0.93, s.p, { texture: 'scale', dither: false });
        // Layered chitinous cheek/crown armor ridges
        sub.poly([
          [cx - r * 0.88, cy - r * 0.25], [cx - r * 0.42, cy - r * 0.96],
          [cx + r * 0.45, cy - r * 0.96], [cx + r * 0.9, cy - r * 0.22],
          [cx + r * 0.48, cy - r * 0.52], [cx - r * 0.52, cy - r * 0.52]
        ], s.d);
        // Giant central anime tyrant eye (slightly angled left!)
        const ex = cx - 2 * sc, ey = cy - 4 * sc, er = r * 0.54;
        sub.oval(ex, ey, er, er * 0.92, '#140f20', { shaded: false });
        sub.oval(ex, ey, er * 0.88, er * 0.8, '#f7f8fc', { shaded: false });
        sub.oval(ex - 1 * sc, ey, er * 0.62, er * 0.62, s.a, { dither: false });
        sub.oval(ex - 1.5 * sc, ey, er * 0.28, er * 0.44, '#0d0b18', { shaded: false });
        sub.oval(ex - er * 0.34, ey - er * 0.28, er * 0.22, er * 0.18, '#ffffff', { shaded: false });
        sub.px(ex + er * 0.24, ey + er * 0.22, '#ffffff');
        // Angry furrowed chitin brow over main eye
        sub.poly([
          [ex - er * 1.15, ey - er * 0.72], [ex + er * 0.1, ey - er * 0.44],
          [ex + er * 1.15, ey - er * 0.8], [ex + er * 0.95, ey - er * 1.1],
          [ex - er * 0.95, ey - er * 1.05]
        ], s.d);
        // Sinister jagged crescent maw with razor pixel fangs
        sub.poly([
          [cx - r * 0.68, cy + r * 0.32], [cx - r * 0.2, cy + r * 0.44],
          [cx + r * 0.35, cy + r * 0.42], [cx + r * 0.66, cy + r * 0.26],
          [cx + r * 0.46, cy + r * 0.76], [cx - r * 0.48, cy + r * 0.76]
        ], '#260817', { shaded: false });
        for (let tx = -r * 0.52; tx <= r * 0.52; tx += 4.6 * sc) {
          sub.poly([
            [cx + tx - 1.5 * sc, cy + r * 0.38],
            [cx + tx + 1.5 * sc, cy + r * 0.38],
            [cx + tx, cy + r * 0.58 + (f ? 1.5 * sc : 0)]
          ], '#ffffff', { shaded: false });
          sub.poly([
            [cx + tx - 1.2 * sc, cy + r * 0.74],
            [cx + tx + 1.2 * sc, cy + r * 0.74],
            [cx + tx, cy + r * 0.58]
          ], '#dfe6e9', { shaded: false });
        }
      });
    },

    dragon(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, sc = c.w / 80;
      const wf = (f ? 6 : -5) * sc;
      // Dramatic scalloped bat wings (3/4 spread!)
      c.batWing(cx - 2 * sc, cy - 4 * sc, -1, 31 * sc, 24 * sc, s.d, s.p, wf * 0.8);
      c.batWing(cx + 6 * sc, cy - 5 * sc, 1, 32 * sc, 26 * sc, s.d, s.p, wf);
      // Whip-like spiked tail sweeping behind
      c.ink(sub => {
        sub.curve(cx + 10 * sc, cy + 16 * sc, cx + 26 * sc, cy + 19 * sc, cx + 34 * sc, cy + 4 * sc - f * 3 * sc, 4.2 * sc, 1.3 * sc, s.p);
        sub.poly([
          [cx + 31 * sc, cy + 4 * sc - f * 3 * sc],
          [cx + 38 * sc, cy - 1 * sc - f * 3 * sc],
          [cx + 34 * sc, cy + 8 * sc - f * 3 * sc]
        ], s.a);
      });
      // Muscular armored body, segmented belly & clawed hind legs
      c.ink(sub => {
        // Rear & front clawed dragon legs
        sub.poly([[cx - 13 * sc, cy + 14 * sc], [cx - 4 * sc, cy + 14 * sc], [cx - 7 * sc, cy + 27 * sc], [cx - 17 * sc, cy + 27 * sc]], s.d);
        sub.poly([[cx + 4 * sc, cy + 14 * sc], [cx + 14 * sc, cy + 14 * sc], [cx + 15 * sc, cy + 27 * sc], [cx + 5 * sc, cy + 27 * sc]], s.d);
        // White claws
        sub.line(cx - 17 * sc, cy + 27 * sc, cx - 20 * sc, cy + 28 * sc, '#f5f6fa', 1.4);
        sub.line(cx + 5 * sc, cy + 27 * sc, cx + 2 * sc, cy + 28 * sc, '#f5f6fa', 1.4);
        // Chest & neck S-curve
        sub.poly([
          [cx - 12 * sc, cy + 2 * sc], [cx + 6 * sc, cy - 2 * sc],
          [cx + 16 * sc, cy + 12 * sc], [cx + 10 * sc, cy + 22 * sc],
          [cx - 10 * sc, cy + 22 * sc], [cx - 15 * sc, cy + 12 * sc]
        ], s.p, { texture: 'scale' });
        // Segmented gold/pale armored chest plates
        for (let py = 0; py < 4; py++) {
          sub.poly([
            [cx - 9 * sc, cy + (4 + py * 4.2) * sc],
            [cx + 5 * sc, cy + (4 + py * 4.2) * sc],
            [cx + 3 * sc, cy + (7.6 + py * 4.2) * sc],
            [cx - 7 * sc, cy + (7.6 + py * 4.2) * sc]
          ], s.a);
        }
        // Sinuous arched neck
        sub.curve(cx - 2 * sc, cy + 2 * sc, cx + 3 * sc, cy - 10 * sc, cx - 7 * sc, cy - 17 * sc + f * 1.5 * sc, 7.2 * sc, 5.2 * sc, s.p);
      });
      // Fierce 3/4 left-facing dragon head + breath ember!
      c.dragonHead(cx - 9 * sc, cy - 18 * sc + f * 1.5 * sc, 1.05 * sc, -1, s.p, s.d, s.a, s.e, f);
      c.glow(cx - 26 * sc, cy - 15 * sc + f * 1.5 * sc, 7.5 * sc, '#ffffff', s.e, s.a);
    },

    tiamat(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.65, sc = c.w / 96;
      const wf = (f ? 7 : -6) * sc;
      // Colossal twin jagged abyssal dragon wings
      c.batWing(cx - 8 * sc, cy - 8 * sc, -1, 38 * sc, 30 * sc, '#4b1335', '#2a0b22', wf);
      c.batWing(cx + 8 * sc, cy - 8 * sc, 1, 38 * sc, 30 * sc, '#4b1335', '#2a0b22', wf);
      // Armored Queen body + golden breastplate
      c.ink(sub => {
        sub.poly([[cx - 18 * sc, cy + 16 * sc], [cx - 6 * sc, cy + 16 * sc], [cx - 9 * sc, cy + 28 * sc], [cx - 22 * sc, cy + 28 * sc]], '#2b0d24');
        sub.poly([[cx + 6 * sc, cy + 16 * sc], [cx + 18 * sc, cy + 16 * sc], [cx + 22 * sc, cy + 28 * sc], [cx + 9 * sc, cy + 28 * sc]], '#2b0d24');
        sub.poly([
          [cx - 18 * sc, cy - 4 * sc], [cx + 18 * sc, cy - 4 * sc],
          [cx + 21 * sc, cy + 14 * sc], [cx + 13 * sc, cy + 23 * sc],
          [cx - 13 * sc, cy + 23 * sc], [cx - 21 * sc, cy + 14 * sc]
        ], '#52183a', { texture: 'scale' });
        sub.poly([
          [cx - 11 * sc, cy + 1 * sc], [cx + 11 * sc, cy + 1 * sc],
          [cx + 8 * sc, cy + 19 * sc], [cx - 8 * sc, cy + 19 * sc]
        ], '#f6c967', { metallic: true });
      });
      // ALL 5 SCULPTED CHROMATIC DRAGON HEADS (Red, Blue, Green, Black, White)!
      const heads = [
        { dx: -30, dy: -22 + f * 3, dir: -1, p: '#eb3b5a', d: '#8b152c', a: '#ffdd59', e: '#fff200' },
        { dx: -16, dy: -36 - f * 2, dir: -1, p: '#2e86de', d: '#193b78', a: '#74b9ff', e: '#00d2d3' },
        { dx: 0,   dy: -42 + f * 2, dir: -1, p: '#26de81', d: '#10663d', a: '#b8e994', e: '#ffeaa7' },
        { dx: 16,  dy: -36 - f * 2, dir: 1,  p: '#3b4252', d: '#181c26', a: '#a4b0be', e: '#ff4757' },
        { dx: 30,  dy: -22 + f * 3, dir: 1,  p: '#eef2f7', d: '#95a5a6', a: '#dff9fb', e: '#74b9ff' }
      ];
      heads.forEach(hd => {
        c.ink(sub => {
          sub.curve(cx + hd.dx * 0.28 * sc, cy - 4 * sc, cx + hd.dx * 0.72 * sc, cy + hd.dy * 0.55 * sc, cx + hd.dx * sc, cy + hd.dy * sc, 5.2 * sc, 3.6 * sc, hd.p);
        });
        c.dragonHead(cx + hd.dx * sc, cy + hd.dy * sc, 0.58 * sc, hd.dir, hd.p, hd.d, hd.a, hd.e, f);
      });
    },

    mindflayer(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // High jagged gothic illithid mantle & sweeping robes
      c.ink(sub => {
        sub.poly([
          [cx - 22 * sc, 28 * sc + b], [cx - 12 * sc, 36 * sc + b],
          [cx + 14 * sc, 36 * sc + b], [cx + 24 * sc, 26 * sc + b],
          [cx + 18 * sc, 45 * sc + b], [cx - 16 * sc, 45 * sc + b]
        ], s.a, { metallic: true });
        sub.cape(cx + 2 * sc, 35 * sc + b, 74 * sc, 20 * sc, 36 * sc, s.d, f ? 4 : 2, s.a);
        sub.poly([
          [cx - 8 * sc, 38 * sc + b], [cx + 8 * sc, 38 * sc + b],
          [cx + 11 * sc, 72 * sc], [cx - 11 * sc, 72 * sc]
        ], hueShade(s.d, 0.14));
        sub.poly([[cx - 2 * sc, 40 * sc + b], [cx + 2 * sc, 40 * sc + b], [cx + 4 * sc, 68 * sc], [cx - 4 * sc, 68 * sc]], s.a, { metallic: true });
      });
      // Sculpted bulbous illithid head + writhing anime tentacles
      c.ink(sub => {
        sub.poly([
          [cx - 11 * sc, 24 * sc + b], [cx - 13 * sc, 15 * sc + b],
          [cx - 5 * sc, 9 * sc + b], [cx + 8 * sc, 10 * sc + b],
          [cx + 14 * sc, 17 * sc + b], [cx + 10 * sc, 28 * sc + b],
          [cx - 8 * sc, 30 * sc + b]
        ], s.p);
        sub.line(cx - 10 * sc, 21 * sc + b, cx - 3 * sc, 22.5 * sc + b, '#140f20', 1.4);
        sub.line(cx + 1 * sc, 22.5 * sc + b, cx + 8 * sc, 21 * sc + b, '#140f20', 1.4);
        sub.glowEye(cx - 6.5 * sc, 23 * sc + b, s.e, 2.3 * sc);
        sub.glowEye(cx + 3.5 * sc, 23 * sc + b, s.e, 2.3 * sc);
        for (let i = -3; i <= 3; i += 2) {
          const sway = (i < 0 ? -1 : 1) * (f ? 4.5 : -1.5) * sc;
          sub.curve(cx + (i * 2.2 - 1) * sc, 29 * sc + b, cx + (i * 2.8 - 1) * sc + sway, 38 * sc + b, cx + (i * 2 - 2) * sc + sway, 46 * sc + b, 2.6 * sc, 0.9 * sc, s.p);
        }
      });
      // Floating psionic crystal orb in front left hand
      c.glow(cx - 23 * sc, 37 * sc - f * 3 * sc, 11 * sc, '#ffffff', s.a, s.p);
      c.ink(sub => {
        sub.poly([
          [cx - 23 * sc, 30 * sc - f * 3 * sc], [cx - 17 * sc, 37 * sc - f * 3 * sc],
          [cx - 23 * sc, 44 * sc - f * 3 * sc], [cx - 29 * sc, 37 * sc - f * 3 * sc]
        ], s.a, { metallic: true });
      });
    },

    brain(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.45 + f * 2, sc = c.w / 80;
      // Psionic halo ring behind Elder Brain / Devourer
      c.glow(cx, cy, 29 * sc, '#ffffff', s.a, s.p);
      // Coiling psionic tendrils underneath
      c.ink(sub => {
        for (let i = -2; i <= 2; i++) {
          const lx = cx + i * 9.5 * sc;
          sub.curve(lx, cy + 12 * sc, lx + (f ? 5 : -5) * sc, cy + 22 * sc, lx - (f ? 3 : -3) * sc, cy + 30 * sc, 3.0 * sc, 1.0 * sc, s.d);
        }
      });
      // Sculpted twin-lobe pulsing cerebral dome with crisp neural sulci
      c.ink(sub => {
        sub.oval(cx - 9 * sc, cy, 17 * sc, 16 * sc, s.p, { dither: false });
        sub.oval(cx + 9 * sc, cy, 17 * sc, 16 * sc, s.p, { dither: false });
        sub.oval(cx, cy - 3 * sc, 21 * sc, 14 * sc, hueShade(s.p, 0.14), { dither: false });
        // Crisp dark cerebral folds
        sub.curve(cx, cy - 16 * sc, cx, cy, cx, cy + 14 * sc, 1.4 * sc, 1.4 * sc, s.d);
        sub.curve(cx - 20 * sc, cy - 3 * sc, cx - 10 * sc, cy + 4 * sc, cx - 4 * sc, cy - 5 * sc, 1.4 * sc, 1.4 * sc, s.d);
        sub.curve(cx + 4 * sc, cy + 2 * sc, cx + 11 * sc, cy - 6 * sc, cx + 20 * sc, cy + 2 * sc, 1.4 * sc, 1.4 * sc, s.d);
        sub.curve(cx - 15 * sc, cy + 8 * sc, cx - 6 * sc, cy + 11 * sc, cx - 2 * sc, cy + 6 * sc, 1.2 * sc, 1.2 * sc, s.d);
        // Glowing psychic eyes
        sub.glowEye(cx - 9 * sc, cy + 2 * sc, s.e, 2.8 * sc);
        sub.glowEye(cx + 7 * sc, cy + 2 * sc, s.e, 2.8 * sc);
      });
    },

    spider(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, sc = c.w / 80;
      // 8 sharp articulated anime arachnid legs (angled knee joints!)
      c.ink(sub => {
        for (let i = 0; i < 4; i++) {
          const yOff = (-8 + i * 6.5) * sc;
          const step = (i % 2 === f ? -4.5 : 4.5) * sc;
          const kxL = cx - (22 + i * 1.5) * sc, kyL = cy + yOff - 12 * sc + step;
          const fxL = cx - (32 + (i === 1 ? 3 : 0)) * sc, fyL = cy + yOff + 11 * sc + step;
          sub.capsule(cx - 9 * sc, cy + yOff, kxL, kyL, 2.5 * sc, 1.7 * sc, s.d);
          sub.capsule(kxL, kyL, fxL, fyL, 1.8 * sc, 0.8 * sc, s.p);

          const kxR = cx + (22 + i * 1.5) * sc, kyR = cy + yOff - 12 * sc - step;
          const fxR = cx + (32 + (i === 1 ? 3 : 0)) * sc, fyR = cy + yOff + 11 * sc - step;
          sub.capsule(cx + 9 * sc, cy + yOff, kxR, kyR, 2.5 * sc, 1.7 * sc, s.d);
          sub.capsule(kxR, kyR, fxR, fyR, 1.8 * sc, 0.8 * sc, s.p);
        }
      });
      // Sculpted armored spider abdomen with hourglass emblem
      c.ink(sub => {
        sub.poly([
          [cx - 15 * sc, cy - 8 * sc + f * 1.5], [cx - 8 * sc, cy - 22 * sc + f * 1.5],
          [cx + 8 * sc, cy - 22 * sc + f * 1.5], [cx + 15 * sc, cy - 8 * sc + f * 1.5],
          [cx + 9 * sc, cy + 4 * sc + f * 1.5], [cx - 9 * sc, cy + 4 * sc + f * 1.5]
        ], s.p);
        sub.poly([[cx, cy - 18 * sc + f * 1.5], [cx + 6 * sc, cy - 11 * sc + f * 1.5], [cx, cy - 4 * sc + f * 1.5], [cx - 6 * sc, cy - 11 * sc + f * 1.5]], s.a);
      });
      // Head carapace + 6 glowing eyes + razor mandibles
      c.ink(sub => {
        sub.poly([
          [cx - 11 * sc, cy + 4 * sc], [cx + 11 * sc, cy + 4 * sc],
          [cx + 12 * sc, cy + 15 * sc], [cx, cy + 20 * sc], [cx - 12 * sc, cy + 15 * sc]
        ], s.d);
        [-7, -2.6, 2.6, 7].forEach((dx, idx) => sub.glowEye(cx + dx * sc, cy + (idx === 1 || idx === 2 ? 9 : 11) * sc, s.e, 1.7 * sc));
        sub.poly([[cx - 7 * sc, cy + 16 * sc], [cx - 3 * sc, cy + 16 * sc], [cx - 4 * sc, cy + 24 * sc]], '#f5f6fa');
        sub.poly([[cx + 3 * sc, cy + 16 * sc], [cx + 7 * sc, cy + 16 * sc], [cx + 4 * sc, cy + 24 * sc]], '#f5f6fa');
      });
    },

    slime(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, sc = c.w / 80;
      const sw = (f ? 3.5 : 0) * sc, sh = (f ? -3 : 0) * sc;
      // Anime translucent crystal-gelatinous slime / cube with crisp specular shine & trapped adventurer gear!
      c.ink(sub => {
        sub.poly([
          [cx - 22 * sc - sw, cy - 16 * sc - sh],
          [cx - 15 * sc - sw, cy - 23 * sc - sh],
          [cx + 15 * sc + sw, cy - 23 * sc - sh],
          [cx + 22 * sc + sw, cy - 16 * sc - sh],
          [cx + 25 * sc + sw, cy + 16 * sc],
          [cx + 18 * sc + sw, cy + 21 * sc],
          [cx - 18 * sc - sw, cy + 21 * sc],
          [cx - 25 * sc - sw, cy + 16 * sc]
        ], s.p, { metallic: true });
        // Trapped skull & floating sword inside gel
        sub.ink(inner => {
          inner.oval(cx + 5 * sc, cy - 3 * sc - f * 2 * sc, 7.2 * sc, 6.4 * sc, '#f5f6fa', { dither: false });
          inner.rect(cx + 2 * sc, cy - 4 * sc - f * 2 * sc, 2.2 * sc, 2.6 * sc, '#14111f');
          inner.rect(cx + 7 * sc, cy - 4 * sc - f * 2 * sc, 2.2 * sc, 2.6 * sc, '#14111f');
          inner.sword(cx - 10 * sc, cy - 11 * sc, cy + 10 * sc, 2.0 * sc, '#dfe6e9', '#f6c967', '#5d4037');
        });
        // Glossy anime water-drop highlights
        sub.poly([
          [cx - 18 * sc - sw, cy - 16 * sc - sh], [cx - 6 * sc - sw, cy - 18 * sc - sh],
          [cx - 8 * sc - sw, cy - 13 * sc - sh], [cx - 18 * sc - sw, cy - 10 * sc - sh]
        ], '#ffffff', { shaded: false, alpha: 215 });
        sub.oval(cx + 13 * sc + sw, cy - 14 * sc - sh, 3.2 * sc, 2.0 * sc, '#ffffff', { shaded: false, alpha: 195 });
        // Cute/menacing gleaming slime bubbles
        sub.oval(cx - 14 * sc, cy + 11 * sc - f * 2, 2.6 * sc, 2.6 * sc, s.a, { shaded: false });
        sub.oval(cx + 15 * sc, cy + 9 * sc + f * 2, 2.2 * sc, 2.2 * sc, s.a, { shaded: false });
      });
    },

    mimic(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.59, sc = c.w / 80;
      // Ornate wooden RPG treasure chest with iron/gold banding
      c.ink(sub => {
        sub.poly([
          [cx - 24 * sc, cy - 1 * sc], [cx + 24 * sc, cy - 1 * sc],
          [cx + 22 * sc, cy + 20 * sc], [cx - 22 * sc, cy + 20 * sc]
        ], s.p);
        sub.plate(cx - 24 * sc, cy - 1 * sc, 48 * sc, 4.5 * sc, s.a, { metallic: true });
        sub.plate(cx - 18 * sc, cy, 4 * sc, 20 * sc, s.a, { metallic: true });
        sub.plate(cx + 14 * sc, cy, 4 * sc, 20 * sc, s.a, { metallic: true });
        sub.plate(cx - 5 * sc, cy - 2 * sc, 10 * sc, 9 * sc, s.a, { metallic: true, round: 2 });
        sub.rect(cx - 1.5 * sc, cy + 1 * sc, 3 * sc, 4 * sc, '#140f20');
      });
      if (f === 0) {
        c.ink(sub => {
          sub.poly([
            [cx - 25 * sc, cy - 1 * sc], [cx - 21 * sc, cy - 18 * sc],
            [cx + 21 * sc, cy - 18 * sc], [cx + 25 * sc, cy - 1 * sc]
          ], hueShade(s.p, 0.12));
          sub.rect(cx - 24 * sc, cy - 4 * sc, 48 * sc, 4 * sc, '#140812');
          sub.glowEye(cx - 10 * sc, cy - 2.5 * sc, s.e, 2.4 * sc);
          sub.glowEye(cx + 10 * sc, cy - 2.5 * sc, s.e, 2.4 * sc);
        });
      } else {
        c.ink(sub => {
          // Snapping jaws & lashing tongue!
          sub.poly([
            [cx - 26 * sc, cy - 14 * sc], [cx - 22 * sc, cy - 30 * sc],
            [cx + 22 * sc, cy - 30 * sc], [cx + 26 * sc, cy - 14 * sc]
          ], hueShade(s.p, 0.16));
          sub.poly([
            [cx - 22 * sc, cy - 14 * sc], [cx + 22 * sc, cy - 14 * sc],
            [cx + 21 * sc, cy + 1 * sc], [cx - 21 * sc, cy + 1 * sc]
          ], '#3b091c', { shaded: false });
          for (let tx = -18; tx <= 18; tx += 6) {
            sub.poly([[cx + (tx - 2) * sc, cy - 14 * sc], [cx + (tx + 2) * sc, cy - 14 * sc], [cx + tx * sc, cy - 8 * sc]], '#ffffff', { shaded: false });
            sub.poly([[cx + (tx - 2) * sc, cy + 1 * sc], [cx + (tx + 2) * sc, cy + 1 * sc], [cx + tx * sc, cy - 5 * sc]], '#dfe6e9', { shaded: false });
          }
          sub.curve(cx - 2 * sc, cy - 5 * sc, cx - 14 * sc, cy - 12 * sc, cx - 26 * sc, cy + 3 * sc, 4.8 * sc, 2.0 * sc, s.e);
          sub.glowEye(cx - 11 * sc, cy - 22 * sc, '#ffdd59', 2.4 * sc);
          sub.glowEye(cx + 11 * sc, cy - 22 * sc, '#ffdd59', 2.4 * sc);
        });
      }
    },

    goblin(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Agile crouched 3/4-left anime goblin / kobold skirmisher with arms gripping spear & buckler!
      c.ink(sub => {
        sub.poly([[cx - 9 * sc, 54 * sc], [cx - 3 * sc, 54 * sc], [cx - 7 * sc, 72 * sc], [cx - 13 * sc, 72 * sc]], s.d);
        sub.poly([[cx + 3 * sc, 54 * sc], [cx + 9 * sc, 54 * sc], [cx + 12 * sc, 72 * sc], [cx + 6 * sc, 72 * sc]], s.d);
        sub.poly([
          [cx - 10 * sc, 39 * sc + b], [cx + 10 * sc, 39 * sc + b],
          [cx + 12 * sc, 56 * sc + b], [cx - 12 * sc, 56 * sc + b]
        ], s.d);
        sub.plate(cx - 11 * sc, 49 * sc + b, 22 * sc, 4 * sc, s.a, { metallic: true });
        // Arms reaching out to hold spear & ragged wooden buckler!
        sub.capsule(cx - 9 * sc, 43 * sc + b, cx - 18 * sc, 47 * sc + b - f * 2 * sc, 2.6 * sc, 2.1 * sc, s.p);
        sub.capsule(cx + 9 * sc, 43 * sc + b, cx + 15 * sc, 50 * sc + b, 2.6 * sc, 2.1 * sc, s.p);
        sub.oval(cx + 16 * sc, 51 * sc + b, 5.5 * sc, 7.5 * sc, '#784212', { dither: false });
        sub.oval(cx + 16 * sc, 51 * sc + b, 2.2 * sc, 2.2 * sc, s.a, { metallic: true });
      });
      // Huge sharp pointed ears + sly grinning anime goblin head
      c.ink(sub => {
        sub.poly([[cx - 10 * sc, 26 * sc + b], [cx - 31 * sc, 17 * sc + b - f * 2 * sc], [cx - 11 * sc, 32 * sc + b]], s.p);
        sub.poly([[cx + 10 * sc, 26 * sc + b], [cx + 31 * sc, 17 * sc + b - f * 2 * sc], [cx + 11 * sc, 32 * sc + b]], s.p);
        sub.poly([
          [cx - 11 * sc, 20 * sc + b], [cx - 5 * sc, 14 * sc + b],
          [cx + 6 * sc, 14 * sc + b], [cx + 11 * sc, 21 * sc + b],
          [cx + 8 * sc, 34 * sc + b], [cx - 2 * sc, 38 * sc + b], [cx - 11 * sc, 33 * sc + b]
        ], s.p);
        // Pointed mischievous nose + angled anime eyes + toothy grin
        sub.poly([[cx - 3 * sc, 27 * sc + b], [cx - 8 * sc, 30 * sc + b], [cx - 2 * sc, 31 * sc + b]], hueShade(s.p, -0.18));
        sub.hiBitEye(cx - 9.5 * sc, 22 * sc + b, s.e, { emotion: 'angry', side: 'left' });
        sub.hiBitEye(cx + 2 * sc, 22 * sc + b, s.e, { emotion: 'angry', side: 'right' });
        sub.poly([[cx - 6 * sc, 33 * sc + b], [cx + 4 * sc, 32 * sc + b], [cx + 2 * sc, 35 * sc + b], [cx - 5 * sc, 35 * sc + b]], '#ffffff', { shaded: false });
      });
      // Jagged goblin spear gripped cleanly in left hand!
      c.ink(sub => {
        sub.capsule(cx - 15 * sc, 56 * sc + b, cx - 25 * sc, 16 * sc + b - f * 3 * sc, 1.9 * sc, 1.5 * sc, '#8d5524');
        sub.poly([
          [cx - 27 * sc, 20 * sc + b - f * 3 * sc], [cx - 22 * sc, 18 * sc + b - f * 3 * sc],
          [cx - 27 * sc, 6 * sc + b - f * 3 * sc]
        ], '#dfe6e9', { metallic: true });
        sub.oval(cx - 18 * sc, 47 * sc + b - f * 2 * sc, 2.8 * sc, 2.6 * sc, s.p, { dither: false });
      });
    },

    brute(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Hunched muscular anime orc/troll warlord with real gripping arms, diagonal chest harness & tusks!
      c.ink(sub => {
        sub.poly([[cx - 15 * sc, 55 * sc], [cx - 4 * sc, 55 * sc], [cx - 8 * sc, 73 * sc], [cx - 19 * sc, 73 * sc]], s.d);
        sub.poly([[cx + 4 * sc, 55 * sc], [cx + 15 * sc, 55 * sc], [cx + 19 * sc, 73 * sc], [cx + 8 * sc, 73 * sc]], s.d);
        // Sculpted muscular V-taper torso + fur-trimmed loincloth
        sub.poly([
          [cx - 18 * sc, 32 * sc + b], [cx + 18 * sc, 32 * sc + b],
          [cx + 13 * sc, 57 * sc + b], [cx - 13 * sc, 57 * sc + b]
        ], s.p);
        sub.poly([[cx - 12 * sc, 52 * sc + b], [cx + 12 * sc, 52 * sc + b], [cx + 15 * sc, 63 * sc + b], [cx - 15 * sc, 63 * sc + b]], '#4a2e1d');
        // Diagonal leather chest strap & spiked shoulder pauldrons
        sub.line(cx - 13 * sc, 34 * sc + b, cx + 11 * sc, 51 * sc + b, '#3c2419', 3.4 * sc);
        sub.plate(cx - 14 * sc, 49 * sc + b, 28 * sc, 5 * sc, '#3c2419', { round: 1 });
        sub.plate(cx - 4 * sc, 48 * sc + b, 9 * sc, 7 * sc, s.a, { metallic: true, round: 2 });
        // Muscular arms (left reaching to grip greataxe, right clenched fist!)
        sub.capsule(cx - 16 * sc, 37 * sc + b, cx - 23 * sc, 48 * sc + b - f * 2 * sc, 4.4 * sc, 3.6 * sc, s.p);
        sub.capsule(cx + 16 * sc, 37 * sc + b, cx + 22 * sc, 51 * sc + b, 4.4 * sc, 3.8 * sc, s.p);
        sub.poly([[cx - 24 * sc, 34 * sc + b], [cx - 13 * sc, 28 * sc + b], [cx - 10 * sc, 40 * sc + b], [cx - 21 * sc, 42 * sc + b]], s.d, { metallic: true });
        sub.poly([[cx + 13 * sc, 28 * sc + b], [cx + 24 * sc, 34 * sc + b], [cx + 21 * sc, 42 * sc + b], [cx + 10 * sc, 40 * sc + b]], s.d, { metallic: true });
      });
      // Sculpted fierce orc/troll head with spiky war mane, angular brow & sharp tusks
      c.ink(sub => {
        sub.poly([
          [cx - 12 * sc, 19 * sc + b], [cx - 7 * sc, 14 * sc + b], [cx + 7 * sc, 14 * sc + b],
          [cx + 12 * sc, 20 * sc + b], [cx + 11 * sc, 32 * sc + b], [cx + 3 * sc, 37 * sc + b],
          [cx - 9 * sc, 37 * sc + b], [cx - 13 * sc, 30 * sc + b]
        ], s.p);
        // Spiky war hair crest
        sub.poly([
          [cx - 13 * sc, 20 * sc + b], [cx - 10 * sc, 10 * sc + b], [cx - 3 * sc, 14 * sc + b],
          [cx + 2 * sc, 8 * sc + b], [cx + 8 * sc, 14 * sc + b], [cx + 14 * sc, 11 * sc + b], [cx + 13 * sc, 21 * sc + b]
        ], '#1f1b2b');
        sub.hiBitEye(cx - 10 * sc, 22 * sc + b, s.e, { emotion: 'angry', side: 'left' });
        sub.hiBitEye(cx + 1.5 * sc, 22 * sc + b, s.e, { emotion: 'angry', side: 'right' });
        sub.rect(cx - 8 * sc, 32 * sc + b, 14 * sc, 3 * sc, '#2b0b14');
        sub.poly([[cx - 9 * sc, 35 * sc + b], [cx - 6 * sc, 35 * sc + b], [cx - 8 * sc, 28 * sc + b]], '#ffffff', { shaded: false });
        sub.poly([[cx + 3 * sc, 35 * sc + b], [cx + 6 * sc, 35 * sc + b], [cx + 5 * sc, 28 * sc + b]], '#ffffff', { shaded: false });
      });
      // Colossal double-notched war-axe gripped in left fist!
      c.ink(sub => {
        sub.capsule(cx - 21 * sc, 56 * sc + b, cx - 28 * sc, 12 * sc - f * 4 * sc, 2.5 * sc, 2.3 * sc, '#6d4c41');
        sub.poly([
          [cx - 26 * sc, 9 * sc - f * 4 * sc], [cx - 39 * sc, 15 * sc - f * 4 * sc],
          [cx - 37 * sc, 30 * sc - f * 4 * sc], [cx - 24 * sc, 26 * sc - f * 4 * sc]
        ], s.a, { metallic: true });
        sub.oval(cx - 23 * sc, 48 * sc + b - f * 2 * sc, 4.0 * sc, 3.6 * sc, s.p, { dither: false });
      });
    },

    ettin(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      c.ink(sub => {
        sub.poly([[cx - 19 * sc, 65 * sc], [cx - 6 * sc, 65 * sc], [cx - 8 * sc, 86 * sc], [cx - 22 * sc, 86 * sc]], s.d);
        sub.poly([[cx + 6 * sc, 65 * sc], [cx + 19 * sc, 65 * sc], [cx + 22 * sc, 86 * sc], [cx + 8 * sc, 86 * sc]], s.d);
        sub.poly([
          [cx - 25 * sc, 38 * sc + b], [cx + 25 * sc, 38 * sc + b],
          [cx + 22 * sc, 68 * sc + b], [cx - 22 * sc, 68 * sc + b]
        ], s.p);
        sub.plate(cx - 22 * sc, 58 * sc + b, 44 * sc, 7 * sc, s.a, { metallic: true });
      });
      // Twin angry giant heads
      [[-14, b], [14, -b]].forEach(([dx, hb]) => {
        c.ink(sub => {
          sub.poly([
            [cx + (dx - 11) * sc, 19 * sc + hb], [cx + (dx + 11) * sc, 19 * sc + hb],
            [cx + (dx + 10) * sc, 37 * sc + hb], [cx + (dx - 10) * sc, 37 * sc + hb]
          ], s.p);
          sub.glowEye(cx + (dx - 4.5) * sc, 26 * sc + hb, s.e, 2.2 * sc);
          sub.glowEye(cx + (dx + 4.5) * sc, 26 * sc + hb, s.e, 2.2 * sc);
          sub.poly([[cx + (dx - 5) * sc, 35 * sc + hb], [cx + (dx - 3) * sc, 35 * sc + hb], [cx + (dx - 4) * sc, 30 * sc + hb]], '#ffffff', { shaded: false });
          sub.poly([[cx + (dx + 3) * sc, 35 * sc + hb], [cx + (dx + 5) * sc, 35 * sc + hb], [cx + (dx + 4) * sc, 30 * sc + hb]], '#ffffff', { shaded: false });
        });
      });
      // Twin spiked morningstar clubs
      c.ink(sub => {
        sub.capsule(cx - 28 * sc, 56 * sc, cx - 37 * sc, 20 * sc + f * 5 * sc, 3.6 * sc, 4.6 * sc, '#784212');
        sub.capsule(cx + 28 * sc, 56 * sc, cx + 37 * sc, 20 * sc - f * 5 * sc, 3.6 * sc, 4.6 * sc, '#784212');
      });
    },

    skeleton(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Crisp dark-fantasy anime skeletal knight (3/4 left stance!)
      c.ink(sub => {
        sub.cape(cx + 4 * sc, 38 * sc + b, 71 * sc, 18 * sc, 30 * sc, s.d, f ? 4 : 2);
      });
      c.ink(sub => {
        sub.poly([[cx - 9 * sc, 54 * sc], [cx - 4 * sc, 54 * sc], [cx - 6 * sc, 72 * sc], [cx - 11 * sc, 72 * sc]], '#e8e8e8');
        sub.poly([[cx + 4 * sc, 54 * sc], [cx + 9 * sc, 54 * sc], [cx + 11 * sc, 72 * sc], [cx + 6 * sc, 72 * sc]], '#e8e8e8');
        sub.poly([
          [cx - 11 * sc, 39 * sc + b], [cx + 11 * sc, 39 * sc + b],
          [cx + 9 * sc, 56 * sc + b], [cx - 9 * sc, 56 * sc + b]
        ], s.p, { metallic: true });
        for (let ry = 43; ry <= 51; ry += 4) sub.rect(cx - 7 * sc, ry * sc + b, 14 * sc, 2 * sc, '#f5f6fa');
      });
      // Sculpted Gothic Anime Skull + real bony arms gripping shield & gleaming sword!
      c.ink(sub => {
        sub.capsule(cx - 9 * sc, 43 * sc + b, cx - 20 * sc, 48 * sc + b - f * 2 * sc, 2.0 * sc, 1.8 * sc, '#e8e8e8');
        sub.capsule(cx + 9 * sc, 43 * sc + b, cx + 16 * sc, 50 * sc + b, 2.0 * sc, 1.8 * sc, '#e8e8e8');
      });
      c.animeSkull(cx - 0.5 * sc, 25 * sc + b, 1.0 * sc, '#f5f6fa', s.e);
      c.ink(sub => {
        sub.poly([[cx + 12 * sc, 40 * sc + b], [cx + 25 * sc, 42 * sc + b], [cx + 23 * sc, 58 * sc + b], [cx + 16 * sc, 62 * sc + b], [cx + 10 * sc, 56 * sc + b]], s.d, { metallic: true });
        sub.sword(cx - 21 * sc, 12 * sc + b - f * 4 * sc, 48 * sc + b - f * 4 * sc, 2.6 * sc, '#ecf0f1', s.a, '#576574');
        sub.oval(cx - 21 * sc, 48 * sc + b - f * 2 * sc, 2.5 * sc, 2.5 * sc, '#f5f6fa', { dither: false });
      });
    },

    wraith(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Swirling spectral anime reaper cloak with tattered wisps & glowing scythe-claws
      c.glow(cx, 38 * sc + b, 24 * sc, '#ffffff', s.a, s.p);
      c.ink(sub => {
        sub.poly([
          [cx - 12 * sc, 32 * sc + b], [cx + 14 * sc, 32 * sc + b],
          [cx + 24 * sc + (f ? 4 : -2) * sc, 72 * sc], [cx + 12 * sc, 64 * sc],
          [cx + 3 * sc, 74 * sc], [cx - 6 * sc, 65 * sc],
          [cx - 19 * sc + (f ? 3 : -2) * sc, 72 * sc]
        ], s.p);
        // Pointed gothic hood & shadowed abyss face
        sub.poly([
          [cx - 14 * sc, 26 * sc + b], [cx - 11 * sc, 13 * sc + b],
          [cx + 2 * sc, 8 * sc + b], [cx + 14 * sc, 15 * sc + b],
          [cx + 15 * sc, 29 * sc + b], [cx, 35 * sc + b]
        ], s.d);
        sub.oval(cx - 1 * sc, 24 * sc + b, 9 * sc, 8 * sc, '#090910', { shaded: false });
        sub.glowEye(cx - 5.5 * sc, 23 * sc + b, s.e, 2.3 * sc);
        sub.glowEye(cx + 3.5 * sc, 23 * sc + b, s.e, 2.3 * sc);
        // Spectral outstretched claws
        sub.curve(cx - 13 * sc, 40 * sc + b, cx - 25 * sc, 36 * sc + b, cx - 32 * sc, 30 * sc - f * 4 * sc, 3.2 * sc, 1.0 * sc, s.a);
        sub.curve(cx + 14 * sc, 40 * sc + b, cx + 25 * sc, 36 * sc + b, cx + 31 * sc, 31 * sc + f * 4 * sc, 3.2 * sc, 1.0 * sc, s.a);
      });
    },

    lich(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      // Sovereign Archlich in high-collared necromantic mantle + real skeletal arms + sculpted skull!
      c.ink(sub => {
        sub.cape(cx + 4 * sc, 38 * sc + b, 89 * sc, 24 * sc, 48 * sc, s.d, f ? 4 : 2, s.a);
        sub.poly([
          [cx - 23 * sc, 29 * sc + b], [cx - 11 * sc, 39 * sc + b],
          [cx + 11 * sc, 39 * sc + b], [cx + 23 * sc, 29 * sc + b],
          [cx + 18 * sc, 47 * sc + b], [cx - 18 * sc, 47 * sc + b]
        ], s.p, { metallic: true });
        sub.poly([[cx - 11 * sc, 42 * sc + b], [cx + 11 * sc, 42 * sc + b], [cx + 17 * sc, 86 * sc], [cx - 17 * sc, 86 * sc]], s.p);
        sub.poly([[cx - 4 * sc, 43 * sc + b], [cx + 4 * sc, 43 * sc + b], [cx + 6 * sc, 81 * sc], [cx - 6 * sc, 81 * sc]], s.a, { metallic: true });
        // Flowing wizard sleeves & bony hands reaching out to grip staff!
        sub.poly([[cx - 12 * sc, 44 * sc + b], [cx - 28 * sc, 53 * sc + b], [cx - 24 * sc, 62 * sc + b], [cx - 11 * sc, 54 * sc + b]], s.d);
        sub.poly([[cx + 12 * sc, 44 * sc + b], [cx + 24 * sc, 55 * sc + b], [cx + 19 * sc, 62 * sc + b], [cx + 11 * sc, 54 * sc + b]], s.d);
        sub.oval(cx + 21 * sc, 57 * sc + b, 3.0 * sc, 2.8 * sc, '#ecf0f1', { dither: false });
      });
      // Dark hood framing sculpted Gothic Anime Skull!
      c.ink(sub => {
        sub.oval(cx, 25 * sc + b, 15.5 * sc, 13.5 * sc, s.d, { dither: false });
      });
      c.animeSkull(cx - 0.5 * sc, 27 * sc + b, 1.05 * sc, '#ecf0f1', s.e);
      // Necromantic Soul Staff gripped cleanly in left hand!
      const sx = cx - 28 * sc;
      c.glow(sx, 20 * sc - f * 4 * sc, 14 * sc, '#ffffff', s.e, s.a);
      c.ink(sub => {
        sub.capsule(sx, 26 * sc + b, sx, 86 * sc, 2.4 * sc, 2.0 * sc, '#4a235a');
        sub.poly([
          [sx, 10 * sc - f * 4 * sc], [sx + 7 * sc, 20 * sc - f * 4 * sc],
          [sx, 30 * sc - f * 4 * sc], [sx - 7 * sc, 20 * sc - f * 4 * sc]
        ], s.e, { metallic: true });
        sub.oval(sx + 1 * sc, 55 * sc + b, 3.2 * sc, 3.0 * sc, '#ecf0f1', { dither: false });
      });
    },

    vampire(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 1.5 * sc;
      // Sleek Castlevania/Alucard Anime Vampire Lord (back hair behind shoulders -> coat -> face -> front bangs!)
      c.ink(sub => {
        sub.cape(cx + 6 * sc, 31 * sc + b, 74 * sc, 22 * sc, 44 * sc, s.p, f ? 4 : 2, s.a);
        sub.poly([
          [cx - 17 * sc, 18 * sc + b], [cx - 8 * sc, 33 * sc + b],
          [cx + 10 * sc, 33 * sc + b], [cx + 19 * sc, 18 * sc + b],
          [cx + 15 * sc, 38 * sc + b], [cx - 15 * sc, 38 * sc + b]
        ], s.p);
      });
      c.animeHair(cx - 1 * sc, 24 * sc + b, 0.96 * sc, '#1c1829', { layer: 'back', backLen: 15 });
      // Slender 4-head anime coat, boots, white ruffled cravat & arms!
      c.ink(sub => {
        sub.poly([[cx - 8 * sc, 53 * sc], [cx - 2.5 * sc, 53 * sc], [cx - 5 * sc, 73 * sc], [cx - 11 * sc, 73 * sc]], '#161421');
        sub.poly([[cx + 2.5 * sc, 53 * sc], [cx + 8 * sc, 53 * sc], [cx + 11 * sc, 73 * sc], [cx + 5 * sc, 73 * sc]], '#161421');
        sub.poly([[cx - 9 * sc, 47 * sc + b], [cx + 9 * sc, 47 * sc + b], [cx + 14 * sc, 65 * sc + b], [cx - 14 * sc, 65 * sc + b]], s.d);
        sub.poly([[cx - 10 * sc, 35 * sc + b], [cx + 10 * sc, 35 * sc + b], [cx + 8 * sc, 51 * sc + b], [cx - 8 * sc, 51 * sc + b]], s.d);
        sub.poly([[cx - 3.2 * sc, 36 * sc + b], [cx + 3.2 * sc, 36 * sc + b], [cx + 1.8 * sc, 46 * sc + b], [cx - 1.8 * sc, 46 * sc + b]], '#f5f6fa');
        sub.oval(cx, 39 * sc + b, 1.8 * sc, 2.0 * sc, s.e, { shaded: false });
        sub.plate(cx - 9 * sc, 48 * sc + b, 18 * sc, 3 * sc, s.a, { metallic: true });
        sub.capsule(cx - 9 * sc, 39 * sc + b, cx - 20 * sc, 48 * sc + b - f * 2 * sc, 2.8 * sc, 2.2 * sc, s.d);
        sub.capsule(cx + 9 * sc, 39 * sc + b, cx + 15 * sc, 51 * sc + b, 2.8 * sc, 2.2 * sc, s.d);
        sub.oval(cx + 15 * sc, 52 * sc + b, 2.4 * sc, 2.2 * sc, '#f4eaee', { dither: false });
      });
      c.animeHead(cx - 1 * sc, 24 * sc + b, 0.94 * sc, '#f4eaee', { facing: -1, eye: s.e, fangs: true });
      c.animeHair(cx - 1 * sc, 24 * sc + b, 0.96 * sc, '#1c1829', { layer: 'front', sideLen: 10, spiky: true });
      c.ink(sub => {
        sub.sword(cx - 21 * sc, 15 * sc + b - f * 3 * sc, 50 * sc + b - f * 3 * sc, 2.0 * sc, '#f5f6fa', s.a, '#3d0b1a', s.e);
        sub.oval(cx - 21 * sc, 50 * sc + b - f * 2 * sc, 2.8 * sc, 2.6 * sc, '#f4eaee', { dither: false });
      });
    },

    demon(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      const wf = (f ? 6 : -5) * sc;
      // Sweeping scalloped hellfire bat wings
      c.batWing(cx - 5 * sc, 33 * sc + b, -1, 32 * sc, 26 * sc, s.d, '#240b14', wf);
      c.batWing(cx + 5 * sc, 33 * sc + b, 1, 32 * sc, 26 * sc, s.d, '#240b14', wf);
      // Muscular abyssal lord body, dark armor tassets, real clawed arms & hooves!
      c.ink(sub => {
        sub.poly([[cx - 13 * sc, 54 * sc], [cx - 4 * sc, 54 * sc], [cx - 7 * sc, 73 * sc], [cx - 16 * sc, 73 * sc]], s.d);
        sub.poly([[cx + 4 * sc, 54 * sc], [cx + 13 * sc, 54 * sc], [cx + 16 * sc, 73 * sc], [cx + 7 * sc, 73 * sc]], s.d);
        sub.poly([
          [cx - 16 * sc, 33 * sc + b], [cx + 16 * sc, 33 * sc + b],
          [cx + 11 * sc, 55 * sc + b], [cx - 11 * sc, 55 * sc + b]
        ], s.p);
        // Dark obsidian chest armor plates + flaming belt
        sub.poly([[cx - 14 * sc, 35 * sc + b], [cx - 2 * sc, 38 * sc + b], [cx - 3 * sc, 47 * sc + b], [cx - 12 * sc, 45 * sc + b]], s.d, { metallic: true });
        sub.poly([[cx + 14 * sc, 35 * sc + b], [cx + 2 * sc, 38 * sc + b], [cx + 3 * sc, 47 * sc + b], [cx + 12 * sc, 45 * sc + b]], s.d, { metallic: true });
        sub.plate(cx - 12 * sc, 49 * sc + b, 24 * sc, 5 * sc, s.a, { metallic: true });
        // Muscular clawed demon arms reaching for hellblade!
        sub.capsule(cx - 15 * sc, 37 * sc + b, cx - 23 * sc, 48 * sc + b - f * 2 * sc, 3.8 * sc, 3.1 * sc, s.p);
        sub.capsule(cx + 15 * sc, 37 * sc + b, cx + 22 * sc, 51 * sc + b, 3.8 * sc, 3.1 * sc, s.p);
        sub.poly([[cx - 21 * sc, 34 * sc + b], [cx - 11 * sc, 29 * sc + b], [cx - 9 * sc, 39 * sc + b], [cx - 19 * sc, 41 * sc + b]], '#240b14', { metallic: true });
        sub.poly([[cx + 11 * sc, 29 * sc + b], [cx + 21 * sc, 34 * sc + b], [cx + 19 * sc, 41 * sc + b], [cx + 9 * sc, 39 * sc + b]], '#240b14', { metallic: true });
      });
      // Swept curved obsidian/gold demon horns + sculpted fierce demon head with fangs!
      c.ink(sub => {
        sub.curve(cx - 8 * sc, 17 * sc + b, cx - 18 * sc, 11 * sc + b, cx - 24 * sc, 4 * sc + b, 3.2 * sc, 0.9 * sc, s.a);
        sub.curve(cx + 8 * sc, 17 * sc + b, cx + 18 * sc, 11 * sc + b, cx + 24 * sc, 4 * sc + b, 3.2 * sc, 0.9 * sc, s.a);
        sub.poly([
          [cx - 10 * sc, 17 * sc + b], [cx + 10 * sc, 17 * sc + b],
          [cx + 10 * sc, 28 * sc + b], [cx, 35 * sc + b], [cx - 10 * sc, 28 * sc + b]
        ], s.p);
        sub.line(cx - 9 * sc, 21 * sc + b, cx - 2 * sc, 23 * sc + b, '#140f20', 1.6);
        sub.line(cx + 2 * sc, 23 * sc + b, cx + 9 * sc, 21 * sc + b, '#140f20', 1.6);
        sub.glowEye(cx - 5.2 * sc, 24 * sc + b, s.e, 2.2 * sc);
        sub.glowEye(cx + 4.4 * sc, 24 * sc + b, s.e, 2.2 * sc);
        sub.rect(cx - 5 * sc, 29.5 * sc + b, 10 * sc, 2.4 * sc, '#240811');
        sub.px(cx - 4 * sc, 30 * sc + b, '#ffffff');
        sub.px(cx + 4 * sc, 30 * sc + b, '#ffffff');
      });
      // Blazing hellblade gripped cleanly in left fist!
      c.glow(cx - 24 * sc, 22 * sc + b - f * 3 * sc, 10 * sc, '#ffffff', s.e, s.a);
      c.ink(sub => {
        sub.sword(cx - 24 * sc, 10 * sc + b - f * 4 * sc, 47 * sc + b - f * 4 * sc, 2.8 * sc, s.a, '#2f3640', '#1e1e2c', '#ffffff');
        sub.oval(cx - 24 * sc, 48 * sc + b - f * 2 * sc, 3.4 * sc, 3.0 * sc, s.p, { dither: false });
      });
    },

    demogorgon(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      // Twin lashing abyssal tentacle-arms + scaly Prince of Demons body + dual snarling baboon heads
      c.ink(sub => {
        sub.curve(cx - 18 * sc, 48 * sc, cx - 34 * sc, 38 * sc + f * 6 * sc, cx - 42 * sc, 28 * sc + f * 6 * sc, 5.0 * sc, 1.8 * sc, s.a);
        sub.curve(cx + 18 * sc, 48 * sc, cx + 34 * sc, 38 * sc - f * 6 * sc, cx + 42 * sc, 28 * sc - f * 6 * sc, 5.0 * sc, 1.8 * sc, s.a);
        sub.poly([[cx - 17 * sc, 66 * sc], [cx - 6 * sc, 66 * sc], [cx - 9 * sc, 86 * sc], [cx - 21 * sc, 86 * sc]], s.d);
        sub.poly([[cx + 6 * sc, 66 * sc], [cx + 17 * sc, 66 * sc], [cx + 21 * sc, 86 * sc], [cx + 9 * sc, 86 * sc]], s.d);
        sub.poly([
          [cx - 22 * sc, 38 * sc + b], [cx + 22 * sc, 38 * sc + b],
          [cx + 19 * sc, 68 * sc + b], [cx - 19 * sc, 68 * sc + b]
        ], s.p, { texture: 'scale' });
      });
      [[-15, -1, b], [15, 1, -b]].forEach(([dx, dir, hb]) => {
        c.dragonHead(cx + dx * sc, 26 * sc + hb, 0.72 * sc, dir, s.p, s.d, s.a, s.e, f);
      });
    },

    knight(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 1.5 * sc;
      // Sleek 4-head Anime Dark Knight / Drow Assassin / Githyanki Commander with gauntleted arms!
      c.ink(sub => {
        sub.cape(cx + 6 * sc, 34 * sc + b, 73 * sc, 20 * sc, 38 * sc, s.d, f ? 5 : 2.5, s.a);
      });
      c.ink(sub => {
        sub.poly([[cx - 9 * sc, 53 * sc], [cx - 3 * sc, 53 * sc], [cx - 6 * sc, 73 * sc], [cx - 12 * sc, 73 * sc]], s.d, { metallic: true });
        sub.poly([[cx + 3 * sc, 53 * sc], [cx + 9 * sc, 53 * sc], [cx + 12 * sc, 73 * sc], [cx + 6 * sc, 73 * sc]], s.d, { metallic: true });
        sub.poly([[cx - 11 * sc, 36 * sc + b], [cx + 11 * sc, 36 * sc + b], [cx + 8 * sc, 54 * sc + b], [cx - 8 * sc, 54 * sc + b]], s.p, { metallic: true });
        // Gauntleted arms gripping greatsword!
        sub.capsule(cx - 11 * sc, 40 * sc + b, cx - 22 * sc, 48 * sc + b - f * 2 * sc, 3.0 * sc, 2.5 * sc, s.d, { metallic: true });
        sub.capsule(cx + 11 * sc, 40 * sc + b, cx + 17 * sc, 51 * sc + b, 3.0 * sc, 2.5 * sc, s.d, { metallic: true });
        sub.poly([[cx - 19 * sc, 37 * sc + b], [cx - 10 * sc, 33 * sc + b], [cx - 9 * sc, 44 * sc + b], [cx - 17 * sc, 44 * sc + b]], s.p, { metallic: true });
        sub.poly([[cx + 10 * sc, 33 * sc + b], [cx + 19 * sc, 37 * sc + b], [cx + 17 * sc, 44 * sc + b], [cx + 9 * sc, 44 * sc + b]], s.p, { metallic: true });
        sub.poly([[cx - 2.5 * sc, 38 * sc + b], [cx + 2.5 * sc, 38 * sc + b], [cx + 4 * sc, 52 * sc + b], [cx - 4 * sc, 52 * sc + b]], s.a, { metallic: true });
      });
      // Angular horned knight greathelm with glowing visor slit
      c.ink(sub => {
        sub.curve(cx - 9 * sc, 17 * sc + b, cx - 17 * sc, 12 * sc + b, cx - 22 * sc, 5 * sc + b, 2.8 * sc, 0.8 * sc, s.a);
        sub.curve(cx + 9 * sc, 17 * sc + b, cx + 17 * sc, 12 * sc + b, cx + 22 * sc, 5 * sc + b, 2.8 * sc, 0.8 * sc, s.a);
        sub.poly([
          [cx - 11 * sc, 18 * sc + b], [cx - 6 * sc, 12 * sc + b],
          [cx + 6 * sc, 12 * sc + b], [cx + 11 * sc, 18 * sc + b],
          [cx + 10 * sc, 32 * sc + b], [cx - 1 * sc, 36 * sc + b], [cx - 11 * sc, 31 * sc + b]
        ], s.p, { metallic: true });
        sub.poly([[cx - 10 * sc, 22 * sc + b], [cx + 8 * sc, 22 * sc + b], [cx + 7 * sc, 28 * sc + b], [cx - 9 * sc, 28 * sc + b]], '#0c0d16', { shaded: false });
        sub.glowEye(cx - 5.5 * sc, 25 * sc + b, s.e, 2.0 * sc);
        sub.glowEye(cx + 3 * sc, 25 * sc + b, s.e, 2.0 * sc);
      });
      // Glowing runeblade gripped cleanly in left gauntlet!
      c.ink(sub => {
        sub.sword(cx - 23 * sc, 10 * sc + b - f * 4 * sc, 48 * sc + b - f * 4 * sc, 2.9 * sc, s.a, s.p, '#1e1e2c', '#ffffff');
        sub.oval(cx - 23 * sc, 49 * sc + b - f * 2 * sc, 3.2 * sc, 2.8 * sc, s.p, { metallic: true });
      });
    },

    golem(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 1.5 * sc;
      // Sculpted Fantasy Anime Titan / Iron Sentinel (layered shoulder crests, rune core, heavy fists!)
      c.ink(sub => {
        sub.poly([[cx - 17 * sc, 55 * sc], [cx - 5 * sc, 55 * sc], [cx - 6 * sc, 74 * sc], [cx - 20 * sc, 74 * sc]], s.d, { metallic: true });
        sub.poly([[cx + 5 * sc, 55 * sc], [cx + 17 * sc, 55 * sc], [cx + 20 * sc, 74 * sc], [cx + 6 * sc, 74 * sc]], s.d, { metallic: true });
        // Hexagonal armored titan chest
        sub.poly([
          [cx - 21 * sc, 31 * sc + b], [cx + 21 * sc, 31 * sc + b],
          [cx + 24 * sc, 44 * sc + b], [cx + 16 * sc, 58 * sc + b],
          [cx - 16 * sc, 58 * sc + b], [cx - 24 * sc, 44 * sc + b]
        ], s.p, { metallic: true });
        // Angled heavy pauldrons & colossal rune gauntlets
        sub.poly([[cx - 31 * sc, 34 * sc + b], [cx - 19 * sc, 26 * sc + b], [cx - 16 * sc, 40 * sc + b], [cx - 32 * sc, 43 * sc + b]], s.d, { metallic: true });
        sub.poly([[cx + 19 * sc, 26 * sc + b], [cx + 31 * sc, 34 * sc + b], [cx + 32 * sc, 43 * sc + b], [cx + 16 * sc, 40 * sc + b]], s.d, { metallic: true });
        sub.poly([[cx - 33 * sc, 43 * sc + b], [cx - 21 * sc, 42 * sc + b], [cx - 20 * sc, 60 * sc + b], [cx - 34 * sc, 58 * sc + b]], s.p, { metallic: true });
        sub.poly([[cx + 21 * sc, 42 * sc + b], [cx + 33 * sc, 43 * sc + b], [cx + 34 * sc, 58 * sc + b], [cx + 20 * sc, 60 * sc + b]], s.p, { metallic: true });
        // Glowing diamond furnace core
        sub.poly([[cx, 37 * sc + b], [cx + 7 * sc, 45 * sc + b], [cx, 53 * sc + b], [cx - 7 * sc, 45 * sc + b]], f ? s.e : s.a, { metallic: true });
      });
      c.glow(cx, 45 * sc + b, 11 * sc, '#ffffff', f ? s.e : s.a, s.d);
      // Crested sentinel helm (NOT a flat box!)
      c.ink(sub => {
        sub.poly([
          [cx - 10 * sc, 19 * sc + b], [cx, 12 * sc + b], [cx + 10 * sc, 19 * sc + b],
          [cx + 11 * sc, 31 * sc + b], [cx, 34 * sc + b], [cx - 11 * sc, 31 * sc + b]
        ], s.p, { metallic: true });
        sub.poly([[cx - 9 * sc, 22 * sc + b], [cx + 9 * sc, 22 * sc + b], [cx + 7 * sc, 27 * sc + b], [cx - 7 * sc, 27 * sc + b]], '#10101c', { shaded: false });
        sub.glowEye(cx - 4.5 * sc, 24.5 * sc + b, s.e, 2.0 * sc);
        sub.glowEye(cx + 4.5 * sc, 24.5 * sc + b, s.e, 2.0 * sc);
      });
    },

    beast(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Agile prowling anime fantasy beast (Owlbear / Gnoll / Displacer Beast) facing LEFT!
      c.ink(sub => {
        // Whipping tail
        sub.curve(cx + 20 * sc, 42 * sc + b, cx + 31 * sc, 33 * sc, cx + 35 * sc, 22 * sc - f * 4 * sc, 3.6 * sc, 1.3 * sc, s.a);
        // Striding legs & claws
        sub.poly([[cx - 16 * sc, 52 * sc - f * 2 * sc], [cx - 8 * sc, 52 * sc - f * 2 * sc], [cx - 11 * sc, 70 * sc], [cx - 19 * sc, 70 * sc]], s.d);
        sub.poly([[cx + 11 * sc, 52 * sc + f * 2 * sc], [cx + 19 * sc, 52 * sc + f * 2 * sc], [cx + 22 * sc, 70 * sc], [cx + 14 * sc, 70 * sc]], s.d);
        // Muscular crouched body + bright mane/chest fur
        sub.poly([
          [cx - 14 * sc, 36 * sc + b], [cx + 18 * sc, 38 * sc + b],
          [cx + 24 * sc, 50 * sc + b], [cx + 14 * sc, 59 * sc + b],
          [cx - 12 * sc, 58 * sc + b], [cx - 18 * sc, 46 * sc + b]
        ], s.p);
        sub.poly([[cx - 14 * sc, 40 * sc + b], [cx + 4 * sc, 42 * sc + b], [cx - 4 * sc, 56 * sc + b], [cx - 15 * sc, 50 * sc + b]], s.a);
      });
      // Fierce angular beast head with tufted ears + glowing eyes
      c.ink(sub => {
        sub.poly([[cx - 19 * sc, 24 * sc + b], [cx - 24 * sc, 11 * sc + b], [cx - 12 * sc, 20 * sc + b]], s.d);
        sub.poly([[cx - 6 * sc, 22 * sc + b], [cx - 2 * sc, 11 * sc + b], [cx - 1 * sc, 23 * sc + b]], s.d);
        sub.poly([
          [cx - 23 * sc, 25 * sc + b], [cx - 14 * sc, 19 * sc + b],
          [cx - 1 * sc, 22 * sc + b], [cx + 1 * sc, 34 * sc + b],
          [cx - 14 * sc, 42 * sc + b], [cx - 27 * sc, 36 * sc + b]
        ], s.p);
        sub.glowEye(cx - 18 * sc, 28 * sc + b, s.e, 2.3 * sc);
        sub.glowEye(cx - 8 * sc, 28 * sc + b, s.e, 2.3 * sc);
        sub.poly([[cx - 23 * sc, 35 * sc + b], [cx - 15 * sc, 35 * sc + b], [cx - 19 * sc, 41 * sc + b]], s.a);
      });
    },

    worm(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Armored segmented sandworm / purple worm titan rearing up toward left!
      [
        [cx + 14 * sc, 58 * sc, 16 * sc, 11 * sc, s.d],
        [cx + 5 * sc, 49 * sc + b, 17 * sc, 12 * sc, s.p],
        [cx - 4 * sc, 38 * sc + b, 17 * sc, 13 * sc, s.p]
      ].forEach(([x, y, rx, ry, col]) => {
        c.ink(sub => {
          sub.oval(x, y, rx, ry, col, { texture: 'scale', dither: false });
          sub.poly([[x + rx * 0.5, y - ry * 0.8], [x + rx * 1.1, y - ry * 1.15], [x + rx * 0.8, y - ry * 0.2]], s.a);
        });
      });
      // Giant toothed circular maw angled left!
      c.ink(sub => {
        sub.oval(cx - 8 * sc, 24 * sc + b, 16.5 * sc, 14.5 * sc, s.p, { texture: 'scale', dither: false });
        sub.oval(cx - 10 * sc, 24 * sc + b, 10.5 * sc, 9.2 * sc, '#260715', { shaded: false });
        for (let ang = 0; ang < 10; ang++) {
          const a = (Math.PI * 2 * ang) / 10 + (f ? 0.22 : 0);
          sub.poly([
            [cx - 10 * sc + Math.cos(a - 0.16) * 10.5 * sc, 24 * sc + b + Math.sin(a - 0.16) * 9.2 * sc],
            [cx - 10 * sc + Math.cos(a + 0.16) * 10.5 * sc, 24 * sc + b + Math.sin(a + 0.16) * 9.2 * sc],
            [cx - 10 * sc + Math.cos(a) * 5.2 * sc, 24 * sc + b + Math.sin(a) * 4.5 * sc]
          ], '#ffffff', { shaded: false });
        }
      });
    },

    mushroom(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Cute/mystic anime fantasy Myconid Sovereign with luminous spotted cap & floating spores!
      c.ink(sub => {
        sub.poly([
          [cx - 11 * sc, 40 * sc + b], [cx + 11 * sc, 40 * sc + b],
          [cx + 15 * sc, 69 * sc], [cx + 4 * sc, 69 * sc],
          [cx, 62 * sc], [cx - 4 * sc, 69 * sc], [cx - 15 * sc, 69 * sc]
        ], s.d);
        sub.hiBitEye(cx - 8.5 * sc, 46 * sc + b, s.e, { side: 'left' });
        sub.hiBitEye(cx + 3.5 * sc, 46 * sc + b, s.e, { side: 'right' });
      });
      c.ink(sub => {
        sub.poly([
          [cx - (28 + f * 2) * sc, 36 * sc + b],
          [cx - 21 * sc, 20 * sc + b],
          [cx, 13 * sc + b],
          [cx + 21 * sc, 20 * sc + b],
          [cx + (28 + f * 2) * sc, 36 * sc + b],
          [cx, 42 * sc + b]
        ], s.p);
        sub.oval(cx - 12 * sc, 27 * sc + b, 4.8 * sc, 3.8 * sc, s.a, { shaded: false });
        sub.oval(cx + 11 * sc, 25 * sc + b, 5.2 * sc, 4.0 * sc, s.a, { shaded: false });
        sub.oval(cx, 33 * sc + b, 4.0 * sc, 3.0 * sc, s.a, { shaded: false });
      });
      c.glow(cx - 25 * sc, 17 * sc - f * 3 * sc, 5.5 * sc, '#ffffff', s.a);
      c.glow(cx + 25 * sc, 19 * sc + f * 3 * sc, 5.5 * sc, '#ffffff', s.e);
    },

    serpent(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Coiled anime basilisk / aboleth / bone naga with dorsal fin & sculpted viper head!
      c.ink(sub => {
        sub.oval(cx + 2 * sc, 60 * sc, 24 * sc, 9.5 * sc, s.d, { texture: 'scale', dither: false });
        sub.oval(cx + (f ? 4 : -2) * sc, 49 * sc, 19 * sc, 8.8 * sc, s.p, { texture: 'scale', dither: false });
        sub.curve(cx + 6 * sc, 46 * sc, cx + 13 * sc, 33 * sc, cx - 2 * sc, 24 * sc + b, 8.0 * sc, 6.0 * sc, s.p);
      });
      c.dragonHead(cx - 5 * sc, 23 * sc + b, 0.96 * sc, -1, s.p, s.d, s.a, s.e, f);
      if (f) {
        c.line(cx - 19 * sc, 26 * sc + b, cx - 27 * sc, 29 * sc + b, '#ff4757', 1.4);
        c.line(cx - 25 * sc, 28 * sc + b, cx - 30 * sc, 25 * sc + b, '#ff4757', 1.1);
      }
    },

    insect(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      // Armored chitinous anime insectoid (Rust Monster / Hook Horror / Chuul) with giant pincers!
      c.ink(sub => {
        for (let i = -1; i <= 1; i++) {
          const st = (i % 2 === f ? -3 : 3) * sc;
          sub.capsule(cx - 13 * sc, (48 + i * 7) * sc, cx - 28 * sc, (56 + i * 7) * sc + st, 2.5 * sc, 1.1 * sc, s.d);
          sub.capsule(cx + 13 * sc, (48 + i * 7) * sc, cx + 28 * sc, (56 + i * 7) * sc - st, 2.5 * sc, 1.1 * sc, s.d);
        }
        // Twin massive scythe pincers
        sub.poly([[cx - 10 * sc, 29 * sc + b], [cx - 27 * sc, 12 * sc + b - f * 3 * sc], [cx - 31 * sc, 21 * sc + b - f * 2 * sc], [cx - 15 * sc, 33 * sc + b]], s.a, { metallic: true });
        sub.poly([[cx + 10 * sc, 29 * sc + b], [cx + 27 * sc, 12 * sc + b + f * 3 * sc], [cx + 31 * sc, 21 * sc + b + f * 2 * sc], [cx + 15 * sc, 33 * sc + b]], s.a, { metallic: true });
        // Layered chitinous thorax & head
        sub.poly([[cx - 17 * sc, 38 * sc + b], [cx + 17 * sc, 38 * sc + b], [cx + 19 * sc, 58 * sc + b], [cx, 66 * sc + b], [cx - 19 * sc, 58 * sc + b]], s.p, { metallic: true });
        sub.poly([[cx - 12 * sc, 23 * sc + b], [cx + 12 * sc, 23 * sc + b], [cx + 10 * sc, 39 * sc + b], [cx - 10 * sc, 39 * sc + b]], s.d, { metallic: true });
        sub.glowEye(cx - 6 * sc, 29 * sc + b, s.e, 2.3 * sc);
        sub.glowEye(cx + 6 * sc, 29 * sc + b, s.e, 2.3 * sc);
      });
    },

    mage(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 1.5 * sc;
      const hairCol = hueShade(s.a, 0.28);
      // Back cloak + flowing back hair BEHIND robes -> Robes & sleeves -> Anime face -> Front bangs -> Hat!
      c.ink(sub => {
        sub.cape(cx + 5 * sc, 42 * sc + b, 89 * sc, 24 * sc, 46 * sc, s.d, f ? 4 : 2, s.a);
      });
      c.animeHair(cx - 1 * sc, 31 * sc + b, 1.02 * sc, hairCol, { layer: 'back', backLen: 22 });
      c.ink(sub => {
        sub.poly([[cx - 11 * sc, 44 * sc + b], [cx + 11 * sc, 44 * sc + b], [cx + 18 * sc, 87 * sc], [cx - 18 * sc, 87 * sc]], s.p);
        sub.poly([[cx - 4 * sc, 45 * sc + b], [cx + 4 * sc, 45 * sc + b], [cx + 6 * sc, 82 * sc], [cx - 6 * sc, 82 * sc]], s.a, { metallic: true });
        sub.poly([[cx - 10 * sc, 46 * sc + b], [cx - 28 * sc, 54 * sc + b], [cx - 24 * sc, 64 * sc + b], [cx - 10 * sc, 56 * sc + b]], s.p);
        sub.poly([[cx + 10 * sc, 46 * sc + b], [cx + 22 * sc, 56 * sc + b], [cx + 17 * sc, 63 * sc + b], [cx + 9 * sc, 56 * sc + b]], s.p);
      });
      c.animeHead(cx - 1 * sc, 32 * sc + b, 1.0 * sc, '#f5e2d8', { facing: -1, eye: s.e });
      c.animeHair(cx - 1 * sc, 31 * sc + b, 1.02 * sc, hairCol, { layer: 'front', sideLen: 14 });
      c.ink(sub => {
        sub.poly([
          [cx - 26 * sc, 24 * sc + b], [cx - 12 * sc, 18 * sc + b],
          [cx + 6 * sc, 5 * sc + b], [cx + 14 * sc, 18 * sc + b],
          [cx + 25 * sc, 24 * sc + b], [cx, 27 * sc + b]
        ], s.p);
        sub.line(cx - 14 * sc, 21 * sc + b, cx + 14 * sc, 21 * sc + b, s.a, 2.4);
      });
      const sx = cx - 28 * sc;
      c.glow(sx, 22 * sc - f * 4 * sc, 13 * sc, '#ffffff', s.a, s.p);
      c.ink(sub => {
        sub.capsule(sx, 28 * sc + b, sx, 85 * sc, 2.3 * sc, 2.0 * sc, s.d);
        sub.poly([
          [sx, 12 * sc - f * 4 * sc], [sx + 7 * sc, 22 * sc - f * 4 * sc],
          [sx, 31 * sc - f * 4 * sc], [sx - 7 * sc, 22 * sc - f * 4 * sc]
        ], s.a, { metallic: true });
        sub.oval(sx + 1 * sc, 56 * sc + b, 3.0 * sc, 2.8 * sc, '#f5e2d8', { dither: false });
      });
    },

    frog(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 3.5 * sc;
      c.ink(sub => {
        sub.poly([[cx - 20 * sc, 56 * sc], [cx - 9 * sc, 56 * sc], [cx - 12 * sc, 72 * sc], [cx - 23 * sc, 72 * sc]], s.d);
        sub.poly([[cx + 9 * sc, 56 * sc], [cx + 20 * sc, 56 * sc], [cx + 23 * sc, 72 * sc], [cx + 12 * sc, 72 * sc]], s.d);
        sub.poly([
          [cx - 22 * sc, 34 * sc - b], [cx + 22 * sc, 34 * sc - b],
          [cx + 20 * sc, 60 * sc - b], [cx - 20 * sc, 60 * sc - b]
        ], s.p, { texture: 'scale' });
        sub.poly([[cx - 12 * sc, 42 * sc - b], [cx + 12 * sc, 42 * sc - b], [cx + 10 * sc, 58 * sc - b], [cx - 10 * sc, 58 * sc - b]], s.a);
        sub.oval(cx - 12 * sc, 28 * sc - b, 7.2 * sc, 7.0 * sc, s.p, { dither: false });
        sub.oval(cx + 12 * sc, 28 * sc - b, 7.2 * sc, 7.0 * sc, s.p, { dither: false });
        sub.glowEye(cx - 12 * sc, 27 * sc - b, s.e, 2.5 * sc);
        sub.glowEye(cx + 12 * sc, 27 * sc - b, s.e, 2.5 * sc);
        sub.poly([[cx - 13 * sc, 39 * sc - b], [cx + 13 * sc, 39 * sc - b], [cx + 10 * sc, 43 * sc - b], [cx - 10 * sc, 43 * sc - b]], '#ffffff', { shaded: false });
      });
    },

    angel(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      const wf = (f ? 7 : -6) * sc;
      // Layered Feathered Wings -> Back silver-white hair BEHIND armor -> Valkyrie armor & arms -> Face -> Front bangs -> Halo!
      c.featherWing(cx - 6 * sc, 42 * sc + b, -1, 38 * sc, 29 * sc, s.p, s.a, wf);
      c.featherWing(cx + 6 * sc, 42 * sc + b, 1, 38 * sc, 29 * sc, s.p, s.a, wf);
      c.animeHair(cx - 1 * sc, 29 * sc + b, 1.02 * sc, '#eef2f7', { layer: 'back', backLen: 22 });
      c.ink(sub => {
        sub.poly([[cx - 10 * sc, 65 * sc], [cx - 3 * sc, 65 * sc], [cx - 5 * sc, 87 * sc], [cx - 12 * sc, 87 * sc]], s.d, { metallic: true });
        sub.poly([[cx + 3 * sc, 65 * sc], [cx + 10 * sc, 65 * sc], [cx + 12 * sc, 87 * sc], [cx + 5 * sc, 87 * sc]], s.d, { metallic: true });
        sub.cape(cx + 3 * sc, 44 * sc + b, 84 * sc, 16 * sc, 36 * sc, s.d, f ? 3 : 1, s.a);
        sub.poly([[cx - 11 * sc, 44 * sc + b], [cx + 11 * sc, 44 * sc + b], [cx + 9 * sc, 64 * sc + b], [cx - 9 * sc, 64 * sc + b]], s.d, { metallic: true });
        sub.poly([[cx - 3 * sc, 45 * sc + b], [cx + 3 * sc, 45 * sc + b], [cx + 4 * sc, 72 * sc + b], [cx - 4 * sc, 72 * sc + b]], s.a, { metallic: true });
        sub.capsule(cx - 11 * sc, 47 * sc + b, cx - 26 * sc, 59 * sc + b - f * 2 * sc, 3.0 * sc, 2.4 * sc, s.d, { metallic: true });
        sub.capsule(cx + 11 * sc, 47 * sc + b, cx + 19 * sc, 61 * sc + b, 3.0 * sc, 2.4 * sc, s.d, { metallic: true });
        sub.poly([[cx - 17 * sc, 44 * sc + b], [cx - 9 * sc, 41 * sc + b], [cx - 8 * sc, 49 * sc + b], [cx - 16 * sc, 50 * sc + b]], s.a, { metallic: true });
        sub.poly([[cx + 9 * sc, 41 * sc + b], [cx + 17 * sc, 44 * sc + b], [cx + 16 * sc, 50 * sc + b], [cx + 8 * sc, 49 * sc + b]], s.a, { metallic: true });
      });
      c.animeHead(cx - 1 * sc, 30 * sc + b, 1.0 * sc, '#f6e1d5', { facing: -1, eye: s.e, emotion: 'angry' });
      c.animeHair(cx - 1 * sc, 29 * sc + b, 1.02 * sc, '#eef2f7', { layer: 'front', sideLen: 14 });
      c.glow(cx, 13 * sc + b, 12 * sc, '#ffffff', s.a, s.p);
      c.ink(sub => { sub.oval(cx, 13 * sc + b, 10 * sc, 2.4 * sc, s.a, { metallic: true }); });
      c.glow(cx - 27 * sc, 25 * sc + b - f * 4 * sc, 13 * sc, '#ffffff', s.a, s.p);
      c.ink(sub => {
        sub.sword(cx - 27 * sc, 13 * sc + b - f * 4 * sc, 60 * sc + b - f * 4 * sc, 3.2 * sc, s.a, '#f6c967', '#3b151e', '#ffffff');
        sub.oval(cx - 27 * sc, 60 * sc + b - f * 2 * sc, 3.2 * sc, 2.8 * sc, s.a, { metallic: true });
      });
    },

    skull_lord(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.ink(sub => {
        sub.cape(cx + 2 * sc, 36 * sc + b, 73 * sc, 24 * sc, 42 * sc, s.d, f ? 4 : 2, s.a);
        sub.poly([[cx - 4 * sc, 39 * sc + b], [cx + 4 * sc, 39 * sc + b], [cx + 6 * sc, 66 * sc + b], [cx - 6 * sc, 66 * sc + b]], s.a, { metallic: true });
      });
      [[-17, 25 + f * 2], [0, 18 - f * 2], [17, 25 + f * 2]].forEach(([dx, sy]) => {
        c.animeSkull(cx + dx * sc, sy * sc, 0.72 * sc, '#ecf0f1', s.e);
      });
    }
  };

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
    const size = spec.boss ? 96 : 80;
    const h = hashStr(id);

    return renderAnimatedSprite(
      size,
      size,
      (c, f) => {
        drawer(c, f, spec);
        const cx = Math.floor(size / 2);
        if (spec.crown) {
          c.bossCrown(cx, 6 + f * 1.5, size / 96, spec.crown, spec.e, f);
        } else if (spec.elite) {
          c.glow(8, 10 + f * 3, 5, '#ffffff', spec.a);
          c.glow(size - 9, 10 - f * 3, 5, '#ffffff', spec.e);
        } else {
          const sx = 6 + (h % 9);
          const sy = 6 + ((h >> 4) % 10);
          c.glow(f ? size - 1 - sx : sx, sy + f * 2, 3.2, '#ffffff', spec.a);
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
          gameData.characters[cid].avatarSvg = getHeroEmotionSprite(cid, 'neutral');
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

  window.HIBIT_ART = { HiBitCanvas, renderAnimatedSprite, renderAnimeSprite, drawHiBitHeroBase, hueShade, makeRamp, BAYER4 };
  window.PIXEL_SPRITES = {
    EMOTIONS,
    EMOTION_META,
    MOTION_POOLS,
    ALL_MOTION_CLASSES,
    pickMotion,
    HERO_SPRITES,
    getHeroEmotionSprite,
    MONSTER_SPECS,
    generateMonsterSprite,
    applyPixelSprites
  };
  if (window.GAME_DATA) {
    applyPixelSprites(window.GAME_DATA);
  }
  if (window.STORY_ENGINE && typeof window.STORY_ENGINE.rebuildNpcSprites === 'function') {
    window.STORY_ENGINE.rebuildNpcSprites();
  }
})();
