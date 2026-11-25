// ============================================================================
// D&D 5E SPIRE II: TALES OF UNDERMOUNTAIN - CORE ENGINE (game.js)
// - 8 Core Classes x 4 Subclasses each (32 Subclass Build Paths!)
// - 5 Acts (Floors) x 30 Stages per Floor (150 Stages Total!)
// - C / B / A / S Rank Promotion + D&D 6 Ability Scores + Feats + Magic Gear
// ============================================================================

// ============================================================================
// PROCEDURAL WEB AUDIO SFX ENGINE & 60FPS ON-DEMAND CANVAS VFX ENGINE
// (Zero external assets, 0% idle CPU/GPU usage when no particles active!)
// ============================================================================
const SfxEngine = {
  ctx: null,
  muted: false,

  init() {
    try {
      this.muted = localStorage.getItem('DND5E_SPIRE_2_SFX_MUTED') === '1';
    } catch (e) { }
    this.syncToggleButtons();
  },

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('DND5E_SPIRE_2_SFX_MUTED', this.muted ? '1' : '0');
    } catch (e) { }
    this.syncToggleButtons();
    if (!this.muted) this.play('gold');
    if (typeof Game !== 'undefined' && Game.showToast) {
      Game.showToast(this.muted ? '🔇 효과음 음소거됨' : '🔊 효과음 활성화됨', 'info');
    }
  },

  syncToggleButtons() {
    if (typeof document === 'undefined' || !document.querySelectorAll) return;
    document.querySelectorAll('.btn-sfx-toggle').forEach(btn => {
      btn.textContent = this.muted ? '🔇' : '🔊';
      btn.title = this.muted ? '효과음 켜기' : '효과음 끄기';
    });
  },

  ensureCtx() {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
      } catch (e) {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch (e) { }
    }
    return this.ctx;
  },

  noiseBuf: null,

  ensureNoiseBuf(ctx) {
    if (this.noiseBuf && this.noiseBuf.sampleRate === ctx.sampleRate) return this.noiseBuf;
    const len = Math.floor(ctx.sampleRate * 0.25);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.35));
    }
    this.noiseBuf = buf;
    return buf;
  },

  noise(dur = 0.09, filterFreq = 1600, q = 1.2, gainVal = 0.12, delay = 0) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.ensureNoiseBuf(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.Q.setValueAtTime(q, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + dur + 0.02);
  },

  tone(freq, endFreq, dur, type = 'triangle', gainVal = 0.08, delay = 0) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freq), now);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + dur);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  },

  playHit(isCrit = false, hitStep = 0) {
    if (this.muted) return;
    const pitch = 1 + Math.min(hitStep, 5) * 0.09;
    if (isCrit) {
      // Heavy sub-bass thump + crisp metallic crunch + golden ring!
      this.tone(155 * pitch, 34, 0.22, 'sine', 0.2);
      this.tone(260 * pitch, 65, 0.16, 'sawtooth', 0.11);
      this.noise(0.14, 2400 * pitch, 0.9, 0.18);
      this.tone(820 * pitch, 1240 * pitch, 0.14, 'triangle', 0.07, 0.02);
    } else {
      // Meaty punch + sharp blade snap!
      this.tone(130 * pitch, 40, 0.13, 'sine', 0.15);
      this.tone(220 * pitch, 78, 0.1, 'sawtooth', 0.08);
      this.noise(0.08, 1900 * pitch, 1.3, 0.13);
    }
  },

  play(kind) {
    if (this.muted) return;
    if (kind === 'card') {
      this.noise(0.05, 2800, 2.0, 0.05);
      this.tone(340, 560, 0.06, 'sine', 0.045);
    } else if (kind === 'hit') {
      this.playHit(false, 0);
    } else if (kind === 'crit') {
      this.playHit(true, 0);
    } else if (kind === 'kill') {
      this.tone(140, 32, 0.34, 'sine', 0.22);
      this.noise(0.22, 1100, 0.7, 0.2);
      this.tone(440, 880, 0.18, 'triangle', 0.07, 0.04);
    } else if (kind === 'playerHit') {
      this.tone(110, 32, 0.22, 'sine', 0.2);
      this.tone(160, 54, 0.18, 'sawtooth', 0.12);
      this.noise(0.14, 850, 1.0, 0.16);
    } else if (kind === 'block') {
      // Metallic shield clang!
      this.noise(0.06, 3600, 2.8, 0.1);
      this.tone(620, 420, 0.11, 'triangle', 0.09);
      this.tone(1180, 860, 0.1, 'sine', 0.06, 0.015);
    } else if (kind === 'heal') {
      this.tone(523, 659, 0.14, 'sine', 0.06);
      this.tone(659, 880, 0.16, 'sine', 0.06, 0.07);
    } else if (kind === 'fire') {
      this.noise(0.22, 720, 0.7, 0.17);
      this.tone(240, 62, 0.22, 'sawtooth', 0.1);
    } else if (kind === 'frost') {
      this.noise(0.11, 4400, 2.2, 0.11);
      this.tone(1240, 740, 0.15, 'sine', 0.07);
      this.tone(1680, 1080, 0.13, 'triangle', 0.05, 0.025);
    } else if (kind === 'lightning') {
      this.noise(0.13, 3200, 0.8, 0.17);
      this.tone(980, 180, 0.1, 'sawtooth', 0.09);
      this.tone(1420, 260, 0.1, 'square', 0.06, 0.035);
    } else if (kind === 'poison') {
      this.noise(0.14, 1400, 2.4, 0.08);
      this.tone(310, 180, 0.15, 'sine', 0.06);
    } else if (kind === 'holy') {
      this.tone(587, 880, 0.16, 'sine', 0.08);
      this.tone(880, 1318, 0.22, 'triangle', 0.07, 0.05);
      this.noise(0.08, 3400, 1.5, 0.07, 0.02);
    } else if (kind === 'doom') {
      this.tone(140, 36, 0.38, 'sine', 0.22);
      this.tone(165, 48, 0.34, 'sawtooth', 0.13);
      this.noise(0.24, 650, 0.8, 0.18, 0.03);
    } else if (kind === 'burst') {
      this.tone(150, 52, 0.2, 'sine', 0.15);
      this.tone(392, 659, 0.15, 'triangle', 0.09);
      this.tone(659, 1046, 0.24, 'sine', 0.09, 0.06);
      this.noise(0.14, 2200, 1.0, 0.1, 0.02);
    } else if (kind === 'dice') {
      this.tone(480, 620, 0.05, 'triangle', 0.06);
      this.tone(540, 720, 0.05, 'triangle', 0.06, 0.06);
      this.tone(660, 880, 0.11, 'sine', 0.07, 0.12);
    } else if (kind === 'gold') {
      this.tone(988, 1318, 0.09, 'sine', 0.05);
      this.tone(1318, 1568, 0.11, 'sine', 0.05, 0.05);
    } else if (kind === 'victory') {
      this.tone(523, 523, 0.12, 'triangle', 0.08, 0);
      this.tone(659, 659, 0.12, 'triangle', 0.08, 0.1);
      this.tone(784, 1046, 0.28, 'sine', 0.1, 0.2);
    } else if (kind === 'defeat') {
      this.tone(330, 260, 0.18, 'sawtooth', 0.08, 0);
      this.tone(240, 110, 0.36, 'sawtooth', 0.1, 0.16);
    }
  }
};

const VfxEngine = {
  canvas: null,
  ctx: null,
  dpr: 1,
  w: 0,
  h: 0,
  rafId: null,
  particles: [],
  sparks: [],
  slashes: [],
  rings: [],
  bolts: [],
  flashes: [],
  projectiles: [],
  pillars: [],
  meteors: [],
  sigils: [],
  reducedMotion: false,

  PALETTES: {
    fire: ['#ff6b6b', '#ff9f43', '#feca57', '#fff200'],
    frost: ['#74b9ff', '#00d2d3', '#c7ecee', '#ffffff'],
    lightning: ['#f6e58d', '#7ed6df', '#ffffff', '#e056fd'],
    blood: ['#eb3b5a', '#fc5c65', '#ff6b81', '#b33939'],
    poison: ['#2ed573', '#7bed9f', '#badc58', '#1dd1a1'],
    holy: ['#f6c967', '#ffeaa7', '#ffffff', '#f9ca24'],
    doom: ['#9b59b6', '#e056fd', '#ff4757', '#2f3542'],
    block: ['#74b9ff', '#00d2d3', '#dff9fb', '#54a0ff'],
    heal: ['#2ed573', '#55efc4', '#ffeaa7', '#ffffff'],
    trap: ['#ff9f43', '#f6c967', '#55efc4', '#ff6b6b'],
    gold: ['#f6c967', '#ffd32a', '#ffeaa7', '#ffffff']
  },

  init() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.reducedMotion =
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      this.isVfxDisabledByUser();
    this.canvas = document.getElementById('vfx-canvas');
    if (!this.canvas || !this.canvas.getContext) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    if (!this._resizeBound) {
      this._resizeBound = true;
      window.addEventListener('resize', () => this.resize(), { passive: true });
    }
  },

  isVfxDisabledByUser() {
    try {
      return localStorage.getItem('DND5E_SPIRE_2_VFX_OFF') === '1';
    } catch (e) {
      return false;
    }
  },

  setVfxEnabled(enabled) {
    try {
      localStorage.setItem('DND5E_SPIRE_2_VFX_OFF', enabled ? '0' : '1');
    } catch (e) { }
    this.reducedMotion = !enabled;
  },

  resize() {
    if (!this.canvas || !this.ctx || typeof window === 'undefined') return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  },

  getAnchor(targetType, enemyIdx = 0) {
    if (typeof document === 'undefined') return null;
    let el = null;
    if (targetType === 'player') {
      el = document.getElementById('player-unit-card');
    } else if (targetType === 'enemy') {
      el =
        document.querySelector(`#enemies-zone .enemy-unit[data-en-idx="${enemyIdx}"]`) ||
        document.querySelectorAll('#enemies-zone .enemy-unit')[enemyIdx] ||
        document.querySelector('#enemies-zone .enemy-unit');
    }
    if (!el || !el.getBoundingClientRect) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.44, rect: r, el };
  },

  ensureRunning() {
    if (this.rafId || !this.ctx || typeof requestAnimationFrame === 'undefined') return;
    const step = () => {
      this.tick();
      if (
        this.particles.length ||
        this.sparks.length ||
        this.slashes.length ||
        this.rings.length ||
        this.bolts.length ||
        this.flashes.length ||
        this.projectiles.length ||
        this.pillars.length ||
        this.meteors.length ||
        this.sigils.length
      ) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.rafId = null;
      }
    };
    this.rafId = requestAnimationFrame(step);
  },

  haptic(ms = 16) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) { }
    }
  },

  flash(x, y, radius = 58, color = '#ffffff') {
    if (this.reducedMotion || !this.ctx) return;
    this.flashes.push({ x, y, radius, color, life: 0, maxLife: 9 });
    this.ensureRunning();
  },

  sparkSpray(x, y, count = 12, color = '#ffeaa7', dirX = 1) {
    if (this.reducedMotion || !this.ctx) return;
    const n = this.w < 768 ? Math.ceil(count * 0.65) : count;
    for (let i = 0; i < n; i++) {
      const spread = (Math.random() - 0.5) * 1.9;
      const baseAngle = dirX >= 0 ? spread : Math.PI + spread;
      const spd = 6.5 + Math.random() * 9.5;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(baseAngle) * spd,
        vy: Math.sin(baseAngle) * spd - 1.2,
        len: 10 + Math.random() * 14,
        color,
        life: 0,
        maxLife: 13 + Math.floor(Math.random() * 9)
      });
    }
    this.ensureRunning();
  },

  projectile(x1, y1, x2, y2, color = '#ffeaa7') {
    if (this.reducedMotion || !this.ctx) return;
    this.projectiles.push({ x1, y1, x2, y2, color, life: 0, maxLife: 8 });
    this.ensureRunning();
  },

  damageVignette() {
    const layer = typeof document !== 'undefined' ? document.getElementById('vfx-layer') : null;
    if (!layer || this.reducedMotion) return;
    const old = layer.querySelector('.vfx-damage-vignette');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const el = document.createElement('div');
    el.className = 'vfx-damage-vignette';
    layer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 380);
  },

  killBurst(enemyIdx = 0) {
    const a = this.getAnchor('enemy', enemyIdx);
    if (!a) return;
    SfxEngine.play('kill');
    this.haptic(38);
    this.flash(a.x, a.y, 92, '#ffeaa7');
    this.ring(a.x, a.y, '#f6c967', 105);
    this.ring(a.x, a.y, '#ff6b81', 78);
    this.sparkSpray(a.x, a.y, 20, '#f6c967', 1);
    this.sparkSpray(a.x, a.y, 12, '#ff6b81', -1);
    this.burst(a.x, a.y, 'fire', 28);
    this.screenShake('heavy');
  },

  burst(x, y, theme = 'fire', count = 16) {
    if (this.reducedMotion || !this.ctx) return;
    const colors = this.PALETTES[theme] || this.PALETTES.fire;
    const n = this.w < 768 ? Math.ceil(count * 0.65) : count;
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.5;
      const spd = 2.2 + Math.random() * 5.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - (theme === 'heal' || theme === 'fire' ? 1.8 : 0.4),
        size: 2.2 + Math.random() * 3.8,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0,
        maxLife: 22 + Math.floor(Math.random() * 16),
        gravity: theme === 'heal' ? -0.09 : theme === 'frost' ? 0.04 : 0.14
      });
    }
    this.ensureRunning();
  },

  slash(x, y, color = '#ffeaa7', isDouble = false) {
    if (this.reducedMotion || !this.ctx) return;
    const addArc = angle => {
      this.slashes.push({ x, y, angle, color, life: 0, maxLife: 16, radius: 52 + Math.random() * 18 });
    };
    addArc(-0.65 + (Math.random() - 0.5) * 0.4);
    if (isDouble) addArc(0.65 + (Math.random() - 0.5) * 0.3);
    this.ensureRunning();
  },

  ring(x, y, color = '#74b9ff', maxRadius = 68) {
    if (this.reducedMotion || !this.ctx) return;
    this.rings.push({ x, y, color, radius: 10, maxRadius, life: 0, maxLife: 22 });
    this.ensureRunning();
  },

  bolt(x1, y1, x2, y2, color = '#7ed6df') {
    if (this.reducedMotion || !this.ctx) return;
    const pts = [{ x: x1, y: y1 }];
    const segs = 6;
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      pts.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 34,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 28
      });
    }
    pts.push({ x: x2, y: y2 });
    this.bolts.push({ pts, color, life: 0, maxLife: 15 });
    this.ensureRunning();
  },

  pillar(x, y, color = '#f6c967', width = 44) {
    if (this.reducedMotion || !this.ctx) return;
    this.pillars.push({ x, y, color, width, life: 0, maxLife: 24 });
    this.ensureRunning();
  },

  meteor(tx, ty, color = '#ff9f43', size = 14) {
    if (this.reducedMotion || !this.ctx) return;
    const sx = tx - (140 + Math.random() * 110);
    const sy = Math.max(0, ty - (210 + Math.random() * 110));
    this.meteors.push({ sx, sy, tx, ty, color, size, life: 0, maxLife: 14 });
    this.ensureRunning();
  },

  sigil(x, y, color = '#f6c967', maxRadius = 74) {
    if (this.reducedMotion || !this.ctx) return;
    this.sigils.push({ x, y, color, maxRadius, angle: Math.random() * Math.PI, life: 0, maxLife: 28 });
    this.ensureRunning();
  },

  // Subculture Anime Legendary Skill Cut-In Banner (non-blocking 0.92s!)
  legendaryCutin(tpl, theme = 'gold', charId = 'fighter') {
    const layer = typeof document !== 'undefined' ? document.getElementById('vfx-layer') : null;
    if (!layer || this.reducedMotion || !tpl) return;
    const old = layer.querySelector('.vfx-legendary-cutin');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const _ps = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
    const spriteHtml = _ps && _ps.getHeroEmotionSprite
      ? _ps.getHeroEmotionSprite(charId, 'smug')
      : '';
    const el = document.createElement('div');
    el.className = `vfx-legendary-cutin theme-${theme}`;
    el.innerHTML = `
      <div class="leg-cutin-lines"></div>
      <div class="leg-cutin-sprite">${spriteHtml}</div>
      <div class="leg-cutin-copy">
        <span class="leg-cutin-tag">★ LEGENDARY ULTIMATE ★</span>
        <strong class="leg-cutin-name">${tpl.name}</strong>
      </div>
    `;
    layer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 940);
  },

  // Card-Matched & Rarity-Scaled Skill Choreography (Common = crisp/simple -> Legendary = epic finale!)
  playCardSpectacle(profile, targetIndices = [0], charId = 'fighter') {
    if (!profile || this.reducedMotion) return;
    const { rarity, theme, style, tpl } = profile;
    const pal = this.PALETTES[theme] || this.PALETTES.gold;
    const primary = pal[0] || '#f6c967';
    const secondary = pal[1] || '#ffffff';
    const pAnchor = this.getAnchor('player');
    const eAnchors = targetIndices.map(i => this.getAnchor('enemy', i)).filter(Boolean);
    const mainTarget = eAnchors[0] || pAnchor;

    // 1. COMMON: Simple, snappy, zero clutter!
    if (rarity === 'common') {
      if (style === 'guard' && pAnchor) {
        this.ring(pAnchor.x, pAnchor.y, '#74b9ff', 44);
      } else if ((style === 'heal' || style === 'power') && pAnchor) {
        this.burst(pAnchor.x, pAnchor.y, theme === 'heal' ? 'heal' : 'gold', 7);
      } else if (style === 'curse' && mainTarget) {
        this.burst(mainTarget.x, mainTarget.y, theme === 'doom' ? 'doom' : 'poison', 8);
      }
      return;
    }

    // 2. UNCOMMON: Clean card-archetype accent!
    if (rarity === 'uncommon') {
      if ((style === 'guard' || style === 'heal' || style === 'power') && pAnchor) {
        this.ring(pAnchor.x, pAnchor.y, primary, 60);
        this.burst(pAnchor.x, pAnchor.y, theme, 12);
      } else if (style === 'ranged' && pAnchor && mainTarget) {
        this.projectile(pAnchor.x, pAnchor.y - 6, mainTarget.x, mainTarget.y, primary);
        this.sparkSpray(mainTarget.x, mainTarget.y, 10, secondary, 1);
      } else if (style === 'curse' && mainTarget) {
        this.ring(mainTarget.x, mainTarget.y, primary, 56);
        this.burst(mainTarget.x, mainTarget.y, theme, 14);
      }
      return;
    }

    // 3. RARE: Dynamic 2-layer elemental spectacle + light shake!
    if (rarity === 'rare') {
      if (pAnchor) this.sigil(pAnchor.x, pAnchor.y + 8, primary, 58);
      if (style === 'guard' || style === 'heal' || style === 'power') {
        if (pAnchor) {
          this.flash(pAnchor.x, pAnchor.y, 72, secondary);
          this.ring(pAnchor.x, pAnchor.y, primary, 82);
          this.ring(pAnchor.x, pAnchor.y, secondary, 56);
          this.burst(pAnchor.x, pAnchor.y, theme, 20);
        }
      } else {
        eAnchors.forEach((a, idx) => {
          setTimeout(() => {
            if (style === 'spell_aoe' || theme === 'fire') {
              this.meteor(a.x, a.y, primary, 11);
              this.ring(a.x, a.y, primary, 78);
            } else if (theme === 'holy' || theme === 'doom') {
              this.pillar(a.x, a.y, primary, 36);
              this.ring(a.x, a.y, secondary, 76);
            } else if (theme === 'lightning' && pAnchor) {
              this.bolt(pAnchor.x, pAnchor.y, a.x, a.y, primary);
              this.bolt(pAnchor.x, pAnchor.y - 12, a.x, a.y + 10, secondary);
            } else if (style === 'ranged' && pAnchor) {
              this.projectile(pAnchor.x, pAnchor.y - 10, a.x, a.y - 8, primary);
              this.projectile(pAnchor.x, pAnchor.y + 8, a.x, a.y + 8, secondary);
            } else {
              this.slash(a.x, a.y, primary, true);
              this.ring(a.x, a.y, secondary, 74);
            }
            this.burst(a.x, a.y, theme, 18);
          }, idx * 55);
        });
        this.screenShake('light');
      }
      return;
    }

    // 4. LEGENDARY: FULL CINEMATIC ANIME CUT-IN + 3-WAVE CANVAS ULTIMATE FINALE!
    SfxEngine.play(theme === 'holy' || theme === 'heal' ? 'holy' : 'burst');
    this.haptic(45);
    this.legendaryCutin(tpl, theme, charId);

    // Wave 1 (0ms): Rotating magic sigil & aura ignition on Hero!
    if (pAnchor) {
      this.sigil(pAnchor.x, pAnchor.y + 6, primary, 92);
      this.flash(pAnchor.x, pAnchor.y, 95, secondary);
      this.ring(pAnchor.x, pAnchor.y, primary, 98);
      this.burst(pAnchor.x, pAnchor.y, theme, 24);
    }

    // Wave 2 (130ms): Signature Ultimate Phenomenon per Card Style/Theme!
    setTimeout(() => {
      const victims = eAnchors.length ? eAnchors : (pAnchor ? [pAnchor] : []);
      if (style === 'guard' || style === 'heal' || (style === 'power' && !tpl.damage && !tpl.dmg)) {
        if (pAnchor) {
          this.pillar(pAnchor.x, pAnchor.y, primary, 66);
          this.sigil(pAnchor.x, pAnchor.y, secondary, 118);
          this.ring(pAnchor.x, pAnchor.y, primary, 130);
          this.burst(pAnchor.x, pAnchor.y, theme, 34);
          this.sparkSpray(pAnchor.x, pAnchor.y, 24, primary, 1);
          this.sparkSpray(pAnchor.x, pAnchor.y, 24, secondary, -1);
        }
        this.screenShake('light');
      } else {
        victims.forEach((a, idx) => {
          setTimeout(() => {
            if (theme === 'fire' || style === 'ranged' || /메테오|화살|폭풍|재앙|아포칼립스/.test(tpl.name)) {
              for (let m = 0; m < 4; m++) {
                this.meteor(a.x + (m - 1.5) * 28, a.y + (m % 2 ? -10 : 12), m % 2 ? primary : secondary, 16);
              }
            } else if (theme === 'holy' || theme === 'doom' || /심판|죽음|강림|지옥|후광|정지/.test(tpl.name)) {
              this.pillar(a.x, a.y, primary, 64);
              this.sigil(a.x, a.y, secondary, 96);
            } else if (theme === 'lightning' && pAnchor) {
              for (let b = 0; b < 3; b++) {
                this.bolt(pAnchor.x, pAnchor.y + (b - 1) * 14, a.x + (b - 1) * 18, a.y, b === 1 ? '#ffffff' : primary);
              }
            } else {
              // Omnislash quad cross-cuts!
              this.slash(a.x, a.y, primary, true);
              this.slash(a.x + 8, a.y - 6, '#ffffff', true);
            }
            this.flash(a.x, a.y, 115, secondary);
            this.ring(a.x, a.y, primary, 120);
            this.sparkSpray(a.x, a.y, 26, primary, 1);
            this.burst(a.x, a.y, theme, 32);
          }, idx * 70);
        });
        this.screenShake('heavy');
      }
    }, 130);

    // Wave 3 (280ms): Finishing shockwave detonation!
    setTimeout(() => {
      const fin = eAnchors[0] || pAnchor;
      if (!fin) return;
      this.ring(fin.x, fin.y, '#ffffff', 142);
      this.ring(fin.x, fin.y, primary, 112);
      this.burst(fin.x, fin.y, theme, 26);
    }, 280);
  },

  effectOnTarget(targetType, enemyIdx, kind, scale = 1.0) {
    const a = this.getAnchor(targetType, enemyIdx);
    if (!a) return;
    const p = this.getAnchor('player');
    const dirX = targetType === 'enemy' ? 1 : -1;
    const sc = Math.max(0.45, Math.min(2.0, scale || 1.0));
    const cnt = n => Math.max(4, Math.round(n * sc));
    const rad = r => Math.round(r * (0.68 + sc * 0.32));

    if (kind === 'slash') {
      if (sc >= 0.85 && p && targetType === 'enemy') this.projectile(p.x, p.y, a.x, a.y, '#ffeaa7');
      this.flash(a.x, a.y, rad(50), '#ffffff');
      this.slash(a.x, a.y, '#ffeaa7', sc >= 1.35);
      this.sparkSpray(a.x, a.y, cnt(10), '#ffeaa7', dirX);
      this.burst(a.x, a.y, 'blood', cnt(10));
      if (sc >= 1.35) this.ring(a.x, a.y, '#ffeaa7', rad(72));
      this.haptic(sc < 0.7 ? 8 : 14);
    } else if (kind === 'crit') {
      if (p && targetType === 'enemy') this.projectile(p.x, p.y, a.x, a.y, '#f6c967');
      this.flash(a.x, a.y, rad(82), '#fff7cc');
      this.slash(a.x, a.y, '#f6c967', true);
      this.ring(a.x, a.y, '#f6c967', rad(84));
      this.sparkSpray(a.x, a.y, cnt(18), '#f6c967', dirX);
      this.burst(a.x, a.y, 'fire', cnt(20));
      this.screenShake(sc >= 1.3 ? 'heavy' : 'light');
      this.haptic(sc >= 1.3 ? 32 : 18);
    } else if (kind === 'fire') {
      if (sc >= 0.75 && p && targetType === 'enemy') this.projectile(p.x, p.y, a.x, a.y, '#ff9f43');
      this.flash(a.x, a.y, rad(64), '#ffd27d');
      if (sc >= 0.8) this.ring(a.x, a.y, '#ff9f43', rad(72));
      this.sparkSpray(a.x, a.y, cnt(12), '#ff9f43', dirX);
      this.burst(a.x, a.y, 'fire', cnt(18));
      this.haptic(sc < 0.7 ? 10 : 18);
    } else if (kind === 'frost') {
      if (sc >= 0.75 && p && targetType === 'enemy') this.projectile(p.x, p.y, a.x, a.y, '#74b9ff');
      this.flash(a.x, a.y, rad(56), '#dff9fb');
      if (sc >= 0.8) this.ring(a.x, a.y, '#00d2d3', rad(64));
      this.sparkSpray(a.x, a.y, cnt(11), '#74b9ff', dirX);
      this.burst(a.x, a.y, 'frost', cnt(15));
      this.haptic(sc < 0.7 ? 8 : 14);
    } else if (kind === 'lightning') {
      if (p) this.bolt(p.x, p.y, a.x, a.y, '#7ed6df');
      if (sc >= 1.35 && p) this.bolt(p.x, p.y - 10, a.x, a.y + 8, '#f6e58d');
      this.flash(a.x, a.y, rad(62), '#e0f7fa');
      this.sparkSpray(a.x, a.y, cnt(13), '#f6e58d', dirX);
      this.burst(a.x, a.y, 'lightning', cnt(15));
      this.haptic(sc < 0.7 ? 10 : 18);
    } else if (kind === 'poison') {
      if (sc >= 1.3) this.ring(a.x, a.y, '#2ed573', rad(66));
      this.burst(a.x, a.y, 'poison', cnt(15));
    } else if (kind === 'holy') {
      if (p && targetType === 'enemy') this.bolt(p.x, p.y, a.x, a.y, '#f6c967');
      this.flash(a.x, a.y, rad(68), '#fff9d6');
      if (sc >= 0.8) this.ring(a.x, a.y, '#f6c967', rad(72));
      this.sparkSpray(a.x, a.y, cnt(13), '#ffeaa7', dirX);
      this.burst(a.x, a.y, 'holy', cnt(17));
      this.haptic(sc < 0.7 ? 10 : 20);
    } else if (kind === 'doom') {
      this.flash(a.x, a.y, rad(88), '#f3a6ff');
      if (sc >= 0.8) this.ring(a.x, a.y, '#e056fd', rad(98));
      this.sparkSpray(a.x, a.y, cnt(20), '#e056fd', dirX);
      this.burst(a.x, a.y, 'doom', cnt(24));
      if (sc >= 1.1) this.screenShake('heavy');
      this.haptic(sc < 0.7 ? 14 : 36);
    } else if (kind === 'block') {
      this.flash(a.x, a.y, rad(42), '#c7ecee');
      this.ring(a.x, a.y, '#74b9ff', rad(64));
      this.sparkSpray(a.x, a.y, cnt(9), '#74b9ff', -1);
      this.burst(a.x, a.y, 'block', cnt(11));
      this.haptic(8);
    } else if (kind === 'heal') {
      if (sc >= 1.2) this.ring(a.x, a.y, '#55efc4', rad(74));
      this.burst(a.x, a.y, 'heal', cnt(15));
    } else if (kind === 'trap') {
      this.flash(a.x, a.y, rad(54), '#ffeaa7');
      this.ring(a.x, a.y, '#ff9f43', rad(62));
      this.sparkSpray(a.x, a.y, cnt(12), '#ff9f43', dirX);
      this.burst(a.x, a.y, 'trap', cnt(14));
      this.haptic(14);
    } else if (kind === 'blood') {
      this.flash(a.x, a.y, rad(52), '#ffcccc');
      this.slash(a.x, a.y, '#ff4757', sc >= 1.35);
      this.sparkSpray(a.x, a.y, cnt(13), '#ff4757', dirX);
      this.burst(a.x, a.y, 'blood', cnt(16));
      this.haptic(18);
    }
  },

  floatText(targetType, text, colorClass = 'vfx-dmg', enemyIdx = 0) {
    const layer = typeof document !== 'undefined' ? document.getElementById('vfx-layer') : null;
    const anchor = this.getAnchor(targetType, enemyIdx);
    if (!layer || !anchor) return;
    const pop = document.createElement('div');
    pop.className = `floating-vfx ${colorClass}`;
    pop.textContent = text;
    const jitterX = (Math.random() - 0.5) * 44;
    const jitterY = (Math.random() - 0.5) * 18;
    pop.style.left = `${Math.round(anchor.x + jitterX)}px`;
    pop.style.top = `${Math.round(anchor.y - 12 + jitterY)}px`;
    layer.appendChild(pop);
    if (colorClass === 'vfx-dmg' || colorClass === 'vfx-crit' || colorClass === 'vfx-doom') {
      this.screenShake(colorClass === 'vfx-dmg' ? 'light' : 'heavy');
    }
    setTimeout(() => {
      if (pop.parentNode) pop.parentNode.removeChild(pop);
    }, 900);
  },

  banner(text, theme = 'gold') {
    const layer = typeof document !== 'undefined' ? document.getElementById('vfx-layer') : null;
    if (!layer || this.reducedMotion) return;
    const old = layer.querySelector('.vfx-callout-banner');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const el = document.createElement('div');
    el.className = `vfx-callout-banner banner-${theme}`;
    el.textContent = text;
    layer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1150);
  },

  screenShake(intensity = 'light') {
    if (this.reducedMotion || typeof document === 'undefined') return;
    const arena = document.querySelector('#screen-combat .combat-arena');
    if (!arena) return;
    const cls = intensity === 'heavy' ? 'arena-shake-heavy' : 'arena-shake-light';
    arena.classList.remove('arena-shake-light', 'arena-shake-heavy');
    void arena.offsetWidth;
    arena.classList.add(cls);
  },

  tick() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // 0. Additive Impact Flashes
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.life++;
      const p = f.life / f.maxLife;
      const r = f.radius * (0.4 + p * 0.75);
      const grad = ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, r);
      grad.addColorStop(0, f.color);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save();
      ctx.globalAlpha = Math.max(0, (1 - p) * 0.9);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (f.life >= f.maxLife) this.flashes.splice(i, 1);
    }

    // 0.5. Fast Projectile Comet Streaks
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.life++;
      const p = pr.life / pr.maxLife;
      const headX = pr.x1 + (pr.x2 - pr.x1) * Math.min(1, p * 1.25);
      const headY = pr.y1 + (pr.y2 - pr.y1) * Math.min(1, p * 1.25);
      const tailT = Math.max(0, p * 1.25 - 0.45);
      const tailX = pr.x1 + (pr.x2 - pr.x1) * tailT;
      const tailY = pr.y1 + (pr.y2 - pr.y1) * tailT;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p * 0.85);
      ctx.strokeStyle = pr.color;
      ctx.shadowColor = pr.color;
      ctx.shadowBlur = 14;
      ctx.lineWidth = Math.max(2, 6 * (1 - p * 0.6));
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();
      ctx.restore();
      if (pr.life >= pr.maxLife) this.projectiles.splice(i, 1);
    }

    // 1. Expanding Shockwave Rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life++;
      const p = r.life / r.maxLife;
      const curR = r.radius + (r.maxRadius - r.radius) * (1 - Math.pow(1 - p, 3));
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = Math.max(1, 5.5 * (1 - p));
      ctx.beginPath();
      ctx.arc(r.x, r.y, curR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      if (r.life >= r.maxLife) this.rings.splice(i, 1);
    }

    // 2. Curved Blade Slashes (thicker & brighter!)
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      const s = this.slashes[i];
      s.life++;
      const p = s.life / s.maxLife;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.strokeStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 14;
      ctx.lineWidth = Math.max(2, 10 * (1 - p));
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, s.radius, -1.0 + p * 0.55, 1.0 - p * 0.15);
      ctx.stroke();
      ctx.restore();
      if (s.life >= s.maxLife) this.slashes.splice(i, 1);
    }

    // 3. Jagged Lightning / Holy Beams
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i];
      b.life++;
      const p = b.life / b.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.strokeStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 14;
      ctx.lineWidth = Math.max(1.5, 5.5 * (1 - p));
      ctx.beginPath();
      b.pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.restore();
      if (b.life >= b.maxLife) this.bolts.splice(i, 1);
    }

    // 3.5. High-Velocity Directional Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.life++;
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.28;
      sp.vx *= 0.91;
      const p = sp.life / sp.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.strokeStyle = sp.color;
      ctx.lineWidth = Math.max(1.2, 3 * (1 - p));
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(sp.x - sp.vx * 1.4, sp.y - sp.vy * 1.4);
      ctx.stroke();
      ctx.restore();
      if (sp.life >= sp.maxLife) this.sparks.splice(i, 1);
    }

    // 3.6. Sky-to-Ground Ultimate Light Pillars (Rare & Legendary!)
    for (let i = this.pillars.length - 1; i >= 0; i--) {
      const pl = this.pillars[i];
      pl.life++;
      const p = pl.life / pl.maxLife;
      const curW = pl.width * (p < 0.28 ? p / 0.28 : 1 - (p - 0.28) * 0.88);
      if (curW > 1) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, (1 - p) * 0.88);
        const grad = ctx.createLinearGradient(pl.x - curW, 0, pl.x + curW, 0);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.28, pl.color);
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(0.72, pl.color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(pl.x - curW, 0, curW * 2, pl.y + 42);
        ctx.restore();
      }
      if (pl.life >= pl.maxLife) this.pillars.splice(i, 1);
    }

    // 3.7. Diagonal Falling Meteors / Arrow Storms (Rare & Legendary!)
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.life++;
      const p = Math.min(1, m.life / m.maxLife);
      const x = m.sx + (m.tx - m.sx) * p;
      const y = m.sy + (m.ty - m.sy) * p;
      const tx = m.sx + (m.tx - m.sx) * Math.max(0, p - 0.36);
      const ty = m.sy + (m.ty - m.sy) * Math.max(0, p - 0.36);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, p - 0.78) * 4);
      ctx.strokeStyle = m.color;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 16;
      ctx.lineWidth = Math.max(3, m.size * 0.65);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, m.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (m.life >= m.maxLife) this.meteors.splice(i, 1);
    }

    // 3.8. Rotating Arcane / Divine Magic Sigils (Rare & Legendary!)
    for (let i = this.sigils.length - 1; i >= 0; i--) {
      const sg = this.sigils[i];
      sg.life++;
      const p = sg.life / sg.maxLife;
      const r = sg.maxRadius * (0.45 + 0.55 * (1 - Math.pow(1 - p, 3)));
      const rot = sg.angle + p * 1.8;
      ctx.save();
      ctx.translate(sg.x, sg.y);
      ctx.rotate(rot);
      ctx.globalAlpha = Math.max(0, (1 - p) * 0.85);
      ctx.strokeStyle = sg.color;
      ctx.shadowColor = sg.color;
      ctx.shadowBlur = 12;
      ctx.lineWidth = Math.max(1.2, 3.2 * (1 - p));
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.74, 0, Math.PI * 2);
      ctx.stroke();
      // 6-point hexagram star inside sigil
      for (let t = 0; t < 2; t++) {
        ctx.beginPath();
        for (let k = 0; k < 3; k++) {
          const ang = (Math.PI * 2 * k) / 3 + (t ? Math.PI : 0);
          const px = Math.cos(ang) * r * 0.96;
          const py = Math.sin(ang) * r * 0.96;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
      if (sg.life >= sg.maxLife) this.sigils.splice(i, 1);
    }

    // 4. Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life++;
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += pt.gravity;
      pt.vx *= 0.96;
      const p = pt.life / pt.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(0.8, pt.size * (1 - p * 0.6)), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (pt.life >= pt.maxLife) this.particles.splice(i, 1);
    }
  }
};

const Game = {
  meta: {
    gems: 300, // Earned by climbing the Spire! Used for Class Rank Promotion, Magic Gear & Feats
    selectedCharId: 'fighter',
    bestAct: 1,
    bestStage: 1,
    totalClimbs: 0,
    // Starter Roster: 3 Core Classes unlocked initially (Fighter, Rogue, Wizard)
    // Remaining 5 Classes, 16 Advanced Subclasses & Legendary Cards unlock via Achievements!
    unlocked: {
      fighter: true,
      barbarian: false,
      rogue: true,
      ranger: false,
      wizard: true,
      cleric: false,
      paladin: false,
      warlock: false
    },
    unlockedSubclasses: {},
    unlockedLegendaries: {},
    achievements: {},
    achStats: null,
    ranks: {
      fighter: 'C',
      barbarian: 'C',
      rogue: 'C',
      ranger: 'C',
      wizard: 'C',
      cleric: 'C',
      paladin: 'C',
      warlock: 'C'
    },
    levels: {
      fighter: 1,
      barbarian: 1,
      rogue: 1,
      ranger: 1,
      wizard: 1,
      cleric: 1,
      paladin: 1,
      warlock: 1
    },
    // Highest floor reached per class
    classBestFloor: {
      fighter: '1층 1F',
      barbarian: '1층 1F',
      rogue: '1층 1F',
      ranger: '1층 1F',
      wizard: '1층 1F',
      cleric: '1층 1F',
      paladin: '1층 1F',
      warlock: '1층 1F'
    },
    gearUnlocked: {
      c_dagger: true,
      c_vest: true,
      c_ring: true
    },
    gearLevels: {
      c_dagger: 0,
      c_vest: 0,
      c_ring: 0
    },
    equipped: {
      weapon: 'c_dagger',
      armor: 'c_vest',
      accessory: 'c_ring'
    },
    masteryLevels: {
      vitality_training: 0,
      mana_circulation: 0,
      tactical_intel: 0,
      guild_funding: 0,
      exp_accelerator: 0,
      core_overdrive: 0
    }
  },

  run: null,
  combat: null,
  deckModalMode: 'all',
  pendingShopCost: 0,

  init() {
    SfxEngine.init();
    VfxEngine.init();
    this.applySavedUserPrefs();
    this.loadMeta();
    this.bindKeyboardControls();
    this.syncSceneBackground('screen-hub');
    this.updateTopHud();
    this.renderHub();
  },

  toggleSound() {
    SfxEngine.toggleMute();
  },

  // --------------------------------------------------------------------------
  // FULL KEYBOARD CONTROLS (Slay the Spire 1 Style Hotkeys!)
  // --------------------------------------------------------------------------
  bindKeyboardControls() {
    if (this._keyboardBound) return;
    this._keyboardBound = true;
    window.addEventListener('keydown', e => this.handleKeyDown(e));
  },

  handleKeyDown(e) {
    // Ignore when typing inside an input/textarea or with Ctrl/Alt/Meta combos
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const key = e.key;
    const lower = key.toLowerCase();

    const isVisible = id => {
      const el = document.getElementById(id);
      return el && !el.classList.contains('hidden');
    };
    const isActiveScreen = id => {
      const el = document.getElementById(id);
      return el && el.classList.contains('active');
    };

    // 1. Top-priority Modals
    if (isVisible('modal-d20')) {
      if (key === 'Enter' || key === ' ' || key === 'Escape') {
        e.preventDefault();
        this.closeD20Modal();
      }
      return;
    }

    if (isVisible('modal-gameover')) {
      if (key === 'Enter' || key === ' ' || key === 'Escape') {
        e.preventDefault();
        this.closeGameOverAndHub();
      }
      return;
    }

    if (isVisible('modal-reward')) {
      const cards = document.querySelectorAll('#reward-cards-row .game-card');
      if (key >= '1' && key <= '3') {
        const idx = parseInt(key, 10) - 1;
        if (cards[idx]) {
          e.preventDefault();
          cards[idx].click();
        }
      } else if (key === 'Enter' || key === ' ' || key === 'Escape' || lower === 's') {
        e.preventDefault();
        const skipBtn = document.querySelector('#modal-reward .reward-footer button');
        if (skipBtn) skipBtn.click();
      }
      return;
    }

    if (isVisible('modal-run-stats')) {
      const keys = ['str', 'dex', 'vit', 'mana'];
      if (key >= '1' && key <= '4') {
        e.preventDefault();
        this.allocateStatPoint(keys[parseInt(key, 10) - 1]);
      } else if (key === 'Escape' || lower === 'c') {
        e.preventDefault();
        this.closeRunStatModal();
      }
      return;
    }

    if (isVisible('modal-deck')) {
      if (key === 'Escape' || lower === 'd' || lower === 'a' || lower === 's') {
        e.preventDefault();
        this.closeDeckModal();
      } else if (key >= '1' && key <= '9') {
        const idx = parseInt(key, 10) - 1;
        const cards = document.querySelectorAll('#deck-modal-grid .game-card');
        if (cards[idx]) {
          e.preventDefault();
          cards[idx].click();
        }
      }
      return;
    }

    if (isVisible('modal-gear')) {
      if (key === 'Escape') {
        e.preventDefault();
        this.closeGearModal();
      }
      return;
    }

    if (isVisible('modal-mastery')) {
      if (key === 'Escape') {
        e.preventDefault();
        this.closeMasteryModal();
      }
      return;
    }

    if (isVisible('modal-achievements')) {
      if (key === 'Escape') {
        e.preventDefault();
        this.closeAchievementsModal();
      }
      return;
    }

    if (isVisible('modal-settings')) {
      if (key === 'Escape') {
        e.preventDefault();
        this.closeSettingsModal();
      }
      return;
    }

    if (isVisible('modal-story-cutin')) {
      if (key === 'Enter' || key === ' ' || key === 'Escape') {
        e.preventDefault();
        this.closeStoryCutin();
      }
      return;
    }

    if (isVisible('modal-story')) {
      if (key === 'Escape') {
        e.preventDefault();
        this.closeStoryChronicleModal();
      }
      return;
    }

    // 2. Global Run Hotkeys (Deck, SP Allocation)
    if (this.run && !isActiveScreen('screen-hub')) {
      if (lower === 'd') {
        e.preventDefault();
        this.openDeckModal('all');
        return;
      }
      if (lower === 'c') {
        e.preventDefault();
        this.openRunStatModal();
        return;
      }
    }

    // 3. Screen-Specific Controls
    // --- STORY / NPC DIALOGUE SCREEN (#screen-story) ---
    if (isActiveScreen('screen-story')) {
      if (key >= '1' && key <= '4') {
        const btns = document.querySelectorAll('#story-choices-row .story-choice-btn');
        const idx = parseInt(key, 10) - 1;
        if (btns[idx]) {
          e.preventDefault();
          btns[idx].click();
          return;
        }
      }
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.advanceStoryDialogue();
      } else if (key === 'Escape') {
        e.preventDefault();
        this.finishStoryScene();
      }
      return;
    }

    // --- HUB SCREEN ---
    if (isActiveScreen('screen-hub')) {
      const charIds = Object.keys(GAME_DATA.characters);
      const curIdx = charIds.indexOf(this.meta.selectedCharId);
      if (key === 'ArrowRight') {
        e.preventDefault();
        this.meta.selectedCharId = charIds[(curIdx + 1) % charIds.length];
        this.renderHub();
      } else if (key === 'ArrowLeft') {
        e.preventDefault();
        this.meta.selectedCharId = charIds[(curIdx - 1 + charIds.length) % charIds.length];
        this.renderHub();
      } else if (key >= '1' && key <= '8') {
        e.preventDefault();
        this.meta.selectedCharId = charIds[parseInt(key, 10) - 1];
        this.renderHub();
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.startRunFromHub(this.meta.selectedCharId);
      } else if (lower === 'g') {
        e.preventDefault();
        this.openGearModal();
      } else if (lower === 'f') {
        e.preventDefault();
        this.openMasteryModal();
      }
      return;
    }

    // --- MAP SCREEN (1/2/3 selects available branch lanes!) ---
    if (isActiveScreen('screen-map')) {
      if (key === 'Enter' || key === ' ' || (key >= '1' && key <= '3')) {
        const availBtns = document.querySelectorAll('#current-stage-row .map-node-btn.available');
        const idx = key >= '1' && key <= '3' ? parseInt(key, 10) - 1 : 0;
        const targetBtn = availBtns[idx] || availBtns[0];
        if (targetBtn) {
          e.preventDefault();
          targetBtn.click();
        }
      }
      return;
    }

    // --- COMBAT SCREEN (Slay the Spire 1 Hotkeys!) ---
    if (isActiveScreen('screen-combat') && this.combat) {
      // 1~9, 0 -> Play Card 1~10 from hand
      if ((key >= '1' && key <= '9') || key === '0') {
        const idx = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (idx < this.combat.hand.length) {
          e.preventDefault();
          this.playCardFromHand(idx);
        }
        return;
      }
      // Tab / Left / Right -> Cycle Target Enemy
      if (key === 'Tab' || key === 'ArrowRight' || key === 'ArrowLeft') {
        e.preventDefault();
        const aliveIndices = this.combat.enemies
          .map((en, i) => (en.hp > 0 ? i : -1))
          .filter(i => i >= 0);
        if (aliveIndices.length > 1) {
          const pos = aliveIndices.indexOf(this.combat.targetIndex);
          const dir = key === 'ArrowLeft' ? -1 : 1;
          const nextPos = (pos + dir + aliveIndices.length) % aliveIndices.length;
          this.combat.targetIndex = aliveIndices[nextPos];
          this.renderCombat();
        }
        return;
      }
      // E / Space / Enter -> End Turn
      if (lower === 'e' || key === ' ' || key === 'Enter') {
        e.preventDefault();
        this.endPlayerTurn();
        return;
      }
      // Q -> Trigger Class Secondary Burst
      if (lower === 'q') {
        e.preventDefault();
        this.triggerSecondaryBurst();
        return;
      }
      // A -> View Draw Pile, S -> View Discard Pile
      if (lower === 'a') {
        e.preventDefault();
        this.openDeckModal('draw');
        return;
      }
      if (lower === 's') {
        e.preventDefault();
        this.openDeckModal('discard');
        return;
      }
      // Z / X / V -> Use Potion Slot 1 / 2 / 3
      if (lower === 'z' || lower === 'x' || lower === 'v') {
        const pIdx = lower === 'z' ? 0 : lower === 'x' ? 1 : 2;
        if (this.run && this.run.potions[pIdx]) {
          e.preventDefault();
          this.usePotion(pIdx);
        }
        return;
      }
      return;
    }

    // --- REST SCREEN ---
    if (isActiveScreen('screen-rest')) {
      if (key === '1') {
        e.preventDefault();
        this.doRestHeal();
      } else if (key === '2') {
        e.preventDefault();
        this.openUpgradeModal(false);
      } else if (key === '3') {
        e.preventDefault();
        this.openUpgradeModal(true);
      } else if (key === '4' || key === 'Escape') {
        e.preventDefault();
        this.skipRest();
      }
      return;
    }

    // --- EVENT / NEOW SCREEN ---
    if (isActiveScreen('screen-event')) {
      if (key >= '1' && key <= '4') {
        const btns = document.querySelectorAll('#event-choices .event-choice-btn');
        const idx = parseInt(key, 10) - 1;
        if (btns[idx]) {
          e.preventDefault();
          btns[idx].click();
        }
      }
      return;
    }

    // --- SHOP SCREEN ---
    if (isActiveScreen('screen-shop')) {
      if (key >= '1' && key <= '4') {
        const btns = document.querySelectorAll('#shop-cards-row .shop-buy-btn');
        const idx = parseInt(key, 10) - 1;
        if (btns[idx] && !btns[idx].disabled) {
          e.preventDefault();
          btns[idx].click();
        }
      } else if (lower === 'r') {
        e.preventDefault();
        this.openRemoveCardModal();
      } else if (lower === 'm') {
        e.preventDefault();
        this.shopMutateService();
      } else if (key === 'Escape' || key === 'Enter' || key === ' ') {
        e.preventDefault();
        this.leaveNodeToMap();
      }
    }
  },

  loadMeta() {
    try {
      // Emergency URL reset support (?reset=1)
      if (typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('reset=1')) {
        this.wipeAllStorageKeys();
        this.meta = this.createFreshDefaultMeta();
        this.saveMeta();
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, '', window.location.pathname);
        }
        return;
      }
      const saved = localStorage.getItem('DND5E_SPIRE_2_TOWER_META');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Cleanly merge while preserving new achievement progression fields
        this.meta = Object.assign(this.createFreshDefaultMeta(), parsed);
      } else {
        this.meta = this.createFreshDefaultMeta();
      }
      this.initAchievementState();
    } catch (e) {
      console.warn('Meta load skipped:', e);
      this.meta = this.createFreshDefaultMeta();
      this.initAchievementState();
    }
  },

  wipeAllStorageKeys() {
    try {
      const toRemove = ['DND5E_SPIRE_2_TOWER_META', 'DND5E_SPIRE_2_ACTIVE_RUN'];
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < (localStorage.length || 0); i++) {
          const k = localStorage.key ? localStorage.key(i) : null;
          if (k && /DND5E|SPIRE|TOWER/i.test(k) && !toRemove.includes(k)) {
            toRemove.push(k);
          }
        }
        toRemove.forEach(k => localStorage.removeItem(k));
      }
      if (typeof sessionStorage !== 'undefined' && sessionStorage.clear) {
        sessionStorage.clear();
      }
    } catch (e) { }
  },

  // --------------------------------------------------------------------------
  // ACHIEVEMENT & UNLOCK PROGRESSION SYSTEM (3 Starter Classes -> 28 Achievements!)
  // --------------------------------------------------------------------------
  initAchievementState() {
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    const starterClasses = sys ? sys.STARTER_CLASSES : ['fighter', 'rogue', 'wizard'];
    const defSubs = sys ? sys.getDefaultUnlockedSubclasses(GAME_DATA) : {};
    const defStats = sys ? sys.createDefaultStats() : {};

    // First-time migration to Achievement Unlock Schema (v2): start with 3 starter classes!
    if (!this.meta.achSchemaV2) {
      const freshUnlocked = {};
      Object.keys(GAME_DATA.characters).forEach(cid => {
        freshUnlocked[cid] = starterClasses.includes(cid);
      });
      this.meta.unlocked = freshUnlocked;
      this.meta.unlockedSubclasses = { ...defSubs };
      this.meta.unlockedLegendaries = {};
      this.meta.achievements = {};
      this.meta.achStats = { ...defStats };
      // Credit returning players for any Act progress they already achieved
      if ((this.meta.bestAct || 1) > 1) {
        this.meta.achStats.maxActReached = this.meta.bestAct;
        this.meta.achStats.bossesKilled = Math.max(1, this.meta.bestAct - 1);
      }
      this.meta.achSchemaV2 = true;
      this.saveMeta();
    } else {
      if (!this.meta.unlocked) this.meta.unlocked = {};
      starterClasses.forEach(cid => { this.meta.unlocked[cid] = true; });
      this.meta.unlockedSubclasses = Object.assign({}, defSubs, this.meta.unlockedSubclasses || {});
      if (!this.meta.unlockedLegendaries) this.meta.unlockedLegendaries = {};
      if (!this.meta.achievements) this.meta.achievements = {};
      this.meta.achStats = Object.assign({}, defStats, this.meta.achStats || {});
      if (!this.meta.achStats.classKills) this.meta.achStats.classKills = {};
      if (!this.meta.achStats.classBestStageNum) this.meta.achStats.classBestStageNum = {};
    }

    if (!this.meta.selectedCharId || !GAME_DATA.characters[this.meta.selectedCharId] || !this.isClassUnlocked(this.meta.selectedCharId)) {
      this.meta.selectedCharId = 'fighter';
    }
    // Re-sync any rewards from already earned achievements silently
    this.checkAchievements(true);
  },

  createFreshDefaultMeta() {
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    const starterClasses = sys ? sys.STARTER_CLASSES : ['fighter', 'rogue', 'wizard'];
    const unlocked = {};
    const ranks = {};
    const levels = {};
    const classBestFloor = {};
    Object.keys(GAME_DATA.characters).forEach(cid => {
      unlocked[cid] = starterClasses.includes(cid);
      ranks[cid] = 'C';
      levels[cid] = 1;
      classBestFloor[cid] = '1층 1F';
    });
    return {
      gems: 300,
      selectedCharId: 'fighter',
      bestAct: 1,
      bestStage: 1,
      totalClimbs: 0,
      achSchemaV2: true,
      talkedNpcs: {},
      unlocked,
      unlockedSubclasses: sys ? sys.getDefaultUnlockedSubclasses(GAME_DATA) : {},
      unlockedLegendaries: {},
      achievements: {},
      achStats: sys ? sys.createDefaultStats() : {},
      ranks,
      levels,
      classBestFloor,
      gearUnlocked: { c_dagger: true, c_vest: true, c_ring: true },
      gearLevels: { c_dagger: 0, c_vest: 0, c_ring: 0 },
      equipped: { weapon: 'c_dagger', armor: 'c_vest', accessory: 'c_ring' },
      masteryLevels: {
        vitality_training: 0,
        mana_circulation: 0,
        tactical_intel: 0,
        guild_funding: 0,
        exp_accelerator: 0,
        core_overdrive: 0
      }
    };
  },

  isClassUnlocked(charId) {
    return !!(this.meta.unlocked && this.meta.unlocked[charId]);
  },

  isSubclassUnlocked(subId) {
    if (!subId || subId === 'shared') return true;
    return !!(this.meta.unlockedSubclasses && this.meta.unlockedSubclasses[subId]);
  },

  isLegendaryUnlocked(charId) {
    return !!(this.meta.unlockedLegendaries && this.meta.unlockedLegendaries[charId]);
  },

  startRunFromHub(charId) {
    if (!this.isClassUnlocked(charId)) {
      const ch = GAME_DATA.characters[charId];
      const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
      const hint = sys ? sys.getUnlockHintForClass(charId) : '업적을 달성하세요!';
      this.showToast(`🔒 [${ch ? ch.name : charId}] 잠김! ${hint}`, 'warn');
      this.openAchievementsModal('class');
      return;
    }
    this.startNewRun(charId);
  },

  recordAchStat(key, val, mode = 'add') {
    if (!this.meta.achStats) this.initAchievementState();
    const s = this.meta.achStats;
    if (mode === 'max') {
      if (val > (s[key] || 0)) s[key] = val;
    } else {
      s[key] = (s[key] || 0) + val;
    }
  },

  checkAchievements(silent = false) {
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    if (!sys || !this.meta.achStats) return;
    if (!this.meta.achievements) this.meta.achievements = {};
    const newlyUnlocked = [];

    sys.ACHIEVEMENTS.forEach(ach => {
      const already = !!this.meta.achievements[ach.id];
      const qualifies = already || ach.check(this.meta.achStats);
      if (!qualifies) return;

      if (!already) {
        this.meta.achievements[ach.id] = true;
        if (ach.gemReward) this.meta.gems = (this.meta.gems || 0) + ach.gemReward;
        newlyUnlocked.push(ach);
      }
      // Ensure unlock flags are always applied
      if (ach.unlockClass) this.meta.unlocked[ach.unlockClass] = true;
      if (ach.unlockSubclass) this.meta.unlockedSubclasses[ach.unlockSubclass] = true;
      if (ach.unlockLegendaryClasses) {
        ach.unlockLegendaryClasses.forEach(cid => {
          this.meta.unlockedLegendaries[cid] = true;
        });
      }
    });

    this.updateAchievementBadges();
    if (newlyUnlocked.length > 0) {
      this.saveMeta();
      if (!silent) {
        SfxEngine.play('victory');
        newlyUnlocked.forEach(ach => {
          VfxEngine.banner(`🏆 업적 달성: ${ach.name}`, 'gold');
          this.showToast(`🏆 업적 달성 [${ach.icon} ${ach.name}]! ${ach.rewardText}`, 'success');
        });
        if (typeof document !== 'undefined' && document.getElementById('screen-hub') && document.getElementById('screen-hub').classList.contains('active')) {
          this.renderHub();
        }
      }
    }
  },

  updateAchievementBadges() {
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    if (!sys) return;
    const total = sys.ACHIEVEMENTS.length;
    const done = sys.ACHIEVEMENTS.filter(a => this.meta.achievements && this.meta.achievements[a.id]).length;
    const txt = `${done}/${total}`;
    ['hud-ach-count', 'mobile-ach-count'].forEach(id => {
      const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
      if (el) el.textContent = txt;
    });
  },

  closeAllNavModals() {
    ['modal-achievements', 'modal-gear', 'modal-mastery', 'modal-deck', 'modal-run-stats', 'modal-settings', 'modal-story'].forEach(id => {
      const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
      if (el) el.classList.add('hidden');
    });
    this._pendingResetKey = null;
    this.updateMobileNavActive('hub');
  },

  // --------------------------------------------------------------------------
  // BALDUR'S GATE 1·2·3 MAIN STORY CUT-INS & CHRONICLE CODEX
  // --------------------------------------------------------------------------
  isStoryCutinEnabled() {
    try {
      return localStorage.getItem('DND5E_SPIRE_2_STORY_OFF') !== '1';
    } catch (e) {
      return true;
    }
  },

  toggleStoryCutinPref() {
    const on = this.isStoryCutinEnabled();
    try {
      localStorage.setItem('DND5E_SPIRE_2_STORY_OFF', on ? '1' : '0');
    } catch (e) { }
    this.renderSettingsModal();
    this.showToast(on ? '📖 자동 챕터 스토리 컷인 꺼짐 (연대기에서 언제든 열람 가능)' : '📖 자동 챕터 스토리 컷인 켜짐', 'info');
  },

  showStoryCutin(actNum = 1, onComplete = null) {
    this.showFloorStoryEpisode(actNum, 1, onComplete);
  },

  showFloorStoryEpisode(actNum = 1, epNum = 1, onComplete = null) {
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!se || !this.isStoryCutinEnabled()) {
      if (onComplete) onComplete();
      return;
    }
    const charId = (this.run && this.run.charId) || this.meta.selectedCharId || 'fighter';
    const bossId = this.run && this.run.selectedBosses && this.run.selectedBosses[actNum];
    const scene = se.getFloorStoryEpisode
      ? se.getFloorStoryEpisode(actNum, epNum, charId, bossId)
      : se.getActDialogueScene(actNum, charId);
    this.openStoryScene(scene, onComplete);
  },

  openTavernNpcDialogue(npcId) {
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!se) return;
    const bestAct = Math.max(this.meta.bestAct || 1, (this.meta.achStats && this.meta.achStats.maxActReached) || 1);
    const scene = se.getTavernNpcDialogue(npcId, bestAct);
    // First-time tavern talk reward (+20 Gems!)
    if (!this.meta.talkedNpcs) this.meta.talkedNpcs = {};
    const firstTalk = !this.meta.talkedNpcs[npcId];
    this.openStoryScene(scene, () => {
      if (firstTalk) {
        this.meta.talkedNpcs[npcId] = true;
        this.meta.gems = (this.meta.gems || 0) + 20;
        this.saveMeta();
        const npc = se.NPCS[npcId];
        this.showToast(`💬 [${npc ? npc.name : npcId}] 첫 대화 보너스! 💎 등반 마석 +20 획득`, 'success');
      }
      this.showHub();
    });
  },

  replayMainStory(part = 'prologue') {
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!se || !se.getMainStoryScene) return;
    this.closeStoryChronicleModal();
    const charId = (this.run && this.run.charId) || this.meta.selectedCharId || 'fighter';
    const bossId = (this.run && this.run.selectedBosses && this.run.selectedBosses[5]) || 'tiamat_dragon_queen';
    const scene = se.getMainStoryScene(part, charId, bossId);
    const prevWasRun = this.run && !document.getElementById('screen-hub').classList.contains('active');
    this.openStoryScene(scene, () => {
      if (prevWasRun) {
        this.switchScreen('screen-map');
        this.renderMap();
      } else {
        this.showHub();
      }
    });
  },

  replayFloorEpisode(actNum, epNum = 1) {
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!se) return;
    this.closeStoryChronicleModal();
    const charId = (this.run && this.run.charId) || this.meta.selectedCharId || 'fighter';
    const bossId = (this.run && this.run.selectedBosses && this.run.selectedBosses[actNum]) || null;
    const scene = se.getFloorStoryEpisode
      ? se.getFloorStoryEpisode(actNum, epNum, charId, bossId)
      : se.getActDialogueScene(actNum, charId);
    const prevWasRun = this.run && !document.getElementById('screen-hub').classList.contains('active');
    this.openStoryScene(scene, () => {
      if (prevWasRun) {
        this.switchScreen('screen-map');
        this.renderMap();
      } else {
        this.showHub();
      }
    });
  },

  replayActStoryScene(actNum) {
    this.replayFloorEpisode(actNum, 1);
  },

  openStoryScene(scene, onComplete = null) {
    if (!scene || !scene.lines || scene.lines.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    this._storyState = {
      scene,
      index: 0,
      pendingReply: null,
      onComplete
    };
    this.switchScreen('screen-story');
    // Set scene backdrop on #pixel-bg-img and #story-stage-bg
    if (typeof window !== 'undefined' && window.PIXEL_BACKGROUNDS) {
      const bossId =
        scene.bgKey ||
        (this.run && this.run.selectedBosses && this.run.selectedBosses[scene.actNum || 1]) ||
        'lobby';
      const url = window.PIXEL_BACKGROUNDS.getSceneDataUrl(bossId, scene.actNum || 0);
      const bgImg = document.getElementById('story-stage-bg');
      if (bgImg && url) bgImg.src = url;
      window.PIXEL_BACKGROUNDS.applyTheme(bossId, scene.actNum || 0);
    }
    this.renderStoryScreen();
  },

  renderStoryScreen() {
    const st = this._storyState;
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!st || !se) return;
    const { scene, index, pendingReply } = st;
    const curLine = pendingReply || scene.lines[index];
    if (!curLine) {
      this.finishStoryScene();
      return;
    }

    const charId = (this.run && this.run.charId) || this.meta.selectedCharId || 'fighter';
    const hero = GAME_DATA.characters[charId] || GAME_DATA.characters.fighter;
    const isNarrator = curLine.speaker === 'narrator';
    const isHeroSpeaking = curLine.speaker === 'hero';
    const isBossSpeaking = curLine.speaker === 'boss';
    const bossId = curLine.bossId || curLine.replyBossId || scene.bossId || null;
    const useBossRight = !!(bossId && (isBossSpeaking || (!curLine.npcId && GAME_DATA.enemies[bossId])));
    const bossEnemy = useBossRight ? GAME_DATA.enemies[bossId] : null;
    const bossLore = useBossRight && se.getBossLore ? se.getBossLore(bossId, scene.actNum || 1) : null;
    const npc = se.NPCS[curLine.npcId] || se.NPCS.durnan;
    const ps = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
    const activeEmo = curLine.emotion || 'neutral';
    const heroEmo = isHeroSpeaking ? activeEmo : (curLine.heroEmotion || 'neutral');
    const npcEmo = !isHeroSpeaking && !isNarrator ? activeEmo : (curLine.npcEmotion || 'neutral');
    const emoMeta = (ps && ps.EMOTION_META && ps.EMOTION_META[activeEmo]) || { icon: '🙂', label: '평온', color: '#dfe6e9' };
    const motionCls = ps && ps.pickMotion ? ps.pickMotion(isBossSpeaking ? 'enemy_buff' : `emo_${activeEmo}`) : 'mot-neutral-breathe';

    const heroSpriteHtml = ps && ps.getHeroEmotionSprite ? ps.getHeroEmotionSprite(charId, heroEmo) : hero.avatarSvg;
    const rightSpriteHtml = useBossRight && bossEnemy
      ? bossEnemy.svg
      : se.getNpcEmotionSprite
        ? se.getNpcEmotionSprite(npc.id, npcEmo)
        : npc.svg;

    const chapEl = document.getElementById('story-stage-chapter');
    const titleEl = document.getElementById('story-stage-title');
    if (chapEl) chapEl.textContent = scene.chapter;
    if (titleEl) titleEl.textContent = scene.title;

    const heroSlot = document.getElementById('story-hero-slot');
    const npcSlot = document.getElementById('story-npc-slot');
    if (heroSlot) {
      heroSlot.className = `story-actor-slot actor-left ${isHeroSpeaking ? 'speaking ' + motionCls : 'listening'}`;
      heroSlot.innerHTML = `
        <div class="story-actor-sprite">${heroSpriteHtml}</div>
        <div class="story-actor-tag">${hero.name.split(' ')[0]}</div>
      `;
    }
    if (npcSlot) {
      const rightActive = !isHeroSpeaking && !isNarrator;
      npcSlot.className = `story-actor-slot actor-right ${useBossRight ? 'is-boss-actor ' : ''}${rightActive ? 'speaking ' + motionCls : 'listening'}`;
      npcSlot.innerHTML = `
        <div class="story-actor-sprite">${rightSpriteHtml}</div>
        <div class="story-actor-tag" style="border-color:${useBossRight ? '#ff6b81' : npc.accent}; color:${useBossRight ? '#ff9ff3' : npc.accent};">
          ${useBossRight && bossLore ? `👑 ${bossLore.name}` : `${npc.icon} ${npc.name.split(' ')[0]}`}
        </div>
      `;
    }

    const speakerEl = document.getElementById('story-speaker-badge');
    const factionEl = document.getElementById('story-faction-tag');
    const textEl = document.getElementById('story-dialogue-text');
    const progEl = document.getElementById('story-progress-pill');
    const choicesEl = document.getElementById('story-choices-row');
    const nextBtn = document.getElementById('story-next-btn');

    if (speakerEl) {
      if (isNarrator) {
        speakerEl.innerHTML = `📖 상황 묘사`;
        speakerEl.style.color = '#ffeaa7';
      } else if (isBossSpeaking && bossLore) {
        speakerEl.innerHTML = `👑 ${bossLore.name} <span class="story-emotion-pill" style="border-color:#ff4757; color:#ff6b81;">🔥 층의 군주</span>`;
        speakerEl.style.color = '#ff6b81';
      } else {
        speakerEl.innerHTML = `${isHeroSpeaking ? `⚔️ ${hero.name}` : `${npc.icon} ${npc.name}`} <span class="story-emotion-pill" style="border-color:${emoMeta.color}; color:${emoMeta.color};">${emoMeta.icon} ${emoMeta.label}</span>`;
        speakerEl.style.color = isHeroSpeaking ? '#74b9ff' : npc.accent;
      }
    }
    if (factionEl) {
      factionEl.textContent = isNarrator
        ? scene.title
        : isBossSpeaking && bossLore
          ? `${bossLore.epithet} · ${bossLore.sealName}`
          : isHeroSpeaking
            ? hero.heroName
            : `${npc.title} · ${npc.faction}`;
    }
    if (textEl) {
      textEl.textContent = curLine.text;
      textEl.classList.toggle('is-narrator', isNarrator);
    }
    if (progEl) {
      progEl.textContent = pendingReply ? '대화 마무리' : `${index + 1} / ${scene.lines.length}`;
    }

    if (choicesEl) {
      choicesEl.innerHTML = '';
      if (!pendingReply && curLine.choices && curLine.choices.length > 0) {
        if (nextBtn) nextBtn.classList.add('hidden');
        curLine.choices.forEach((chOpt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'story-choice-btn';
          btn.innerHTML = `<span class="kbd-hint">${idx + 1}</span> ${chOpt.label}`;
          btn.onclick = () => this.selectStoryChoice(idx);
          choicesEl.appendChild(btn);
        });
      } else {
        if (nextBtn) {
          nextBtn.classList.remove('hidden');
          const isLast = !!pendingReply || index >= scene.lines.length - 1;
          nextBtn.textContent = isLast ? '대화 마치고 계속 진행 ➔' : '다음 대사 [Space] ➔';
        }
      }
    }
  },

  selectStoryChoice(choiceIdx) {
    const st = this._storyState;
    if (!st) return;
    const curLine = st.scene.lines[st.index];
    const opt = curLine && curLine.choices && curLine.choices[choiceIdx];
    if (!opt) return;
    SfxEngine.play('card');
    st.pendingReply = {
      speaker: opt.replySpeaker || 'npc',
      npcId: opt.replyNpcId || curLine.npcId,
      bossId: opt.replyBossId || curLine.bossId || st.scene.bossId,
      emotion: opt.replyEmotion || 'happy',
      heroEmotion: opt.heroEmotion || 'neutral',
      text: opt.reply
    };
    this.renderStoryScreen();
  },

  advanceStoryDialogue() {
    const st = this._storyState;
    if (!st) return;
    const curLine = st.scene.lines[st.index];
    if (!st.pendingReply && curLine && curLine.choices && curLine.choices.length > 0) {
      // If player presses Space/Enter when choices are shown, pick the last quick-continue option!
      this.selectStoryChoice(curLine.choices.length - 1);
      return;
    }
    SfxEngine.play('card');
    if (st.pendingReply) {
      st.pendingReply = null;
      st.index += 1;
    } else {
      st.index += 1;
    }
    if (st.index >= st.scene.lines.length) {
      this.finishStoryScene();
    } else {
      this.renderStoryScreen();
    }
  },

  finishStoryScene() {
    const st = this._storyState;
    this._storyState = null;
    if (st && typeof st.onComplete === 'function') {
      st.onComplete();
    } else {
      this.showHub();
    }
  },

  closeStoryCutin() {
    const modal = typeof document !== 'undefined' ? document.getElementById('modal-story-cutin') : null;
    if (modal) modal.classList.add('hidden');
    if (this._storyState) this.finishStoryScene();
  },

  openStoryChronicleModal() {
    this.closeAllNavModals();
    const modal = typeof document !== 'undefined' ? document.getElementById('modal-story') : null;
    const body = typeof document !== 'undefined' ? document.getElementById('story-chronicle-body') : null;
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!modal || !body || !se) return;

    const maxAct = Math.max(this.meta.bestAct || 1, (this.meta.achStats && this.meta.achStats.maxActReached) || 1, (this.run && this.run.act) || 1);
    const hasVictory = !!(this.meta.achStats && this.meta.achStats.totalVictories > 0);
    const curCharId = (this.run && this.run.charId) || this.meta.selectedCharId || 'fighter';
    const curChar = GAME_DATA.characters[curCharId];
    const origin = se.CLASS_ORIGINS[curCharId];

    const mainStoryHtml = se.MAIN_STORY
      ? `
        <div class="chronicle-card unlocked epilogue" style="margin-bottom:12px;">
          <div class="chronicle-head">
            <span class="story-chap-pill">📖 메인 스토리 (1개)</span>
            <button class="hud-btn" style="padding:3px 9px; font-size:0.7rem; border-color:#f6c967; color:#ffeaa7;" onclick="Game.replayMainStory('prologue')">🎬 프롤로그 재생</button>
          </div>
          <h4>《${se.MAIN_STORY.title}》</h4>
          <div class="story-loc-tag">🌕 ${se.MAIN_STORY.subtitle}</div>
          <div class="chronicle-text">${se.MAIN_STORY.synopsis.map(p => `<p>${p}</p>`).join('')}</div>
        </div>
      `
      : '';

    const chaptersHtml = [1, 2, 3, 4, 5]
      .map(act => {
        const chap = se.ACT_CHAPTERS[act];
        const ft = se.FLOOR_THEMES && se.FLOOR_THEMES[act];
        const unlocked = act <= maxAct;
        const epBtns = unlocked && ft
          ? `<div class="chronicle-ep-row">
               ${ft.epTitles
                 .map((t, i) => `<button class="chronicle-ep-btn" onclick="Game.replayFloorEpisode(${act}, ${i + 1})">🎬 ${t}</button>`)
                 .join('')}
             </div>`
          : '';
        return `
          <div class="chronicle-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="chronicle-head">
              <span class="story-chap-pill">${chap.chapter}</span>
              <span style="font-size:0.72rem; color:${unlocked ? '#55efc4' : '#95a5a6'};">${unlocked ? '🔓 3개 에피소드 열람 가능' : `🔒 제${act}계층 도달 시 해금`}</span>
            </div>
            <h4>${unlocked ? chap.title : `??? (제${act}계층 스토리 미해금)`}</h4>
            <div class="story-loc-tag">📍 ${unlocked ? chap.location : '미지의 영역'}</div>
            ${
              unlocked
                ? `<div class="chronicle-text">${chap.paragraphs.map(p => `<p>${p}</p>`).join('')}</div>${epBtns}`
                : `<p class="chronicle-locked-hint">첨탑 제${act}계층에 도달하면 이 층의 3개 보스 연동 스토리가 해금됩니다.</p>`
            }
          </div>
        `;
      })
      .join('');

    const epilogueHtml = `
      <div class="chronicle-card ${hasVictory ? 'unlocked epilogue' : 'locked'}">
        <div class="chronicle-head">
          <span class="story-chap-pill">${se.VICTORY_EPILOGUE.chapter}</span>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.72rem; color:${hasVictory ? '#f6c967' : '#95a5a6'};">${hasVictory ? '👑 최종 클리어 달성' : '🔒 제5계층 최종 클리어 시 해금'}</span>
            ${hasVictory ? `<button class="hud-btn" style="padding:2px 8px; font-size:0.68rem; border-color:#f6c967; color:#ffeaa7;" onclick="Game.replayMainStory('epilogue')">🎬 에필로그 재생</button>` : ''}
          </div>
        </div>
        <h4>${hasVictory ? se.VICTORY_EPILOGUE.title : '??? (최종 결전 에필로그)'}</h4>
        ${
          hasVictory
            ? `<div class="chronicle-text">${se.VICTORY_EPILOGUE.paragraphs.map(p => `<p>${p}</p>`).join('')}</div>`
            : `<p class="chronicle-locked-hint">제5계층 최종 군주를 토벌하면 다섯 인장의 결말이 공개됩니다.</p>`
        }
      </div>
    `;

    body.innerHTML = `
      ${mainStoryHtml}
      ${
        curChar && origin
          ? `<div class="story-origin-box" style="margin-bottom:12px;">
               <div class="story-origin-avatar">${curChar.avatarSvg}</div>
               <div>
                 <div class="story-origin-tag">⚔️ ${curChar.name} 동기 · ${origin.title}</div>
                 <p class="story-origin-quote">${origin.quote}</p>
               </div>
             </div>`
          : ''
      }
      <div class="chronicle-list">
        ${chaptersHtml}
        ${epilogueHtml}
      </div>
    `;
    modal.classList.remove('hidden');
  },

  closeStoryChronicleModal() {
    const modal = typeof document !== 'undefined' ? document.getElementById('modal-story') : null;
    if (modal) modal.classList.add('hidden');
  },

  // --------------------------------------------------------------------------
  // DEDICATED SETTINGS TAB: AUDIO / VFX / PIXEL BG / PWA CACHE / SAFE 2-STEP RESET
  // --------------------------------------------------------------------------
  applySavedUserPrefs() {
    if (typeof document === 'undefined') return;
    try {
      const bgOff = localStorage.getItem('DND5E_SPIRE_2_BG_OFF') === '1';
      document.documentElement.classList.toggle('pixel-bg-off', bgOff);
    } catch (e) { }
  },

  openSettingsModal() {
    this.closeAllNavModals();
    this._pendingResetKey = null;
    const modal = document.getElementById('modal-settings');
    if (!modal) return;
    this.renderSettingsModal();
    modal.classList.remove('hidden');
    this.updateMobileNavActive('settings');
  },

  closeSettingsModal() {
    this._pendingResetKey = null;
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.add('hidden');
    this.updateMobileNavActive(this.run && !document.getElementById('screen-hub').classList.contains('active') ? 'run' : 'hub');
  },

  toggleVfxPref() {
    const currentlyEnabled = !VfxEngine.isVfxDisabledByUser();
    VfxEngine.setVfxEnabled(!currentlyEnabled);
    this.renderSettingsModal();
    this.showToast(!currentlyEnabled ? '✨ 타격감 이펙트 & 화면 흔들림 활성화됨' : '✨ 타격감 이펙트 최소화(성능 모드) 활성화됨', 'info');
  },

  togglePixelBgPref() {
    let bgOff = false;
    try {
      bgOff = localStorage.getItem('DND5E_SPIRE_2_BG_OFF') === '1';
      localStorage.setItem('DND5E_SPIRE_2_BG_OFF', bgOff ? '0' : '1');
    } catch (e) { }
    this.applySavedUserPrefs();
    this.renderSettingsModal();
    this.showToast(bgOff ? '🖼️ 도트 배경 표시 켜짐' : '🖼️ 도트 배경 표시 꺼짐 (단색 다크 모드)', 'info');
  },

  async refreshAppCache() {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch (e) { }
    this.showToast('🔄 캐시를 비우고 최신 버전으로 새로고침합니다...', 'success');
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location) window.location.reload();
    }, 350);
  },

  cancelTwoStepReset() {
    this._pendingResetKey = null;
    this.renderSettingsModal();
  },

  requestTwoStepReset(kind) {
    if (this._pendingResetKey !== kind) {
      this._pendingResetKey = kind;
      this.renderSettingsModal();
      this.showToast('⚠️ 확인 버튼이 빨간색으로 바뀌었습니다! 한 번 더 누르면 즉시 초기화됩니다.', 'warn');
      return;
    }
    this._pendingResetKey = null;
    if (kind === 'run_only') {
      this.abandonSavedRun();
      this.renderSettingsModal();
    } else if (kind === 'achievements_only') {
      this.resetAchievementsOnly();
    } else if (kind === 'full_account') {
      this.resetFullAccountData();
    }
  },

  resetAchievementsOnly() {
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    const starterClasses = sys ? sys.STARTER_CLASSES : ['fighter', 'rogue', 'wizard'];
    const unlocked = {};
    const ranks = {};
    const classBestFloor = {};
    Object.keys(GAME_DATA.characters).forEach(cid => {
      unlocked[cid] = starterClasses.includes(cid);
      ranks[cid] = 'C';
      classBestFloor[cid] = '1층 1F';
    });
    this.meta.unlocked = unlocked;
    this.meta.ranks = ranks;
    this.meta.classBestFloor = classBestFloor;
    this.meta.bestAct = 1;
    this.meta.bestStage = 1;
    this.meta.unlockedSubclasses = sys ? sys.getDefaultUnlockedSubclasses(GAME_DATA) : {};
    this.meta.unlockedLegendaries = {};
    this.meta.achievements = {};
    this.meta.achStats = sys ? sys.createDefaultStats() : {};
    this.meta.achSchemaV2 = true;
    if (!this.isClassUnlocked(this.meta.selectedCharId)) {
      this.meta.selectedCharId = 'fighter';
    }
    // Abandon saved run if it used a newly re-locked class
    const saved = this.loadSavedRun();
    if (saved && !this.isClassUnlocked(saved.charId)) {
      this.clearSavedRun();
      this.run = null;
      this.combat = null;
    }
    this.saveMeta();
    this.updateAchievementBadges();
    this.renderHub();
    this.renderSettingsModal();
    this.showToast('🏆 업적·해금·전 클래스 등급(C급)이 초기화되었습니다! 기본 3클래스부터 다시 해금하세요.', 'success');
  },

  resetFullAccountData() {
    this.wipeAllStorageKeys();
    this.run = null;
    this.combat = null;
    this._storyState = null;
    this._lobbyEmo = 'neutral';
    this._lobbyEmoVariant = 0;
    this._lastPlayerAvatarChar = null;
    this._pendingResetKey = null;
    this.meta = this.createFreshDefaultMeta();
    this.saveMeta();
    // Also clear PWA CacheStorage asynchronously so stale assets never linger
    try {
      if (typeof window !== 'undefined' && 'caches' in window && window.caches && window.caches.keys) {
        window.caches.keys().then(keys => Promise.all(keys.map(k => window.caches.delete(k)))).catch(() => {});
      }
    } catch (e) { }
    this.updateAchievementBadges();
    this.closeSettingsModal();
    this.showHub();
    this.showToast('✅ 전체 계정 데이터 완전 초기화 완료! 전 클래스 C급 · Lv.1 · 기본 3클래스 · 업적 0/28 · 마석 300으로 새로 시작합니다.', 'success');
  },

  renderSettingsModal() {
    const body = document.getElementById('settings-modal-body');
    if (!body) return;
    // Preserve scroll position so 2-step reset button never jumps away on mobile/PC!
    const prevScrollBody = body.scrollTop || 0;
    const modalBox = body.parentNode;
    const prevScrollBox = modalBox ? (modalBox.scrollTop || 0) : 0;
    const sfxOn = !SfxEngine.muted;
    const vfxOn = !VfxEngine.isVfxDisabledByUser();
    let bgOn = true;
    try { bgOn = localStorage.getItem('DND5E_SPIRE_2_BG_OFF') !== '1'; } catch (e) { }
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    const achTotal = sys ? sys.ACHIEVEMENTS.length : 28;
    const achDone = sys ? sys.ACHIEVEMENTS.filter(a => this.meta.achievements && this.meta.achievements[a.id]).length : 0;
    const unlockedCnt = Object.keys(GAME_DATA.characters).filter(cid => this.isClassUnlocked(cid)).length;
    const hasSavedRun = !!this.loadSavedRun();
    const isStandalone = typeof window !== 'undefined' && window.PwaInstaller && window.PwaInstaller.isStandalone();
    const isMobilePage = typeof document !== 'undefined' && document.body && document.body.classList.contains('mobile-edition');

    const pend = this._pendingResetKey;
    body.innerHTML = `
      <div class="settings-section">
        <h3>🎛️ 사운드 & 그래픽 연출</h3>
        <div class="settings-toggle-row">
          <div>
            <strong>🔊 효과음 (SFX)</strong>
            <p>타격음, 주문 발동음, 업적 팡파레 효과음</p>
          </div>
          <button class="settings-pill-btn ${sfxOn ? 'on' : 'off'}" onclick="Game.toggleSound(); Game.renderSettingsModal();">
            ${sfxOn ? '켜짐 (ON)' : '꺼짐 (OFF)'}
          </button>
        </div>
        <div class="settings-toggle-row">
          <div>
            <strong>✨ 타격감 이펙트 & 화면 흔들림 (VFX)</strong>
            <p>검기 파티클, 충격파, 치명타 섬광 및 화면 흔들림</p>
          </div>
          <button class="settings-pill-btn ${vfxOn ? 'on' : 'off'}" onclick="Game.toggleVfxPref()">
            ${vfxOn ? '켜짐 (ON)' : '최소화'}
          </button>
        </div>
        <div class="settings-toggle-row">
          <div>
            <strong>🖼️ 도트 배경 연출</strong>
            <p>로비 주점 및 20종 보스 테마 도트 배경 표시</p>
          </div>
          <button class="settings-pill-btn ${bgOn ? 'on' : 'off'}" onclick="Game.togglePixelBgPref()">
            ${bgOn ? '켜짐 (ON)' : '꺼짐'}
          </button>
        </div>
        <div class="settings-toggle-row">
          <div>
            <strong>📖 메인 스토리 컷인 자동 표시</strong>
            <p>새 계층(1~5막) 진입 시 발더스 게이트 스토리 컷인 출력</p>
          </div>
          <button class="settings-pill-btn ${this.isStoryCutinEnabled() ? 'on' : 'off'}" onclick="Game.toggleStoryCutinPref()">
            ${this.isStoryCutinEnabled() ? '켜짐 (ON)' : '꺼짐'}
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h3>📱 앱 & 버전 관리</h3>
        <div class="settings-account-summary">
          <span>🏆 달성 업적: <strong>${achDone}/${achTotal}</strong></span>
          <span>🧑 해금 클래스: <strong>${unlockedCnt}/8</strong></span>
          <span>💎 마석: <strong>${this.meta.gems || 0}</strong></span>
          <span>🏔️ 최고: <strong>${this.meta.bestAct || 1}층 ${this.meta.bestStage || 1}F</strong></span>
        </div>
        <div class="settings-action-grid">
          <button class="hud-btn" style="border-color:#f6c967; color:#ffeaa7;" onclick="Game.openStoryChronicleModal()">
            📖 메인 스토리 연대기 보기
          </button>
          <button class="hud-btn" style="border-color:#2ed573; color:#55efc4;" onclick="if(window.PwaInstaller) PwaInstaller.install();">
            ${isStandalone ? '✅ 설치된 앱으로 실행 중' : '📲 홈 화면에 앱 설치'}
          </button>
          <button class="hud-btn" style="border-color:#74b9ff; color:#74b9ff;" onclick="Game.refreshAppCache()">
            🔄 캐시 비우고 최신 버전 갱신
          </button>
          <a class="hud-btn" style="text-decoration:none; text-align:center; border-color:#a29bfe; color:#dfe6e9;" href="${isMobilePage ? 'index.html?force=pc' : 'mobile.html'}">
            ${isMobilePage ? '💻 PC 와이드 버전으로 열기' : '📱 모바일 터치 버전으로 열기'}
          </a>
          <a class="hud-btn" style="text-decoration:none; text-align:center; border-color:#ff9f43; color:#ffeaa7;" href="${isMobilePage ? 'v1/mobile.html' : 'v1/index.html'}">
            🕹️ v1 클래식 도트 버전 (32×32) 열기
          </a>
        </div>
      </div>

      <div class="settings-section settings-danger-zone">
        <h3>⚠️ 계정 & 업적 데이터 초기화</h3>
        <p class="settings-danger-note">브라우저 캐시 삭제만으로는 저장된 계정(localStorage)이 지워지지 않습니다. 아래 초기화 버튼을 <strong>2번 클릭</strong>하면 S급 등급·업적·세이브가 모두 C급 초기 상태로 완전히 리셋됩니다.</p>
        <div class="settings-reset-col">
          <button class="settings-reset-btn ${pend === 'achievements_only' ? 'confirming' : ''}" onclick="Game.requestTwoStepReset('achievements_only')">
            ${pend === 'achievements_only' ? '⚠️ 한 번 더 클릭하면 즉시 실행! (전 클래스 C급 · 기본 3클래스 · 업적 0/28)' : '🏆 업적 · 해금 · 클래스 등급(C급) 초기화 (마석/무구 유지)'}
          </button>
          <button class="settings-reset-btn ${pend === 'run_only' ? 'confirming' : ''}" onclick="Game.requestTwoStepReset('run_only')" ${hasSavedRun ? '' : 'disabled'}>
            ${pend === 'run_only' ? '⚠️ 진행 중인 모험 세이브를 삭제할까요? 한 번 더 클릭!' : hasSavedRun ? '💾 진행 중인 모험(이어하기) 데이터만 삭제' : '💾 저장된 진행 중 모험 없음'}
          </button>
          <button class="settings-reset-btn danger-full ${pend === 'full_account' ? 'confirming' : ''}" onclick="Game.requestTwoStepReset('full_account')">
            ${pend === 'full_account' ? '🚨 확인 완료! 한 번 더 클릭하면 전 클래스 C급 · Lv.1 · 마석 300으로 완전 초기화!' : '💣 전체 계정 + 캐시 완전 초기화 (모든 S급/레벨/무구/업적 삭제)'}
          </button>
          ${pend ? `<button class="hud-btn" style="align-self:flex-end; font-size:0.74rem;" onclick="Game.cancelTwoStepReset()">취소</button>` : ''}
        </div>
      </div>
    `;
    body.scrollTop = prevScrollBody;
    if (modalBox) modalBox.scrollTop = prevScrollBox;
  },

  updateMobileNavActive(activeTab) {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.mobile-bottom-nav button[data-nav]').forEach(btn => {
      btn.classList.toggle('nav-active', btn.dataset.nav === activeTab);
    });
  },

  returnToActiveRun() {
    this.closeAllNavModals();
    if (this.combat && !this.combat.ended) {
      this.switchScreen('screen-combat');
      this.renderCombat();
      this.updateMobileNavActive('run');
      return;
    }
    if (this.run && this.run.hp > 0) {
      this.switchScreen('screen-map');
      this.renderMap();
      this.updateMobileNavActive('run');
      return;
    }
    if (this.loadSavedRun()) {
      this.continueSavedRun();
      this.updateMobileNavActive('run');
      return;
    }
    this.showHub();
    this.showToast('🏔️ 로비에서 클래스를 선택하고 [첨탑 등반 시작]을 눌러주세요!', 'info');
  },

  openAchievementsModal(filter = 'all') {
    this.closeAllNavModals();
    const modal = document.getElementById('modal-achievements');
    if (!modal) return;
    this._achFilter = filter;
    this.renderAchievementsModal(filter);
    modal.classList.remove('hidden');
    this.updateMobileNavActive('ach');
  },

  closeAchievementsModal() {
    const modal = document.getElementById('modal-achievements');
    if (modal) modal.classList.add('hidden');
    this.updateMobileNavActive(this.run && !document.getElementById('screen-hub').classList.contains('active') ? 'run' : 'hub');
  },

  renderAchievementsModal(filter = 'all') {
    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    const grid = document.getElementById('achievements-grid');
    if (!sys || !grid) return;

    const total = sys.ACHIEVEMENTS.length;
    const doneCount = sys.ACHIEVEMENTS.filter(a => this.meta.achievements && this.meta.achievements[a.id]).length;
    const unlockedClassesCount = Object.keys(GAME_DATA.characters).filter(cid => this.isClassUnlocked(cid)).length;
    const summaryEl = document.getElementById('achievements-summary');
    if (summaryEl) {
      const pct = Math.round((doneCount / total) * 100);
      summaryEl.innerHTML = `
        <div class="ach-summary-row">
          <span>🏆 달성 업적: <strong style="color:#f6c967;">${doneCount} / ${total} (${pct}%)</strong></span>
          <span>🧑 해금 클래스: <strong style="color:#55efc4;">${unlockedClassesCount} / 8</strong></span>
        </div>
        <div class="ach-total-bar"><div class="ach-total-fill" style="width:${pct}%"></div></div>
      `;
    }

    document.querySelectorAll('#achievements-tabs .ach-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === filter);
    });

    const list = sys.ACHIEVEMENTS.filter(a => filter === 'all' || a.category === filter);
    grid.innerHTML = '';
    list.forEach(ach => {
      const earned = !!(this.meta.achievements && this.meta.achievements[ach.id]);
      const prog = ach.progress ? ach.progress(this.meta.achStats || {}) : { cur: earned ? 1 : 0, max: 1 };
      const cur = earned ? prog.max : Math.min(prog.max, prog.cur);
      const pct = Math.round((cur / Math.max(1, prog.max)) * 100);

      const card = document.createElement('div');
      card.className = `ach-card ${earned ? 'earned' : 'locked'}`;
      card.innerHTML = `
        <div class="ach-card-top">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-meta">
            <h4>${ach.name} ${earned ? '<span class="ach-done-pill">✔ 달성</span>' : '<span class="ach-lock-pill">🔒 미달성</span>'}</h4>
            <p>${ach.desc}</p>
          </div>
        </div>
        <div class="ach-reward-line">${ach.rewardText}</div>
        <div class="ach-prog-wrap">
          <div class="ach-prog-bar"><div class="ach-prog-fill" style="width:${pct}%"></div></div>
          <span class="ach-prog-txt">${cur} / ${prog.max}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  },

  saveMeta() {
    try {
      localStorage.setItem('DND5E_SPIRE_2_TOWER_META', JSON.stringify(this.meta));
    } catch (e) { }
    this.updateTopHud();
  },

  // Active Run Auto-Save & Continue (PC <-> Mobile shared localStorage!)
  saveRun() {
    if (!this.run) return;
    try {
      localStorage.setItem('DND5E_SPIRE_2_ACTIVE_RUN', JSON.stringify(this.run));
    } catch (e) { }
  },

  loadSavedRun() {
    try {
      const raw = localStorage.getItem('DND5E_SPIRE_2_ACTIVE_RUN');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.charId && GAME_DATA.characters[parsed.charId] && parsed.hp > 0) {
        return parsed;
      }
    } catch (e) { }
    return null;
  },

  clearSavedRun() {
    try {
      localStorage.removeItem('DND5E_SPIRE_2_ACTIVE_RUN');
    } catch (e) { }
  },

  continueSavedRun() {
    const saved = this.loadSavedRun();
    if (!saved) {
      this.showToast('불러올 진행 중인 모험 데이터가 없습니다.', 'warn');
      return;
    }
    this.run = saved;
    this.combat = null;
    if (!this.run.actMap) this.run.actMap = this.generate30StageActMap(this.run.act || 1);
    this.switchScreen('screen-map');
    this.renderMap();
    this.showToast(`🔄 저장된 모험 복원! 제${this.run.act}계층 Stage ${this.run.stage}/15에서 이어갑니다.`, 'success');
  },

  abandonSavedRun() {
    this.clearSavedRun();
    if (this.run) {
      this.run = null;
      this.combat = null;
    }
    this.renderHub();
    this.updateTopHud();
    this.showToast('저장된 모험을 포기했습니다. 새 등반을 시작할 수 있습니다.', 'info');
  },

  // In-Game Non-Blocking Toast Notification (Replaces all browser alert() popups!)
  showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `game-toast toast-${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    while (container.children.length > 4) {
      container.removeChild(container.firstChild);
    }
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    }, 3200);
  },

  // D20 Dice Roll Result Modal (Replaces alert() for D&D fate checks!)
  showD20Modal(roll, dc, title, outcomeText, isSuccess, onClose = null) {
    SfxEngine.play('dice');
    this._d20OnClose = onClose;
    const modal = document.getElementById('modal-d20');
    if (!modal) {
      this.showToast(`🎲 D20 [${roll}] ${outcomeText}`, isSuccess ? 'success' : 'danger');
      if (onClose) onClose();
      return;
    }
    const titleEl = document.getElementById('d20-modal-title');
    const dieEl = document.getElementById('d20-die-number');
    const dcEl = document.getElementById('d20-dc-badge');
    const descEl = document.getElementById('d20-outcome-desc');
    if (titleEl) titleEl.textContent = title;
    if (dieEl) {
      dieEl.textContent = String(roll);
      dieEl.className = `d20-die-face ${roll === 20 ? 'nat20' : roll === 1 ? 'nat1' : isSuccess ? 'roll-pass' : 'roll-fail'}`;
    }
    if (dcEl) {
      dcEl.textContent = dc > 0
        ? `DC ${dc} — ${roll === 20 ? '대성공 (NAT 20)!' : roll === 1 ? '대실패 (NAT 1)!' : isSuccess ? '판정 성공 ✔' : '판정 실패 ✖'}`
        : `운명의 결과: [${roll}]`;
      dcEl.style.color = isSuccess ? '#2ed573' : '#ff6b81';
    }
    if (descEl) descEl.textContent = outcomeText;
    modal.classList.remove('hidden');
  },

  closeD20Modal() {
    const modal = document.getElementById('modal-d20');
    if (modal) modal.classList.add('hidden');
    const cb = this._d20OnClose;
    this._d20OnClose = null;
    if (cb) cb();
  },

  // Floating Combat VFX & Hit Shake (Rendered on persistent #vfx-layer so renderCombat() never clips animations!)
  spawnFloatingVfx(targetType, text, colorClass = 'vfx-dmg', enemyIdx = 0) {
    VfxEngine.floatText(targetType, text, colorClass, enemyIdx);
  },

  syncSceneBackground(screenId = null) {
    if (typeof window === 'undefined' || !window.PIXEL_BACKGROUNDS) return;
    let activeId = screenId;
    if (!activeId && typeof document !== 'undefined') {
      const cur = document.querySelector('.screen.active');
      activeId = cur ? cur.id : 'screen-hub';
    }
    if (activeId === 'screen-hub' || !this.run) {
      window.PIXEL_BACKGROUNDS.applyTheme('lobby', 0);
      return;
    }
    const actNum = this.run.act || 1;
    const bossId =
      (this.run.selectedBosses && this.run.selectedBosses[actNum]) ||
      (GAME_DATA.acts[actNum - 1] && GAME_DATA.acts[actNum - 1].bossPool[0]);
    window.PIXEL_BACKGROUNDS.applyTheme(bossId, actNum);
  },

  switchScreen(screenId) {
    this.closeAllNavModals();
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    if (typeof window !== 'undefined' && window.scrollTo) {
      try { window.scrollTo(0, 0); } catch (e) { }
    }
    this.updateMobileNavActive(screenId === 'screen-hub' ? 'hub' : 'run');
    this.syncSceneBackground(screenId);
    this.updateTopHud();
  },

  showHub() {
    this.closeAllNavModals();
    if (this.run && this.run.hp > 0) {
      this.saveRun();
    }
    this.switchScreen('screen-hub');
    this.renderHub();
  },

  // --------------------------------------------------------------------------
  // COMPUTE TOTAL PERMANENT BONUSES (Rank + Level + Gear + Feats)
  // No pre-selected subclass in lobby: players pick 1 of 8 main classes and
  // freely draft from all 44 class cards (4 shared + 4x10 subclass archetypes) in-run!
  // --------------------------------------------------------------------------
  getHunterTotalBonuses(charId) {
    const ch = GAME_DATA.characters[charId];
    const currentRank = this.meta.ranks[charId] || ch.baseRank;
    const rankBonus = GAME_DATA.rankBonuses[currentRank] || GAME_DATA.rankBonuses.C;
    const hunterLv = this.meta.levels[charId] || 1;

    let bonusHp = rankBonus.hp + (hunterLv - 1) * 2;
    let bonusStr = Math.floor((rankBonus.str || 0) * 0.5) + Math.floor(hunterLv / 8);
    let bonusDex = Math.floor((rankBonus.dex || 0) * 0.5) + Math.floor(hunterLv / 9);
    let bonusResourceStart = rankBonus.resourceStart || 0;
    let firstTurnBlock = 0;
    let healAfterCombat = 0;
    let summonBoost = 0;

    // Equipped Magic Gear (Balanced so C-rank starter gear doesn't inflate base stats)
    const wId = this.meta.equipped.weapon;
    if (wId && GAME_DATA.equipment[wId]) {
      const w = GAME_DATA.equipment[wId];
      const lv = this.meta.gearLevels[wId] || 0;
      const rawStr = (w.id === 'c_dagger' ? 0 : w.baseStr) + lv * w.strPerLv;
      bonusStr += Math.floor(rawStr * 0.55);
      if (w.resourceBonus) bonusResourceStart += w.resourceBonus;
    }

    const aId = this.meta.equipped.armor;
    if (aId && GAME_DATA.equipment[aId]) {
      const a = GAME_DATA.equipment[aId];
      const lv = this.meta.gearLevels[aId] || 0;
      const rawHp = (a.id === 'c_vest' ? 0 : a.baseHp) + lv * a.hpPerLv;
      bonusHp += Math.round(rawHp * 0.55);
      bonusDex += Math.floor((a.baseDex || 0) * 0.5);
    }

    const accId = this.meta.equipped.accessory;
    if (accId && GAME_DATA.equipment[accId]) {
      const acc = GAME_DATA.equipment[accId];
      const lv = this.meta.gearLevels[accId] || 0;
      const rawBlk = (acc.id === 'c_ring' ? 2 : acc.baseBlock) + lv * acc.blockPerLv;
      firstTurnBlock += Math.round(rawBlk * 0.55);
      healAfterCombat += Math.min(2, acc.healAfterCombat || 0);
      summonBoost += Math.floor((acc.summonBoost || 0) * 0.5);
    }

    // Feats / Masteries
    const m = this.meta.masteryLevels;
    bonusHp += (m.vitality_training || 0) * 8;
    bonusStr += m.mana_circulation || 0;
    bonusResourceStart += m.mana_circulation || 0;
    const bonusDrawFirstTurn = m.tactical_intel || 0;
    let bonusGoldStart = (m.guild_funding || 0) * 45;
    let expMultPct = (m.exp_accelerator || 0) * 25;
    const bonusMaxEnergy = m.core_overdrive || 0;

    // Class Level Milestones (Clear tangible differences when training Class Level!)
    const startUpgradedCards = hunterLv >= 10 ? 2 : hunterLv >= 3 ? 1 : 0;
    const startBonusPotions = hunterLv >= 5 ? 1 : 0;
    const startBonusSp = hunterLv >= 7 ? 1 : 0;
    if (hunterLv >= 2) bonusGoldStart += 35;
    if (hunterLv >= 10) expMultPct += 15;

    // Rank Card Pool Unlocks & Class-Unique Rank Relics
    const rankOrder = { C: 0, B: 1, A: 2, S: 3 };
    const rLevel = rankOrder[currentRank] || 0;
    const unlockedRarities =
      rLevel >= 2 ? ['common', 'uncommon', 'rare', 'legendary'] : rLevel >= 1 ? ['common', 'uncommon', 'rare'] : ['common', 'uncommon'];
    const unlockedRankRelics = [];
    if (ch.rankRelics) {
      if (rLevel >= 1 && ch.rankRelics.B) unlockedRankRelics.push(ch.rankRelics.B);
      if (rLevel >= 3 && ch.rankRelics.S) unlockedRankRelics.push(ch.rankRelics.S);
    }

    return {
      currentRank,
      rankLevel: rLevel,
      hunterLv,
      totalMaxHp: ch.maxHp + bonusHp,
      bonusHp,
      bonusStr,
      bonusDex,
      bonusResourceStart,
      firstTurnBlock,
      healAfterCombat,
      summonBoost,
      bonusDrawFirstTurn,
      bonusGoldStart,
      expMultPct,
      bonusMaxEnergy,
      startUpgradedCards,
      startBonusPotions,
      startBonusSp,
      unlockedRarities,
      unlockedRankRelics
    };
  },

  // --------------------------------------------------------------------------
  // HUB: 8 CLASSES GRID & 4 SUBCLASS ARCHETYPE OVERVIEW (ALL UNLOCKED, NO GACHA)
  // --------------------------------------------------------------------------
  renderHub() {
    const grid = document.getElementById('hub-char-grid');
    grid.innerHTML = '';

    const bestRecEl = document.getElementById('hub-best-record');
    if (bestRecEl) {
      bestRecEl.textContent = `제${this.meta.bestAct || 1}층 - Stage ${this.meta.bestStage || 1} / 15 (총 ${this.meta.totalClimbs || 0}회 등반)`;
    }

    // Show Continue Saved Run Banner if an active run exists!
    const contBanner = document.getElementById('continue-run-banner');
    if (contBanner) {
      const savedRun = this.loadSavedRun();
      if (savedRun) {
        const sch = GAME_DATA.characters[savedRun.charId];
        contBanner.classList.remove('hidden');
        contBanner.innerHTML = `
          <div class="continue-run-info">
            <span class="continue-tag">💾 자동 저장된 모험</span>
            <strong>${sch ? sch.name : savedRun.charId}</strong>
            <span>· 제${savedRun.act}계층 Stage ${savedRun.stage}/15 · ❤️ ${savedRun.hp}/${savedRun.maxHp} · 🪙 ${savedRun.gold} GP · 🎴 ${savedRun.deck.length}장</span>
          </div>
          <div class="continue-run-actions">
            <button class="btn-primary" onclick="Game.continueSavedRun()">🔄 모험 이어하기</button>
            <button class="hud-btn danger-btn" onclick="Game.abandonSavedRun()">🗑️ 포기</button>
          </div>
        `;
      } else {
        contBanner.classList.add('hidden');
        contBanner.innerHTML = '';
      }
    }

    Object.values(GAME_DATA.characters).forEach(ch => {
      const stats = this.getHunterTotalBonuses(ch.id);
      const isSelected = this.meta.selectedCharId === ch.id;
      const isUnlocked = this.isClassUnlocked(ch.id);
      const bestFloor = (this.meta.classBestFloor && this.meta.classBestFloor[ch.id]) || '1층 1F';

      const card = document.createElement('div');
      card.className = `char-roster-card ${isSelected ? 'selected' : ''} ${isUnlocked ? '' : 'char-locked'}`;
      card.onclick = () => {
        this.meta.selectedCharId = ch.id;
        this.renderHub();
      };

      card.innerHTML = `
        <span class="char-rarity-badge rank-badge rank-${stats.currentRank}">${isUnlocked ? `${stats.currentRank}급` : '🔒'}</span>
        <span class="char-star-badge">${isUnlocked ? `Lv.${stats.hunterLv}` : '잠김'}</span>
        <div class="char-avatar-wrap">${ch.avatarSvg}</div>
        <h3>${ch.name.split(' ')[0]}</h3>
        <div class="char-archetype" style="font-size:0.65rem;">${isUnlocked ? (ch.uniqueStatusName || `${ch.secondaryResourceIcon} 44종 카드 풀`) : '🏆 업적 해금 클래스'}</div>
        <div class="char-curve-tag" style="font-size:0.61rem; color:${ch.growthCurve && ch.growthCurve.includes('왕귀') ? '#a29bfe' : '#fdcb6e'}; font-weight:800; margin-top:2px;">
          ${ch.growthCurve ? ch.growthCurve.split(' (')[0] : ''}
        </div>
        <div class="char-roster-stats">
          <span>❤️ ${stats.totalMaxHp}</span>
          <span>⚔️ +${stats.bonusStr}</span>
        </div>
        <div class="char-roster-best">
          ${isUnlocked ? `🏔️ ${bestFloor}` : '🔒 클릭해 조건 확인'}
        </div>
      `;
      grid.appendChild(card);
    });

    this.updateAchievementBadges();
    this.renderLobbyNpcBar();
    this.renderSelectedCharPanel();
  },

  renderLobbyNpcBar() {
    const bar = document.getElementById('hub-npc-bar');
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (!bar || !se || !se.NPCS) return;
    const talked = this.meta.talkedNpcs || {};
    bar.innerHTML = `
      <div class="hub-npc-bar-head">
        <span>🍺 <strong>잿빛 화덕 여관 인물들과 대화하기</strong> <small>(대화 전용 화면 입장 · 첫 대화 보너스 💎+20)</small></span>
        <button class="hud-btn btn-story-hud" style="padding:3px 9px; font-size:0.72rem;" onclick="Game.openStoryChronicleModal()">📖 메인 스토리 연대기</button>
      </div>
      <div class="hub-npc-chips">
        ${Object.values(se.NPCS)
          .map(npc => {
            const isNew = !talked[npc.id];
            return `
              <button class="npc-talk-chip ${isNew ? 'npc-new' : ''}" onclick="Game.openTavernNpcDialogue('${npc.id}')" title="${npc.title}">
                <div class="npc-chip-sprite">${npc.svg}</div>
                <div class="npc-chip-info">
                  <strong style="color:${npc.accent};">${npc.name.split(' ')[0]}</strong>
                  <span>${isNew ? '💬 NEW +20💎' : '💬 대화하기'}</span>
                </div>
              </button>
            `;
          })
          .join('')}
      </div>
    `;
  },

  previewLobbyEmotion(charId, emotion = 'neutral') {
    const ps = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
    if (!ps) return;
    if (this._lobbyEmoChar !== charId) {
      this._lobbyEmoChar = charId;
      this._lobbyEmo = 'neutral';
      this._lobbyEmoVariant = 0;
    }
    const pool = (ps.MOTION_POOLS && ps.MOTION_POOLS[`emo_${emotion}`]) || ['mot-neutral-breathe'];
    if (this._lobbyEmo === emotion) {
      this._lobbyEmoVariant = ((this._lobbyEmoVariant || 0) + 1) % pool.length;
    } else {
      this._lobbyEmo = emotion;
      this._lobbyEmoVariant = 0;
    }
    const motionCls = pool[this._lobbyEmoVariant];
    const box = document.getElementById('hub-emo-preview-box');
    const labelEl = document.getElementById('hub-emo-motion-tag');
    const meta = (ps.EMOTION_META && ps.EMOTION_META[emotion]) || { icon: '🙂', label: '평온', color: '#dfe6e9' };
    if (box) {
      box.className = 'hub-emo-preview';
      box.innerHTML = ps.getHeroEmotionSprite(charId, emotion);
      void box.offsetWidth;
      box.classList.add(motionCls);
    }
    if (labelEl) {
      labelEl.innerHTML = `<span style="color:${meta.color};">${meta.icon} ${meta.label}</span> · 모션 ${this._lobbyEmoVariant + 1}/${pool.length}`;
    }
    document.querySelectorAll('.hub-emo-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.emo === emotion);
    });
  },

  renderSelectedCharPanel() {
    const panel = document.getElementById('hub-selected-panel');
    const ch = GAME_DATA.characters[this.meta.selectedCharId];
    const stats = this.getHunterTotalBonuses(ch.id);
    const ps = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
    if (this._lobbyEmoChar !== ch.id) {
      this._lobbyEmoChar = ch.id;
      this._lobbyEmo = 'neutral';
      this._lobbyEmoVariant = 0;
    }
    const activeEmo = this._lobbyEmo || 'neutral';
    const previewSprite = ps && ps.getHeroEmotionSprite ? ps.getHeroEmotionSprite(ch.id, activeEmo) : ch.avatarSvg;
    const emoBtnsHtml = (ps && ps.EMOTIONS ? ps.EMOTIONS : ['neutral', 'happy', 'angry', 'sad', 'surprised', 'smug'])
      .map(eId => {
        const m = (ps && ps.EMOTION_META && ps.EMOTION_META[eId]) || { icon: '🙂', label: eId, color: '#dfe6e9' };
        return `<button class="hub-emo-btn ${activeEmo === eId ? 'active' : ''}" data-emo="${eId}" onclick="Game.previewLobbyEmotion('${ch.id}', '${eId}')" title="다시 누르면 같은 감정의 2번째 모션 재생!">${m.icon} ${m.label}</button>`;
      })
      .join('');

    const lvCost = stats.hunterLv * 50;
    const nextRankMap = { C: 'B', B: 'A', A: 'S', S: null };
    const nextRank = nextRankMap[stats.currentRank];
    const rankGemCost = stats.currentRank === 'C' ? 120 : stats.currentRank === 'B' ? 220 : 350;

    const wObj = GAME_DATA.equipment[this.meta.equipped.weapon];
    const aObj = GAME_DATA.equipment[this.meta.equipped.armor];
    const accObj = GAME_DATA.equipment[this.meta.equipped.accessory];

    const sys = typeof window !== 'undefined' ? window.ACHIEVEMENT_SYSTEM : null;
    const isCharUnlocked = this.isClassUnlocked(ch.id);
    const isLegUnlocked = this.isLegendaryUnlocked(ch.id);
    const classUnlockHint = sys ? sys.getUnlockHintForClass(ch.id) : '';
    const legUnlockHint = sys ? sys.getUnlockHintForLegendary(ch.id) : '';

    const subCardsHtml = ch.subclasses
      .map(sub => {
        const lCard = GAME_DATA.cards[sub.legendaryCard];
        const subUnlocked = this.isSubclassUnlocked(sub.id);
        const subHint = sys ? sys.getUnlockHintForSubclass(sub.id) : '';
        return `
          <div class="subclass-card ${subUnlocked ? '' : 'subclass-locked'}" onclick="Game.openClassCompendium('${ch.id}', '${sub.id}')" title="클릭하면 이 하위 직업 계통의 카드 10종을 도감에서 확인합니다">
            <h4>
              <span>${subUnlocked ? sub.icon : '🔒'} ${sub.name}</span>
              <span style="font-size:0.66rem; color:${subUnlocked ? '#00d2d3' : '#ff7675'};">${subUnlocked ? '🔓 해금됨 · 도감 🔎' : '🔒 업적 잠김'}</span>
            </h4>
            <p>${sub.desc}</p>
            <div style="font-size:0.67rem; color:${subUnlocked ? '#fdcb6e' : '#f6c967'}; margin-top:3px;">
              ${subUnlocked ? `👑 전설 카드: [${lCard ? lCard.name : ''}] ${isLegUnlocked ? '(🔓 해금)' : '(🔒 업적 필요)'}` : `🏆 ${subHint}`}
            </div>
          </div>
        `;
      })
      .join('');

    const lvMilestones = [
      { lv: 2, label: 'Lv.2: 시작 +35 GP' },
      { lv: 3, label: 'Lv.3: 시작 카드 1장 강화(+)' },
      { lv: 5, label: 'Lv.5: 전투 물약 +1개 지참' },
      { lv: 7, label: 'Lv.7: 시작 SP +1 지급' },
      { lv: 10, label: 'Lv.10: 시작 카드 2장(+) & EXP +15%' }
    ];
    const lvPerkSummary = lvMilestones
      .map(m => {
        const done = stats.hunterLv >= m.lv;
        return `<span style="color:${done ? '#2ed573' : '#636e72'}; font-weight:${done ? '800' : '600'};">${done ? '✔' : '🔒'} ${m.label}</span>`;
      })
      .join(' · ');

    const rankBRelic = ch.rankRelics && GAME_DATA.relics[ch.rankRelics.B];
    const rankSRelic = ch.rankRelics && GAME_DATA.relics[ch.rankRelics.S];
    const rankUnlockSummary = `
      <div style="font-size:0.71rem; line-height:1.45; background:rgba(0,0,0,0.32); padding:7px 9px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
        <div style="color:${stats.rankLevel >= 1 ? '#74b9ff' : '#7f8fa6'};">
          ${stats.rankLevel >= 1 ? '✔' : '🔒'} <strong>[B급 해금]</strong> 희귀(Rare) 카드 풀 해금 + ${rankBRelic ? rankBRelic.name : 'B급 고유 유물'}
        </div>
        <div style="color:${stats.rankLevel >= 2 ? '#c56cf0' : '#7f8fa6'};">
          ${stats.rankLevel >= 2 ? '✔' : '🔒'} <strong>[A급 해금]</strong> 전설(Legendary) 카드 풀 해금 + 각성 카드 시작 덱 추가
        </div>
        <div style="color:${stats.rankLevel >= 3 ? '#f6c967' : '#7f8fa6'};">
          ${stats.rankLevel >= 3 ? '✔' : '🔒'} <strong>[S급 해금]</strong> 각성 카드(+) 강화 시작 + ${rankSRelic ? rankSRelic.name : 'S급 신화 유물'}
        </div>
      </div>
    `;

    panel.innerHTML = `
      <div class="selected-info-left">
        <h2>
          <span class="rank-badge rank-${stats.currentRank}">${stats.currentRank}급</span>
          <span style="color:${ch.accent}">${ch.name}</span>
          <span style="font-size:0.86rem; color:#dfe6e9;">— ${ch.heroName}</span>
          <button class="hud-btn" style="font-size:0.74rem; padding:4px 9px; border-color:#fdcb6e; color:#ffeaa7;" onclick="Game.openClassCompendium('${ch.id}', 'all')">
            📖 전체 44종 카드 도감 (해금: ${stats.unlockedRarities.join('/')})
          </button>
        </h2>
        <div class="hub-emotion-studio">
          <div id="hub-emo-preview-box" class="hub-emo-preview">${previewSprite}</div>
          <div class="hub-emo-controls">
            <div class="hub-emo-head">
              <span>🎭 <strong>6종 감정 에셋 & 모션 스튜디오</strong></span>
              <span id="hub-emo-motion-tag" style="color:#ffeaa7; font-weight:700;">같은 감정 재클릭 시 모션 1↔2 전환!</span>
            </div>
            <div class="hub-emo-btns">${emoBtnsHtml}</div>
          </div>
        </div>
        <div class="subclass-picker-title">
          🎴 <strong>${ch.name.split(' ')[0]}의 4대 하위 직업 카드 계통</strong> · <span style="color:#55efc4;">${ch.growthCurve || ''}</span>
        </div>
        <div class="subclass-grid">
          ${subCardsHtml}
        </div>
      </div>

      <div class="growth-dashboard-box">
        <div class="growth-stat-row">
          <span>❤️ 출격 체력: <strong style="color:#ff6b81">${stats.totalMaxHp}</strong></span>
          <span>⚔️ 시작 힘: <strong style="color:#fdcb6e">+${stats.bonusStr}</strong></span>
          <span>🛡️ 민첩: <strong style="color:#55efc4">+${stats.bonusDex}</strong></span>
        </div>
        ${rankUnlockSummary}
        <div style="font-size:0.69rem; line-height:1.45; color:#a4b0be; background:rgba(0,0,0,0.22); padding:6px 8px; border-radius:8px;">
          <strong style="color:#dfe6e9;">📈 클래스 레벨 특전 (현재 Lv.${stats.hunterLv}):</strong><br/>
          ${lvPerkSummary}
        </div>
        <div class="growth-stat-row" style="color:#a4b0be; font-size:0.72rem;">
          <span>무구: ${wObj.icon}+${this.meta.gearLevels[wObj.id] || 0} | ${aObj.icon}+${this.meta.gearLevels[aObj.id] || 0} | ${accObj.icon}+${this.meta.gearLevels[accObj.id] || 0}</span>
          <span>🏔️ 최고: <strong style="color:#55efc4">${(this.meta.classBestFloor && this.meta.classBestFloor[ch.id]) || '1층 1F'}</strong></span>
        </div>
        <div class="growth-btn-row">
          <button class="btn-growth-action" onclick="Game.levelUpHunter('${ch.id}')">
            ⬆️ 클래스 훈련 (Lv.${stats.hunterLv}→${stats.hunterLv + 1})<br/>
            <span style="color:#18dcff">💎 ${lvCost} 등반 마석</span>
          </button>
          ${nextRank
        ? `<button class="btn-growth-action reawaken" onclick="Game.promoteHunterRank('${ch.id}')">
                  🌟 ${stats.currentRank}급 ➔ ${nextRank}급 티어 승급!<br/>
                  <span style="color:#ffeaa7">💎 ${rankGemCost} 등반 마석</span>
                </button>`
        : `<button class="btn-growth-action reawaken" disabled>👑 최고 등급 [S급 반신] 달성!</button>`
      }
        </div>
      </div>

      <div>
        ${isCharUnlocked
        ? `<button class="btn-start-run" onclick="Game.startRunFromHub('${ch.id}')">
              🏔️ 첨탑 등반 시작 ➔<br/>
              <span style="font-size:0.75rem; font-weight:600; color:#ffeaa7;">[${stats.currentRank}급 · Lv.${stats.hunterLv} · 전설 ${isLegUnlocked ? '🔓해금' : '🔒잠김'}]</span>
            </button>`
        : `<button class="btn-start-run btn-locked-run" onclick="Game.openAchievementsModal('class')">
              🔒 업적 달성 시 해금 🏆<br/>
              <span style="font-size:0.7rem; font-weight:600; color:#ffeaa7;">${classUnlockHint}</span>
            </button>`
      }
        ${!isLegUnlocked && isCharUnlocked
        ? `<div style="font-size:0.66rem; color:#f6c967; text-align:center; margin-top:6px; cursor:pointer;" onclick="Game.openAchievementsModal('legendary')">👑 전설 해금: ${legUnlockHint}</div>`
        : ''
      }
      </div>
    `;
  },

  levelUpHunter(charId) {
    const curLv = this.meta.levels[charId] || 1;
    const cost = curLv * 50;
    if (this.meta.gems < cost) {
      this.showToast(`등반 마석이 부족합니다! (필요: 💎${cost}, 보유: 💎${this.meta.gems})`, 'warn');
      return;
    }
    this.meta.gems -= cost;
    this.meta.levels[charId] = curLv + 1;
    this.saveMeta();
    this.renderHub();
    this.showToast(`⬆️ [${GAME_DATA.characters[charId].name}] Lv.${curLv + 1} 훈련 완료!`, 'success');
  },

  promoteHunterRank(charId) {
    const curRank = this.meta.ranks[charId] || GAME_DATA.characters[charId].baseRank;
    const nextRankMap = { C: 'B', B: 'A', A: 'S', S: null };
    const nextRank = nextRankMap[curRank];
    if (!nextRank) return;

    const gemCost = curRank === 'C' ? 120 : curRank === 'B' ? 220 : 350;
    if (this.meta.gems < gemCost) {
      this.showToast(`승급 마석 부족! 필요: 💎${gemCost} (보유: 💎${this.meta.gems})`, 'warn');
      return;
    }

    this.meta.gems -= gemCost;
    this.meta.ranks[charId] = nextRank;
    this.saveMeta();
    this.renderHub();
    this.showToast(`🌟 [${GAME_DATA.characters[charId].name}] ${GAME_DATA.rankNames[nextRank]} 승급 완료!`, 'success');
  },

  // --------------------------------------------------------------------------
  // MAGIC GEAR & FEATS
  // --------------------------------------------------------------------------

  openGearModal() {
    this.closeAllNavModals();
    document.getElementById('modal-gear').classList.remove('hidden');
    this.renderGearModal();
    this.updateMobileNavActive('gear');
  },

  closeGearModal() {
    document.getElementById('modal-gear').classList.add('hidden');
    this.renderHub();
    this.updateMobileNavActive(this.run && !document.getElementById('screen-hub').classList.contains('active') ? 'run' : 'hub');
  },

  renderGearModal() {
    const summaryEl = document.getElementById('gear-slots-summary');
    const slots = [
      { key: 'weapon', label: '🗡️ 장착 무기' },
      { key: 'armor', label: '🛡️ 장착 갑주' },
      { key: 'accessory', label: '💍 장착 장신구' }
    ];

    summaryEl.innerHTML = slots
      .map(s => {
        const eqId = this.meta.equipped[s.key];
        const eq = GAME_DATA.equipment[eqId];
        const lv = this.meta.gearLevels[eqId] || 0;
        return `
          <div class="gear-slot-box">
            <div style="font-size:0.78rem; color:#a4b0be; margin-bottom:4px;">${s.label}</div>
            <div style="font-weight:900; font-size:0.92rem;">
              <span class="rank-badge rank-${eq.rank}">${eq.rank}급</span> ${eq.icon} ${eq.name} <span style="color:#00ff88">+${lv}</span>
            </div>
          </div>
        `;
      })
      .join('');

    const grid = document.getElementById('gear-list-grid');
    grid.innerHTML = '';

    Object.values(GAME_DATA.equipment).forEach(item => {
      const isUnlocked = !!this.meta.gearUnlocked[item.id];
      const lv = this.meta.gearLevels[item.id] || 0;
      const isEquipped = this.meta.equipped[item.slot] === item.id;
      const upgCost = (lv + 1) * 60;

      let statText = '';
      if (item.slot === 'weapon') {
        statText = `⚔️ 시작 힘 +${Math.round(item.baseStr + lv * item.strPerLv)}${item.resourceBonus ? ` | 고유자원 +${item.resourceBonus}` : ''
          }`;
      } else if (item.slot === 'armor') {
        statText = `❤️ 최대 체력 +${Math.round(item.baseHp + lv * item.hpPerLv)}${item.baseDex ? ` | 민첩 +${item.baseDex}` : ''
          }`;
      } else {
        statText = `🛡️ 첫 턴 방어도 +${Math.round(item.baseBlock + lv * item.blockPerLv)}${item.summonBoost ? ` | 소환수/구체 +${item.summonBoost}` : ''
          }`;
      }

      const card = document.createElement('div');
      card.className = `gear-card ${isEquipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="rank-badge rank-${item.rank}">${item.rank}급 ${item.slot.toUpperCase()}</span>
            <span style="font-weight:900; color:#00ff88;">+${lv} 강화</span>
          </div>
          <h4 style="font-size:0.94rem; margin-bottom:4px;">${item.icon} ${item.name}</h4>
          <div style="font-size:0.8rem; color:#fdcb6e; font-weight:800; margin-bottom:4px;">${statText}</div>
          <p style="font-size:0.75rem; color:#a4b0be;">${item.desc}</p>
        </div>
        <div style="display:flex; gap:6px; margin-top:6px;">
          ${!isUnlocked
          ? `<button class="btn-growth-action" onclick="Game.unlockGear('${item.id}')">🔓 해금 (💎 ${item.unlockCost})</button>`
          : `
                <button class="btn-growth-action" ${isEquipped ? 'disabled' : ''} onclick="Game.equipGear('${item.id}')">
                  ${isEquipped ? '✔ 장착 중' : '장착하기'}
                </button>
                <button class="btn-growth-action reawaken" ${lv >= 10 ? 'disabled' : ''} onclick="Game.upgradeGear('${item.id}')">
                  ${lv >= 10 ? 'MAX' : `⚒️ +${lv + 1} 강화 (💎${upgCost})`}
                </button>
              `
        }
        </div>
      `;
      grid.appendChild(card);
    });
  },

  unlockGear(gearId) {
    const item = GAME_DATA.equipment[gearId];
    if (this.meta.gems < item.unlockCost) {
      this.showToast(`마석이 부족합니다! (필요: 💎${item.unlockCost})`, 'warn');
      return;
    }
    this.meta.gems -= item.unlockCost;
    this.meta.gearUnlocked[gearId] = true;
    this.meta.gearLevels[gearId] = 0;
    this.meta.equipped[item.slot] = gearId;
    this.saveMeta();
    this.renderGearModal();
    this.showToast(`🔓 [${item.name}] 해금 및 장착 완료!`, 'success');
  },

  equipGear(gearId) {
    const item = GAME_DATA.equipment[gearId];
    this.meta.equipped[item.slot] = gearId;
    this.saveMeta();
    this.renderGearModal();
  },

  upgradeGear(gearId) {
    const lv = this.meta.gearLevels[gearId] || 0;
    if (lv >= 10) return;
    const cost = (lv + 1) * 60;
    if (this.meta.gems < cost) {
      this.showToast(`마석이 부족합니다! (필요: 💎${cost})`, 'warn');
      return;
    }
    this.meta.gems -= cost;
    this.meta.gearLevels[gearId] = lv + 1;
    this.saveMeta();
    this.renderGearModal();
    this.showToast(`⚒️ [${GAME_DATA.equipment[gearId].name}] +${lv + 1} 강화 성공!`, 'success');
  },

  openMasteryModal() {
    this.closeAllNavModals();
    document.getElementById('modal-mastery').classList.remove('hidden');
    this.renderMasteryModal();
    this.updateMobileNavActive('mastery');
  },

  closeMasteryModal() {
    document.getElementById('modal-mastery').classList.add('hidden');
    this.renderHub();
    this.updateMobileNavActive(this.run && !document.getElementById('screen-hub').classList.contains('active') ? 'run' : 'hub');
  },

  renderMasteryModal() {
    const grid = document.getElementById('mastery-grid');
    grid.innerHTML = '';

    GAME_DATA.masteries.forEach(m => {
      const lv = this.meta.masteryLevels[m.id] || 0;
      const isMax = lv >= m.maxLv;
      const cost = m.baseCost * (lv + 1);

      const card = document.createElement('div');
      card.className = 'mastery-card';
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <strong style="color:#ffeaa7; font-size:0.94rem;">${m.name}</strong>
            <span style="font-size:0.8rem; color:#00d2d3; font-weight:900;">Lv.${lv} / ${m.maxLv}</span>
          </div>
          <p style="font-size:0.78rem; color:#dfe6e9; line-height:1.4;">${m.desc}</p>
        </div>
        <button class="btn-growth-action ${isMax ? '' : 'reawaken'}" ${isMax ? 'disabled' : ''} onclick="Game.upgradeMastery('${m.id}')">
          ${isMax ? '👑 마스터 완료' : `⬆️ 특성 습득 (💎 ${cost} 마석)`}
        </button>
      `;
      grid.appendChild(card);
    });
  },

  upgradeMastery(mId) {
    const m = GAME_DATA.masteries.find(x => x.id === mId);
    const lv = this.meta.masteryLevels[mId] || 0;
    if (lv >= m.maxLv) return;
    const cost = m.baseCost * (lv + 1);
    if (this.meta.gems < cost) {
      this.showToast(`마석이 부족합니다! (필요: 💎${cost})`, 'warn');
      return;
    }
    this.meta.gems -= cost;
    this.meta.masteryLevels[mId] = lv + 1;
    this.saveMeta();
    this.renderMasteryModal();
    this.showToast(`📜 [${m.name}] Lv.${lv + 1} 습득!`, 'success');
  },

  // --------------------------------------------------------------------------
  // START NEW RUN: 5 ACTS (FLOORS) x 30 STAGES PER FLOOR (150 STAGES)
  // Full 44-Card Pool per Class (4 Shared Cards + 4 Subclasses x 10 Cards = 44 Cards)!
  // --------------------------------------------------------------------------
  getActiveSubclassCardPool(charId) {
    const ch = GAME_DATA.characters[charId];
    return [...(ch.cardPool || [])];
  },

  openClassCompendium(charId, filterSubId = 'all') {
    this.closeAllNavModals();
    const ch = GAME_DATA.characters[charId];
    const modal = document.getElementById('modal-deck');
    const titleEl = document.getElementById('deck-modal-title');
    const subEl = document.getElementById('deck-modal-subtitle');
    const grid = document.getElementById('deck-modal-grid');
    grid.innerHTML = '';

    let allIds = [];
    if (filterSubId === 'all') {
      titleEl.textContent = `📖 ${ch.name} 전체 카드 도감 (총 44종: 공용 4종 + 하위직업 4×10종)`;
      allIds = [...(ch.sharedCards || [])];
      ch.subclasses.forEach(s => allIds.push(...(s.cards || [])));
    } else {
      const subObj = ch.subclasses.find(s => s.id === filterSubId);
      titleEl.textContent = `📖 ${ch.name} — [${subObj ? subObj.name : ''}] 전용 카드 10종 + 공용 4종`;
      allIds = [...(ch.sharedCards || []), ...(subObj ? subObj.cards : [])];
    }
    subEl.textContent = '등급 체계: [일반(Common)] · [고급(Uncommon)] · [희귀(Rare)] · [전설(Legendary)] — 던전에서 자유롭게 조합해 나만의 빌드를 완성하세요!';

    allIds.forEach(cid => {
      const cInst = this.createCardInstance(cid);
      const cardEl = this.createCardElement(cInst, null);
      grid.appendChild(cardEl);
    });

    modal.classList.remove('hidden');
  },

  startNewRun(charId) {
    const ch = GAME_DATA.characters[charId];
    const stats = this.getHunterTotalBonuses(charId);

    // Starter deck uses ONLY the Class's Shared Cards (4x Strike, 4x Defend, 1x Shared Uncommon)
    const deck = ch.starterDeck.map((cardId, idx) => this.createCardInstance(cardId, idx));

    // Class Level Milestone: Upgrade starter cards (+1 card at Lv.3+, +2 cards at Lv.10+)
    if (stats.startUpgradedCards > 0) {
      // Upgrade the signature shared uncommon card first, then 1 starter strike
      const sigCard = deck[deck.length - 1];
      if (sigCard) sigCard.upgraded = true;
      if (stats.startUpgradedCards >= 2 && deck[0]) {
        deck[0].upgraded = true;
      }
    }

    // Rank A / S adds the 4th Shared Awakening Card to the starter deck (S-Rank starts upgraded!)
    if (stats.currentRank === 'A' || stats.currentRank === 'S') {
      const awkCard = this.createCardInstance(ch.awakeningCard, 99);
      if (stats.currentRank === 'S') awkCard.upgraded = true;
      deck.push(awkCard);
    }

    // Starting Relics: Base Class Relic + Unlocked B-Rank / S-Rank Class-Unique Relics!
    const startRelics = [ch.startRelic, ...(stats.unlockedRankRelics || [])];
    const startPotions = ['rad_heal'];
    if (stats.startBonusPotions > 0) {
      startPotions.push('fury_stim');
    }

    // Extra Max HP if S-rank Barbarian relic is equipped
    const extraSRelicHp = startRelics.includes('bar_rank_s') ? 12 : 0;

    // Randomly roll 1 of the 4 Bosses & 1 of the Mid-Bosses for each of the 5 Acts!
    const selectedBosses = {};
    const selectedMidBosses = {};
    GAME_DATA.acts.forEach(a => {
      const bPool = a.bossPool;
      const mPool = a.midBossPool;
      selectedBosses[a.act] = bPool[Math.floor(Math.random() * bPool.length)];
      selectedMidBosses[a.act] = mPool[Math.floor(Math.random() * mPool.length)];
    });

    this.run = {
      charId,
      subclassId: null,
      subclassObj: { icon: ch.secondaryResourceIcon, name: ch.name },
      rank: stats.currentRank,
      runLv: 1,
      runExp: 0,
      runNextExp: 75,
      sp: stats.startBonusSp || 0, // Lv.7+ Class Milestone grants +1 starting SP!
      pendingCardDrafts: 0, // Card rewards are earned upon Level-Up (plus Boss/Midboss kills)!
      allocatedStats: {
        str: 0,
        dex: 0,
        vit: 0,
        mana: 0
      },
      permStats: stats,
      maxHp: stats.totalMaxHp + extraSRelicHp,
      hp: stats.totalMaxHp + extraSRelicHp,
      gold: 80 + stats.bonusGoldStart,
      act: 1, // Act 1 ~ 5 (총 5개 층)
      maxActs: 5,
      stage: 1, // Stage 1 ~ 15 per Act (슬더스 표준: 1개 층당 15개 스테이지!)
      stagesPerAct: 15,
      currentLane: null,
      neowLamentCharges: 0, // Neow's Lament: First 3 combats have 1 HP enemies
      penNibCounter: 0, // Pen Nib relic counter (every 7th attack deals double damage)
      selectedBosses,
      selectedMidBosses,
      deck,
      relics: startRelics,
      potions: startPotions,
      maxPotions: 3,
      shopRemoveCount: 0,
      shopMutateCount: 0,
      currentShopState: null,
      seenEvents: [],
      actMap: null
    };
    this.run.actMap = this.generate30StageActMap(1);
    this.saveRun();

    if (this.isStoryCutinEnabled() && typeof window !== 'undefined' && window.STORY_ENGINE) {
      this.showStoryCutin(1, () => this.openNeowBlessingScreen());
    } else {
      this.openNeowBlessingScreen();
    }
  },

  // Slay the Spire 1 + BG3 Astral Prism Guardian Blessing at Act 1 Floor 1
  openNeowBlessingScreen() {
    if (!this.run || !GAME_DATA.neowBlessings) return;
    this.switchScreen('screen-event');
    const npcBox = document.getElementById('event-npc-portrait');
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (npcBox) {
      if (se && se.NPCS && se.NPCS.guardian) {
        const npc = se.NPCS.guardian;
        npcBox.classList.remove('hidden');
        npcBox.innerHTML = `
          <div class="event-npc-sprite">${npc.svg}</div>
          <div class="event-npc-meta">
            <strong style="color:${npc.accent};">${npc.icon} ${npc.name}</strong>
            <span>${npc.title}</span>
          </div>
        `;
      } else {
        npcBox.classList.add('hidden');
        npcBox.innerHTML = '';
      }
    }
    document.getElementById('event-title').textContent = '🔮 천칭의 잔영의 축복 — 잿빛 여관 우물 입구';
    document.getElementById('event-desc').textContent =
      '"손등의 인장 파편이 깨어나기 시작했다… 1층 군주에게 맞서기 전, 내가 남길 수 있는 마지막 힘 네 가지 중 하나를 골라라."';

    const choicesBox = document.getElementById('event-choices');
    choicesBox.innerHTML = '';

    GAME_DATA.neowBlessings.forEach((b, idx) => {
      const btn = document.createElement('button');
      btn.className = 'event-choice-btn';
      btn.innerHTML = `<div><span class="kbd-hint">${idx + 1}</span> <strong>${b.label}</strong></div><div style="font-size:0.76rem; color:#95a5a6; margin-top:3px;">${b.desc}</div>`;
      btn.onclick = () => this.resolveNeowBlessing(b.id);
      choicesBox.appendChild(btn);
    });
  },

  resolveNeowBlessing(blessingId) {
    if (!this.run) return;
    if (blessingId === 'neow_maxhp') {
      this.run.maxHp += 10;
      this.run.hp = this.run.maxHp;
    } else if (blessingId === 'neow_first3_1hp') {
      this.run.neowLamentCharges = 3;
    } else if (blessingId === 'neow_upgrade_random') {
      this.run.gold += 50;
      const unupg = this.run.deck.filter(c => !c.upgraded);
      this.shuffleArray(unupg);
      unupg.slice(0, 2).forEach(c => {
        c.upgraded = true;
      });
    } else if (blessingId === 'neow_curse_for_boss_relic') {
      this.run.deck.push(this.createCardInstance('curse_pain'));
      const bossRelics = Object.values(GAME_DATA.relics).filter(r => r.isBossRelic && !this.run.relics.includes(r.id));
      if (bossRelics.length > 0) {
        const picked = bossRelics[Math.floor(Math.random() * bossRelics.length)];
        this.run.relics.push(picked.id);
      }
    }
    this.saveRun();
    this.switchScreen('screen-map');
    this.renderMap();
  },

  // Generates Slay the Spire Branching 15-Stage Act Map (2~3 Lanes per Stage!):
  // - Stage 1 (Start Combat), Stage 8 (Midboss), Stage 9 (Treasure), Stage 14 (Rest), Stage 15 (Boss) are convergence nodes
  // - Stages 2~7 & 10~13 branch into 2~3 connected lanes (Combat / Event / Elite / Shop / Rest)
  generate30StageActMap(actNum) {
    const stages = [];
    const bossId = this.run && this.run.selectedBosses ? this.run.selectedBosses[actNum] : GAME_DATA.acts[actNum - 1].bossPool[0];
    const midBossId =
      this.run && this.run.selectedMidBosses ? this.run.selectedMidBosses[actNum] : GAME_DATA.acts[actNum - 1].midBossPool[0];
    const bossObj = GAME_DATA.enemies[bossId];
    const midObj = GAME_DATA.enemies[midBossId];

    const makeNode = (s, lane, type) => {
      const id = `a${actNum}_s${s}_l${lane}_${type}`;
      if (type === 'boss') return { id, lane, type, label: `👑 [15F 계층 보스] ${bossObj ? bossObj.name : '계층 지배자'}` };
      if (type === 'midboss') return { id, lane, type, label: `🩸 [8F 중간 보스] ${midObj ? midObj.name : '계층 수문장'}` };
      if (type === 'treasure') return { id, lane, type, label: `🎁 [9F 고대 보물상자] 유물 & 금화` };
      if (type === 'rest') return { id, lane, type, label: `🔥 모닥불 휴식` };
      if (type === 'shop') return { id, lane, type, label: `💰 마법 상점` };
      if (type === 'elite') return { id, lane, type, label: `👹 엘리트 강적` };
      if (type === 'event') return { id, lane, type, label: `❓ 미지의 방(D20)` };
      return { id, lane, type: 'combat', label: `⚔️ 몬스터 전투` };
    };

    const pickBranchTypes = s => {
      if (s === 2) return ['combat', 'event', 'combat'];
      if (s === 3) return ['event', 'combat', 'shop'];
      if (s === 4) return ['combat', 'event', 'combat'];
      if (s === 5) return ['shop', 'combat', 'event'];
      if (s === 6) return ['rest', 'elite', 'rest'];
      if (s === 7) return ['combat', 'event', 'combat'];
      if (s === 10) return ['combat', 'event', 'shop'];
      if (s === 11) return ['elite', 'combat', 'elite'];
      if (s === 12) return ['event', 'rest', 'combat'];
      if (s === 13) return ['combat', 'shop', 'event'];
      return ['combat', 'event'];
    };

    for (let s = 1; s <= 15; s++) {
      let nodes = [];
      if (s === 1) nodes = [makeNode(s, 1, 'combat')];
      else if (s === 8) nodes = [makeNode(s, 1, 'midboss')];
      else if (s === 9) nodes = [makeNode(s, 1, 'treasure')];
      else if (s === 14) nodes = [makeNode(s, 1, 'rest')];
      else if (s === 15) nodes = [makeNode(s, 1, 'boss')];
      else {
        const types = pickBranchTypes(s);
        // Randomly permute the 3 lanes for roguelike map variety each run!
        const shuffled = [...types];
        this.shuffleArray(shuffled);
        nodes = shuffled.map((t, idx) => makeNode(s, idx, t));
      }

      stages.push({
        stage: s,
        completed: false,
        chosenNodeId: null,
        nodes
      });
    }
    return stages;
  },

  renderMap() {
    if (!this.run) return;
    const actInfo = GAME_DATA.acts[this.run.act - 1];
    const currentBossId = this.run.selectedBosses[this.run.act];
    const currentBossObj = GAME_DATA.enemies[currentBossId];

    document.getElementById('map-act-title').textContent = `🏰 ${actInfo.name} (Stage ${this.run.stage} / 15)`;
    document.getElementById('map-act-subtitle').innerHTML = `${actInfo.subtitle} — <strong style="color:#ff7675">15F 보스 예고: ${currentBossObj ? currentBossObj.name : ''
      }</strong> | <span style="color:#f6c967">🗺️ 슬더스 분기 지도: 이전 경로와 연결된 갈림길(인접 레인) 중 원하는 루트를 선택하세요!</span>`;

    const spCountEl = document.getElementById('map-sp-count');
    if (spCountEl) spCountEl.textContent = this.run.sp;

    // Render 5-Act Top Progress Bar
    const actBar = document.getElementById('map-act-progress-bar');
    actBar.innerHTML = GAME_DATA.acts
      .map(a => {
        const cls = a.act === this.run.act ? 'active-act' : a.act < this.run.act ? 'cleared-act' : '';
        return `
          <div class="act-pill ${cls}">
            ${a.act < this.run.act ? '✔ ' : a.act === this.run.act ? '📍 ' : ''}제${a.act}계층 (15F)
          </div>
        `;
      })
      .join('');

    const wrap = document.getElementById('map-nodes-wrapper');
    wrap.innerHTML = '';

    const curLane = this.run.currentLane;

    this.run.actMap.forEach(row => {
      const isCurrent = row.stage === this.run.stage;
      const rowEl = document.createElement('div');
      rowEl.className = `map-floor-row ${isCurrent ? 'current-floor' : ''} ${row.nodes.length > 1 ? 'branch-row' : 'converge-row'}`;
      if (isCurrent) rowEl.id = 'current-stage-row';

      let availIdx = 0;
      const nodesHtml = row.nodes
        .map(n => {
          // A node is reachable on the current stage if:
          // - single convergence node, OR curLane is null/1 (from convergence), OR |n.lane - curLane| <= 1
          const isReachable =
            isCurrent &&
            (row.nodes.length === 1 || curLane === null || curLane === undefined || Math.abs(n.lane - curLane) <= 1);
          const isChosenPast = row.completed && row.chosenNodeId === n.id;
          let stateClass = '';
          if (isReachable) {
            stateClass = 'available';
            availIdx += 1;
          } else if (isCurrent) {
            stateClass = 'locked-lane';
          } else if (isChosenPast) {
            stateClass = 'completed';
          } else if (row.completed) {
            stateClass = 'skipped-lane';
          }
          const kbdBadge = isReachable && row.nodes.length > 1 ? `<span class="kbd-hint">${availIdx}</span> ` : '';
          const typeClass = `node-type-${n.type}`;
          return `
            <button class="map-node-btn ${typeClass} ${stateClass}" style="flex:1; justify-content:center;" ${isReachable ? `onclick="Game.enterMapNode('${n.id}', '${n.type}', ${n.lane})"` : 'disabled'
            }>
              ${kbdBadge}${n.label}${isChosenPast ? ' ✔' : ''}
            </button>
          `;
        })
        .join('');

      rowEl.innerHTML = `
        <div class="floor-label">${this.run.act}층 · ${row.stage}F</div>
        <div class="floor-nodes-group">${nodesHtml}</div>
      `;
      wrap.appendChild(rowEl);
    });

    setTimeout(() => {
      const curEl = document.getElementById('current-stage-row');
      if (curEl) curEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);

    this.syncSceneBackground('screen-map');
    this.updateTopHud();
  },

  enterMapNode(nodeId, type, lane = 1) {
    if (this.run) {
      this.run.currentLane = lane;
      const curRow = this.run.actMap && this.run.actMap.find(r => r.stage === this.run.stage);
      if (curRow) curRow.chosenNodeId = nodeId;
      this.saveRun();
    }
    if (type === 'combat' || type === 'elite' || type === 'midboss' || type === 'boss') {
      if (this.run && this.isStoryCutinEnabled() && typeof window !== 'undefined' && window.STORY_ENGINE) {
        if (type === 'midboss') {
          this.showFloorStoryEpisode(this.run.act, 2, () => this.startCombat(type));
          return;
        }
        if (type === 'boss') {
          this.showFloorStoryEpisode(this.run.act, 3, () => this.startCombat(type));
          return;
        }
      }
      this.startCombat(type);
    } else if (type === 'rest') {
      this.switchScreen('screen-rest');
    } else if (type === 'shop') {
      this.openShopScreen();
    } else if (type === 'event') {
      this.openEventScreen();
    } else if (type === 'treasure') {
      this.openTreasureRoom();
    }
  },

  openTreasureRoom() {
    if (!this.run) return;
    const relic = this.grantRandomRelic();
    let goldBonus = 45;
    if (this.run.relics.includes('ectoplasm_slime')) goldBonus = 0;
    this.run.gold += goldBonus;

    let msg = `🎁 고대 보물상자 개방! ${relic ? `[${relic.icon} ${relic.name}] 획득!` : '모든 유물 수집 완료!'}${goldBonus > 0 ? ` (+${goldBonus} GP)` : ''
      }`;
    if (this.run.relics.includes('cursed_key')) {
      this.run.deck.push(this.createCardInstance('curse_pain'));
      msg += ` ⚠️ [저주받은 열쇠] 페널티로 심연의 저주 추가!`;
    }
    this.showToast(msg, 'success');
    this.leaveNodeToMap();
  },

  // Record highest tower floor/stage reached
  recordTowerProgress() {
    if (!this.run) return;
    const curScore = (this.run.act - 1) * 15 + this.run.stage;
    const bestScore = ((this.meta.bestAct || 1) - 1) * 15 + (this.meta.bestStage || 1);
    if (curScore >= bestScore) {
      this.meta.bestAct = this.run.act;
      this.meta.bestStage = this.run.stage;
    }
    if (!this.meta.classBestFloor) this.meta.classBestFloor = {};
    this.meta.classBestFloor[this.run.charId] = `${this.run.act}층 ${this.run.stage}F`;
    // Update Achievement Progression Stats (Act reached & class best stage)
    this.recordAchStat('maxActReached', this.run.act, 'max');
    if (this.meta.achStats && this.meta.achStats.classBestStageNum) {
      const prevStage = this.meta.achStats.classBestStageNum[this.run.charId] || 1;
      if (curScore > prevStage) this.meta.achStats.classBestStageNum[this.run.charId] = curScore;
    }
    this.checkAchievements();
    this.saveMeta();
  },

  leaveNodeToMap() {
    if (!this.run) return;
    const currentRow = this.run.actMap.find(r => r.stage === this.run.stage);
    if (currentRow) currentRow.completed = true;

    if (this.run.stage < this.run.stagesPerAct) {
      this.run.stage += 1;
      // Reset lane to center when arriving at a single-node convergence stage
      const nextRow = this.run.actMap.find(r => r.stage === this.run.stage);
      if (nextRow && nextRow.nodes.length === 1) this.run.currentLane = 1;
      this.recordTowerProgress();
      this.saveRun();
      this.switchScreen('screen-map');
      this.renderMap();
    } else {
      // Completed Stage 15 Boss of current Act! Advance to next Act (1..5)
      if (this.run.act < this.run.maxActs) {
        this.run.act += 1;
        this.run.stage = 1;
        this.run.currentLane = 1;
        this.recordTowerProgress();
        const missingHp = this.run.maxHp - this.run.hp;
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + Math.round(missingHp * 0.5));
        this.run.actMap = this.generate30StageActMap(this.run.act);
        this.saveRun();
        this.showToast(
          `🎉 제${this.run.act - 1}층 보스 토벌! 잃은 체력 50% 회복 후 [${GAME_DATA.acts[this.run.act - 1].name}] 등반 개시!`,
          'success'
        );
        this.switchScreen('screen-map');
        this.renderMap();
        this.showStoryCutin(this.run.act, () => {
          this.switchScreen('screen-map');
          this.renderMap();
        });
      } else {
        this.recordTowerProgress();
        this.showGameOverModal(true);
      }
    }
  },

  // --------------------------------------------------------------------------
  // IN-RUN EXP, LEVEL-UP CARD REWARD & D&D ABILITY SCORE IMPROVEMENT (Lv.1 -> Lv.20)
  // Adjusted for 15-stage Acts so players level up smoothly across 5-6 combats per floor!
  // --------------------------------------------------------------------------
  gainRunExp(rawExp) {
    if (!this.run) return { gained: 0, leveledUp: 0 };
    const mult = 1 + (this.run.permStats.expMultPct || 0) / 100;
    const gained = Math.round(rawExp * 1.45 * mult);
    this.run.runExp += gained;

    let leveledUp = 0;
    while (this.run.runExp >= this.run.runNextExp && this.run.runLv < 20) {
      this.run.runExp -= this.run.runNextExp;
      this.run.runLv += 1;
      this.run.sp += 1; // +1 SP per Level
      this.run.pendingCardDrafts = (this.run.pendingCardDrafts || 0) + 1; // +1 Card Draft per Level-Up!
      this.run.maxHp += 2;
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 2);
      this.run.runNextExp = Math.round(this.run.runNextExp * 1.2 + 25);
      leveledUp += 1;
    }
    this.updateTopHud();
    return { gained, leveledUp };
  },

  // 5-Act Build Progression Rarity Curve:
  // - Act 1 (Foundation): Common 74% / Uncommon 24% / Rare 2% / Legendary 0% (Act 1 Boss gives first Rare!)
  // - Act 2 (Mid-Build I): Common 44% / Uncommon 40% / Rare 14% / Legendary 2%
  // - Act 3 (Mid-Build II): Common 28% / Uncommon 42% / Rare 24% / Legendary 6%
  // - Act 4~5 (Final Capstone Build): Common 14% / Uncommon 34% / Rare 36% / Legendary 16%+
  rollWeightedCardChoices(count = 3, sourceType = 'levelup') {
    const ch = GAME_DATA.characters[this.run.charId];
    const basicIds = new Set([ch.sharedCards[0], ch.sharedCards[1]]);
    const poolByRarity = { common: [], uncommon: [], rare: [], legendary: [] };
    const legUnlocked = this.isLegendaryUnlocked(this.run.charId);
    const eligibleIds = [];

    ch.cardPool.forEach(cid => {
      if (basicIds.has(cid)) return;
      const tpl = GAME_DATA.cards[cid];
      if (!tpl) return;
      // Enforce Subclass & Legendary Achievement Unlock Gates!
      if (!this.isSubclassUnlocked(tpl.subclassId)) return;
      if (tpl.rarity === 'legendary' && !legUnlocked) return;
      const r = poolByRarity[tpl.rarity] ? tpl.rarity : 'common';
      poolByRarity[r].push(cid);
      eligibleIds.push(cid);
    });

    const act = Math.max(1, Math.min(5, this.run.act || 1));
    const rankLv = (this.run.permStats && this.run.permStats.rankLevel) || 0; // C=0, B=1, A=2, S=3

    const actBaseWeights = {
      1: { common: 74, uncommon: 24, rare: 2, legendary: 0 },
      2: { common: 44, uncommon: 40, rare: 14, legendary: 2 },
      3: { common: 28, uncommon: 42, rare: 24, legendary: 6 },
      4: { common: 16, uncommon: 34, rare: 36, legendary: 14 },
      5: { common: 10, uncommon: 28, rare: 40, legendary: 22 }
    };
    const base = actBaseWeights[act] || actBaseWeights[1];
    let weights = { ...base };

    if (sourceType === 'boss') {
      weights = {
        common: 0,
        uncommon: act === 1 ? 55 : act === 2 ? 25 : 10,
        rare: act === 1 ? 45 : act === 2 ? 60 : act === 3 ? 60 : 48,
        legendary: act === 1 ? 0 : act === 2 ? 15 : act === 3 ? 30 : 42
      };
    } else if (sourceType === 'midboss') {
      weights = {
        common: Math.max(5, base.common - 24),
        uncommon: base.uncommon + 10,
        rare: base.rare + 12,
        legendary: act >= 2 ? base.legendary + 4 : 0
      };
    } else if (sourceType === 'shop') {
      weights = {
        common: Math.max(12, base.common - 12),
        uncommon: base.uncommon + 6,
        rare: base.rare + 5,
        legendary: act >= 2 ? base.legendary + 2 : 0
      };
    }

    // Rank Promotion Bonus: boosts Rare/Legendary luck gently without breaking the Act 1 foundation curve!
    if (rankLv > 0) {
      weights.rare += rankLv * 3;
      if (act >= 2) weights.legendary += rankLv * 2;
    }

    // Gate Legendary weight until Legendary Card Achievement is unlocked for this class!
    if (!legUnlocked || poolByRarity.legendary.length === 0) {
      weights.rare += weights.legendary;
      weights.legendary = 0;
    }

    const pickedIds = [];
    const totalWeight = weights.common + weights.uncommon + weights.rare + weights.legendary;

    for (let i = 0; i < count; i++) {
      let roll = Math.random() * totalWeight;
      let chosenRarity = 'common';
      if (roll < weights.legendary) chosenRarity = 'legendary';
      else if ((roll -= weights.legendary) < weights.rare) chosenRarity = 'rare';
      else if ((roll -= weights.rare) < weights.uncommon) chosenRarity = 'uncommon';
      else chosenRarity = 'common';

      let candidates = poolByRarity[chosenRarity].filter(id => !pickedIds.includes(id));
      if (candidates.length === 0) {
        candidates = eligibleIds.filter(id => !pickedIds.includes(id));
      }
      if (candidates.length === 0) {
        candidates = ch.cardPool.filter(id => !basicIds.has(id) && !pickedIds.includes(id));
      }
      if (candidates.length > 0) {
        const cid = candidates[Math.floor(Math.random() * candidates.length)];
        pickedIds.push(cid);
      }
    }

    return pickedIds.map(cid => this.createCardInstance(cid));
  },

  openRunStatModal() {
    if (!this.run) return;
    this.closeAllNavModals();
    document.getElementById('modal-run-stats').classList.remove('hidden');
    this.renderRunStatModal();
  },

  closeRunStatModal() {
    document.getElementById('modal-run-stats').classList.add('hidden');
    if (this.combat) this.renderCombat();
    if (document.getElementById('screen-map').classList.contains('active')) this.renderMap();
    this.updateTopHud();
  },

  renderRunStatModal() {
    if (!this.run) return;
    document.getElementById('modal-sp-val').textContent = this.run.sp;
    const s = this.run.allocatedStats;
    const box = document.getElementById('run-stat-buttons');

    const options = [
      {
        key: 'str',
        name: `⚔️ 근력 / 주문공격력 (STR/CHA) [현재 +${s.str}]`,
        desc: '투자 시 모든 공격 및 주문 카드의 피해량이 +1 영구 증가합니다.'
      },
      {
        key: 'dex',
        name: `🛡️ 민첩 / 방어도 (DEX/AC) [현재 +${s.dex}]`,
        desc: '투자 시 모든 방어 스킬의 방어도가 +1 영구 증가합니다.'
      },
      {
        key: 'vit',
        name: `❤️ 건강 (CON - Hit Dice) [현재 +${s.vit}]`,
        desc: '투자 시 최대 체력이 +12 증가하고 즉시 체력을 12 회복합니다.'
      },
      {
        key: 'mana',
        name: `🔮 지능 / 지혜 (INT/WIS) [현재 +${s.mana}]`,
        desc: '투자 시 매 전투 시작 고유 자원 +2 및 소환수/비전 구체 공격력이 +3 증가합니다.'
      }
    ];

    box.innerHTML = options
      .map(
        o => `
        <div class="gear-card">
          <div>
            <h4 style="color:#ffeaa7; margin-bottom:4px;">${o.name}</h4>
            <p style="font-size:0.78rem; color:#dfe6e9;">${o.desc}</p>
          </div>
          <button class="btn-growth-action reawaken" ${this.run.sp <= 0 ? 'disabled' : ''} onclick="Game.allocateStatPoint('${o.key}')">
            ${this.run.sp > 0 ? '➕ 1 SP 투자하기' : 'SP 부족'}
          </button>
        </div>
      `
      )
      .join('');
  },

  allocateStatPoint(key) {
    if (!this.run || this.run.sp <= 0) return;
    this.run.sp -= 1;
    this.run.allocatedStats[key] += 1;

    if (key === 'str' && this.combat) {
      this.combat.player.strength += 1;
    } else if (key === 'dex' && this.combat) {
      this.combat.player.dexterity += 1;
    } else if (key === 'vit') {
      this.run.maxHp += 12;
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 12);
    } else if (key === 'mana' && this.combat) {
      this.combat.secondaryResource += 2;
      if (this.combat.summon.active) this.combat.summon.atk += 3;
    }

    this.renderRunStatModal();
    this.updateTopHud();
  },

  createCardInstance(cardId, seed = 0) {
    return {
      uid: `card_${cardId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${seed}`,
      id: cardId,
      upgraded: false,
      mutation: null
    };
  },

  updateTopHud() {
    document.getElementById('hud-gems').textContent = this.meta.gems;
    const statusBar = document.getElementById('run-status-bar');
    const deckBtn = document.getElementById('btn-view-deck');

    if (!this.run) {
      statusBar.classList.add('hidden');
      deckBtn.classList.add('hidden');
      return;
    }

    statusBar.classList.remove('hidden');
    deckBtn.classList.remove('hidden');

    document.getElementById('hud-hp').textContent = `${this.run.hp}/${this.run.maxHp}`;
    document.getElementById('hud-run-lv').textContent = this.run.runLv;
    document.getElementById('hud-run-exp').textContent = `${this.run.runExp}/${this.run.runNextExp}`;

    const spBadge = document.getElementById('hud-sp-badge');
    if (this.run.sp > 0) {
      spBadge.classList.remove('hidden');
      document.getElementById('hud-run-sp').textContent = this.run.sp;
    } else {
      spBadge.classList.add('hidden');
    }

    document.getElementById('hud-gold').textContent = this.run.gold;
    document.getElementById('hud-floor').textContent = `${this.run.act}층 - ${this.run.stage}/15`;
    document.getElementById('hud-deck-count').textContent = this.run.deck.length;

    const relicsBox = document.getElementById('hud-relics');
    const relicsSig = this.run.relics.join(',');
    if (this._hudRelicsSig !== relicsSig) {
      this._hudRelicsSig = relicsSig;
      relicsBox.innerHTML = this.run.relics
        .map(rid => {
          const r = GAME_DATA.relics[rid];
          return r ? `<div class="relic-chip" title="${r.name}: ${r.desc}">${r.icon}</div>` : '';
        })
        .join('');
    }

    const potionsBox = document.getElementById('hud-potions');
    const potionsSig = this.run.potions.join(',');
    if (this._hudPotionsSig !== potionsSig) {
      this._hudPotionsSig = potionsSig;
      potionsBox.innerHTML = this.run.potions
        .map((pid, idx) => {
          const p = GAME_DATA.potions[pid];
          return p
            ? `<div class="potion-chip" onclick="Game.usePotion(${idx})" title="[클릭하여 사용] ${p.name}: ${p.desc}">${p.icon}</div>`
            : '';
        })
        .join('');
    }
  },

  usePotion(idx) {
    if (!this.run) return;
    const pid = this.run.potions[idx];
    const p = GAME_DATA.potions[pid];
    if (!p) return;

    const inCombat = document.getElementById('screen-combat').classList.contains('active') && this.combat;

    if (pid === 'rad_heal') {
      if (inCombat) {
        this.healPlayerWithClericMechanics(25);
      } else {
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + 25);
      }
      this.logCombat(`🧪 [${p.name}] 사용! 체력을 25 회복했습니다.`);
    } else if (!inCombat) {
      this.showToast('이 물약은 전투 중에만 사용할 수 있습니다!', 'warn');
      return;
    } else if (pid === 'fury_stim') {
      this.combat.player.strength += 3;
      this.combat.energy += 2;
      this.logCombat(`💪 [${p.name}] 사용! 힘 +3, 행동력 +2 획득!`);
    } else if (pid === 'acid_bomb') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) {
          this.dealDamageToEnemy(en, 20, true);
          this.applyDebuffToEnemy(en, 'poison', 8);
        }
      });
      this.logCombat(`💣 [${p.name}] 투척! 적 전체 피해 20 및 산성 맹독 8 부여!`);
    } else if (pid === 'shield_gel') {
      this.combat.player.block += 18;
      if (this.run.charId === 'cleric') {
        this.triggerClericHolyBrandReflection(18);
      }
      this.drawCards(2);
      this.logCombat(`📜 [${p.name}] 발동! 방어도 +18 및 카드 2장 드로우!`);
    }

    this.run.potions.splice(idx, 1);
    this.updateTopHud();
    if (inCombat) {
      this.checkCombatEnd();
      this.renderCombat();
    }
  },

  // --------------------------------------------------------------------------
  // D&D 5E x STS2 COMBAT ENGINE (With 32 Subclass Mechanics!)
  // --------------------------------------------------------------------------
  startCombat(encounterType) {
    const ch = GAME_DATA.characters[this.run.charId];
    const actInfo = GAME_DATA.acts[this.run.act - 1];
    const pStats = this.run.permStats;
    const rStats = this.run.allocatedStats;
    const bossEnergyRelics = this.run.relics.filter(rid => GAME_DATA.relics[rid] && GAME_DATA.relics[rid].bonusEnergy).length;
    const hasFusionCell = this.run.relics.includes('fusion_cell');
    const maxEnergy = ch.startEnergy + (hasFusionCell ? 1 : 0) + bossEnergyRelics + (pStats.bonusMaxEnergy || 0);

    let enemyTemplates = [];
    if (encounterType === 'boss') {
      const bId = this.run.selectedBosses[this.run.act] || actInfo.bossPool[0];
      enemyTemplates = [GAME_DATA.enemies[bId]];
    } else if (encounterType === 'midboss') {
      const mId = this.run.selectedMidBosses[this.run.act] || actInfo.midBossPool[0];
      enemyTemplates = [GAME_DATA.enemies[mId]];
    } else if (encounterType === 'elite') {
      const eId = actInfo.elitePool[this.run.stage % actInfo.elitePool.length];
      const guardId = actInfo.normalPool[this.run.stage % actInfo.normalPool.length];
      // Act 1 elites fight solo (classic STS Nob/Lagavulin); Act 2+ elites bring a minion guard!
      enemyTemplates = this.run.act >= 2 ? [GAME_DATA.enemies[eId], GAME_DATA.enemies[guardId]] : [GAME_DATA.enemies[eId]];
    } else {
      const pool = actInfo.normalPool;
      const e1 = GAME_DATA.enemies[pool[this.run.stage % pool.length]];
      const e2 = GAME_DATA.enemies[pool[(this.run.stage + 1) % pool.length]];
      const e3 = GAME_DATA.enemies[pool[(this.run.stage + 2) % pool.length]];
      // Slay the Spire "Easy Pool" (First 3 stages of Act 1 are single-monster warm-up encounters)
      if (this.run.stage <= 3 && this.run.act === 1) {
        enemyTemplates = [e1];
      } else if (this.run.act >= 2 && this.run.stage >= 10 && this.run.stage % 3 === 1) {
        enemyTemplates = [e1, e2, e3];
      } else {
        enemyTemplates = [e1, e2];
      }
    }

    // Slay the Spire 2 5-Act Difficulty Scaling:
    // - Act 1: ~10% Synergy Build / <1% Random (Early Group A ~12-15% vs Late Group B ~5-8%)
    // - Act 2~5: Mid-Build & Endgame Capstone scaling where Late-Scaling Group B surges to 35~50%!
    const hpScale = 1.05 + (this.run.act - 1) * 0.16 + (this.run.stage - 1) * 0.028;
    const dmgScale = 0.94 + (this.run.act - 1) * 0.14 + (this.run.stage - 1) * 0.023;
    const enragePerTurn =
      encounterType === 'boss'
        ? Math.max(1, Math.floor(this.run.act * 0.9 + 0.5))
        : encounterType === 'elite' || encounterType === 'midboss'
          ? (this.run.act >= 2 || this.run.stage >= 8 ? 1 : 0)
          : 0;

    const enemies = enemyTemplates.map((t, i) => {
      const scaledMoves = t.moves.map(m => {
        const sm = { ...m };
        if (sm.dmg) sm.dmg = Math.round(sm.dmg * dmgScale);
        if (sm.block) sm.block = Math.round(sm.block * dmgScale);
        if (sm.str) sm.str = Math.max(1, Math.round(sm.str * (1.0 + (this.run.act - 1) * 0.2)));
        return sm;
      });

      const hasPhiloStone = this.run.relics.includes('philosophers_stone');
      const useNeowLament = (this.run.neowLamentCharges || 0) > 0;
      const calcMaxHp = Math.round(t.maxHp * hpScale);

      return {
        uid: `en_${i}`,
        id: t.id,
        name: t.name,
        isBoss: encounterType === 'boss',
        isElite: encounterType === 'elite' || encounterType === 'midboss',
        enragePerTurn,
        skillEnrage: t.skillEnrage || 0,
        maxHp: calcMaxHp,
        hp: useNeowLament ? 1 : calcMaxHp,
        expReward: t.expReward || 50,
        block: useNeowLament ? 0 : encounterType === 'boss' ? this.run.act * 12 : encounterType === 'elite' || encounterType === 'midboss' ? this.run.act * 5 : 0,
        strength: (encounterType === 'boss' ? this.run.act : 0) + (hasPhiloStone ? 1 : 0),
        thorns: t.thorns ? t.thorns + Math.floor((this.run.act - 1) * 0.8) : 0,
        regen: t.regen ? Math.round(t.regen * (1 + (this.run.act - 1) * 0.35)) : 0,
        artifact: t.artifact || (encounterType === 'boss' ? Math.min(3, Math.ceil(this.run.act * 0.6)) : 0),
        metallicize: t.metallicize ? Math.round(t.metallicize * dmgScale) : 0,
        curlUp: t.curlUp ? Math.round(t.curlUp * dmgScale) : 0,
        weak: 0,
        vuln: 0,
        poison: 0,
        // 8 Class-Unique Status Effects on Enemies!
        sunder: 0,      // Fighter: +1 physical damage taken per stack & shatters armor
        bleed: 0,       // Barbarian: DoT + bursts for 50% of bleed on every hit
        comboPoints: 0, // Rogue: 1~5 Combo Points -> at 5, auto-triggers Eviscerate Execution!
        quarry: 0,      // Ranger: Hunter's Quarry mark -> bursts on hit for bonus crit damage
        frostbite: 0,   // Wizard: Reduces enemy attack damage; at 8+ stacks, Freezes (-50% dmg)!
        holyBrand: 0,   // Cleric: Takes radiant damage whenever Cleric heals or gains block!
        seal: 0,        // Paladin: Judgement Seals -> detonated by attacks for radiant dmg + player block!
        doom: 0,        // Warlock (STS2 Necrobinder): Instant Execution when Enemy HP <= Doom!
        svg: t.svg,
        moves: scaledMoves,
        moveIndex: i % scaledMoves.length
      };
    });

    if ((this.run.neowLamentCharges || 0) > 0) {
      this.run.neowLamentCharges -= 1;
    }

    const drawPile = this.run.deck.map(c => ({ ...c }));
    this.shuffleArray(drawPile);

    // Custom Companion Name based on Class
    let summonName = '소환수 동료';
    if (this.run.charId === 'fighter') summonName = '👤 그림자 잔상 (Echo)';
    else if (this.run.charId === 'barbarian') summonName = '👻 선조의 수호령';
    else if (this.run.charId === 'rogue') summonName = '🕯️ 원한의 망령';
    else if (this.run.charId === 'ranger') summonName = '🐆 흑표범 구엔위바';
    else if (this.run.charId === 'wizard') summonName = '💀 언데드 해골 기사';
    else if (this.run.charId === 'cleric') summonName = '🔨 전쟁신의 영체 수호자';
    else if (this.run.charId === 'paladin') summonName = '🦅 성기사의 군마/데스나이트';
    else if (this.run.charId === 'warlock') summonName = '😈 계약 악마 핀드';

    this.combat = {
      encounterType,
      turn: 1,
      maxEnergy,
      energy: maxEnergy,
      secondaryResource: pStats.bonusResourceStart + rStats.mana,
      burstUsedThisTurn: false,
      burstCost: 5,
      stance: 'neutral',
      targetIndex: 0,
      firstAttackUsedThisTurn: false,
      // Class-Unique Combat State Systems!
      comboCount: 0,               // Fighter: Turn Combo Chain (+8% dmg per combo max 5, 4-combo grants +1 AP once/turn)
      comboApGrantedThisTurn: false,
      rogueFinisherApUsed: false,  // Rogue: Eviscerate +1 AP refund capped at once per turn
      clericBrandTriggersThisTurn: 0, // Cleric: Holy Brand reflection capped at 3 triggers/turn
      traps: 0,                    // Ranger: Tactical Traps (triggers when enemy attacks: 6 dmg & -20% enemy attack)
      beastMode: 'assault',        // Ranger: Beast Stance ('assault' = 1.35x attack, 'guard' = tanks + generates block)
      orbList: [],                 // Wizard: Elemental Orbs Queue ('fire', 'frost', 'lightning')
      devotion: 0,                 // Cleric: Devotion Mantra (at 10 -> auto Miracle Wrath +1 AP & +6 AoE Radiant)
      paladinAura: 'retribution',  // Paladin: 'retribution' (Thorns reflect), 'devotion' (-15% dmg & +3 block), 'crusader' (+15% atk)
      auraPower: 3,
      player: {
        block: pStats.firstTurnBlock || 0,
        strength: pStats.bonusStr + rStats.str,
        dexterity: pStats.bonusDex + rStats.dex,
        metallicize: 0,
        parry: 0,                  // Fighter: Counter-attack damage when hit while blocking
        weak: 0,
        vuln: 0,
        frail: 0
      },
      summon: {
        active: false,
        name: summonName,
        hp: 0,
        maxHp: 16 + pStats.summonBoost,
        maxHpCap: 35 + this.run.act * 8 + pStats.summonBoost,
        atk: 6 + pStats.summonBoost + rStats.mana * 2
      },
      drones: 0,
      maxDrones: this.run.charId === 'wizard' || this.run.charId === 'cleric' ? 4 : 3,
      drawPile,
      hand: [],
      discardPile: [],
      exhaustPile: [],
      enemies,
      log: `[${ch.name}] 고유 전투 시스템 개시!`
    };

    this.applyStartOfCombatEffects();
    this.switchScreen('screen-combat');
    this.startPlayerTurn(true);
    if (
      encounterType === 'boss' &&
      typeof window !== 'undefined' &&
      window.STORY_ENGINE &&
      enemies[0] &&
      window.STORY_ENGINE.BOSS_INTROS[enemies[0].id]
    ) {
      const intro = window.STORY_ENGINE.BOSS_INTROS[enemies[0].id];
      this.combat.log = `👑 ${enemies[0].name}: ${intro}`;
      VfxEngine.banner(`👑 ${enemies[0].name}`, 'gold');
      this.showToast(`👑 ${enemies[0].name}: ${intro}`, 'warn');
      this.renderCombat();
    }
  },

  applyStartOfCombatEffects() {
    const cid = this.run.charId;
    const relics = this.run.relics;
    const pStats = this.run.permStats;
    const rStats = this.run.allocatedStats;

    // 1. FIRST identify dominant subclass archetype (3+ cards from that subclass route) BEFORE applying start bonuses!
    const deckSubCounts = {};
    this.run.deck.forEach(c => {
      const tpl = GAME_DATA.cards[c.id];
      if (tpl && tpl.subclassId && tpl.subclassId !== 'shared') {
        deckSubCounts[tpl.subclassId] = (deckSubCounts[tpl.subclassId] || 0) + 1;
      }
    });
    let dominantSub = null;
    let maxCnt = 2;
    Object.keys(deckSubCounts).forEach(sid => {
      if (deckSubCounts[sid] > maxCnt) {
        maxCnt = deckSubCounts[sid];
        dominantSub = sid;
      }
    });
    this.run.subclassId = dominantSub;
    const ch = GAME_DATA.characters[cid];
    this.run.subclassObj = (dominantSub && ch.subclasses.find(s => s.id === dominantSub)) || {
      icon: ch.secondaryResourceIcon,
      name: ch.name
    };
    const subId = this.run.subclassId;

    // 2. 8 Distinct Class Start-of-Combat Systems (Balanced to Slay the Spire 2 starter relic power!)
    if (cid === 'fighter') {
      this.combat.secondaryResource += 1;
      this.combat.player.parry += 2;
    }
    if (cid === 'barbarian') {
      this.combat.secondaryResource += 1;
      this.combat.enemies.forEach(en => (en.bleed += 1));
    }
    if (cid === 'rogue') {
      this.combat.enemies.forEach(en => {
        this.applyDebuffToEnemy(en, 'poison', 2);
      });
      // Generate 1 free 0-cost Shiv in opening hand!
      this.combat.hand.push(this.createCardInstance('token_shiv', 777));
    }
    if (cid === 'ranger') {
      this.combat.secondaryResource += 1;
      this.combat.traps += 1;
      this.summonOrBuffCompanion(5 + pStats.summonBoost, 2 + pStats.summonBoost);
      this.combat.enemies.forEach(en => (en.quarry += 2));
    }
    if (cid === 'wizard') {
      // Act 1 fragile apprentice (1 Frost Orb) -> Act 2+ Archmage Awakening (Frost + Lightning Orbs!)
      this.channelElementalOrb('frost');
      if ((this.run.act || 1) >= 2) this.channelElementalOrb('lightning');
    }
    if (cid === 'cleric') {
      this.combat.devotion += 1;
      this.combat.enemies.forEach(en => (en.holyBrand += 1));
    }
    if (cid === 'paladin') {
      this.combat.player.block += 4;
      this.combat.secondaryResource += 1;
      this.combat.paladinAura = 'retribution';
      this.combat.auraPower = 4;
      this.combat.enemies.forEach(en => (en.seal += 2));
    }
    if (cid === 'warlock') {
      // Act 1 Pact Imp starts frail (5/3, Doom +2) -> scales steeply in Act 2~5 as Demon Engine awakens!
      const actBonus = Math.max(0, (this.run.act || 1) - 1);
      this.summonOrBuffCompanion(5 + actBonus * 5 + pStats.summonBoost, 3 + actBonus * 2 + pStats.summonBoost + rStats.mana);
      this.combat.enemies.forEach(en => (en.doom += 2 + actBonus * 3));
    }

    // 3. Dynamic Subclass Archetype Bonuses (ALL 32 Subclasses Supported when 3+ cards drafted!)
    if (subId === 'champion') {
      this.combat.player.strength += 2;
    } else if (subId === 'battlemaster') {
      this.combat.secondaryResource += 2;
    } else if (subId === 'eldritch_knight') {
      this.combat.drones = Math.min(this.combat.maxDrones || 3, this.combat.drones + 1);
    } else if (subId === 'echo_knight') {
      this.summonOrBuffCompanion(12, 4);
    } else if (subId === 'berserker') {
      this.combat.player.strength += 2;
    } else if (subId === 'ancestral_guardian') {
      this.summonOrBuffCompanion(12, 4);
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'weak', 1));
    } else if (subId === 'wild_magic') {
      this.combat.drones = Math.min(this.combat.maxDrones || 3, this.combat.drones + 1);
    } else if (subId === 'assassin') {
      this.combat.secondaryResource += 2;
      this.combat.enemies.forEach(en => {
        this.applyDebuffToEnemy(en, 'poison', 3);
        this.applyDebuffToEnemy(en, 'vuln', 1);
      });
    } else if (subId === 'arcane_trickster') {
      this.combat.drones = Math.min(this.combat.maxDrones || 3, this.combat.drones + 1);
    } else if (subId === 'phantom') {
      this.summonOrBuffCompanion(10, 4);
    } else if (subId === 'hunter_conclave') {
      this.combat.player.strength += 2;
    } else if (subId === 'beast_master') {
      this.summonOrBuffCompanion(14, 5);
    } else if (subId === 'fey_wanderer') {
      this.combat.drones = Math.min(this.combat.maxDrones || 3, this.combat.drones + 1);
    } else if (subId === 'evocation') {
      this.combat.player.strength += 2;
      this.channelElementalOrb('fire');
    } else if (subId === 'abjuration') {
      this.combat.player.block += 8;
      this.combat.player.metallicize += 3;
    } else if (subId === 'necromancy') {
      this.summonOrBuffCompanion(12, 5);
    } else if (subId === 'divination') {
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'vuln', 1));
    } else if (subId === 'light_domain') {
      this.combat.drones = Math.min(this.combat.maxDrones || 4, this.combat.drones + 1);
      this.combat.enemies.forEach(en => {
        this.applyDebuffToEnemy(en, 'poison', 2);
        this.applyDebuffToEnemy(en, 'weak', 1);
      });
    } else if (subId === 'war_domain') {
      this.combat.player.strength += 2;
      this.summonOrBuffCompanion(12, 4);
    } else if (subId === 'grave_domain') {
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'vuln', 2));
    } else if (subId === 'devotion') {
      this.combat.player.strength += 1;
      this.combat.player.dexterity += 1;
      this.combat.player.metallicize += 3;
    } else if (subId === 'vengeance') {
      this.combat.player.strength += 1;
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'vuln', 2));
    } else if (subId === 'conquest') {
      this.summonOrBuffCompanion(12, 4);
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'weak', 1));
    } else if (subId === 'oathbreaker') {
      this.combat.player.strength += 2;
      this.summonOrBuffCompanion(12, 4);
    } else if (subId === 'fiend_patron') {
      this.summonOrBuffCompanion(10, 4);
    } else if (subId === 'hexblade') {
      this.combat.player.strength += 2;
      this.combat.player.dexterity += 1;
    } else if (subId === 'great_old_one') {
      this.combat.drones = Math.min(this.combat.maxDrones || 3, this.combat.drones + 1);
      this.combat.enemies.forEach(en => {
        this.applyDebuffToEnemy(en, 'weak', 1);
        this.applyDebuffToEnemy(en, 'vuln', 1);
      });
    } else if (subId === 'archfey_chain') {
      this.summonOrBuffCompanion(12, 3);
      this.combat.secondaryResource += 2;
    }

    // 5 Previously Unimplemented Class Starter Relics (Now Active & STS2 Balanced!)
    if (relics.includes('totem_necklace')) {
      this.combat.player.block += 3;
      this.combat.secondaryResource += 1;
    }
    if (relics.includes('thieves_tools')) {
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'poison', 1));
    }
    if (relics.includes('hunters_quiver')) {
      this.combat.secondaryResource += 1;
      this.combat.enemies.forEach(en => (en.quarry = (en.quarry || 0) + 1));
    }
    if (relics.includes('spellbook_of_mystra')) {
      this.combat.secondaryResource += 1;
    }
    if (relics.includes('holy_avenger_hilt')) {
      this.combat.secondaryResource += 1;
      this.combat.player.metallicize += 2;
    }

    // Relics (Slay the Spire 1 Classic Relics)
    if (relics.includes('Geiger_counter')) this.combat.player.strength += 2;
    if (relics.includes('vajra_relic')) this.combat.player.strength += 1;
    if (relics.includes('oddly_smooth_stone')) this.combat.player.dexterity += 1;
    if (relics.includes('mutant_adrenal')) this.combat.player.block += 8;
    if (relics.includes('anchor_relic')) this.combat.player.block += 10;
    if (relics.includes('lantern_relic')) this.combat.energy += 1;
    if (relics.includes('titanium_ribs')) {
      this.combat.player.dexterity += 2;
      this.combat.player.metallicize += 4;
    }

    // Class-Unique B-Rank & S-Rank Relics (Start-of-Combat Triggers!)
    if (relics.includes('ftr_rank_b')) {
      this.combat.player.block += 6;
      this.combat.secondaryResource += 1;
    }
    if (relics.includes('bar_rank_s')) {
      this.combat.player.strength += 2;
    }
    if (relics.includes('rog_rank_b')) {
      this.combat.enemies.forEach(en => this.applyDebuffToEnemy(en, 'poison', 3));
    }
    if (relics.includes('rng_rank_b')) {
      this.combat.player.dexterity += 1;
      this.combat.energy += 1;
    }
    if (relics.includes('rng_rank_s')) {
      this.summonOrBuffCompanion(16, 7);
    }
    if (relics.includes('wiz_rank_b')) {
      if (cid === 'wizard') {
        this.channelElementalOrb('fire');
      } else {
        this.combat.drones = Math.min(this.combat.maxDrones || 4, this.combat.drones + 1);
      }
      this.combat.secondaryResource += 1;
    }
    if (relics.includes('wiz_rank_s')) {
      this.combat.energy += 1;
    }
    if (relics.includes('clr_rank_b')) {
      this.combat.drones = Math.min(this.combat.maxDrones || 4, this.combat.drones + 1);
    }
    if (relics.includes('clr_rank_s')) {
      this.combat.player.block += 10;
    }
    if (relics.includes('pal_rank_b')) {
      this.combat.player.metallicize += 3;
    }
    if (relics.includes('pal_rank_s')) {
      this.combat.player.strength += 2;
      this.combat.player.block += 8;
      this.combat.secondaryResource += 2;
    }
    if (relics.includes('wlk_rank_b') && this.combat.summon.active) {
      this.combat.summon.maxHp += 10;
      this.combat.summon.hp += 10;
      this.combat.summon.atk += 3;
    }
  },

  summonOrBuffCompanion(healAmt, atkBoost = 0) {
    const s = this.combat.summon;
    const cap = s.maxHpCap || 45;
    const atkCap = 22 + (this.run ? this.run.act * 5 : 5);
    if (!s.active) {
      s.active = true;
      s.maxHp = Math.min(cap, Math.max(5, healAmt));
      s.hp = Math.min(s.maxHp, healAmt);
      s.atk = Math.min(atkCap, Math.max(2, atkBoost));
    } else {
      s.maxHp = Math.min(cap, s.maxHp + Math.round(healAmt * 0.25));
      s.hp = Math.min(s.maxHp, s.hp + Math.round(healAmt * 0.75));
      s.atk = Math.min(atkCap, s.atk + Math.ceil(atkBoost * 0.6));
    }
  },

  // Helper: Barbarian Missing HP Bloodlust Multiplier (Balanced: +4% per 10% missing HP, max +36%)
  getBarbarianBloodlustMult() {
    if (!this.run || this.run.charId !== 'barbarian') return 1;
    const missingPct = Math.max(0, (this.run.maxHp - this.run.hp) / this.run.maxHp);
    return 1 + Math.floor(missingPct * 10) * 0.04;
  },

  // Helper: Wizard 3-Elemental Orb Channel & Evoke System (Fire / Frost / Lightning)
  channelElementalOrb(orbType = 'fire') {
    if (!this.combat) return;
    const cap = this.combat.maxDrones || 4;
    if (!this.combat.orbList) this.combat.orbList = [];
    if (this.combat.orbList.length >= cap) {
      // Evoke oldest orb for 2x effect!
      const oldest = this.combat.orbList.shift();
      this.evokeElementalOrb(oldest);
    }
    this.combat.orbList.push(orbType);
    this.combat.drones = this.combat.orbList.length;
  },

  evokeElementalOrb(orbType) {
    if (!this.combat) return;
    const alive = this.combat.enemies.filter(e => e.hp > 0);
    if (alive.length === 0) return;
    const actBonus = Math.max(0, (this.run.act || 1) - 1);
    const pwr = 6 + actBonus * 3 + Math.floor(Math.max(0, this.combat.player.strength) * 0.5);
    if (orbType === 'fire') {
      SfxEngine.play('fire');
      alive.forEach(en => {
        VfxEngine.effectOnTarget('enemy', this.combat.enemies.indexOf(en), 'fire');
        this.dealDamageToEnemy(en, pwr, true);
      });
      this.logCombat(`🔥 [화염 구체 발현(Evoke)!] 적 전체에게 화염 폭발 ${pwr} 피해!`);
    } else if (orbType === 'frost') {
      SfxEngine.play('frost');
      VfxEngine.effectOnTarget('player', 0, 'block');
      this.combat.player.block += 6 + actBonus * 2 + Math.floor(Math.max(0, this.combat.player.dexterity) * 0.5);
      alive.forEach(en => {
        en.frostbite = (en.frostbite || 0) + 2 + Math.floor(actBonus * 0.5);
        VfxEngine.effectOnTarget('enemy', this.combat.enemies.indexOf(en), 'frost');
      });
      this.logCombat(`❄️ [냉기 구체 발현(Evoke)!] 방어도 획득 및 적 전체에 동상 부여!`);
    } else {
      SfxEngine.play('lightning');
      const t = alive[Math.floor(Math.random() * alive.length)];
      VfxEngine.effectOnTarget('enemy', this.combat.enemies.indexOf(t), 'lightning');
      this.dealDamageToEnemy(t, pwr + 3, true);
      this.logCombat(`⚡ [번개 구체 발현(Evoke)!] ${t.name}에게 낙뢰 ${pwr + 3} 피해!`);
    }
  },

  // Helper: Cleric Overheal Barrier & Holy Brand Radiant Reflection (Capped at 3 triggers/turn)
  healPlayerWithClericMechanics(amount) {
    if (!this.run || amount <= 0) return;
    const missing = this.run.maxHp - this.run.hp;
    const actualHeal = Math.min(missing, amount);
    const overheal = Math.max(0, amount - missing);
    this.run.hp += actualHeal;
    if (actualHeal > 0) this.recordAchStat('totalHealed', actualHeal, 'add');

    if (actualHeal > 0 || overheal > 0) {
      SfxEngine.play('heal');
      VfxEngine.effectOnTarget('player', 0, 'heal');
      this.spawnFloatingVfx('player', overheal > 0 ? `+${actualHeal} / 🛡️+${overheal}` : `+${actualHeal}`, 'vfx-heal');
    }

    if (this.run.charId === 'cleric' && this.combat) {
      if (overheal > 0) {
        this.combat.player.block += overheal;
      }
      this.triggerClericHolyBrandReflection(amount);
    }
  },

  triggerClericHolyBrandReflection(healOrBlockAmt) {
    if (!this.combat || this.run.charId !== 'cleric') return;
    if ((this.combat.clericBrandTriggersThisTurn || 0) >= 2) return;
    let triggered = false;
    this.combat.enemies.forEach(en => {
      if (en.hp > 0 && (en.holyBrand || 0) > 0) {
        const radDmg = Math.min(en.holyBrand + Math.floor(healOrBlockAmt * 0.25), 12);
        VfxEngine.effectOnTarget('enemy', this.combat.enemies.indexOf(en), 'holy');
        this.dealDamageToEnemy(en, radDmg, true);
        triggered = true;
      }
    });
    if (triggered) {
      SfxEngine.play('holy');
      this.combat.clericBrandTriggersThisTurn = (this.combat.clericBrandTriggersThisTurn || 0) + 1;
    }
  },

  // Helper: Paladin Aura Cycling & Ranger Beast Mode Toggle
  cyclePaladinAura() {
    if (!this.combat || this.run.charId !== 'paladin') return;
    const order = ['retribution', 'devotion', 'crusader'];
    const idx = order.indexOf(this.combat.paladinAura || 'retribution');
    this.combat.paladinAura = order[(idx + 1) % order.length];
    const names = {
      retribution: '🔥 응보의 오라 (피격 시 적에게 광휘 반사)',
      devotion: '🛡️ 헌신의 오라 (받는 피해 15% 감소 & 매 턴 방어도 +3)',
      crusader: '⚔️ 성전의 오라 (모든 공격 피해량 +15% & 문장 추가)'
    };
    this.logCombat(`⚜️ 성기사 오라 전환: [${names[this.combat.paladinAura]}]`);
    this.renderCombat();
  },

  toggleRangerBeastMode() {
    if (!this.combat || this.run.charId !== 'ranger') return;
    this.combat.beastMode = this.combat.beastMode === 'assault' ? 'guard' : 'assault';
    this.logCombat(
      this.combat.beastMode === 'assault'
        ? '🐾 야수 동료 태세: [포식 태세 (협공 피해량 1.35배)]'
        : '🛡️ 야수 동료 태세: [호위 태세 (피해 대신 흡수 & 매 턴 방어도 +4)]'
    );
    this.renderCombat();
  },

  // Helper: Warlock STS2 Doom Instant Execution Check
  // Bosses & Elites have Doom Resistance: instant execution only triggers when HP <= Doom AND HP <= 25% of MaxHP!
  checkWarlockDoomExecutions() {
    if (!this.combat) return;
    this.combat.enemies.forEach(en => {
      if (en.hp > 0 && (en.doom || 0) > 0) {
        const canExecute = en.isBoss
          ? en.hp <= en.doom && en.hp <= Math.ceil(en.maxHp * 0.25)
          : en.isElite
            ? en.hp <= en.doom && en.hp <= Math.ceil(en.maxHp * 0.4)
            : en.hp <= en.doom;
        if (canExecute) {
          en.hp = 0;
          const eIdx = this.combat.enemies.indexOf(en);
          SfxEngine.play('doom');
          VfxEngine.effectOnTarget('enemy', eIdx, 'doom');
          VfxEngine.banner(`💀 파멸(Doom) 즉시 처형!`, 'doom');
          this.spawnFloatingVfx('enemy', `💀 파멸 처형!`, 'vfx-doom', eIdx);
          this.logCombat(`💀 [파멸(Doom) 처형 발동!] ${en.name}이(가) 파멸(${en.doom})에 삼켜져 즉시 처형되었습니다!`);
          if (this.run.charId === 'warlock') {
            this.combat.energy += 1;
            if (this.combat.summon.active) this.summonOrBuffCompanion(4, 1);
          }
        }
      }
    });
  },

  startPlayerTurn(isFirstTurn = false) {
    if (!this.combat) return;
    const subId = this.run.subclassId;
    this.combat.firstAttackUsedThisTurn = false;
    this.combat.burstUsedThisTurn = false;
    this.combat.cardsPlayedThisTurn = 0;
    this.combat.turnDamageDealt = 0;
    this.combat.comboCount = 0;
    this.combat.comboApGrantedThisTurn = false;
    this.combat.rogueFinisherApUsed = false;
    this.combat.clericBrandTriggersThisTurn = 0;
    this.combat.player.parry = this.run.charId === 'fighter' ? 2 : 0;

    if (!isFirstTurn) {
      this.combat.turn += 1;
      this.combat.player.block = subId === 'totem_warrior' ? 4 : subId === 'life_domain' ? 3 : 0;
      this.combat.energy = this.combat.maxEnergy;
      if (this.combat.stance === 'divinity') this.combat.stance = 'neutral';
      if (subId === 'life_domain') {
        this.healPlayerWithClericMechanics(2);
      }
      if (subId === 'berserker') {
        this.combat.secondaryResource += 1;
      }
      if (this.run.relics.includes('rod_of_pact_keeper') && this.combat.summon.active) {
        this.combat.summon.hp = Math.min(this.combat.summon.maxHp, this.combat.summon.hp + 3);
      }
      // Class Rank Relic Per-Turn Triggers
      if (this.run.relics.includes('bar_rank_b') && this.run.hp <= this.run.maxHp * 0.6) {
        this.combat.player.strength += 1;
      }
      if (this.run.relics.includes('wlk_rank_s') && this.combat.summon.active) {
        this.combat.summon.hp = Math.min(this.combat.summon.maxHp, this.combat.summon.hp + 5);
        this.combat.summon.atk += 1;
      }
    } else {
      if (subId === 'totem_warrior') this.combat.player.block += 4;
      if (subId === 'thief' || subId === 'gloom_stalker' || subId === 'wild_magic' || subId === 'divination') {
        this.combat.energy += 1;
      }
    }

    let drawCount = 5;
    if (isFirstTurn) {
      if (this.run.charId === 'rogue') drawCount += 1;
      if (this.run.relics.includes('thieves_tools')) drawCount += 1;
      if (this.run.relics.includes('rog_rank_b')) drawCount += 1;
      if (subId === 'thief' || subId === 'gloom_stalker' || subId === 'wild_magic') drawCount += 1;
      if (this.run.relics.includes('bag_of_prep')) drawCount += 2;
      drawCount += this.run.permStats.bonusDrawFirstTurn || 0;
    }
    if (subId === 'divination' || subId === 'archfey_chain') drawCount += 1;
    if (this.run.relics.includes('mutant_adrenal')) drawCount += 1;
    if (this.run.relics.includes('snecko_eye')) drawCount += 2;

    this.drawCards(drawCount);
    this.renderCombat();
  },

  drawCards(count) {
    const hasSnecko = this.run && this.run.relics.includes('snecko_eye');
    for (let i = 0; i < count; i++) {
      if (this.combat.hand.length >= 10) break;
      if (this.combat.drawPile.length === 0) {
        if (this.combat.discardPile.length === 0) break;
        this.combat.drawPile = this.combat.discardPile.splice(0);
        this.shuffleArray(this.combat.drawPile);
      }
      const card = this.combat.drawPile.pop();
      if (card) {
        if (hasSnecko) {
          card.tempCost = Math.floor(Math.random() * 4); // Snecko Eye Confusion: randomizes card cost between 0 and 3!
        }
        this.combat.hand.push(card);
      }
    }
  },

  computeCardStats(cardInst) {
    const tpl = GAME_DATA.cards[cardInst.id];
    const upg = cardInst.upgraded;

    let baseDamage = upg && tpl.upgradeDamage !== undefined ? tpl.upgradeDamage : tpl.damage || 0;
    let baseBlock = upg && tpl.upgradeBlock !== undefined ? tpl.upgradeBlock : tpl.block || 0;
    const poison = upg && tpl.upgradePoison !== undefined ? tpl.upgradePoison : tpl.poison || 0;
    const vuln = upg && tpl.upgradeVuln !== undefined ? tpl.upgradeVuln : tpl.vuln || 0;
    const weak = upg && tpl.upgradeWeak !== undefined ? tpl.upgradeWeak : tpl.weak || 0;
    const strength = upg && tpl.upgradeStrength !== undefined ? tpl.upgradeStrength : tpl.strength || 0;
    const dexterity = upg && tpl.upgradeDexterity !== undefined ? tpl.upgradeDexterity : tpl.dexterity || 0;
    const draw = upg && tpl.upgradeDraw !== undefined ? tpl.upgradeDraw : tpl.draw || 0;
    const summonHeal = upg && tpl.upgradeSummonHeal !== undefined ? tpl.upgradeSummonHeal : tpl.summonHeal || 0;
    const summonAtkBoost =
      upg && tpl.upgradeSummonAtkBoost !== undefined ? tpl.upgradeSummonAtkBoost : tpl.summonAtkBoost || 0;

    if (this.combat) {
      if (baseDamage > 0) {
        baseDamage += this.combat.player.strength;
        if (tpl.damagePerBlock) baseDamage += this.combat.player.block;
        if (tpl.damagePlusSummonHp && this.combat.summon.active) baseDamage += this.combat.summon.hp;
        if (tpl.bonusPerResource) baseDamage += this.combat.secondaryResource * tpl.bonusPerResource;
        if (cardInst.mutation === 'vampiric_cell') baseDamage += 4;

        // 1) Fighter Turn Combo Chain Bonus (Act-scaling late engine: +8% in Act 1 -> +10/12/14/16% in Acts 2~5!)
        if (this.run && this.run.charId === 'fighter' && (this.combat.comboCount || 0) > 0) {
          const cappedCombo = Math.min(5, this.combat.comboCount);
          const actBonusPct = 0.06 + (this.run.act || 1) * 0.02;
          if (tpl.comboScaling) baseDamage += cappedCombo * (1 + (this.run.act || 1));
          baseDamage = Math.round(baseDamage * (1 + cappedCombo * actBonusPct));
        }

        // 2) Barbarian Missing HP Bloodlust Multiplier (+6% per 10% missing HP!)
        if (this.run && this.run.charId === 'barbarian') {
          baseDamage = Math.round(baseDamage * this.getBarbarianBloodlustMult());
        }

        // 3) Paladin Crusader Aura (+15% attack damage!)
        if (this.run && this.run.charId === 'paladin' && this.combat.paladinAura === 'crusader') {
          baseDamage = Math.round(baseDamage * 1.15);
        }

        if (this.combat.stance === 'wrath') baseDamage = Math.round(baseDamage * 1.75);
        if (this.combat.stance === 'divinity') baseDamage = Math.round(baseDamage * 2.25);
      }
      if (baseBlock > 0) {
        baseBlock += this.combat.player.dexterity;
        if (tpl.blockPerDrone) baseBlock += this.combat.drones * tpl.blockPerDrone;
        // Barbarian Bloodied Bonus Block (<50% HP)
        if (this.run && this.run.charId === 'barbarian' && this.run.hp <= this.run.maxHp * 0.5) {
          baseBlock += 2;
        }
        // Slay the Spire Frail (손상) Debuff: 25% less block gained from cards!
        if (this.combat.player.frail > 0) baseBlock = Math.floor(baseBlock * 0.75);
      }
    }

    return {
      damage: Math.max(0, baseDamage),
      block: Math.max(0, baseBlock),
      poison,
      vuln,
      weak,
      strength,
      dexterity,
      draw,
      summonHeal,
      summonAtkBoost
    };
  },

  formatCardDesc(cardInst) {
    const tpl = GAME_DATA.cards[cardInst.id];
    const stats = this.computeCardStats(cardInst);
    return tpl.desc
      .replace('{damage}', `<strong style="color:#ff7675">${stats.damage}</strong>`)
      .replace('{block}', `<strong style="color:#74b9ff">${stats.block}</strong>`)
      .replace('{poison}', `<strong style="color:#55efc4">${stats.poison}</strong>`)
      .replace('{vuln}', stats.vuln)
      .replace('{weak}', stats.weak)
      .replace('{strength}', stats.strength)
      .replace('{dexterity}', stats.dexterity)
      .replace('{draw}', stats.draw)
      .replace('{summonHeal}', stats.summonHeal)
      .replace('{summonAtkBoost}', stats.summonAtkBoost);
  },

  getCardBaseCost(cardInst) {
    const tpl = GAME_DATA.cards[cardInst.id];
    if (!tpl) return 0;
    return cardInst.upgraded && tpl.upgradeCost !== undefined ? tpl.upgradeCost : tpl.cost;
  },

  getCardEffectiveCost(cardInst, inCombat = true) {
    if (inCombat && this.combat && cardInst.tempCost !== undefined) return cardInst.tempCost;
    return this.getCardBaseCost(cardInst);
  },

  // Resolve exact skill motion, duration, VFX theme & rarity spectacle scale for ALL 359 cards!
  resolveCardMotionProfile(tpl, stats = {}) {
    const rarity = tpl.rarity || 'common';
    const name = tpl.name || '';
    const dmg = stats.damage || tpl.dmg || tpl.damage || 0;
    const blk = stats.block || tpl.block || 0;
    const heal = stats.heal || tpl.heal || 0;
    const hits = tpl.hits || 1;
    const isAttack = tpl.type === 'attack' || dmg > 0 || !!tpl.damagePerPoison;
    const isPower = tpl.type === 'power';

    // 1. Determine Elemental / Skill Visual Theme
    const theme =
      tpl.orbType === 'fire' || /화염|파이어|작열|불길|메테오|지옥|폭발|불꽃|아포칼립스/.test(name)
        ? 'fire'
        : tpl.orbType === 'frost' || tpl.frostbite || /냉기|빙결|서리|눈보라|시간 정지/.test(name)
          ? 'frost'
          : tpl.orbType === 'lightning' || /번개|라이트닝|뇌전|천둥|폭풍|야생 마법/.test(name)
            ? 'lightning'
            : tpl.holyBrand || tpl.detonateSeal || tpl.devotionGain || /광휘|성스러운|신성|태양|선버스트|심판|천사|후광|템푸스|티타니아|프리즈매틱/.test(name)
              ? 'holy'
              : tpl.doom || tpl.doomAll || /파멸|암흑|저주|죽음|사령|공포|크툴루|심연|유령|헥스|영혼/.test(name)
                ? 'doom'
                : (stats.poison || tpl.poison || tpl.doublePoison) > 0 || /독|맹독|암살/.test(name)
                  ? 'poison'
                  : tpl.selfDamage || /광전|분노|피|출혈|혈전|야수|대재앙/.test(name)
                    ? 'blood'
                    : heal > 0 || /치유|회복|기도|축복/.test(name)
                      ? 'heal'
                      : blk > 0 && !isAttack
                        ? 'block'
                        : 'slash';

    // 2. Determine Card Archetype Style
    let style = 'melee';
    if (isPower) {
      style = 'power';
    } else if (!isAttack) {
      if (heal > 0 || /치유|회복/.test(name)) style = 'heal';
      else if (blk > 0 || tpl.doubleBlock || /방어|방패|성벽|수호|월/.test(name)) style = 'guard';
      else if ((stats.poison || tpl.poison || tpl.doom || tpl.doomAll || tpl.placeTrap || stats.vuln || stats.weak) > 0) style = 'curse';
      else style = 'power';
    } else {
      if (hits >= 2 || /연격|난무|단검|비수|소용돌이|일제|군단|총공격|총돌격/.test(name)) style = 'flurry';
      else if (/화살|사격|저격|활|폭풍|투척|표창|단창|화살비/.test(name)) style = 'ranged';
      else if (tpl.target === 'all' && ['fire', 'frost', 'lightning', 'holy', 'doom'].includes(theme)) style = 'spell_aoe';
      else if (['fire', 'frost', 'lightning', 'holy', 'doom'].includes(theme) && /주문|광선|화살|권능|저주|파멸|충격|빛/.test(name)) style = 'spell_beam';
      else if (dmg >= 14 || /강타|분쇄|도끼|철퇴|대검|격돌|재앙|파괴|심판|일격/.test(name)) style = 'heavy';
      else style = 'melee';
    }

    // 3. Pick Exact Motion Class, Duration & VFX Scale by Rarity Tier!
    let motionCls = 'mot-common-jab';
    let durationMs = 260;
    let vfxScale = 0.55;
    let tier = 1;

    if (rarity === 'common') {
      tier = 1;
      vfxScale = 0.52;
      durationMs = 250;
      if (!isAttack) {
        motionCls = style === 'guard' ? 'mot-common-guard' : 'mot-common-focus';
      } else {
        motionCls = style === 'flurry' || style === 'ranged' ? 'mot-common-tap' : 'mot-common-jab';
      }
    } else if (rarity === 'uncommon') {
      tier = 2;
      vfxScale = 1.0;
      durationMs = 360;
      if (!isAttack) {
        motionCls = style === 'guard' ? 'mot-skill-guard' : isPower ? 'mot-power-ascend' : 'mot-skill-chant';
      } else if (style === 'flurry') {
        motionCls = 'mot-atk-flurry';
      } else if (style === 'ranged') {
        motionCls = 'mot-atk-bow';
      } else if (style === 'spell_aoe' || style === 'spell_beam') {
        motionCls = 'mot-atk-cast';
      } else if (style === 'heavy') {
        motionCls = 'mot-atk-leap';
      } else {
        motionCls = hits > 1 ? 'mot-atk-thrust' : 'mot-atk-slash';
      }
    } else if (rarity === 'rare') {
      tier = 3;
      vfxScale = 1.45;
      durationMs = 460;
      if (!isAttack) {
        motionCls = style === 'guard' ? 'mot-rare-aegis' : 'mot-rare-awakening';
      } else if (style === 'flurry' || style === 'ranged') {
        motionCls = 'mot-rare-barrage';
      } else if (style === 'spell_aoe' || style === 'spell_beam') {
        motionCls = 'mot-rare-meteor';
      } else {
        motionCls = 'mot-rare-cleave';
      }
    } else {
      // LEGENDARY (Tier 4): Spectacular Signature Ultimate Motion + Cut-In!
      tier = 4;
      vfxScale = 1.85;
      durationMs = 740;
      if (theme === 'doom' || /시간 정지|권능어|죽음|크툴루|공포|유령|심연/.test(name)) {
        motionCls = 'mot-leg-eclipse';
      } else if (style === 'guard' || style === 'heal' || theme === 'holy' || /치유|후광|프리즈매틱|심판|템푸스|티타니아/.test(name)) {
        motionCls = 'mot-leg-divine';
      } else if (theme === 'fire' || theme === 'lightning' || style === 'ranged' || style === 'spell_aoe' || /메테오|화살 폭풍|재앙|아포칼립스|지옥|야수신/.test(name)) {
        motionCls = 'mot-leg-cataclysm';
      } else {
        motionCls = 'mot-leg-omnislash';
      }
    }

    return { tpl, rarity, tier, theme, style, motionCls, durationMs, vfxScale, isAttack };
  },

  playCardFromHand(handIdx) {
    if (!this.combat || this.combat.ended) return;
    const cardInst = this.combat.hand[handIdx];
    if (!cardInst) return;
    const tpl = GAME_DATA.cards[cardInst.id];

    if (this.run.relics.includes('velvet_choker') && (this.combat.cardsPlayedThisTurn || 0) >= 6) {
      this.logCombat('📿 [벨벳 초커] 페널티! 한 턴에 카드를 최대 6장까지만 사용할 수 있습니다!');
      this.renderCombat();
      return;
    }

    const effectiveCost = this.getCardEffectiveCost(cardInst, true);
    if (this.combat.energy < effectiveCost) {
      this.logCombat('⚠️ 행동력(AP)이 부족합니다!');
      return;
    }

    let target = this.combat.enemies[this.combat.targetIndex];
    if (!target || target.hp <= 0) {
      target = this.combat.enemies.find(e => e.hp > 0);
      this.combat.targetIndex = this.combat.enemies.indexOf(target);
    }
    if (!target) return;

    this.combat.energy -= effectiveCost;
    this.combat.cardsPlayedThisTurn = (this.combat.cardsPlayedThisTurn || 0) + 1;
    this.recordAchStat('maxCardsInTurn', this.combat.cardsPlayedThisTurn, 'max');
    SfxEngine.play('card');

    // Slay the Spire 1 Gremlin Nob Skill Enrage: Playing a Skill card enrages enemies with skillEnrage!
    if (tpl.type === 'skill') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0 && en.skillEnrage > 0) {
          en.strength += en.skillEnrage;
          this.logCombat(`💢 [${en.name}]의 스킬 격노(Nob Enrage)! 전술/방어 카드를 사용해 적의 힘이 +${en.skillEnrage} 상승했습니다!`);
        }
      });
    }

    const stats = this.computeCardStats(cardInst);
    const motionProfile = this.resolveCardMotionProfile(tpl, stats);
    if (tpl.type === 'attack' && this.run.relics.includes('pen_nib_relic')) {
      this.run.penNibCounter = (this.run.penNibCounter || 0) + 1;
      if (this.run.penNibCounter >= 7) {
        this.run.penNibCounter = 0;
        stats.damage *= 2;
        this.logCombat('✒️ [만년필 촉] 7번째 공격 발동! 피해량이 2배로 증폭됩니다!');
      }
    }
    const subId = this.run.subclassId;

    if (tpl.selfDamage) this.run.hp = Math.max(1, this.run.hp - tpl.selfDamage);
    if (tpl.gainEnergy) this.combat.energy += tpl.gainEnergy;
    if (stats.block > 0) {
      this.combat.player.block += stats.block;
      this.recordAchStat('totalBlockGained', stats.block, 'add');
      this.recordAchStat('maxSingleBlock', this.combat.player.block, 'max');
      SfxEngine.play('block');
      VfxEngine.effectOnTarget('player', 0, 'block', motionProfile.vfxScale);
      this.spawnFloatingVfx('player', `🛡️+${stats.block}`, 'vfx-block');
      // Cleric Holy Brand triggers radiant damage whenever Cleric gains block!
      if (this.run.charId === 'cleric') {
        this.triggerClericHolyBrandReflection(stats.block);
      }
    }
    if (tpl.doubleBlock) this.combat.player.block *= 2;
    if (stats.strength > 0) this.combat.player.strength += stats.strength;
    if (stats.dexterity > 0) this.combat.player.dexterity += stats.dexterity;
    if (tpl.metallicize) this.combat.player.metallicize += tpl.metallicize;
    if (tpl.stance) this.changeStance(tpl.stance);

    // --- 8 CLASS-UNIQUE CARD MECHANICS ---
    const cid = this.run.charId;

    // 1) FIGHTER: Combo Chain (+1 AP once per turn upon hitting 4-combo!) & Parry
    if (cid === 'fighter') {
      this.combat.comboCount = (this.combat.comboCount || 0) + 1;
      if (tpl.parry) this.combat.player.parry = (this.combat.player.parry || 0) + tpl.parry;
      if (this.combat.comboCount >= 4 && !this.combat.comboApGrantedThisTurn) {
        this.combat.comboApGrantedThisTurn = true;
        this.combat.energy += 1;
        this.drawCards(1);
        SfxEngine.play('burst');
        VfxEngine.banner('⚔️ 4연격 콤보 달성! AP+1 & 1드로우', 'gold');
        this.logCombat(`⚔️ [4연격 콤보 달성!] 추가 행동력(AP) +1 & 카드 1장 드로우!`);
      }
    }

    // Non-Attack Skill / Power Card-Specific & Rarity-Scaled Motion & Spectacle!
    if (tpl.type !== 'attack') {
      if (!this._hitVisuals) this._hitVisuals = { enemyHits: {}, enemyLunges: {}, enemyBuffs: {}, playerLungeTs: 0, playerHurtTs: 0, playerBlockTs: 0 };
      this._hitVisuals.playerBlockTs = Date.now();
      this._hitVisuals.playerMotionCls = motionProfile.motionCls;
      this._hitVisuals.playerMotionDur = motionProfile.durationMs;
      this._hitVisuals.playerEmo = motionProfile.rarity === 'legendary' ? 'smug' : stats.heal > 0 ? 'happy' : tpl.type === 'power' ? 'smug' : 'neutral';
      this._hitVisuals.playerEmoTs = Date.now();
      const nonAtkTargetIdxs = (tpl.target === 'all' ? this.combat.enemies.filter(e => e.hp > 0) : [target])
        .map(e => this.combat.enemies.indexOf(e)).filter(i => i >= 0);
      VfxEngine.playCardSpectacle(motionProfile, nonAtkTargetIdxs, cid);
    }

    // 2) BARBARIAN: Bloodied (<50% HP) bonus Strength on Rage skills
    if (cid === 'barbarian' && tpl.enrageBoost && this.run.hp <= this.run.maxHp * 0.5) {
      this.combat.player.strength += tpl.enrageBoost;
    }

    // 3) ROGUE: Generate 0-cost Shivs in hand on skills
    if (tpl.addShiv) {
      for (let s = 0; s < tpl.addShiv; s++) {
        if (this.combat.hand.length < 10) {
          const shiv = this.createCardInstance('token_shiv', Date.now() + s);
          if (cardInst.upgraded) shiv.upgraded = true;
          this.combat.hand.push(shiv);
        }
      }
    }

    // 4) RANGER: Place Tactical Traps on skills
    if (tpl.placeTrap) {
      this.combat.traps = (this.combat.traps || 0) + tpl.placeTrap;
    }

    // 5) WIZARD: Channel Elemental Orbs (Fire / Frost / Lightning)
    if (stats.summonHeal > 0 || stats.summonAtkBoost > 0) {
      this.summonOrBuffCompanion(stats.summonHeal, stats.summonAtkBoost);
    }
    if (tpl.addDrone) {
      if (cid === 'wizard') {
        const oType = tpl.orbType || (tpl.type === 'attack' ? 'fire' : 'frost');
        for (let d = 0; d < tpl.addDrone; d++) {
          this.channelElementalOrb(oType);
        }
      } else {
        const cap = this.combat.maxDrones || 3;
        this.combat.drones = Math.min(cap, this.combat.drones + tpl.addDrone);
      }
    }

    // 6) CLERIC: Devotion Mantra (At 10 -> Miracle Wrath +1 AP & +6 AoE Radiant!)
    if (tpl.devotionGain) {
      this.combat.devotion = (this.combat.devotion || 0) + tpl.devotionGain;
      if (this.combat.devotion >= 10) {
        this.combat.devotion -= 10;
        this.combat.energy += 1;
        SfxEngine.play('holy');
        VfxEngine.banner('🌟 신앙심 10: 천상 기적!', 'holy');
        this.combat.enemies.forEach(en => {
          if (en.hp > 0) {
            VfxEngine.effectOnTarget('enemy', this.combat.enemies.indexOf(en), 'holy');
            this.dealDamageToEnemy(en, 8 + this.run.act * 2, true);
          }
        });
        this.logCombat(`🌟 [신앙심 10 달성: 천상 기적!] 행동력(AP) +1 및 적 전체에 광휘 심판 ${8 + this.run.act * 2} 피해!`);
      }
    }

    // 7) PALADIN: Seal All & Aura Power Boost
    if (tpl.sealAll) {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) en.seal = (en.seal || 0) + tpl.sealAll;
      });
    }
    if (tpl.auraBoost) {
      this.combat.auraPower = (this.combat.auraPower || 3) + tpl.auraBoost;
    }

    // 8) WARLOCK: Doom All (STS2 Necrobinder curse)
    if (tpl.doomAll) {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) en.doom = (en.doom || 0) + tpl.doomAll + (cardInst.upgraded ? 3 : 0);
      });
      this.checkWarlockDoomExecutions();
    }

    const targets = tpl.target === 'all' ? this.combat.enemies.filter(e => e.hp > 0) : [target];
    const hits = tpl.hits || 1;

    if (stats.damage > 0 || tpl.damagePerPoison) {
      // First-attack-per-turn triggers (Subclass + S-Rank Class Relics!)
      if (!this.combat.firstAttackUsedThisTurn) {
        this.combat.firstAttackUsedThisTurn = true;
        if (subId === 'battlemaster') {
          this.applyDebuffToEnemy(target, 'vuln', 1);
          this.applyDebuffToEnemy(target, 'weak', 1);
        }
        if (this.run.relics.includes('ftr_rank_s')) {
          this.combat.player.block += 5;
          this.combat.secondaryResource += 1;
        }
        if (this.run.relics.includes('rog_rank_s')) {
          this.applyDebuffToEnemy(target, 'vuln', 1);
          this.applyDebuffToEnemy(target, 'poison', 2);
        }
      }
      // Subclass Per-Attack Triggers
      if (subId === 'champion') {
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + 1);
      }
      if (subId === 'hexblade' || subId === 'oathbreaker' || subId === 'phantom') {
        this.applyDebuffToEnemy(target, 'poison', 3);
      }

      // Player Attack Card-Specific & Rarity-Scaled Motion + Spectacle Choreography!
      if (!this._hitVisuals) this._hitVisuals = { enemyHits: {}, enemyLunges: {}, enemyBuffs: {}, playerLungeTs: 0, playerHurtTs: 0, playerBlockTs: 0 };
      this._hitVisuals.playerLungeTs = Date.now();
      this._hitVisuals.playerMotionCls = motionProfile.motionCls;
      this._hitVisuals.playerMotionDur = motionProfile.durationMs;
      this._hitVisuals.playerEmo = motionProfile.rarity === 'legendary' ? 'smug' : motionProfile.rarity === 'common' ? 'neutral' : 'angry';
      this._hitVisuals.playerEmoTs = Date.now();
      const atkTargetIdxs = targets.map(e => this.combat.enemies.indexOf(e)).filter(i => i >= 0);
      VfxEngine.playCardSpectacle(motionProfile, atkTargetIdxs, cid);
      const cardVfxTheme = motionProfile.theme;

      for (let h = 0; h < hits; h++) {
        targets.forEach(en => {
          if (en.hp > 0) {
            let dmg = stats.damage;
            if (tpl.damagePerPoison) dmg += en.poison;
            if (subId === 'gloom_stalker' && this.combat.turn === 1) dmg = Math.round(dmg * 1.4);

            // Fighter Sunder Bonus (+1 physical damage per Sunder stack on enemy!)
            if (en.sunder > 0) dmg += en.sunder;

            // Ranger Quarry Crit Burst (Consumes Quarry on hit for +1.0x Quarry bonus damage!)
            if (en.quarry > 0 && cid === 'ranger') {
              dmg += en.quarry;
              en.quarry = Math.max(0, en.quarry - 2);
            }

            this.dealDamageToEnemy(en, dmg, false, h, cardVfxTheme, motionProfile.vfxScale);

            // Barbarian Bleed Burst on hit (20% of Bleed, capped at 4) + Bloodied Lifesteal (<50% HP)!
            if (cid === 'barbarian' && en.hp > 0 && (en.bleed || 0) > 0) {
              const bleedBurst = Math.min(4, Math.max(1, Math.floor(en.bleed * 0.2)));
              this.dealDamageToEnemy(en, bleedBurst, true);
              if (this.run.hp <= this.run.maxHp * 0.5) {
                this.run.hp = Math.min(this.run.maxHp, this.run.hp + 1);
              }
            }

            // Slay the Spire Thorns: Attacking an enemy with Thorns deals counter-damage back per hit!
            if (en.thorns > 0) {
              this.applyEnemyDamageToPlayerOrSummon(en.thorns, false);
            }
          }
        });
      }
    }

    targets.forEach(en => {
      // Allow Paladin detonateSeal & Rogue 5-combo AP refund even if base hit just slew the target!
      const eIdx = this.combat.enemies.indexOf(en);
      if (tpl.detonateSeal && (en.seal || 0) > 0) {
        const sealCnt = en.seal;
        en.seal = 0;
        SfxEngine.play('holy');
        VfxEngine.effectOnTarget('enemy', eIdx, 'holy');
        VfxEngine.banner(`⚖️ 심판의 문장 ${sealCnt} 폭발!`, 'holy');
        if (en.hp > 0) this.dealDamageToEnemy(en, sealCnt * 3, true);
        this.combat.player.block += sealCnt;
        this.logCombat(`⚖️ [심판의 문장 ${sealCnt}개 폭발!] 추가 광휘 피해 +${sealCnt * 3} 및 방어도 +${sealCnt}!`);
      }
      if (tpl.comboPoint) {
        en.comboPoints = (en.comboPoints || 0) + tpl.comboPoint;
        if (en.comboPoints >= 5) {
          en.comboPoints -= 5;
          const evisDmg = 6 + (this.run.act || 1) * 6 + Math.floor(Math.max(0, this.combat.player.strength) * 0.5);
          const poisonCap = 6 + (this.run.act || 1) * 3;
          const poisonBurst = en.poison > 0 ? Math.min(poisonCap, Math.ceil(en.poison * 0.6)) : 0;
          SfxEngine.play('crit');
          VfxEngine.effectOnTarget('enemy', eIdx, 'crit');
          VfxEngine.banner('💀 5연계 마무리 일격!', 'blood');
          if (en.hp > 0) this.dealDamageToEnemy(en, evisDmg + poisonBurst, true);
          let apMsg = '';
          if (!this.combat.rogueFinisherApUsed) {
            this.combat.rogueFinisherApUsed = true;
            this.combat.energy += 1;
            apMsg = ' + AP+1';
          }
          const poiMsg = poisonBurst > 0 ? ` + 맹독폭발 ${poisonBurst}` : '';
          this.logCombat(`💀 [5연계 마무리 일격(Eviscerate)!] ${en.name}에게 고정 피해 ${evisDmg}${poiMsg}${apMsg}!`);
        }
      }

      if (en.hp <= 0) return;
      if (stats.poison > 0) this.applyDebuffToEnemy(en, 'poison', stats.poison);
      if (stats.vuln > 0) this.applyDebuffToEnemy(en, 'vuln', stats.vuln);
      if (stats.weak > 0) this.applyDebuffToEnemy(en, 'weak', stats.weak);
      if (tpl.doublePoison) en.poison *= 2;
      if (tpl.triggerPoisonNow && en.poison > 0) {
        this.dealDamageToEnemy(en, en.poison, true);
      }

      // Apply Class-Unique Status Effects to Target(s)
      if (tpl.sunder) {
        en.sunder = (en.sunder || 0) + tpl.sunder;
        en.block = Math.max(0, en.block - tpl.sunder * 2); // Sunder shatters enemy armor!
      }
      if (tpl.bleed) {
        en.bleed = (en.bleed || 0) + tpl.bleed;
      }
      if (tpl.quarry) {
        en.quarry = (en.quarry || 0) + tpl.quarry;
      }
      if (tpl.frostbite) {
        en.frostbite = (en.frostbite || 0) + tpl.frostbite;
      }
      if (tpl.holyBrand) {
        en.holyBrand = (en.holyBrand || 0) + tpl.holyBrand;
      }
      if (tpl.seal) {
        const extraSeal = cid === 'paladin' && this.combat.paladinAura === 'crusader' ? 1 : 0;
        en.seal = (en.seal || 0) + tpl.seal + extraSeal;
      }
      if (tpl.doom) {
        en.doom = (en.doom || 0) + tpl.doom + (cardInst.upgraded ? 2 : 0);
      }
    });

    if (tpl.healOnHit) {
      this.healPlayerWithClericMechanics(tpl.healOnHit);
    }
    this.checkWarlockDoomExecutions();
    if (tpl.consumeResourceAll) this.combat.secondaryResource = 0;
    if (tpl.resourceGain) this.gainSecondaryResource(tpl.resourceGain);

    if (tpl.triggerSummonAttack) {
      if (!this.combat.summon.active) this.summonOrBuffCompanion(12, 7);
      this.triggerSummonCoopAttack(target);
    }
    if (tpl.triggerDronesNow && this.combat.drones > 0) {
      this.triggerDronesAction();
    }
    if (cardInst.mutation) {
      this.applyCardMutationEffect(cardInst.mutation, target);
    }
    if (stats.draw > 0) this.drawCards(stats.draw);

    this.combat.hand.splice(handIdx, 1);
    if (tpl.exhaust || tpl.type === 'power') {
      this.combat.exhaustPile.push(cardInst);
    } else {
      this.combat.discardPile.push(cardInst);
    }

    this.logCombat(`🎴 [${tpl.name}${cardInst.upgraded ? '+' : ''}] 발동!`);
    this.checkAchievements();
    this.checkCombatEnd();
    this.renderCombat();
  },

  applyCardMutationEffect(mutId, target) {
    if (mutId === 'rad_infused' && target && target.hp > 0) {
      this.applyDebuffToEnemy(target, 'poison', 2);
    } else if (mutId === 'adrenaline_gene') {
      this.gainSecondaryResource(1);
    } else if (mutId === 'chitin_coat') {
      this.combat.player.block += 3;
    }
  },

  changeStance(newStance) {
    const oldStance = this.combat.stance;
    if (oldStance === newStance) return;
    if (oldStance === 'calm') {
      this.combat.energy += 1;
      this.logCombat('☯️ [명경/신앙 태세] 해제! 행동력(AP) +1 획득!');
    }
    if (newStance === 'divinity') {
      this.combat.energy += 1;
      this.logCombat('🌟 [초월/천상 강림] 개방! 모든 피해 2.25배 및 AP +1!');
    }
    this.combat.stance = newStance;
  },

  gainSecondaryResource(amt) {
    this.combat.secondaryResource += amt;
  },

  triggerSecondaryBurst() {
    if (!this.combat || this.combat.ended) return;
    const cost = this.combat.burstCost || 5;
    if (this.combat.burstUsedThisTurn) {
      this.logCombat('⚠️ 클래스 고유 개방은 한 라운드(턴)에 1번만 발동할 수 있습니다!');
      this.renderCombat();
      return;
    }
    if (this.combat.secondaryResource < cost) {
      this.logCombat(`⚠️ 고유 자원이 ${cost} 이상 모였을 때 클릭하면 클래스 궁극 개방을 발동할 수 있습니다!`);
      this.renderCombat();
      return;
    }

    this.combat.secondaryResource -= cost;
    this.combat.burstUsedThisTurn = true;
    this.combat.burstCost = cost + 2; // Escalating cost (5 -> 7 -> 9) prevents infinite stalling!
    this.recordAchStat('burstsTriggered', 1, 'add');
    this.checkAchievements();
    const cid = this.run.charId;
    SfxEngine.play('burst');
    VfxEngine.effectOnTarget('player', 0, cid === 'warlock' ? 'doom' : cid === 'cleric' || cid === 'paladin' ? 'holy' : 'fire');
    VfxEngine.banner(`🔥 ${GAME_DATA.characters[cid].name.split(' ')[0]} 궁극 개방!`, 'gold');

    if (cid === 'fighter') {
      this.combat.energy += 1;
      this.combat.comboCount = (this.combat.comboCount || 0) + 1;
      this.combat.player.parry = (this.combat.player.parry || 0) + 3;
      this.drawCards(1);
      this.logCombat('⚔️ [행동 연쇄(Action Surge) 개방] 행동력 +1, 연격 콤보 +1, 반격 +3, 카드 1장 드로우!');
    } else if (cid === 'barbarian') {
      this.combat.player.strength += 1;
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) {
          en.bleed = (en.bleed || 0) + 4;
          this.dealDamageToEnemy(en, Math.ceil(en.bleed * 0.5), true);
        }
      });
      this.logCombat('💢 [혈투 광폭화 폭발] 힘 +1 및 모든 적에게 출혈 +4 부여 후 출혈 폭발!');
    } else if (cid === 'rogue') {
      for (let s = 0; s < 2; s++) {
        if (this.combat.hand.length < 10) this.combat.hand.push(this.createCardInstance('token_shiv', Date.now() + s));
      }
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) en.comboPoints = (en.comboPoints || 0) + 1;
      });
      this.logCombat('🗡️ [암기 난사 개방] 손패에 0코스트 [투척 단검] 2장 생성 및 모든 적 연계 +1점!');
    } else if (cid === 'ranger') {
      this.combat.traps = (this.combat.traps || 0) + 1;
      this.toggleRangerBeastMode();
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) {
          en.quarry = (en.quarry || 0) + 3;
          this.dealDamageToEnemy(en, 7 + Math.floor(this.combat.player.strength * 0.5), true);
        }
      });
      this.logCombat('🏹 [전술 함정망 & 야수 태세 전환] 함정 +1개 매설, 적 전체 표적 +3 및 사격!');
    } else if (cid === 'wizard') {
      this.combat.energy += 1;
      this.channelElementalOrb('lightning');
      if (this.combat.orbList && this.combat.orbList.length > 0) {
        this.evokeElementalOrb(this.combat.orbList[0]);
      }
      this.logCombat('🔮 [원소 발현(Evoke)] 행동력 +1, 번개 구체 영창 및 최전방 구체 즉시 발현!');
    } else if (cid === 'cleric') {
      this.combat.devotion = (this.combat.devotion || 0) + 3;
      this.healPlayerWithClericMechanics(6);
      this.logCombat('☀️ [신성력 전달: 초과치유 방벽] 체력 +6 치유(초과분 방어도 전환) 및 신앙심 +3!');
    } else if (cid === 'paladin') {
      this.cyclePaladinAura();
      this.combat.player.block += 6;
      if (this.combat.hand.length < 10) {
        this.combat.hand.push(this.createCardInstance('token_smite_wave', Date.now()));
      }
      this.logCombat('✨ [성기사 오라 전환 & 성검 파동] 오라 전환, 방어도 +6 및 0코스트 [빛의 심판 파동] 생성!');
    } else if (cid === 'warlock') {
      if (this.combat.summon.active && this.combat.summon.hp > 6) {
        this.combat.summon.hp -= 6;
        this.combat.summon.atk += 2;
      } else {
        this.summonOrBuffCompanion(8, 2);
      }
      this.combat.energy += 1;
      this.drawCards(1);
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) en.doom = (en.doom || 0) + 6;
      });
      this.checkWarlockDoomExecutions();
      this.logCombat('🟣 [사역마 혈맹 제물 & 파멸 증폭] 행동력 +1, 카드 1장 드로우 및 적 전체에 파멸(Doom) +6 부여!');
    }

    this.checkAchievements();
    this.checkCombatEnd();
    this.renderCombat();
  },

  triggerSummonCoopAttack(target) {
    if (!this.combat.summon.active) return;
    const t = target && target.hp > 0 ? target : this.combat.enemies.find(e => e.hp > 0);
    if (!t) return;
    let atkDmg = this.combat.summon.atk;
    // Ranger Beast Mode: Assault deals 1.35x damage, Guard generates +4 Block for Ranger!
    if (this.run.charId === 'ranger') {
      if (this.combat.beastMode === 'assault') {
        atkDmg = Math.round(atkDmg * 1.35);
      } else {
        this.combat.player.block += 4;
      }
    }
    this.dealDamageToEnemy(t, atkDmg, true);
    // Warlock Demon Evolution Scaling (Imp: +2 Doom | Fiend ATK 10+: +3 Doom & +2 Block | Demon Lord ATK 15+: +5 Doom & +4 Block!)
    if (this.run.charId === 'warlock' && t.hp > 0) {
      const sAtk = this.combat.summon.atk || 0;
      const doomGain = sAtk >= 15 ? 5 : sAtk >= 10 ? 3 : 2;
      const wardGain = sAtk >= 15 ? 4 : sAtk >= 10 ? 2 : 0;
      t.doom = (t.doom || 0) + doomGain;
      if (wardGain > 0) this.combat.player.block += wardGain;
      this.checkWarlockDoomExecutions();
    }
    this.logCombat(`${this.combat.summon.name} 협동 공격! (${atkDmg} 피해)`);
  },

  triggerDronesAction() {
    if (this.combat.drones <= 0) return;
    const alive = this.combat.enemies.filter(e => e.hp > 0);
    if (alive.length === 0) return;

    const wizActBoost = this.run.charId === 'wizard' ? Math.max(0, (this.run.act || 1) - 1) * 2 : 0;
    const dmgPerDrone =
      (this.run.charId === 'wizard' ? 3 : 4) +
      wizActBoost +
      Math.floor(Math.max(0, this.combat.player.strength) * 0.5) +
      (this.run.permStats.summonBoost || 0) +
      (this.run.relics.includes('wiz_rank_s') ? 3 : 0);
    const blockPerDrone = 2 + (this.run.charId === 'wizard' ? Math.max(0, (this.run.act || 1) - 1) : 0);

    // Wizard 3-Elemental Orbs (Fire = AoE dmg, Frost = Block + Frostbite, Lightning = High Single Dmg)
    if (this.run.charId === 'wizard' && this.combat.orbList && this.combat.orbList.length > 0) {
      this.combat.orbList.forEach((orbType, i) => {
        if (orbType === 'fire') {
          alive.forEach(en => {
            if (en.hp > 0) this.dealDamageToEnemy(en, dmgPerDrone, true);
          });
        } else if (orbType === 'frost') {
          this.combat.player.block += blockPerDrone;
          const t = alive[i % alive.length];
          if (t && t.hp > 0) t.frostbite = (t.frostbite || 0) + 1;
        } else {
          const t = alive[i % alive.length];
          if (t && t.hp > 0) this.dealDamageToEnemy(t, dmgPerDrone + 2, true);
        }
      });
      return;
    }

    for (let i = 0; i < this.combat.drones; i++) {
      const t = alive[i % alive.length];
      this.dealDamageToEnemy(t, dmgPerDrone, true);
      this.combat.player.block += blockPerDrone;
      if (this.run.charId === 'cleric' && t.hp > 0) {
        t.holyBrand = (t.holyBrand || 0) + 1;
      }
    }
  },

  applyDebuffToEnemy(enemy, debuffKey, amount) {
    if (!enemy || enemy.hp <= 0 || amount <= 0) return;
    if (enemy.artifact > 0) {
      enemy.artifact -= 1;
      this.logCombat(`🛡️ [${enemy.name}]의 마법 저항(Artifact)이 디버프를 무효화했습니다!`);
      return;
    }
    enemy[debuffKey] = (enemy[debuffKey] || 0) + amount;
    this.recordAchStat('totalDebuffsApplied', amount, 'add');
  },

  dealDamageToEnemy(enemy, rawDmg, ignoreWeak = false, hitStep = 0, vfxTheme = null, vfxScale = 1.0) {
    let dmg = rawDmg;
    if (!ignoreWeak && this.combat.player.weak > 0) dmg = Math.floor(dmg * 0.75);
    if (enemy.vuln > 0) dmg = Math.floor(dmg * 1.5);
    const totalShown = dmg;
    if (enemy.block > 0) {
      const absorbed = Math.min(enemy.block, dmg);
      enemy.block -= absorbed;
      dmg -= absorbed;
    }
    const wasAlive = enemy.hp > 0;
    enemy.hp = Math.max(0, enemy.hp - dmg);
    const justKilled = wasAlive && enemy.hp === 0;

    if (totalShown > 0) {
      this.recordAchStat('maxSingleHit', totalShown, 'max');
      if (this.combat) {
        this.combat.turnDamageDealt = (this.combat.turnDamageDealt || 0) + totalShown;
        this.recordAchStat('maxTurnDmg', this.combat.turnDamageDealt, 'max');
      }
    }
    if (justKilled && this.run) {
      this.recordAchStat('totalKills', 1, 'add');
      if (this.meta.achStats && this.meta.achStats.classKills) {
        this.meta.achStats.classKills[this.run.charId] = (this.meta.achStats.classKills[this.run.charId] || 0) + 1;
      }
      this.checkAchievements();
    }

    if (totalShown > 0 && this.combat && this.combat.enemies) {
      const eIdx = this.combat.enemies.indexOf(enemy);
      const isCrit = dmg >= 14;
      if (!this._hitVisuals) this._hitVisuals = { enemyHits: {}, enemyLunges: {}, enemyBuffs: {}, playerLungeTs: 0, playerHurtTs: 0, playerBlockTs: 0 };
      const _psEh = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
      this._hitVisuals.enemyHits[eIdx] = {
        crit: isCrit,
        ts: Date.now(),
        motionCls: _psEh && _psEh.pickMotion ? _psEh.pickMotion('enemy_hit') : 'mot-ehit-shake'
      };

      const fireImpact = () => {
        if (justKilled) {
          VfxEngine.killBurst(eIdx);
        } else {
          SfxEngine.playHit(isCrit, hitStep);
          const fx = isCrit && vfxScale >= 0.85 ? 'crit' : (vfxTheme || 'slash');
          VfxEngine.effectOnTarget('enemy', eIdx, fx, vfxScale);
        }
        const label = dmg > 0 ? (isCrit ? `💥-${dmg}!` : `-${dmg}`) : `🛡️막힘`;
        this.spawnFloatingVfx('enemy', label, isCrit ? 'vfx-crit' : 'vfx-dmg', eIdx);
      };

      if (hitStep > 0) {
        setTimeout(fireImpact, hitStep * 75);
      } else {
        fireImpact();
      }
    }
    // Slay the Spire Curl-Up mechanic (Louse / Cube / Rust Monster): first time taking HP damage, gains immediate block!
    if (dmg > 0 && enemy.hp > 0 && enemy.curlUp > 0) {
      enemy.block += enemy.curlUp;
      enemy.curlUp = 0;
    }
  },

  endPlayerTurn() {
    if (!this.combat || this.combat.ended) return;
    const subId = this.run.subclassId;

    // Slay the Spire End-of-Turn Hand Resolution:
    // - Burn / Curse cards remaining in hand deal unblocked fire/shadow damage!
    // - Ethereal cards (Dazed) exhaust instead of going to discard pile!
    while (this.combat.hand.length > 0) {
      const cInst = this.combat.hand.pop();
      const tpl = GAME_DATA.cards[cInst.id];
      if (tpl && tpl.endTurnBurn) {
        this.applyEnemyDamageToPlayerOrSummon(tpl.endTurnBurn, false);
        this.logCombat(`🔥 손에 남은 [${tpl.name}] 때문에 피해를 ${tpl.endTurnBurn} 입었습니다!`);
      }
      if (tpl && tpl.ethereal) {
        this.combat.exhaustPile.push(cInst);
      } else {
        this.combat.discardPile.push(cInst);
      }
    }

    if (this.checkCombatEnd()) return;

    if (this.combat.player.metallicize > 0) {
      this.combat.player.block += this.combat.player.metallicize;
    }
    // Paladin Devotion Aura: Automatic Block at end of turn!
    if (this.run.charId === 'paladin' && this.combat.paladinAura === 'devotion') {
      this.combat.player.block += 3 + Math.floor((this.combat.auraPower || 3) * 0.5);
    }
    if (this.run.relics.includes('orichalcum_relic') && this.combat.player.block === 0) {
      this.combat.player.block += 6;
    }
    if (this.run.relics.includes('clr_rank_s')) {
      this.healPlayerWithClericMechanics(2);
    }
    if (subId === 'hunter_conclave') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) this.dealDamageToEnemy(en, 6 + this.combat.player.strength, true);
      });
    }
    if (subId === 'fey_wanderer') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) this.applyDebuffToEnemy(en, 'weak', 1);
      });
    }
    if (this.combat.summon.active) {
      const firstAlive = this.combat.enemies.find(e => e.hp > 0);
      if (firstAlive) this.triggerSummonCoopAttack(firstAlive);
    }
    if (this.combat.drones > 0) {
      this.triggerDronesAction();
    }
    this.checkWarlockDoomExecutions();

    if (this.checkCombatEnd()) return;

    this.combat.enemies.forEach(en => {
      if (en.hp <= 0 || this.run.hp <= 0) return;
      en.block = 0;

      if (en.poison > 0) {
        en.hp = Math.max(0, en.hp - en.poison);
        en.poison = Math.max(0, en.poison - 1);
      }
      // Barbarian Bleed DoT ticks at start of enemy turn!
      if ((en.bleed || 0) > 0 && en.hp > 0) {
        en.hp = Math.max(0, en.hp - en.bleed);
        en.bleed = Math.max(0, en.bleed - 1);
      }
      this.checkWarlockDoomExecutions();
      if (en.hp <= 0) return;

      // Slay the Spire Regeneration trait (Troll, Ochre Jelly, Otyugh, Vampire, Tiamat)
      if (en.regen > 0) {
        en.hp = Math.min(en.maxHp, en.hp + en.regen);
      }

      const move = en.moves[en.moveIndex % en.moves.length];
      en.moveIndex += 1;

      if (move.intent === 'attack' || move.intent === 'attack_debuff' || move.intent === 'multi_attack') {
        const hits = move.hits || 1;
        const isCleaveBreath = (en.isBoss || en.isElite) && move.intent === 'attack_debuff';

        // Ranger Tactical Trap Trigger! (Springs BEFORE enemy attacks: 6 dmg & -20% enemy attack!)
        let trapTriggered = false;
        if (this.run.charId === 'ranger' && (this.combat.traps || 0) > 0) {
          this.combat.traps -= 1;
          trapTriggered = true;
          const trapDmg = 6 + Math.max(0, this.combat.player.dexterity);
          VfxEngine.effectOnTarget('enemy', this.combat.enemies.indexOf(en), 'trap');
          this.dealDamageToEnemy(en, trapDmg, true);
          en.quarry = (en.quarry || 0) + 1;
          this.logCombat(`🪤 [전술 함정 격발!] 공격하려던 ${en.name}에게 ${trapDmg} 피해 & 공격력 20% 감소!`);
          if (en.hp <= 0) return;
        }

        for (let h = 0; h < hits; h++) {
          if (en.hp <= 0 || this.run.hp <= 0) break;
          let dmg = move.dmg + en.strength;
          // Wizard Frostbite reduces enemy attack damage; 10+ stacks Freezes (-25% damage)!
          if ((en.frostbite || 0) > 0) {
            dmg = Math.max(1, dmg - Math.floor(en.frostbite / 3));
            if (en.frostbite >= 10) dmg = Math.floor(dmg * 0.75);
          }
          if (trapTriggered) dmg = Math.floor(dmg * 0.8);
          if (en.weak > 0) dmg = Math.floor(dmg * 0.75);
          if (this.combat.player.vuln > 0) dmg = Math.floor(dmg * 1.5);
          if (this.combat.stance === 'wrath') dmg = Math.floor(dmg * 2);
          // Paladin Devotion Aura reduces incoming damage by 15%!
          if (this.run.charId === 'paladin' && this.combat.paladinAura === 'devotion') {
            dmg = Math.floor(dmg * 0.85);
          }

          this.applyEnemyDamageToPlayerOrSummon(dmg, isCleaveBreath, en);
          if (en.hp > 0 && move.lifesteal && dmg > 0) {
            en.hp = Math.min(en.maxHp, en.hp + Math.round(dmg * 0.5));
          }
        }
        if (en.hp <= 0 || this.run.hp <= 0) return;
        if ((en.frostbite || 0) >= 10) {
          en.frostbite = Math.max(0, en.frostbite - 5);
        }
      }

      if (move.block) en.block += move.block;
      if (move.str) en.strength += move.str;
      if (move.intent !== 'attack' && move.intent !== 'attack_debuff' && move.intent !== 'multi_attack' && (move.block || move.str || move.weak || move.vuln || move.addStatus)) {
        if (!this._hitVisuals) this._hitVisuals = { enemyHits: {}, enemyLunges: {}, enemyBuffs: {}, playerLungeTs: 0, playerHurtTs: 0, playerBlockTs: 0 };
        if (!this._hitVisuals.enemyBuffs) this._hitVisuals.enemyBuffs = {};
        const _psEb = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
        const bIdx = this.combat.enemies.indexOf(en);
        if (bIdx >= 0) {
          this._hitVisuals.enemyBuffs[bIdx] = {
            ts: Date.now(),
            motionCls: _psEb && _psEb.pickMotion ? _psEb.pickMotion('enemy_buff') : 'mot-ebuff-roar'
          };
        }
      }
      if (move.weak) this.combat.player.weak += move.weak;
      if (move.vuln) this.combat.player.vuln += move.vuln;
      if (move.frail) this.combat.player.frail = (this.combat.player.frail || 0) + move.frail;
      if (move.strDown) {
        this.combat.player.strength -= move.strDown;
        this.logCombat(`💀 [${en.name}]의 영혼 흡수(Lagavulin Drain)! 내 힘이 -${move.strDown} 감소했습니다!`);
      }

      // Slay the Spire Status/Curse Card Injection (Slimed, Burn, Dazed, Wound, Curse)
      if (move.addStatus && GAME_DATA.cards[move.addStatus]) {
        const cnt = move.statusCount || 1;
        for (let s = 0; s < cnt; s++) {
          this.combat.discardPile.push(this.createCardInstance(move.addStatus));
        }
        this.logCombat(`⚠️ [${en.name}]의 공격으로 [${GAME_DATA.cards[move.addStatus].name}] ${cnt}장이 버린 덱에 섞였습니다!`);
      }

      // Enemy Metallicize (Plated Armor) at end of enemy turn
      if (en.metallicize > 0) {
        en.block += en.metallicize;
      }

      // Slay the Spire Escalation: Bosses and Elites gain Enrage Strength every turn!
      if (en.enragePerTurn > 0) {
        en.strength += en.enragePerTurn;
      }

      if (en.weak > 0) en.weak -= 1;
      if (en.vuln > 0) en.vuln -= 1;
    });

    if (this.combat.player.weak > 0) this.combat.player.weak -= 1;
    if (this.combat.player.vuln > 0) this.combat.player.vuln -= 1;
    if (this.combat.player.frail > 0) this.combat.player.frail -= 1;

    if (this.checkCombatEnd()) return;
    this.checkAchievements();
    this.startPlayerTurn(false);
  },

  applyEnemyDamageToPlayerOrSummon(dmg, isCleaveBreath = false, attackerEnemy = null) {
    let remaining = dmg;
    if (this.combat.player.block > 0) {
      const blocked = Math.min(this.combat.player.block, remaining);
      this.combat.player.block -= blocked;
      remaining -= blocked;

      // Fighter Parry Counter-Attack! When blocking enemy attack, strike back with Parry value!
      if (blocked > 0 && (this.combat.player.parry || 0) > 0 && attackerEnemy && attackerEnemy.hp > 0) {
        const counterDmg = this.combat.player.parry;
        this.dealDamageToEnemy(attackerEnemy, counterDmg, true);
        attackerEnemy.sunder = (attackerEnemy.sunder || 0) + 1;
        this.logCombat(`🛡️ [패링 반격(Parry)!] ${attackerEnemy.name}에게 카운터 참격 ${counterDmg} 피해 & 파쇄 +1!`);
      }
    }

    // Paladin Retribution Aura: Reflects Radiant Thorns damage back to attacker on every hit!
    if (this.run.charId === 'paladin' && this.combat.paladinAura === 'retribution' && attackerEnemy && attackerEnemy.hp > 0) {
      const reflectDmg = this.combat.auraPower || 3;
      this.dealDamageToEnemy(attackerEnemy, reflectDmg, true);
      attackerEnemy.seal = (attackerEnemy.seal || 0) + 1;
    }

    // Ranger Beast Guard Mode: Summon only tanks when in Guard Mode (or for non-Rangers, always tanks)
    const canSummonTank =
      this.combat.summon.active &&
      this.combat.summon.hp > 0 &&
      (this.run.charId !== 'ranger' || this.combat.beastMode === 'guard');

    if (remaining > 0 && canSummonTank) {
      const tanked = Math.min(this.combat.summon.hp, remaining);
      this.combat.summon.hp -= tanked;
      remaining -= tanked;
      if (this.combat.summon.hp <= 0) {
        this.combat.summon.active = false;
        this.logCombat(`💥 [${this.combat.summon.name}] 소환수가 대신 치명타를 막아내고 소멸했습니다!`);
      }
    }
    if (!this._hitVisuals) this._hitVisuals = { enemyHits: {}, enemyLunges: {}, enemyBuffs: {}, playerLungeTs: 0, playerHurtTs: 0, playerBlockTs: 0 };
    const _psDmg = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
    if (dmg > 0 && attackerEnemy && this.combat && this.combat.enemies) {
      const aIdx = this.combat.enemies.indexOf(attackerEnemy);
      if (aIdx >= 0) {
        if (!this._hitVisuals.enemyLunges) this._hitVisuals.enemyLunges = {};
        this._hitVisuals.enemyLunges[aIdx] = {
          ts: Date.now(),
          motionCls: _psDmg && _psDmg.pickMotion ? _psDmg.pickMotion('enemy_attack') : 'mot-enemy-lunge'
        };
      }
    }
    if (remaining > 0) {
      this.run.hp = Math.max(0, this.run.hp - remaining);
      if (this.combat) this.combat.tookHpDamageThisCombat = true;
      this._hitVisuals.playerHurtTs = Date.now();
      this._hitVisuals.playerMotionCls = _psDmg && _psDmg.pickMotion ? _psDmg.pickMotion('player_hit') : 'mot-hit-knockback';
      this._hitVisuals.playerEmo = this.run.hp <= this.run.maxHp * 0.35 ? 'sad' : 'surprised';
      this._hitVisuals.playerEmoTs = Date.now();
      SfxEngine.play('playerHit');
      VfxEngine.effectOnTarget('player', 0, 'blood');
      VfxEngine.damageVignette();
      VfxEngine.screenShake('heavy');
      this.spawnFloatingVfx('player', `-${remaining}`, 'vfx-dmg');
      // Barbarian gains +1 Rage whenever taking unblocked HP damage!
      if (this.run.charId === 'barbarian') {
        this.combat.secondaryResource += 1;
      }
    } else if (dmg > 0) {
      this._hitVisuals.playerBlockTs = Date.now();
      this._hitVisuals.playerMotionCls = _psDmg && _psDmg.pickMotion ? _psDmg.pickMotion('player_skill') : 'mot-skill-guard';
      this._hitVisuals.playerEmo = 'smug';
      this._hitVisuals.playerEmoTs = Date.now();
      SfxEngine.play('block');
      VfxEngine.effectOnTarget('player', 0, 'block');
      this.spawnFloatingVfx('player', `🛡️완벽방어!`, 'vfx-block');
    }
  },

  checkCombatEnd() {
    if (!this.combat || this.combat.ended) return true;
    if (this.run.hp <= 0) {
      this.combat.ended = true;
      this.showGameOverModal(false);
      return true;
    }
    const anyAlive = this.combat.enemies.some(e => e.hp > 0);
    if (!anyAlive) {
      this.combat.ended = true;
      const _psWin = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
      if (!this._hitVisuals) this._hitVisuals = { enemyHits: {}, enemyLunges: {}, enemyBuffs: {}, playerLungeTs: 0, playerHurtTs: 0, playerBlockTs: 0 };
      this._hitVisuals.playerBlockTs = Date.now();
      this._hitVisuals.playerMotionCls = _psWin && _psWin.pickMotion ? _psWin.pickMotion('victory') : 'mot-win-cheer';
      this._hitVisuals.playerEmo = 'happy';
      this._hitVisuals.playerEmoTs = Date.now();
      this.handleCombatVictory();
      return true;
    }
    return false;
  },

  handleCombatVictory() {
    SfxEngine.play('victory');
    VfxEngine.banner('🏆 전투 승리!', 'gold');
    const type = this.combat.encounterType;
    // Record Achievement Milestones for Combat Victory!
    if (!this.combat.tookHpDamageThisCombat) this.recordAchStat('perfectCombats', 1, 'add');
    if (type === 'elite') this.recordAchStat('elitesKilled', 1, 'add');
    else if (type === 'midboss') this.recordAchStat('midBossesKilled', 1, 'add');
    else if (type === 'boss') this.recordAchStat('bossesKilled', 1, 'add');
    if (type === 'boss' && this.run.act >= this.run.maxActs) {
      this.recordAchStat('totalVictories', 1, 'add');
    }
    this.checkAchievements();
    // Clear any Snecko Eye tempCost mutations on run deck cards after combat
    if (this.run && this.run.deck) {
      this.run.deck.forEach(c => {
        delete c.tempCost;
      });
    }

    let healAmt = this.run.permStats.healAfterCombat || 0;
    if (this.run.charId === 'fighter' || this.run.relics.includes('fighters_badge')) healAmt += 2;
    if (this.run.charId === 'cleric' || this.run.relics.includes('holy_symbol_lathander')) healAmt += 2;
    if (this.run.relics.includes('clr_rank_b')) healAmt += 4;
    if (healAmt > 0) {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + healAmt);
    }

    const rawExp = this.combat.enemies.reduce((acc, e) => acc + (e.expReward || 50), 0);
    const expRes = this.gainRunExp(rawExp);

    // Final Act 5 Stage 15 Boss (Tiamat) defeated!
    if (type === 'boss' && this.run.act >= this.run.maxActs) {
      this.meta.gems += 800;
      this.meta.totalClimbs = (this.meta.totalClimbs || 0) + 1;
      this.recordTowerProgress();
      this.saveMeta();
      this.showGameOverModal(true);
      return;
    }

    let goldEarned = type === 'boss' ? 110 : type === 'elite' || type === 'midboss' ? 58 : 28;
    if (this.run.subclassId === 'thief') goldEarned += 18;
    if (this.run.relics.includes('scavenger_goggles')) goldEarned = Math.round(goldEarned * 1.25);
    if (this.run.relics.includes('ectoplasm_slime')) goldEarned = 0; // Ectoplasm Boss Relic penalty!
    this.run.gold += goldEarned;

    const gemsEarned = type === 'boss' ? 150 : type === 'elite' || type === 'midboss' ? 65 : 25;
    this.meta.gems += gemsEarned;

    // Slay the Spire Standard (15-Stage Acts): Every combat grants a Card Reward choice (3 cards or skip for +25 GP)!
    let draftSource = 'combat';
    this.run.pendingCardDrafts = Math.max(1, this.run.pendingCardDrafts || 0);
    if (type === 'boss') {
      draftSource = 'boss';
      this.run.pendingBossRelicDraft = true; // Slay the Spire 1 Boss Relic Chest (Pick 1 of 3 Boss Relics)!
    } else if (type === 'midboss' || type === 'elite') {
      draftSource = 'midboss';
    }

    let bonusText = `⭐ 경험치 +${expRes.gained} EXP (${this.run.runExp}/${this.run.runNextExp}) ${expRes.leveledUp > 0 ? `| 🆙 Lv.${this.run.runLv} 레벨업! (SP +${expRes.leveledUp} & 카드 보상 획득!)` : ''
      } | 🪙 +${goldEarned} GP | 💎 마석 +${gemsEarned}`;

    if (type === 'elite' || type === 'midboss') {
      const relicGranted = this.grantRandomRelic();
      if (relicGranted) bonusText += ` | 🏆 유물 획득: [${relicGranted.name}]`;
      if (type === 'elite' && this.run.relics.includes('black_star')) {
        const extraRelic = this.grantRandomRelic();
        this.run.maxHp += 8;
        this.run.hp += 8;
        if (extraRelic) bonusText += ` & [검은 별: ${extraRelic.name}]`;
      }
    }

    // Slay the Spire 1 Potion Drop Chance after combat (40% chance unless Sozu is equipped)
    if (!this.run.relics.includes('sozu_brew') && this.run.potions.length < (this.run.maxPotions || 3) && Math.random() < 0.35) {
      const pKeys = Object.keys(GAME_DATA.potions);
      const droppedPid = pKeys[Math.floor(Math.random() * pKeys.length)];
      this.run.potions.push(droppedPid);
      bonusText += ` | 🧪 물약 획득: [${GAME_DATA.potions[droppedPid].name}]`;
    }

    this.saveMeta();

    // Open Card Draft Modal ONLY when player leveled up (or defeated a Midboss / Act Boss)!
    if ((this.run.pendingCardDrafts || 0) > 0) {
      this.openRewardModal(bonusText, draftSource);
    } else {
      this.openLootSummaryModal(bonusText);
    }
  },

  grantRandomRelic() {
    const unowned = Object.values(GAME_DATA.relics).filter(r => r.price && !this.run.relics.includes(r.id));
    if (unowned.length === 0) return null;
    const picked = unowned[Math.floor(Math.random() * unowned.length)];
    this.run.relics.push(picked.id);
    if (picked.id === 'scavenger_goggles') {
      this.run.maxHp += 10;
      this.run.hp += 10;
    }
    return picked;
  },

  renderCombat() {
    if (!this.combat || !this.run) return;
    const ch = GAME_DATA.characters[this.run.charId];

    document.getElementById('combat-turn-label').textContent = `ROUND ${this.combat.turn}`;
    document.getElementById('combat-log-ticker').textContent = this.combat.log;

    const spBtn = document.getElementById('combat-sp-btn');
    if (this.run.sp > 0) {
      spBtn.classList.remove('hidden');
      spBtn.textContent = `🆙 능력치(SP +${this.run.sp}) 분배 가능`;
    } else {
      spBtn.classList.add('hidden');
    }

    const stanceEl = document.getElementById('combat-stance-badge');
    stanceEl.className = 'stance-badge';
    if (this.combat.stance === 'calm') {
      stanceEl.classList.add('stance-calm');
      stanceEl.textContent = '☯️ 태세: 신앙/명경 (해제 시 AP+1)';
    } else if (this.combat.stance === 'wrath') {
      stanceEl.classList.add('stance-wrath');
      stanceEl.textContent = '🔥 태세: 광란/복수 (공격 1.75배 / 피격 2배)';
    } else if (this.combat.stance === 'divinity') {
      stanceEl.classList.add('stance-divinity');
      stanceEl.textContent = '🌟 태세: 천상 강림 (공격 2.25배!)';
    } else {
      stanceEl.textContent = `${this.run.subclassObj.icon} ${this.run.subclassObj.name.split(' ')[0]}`;
    }

    // Dynamic 6-Emotion Combat Hero Avatar + Multi-Motion Rendering!
    const _psCbt = typeof window !== 'undefined' ? window.PIXEL_SPRITES : null;
    const nowTs = Date.now();
    const activePlayerEmo =
      this._hitVisuals && nowTs - (this._hitVisuals.playerEmoTs || 0) < 950 && this._hitVisuals.playerEmo
        ? this._hitVisuals.playerEmo
        : this.run.hp <= this.run.maxHp * 0.35
          ? 'sad'
          : this.combat.stance === 'wrath'
            ? 'angry'
            : this.combat.player.block >= 15
              ? 'smug'
              : 'neutral';
    const avatarKey = `${this.run.charId}::${activePlayerEmo}`;
    if (this._lastPlayerAvatarChar !== avatarKey) {
      this._lastPlayerAvatarChar = avatarKey;
      const box = document.getElementById('player-avatar-box');
      if (box) {
        box.innerHTML = _psCbt && _psCbt.getHeroEmotionSprite
          ? _psCbt.getHeroEmotionSprite(this.run.charId, activePlayerEmo)
          : ch.avatarSvg;
      }
    }

    // Apply Varied Multi-Motion Combat Animations (2~3 distinct motions per situation!)
    const pCardEl = document.getElementById('player-unit-card');
    if (pCardEl && this._hitVisuals) {
      pCardEl.classList.remove('player-lunge', 'player-hurt-recoil', 'player-block-pulse');
      if (_psCbt && _psCbt.ALL_MOTION_CLASSES) {
        _psCbt.ALL_MOTION_CLASSES.forEach(c => pCardEl.classList.remove(c));
      }
      const motDur = (this._hitVisuals.playerMotionDur || 380) + 60;
      if (nowTs - (this._hitVisuals.playerHurtTs || 0) < 380) {
        void pCardEl.offsetWidth;
        pCardEl.classList.add('player-hurt-recoil', this._hitVisuals.playerMotionCls || 'mot-hit-knockback');
      } else if (nowTs - (this._hitVisuals.playerLungeTs || 0) < motDur) {
        void pCardEl.offsetWidth;
        pCardEl.classList.add('player-lunge', this._hitVisuals.playerMotionCls || 'mot-atk-slash');
      } else if (nowTs - (this._hitVisuals.playerBlockTs || 0) < motDur) {
        void pCardEl.offsetWidth;
        pCardEl.classList.add('player-block-pulse', this._hitVisuals.playerMotionCls || 'mot-skill-guard');
      }
    }
    document.getElementById('combat-player-name').innerHTML = `<span class="rank-badge rank-${this.run.rank}">${this.run.rank}급</span> ${ch.name.split(' ')[0]}`;

    const pBlockEl = document.getElementById('player-block-badge');
    if (this.combat.player.block > 0) {
      pBlockEl.classList.remove('hidden');
      pBlockEl.textContent = `🛡️ ${this.combat.player.block}`;
    } else {
      pBlockEl.classList.add('hidden');
    }

    const hpPct = Math.max(0, Math.min(100, (this.run.hp / this.run.maxHp) * 100));
    document.getElementById('player-hp-fill').style.width = `${hpPct}%`;
    document.getElementById('player-hp-text').textContent = `${this.run.hp} / ${this.run.maxHp}`;

    const pBuffs = [];
    const cid = this.run.charId;
    if (this.combat.player.strength > 0) pBuffs.push(`⚔️ 힘 +${this.combat.player.strength}`);
    if (this.combat.player.dexterity > 0) pBuffs.push(`🛡️ 민첩 +${this.combat.player.dexterity}`);
    if (this.combat.player.metallicize > 0) pBuffs.push(`✨ 수호오라 +${this.combat.player.metallicize}`);
    if (this.combat.player.weak > 0) pBuffs.push(`💫 약화 ${this.combat.player.weak}`);
    if (this.combat.player.vuln > 0) pBuffs.push(`💔 취약 ${this.combat.player.vuln}`);
    if (this.combat.player.frail > 0) pBuffs.push(`🦴 손상 ${this.combat.player.frail}`);

    // Class-Unique Player Buff & Mechanic Badges!
    if (cid === 'fighter') {
      const cappedCombo = Math.min(5, this.combat.comboCount || 0);
      const actPct = 6 + (this.run.act || 1) * 2;
      pBuffs.push(`🔥 연격 ${this.combat.comboCount || 0}콤보 (+${cappedCombo * actPct}%)`);
      if (this.combat.player.parry > 0) pBuffs.push(`🛡️ 반격 ${this.combat.player.parry}`);
    } else if (cid === 'barbarian') {
      const multPct = Math.round((this.getBarbarianBloodlustMult() - 1) * 100);
      pBuffs.push(`💢 혈투 증폭 +${multPct}%`);
      if (this.run.hp <= this.run.maxHp * 0.5) pBuffs.push(`🩸 혈전(흡혈+강화)`);
    } else if (cid === 'rogue') {
      pBuffs.push(`🗡️ 5연계 시 마무리 일격`);
    } else if (cid === 'ranger') {
      pBuffs.push(`🪤 매설 함정 ${this.combat.traps || 0}개`);
    } else if (cid === 'cleric') {
      pBuffs.push(`☀️ 신앙심 ${this.combat.devotion || 0}/10`);
      pBuffs.push(`💛 초과치유=방어도`);
    } else if (cid === 'paladin') {
      const auraNames = {
        retribution: `🔥 응보오라(반사+${this.combat.auraPower || 3})`,
        devotion: `🛡️ 헌신오라(감소15%)`,
        crusader: `⚔️ 성전오라(공격+15%)`
      };
      pBuffs.push(auraNames[this.combat.paladinAura || 'retribution']);
    } else if (cid === 'warlock') {
      pBuffs.push(`💀 파멸 처형(보스25%이하)`);
    }

    document.getElementById('player-buffs-row').innerHTML = pBuffs
      .map(b => `<span class="buff-pill">${b}</span>`)
      .join('');

    const compZone = document.getElementById('companion-zone');
    let compHtml = '';
    if (this.combat.summon.active) {
      const s = this.combat.summon;
      const sPct = Math.round((s.hp / s.maxHp) * 100);
      // Warlock Demon 3-Stage Evolution title
      let displayTitle = s.name;
      if (cid === 'warlock') {
        displayTitle = s.atk >= 18 ? '👑 심연의 대악마 군주' : s.atk >= 11 ? '😈 지옥마신 핀드' : '👿 계약 임프 사역마';
      }
      const rangerModeBtn =
        cid === 'ranger'
          ? `<button class="hud-btn" style="margin-top:5px; width:100%; font-size:0.7rem; padding:3px 6px; border-color:#55efc4;" onclick="Game.toggleRangerBeastMode()">
              ${this.combat.beastMode === 'assault' ? '🐾 현재: 포식 태세(공격 1.35배) [터치 전환]' : '🛡️ 현재: 호위 태세(탱킹+방어) [터치 전환]'}
            </button>`
          : '';
      compHtml += `
        <div class="summon-unit-card" title="슬더스 2 소환수 시스템: 플레이어가 받을 피해를 대신 방어하고 매 턴 종료 시 적을 자동 공격합니다!">
          <div class="summon-title">${displayTitle}</div>
          <div style="font-size:0.75rem; color:#dfe6e9; margin-bottom:5px;">⚔️ 협공 위력: ${s.atk} | 🛡️ 피해 대신 흡수</div>
          <div class="hp-bar-outer" style="height:15px;">
            <div class="hp-bar-fill" style="width:${sPct}%; background:linear-gradient(90deg, #9b59b6, #e056fd);"></div>
            <span class="hp-bar-text">${s.hp} / ${s.maxHp}</span>
          </div>
          ${rangerModeBtn}
        </div>
      `;
    }
    if (cid === 'paladin') {
      compHtml += `
        <button class="hud-btn" style="border-color:#f1c40f; color:#ffeaa7; font-size:0.75rem; padding:6px 10px;" onclick="Game.cyclePaladinAura()">
          ⚜️ 성기사 오라 전환 (현재: ${this.combat.paladinAura === 'retribution' ? '🔥응보' : this.combat.paladinAura === 'devotion' ? '🛡️헌신' : '⚔️성전'})
        </button>
      `;
    }
    if (this.combat.drones > 0) {
      const wizActBoost = cid === 'wizard' ? Math.max(0, (this.run.act || 1) - 1) * 2 : 0;
      const dmgPerDrone =
        (cid === 'wizard' ? 3 : 4) +
        wizActBoost +
        Math.floor(Math.max(0, this.combat.player.strength) * 0.5) +
        (this.run.permStats.summonBoost || 0) +
        (this.run.relics.includes('wiz_rank_s') ? 3 : 0);
      const frostBlk = 2 + (cid === 'wizard' ? Math.max(0, (this.run.act || 1) - 1) : 0);
      compHtml += `<div class="drone-orbs-container">`;
      if (cid === 'wizard' && this.combat.orbList && this.combat.orbList.length > 0) {
        this.combat.orbList.forEach((oType, i) => {
          const orbLabel =
            oType === 'fire'
              ? `🔥 화염 구체 #${i + 1} (전체 ${dmgPerDrone})`
              : oType === 'frost'
                ? `❄️ 냉기 구체 #${i + 1} (🛡️${frostBlk} / 동상+1)`
                : `⚡ 번개 구체 #${i + 1} (낙뢰 ${dmgPerDrone + 2})`;
          compHtml += `<div class="drone-orb-chip">${orbLabel}</div>`;
        });
      } else {
        for (let i = 0; i < this.combat.drones; i++) {
          compHtml += `
            <div class="drone-orb-chip">
              🔮 수호령 구체 #${i + 1} (⚡${dmgPerDrone} / 🛡️2)
            </div>
          `;
        }
      }
      compHtml += `</div>`;
    }
    compZone.innerHTML = compHtml;

    const enZone = document.getElementById('enemies-zone');
    const enFrag = document.createDocumentFragment ? document.createDocumentFragment() : enZone;
    enZone.innerHTML = '';
    this.combat.enemies.forEach((en, idx) => {
      if (en.hp <= 0) return;
      const isTargeted = idx === this.combat.targetIndex;
      const move = en.moves[en.moveIndex % en.moves.length];
      const enPct = Math.max(0, Math.min(100, (en.hp / en.maxHp) * 100));

      const enBuffs = [];
      if (en.enragePerTurn > 0) enBuffs.push(`💢 격노 +${en.enragePerTurn}/턴`);
      if (en.skillEnrage > 0) enBuffs.push(`👹 스킬격노 +${en.skillEnrage}`);
      if (en.strength > 0) enBuffs.push(`⚔️ 힘 +${en.strength}`);
      if (en.thorns > 0) enBuffs.push(`🌵 가시 ${en.thorns}`);
      if (en.regen > 0) enBuffs.push(`💚 재생 +${en.regen}`);
      if (en.artifact > 0) enBuffs.push(`🛡️ 마법저항 ${en.artifact}`);
      if (en.metallicize > 0) enBuffs.push(`🔩 철갑 +${en.metallicize}`);
      if (en.curlUp > 0) enBuffs.push(`🐚 웅크리기 ${en.curlUp}`);
      if (en.poison > 0) enBuffs.push(`🧪 맹독 ${en.poison}`);
      if (en.weak > 0) enBuffs.push(`💫 약화 ${en.weak}`);
      if (en.vuln > 0) enBuffs.push(`💔 취약 ${en.vuln}`);

      // Display the 8 Class-Unique Status Effects on Enemies!
      if ((en.sunder || 0) > 0) enBuffs.push(`💥 파쇄 +${en.sunder}`);
      if ((en.bleed || 0) > 0) enBuffs.push(`🩸 출혈 ${en.bleed}`);
      if ((en.comboPoints || 0) > 0) enBuffs.push(`⚪ 연계 ${'●'.repeat(en.comboPoints)}${'○'.repeat(Math.max(0, 5 - en.comboPoints))}`);
      if ((en.quarry || 0) > 0) enBuffs.push(`🎯 표적 ${en.quarry}`);
      if ((en.frostbite || 0) > 0) {
        enBuffs.push(en.frostbite >= 10 ? `🧊 빙결(${en.frostbite})` : `❄️ 동상 ${en.frostbite}`);
      }
      if ((en.holyBrand || 0) > 0) enBuffs.push(`☀️ 성스러운낙인 ${en.holyBrand}`);
      if ((en.seal || 0) > 0) enBuffs.push(`⚖️ 심판문장 ${en.seal}`);
      if ((en.doom || 0) > 0) {
        const execHint = en.isBoss ? '(25%↓처형)' : en.isElite ? '(40%↓처형)' : '';
        enBuffs.push(`💀 파멸 ${en.doom}/${en.hp}${execHint}`);
      }

      // Compute Live Scaled Intent Text (STS2 style accurate damage prediction!)
      let liveIntentDesc = move.desc;
      if (move.dmg) {
        let calcDmg = move.dmg + en.strength;
        if ((en.frostbite || 0) > 0) {
          calcDmg = Math.max(1, calcDmg - Math.floor(en.frostbite / 3));
          if (en.frostbite >= 10) calcDmg = Math.floor(calcDmg * 0.75);
        }
        if (en.weak > 0) calcDmg = Math.floor(calcDmg * 0.75);
        if (this.combat.player.vuln > 0) calcDmg = Math.floor(calcDmg * 1.5);
        if (this.combat.stance === 'wrath') calcDmg = Math.floor(calcDmg * 2);
        if (this.run.charId === 'paladin' && this.combat.paladinAura === 'devotion') {
          calcDmg = Math.floor(calcDmg * 0.85);
        }
        const hitsStr = move.hits ? ` x ${move.hits}` : '';
        const debuffPart = move.desc.includes('+') ? ' + ' + move.desc.split('+').slice(1).join('+').trim() : '';
        liveIntentDesc = `⚔️ 피해 ${calcDmg}${hitsStr}${debuffPart}`;
      } else if (move.block) {
        liveIntentDesc = `🛡️ 방어도 ${move.block}${move.str ? ` + 힘 +${move.str}` : ''}`;
      }

      const enCard = document.createElement('div');
      const recentHit = this._hitVisuals && this._hitVisuals.enemyHits && this._hitVisuals.enemyHits[idx];
      const recentLunge = this._hitVisuals && this._hitVisuals.enemyLunges && this._hitVisuals.enemyLunges[idx];
      const recentBuff = this._hitVisuals && this._hitVisuals.enemyBuffs && this._hitVisuals.enemyBuffs[idx];
      const lungeTs = typeof recentLunge === 'number' ? recentLunge : (recentLunge && recentLunge.ts) || 0;
      const hitCls =
        recentHit && Date.now() - recentHit.ts < 340
          ? `${recentHit.crit ? 'enemy-crit-recoil' : 'enemy-hit-recoil'} ${recentHit.motionCls || 'mot-ehit-shake'}`
          : lungeTs && Date.now() - lungeTs < 380
            ? `enemy-lunge ${(recentLunge && recentLunge.motionCls) || 'mot-enemy-lunge'}`
            : recentBuff && Date.now() - recentBuff.ts < 460
              ? recentBuff.motionCls || 'mot-ebuff-roar'
              : '';
      enCard.className = `unit-card enemy-unit ${isTargeted ? 'targeted' : ''} ${hitCls}`;
      if (enCard.setAttribute) enCard.setAttribute('data-en-idx', String(idx));
      enCard.onclick = () => {
        this.combat.targetIndex = idx;
        this.renderCombat();
      };

      enCard.innerHTML = `
        ${isTargeted ? `<span class="target-reticle">🎯 타겟</span>` : ''}
        <div class="enemy-intent-bubble">
          ⚠️ ${move.name} (${liveIntentDesc})
        </div>
        <div class="unit-avatar">${en.svg}</div>
        <div class="unit-name-row">
          <span class="unit-name">${en.name}</span>
          ${en.block > 0 ? `<span class="block-badge">🛡️ ${en.block}</span>` : ''}
        </div>
        <div class="hp-bar-outer">
          <div class="hp-bar-fill" style="width:${enPct}%"></div>
          <span class="hp-bar-text">${en.hp} / ${en.maxHp}</span>
        </div>
        <div class="buffs-row">
          ${enBuffs.map(b => `<span class="buff-pill">${b}</span>`).join('')}
        </div>
      `;
      enFrag.appendChild(enCard);
    });
    if (enFrag !== enZone) enZone.appendChild(enFrag);

    document.getElementById('combat-energy').textContent = this.combat.energy;
    document.getElementById('combat-max-energy').textContent = this.combat.maxEnergy;

    document.getElementById('sec-res-icon').textContent = ch.secondaryResourceIcon;
    document.getElementById('sec-res-name').textContent = ch.secondaryResourceName.split('(')[0];
    document.getElementById('sec-res-val').textContent = this.combat.secondaryResource;

    const bCost = this.combat.burstCost || 5;
    const hintEl = document.getElementById('sec-burst-hint');
    if (hintEl) {
      hintEl.textContent = this.combat.burstUsedThisTurn ? '사용됨(1/턴)' : `${bCost}+ 클릭: 개방!`;
    }
    const secOrb = document.getElementById('secondary-resource-box');
    if (this.combat.secondaryResource >= bCost && !this.combat.burstUsedThisTurn) {
      secOrb.classList.add('ready-burst');
    } else {
      secOrb.classList.remove('ready-burst');
    }

    document.getElementById('draw-pile-count').textContent = this.combat.drawPile.length;
    document.getElementById('discard-pile-count').textContent = this.combat.discardPile.length;

    const handEl = document.getElementById('hand-container');
    const handFrag = document.createDocumentFragment ? document.createDocumentFragment() : handEl;
    handEl.innerHTML = '';
    this.combat.hand.forEach((cardInst, idx) => {
      const cardEl = this.createCardElement(cardInst, () => this.playCardFromHand(idx));
      const effectiveCost = this.getCardEffectiveCost(cardInst, true);
      if (this.combat.energy < effectiveCost) {
        cardEl.classList.add('unplayable');
      }
      // Show Slay the Spire hotkey badge (1..9, 0) on each hand card!
      const hotkeyLabel = idx === 9 ? '0' : String(idx + 1);
      const badge = document.createElement('span');
      badge.className = 'hotkey-badge';
      badge.textContent = hotkeyLabel;
      cardEl.appendChild(badge);
      handFrag.appendChild(cardEl);
    });
    if (handFrag !== handEl) handEl.appendChild(handFrag);

    this.updateTopHud();
  },

  createCardElement(cardInst, onClickFn) {
    const tpl = GAME_DATA.cards[cardInst.id];
    const el = document.createElement('div');
    const rarity = tpl.rarity || 'common';
    el.className = `game-card type-${tpl.type} rarity-${rarity} ${cardInst.upgraded ? 'upgraded' : ''}`;
    if (onClickFn) el.onclick = onClickFn;

    const typeKor =
      tpl.type === 'attack'
        ? '⚔️ 공격'
        : tpl.type === 'skill'
          ? '🛡️ 전술'
          : tpl.type === 'status'
            ? '⚠️ 상태이상'
            : tpl.type === 'curse'
              ? '☠️ 저주'
              : '⚡ 지속';
    const rarityBadgeMap = {
      common: { label: '일반', color: '#b2bec3' },
      uncommon: { label: '고급', color: '#18dcff' },
      rare: { label: '희귀', color: '#c56cf0' },
      legendary: { label: '전설', color: '#f6c967' }
    };
    const rInfo = rarityBadgeMap[rarity] || rarityBadgeMap.common;
    const fallbackIcon =
      tpl.type === 'status'
        ? '⚠️'
        : tpl.type === 'curse'
          ? '☠️'
          : tpl.type === 'attack'
            ? '⚔️'
            : tpl.addDrone
              ? '🔮'
              : tpl.summonHeal
                ? '🐾'
                : tpl.stance
                  ? '✨'
                  : '🛡️';
    const iconArt =
      typeof window !== 'undefined' && window.PIXEL_CARD_ART
        ? window.PIXEL_CARD_ART.getCardArtHtml(tpl)
        : fallbackIcon;

    let mutHtml = '';
    if (cardInst.mutation) {
      const mutObj = GAME_DATA.mutations.find(m => m.id === cardInst.mutation);
      if (mutObj) {
        mutHtml = `<div class="card-mutation-badge" style="border-color:${mutObj.badgeColor}">${mutObj.name}</div>`;
      }
    }

    const shownCost = this.getCardEffectiveCost(cardInst, !!onClickFn && !!this.combat);
    const isCostReduced = cardInst.upgraded && tpl.upgradeCost !== undefined && tpl.upgradeCost < tpl.cost;
    const flavorHtml = tpl.flavor ? `<div class="card-flavor" title="${tpl.flavor.replace(/"/g, '&quot;')}">${tpl.flavor}</div>` : '';
    el.innerHTML = `
      <div>
        <div class="card-top-row">
          <div class="card-cost-orb ${isCostReduced ? 'cost-discounted' : ''}">${shownCost}</div>
          <div class="card-badges-right">
            <span class="card-type-tag">${typeKor}</span>
            <span class="card-rarity-dot" style="color:${rInfo.color}">${rInfo.label}</span>
          </div>
        </div>
        <div class="card-title">${tpl.name}${cardInst.upgraded ? ' +' : ''}</div>
        <div class="card-art-banner">${iconArt}</div>
      </div>
      <div class="card-desc">${this.formatCardDesc(cardInst)}</div>
      ${flavorHtml}
      ${mutHtml}
    `;
    return el;
  },

  logCombat(msg) {
    if (this.combat) this.combat.log = msg;
  },

  // --------------------------------------------------------------------------
  // POST-COMBAT REWARDS (LEVEL-UP CARD DRAFT vs NORMAL LOOT), REST, SHOP & D20 EVENTS
  // --------------------------------------------------------------------------
  openLootSummaryModal(summaryText) {
    const modal = document.getElementById('modal-reward');
    const titleEl = modal.querySelector('h2');
    const subHeaderEl = modal.querySelector('h3');
    const skipBtn = modal.querySelector('.reward-footer button');

    if (titleEl) titleEl.textContent = '⚔️ 전투 승리! 경험치(EXP) & 전리품 획득';
    document.getElementById('reward-summary-text').textContent = summaryText;
    if (subHeaderEl) {
      subHeaderEl.textContent = `💡 새로운 카드 보상은 모험가 레벨업 시(다음 레벨까지 ${Math.max(0, this.run.runNextExp - this.run.runExp)} EXP) 또는 보스 토벌 시 획득합니다!`;
    }

    const row = document.getElementById('reward-cards-row');
    row.innerHTML = '';

    if (skipBtn) {
      skipBtn.textContent = '미궁 지도로 계속 전진 ➔';
      skipBtn.onclick = () => {
        modal.classList.add('hidden');
        this.leaveNodeToMap();
      };
    }

    modal.classList.remove('hidden');
  },

  openRewardModal(summaryText, sourceType = 'levelup') {
    const modal = document.getElementById('modal-reward');
    const titleEl = modal.querySelector('h2');
    const subHeaderEl = modal.querySelector('h3');
    const skipBtn = modal.querySelector('.reward-footer button');

    this.run.pendingCardDrafts = Math.max(0, (this.run.pendingCardDrafts || 1) - 1);
    const remainingDrafts = this.run.pendingCardDrafts;

    if (titleEl) {
      if (sourceType === 'boss') {
        titleEl.textContent = `👑 계층 보스 토벌 성공! 고등급 전리품 카드 선택`;
      } else if (sourceType === 'midboss') {
        titleEl.textContent = `🩸 강적 토벌 성공! 특별 전리품 카드 선택`;
      } else if (sourceType === 'combat') {
        titleEl.textContent = `⚔️ 전투 승리! 전리품 카드 보상 선택${remainingDrafts > 0 ? ` (남은 선택: ${remainingDrafts + 1}회)` : ''}`;
      } else {
        titleEl.textContent = `🆙 모험가 레벨업(Lv.${this.run.runLv}) 달성! 레벨업 카드 보상 선택${remainingDrafts > 0 ? ` (남은 선택: ${remainingDrafts + 1}회)` : ''}`;
      }
    }

    document.getElementById('reward-summary-text').textContent = summaryText;
    if (subHeaderEl) {
      subHeaderEl.textContent =
        sourceType === 'boss'
          ? '보스 토벌 보너스! [고급 / 희귀 / 전설] 등급 카드 중 1장을 덱에 추가하세요:'
          : '레벨업 보상! 덱에 추가할 새로운 주문/무기술 카드를 1장 선택하세요 (전설 ~1.5%, 희귀 ~8%, 고급 ~25%, 일반 ~65%):';
    }

    const choices = this.rollWeightedCardChoices(3, sourceType);

    const proceedNextOrLeave = () => {
      if ((this.run.pendingCardDrafts || 0) > 0) {
        this.openRewardModal(summaryText, 'levelup');
      } else if (this.run.pendingBossRelicDraft) {
        this.openBossRelicDraftModal();
      } else {
        modal.classList.add('hidden');
        this.leaveNodeToMap();
      }
    };

    const row = document.getElementById('reward-cards-row');
    row.innerHTML = '';
    choices.forEach((cInst, idx) => {
      const cardEl = this.createCardElement(cInst, () => {
        this.run.deck.push(cInst);
        proceedNextOrLeave();
      });
      const badge = document.createElement('span');
      badge.className = 'hotkey-badge';
      badge.textContent = String(idx + 1);
      cardEl.appendChild(badge);
      row.appendChild(cardEl);
    });

    if (skipBtn) {
      skipBtn.textContent = '카드 선택 건너뛰기 (+25 GP 보너스) ➔';
      skipBtn.onclick = () => {
        this.run.gold += 25;
        proceedNextOrLeave();
      };
    }

    modal.classList.remove('hidden');
  },

  skipCardReward() {
    this.run.gold += 25;
    if (this.run && (this.run.pendingCardDrafts || 0) > 0) {
      this.openRewardModal(document.getElementById('reward-summary-text').textContent, 'levelup');
    } else if (this.run && this.run.pendingBossRelicDraft) {
      this.openBossRelicDraftModal();
    } else {
      document.getElementById('modal-reward').classList.add('hidden');
      this.leaveNodeToMap();
    }
  },

  // Slay the Spire 1 Boss Relic Chest: Pick 1 of 3 Boss Relics (+1 AP with major drawback, etc.)
  openBossRelicDraftModal() {
    this.run.pendingBossRelicDraft = false;
    const modal = document.getElementById('modal-reward');
    const titleEl = modal.querySelector('h2');
    const subHeaderEl = modal.querySelector('h3');
    const skipBtn = modal.querySelector('.reward-footer button');

    if (titleEl) titleEl.textContent = '👑 [슬더스 보스 성물함] 계층 보스 유물 3종 중 1개 선택';
    document.getElementById('reward-summary-text').textContent =
      '보스 유물은 매 턴 최대 행동력(AP) +1 등 막강한 권능을 부여하지만, 슬레이 더 스파이어 1과 동일한 영구 제약(페널티)을 동반합니다!';
    if (subHeaderEl) subHeaderEl.textContent = '원하는 보스 유물 1개를 선택하거나, 페널티가 싫다면 건너뛸 수 있습니다:';

    const unownedBossRelics = Object.values(GAME_DATA.relics).filter(r => r.isBossRelic && !this.run.relics.includes(r.id));
    this.shuffleArray(unownedBossRelics);
    const choices = unownedBossRelics.slice(0, 3);

    const row = document.getElementById('reward-cards-row');
    row.innerHTML = '';

    choices.forEach(r => {
      const box = document.createElement('div');
      box.className = 'game-card rarity-legendary';
      box.style.width = '210px';
      box.innerHTML = `
        <div>
          <div class="card-top-row">
            <span class="card-type-tag">👑 보스 유물</span>
            <span class="card-rarity-dot" style="color:#f6c967">BOSS</span>
          </div>
          <div class="card-title">${r.name}</div>
          <div class="card-art-banner">${r.icon}</div>
        </div>
        <div class="card-desc">${r.desc}</div>
      `;
      box.onclick = () => {
        this.run.relics.push(r.id);
        modal.classList.add('hidden');
        this.leaveNodeToMap();
      };
      row.appendChild(box);
    });

    if (skipBtn) {
      skipBtn.textContent = '보스 유물 건너뛰기 ➔';
      skipBtn.onclick = () => {
        modal.classList.add('hidden');
        this.leaveNodeToMap();
      };
    }
    modal.classList.remove('hidden');
  },

  finishNodeWithPendingDrafts(sourceLabel = '레벨업 달성!') {
    if (this.run && (this.run.pendingCardDrafts || 0) > 0) {
      this.openRewardModal(`🆙 ${sourceLabel} (Lv.${this.run.runLv}) — 새로운 카드를 1장 선택하세요!`, 'levelup');
    } else {
      this.leaveNodeToMap();
    }
  },

  doRestHeal() {
    if (this.run && this.run.relics.includes('coffee_dripper')) {
      this.showToast('☕ [드워프 커피 드리퍼] 페널티로 휴식 불가! 카드 단련(+) 또는 지나가기를 선택하세요.', 'warn');
      return;
    }
    const heal = Math.round(this.run.maxHp * 0.3);
    const actualHeal = Math.min(this.run.maxHp - this.run.hp, heal);
    this.run.hp = Math.min(this.run.maxHp, this.run.hp + heal);
    if (actualHeal > 0) {
      this.recordAchStat('totalHealed', actualHeal, 'add');
      this.checkAchievements();
    }
    this.showToast(`❤️‍🩹 긴 휴식 완료! 체력을 +${heal} 회복했습니다.`, 'success');
    this.leaveNodeToMap();
  },

  skipRest() {
    this.showToast('🔥 모닥불을 뒤로하고 다음 스테이지로 전진합니다.', 'info');
    this.leaveNodeToMap();
  },

  openUpgradeModal(isMutation = false) {
    if (this.run && this.run.relics.includes('fusion_hammer')) {
      this.showToast('🔨 [융합 해머] 페널티로 모닥불 강화 불가! 긴 휴식 또는 지나가기를 선택하세요.', 'warn');
      return;
    }
    this.deckModalMode = isMutation ? 'mutate' : 'upgrade';
    this.openDeckModal(this.deckModalMode);
  },

  // Compute human-readable Upgrade Preview ("피해 6→9 · 코스트 2→1") for Before->After UI!
  getUpgradePreviewText(cardInst) {
    const tpl = GAME_DATA.cards[cardInst.id];
    if (!tpl || cardInst.upgraded) return '이미 강화(+) 완료';
    const diffs = [];
    if (tpl.upgradeCost !== undefined && tpl.upgradeCost !== tpl.cost) diffs.push(`⚡코스트 ${tpl.cost}→${tpl.upgradeCost}`);
    if (tpl.upgradeDamage !== undefined && tpl.upgradeDamage !== tpl.damage) diffs.push(`⚔️피해 ${tpl.damage}→${tpl.upgradeDamage}`);
    if (tpl.upgradeBlock !== undefined && tpl.upgradeBlock !== tpl.block) diffs.push(`🛡️방어 ${tpl.block}→${tpl.upgradeBlock}`);
    if (tpl.upgradePoison !== undefined && tpl.upgradePoison !== tpl.poison) diffs.push(`🧪중독/화상 ${tpl.poison}→${tpl.upgradePoison}`);
    if (tpl.upgradeVuln !== undefined && tpl.upgradeVuln !== tpl.vuln) diffs.push(`💔취약 ${tpl.vuln}→${tpl.upgradeVuln}`);
    if (tpl.upgradeWeak !== undefined && tpl.upgradeWeak !== tpl.weak) diffs.push(`💫약화 ${tpl.weak}→${tpl.upgradeWeak}`);
    if (tpl.upgradeStrength !== undefined && tpl.upgradeStrength !== tpl.strength) diffs.push(`💪힘 ${tpl.strength}→${tpl.upgradeStrength}`);
    if (tpl.upgradeDexterity !== undefined && tpl.upgradeDexterity !== tpl.dexterity) diffs.push(`🦶민첩 ${tpl.dexterity}→${tpl.upgradeDexterity}`);
    if (tpl.upgradeDraw !== undefined && tpl.upgradeDraw !== tpl.draw) diffs.push(`🃏드로우 ${tpl.draw}→${tpl.upgradeDraw}`);
    if (tpl.upgradeSummonHeal !== undefined && tpl.upgradeSummonHeal !== tpl.summonHeal) diffs.push(`🐾소환체력 ${tpl.summonHeal}→${tpl.upgradeSummonHeal}`);
    if (tpl.upgradeSummonAtkBoost !== undefined && tpl.upgradeSummonAtkBoost !== tpl.summonAtkBoost) diffs.push(`🐾소환공격 ${tpl.summonAtkBoost}→${tpl.upgradeSummonAtkBoost}`);
    if (tpl.doom) diffs.push(`💀파멸 +${tpl.doom}→+${tpl.doom + 2}`);
    if (tpl.doomAll) diffs.push(`💀전체파멸 +${tpl.doomAll}→+${tpl.doomAll + 3}`);
    return diffs.length > 0 ? diffs.join(' · ') : '✨ 강화(+) 적용';
  },

  getShopRemoveCost() {
    if (!this.run) return 75;
    return 75 + (this.run.shopRemoveCount || 0) * 35; // Escalates 75 -> 110 -> 145 -> 180 GP
  },

  getShopMutateCost() {
    if (!this.run) return 70;
    return 70 + (this.run.shopMutateCount || 0) * 30; // Escalates 70 -> 100 -> 130 -> 160 GP
  },

  openRemoveCardModal() {
    if (!this.run) return;
    if (this.run.currentShopState && this.run.currentShopState.removedUsed) {
      this.showToast('이 상점에서는 이미 카드 제거 서비스를 이용했습니다! (1회 한정)', 'warn');
      return;
    }
    const cost = this.getShopRemoveCost();
    if (this.run.gold < cost) {
      this.showToast(`금화(GP) 부족! 필요: ${cost} GP (보유: ${this.run.gold} GP)`, 'warn');
      return;
    }
    this.pendingShopCost = cost;
    this.openDeckModal('remove');
  },

  shopMutateService() {
    if (!this.run) return;
    if (this.run.currentShopState && this.run.currentShopState.mutatedUsed) {
      this.showToast('이 상점에서는 이미 카드 강화 + 룬 각인 서비스를 이용했습니다! (1회 한정)', 'warn');
      return;
    }
    const cost = this.getShopMutateCost();
    if (this.run.gold < cost) {
      this.showToast(`금화(GP) 부족! 필요: ${cost} GP (보유: ${this.run.gold} GP)`, 'warn');
      return;
    }
    this.pendingShopCost = cost;
    this.openDeckModal('shop_mutate');
  },

  updateShopServiceButtons() {
    if (!this.run) return;
    const remBtn = document.getElementById('btn-shop-remove');
    const mutBtn = document.getElementById('btn-shop-mutate');
    const st = this.run.currentShopState;

    if (remBtn) {
      if (st && st.removedUsed) {
        remBtn.disabled = true;
        remBtn.textContent = '✔ 카드 제거 완료 (이번 상점 1/1회 소진)';
      } else {
        remBtn.disabled = false;
        const cost = this.getShopRemoveCost();
        remBtn.textContent = `🗑️ 카드 제거 [이번 상점 1회 한정] (${cost} GP)`;
      }
    }
    if (mutBtn) {
      if (st && st.mutatedUsed) {
        mutBtn.disabled = true;
        mutBtn.textContent = '✔ 룬 각인 완료 (이번 상점 1/1회 소진)';
      } else {
        mutBtn.disabled = false;
        const cost = this.getShopMutateCost();
        mutBtn.textContent = `🔮 카드 강화(+) + 룬 각인 [이번 상점 1회 한정] (${cost} GP)`;
      }
    }
  },

  openDeckModal(mode = 'all') {
    if (!this.run) return;
    this.closeAllNavModals();
    this.deckModalMode = mode;
    const modal = document.getElementById('modal-deck');
    const titleEl = document.getElementById('deck-modal-title');
    const subEl = document.getElementById('deck-modal-subtitle');
    const grid = document.getElementById('deck-modal-grid');
    grid.innerHTML = '';

    let cardsToShow = this.run.deck;
    if (mode === 'draw' && this.combat) cardsToShow = this.combat.drawPile;
    if (mode === 'discard' && this.combat) cardsToShow = this.combat.discardPile;

    if (mode === 'upgrade') {
      titleEl.textContent = '⚒️ 단련(+)할 카드를 선택하세요';
      subEl.textContent = '선택한 주문/무기술 카드의 위력이 영구적으로 상승합니다.';
    } else if (mode === 'mutate' || mode === 'shop_mutate') {
      titleEl.textContent = '🔮 고대 비전 룬을 각인할 카드를 선택하세요 (상점당 1회 한정)';
      subEl.textContent = '선택한 카드에 [산성/가속/방호/흡혈] 룬 속성과 강화(+)가 동시에 부여됩니다!';
    } else if (mode === 'remove') {
      titleEl.textContent = '🗑️ 덱에서 영구 제거할 카드를 선택하세요 (상점당 1회 한정)';
      subEl.textContent = '이용할 때마다 다음 상점의 카드 제거 비용이 +35 GP씩 영구 상승합니다.';
    } else {
      titleEl.textContent = `🎴 카드 목록 (${cardsToShow.length}장)`;
      subEl.textContent = '현재 보유 중인 카드와 강화/룬 각인 상태를 확인합니다.';
    }

    cardsToShow.forEach((cInst, idx) => {
      const cardEl = this.createCardElement(cInst, () => {
        if (mode === 'upgrade') {
          cInst.upgraded = true;
          this.recordAchStat('cardsUpgraded', 1, 'add');
          this.checkAchievements();
          modal.classList.add('hidden');
          this.showToast(`⚒️ [${GAME_DATA.cards[cInst.id].name}+] 강화 완료!`, 'success');
          this.leaveNodeToMap();
        } else if (mode === 'mutate') {
          const muts = GAME_DATA.mutations;
          const pickedMut = muts[Math.floor(Math.random() * muts.length)];
          cInst.mutation = pickedMut.id;
          cInst.upgraded = true;
          this.recordAchStat('cardsUpgraded', 1, 'add');
          this.checkAchievements();
          modal.classList.add('hidden');
          this.showToast(`🔮 [${GAME_DATA.cards[cInst.id].name}+]에 [${pickedMut.name}] 각인!`, 'success');
          this.leaveNodeToMap();
        } else if (mode === 'shop_mutate') {
          if (this.run.currentShopState && this.run.currentShopState.mutatedUsed) return;
          this.run.gold -= this.pendingShopCost;
          this.run.shopMutateCount = (this.run.shopMutateCount || 0) + 1;
          if (this.run.currentShopState) this.run.currentShopState.mutatedUsed = true;
          const muts = GAME_DATA.mutations;
          const pickedMut = muts[Math.floor(Math.random() * muts.length)];
          cInst.mutation = pickedMut.id;
          cInst.upgraded = true;
          this.recordAchStat('cardsUpgraded', 1, 'add');
          this.checkAchievements();
          modal.classList.add('hidden');
          this.updateShopServiceButtons();
          this.updateTopHud();
          this.saveRun();
          this.showToast(`🔮 [${GAME_DATA.cards[cInst.id].name}+] 룬 각인 완료!`, 'success');
        } else if (mode === 'remove') {
          if (this.run.currentShopState && this.run.currentShopState.removedUsed) return;
          if (this.run.deck.length <= 5) {
            this.showToast('덱에는 최소 5장의 카드가 남아있어야 합니다!', 'warn');
            return;
          }
          if (this.pendingShopCost > 0) this.run.gold -= this.pendingShopCost;
          this.run.shopRemoveCount = (this.run.shopRemoveCount || 0) + 1;
          if (this.run.currentShopState) this.run.currentShopState.removedUsed = true;
          const removedName = GAME_DATA.cards[cInst.id].name;
          this.run.deck.splice(idx, 1);
          modal.classList.add('hidden');
          this.updateShopServiceButtons();
          this.updateTopHud();
          this.saveRun();
          this.showToast(`🗑️ [${removedName}] 카드를 덱에서 영구 제거했습니다.`, 'info');
        }
      });
      // Show Before -> After Upgrade Preview badge on upgrade/mutate modals!
      if ((mode === 'upgrade' || mode === 'mutate' || mode === 'shop_mutate') && !cInst.upgraded) {
        const prev = document.createElement('div');
        prev.className = 'upgrade-preview-pill';
        prev.textContent = `⬆️ ${this.getUpgradePreviewText(cInst)}`;
        cardEl.appendChild(prev);
      }
      grid.appendChild(cardEl);
    });

    modal.classList.remove('hidden');
  },

  closeDeckModal() {
    document.getElementById('modal-deck').classList.add('hidden');
  },

  openShopScreen() {
    this.switchScreen('screen-shop');

    // Lock shop inventory per floor/stage so players cannot refresh or infinitely buy items!
    const shopKey = `act_${this.run.act}_stage_${this.run.stage}`;
    if (!this.run.currentShopState || this.run.currentShopState.shopKey !== shopKey) {
      const rolledCards = this.rollWeightedCardChoices(4, 'shop').map(cInst => {
        const tpl = GAME_DATA.cards[cInst.id];
        const price = tpl.rarity === 'legendary' ? 175 : tpl.rarity === 'rare' ? 115 : tpl.rarity === 'uncommon' ? 72 : 48;
        return { cInst, price, sold: false };
      });

      const unownedRelics = Object.values(GAME_DATA.relics).filter(r => r.price && !this.run.relics.includes(r.id));
      this.shuffleArray(unownedRelics);
      const rolledRelics = unownedRelics.slice(0, 2).map(r => ({ relic: r, sold: false }));

      const allPotions = [...Object.values(GAME_DATA.potions)];
      this.shuffleArray(allPotions);
      const rolledPotions = allPotions.slice(0, 2).map(p => ({ potion: p, sold: false }));

      this.run.currentShopState = {
        shopKey,
        cards: rolledCards,
        relics: rolledRelics,
        potions: rolledPotions,
        removedUsed: false,
        mutatedUsed: false
      };
    }

    const st = this.run.currentShopState;

    const cardsRow = document.getElementById('shop-cards-row');
    cardsRow.innerHTML = '';

    st.cards.forEach(entry => {
      const { cInst, price } = entry;
      const wrap = document.createElement('div');
      wrap.className = 'shop-item-wrap';
      const cardEl = this.createCardElement(cInst, null);

      const btn = document.createElement('button');
      btn.className = 'shop-buy-btn';
      btn.disabled = entry.sold;
      btn.textContent = entry.sold ? '✔ 품절 (재고 소진)' : `🪙 ${price} GP 구매 (1개 한정)`;
      btn.onclick = () => {
        if (entry.sold) return;
        if (this.run.gold < price) {
          this.showToast(`금화(GP)가 부족합니다! (필요: ${price} GP)`, 'warn');
          return;
        }
        this.run.gold -= price;
        entry.sold = true;
        this.run.deck.push(cInst);
        btn.disabled = true;
        btn.textContent = '✔ 품절 (재고 소진)';
        this.updateTopHud();
        this.saveRun();
        this.showToast(`🎴 [${GAME_DATA.cards[cInst.id].name}] 구매 완료!`, 'success');
      };

      wrap.appendChild(cardEl);
      wrap.appendChild(btn);
      cardsRow.appendChild(wrap);
    });

    const itemsRow = document.getElementById('shop-items-row');
    itemsRow.innerHTML = '';

    st.relics.forEach(entry => {
      const r = entry.relic;
      const isAlreadyOwned = this.run.relics.includes(r.id);
      const isSold = entry.sold || isAlreadyOwned;
      const box = document.createElement('div');
      box.className = 'mech-box';
      box.style.width = '220px';
      box.innerHTML = `
        <h4>${r.icon} ${r.name}</h4>
        <p style="margin-bottom:8px;">${r.desc}</p>
        <button class="shop-buy-btn" ${isSold ? 'disabled' : ''}>${isSold ? '✔ 품절 (장착됨)' : `🪙 ${r.price} GP 구매 (1개 한정)`}</button>
      `;
      itemsRow.appendChild(box);
      box.querySelector('button').onclick = e => {
        if (entry.sold || this.run.relics.includes(r.id)) return;
        if (this.run.gold < r.price) {
          this.showToast(`금화(GP)가 부족합니다! (필요: ${r.price} GP)`, 'warn');
          return;
        }
        this.run.gold -= r.price;
        entry.sold = true;
        this.run.relics.push(r.id);
        if (r.id === 'scavenger_goggles') {
          this.run.maxHp += 10;
          this.run.hp += 10;
        }
        e.target.disabled = true;
        e.target.textContent = '✔ 품절 (장착됨)';
        this.updateTopHud();
        this.saveRun();
        this.showToast(`🏆 [${r.name}] 유물 장착!`, 'success');
      };
    });

    st.potions.forEach(entry => {
      const p = entry.potion;
      const maxPots = this.run.maxPotions || 3;
      const box = document.createElement('div');
      box.className = 'mech-box';
      box.style.width = '200px';
      box.innerHTML = `
        <h4>${p.icon} ${p.name}</h4>
        <p style="margin-bottom:8px;">${p.desc} <br/><span style="font-size:0.72rem; color:#fdcb6e;">(벨트 한도: 최대 ${maxPots}개)</span></p>
        <button class="shop-buy-btn" ${entry.sold ? 'disabled' : ''}>${entry.sold ? '✔ 품절 (재고 소진)' : `🪙 ${p.price} GP 구매 (1개 한정)`}</button>
      `;
      itemsRow.appendChild(box);
      box.querySelector('button').onclick = e => {
        if (entry.sold) return;
        if (this.run.relics.includes('sozu_brew')) {
          this.showToast('🍶 [봉인의 호리병(Sozu)] 페널티로 물약을 획득할 수 없습니다!', 'warn');
          return;
        }
        if (this.run.potions.length >= maxPots) {
          this.showToast(`물약 벨트가 가득 찼습니다! (최대 ${maxPots}개)`, 'warn');
          return;
        }
        if (this.run.gold < p.price) {
          this.showToast(`금화(GP)가 부족합니다! (필요: ${p.price} GP)`, 'warn');
          return;
        }
        this.run.gold -= p.price;
        entry.sold = true;
        this.run.potions.push(p.id);
        e.target.disabled = true;
        e.target.textContent = '✔ 품절 (재고 소진)';
        this.updateTopHud();
        this.saveRun();
        this.showToast(`🧪 [${p.name}] 구매 완료!`, 'success');
      };
    });

    this.updateShopServiceButtons();
  },

  openEventScreen() {
    this.switchScreen('screen-event');
    if (!this.run.seenEvents) this.run.seenEvents = [];
    let candidates = GAME_DATA.events.filter(e => !this.run.seenEvents.includes(e.id));
    if (candidates.length === 0) {
      this.run.seenEvents = [];
      candidates = GAME_DATA.events;
    }
    // Slight preference for events that have a special choice for the player's current class!
    const classEvents = candidates.filter(e => e.choices.some(ch => ch.requiredClass === this.run.charId));
    const pool = classEvents.length > 0 && Math.random() < 0.45 ? classEvents : candidates;
    const ev = pool[Math.floor(Math.random() * pool.length)];
    this.run.seenEvents.push(ev.id);

    document.getElementById('event-title').textContent = ev.title;
    document.getElementById('event-desc').textContent = ev.desc;
    const evNpcBox = document.getElementById('event-npc-portrait');
    const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
    if (evNpcBox) {
      const npc = ev.npcId && se && se.NPCS[ev.npcId];
      if (npc) {
        evNpcBox.classList.remove('hidden');
        evNpcBox.innerHTML = `
          <div class="event-npc-sprite">${npc.svg}</div>
          <div>
            <strong style="color:${npc.accent};">${npc.icon} ${npc.name}</strong>
            <div style="font-size:0.74rem; color:#95a5a6;">${npc.title}</div>
          </div>
        `;
      } else {
        evNpcBox.classList.add('hidden');
        evNpcBox.innerHTML = '';
      }
    }

    const choicesBox = document.getElementById('event-choices');
    choicesBox.innerHTML = '';

    // Filter choices: show general choices + choices matching player's class!
    const visibleChoices = ev.choices.filter(ch => {
      const req = ch.requiredClass || ch.requireClass;
      return !req || req === this.run.charId;
    });
    visibleChoices.forEach((ch, idx) => {
      const req = ch.requiredClass || ch.requireClass;
      const btn = document.createElement('button');
      btn.className = `event-choice-btn ${req ? 'class-exclusive-choice' : ''}`;
      btn.innerHTML = `<span class="kbd-hint">${idx + 1}</span> ${ch.label}`;
      btn.onclick = () => {
        if (ch.type === 'roll' && ch.dc) {
          const roll = Math.floor(Math.random() * 20) + 1;
          const ok = roll >= ch.dc;
          const chosenEff = ok ? ch.successEffect : ch.failEffect;
          this.showD20Modal(
            roll,
            ch.dc,
            `🎲 D20 운명 판정 (DC ${ch.dc})`,
            ok ? `판정 성공! (주사위 ${roll} ≥ DC ${ch.dc}) 유리한 결과를 획득합니다.` : `판정 실패! (주사위 ${roll} < DC ${ch.dc}) 불리한 결과가 적용됩니다.`,
            ok,
            () => this.resolveEventChoice(chosenEff)
          );
        } else {
          this.resolveEventChoice(ch.effect);
        }
      };
      choicesBox.appendChild(btn);
    });
  },

  addGoldSafe(amount) {
    if (!this.run || amount <= 0) return 0;
    if (this.run.relics.includes('ectoplasm_slime')) {
      this.showToast('🧪 [엑토플라즘] 보스 유물 페널티로 금화를 얻을 수 없습니다!', 'warn');
      return 0;
    }
    this.run.gold += amount;
    return amount;
  },

  addRandomPotionSafe(count = 1) {
    if (!this.run) return 0;
    if (this.run.relics.includes('sozu_brew')) {
      this.showToast('🍶 [봉인의 호리병(Sozu)] 보스 유물 페널티로 물약을 얻을 수 없습니다!', 'warn');
      return 0;
    }
    let added = 0;
    const maxPots = this.run.maxPotions || 3;
    const pKeys = Object.keys(GAME_DATA.potions);
    for (let i = 0; i < count; i++) {
      if (this.run.potions.length < maxPots) {
        this.run.potions.push(pKeys[Math.floor(Math.random() * pKeys.length)]);
        added++;
      }
    }
    return added;
  },

  upgradeRandomCards(count = 1, withMutate = false) {
    if (!this.run) return 0;
    const unupg = this.run.deck.filter(c => !c.upgraded && !c.id.startsWith('curse_') && !c.id.startsWith('status_'));
    this.shuffleArray(unupg);
    const targets = unupg.length > 0 ? unupg.slice(0, count) : this.run.deck.slice(0, count);
    const muts = GAME_DATA.mutations;
    targets.forEach(c => {
      c.upgraded = true;
      if (withMutate && muts && muts.length > 0) {
        c.mutation = muts[Math.floor(Math.random() * muts.length)].id;
      }
    });
    return targets.length;
  },

  resolveEventChoice(effect) {
    const finish = () => this.finishNodeWithPendingDrafts('이벤트 경험치 레벨업!');
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;

    // --- D20 FATE ROLL EVENTS (Using In-Game D20 Modal instead of alert!) ---
    if (effect === 'd20_arcana') {
      const roll = rollD20();
      if (roll >= 12) {
        this.upgradeRandomCards(1, true);
        this.showD20Modal(roll, 12, '🎲 D20 비전 해독 판정', '비전 마법진을 완벽히 해독해 카드 1장에 강화(+) 및 비전 룬 각인을 부여했습니다!', true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 12);
        this.run.deck.push(this.createCardInstance('curse_pain'));
        this.showD20Modal(roll, 12, '🎲 D20 비전 해독 판정', '비전 역류! 체력을 12 잃고 덱에 [☠️ 심연의 저주] 1장이 새겨졌습니다.', false, finish);
      }
      return;
    } else if (effect === 'd20_gold_heist') {
      const roll = rollD20();
      if (roll >= 11) {
        const g = this.addGoldSafe(85);
        this.showD20Modal(roll, 11, '🎲 D20 손재주 판정', `함정을 피해 밀수 금화를 챙겼습니다! (+${g} GP)`, true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 10);
        this.showD20Modal(roll, 11, '🎲 D20 손재주 판정', '독침 함정이 발동해 체력을 10 잃었습니다!', false, finish);
      }
      return;
    } else if (effect === 'd20_str_relic') {
      const roll = rollD20();
      if (roll >= 13) {
        const rel = this.grantRandomRelic();
        this.showD20Modal(roll, 13, '🎲 D20 근력 판정', `강철 봉인문을 억지로 밀어 열었습니다! 유물 [${rel ? rel.name : '보너스'}] 획득!`, true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 12);
        this.showD20Modal(roll, 13, '🎲 D20 근력 판정', '봉인문이 튕겨 나가며 반동으로 체력을 12 잃었습니다!', false, finish);
      }
      return;
    } else if (effect === 'd20_int_sp') {
      const roll = rollD20();
      if (roll >= 12) {
        this.run.sp += 1;
        this.gainRunExp(70);
        this.showD20Modal(roll, 12, '🎲 D20 지능 판정', '고대 현자의 기억을 흡수해 능력치 포인트(SP) +1 및 EXP +70을 획득했습니다!', true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 12);
        this.showD20Modal(roll, 12, '🎲 D20 지능 판정', '정신 충격으로 체력을 12 잃었습니다!', false, finish);
      }
      return;
    } else if (effect === 'd20_dragon_gold') {
      const roll = rollD20();
      if (roll >= 13) {
        const g = this.addGoldSafe(140);
        this.showD20Modal(roll, 13, '🎲 D20 은신 판정', `고룡의 잔영을 피해 금화를 훔쳤습니다! (+${g} GP)`, true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 16);
        this.showD20Modal(roll, 13, '🎲 D20 은신 판정', '고룡의 화염 숨결 잔영이 폭발해 체력을 16 잃었습니다!', false, finish);
      }
      return;
    } else if (effect === 'd20_deck_of_many') {
      const roll = rollD20();
      if (roll >= 15) {
        const rel = this.grantRandomRelic();
        this.run.sp += 1;
        this.showD20Modal(roll, 15, '🃏 운명의 덱 (Deck of Many Things)', `별의 카드 뽑기! 유물 [${rel ? rel.name : '축복'}] & 능력치 포인트(SP) +1 획득!`, true, finish);
      } else if (roll >= 8) {
        const g = this.addGoldSafe(90);
        this.showD20Modal(roll, 8, '🃏 운명의 덱 (Deck of Many Things)', `보석의 카드! 금화 +${g} GP를 획득했습니다!`, true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 12);
        this.run.deck.push(this.createCardInstance('curse_pain'));
        this.showD20Modal(roll, 8, '🃏 운명의 덱 (Deck of Many Things)', '해골의 카드! 체력 -12 및 [☠️ 심연의 저주] 1장 추가!', false, finish);
      }
      return;
    } else if (effect === 'd20_astral_supply') {
      const roll = rollD20();
      if (roll >= 11) {
        const g = this.addGoldSafe(70);
        const p = this.addRandomPotionSafe(1);
        this.showD20Modal(roll, 11, '🎲 D20 생존 판정', `은검 부대 보급품 회수 성공! (+${g} GP${p ? ' & 물약 +1' : ''})`, true, finish);
      } else {
        this.run.hp = Math.max(1, this.run.hp - 10);
        this.showD20Modal(roll, 11, '🎲 D20 생존 판정', '차원 함정이 터져 체력을 10 잃었습니다!', false, finish);
      }
      return;
    }

    // --- CLASS-EXCLUSIVE CHOICES (All 8 Classes!) ---
    if (effect === 'class_free_mutate') {
      this.upgradeRandomCards(1, true);
      this.showToast('🧙 [위자드 전용] 비전 해독 완료! 카드 1장 강화(+) & 룬 각인!', 'success');
    } else if (effect === 'class_rogue_heist') {
      const g = this.addGoldSafe(110);
      const rel = this.grantRandomRelic();
      this.showToast(`🗡️ [로그 전용] 완벽한 절도! +${g} GP & 유물 [${rel ? rel.name : ''}] 획득!`, 'success');
    } else if (effect === 'class_cleric_purify') {
      this.run.deck = this.run.deck.filter(c => !c.id.startsWith('curse_'));
      const heal = Math.round(this.run.maxHp * 0.35);
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + heal);
      const g = this.addGoldSafe(40);
      this.showToast(`☀️ [클레릭 전용] 저주 정화 완료! HP +${heal} & +${g} GP!`, 'success');
    } else if (effect === 'class_paladin_oath') {
      this.run.maxHp += 10;
      this.run.hp += 10;
      this.upgradeRandomCards(1, false);
      this.showToast('⚜️ [성기사 전용] 서약 갱신! 최대 체력 +10 & 카드 1장 강화(+)!', 'success');
    } else if (effect === 'class_fighter_forge') {
      this.upgradeRandomCards(2, false);
      this.showToast('⚔️ [파이터 전용] 무기 달인의 단련! 카드 2장 무료 강화(+)!', 'success');
    } else if (effect === 'class_warlock_pact') {
      const rel = this.grantRandomRelic();
      this.gainRunExp(80);
      this.showToast(`🟣 [워락 전용] 동등한 심연 계약! 유물 [${rel ? rel.name : ''}] & EXP +80!`, 'success');
    } else if (effect === 'class_barbarian_smash') {
      const rel = this.grantRandomRelic();
      const g = this.addGoldSafe(60);
      this.showToast(`🪓 [바바리안 전용] 강철문 박살! 유물 [${rel ? rel.name : ''}] & +${g} GP!`, 'success');
    } else if (effect === 'class_ranger_fey') {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 20);
      this.addRandomPotionSafe(1);
      const choices = this.rollWeightedCardChoices(1, 'midboss');
      if (choices.length > 0) this.run.deck.push(choices[0]);
      this.showToast('🏹 [레인저 전용] 요정의 축복! HP +20, 물약 및 고급 카드 획득!', 'success');
    }
    // --- STANDARD EVENT CHOICES ---
    else if (effect === 'blood_sacrifice_maxhp') {
      this.run.hp = Math.max(1, this.run.hp - 12);
      this.run.maxHp += 8;
      this.upgradeRandomCards(1, false);
      this.showToast('🩸 피의 서약 완료! 최대 HP +8 & 카드 1장 강화(+)', 'success');
    } else if (effect === 'scrap_and_relic') {
      const g = this.addGoldSafe(95);
      this.run.hp = Math.max(1, this.run.hp - 15);
      this.run.deck.push(this.createCardInstance('curse_pain'));
      const rel = this.grantRandomRelic();
      this.showToast(`💰 밀수 창고 약탈! +${g} GP & [${rel ? rel.name : '유물'}] (HP -15, 저주 추가)`, 'warn');
    } else if (effect === 'gain_exp_sp_gems') {
      this.run.maxHp = Math.max(20, this.run.maxHp - 8);
      this.run.hp = Math.min(this.run.hp, this.run.maxHp);
      this.gainRunExp(95);
      this.meta.gems += 120;
      this.saveMeta();
      this.showToast('📖 금단의 지식 습득! EXP +95 & 💎마석 +120 (최대 HP -8)', 'info');
    } else if (effect === 'remove_and_rare') {
      this.run.hp = Math.max(1, this.run.hp - 12);
      const basicIdx = this.run.deck.findIndex(c => {
        const r = GAME_DATA.cards[c.id].rarity;
        return r === 'basic' || r === 'common';
      });
      if (basicIdx >= 0 && this.run.deck.length > 5) this.run.deck.splice(basicIdx, 1);
      const rareChoices = this.rollWeightedCardChoices(1, 'boss');
      if (rareChoices.length > 0) this.run.deck.push(rareChoices[0]);
      this.showToast('🎴 요정 교환 완료! 일반 카드 1장 제거 및 고등급 카드 획득!', 'success');
    } else if (effect === 'cursed_relic') {
      this.run.deck.push(this.createCardInstance('curse_pain'));
      const rel = this.grantRandomRelic();
      this.showToast(`☠️ 저주받은 거래! [${rel ? rel.name : '유물'}] 획득 & 심연의 저주 추가`, 'warn');
    } else if (effect === 'potion_and_exp') {
      this.run.hp = Math.max(1, this.run.hp - 10);
      this.gainRunExp(60);
      this.addRandomPotionSafe(1);
      this.showToast('🧪 요정 이슬 채취 완료! EXP +60 & 물약 획득 (HP -10)', 'info');
    } else if (effect === 'event_paid_remove') {
      if (this.run.gold < 50) {
        this.showToast('금화(50 GP)가 부족하여 봉헌하지 못했습니다.', 'warn');
      } else if (this.run.deck.length > 5) {
        this.run.gold -= 50;
        const basicIdx = this.run.deck.findIndex(c => c.id === 'curse_pain' || GAME_DATA.cards[c.id].rarity === 'common');
        if (basicIdx >= 0) this.run.deck.splice(basicIdx, 1);
        this.showToast('✨ 50 GP 봉헌 완료! 카드 1장을 영구 정화했습니다.', 'success');
      }
    } else if (effect === 'heal_medium') {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 12);
      this.showToast('✨ 성소의 축복으로 체력을 +12 회복했습니다.', 'success');
    } else if (effect === 'paid_double_upgrade') {
      if (this.run.gold < 60) {
        this.showToast('금화(60 GP)가 부족합니다!', 'warn');
      } else {
        this.run.gold -= 60;
        this.upgradeRandomCards(2, false);
        this.showToast('⚒️ 드워프 단련 완료! 카드 2장 강화(+)!', 'success');
      }
    } else if (effect === 'blood_mutate') {
      this.run.hp = Math.max(1, this.run.hp - 10);
      this.upgradeRandomCards(1, true);
      this.showToast('🔮 생명력 각인! 카드 1장 강화(+) & 비전 룬 각인 (HP -10)', 'success');
    } else if (effect === 'gain_small_exp') {
      this.gainRunExp(55);
      this.showToast('⭐ 미궁 탐색 정보 획득! EXP +55', 'info');
    } else if (effect === 'gain_gold_small') {
      const g = this.addGoldSafe(45);
      this.showToast(`🪙 틈새 금화 획득! (+${g} GP)`, 'success');
    } else if (effect === 'gain_gold_gems') {
      const g = this.addGoldSafe(75);
      this.meta.gems += 80;
      this.saveMeta();
      this.showToast(`🔥 저장소 파괴! +${g} GP & 💎마석 +80`, 'success');
    } else if (effect === 'paid_relic_help') {
      if (this.run.gold < 40) {
        this.showToast('금화(40 GP)가 부족하여 지원하지 못했습니다.', 'warn');
      } else {
        this.run.gold -= 40;
        const rel = this.grantRandomRelic();
        this.showToast(`🏆 정찰병의 보답! 유물 [${rel ? rel.name : ''}] 획득!`, 'success');
      }
    } else if (effect === 'hp_for_upgrade_gold') {
      this.run.hp = Math.max(1, this.run.hp - 10);
      this.upgradeRandomCards(1, false);
      const g = this.addGoldSafe(55);
      this.showToast(`❤️‍🩹 응급 처치 보답! 카드 1장 강화(+) & +${g} GP`, 'success');
    } else if (effect === 'double_potion_risk') {
      this.run.hp = Math.max(1, this.run.hp - 10);
      const cnt = this.addRandomPotionSafe(2);
      this.showToast(`🧪 실험실 강탈! 물약 ${cnt}개 획득 (HP -10)`, 'warn');
    } else if (effect === 'free_cleanse_card') {
      if (this.run.deck.length > 5) {
        const idx = this.run.deck.findIndex(c => c.id.startsWith('curse_') || GAME_DATA.cards[c.id].rarity === 'common');
        if (idx >= 0) this.run.deck.splice(idx, 1);
      }
      this.gainRunExp(45);
      this.showToast('🔥 불필요한 카드 1장 제거 & EXP +45!', 'success');
    } else if (effect === 'gain_maxhp_small') {
      this.run.maxHp += 6;
      this.run.hp += 6;
      this.showToast('🛡️ 용린 조각 흡수! 최대 체력 +6 & HP +6', 'success');
    } else if (effect === 'spar_for_sp') {
      this.run.hp = Math.max(1, this.run.hp - 10);
      this.run.sp += 1;
      this.upgradeRandomCards(1, false);
      this.showToast('⚔️ 무투장 대련 완료! SP +1 & 카드 1장 강화(+) (HP -10)', 'success');
    } else if (effect === 'paid_heal_30') {
      if (this.run.gold < 50) {
        this.showToast('금화(50 GP)가 부족합니다!', 'warn');
      } else {
        this.run.gold -= 50;
        const heal = Math.round(this.run.maxHp * 0.3);
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + heal);
        this.showToast(`❤️ 생명수 섭취! 체력 +${heal} 회복`, 'success');
      }
    } else if (effect === 'blood_for_gold') {
      this.run.hp = Math.max(1, this.run.hp - 10);
      const g = this.addGoldSafe(80);
      this.showToast(`🪙 황금 액체 채취! +${g} GP (HP -10)`, 'info');
    } else if (effect === 'hp_for_rare_draft') {
      this.run.hp = Math.max(1, this.run.hp - 8);
      this.run.pendingCardDrafts = (this.run.pendingCardDrafts || 0) + 1;
      this.openRewardModal('📚 고등급 비전 보상! 카드를 1장 선택하세요.', 'midboss');
      return;
    } else if (effect === 'free_rare_draft') {
      this.run.pendingCardDrafts = (this.run.pendingCardDrafts || 0) + 1;
      this.openRewardModal('🔮 D20 통찰 성공 보상! 고등급 카드를 1장 선택하세요.', 'midboss');
      return;
    } else if (effect === 'gain_gems_exp') {
      this.meta.gems += 90;
      this.saveMeta();
      this.gainRunExp(40);
      this.showToast('💎 등반 마석 +90 & EXP +40 획득!', 'success');
    } else if (effect === 'free_upgrade_one') {
      this.upgradeRandomCards(1, false);
      this.showToast('⚒️ 은검 숫돌 연마 완료! 카드 1장 무료 강화(+)', 'success');
    } else if (effect === 'safe_leave') {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 6);
      this.showToast('🚶 조용히 지나가며 체력을 +6 회복했습니다.', 'info');
    }

    finish();
  },

  showGameOverModal(isVictory) {
    SfxEngine.play(isVictory ? 'victory' : 'defeat');
    this.clearSavedRun();
    const modal = document.getElementById('modal-gameover');
    const title = document.getElementById('gameover-title');
    const desc = document.getElementById('gameover-desc');

    if (isVictory) {
      const se = typeof window !== 'undefined' ? window.STORY_ENGINE : null;
      title.textContent = se ? `👑 ${se.VICTORY_EPILOGUE.title}` : '👑 언더마운틴 5계층(75 스테이지) 완전 정복!';
      desc.textContent = se
        ? `${se.VICTORY_EPILOGUE.paragraphs.join(' ')} (클리어 보상: 💎 등반 마석 +800 지급!)`
        : '포가튼 렐름의 전설이 되었습니다! 클리어 보상으로 등반 마석 +800개가 지급되었습니다.';
    } else {
      title.textContent = `💀 모험 실패 (제${this.run.act}계층 Stage ${this.run.stage}/15)`;
      desc.textContent =
        '미궁에서 쓰러졌지만 원정 보상으로 등반 마석 +150개를 획득했습니다! 워터딥 주점 로비에서 클래스 레벨업, C→B→A→S 티어 승급, 마법 무구(+강화), D&D 특성(Feat)을 강화해 재도전하세요!';
      this.meta.gems += 150;
      this.meta.totalClimbs = (this.meta.totalClimbs || 0) + 1;
      this.saveMeta();
    }

    modal.classList.remove('hidden');
  },

  closeGameOverAndHub() {
    document.getElementById('modal-gameover').classList.add('hidden');
    this.run = null;
    this.combat = null;
    this.showHub();
  },

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
};

window.addEventListener('DOMContentLoaded', () => Game.init());
