// ============================================================================
// D&D 5E SPIRE II — ACHIEVEMENT & UNLOCK PROGRESSION ENGINE (achievements.js)
// - Starter Roster: 3 Core Classes (Fighter, Rogue, Wizard)
// - 5 Class Unlocks (Barbarian, Ranger, Cleric, Paladin, Warlock)
// - 16 Advanced Subclass Unlocks (2 per class; base 2 unlocked by default!)
// - 7 Legendary Card Pool & Spire Conquest Achievements
// - Total: 28 Achievements with live progress bars, Gem rewards & fanfare toasts!
// ============================================================================
(function () {
  const STARTER_CLASSES = ['fighter', 'rogue', 'wizard'];

  // 28 Handcrafted Achievements across 3 categories: 'class', 'subclass', 'legendary'
  const ACHIEVEMENTS = [
    // ========================================================================
    // 1. CLASS UNLOCKS (5 Achievements -> Unlock remaining 5 of 8 Classes!)
    // ========================================================================
    {
      id: 'ach_unlock_barbarian',
      category: 'class',
      icon: '🪓',
      name: '광기의 전조',
      desc: '단일 턴에 피해 30 이상 가하거나, 누적 몬스터 8마리 처치',
      rewardText: '🔓 클래스 해금: 바바리안 + 💎 100',
      gemReward: 100,
      unlockClass: 'barbarian',
      progress: s => ({ cur: Math.min(8, Math.max(s.totalKills || 0, (s.maxTurnDmg || 0) >= 30 ? 8 : 0)), max: 8 }),
      check: s => (s.maxTurnDmg || 0) >= 30 || (s.totalKills || 0) >= 8
    },
    {
      id: 'ach_unlock_ranger',
      category: 'class',
      icon: '🏹',
      name: '미궁의 추적자',
      desc: '제1계층 8F 중간보스 처치 또는 누적 엘리트 2회 토벌',
      rewardText: '🔓 클래스 해금: 레인저 + 💎 120',
      gemReward: 120,
      unlockClass: 'ranger',
      progress: s => ({ cur: Math.min(2, Math.max(s.elitesKilled || 0, (s.midBossesKilled || 0) >= 1 ? 2 : 0)), max: 2 }),
      check: s => (s.midBossesKilled || 0) >= 1 || (s.elitesKilled || 0) >= 2
    },
    {
      id: 'ach_unlock_cleric',
      category: 'class',
      icon: '✝️',
      name: '여명의 수호자',
      desc: '전투 중 누적 방어도 120 획득 또는 체력 누적 35 회복',
      rewardText: '🔓 클래스 해금: 클레릭 + 💎 120',
      gemReward: 120,
      unlockClass: 'cleric',
      progress: s => ({ cur: Math.min(120, Math.max(s.totalBlockGained || 0, (s.totalHealed || 0) >= 35 ? 120 : 0)), max: 120 }),
      check: s => (s.totalBlockGained || 0) >= 120 || (s.totalHealed || 0) >= 35
    },
    {
      id: 'ach_unlock_paladin',
      category: 'class',
      icon: '🛡️',
      name: '제1계층 정복자',
      desc: '제1계층 15F 최종 보스를 토벌하여 제2계층에 도달',
      rewardText: '🔓 클래스 해금: 팔라딘 + 💎 180',
      gemReward: 180,
      unlockClass: 'paladin',
      progress: s => ({ cur: Math.min(1, s.bossesKilled || 0), max: 1 }),
      check: s => (s.bossesKilled || 0) >= 1 || (s.maxActReached || 1) >= 2
    },
    {
      id: 'ach_unlock_warlock',
      category: 'class',
      icon: '👁️',
      name: '심연의 계약자',
      desc: '누적 디버프/상태이상 45중첩 부여 또는 제2계층 도달',
      rewardText: '🔓 클래스 해금: 워락 + 💎 160',
      gemReward: 160,
      unlockClass: 'warlock',
      progress: s => ({ cur: Math.min(45, Math.max(s.totalDebuffsApplied || 0, (s.maxActReached || 1) >= 2 ? 45 : 0)), max: 45 }),
      check: s => (s.totalDebuffsApplied || 0) >= 45 || (s.maxActReached || 1) >= 2
    },

    // ========================================================================
    // 2. LEGENDARY CARD POOL & SPIRE CONQUEST (7 Achievements)
    // ========================================================================
    {
      id: 'ach_leg_martial',
      category: 'legendary',
      icon: '⚔️',
      name: '일격필살의 무인',
      desc: '단일 카드/타격으로 40 이상 피해 또는 단일 턴 55+ 피해 기록',
      rewardText: '👑 전설 카드 해금 (파이터·바바리안) + 💎 150',
      gemReward: 150,
      unlockLegendaryClasses: ['fighter', 'barbarian'],
      progress: s => ({ cur: Math.min(40, Math.max(s.maxSingleHit || 0, (s.maxTurnDmg || 0) >= 55 ? 40 : 0)), max: 40 }),
      check: s => (s.maxSingleHit || 0) >= 40 || (s.maxTurnDmg || 0) >= 55
    },
    {
      id: 'ach_leg_stealth',
      category: 'legendary',
      icon: '🗡️',
      name: '무결점의 그림자',
      desc: '체력 피해를 단 1도 입지 않고 전투에서 승리 (완벽한 승리 2회)',
      rewardText: '👑 전설 카드 해금 (로그·레인저) + 💎 150',
      gemReward: 150,
      unlockLegendaryClasses: ['rogue', 'ranger'],
      progress: s => ({ cur: Math.min(2, s.perfectCombats || 0), max: 2 }),
      check: s => (s.perfectCombats || 0) >= 2
    },
    {
      id: 'ach_leg_arcane',
      category: 'legendary',
      icon: '🔮',
      name: '대마도사의 연쇄',
      desc: '단일 턴에 카드 6장 이상 사용 또는 클래스 궁극 개방 5회 발동',
      rewardText: '👑 전설 카드 해금 (위저드·워락) + 💎 150',
      gemReward: 150,
      unlockLegendaryClasses: ['wizard', 'warlock'],
      progress: s => ({ cur: Math.min(5, Math.max(s.burstsTriggered || 0, (s.maxCardsInTurn || 0) >= 6 ? 5 : 0)), max: 5 }),
      check: s => (s.maxCardsInTurn || 0) >= 6 || (s.burstsTriggered || 0) >= 5
    },
    {
      id: 'ach_leg_divine',
      category: 'legendary',
      icon: '✨',
      name: '불굴의 성채',
      desc: '단일 전투 중 방어도 40 이상 누적 또는 누적 카드 강화(+) 3회',
      rewardText: '👑 전설 카드 해금 (클레릭·팔라딘) + 💎 150',
      gemReward: 150,
      unlockLegendaryClasses: ['cleric', 'paladin'],
      progress: s => ({ cur: Math.min(40, Math.max(s.maxSingleBlock || 0, (s.cardsUpgraded || 0) >= 3 ? 40 : 0)), max: 40 }),
      check: s => (s.maxSingleBlock || 0) >= 40 || (s.cardsUpgraded || 0) >= 3
    },
    {
      id: 'ach_conquest_act2',
      category: 'legendary',
      icon: '🕷️',
      name: '언더다크의 패자',
      desc: '제2계층 15F 보스를 토벌하여 제3계층에 도달',
      rewardText: '👑 전 클래스 전설 카드 완전 해금 + 💎 300',
      gemReward: 300,
      unlockLegendaryClasses: ['fighter', 'barbarian', 'rogue', 'ranger', 'wizard', 'cleric', 'paladin', 'warlock'],
      progress: s => ({ cur: Math.min(3, s.maxActReached || 1), max: 3 }),
      check: s => (s.maxActReached || 1) >= 3
    },
    {
      id: 'ach_conquest_act4',
      category: 'legendary',
      icon: '💀',
      name: '공포의 무덤 돌파자',
      desc: '제4계층을 돌파하여 제5계층 나인 헬 아베르누스 도달',
      rewardText: '💎 등반 마석 +500 & 지옥 원정대 칭호',
      gemReward: 500,
      progress: s => ({ cur: Math.min(5, s.maxActReached || 1), max: 5 }),
      check: s => (s.maxActReached || 1) >= 5
    },
    {
      id: 'ach_conquest_tiamat',
      category: 'legendary',
      icon: '🐉',
      name: '오색룡 티아마트 토벌자',
      desc: '언더마운틴 5계층(75 스테이지) 최종 보스 완전 정복!',
      rewardText: '💎 등반 마석 +1,000 & 전설의 등반가 칭호',
      gemReward: 1000,
      progress: s => ({ cur: Math.min(1, s.totalVictories || 0), max: 1 }),
      check: s => (s.totalVictories || 0) >= 1
    },

    // ========================================================================
    // 3. SUBCLASS UNLOCKS (16 Achievements: 2 Advanced Subclasses per Class!)
    //    (Each class starts with subclasses[0] & subclasses[1] unlocked!)
    // ========================================================================
    // Fighter: eldritch_knight, echo_knight
    {
      id: 'ach_sub_eldritch_knight',
      category: 'subclass',
      icon: '⚡',
      name: '파이터 수련: 마검의 서약',
      desc: '파이터로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 엘드리치 나이트 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'eldritch_knight',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.fighter) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.fighter) || 0) >= 6
    },
    {
      id: 'ach_sub_echo_knight',
      category: 'subclass',
      icon: '👥',
      name: '파이터 각성: 시간선의 잔상',
      desc: '파이터로 제1계층 보스 처치 또는 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 에코 나이트 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'echo_knight',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.fighter) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.fighter) || 1) >= 10
    },
    // Barbarian: ancestral_guardian, wild_magic
    {
      id: 'ach_sub_ancestral_guardian',
      category: 'subclass',
      icon: '👻',
      name: '바바리안 수련: 선조의 함성',
      desc: '바바리안으로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 선조의 수호자 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'ancestral_guardian',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.barbarian) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.barbarian) || 0) >= 6
    },
    {
      id: 'ach_sub_wild_magic',
      category: 'subclass',
      icon: '🌈',
      name: '바바리안 각성: 야생 마력 폭주',
      desc: '바바리안으로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 와일드 매직 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'wild_magic',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.barbarian) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.barbarian) || 1) >= 10
    },
    // Rogue: arcane_trickster, phantom
    {
      id: 'ach_sub_arcane_trickster',
      category: 'subclass',
      icon: '🃏',
      name: '로그 수련: 환영의 손재주',
      desc: '로그로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 아케인 트릭스터 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'arcane_trickster',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.rogue) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.rogue) || 0) >= 6
    },
    {
      id: 'ach_sub_phantom',
      category: 'subclass',
      icon: '💀',
      name: '로그 각성: 망자의 속삭임',
      desc: '로그로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 팬텀 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'phantom',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.rogue) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.rogue) || 1) >= 10
    },
    // Ranger: gloom_stalker, fey_wanderer
    {
      id: 'ach_sub_gloom_stalker',
      category: 'subclass',
      icon: '🌑',
      name: '레인저 수련: 암흑 매복자',
      desc: '레인저로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 글룸 스토커 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'gloom_stalker',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.ranger) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.ranger) || 0) >= 6
    },
    {
      id: 'ach_sub_fey_wanderer',
      category: 'subclass',
      icon: '🌸',
      name: '레인저 각성: 요정계의 방랑자',
      desc: '레인저로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 페이 원더러 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'fey_wanderer',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.ranger) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.ranger) || 1) >= 10
    },
    // Wizard: necromancy, divination
    {
      id: 'ach_sub_necromancy',
      category: 'subclass',
      icon: '☠️',
      name: '위저드 수련: 금단의 사령술',
      desc: '위저드로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 사령학파 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'necromancy',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.wizard) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.wizard) || 0) >= 6
    },
    {
      id: 'ach_sub_divination',
      category: 'subclass',
      icon: '🎲',
      name: '위저드 각성: 운명의 예지자',
      desc: '위저드로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 예지학파 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'divination',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.wizard) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.wizard) || 1) >= 10
    },
    // Cleric: war_domain, grave_domain
    {
      id: 'ach_sub_war_domain',
      category: 'subclass',
      icon: '⚔️',
      name: '클레릭 수련: 전쟁신의 사제',
      desc: '클레릭으로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 전쟁 권역 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'war_domain',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.cleric) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.cleric) || 0) >= 6
    },
    {
      id: 'ach_sub_grave_domain',
      category: 'subclass',
      icon: '🪦',
      name: '클레릭 각성: 무덤의 인도자',
      desc: '클레릭으로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 무덤 권역 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'grave_domain',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.cleric) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.cleric) || 1) >= 10
    },
    // Paladin: conquest, oathbreaker
    {
      id: 'ach_sub_conquest',
      category: 'subclass',
      icon: '👑',
      name: '팔라딘 수련: 정복의 맹세',
      desc: '팔라딘으로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 정복의 맹세 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'conquest',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.paladin) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.paladin) || 0) >= 6
    },
    {
      id: 'ach_sub_oathbreaker',
      category: 'subclass',
      icon: '🖤',
      name: '팔라딘 각성: 배반의 흑기사',
      desc: '팔라딘으로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 맹세 파기자 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'oathbreaker',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.paladin) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.paladin) || 1) >= 10
    },
    // Warlock: great_old_one, archfey_chain
    {
      id: 'ach_sub_great_old_one',
      category: 'subclass',
      icon: '🐙',
      name: '워락 수련: 심연의 속삭임',
      desc: '워락으로 몬스터 6마리 처치',
      rewardText: '🔓 하위 직업 해금: 위대한 옛 존재 (카드 10종) + 💎 80',
      gemReward: 80,
      unlockSubclass: 'great_old_one',
      progress: s => ({ cur: Math.min(6, (s.classKills && s.classKills.warlock) || 0), max: 6 }),
      check: s => ((s.classKills && s.classKills.warlock) || 0) >= 6
    },
    {
      id: 'ach_sub_archfey_chain',
      category: 'subclass',
      icon: '⛓️',
      name: '워락 각성: 사슬의 계약 군주',
      desc: '워락으로 Stage 10 도달',
      rewardText: '🔓 하위 직업 해금: 사슬의 계약 (카드 10종) + 💎 120',
      gemReward: 120,
      unlockSubclass: 'archfey_chain',
      progress: s => ({ cur: Math.min(10, (s.classBestStageNum && s.classBestStageNum.warlock) || 1), max: 10 }),
      check: s => ((s.classBestStageNum && s.classBestStageNum.warlock) || 1) >= 10
    }
  ];

  // Default unlocked subclasses: first 2 subclasses (indices 0 & 1) of every class!
  function getDefaultUnlockedSubclasses(gameData) {
    const out = {};
    if (!gameData || !gameData.characters) return out;
    Object.values(gameData.characters).forEach(ch => {
      (ch.subclasses || []).forEach((sub, idx) => {
        if (idx < 2) out[sub.id] = true;
      });
    });
    return out;
  }

  function createDefaultStats() {
    return {
      totalKills: 0,
      elitesKilled: 0,
      midBossesKilled: 0,
      bossesKilled: 0,
      totalVictories: 0,
      maxActReached: 1,
      maxSingleHit: 0,
      maxTurnDmg: 0,
      maxSingleBlock: 0,
      totalBlockGained: 0,
      totalHealed: 0,
      totalDebuffsApplied: 0,
      maxCardsInTurn: 0,
      burstsTriggered: 0,
      perfectCombats: 0,
      cardsUpgraded: 0,
      classKills: {},
      classBestStageNum: {}
    };
  }

  function getUnlockHintForClass(charId) {
    const a = ACHIEVEMENTS.find(x => x.unlockClass === charId);
    return a ? `[업적: ${a.name}] ${a.desc}` : '';
  }

  function getUnlockHintForSubclass(subId) {
    const a = ACHIEVEMENTS.find(x => x.unlockSubclass === subId);
    return a ? `[업적: ${a.name}] ${a.desc}` : '';
  }

  function getUnlockHintForLegendary(charId) {
    const a = ACHIEVEMENTS.find(x => x.unlockLegendaryClasses && x.unlockLegendaryClasses.includes(charId));
    return a ? `[업적: ${a.name}] ${a.desc}` : '';
  }

  window.ACHIEVEMENT_SYSTEM = {
    STARTER_CLASSES,
    ACHIEVEMENTS,
    getDefaultUnlockedSubclasses,
    createDefaultStats,
    getUnlockHintForClass,
    getUnlockHintForSubclass,
    getUnlockHintForLegendary
  };
})();
