// ============================================================================
// D&D 5E SPIRE II — COHESIVE BALDUR'S GATE 1·2·3 SAGA, 6 SD PIXEL NPCs &
// INTERACTIVE VISUAL-NOVEL DIALOGUE ENGINE (story.js)
// - Air-tight Forgotten Realms Lore Cohesion:
//   Nautiloid Crash -> Refuge at Waterdeep's Yawning Portal Tavern ->
//   Jaheira / Durnan / Withers / Guardian reveal the Absolute Cult & Dead Three
//   hijacked Halaster's Undermountain Planar Gates (linking Act 1..5 vertically!)
// - 6 Animated 32x32 SD Pixel-Art NPCs (Durnan, Jaheira, Guardian, Withers, Raphael, Volo)
// - Full Interactive Multi-Turn Branching Dialogue Scripts for Act 1..5 & All 6 Tavern NPCs
// - 8 Iconic Baldur's Gate 1·2·3 Events + 20 Boss Intros + 359 Card Lore Flavors
// ============================================================================
(function () {
  // --------------------------------------------------------------------------
  // 0. COMPACT 32x32 SD PIXEL-ART NPC SPRITE RENDERER (Matches Hero SD Style!)
  // --------------------------------------------------------------------------
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    const cl = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [cl(r), cl(g), cl(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function shade(hex, f) {
    const [r, g, b] = hexToRgb(hex);
    return f > 0
      ? rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f)
      : rgbToHex(r * (1 + f), g * (1 + f), b * (1 + f));
  }

  class NpcCanvas {
    constructor(w = 32, h = 32) {
      this.w = w; this.h = h;
      this.buf = new Array(w * h).fill(null);
    }
    px(x, y, c) {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix >= 0 && ix < this.w && iy >= 0 && iy < this.h) this.buf[iy * this.w + ix] = c;
    }
    get(x, y) { return (x < 0 || x >= this.w || y < 0 || y >= this.h) ? null : this.buf[y * this.w + x]; }
    rect(x, y, w, h, c) {
      for (let dy = 0; dy < Math.round(h); dy++) for (let dx = 0; dx < Math.round(w); dx++) this.px(x + dx, y + dy, c);
    }
    shadedRect(x, y, w, h, base) {
      const hi = shade(base, 0.28), lo = shade(base, -0.32);
      const rw = Math.round(w), rh = Math.round(h);
      for (let dy = 0; dy < rh; dy++) {
        for (let dx = 0; dx < rw; dx++) {
          this.px(x + dx, y + dy, dy === 0 || dx === 0 ? hi : dy === rh - 1 || dx === rw - 1 ? lo : base);
        }
      }
    }
    oval(cx, cy, rx, ry, base, shaded = true) {
      const hi = shaded ? shade(base, 0.28) : base, lo = shaded ? shade(base, -0.32) : base;
      for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
        for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
          const nx = (x - cx) / rx, ny = (y - cy) / ry;
          if (nx * nx + ny * ny <= 1) {
            this.px(x, y, shaded ? (nx + ny < -0.55 ? hi : nx + ny > 0.55 ? lo : base) : base);
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
    eye(x, y, iris) {
      this.px(x, y, '#12131c'); this.px(x + 1, y, '#ffffff');
      this.px(x, y + 1, iris); this.px(x + 1, y + 1, '#12131c');
      this.px(x, y + 2, shade(iris, 0.35)); this.px(x + 1, y + 2, iris);
    }
    outline(col = '#10101a') {
      const m = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.buf[y * this.w + x]) continue;
          if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) m.push(y * this.w + x);
        }
      }
      for (const idx of m) this.buf[idx] = col;
    }
    toRects() {
      const out = [];
      for (let y = 0; y < this.h; y++) {
        let x = 0; const off = y * this.w;
        while (x < this.w) {
          const c = this.buf[off + x];
          if (!c) { x++; continue; }
          let run = 1;
          while (x + run < this.w && this.buf[off + x + run] === c) run++;
          out.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${c}"/>`);
          x += run;
        }
      }
      return out.join('');
    }
  }

  function renderNpcSvg(drawFn, aura = '#f6c967', motion = 'px-motion-agile') {
    const c1 = new NpcCanvas(32, 32), c2 = new NpcCanvas(32, 32);
    drawFn(c1, 0); drawFn(c2, 1);
    c1.outline(); c2.outline();
    return (
      `<svg viewBox="0 0 32 32" shape-rendering="crispEdges" class="pixel-sprite ${motion}" aria-hidden="true">` +
      `<ellipse cx="16" cy="18" rx="13" ry="11" fill="${aura}" opacity="0.2" class="px-aura"/>` +
      `<ellipse cx="16" cy="30" rx="9" ry="1.6" fill="rgba(0,0,0,0.5)"/>` +
      `<g class="px-f1">${c1.toRects()}</g><g class="px-f2">${c2.toRects()}</g></svg>`
    );
  }

  function drawNpcBody(c, f, cfg) {
    const cx = 15, b = f;
    if (cfg.cape) { c.oval(cx - 1 - f, 21 + b, 7.5, 6.5, cfg.cape); }
    c.shadedRect(cx - 4, 24, 3, 5, cfg.pants || '#2f3640');
    c.shadedRect(cx + 2, 24, 3, 5, cfg.pants || '#2f3640');
    c.shadedRect(cx - 5, 17 + b, 11, 8, cfg.robe);
    c.rect(cx - 5, 22 + b, 11, 2, cfg.belt || '#3d2b1f');
    c.rect(cx - 1, 22 + b, 3, 2, cfg.trim || '#f6c967');
    c.oval(cx, 11 + b, 6.4, 5.4, cfg.skin || '#f4cfb2');
    if (!cfg.noEyes) {
      c.eye(cx - 4, 10 + b, cfg.eye || '#2e86de');
      c.eye(cx + 2, 10 + b, cfg.eye || '#2e86de');
    }
    if (cfg.extra) cfg.extra(c, cx, b, f);
  }

  const NPCS = {
    durnan: {
      id: 'durnan',
      name: '더난 (Durnan)',
      title: '워터딥 "하품하는 포털" 주점 주인',
      faction: '워터딥 · 전설의 은퇴 모험가',
      accent: '#f6c967',
      icon: '🍺',
      svg: renderNpcSvg((c, f) => {
        drawNpcBody(c, f, {
          skin: '#e8ba98', robe: '#784212', belt: '#2f3640', trim: '#f6c967', eye: '#74b9ff',
          extra: (c, cx, b, f) => {
            c.rect(cx - 3, 18 + b, 7, 7, '#dfe6e9'); // tavern apron
            c.oval(cx, 7 + b, 6.5, 3, '#576574'); // salt-and-pepper hair
            c.oval(cx, 15 + b, 5.2, 2.8, '#576574'); // thick veteran beard
            // Foaming Ale Mug + Greatsword on back!
            c.line(cx - 8, 22 + b, cx - 12, 6 + b, '#b2bec3', 2);
            c.shadedRect(cx + 8, 17 + b - f, 5, 6, '#d4a017');
            c.rect(cx + 8, 16 + b - f, 5, 2, '#ffffff');
          }
        });
      }, '#f6c967', 'px-motion-heavy')
    },
    jaheira: {
      id: 'jaheira',
      name: '자헤이라 (Jaheira)',
      title: '하퍼즈 고위 사령관 · BG1·2·3 전설',
      faction: '하퍼즈(Harpers) · 드루이드 전사',
      accent: '#2ed573',
      icon: '🌿',
      svg: renderNpcSvg((c, f) => {
        drawNpcBody(c, f, {
          skin: '#edc3a1', robe: '#1e6b43', cape: '#14472c', belt: '#5c3c24', trim: '#f6c967', eye: '#2ed573',
          extra: (c, cx, b, f) => {
            // Silver-streaked braided hair & Harper brooch
            c.oval(cx, 7 + b, 7, 3.6, '#c8d6e5');
            c.rect(cx - 7, 8 + b, 2, 7, '#a4b0be');
            c.rect(cx + 6, 8 + b, 2, 7, '#a4b0be');
            c.rect(cx - 1, 18 + b, 3, 3, '#f6c967');
            // Twin Scimitars
            c.line(cx - 8, 20 + b, cx - 12, 11 + b - f, '#ecf0f1', 2);
            c.line(cx + 9, 20 + b, cx + 13, 11 + b + f, '#ecf0f1', 2);
          }
        });
      }, '#2ed573', 'px-motion-agile')
    },
    guardian: {
      id: 'guardian',
      name: '꿈의 수호자 (Dream Guardian)',
      title: '아스트랄 프리즘 속 은빛 수호자',
      faction: '아스트랄 차원 · 프리즘의 의지',
      accent: '#a29bfe',
      icon: '🔮',
      svg: renderNpcSvg((c, f) => {
        drawNpcBody(c, f, {
          skin: '#dcd6f7', robe: '#4834d4', cape: '#192a56', trim: '#00d2d3', eye: '#00d2d3',
          extra: (c, cx, b, f) => {
            // Silver Astral Circlet & Flowing Violet Hair
            c.oval(cx, 7 + b, 7, 3.6, '#6c5ce7');
            c.rect(cx - 5, 8 + b, 11, 1, '#f6c967');
            // Floating Glowing D20 Astral Prism!
            const py = 13 + b - f * 2;
            c.oval(cx + 10, py, 3.8, 3.8, '#00d2d3');
            c.rect(cx + 9, py - 1, 2, 2, '#ffffff');
            c.px(cx + 10, py - 5, '#f6c967');
          }
        });
      }, '#a29bfe', 'px-motion-float')
    },
    withers: {
      id: 'withers',
      name: '위더스 (Withers)',
      title: '죽음의 옛 신 제르갈의 서기관',
      faction: '운명의 기록관 · 제르갈의 화신',
      accent: '#7ed6df',
      icon: '💀',
      svg: renderNpcSvg((c, f) => {
        drawNpcBody(c, f, {
          skin: '#d1ccc0', robe: '#3d312a', cape: '#1e1918', trim: '#f6c967', noEyes: true,
          extra: (c, cx, b, f) => {
            // Golden Ceremonial Hood + Serene Ancient Skull Face
            c.oval(cx, 8 + b, 7.6, 5.2, '#b7791f');
            c.oval(cx, 11 + b, 5.2, 4.4, '#d1ccc0');
            c.rect(cx - 4, 10 + b, 3, 2, '#10101a');
            c.rect(cx + 2, 10 + b, 3, 2, '#10101a');
            c.px(cx - 3, 10 + b, '#7ed6df');
            c.px(cx + 3, 10 + b, '#7ed6df');
            // Golden Scroll of Fate
            c.shadedRect(cx + 8, 16 + b - f, 5, 7, '#f6e58d');
            c.rect(cx + 8, 15 + b - f, 5, 1, '#f6c967');
          }
        });
      }, '#7ed6df', 'px-motion-float')
    },
    raphael: {
      id: 'raphael',
      name: '라파엘 (Raphael)',
      title: '아베르누스 "희망의 집"의 캄비온 귀족',
      faction: '나인 헬 · 계약의 악마',
      accent: '#ff4757',
      icon: '😈',
      svg: renderNpcSvg((c, f) => {
        drawNpcBody(c, f, {
          skin: '#f2d4cc', robe: '#781023', cape: '#240811', trim: '#f6c967', eye: '#ff4757',
          extra: (c, cx, b, f) => {
            // Slick Noble Dark Hair + Subtle Crimson Devil Horns!
            c.oval(cx, 7 + b, 6.6, 3.2, '#1e1e2c');
            c.line(cx - 5, 6 + b, cx - 9, 2 + b, '#ff4757', 2);
            c.line(cx + 5, 6 + b, cx + 9, 2 + b, '#ff4757', 2);
            // Flaming Infernal Contract Paper!
            c.shadedRect(cx + 8, 15 + b - f, 5, 7, '#ffeaa7');
            c.oval(cx + 10, 12 + b - f, 2.5, 2.5, f ? '#ff9f43' : '#ff4757');
          }
        });
      }, '#ff4757', 'px-motion-float')
    },
    volo: {
      id: 'volo',
      name: '볼로 (Volo)',
      title: '워터딥의 음유시인 겸 몬스터 학자',
      faction: '소드 코스트 · 괴짜 연대기 작가',
      accent: '#74b9ff',
      icon: '🎻',
      svg: renderNpcSvg((c, f) => {
        drawNpcBody(c, f, {
          skin: '#f7d2b4', robe: '#2980b9', cape: '#1b4f72', trim: '#f6c967', eye: '#3498db',
          extra: (c, cx, b, f) => {
            // Jaunty Plumed Bard Beret & Mustache
            c.oval(cx, 7 + b, 7.6, 3, '#2980b9');
            c.line(cx + 4, 6 + b, cx + 10, 1 + b - f, '#ff6b81', 2);
            c.rect(cx - 4, 14 + b, 9, 2, '#6d4c41');
            // Quill & Monster Encyclopedia
            c.shadedRect(cx + 8, 17 + b, 5, 6, '#8d5524');
            c.line(cx + 10, 16 + b - f, cx + 13, 10 + b - f, '#ffffff', 1);
          }
        });
      }, '#74b9ff', 'px-motion-agile')
    }
  };

  // --------------------------------------------------------------------------
  // 1. 8 CLASS ORIGIN PROLOGUE LINES (Baldur's Gate 3 Companion-Inspired!)
  // --------------------------------------------------------------------------
  const CLASS_ORIGINS = {
    fighter: {
      title: '추락한 전사의 서약',
      quote: '"일리시드 따위의 기생충이 내 정신을 잠식하게 둘 순 없다. 검을 쥐고 피로 길을 열어, 절대자의 심장을 직접 꿰뚫겠다."'
    },
    barbarian: {
      title: '아베르누스의 불타는 심장',
      quote: '"지옥의 전장에서도 살아 돌아온 몸이다. 머릿속 올챙이든, 악마의 군주든… 내 도끼와 분노 앞에선 모두 잿더미가 될 뿐!"'
    },
    rogue: {
      title: '밤의 송곳니와 자유의 그림자',
      quote: '"200년의 굴레에서 막 벗어났는데, 이번엔 일리시드 올챙이라니? 흥… 누구도 날 조종할 수 없어. 어둠 속에서 목줄을 끊어주지."'
    },
    ranger: {
      title: '소드 코스트의 추적자와 야수',
      quote: '"숲과 언더다크의 바람이 피비린내를 전하고 있다. 에메랄드 숲의 난민들과 소드 코스트를 지키기 위해 활시위를 당긴다."'
    },
    wizard: {
      title: '네더리스 보주를 품은 마도사',
      quote: '"가슴 속의 불안정한 네더리스 마력과 머릿속 일리시드 올챙이라… 미스트라 여신이시여, 이 위기를 비전의 지혜로 돌파하게 하소서."'
    },
    cleric: {
      title: '아스트랄 프리즘을 지키는 성직자',
      quote: '"어둠의 여신 샤와 빛의 여신 셀루네의 경계에서, 품 안의 20면체 아스트랄 프리즘이 울리고 있다. 잃어버린 기억의 진실이 저 심연 아래 있다."'
    },
    paladin: {
      title: '꺾이지 않는 정의의 맹세',
      quote: '"절대자 교단의 거짓된 신성함은 빛의 모독이다. 죽음의 3신과 지옥의 군세가 기다린다 해도, 나의 맹세는 결코 꺾이지 않는다."'
    },
    warlock: {
      title: '지옥의 계약과 소드 코스트의 검',
      quote: '"악마와의 계약은 무겁지만, 발더스 게이트를 집어삼키려는 어둠을 외면할 순 없다. 계약의 불꽃으로 심연의 주인들을 불태우리라."'
    }
  };

  // --------------------------------------------------------------------------
  // 2. COHESIVE 5-ACT MAIN STORY CHAPTERS (For Chronicle Codex + Summary!)
  // --------------------------------------------------------------------------
  const ACT_CHAPTERS = {
    1: {
      act: 1,
      chapter: '제1막 · PROLOGUE & ACT I',
      title: '하품하는 포털의 피난민과 탈취된 언더마운틴 차원문',
      location: '워터딥 하품하는 포털 주점 → 1층 고블린 성채',
      speaker: '🌿 하퍼즈 사령관 자헤이라 & 🍺 더난',
      paragraphs: [
        '발더스 게이트 상공에서 불타며 추락한 일리시드 함선 노틸로이드… 유일하게 살아남아 워터딥 "하품하는 포털" 주점으로 피신한 당신의 눈 뒤편에는 일리시드 올챙이가 꿈틀거리고 있었다.',
        '품 안의 20면체 유물 "아스트랄 프리즘"이 세레모포시스를 막아주는 사이, 하퍼즈의 전설 자헤이라와 주점 주인 더난이 충격적인 소식을 전한다. "절대자 교단이 광기의 마법사 할라스터의 언더마운틴 지하 차원문을 탈취해, 고블린 성채·언더다크·일리시드 군락·섀도우펠·아베르누스를 하나의 탑처럼 수직 연결해 버렸소!"',
        '머릿속 올챙이의 치료법도, 소드 코스트를 구할 열쇠도 모두 우물 아래 5계층 심연에 있다. 도르래 밧줄을 타고 제1계층 고블린 성채로 내려선다.'
      ],
      objective: '🎯 목표: 탈취된 제1계층 고블린 성채의 지배자(15F)를 격파하고 언더다크 차원문을 돌파하라.'
    },
    2: {
      act: 2,
      chapter: '제2막 · ACT II',
      title: '언더다크, 그림포지, 그리고 그림자 저주',
      location: '언더다크 → 롤스의 거미 신전 → 그림포지 심연',
      speaker: '🌿 하퍼즈 사령관 자헤이라 & 🔮 꿈의 수호자',
      paragraphs: [
        '제1계층의 차원문을 열어젖히자 빛이 닿지 않는 언더다크가 펼쳐졌다. 롤스의 거미 신전과 두에르가의 강철 용광로 그림포지 너머로, 어둠의 여신 샤(Shar)가 남긴 짙은 "그림자 저주"가 안개처럼 밀려온다.',
        '자헤이라의 하퍼즈 정찰대가 남긴 보고서에는 충격적인 기록이 적혀 있었다. "절대자 교단이 그림포지의 용광로와 언더다크 통로를 통해 수천 개의 올챙이 표본을 달오름 탑 지하로 운반하고 있다."',
        '아스트랄 프리즘이 뜨겁게 진동한다. 언더다크의 지배자를 쓰러뜨려야만 제3계층 일리시드 군락의 봉인을 열 수 있다.'
      ],
      objective: '🎯 목표: 언더다크의 지배자를 격파하고 제3계층 일리시드 생체 군락으로 진입하라.'
    },
    3: {
      act: 3,
      chapter: '제3막 · ACT III',
      title: '달오름 탑 지하: 엘더 브레인과 네더스톤의 진실',
      location: '달오름 탑 심층부 → 일리시드 생체 군락 → 아스트랄 경계',
      speaker: '🔮 꿈의 수호자',
      paragraphs: [
        '살아 숨 쉬는 촉수와 사이오닉 수조가 가득한 제3계층 생체 군락. 이곳에서 꿈의 수호자가 마침내 숨겨둔 진실을 고백한다 — 절대자의 정체는 고대 네더리스 유물 "카서스의 왕관"에 속박된 거대 엘더 브레인이다!',
        '죽음의 3신(베인·바알·머큘)의 선택받은 자들이 세 개의 네더스톤으로 엘더 브레인을 조종해, 언더마운틴 차원문 전체를 침공 교두보로 삼고 있었다.',
        '아스트랄 프리즘을 노리는 기스양키 은빛 함대마저 군락을 강습해 오는 혼돈 속, 당신은 제3계층의 심장을 꿰뚫어야 한다.'
      ],
      objective: '🎯 목표: 일리시드 군락의 지배자를 쓰러뜨리고 섀도우펠의 봉인문을 열어라.'
    },
    4: {
      act: 4,
      chapter: '제4막 · ACT IV (BG1·BG2 바알스폰 유산)',
      title: '섀도우펠과 바알스폰의 피의 유산',
      location: '섀도우펠 → 바알의 지하 신전 → 아세라락의 공포의 무덤',
      speaker: '💀 위더스(Withers) & 🌿 자헤이라',
      paragraphs: [
        '"100년 전, 발더스 게이트 아래에서 사레복과 이레니쿠스가 일으켰던 바알스폰 전쟁을 기억하는가?" 죽음의 옛 신 제르갈의 화신 위더스가 안개 속에서 걸어 나온다.',
        '죽음의 3신 교단은 네더스톤의 힘으로 섀도우펠의 망령 군주들과 아세라락의 영혼 융합로(Soulmonger)까지 깨워, 발더스 게이트와 워터딥을 동시에 집어삼킬 불사의 군단을 일으켰다.',
        '자헤이라가 쌍시미터를 뽑아 들며 속삭인다. "100년 전에도 우린 바알의 어둠을 막아냈어. 이번에도 여기서 끝장을 내자."'
      ],
      objective: '🎯 목표: 섀도우펠의 불사 군주를 토벌하고 제5계층 아베르누스 지옥 관문을 돌파하라.'
    },
    5: {
      act: 5,
      chapter: '제5막 · FINAL ACT V',
      title: '나인 헬 아베르누스: 희망의 집과 최후의 결전',
      location: '아베르누스 혈전 평원 → 희망의 집 → 최후의 신전',
      speaker: '😈 라파엘 & 🔮 꿈의 수호자',
      paragraphs: [
        '언더마운틴 최하층 차원문을 넘어서자 유황 불길이 타오르는 나인 헬 제1계층 아베르누스가 눈앞에 펼쳐진다. 카서스의 왕관을 노리는 악마 라파엘과 아스모데우스, 타락 천사 자리에르, 그리고 차원 균열 너머에서 깨어난 티아마트가 최종 전장에 집결했다.',
        '라파엘이 웃으며 마지막 유혹을 건네지만, 아스트랄 프리즘은 이제 당신의 의지와 완벽히 공명하며 눈부신 빛을 내뿜는다.',
        '"노틸로이드에서 시작된 여정의 마지막 페이지다. 올챙이의 저주도, 절대자의 음모도, 바알스폰의 숙명도 — 지금 이 검과 주문으로 끝내라!"'
      ],
      objective: '🎯 최종 목표: 제5계층 15F 최종 지배자를 토벌하고 발더스 게이트와 소드 코스트를 구원하라!'
    }
  };

  const VICTORY_EPILOGUE = {
    chapter: 'EPILOGUE · 전설의 귀환',
    title: '절대자의 몰락과 발더스 게이트의 새벽',
    paragraphs: [
      '최후의 일격과 함께 카서스의 왕관이 산산조각 나며, 소드 코스트를 뒤덮던 일리시드 올챙이의 사념파가 일제히 소멸했다. 탈취당했던 언더마운틴의 5계층 차원문도 마침내 닫혔다.',
      '워터딥 "하품하는 포털" 주점에서는 더난이 전설의 황금 에일을 따르고, 자헤이라와 볼로가 당신의 영웅담을 새 연대기에 적어 내려간다. 위더스는 조용히 미소 지으며 운명의 책을 덮었다.',
      '당신의 이름은 이제 발더스 게이트 1·2·3의 모든 전설들과 나란히 포가튼 렐름의 역사에 영원히 빛날 것이다.'
    ]
  };

  // --------------------------------------------------------------------------
  // 3. INTERACTIVE VISUAL-NOVEL DIALOGUE SCENES (Dedicated #screen-story!)
  //    Each scene has multi-turn dialogue lines + interactive player choices!
  // --------------------------------------------------------------------------
  function getActDialogueScene(actNum, charId) {
    const origin = CLASS_ORIGINS[charId] || CLASS_ORIGINS.fighter;
    const chName =
      typeof window !== 'undefined' && window.GAME_DATA && window.GAME_DATA.characters[charId]
        ? window.GAME_DATA.characters[charId].name
        : '모험가';

    if (actNum === 1) {
      return {
        id: 'act_1',
        chapter: ACT_CHAPTERS[1].chapter,
        title: ACT_CHAPTERS[1].title,
        bgKey: 'lobby',
        actNum: 1,
        lines: [
          {
            speaker: 'npc', npcId: 'durnan',
            text: '"어이, 정신이 좀 드나? 발더스 게이트 쪽 하늘에서 일리시드 함선이 불타며 떨어진 뒤, 이 워터딥 주점 문 앞까지 간신히 기어 들어온 건 자네뿐이었어."'
          },
          {
            speaker: 'npc', npcId: 'jaheira',
            text: '"내 이름은 자헤이라. 하퍼즈의 일원이지. 자네 눈 뒤편에 일리시드 올챙이가 박혀 있는데도 아직 괴물로 변하지 않은 건… 품 안의 그 20면체 유물 덕분이군."'
          },
          {
            speaker: 'npc', npcId: 'guardian',
            text: '(품 속 아스트랄 프리즘이 푸르게 울리며 머릿속에 직접 목소리가 울린다.) "나는 프리즘의 수호자. 지금 네 정신을 지키고 있다. 절대자 교단이 이 주점 지하 — 언더마운틴의 5대 차원문을 탈취해 소드 코스트 침공을 준비 중이다."'
          },
          {
            speaker: 'hero', npcId: 'jaheira',
            text: origin.quote
          },
          {
            speaker: 'npc', npcId: 'jaheira',
            text: `"좋아, ${chName}. 100년 전 발더스 게이트의 바알스폰 전쟁 때도 우린 어둠에 굴복하지 않았지. 주점 중앙의 우물 밧줄을 타고 1층 고블린 성채로 내려가라. 출발 전 궁금한 게 있나?"`,
            choices: [
              {
                label: '❓ "왜 워터딥 지하가 언더다크·아베르누스까지 연결돼 있죠?"',
                replySpeaker: 'npc', replyNpcId: 'durnan',
                reply: '"광기의 마법사 할라스터가 언더마운틴 곳곳에 다른 차원으로 통하는 마법 관문을 박아뒀거든. 절대자 교단이 그 관문들을 하나로 묶어 5계층 침공로를 만든 거야. 1층 지배자부터 꺾어야 다음 문이 열려."'
              },
              {
                label: '🔮 "아스트랄 프리즘과 제 머릿속 올챙이는 어떻게 되는 겁니까?"',
                replySpeaker: 'npc', replyNpcId: 'guardian',
                reply: '"5계층 끝에서 절대자의 근원인 카서스의 왕관을 부수면 올챙이는 완전히 사라진다. 그전까지 내가 네 곁에서 축복을 내려주마. 자, 수호자의 축복을 선택하고 내려가자!"'
              },
              {
                label: '⚔️ "설명은 충분합니다. 지금 즉시 우물 아래로 내려가겠습니다!"',
                replySpeaker: 'npc', replyNpcId: 'jaheira',
                reply: '"듬직하군. 행운을 빌지 — 소드 코스트의 운명이 자네의 검과 주문에 달렸어!"'
              }
            ]
          }
        ]
      };
    }

    if (actNum === 2) {
      return {
        id: 'act_2',
        chapter: ACT_CHAPTERS[2].chapter,
        title: ACT_CHAPTERS[2].title,
        bgKey: 'arachne_matron',
        actNum: 2,
        lines: [
          {
            speaker: 'npc', npcId: 'jaheira',
            text: '"제1계층 고블린 성채를 뚫었군! 하지만 진짜 시련은 지금부터야. 차원문 너머 여기는 언더다크 — 롤스의 거미 신전과 두에르가의 그림포지 용광로가 있는 어둠의 땅이다."'
          },
          {
            speaker: 'npc', npcId: 'raphael',
            text: '(붉은 유황 연기와 함께 정장 차림의 남자가 박수를 치며 나타난다.) "오, 제법이군! 작은 생쥐가 1층 덫을 빠져나왔어. 하지만 언더다크의 그림자 저주와 드로우의 독은 만만치 않을 텐데… 내 도움이 필요하면 언제든 부르게."'
          },
          {
            speaker: 'npc', npcId: 'guardian',
            text: '"저 악마 라파엘의 말에 현혹되지 마라. 언더다크 최심부를 돌파해야 달오름 탑 지하의 진짜 일리시드 군락으로 이어지는 길이 열린다!"',
            choices: [
              {
                label: '😈 라파엘에게: "네가 왜 내 여정에 끼어드는 거지?"',
                replySpeaker: 'npc', replyNpcId: 'raphael',
                reply: '"하하, 절대자 교단이 손에 쥔 카서스의 왕관에 관심이 좀 있거든. 자네가 5층 아베르누스까지 살아서 온다면… 그때 다시 근사한 만찬을 대접하지!"'
              },
              {
                label: '🛡️ "악마의 농간 따위 무시하고 언더다크를 돌파하겠습니다."',
                replySpeaker: 'npc', replyNpcId: 'jaheira',
                reply: '"현명한 판단이야. 여기서부터 적들의 패턴이 훨씬 험악해지니 덱의 핵심 시너지를 본격적으로 완성해 나가라!"'
              }
            ]
          }
        ]
      };
    }

    if (actNum === 3) {
      return {
        id: 'act_3',
        chapter: ACT_CHAPTERS[3].chapter,
        title: ACT_CHAPTERS[3].title,
        bgKey: 'elder_brain_prime',
        actNum: 3,
        lines: [
          {
            speaker: 'npc', npcId: 'guardian',
            text: '"마침내 제3계층 — 달오름 탑 지하의 일리시드 생체 군락에 도달했다. 이제 숨김없이 진실을 말해주지. 절대자의 정체는 카서스의 왕관에 속박된 거대 엘더 브레인이다."'
          },
          {
            speaker: 'hero', npcId: 'guardian',
            text: '"그렇다면 누가 그 왕관으로 엘더 브레인을 조종하고 있는 거지? 그리고 기스양키 함대까지 이곳을 습격하는 이유는?"'
          },
          {
            speaker: 'npc', npcId: 'guardian',
            text: '"죽음의 3신(베인·바알·머큘)의 선택받은 자들이 네더스톤으로 뇌를 지배하고 있고, 기스양키 여왕 블라키스는 내 안의 프리즘을 빼앗으려 한다. 여기서 무너지면 소드 코스트 전체가 일리시드 제국이 된다!"',
            choices: [
              {
                label: '🧠 "네더스톤의 지배를 끊고 엘더 브레인의 군락을 파괴하겠습니다."',
                replySpeaker: 'npc', replyNpcId: 'guardian',
                reply: '"고맙다. 네 덱과 유물이라면 이 군락의 지배자도 충분히 꺾을 수 있다. 4층 섀도우펠로 가는 차원문을 열어라!"'
              },
              {
                label: '👁️ "수호자, 당신도 내게 숨기는 비밀이 있는 거 아닌가?"',
                replySpeaker: 'npc', replyNpcId: 'guardian',
                reply: '"…날 의심해도 좋다. 하지만 지금 우리 둘의 생존이 같은 운명에 묶여 있다는 것만은 진실이다. 일단 이 군락부터 살아나가자."'
              }
            ]
          }
        ]
      };
    }

    if (actNum === 4) {
      return {
        id: 'act_4',
        chapter: ACT_CHAPTERS[4].chapter,
        title: ACT_CHAPTERS[4].title,
        bgKey: 'archlich_acererak',
        actNum: 4,
        lines: [
          {
            speaker: 'npc', npcId: 'withers',
            text: '"여기까지 올라온 필멸자는 오랜만이군. 제4계층 섀도우펠… 그리고 100년 전 발더스 게이트를 피로 물들였던 바알스폰 전쟁의 잔향이 아직도 숨 쉬는 곳이다."'
          },
          {
            speaker: 'npc', npcId: 'jaheira',
            text: '"사레복과 이레니쿠스를 쓰러뜨렸던 옛 동료들이 떠오르는군… 죽음의 3신 교단이 머큘의 사령술과 아세라락의 공포의 무덤까지 연결해 불사의 군단을 일으켰어."'
          },
          {
            speaker: 'npc', npcId: 'withers',
            text: '"죽은 자들의 왕좌 너머에는 나인 헬 아베르누스로 통하는 마지막 관문이 있다. 운명의 저울은 이미 자네 편으로 기울기 시작했으니, 흔들리지 말고 나아가라."',
            choices: [
              {
                label: '💀 위더스에게: "당신의 진짜 정체는 죽음의 옛 신 제르갈입니까?"',
                replySpeaker: 'npc', replyNpcId: 'withers',
                reply: '"…아니오. (그의 메마른 입가에 아득한 세월의 미소가 스친다.) 다만 세 멍청한 후계자들이 죽음의 질서를 어지럽히는 꼴을 보고 있을 수 없을 뿐."'
              },
              {
                label: '⚔️ "바알스폰의 어둠과 공포의 무덤을 여기서 끝장내겠습니다!"',
                replySpeaker: 'npc', replyNpcId: 'jaheira',
                reply: '"그래! 발더스 게이트의 명예를 걸고, 최종 빌드의 위력을 저 사령 군주들에게 보여줘라!"'
              }
            ]
          }
        ]
      };
    }

    return {
      id: 'act_5',
      chapter: ACT_CHAPTERS[5].chapter,
      title: ACT_CHAPTERS[5].title,
      bgKey: 'tiamat_dragon_queen',
      actNum: 5,
      lines: [
        {
          speaker: 'npc', npcId: 'raphael',
          text: '"환영하네, 영웅이여! 드디어 마지막 무대 — 나인 헬 제1계층 아베르누스까지 당도했군. 내 희망의 집과 타락 천사 자리에르, 그리고 오색룡 티아마트가 기다리는 지옥의 심연이지."'
        },
        {
          speaker: 'npc', npcId: 'guardian',
          text: '"이곳의 최종 지배자를 쓰러뜨리면 카서스의 왕관과 언더마운틴의 모든 차원문이 붕괴하고, 네 머릿속 올챙이도 영원히 사라진다!"'
        },
        {
          speaker: 'hero', npcId: 'raphael',
          text: '"노틸로이드에서 추락했던 날부터 이 순간만을 기다렸다. 악마든 고룡이든, 지금 이 자리에서 결판을 내겠다!"',
          choices: [
            {
              label: '🔥 "최후의 결전이다! 아베르누스 정상을 정복하겠다!"',
              replySpeaker: 'npc', replyNpcId: 'raphael',
              reply: '"하하하! 좋다, 소드 코스트 역사상 가장 화려한 피날레를 보여주게나!"'
            },
            {
              label: '👑 "카서스의 왕관은 네 손에도, 절대자 손에도 넘기지 않는다!"',
              replySpeaker: 'npc', replyNpcId: 'guardian',
              reply: '"바로 그 결의다! 왕관을 부수고 모든 차원문을 봉인해 워터딥과 발더스 게이트를 구원하자!"'
            },
            {
              label: '😈 라파엘에게: "네가 방해한다면 네 희망의 집부터 불태워주지."',
              replySpeaker: 'npc', replyNpcId: 'raphael',
              reply: '"오호, 뾰족한 발톱이 마음에 드는군! 어디 그 기세로 지옥의 최종 군주까지 베어보게!"'
            }
          ]
        }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE LOBBY TAVERN NPC CONVERSATIONS (Changes with Best Act!)
  // --------------------------------------------------------------------------
  function getTavernNpcDialogue(npcId, bestAct = 1) {
    const map = {
      durnan: {
        id: 'npc_durnan',
        chapter: '🍺 하품하는 포털 주점 · 주인과의 대화',
        title: '더난(Durnan)과 언더마운틴의 비밀',
        bgKey: 'lobby',
        lines: [
          {
            speaker: 'npc', npcId: 'durnan',
            text: bestAct >= 3
              ? '"오, 자네 제3계층 일리시드 군락까지 다녀왔다며? 주점 단골들 사이에서 벌써 전설이 됐어. 여기 시원한 워터딥 흑맥주 한 잔 받게!"'
              : '"어서 오게, 모험가. 이 주점 한가운데 뚫린 우물 밑이 바로 언더마운틴이야. 원래도 위험한 던전이었지만, 요즘 절대자 교단 놈들이 차원문을 멋대로 이어 붙여 5계층 지옥도가 되어버렸지."'
          },
          {
            speaker: 'npc', npcId: 'durnan',
            text: '"출격하기 전에 뭐든 물어보게. 내 200년 모험 경험으로 아는 건 다 알려주지."',
            choices: [
              {
                label: '🏰 "5개 계층이 어떻게 구성되어 있나요?"',
                replySpeaker: 'npc', replyNpcId: 'durnan',
                reply: '"1층 고블린 성채에서 기초 덱을 다지고, 2~3층 언더다크와 일리시드 군락에서 하위직업 핵심 시너지를 완성하게. 4~5층 섀도우펠과 아베르누스엔 전설 카드를 쥔 최종 빌드로 맞서야 살아남아!"'
              },
              {
                label: '🏆 "잠긴 클래스와 전설 카드는 어떻게 해금하죠?"',
                replySpeaker: 'npc', replyNpcId: 'durnan',
                reply: '"처음엔 파이터·로그·위저드 3명뿐이지만, [🏆 업적] 조건을 달성할 때마다 바바리안·레인저·클레릭·팔라딘·워락과 심화 하위직업 16종, 전설 카드 풀이 차례대로 열린다네!"'
              },
              {
                label: '🍺 "고맙습니다, 더난. 곧 출격하겠습니다!"',
                replySpeaker: 'npc', replyNpcId: 'durnan',
                reply: '"살아서 돌아오면 외상은 탕감해주지. 조심해서 내려가게!"'
              }
            ]
          }
        ]
      },
      jaheira: {
        id: 'npc_jaheira',
        chapter: '🌿 하퍼즈 정보 교환 · 전설의 드루이드',
        title: '자헤이라(Jaheira)가 전하는 발더스 게이트 연대기',
        bgKey: 'lobby',
        lines: [
          {
            speaker: 'npc', npcId: 'jaheira',
            text: bestAct >= 4
              ? '"섀도우펠까지 뚫고 돌아온 건가… 정말 대단해. 100년 전 발더스 게이트를 구했던 내 옛 동료의 모습이 자네에게서 보이는군."'
              : '"하퍼즈 정찰 보고서를 정리하고 있었어. 발더스 게이트와 워터딥을 동시에 위협하는 절대자 교단 뒤에는 100년 전 바알스폰 전쟁의 원흉 — 죽음의 3신이 도사리고 있다."'
          },
          {
            speaker: 'npc', npcId: 'jaheira',
            text: '"전선으로 내려가기 전, 하퍼즈의 기록을 확인하겠나?"',
            choices: [
              {
                label: '🩸 "발더스 게이트 1·2의 바알스폰 전쟁에 대해 알려주세요."',
                replySpeaker: 'npc', replyNpcId: 'jaheira',
                reply: '"살인의 신 바알의 피를 이은 자들이 서로를 죽이며 신격을 다투던 끔찍한 전쟁이었지. 사레복과 마법사 이레니쿠스를 막아냈지만, 그 잔재가 지금 4층 섀도우펠에서 다시 꿈틀대고 있어."'
              },
              {
                label: '🗺️ "1층과 2층 돌파를 위한 전략 조언이 있나요?"',
                replySpeaker: 'npc', replyNpcId: 'jaheira',
                reply: '"바바리안·팔라딘·레인저·클레릭은 초반 1층이 든든하고, 파이터·로그·위저드·워락은 1층이 까다로운 대신 2~3층에서 빌드가 갖춰지면 압도적인 왕귀 화력을 뿜어내지!"'
              },
              {
                label: '🌿 "명심하겠습니다, 사령관님."',
                replySpeaker: 'npc', replyNpcId: 'jaheira',
                reply: '"언제든 주점으로 돌아오면 정보를 공유해주지. 자연의 균형이 자네와 함께하길."'
              }
            ]
          }
        ]
      },
      guardian: {
        id: 'npc_guardian',
        chapter: '🔮 아스트랄 프리즘 공명',
        title: '꿈의 수호자와의 정신 교신',
        bgKey: 'elder_brain_prime',
        lines: [
          {
            speaker: 'npc', npcId: 'guardian',
            text: '"아스트랄 프리즘에 손을 대었구나. 지금 이 순간에도 엘더 브레인의 사념파가 네 머릿속 올챙이를 깨우려 하지만, 내가 막아내고 있다."'
          },
          {
            speaker: 'npc', npcId: 'guardian',
            text: '"물어보고 싶은 것이 있다면 말해라. 시간은 많지 않다."',
            choices: [
              {
                label: '🧠 "올챙이의 힘을 받아들이면 어떻게 되나요?"',
                replySpeaker: 'npc', replyNpcId: 'guardian',
                reply: '"던전 이벤트에서 올챙이 표본이나 프리즘의 힘을 흡수하면 강력한 고등급 카드와 보상을 얻을 수 있지. 다만 육체에 부담이 따르니 체력 관리를 잊지 마라."'
              },
              {
                label: '👑 "카서스의 왕관이란 대체 무엇입니까?"',
                replySpeaker: 'npc', replyNpcId: 'guardian',
                reply: '"고대 네더리스의 대마법사 카서스가 신의 권능을 찬탈하려 만들었던 금단의 왕관이다. 5층 아베르누스 끝에서 그 왕관을 파괴해야만 모든 저주가 풀린다."'
              }
            ]
          }
        ]
      },
      withers: {
        id: 'npc_withers',
        chapter: '💀 운명의 기록관과의 문답',
        title: '위더스(Withers)와 필멸자의 운명',
        bgKey: 'archlich_acererak',
        lines: [
          {
            speaker: 'npc', npcId: 'withers',
            text: '"주점 구석의 어둠이 꽤 아늑하군. 필멸자여, 그대가 첨탑에서 쓰러지더라도 등반 마석과 경험, 업적의 기록은 운명의 장부에 영원히 남느니라."'
          },
          {
            speaker: 'npc', npcId: 'withers',
            text: '"무엇을 묻고자 나를 찾았는가?"',
            choices: [
              {
                label: '💎 "등반 마석은 어디에 쓰는 것이 가장 좋은가요?"',
                replySpeaker: 'npc', replyNpcId: 'withers',
                reply: '"로비의 [⚜️ 마법 무구] 강화, [📜 특성(Feat)] 연구, 그리고 클래스 레벨업과 C→B→A→S 티어 승급에 쓰면 영구적으로 강해지지. 특히 B급·S급 승급 시 직업 전용 유물이 해금되느니라."'
              },
              {
                label: '💀 "당신은 정말 죽음의 옛 신 제르갈인가요?"',
                replySpeaker: 'npc', replyNpcId: 'withers',
                reply: '"아니오. …그저 필멸자의 마지막을 기록할 뿐이다. 자, 다시 첨탑으로 향하거라."'
              }
            ]
          }
        ]
      },
      raphael: {
        id: 'npc_raphael',
        chapter: '😈 붉은 그림자의 방문객',
        title: '라파엘(Raphael)의 은밀한 속삭임',
        bgKey: 'asmodeus_lord_of_ninth',
        lines: [
          {
            speaker: 'npc', npcId: 'raphael',
            text: '"아, 워터딥 주점의 시큼한 맥주 냄새라니… 그래도 자네처럼 흥미진진한 영혼을 구경하는 재미는 쏠쏠하군. 5층 아베르누스에 있는 내 \'희망의 집\'에 언젠가 꼭 초대하고 싶네."'
          },
          {
            speaker: 'npc', npcId: 'raphael',
            text: '"어때, 지옥의 계약에 대해 미리 조금 들어보겠나?"',
            choices: [
              {
                label: '😈 "당신이 노리는 게 결국 카서스의 왕관 아닌가요?"',
                replySpeaker: 'npc', replyNpcId: 'raphael',
                reply: '"눈치가 아주 빠르군! 하지만 걱정 말게. 자네가 5층 아베르누스까지 살아서 올라오기 전까진, 난 그저 친절한 관객이자… 가끔 달콤한 거래를 제안하는 신사일 뿐이니까."'
              },
              {
                label: '🔥 "악마와는 거래하지 않는다. 5층에서 보자."',
                replySpeaker: 'npc', replyNpcId: 'raphael',
                reply: '"훌륭한 패기야! 자리에르와 티아마트 앞에서 그 기세가 얼마나 버틸지 기대하겠네!"'
              }
            ]
          }
        ]
      },
      volo: {
        id: 'npc_volo',
        chapter: '🎻 볼로의 괴짜 몬스터 백과사전',
        title: '음유시인 볼로(Volo)의 신간 취재',
        bgKey: 'beholder_xanathar',
        lines: [
          {
            speaker: 'npc', npcId: 'volo',
            text: '"오오, 바로 자네군! 내가 집필 중인 신간 《볼로의 언더마운틴 & 절대자 교단 완전 해부》의 완벽한 주인공이야! …참, 혹시 머릿속 올챙이 수술에 관심 있나? 아주 뾰족한 얼음송곳이 있는데!"'
          },
          {
            speaker: 'npc', npcId: 'volo',
            text: '"수술이 싫다면 내가 조사한 보스 생태 정보라도 들어보게!"',
            choices: [
              {
                label: '👁️ "1층 보스 재나타의 약점이 있나요?"',
                replySpeaker: 'npc', replyNpcId: 'volo',
                reply: '"비홀더 재나타는 자기 금붕어 \'실가\'를 끔찍이 아끼지! 전투할 땐 매 턴 공격력이 오르는 격노 패턴이 무서우니, 방어와 폭딜 타이밍을 잘 재야 살아남는다네!"'
              },
              {
                label: '📖 "볼로, 제 모험을 멋지게 기록해 주세요!"',
                replySpeaker: 'npc', replyNpcId: 'volo',
                reply: '"물론이지! [📖 연대기] 탭을 열면 자네가 돌파한 1~5막의 대서사가 내가 쓴 명문장으로 차곡차곡 기록되고 있다네!"'
              }
            ]
          }
        ]
      }
    };
    return map[npcId] || map.durnan;
  }

  // --------------------------------------------------------------------------
  // 5. ALL 20 ACT BOSSES NARRATIVE INTRO QUOTES
  // --------------------------------------------------------------------------
  const BOSS_INTROS = {
    beholder_xanathar: '"하하하! 내 사랑스러운 금붕어 실가를 건드린 놈이 네놈이냐? 절대자 교단이고 뭐고, 내 안티매직 광선 앞에서 가루가 되어라!"',
    young_green_dragon: '"크르르… 에메랄드 숲의 향긋한 냄새와 머릿속 올챙이의 달콤한 비명이 들리는구나. 맹독의 숨결로 네 뼈를 녹여주마!"',
    ettin_king_gror: '"왼쪽 머리: 절대자가 저놈을 부수랬다! / 오른쪽 머리: 아니야, 먼저 먹고 부수는 거야! 둘 다 뭉개버려!"',
    goblin_shaman_king: '"절대자 만세! 고블린 야영지의 화염 제단에 새 제물이 제 발로 걸어왔구나! 불태워라!"',
    arachne_matron: '"롤스 여신님의 거미줄에 걸린 어리석은 지상인아… 아스트랄 프리즘을 바치고 영원한 실크 고치가 되어라!"',
    aboleth_leviathan: '"네 머릿속의 어린 일리시드 따위, 태고의 심연 앞에선 먼지에 불과하다. 수만 년의 기억 속에 익사하라…"',
    purple_worm_titan: '"쿠구구궁!! (언더다크의 지반을 뚫고 솟구친 태고의 퍼플 웜이 거대한 이빨을 벌리며 포효한다!)"',
    duergar_despot: '"그림포지의 용광로는 쉬지 않는다! 절대자 교단의 금화가 쏟아지는 한, 네놈을 쇳물에 녹여 갑옷으로 만들어주마!"',
    elder_brain_prime: '"네가 저항하던 모든 순간조차 나의 계산 안에 있었다. 카서스의 왕관 아래 무릎 꿇고 위대한 설계(Grand Design)의 일부가 되어라!"',
    beholder_hive_mother: '"수백 개의 눈이 네 정신을 꿰뚫어 본다! 하이브의 수정 둥지에서 빠져나갈 길은 없다!"',
    githyanki_supreme: '"가이크(Ghaik)의 기생충을 품은 오염된 자여! 블라키스 여왕의 이름으로 아스트랄 프리즘을 회수하고 네 목을 베겠다!"',
    neothelid_leviathan: '"키이이이익—! (통제를 잃고 괴수화된 거대 올챙이 네오텔리드가 부식성 점액을 흩뿌리며 군락을 흔든다!)"',
    archlich_acererak: '"흥미롭군… 바알스폰의 잔향과 일리시드의 낙인을 동시에 품은 영혼이라니. 내 영혼 융합로(Soulmonger)에 아주 훌륭한 연료가 되겠어!"',
    dracolich_aurinax: '"죽음의 신 머큘의 권능으로 되살아난 백골의 숨결을 느껴라. 네 온기와 영혼을 영원히 얼려주마."',
    death_tyrant_beholder: '"살아 있는 육신은 약하다. 핏빛 안구의 저주 아래 언데드 군단의 병사로 다시 태어나라!"',
    lord_soth_deathknight: '"흑장미의 저주는 배신과 회한을 먹고 자란다… 발더스 게이트의 영웅이여, 네 맹세도 내 죽음의 검 앞에서 꺾이리라."',
    tiamat_dragon_queen: '"다섯 개의 머리가 지옥의 하늘을 찢는다! 아베르누스의 불꽃과 오색의 숨결 앞에서 필멸자의 오만을 불태워라!"',
    asmodeus_lord_of_ninth: '"라파엘 따위가 탐내던 카서스의 왕관과 네 영혼… 이제 나인 헬의 진정한 주인 앞에서 최종 계약서에 서명할 시간이다."',
    demogorgon_prince: '"아민과 헤슬라디아 두 머리가 광기의 합창을 울린다! 심연의 소용돌이 속에서 이성을 잃고 산산조각 나라!"',
    halaster_mad_mage: '"하하하! 발더스 게이트에서 언더마운틴, 아베르누스까지 잘도 기어 올라왔구나! 내 차원 균열 비전탑의 마지막 실험체가 되어라!"'
  };

  // --------------------------------------------------------------------------
  // 6. 8 ICONIC BALDUR'S GATE 1·2·3 STORY EVENTS (Merged into GAME_DATA.events!)
  // --------------------------------------------------------------------------
  const BG_EVENTS = [
    {
      id: 'bg3_nautiloid_tadpole',
      npcId: 'guardian',
      title: '🧠 [BG3 스토리] 추락한 노틸로이드의 올챙이 표본',
      desc: '부서진 일리시드 함선의 잔해 속에서 황금빛 사이오닉 오라를 뿜는 올챙이 표본 병을 발견했다. 품 안의 아스트랄 프리즘에서 수호자의 목소리가 울린다. "그 힘을 받아들이면 절대자 교단에 맞설 강력한 일리시드 권능을 얻을 수 있어… 대가가 두렵다면 부숴버려도 좋다."',
      choices: [
        { label: '🧠 올챙이의 사이오닉 힘을 흡수한다 (HP -8, 고등급 카드 보상 획득!)', type: 'guaranteed', effect: 'hp_for_rare_draft' },
        { label: '🔮 [위저드 전용] 사이오닉 파동을 비전으로 역추출한다 (무피해 카드 강화+)', type: 'guaranteed', requireClass: 'wizard', effect: 'free_upgrade_one' },
        { label: '⚔️ 유혹을 뿌리치고 표본 병을 짓밟아 파괴한다 (마석 +90 & EXP +40)', type: 'guaranteed', effect: 'gain_gems_exp' }
      ]
    },
    {
      id: 'bg3_raphael_house_of_hope',
      npcId: 'raphael',
      title: '😈 [BG3 스토리] 캄비온 라파엘의 붉은 만찬',
      desc: '손가락을 튕기는 경쾌한 소리와 함께 붉은 유황 연기가 피어오른다. 화려한 귀족 복장의 악마 라파엘이 진수성찬과 함께 피로 적힌 계약서를 내민다. "쥐구멍에 갇힌 생쥐처럼 헤매는군. 자, 내가 힘을 빌려주지 — 대가는 아주 사소한 서명 하나뿐이야."',
      choices: [
        { label: '📜 라파엘의 지옥 계약서에 서명한다 (HP -8, 고등급 희귀/전설 카드 선택!)', type: 'guaranteed', effect: 'hp_for_rare_draft' },
        { label: '🛡️ [팔라딘 전용] 신성한 맹세로 악마의 만찬을 뒤엎는다 (카드 무료 강화+)', type: 'guaranteed', requireClass: 'paladin', effect: 'free_upgrade_one' },
        { label: '🎲 라파엘의 허점을 찔러 협상한다 (D20 DC 13: 성공 시 +75 GP & 마석 +80 / 실패 시 HP -10 & 80 GP)', type: 'roll', dc: 13, successEffect: 'gain_gold_gems', failEffect: 'blood_for_gold' }
      ]
    },
    {
      id: 'bg3_withers_crypt',
      npcId: 'withers',
      title: '💀 [BG3 스토리] 잊혀진 예배당의 위더스(Withers)',
      desc: '먼지 쌓인 고대 석관이 열리며 미라처럼 마른 존재가 조용히 일어선다. 죽음의 옛 신 제르갈의 서늘한 평온을 두른 그가 묻는다. "필멸자여, 단 하나의 필멸자의 생명은 얼마의 가치를 지니는가?"',
      choices: [
        { label: '⚖️ "모든 생명은 저울로 잴 수 없이 동등하다." (위더스의 축복: 카드 1장 무료 강화+)', type: 'guaranteed', effect: 'free_upgrade_one' },
        { label: '🪙 50 GP를 바치고 운명의 실타래로 상처를 치유한다 (체력 30% 회복)', type: 'guaranteed', effect: 'paid_heal_30' },
        { label: '🕯️ 침묵으로 예를 표하고 떠난다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_astral_prism_guardian',
      npcId: 'guardian',
      title: '🔮 [BG3 스토리] 아스트랄 프리즘 속 꿈의 수호자',
      desc: '전투 사이의 짧은 휴식, 은빛 아스트랄 허공으로 의식이 빨려 들어갔다. 갑주를 두른 수호자가 빛나는 20면체 프리즘을 손에 쥔 채 다가온다. "엘더 브레인의 사념이 강해지고 있어. 네 무기를 벼려주마 — 정신을 단단히 붙잡아라."',
      choices: [
        { label: '✨ 수호자의 아스트랄 축복을 받아들인다 (카드 1장 무료 강화+)', type: 'guaranteed', effect: 'free_upgrade_one' },
        { label: '🗡️ [로그 전용] 프리즘의 숨겨진 틈새에서 아스트랄 마석을 채취한다 (마석 +90 & EXP +40)', type: 'guaranteed', requireClass: 'rogue', effect: 'gain_gems_exp' },
        { label: '🎲 수호자의 정체를 꿰뚫어 본다 (D20 통찰 DC 12: 성공 시 고등급 카드 / 실패 시 체력 +6)', type: 'roll', dc: 12, successEffect: 'hp_for_rare_draft', failEffect: 'safe_leave' }
      ]
    },
    {
      id: 'bg12_bhaalspawn_echo',
      npcId: 'jaheira',
      title: '🩸 [BG1·BG2 유산] 바알스폰의 피의 석판',
      desc: '100년 전 발더스 게이트를 뒤흔든 바알스폰 전쟁의 흔적이 남은 피의 제단. 사레복의 갑옷 파편과 이레니쿠스의 마력 잔재가 공명하며 당신의 혈관 속 잠든 투쟁 본능을 깨운다.',
      choices: [
        { label: '⚔️ 바알스폰의 전투 기억을 각성시킨다 (HP -10, SP +1 & 카드 1장 강화+)', type: 'guaranteed', effect: 'spar_for_sp' },
        { label: '🪓 [바바리안 전용] 사레복의 분노를 포효로 집어삼킨다 (무피해 카드 강화+)', type: 'guaranteed', requireClass: 'barbarian', effect: 'free_upgrade_one' },
        { label: '🕊️ 살인의 신의 속삭임을 거부하고 마음을 가다듬는다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_auntie_ethel_teahouse',
      npcId: 'jaheira',
      title: '🫖 [BG3 스토리] 에텔 이모의 안개 늪지 찻집',
      desc: '음산한 미궁 한복판에 기묘하게 아늑한 오두막이 서 있다. 인자한 미소의 "에텔 이모"가 김이 모락모락 나는 약차를 건네지만, 바닥 그림자에는 그린 해그의 긴 손톱이 비치고 있다!',
      choices: [
        { label: '🍵 해그의 기묘한 약차를 마신다 (HP -10, 황금 80 GP 획득)', type: 'guaranteed', effect: 'blood_for_gold' },
        { label: '🏹 [레인저 전용] 늪지의 환각을 간파하고 숨겨진 보급품을 챙긴다 (마석 +90 & EXP +40)', type: 'guaranteed', requireClass: 'ranger', effect: 'gain_gems_exp' },
        { label: '🚶 "사양하겠습니다, 이모." 조용히 발걸음을 돌린다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_volo_eye_surgery',
      npcId: 'volo',
      title: '👁️ [BG3 스토리] 음유시인 볼로의 안구 수술 제안',
      desc: '유명한 탐험가 볼로가 반짝이는 얼음송곳을 들고 열정적으로 다가온다. "오, 자네! 머릿속 올챙이를 꺼내는 기발한 수술법을 발명했네! 눈을 크게 뜨고 가만히만 있게나, 실패할 리 없네!"',
      choices: [
        { label: '👁️ 볼로에게 눈을 맡긴다 — 에르자츠 마법 의안 이식! (HP -10, SP +1 & 카드 강화+)', type: 'guaranteed', effect: 'spar_for_sp' },
        { label: '📖 볼로의 모험담만 들으며 휴식한다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_emerald_grove_idol',
      npcId: 'jaheira',
      title: '🌿 [BG3 스토리] 에메랄드 성소의 실바누스 우상',
      desc: '고대 드루이드 성소의 중심에서 황금빛 실바누스 우상이 자연의 마력을 뿜고 있다. 티플링 난민들을 위해 기도할지, 성소의 비전을 얻을지 선택의 순간이다.',
      choices: [
        { label: '🙏 성소에 50 GP를 시주하고 난민들과 함께 치유의 기도를 올린다 (체력 30% 회복)', type: 'guaranteed', effect: 'paid_heal_30' },
        { label: '✝️ [클레릭 전용] 성소의 신성한 빛과 공명한다 (무피해 카드 강화+)', type: 'guaranteed', requireClass: 'cleric', effect: 'free_upgrade_one' },
        { label: '🌿 자연의 가호를 받으며 마석과 경험을 얻는다 (마석 +90 & EXP +40)', type: 'guaranteed', effect: 'gain_gems_exp' }
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // 7. BESPOKE D&D / BALDUR'S GATE SKILL FLAVOR LORE FOR ALL 359 CARDS!
  // --------------------------------------------------------------------------
  const SUBCLASS_FLAVOR_TEMPLATES = {
    fighter_shared: ['소드 코스트의 베테랑 용병들이 수십 년간 갈고닦은 정통 검술.', '워터딥 수비대의 강철 방패술은 드래곤의 발톱 앞에서도 흔들리지 않는다.', '깊은 숨을 들이마시며 전장의 상처를 의지로 억누르는 전사의 호흡.', '찰나의 틈에 시간마저 추월해 연타를 쏟아붓는 전설의 무예.'],
    champion: ['발더스 게이트 투기장의 무패 검투사가 남긴 완벽한 급소 타격.', '수천 번의 단련 끝에 강철보다 단단해진 챔피언의 육체.', '관중의 함성처럼 전장을 압도하는 순수한 무력의 일격.', '치명적인 일격 하나로 전황을 뒤집는 영웅의 검기.'],
    battlemaster: ['전술 교본의 한 페이지를 전장 위에 그대로 그려내는 지휘관의 수.', '상대의 빈틈을 읽어 반격으로 되돌려주는 노련한 검사의 기술.', '불리한 전황에서도 아군과 자신을 승리로 이끄는 전장의 두뇌.', '단 한 번의 패링으로 적의 전의를 꺾어버리는 명인의 교전술.'],
    eldritch_knight: ['강철 칼날에 비전 룬을 새겨 마법과 무예를 하나로 엮어냈다.', '네더리스 검마법사들이 남긴 번개와 화염의 검기.', '손짓 한 번으로 검을 소환하고 비전 방벽을 펼치는 마검사의 비기.', '주문과 검격이 교차하는 순간, 적의 방어는 무의미해진다.'],
    echo_knight: ['아스트랄 시간선의 틈새에서 또 다른 가능성의 나를 불러낸다.', '두 개의 시간선이 겹치는 찰나, 그림자 잔상이 동시에 칼을 휘두른다.', '과거와 미래의 나와 위치를 교대하며 적의 일격을 허공으로 흘린다.', '차원 균열 너머에서 울려 퍼지는 에코 나이트의 이중 검격.'],
    barbarian_shared: ['아베르누스의 불길처럼 거침없이 내려찍는 거대 도끼의 굉음.', '갑옷 따위는 필요 없다 — 야성적인 근육과 투지가 곧 철벽이다.', '방어를 버리고 오직 파괴에 몸을 던지는 광전사의 돌격.', '혈관 속 아드레날린이 끓어오르며 고통마저 힘으로 바꾼다.'],
    berserker: ['이성의 고삐를 놓는 순간, 전장은 오직 피와 도끼의 무대가 된다.', '발더스 게이트 북부 부족 전사들의 피를 끓게 하는 광란의 포효.', '적이 쓰러질 때까지 멈추지 않는 광전사의 무자비한 난도질.', '상처가 깊어질수록 더욱 맹렬해지는 야수의 일격.'],
    totem_warrior: ['고대 곰과 독수리, 늑대의 정령이 전사의 어깨 위에 강림한다.', '대자연의 원시 수호령이 야만전사의 육체를 강철처럼 감싼다.', '숲의 최상위 포식자처럼 먹잇감을 향해 도약하는 토템의 힘.', '부족의 영혼이 깃든 문양이 붉게 빛나며 야성을 해방한다.'],
    ancestral_guardian: ['전사한 선조들의 영혼이 푸른 안개처럼 나타나 후손을 수호한다.', '고대 부족 영웅들의 방패가 적의 치명적인 일격을 가로막는다.', '선조의 분노가 적의 시선을 묶고 전장의 흐름을 지배한다.', '핏줄에 새겨진 영혼의 함성이 어둠 속 적들을 떨게 한다.'],
    wild_magic: ['페이와일드의 변덕스러운 마력이 도끼 끝에서 무지갯빛으로 폭발한다.', '예측할 수 없는 야생 마법의 파동이 적과 전장을 뒤흔든다.', '마력의 소용돌이를 몸으로 받아내어 순수한 파괴력으로 바꾼다.', '광기와 요정 마법이 뒤섞인 예측 불허의 일격.'],
    rogue_shared: ['발더스 게이트 뒷골목의 길드원들이 애용하는 맹독 단검술.', '그림자 속으로 미끄러지듯 몸을 숨겨 적의 시야에서 사라진다.', '찰나의 틈을 파고들어 전장을 농락하는 교활한 발놀림.', '적의 빈틈이 열리는 순간, 치명적인 급소 일격이 꽂힌다.'],
    thief: ['눈보다 빠른 손놀림으로 전장의 주도권과 전리품을 훔쳐낸다.', '지붕 위를 날아다니며 연막과 함정으로 적을 교란하는 괴도의 기술.', '어떤 자물쇠도, 어떤 방어선도 대도의 손끝에선 열리고 만다.', '금화와 단검이 동시에 번쩍이는 발더스 게이트 도적 길드의 비기.'],
    assassin: ['와이번의 맹독을 바른 칼날은 스치기만 해도 죽음을 예약한다.', '바알의 그림자 교단에서 전수된 무음 암살의 극의.', '표적이 눈치챘을 때는 이미 심장에 단검이 꽂힌 뒤다.', '독안개와 어둠 속에서 완벽한 일격을 완성하는 암살자의 미학.'],
    arcane_trickster: ['보이지 않는 마법사의 손이 적의 허점을 교묘하게 파고든다.', '거울 분신과 환영 단검으로 적의 감각을 완벽히 속여 넘긴다.', '비전 마법과 도적의 기지를 결합한 영리한 트릭스터의 묘수.', '진짜와 가짜의 경계를 허물며 치명타를 꽂아 넣는 환영술.'],
    phantom: ['죽음의 문턱에서 울려 퍼지는 망자들의 통곡이 칼날에 깃든다.', '영혼의 토큰에 봉인된 원념이 적의 생명력을 직접 베어낸다.', '산 자와 죽은 자의 경계를 걷는 유령 암살자의 서늘한 속삭임.', '섀도우펠의 차가운 안개가 단검 끝에서 영혼을 수확한다.'],
    ranger_shared: ['엘프 장궁의 시위가 울리는 순간, 바람을 가르는 화살이 명중한다.', '언더다크와 대삼림에서 살아남은 정찰병의 완벽한 위장술.', '한 번 사냥꾼의 징표가 찍힌 먹잇감은 끝내 도망칠 수 없다.', '자연의 축복이 담긴 굿베리가 지친 모험가의 기력을 되살린다.'],
    hunter_conclave: ['거대 괴수의 약점을 꿰뚫기 위해 고안된 사냥꾼의 정밀 사격.', '몰려드는 무리를 단숨에 꿰뚫어 버리는 연쇄 화살비.', '쌍시미터와 장궁을 자유자재로 오가는 전설의 거수 학살자.', '사냥터의 지형을 완벽히 장악하는 베테랑 레인저의 감각.'],
    beast_master: ['아스트랄 표범 구엔위바의 날카로운 발톱이 어둠을 가른다.', '사냥꾼과 영혼으로 이어진 야수가 완벽한 호흡으로 협공한다.', '주인을 지키기 위해 몸을 던지는 충직한 야수의 수호 본능.', '원시의 포효와 화살이 동시에 적의 숨통을 조여온다.'],
    gloom_stalker: ['빛 한 점 없는 언더다크의 어둠은 오히려 글룸 스토커의 무대다.', '어둠 속에서 첫 번째 일격을 날릴 때, 적은 그림자조차 보지 못한다.', '흔적 없는 발걸음으로 매복해 공포의 연사를 퍼붓는다.', '암흑 시야 너머로 정확히 심장을 겨누는 심연의 저격수.'],
    fey_wanderer: ['페이와일드의 매혹적인 안개와 가시덩굴이 전장을 뒤덮는다.', '아름다운 미소 뒤에 숨겨진 요정계의 서늘한 정신 타격.', '안개 걸음으로 공간을 도약하며 꽃잎과 가시를 동시에 흩뿌린다.', '요정 여왕의 축복이 깃든 환상적인 무기술.'],
    wizard_shared: ['미스트라의 위브(Weave)를 손끝으로 엮어 불꽃 화살을 쏘아낸다.', '보이지 않는 비전 역장이 마법사의 몸을 갑옷처럼 감싼다.', '결코 빗나가지 않는 순수 마력의 화살이 적을 끝까지 추적한다.', '찰나의 영창으로 치명적인 공격을 튕겨내는 비전 방어술.'],
    evocation: ['원소의 분노를 순수한 파괴의 불꽃과 번개로 해방하는 방출학파.', '손바닥에서 터져 나오는 작열 광선이 전장을 화염 바다로 물들인다.', '카서스의 옛 제국에서도 두려워했던 파괴 마법의 정수.', '화염과 냉기, 전격이 어우러진 대마도사의 궁극 원소술.'],
    abjuration: ['겹겹이 쌓아 올린 비전 수호막이 어떤 주문과 칼날도 무력화한다.', '적의 마법을 허공에서 지워버리는 완벽한 마법 무효화.', '고대 방호의 문양이 바닥에 새겨지며 침입자를 심판한다.', '방어 자체가 최강의 무기가 되는 방호학파의 비전 결계.'],
    necromancy: ['죽음의 문턱을 넘나들며 망자의 기운과 냉기를 불러낸다.', '도리깨 종소리가 울릴 때마다 상처 입은 적의 생명이 시들어간다.', '금단의 사령술로 영혼을 흡수해 거짓된 생명력을 빚어낸다.', '아세라락조차 경계한 심연의 사령학파 비술.'],
    divination: ['예지 주사위로 미래의 한 장면을 엿보고 운명을 유리하게 비튼다.', '적의 마음을 꿰뚫는 정신 쐐기와 진실의 시선.', '이미 예견된 승리를 향해 정확히 수를 놓는 예지학파의 지혜.', '별자리와 시간의 실타래를 읽어내는 대현자의 통찰.'],
    cleric_shared: ['하늘에서 쏟아지는 신성한 불꽃이 어둠의 피조물을 정화한다.', '신앙의 방패가 모험가의 영혼과 육신을 굳건히 지켜낸다.', '빛의 화살이 적을 비추며 다음 아군의 일격을 인도한다.', '성스러운 영혼 수호자들이 사제의 주위를 선회하며 악을 징벌한다.'],
    life_domain: ['라센더와 셀루네의 자비가 상처 입은 육신에 새 생명을 불어넣는다.', '치유의 기도가 넘쳐흘러 단단한 신성 보호막으로 승화한다.', '절망적인 전투에서도 끝내 쓰러지지 않게 지탱하는 생명의 축복.', '가장 어두운 심연 속에서 피어나는 불멸의 치유 광휘.'],
    light_domain: ['눈부신 수호의 섬광이 적의 시야를 태우고 공격을 빗나가게 한다.', '섀도우펠의 저주마저 불태워버리는 정오의 태양 광휘.', '요정 불꽃과 타오르는 빛줄기가 어둠 속 숨은 적을 드러낸다.', '태양신의 진노를 지상에 강림시키는 빛 권역의 성화.'],
    war_domain: ['전쟁신 템푸스의 가호 아래 사제의 철퇴가 번개처럼 내리꽂힌다.', '영체 대검이 허공에 소환되어 신의 이름으로 적을 심판한다.', '기도와 함성이 하나로 어우러진 전쟁 사제의 맹공.', '신성한 갑주와 흔들리지 않는 투지로 전선의 선두에 선다.'],
    grave_domain: ['삶과 죽음의 경계를 수호하는 무덤 권역의 냉철한 심판.', '죽어가는 자를 구하고 불경한 언데드를 영면으로 인도한다.', '무덤의 눈길이 적의 치명적인 약점을 꿰뚫어 부패의 저주를 내린다.', '케렘보르의 저울이 기울어지며 적의 운명을 선고한다.'],
    paladin_shared: ['성스러운 맹세가 깃든 성검이 어둠을 가르고 찬란히 빛난다.', '동료를 위해 가장 먼저 앞을 가로막는 성기사의 강철 방패.', '칼날이 닿는 순간 하늘의 천벌이 함께 내려꽂히는 신성한 강타!', '손을 얹는 것만으로 치명적인 상처를 닫는 안수 치료의 기적.'],
    devotion: ['어떠한 유혹과 타락 앞에서도 순수한 빛을 지키는 헌신의 성역.', '천둥 같은 신성 강타로 불경한 존재들을 전장에서 퇴치한다.', '정의와 명예의 맹세가 성기사의 검을 태양처럼 타오르게 한다.', '발더스 게이트의 수호자들이 대대로 계승한 고결한 성검술.'],
    vengeance: ['악을 향한 타오르는 분노가 적의 도주로를 끝까지 추적한다.', '자비 없는 심판관의 검격이 죄인에게 가혹한 대가를 치르게 한다.', '안개 걸음으로 단숨에 거리를 좁혀 분노의 강타를 꽂아 넣는다.', '복수의 맹세 앞에서는 신조차 적을 용서하지 않는다.'],
    conquest: ['천상의 그리폰 군마와 함께 전장을 짓밟는 압도적인 정복의 위엄.', '적의 심장에 공포를 심어 무릎 꿇게 만드는 철권의 오라.', '전장의 지배자로 군림하며 모든 저항을 분쇄하는 기마 돌격.', '질서와 힘으로 혼돈을 평정하는 정복의 맹세.'],
    oathbreaker: ['깨어진 맹세의 자리에서 검붉은 어둠과 지옥의 불꽃이 타오른다.', '타락한 데스나이트의 권능으로 적에게 끔찍한 공포와 상처를 새긴다.', '빛을 버린 대신 얻어낸 금지된 지옥의 질책과 파멸의 검술.', '어둠마저 복종시키는 배반의 흑기사의 압도적인 저주.'],
    warlock_shared: ['차원 너머 초월적 존재와 맺은 계약이 보랏빛 파열 광선으로 터진다.', '악마의 갑옷과 아가시스의 서리가 계약자의 육신을 감싼다.', '주술의 낙인이 찍힌 적은 매 순간 고통스러운 저주에 시달린다.', '금지된 대가로 손에 넣은 가장 순수한 공허의 마력.'],
    fiend_patron: ['나인 헬의 대악마가 하사한 지옥불이 전장을 잿더미로 바꾼다.', '적을 쓰러뜨릴 때마다 어둠의 존재가 뜨거운 생명력을 하사한다.', '유황과 불길 속에서 강림한 지옥마신 핀드의 맹렬한 협공.', '아베르누스의 계약 불꽃은 방패마저 녹여버린다.'],
    hexblade: ['섀도우펠의 지성 있는 마검과 영혼을 결속한 저주 검사의 비기.', '헥스블레이드의 저주가 새겨진 적은 피할 수 없는 치명타를 맞는다.', '칼날이 피에 굶주릴수록 어둠의 마력이 검신을 휘감는다.', '중갑과 비전 방패, 그리고 영혼을 베는 마검의 완벽한 조화.'],
    great_old_one: ['별들 너머 위대한 옛 존재의 시선이 적의 이성을 산산조각 낸다.', '불협화음의 속삭임과 엔트로피 방패가 현실의 법칙을 왜곡한다.', '일리시드마저 두려워하는 태고의 우주적 공포가 전장에 스며든다.', '각성한 정신의 파동이 적의 의지를 심연으로 끌어내린다.'],
    archfey_chain: ['사슬의 계약으로 묶인 영리한 임프와 요정 사역마가 전장을 누빈다.', '카르체리의 사슬이 적을 속박하고 사역마 군단의 총진격을 지휘한다.', '투명화와 맹독 침으로 적의 허점을 찌르는 계약 사역마의 기습.', '요정 군주와 심연의 사슬이 빚어낸 치명적인 소환 마법.'],
    status_curse: ['미궁의 저주와 끔찍한 상태이상이 모험가의 손패와 정신을 짓누른다.', '전투의 상흔과 절대자 교단의 어둠이 남긴 불길한 잔재.']
  };

  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function buildFlavorForCard(card) {
    if (card.flavor) return card.flavor;
    const id = card.id || '';
    const SIGNATURE_FLAVORS = {
      ftr_sh_1: '소드 코스트 전역의 전사들이 가장 먼저 익히는 정통 강철 검술.',
      ftr_sh_4: '찰나의 집중으로 한계를 넘어서는 파이터의 상징 — 행동 연쇄.',
      bar_sh_4: '아베르누스의 불꽃처럼 끓어오르는 분노가 모든 고통을 삼킨다.',
      rog_sh_4: '적의 시선이 흔들리는 0.1초, 암살자의 칼날이 급소를 꿰뚫는다.',
      rng_sh_3: '한 번 사냥꾼의 눈에 각인된 표적은 언더다크 끝까지 추적당한다.',
      wiz_sh_1: '미스트라의 위브를 손끝으로 엮어 쏘아내는 가장 기본이자 완벽한 화염탄.',
      wiz_sh_3: '결코 빗나가지 않는 비전 화살들이 어둠 속 적을 정확히 찾아간다.',
      clr_sh_1: '하늘에서 떨어지는 정화의 불꽃이 언데드와 악을 재로 돌린다.',
      pal_sh_3: '검이 닿는 순간 천상의 벼락이 함께 작렬하는 성기사의 궁극 심판.',
      wlk_sh_1: '초월적 존재와 맺은 계약의 힘 — 보랏빛 섬뜩한 파열 광선이 허공을 찢는다.',
      status_slimed: '끈적한 언더다크 점액이 장비와 손패에 들러붙어 움직임을 둔화시킨다.',
      status_burn: '아베르누스의 꺼지지 않는 유황 불꽃이 손끝을 태운다.',
      status_dazed: '일리시드 올챙이의 사이오닉 충격이 머릿속을 하얗게 마비시킨다.',
      status_wound: '깊게 패인 상처가 전투 내내 덱의 순환을 방해한다.',
      curse_pain: '절대자 교단과 바알의 저주가 영혼 깊숙이 새겨져 고통을 남긴다.'
    };
    if (SIGNATURE_FLAVORS[id]) return SIGNATURE_FLAVORS[id];
    const key =
      card.type === 'status' || card.type === 'curse' ? 'status_curse'
        : card.subclassId && SUBCLASS_FLAVOR_TEMPLATES[card.subclassId] ? card.subclassId
          : card.classId && SUBCLASS_FLAVOR_TEMPLATES[`${card.classId}_shared`] ? `${card.classId}_shared`
            : 'fighter_shared';
    const pool = SUBCLASS_FLAVOR_TEMPLATES[key] || SUBCLASS_FLAVOR_TEMPLATES.fighter_shared;
    let line = pool[hashStr(id || card.name || 'lore') % pool.length];
    if (card.rarity === 'legendary') line = `★ [전설 비기] ${line}`;
    else if (card.rarity === 'rare') line = `◆ ${line}`;
    return line;
  }

  function applyStoryToGameData(gameData) {
    if (!gameData) return;
    if (Array.isArray(gameData.acts)) {
      const actTitles = {
        1: { name: '제1계층: 하품하는 포털 지하 & 고블린 성채', subtitle: '노틸로이드 추락과 탈취된 언더마운틴 제1차원문 (Stage 1~15)' },
        2: { name: '제2계층: 언더다크 & 롤스의 거미 신전', subtitle: '그림포지와 샤의 그림자 저주가 드리운 지하 세계 (Stage 1~15)' },
        3: { name: '제3계층: 달오름 탑 지하 일리시드 군락', subtitle: '카서스의 왕관에 속박된 엘더 브레인과 네더스톤의 진실 (Stage 1~15)' },
        4: { name: '제4계층: 섀도우펠 & 바알스폰의 무덤', subtitle: 'BG1·BG2 바알스폰의 유산과 아세라락의 공포의 무덤 (Stage 1~15)' },
        5: { name: '제5계층: 나인 헬 아베르누스 & 최후의 신전', subtitle: '라파엘의 희망의 집, 자리에르, 그리고 오색룡 티아마트 결전 (Stage 1~15)' }
      };
      gameData.acts.forEach(a => {
        if (actTitles[a.act]) { a.name = actTitles[a.act].name; a.subtitle = actTitles[a.act].subtitle; }
      });
    }
    if (Array.isArray(gameData.events)) {
      const existing = new Set(gameData.events.map(e => e.id));
      BG_EVENTS.forEach(ev => { if (!existing.has(ev.id)) { gameData.events.push(ev); existing.add(ev.id); } });
    }
    if (gameData.cards) {
      Object.values(gameData.cards).forEach(card => { card.flavor = buildFlavorForCard(card); });
    }
  }

  window.STORY_ENGINE = {
    NPCS,
    CLASS_ORIGINS,
    ACT_CHAPTERS,
    VICTORY_EPILOGUE,
    BOSS_INTROS,
    BG_EVENTS,
    getActDialogueScene,
    getTavernNpcDialogue,
    applyStoryToGameData
  };

  if (window.GAME_DATA) {
    applyStoryToGameData(window.GAME_DATA);
  }
})();
