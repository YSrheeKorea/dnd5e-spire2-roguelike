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

    // Selective Colored Outline (Sel-Out): naturally darkens & cool-shifts adjacent pixel color!
    selOut(fallbackHex = '#14111f') {
      const w = this.w, h = this.h;
      const marks = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const off = (y * w + x) * 4;
          if (this.data[off + 3] > 20) continue;
          const n =
            this.getRgb(x, y - 1) ||
            this.getRgb(x - 1, y) ||
            this.getRgb(x + 1, y) ||
            this.getRgb(x, y + 1);
          if (!n) continue;
          // Deep cool-shifted selective outline derived from interior neighbor
          const or = clamp(n[0] * 0.32);
          const og = clamp(n[1] * 0.28);
          const ob = clamp(n[2] * 0.38 + 14);
          marks.push(off, or, og, ob);
        }
      }
      for (let i = 0; i < marks.length; i += 4) {
        const off = marks[i];
        this.data[off] = marks[i + 1];
        this.data[off + 1] = marks[i + 2];
        this.data[off + 2] = marks[i + 3];
        this.data[off + 3] = 248;
      }
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
  // 1. ALL 8 HEROES — 80x80 HI-BIT NATURAL FANTASY RPG PIXEL ART (6.25x FINER!)
  // ==========================================================================
  function drawHiBitHeroBase(c, f, cfg) {
    const cx = 39;
    const bob = f ? 2 : 0;
    const skin = cfg.skin || '#f6d2b6';

    // Flowing Back Cape with natural folds
    if (cfg.cape) {
      c.cape(cx - 1, 41 + bob, 71, 24, 38, cfg.cape, f ? -3.5 : -1.2, cfg.capeTrim || cfg.trim);
    }

    // Dynamic Striding Boots & Armored Greaves
    c.plate(cx - 10, 58, 7, 11, cfg.pants || '#2d3442', { round: 1 });
    c.plate(cx + 4, 58, 7, 11, cfg.pants || '#2d3442', { round: 1 });
    c.plate(cx - 12, 66, 9, 8, cfg.boots || '#4a3525', { round: 2, metallic: !!cfg.metalBoots, trim: cfg.trim });
    c.plate(cx + 4, 66, 9, 8, cfg.boots || '#4a3525', { round: 2, metallic: !!cfg.metalBoots, trim: cfg.trim });

    // Layered Fantasy Torso Armor / Robe (22x20)
    c.plate(cx - 11, 40 + bob, 23, 20, cfg.armor, { round: 3, metallic: !!cfg.metalArmor });
    if (cfg.tunicSkirt) {
      c.cape(cx, 54 + bob, 69, 20, 26, cfg.tunicSkirt, f ? 1 : 0, cfg.trim);
    }
    // Ornate Leather Belt & Gem/Gold Buckle
    c.plate(cx - 11, 52 + bob, 23, 5, cfg.belt || '#3f2a1d', { round: 1 });
    c.plate(cx - 3, 51 + bob, 7, 6, cfg.trim || '#f6c967', { metallic: true, round: 1 });
    if (cfg.chestAccent) {
      c.plate(cx - 3, 43 + bob, 7, 7, cfg.chestAccent, { metallic: true, round: 2 });
    }

    // Layered Shoulder Pauldrons & Arms
    c.oval(cx - 14, 44 + bob, 6.2, 5.4, cfg.pauldron || cfg.armor, { metallic: !!cfg.metalArmor });
    c.oval(cx + 14, 44 + bob, 6.2, 5.4, cfg.pauldron || cfg.armor, { metallic: !!cfg.metalArmor });
    c.capsule(cx - 15, 47 + bob, cx - 18, 55 + bob, 3.2, 2.8, cfg.sleeve || cfg.armor);
    c.capsule(cx + 15, 47 + bob, cx + 18, 54 + bob - f, 3.2, 2.8, cfg.sleeve || cfg.armor);
    // Hands / Gauntlets
    c.oval(cx - 18, 56 + bob, 3.0, 2.8, cfg.glove || skin, { metallic: !!cfg.metalArmor });
    c.oval(cx + 18, 54 + bob - f, 3.0, 2.8, cfg.glove || skin, { metallic: !!cfg.metalArmor });

    // Neck Shadow + Expressive Hi-Bit Head (28x24)
    c.plate(cx - 4, 37 + bob, 9, 5, hueShade(skin, -0.22));
    c.oval(cx, 27 + bob, 14.2, 12.6, skin);
    const emo = cfg.emotion || 'neutral';
    // Subtle anime nose & chin soft highlight + emotion-reactive rosy blush
    c.px(cx, 31 + bob, hueShade(skin, -0.18));
    const blushAlpha = emo === 'happy' ? 205 : emo === 'sad' ? 85 : emo === 'angry' ? 175 : 135;
    const blushCol = emo === 'angry' ? '#ff6b6b' : emo === 'sad' ? '#a29bfe' : '#f09499';
    c.oval(cx - 9, 32 + bob, 2.4, 1.4, blushCol, { shaded: false, alpha: blushAlpha });
    c.oval(cx + 9, 32 + bob, 2.4, 1.4, blushCol, { shaded: false, alpha: blushAlpha });

    // Emotion-reactive mouth (6 distinct expressions!)
    const mouthDark = hueShade(skin, -0.45);
    if (emo === 'happy') {
      c.rect(cx - 3, 34 + bob, 7, 1, mouthDark);
      c.rect(cx - 2, 35 + bob, 5, 2, '#e66767');
      c.rect(cx - 2, 35 + bob, 5, 1, '#ffffff');
      c.px(cx - 4, 33 + bob, mouthDark);
      c.px(cx + 4, 33 + bob, mouthDark);
    } else if (emo === 'angry') {
      c.rect(cx - 3, 34 + bob, 7, 2, '#2d0b14');
      c.rect(cx - 2, 34 + bob, 5, 1, '#ffffff');
      c.px(cx - 4, 35 + bob, mouthDark);
      c.px(cx + 4, 35 + bob, mouthDark);
    } else if (emo === 'sad') {
      c.rect(cx - 2, 34 + bob, 5, 1, mouthDark);
      c.px(cx - 3, 35 + bob, mouthDark);
      c.px(cx + 3, 35 + bob, mouthDark);
    } else if (emo === 'surprised') {
      c.oval(cx, 35 + bob, 2.3, 2.2, '#4a1424', { shaded: false });
      c.oval(cx, 35.6 + bob, 1.4, 1.1, '#e66767', { shaded: false });
    } else if (emo === 'smug') {
      c.rect(cx - 3, 35 + bob, 4, 1, mouthDark);
      c.rect(cx + 1, 34 + bob, 3, 1, mouthDark);
      c.px(cx + 4, 33 + bob, mouthDark);
    } else {
      c.rect(cx - 2, 34 + bob, 5, 1, mouthDark);
    }

    // Detailed 6x7 Hi-Bit Fantasy Eyes (with 6-emotion variants!)
    if (!cfg.noEyes) {
      c.hiBitEye(cx - 10, 24 + bob, cfg.eye || '#2e86de', { emotion: emo, side: 'left' });
      c.hiBitEye(cx + 5, 24 + bob, cfg.eye || '#2e86de', { emotion: emo, side: 'right' });
    }

    if (cfg.drawHeadgear) cfg.drawHeadgear(c, cx, bob, f, emo);
    if (cfg.drawGear) cfg.drawGear(c, cx, bob, f, emo);
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
    victory:       ['mot-win-cheer',       'mot-win-salute']
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
  // 2. HI-BIT 80x80 & 96x96 MONSTER DRAWERS (ALL 82 MONSTERS 100% UNIQUE!)
  // ==========================================================================
  const MONSTER_DRAWERS = {
    beholder(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, r = c.w * 0.27;
      const stalks = [
        [-r - 8, -r - 8 - f * 3], [-r + 3, -r - 15 + f * 3], [0, -r - 17 - f * 3],
        [r - 3, -r - 15 + f * 3], [r + 8, -r - 8 - f * 3], [-r - 10, -4 + f * 3], [r + 10, -4 - f * 3]
      ];
      stalks.forEach(([dx, dy]) => {
        c.curve(cx + dx * 0.52, cy + dy * 0.52, cx + dx * 0.8, cy + dy * 0.9 - 4, cx + dx, cy + dy, 3.8, 2.2, s.p);
        c.oval(cx + dx, cy + dy, 4.4, 4.2, '#f5f6fa');
        c.glowEye(cx + dx, cy + dy, s.e, 1.9);
      });
      c.oval(cx, cy, r, r * 0.94, s.p, { texture: 'scale' });
      const er = r * 0.52;
      c.oval(cx, cy - 4, er, er * 0.92, '#f7f8fc');
      c.oval(cx, cy - 4, er * 0.66, er * 0.66, s.a);
      c.oval(cx, cy - 4, er * 0.34, er * 0.42, '#0e1018', { shaded: false });
      c.oval(cx - er * 0.3, cy - 4 - er * 0.3, er * 0.22, er * 0.18, '#ffffff', { shaded: false });
      // Jagged Fanged Maw
      c.oval(cx, cy + r * 0.52, r * 0.58, r * 0.22, '#210a16', { shaded: false });
      for (let tx = -r * 0.46; tx <= r * 0.46; tx += 5.5) {
        c.capsule(cx + tx, cy + r * 0.36, cx + tx, cy + r * 0.52 + (f ? 1.5 : 0), 1.6, 0.5, '#f5f6fa');
      }
    },

    dragon(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.55, sc = c.w / 80;
      const wf = (f ? 7 : -6) * sc;
      // Sweeping Webbed Dragon Wings
      c.curve(cx - 8 * sc, cy - 3 * sc, cx - 24 * sc, cy - 22 * sc + wf, cx - 34 * sc, cy - 12 * sc + wf, 6 * sc, 2.5 * sc, s.d);
      c.curve(cx + 8 * sc, cy - 3 * sc, cx + 24 * sc, cy - 22 * sc + wf, cx + 34 * sc, cy - 12 * sc + wf, 6 * sc, 2.5 * sc, s.d);
      c.oval(cx - 22 * sc, cy - 5 * sc + wf * 0.5, 13 * sc, 9.5 * sc, s.d);
      c.oval(cx + 22 * sc, cy - 5 * sc + wf * 0.5, 13 * sc, 9.5 * sc, s.d);
      // Curled Spiked Tail
      c.curve(cx + 12 * sc, cy + 16 * sc, cx + 26 * sc, cy + 18 * sc, cx + 32 * sc, cy + 6 * sc - f * 3, 4.2 * sc, 1.4 * sc, s.p);
      // Scaled Body & Segmented Belly
      c.oval(cx, cy + 9 * sc, 15 * sc, 16 * sc, s.p, { texture: 'scale' });
      c.oval(cx, cy + 11 * sc, 9.5 * sc, 11.5 * sc, s.a);
      c.plate(cx - 14 * sc, cy + 18 * sc, 9 * sc, 10 * sc, s.d, { round: 2 });
      c.plate(cx + 6 * sc, cy + 18 * sc, 9 * sc, 10 * sc, s.d, { round: 2 });
      // Fierce Dragon Head + Swept Horns + Glowing Breath
      c.oval(cx, cy - 14 * sc + f * 2, 15.5 * sc, 12.2 * sc, s.p, { texture: 'scale' });
      c.curve(cx - 10 * sc, cy - 22 * sc + f * 2, cx - 18 * sc, cy - 28 * sc + f * 2, cx - 22 * sc, cy - 34 * sc + f * 2, 4.2 * sc, 1.1 * sc, s.a);
      c.curve(cx + 10 * sc, cy - 22 * sc + f * 2, cx + 18 * sc, cy - 28 * sc + f * 2, cx + 22 * sc, cy - 34 * sc + f * 2, 4.2 * sc, 1.1 * sc, s.a);
      c.glowEye(cx - 6.5 * sc, cy - 15 * sc + f * 2, s.e, 2.7 * sc);
      c.glowEye(cx + 6.5 * sc, cy - 15 * sc + f * 2, s.e, 2.7 * sc);
      c.glow(cx, cy - 5 * sc + f * 2, 8 * sc, '#ffffff', s.e, s.a);
    },

    tiamat(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.63, sc = c.w / 96;
      const wf = (f ? 8 : -7) * sc;
      // Colossal Abyssal Wings
      c.oval(cx - 28 * sc, cy - 8 * sc + wf, 18 * sc, 13 * sc, '#3d1530');
      c.oval(cx + 28 * sc, cy - 8 * sc + wf, 18 * sc, 13 * sc, '#3d1530');
      // Armored Dragon Queen Body
      c.oval(cx, cy + 6 * sc, 20 * sc, 18 * sc, '#4a1936', { texture: 'scale' });
      c.oval(cx, cy + 8 * sc, 12 * sc, 13 * sc, '#f6c967', { metallic: true });
      c.plate(cx - 16 * sc, cy + 20 * sc, 11 * sc, 11 * sc, '#2d1022', { round: 2 });
      c.plate(cx + 6 * sc, cy + 20 * sc, 11 * sc, 11 * sc, '#2d1022', { round: 2 });
      // ALL 5 CHROMATIC DRAGON HEADS (Red, Blue, Green, Black, White)!
      const heads = [
        { dx: -29, dy: -22 + f * 3, col: '#ff4757', eye: '#fff200' },
        { dx: -16, dy: -34 - f * 3, col: '#2e86de', eye: '#00d2d3' },
        { dx: 0,   dy: -39 + f * 3, col: '#2ed573', eye: '#ffeaa7' },
        { dx: 16,  dy: -34 - f * 3, col: '#2f3542', eye: '#ff4757' },
        { dx: 29,  dy: -22 + f * 3, col: '#ecf0f1', eye: '#74b9ff' }
      ];
      heads.forEach(hd => {
        c.curve(cx + hd.dx * 0.3 * sc, cy - 6 * sc, cx + hd.dx * 0.72 * sc, cy + hd.dy * 0.55 * sc, cx + hd.dx * sc, cy + hd.dy * sc, 6.2 * sc, 4.2 * sc, hd.col, { texture: 'scale' });
        c.oval(cx + hd.dx * sc, cy + hd.dy * sc, 7.6 * sc, 6.4 * sc, hd.col, { texture: 'scale' });
        c.glowEye(cx + (hd.dx - 2.6) * sc, cy + hd.dy * sc, hd.eye, 1.8 * sc);
        c.glowEye(cx + (hd.dx + 2.6) * sc, cy + hd.dy * sc, hd.eye, 1.8 * sc);
      });
    },

    mindflayer(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.cape(cx, 34 * sc + b, 73 * sc, 24 * sc, 36 * sc, s.d, f ? -2 : 2, s.a);
      c.plate(cx - 17 * sc, 34 * sc + b, 35 * sc, 9 * sc, s.a, { round: 2, metallic: true });
      c.oval(cx, 24 * sc + b, 15.5 * sc, 13.5 * sc, s.p);
      c.glowEye(cx - 6.5 * sc, 23 * sc + b, s.e, 2.8 * sc);
      c.glowEye(cx + 6.5 * sc, 23 * sc + b, s.e, 2.8 * sc);
      for (let i = -3; i <= 3; i += 2) {
        const sway = (i < 0 ? -1 : 1) * (f ? 4 : -1) * sc;
        c.curve(cx + i * 2.5 * sc, 32 * sc + b, cx + i * 3 * sc + sway, 40 * sc + b, cx + i * 2.2 * sc + sway, 47 * sc + b, 3.0 * sc, 1.2 * sc, s.p);
      }
      c.glow(cx + 24 * sc, 36 * sc - f * 4 * sc, 11 * sc, '#ffffff', s.a, s.p);
      c.oval(cx + 24 * sc, 36 * sc - f * 4 * sc, 6 * sc, 6 * sc, s.a, { metallic: true });
    },

    brain(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.45 + f * 2, rx = c.w * 0.34, ry = c.h * 0.25;
      for (let lx = -rx + 6; lx <= rx - 6; lx += 9) {
        c.curve(cx + lx, cy + ry - 3, cx + lx + (f ? 4 : -4), cy + ry + 10, cx + lx - (f ? 2 : -2), cy + ry + 18, 3.2, 1.2, s.d);
      }
      c.oval(cx, cy, rx, ry, s.p);
      c.oval(cx - rx * 0.38, cy - 4, rx * 0.46, ry * 0.56, hueShade(s.p, 0.22));
      c.oval(cx + rx * 0.38, cy - 4, rx * 0.46, ry * 0.56, hueShade(s.p, 0.22));
      c.curve(cx, cy - ry + 4, cx, cy, cx, cy + ry - 4, 1.8, 1.8, s.d);
      c.curve(cx - rx + 6, cy - 2, cx - rx * 0.4, cy + 4, cx - 4, cy - 4, 1.5, 1.5, s.d);
      c.curve(cx + 4, cy + 2, cx + rx * 0.4, cy - 4, cx + rx - 6, cy + 2, 1.5, 1.5, s.d);
      c.glowEye(cx - 9, cy + 2, s.e, 3.2);
      c.glowEye(cx + 9, cy + 2, s.e, 3.2);
    },

    spider(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, sc = c.w / 80;
      for (let i = 0; i < 4; i++) {
        const yOff = (-9 + i * 7) * sc;
        const step = (i % 2 === f ? -5 : 5) * sc;
        c.curve(cx - 11 * sc, cy + yOff, cx - 26 * sc, cy + yOff - 10 * sc + step, cx - 33 * sc, cy + yOff + 10 * sc + step, 3.2 * sc, 1.3 * sc, s.d);
        c.curve(cx + 11 * sc, cy + yOff, cx + 26 * sc, cy + yOff - 10 * sc - step, cx + 33 * sc, cy + yOff + 10 * sc - step, 3.2 * sc, 1.3 * sc, s.d);
      }
      c.oval(cx, cy - 9 * sc + f * 2, 17 * sc, 14.5 * sc, s.p, { texture: 'fur' });
      c.plate(cx - 5 * sc, cy - 14 * sc + f * 2, 11 * sc, 4 * sc, s.a, { round: 1 });
      c.plate(cx - 3 * sc, cy - 9 * sc + f * 2, 7 * sc, 4 * sc, s.a, { round: 1 });
      c.oval(cx, cy + 10 * sc, 12.5 * sc, 10 * sc, s.d);
      [-7, -2.5, 2.5, 7].forEach((dx, idx) => c.glowEye(cx + dx * sc, cy + (idx === 1 || idx === 2 ? 7 : 9) * sc, s.e, 1.8 * sc));
      c.capsule(cx - 5 * sc, cy + 16 * sc, cx - 3 * sc, cy + 22 * sc, 2 * sc, 0.6 * sc, '#f5f6fa');
      c.capsule(cx + 5 * sc, cy + 16 * sc, cx + 3 * sc, cy + 22 * sc, 2 * sc, 0.6 * sc, '#f5f6fa');
    },

    slime(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.56, sc = c.w / 80;
      const sw = (f ? 4 : 0) * sc, sh = (f ? -4 : 0) * sc;
      c.plate(cx - 22 * sc - sw, cy - 20 * sc - sh, 45 * sc + sw * 2, 41 * sc + sh, s.p, { round: 6, metallic: true });
      c.oval(cx - 11 * sc - sw, cy - 11 * sc - sh, 7 * sc, 3.2 * sc, '#ffffff', { shaded: false, alpha: 210 });
      // Floating Skull & Rusty Sword inside translucent cube!
      c.oval(cx + 4 * sc, cy - 3 * sc - f * 2, 8 * sc, 7 * sc, '#f5f6fa');
      c.oval(cx + 1 * sc, cy - 3 * sc - f * 2, 2.2 * sc, 2.4 * sc, '#14141f', { shaded: false });
      c.oval(cx + 7 * sc, cy - 3 * sc - f * 2, 2.2 * sc, 2.4 * sc, '#14141f', { shaded: false });
      c.capsule(cx - 13 * sc, cy + 10 * sc, cx + 12 * sc, cy + 5 * sc, 2 * sc, 1 * sc, '#dfe6e9', { metallic: true });
    },

    mimic(c, f, s) {
      const cx = c.w / 2, cy = c.h * 0.59, sc = c.w / 80;
      c.plate(cx - 24 * sc, cy, 49 * sc, 21 * sc, s.p, { round: 3, texture: true });
      c.plate(cx - 24 * sc, cy, 49 * sc, 5 * sc, s.a, { metallic: true });
      c.plate(cx - 5 * sc, cy - 1 * sc, 11 * sc, 9 * sc, s.a, { metallic: true, round: 2 });
      if (f === 0) {
        c.plate(cx - 24 * sc, cy - 17 * sc, 49 * sc, 17 * sc, hueShade(s.p, 0.12), { round: 4 });
        c.rect(cx - 24 * sc, cy - 3 * sc, 49 * sc, 4 * sc, '#140812');
        c.glowEye(cx - 10 * sc, cy - 2 * sc, s.e, 2.5 * sc);
        c.glowEye(cx + 10 * sc, cy - 2 * sc, s.e, 2.5 * sc);
      } else {
        c.plate(cx - 26 * sc, cy - 29 * sc, 53 * sc, 14 * sc, hueShade(s.p, 0.16), { round: 4 });
        c.plate(cx - 22 * sc, cy - 15 * sc, 45 * sc, 16 * sc, '#4a0e24');
        for (let tx = -18; tx <= 18; tx += 7) {
          c.capsule(cx + tx * sc, cy - 15 * sc, cx + tx * sc, cy - 10 * sc, 2.2 * sc, 0.6 * sc, '#ffffff');
          c.capsule(cx + tx * sc, cy - 1 * sc, cx + tx * sc, cy - 6 * sc, 2.2 * sc, 0.6 * sc, '#ffffff');
        }
        c.curve(cx, cy - 5 * sc, cx + 10 * sc, cy - 10 * sc, cx + 20 * sc, cy + 4 * sc, 5.2 * sc, 2.4 * sc, s.e);
        c.glowEye(cx - 12 * sc, cy - 23 * sc, '#ffdd59', 2.4 * sc);
        c.glowEye(cx + 12 * sc, cy - 23 * sc, '#ffdd59', 2.4 * sc);
      }
    },

    goblin(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.plate(cx - 10 * sc, 58 * sc, 7 * sc, 13 * sc, s.d, { round: 2 });
      c.plate(cx + 4 * sc, 58 * sc, 7 * sc, 13 * sc, s.d, { round: 2 });
      c.plate(cx - 12 * sc, 42 * sc + b, 25 * sc, 17 * sc, s.d, { round: 3 });
      c.plate(cx - 12 * sc, 52 * sc + b, 25 * sc, 4 * sc, s.a, { metallic: true });
      // Huge Pointed Goblin Ears!
      c.curve(cx - 12 * sc, 28 * sc + b, cx - 24 * sc, 22 * sc + b - f * 3, cx - 32 * sc, 18 * sc + b - f * 3, 5.2 * sc, 1.4 * sc, s.p);
      c.curve(cx + 12 * sc, 28 * sc + b, cx + 24 * sc, 22 * sc + b - f * 3, cx + 32 * sc, 18 * sc + b - f * 3, 5.2 * sc, 1.4 * sc, s.p);
      c.oval(cx, 28 * sc + b, 15 * sc, 13 * sc, s.p);
      c.hiBitEye(cx - 10 * sc, 24 * sc + b, s.e);
      c.hiBitEye(cx + 5 * sc, 24 * sc + b, s.e);
      c.rect(cx - 5 * sc, 35 * sc + b, 11 * sc, 2 * sc, '#ffffff');
      c.capsule(cx + 20 * sc, 55 * sc + b, cx + 27 * sc, 18 * sc + b - f * 4, 2.2 * sc, 1.8 * sc, '#8d5524');
      c.sword(cx + 27 * sc, 10 * sc + b - f * 4, 22 * sc + b - f * 4, 2.5 * sc, '#dfe6e9', s.a, '#6d4c41');
    },

    brute(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.plate(cx - 15 * sc, 57 * sc, 11 * sc, 16 * sc, s.d, { round: 2 });
      c.plate(cx + 5 * sc, 57 * sc, 11 * sc, 16 * sc, s.d, { round: 2 });
      c.oval(cx, 44 * sc + b, 22 * sc, 17 * sc, s.p, { texture: 'fur' });
      c.plate(cx - 18 * sc, 50 * sc + b, 37 * sc, 6 * sc, s.d, { round: 2 });
      c.plate(cx - 5 * sc, 49 * sc + b, 11 * sc, 8 * sc, s.a, { metallic: true, round: 2 });
      c.oval(cx, 24 * sc + b, 16 * sc, 13 * sc, s.p);
      c.hiBitEye(cx - 10 * sc, 21 * sc + b, s.e);
      c.hiBitEye(cx + 5 * sc, 21 * sc + b, s.e);
      c.capsule(cx - 8 * sc, 34 * sc + b, cx - 9 * sc, 29 * sc + b, 2.2 * sc, 0.8 * sc, '#ffffff');
      c.capsule(cx + 8 * sc, 34 * sc + b, cx + 9 * sc, 29 * sc + b, 2.2 * sc, 0.8 * sc, '#ffffff');
      c.capsule(cx + 22 * sc, 52 * sc + b, cx + 30 * sc, 18 * sc - f * 4, 3.6 * sc, 4.4 * sc, '#6d4c41');
      c.oval(cx + 30 * sc, 17 * sc - f * 4, 8.5 * sc, 9.5 * sc, s.a, { metallic: true });
    },

    ettin(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      c.plate(cx - 18 * sc, 68 * sc, 14 * sc, 18 * sc, s.d, { round: 3 });
      c.plate(cx + 5 * sc, 68 * sc, 14 * sc, 18 * sc, s.d, { round: 3 });
      c.oval(cx, 54 * sc + b, 25 * sc, 20 * sc, s.p);
      c.plate(cx - 21 * sc, 60 * sc + b, 43 * sc, 7 * sc, s.a, { metallic: true });
      c.oval(cx - 14 * sc, 27 * sc + b, 12.5 * sc, 11.5 * sc, s.p);
      c.oval(cx + 14 * sc, 27 * sc - b, 12.5 * sc, 11.5 * sc, s.p);
      c.glowEye(cx - 18 * sc, 25 * sc + b, s.e, 2.4 * sc);
      c.glowEye(cx - 10 * sc, 25 * sc + b, s.e, 2.4 * sc);
      c.glowEye(cx + 10 * sc, 25 * sc - b, s.e, 2.4 * sc);
      c.glowEye(cx + 18 * sc, 25 * sc - b, s.e, 2.4 * sc);
      c.capsule(cx - 30 * sc, 56 * sc, cx - 36 * sc, 24 * sc + f * 5, 4.2 * sc, 5.2 * sc, '#784212');
      c.capsule(cx + 30 * sc, 56 * sc, cx + 36 * sc, 24 * sc - f * 5, 4.2 * sc, 5.2 * sc, '#784212');
    },

    skeleton(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.plate(cx - 8 * sc, 56 * sc, 5 * sc, 16 * sc, '#e8e8e8', { round: 1 });
      c.plate(cx + 4 * sc, 56 * sc, 5 * sc, 16 * sc, '#e8e8e8', { round: 1 });
      c.plate(cx - 10 * sc, 42 * sc + b, 21 * sc, 15 * sc, s.p, { round: 2, metallic: true });
      for (let ry = 44; ry <= 52; ry += 4) c.rect(cx - 7 * sc, ry * sc + b, 15 * sc, 2 * sc, '#f5f6fa');
      c.oval(cx, 25 * sc + b, 14.5 * sc, 12.5 * sc, '#f5f6fa');
      c.plate(cx - 7 * sc, 34 * sc + b, 15 * sc, 6 * sc, '#dcdde1', { round: 2 });
      c.oval(cx - 6 * sc, 25 * sc + b, 4.0 * sc, 4.2 * sc, '#10101a', { shaded: false });
      c.oval(cx + 6 * sc, 25 * sc + b, 4.0 * sc, 4.2 * sc, '#10101a', { shaded: false });
      c.glowEye(cx - 6 * sc, 25 * sc + b, s.e, 1.8 * sc);
      c.glowEye(cx + 6 * sc, 25 * sc + b, s.e, 1.8 * sc);
      c.plate(cx - 25 * sc, 42 * sc + b, 12 * sc, 18 * sc, s.d, { metallic: true, round: 3 });
      c.sword(cx + 22 * sc, 14 * sc + b - f * 4, 48 * sc + b - f * 4, 2.8 * sc, '#ecf0f1', s.a, '#576574');
    },

    wraith(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.cape(cx, 30 * sc + b, 72 * sc, 26 * sc, 40 * sc, s.p, f ? -4 : 4);
      c.oval(cx, 24 * sc + b, 16 * sc, 13.5 * sc, s.d);
      c.oval(cx, 26 * sc + b, 10.5 * sc, 8.8 * sc, '#090910', { shaded: false });
      c.glowEye(cx - 5.5 * sc, 25 * sc + b, s.e, 2.5 * sc);
      c.glowEye(cx + 5.5 * sc, 25 * sc + b, s.e, 2.5 * sc);
      c.curve(cx - 16 * sc, 40 * sc + b, cx - 26 * sc, 36 * sc + b, cx - 31 * sc, 32 * sc - f * 4, 3.6 * sc, 1.2 * sc, s.a);
      c.curve(cx + 16 * sc, 40 * sc + b, cx + 26 * sc, 36 * sc + b, cx + 31 * sc, 32 * sc + f * 4, 3.6 * sc, 1.2 * sc, s.a);
    },

    lich(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      c.cape(cx, 38 * sc + b, 88 * sc, 30 * sc, 48 * sc, s.p, f ? -3 : 3, s.a);
      c.plate(cx - 6 * sc, 44 * sc + b, 13 * sc, 34 * sc, s.a, { metallic: true, round: 2 });
      c.oval(cx, 29 * sc + b, 15.5 * sc, 13.5 * sc, '#ecf0f1');
      c.oval(cx - 6 * sc, 29 * sc + b, 4.2 * sc, 4.4 * sc, '#10101a', { shaded: false });
      c.oval(cx + 6 * sc, 29 * sc + b, 4.2 * sc, 4.4 * sc, '#10101a', { shaded: false });
      c.glowEye(cx - 6 * sc, 29 * sc + b, s.e, 2.2 * sc);
      c.glowEye(cx + 6 * sc, 29 * sc + b, s.e, 2.2 * sc);
      const sx = cx + 28 * sc;
      c.capsule(sx, 28 * sc + b, sx, 84 * sc, 2.6 * sc, 2.2 * sc, '#4a235a');
      c.glow(sx, 20 * sc - f * 4 * sc, 13 * sc, '#ffffff', s.e, s.a);
      c.oval(sx, 20 * sc - f * 4 * sc, 7.5 * sc, 7.5 * sc, s.e, { metallic: true });
    },

    vampire(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.cape(cx, 30 * sc + b, 73 * sc, 30 * sc, 48 * sc, s.p, f ? -4 : 4, s.a);
      c.curve(cx - 12 * sc, 34 * sc + b, cx - 22 * sc, 24 * sc + b, cx - 20 * sc, 16 * sc + b, 4.2 * sc, 1.8 * sc, s.p);
      c.curve(cx + 12 * sc, 34 * sc + b, cx + 22 * sc, 24 * sc + b, cx + 20 * sc, 16 * sc + b, 4.2 * sc, 1.8 * sc, s.p);
      c.plate(cx - 12 * sc, 37 * sc + b, 25 * sc, 28 * sc, s.d, { round: 3 });
      c.plate(cx - 3 * sc, 39 * sc + b, 7 * sc, 12 * sc, s.a, { metallic: true, round: 1 });
      c.oval(cx, 24 * sc + b, 14.5 * sc, 12.5 * sc, '#f2e8eb');
      c.hairCap(cx, 17 * sc + b, 15.2 * sc, 7.8 * sc, '#1b1b26');
      c.hiBitEye(cx - 10 * sc, 22 * sc + b, s.e);
      c.hiBitEye(cx + 5 * sc, 22 * sc + b, s.e);
      c.px(cx - 3 * sc, 31 * sc + b, '#ffffff');
      c.px(cx + 3 * sc, 31 * sc + b, '#ffffff');
    },

    demon(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      const wf = (f ? 6 : -5) * sc;
      c.oval(cx - 24 * sc, 35 * sc + wf, 14 * sc, 11.5 * sc, s.d);
      c.oval(cx + 24 * sc, 35 * sc + wf, 14 * sc, 11.5 * sc, s.d);
      c.plate(cx - 14 * sc, 57 * sc, 10 * sc, 16 * sc, s.d, { round: 2 });
      c.plate(cx + 5 * sc, 57 * sc, 10 * sc, 16 * sc, s.d, { round: 2 });
      c.oval(cx, 44 * sc + b, 19 * sc, 16 * sc, s.p);
      c.plate(cx - 14 * sc, 50 * sc + b, 29 * sc, 5 * sc, s.a, { metallic: true });
      c.oval(cx, 25 * sc + b, 15 * sc, 12.5 * sc, s.p);
      c.curve(cx - 10 * sc, 17 * sc + b, cx - 20 * sc, 12 * sc + b, cx - 24 * sc, 6 * sc + b, 4.2 * sc, 1.1 * sc, s.a);
      c.curve(cx + 10 * sc, 17 * sc + b, cx + 20 * sc, 12 * sc + b, cx + 24 * sc, 6 * sc + b, 4.2 * sc, 1.1 * sc, s.a);
      c.glowEye(cx - 6.5 * sc, 24 * sc + b, s.e, 2.7 * sc);
      c.glowEye(cx + 6.5 * sc, 24 * sc + b, s.e, 2.7 * sc);
      c.sword(cx + 25 * sc, 14 * sc + b - f * 4, 48 * sc + b - f * 4, 3.0 * sc, s.a, '#2f3640', '#1e1e2c', '#ffffff');
    },

    demogorgon(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      c.curve(cx - 18 * sc, 50 * sc, cx - 32 * sc, 42 * sc + f * 6, cx - 40 * sc, 34 * sc + f * 6, 5.2 * sc, 2.0 * sc, s.a);
      c.curve(cx + 18 * sc, 50 * sc, cx + 32 * sc, 42 * sc - f * 6, cx + 40 * sc, 34 * sc - f * 6, 5.2 * sc, 2.0 * sc, s.a);
      c.oval(cx, 56 * sc + b, 22 * sc, 20 * sc, s.p, { texture: 'scale' });
      c.plate(cx - 16 * sc, 70 * sc, 12 * sc, 16 * sc, s.d, { round: 2 });
      c.plate(cx + 5 * sc, 70 * sc, 12 * sc, 16 * sc, s.d, { round: 2 });
      c.oval(cx - 14 * sc, 27 * sc + b, 12 * sc, 11 * sc, s.p);
      c.oval(cx + 14 * sc, 27 * sc - b, 12 * sc, 11 * sc, s.p);
      c.glowEye(cx - 18 * sc, 25 * sc + b, s.e, 2.4 * sc);
      c.glowEye(cx + 18 * sc, 25 * sc - b, s.e, 2.4 * sc);
    },

    knight(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.cape(cx - 1, 36 * sc + b, 72 * sc, 26 * sc, 40 * sc, s.d, f ? -3 : 3, s.a);
      c.plate(cx - 12 * sc, 58 * sc, 9 * sc, 15 * sc, s.d, { metallic: true, round: 2 });
      c.plate(cx + 4 * sc, 58 * sc, 9 * sc, 15 * sc, s.d, { metallic: true, round: 2 });
      c.plate(cx - 14 * sc, 37 * sc + b, 29 * sc, 22 * sc, s.p, { metallic: true, round: 3 });
      c.plate(cx - 3 * sc, 40 * sc + b, 7 * sc, 14 * sc, s.a, { metallic: true, round: 1 });
      c.oval(cx, 24 * sc + b, 15 * sc, 13 * sc, s.p, { metallic: true });
      c.plate(cx - 12 * sc, 23 * sc + b, 25 * sc, 6 * sc, '#0c0d14', { round: 1 });
      c.glowEye(cx - 6 * sc, 25 * sc + b, s.e, 2.3 * sc);
      c.glowEye(cx + 6 * sc, 25 * sc + b, s.e, 2.3 * sc);
      c.curve(cx - 11 * sc, 16 * sc + b, cx - 20 * sc, 11 * sc + b, cx - 22 * sc, 5 * sc + b, 3.6 * sc, 1.0 * sc, s.a);
      c.curve(cx + 11 * sc, 16 * sc + b, cx + 20 * sc, 11 * sc + b, cx + 22 * sc, 5 * sc + b, 3.6 * sc, 1.0 * sc, s.a);
      c.sword(cx + 24 * sc, 12 * sc + b - f * 4, 48 * sc + b - f * 4, 3.2 * sc, s.a, s.p, '#1e1e2c', '#ffffff');
    },

    golem(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.plate(cx - 17 * sc, 57 * sc, 12 * sc, 17 * sc, s.d, { metallic: true, round: 2 });
      c.plate(cx + 6 * sc, 57 * sc, 12 * sc, 17 * sc, s.d, { metallic: true, round: 2 });
      c.plate(cx - 24 * sc, 34 * sc + b, 49 * sc, 26 * sc, s.p, { metallic: true, round: 4, texture: true });
      c.plate(cx - 32 * sc, 37 * sc + b, 10 * sc, 22 * sc, s.d, { metallic: true, round: 3 });
      c.plate(cx + 23 * sc, 37 * sc + b, 10 * sc, 22 * sc, s.d, { metallic: true, round: 3 });
      c.glow(cx, 45 * sc + b, 12 * sc, '#ffffff', f ? s.e : s.a, s.d);
      c.oval(cx, 45 * sc + b, 7 * sc, 7 * sc, f ? s.e : s.a);
      c.plate(cx - 14 * sc, 18 * sc + b, 29 * sc, 16 * sc, s.p, { metallic: true, round: 3 });
      c.glowEye(cx - 6.5 * sc, 25 * sc + b, s.e, 2.6 * sc);
      c.glowEye(cx + 6.5 * sc, 25 * sc + b, s.e, 2.6 * sc);
    },

    beast(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.oval(cx + 5 * sc, 48 * sc + b, 20 * sc, 14 * sc, s.p, { texture: 'fur' });
      c.oval(cx + 5 * sc, 50 * sc + b, 13 * sc, 9 * sc, s.a);
      c.plate(cx - 12 * sc, 56 * sc - f * 2, 7 * sc, 14 * sc, s.d, { round: 2 });
      c.plate(cx + 16 * sc, 56 * sc + f * 2, 7 * sc, 14 * sc, s.d, { round: 2 });
      c.curve(cx + 22 * sc, 42 * sc + b, cx + 30 * sc, 34 * sc, cx + 34 * sc, 26 * sc - f * 4, 3.6 * sc, 1.4 * sc, s.a);
      c.oval(cx - 11 * sc, 33 * sc + b, 14.5 * sc, 13 * sc, s.p, { texture: 'fur' });
      c.capsule(cx - 21 * sc, 23 * sc + b, cx - 24 * sc, 12 * sc + b, 3.6 * sc, 1.2 * sc, s.d);
      c.capsule(cx - 3 * sc, 23 * sc + b, cx - 1 * sc, 12 * sc + b, 3.6 * sc, 1.2 * sc, s.d);
      c.hiBitEye(cx - 21 * sc, 29 * sc + b, s.e);
      c.hiBitEye(cx - 9 * sc, 29 * sc + b, s.e);
      c.oval(cx - 13 * sc, 38 * sc + b, 4.5 * sc, 3.2 * sc, s.a);
    },

    worm(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.oval(cx + 12 * sc, 58 * sc, 17 * sc, 12 * sc, s.d, { texture: 'scale' });
      c.oval(cx + 3 * sc, 49 * sc + b, 18.5 * sc, 13 * sc, s.p, { texture: 'scale' });
      c.oval(cx - 5 * sc, 38 * sc + b, 18.5 * sc, 14 * sc, s.p, { texture: 'scale' });
      c.oval(cx - 7 * sc, 25 * sc + b, 17.5 * sc, 15 * sc, s.p, { texture: 'scale' });
      c.oval(cx - 7 * sc, 25 * sc + b, 11 * sc, 9.5 * sc, '#2b0916', { shaded: false });
      for (let ang = 0; ang < 10; ang++) {
        const a = (Math.PI * 2 * ang) / 10 + (f ? 0.2 : 0);
        c.capsule(cx - 7 * sc + Math.cos(a) * 11 * sc, 25 * sc + b + Math.sin(a) * 9.5 * sc, cx - 7 * sc + Math.cos(a) * 6 * sc, 25 * sc + b + Math.sin(a) * 5 * sc, 1.8 * sc, 0.5 * sc, '#ffffff');
      }
    },

    mushroom(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.oval(cx, 53 * sc + b, 13 * sc, 16 * sc, s.d);
      c.hiBitEye(cx - 9 * sc, 47 * sc + b, s.e);
      c.hiBitEye(cx + 4 * sc, 47 * sc + b, s.e);
      c.oval(cx, 30 * sc + b, (26 + f * 2) * sc, 14.5 * sc, s.p);
      c.oval(cx - 12 * sc, 27 * sc + b, 5.2 * sc, 4.4 * sc, s.a);
      c.oval(cx + 10 * sc, 25 * sc + b, 5.8 * sc, 4.6 * sc, s.a);
      c.oval(cx, 32 * sc + b, 4.4 * sc, 3.6 * sc, s.a);
      c.glow(cx - 24 * sc, 18 * sc - f * 3, 5 * sc, '#ffffff', s.a);
      c.glow(cx + 24 * sc, 20 * sc + f * 3, 5 * sc, '#ffffff', s.e);
    },

    serpent(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.oval(cx, 59 * sc, 25 * sc, 10.5 * sc, s.d, { texture: 'scale' });
      c.oval(cx + (f ? 3 : -3) * sc, 48 * sc, 20 * sc, 9.5 * sc, s.p, { texture: 'scale' });
      c.curve(cx + 5 * sc, 45 * sc, cx + 10 * sc, 34 * sc, cx - 2 * sc, 26 * sc + b, 8.5 * sc, 6.5 * sc, s.p, { texture: 'scale' });
      c.oval(cx - 2 * sc, 24 * sc + b, 15.5 * sc, 12 * sc, s.p, { texture: 'scale' });
      c.glowEye(cx - 8.5 * sc, 23 * sc + b, s.e, 2.5 * sc);
      c.glowEye(cx + 4.5 * sc, 23 * sc + b, s.e, 2.5 * sc);
      if (f) {
        c.capsule(cx - 2 * sc, 34 * sc, cx - 5 * sc, 42 * sc, 1.1 * sc, 0.5 * sc, '#ff4757');
        c.capsule(cx - 2 * sc, 34 * sc, cx + 1 * sc, 42 * sc, 1.1 * sc, 0.5 * sc, '#ff4757');
      }
    },

    insect(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.curve(cx - 12 * sc, 27 * sc + b, cx - 20 * sc, 18 * sc + b, cx - 26 * sc, 12 * sc + b - f * 3, 3.2 * sc, 1.0 * sc, s.a);
      c.curve(cx + 12 * sc, 27 * sc + b, cx + 20 * sc, 18 * sc + b, cx + 26 * sc, 12 * sc + b + f * 3, 3.2 * sc, 1.0 * sc, s.a);
      for (let i = -1; i <= 1; i++) {
        c.curve(cx - 14 * sc, (48 + i * 8) * sc, cx - 24 * sc, (46 + i * 8) * sc, cx - 30 * sc, (56 + i * 8 + (i % 2 === f ? -3 : 3)) * sc, 2.8 * sc, 1.2 * sc, s.d);
        c.curve(cx + 14 * sc, (48 + i * 8) * sc, cx + 24 * sc, (46 + i * 8) * sc, cx + 30 * sc, (56 + i * 8 - (i % 2 === f ? -3 : 3)) * sc, 2.8 * sc, 1.2 * sc, s.d);
      }
      c.oval(cx, 48 * sc + b, 18 * sc, 15.5 * sc, s.p, { texture: 'scale', metallic: true });
      c.oval(cx, 30 * sc + b, 13 * sc, 10.5 * sc, s.d, { metallic: true });
      c.glowEye(cx - 6 * sc, 28 * sc + b, s.e, 2.3 * sc);
      c.glowEye(cx + 6 * sc, 28 * sc + b, s.e, 2.3 * sc);
    },

    mage(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      c.cape(cx, 42 * sc + b, 88 * sc, 28 * sc, 46 * sc, s.p, f ? -3 : 3, s.a);
      c.plate(cx - 6 * sc, 46 * sc + b, 13 * sc, 30 * sc, s.a, { metallic: true, round: 2 });
      c.oval(cx, 32 * sc + b, 14.5 * sc, 12.5 * sc, '#f0d8c8');
      c.oval(cx, 22 * sc + b, 23 * sc, 5.2 * sc, s.d);
      c.curve(cx - 12 * sc, 21 * sc + b, cx, 10 * sc + b, cx + 6 * sc, 5 * sc + b, 9.5 * sc, 1.8 * sc, s.p);
      c.hiBitEye(cx - 10 * sc, 29 * sc + b, s.e);
      c.hiBitEye(cx + 5 * sc, 29 * sc + b, s.e);
      const sx = cx + 27 * sc;
      c.capsule(sx, 29 * sc + b, sx, 84 * sc, 2.6 * sc, 2.2 * sc, s.d);
      c.glow(sx, 22 * sc - f * 4 * sc, 12 * sc, '#ffffff', s.a, s.p);
      c.oval(sx, 22 * sc - f * 4 * sc, 6.8 * sc, 6.8 * sc, s.a, { metallic: true });
    },

    frog(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 4 * sc;
      c.plate(cx - 19 * sc, 57 * sc, 12 * sc, 13 * sc, s.d, { round: 3 });
      c.plate(cx + 8 * sc, 57 * sc, 12 * sc, 13 * sc, s.d, { round: 3 });
      c.oval(cx, 48 * sc - b, 23 * sc, 17 * sc, s.p, { texture: 'scale' });
      c.oval(cx, 50 * sc - b, 14.5 * sc, 11 * sc, s.a);
      c.oval(cx - 12 * sc, 28 * sc - b, 7.6 * sc, 7.6 * sc, s.p);
      c.oval(cx + 12 * sc, 28 * sc - b, 7.6 * sc, 7.6 * sc, s.p);
      c.glowEye(cx - 12 * sc, 27 * sc - b, s.e, 2.6 * sc);
      c.glowEye(cx + 12 * sc, 27 * sc - b, s.e, 2.6 * sc);
      c.plate(cx - 12 * sc, 40 * sc - b, 25 * sc, 4 * sc, '#ffffff', { round: 1 });
    },

    angel(c, f, s) {
      const cx = c.w / 2, sc = c.w / 96, b = f * 2 * sc;
      const wf = (f ? 8 : -6) * sc;
      // Blazing Feathered Angel Wings
      c.oval(cx - 28 * sc, 40 * sc + wf, 18 * sc, 14 * sc, s.p);
      c.oval(cx + 28 * sc, 40 * sc + wf, 18 * sc, 14 * sc, s.p);
      c.cape(cx, 46 * sc + b, 86 * sc, 22 * sc, 32 * sc, s.p, f ? -2 : 2, s.a);
      c.plate(cx - 12 * sc, 46 * sc + b, 25 * sc, 24 * sc, s.d, { metallic: true, round: 3 });
      c.plate(cx - 3 * sc, 48 * sc + b, 7 * sc, 28 * sc, s.a, { metallic: true });
      c.glow(cx, 12 * sc + b, 13 * sc, '#ffffff', s.a, s.p);
      c.oval(cx, 12 * sc + b, 12 * sc, 2.8 * sc, s.a, { metallic: true });
      c.oval(cx, 28 * sc + b, 14 * sc, 12 * sc, '#f5e1d3');
      c.hiBitEye(cx - 10 * sc, 26 * sc + b, s.e);
      c.hiBitEye(cx + 5 * sc, 26 * sc + b, s.e);
      c.sword(cx + 26 * sc, 14 * sc + b - f * 4, 62 * sc + b - f * 4, 3.6 * sc, s.a, '#f6c967', '#3b151e', '#ffffff');
    },

    skull_lord(c, f, s) {
      const cx = c.w / 2, sc = c.w / 80, b = f * 2 * sc;
      c.cape(cx, 36 * sc + b, 72 * sc, 26 * sc, 42 * sc, s.d, f ? -3 : 3, s.a);
      c.plate(cx - 5 * sc, 40 * sc + b, 11 * sc, 25 * sc, s.a, { metallic: true });
      [[-17, 25 + f * 2], [0, 19 - f * 2], [17, 25 + f * 2]].forEach(([dx, sy]) => {
        c.oval(cx + dx * sc, sy * sc, 9.2 * sc, 8.2 * sc, '#ecf0f1');
        c.glowEye(cx + (dx - 3) * sc, sy * sc, s.e, 1.8 * sc);
        c.glowEye(cx + (dx + 3) * sc, sy * sc, s.e, 1.8 * sc);
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
          c.plate(cx - 12, 4 + f * 2, 25, 5, spec.crown, { metallic: true, round: 1 });
          c.plate(cx - 12, 1 + f * 2, 5, 5, spec.crown, { metallic: true });
          c.plate(cx - 3, 0 + f * 2, 7, 6, f ? '#ffffff' : spec.crown, { metallic: true });
          c.plate(cx + 8, 1 + f * 2, 5, 5, spec.crown, { metallic: true });
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
