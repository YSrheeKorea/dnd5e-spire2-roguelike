// ============================================================================
// D&D 5E SPIRE II — ORIGINAL DARK-FANTASY NARRATIVE ENGINE (story.js)
// - 1 Unified Original Main Story: 《다섯 개의 인장: 부서진 천칭의 탑》
//   (Prologue + Five Seals Arc + Final Victory Epilogue)
// - 5 Floors x 3 Boss-Linked Story Episodes = 15 Episodes (Stage 1 / Stage 8 / Stage 15)
//   Every episode weaves in the ACTUAL rolled Floor Boss (all 20 Bosses bespoke!)
// - Natural Narration (speaker:'narrator') + Grounded Dialogue ('hero'|'npc'|'boss')
// - 6 Animated 80x80 Hi-Bit NPCs (x6 Emotions = 36 unique assets)
// - 8 Spire Story Events + 20 Boss Intros + 359 Card Lore Flavors
// ============================================================================
(function () {
  // --------------------------------------------------------------------------
  // 0. 80x80 HI-BIT NATURAL PIXEL-ART NPC SPRITE RENDERER (6 Emotions Each!)
  // --------------------------------------------------------------------------
  function renderHiBitNpc(drawFn, aura = '#f6c967', motion = 'px-motion-agile', emotion = 'neutral') {
    const art = typeof window !== 'undefined' ? window.HIBIT_ART : null;
    if (!art) return '';
    return art.renderAnimatedSprite(80, 80, (c, f) => drawFn(c, f, art, emotion), { aura, motion });
  }

  const NPC_DRAWERS = {
    durnan: (c, f, art, emotion = 'neutral') => {
      art.drawHiBitHeroBase(c, f, {
        emotion,
        skin: '#e6b896', armor: '#784212', pauldron: '#5d3410', belt: '#2f3640',
        trim: '#f6c967', boots: '#3d2616', eye: '#74b9ff', tunicSkirt: '#dfe6e9',
        drawHeadgear: (c, cx, b) => {
          c.hairCap(cx, 18 + b, 15.2, 8.2, '#576574');
          c.oval(cx, 37 + b, 11.5, 6.2, '#576574', { texture: 'fur' });
          c.oval(cx, 40 + b, 7.5, 4.2, '#8395a7', { texture: 'fur' });
        },
        drawGear: (c, cx, b, f) => {
          c.sword(cx - 21, 10 + b, 46 + b, 2.8, '#b2bec3', '#f6c967', '#5d3410');
          c.plate(cx + 18, 43 + b - f * 2, 12, 15, '#d4a017', { metallic: true, round: 2 });
          c.oval(cx + 24, 42 + b - f * 2, 6.5, 3.2, '#ffffff');
          c.oval(cx + 22, 41 + b - f * 2, 3.0, 2.2, '#f5f6fa');
        }
      });
    },
    jaheira: (c, f, art, emotion = 'neutral') => {
      art.drawHiBitHeroBase(c, f, {
        emotion,
        skin: '#ecc2a0', armor: '#1e6b43', pauldron: '#14472c', cape: '#123e27',
        belt: '#5c3c24', trim: '#f6c967', boots: '#3d281a', eye: '#2ed573', tunicSkirt: '#185936',
        drawHeadgear: (c, cx, b) => {
          c.hairCap(cx, 18 + b, 15.6, 9.6, '#c8d6e5', { sideLocks: 17 });
          c.plate(cx - 3, 42 + b, 7, 7, '#f6c967', { metallic: true, round: 2 });
        },
        drawGear: (c, cx, b, f) => {
          c.curve(cx - 19, 53 + b, cx - 28, 40 + b - f * 2, cx - 31, 24 + b - f * 2, 2.8, 1.0, '#ecf0f1', { metallic: true });
          c.curve(cx + 19, 53 + b, cx + 28, 40 + b + f * 2, cx + 31, 24 + b + f * 2, 2.8, 1.0, '#ecf0f1', { metallic: true });
        }
      });
    },
    guardian: (c, f, art, emotion = 'neutral') => {
      art.drawHiBitHeroBase(c, f, {
        emotion,
        skin: '#dcd6f7', armor: '#4834d4', pauldron: '#341f97', cape: '#192a56',
        trim: '#00d2d3', boots: '#192a56', eye: '#00d2d3', metalArmor: true, tunicSkirt: '#341f97',
        drawHeadgear: (c, cx, b) => {
          c.hairCap(cx, 18 + b, 16, 10, '#6c5ce7', { sideLocks: 18 });
          c.plate(cx - 12, 18 + b, 25, 2, '#f6c967', { metallic: true });
        },
        drawGear: (c, cx, b, f) => {
          const py = 33 + b - f * 4;
          c.glow(cx + 24, py, 13, '#ffffff', '#00d2d3', '#6c5ce7');
          c.oval(cx + 24, py, 8.2, 8.2, '#00d2d3', { metallic: true });
          c.plate(cx + 20, py - 4, 8, 8, '#a29bfe', { metallic: true, round: 2 });
          c.oval(cx + 23, py - 2, 2.4, 2.4, '#ffffff', { shaded: false });
        }
      });
    },
    withers: (c, f, art, emotion = 'neutral') => {
      art.drawHiBitHeroBase(c, f, {
        emotion,
        skin: '#d1ccc0', armor: '#3d312a', pauldron: '#b7791f', cape: '#1e1918',
        trim: '#f6c967', boots: '#1e1918', noEyes: true, tunicSkirt: '#2e241f',
        drawHeadgear: (c, cx, b, f, emo) => {
          c.oval(cx, 22 + b, 17.6, 14, '#b7791f', { metallic: true });
          c.oval(cx, 27 + b, 12.6, 10.6, '#d1ccc0');
          c.oval(cx - 5.5, 26 + b, 3.6, 3.2, '#10101a', { shaded: false });
          c.oval(cx + 5.5, 26 + b, 3.6, 3.2, '#10101a', { shaded: false });
          const ec = emo === 'angry' ? '#ff4757' : emo === 'happy' ? '#ffd32a' : emo === 'sad' ? '#74b9ff' : emo === 'surprised' ? '#ffffff' : emo === 'smug' ? '#e056fd' : '#7ed6df';
          const er = emo === 'surprised' ? 2.6 : 1.8;
          c.glowEye(cx - 5.5, 26 + b, ec, er);
          c.glowEye(cx + 5.5, 26 + b, ec, er);
        },
        drawGear: (c, cx, b, f) => {
          const sy = 40 + b - f * 3;
          c.glow(cx + 24, sy + 6, 10, '#ffffff', '#f6e58d', '#7ed6df');
          c.plate(cx + 18, sy, 12, 16, '#f6e58d', { round: 2, trim: '#f6c967' });
          c.plate(cx + 17, sy - 2, 14, 3, '#b7791f', { metallic: true, round: 1 });
          c.plate(cx + 17, sy + 15, 14, 3, '#b7791f', { metallic: true, round: 1 });
        }
      });
    },
    raphael: (c, f, art, emotion = 'neutral') => {
      art.drawHiBitHeroBase(c, f, {
        emotion,
        skin: '#f2d4cc', armor: '#781023', pauldron: '#4a0915', cape: '#240811',
        trim: '#f6c967', boots: '#1c060c', eye: '#ff4757', tunicSkirt: '#5c0c1b',
        drawHeadgear: (c, cx, b) => {
          c.hairCap(cx, 17 + b, 15.2, 8.2, '#1e1e2c');
          c.curve(cx - 11, 14 + b, cx - 20, 9 + b, cx - 23, 3 + b, 3.4, 1.0, '#ff4757');
          c.curve(cx + 11, 14 + b, cx + 20, 9 + b, cx + 23, 3 + b, 3.4, 1.0, '#ff4757');
        },
        drawGear: (c, cx, b, f) => {
          const cy = 40 + b - f * 3;
          c.plate(cx + 18, cy, 12, 15, '#ffeaa7', { round: 2, trim: '#c0392b' });
          c.glow(cx + 24, cy - 5, 10, '#ffffff', f ? '#ff9f43' : '#ff4757', '#c0392b');
          c.curve(cx + 24, cy, cx + 21 + f * 4, cy - 7, cx + 24, cy - 13, 4.6, 1.1, f ? '#ff9f43' : '#ff4757');
        }
      });
    },
    volo: (c, f, art, emotion = 'neutral') => {
      art.drawHiBitHeroBase(c, f, {
        emotion,
        skin: '#f7d2b4', armor: '#2980b9', pauldron: '#1b4f72', cape: '#154360',
        trim: '#f6c967', boots: '#5d4037', eye: '#3498db', tunicSkirt: '#1f618d',
        drawHeadgear: (c, cx, b, f) => {
          c.oval(cx, 17 + b, 18, 7.2, '#2980b9');
          c.curve(cx + 8, 14 + b, cx + 20, 8 + b - f * 2, cx + 27, 2 + b - f * 2, 3.6, 1.0, '#ff6b81');
          c.oval(cx, 35 + b, 9.5, 2.8, '#6d4c41');
        },
        drawGear: (c, cx, b, f) => {
          c.plate(cx + 18, 43 + b, 12, 15, '#8d5524', { round: 2, trim: '#f6c967' });
          c.curve(cx + 24, 42 + b - f * 2, cx + 28, 33 + b - f * 2, cx + 32, 23 + b - f * 2, 2.2, 0.7, '#ffffff');
        }
      });
    }
  };

  const NPCS = {
    durnan: {
      id: 'durnan',
      name: '더난',
      title: '잿빛 화덕 여관 주인 · 옛 원정대 생존자',
      faction: '심연 입구 수문장',
      accent: '#f6c967',
      icon: '🍺',
      motion: 'px-motion-heavy',
      svg: ''
    },
    jaheira: {
      id: 'jaheira',
      name: '자헤이라',
      title: '봉인 감시단 척후대장',
      faction: '은빛 나뭇잎 척후대',
      accent: '#2ed573',
      icon: '🌿',
      motion: 'px-motion-agile',
      svg: ''
    },
    guardian: {
      id: 'guardian',
      name: '천칭의 잔영',
      title: '깨진 인장에 깃든 옛 봉인자의 의지',
      faction: '다섯 인장의 수호자',
      accent: '#a29bfe',
      icon: '🔮',
      motion: 'px-motion-float',
      svg: ''
    },
    withers: {
      id: 'withers',
      name: '위더스',
      title: '잿빛 묘비의 불사 기록관',
      faction: '망자들의 증인',
      accent: '#7ed6df',
      icon: '💀',
      motion: 'px-motion-float',
      svg: ''
    },
    raphael: {
      id: 'raphael',
      name: '라파엘',
      title: '탑의 균열을 떠도는 붉은 계약자',
      faction: '심연의 거래상',
      accent: '#ff4757',
      icon: '😈',
      motion: 'px-motion-float',
      svg: ''
    },
    volo: {
      id: 'volo',
      name: '볼로',
      title: '겁 없는 떠돌이 괴물 기록자',
      faction: '유랑 연대기 작가',
      accent: '#74b9ff',
      icon: '🎻',
      motion: 'px-motion-agile',
      svg: ''
    }
  };

  const _npcEmotionCache = {};
  function getNpcEmotionSprite(npcId, emotion = 'neutral') {
    const id = NPCS[npcId] ? npcId : 'durnan';
    const valid = ['neutral', 'happy', 'angry', 'sad', 'surprised', 'smug'];
    const emo = valid.includes(emotion) ? emotion : 'neutral';
    const key = `${id}::${emo}`;
    if (!_npcEmotionCache[key]) {
      const npc = NPCS[id];
      _npcEmotionCache[key] = renderHiBitNpc(NPC_DRAWERS[id], npc.accent, npc.motion, emo);
    }
    return _npcEmotionCache[key];
  }

  function rebuildNpcSprites() {
    Object.keys(_npcEmotionCache).forEach(k => delete _npcEmotionCache[k]);
    Object.keys(NPCS).forEach(id => {
      const npc = NPCS[id];
      if (NPC_DRAWERS[id]) {
        npc.svg = getNpcEmotionSprite(id, 'neutral');
      }
    });
  }
  rebuildNpcSprites();

  // --------------------------------------------------------------------------
  // 1. 1 UNIFIED ORIGINAL MAIN STORY: 《다섯 개의 인장: 부서진 천칭의 탑》
  // --------------------------------------------------------------------------
  const MAIN_STORY = {
    title: '다섯 개의 인장: 부서진 천칭의 탑',
    subtitle: 'MAIN STORY · 붉은 월식의 밤, 다섯 층으로 뒤집힌 봉인의 첨탑',
    synopsis: [
      '삼백 년 전, 대륙 북부의 지하 심연에 세워진 「천칭의 첨탑」은 세상을 삼키려던 다섯 재앙의 군주를 층층이 가두던 거대한 봉인탑이었다.',
      '지난 붉은 월식의 밤, 탑 최상층의 다섯 번째 인장이 안쪽에서 부서지며 탑은 다섯 계층의 왜곡된 미궁으로 뒤집혔다. 각 층의 지배자들은 부서진 인장 조각을 삼켜 힘을 키우며 지상으로 기어 올라올 기회를 엿보고 있다.',
      '선발 원정대가 전멸한 그날 밤, 유일하게 살아 돌아온 당신의 손등에는 깨진 인장의 파편 하나가 박혀 있다. 인장은 제 짝을 향해 뜨겁게 맥동한다 — 다섯 층의 군주들을 꺾고 다섯 인장을 되찾는 것이, 이 세계를 구하고 당신의 목숨을 지킬 유일한 길이다.'
    ],
    epilogue: {
      chapter: 'MAIN STORY · EPILOGUE',
      title: '다섯 번째 인장이 닫히는 새벽',
      paragraphs: [
        '최후의 군주가 무너지자, 손등에 박혀 있던 파편이 다섯 인장과 하나로 맞물리며 눈부신 백광을 토해냈다. 뒤틀려 있던 다섯 계층의 미궁이 천천히 제자리를 찾으며 심연의 균열이 닫힌다.',
        '잿빛 화덕 여관의 우물 위로 차가운 새벽바람이 불어온다. 더난은 말없이 낡은 검을 벽에 다시 걸었고, 자헤이라는 부러진 나뭇잎 배지를 쥔 채 오랜만에 어깨의 힘을 풀었다.',
        '위더스가 낡은 장부의 마지막 장을 덮는 소리가 고요히 울린다. 붉은 월식의 악몽은 끝났고, 당신의 이름만이 부서진 천칭의 새 주인으로 남았다.'
      ]
    }
  };

  // --------------------------------------------------------------------------
  // 2. 8 CLASS ORIGIN MOTIVES (Grounded in the Five Seals Main Story!)
  // --------------------------------------------------------------------------
  const CLASS_ORIGINS = {
    fighter: {
      title: '전멸한 선발대의 마지막 방패',
      quote: '"동료들이 문 앞을 막아선 덕에 나만 살아 올라왔다. 손등의 이 인장이 식기 전에, 저 밑의 괴물들에게 빚을 갚겠다."'
    },
    barbarian: {
      title: '붉은 월식에 불탄 부족의 생존자',
      quote: '"탑이 뒤집히던 밤, 우리 설원 마을이 통째로 재가 됐다. 봉인이든 신이든 상관없어 — 내 도끼로 맨 꼭대기 놈의 목을 베면 끝난다."'
    },
    rogue: {
      title: '금고 대신 인장을 훔쳐버린 도적',
      quote: '"원래는 탑 1층 금고만 털고 빠질 작정이었는데… 젠장, 이 저주받은 인장 파편이 손등에 들러붙어 떨어지질 않아."'
    },
    ranger: {
      title: '말라 죽어가는 숲의 추적자',
      quote: '"탑에서 새어 나온 검은 안개가 북부 대삼림을 썩게 만들고 있다. 짐승들의 울음이 완전히 멎기 전에 근원을 끊어야 해."'
    },
    wizard: {
      title: '금단의 봉인식을 해독한 마도사',
      quote: '"천칭의 인장이 스스로 부서졌을 리 없다. 누군가 안에서 빗장을 연 거야… 다섯 층 끝에 숨은 진실을 반드시 확인하겠다."'
    },
    cleric: {
      title: '꺼져가는 등불의 순례 사제',
      quote: '"붉은 월식 이후 죽은 자들이 안식을 잃고 떠돌고 있습니다. 쓰러진 원정대원들의 영혼을 위해서라도 인장을 다시 닫겠습니다."'
    },
    paladin: {
      title: '부러진 서약을 잇는 성기사',
      quote: '"삼백 년 전 이 탑을 봉인했던 선조들의 맹세가 무너졌습니다. 다섯 재앙이 지상에 발을 딛기 전에 내 검으로 막아세우겠습니다."'
    },
    warlock: {
      title: '심연의 균열과 거래한 이단자',
      quote: '"손등의 파편이 속삭이는 목소리가 낯설지 않군. 좋다 — 저 탑의 군주들이 탐내는 힘, 내가 직접 회수해 주지."'
    }
  };

  // --------------------------------------------------------------------------
  // 3. BESPOKE LORE PROFILES FOR ALL 20 ACT BOSSES (Woven into ALL 3 Floor Episodes!)
  // --------------------------------------------------------------------------
  const BOSS_LORE = {
    // --- ACT 1: 제1계층 침수된 밀수굴 & 고블린 성채 (첫 번째 인장: 탐욕의 인장) ---
    beholder_xanathar: {
      name: '비홀더 군주 자나사르',
      epithet: '열 개의 눈을 가진 밀수굴의 폭군',
      sealName: '첫 번째 인장 · 탐욕의 쇠사슬',
      trace: '벽면 곳곳에 눈알 모양의 황금 낙인이 새겨져 있고, 깨진 어항 옆으로 돌처럼 굳어버린 도굴꾼들의 석상이 늘어서 있다.',
      midThreat: '자나사르가 1층의 인장 파편을 제 보물 금고에 숨겨두고, 다가오는 모든 침입자를 석화 광선으로 조각상 삼고 있다는 소문이 돌고 있다.',
      confront1: '"어라, 내 금붕어 실가가 놀라잖아! 감히 내 금고 문 앞까지 기어오다니, 제법 끈질긴 쥐새끼군."',
      confront2: '"네 손등에서 빛나는 그 조각… 아주 예쁘네! 네 몸을 돌로 굳힌 뒤에 내 보물 진열장에 세워두마!"',
      heroReply: '"남의 목숨을 장식품처럼 세워둔 취미는 오늘로 끝이다. 첫 번째 인장을 내놔라, 자나사르."',
      afterDefeat: '안티매직 광선이 흩어지자 깨진 왕관 아래에서 첫 번째 인장 파편이 차갑게 굴러떨어졌다.'
    },
    young_green_dragon: {
      name: '그린 드래곤 베놈팽',
      epithet: '독안개의 둥지를 튼 어린 고룡',
      sealName: '첫 번째 인장 · 탐욕의 쇠사슬',
      trace: '바닥의 돌판마다 시퍼런 산성 맹독이 부글거리며 녹아내린 거대한 발톱 자국이 깊게 파여 있다.',
      midThreat: '어린 녹룡 베놈팽이 부서진 탑의 틈을 타고 1층을 통째로 둥지로 삼은 채, 인장의 마력을 들이마시며 급격히 거대해지고 있다.',
      confront1: '"크르르… 썩은 고블린들만 먹다 보니 지겨웠는데, 제법 튼튼한 먹잇감이 제 발로 찾아왔구나."',
      confront2: '"인장을 돌려달라고? 우습군. 내 숨결에 뼈까지 녹아내리기 전에 무릎부터 꿇어라!"',
      heroReply: '"아직 껍질도 덜 마른 용 따위에게 탑의 첫 문을 내줄 순 없다. 독안개째로 베어주마."',
      afterDefeat: '독안개가 걷히고, 쓰러진 용의 비늘 틈에서 첫 번째 인장 파편이 푸른 빛을 되찾았다.'
    },
    ettin_king_gror: {
      name: '쌍두 거인 왕 그로르',
      epithet: '성채를 짓밟은 두 머리의 폭군',
      sealName: '첫 번째 인장 · 탐욕의 쇠사슬',
      trace: '두꺼운 참나무 방벽이 종잇장처럼 찢겨 있고, 양쪽으로 갈라진 거대한 몽둥이 자국이 통로 끝까지 이어져 있다.',
      midThreat: '고블린 부족을 힘으로 굴복시킨 쌍두 거인 그로르가 1층 인장을 목걸이처럼 꿰어 차고 성채 문을 통째로 막아섰다.',
      confront1: '"왼쪽 머리: 저 작은 놈 손이 반짝거린다! / 오른쪽 머리: 바보야, 내 목걸이랑 똑같은 돌이잖아!"',
      confront2: '"둘 다 함께: 시끄러워! 둘 다 납작하게 뭉개버리면 반짝이는 돌이 두 개가 된다!"',
      heroReply: '"머리가 둘이라서 욕심도 두 배인가 보군. 둘 다 한꺼번에 잠재워 주마."',
      afterDefeat: '거인이 무너지며 끊어진 쇠사슬 사이로 첫 번째 인장 파편이 묵직하게 떨어졌다.'
    },
    goblin_shaman_king: {
      name: '홉고블린 대장군 마그도르',
      epithet: '잿빛 성채의 화염 주술왕',
      sealName: '첫 번째 인장 · 탐욕의 쇠사슬',
      trace: '통로 양옆으로 붉은 전쟁 깃발이 꽂혀 있고, 쇠창살마다 불탄 갑옷과 원정대의 부러진 창이 걸려 있다.',
      midThreat: '홉고블린 대장군 마그도르가 1층 인장을 전쟁 토템에 박아넣고, 수백의 고블린 병력을 지상으로 쏟아낼 화염 의식을 준비 중이다.',
      confront1: '"하하하! 잿빛 여관의 남은 쥐새끼가 드디어 제단 앞까지 왔구나! 네 동료들도 여기서 불타 죽었지!"',
      confront2: '"이 붉은 인장은 이제 우리 군단의 심장이다. 지상의 도시들을 불바다로 만들기 전에 네 피로 제단을 적셔주마!"',
      heroReply: '"내 동료들의 피로 세운 제단 따위, 네 토템과 함께 가루로 만들어 주겠다."',
      afterDefeat: '화염 토템이 산산조각 나며 타오르던 불길 속에서 첫 번째 인장 파편이 모습을 드러냈다.'
    },

    // --- ACT 2: 제2계층 어둠의 지하동굴 & 거미 신전 (두 번째 인장: 침묵의 인장) ---
    arachne_matron: {
      name: '거미 여왕 아라크네 대모',
      epithet: '어둠의 비단을 짜는 지하 신전의 주인',
      sealName: '두 번째 인장 · 침묵의 비단',
      trace: '천장에서 내려온 강철처럼 질긴 은빛 거미줄마다, 탈출하려다 고치가 된 척후병들의 흔적이 매달려 있다.',
      midThreat: '아라크네 대모가 두 번째 인장을 제 둥지 중심에 엮어놓고, 지하동굴 전체의 소리와 빛을 집어삼키고 있다.',
      confront1: '"어머나, 조용한 내 신전에 시끄러운 발소리가 들리네… 1층의 멍청이들을 뚫고 내려온 손님이구나."',
      confront2: '"손등의 파편이 아주 달콤한 향기를 풍기는 걸? 네 몸을 비단실로 감아 영원히 내 옆에 두어주마."',
      heroReply: '"그 역겨운 거미줄부터 전부 끊어내고 두 번째 인장을 회수하겠다."',
      afterDefeat: '거미줄이 일제히 끊어지며 신전 바닥으로 두 번째 인장 파편이 맑은 소리를 내며 떨어졌다.'
    },
    aboleth_leviathan: {
      name: '태고의 심해 괴수 아볼레스',
      epithet: '잊혀진 지하 호수의 기억 포식자',
      sealName: '두 번째 인장 · 침묵의 비단',
      trace: '습한 바위벽을 타고 끈적한 점액과 짠 호수 냄새가 번지며, 물웅덩이 수면 너머로 기묘한 환청이 스친다.',
      midThreat: '지하 호수 밑바닥에 잠들어 있던 태고의 괴수 아볼레스가 인장의 마력에 깨어나, 내려온 모험가들의 기억을 차례로 삼키고 있다.',
      confront1: '"가엾은 육지의 미물아… 네가 지키려는 이름도, 동료들의 얼굴도 내 수면 아래선 모두 희미한 거품일 뿐이다."',
      confront2: '"두 번째 인장은 이미 내 심해의 기억과 하나가 되었다. 저항을 멈추고 영원한 망각 속에 가라앉아라."',
      heroReply: '"기억을 빼앗겨도 손에 쥔 무기만큼은 잊지 않는다. 수면 위로 끌어올려 끝장내주마."',
      afterDefeat: '검은 호수가 잠잠해지며 수면 위로 두 번째 인장 파편이 은빛으로 떠올랐다.'
    },
    purple_worm_titan: {
      name: '대지포식자 퍼플 웜',
      epithet: '지하동굴을 갉아먹는 태고의 거수',
      sealName: '두 번째 인장 · 침묵의 비단',
      trace: '동굴 바닥이 통째로 무너져 거대한 원형 터널이 뚫려 있고, 발밑에서 둔중한 지진이 주기적으로 울린다.',
      midThreat: '인장이 품은 마력에 미쳐 날뛰는 태고의 퍼플 웜이 지하 기둥을 모조리 집어삼키며 2층 전체를 붕괴 직전으로 몰아넣고 있다.',
      confront1: '(말 대신 동굴 천장이 무너질 듯한 굉음! 보랏빛 거대 지렁이가 수백 개의 이빨을 회전시키며 벽을 뚫고 솟구친다!)',
      confront2: '(괴수의 목구멍 깊은 곳에서 삼켜버린 두 번째 인장이 불규칙하게 번쩍이며 대지를 뒤흔든다!)',
      heroReply: '"인장을 통째로 삼켜버렸군… 뱃속에서 직접 꺼내는 수밖에 없겠어!"',
      afterDefeat: '거수가 땅속으로 쓰러지자, 갈라진 외피 틈에서 두 번째 인장 파편이 뜨거운 김을 뿜으며 드러났다.'
    },
    duergar_despot: {
      name: '듀에르가 폭군 스틸비어드',
      epithet: '강철 용광로의 무자비한 군주',
      sealName: '두 번째 인장 · 침묵의 비단',
      trace: '열기가 훅 끼치는 갱도마다 쇠사슬 끄는 소리가 메아리치고, 붉게 달아오른 강철 톱니바퀴가 벽면을 가득 채우고 있다.',
      midThreat: '듀에르가 폭군 스틸비어드가 두 번째 인장을 거대 용광로의 연료로 쑤셔 넣고, 탑을 점령할 강철 병기를 찍어내고 있다.',
      confront1: '"용광로의 불을 끄러 온 건가, 지상 놈아? 이 인장 조각 하나면 내 대장간이 천 년은 더 돌아간다!"',
      confront2: '"봉인 따위 녹여서 내 강철 갑옷의 심장으로 써주마! 네 뼈도 쇳물 속에 함께 던져주지!"',
      heroReply: '"봉인을 쇳물에 녹이려 들다니 제정신이 아니군. 그 용광로부터 박살 내주마."',
      afterDefeat: '용광로의 불길이 꺼지며 식어가는 모루 위에서 두 번째 인장 파편이 모습을 드러냈다.'
    },

    // --- ACT 3: 제3계층 심연의 생체 군락 & 성채 (세 번째 인장: 이성의 인장) ---
    elder_brain_prime: {
      name: '군락의 지배자 엘더 브레인',
      epithet: '수만 의식을 하나로 묶는 심연의 대뇌',
      sealName: '세 번째 인장 · 이성의 왕관',
      trace: '바위 대신 맥박 치는 보랏빛 신경 다발이 통로를 감싸고 있으며, 귀가 아닌 머릿속에서 낮고 차가운 합창이 울린다.',
      midThreat: '엘더 브레인이 세 번째 인장을 수조에 담가 증폭시키며, 3층에 들어선 모든 존재의 의지를 하나의 군체로 동화시키고 있다.',
      confront1: '"불완전한 개별 의식이여. 네가 겪는 공포도, 분노도 모두 쓸모없는 소음에 불과하다."',
      confront2: '"세 번째 인장은 이제 내 사념망의 핵이다. 무기를 내려놓고 완벽한 군체의 일부가 되어라."',
      heroReply: '"타인의 생각을 훔쳐놓고 완벽을 논하지 마라. 그 역겨운 수조째로 부숴주겠다."',
      afterDefeat: '사념의 합창이 단숨에 끊어지며 깨진 수정 수조 바닥에 세 번째 인장 파편이 가라앉았다.'
    },
    beholder_hive_mother: {
      name: '군체 어미 하이브 마더',
      epithet: '수정 둥지의 폭군 여제',
      sealName: '세 번째 인장 · 이성의 왕관',
      trace: '천장에 매달린 보랏빛 수정 덩어리마다 수십 개의 작은 눈동자가 깜빡이며 침입자의 걸음을 집요하게 쫓고 있다.',
      midThreat: '비홀더들의 여제 하이브 마더가 세 번째 인장을 수정 둥지 꼭대기에 걸고, 3층 전체를 자신의 감시망 아래 가둬두었다.',
      confront1: '"단 하나의 눈으로도 부족한가? 내 수백 개의 눈이 이미 네 다음 수까지 전부 꿰뚫어 보았다!"',
      confront2: '"인장은 가장 위대한 시선을 가진 나의 것이다. 산산조각 나서 둥지의 거름이 되어라!"',
      heroReply: '"눈이 아무리 많아도 피하지 못할 일격이 뭔지 직접 보여주마."',
      afterDefeat: '수정 둥지가 무너지며 흩어진 파편 속에서 세 번째 인장이 찬란한 빛을 되찾았다.'
    },
    githyanki_supreme: {
      name: '기스양키 최고 사령관 크스락',
      epithet: '은빛 함대의 무자비한 정복자',
      sealName: '세 번째 인장 · 이성의 왕관',
      trace: '찢어진 차원 틈새 너머로 은빛 검격이 남긴 매끈한 절단면과 기스양키 전초대의 붉은 군기가 펄럭이고 있다.',
      midThreat: '차원 너머에서 침공한 사령관 크스락이 일리시드 군락을 학살하는 한편, 세 번째 인장을 전리품으로 탈취해 본국으로 가져가려 한다.',
      confront1: '"멈춰라, 약한 필멸자여. 이 탑의 인장은 너희 따위가 감당할 물건이 아니다."',
      confront2: '"네 손등의 파편까지 함께 바치면 목숨만은 살려주마. 거절한다면 은빛 대검으로 두 동강 내주지!"',
      heroReply: '"이 탑의 봉인을 훔쳐 가면 대륙이 무너진다. 은빛 검이든 뭐든 꺾고 되찾겠다."',
      afterDefeat: '부러진 은빛 검 옆으로 세 번째 인장 파편이 고요히 떨어지며 차원 균열이 닫혔다.'
    },
    neothelid_leviathan: {
      name: '촉수 거수 네오텔리드',
      epithet: '통제를 잃고 폭주한 심연의 괴수',
      sealName: '세 번째 인장 · 이성의 왕관',
      trace: '통로 벽면 전체가 부식성 점액으로 녹아내려 있고, 주인을 잃고 쓰러진 일리시드 시체들이 널브러져 있다.',
      midThreat: '군락의 통제가 무너지면서 괴수화한 네오텔리드가 세 번째 인장의 마력을 뜯어먹고 이성 없는 재앙으로 변해버렸다.',
      confront1: '(귀청이 찢어질 듯한 사이오닉 비명! 산더미 같은 창백한 촉수 거수가 천장을 찢으며 모습을 드러낸다!)',
      confront2: '(거수의 이마에 박힌 세 번째 인장이 과부하로 번쩍이며 사방으로 부식성 파동을 흩뿌린다!)',
      heroReply: '"말이 통할 상대가 아니군. 폭주가 위층까지 번지기 전에 여기서 끝낸다!"',
      afterDefeat: '괴수가 녹아내리며 식어간 잿더미 속에서 세 번째 인장 파편이 안전하게 회수되었다.'
    },

    // --- ACT 4: 제4계층 잿빛 망령 회랑 & 공포의 무덤 (네 번째 인장: 안식의 인장) ---
    archlich_acererak: {
      name: '아치리치 아세라락',
      epithet: '영혼 융합로의 불사 대마도사',
      sealName: '네 번째 인장 · 안식의 촛불',
      trace: '차가운 석실마다 이름 없는 영혼 등불이 줄지어 떠 있고, 죽은 원정대원들의 갑옷이 사령술의 흔적과 함께 서 있다.',
      midThreat: '아치리치 아세라락이 네 번째 인장을 영혼 융합로에 연결해, 이 탑에서 죽어간 모든 이들의 영혼을 불사의 연료로 갈아 넣고 있다.',
      confront1: '"오호, 드디어 쓸 만한 표본이 스스로 걸어 들어왔군. 세 개의 인장을 품은 산 자의 영혼이라니… 감동적이야."',
      confront2: '"네 동료들도 아주 훌륭한 연료였지. 이제 네 차례다 — 네 번째 인장과 함께 내 영원한 실험실에 남아라!"',
      heroReply: '"쓰러진 동료들을 모독한 대가는 네 성물함을 부수는 걸로 치르게 해주마."',
      afterDefeat: '영혼 융합로가 깨지며 해방된 빛줄기 속에서 네 번째 인장 파편이 조용히 떠올랐다.'
    },
    dracolich_aurinax: {
      name: '고대 드라코리치 에본데스',
      epithet: '얼어붙은 백골의 고룡',
      sealName: '네 번째 인장 · 안식의 촛불',
      trace: '회랑의 돌바닥 전체가 검푸른 서리로 덮여 있고, 부러진 용골 기둥 사이로 영혼을 얼리는 찬바람이 휘몰아친다.',
      midThreat: '죽음마저 거부한 백골 고룡 에본데스가 네 번째 인장을 흉골 안에 품은 채, 4층 전체를 얼어붙은 무덤으로 만들어버렸다.',
      confront1: '"살아 있는 심장 소리가 거슬리는구나… 그 뜨거운 피도 내 백골의 숨결 앞에서는 금세 얼어붙을 뿐."',
      confront2: '"안식의 인장은 죽은 자의 것이다. 산 자가 감히 내 무덤을 넘본 죄를 영원한 빙결로 갚아라!"',
      heroReply: '"죽음이 끝이라면 편히 잠들어야지. 그 얼어붙은 뼈마디를 부수고 인장을 가져가겠다."',
      afterDefeat: '백골이 잿빛 먼지로 흩어지며 얼음 바닥 위로 네 번째 인장 파편이 굴러나왔다.'
    },
    death_tyrant_beholder: {
      name: '데스 타이런트',
      epithet: '핏빛 해골 안구의 망령 폭군',
      sealName: '네 번째 인장 · 안식의 촛불',
      trace: '어둠 속 허공에 붉은 빛점들이 유령처럼 맴돌고, 죽은 병사들이 의지 없는 눈빛으로 통로를 배회하고 있다.',
      midThreat: '죽어서도 집착을 버리지 못한 언데드 비홀더 데스 타이런트가 네 번째 인장을 이용해 불사의 병사들을 끝없이 일으키고 있다.',
      confront1: '"살과 피는 썩어 사라지지만, 내 핏빛 눈동자와 이 언데드 군단은 영원하다!"',
      confront2: '"네가 쓰러지면 아주 쓸 만한 기사가 되겠군. 어서 숨을 거두고 내 군단에 합류해라!"',
      heroReply: '"죽은 자들을 억지로 붙잡아두는 짓은 여기까지다. 그 핏빛 눈부터 꿰뚫어 주마."',
      afterDefeat: '붉은 안광이 꺼지자 텅 빈 해골 아래에서 네 번째 인장 파편이 차분히 빛났다.'
    },
    lord_soth_deathknight: {
      name: '흑장미의 데스나이트 소쓰',
      epithet: '꺾인 맹세의 불사 기사',
      sealName: '네 번째 인장 · 안식의 촛불',
      trace: '시든 검은 장미 꽃잎이 회랑 바닥에 흩뿌려져 있고, 불탄 갑옷의 검기가 벽면을 깊게 베어놓았다.',
      midThreat: '옛 봉인 기사단의 타락한 영웅 소쓰가 네 번째 인장을 쥔 채, 자신의 패배를 되풀이하는 저주받은 결투장을 지키고 있다.',
      confront1: '"…또 다른 영웅 행세인가. 삼백 년 전 나 역시 네 눈빛과 똑같은 정의를 믿었지."',
      confront2: '"그 맹세가 얼마나 쉽게 부러지는지 시험해 주마. 내 흑장미의 검을 넘지 못한다면 인장은 넘길 수 없다."',
      heroReply: '"당신의 후회까지 내가 짊어질 이유는 없다. 검을 맞대고 끝을 내자, 기사여."',
      afterDefeat: '소쓰가 조용히 무릎을 꿇고 검을 꽂자, 투구 옆으로 네 번째 인장 파편이 건네지듯 떨어졌다.'
    },

    // --- ACT 5: 제5계층 붉은 월식의 정상 & 최후의 신전 (다섯 번째 인장: 천칭의 심장) ---
    tiamat_dragon_queen: {
      name: '오색룡의 여신 티아마트',
      epithet: '다섯 재앙을 품은 지옥의 용신',
      sealName: '다섯 번째 인장 · 천칭의 심장',
      trace: '유황 불길과 번개, 서리와 독이 뒤섞인 다섯 빛깔 균열이 하늘을 찢으며, 거대한 날갯짓 소리가 탑 전체를 울린다.',
      midThreat: '붉은 월식의 밤 다섯 번째 인장을 부수고 깨어난 오색룡 티아마트가, 탑 꼭대기에서 지상으로 강림할 마지막 날갯짓을 준비하고 있다.',
      confront1: '"다섯 개의 머리가 삼백 년의 침묵을 깨고 노래한다! 고작 필멸자 하나가 내 강림을 막겠다고?"',
      confront2: '"네가 모은 네 개의 인장까지 모두 불태워 주마! 화염과 빙결, 번개와 맹독 앞에 재가 되어라!"',
      heroReply: '"네가 이 탑을 뒤집어 놓은 원흉이군. 다섯 머리 전부 땅바닥에 눕히고 마지막 인장을 닫겠다!"',
      afterDefeat: '오색의 포효가 사그라들고, 갈라진 하늘 한가운데서 다섯 번째 인장이 찬란히 되살아났다.'
    },
    asmodeus_lord_of_ninth: {
      name: '지옥의 절대군주 아스모데우스',
      epithet: '붉은 월식의 배후 · 계약의 화신',
      sealName: '다섯 번째 인장 · 천칭의 심장',
      trace: '불타는 흑요석 계단마다 붉은 루비 문양이 새겨져 있고, 공기 속에 달콤하면서도 매캐한 유황 향이 짙게 깔려 있다.',
      midThreat: '라파엘조차 두려워하는 지옥의 절대군주 아스모데우스가 다섯 번째 인장을 손에 쥔 채, 탑 전체를 지옥의 교두보로 바꾸려 한다.',
      confront1: '"환영한다, 낙인자여. 네 개의 인장을 직접 여기까지 배달해 주다니 이보다 고마운 손님이 없군."',
      confront2: '"지금 무릎 꿇고 서명하면 네 고향만은 살려주지. 거절한다면 이 신전째로 지옥에 편입시켜 주마!"',
      heroReply: '"악마의 계약서 따위 불태워 버리겠다. 다섯 번째 인장을 되찾고 이 탑을 닫는다!"',
      afterDefeat: '루비 지팡이가 부러지며 붉은 화염 속에서 다섯 번째 인장이 순백의 빛을 되찾았다.'
    },
    demogorgon_prince: {
      name: '심연의 군주 데모고르곤',
      epithet: '광기와 혼돈의 쌍두 마신',
      sealName: '다섯 번째 인장 · 천칭의 심장',
      trace: '탑 정상의 공간 자체가 소용돌이처럼 뒤틀려 있으며, 벽면의 돌들이 살아있는 것처럼 꿈틀대며 광기의 웃음을 뱉는다.',
      midThreat: '혼돈의 마신 데모고르곤이 다섯 번째 인장을 찢어버린 뒤, 현실과 심연의 경계를 통째로 지워버리려 하고 있다.',
      confront1: '"두 머리가 동시에 웃는다 — 이성도, 질서도, 천칭도 모두 부서져야 아름답지!"',
      confront2: '"네 손등의 인장을 뜯어내 심연에 던져주마! 광기의 소용돌이 속에서 산산조각 나라!"',
      heroReply: '"광기에 휩쓸릴 생각은 없다. 지금 여기서 네 혼돈을 끝내고 봉인을 완성한다!"',
      afterDefeat: '뒤틀렸던 공간이 고요히 제자리를 찾으며, 중앙 제단 위로 다섯 번째 인장이 내려앉았다.'
    },
    halaster_mad_mage: {
      name: '매드 메이지 할라스터',
      epithet: '봉인탑의 창조자 · 광기의 대마도사',
      sealName: '다섯 번째 인장 · 천칭의 심장',
      trace: '공중에 떠 있는 깨진 천칭 조각들과 룬 문자가 별처럼 빙글빙글 돌며, 어딘가에서 낄낄거리는 늙은 마법사의 웃음이 울린다.',
      midThreat: '충격적인 진실 — 다섯 번째 인장을 안에서 열어젖힌 자는 삼백 년 전 이 탑을 설계했던 광기의 대마도사 할라스터 본인이었다!',
      confront1: '"하하하! 드디어 깨달았구나! 삼백 년이나 같은 봉인을 지키려니 너무 지루해서 내가 직접 빗장을 풀었지!"',
      confront2: '"네 개의 인장을 뚫고 올라온 최고의 실험체여! 나를 이기고 네가 직접 새 천칭의 주인이 되어보거라!"',
      heroReply: '"당신의 미친 장난 때문에 수많은 사람이 죽었다. 그 지팡이를 부수고 봉인을 영원히 잠그겠다!"',
      afterDefeat: '할라스터가 폭소하며 빛의 파편 속으로 흩어지자, 천칭의 심장인 다섯 번째 인장이 제자리를 찾았다.'
    }
  };

  function getBossLore(bossId, actNum = 1) {
    if (bossId && BOSS_LORE[bossId]) return BOSS_LORE[bossId];
    const fallback = { 1: 'beholder_xanathar', 2: 'arachne_matron', 3: 'elder_brain_prime', 4: 'archlich_acererak', 5: 'tiamat_dragon_queen' };
    return BOSS_LORE[fallback[actNum] || 'beholder_xanathar'];
  }

  // --------------------------------------------------------------------------
  // 4. FLOOR STORY METADATA (5 Floors x 3 Boss-Linked Episodes = 15 Episodes!)
  // --------------------------------------------------------------------------
  const FLOOR_THEMES = {
    1: {
      act: 1,
      chapter: '제1계층 · 첫 번째 인장 (탐욕)',
      title: '침수된 밀수굴과 잿빛 성채',
      location: '잿빛 화덕 여관 우물 → 1층 지하 성채',
      guideNpc: 'jaheira',
      epTitles: ['1화 · 우물 아래 첫 발걸음', '2화 · 붉은 낙인과 보스의 그림자', '3화 · 첫 번째 인장, 군주와의 대면']
    },
    2: {
      act: 2,
      chapter: '제2계층 · 두 번째 인장 (침묵)',
      title: '빛 없는 지하동굴과 거미 신전',
      location: '2층 지하동굴 → 어둠의 신전',
      guideNpc: 'durnan',
      epTitles: ['1화 · 어둠이 삼킨 계단', '2화 · 깊어지는 함정과 군주의 흔적', '3화 · 두 번째 인장, 심연의 지배자']
    },
    3: {
      act: 3,
      chapter: '제3계층 · 세 번째 인장 (이성)',
      title: '맥동하는 생체 군락과 수정 회랑',
      location: '3층 생체 군락 → 사념의 핵',
      guideNpc: 'guardian',
      epTitles: ['1화 · 머릿속을 울리는 속삭임', '2화 · 흔들리는 정신과 인장의 공명', '3화 · 세 번째 인장, 의식의 최전선']
    },
    4: {
      act: 4,
      chapter: '제4계층 · 네 번째 인장 (안식)',
      title: '잿빛 망령 회랑과 공포의 무덤',
      location: '4층 망령 회랑 → 영혼의 제단',
      guideNpc: 'withers',
      epTitles: ['1화 · 이름 없는 묘비들의 길', '2화 · 옛 원정대의 마지막 기록', '3화 · 네 번째 인장, 불사의 군주']
    },
    5: {
      act: 5,
      chapter: '제5계층 · 다섯 번째 인장 (심장)',
      title: '붉은 월식의 정상과 부서진 천칭',
      location: '5층 천칭의 정상 → 최후의 신전',
      guideNpc: 'raphael',
      epTitles: ['1화 · 하늘과 심연이 맞닿은 정상', '2화 · 마지막 관문 앞의 선택', '3화 · 다섯 번째 인장, 최후의 결전']
    }
  };

  // Chronicle summary compatibility (ACT_CHAPTERS & VICTORY_EPILOGUE)
  const ACT_CHAPTERS = {};
  for (let a = 1; a <= 5; a++) {
    const ft = FLOOR_THEMES[a];
    const sampleBoss = getBossLore(null, a);
    ACT_CHAPTERS[a] = {
      act: a,
      chapter: ft.chapter,
      title: ft.title,
      location: ft.location,
      speaker: `${NPCS[ft.guideNpc].icon} ${NPCS[ft.guideNpc].name}`,
      episodes: ft.epTitles,
      paragraphs: [
        `[1화 · 진입] ${sampleBoss.trace}`,
        `[2화 · 전개] ${sampleBoss.midThreat}`,
        `[3화 · 보스 대면] 15F 보스방 너머에서 이 층의 인장(${sampleBoss.sealName})을 차지한 군주와 마주 선다.`
      ],
      objective: `🎯 목표: 제${a}계층 15F 군주를 쓰러뜨리고 [${sampleBoss.sealName}]을 되찾아라.`
    };
  }
  const VICTORY_EPILOGUE = MAIN_STORY.epilogue;

  // --------------------------------------------------------------------------
  // 5. SCENE BUILDERS: MAIN STORY (Prologue/Epilogue) + 5x3 FLOOR EPISODES!
  //    Natural blend of atmospheric narration + grounded short dialogue + Boss!
  // --------------------------------------------------------------------------
  function getMainStoryScene(part = 'prologue', charId = 'fighter', bossId = 'tiamat_dragon_queen') {
    const origin = CLASS_ORIGINS[charId] || CLASS_ORIGINS.fighter;
    if (part === 'epilogue') {
      const boss = getBossLore(bossId, 5);
      return {
        id: 'main_epilogue',
        chapter: MAIN_STORY.epilogue.chapter,
        title: MAIN_STORY.epilogue.title,
        bgKey: 'lobby',
        actNum: 5,
        lines: [
          { speaker: 'narrator', npcId: 'guardian', emotion: 'happy', heroEmotion: 'happy', text: boss.afterDefeat },
          { speaker: 'narrator', npcId: 'guardian', emotion: 'happy', heroEmotion: 'happy', text: MAIN_STORY.epilogue.paragraphs[0] },
          { speaker: 'npc', npcId: 'jaheira', emotion: 'happy', heroEmotion: 'happy', text: '"살아서 돌아왔구나… 정말 해냈어. 붉은 월식이 걷히고 있어. 이제 이 잿빛 여관에도 아침이 오겠지."' },
          { speaker: 'npc', npcId: 'withers', emotion: 'smug', heroEmotion: 'neutral', text: '"다섯 인장이 제자리를 찾았다. 그대의 이름은 부서진 천칭의 새 주인으로 오래도록 남으리라."' },
          { speaker: 'narrator', npcId: 'durnan', emotion: 'happy', heroEmotion: 'smug', text: MAIN_STORY.epilogue.paragraphs[2] }
        ]
      };
    }

    return {
      id: 'main_prologue',
      chapter: 'MAIN STORY · PROLOGUE',
      title: MAIN_STORY.title,
      bgKey: 'lobby',
      actNum: 1,
      lines: [
        { speaker: 'narrator', npcId: 'durnan', emotion: 'sad', heroEmotion: 'sad', text: MAIN_STORY.synopsis[0] },
        { speaker: 'narrator', npcId: 'durnan', emotion: 'surprised', heroEmotion: 'surprised', text: MAIN_STORY.synopsis[1] },
        { speaker: 'narrator', npcId: 'guardian', emotion: 'neutral', heroEmotion: 'neutral', text: '타닥거리는 벽난로 소리. 잿빛 화덕 여관의 나무 탁자 위에서, 당신의 손등에 박힌 인장 파편이 희미한 푸른빛을 뿜는다.' },
        { speaker: 'npc', npcId: 'durnan', emotion: 'neutral', heroEmotion: 'neutral', text: '"깨어났나. 어젯밤 우물 밖으로 기어 올라온 건 자네뿐이었어. 자, 따뜻한 물부터 한 모금 마시게."' },
        { speaker: 'hero', npcId: 'durnan', emotion: 'angry', heroEmotion: 'angry', text: origin.quote }
      ]
    };
  }

  function getFloorStoryEpisode(actNum = 1, epNum = 1, charId = 'fighter', bossId = null) {
    const act = Math.max(1, Math.min(5, actNum || 1));
    const ep = Math.max(1, Math.min(3, epNum || 1));
    const ft = FLOOR_THEMES[act];
    const resolvedBossId =
      bossId ||
      { 1: 'beholder_xanathar', 2: 'arachne_matron', 3: 'elder_brain_prime', 4: 'archlich_acererak', 5: 'tiamat_dragon_queen' }[act];
    const boss = getBossLore(resolvedBossId, act);
    const origin = CLASS_ORIGINS[charId] || CLASS_ORIGINS.fighter;

    // ------------------------------------------------------------------------
    // EPISODE 1 (Stage 1 진입): Atmospheric entry + Trace of actual Floor Boss
    // ------------------------------------------------------------------------
    if (ep === 1) {
      if (act === 1) {
        return {
          id: `act_1_ep_1`,
          chapter: `${ft.chapter} · ${ft.epTitles[0]}`,
          title: `${ft.title} — ${boss.name}의 흔적`,
          bgKey: resolvedBossId,
          actNum: 1,
          bossId: resolvedBossId,
          lines: [
            { speaker: 'narrator', npcId: 'durnan', emotion: 'neutral', heroEmotion: 'neutral', text: '붉은 월식이 뜬 밤 이후, 천칭의 첨탑은 다섯 층으로 뒤집혔다. 여관 한가운데 뚫린 우물에서 쇠사슬을 타고 내려서자 차갑고 눅눅한 돌 냄새가 코끝을 찌른다.' },
            { speaker: 'narrator', npcId: 'jaheira', emotion: 'surprised', heroEmotion: 'surprised', text: boss.trace },
            { speaker: 'npc', npcId: 'jaheira', emotion: 'neutral', heroEmotion: 'neutral', text: `"흔적이 아주 선명해. 이 1층의 인장을 쥐고 있는 놈은 틀림없이 [${boss.name}]이야. 혼자 내려갈 생각이면 한순간도 방심하지 마."` },
            { speaker: 'hero', npcId: 'jaheira', emotion: 'angry', heroEmotion: 'angry', text: origin.quote,
              choices: [
                {
                  label: '🔍 "이 층 보스에 대해 더 아는 게 있습니까?"',
                  replySpeaker: 'npc', replyNpcId: 'jaheira', replyEmotion: 'neutral', heroEmotion: 'neutral',
                  reply: `"${boss.midThreat} 우선 우물 입구에서 숨을 고르고 천천히 깊숙이 파고들어."`
                },
                {
                  label: '⚔️ "흔적은 충분합니다. 바로 내려가겠습니다."',
                  replySpeaker: 'npc', replyNpcId: 'jaheira', replyEmotion: 'smug', heroEmotion: 'smug',
                  reply: '"좋아. 손등의 인장이 반응하는 쪽을 따라가. 살아 돌아오면 더난이 술 한 잔쯤은 공짜로 줄 거야."'
                }
              ]
            }
          ]
        };
      }

      if (act === 2) {
        return {
          id: `act_2_ep_1`,
          chapter: `${ft.chapter} · ${ft.epTitles[0]}`,
          title: `${ft.title} — ${boss.name}의 영역`,
          bgKey: resolvedBossId,
          actNum: 2,
          bossId: resolvedBossId,
          lines: [
            { speaker: 'narrator', npcId: 'durnan', emotion: 'neutral', heroEmotion: 'neutral', text: '첫 번째 인장이 닫히며 굳게 잠겨 있던 석문이 열렸다. 아래로 이어진 나선 계단을 내려서자 횃불 빛마저 삼켜버리는 깊은 어둠이 밀려온다.' },
            { speaker: 'narrator', npcId: 'durnan', emotion: 'surprised', heroEmotion: 'surprised', text: boss.trace },
            { speaker: 'npc', npcId: 'guardian', emotion: 'sad', heroEmotion: 'neutral', text: `"두 번째 인장이 이 어둠 어딘가에서 비명을 지르고 있다… 이번 층의 지배자는 [${boss.name}]. 1층과는 차원이 다른 놈이다."`,
              choices: [
                {
                  label: '🔮 "손등의 파편이 유독 차갑게 식고 있습니다."',
                  replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'neutral', heroEmotion: 'neutral',
                  reply: `"${boss.sealName}이 놈의 힘에 짓눌려 있기 때문이다. 끝까지 버텨서 인장을 되찾아라."`
                },
                {
                  label: '🗡️ "어둠이 짙을수록 발소리를 죽이고 가면 그만입니다."',
                  replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'smug', heroEmotion: 'smug',
                  reply: '"듬직하군. 저 아래에서 너를 노리는 시선들을 조심해라."'
                }
              ]
            }
          ]
        };
      }

      if (act === 3) {
        return {
          id: `act_3_ep_1`,
          chapter: `${ft.chapter} · ${ft.epTitles[0]}`,
          title: `${ft.title} — ${boss.name}의 사념`,
          bgKey: resolvedBossId,
          actNum: 3,
          bossId: resolvedBossId,
          lines: [
            { speaker: 'narrator', npcId: 'guardian', emotion: 'surprised', heroEmotion: 'surprised', text: '세 번째 계층에 들어서자 발밑의 돌이 살아있는 듯 낮게 진동한다. 공기 속에 금속성 냄새와 낯선 속삭임이 스며든다.' },
            { speaker: 'narrator', npcId: 'guardian', emotion: 'sad', heroEmotion: 'sad', text: boss.trace },
            { speaker: 'npc', npcId: 'guardian', emotion: 'angry', heroEmotion: 'neutral', text: `"정신을 붙잡아라! [${boss.name}]의 영역에 들어섰다. 귀에 들리는 목소리에 답하지 말고 앞만 보고 걸어!"`,
              choices: [
                {
                  label: '🧠 "머릿속이 울리지만 아직 제정신입니다."',
                  replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'happy', heroEmotion: 'smug',
                  reply: '"잘 버티고 있다. 손등의 인장이 네 이성을 붙잡아 줄 테니, 흔들리지 말고 나아가라."'
                },
                {
                  label: '⚔️ "속삭임의 주인을 직접 베어버리면 조용해지겠죠."',
                  replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'smug', heroEmotion: 'angry',
                  reply: '"그래. 세 번째 인장을 되찾는 순간 이 기괴한 울림도 모두 멈출 것이다."'
                }
              ]
            }
          ]
        };
      }

      if (act === 4) {
        return {
          id: `act_4_ep_1`,
          chapter: `${ft.chapter} · ${ft.epTitles[0]}`,
          title: `${ft.title} — ${boss.name}의 무덤`,
          bgKey: resolvedBossId,
          actNum: 4,
          bossId: resolvedBossId,
          lines: [
            { speaker: 'narrator', npcId: 'withers', emotion: 'sad', heroEmotion: 'sad', text: '네 번째 계층의 문 너머에는 바람 한 점 없는 잿빛 회랑이 끝없이 펼쳐져 있다. 바닥에는 먼저 내려왔던 수많은 원정대원들의 부러진 검이 묘비처럼 꽂혀 있다.' },
            { speaker: 'narrator', npcId: 'withers', emotion: 'neutral', heroEmotion: 'surprised', text: boss.trace },
            { speaker: 'npc', npcId: 'withers', emotion: 'neutral', heroEmotion: 'neutral', text: `"여기까지 살아 내려온 산 자는 참으로 오랜만이군. 이 회랑 끝에는 [${boss.name}]이 죽음의 질서를 거스른 채 앉아 있다."`,
              choices: [
                {
                  label: '🕯️ "먼저 쓰러진 동료들의 흔적이 여기까지 이어졌군요."',
                  replySpeaker: 'npc', replyNpcId: 'withers', replyEmotion: 'sad', heroEmotion: 'sad',
                  reply: '"그들의 이름은 모두 내 장부에 적혀 있다. 네 번째 인장을 되찾아 그들에게 안식을 돌려주거라."'
                },
                {
                  label: '⚔️ "죽은 자의 회랑을 뚫고 마지막 층까지 올라가겠습니다."',
                  replySpeaker: 'npc', replyNpcId: 'withers', replyEmotion: 'smug', heroEmotion: 'angry',
                  reply: '"운명의 저울이 서서히 기울고 있군. 흔들리지 말고 걸어가라."'
                }
              ]
            }
          ]
        };
      }

      return {
        id: `act_5_ep_1`,
        chapter: `${ft.chapter} · ${ft.epTitles[0]}`,
        title: `${ft.title} — ${boss.name}의 신전`,
        bgKey: resolvedBossId,
        actNum: 5,
        bossId: resolvedBossId,
        lines: [
          { speaker: 'narrator', npcId: 'raphael', emotion: 'surprised', heroEmotion: 'surprised', text: '네 개의 인장이 손등에서 하나로 공명하자, 마지막 문이 열리며 붉은 월식이 떠 있는 타오르는 정상이 모습을 드러낸다.' },
          { speaker: 'narrator', npcId: 'raphael', emotion: 'angry', heroEmotion: 'angry', text: boss.trace },
          { speaker: 'npc', npcId: 'raphael', emotion: 'smug', heroEmotion: 'angry', text: `"드디어 마지막 무대까지 올라왔군! 저 불길 너머에서 [${boss.name}]이 다섯 번째 인장을 쥐고 기다리고 있네. 정말 근사한 결말이 되겠어."`,
            choices: [
              {
                label: '🔥 "방해할 생각이라면 너부터 베고 지나가겠다."',
                replySpeaker: 'npc', replyNpcId: 'raphael', replyEmotion: 'happy', heroEmotion: 'angry',
                reply: '"하하하! 진정하게, 난 그저 최고의 마지막 막을 지켜보러 온 관객일 뿐이니까."'
              },
              {
                label: '👑 "다섯 번째 인장을 닫고 이 밤을 끝내겠다."',
                replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'happy', heroEmotion: 'smug',
                reply: '"모든 여정이 이 한 걸음을 위해서였다. 끝까지 함께하겠다!"'
              }
            ]
          }
        ]
      };
    }

    // ------------------------------------------------------------------------
    // EPISODE 2 (Stage 8 중간보스 직전): Mid-floor crisis & Boss's true scheme!
    // ------------------------------------------------------------------------
    if (ep === 2) {
      const midNpcs = { 1: 'jaheira', 2: 'raphael', 3: 'guardian', 4: 'withers', 5: 'guardian' };
      const npcId = midNpcs[act];
      const midOpenings = {
        1: '성채 중층의 철문이 굳게 닫혀 있다. 문 틈새로 매캐한 연기와 함께 거친 숨소리가 새어 나온다.',
        2: '지하동굴 한가운데 갈라진 협곡 다리. 발밑 어둠 속에서 무언가가 묵직하게 기어오르는 소리가 들린다.',
        3: '생체 회랑의 중심부. 벽면의 맥박이 갑자기 빨라지며, 날카로운 적의가 통로 전체를 짓누른다.',
        4: '잿빛 제단 앞, 차가운 안개가 소용돌이치며 쓰러진 기사들의 갑옷이 일제히 떨리기 시작한다.',
        5: '최후의 신전으로 향하는 흑요석 다리 한가운데, 지옥의 불기둥이 솟구치며 앞길을 가로막는다.'
      };
      const midNpcLines = {
        1: `"잠깐 멈춰! 저 문 너머엔 [${boss.name}]이 세워둔 수문장이 버티고 있어. ${boss.midThreat}"`,
        2: `"어이쿠, 발밑 조심하게나. ${boss.midThreat} 저 앞의 문지기부터 뚫지 못하면 2층 끝은 구경도 못 할 걸?"`,
        3: `"주의해라! ${boss.midThreat} 지금 앞을 막아선 수하를 꺾어야 군주의 본거지로 갈 수 있다!"`,
        4: `"${boss.midThreat} 저 앞의 수호자가 산 자의 길을 막고 있군. 시험을 통과하고 나아가라."`,
        5: `"${boss.midThreat} 저 문지기만 넘으면 드디어 [${boss.name}]과 마주 선다. 모든 힘을 쏟아부어라!"`
      };
      return {
        id: `act_${act}_ep_2`,
        chapter: `${ft.chapter} · ${ft.epTitles[1]}`,
        title: `${boss.name}의 수문장`,
        bgKey: resolvedBossId,
        actNum: act,
        bossId: resolvedBossId,
        lines: [
          { speaker: 'narrator', npcId, emotion: 'surprised', heroEmotion: 'surprised', text: midOpenings[act] },
          { speaker: 'npc', npcId, emotion: act === 2 ? 'smug' : 'angry', heroEmotion: 'neutral', text: midNpcLines[act] },
          {
            speaker: 'hero', npcId, emotion: 'angry', heroEmotion: 'angry',
            text: `"어차피 돌아갈 길은 없다. [${boss.name}]에게 가기 전에 방해되는 놈부터 치워주지."`,
            choices: [
              {
                label: '⚔️ 정면으로 문을 박차고 돌입한다!',
                replySpeaker: 'narrator', replyNpcId: npcId, replyEmotion: 'angry', heroEmotion: 'angry',
                reply: '무기를 고쳐 쥔 당신이 앞길을 막아선 수문장을 향해 거침없이 발을 내디딘다!'
              },
              {
                label: '🛡️ 숨을 고르고 빈틈을 노려 진입한다.',
                replySpeaker: 'narrator', replyNpcId: npcId, replyEmotion: 'smug', heroEmotion: 'smug',
                reply: '차가운 숨결을 내쉬며 자세를 낮춘다. 손등의 인장이 미세하게 빛나며 전투의 막이 오른다.'
              }
            ]
          }
        ]
      };
    }

    // ------------------------------------------------------------------------
    // EPISODE 3 (Stage 15 보스전 직전): ACTUAL FLOOR BOSS STEPS ON STAGE!
    // ------------------------------------------------------------------------
    return {
      id: `act_${act}_ep_3`,
      chapter: `${ft.chapter} · ${ft.epTitles[2]}`,
      title: `결전 · ${boss.name}`,
      bgKey: resolvedBossId,
      actNum: act,
      bossId: resolvedBossId,
      lines: [
        {
          speaker: 'narrator', bossId: resolvedBossId, emotion: 'surprised', heroEmotion: 'neutral',
          text: `제${act}계층 최심부, 육중한 봉인의 문이 열리자 압도적인 기운이 공기를 짓누른다. 제단 한가운데서 [${boss.sealName}]이 불길하게 맥동하고 있다.`
        },
        {
          speaker: 'boss', bossId: resolvedBossId, emotion: 'smug', heroEmotion: 'angry',
          text: boss.confront1
        },
        {
          speaker: 'hero', bossId: resolvedBossId, emotion: 'angry', heroEmotion: 'angry',
          text: boss.heroReply
        },
        {
          speaker: 'boss', bossId: resolvedBossId, emotion: 'angry', heroEmotion: 'angry',
          text: boss.confront2,
          choices: [
            {
              label: `⚔️ "${boss.sealName}을 되찾겠다!" (보스전 시작)`,
              replySpeaker: 'narrator', replyBossId: resolvedBossId, replyEmotion: 'angry', heroEmotion: 'angry',
              reply: `[${boss.name}]의 포효와 함께 제${act}계층의 운명을 건 결전이 시작된다!`
            },
            {
              label: '🔥 말없이 무기를 뽑아 들고 돌격한다! (보스전 시작)',
              replySpeaker: 'narrator', replyBossId: resolvedBossId, replyEmotion: 'smug', heroEmotion: 'smug',
              reply: '더 이상의 말은 필요 없다. 손등의 인장이 불타오르며 최후의 일격이 교차한다!'
            }
          ]
        }
      ]
    };
  }

  // Backward-compatible alias (returns Floor Episode 1 for actNum)
  function getActDialogueScene(actNum, charId, bossId = null) {
    return getFloorStoryEpisode(actNum, 1, charId, bossId);
  }

  // --------------------------------------------------------------------------
  // 6. GROUNDED TAVERN NPC CONVERSATIONS (Natural Worldbuilding, Zero Tutorial-Speak!)
  // --------------------------------------------------------------------------
  function getTavernNpcDialogue(npcId, bestAct = 1) {
    const map = {
      durnan: {
        id: 'npc_durnan',
        chapter: '🍺 잿빛 화덕 여관 · 난롯가',
        title: '더난과 꺼지지 않는 화덕',
        bgKey: 'lobby',
        lines: [
          {
            speaker: 'narrator', npcId: 'durnan', emotion: 'neutral', heroEmotion: 'neutral',
            text: '여관 한가운데의 커다란 우물에서 습한 바람이 올라온다. 더난이 낡은 천으로 잔을 닦으며 턱짓으로 의자를 권한다.'
          },
          {
            speaker: 'npc', npcId: 'durnan', emotion: bestAct >= 3 ? 'happy' : 'neutral', heroEmotion: 'neutral',
            text: bestAct >= 3
              ? '"3층까지 보고 살아 올라왔다고? 대단하군. 여기, 아껴뒀던 보리 맥주야. 오늘 밤 술값은 받지 않지."'
              : '"어젯밤 우물에서 기어 올라올 땐 반쯤 송장 같았는데, 눈빛이 꽤 돌아왔군. 또 저 밑으로 내려갈 셈인가?"'
          },
          {
            speaker: 'npc', npcId: 'durnan', emotion: 'smug', heroEmotion: 'neutral',
            text: '"내려가기 전에 한 잔 하며 숨 좀 돌려. 저 우물 밑은 급하게 굴다간 뼈도 못 추리는 곳이니까."',
            choices: [
              {
                label: '🍺 "붉은 월식이 뜬 밤에 대체 무슨 일이 있었죠?"',
                replySpeaker: 'npc', replyNpcId: 'durnan', replyEmotion: 'sad', heroEmotion: 'sad',
                reply: '"달이 핏빛으로 물들더니 우물 밑에서 천둥 같은 소리가 울렸어. 그날 내려갔던 원정대 스물여덟 명 중에… 살아 돌아온 건 자네 딱 한 사람뿐이야."'
              },
              {
                label: '⚔️ "뒤에 맨 대검은 오래된 물건 같네요."',
                replySpeaker: 'npc', replyNpcId: 'durnan', replyEmotion: 'happy', heroEmotion: 'smug',
                reply: '"젊은 시절에 저 밑 2층까지 내려갔다가 겨우 목숨만 건졌을 때 쓰던 거지. 자네는 나보다 훨씬 멀리 갈 것 같군."'
              }
            ]
          }
        ]
      },
      jaheira: {
        id: 'npc_jaheira',
        chapter: '🌿 잿빛 화덕 여관 · 척후 지도 앞',
        title: '자헤이라의 탑 정찰 기록',
        bgKey: 'lobby',
        lines: [
          {
            speaker: 'narrator', npcId: 'jaheira', emotion: 'neutral', heroEmotion: 'neutral',
            text: '자헤이라가 촛불 아래 펼쳐진 양피지 지도에 붉은 잉크로 선을 긋고 있다. 표정이 꽤 무겁다.'
          },
          {
            speaker: 'npc', npcId: 'jaheira', emotion: bestAct >= 4 ? 'happy' : 'angry', heroEmotion: 'neutral',
            text: bestAct >= 4
              ? '"4층 잿빛 회랑까지 뚫고 돌아왔더군. 솔직히 처음엔 자네가 1층도 넘기 힘들 줄 알았는데… 내가 틀렸어."'
              : '"탑의 구조가 매번 조금씩 뒤틀리고 있어. 각 층을 차지한 군주들이 인장 파편의 힘으로 방을 재배열하는 모양이야."'
          },
          {
            speaker: 'npc', npcId: 'jaheira', emotion: 'neutral', heroEmotion: 'neutral',
            text: '"출발 전에 정찰 보고서라도 훑어보고 가겠나?"',
            choices: [
              {
                label: '🗺️ "다섯 인장이 원래 어떤 힘이었나요?"',
                replySpeaker: 'npc', replyNpcId: 'jaheira', replyEmotion: 'sad', heroEmotion: 'neutral',
                reply: '"탐욕, 침묵, 이성, 안식, 그리고 심장. 다섯 균형이 맞물려야 탑이 잠잠했지. 하나가 깨지자 나머지도 전부 군주들 손에 떨어졌어."'
              },
              {
                label: '🌿 "사령관님은 왜 직접 내려가지 않으시죠?"',
                replySpeaker: 'npc', replyNpcId: 'jaheira', replyEmotion: 'smug', heroEmotion: 'surprised',
                reply: '"인장이 반응하는 건 손등에 파편이 박힌 자네뿐이니까. 난 위에서 우물 밖으로 기어 나오는 괴물들을 막고 있을게."'
              }
            ]
          }
        ]
      },
      guardian: {
        id: 'npc_guardian',
        chapter: '🔮 손등의 인장 · 고요한 공명',
        title: '천칭의 잔영과의 조우',
        bgKey: 'elder_brain_prime',
        lines: [
          {
            speaker: 'narrator', npcId: 'guardian', emotion: 'neutral', heroEmotion: 'neutral',
            text: '눈을 감자 여관의 소음이 멀어지고, 은빛 별가루가 흩날리는 고요한 공간 속에 푸른 실루엣이 나타난다.'
          },
          {
            speaker: 'npc', npcId: 'guardian', emotion: 'sad', heroEmotion: 'surprised',
            text: '"네 손등의 파편이 아직도 아프겠지. 미안하다… 그날 탑이 무너질 때, 네 목숨을 붙잡아두려면 파편을 네 살갗에 새기는 수밖에 없었다."'
          },
          {
            speaker: 'npc', npcId: 'guardian', emotion: 'neutral', heroEmotion: 'neutral',
            text: '"묻고 싶은 것이 있다면 지금 물어라. 오래 머물 수는 없다."',
            choices: [
              {
                label: '🔮 "다섯 인장을 전부 모으면 이 파편도 사라집니까?"',
                replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'happy', heroEmotion: 'happy',
                reply: '"그래. 천칭이 다시 닫히는 날, 네 손등의 낙인도 흔적 없이 사라질 것이다. 그때까지 내가 곁에서 길을 비추마."'
              },
              {
                label: '👁️ "당신은 삼백 년 전 탑을 세운 자입니까?"',
                replySpeaker: 'npc', replyNpcId: 'guardian', replyEmotion: 'smug', heroEmotion: 'surprised',
                reply: '"…그저 마지막까지 빗장을 붙잡다 부서져 버린 잔영일 뿐이다. 정상이 멀지 않으니, 네 눈으로 직접 진실을 확인해라."'
              }
            ]
          }
        ]
      },
      withers: {
        id: 'npc_withers',
        chapter: '💀 여관 구석 · 잿빛 장부',
        title: '위더스의 이름 없는 명부',
        bgKey: 'archlich_acererak',
        lines: [
          {
            speaker: 'narrator', npcId: 'withers', emotion: 'neutral', heroEmotion: 'neutral',
            text: '아무도 앉지 않는 여관 구석 자리. 마른 손가락이 깃펜을 굴리며 낡은 양피지에 누군가의 이름을 또박또박 적고 있다.'
          },
          {
            speaker: 'npc', npcId: 'withers', emotion: 'neutral', heroEmotion: 'neutral',
            text: '"산 자가 먼저 말을 걸어오는 일은 드물지. 걱정 말거라 — 오늘 장부에 그대의 이름은 아직 비워 두었으니."'
          },
          {
            speaker: 'npc', npcId: 'withers', emotion: 'sad', heroEmotion: 'neutral',
            text: '"죽음의 기록관에게 무엇을 묻고자 하는가?"',
            choices: [
              {
                label: '💀 "어째서 쓰러진 모험가들이 다시 이곳에서 눈을 뜨죠?"',
                replySpeaker: 'npc', replyNpcId: 'withers', replyEmotion: 'smug', heroEmotion: 'surprised',
                reply: '"다섯 번째 인장이 깨진 뒤로 이 탑 주변의 시간과 죽음마저 뒤틀렸다네. 천칭이 다시 닫힐 때까지, 그대의 발걸음은 멈추지 않을 것이야."'
              },
              {
                label: '🕯️ "먼저 내려간 동료들의 이름은 모두 적혀 있습니까?"',
                replySpeaker: 'npc', replyNpcId: 'withers', replyEmotion: 'happy', heroEmotion: 'sad',
                reply: '"단 한 사람도 빠짐없이 기억하고 있지. 그대가 인장을 닫는 날, 그들도 비로소 편히 눈을 감을 것이다."'
              }
            ]
          }
        ]
      },
      raphael: {
        id: 'npc_raphael',
        chapter: '😈 촛불이 흔들리는 붉은 탁자',
        title: '라파엘의 수상한 환대',
        bgKey: 'asmodeus_lord_of_ninth',
        lines: [
          {
            speaker: 'narrator', npcId: 'raphael', emotion: 'smug', heroEmotion: 'angry',
            text: '분명 방금 전까지 비어 있던 자리에 붉은 정장을 말끔히 차려입은 남자가 다리를 꼬고 앉아 포도주 잔을 돌리고 있다.'
          },
          {
            speaker: 'npc', npcId: 'raphael', emotion: 'smug', heroEmotion: 'angry',
            text: '"어이쿠, 그렇게 무서운 눈으로 보지 말게. 이 누추한 여관에 술 마시러 온 건 아니고… 자네가 꽤 재미있는 판에 끼어들었길래 구경하러 왔지."'
          },
          {
            speaker: 'npc', npcId: 'raphael', emotion: 'happy', heroEmotion: 'neutral',
            text: '"어떤가, 저 탑 꼭대기까지 올라가려면 꽤 험난할 텐데 말이지?"',
            choices: [
              {
                label: '😈 "당신도 다섯 번째 인장을 노리고 있는 거 아닌가?"',
                replySpeaker: 'npc', replyNpcId: 'raphael', replyEmotion: 'surprised', heroEmotion: 'smug',
                reply: '"호오, 눈치가 아주 빠르군! 하지만 걱정 말게. 자네가 5층까지 살아서 올라온다면… 그때 정정당당히 근사한 거래를 제안하지."'
              },
              {
                label: '🔥 "악마의 술잔은 사양하겠다. 볼일 없으면 사라져."',
                replySpeaker: 'npc', replyNpcId: 'raphael', replyEmotion: 'angry', heroEmotion: 'angry',
                reply: '"매정하기도 하지! 좋아, 붉은 월식 아래서 그 패기가 얼마나 오래 버티는지 두 눈 똑똑히 지켜보겠네."'
              }
            ]
          }
        ]
      },
      volo: {
        id: 'npc_volo',
        chapter: '🎻 잉크 냄새 가득한 구석 테이블',
        title: '볼로의 위험천만한 취재 수첩',
        bgKey: 'beholder_xanathar',
        lines: [
          {
            speaker: 'narrator', npcId: 'volo', emotion: 'happy', heroEmotion: 'surprised',
            text: '깃털 모자가 반쯤 그을린 음유시인이 잔뜩 구겨진 수첩을 펄럭이며 반갑게 손을 흔든다.'
          },
          {
            speaker: 'npc', npcId: 'volo', emotion: 'happy', heroEmotion: 'surprised',
            text: '"오오, 드디어 만났군! 방금 1층 입구만 살짝 엿보고 왔다가 고블린 화살에 모자를 뚫릴 뻔했다네! 자네 이야기로 대작 서사시를 써도 되겠나?"'
          },
          {
            speaker: 'npc', npcId: 'volo', emotion: 'smug', heroEmotion: 'neutral',
            text: '"내가 목숨 걸고 적어온 군주들 관찰 메모라도 한 장 들려주지!"',
            choices: [
              {
                label: '👁️ "1층의 비홀더 자나사르를 직접 보셨다고요?"',
                replySpeaker: 'npc', replyNpcId: 'volo', replyEmotion: 'surprised', heroEmotion: 'happy',
                reply: '"그럼! 금붕어 어항 앞에서 혼자 중얼거리는 걸 몰래 스케치하다가 돌이 될 뻔했지! 녀석, 어항을 건드리면 눈이 뒤집히니 조심하게!"'
              },
              {
                label: '🎻 "죽지 말고 여관에 얌전히 앉아서 적어 주세요."',
                replySpeaker: 'npc', replyNpcId: 'volo', replyEmotion: 'happy', heroEmotion: 'happy',
                reply: '"하하, 현명한 충고군! 자네가 5층 꼭대기를 정복하고 돌아오면 대륙 최고의 영웅담으로 완성해 놓겠네!"'
              }
            ]
          }
        ]
      }
    };
    return map[npcId] || map.durnan;
  }

  // --------------------------------------------------------------------------
  // 7. ALL 20 ACT BOSSES COMBAT INTRO QUOTES (Derived from BOSS_LORE!)
  // --------------------------------------------------------------------------
  const BOSS_INTROS = {};
  Object.keys(BOSS_LORE).forEach(bid => {
    BOSS_INTROS[bid] = BOSS_LORE[bid].confront1;
  });

  // --------------------------------------------------------------------------
  // 8. 8 BESPOKE SPIRE STORY EVENTS (Unified with the Five Seals World!)
  // --------------------------------------------------------------------------
  const BG_EVENTS = [
    {
      id: 'bg3_nautiloid_tadpole',
      npcId: 'guardian',
      title: '🔮 [첨탑 스토리] 균열 속 부서진 인장 파편',
      desc: '무너진 석실 한가운데서 보랏빛으로 맥동하는 작은 인장 파편을 발견했다. 손등의 낙인이 뜨겁게 공명하며 수호자의 목소리가 들려온다. "저 파편을 흡수하면 강한 힘을 얻지만 육체에 부담이 따를 것이다. 부수고 지나가도 좋다."',
      choices: [
        { label: '🔮 파편의 마력을 손등으로 흡수한다 (HP -8, 고등급 카드 보상 획득!)', type: 'guaranteed', effect: 'hp_for_rare_draft' },
        { label: '✨ [위저드 전용] 비전 술식으로 마력만 안전하게 정제한다 (무피해 카드 강화+)', type: 'guaranteed', requiredClass: 'wizard', effect: 'free_upgrade_one' },
        { label: '⚔️ 유혹을 뿌리치고 파편을 부숴 정화한다 (마석 +90 & EXP +40)', type: 'guaranteed', effect: 'gain_gems_exp' }
      ]
    },
    {
      id: 'bg3_raphael_house_of_hope',
      npcId: 'raphael',
      title: '😈 [첨탑 스토리] 붉은 신사 라파엘의 만찬',
      desc: '손가락을 튕기는 경쾌한 소리와 함께 붉은 유황 연기가 피어오른다. 정장 차림의 라파엘이 진수성찬과 함께 피로 적힌 계약서를 내민다. "쥐구멍에서 고생이 많군. 자, 내가 힘을 빌려주지 — 대가는 사소한 서명 하나뿐이야."',
      choices: [
        { label: '📜 라파엘의 계약서에 서명한다 (HP -8, 고등급 희귀/전설 카드 선택!)', type: 'guaranteed', effect: 'hp_for_rare_draft' },
        { label: '🛡️ [팔라딘 전용] 신성한 서약으로 악마의 만찬을 뒤엎는다 (카드 무료 강화+)', type: 'guaranteed', requiredClass: 'paladin', effect: 'free_upgrade_one' },
        { label: '🎲 라파엘의 계약 조항 허점을 찌른다 (D20 DC 13: 성공 시 +75 GP & 마석 +80 / 실패 시 HP -10 & 80 GP)', type: 'roll', dc: 13, successEffect: 'gain_gold_gems', failEffect: 'blood_for_gold' }
      ]
    },
    {
      id: 'bg3_withers_crypt',
      npcId: 'withers',
      title: '💀 [첨탑 스토리] 잿빛 예배당의 기록관 위더스',
      desc: '먼지 쌓인 예배당의 석관이 열리며 불사의 기록관 위더스가 조용히 일어선다. 차분한 눈빛으로 당신을 바라보며 그가 묻는다. "필멸자여, 단 하나의 생명은 얼마의 무게를 지니는가?"',
      choices: [
        { label: '⚖️ "모든 생명은 천칭으로 잴 수 없이 동등하다." (위더스의 축복: 카드 1장 무료 강화+)', type: 'guaranteed', effect: 'free_upgrade_one' },
        { label: '🪙 50 GP를 바치고 상처를 봉합한다 (체력 30% 회복)', type: 'guaranteed', effect: 'paid_heal_30' },
        { label: '🕯️ 말없이 고개를 숙여 예를 표하고 떠난다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_astral_prism_guardian',
      npcId: 'guardian',
      title: '🌌 [첨탑 스토리] 인장 너머 천칭의 잔영',
      desc: '전투 사이의 짧은 정적, 손등의 인장이 빛나며 은빛 허공으로 의식이 끌려 들어갔다. 수호자가 조용히 손을 내민다. "군주들의 기운이 강해지고 있다. 지금이라면 네 무기를 한 단계 더 벼려줄 수 있다."',
      choices: [
        { label: '✨ 수호자의 축복으로 무기를 단련한다 (카드 1장 무료 강화+)', type: 'guaranteed', effect: 'free_upgrade_one' },
        { label: '🗡️ [로그 전용] 허공에 흩어진 순수 마석 결정만 챙긴다 (마석 +90 & EXP +40)', type: 'guaranteed', requiredClass: 'rogue', effect: 'gain_gems_exp' },
        { label: '🎲 수호자의 숨겨진 기억을 엿본다 (D20 통찰 DC 12: 성공 시 고등급 카드 / 실패 시 체력 +6)', type: 'roll', dc: 12, successEffect: 'free_rare_draft', failEffect: 'safe_leave' }
      ]
    },
    {
      id: 'bg12_bhaalspawn_echo',
      npcId: 'jaheira',
      title: '🩸 [첨탑 스토리] 옛 원정대의 피 묻은 전비석',
      desc: '삼백 년 전 다섯 인장을 세웠던 옛 원정대가 남긴 피의 전비석. 깨진 칼날과 붉은 룬이 아직도 뜨거운 투지를 뿜어내며 당신의 혈관을 울린다.',
      choices: [
        { label: '⚔️ 전비석에 손을 얹어 옛 전사들의 투지를 깨운다 (HP -10, SP +1 & 카드 1장 강화+)', type: 'guaranteed', effect: 'spar_for_sp' },
        { label: '🪓 [바바리안 전용] 끓어오르는 투지를 포효로 온전히 받아낸다 (무피해 카드 강화+)', type: 'guaranteed', requiredClass: 'barbarian', effect: 'free_upgrade_one' },
        { label: '🕊️ 선배 전사들의 명복을 빌고 조용히 숨을 고른다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_auntie_ethel_teahouse',
      npcId: 'jaheira',
      title: '🫖 [첨탑 스토리] 안개 늪지 노파의 찻집',
      desc: '음산한 미궁 한복판에 기묘하게 아늑한 오두막이 서 있다. 자헤이라의 정찰 메모가 떠오른다 — "미궁 속 찻집 노파는 그린 해그다, 절대 속지 마라." 인자한 미소의 노파가 김이 나는 약차를 건네지만 바닥 그림자엔 긴 발톱이 비친다!',
      choices: [
        { label: '🍵 위험을 감수하고 기묘한 약차를 마신다 (HP -10, 황금 80 GP 획득)', type: 'guaranteed', effect: 'blood_for_gold' },
        { label: '🏹 [레인저 전용] 늪지의 환각을 간파하고 숨겨진 보급품을 챙긴다 (마석 +90 & EXP +40)', type: 'guaranteed', requiredClass: 'ranger', effect: 'gain_gems_exp' },
        { label: '🚶 "사양하겠습니다." 조용히 발걸음을 돌린다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_volo_eye_surgery',
      npcId: 'volo',
      title: '👁️ [첨탑 스토리] 음유시인 볼로의 괴짜 실험',
      desc: '어떻게 여기까지 기어 내려왔는지, 탐험가 볼로가 반짝이는 마법 돋보기와 얼음송곳을 들고 열정적으로 다가온다. "오, 자네! 손등의 인장을 증폭하는 기발한 시술법을 발명했네! 눈 딱 감고 맡겨보게!"',
      choices: [
        { label: '👁️ 볼로의 무모한 마법 시술을 받아본다 (HP -10, SP +1 & 카드 강화+)', type: 'guaranteed', effect: 'spar_for_sp' },
        { label: '📖 볼로의 허풍 섞인 모험담만 들으며 휴식한다 (체력 +6 회복)', type: 'guaranteed', effect: 'safe_leave' }
      ]
    },
    {
      id: 'bg3_emerald_grove_idol',
      npcId: 'jaheira',
      title: '🌿 [첨탑 스토리] 지하 샘터의 고대 성소',
      desc: '어둠뿐인 탑 한구석에서 맑은 지하수가 솟는 작은 자연 성소를 발견했다. 이끼 낀 석상 위로 은빛 빛줄기가 고요히 내려앉고 있다.',
      choices: [
        { label: '🙏 성소에 50 GP를 봉헌하고 깊은 치유를 받는다 (체력 30% 회복)', type: 'guaranteed', effect: 'paid_heal_30' },
        { label: '✝️ [클레릭 전용] 성소의 맑은 빛과 기도로 공명한다 (무피해 카드 강화+)', type: 'guaranteed', requiredClass: 'cleric', effect: 'free_upgrade_one' },
        { label: '🌿 자연의 숨결을 받아들이며 마석과 경험을 얻는다 (마석 +90 & EXP +40)', type: 'guaranteed', effect: 'gain_gems_exp' }
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // 9. BESPOKE SKILL FLAVOR LORE FOR ALL 359 CARDS!
  // --------------------------------------------------------------------------
  const SUBCLASS_FLAVOR_TEMPLATES = {
    fighter_shared: ['북부 전선의 베테랑 용병들이 수십 년간 갈고닦은 정통 검술.', '강철 방패술은 거대한 발톱 앞에서도 결코 흔들리지 않는다.', '깊은 숨을 들이마시며 전장의 상처를 의지로 억누르는 전사의 호흡.', '찰나의 틈에 시간마저 추월해 연타를 쏟아붓는 전설의 무예.'],
    champion: ['무패 검투사가 수많은 실전 끝에 남긴 완벽한 급소 타격.', '수천 번의 단련 끝에 강철보다 단단해진 챔피언의 육체.', '전장의 함성처럼 적을 압도하는 순수한 무력의 일격.', '치명적인 일격 하나로 전황을 뒤집는 영웅의 검기.'],
    battlemaster: ['전술 교본의 한 페이지를 전장 위에 그대로 그려내는 지휘관의 수.', '상대의 빈틈을 읽어 반격으로 되돌려주는 노련한 검사의 기술.', '불리한 전황에서도 침착하게 활로를 여는 전장의 두뇌.', '단 한 번의 패링으로 적의 전의를 꺾어버리는 명인의 교전술.'],
    eldritch_knight: ['강철 칼날에 비전 룬을 새겨 마법과 무예를 하나로 엮어냈다.', '고대 검마법사들이 남긴 번개와 화염의 검기.', '손짓 한 번으로 검을 소환하고 비전 방벽을 펼치는 마검사의 비기.', '주문과 검격이 교차하는 순간, 적의 방어는 무의미해진다.'],
    echo_knight: ['뒤틀린 시간선의 틈새에서 또 다른 가능성의 나를 불러낸다.', '두 개의 그림자가 겹치는 찰나, 잔상이 동시에 칼을 휘두른다.', '과거와 현재의 위치를 교대하며 적의 일격을 허공으로 흘린다.', '차원 균열 너머에서 울려 퍼지는 에코 나이트의 이중 검격.'],
    barbarian_shared: ['설원의 폭풍처럼 거침없이 내려찍는 거대 도끼의 굉음.', '갑옷 따위는 필요 없다 — 야성적인 근육과 투지가 곧 철벽이다.', '방어를 버리고 오직 파괴에 몸을 던지는 광전사의 돌격.', '혈관 속 아드레날린이 끓어오르며 고통마저 힘으로 바꾼다.'],
    berserker: ['이성의 고삐를 놓는 순간, 전장은 오직 피와 도끼의 무대가 된다.', '북부 부족 전사들의 피를 끓게 하는 광란의 포효.', '적이 쓰러질 때까지 멈추지 않는 광전사의 무자비한 난도질.', '상처가 깊어질수록 더욱 맹렬해지는 야수의 일격.'],
    totem_warrior: ['고대 곰과 독수리, 늑대의 정령이 전사의 어깨 위에 강림한다.', '대자연의 원시 수호령이 전사의 육체를 강철처럼 감싼다.', '숲의 최상위 포식자처럼 먹잇감을 향해 도약하는 토템의 힘.', '부족의 영혼이 깃든 문양이 붉게 빛나며 야성을 해방한다.'],
    ancestral_guardian: ['전사한 선조들의 영혼이 푸른 안개처럼 나타나 후손을 수호한다.', '고대 부족 영웅들의 방패가 적의 치명적인 일격을 가로막는다.', '선조의 분노가 적의 시선을 묶고 전장의 흐름을 지배한다.', '핏줄에 새겨진 영혼의 함성이 어둠 속 적들을 떨게 한다.'],
    wild_magic: ['변덕스러운 야생 마력이 도끼 끝에서 무지갯빛으로 폭발한다.', '예측할 수 없는 마력의 파동이 적과 전장을 뒤흔든다.', '마력의 소용돌이를 몸으로 받아내어 순수한 파괴력으로 바꾼다.', '광기와 요정 마법이 뒤섞인 예측 불허의 일격.'],
    rogue_shared: ['뒷골목의 숙련된 도적들이 애용하는 맹독 단검술.', '그림자 속으로 미끄러지듯 몸을 숨겨 적의 시야에서 사라진다.', '찰나의 틈을 파고들어 전장을 농락하는 교활한 발놀림.', '적의 빈틈이 열리는 순간, 치명적인 급소 일격이 꽂힌다.'],
    thief: ['눈보다 빠른 손놀림으로 전장의 주도권과 전리품을 훔쳐낸다.', '연막과 함정으로 적을 교란하는 괴도의 기술.', '어떤 자물쇠도, 어떤 방어선도 대도의 손끝에선 열리고 만다.', '금화와 단검이 동시에 번쩍이는 뒷골목 길드의 비기.'],
    assassin: ['와이번의 맹독을 바른 칼날은 스치기만 해도 죽음을 예약한다.', '어둠 속에서 전수된 무음 암살의 극의.', '표적이 눈치챘을 때는 이미 심장에 단검이 꽂힌 뒤다.', '독안개와 어둠 속에서 완벽한 일격을 완성하는 암살자의 미학.'],
    arcane_trickster: ['보이지 않는 마법사의 손이 적의 허점을 교묘하게 파고든다.', '거울 분신과 환영 단검으로 적의 감각을 완벽히 속여 넘긴다.', '비전 마법과 도적의 기지를 결합한 영리한 트릭스터의 묘수.', '진짜와 가짜의 경계를 허물며 치명타를 꽂아 넣는 환영술.'],
    phantom: ['죽음의 문턱에서 울려 퍼지는 망자들의 통곡이 칼날에 깃든다.', '영혼의 조각에 봉인된 원념이 적의 생명력을 직접 베어낸다.', '산 자와 죽은 자의 경계를 걷는 유령 암살자의 서늘한 속삭임.', '잿빛 회랑의 차가운 안개가 단검 끝에서 영혼을 수확한다.'],
    ranger_shared: ['장궁의 시위가 울리는 순간, 바람을 가르는 화살이 명중한다.', '어두운 숲과 지하동굴에서 살아남은 정찰병의 완벽한 위장술.', '한 번 사냥꾼의 징표가 찍힌 먹잇감은 끝내 도망칠 수 없다.', '자연의 축복이 담긴 열매가 지친 모험가의 기력을 되살린다.'],
    hunter_conclave: ['거대 괴수의 약점을 꿰뚫기 위해 고안된 사냥꾼의 정밀 사격.', '몰려드는 무리를 단숨에 꿰뚫어 버리는 연쇄 화살비.', '쌍시미터와 장궁을 자유자재로 오가는 전설의 거수 학살자.', '사냥터의 지형을 완벽히 장악하는 베테랑 레인저의 감각.'],
    beast_master: ['은빛 표범 동료의 날카로운 발톱이 어둠을 가른다.', '사냥꾼과 영혼으로 이어진 야수가 완벽한 호흡으로 협공한다.', '주인을 지키기 위해 몸을 던지는 충직한 야수의 수호 본능.', '원시의 포효와 화살이 동시에 적의 숨통을 조여온다.'],
    gloom_stalker: ['빛 한 점 없는 지하동굴의 어둠은 오히려 글룸 스토커의 무대다.', '어둠 속에서 첫 번째 일격을 날릴 때, 적은 그림자조차 보지 못한다.', '흔적 없는 발걸음으로 매복해 공포의 연사를 퍼붓는다.', '암흑 시야 너머로 정확히 심장을 겨누는 심연의 저격수.'],
    fey_wanderer: ['요정 숲의 매혹적인 안개와 가시덩굴이 전장을 뒤덮는다.', '아름다운 미소 뒤에 숨겨진 서늘한 정신 타격.', '안개 걸음으로 공간을 도약하며 꽃잎과 가시를 동시에 흩뿌린다.', '요정계의 축복이 깃든 환상적인 무기술.'],
    wizard_shared: ['공기 중의 마력 실타래를 손끝으로 엮어 불꽃 화살을 쏘아낸다.', '보이지 않는 비전 역장이 마법사의 몸을 갑옷처럼 감싼다.', '결코 빗나가지 않는 순수 마력의 화살이 적을 끝까지 추적한다.', '찰나의 영창으로 치명적인 공격을 튕겨내는 비전 방어술.'],
    evocation: ['원소의 분노를 순수한 파괴의 불꽃과 번개로 해방하는 방출학파.', '손바닥에서 터져 나오는 작열 광선이 전장을 화염 바다로 물들인다.', '고대 대마도사들이 기록한 파괴 마법의 정수.', '화염과 냉기, 전격이 어우러진 대마도사의 궁극 원소술.'],
    abjuration: ['겹겹이 쌓아 올린 비전 수호막이 어떤 주문과 칼날도 무력화한다.', '적의 마법을 허공에서 지워버리는 완벽한 마법 무효화.', '고대 방호의 문양이 바닥에 새겨지며 침입자를 심판한다.', '방어 자체가 최강의 무기가 되는 방호학파의 비전 결계.'],
    necromancy: ['죽음의 문턱을 넘나들며 망자의 기운과 냉기를 불러낸다.', '종소리가 울릴 때마다 상처 입은 적의 생명이 시들어간다.', '금단의 사령술로 영혼을 흡수해 거짓된 생명력을 빚어낸다.', '아세라락조차 경계한 심연의 사령학파 비술.'],
    divination: ['예지 주사위로 미래의 한 장면을 엿보고 운명을 유리하게 비튼다.', '적의 마음을 꿰뚫는 정신 쐐기와 진실의 시선.', '이미 예견된 승리를 향해 정확히 수를 놓는 예지학파의 지혜.', '별자리와 시간의 실타래를 읽어내는 대현자의 통찰.'],
    cleric_shared: ['하늘에서 쏟아지는 신성한 불꽃이 어둠의 피조물을 정화한다.', '신앙의 방패가 모험가의 영혼과 육신을 굳건히 지켜낸다.', '빛의 화살이 적을 비추며 다음 아군의 일격을 인도한다.', '성스러운 영혼 수호자들이 사제의 주위를 선회하며 악을 징벌한다.'],
    life_domain: ['자비로운 치유의 빛이 상처 입은 육신에 새 생명을 불어넣는다.', '치유의 기도가 넘쳐흘러 단단한 신성 보호막으로 승화한다.', '절망적인 전투에서도 끝내 쓰러지지 않게 지탱하는 생명의 축복.', '가장 어두운 심연 속에서 피어나는 불멸의 치유 광휘.'],
    light_domain: ['눈부신 수호의 섬광이 적의 시야를 태우고 공격을 빗나가게 한다.', '어둠의 저주마저 불태워버리는 정오의 태양 광휘.', '요정 불꽃과 타오르는 빛줄기가 어둠 속 숨은 적을 드러낸다.', '태양의 진노를 지상에 강림시키는 빛 권역의 성화.'],
    war_domain: ['전쟁의 축복 아래 사제의 철퇴가 번개처럼 내리꽂힌다.', '영체 대검이 허공에 소환되어 신의 이름으로 적을 심판한다.', '기도와 함성이 하나로 어우러진 전쟁 사제의 맹공.', '신성한 갑주와 흔들리지 않는 투지로 전선의 선두에 선다.'],
    grave_domain: ['삶과 죽음의 경계를 수호하는 무덤 권역의 냉철한 심판.', '죽어가는 자를 구하고 불경한 언데드를 영면으로 인도한다.', '무덤의 눈길이 적의 치명적인 약점을 꿰뚫어 부패의 저주를 내린다.', '죽음의 저울이 기울어지며 적의 운명을 선고한다.'],
    paladin_shared: ['성스러운 맹세가 깃든 성검이 어둠을 가르고 찬란히 빛난다.', '동료를 위해 가장 먼저 앞을 가로막는 성기사의 강철 방패.', '칼날이 닿는 순간 하늘의 천벌이 함께 내려꽂히는 신성한 강타!', '손을 얹는 것만으로 치명적인 상처를 닫는 안수 치료의 기적.'],
    devotion: ['어떠한 유혹과 타락 앞에서도 순수한 빛을 지키는 헌신의 성역.', '천둥 같은 신성 강타로 불경한 존재들을 전장에서 퇴치한다.', '정의와 명예의 맹세가 성기사의 검을 태양처럼 타오르게 한다.', '선조 봉인 기사단이 계승한 고결한 성검술.'],
    vengeance: ['악을 향한 타오르는 분노가 적의 도주로를 끝까지 추적한다.', '자비 없는 심판관의 검격이 죄인에게 가혹한 대가를 치르게 한다.', '안개 걸음으로 단숨에 거리를 좁혀 분노의 강타를 꽂아 넣는다.', '복수의 맹세 앞에서는 누구도 적을 용서하지 않는다.'],
    conquest: ['천상의 그리폰 군마와 함께 전장을 짓밟는 압도적인 정복의 위엄.', '적의 심장에 공포를 심어 무릎 꿇게 만드는 철권의 오라.', '전장의 지배자로 군림하며 모든 저항을 분쇄하는 기마 돌격.', '질서와 힘으로 혼돈을 평정하는 정복의 맹세.'],
    oathbreaker: ['깨어진 맹세의 자리에서 검붉은 어둠과 지옥의 불꽃이 타오른다.', '타락한 기사의 권능으로 적에게 끔찍한 공포와 상처를 새긴다.', '빛을 버린 대신 얻어낸 금지된 지옥의 질책과 파멸의 검술.', '어둠마저 복종시키는 배반의 흑기사의 압도적인 저주.'],
    warlock_shared: ['차원 너머 초월적 존재와 맺은 계약이 보랏빛 파열 광선으로 터진다.', '악마의 갑옷과 아가시스의 서리가 계약자의 육신을 감싼다.', '주술의 낙인이 찍힌 적은 매 순간 고통스러운 저주에 시달린다.', '금지된 대가로 손에 넣은 가장 순수한 공허의 마력.'],
    fiend_patron: ['불타는 심연의 대악마가 하사한 지옥불이 전장을 잿더미로 바꾼다.', '적을 쓰러뜨릴 때마다 어둠의 존재가 뜨거운 생명력을 하사한다.', '유황과 불길 속에서 강림한 지옥마신 핀드의 맹렬한 협공.', '계약의 불꽃은 어떤 방패마저 녹여버린다.'],
    hexblade: ['잿빛 회랑의 지성 있는 마검과 영혼을 결속한 저주 검사의 비기.', '헥스블레이드의 저주가 새겨진 적은 피할 수 없는 치명타를 맞는다.', '칼날이 피에 굶주릴수록 어둠의 마력이 검신을 휘감는다.', '중갑과 비전 방패, 그리고 영혼을 베는 마검의 완벽한 조화.'],
    great_old_one: ['별들 너머 위대한 옛 존재의 시선이 적의 이성을 산산조각 낸다.', '불협화음의 속삭임과 엔트로피 방패가 현실의 법칙을 왜곡한다.', '심연의 군주마저 두려워하는 태고의 우주적 공포가 전장에 스며든다.', '각성한 정신의 파동이 적의 의지를 심연으로 끌어내린다.'],
    archfey_chain: ['사슬의 계약으로 묶인 영리한 임프와 요정 사역마가 전장을 누빈다.', '카르체리의 사슬이 적을 속박하고 사역마 군단의 총진격을 지휘한다.', '투명화와 맹독 침으로 적의 허점을 찌르는 계약 사역마의 기습.', '요정 군주와 심연의 사슬이 빚어낸 치명적인 소환 마법.'],
    status_curse: ['뒤틀린 첨탑의 저주와 상태이상이 모험가의 손패와 정신을 짓누른다.', '전투의 상흔과 깨진 인장의 어둠이 남긴 불길한 잔재.']
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
      ftr_sh_1: '수많은 원정대 전사들이 가장 먼저 익히는 정통 강철 검술.',
      ftr_sh_4: '찰나의 집중으로 한계를 넘어서는 파이터의 상징 — 행동 연쇄.',
      bar_sh_4: '붉은 월식처럼 끓어오르는 분노가 모든 고통을 삼킨다.',
      rog_sh_4: '적의 시선이 흔들리는 0.1초, 암살자의 칼날이 급소를 꿰뚫는다.',
      rng_sh_3: '한 번 사냥꾼의 눈에 각인된 표적은 어둠 끝까지 추적당한다.',
      wiz_sh_1: '공기 중의 마력을 손끝으로 엮어 쏘아내는 가장 완벽한 화염탄.',
      wiz_sh_3: '결코 빗나가지 않는 비전 화살들이 어둠 속 적을 정확히 찾아간다.',
      clr_sh_1: '하늘에서 떨어지는 정화의 불꽃이 언데드와 악을 재로 돌린다.',
      pal_sh_3: '검이 닿는 순간 천상의 벼락이 함께 작렬하는 성기사의 궁극 심판.',
      wlk_sh_1: '초월적 존재와 맺은 계약의 힘 — 보랏빛 파열 광선이 허공을 찢는다.',
      status_slimed: '끈적한 지하 점액이 장비와 손패에 들러붙어 움직임을 둔화시킨다.',
      status_burn: '꺼지지 않는 유황 불꽃이 손끝을 태운다.',
      status_dazed: '날카로운 사이오닉 충격이 머릿속을 하얗게 마비시킨다.',
      status_wound: '깊게 패인 상처가 전투 내내 호흡을 방해한다.',
      curse_pain: '깨진 인장의 잔재와 심연의 저주가 영혼 깊숙이 고통을 남긴다.'
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
        1: { name: '제1계층: 침수된 밀수굴과 잿빛 성채', subtitle: '첫 번째 인장 [탐욕의 쇠사슬]을 품은 군주의 영역 (Stage 1~15)' },
        2: { name: '제2계층: 빛 없는 지하동굴과 거미 신전', subtitle: '두 번째 인장 [침묵의 비단]이 잠든 어둠의 심연 (Stage 1~15)' },
        3: { name: '제3계층: 맥동하는 생체 군락과 수정 회랑', subtitle: '세 번째 인장 [이성의 왕관]을 둘러싼 사념의 전선 (Stage 1~15)' },
        4: { name: '제4계층: 잿빛 망령 회랑과 공포의 무덤', subtitle: '네 번째 인장 [안식의 촛불]이 꺼져가는 망자의 길 (Stage 1~15)' },
        5: { name: '제5계층: 붉은 월식의 정상과 부서진 천칭', subtitle: '다섯 번째 인장 [천칭의 심장] — 최후의 결전 (Stage 1~15)' }
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
    rebuildNpcSprites,
    getNpcEmotionSprite,
    MAIN_STORY,
    FLOOR_THEMES,
    BOSS_LORE,
    getBossLore,
    CLASS_ORIGINS,
    ACT_CHAPTERS,
    VICTORY_EPILOGUE,
    BOSS_INTROS,
    BG_EVENTS,
    getMainStoryScene,
    getFloorStoryEpisode,
    getActDialogueScene,
    getTavernNpcDialogue,
    applyStoryToGameData
  };

  if (typeof window !== 'undefined' && window.GAME_DATA) {
    applyStoryToGameData(window.GAME_DATA);
  }
})();
