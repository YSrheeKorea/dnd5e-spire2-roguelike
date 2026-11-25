// ============================================================================
// D&D 5E SPIRE II v2.0 — HI-BIT NATURAL PIXEL-ART BACKGROUND ENGINE (backgrounds.js)
// - 384x216 Crisp 16:9 Hi-Bit Pixel-Art Environments (82,944 px = 5.76x finer than v1!)
// - 1 Bespoke Lobby Scene (Waterdeep Yawning Portal Tavern & Undermountain Well)
// - 20 Bespoke Boss-Themed Spire Scenes (5 Acts x 4 Act Bosses = 100% Unique!)
// - Hue-Shifted Masonry/Foliage/Atmosphere + Fine Bayer Dithering + Volumetric Light Shafts
// ============================================================================
(function () {
  const LW = 160;
  const LH = 90;
  const SCALE = 2.4; // 160x90 logical -> 384x216 native Hi-Bit (5.76x pixel area!)
  const W = Math.round(LW * SCALE); // 384
  const H = Math.round(LH * SCALE); // 216

  // Ordered 4x4 Bayer matrix for authentic Hi-Bit pixel-art dithering gradients
  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function hash2d(x, y, seed = 1337) {
    let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function hexToRgb(hex) {
    const h = (hex || '#080a12').replace('#', '');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }
  function rgbToHex(r, g, b) {
    const cl = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [cl(r), cl(g), cl(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function mixHex(c1, c2, t) {
    const a = hexToRgb(c1), b = hexToRgb(c2);
    return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }
  function hueShade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    if (amt >= 0) {
      return rgbToHex(r + (255 - r) * amt * 1.04, g + (246 - g) * amt * 0.95, b + (220 - b) * amt * 0.78);
    }
    const f = 1 + amt, cool = -amt;
    return rgbToHex(r * f * (1 - cool * 0.14), g * f * (1 - cool * 0.15), b * f + 20 * cool * (1 - b / 340));
  }

  // Native 384x216 Hi-Bit Pixel Background Rasterizer (accepts 160x90 scene coords seamlessly!)
  class PixelBgCanvas {
    constructor(w = W, h = H) {
      this.w = w;
      this.h = h;
      this.lw = LW;
      this.lh = LH;
      this.buf = new Array(w * h).fill('#080a12');
    }
    rawPx(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix < 0 || ix >= this.w || iy < 0 || iy >= this.h || !c) return;
      this.buf[iy * this.w + ix] = c;
    }
    px(x, y, c) {
      const sx = Math.round(x * SCALE), sy = Math.round(y * SCALE);
      this.rawPx(sx, sy, c);
      this.rawPx(sx + 1, sy, c);
      this.rawPx(sx, sy + 1, hueShade(c, -0.1));
      this.rawPx(sx + 1, sy + 1, hueShade(c, -0.15));
    }
    rect(x, y, w, h, c) {
      const x0 = Math.max(0, Math.round(x * SCALE)), y0 = Math.max(0, Math.round(y * SCALE));
      const x1 = Math.min(this.w, Math.max(x0 + 1, Math.round((x + w) * SCALE)));
      const y1 = Math.min(this.h, Math.max(y0 + 1, Math.round((y + h) * SCALE)));
      const hi = hueShade(c, 0.1), lo = hueShade(c, -0.12);
      const textured = (x1 - x0 >= 8 && y1 - y0 >= 8);
      for (let yy = y0; yy < y1; yy++) {
        const off = yy * this.w;
        for (let xx = x0; xx < x1; xx++) {
          let col = c;
          if (textured) {
            const n = hash2d(xx >> 1, yy >> 1, 53);
            if (n > 0.91) col = hi;
            else if (n < 0.08) col = lo;
          }
          this.buf[off + xx] = col;
        }
      }
    }
    // Smooth 384x216 Bayer-dithered multi-stop atmospheric sky/cavern gradient!
    ditherGradY(y0, y1, palette) {
      const top = Math.max(0, Math.round(y0 * SCALE));
      const bot = Math.min(this.h, Math.round(y1 * SCALE));
      const span = Math.max(1, bot - top);
      const stops = palette.length - 1;
      for (let y = top; y < bot; y++) {
        const t = ((y - top) / span) * stops;
        const idx = Math.min(stops - 1, Math.floor(t));
        const frac = t - idx;
        const cA = palette[idx], cB = palette[idx + 1];
        const cM = mixHex(cA, cB, 0.5);
        const off = y * this.w;
        for (let x = 0; x < this.w; x++) {
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          if (frac < 0.5) {
            this.buf[off + x] = (frac * 2) > thr ? cM : cA;
          } else {
            this.buf[off + x] = ((frac - 0.5) * 2) > thr ? cB : cM;
          }
        }
      }
    }
    // Multi-band volumetric radial pixel glow at native 384x216!
    glow(cx, cy, r, coreCol, midCol, outerCol) {
      const scx = cx * SCALE, scy = cy * SCALE, sr = r * SCALE;
      const coreMid = mixHex(coreCol, midCol, 0.45);
      const x0 = Math.max(0, Math.floor(scx - sr)), x1 = Math.min(this.w - 1, Math.ceil(scx + sr));
      const y0 = Math.max(0, Math.floor(scy - sr)), y1 = Math.min(this.h - 1, Math.ceil(scy + sr));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x - scx, y - scy) / sr;
          if (d >= 1) continue;
          const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
          if (d < 0.22) {
            this.rawPx(x, y, coreCol);
          } else if (d < 0.44) {
            if ((0.44 - d) / 0.22 > thr * 0.72) this.rawPx(x, y, coreMid);
          } else if (d < 0.72) {
            if ((0.72 - d) / 0.28 > thr * 0.8) this.rawPx(x, y, midCol);
          } else if (outerCol) {
            if ((1 - d) / 0.28 > thr) this.rawPx(x, y, outerCol);
          }
        }
      }
    }
    // Smooth 3D-shaded 384x216 organic ellipse!
    oval(cx, cy, rx, ry, c) {
      const scx = cx * SCALE, scy = cy * SCALE;
      const srx = Math.max(1.2, rx * SCALE), sry = Math.max(1.2, ry * SCALE);
      const hi = hueShade(c, 0.22), lo = hueShade(c, -0.22);
      const x0 = Math.max(0, Math.floor(scx - srx)), x1 = Math.min(this.w - 1, Math.ceil(scx + srx));
      const y0 = Math.max(0, Math.floor(scy - sry)), y1 = Math.min(this.h - 1, Math.ceil(scy + sry));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const nx = (x - scx) / srx, ny = (y - scy) / sry;
          const r2 = nx * nx + ny * ny;
          if (r2 > 1) continue;
          const thr = (BAYER4[y & 3][x & 3] - 7.5) / 30;
          const v = -nx * 0.4 - ny * 0.55 + thr;
          this.rawPx(x, y, v > 0.36 ? hi : v < -0.34 ? lo : c);
        }
      }
    }
    line(x0, y0, x1, y1, c, thick = 1) {
      const sx0 = x0 * SCALE, sy0 = y0 * SCALE, sx1 = x1 * SCALE, sy1 = y1 * SCALE;
      const r = Math.max(0.75, thick * SCALE * 0.36);
      const hi = hueShade(c, 0.24), lo = hueShade(c, -0.2);
      const steps = Math.max(4, Math.ceil(Math.hypot(sx1 - sx0, sy1 - sy0) * 1.3));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = sx0 + (sx1 - sx0) * t, cy = sy0 + (sy1 - sy0) * t;
        if (r <= 0.9) {
          this.rawPx(cx, cy, c);
        } else {
          for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) {
            for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
              if (dx * dx + dy * dy <= r * r) {
                this.rawPx(cx + dx, cy + dy, dx + dy < -r * 0.4 ? hi : dx + dy > r * 0.5 ? lo : c);
              }
            }
          }
        }
      }
    }
    // Fine 384x216 weathered stone brick masonry with varied stone blocks, bevels & cracks!
    brickWall(x, y, w, h, base, mortar, hi, seed = 1) {
      const sx = Math.max(0, Math.round(x * SCALE)), sy = Math.max(0, Math.round(y * SCALE));
      const ex = Math.min(this.w, Math.round((x + w) * SCALE)), ey = Math.min(this.h, Math.round((y + h) * SCALE));
      const bh = 9, bw = 20;
      const lo = hueShade(base, -0.18), alt = hueShade(base, 0.08);
      for (let yy = sy; yy < ey; yy++) {
        const row = Math.floor((yy - sy) / bh);
        const ry = (yy - sy) % bh;
        const shift = (row & 1) ? Math.floor(bw / 2) : 0;
        const off = yy * this.w;
        for (let xx = sx; xx < ex; xx++) {
          const bx = (xx - sx + shift) % bw;
          const colIdx = Math.floor((xx - sx + shift) / bw);
          if (ry === 0 || bx === 0) {
            this.buf[off + xx] = mortar;
            continue;
          }
          const hBrick = hash2d(colIdx, row, seed);
          let c = hBrick > 0.68 ? alt : hBrick < 0.25 ? lo : base;
          if (ry === 1 && bx > 1 && bx < bw - 1 && hBrick > 0.35) c = hi;
          else if (ry === bh - 1) c = lo;
          else if (hash2d(xx, yy, seed + 19) > 0.94) c = lo;
          this.buf[off + xx] = c;
        }
      }
    }
    // Deep perspective 384x216 dungeon flagstones with specular sheen & scattered dust!
    floorTiles(yStart, c1, c2, mortar, accent = null, seed = 7) {
      this.ditherGradY(yStart, LH, [c1, c2]);
      const sy = Math.max(0, Math.round(yStart * SCALE));
      const hi = hueShade(c1, 0.16);
      const rowLines = [0, 7, 16, 28, 44, 64, 88];
      for (let y = sy; y < this.h; y++) {
        const dy = y - sy;
        const depth = dy / Math.max(1, this.h - sy);
        const isRow = rowLines.includes(dy);
        const isHiRow = rowLines.includes(dy - 1);
        const spacing = Math.max(14, Math.round(24 + depth * 46));
        const off = y * this.w;
        for (let x = 0; x < this.w; x++) {
          if (isRow) {
            this.buf[off + x] = mortar;
            continue;
          }
          const rel = Math.abs(x - this.w / 2);
          if (Math.round(rel) % spacing === 0 && dy > 0) {
            this.buf[off + x] = mortar;
          } else if (isHiRow && hash2d(x >> 1, y, seed) > 0.45) {
            this.buf[off + x] = hi;
          } else if (accent && hash2d(x, y, seed) > 0.985) {
            this.buf[off + x] = accent;
          }
        }
      }
    }
    // Fluted 384x216 Gothic stone pillar with 5-tone cylindrical shading & ornate capital
    pillar(x, yTop, yBot, w, dark, mid, hi) {
      const sx = Math.round(x * SCALE), sy = Math.round(yTop * SCALE), ey = Math.round(yBot * SCALE);
      const sw = Math.max(6, Math.round(w * SCALE));
      const spec = hueShade(hi, 0.28), deep = hueShade(dark, -0.25);
      for (let yy = sy; yy < ey; yy++) {
        for (let dx = 0; dx < sw; dx++) {
          const u = dx / Math.max(1, sw - 1);
          const flute = Math.sin(u * Math.PI * 3) * 0.16;
          const v = (1 - u * 2) * 0.5 + flute;
          let c = mid;
          if (dx === 0 || v > 0.42) c = hi;
          else if (dx === 1 && yy % 3 !== 0) c = spec;
          else if (dx === sw - 1 || v < -0.42) c = deep;
          else if (v < -0.12) c = dark;
          if (hash2d(sx + dx, yy, 41) > 0.96) c = dark;
          this.rawPx(sx + dx, yy, c);
        }
      }
      // Ornate Capital & Pedestal Base
      for (let dy = 0; dy < 7; dy++) {
        const pad = dy < 3 ? 5 : 2;
        const c = dy === 0 ? spec : dy < 3 ? hi : dy === 3 ? mid : dark;
        for (let xx = sx - pad; xx < sx + sw + pad; xx++) this.rawPx(xx, sy + dy, c);
      }
      for (let dy = 0; dy < 7; dy++) {
        const pad = dy > 3 ? 5 : 2;
        const c = dy === 0 ? hi : dy < 3 ? mid : dark;
        for (let xx = sx - pad; xx < sx + sw + pad; xx++) this.rawPx(xx, ey - 7 + dy, c);
      }
    }
    // Crisp 384x216 Gothic archway cutout with beveled stone voussoirs
    arch(cx, yTop, yBot, rx, wallCol, trimCol) {
      const scx = cx * SCALE, syTop = Math.round(yTop * SCALE), syBot = Math.round(yBot * SCALE);
      const srx = rx * SCALE, pad = Math.round(3 * SCALE), bPad = Math.round(2 * SCALE);
      const trimHi = hueShade(trimCol, 0.25);
      for (let y = syTop; y <= syBot; y++) {
        for (let x = Math.floor(scx - srx - pad); x <= Math.ceil(scx + srx + pad); x++) {
          const dy = y - (syTop + srx);
          const dist2 = (x - scx) * (x - scx) + dy * dy;
          const inArch = dy >= 0 ? Math.abs(x - scx) <= srx : dist2 <= srx * srx;
          if (!inArch && y >= syTop && Math.abs(x - scx) <= srx + pad) {
            const border = dy >= 0 ? Math.abs(x - scx) <= srx + bPad : dist2 <= (srx + bPad) * (srx + bPad);
            const innerRim = dy >= 0 ? Math.abs(x - scx) <= srx + 1.5 : dist2 <= (srx + 1.5) * (srx + 1.5);
            this.rawPx(x, y, innerRim ? trimHi : border ? trimCol : wallCol);
          }
        }
      }
    }
    // Organic ridged 384x216 cavern stalactites / stalagmites
    stalactites(yBase, count, maxLen, col, hi, seed = 42, flip = false) {
      const syBase = Math.round(yBase * SCALE);
      const lo = hueShade(col, -0.28);
      for (let i = 0; i < count; i++) {
        const cx = Math.floor((i + 0.5) * (this.w / count) + (hash2d(i, 1, seed) - 0.5) * 24);
        const len = Math.floor((6 + hash2d(i, 2, seed) * maxLen) * SCALE);
        const halfW = Math.max(4, Math.floor(len * 0.34));
        for (let s = 0; s < len; s++) {
          const t = s / len;
          const jitter = Math.sin(s * 0.45 + i) * 1.1;
          const curW = Math.max(1, Math.round(halfW * Math.pow(1 - t, 1.15) + jitter));
          const yy = flip ? syBase - s : syBase + s;
          for (let dx = -curW; dx <= curW; dx++) {
            let c = col;
            if (dx <= -curW + 1) c = hi;
            else if (dx >= curW - 1) c = lo;
            else if (hash2d(cx + dx, yy, seed) > 0.92) c = lo;
            this.rawPx(cx + dx, yy, c);
          }
        }
      }
    }
    // Atmospheric 384x216 wall torch with teardrop flame, lantern sconce & floating embers!
    torch(x, y, flameCore = '#fff7cc', flameMid = '#ff9f43', glowCol = '#b33939') {
      this.glow(x, y - 2, 16, flameCore, flameMid, glowCol);
      const sx = Math.round(x * SCALE), sy = Math.round(y * SCALE);
      // Iron wall bracket + wooden torch handle
      for (let dy = 0; dy < 11; dy++) {
        for (let dx = -2; dx <= 2; dx++) this.rawPx(sx + dx, sy + dy, dx < 0 ? '#6e4c36' : '#3d281a');
      }
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) this.rawPx(sx + dx, sy + dy, dy === 0 ? '#b2bec3' : '#576574');
      }
      // Teardrop multi-layered flame
      for (let dy = -10; dy <= 0; dy++) {
        const w = Math.max(1, Math.round((1 - Math.abs(dy + 3) / 8) * 3.5));
        for (let dx = -w; dx <= w; dx++) {
          const d = Math.hypot(dx / Math.max(1, w), (dy + 3) / 6);
          this.rawPx(sx + dx, sy + dy, d < 0.45 ? flameCore : d < 0.85 ? flameMid : glowCol);
        }
      }
      // Rising pin-prick embers
      this.rawPx(sx - 2, sy - 14, flameCore);
      this.rawPx(sx + 3, sy - 18, flameMid);
      this.rawPx(sx - 1, sy - 23, flameCore);
    }
    // Pinpoint 1px 384x216 starfield with cross-glint twinkle!
    stars(yMax, count, colors, seed = 99) {
      const syMax = Math.round(yMax * SCALE);
      const total = Math.round(count * 1.8);
      for (let i = 0; i < total; i++) {
        const x = Math.floor(hash2d(i, 11, seed) * this.w);
        const y = Math.floor(hash2d(i, 23, seed) * syMax);
        const c = colors[i % colors.length];
        this.rawPx(x, y, c);
        if (i % 7 === 0) {
          const dim = mixHex(c, '#0b0e17', 0.55);
          this.rawPx(x - 1, y, dim); this.rawPx(x + 1, y, dim);
          this.rawPx(x, y - 1, dim); this.rawPx(x, y + 1, dim);
        }
      }
    }
    // Ultra-fine 1px 384x216 hanging dungeon iron chains
    chain(x, y0, y1, col = '#535c68', hi = '#95a5a6') {
      const sx = Math.round(x * SCALE), sy0 = Math.round(y0 * SCALE), sy1 = Math.round(y1 * SCALE);
      for (let y = sy0; y < sy1; y++) {
        const m = y % 6;
        if (m === 0 || m === 1) { this.rawPx(sx, y, hi); }
        else if (m === 3 || m === 4) { this.rawPx(sx - 1, y, hi); this.rawPx(sx + 1, y, col); }
        else { this.rawPx(sx, y, col); }
      }
    }
    // Gossamer 1px 384x216 spiderweb corner
    cobweb(x0, y0, dirX, dirY, radius, col = '#dfe6e9') {
      const rays = 6;
      for (let r = 0; r < rays; r++) {
        const ang = (Math.PI * 0.5 * r) / (rays - 1);
        this.line(x0, y0, x0 + Math.cos(ang) * radius * dirX, y0 + Math.sin(ang) * radius * dirY, col, 0.5);
      }
      for (let ring = 5; ring < radius; ring += 5) {
        for (let r = 0; r < rays - 1; r++) {
          const a1 = (Math.PI * 0.5 * r) / (rays - 1);
          const a2 = (Math.PI * 0.5 * (r + 1)) / (rays - 1);
          this.line(
            x0 + Math.cos(a1) * ring * dirX, y0 + Math.sin(a1) * ring * dirY,
            x0 + Math.cos(a2) * ring * dirX, y0 + Math.sin(a2) * ring * dirY,
            col, 0.45
          );
        }
      }
    }
    // Subtle 384x216 Cinematic Atmosphere Pass (floating dust motes + soft vignette!)
    addAtmosphere(accent = '#f6c967', seed = 77) {
      const moteHi = mixHex(accent, '#ffffff', 0.45);
      for (let i = 0; i < 36; i++) {
        const mx = Math.floor(hash2d(i, 3, seed) * this.w);
        const my = Math.floor(hash2d(i, 9, seed) * (this.h * 0.85));
        this.rawPx(mx, my, i % 3 === 0 ? moteHi : accent);
      }
      // Subtle Bayer-dithered dark atmospheric corner vignette for readability
      for (let y = 0; y < this.h; y++) {
        const ny = (y / (this.h - 1)) * 2 - 1;
        for (let x = 0; x < this.w; x++) {
          const nx = (x / (this.w - 1)) * 2 - 1;
          const edge = Math.hypot(nx * 0.88, ny * 0.92);
          if (edge > 0.98) {
            const thr = (BAYER4[y & 3][x & 3] + 0.5) / 16;
            if ((edge - 0.98) * 1.9 > thr) {
              this.buf[y * this.w + x] = hueShade(this.buf[y * this.w + x], -0.32);
            }
          }
        }
      }
    }
    // Export to crisp PNG data URL (in browser)
    toDataURL() {
      if (typeof document === 'undefined') return '';
      const canvas = document.createElement('canvas');
      canvas.width = this.w;
      canvas.height = this.h;
      const ctx = canvas.getContext('2d');
      const img = ctx.createImageData(this.w, this.h);
      const data = img.data;
      const rgbCache = {};
      for (let i = 0; i < this.buf.length; i++) {
        const hex = this.buf[i];
        let rgb = rgbCache[hex];
        if (!rgb) {
          rgb = hexToRgb(hex);
          rgbCache[hex] = rgb;
        }
        const o = i * 4;
        data[o] = rgb[0];
        data[o + 1] = rgb[1];
        data[o + 2] = rgb[2];
        data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      return canvas.toDataURL('image/png');
    }
    // Deterministic hash for headless Node uniqueness audit
    fingerprint() {
      let h = 2166136261;
      const colors = new Set();
      for (let i = 0; i < this.buf.length; i++) {
        const s = this.buf[i];
        colors.add(s);
        for (let j = 1; j < s.length; j++) {
          h ^= s.charCodeAt(j);
          h = Math.imul(h, 16777619);
        }
      }
      return { hash: (h >>> 0).toString(16), uniqueColors: colors.size };
    }
  }

  // ==========================================================================
  // ALL 21 BESPOKE PIXEL-ART SCENES (1 LOBBY + 5 ACTS x 4 BOSSES)
  // ==========================================================================
  const SCENES = {
    // 0. LOBBY: Waterdeep "Yawning Portal" Tavern & Undermountain Well
    lobby: {
      title: '워터딥 "하품하는 포털" 주점 로비',
      accent: '#f6c967',
      draw(g) {
        // Warm candlelit timber tavern interior
        g.brickWall(0, 0, W, 62, '#2b1e1b', '#1b1110', '#3d2a24', 10);
        // Heavy Oak Ceiling & Vertical Timber Beams
        g.rect(0, 0, W, 8, '#3b2518');
        g.rect(0, 8, W, 2, '#5c3c24');
        [8, 52, 106, 150].forEach(bx => {
          g.rect(bx, 0, 5, 62, '#4a2e1d');
          g.rect(bx + 1, 0, 1, 62, '#6e472b');
        });
        // Starry Moonlit Waterdeep Arched Window (Center-Left)
        g.ditherGradY(14, 42, ['#0b132b', '#1c2541', '#28385e']);
        g.rect(0, 14, 22, 28, '#2b1e1b'); // restore left wall
        g.rect(46, 14, W - 46, 28, '#2b1e1b'); // restore right wall
        g.brickWall(0, 14, 22, 28, '#2b1e1b', '#1b1110', '#3d2a24', 11);
        g.brickWall(46, 14, W - 46, 28, '#2b1e1b', '#1b1110', '#3d2a24', 12);
        // Night sky window details (crescent moon + Waterdeep spire silhouette)
        g.oval(39, 20, 3, 3, '#ffeaa7');
        g.oval(40, 19, 2.5, 2.5, '#0b132b');
        g.px(26, 18, '#ffffff'); g.px(31, 16, '#74b9ff'); g.px(35, 22, '#ffffff');
        g.rect(24, 30, 5, 12, '#0f1629'); g.rect(30, 26, 4, 16, '#121c33'); g.rect(36, 32, 7, 10, '#0f1629');
        g.px(31, 31, '#f6c967'); g.px(26, 34, '#f6c967');
        // Window frame Mullions
        g.rect(21, 13, 26, 2, '#5c3c24');
        g.rect(21, 41, 26, 2, '#5c3c24');
        g.rect(21, 13, 2, 30, '#5c3c24');
        g.rect(45, 13, 2, 30, '#5c3c24');
        g.rect(33, 14, 2, 28, '#4a2e1d');
        g.rect(22, 27, 24, 2, '#4a2e1d');

        // Roaring Tavern Stone Hearth & Fireplace (Right)
        g.brickWall(114, 24, 34, 38, '#485460', '#1e272e', '#7f8fa6', 14);
        g.rect(112, 23, 38, 3, '#5c3c24'); // Mantel shelf
        g.rect(121, 38, 20, 24, '#140b0a'); // Hearth opening
        g.glow(131, 52, 24, '#fff7cc', '#ff9f43', '#c0392b');
        g.oval(131, 56, 7, 5, '#ff9f43');
        g.oval(131, 57, 4, 3, '#fff7cc');
        g.rect(125, 59, 12, 2, '#4a2e1d'); // logs
        // Dragon Trophy Shield above mantel
        g.oval(131, 15, 6, 5, '#c0392b');
        g.rect(129, 13, 4, 4, '#f6c967');

        // Tavern Wooden Floorboards
        g.floorTiles(62, '#4a2e1d', '#331e12', '#1d100a', '#6e472b', 18);

        // Iconic "Yawning Portal" Undermountain Well Shaft (Center!)
        g.glow(80, 68, 22, '#55efc4', '#00a8ff', '#192a56');
        g.oval(80, 72, 22, 8, '#636e72'); // stone rim
        g.oval(80, 71, 20, 7, '#95a5a6');
        g.oval(80, 72, 16, 5, '#091526'); // abyssal shaft
        g.oval(80, 73, 11, 3, '#00d2d3'); // arcane mist below
        // Rope & Pulley descending into Undermountain!
        g.rect(79, 8, 2, 65, '#d4a373');
        g.rect(75, 11, 10, 3, '#5c3c24');

        // Hanging Warm Tavern Lanterns + Oak Ale Barrels
        g.torch(58, 24, '#fff7cc', '#f6c967', '#b33939');
        g.torch(102, 24, '#fff7cc', '#f6c967', '#b33939');
        g.rect(8, 56, 10, 12, '#6e472b'); g.rect(8, 59, 10, 1, '#2f3640'); g.rect(8, 64, 10, 1, '#2f3640');
        g.rect(20, 58, 9, 10, '#5c3c24'); g.rect(20, 61, 9, 1, '#2f3640');
      }
    },

    // ========================================================================
    // ACT 1: 언더마운틴 입구 & 고블린 성채 (4 BOSS THEMES)
    // ========================================================================
    beholder_xanathar: {
      act: 1,
      title: '1층 · 자나사르의 암흑 길드 금고',
      accent: '#a29bfe',
      draw(g) {
        g.ditherGradY(0, 62, ['#10091f', '#1f1238', '#2c194f']);
        g.brickWall(0, 0, W, 62, '#24163d', '#120a21', '#3d2666', 101);
        // Three Giant Sewer/Vault Arches
        [30, 80, 130].forEach(ax => {
          g.rect(ax - 15, 16, 30, 46, '#0d0718');
          g.arch(ax, 10, 62, 15, '#24163d', '#483475');
        });
        // Glowing Purple Anti-Magic Eye Sigils in Side Arches
        [30, 130].forEach(ax => {
          g.glow(ax, 34, 12, '#e056fd', '#8e44ad', '#2c194f');
          g.oval(ax, 34, 7, 4, '#f5f6fa');
          g.oval(ax, 34, 3, 3, '#e056fd');
          g.px(ax, 34, '#0d0718');
        });
        // Center Pedestal: Xanathar's Beloved Goldfish Sylgar in Bowl!
        g.glow(80, 40, 16, '#74b9ff', '#00d2d3', '#2c194f');
        g.pillar(75, 47, 62, 10, '#2c194f', '#574b90', '#9b59b6');
        g.oval(80, 41, 7, 6, '#74b9ff');
        g.oval(80, 42, 6, 4, '#00a8ff');
        g.rect(79, 41, 3, 2, '#ff9f43'); g.px(82, 41, '#ffd32a'); // Sylgar the Goldfish!
        // Dungeon Vault Floor + Sparkling Gold Treasure Piles
        g.floorTiles(62, '#2d1c47', '#1a0f2e', '#0d0718', '#f6c967', 102);
        [[18, 63, 14, 6], [142, 64, 15, 6]].forEach(([tx, ty, rx, ry]) => {
          g.oval(tx, ty, rx, ry, '#d4a017');
          g.oval(tx - 2, ty - 1, rx * 0.65, ry * 0.65, '#f6c967');
          g.px(tx - 4, ty - 2, '#ffffff'); g.px(tx + 3, ty, '#e056fd'); g.px(tx, ty - 3, '#00d2d3');
        });
        g.torch(54, 30, '#dff9fb', '#e056fd', '#5f27cd');
        g.torch(106, 30, '#dff9fb', '#e056fd', '#5f27cd');
      }
    },

    young_green_dragon: {
      act: 1,
      title: '1층 · 베놈팽의 맹독 밀림 폐허',
      accent: '#2ed573',
      draw(g) {
        g.ditherGradY(0, 62, ['#071710', '#0e2b1d', '#17402a']);
        // Crumbling Mossy Ruin Pillars & Diagonal Eerie Green Sunbeams
        for (let i = 0; i < 45; i++) {
          g.line(48 + i, 0, 12 + i, 62, i % 3 === 0 ? '#1e5638' : '#16422a', 1);
          g.line(105 + i, 0, 74 + i, 62, i % 4 === 0 ? '#246b44' : '#16422a', 1);
        }
        g.pillar(10, 4, 64, 12, '#0d2618', '#1e4d32', '#2ed573');
        g.pillar(54, 12, 64, 10, '#0d2618', '#1b452d', '#38ada9');
        g.pillar(136, 4, 64, 12, '#0d2618', '#1e4d32', '#2ed573');
        // Overgrown Hanging Vines & Emerald Foliage Canopy
        g.stalactites(0, 14, 18, '#145a32', '#2ed573', 110, false);
        [28, 42, 76, 98, 122].forEach((vx, idx) => {
          const len = 26 + (idx * 7) % 24;
          for (let y = 0; y < len; y++) {
            const sx = vx + Math.round(Math.sin(y * 0.25) * 2);
            g.px(sx, y, '#1e8449');
            if (y % 4 === 0) g.px(sx + 1, y, '#55efc4');
          }
        });
        // Acid-Green Toxic Pools on Mossy Stone Floor
        g.floorTiles(62, '#143824', '#0b2115', '#06120b', '#2ed573', 111);
        g.glow(42, 74, 18, '#b8e994', '#2ed573', '#145a32');
        g.oval(42, 75, 16, 4, '#2ed573'); g.oval(40, 74, 8, 2, '#b8e994');
        g.glow(118, 72, 16, '#b8e994', '#2ed573', '#145a32');
        g.oval(118, 73, 14, 4, '#2ed573'); g.oval(120, 72, 6, 2, '#b8e994');
        // Floating Venom Spores
        g.stars(58, 24, ['#b8e994', '#2ed573', '#55efc4'], 112);
      }
    },

    ettin_king_gror: {
      act: 1,
      title: '1층 · 그로르의 쌍두 거인 투기장',
      accent: '#ff9f43',
      draw(g) {
        g.ditherGradY(0, 62, ['#141214', '#262124', '#383033']);
        g.stalactites(0, 12, 16, '#1c181a', '#4a4146', 120, false);
        // Twin Carved Ettin Totem Monoliths (Two Giant Heads!)
        [44, 116].forEach(tx => {
          g.rect(tx - 11, 14, 22, 48, '#4a454d');
          g.rect(tx - 9, 16, 18, 44, '#5d5761');
          g.rect(tx - 11, 14, 3, 48, '#78717d');
          // Glowing carved eyes & jagged frown
          g.rect(tx - 6, 24, 4, 3, '#ff6b6b'); g.px(tx - 5, 25, '#ffeaa7');
          g.rect(tx + 2, 24, 4, 3, '#ff6b6b'); g.px(tx + 3, 25, '#ffeaa7');
          g.rect(tx - 6, 33, 12, 3, '#1e1b21');
          g.rect(tx - 4, 33, 2, 2, '#dcdde1'); g.rect(tx + 2, 33, 2, 2, '#dcdde1');
        });
        // Hanging Heavy Iron Chains + Spiked Wooden Arena Palisades
        [20, 72, 88, 140].forEach(cx => g.chain(cx, 0, 38, '#485460', '#8395a7'));
        for (let sx = 0; sx < W; sx += 7) {
          if (sx > 30 && sx < 130) continue;
          g.rect(sx, 40, 5, 24, '#5c3c24');
          g.line(sx + 2, 34, sx, 40, '#8d5524', 2);
        }
        // Cracked Arena Floor & Dual Roaring War Braziers
        g.floorTiles(62, '#3d3538', '#262023', '#141012', '#7f8c8d', 121);
        g.torch(64, 52, '#fff7cc', '#ff9f43', '#c0392b');
        g.torch(96, 52, '#fff7cc', '#ff9f43', '#c0392b');
        g.stars(55, 18, ['#ff9f43', '#ff4757', '#ffeaa7'], 122);
      }
    },

    goblin_shaman_king: {
      act: 1,
      title: '1층 · 고블린 주술왕의 화염 성채',
      accent: '#ff4757',
      draw(g) {
        g.ditherGradY(0, 62, ['#1c0909', '#361111', '#521a14']);
        g.brickWall(0, 0, W, 62, '#3d1914', '#1f0b08', '#63281f', 130);
        // Wooden Goblin Scaffolding & Crimson Tribal Banners
        g.rect(0, 14, W, 3, '#5c3c24');
        [18, 60, 100, 142].forEach(px => g.rect(px, 14, 4, 48, '#4a2e1d'));
        [34, 80, 126].forEach(bx => {
          g.rect(bx - 7, 17, 14, 26, '#c0392b');
          g.rect(bx - 5, 19, 10, 20, '#e74c3c');
          g.rect(bx - 3, 23, 6, 5, '#f6c967'); // tribal sun skull
          g.px(bx - 2, 25, '#1c0909'); g.px(bx + 1, 25, '#1c0909');
        });
        // Giant Central Shaman Fire Pit & Glowing Totem Skull
        g.floorTiles(62, '#422019', '#26100c', '#140705', '#ff6b6b', 131);
        g.glow(80, 56, 26, '#fff7cc', '#ff6b35', '#c0392b');
        g.oval(80, 60, 14, 5, '#485460');
        g.oval(80, 57, 9, 7, '#ff6b35');
        g.oval(80, 58, 5, 4, '#fff7cc');
        g.torch(24, 34); g.torch(136, 34);
        g.stars(58, 28, ['#ff9f43', '#ff4757', '#ffeaa7'], 132);
      }
    },

    // ========================================================================
    // ACT 2: 언더다크 & 롤스의 거미 신전 (4 BOSS THEMES)
    // ========================================================================
    arachne_matron: {
      act: 2,
      title: '2층 · 롤스의 거미 여왕 신전',
      accent: '#e056fd',
      draw(g) {
        g.ditherGradY(0, 62, ['#0e061a', '#1d0d33', '#2e144f']);
        // Obsidian Drow Pillars & Spider-Emblem Rose Window
        g.pillar(14, 0, 64, 12, '#140824', '#2c154a', '#5f27cd');
        g.pillar(134, 0, 64, 12, '#140824', '#2c154a', '#5f27cd');
        g.glow(80, 30, 22, '#ff6b81', '#9b59b6', '#2e144f');
        g.oval(80, 30, 16, 16, '#1a0a2e');
        g.oval(80, 30, 13, 13, '#3c1866');
        // Crimson Spider Icon in Rose Window
        g.oval(80, 28, 4, 5, '#eb3b5a');
        g.oval(80, 35, 3, 2.5, '#ff4757');
        [-1, 1].forEach(s => {
          g.line(80 + s * 3, 27, 80 + s * 10, 23, '#ff4757', 1);
          g.line(80 + s * 3, 30, 80 + s * 11, 30, '#ff4757', 1);
          g.line(80 + s * 3, 33, 80 + s * 10, 37, '#ff4757', 1);
        });
        // Giant Silver Cobwebs in Corners & Hanging Silk Cocoons
        g.cobweb(0, 0, 1, 1, 42, '#b8a9c9');
        g.cobweb(W - 1, 0, -1, 1, 42, '#b8a9c9');
        [44, 116].forEach(cx => {
          g.line(cx, 0, cx, 26, '#dfe6e9', 1);
          g.oval(cx, 31, 4, 7, '#c8d6e5');
        });
        g.floorTiles(62, '#24113d', '#140824', '#090312', '#e056fd', 201);
        g.torch(42, 48, '#ffd6ff', '#e056fd', '#8e44ad');
        g.torch(118, 48, '#ffd6ff', '#e056fd', '#8e44ad');
      }
    },

    aboleth_leviathan: {
      act: 2,
      title: '2층 · 아볼레스의 심해 지하 호수',
      accent: '#00d2d3',
      draw(g) {
        g.ditherGradY(0, 56, ['#05101f', '#0a223d', '#113a5c']);
        g.stalactites(0, 12, 16, '#08182b', '#1b4f72', 210, false);
        // Sunken Ancient Glowing Obelisks emerging from Deep Cavern Lake
        [[30, 22, 10], [80, 14, 14], [128, 24, 10]].forEach(([ox, oy, ow]) => {
          g.rect(ox - ow / 2, oy, ow, 58 - oy, '#16354d');
          g.rect(ox - ow / 2, oy, 2, 58 - oy, '#2e86de');
          // Glowing cyan rune stripes
          for (let ry = oy + 6; ry < 52; ry += 6) {
            g.rect(ox - 2, ry, 4, 2, '#00d2d3');
          }
        });
        // Bioluminescent Underwater Sea & Shimmering Reflections!
        g.ditherGradY(56, H, ['#0c4a6e', '#082f49', '#041b2d']);
        for (let y = 58; y < H; y += 3) {
          for (let x = 4; x < W - 4; x += 14) {
            const shift = (y * 5) % 11;
            g.rect((x + shift) % (W - 10), y, 7, 1, y < 68 ? '#18dcff' : '#00a8ff');
          }
        }
        // Floating Glowing Bioluminescent Jellyfish Spores
        g.glow(54, 34, 10, '#dff9fb', '#00d2d3', '#0a223d');
        g.glow(108, 28, 12, '#dff9fb', '#74b9ff', '#0a223d');
        g.stars(54, 26, ['#dff9fb', '#00d2d3', '#55efc4'], 211);
      }
    },

    purple_worm_titan: {
      act: 2,
      title: '2층 · 퍼플 웜의 자수정 대공동',
      accent: '#9b59b6',
      draw(g) {
        g.ditherGradY(0, 62, ['#14081c', '#261136', '#3b1b52']);
        // Concentric Giant Bore-Tunnel Rings carved by the Purple Worm!
        [74, 58, 42, 26].forEach((r, idx) => {
          const col = ['#220f30', '#2e1440', '#1a0b24', '#0f0617'][idx];
          g.oval(80, 44, r, r * 0.65, col);
        });
        // Jagged Amethyst Crystal Clusters on Left & Right Cavern Walls
        const drawCrystal = (cx, cy, h, w, c1, c2) => {
          for (let i = 0; i < h; i++) {
            const cw = Math.max(1, Math.round(w * (i / h)));
            g.rect(cx - cw, cy + i, cw * 2, 1, c1);
            g.px(cx - cw + 1, cy + i, c2);
          }
        };
        g.glow(22, 46, 18, '#f3a6ff', '#e056fd', '#3b1b52');
        drawCrystal(16, 26, 36, 7, '#8e44ad', '#f3a6ff');
        drawCrystal(28, 36, 26, 5, '#9b59b6', '#ffffff');
        g.glow(138, 44, 18, '#f3a6ff', '#e056fd', '#3b1b52');
        drawCrystal(142, 24, 38, 7, '#8e44ad', '#f3a6ff');
        drawCrystal(130, 38, 24, 5, '#9b59b6', '#ffffff');
        // Cracked Basalt Floor with Glowing Violet Fissures
        g.floorTiles(62, '#2b163b', '#180b21', '#0c0512', '#e056fd', 220);
        g.line(35, 68, 74, 76, '#e056fd', 2);
        g.line(74, 76, 122, 71, '#f3a6ff', 1);
      }
    },

    duergar_despot: {
      act: 2,
      title: '2층 · 두에르가 폭군의 강철 용광로',
      accent: '#ff9f43',
      draw(g) {
        g.ditherGradY(0, 62, ['#121417', '#21252b', '#2f3542']);
        g.brickWall(0, 0, W, 62, '#252a33', '#14171c', '#454e5e', 230);
        // Giant Iron Gears in Background
        const drawGear = (cx, cy, r) => {
          g.oval(cx, cy, r, r, '#3d4554');
          g.oval(cx, cy, r - 4, r - 4, '#1b1f26');
          for (let a = 0; a < 8; a++) {
            const ang = (Math.PI * 2 * a) / 8;
            g.rect(cx + Math.cos(ang) * r - 2, cy + Math.sin(ang) * r - 2, 4, 4, '#57606f');
          }
        };
        drawGear(34, 24, 15);
        drawGear(126, 26, 16);
        // Pouring Molten Iron Slag Falls into Crucible!
        g.glow(80, 44, 26, '#fff200', '#ff9f43', '#c0392b');
        g.rect(74, 0, 12, 62, '#ff6b35');
        g.rect(77, 0, 6, 62, '#ffdd59');
        g.rect(79, 0, 2, 62, '#ffffff');
        g.pillar(56, 0, 64, 10, '#14171c', '#3d4554', '#747d8c');
        g.pillar(94, 0, 64, 10, '#14171c', '#3d4554', '#747d8c');
        // Steel Grate Floor + Molten Lava River
        g.floorTiles(62, '#2f3640', '#1e272e', '#0d1014', '#ff9f43', 231);
        g.oval(80, 67, 24, 5, '#ff6b35');
        g.oval(80, 67, 14, 3, '#fff200');
        g.stars(58, 22, ['#ff9f43', '#fff200', '#ff4757'], 232);
      }
    },

    // ========================================================================
    // ACT 3: 일리시드 생체 군락 (4 BOSS THEMES)
    // ========================================================================
    elder_brain_prime: {
      act: 3,
      title: '3층 · 엘더 브레인의 사이오닉 수조',
      accent: '#fd79a8',
      draw(g) {
        g.ditherGradY(0, 62, ['#140724', '#260d42', '#3a145e']);
        // Biomechanical Alien Rib Arches
        [18, 42, 118, 142].forEach(rx => {
          g.line(rx, 0, rx + (rx < 80 ? 12 : -12), 62, '#5f27cd', 3);
          g.line(rx + 2, 0, rx + (rx < 80 ? 14 : -14), 62, '#a29bfe', 1);
        });
        // Giant Central Brine Tank with Pulsing Elder Brain Silhouette!
        g.glow(80, 32, 32, '#dff9fb', '#00d2d3', '#6c5ce7');
        g.rect(54, 6, 52, 56, '#14364a');
        g.rect(57, 8, 46, 52, '#0fb9b1');
        g.rect(60, 10, 40, 48, '#2bcbba');
        // Tank glass highlights & top/bottom brass caps
        g.rect(60, 10, 3, 46, '#dff9fb');
        g.rect(51, 4, 58, 4, '#574b90');
        g.rect(51, 58, 58, 5, '#574b90');
        // Floating Brain Silhouette inside tank
        g.oval(80, 30, 14, 11, '#fd79a8');
        g.oval(75, 28, 7, 6, '#fab1a0');
        g.oval(85, 28, 7, 6, '#fab1a0');
        g.line(80, 20, 80, 40, '#b33939', 1);
        // Shimmering Brine Floor
        g.floorTiles(62, '#1f1642', '#100a26', '#070414', '#00d2d3', 301);
        g.oval(80, 74, 34, 6, '#00d2d3');
        g.oval(80, 74, 20, 3, '#dff9fb');
      }
    },

    beholder_hive_mother: {
      act: 3,
      title: '3층 · 비홀더 하이브 마더의 수정 둥지',
      accent: '#ff6b81',
      draw(g) {
        g.ditherGradY(0, 62, ['#1c0617', '#380c2c', '#571342']);
        // Alien Hexagonal Honeycomb Cavern Lattice
        for (let y = 4; y < 60; y += 12) {
          for (let x = ((y / 12) & 1) ? 8 : 0; x < W; x += 16) {
            g.rect(x, y, 12, 9, '#2a0921');
            g.rect(x + 1, y + 1, 10, 7, '#451036');
          }
        }
        // Floating Crimson Eye-Nodes embedded in Hive Walls
        [[26, 22], [80, 18], [134, 22], [52, 42], [108, 42]].forEach(([ex, ey]) => {
          g.glow(ex, ey, 11, '#ffeaa7', '#ff4757', '#571342');
          g.oval(ex, ey, 5, 4, '#fff5f5');
          g.oval(ex, ey, 2.5, 2.5, '#ff4757');
          g.px(ex, ey, '#1c0617');
        });
        // Anti-Magic Laser Lattice Beams
        g.line(26, 22, 80, 58, '#ff6b81', 1);
        g.line(134, 22, 80, 58, '#ff6b81', 1);
        g.floorTiles(62, '#3d1030', '#21071a', '#10030d', '#f6c967', 310);
      }
    },

    githyanki_supreme: {
      act: 3,
      title: '3층 · 기스양키 아스트랄 은빛 함선',
      accent: '#7ed6df',
      draw(g) {
        // Swirling Silver-Teal Astral Sea Nebula Sky!
        g.ditherGradY(0, 62, ['#090f24', '#16274d', '#244775', '#3c6e91']);
        g.glow(42, 22, 26, '#dff9fb', '#7ed6df', '#244775');
        g.glow(120, 28, 22, '#f6e58d', '#a29bfe', '#16274d');
        g.stars(58, 52, ['#ffffff', '#7ed6df', '#ffeaa7', '#a29bfe'], 320);
        // Floating Silver Astral Monolith Islands
        g.rect(18, 26, 12, 22, '#535c68'); g.rect(20, 28, 2, 18, '#dff9fb');
        g.rect(132, 20, 10, 26, '#535c68'); g.rect(134, 22, 2, 22, '#f6c967');
        // Ornate Golden-Prowed Astral Skiff Deck & Sails!
        g.line(80, 8, 80, 62, '#f6c967', 2);
        g.oval(80, 26, 26, 14, '#dfe6e9');
        g.oval(80, 26, 22, 11, '#c7ecee');
        g.rect(78, 16, 4, 20, '#f6c967');
        // Ship Wooden-Gold Deck Floor
        g.floorTiles(62, '#4a3a2c', '#2c221a', '#17110d', '#f6c967', 321);
        g.rect(0, 60, W, 3, '#f6c967');
      }
    },

    neothelid_leviathan: {
      act: 3,
      title: '3층 · 네오텔리드의 부식성 점액 구덩이',
      accent: '#badc58',
      draw(g) {
        g.ditherGradY(0, 62, ['#110a1f', '#22153b', '#332054']);
        g.stalactites(0, 14, 18, '#2c1847', '#badc58', 330, false);
        // Giant Writhing Tentacle Silhouettes in Background Mist
        [24, 58, 102, 136].forEach((tx, idx) => {
          for (let y = 12; y < 64; y++) {
            const sx = tx + Math.round(Math.sin(y * 0.14 + idx) * 6);
            g.rect(sx - 3, y, 6, 1, '#483475');
            if (y % 5 === 0) g.px(sx - 2, y, '#a29bfe');
          }
        });
        // Bubbling Acid-Lime & Violet Ooze Pit Floor!
        g.floorTiles(62, '#2d1c47', '#1b0f2e', '#0d0617', '#badc58', 331);
        g.glow(80, 72, 28, '#e8ff9c', '#badc58', '#6ab04c');
        g.oval(80, 74, 42, 7, '#6ab04c');
        g.oval(80, 73, 30, 4, '#badc58');
        g.oval(68, 72, 4, 2, '#ffffff');
        g.oval(94, 74, 3, 2, '#ffffff');
        g.stars(58, 22, ['#badc58', '#a29bfe', '#e8ff9c'], 332);
      }
    },

    // ========================================================================
    // ACT 4: 섀도우펠 & 아세라락의 공포의 무덤 (4 BOSS THEMES)
    // ========================================================================
    archlich_acererak: {
      act: 4,
      title: '4층 · 아세라락의 영혼 융합로 무덤',
      accent: '#2ed573',
      draw(g) {
        g.ditherGradY(0, 62, ['#07120e', '#0f241c', '#16362a']);
        g.brickWall(0, 0, W, 62, '#142922', '#08120e', '#24473b', 401);
        // Massive Central Emerald "Soulmonger" Phylactery Cylinder!
        g.glow(80, 34, 34, '#e6fff2', '#2ed573', '#145a32');
        g.rect(65, 8, 30, 52, '#0d3b26');
        g.rect(68, 10, 24, 48, '#2ed573');
        g.rect(72, 12, 16, 44, '#7bed9f');
        g.rect(75, 14, 4, 40, '#ffffff');
        // Iron Containment Rings & Chains
        [14, 28, 42, 54].forEach(ry => g.rect(62, ry, 36, 3, '#2f3640'));
        g.chain(64, 0, 14); g.chain(96, 0, 14);
        // Carved Demonic Tomb Pillars & Swirling Soul Wisps
        g.pillar(14, 0, 64, 12, '#08120e', '#1e3830', '#55efc4');
        g.pillar(134, 0, 64, 12, '#08120e', '#1e3830', '#55efc4');
        g.stars(58, 30, ['#ffffff', '#55efc4', '#2ed573'], 402);
        g.floorTiles(62, '#182b24', '#0d1a15', '#050a08', '#2ed573', 403);
      }
    },

    dracolich_aurinax: {
      act: 4,
      title: '4층 · 드라코리치의 백골 빙하 영묘',
      accent: '#74b9ff',
      draw(g) {
        g.ditherGradY(0, 62, ['#08101c', '#122238', '#1e3a5c']);
        // Colossal Arched Dragon Ribcage Bones across the Crypt!
        [16, 38, 60].forEach(rx => {
          g.line(rx, 62, rx - 8, 22, '#dcdde1', 3);
          g.line(rx - 8, 22, rx + 12, 6, '#f5f6fa', 2);
          const mx = W - rx;
          g.line(mx, 62, mx + 8, 22, '#dcdde1', 3);
          g.line(mx + 8, 22, mx - 12, 6, '#f5f6fa', 2);
        });
        // Glowing Frost-Blue Necrotic Phylactery Flame at Center
        g.glow(80, 38, 24, '#ffffff', '#74b9ff', '#0984e3');
        g.oval(80, 42, 7, 10, '#00d2d3');
        g.oval(80, 44, 4, 6, '#ffffff');
        g.rect(72, 52, 16, 10, '#576574');
        // Frozen Ossuary Floor & Drifting Ice-Soul Sparks
        g.floorTiles(62, '#22364d', '#132030', '#09101a', '#dff9fb', 410);
        g.stars(58, 32, ['#ffffff', '#74b9ff', '#00d2d3'], 411);
      }
    },

    death_tyrant_beholder: {
      act: 4,
      title: '4층 · 데스 타이런트의 핏빛 안구 성소',
      accent: '#ff4757',
      draw(g) {
        g.ditherGradY(0, 62, ['#140509', '#2b0a12', '#420f1c']);
        // Shattered Gothic Cathedral & Giant Eclipsed Blood Moon!
        g.glow(80, 26, 26, '#ff6b81', '#eb3b5a', '#420f1c');
        g.oval(80, 26, 15, 15, '#eb3b5a');
        g.oval(80, 26, 10, 10, '#140509'); // dark eclipse pupil!
        g.rect(79, 20, 2, 12, '#ff4757'); // vertical slit!
        // Broken Gothic Arches framing the Blood Moon
        g.pillar(18, 0, 64, 12, '#0e0407', '#2c121a', '#632637');
        g.pillar(130, 0, 64, 12, '#0e0407', '#2c121a', '#632637');
        g.arch(80, 4, 62, 42, '#1f0b12', '#521d2d');
        // Crimson Floating Spectral Eyes & Blood-Stained Marble Floor
        g.floorTiles(62, '#2e111a', '#1a080e', '#0a0305', '#ff4757', 420);
        g.torch(44, 46, '#ffeaa7', '#ff4757', '#781023');
        g.torch(116, 46, '#ffeaa7', '#ff4757', '#781023');
      }
    },

    lord_soth_deathknight: {
      act: 4,
      title: '4층 · 로드 소스의 흑장미 저주 성채',
      accent: '#a29bfe',
      draw(g) {
        // Storm-Swept Shadowfell Night Sky & Pale Full Moon
        g.ditherGradY(0, 62, ['#090a14', '#16192e', '#242947']);
        g.glow(120, 18, 22, '#ffffff', '#dfe6e9', '#242947');
        g.oval(120, 18, 10, 10, '#f5f6fa');
        g.stars(45, 28, ['#ffffff', '#74b9ff', '#a29bfe'], 430);
        // Distant Gothic Castle Spires Silhouette (Dargaard Keep!)
        [[18, 14, 14], [42, 22, 18], [76, 10, 16], [142, 18, 16]].forEach(([sx, sy, sw]) => {
          g.rect(sx, sy + 12, sw, 50 - sy, '#131626');
          for (let i = 0; i < 12; i++) {
            const cw = Math.max(1, Math.round((sw / 2) * (i / 12)));
            g.rect(sx + sw / 2 - cw, sy + i, cw * 2, 1, '#1b2038');
          }
          g.px(sx + sw / 2, sy + 20, '#ff4757'); // eerie red castle window
        });
        // Foreground Battlement Wall & Tattered Black-Rose Banners
        g.rect(0, 48, W, 14, '#222638');
        for (let bx = 0; bx < W; bx += 16) g.rect(bx, 42, 10, 6, '#2e334a');
        [32, 80, 128].forEach(bx => {
          g.rect(bx - 5, 44, 10, 18, '#4a1020');
          g.oval(bx, 51, 3, 3, '#ff4757'); // rose emblem
        });
        // Wet Moonlit Stone Courtyard & Ghostfire Braziers
        g.floorTiles(62, '#222638', '#131624', '#090b12', '#74b9ff', 431);
        g.torch(54, 52, '#ffffff', '#74b9ff', '#3742fa');
        g.torch(106, 52, '#ffffff', '#74b9ff', '#3742fa');
      }
    },

    // ========================================================================
    // ACT 5: 나인 헬 아베르누스 & 티아마트의 신전 (4 BOSS THEMES)
    // ========================================================================
    tiamat_dragon_queen: {
      act: 5,
      title: '5층 · 티아마트의 오색 용신전',
      accent: '#f6c967',
      draw(g) {
        // Apocalyptic Avernus Volcanic Sky
        g.ditherGradY(0, 62, ['#1a0505', '#470d0d', '#7a1c12', '#b33919']);
        // Swirling Chromatic Portal Vortex at Center Sky
        g.glow(80, 22, 26, '#fff7cc', '#f6c967', '#b33919');
        g.oval(80, 22, 16, 10, '#2d132c');
        g.oval(80, 22, 11, 6, '#f6c967');
        g.oval(80, 22, 6, 3, '#ffffff');
        // ALL FIVE CHROMATIC DRAGON OBELISKS (Red, Blue, Green, Black, White)!
        const spires = [
          [16, 20, '#ff4757'], [44, 14, '#2e86de'], [80, 34, '#2ed573'],
          [116, 14, '#2f3542'], [144, 20, '#ecf0f1']
        ];
        spires.forEach(([sx, sy, col]) => {
          g.rect(sx - 5, sy, 10, 62 - sy, '#241418');
          g.rect(sx - 2, sy + 2, 4, 56 - sy, col);
          g.line(sx, sy, 80, 22, col, 1); // Chromatic summoning beam!
        });
        // Obsidian Temple Steps & Flowing Lava Rivers
        g.floorTiles(62, '#2b1214', '#17080a', '#0a0304', '#ff6b35', 501);
        g.rect(0, 74, W, 6, '#ff6b35');
        g.rect(0, 76, W, 2, '#ffd32a');
        g.stars(58, 30, ['#fff200', '#ff6b35', '#ffffff'], 502);
      }
    },

    asmodeus_lord_of_ninth: {
      act: 5,
      title: '5층 · 아스모데우스의 네수스 흑요석 옥좌',
      accent: '#ff2e4c',
      draw(g) {
        g.ditherGradY(0, 62, ['#140307', '#2e0812', '#4d0d1d']);
        g.brickWall(0, 0, W, 62, '#2b0912', '#120307', '#521424', 510);
        // Grand Infernal Obsidian-and-Gold Palace Pillars
        [14, 48, 112, 146].forEach(px => g.pillar(px - 6, 0, 64, 12, '#140307', '#3b0b18', '#f6c967'));
        // Massive Floating Ruby Crystal Chandelier & Crimson Throne!
        g.glow(80, 22, 24, '#ffffff', '#ff2e4c', '#4d0d1d');
        g.oval(80, 22, 9, 12, '#ff2e4c');
        g.oval(78, 19, 3, 5, '#ff9ff3');
        // Golden Throne Silhouette
        g.rect(68, 38, 24, 24, '#4d0d1d');
        g.rect(70, 40, 20, 22, '#24050d');
        g.rect(66, 36, 28, 3, '#f6c967');
        g.rect(72, 42, 16, 18, '#b31237');
        // Polished Obsidian Floor + Golden Pentagram Circle
        g.floorTiles(62, '#240710', '#120308', '#080103', '#f6c967', 511);
        g.oval(80, 75, 28, 7, '#f6c967');
        g.oval(80, 75, 24, 5, '#240710');
        g.torch(30, 32, '#fff7cc', '#ff4757', '#780b1e');
        g.torch(130, 32, '#fff7cc', '#ff4757', '#780b1e');
      }
    },

    demogorgon_prince: {
      act: 5,
      title: '5층 · 데모고르곤의 심연 소용돌이 바다',
      accent: '#2ed573',
      draw(g) {
        // Chaotic Abyssal Storm Sky (Violet + Toxic Emerald Lightning!)
        g.ditherGradY(0, 56, ['#0b0617', '#1e0f38', '#2d1652', '#173b33']);
        // Crackling Green Abyssal Lightning Bolts!
        const bolt = (x0, y0, x1, y1) => {
          const mx = (x0 + x1) / 2 + 8, my = (y0 + y1) / 2;
          g.line(x0, y0, mx, my, '#2ed573', 2);
          g.line(mx, my, x1, y1, '#b8e994', 1);
        };
        bolt(38, 0, 26, 48);
        bolt(124, 0, 134, 46);
        // Twin Jagged Horned Abyssal Towers (Wat Dagon / Abysm!)
        [[48, 12], [112, 12]].forEach(([tx, ty]) => {
          g.rect(tx - 9, ty + 14, 18, 44, '#1b1429');
          g.line(tx - 8, ty + 14, tx - 14, ty, '#2d1f47', 3);
          g.line(tx + 8, ty + 14, tx + 14, ty, '#2d1f47', 3);
          g.rect(tx - 2, ty + 24, 4, 8, '#2ed573');
        });
        // Boiling Abyssal Dark Sea & Basalt Pier
        g.ditherGradY(56, H, ['#122b26', '#0b1c1f', '#170c29']);
        for (let y = 58; y < H; y += 3) {
          for (let x = 0; x < W; x += 16) {
            g.rect((x + y * 3) % (W - 8), y, 8, 1, y % 2 === 0 ? '#2ed573' : '#9b59b6');
          }
        }
        g.glow(80, 62, 20, '#b8e994', '#2ed573', '#173b33');
      }
    },

    halaster_mad_mage: {
      act: 5,
      title: '5층 · 할라스터의 차원 균열 비전탑',
      accent: '#00d2d3',
      draw(g) {
        // Deep Cosmic Indigo Void & Starfield
        g.ditherGradY(0, 62, ['#06071a', '#0f133b', '#1b2059', '#2b1b5e']);
        g.stars(62, 65, ['#ffffff', '#00d2d3', '#f6c967', '#e056fd'], 530);
        // Giant Rotating Arcane Astrolabe Rings at Center!
        g.glow(80, 32, 30, '#ffffff', '#00d2d3', '#6c5ce7');
        [24, 18, 11].forEach((r, idx) => {
          const col = ['#f6c967', '#00d2d3', '#e056fd'][idx];
          for (let a = 0; a < 48; a++) {
            const ang = (Math.PI * 2 * a) / 48;
            g.px(80 + Math.cos(ang) * r, 32 + Math.sin(ang) * r, col);
          }
        });
        // Escher-like Floating Wizard Staircases & Portals
        for (let s = 0; s < 7; s++) {
          g.rect(12 + s * 6, 52 - s * 4, 8, 4, '#574b90');
          g.rect(12 + s * 6, 52 - s * 4, 8, 1, '#f6c967');
          g.rect(140 - s * 6, 52 - s * 4, 8, 4, '#574b90');
          g.rect(140 - s * 6, 52 - s * 4, 8, 1, '#00d2d3');
        }
        // Floating Cosmic Rune Platform Floor
        g.floorTiles(62, '#1f1b4d', '#110e2e', '#070617', '#00d2d3', 531);
        g.rect(0, 61, W, 2, '#f6c967');
      }
    }
  };

  // Fallback mapping by Act if an unknown bossId is ever requested
  const ACT_FALLBACK = {
    1: 'beholder_xanathar',
    2: 'arachne_matron',
    3: 'elder_brain_prime',
    4: 'archlich_acererak',
    5: 'tiamat_dragon_queen'
  };

  const urlCache = {};

  function resolveKey(keyOrBossId, actNum = 1) {
    if (keyOrBossId && SCENES[keyOrBossId]) return keyOrBossId;
    return ACT_FALLBACK[actNum] || 'lobby';
  }

  function buildCanvas(key) {
    const scene = SCENES[key] || SCENES.lobby;
    const g = new PixelBgCanvas(W, H);
    scene.draw(g);
    g.addAtmosphere(scene.accent || '#f6c967', key.length * 31 + (scene.act || 1) * 17);
    return g;
  }

  function getSceneDataUrl(keyOrBossId, actNum = 1) {
    const key = resolveKey(keyOrBossId, actNum);
    if (!urlCache[key]) {
      const g = buildCanvas(key);
      urlCache[key] = g.toDataURL();
    }
    return urlCache[key];
  }

  function getSceneMeta(keyOrBossId, actNum = 1) {
    const key = resolveKey(keyOrBossId, actNum);
    const s = SCENES[key] || SCENES.lobby;
    return { key, title: s.title, accent: s.accent, act: s.act || 0 };
  }

  function applyTheme(keyOrBossId, actNum = 1) {
    if (typeof document === 'undefined') return;
    const key = resolveKey(keyOrBossId, actNum);
    const meta = getSceneMeta(key, actNum);
    const url = getSceneDataUrl(key, actNum);
    const lobbyUrl = getSceneDataUrl('lobby', 0);
    const root = document.documentElement;
    if (root && url) {
      root.style.setProperty('--pixel-bg-img', `url("${url}")`);
      root.style.setProperty('--pixel-bg-accent', meta.accent);
      root.dataset.pixelTheme = key;
    }
    if (root && lobbyUrl) {
      root.style.setProperty('--pixel-lobby-img', `url("${lobbyUrl}")`);
    }
    // Directly bind crisp pixelated <img> elements so backgrounds ALWAYS render visibly!
    const fullImg = document.getElementById('pixel-bg-img');
    if (fullImg && url) fullImg.src = url;
    const bfImg = document.getElementById('battlefield-bg-img');
    if (bfImg && url) bfImg.src = url;
    const mapImg = document.getElementById('map-bg-img');
    if (mapImg && url) mapImg.src = url;
    const lobbyImg = document.getElementById('lobby-bg-img');
    if (lobbyImg && lobbyUrl) lobbyImg.src = lobbyUrl;

    const badge = document.getElementById('map-theme-badge');
    if (badge) {
      badge.textContent = `🎨 ${meta.title}`;
      badge.style.borderColor = meta.accent;
      badge.style.color = meta.accent;
    }
    const combatBadge = document.getElementById('combat-theme-badge');
    if (combatBadge) {
      combatBadge.textContent = `🏰 ${meta.title}`;
      combatBadge.style.borderColor = meta.accent;
      combatBadge.style.color = meta.accent;
    }
  }

  window.PIXEL_BACKGROUNDS = {
    W,
    H,
    SCENES,
    buildCanvas,
    getSceneDataUrl,
    getSceneMeta,
    applyTheme
  };

  // Auto-apply Lobby pixel-art background as soon as DOM is ready!
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => applyTheme('lobby', 0));
    } else {
      applyTheme('lobby', 0);
    }
  }
})();
