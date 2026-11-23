// ============================================================================
// D&D 5E SPIRE II: TALES OF THE YAWNING PORTAL & UNDERMOUNTAIN
// Official Dungeons & Dragons 5th Edition World & Mechanics x Slay the Spire 2
// - 8 Core Classes x 4 Subclasses each (32 Distinct Build Archetypes!)
// - 5 Massive Acts (Floors) x 30 Stages per Floor (150 Stages Total!)
// - C / B / A / S Adventurer Guild Ranks + D&D 6 Ability Scores + Feats + Magic Items
// ============================================================================

window.GAME_DATA = {
  ranks: ['C', 'B', 'A', 'S'],
  rankNames: {
    C: 'C급 (Tier 1: 로컬 히어로)',
    B: 'B급 (Tier 2: 왕국의 영웅)',
    A: 'A급 (Tier 3: 차원의 수호자)',
    S: 'S급 (Tier 4: 전설의 반신)'
  },
  rankBonuses: {
    C: { hp: 0, str: 0, dex: 0, resourceStart: 0, desc: '기본 모험가 등급 (Tier 1)' },
    B: { hp: 12, str: 1, dex: 1, resourceStart: 1, desc: '최대 체력 +12, 공격력(힘) +1, 방어도(민첩) +1, 시작 클래스 자원 +1' },
    A: { hp: 26, str: 2, dex: 2, resourceStart: 2, desc: '체력 +26, 힘 +2, 민첩 +2, 시작 자원 +2, 클래스 전용 5레벨 필살 카드 해금!' },
    S: { hp: 45, str: 4, dex: 3, resourceStart: 4, desc: '체력 +45, 힘 +4, 민첩 +3, 시작 자원 +4, S급 9레벨 전설 카드(+) 시작 덱 추가!' }
  },

  // ==========================================================================
  // 5 MASSIVE ACTS (FLOORS) x 30 STAGES EACH (150 STAGES TOTAL)
  // ==========================================================================
  acts: [
    {
      act: 1,
      name: '제1계층: 언더마운틴 입구 & 고블린 성채',
      subtitle: '워터딥 하품하는 포털 주점 지하의 첫 번째 미궁 (Stage 1 ~ 30)',
      themeColor: '#27ae60',
      normalPool: ['goblin_skirmisher', 'kobold_inventor', 'skeleton_warrior', 'orc_berserker'],
      elitePool: ['owlbear_alpha', 'bugbear_chieftain'],
      midBossPool: ['troll_warlord', 'bugbear_chieftain'],
      bossPool: ['beholder_xanathar', 'young_green_dragon', 'ettin_king_gror', 'goblin_shaman_king']
    },
    {
      act: 2,
      name: '제2계층: 언더다크 & 롤스의 거미 신전',
      subtitle: '빛이 닿지 않는 지하 세계와 드로우 엘프들의 본거지 (Stage 1 ~ 30)',
      themeColor: '#8e44ad',
      normalPool: ['drow_assassin', 'hook_horror', 'giant_phase_spider', 'duergar_hammerer'],
      elitePool: ['drider_champion', 'umbeR_hulk'],
      midBossPool: ['drow_priestess', 'drider_champion'],
      bossPool: ['arachne_matron', 'aboleth_leviathan', 'purple_worm_titan', 'duergar_despot']
    },
    {
      act: 3,
      name: '제3계층: 일리시드(마인드 플레이어) 생체 군락',
      subtitle: '정신을 지배하는 촉수 괴물들과 기스양키 사냥꾼들의 격전지 (Stage 1 ~ 30)',
      themeColor: '#2980b9',
      normalPool: ['intellect_devourer', 'mind_flayer_arcanist', 'grimlock_brute', 'nothics_eye'],
      elitePool: ['mind_flayer_inquisitor', 'githyanki_kithrak'],
      midBossPool: ['ulitharid_lord', 'githyanki_kithrak'],
      bossPool: ['elder_brain_prime', 'beholder_hive_mother', 'githyanki_supreme', 'neothelid_leviathan']
    },
    {
      act: 4,
      name: '제4계층: 섀도우펠 & 아세라락의 공포의 무덤',
      subtitle: '죽음의 안개가 드리운 불사의 요새와 영혼 포식자 (Stage 1 ~ 30)',
      themeColor: '#c0392b',
      normalPool: ['wight_executioner', 'wraith_stalker', 'flesh_golem', 'vampire_spawn'],
      elitePool: ['death_knight_general', 'iron_golem_sentinel'],
      midBossPool: ['vampire_lord_strahd', 'death_knight_general'],
      bossPool: ['archlich_acererak', 'dracolich_aurinax', 'death_tyrant_beholder', 'lord_soth_deathknight']
    },
    {
      act: 5,
      name: '제5계층: 나인 헬 아베르누스 & 티아마트의 신전',
      subtitle: '타락한 천사와 고룡들이 지배하는 지옥의 심연 (Stage 1 ~ 30)',
      themeColor: '#e67e22',
      normalPool: ['bearded_devil', 'erinyes_valkyrie', 'red_abishai', 'hellfire_engine'],
      elitePool: ['pit_fiend_overlord', 'ancient_red_dragon'],
      midBossPool: ['zariel_archduke', 'ancient_red_dragon'],
      bossPool: ['tiamat_dragon_queen', 'asmodeus_lord_of_ninth', 'demogorgon_prince', 'halaster_mad_mage']
    }
  ],

  // ==========================================================================
  // 8 D&D 5E CLASSES x 4 SUBCLASSES EACH = 32 DISTINCT BUILD ARCHETYPES
  // ==========================================================================
  characters: {
    // ------------------------------------------------------------------------
    // 1. FIGHTER (파이터)
    // ------------------------------------------------------------------------
    fighter: {
      id: 'fighter',
      name: '파이터 (Fighter)',
      heroName: '가렌 스틸하트 (Garen Steelheart)',
      title: '워터딥의 백전노장 검투사',
      baseRank: 'C',
      primaryAbility: 'STR / CON (근력 & 건강)',
      color: '#e67e22',
      accent: '#fab1a0',
      maxHp: 86,
      startEnergy: 3,
      secondaryResourceName: '우위 주사위 (Superiority Dice)',
      secondaryResourceIcon: '⚔️',
      secondaryResourceDesc: '공격과 방어 전술로 우위 주사위(d8~d12)를 모읍니다. 5 이상 모아 [행동 연쇄(Action Surge)]를 발동하면 즉시 마나 +2와 카드 2장을 뽑고 힘을 얻습니다!',
      passiveName: '재기 (Second Wind) & 행동 연쇄',
      passiveDesc: '전투 종료 시 체력을 6 회복하며, 첫 턴 우위 주사위 +2를 얻습니다.',
      awakeningCard: 'action_surge_ftr',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#4a2311" stroke="#e67e22" stroke-width="4"/>
        <path d="M32 95 L28 48 L45 25 L60 32 L75 25 L92 48 L88 95 Z" fill="#636e72" stroke="#dfe6e9" stroke-width="3"/>
        <rect x="42" y="52" width="36" height="8" fill="#fdcb6e"/>
        <line x1="60" y1="25" x2="60" y2="85" stroke="#2d3436" stroke-width="4"/>
      </svg>`,
      startRelic: 'fighters_badge',
      starterDeck: ['strike_ftr', 'strike_ftr', 'strike_ftr', 'strike_ftr', 'defend_ftr', 'defend_ftr', 'defend_ftr', 'defend_ftr', 'cleave_maneuver', 'second_wind_ftr'],
      cardPool: ['cleave_maneuver', 'second_wind_ftr', 'riposte_stance', 'shield_slam_ftr', 'precision_strike', 'indomitable_guard', 'whirlwind_steel', 'echo_manifest', 'eldritch_weapon', 'action_surge_ftr'],
      subclasses: [
        {
          id: 'champion',
          name: '챔피언 (Champion)',
          icon: '🏆',
          desc: '순수 무력의 극치! 전투 시작 시 영구적으로 힘 +3 및 최대 체력 +12 증가, 모든 공격 적중 시 체력 1 회복.',
          bonusCard: 'whirlwind_steel'
        },
        {
          id: 'battlemaster',
          name: '배틀마스터 (Battle Master)',
          icon: '🎲',
          desc: '전술의 대가! 전투 시작 시 우위 주사위 +4, 매 턴 첫 공격 카드가 적에게 취약 1과 약화 1을 동시에 부여합니다.',
          bonusCard: 'riposte_stance'
        },
        {
          id: 'eldritch_knight',
          name: '엘드리치 나이트 (Eldritch Knight)',
          icon: '🛡️',
          desc: '마검사! 전투 시작 시 [비전 검기 오브] 1기를 소환하고 매 턴 종료 시 방어도 +4 및 적에게 마력 피해를 줍니다.',
          bonusCard: 'eldritch_weapon'
        },
        {
          id: 'echo_knight',
          name: '에코 나이트 (Echo Knight - 슬더스2 소환)',
          icon: '👤',
          desc: '던전맨시 시간선에서 [그림자 잔상(Echo)]을 전방에 소환합니다! 잔상이 피해를 대신 맞고 매 턴 협동 베기를 가합니다.',
          bonusCard: 'echo_manifest'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 2. BARBARIAN (바바리안)
    // ------------------------------------------------------------------------
    barbarian: {
      id: 'barbarian',
      name: '바바리안 (Barbarian)',
      heroName: '크로그 아이언터스크 (Krog Irontusk)',
      title: '스파인 산맥의 반오크 파괴자',
      baseRank: 'B',
      primaryAbility: 'STR / CON (근력 & 야성)',
      color: '#e74c3c',
      accent: '#ff7675',
      maxHp: 96,
      startEnergy: 3,
      secondaryResourceName: '격노 (Rage)',
      secondaryResourceIcon: '💢',
      secondaryResourceDesc: '공격하거나 피해를 입을 때 격노가 폭발합니다. 5 이상 모아 개방하면 즉시 [광란의 격노]가 발동해 힘 +3과 방어도 +10을 얻습니다!',
      passiveName: '무모한 공격 (Reckless) & 비무장 방어',
      passiveDesc: '전투 시작 시 힘 +2와 격노 +2를 얻고 시작합니다.',
      awakeningCard: 'primal_cataclysm',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#5c1212" stroke="#ff4757" stroke-width="4"/>
        <path d="M28 92 L32 42 L60 26 L88 42 L92 92 Z" fill="#833471" stroke="#ff7675" stroke-width="3"/>
        <polygon points="38,52 54,58 38,62" fill="#ff3838"/>
        <polygon points="82,52 66,58 82,62" fill="#ff3838"/>
        <polygon points="42,78 47,66 52,78" fill="#fff"/>
        <polygon points="68,78 73,66 78,78" fill="#fff"/>
      </svg>`,
      startRelic: 'totem_necklace',
      starterDeck: ['strike_bar', 'strike_bar', 'strike_bar', 'strike_bar', 'defend_bar', 'defend_bar', 'defend_bar', 'defend_bar', 'reckless_swing', 'enter_rage_bar'],
      cardPool: ['reckless_swing', 'enter_rage_bar', 'brutal_critical', 'bear_totem_roar', 'ancestral_spirits', 'wild_magic_surge', 'blood_frenzy_bar', 'earthshaker_slam', 'relentless_endurance', 'primal_cataclysm'],
      subclasses: [
        {
          id: 'berserker',
          name: '광전사의 길 (Path of the Berserker)',
          icon: '🪓',
          desc: '광란(Frenzy)! 전투 시작 시 힘 +3 및 [수라/광기 태세(공격력 2배)] 카드를 보유하고 매 턴 격노를 +2 추가로 얻습니다.',
          bonusCard: 'brutal_critical'
        },
        {
          id: 'totem_warrior',
          name: '토템 전사의 길 (곰의 토템)',
          icon: '🐻',
          desc: '곰의 영혼이 깃들어 최대 체력 +20 증가, 매 턴 시작 시 방어도 +6을 자동으로 얻습니다!',
          bonusCard: 'bear_totem_roar'
        },
        {
          id: 'ancestral_guardian',
          name: '선조의 수호자 (슬더스2 영령 소환)',
          icon: '👻',
          desc: '전방에 [고대 전사의 수호령]을 소환하여 적의 공격을 대신 막아내고 적에게 약화를 겁니다!',
          bonusCard: 'ancestral_spirits'
        },
        {
          id: 'wild_magic',
          name: '야생 마법의 길 (Path of Wild Magic)',
          icon: '🌀',
          desc: '격노와 비전 마법의 융합! 전투 시작 시 [야생 마력 오브] 1기를 생성하고 첫 턴 마나(AP) +1 및 카드 +2장을 뽑습니다.',
          bonusCard: 'wild_magic_surge'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 3. ROGUE (로그)
    // ------------------------------------------------------------------------
    rogue: {
      id: 'rogue',
      name: '로그 (Rogue)',
      heroName: '벨라 나이트셰이드 (Vella Nightshade)',
      title: '발더스 게이트 도둑 길드의 그림자 칼날',
      baseRank: 'B',
      primaryAbility: 'DEX / INT (민첩 & 교활함)',
      color: '#2ecc71',
      accent: '#55efc4',
      maxHp: 72,
      startEnergy: 3,
      secondaryResourceName: '급소 공격 주사위 (Sneak Dice)',
      secondaryResourceIcon: '🗡️',
      secondaryResourceDesc: '은신, 단검, 맹독 카드를 사용할 때 급소 주사위(d6)가 쌓입니다. 5 이상 모아 개방하면 모든 적의 맹독을 즉시 폭발시키고 0코스트 단검을 뽑습니다!',
      passiveName: '교활한 행동 (Cunning Action) & 급소 공격',
      passiveDesc: '전투 시작 시 모든 적에게 맹독 3과 취약 1을 부여하고 첫 턴 카드를 2장 더 뽑습니다.',
      awakeningCard: 'death_mark_assassinate',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#09331e" stroke="#00ff88" stroke-width="4"/>
        <path d="M26 92 Q28 22 60 22 Q92 22 94 92 Z" fill="#1e272e" stroke="#2ecc71" stroke-width="3"/>
        <polygon points="42,56 54,58 40,62" fill="#00ff88"/>
        <polygon points="78,56 66,58 80,62" fill="#00ff88"/>
      </svg>`,
      startRelic: 'thieves_tools',
      starterDeck: ['strike_rog', 'strike_rog', 'strike_rog', 'strike_rog', 'defend_rog', 'defend_rog', 'defend_rog', 'defend_rog', 'sneak_attack_rog', 'cunning_dash'],
      cardPool: ['sneak_attack_rog', 'cunning_dash', 'wyvern_poison', 'uncanny_dodge', 'assassinate_crit', 'mage_hand_trick', 'wails_from_grave', 'fan_of_knives', 'crimson_alchemist', 'death_mark_assassinate'],
      subclasses: [
        {
          id: 'thief',
          name: '시프 (Thief - 빠른 손놀림)',
          icon: '🗝️',
          desc: '매 전투 첫 턴 마나(AP) +1 및 카드 +2장 추가 드로우, 전투 승리 시 추가 골드 +25G 획득!',
          bonusCard: 'cunning_dash'
        },
        {
          id: 'assassin',
          name: '어쌔신 (Assassin - 암살자)',
          icon: '💀',
          desc: '전투 시작 시 모든 적에게 맹독 +6과 취약 +2를 즉시 부여하고 급소 공격 주사위 +4로 시작합니다!',
          bonusCard: 'assassinate_crit'
        },
        {
          id: 'arcane_trickster',
          name: '아케인 트릭스터 (Arcane Trickster)',
          icon: '🃏',
          desc: '보이지 않는 마법사의 손(Mage Hand) 오브를 소환해 매 턴 자동으로 적을 교란하고 방어도를 훔쳐옵니다.',
          bonusCard: 'mage_hand_trick'
        },
        {
          id: 'phantom',
          name: '팬텀 (Phantom - 망자의 토큰)',
          icon: '🕯️',
          desc: '전방에 [원한의 망령]을 소환해 함께 싸우며, 공격할 때마다 주변 적에게 영혼 피해와 맹독을 전이시킵니다.',
          bonusCard: 'wails_from_grave'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 4. RANGER (레인저)
    // ------------------------------------------------------------------------
    ranger: {
      id: 'ranger',
      name: '레인저 (Ranger)',
      heroName: '드리즈트 실버보우 (Drizzt Silverbow)',
      title: '미스트 숲과 언더다크의 숙련된 추적자',
      baseRank: 'A',
      primaryAbility: 'DEX / WIS (민첩 & 지혜)',
      color: '#00b894',
      accent: '#81ecec',
      maxHp: 76,
      startEnergy: 3,
      secondaryResourceName: '사냥꾼의 징표 (Hunter Mark)',
      secondaryResourceIcon: '🏹',
      secondaryResourceDesc: '사격 및 야수 명령 시 사냥꾼의 징표가 중첩됩니다. 5 이상 모아 개방하면 대상에게 연쇄 폭풍 화살을 퍼붓고 야수 동료가 협공합니다!',
      passiveName: '숙적 사냥꾼 (Favored Enemy)',
      passiveDesc: '전투 시작 시 사냥꾼의 징표 +3 및 민첩 +2를 얻습니다.',
      awakeningCard: 'conjure_volley',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#0b3b24" stroke="#55efc4" stroke-width="4"/>
        <path d="M90 18 Q112 60 90 102" stroke="#fdcb6e" stroke-width="4" fill="none"/>
        <path d="M30 92 L36 32 L60 20 L84 32 L90 92 Z" fill="#1e5631" stroke="#55efc4" stroke-width="3"/>
        <circle cx="48" cy="54" r="5" fill="#ffeaa7"/>
        <circle cx="72" cy="54" r="5" fill="#ffeaa7"/>
      </svg>`,
      startRelic: 'hunters_quiver',
      starterDeck: ['strike_rng', 'strike_rng', 'strike_rng', 'strike_rng', 'defend_rng', 'defend_rng', 'defend_rng', 'defend_rng', 'hunters_mark_shot', 'twin_scimitar'],
      cardPool: ['hunters_mark_shot', 'twin_scimitar', 'summon_panther', 'colossus_slayer', 'dread_ambusher', 'fey_misty_step', 'ensnaring_thorns', 'lightning_arrow', 'steel_wind_strike', 'conjure_volley'],
      subclasses: [
        {
          id: 'hunter_conclave',
          name: '헌터 (Hunter - 거수 학살자)',
          icon: '🎯',
          desc: '거수 학살자(Colossus Slayer)! 영구적으로 힘 +3 및 매 턴 종료 시 모든 적에게 관통 화살 피해를 가합니다.',
          bonusCard: 'colossus_slayer'
        },
        {
          id: 'beast_master',
          name: '비스트 마스터 (슬더스2 흑표범 소환)',
          icon: '🐆',
          desc: '전투 시작 시 충직한 [아스트랄 흑표범 구엔위바]를 전방에 소환합니다! 흑표범이 대신 공격을 막고 매 턴 적을 물어뜯습니다.',
          bonusCard: 'summon_panther'
        },
        {
          id: 'gloom_stalker',
          name: '글룸 스토커 (Gloom Stalker)',
          icon: '🌑',
          desc: '어둠의 기습자! 첫 턴 마나(AP) +1, 카드 +2장 드로우 및 첫 턴 [그림자 매복(피해 2배)] 효과를 얻습니다!',
          bonusCard: 'dread_ambusher'
        },
        {
          id: 'fey_wanderer',
          name: '페이 방랑자 (Fey Wanderer)',
          icon: '🦋',
          desc: '요정계(Feywild)의 축복! 전투 시작 시 [요정 정령 오브] 1기를 소환하고 매 턴 적 전체에게 매혹(약화 1)을 부여합니다.',
          bonusCard: 'fey_misty_step'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 5. WIZARD (위저드)
    // ------------------------------------------------------------------------
    wizard: {
      id: 'wizard',
      name: '위저드 (Wizard)',
      heroName: '엘민스터 오마르 (Elminster Aumar)',
      title: '실버임과 캔들킵의 대마법사',
      baseRank: 'A',
      primaryAbility: 'INT (지능 & 비전 주문 슬롯)',
      color: '#3498db',
      accent: '#74b9ff',
      maxHp: 68,
      startEnergy: 3,
      secondaryResourceName: '비전 주문력 (Arcane Charges)',
      secondaryResourceIcon: '🔮',
      secondaryResourceDesc: '주문 카드를 시전할 때마다 비전 주문력이 충전되고 [비전 구체(Orb)]가 생성됩니다. 5 이상 모아 개방하면 [비전 회복(Arcane Recovery)]으로 마나 +1 및 구체 일제 폭격을 가합니다!',
      passiveName: '비전 회복 & 원소 구체 서클',
      passiveDesc: '전투 시작 시 [비전 구체 오브] 1기와 비전 주문력 +3을 가지고 시작합니다.',
      awakeningCard: 'meteor_swarm_wiz',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#0a1931" stroke="#00d2d3" stroke-width="4"/>
        <polygon points="60,10 86,46 34,46" fill="#192a56" stroke="#00d2d3" stroke-width="3"/>
        <ellipse cx="60" cy="46" rx="36" ry="7" fill="#273c75" stroke="#00d2d3" stroke-width="2"/>
        <circle cx="49" cy="62" r="6" fill="#00d2d3"/>
        <circle cx="71" cy="62" r="6" fill="#00d2d3"/>
      </svg>`,
      startRelic: 'spellbook_of_mystra',
      starterDeck: ['strike_wiz', 'strike_wiz', 'strike_wiz', 'strike_wiz', 'defend_wiz', 'defend_wiz', 'defend_wiz', 'defend_wiz', 'magic_missile_wiz', 'shield_spell_wiz'],
      cardPool: ['magic_missile_wiz', 'shield_spell_wiz', 'fireball_wiz', 'arcane_ward_abj', 'animate_dead_nec', 'portent_dice_div', 'chain_lightning_wiz', 'cone_of_cold', 'haste_spell', 'meteor_swarm_wiz'],
      subclasses: [
        {
          id: 'evocation',
          name: '방출학파 (School of Evocation)',
          icon: '🔥',
          desc: '파괴 주문 조각! 모든 주문 공격력(힘) +3 및 전투 시작 시 [화염 구체 오브] 2기를 소환한 채 시작합니다!',
          bonusCard: 'fireball_wiz'
        },
        {
          id: 'abjuration',
          name: '방호학파 (School of Abjuration)',
          icon: '💠',
          desc: '비전 수호막(Arcane Ward)! 매 전투 첫 턴 방어도 +15 및 매 턴 종료 시 방어도 +6을 자동으로 얻습니다.',
          bonusCard: 'arcane_ward_abj'
        },
        {
          id: 'necromancy',
          name: '사령학파 (슬더스2 해골 기사 소환)',
          icon: '💀',
          desc: '전투 시작 시 전방에 [언데드 해골 챔피언]을 소환합니다! 해골이 위저드 대신 공격을 막고 매 턴 적의 생명력을 흡수합니다.',
          bonusCard: 'animate_dead_nec'
        },
        {
          id: 'divination',
          name: '예지학파 (School of Divination - 운명 조작)',
          icon: '👁️',
          desc: '예지 주사위(Portent)! 매 턴 카드를 +1장 더 뽑고, 첫 턴 마나(AP) +1 및 모든 적에게 취약 2를 부여합니다.',
          bonusCard: 'portent_dice_div'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 6. CLERIC (클레릭)
    // ------------------------------------------------------------------------
    cleric: {
      id: 'cleric',
      name: '클레릭 (Cleric)',
      heroName: '라이라 던브링어 (Lyra Dawnbringer)',
      title: '태양신 라센더와 셀루네의 대사제',
      baseRank: 'A',
      primaryAbility: 'WIS / CHA (지혜 & 신성 권능)',
      color: '#f1c40f',
      accent: '#ffeaa7',
      maxHp: 80,
      startEnergy: 3,
      secondaryResourceName: '신성력 전달 (Channel Divinity)',
      secondaryResourceIcon: '☀️',
      secondaryResourceDesc: '기도와 광휘 공격으로 신성력을 축적합니다. 5 이상 모아 [신성력 전달]을 개방하면 체력을 8 회복하고 모든 적에게 광휘 심판 피해를 입힙니다!',
      passiveName: '영혼의 수호자 (Spirit Guardians)',
      passiveDesc: '전투 시작 시 [천상의 수호령 오브] 1기를 소환하고 매 전투 종료 시 체력을 5 회복합니다.',
      awakeningCard: 'divine_intervention',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#4a3500" stroke="#ffeaa7" stroke-width="4"/>
        <circle cx="60" cy="50" r="32" fill="none" stroke="#fdcb6e" stroke-width="3" stroke-dasharray="5,3"/>
        <path d="M32 94 L38 38 L60 24 L82 38 L88 94 Z" fill="#dfe6e9" stroke="#f1c40f" stroke-width="3"/>
        <circle cx="48" cy="56" r="5" fill="#f39c12"/>
        <circle cx="72" cy="56" r="5" fill="#f39c12"/>
      </svg>`,
      startRelic: 'holy_symbol_lathander',
      starterDeck: ['strike_clr', 'strike_clr', 'strike_clr', 'strike_clr', 'defend_clr', 'defend_clr', 'defend_clr', 'defend_clr', 'guiding_bolt', 'healing_word_clr'],
      cardPool: ['guiding_bolt', 'healing_word_clr', 'spirit_guardians_clr', 'radiance_of_dawn', 'war_gods_blessing', 'path_to_grave', 'spiritual_weapon', 'flame_strike_clr', 'holy_aura_clr', 'divine_intervention'],
      subclasses: [
        {
          id: 'life_domain',
          name: '생명 권역 (Life Domain)',
          icon: '❤️‍🩹',
          desc: '최고의 치유사! 최대 체력 +18, 매 턴 시작 시 내 체력을 3 회복하고 방어도 +4를 자동으로 얻습니다.',
          bonusCard: 'healing_word_clr'
        },
        {
          id: 'light_domain',
          name: '빛 권역 (Light Domain)',
          icon: '🌅',
          desc: '여명의 광휘! 전투 시작 시 [태양 광휘 오브] 2기를 소환하고 모든 적에게 화상(맹독) 5와 약화 2를 부여합니다.',
          bonusCard: 'radiance_of_dawn'
        },
        {
          id: 'war_domain',
          name: '전쟁 권역 (War Domain)',
          icon: '🔨',
          desc: '전쟁신의 사도! 전투 시작 시 힘 +3, 민첩 +2 및 전방에 [영체 대검 수호자]를 소환해 적을 함께 타격합니다.',
          bonusCard: 'war_gods_blessing'
        },
        {
          id: 'grave_domain',
          name: '무덤 권역 (Grave Domain - 죽음의 낙인)',
          icon: '⚰️',
          desc: '무덤의 길(Path to the Grave)! 전투 시작 시 [초월/심판 태세]에 쉽게 진입하며 모든 적에게 취약 3을 부여합니다!',
          bonusCard: 'path_to_grave'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 7. PALADIN (팔라딘)
    // ------------------------------------------------------------------------
    paladin: {
      id: 'paladin',
      name: '팔라딘 (Paladin)',
      heroName: '티리온 실버핸드 (Tirion Silverhand)',
      title: '정의의 신 티르를 섬기는 성기사단장',
      baseRank: 'S',
      primaryAbility: 'STR / CHA (근력 & 신성한 강타)',
      color: '#f39c12',
      accent: '#ffeaa7',
      maxHp: 88,
      startEnergy: 3,
      secondaryResourceName: '신성한 강타 (Divine Smite)',
      secondaryResourceIcon: '✨',
      secondaryResourceDesc: '검격과 축복 카드로 강타 에너지를 모읍니다. 5 이상 모아 개방하면 즉시 [천벌의 신성한 강타]가 폭발해 힘 +2, 방어도 +12 및 적에게 심판 피해를 가합니다!',
      passiveName: '수호의 오라 (Aura of Protection) & 안수 치료',
      passiveDesc: '매 턴 종료 시 방어도 +4를 자동으로 얻으며, 전투 시작 시 신성한 강타 +3을 보유합니다.',
      awakeningCard: 'avenging_angel_smite',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#2c2c54" stroke="#f1c40f" stroke-width="4"/>
        <path d="M30 95 L28 45 L60 22 L92 45 L90 95 Z" fill="#dcdde1" stroke="#f39c12" stroke-width="3"/>
        <polygon points="60,32 66,52 84,52 68,62 74,80 60,68 46,80 52,62 36,52 54,52" fill="#f1c40f"/>
      </svg>`,
      startRelic: 'holy_avenger_hilt',
      starterDeck: ['strike_pal', 'strike_pal', 'strike_pal', 'strike_pal', 'defend_pal', 'defend_pal', 'defend_pal', 'defend_pal', 'divine_smite_pal', 'lay_on_hands'],
      cardPool: ['divine_smite_pal', 'lay_on_hands', 'sacred_weapon_dev', 'vow_of_enmity', 'aura_of_conquest', 'dread_lord_oathbreaker', 'find_greater_steed', 'blinding_smite', 'circle_of_power', 'avenging_angel_smite'],
      subclasses: [
        {
          id: 'devotion',
          name: '헌신의 맹세 (Oath of Devotion)',
          icon: '⚔️',
          desc: '신성한 무기(Sacred Weapon)! 힘 +3, 민첩 +3 및 매 턴 종료 시 자동 방어도 +6을 얻습니다.',
          bonusCard: 'sacred_weapon_dev'
        },
        {
          id: 'vengeance',
          name: '복수의 맹세 (Oath of Vengeance)',
          icon: '🔥',
          desc: '적대의 맹세! 전투 시작 시 즉시 [복수의 화신(공격력 2배 태세)]에 돌입할 수 있으며 모든 적에게 취약 2를 부여합니다.',
          bonusCard: 'vow_of_enmity'
        },
        {
          id: 'conquest',
          name: '정복의 맹세 (Oath of Conquest)',
          icon: '👑',
          desc: '정복의 오라! 전방에 [천상의 그리폰 군마(Find Greater Steed)]를 소환해 공격을 대신 막고 적 전체에게 약화 2를 겁니다.',
          bonusCard: 'find_greater_steed'
        },
        {
          id: 'oathbreaker',
          name: '맹세파기자 (Oathbreaker - 타락 성기사)',
          icon: '🖤',
          desc: '증오의 오라! 전방에 [죽음의 기사 소환수]를 거느리고 힘 +4를 얻으며, 공격 시 적에게 암흑 저주를 함께 부여합니다.',
          bonusCard: 'dread_lord_oathbreaker'
        }
      ]
    },

    // ------------------------------------------------------------------------
    // 8. WARLOCK (워락)
    // ------------------------------------------------------------------------
    warlock: {
      id: 'warlock',
      name: '워락 (Warlock)',
      heroName: '말라카이 섀도우본 (Malakai Shadowborn)',
      title: '초월적 후원자와 피의 계약을 맺은 흑마법사',
      baseRank: 'S',
      primaryAbility: 'CHA (매력 & 섬뜩한 기원)',
      color: '#9b59b6',
      accent: '#e056fd',
      maxHp: 74,
      startEnergy: 3,
      secondaryResourceName: '영혼 조각 (Soul Shards)',
      secondaryResourceIcon: '🟣',
      secondaryResourceDesc: '섬뜩한 파열(Eldritch Blast)과 주술(Hex)로 영혼 조각을 수확합니다. 5 이상 모아 개방하면 후원자의 권능을 빌려 소환수를 진화시키고 전체 암흑 폭격을 가합니다!',
      passiveName: '사슬의 계약 (Pact of the Chain - 슬더스2 악마 소환)',
      passiveDesc: '전투 시작 시 전방에 계약 악마 [지옥마신 핀드]를 소환하여 공격을 대신 흡수하고 매 턴 적을 불태웁니다!',
      awakeningCard: 'hurl_through_hell',
      avatarSvg: `<svg viewBox="0 0 120 120" class="char-svg">
        <circle cx="60" cy="60" r="52" fill="#1a0526" stroke="#e056fd" stroke-width="4"/>
        <path d="M30 94 L34 40 L47 22 L60 36 L73 22 L86 40 L90 94 Z" fill="#130f40" stroke="#be2edd" stroke-width="3"/>
        <polygon points="40,54 55,58 53,64 38,59" fill="#00cec9"/>
        <polygon points="80,54 65,58 67,64 82,59" fill="#00cec9"/>
      </svg>`,
      startRelic: 'rod_of_pact_keeper',
      starterDeck: ['strike_warlock', 'strike_warlock', 'strike_warlock', 'strike_warlock', 'defend_warlock', 'defend_warlock', 'defend_warlock', 'defend_warlock', 'eldritch_blast_wlk', 'hex_curse_wlk'],
      cardPool: ['eldritch_blast_wlk', 'hex_curse_wlk', 'summon_fiend_wlk', 'hexblade_wrath', 'awakened_mind_goo', 'armor_of_agathys', 'hunger_of_hadar', 'lifedrinker_blade', 'dark_ones_blessing', 'hurl_through_hell'],
      subclasses: [
        {
          id: 'fiend_patron',
          name: '마신 후원자 (The Fiend)',
          icon: '😈',
          desc: '어둠의 축복! 전방의 [지옥마신 핀드] 체력이 +15, 공격력이 +5 강화되며 전투 승리 시 내 체력을 8 회복합니다.',
          bonusCard: 'summon_fiend_wlk'
        },
        {
          id: 'hexblade',
          name: '헥스블레이드 (The Hexblade - 마검 워락)',
          icon: '🗡️',
          desc: '저주받은 마검! 힘 +4, 민첩 +2를 얻고 모든 공격이 대상에게 저주(맹독 +3)를 추가로 부여합니다.',
          bonusCard: 'hexblade_wrath'
        },
        {
          id: 'great_old_one',
          name: '그레이트 올드 원 (크툴루/고대신 후원자)',
          icon: '🐙',
          desc: '공허의 촉수! 전투 시작 시 [하다르의 촉수 오브] 2기를 소환하고 모든 적에게 정신 붕괴(약화 2, 취약 2)를 부여합니다.',
          bonusCard: 'hunger_of_hadar'
        },
        {
          id: 'archfey_chain',
          name: '사슬의 군주 (Pact of the Chain Master)',
          icon: '⛓️',
          desc: '소환수 극대화! 전방 소환수의 체력이 2배가 되고, 매 턴 워락이 카드를 +1장 더 뽑으며 영혼 조각 +3을 얻습니다.',
          bonusCard: 'armor_of_agathys'
        }
      ]
    }
  },

  // ==========================================================================
  // D&D 5E MAGIC EQUIPMENT (+1 ~ +10 Enchantment at Artificer Forge)
  // ==========================================================================
  equipment: {
    c_dagger: {
      id: 'c_dagger', name: '+1 강철 모험가 롱소드', slot: 'weapon', rank: 'C', icon: '🗡️',
      baseStr: 1, strPerLv: 0.5, desc: '전투 시작 시 공격력(힘) 증가', unlockCost: 0
    },
    b_greatsword: {
      id: 'b_greatsword', name: '플레임 텅(Flame Tongue) 화염검', slot: 'weapon', rank: 'B', icon: '🔥',
      baseStr: 2, strPerLv: 1, desc: '전투 시작 시 힘 대폭 증가', unlockCost: 150
    },
    a_demon_bow: {
      id: 'a_demon_bow', name: '선블레이드(Sun Blade) 광휘검', slot: 'weapon', rank: 'A', icon: '☀️',
      baseStr: 3, strPerLv: 1, resourceBonus: 2, desc: '힘 증가 및 전투 시작 시 클래스 자원 +2', unlockCost: 280
    },
    s_kamish_wrath: {
      id: 's_kamish_wrath', name: '보팔 소드 & 홀리 어벤저 (S급 신화)', slot: 'weapon', rank: 'S', icon: '⚜️',
      baseStr: 5, strPerLv: 1.5, resourceBonus: 3, desc: 'D&D 최강의 전설 무기! 힘 및 시작 자원 대폭 증가', unlockCost: 500
    },

    c_vest: {
      id: 'c_vest', name: '스터디드 레더 아머', slot: 'armor', rank: 'C', icon: '🦺',
      baseHp: 8, hpPerLv: 4, baseDex: 0, desc: '최대 체력(HP) 증가', unlockCost: 0
    },
    b_mithril_mail: {
      id: 'b_mithril_mail', name: '미스릴 하프 플레이트', slot: 'armor', rank: 'B', icon: '🛡️',
      baseHp: 16, hpPerLv: 6, baseDex: 1, desc: '최대 체력 및 방어도(민첩) +1 증가', unlockCost: 150
    },
    a_shadow_coat: {
      id: 'a_shadow_coat', name: '아다만틴 풀 플레이트 & 대마법사 로브', slot: 'armor', rank: 'A', icon: '🧥',
      baseHp: 25, hpPerLv: 8, baseDex: 2, desc: '치명타 면역 갑주! 최대 체력 및 민첩 +2 증가', unlockCost: 280
    },
    s_dragon_scale: {
      id: 's_dragon_scale', name: '티아마트 고룡 비늘 갑주 (S급)', slot: 'armor', rank: 'S', icon: '🐉',
      baseHp: 42, hpPerLv: 10, baseDex: 3, desc: 'S급 신화 갑주! 최대 체력 및 민첩 +3 대폭 증가', unlockCost: 500
    },

    c_ring: {
      id: 'c_ring', name: '보호의 반지 (Ring of Protection)', slot: 'accessory', rank: 'C', icon: '💍',
      baseBlock: 4, blockPerLv: 2, desc: '매 전투 첫 턴 임시 체력(방어도) 획득', unlockCost: 0
    },
    b_pendant: {
      id: 'b_pendant', name: '건강의 목걸이 (Amulet of Health)', slot: 'accessory', rank: 'B', icon: '📿',
      baseBlock: 8, blockPerLv: 3, healAfterCombat: 3, desc: '첫 턴 방어도 및 전투 승리 시 체력 +3 회복', unlockCost: 150
    },
    a_earring: {
      id: 'a_earring', name: '변위의 망토 (Cloak of Displacement)', slot: 'accessory', rank: 'A', icon: '💎',
      baseBlock: 12, blockPerLv: 4, summonBoost: 5, desc: '첫 턴 방어도 및 소환수/구체 위력 +5 강화', unlockCost: 280
    },
    s_monarch_heart: {
      id: 's_monarch_heart', name: '스톰 자이언트 힘의 벨트 (S급)', slot: 'accessory', rank: 'S', icon: '👑',
      baseBlock: 18, blockPerLv: 5, summonBoost: 10, healAfterCombat: 6, desc: '첫 턴 대규모 방어도, 소환수/구체 +10, 전투 후 체력 +6 회복', unlockCost: 500
    }
  },

  // ==========================================================================
  // D&D 5E FEATS / GUILD MASTERIES (특성 트리)
  // ==========================================================================
  masteries: [
    {
      id: 'vitality_training',
      name: '❤️ 강인함 특성 (Tough Feat)',
      maxLv: 10,
      baseCost: 80,
      desc: '모든 클래스의 기본 최대 체력이 레벨당 +8 영구 증가합니다.',
      effectPerLv: 8
    },
    {
      id: 'mana_circulation',
      name: '⚔️ 대형 무기 / 주문 명사수 (GWM / Spell Sniper)',
      maxLv: 5,
      baseCost: 120,
      desc: '전투 시작 시 모든 클래스가 공격력(힘) +1 및 고유 자원 +1을 레벨당 추가로 얻습니다.',
      effectPerLv: 1
    },
    {
      id: 'tactical_intel',
      name: '🎲 경계 특성 (Alert Feat)',
      maxLv: 3,
      baseCost: 180,
      desc: '우선권 우위! 매 전투 첫 턴에 뽑는 카드 수가 레벨당 +1장 영구 증가합니다.',
      effectPerLv: 1
    },
    {
      id: 'guild_funding',
      name: '🪙 하퍼즈 & 워터딥 후원금',
      maxLv: 5,
      baseCost: 90,
      desc: '언더마운틴 출격 시 시작 보유 골드가 레벨당 +45G 증가합니다.',
      effectPerLv: 45
    },
    {
      id: 'exp_accelerator',
      name: '📜 현자의 깨달음 (Epic Boon EXP)',
      maxLv: 5,
      baseCost: 100,
      desc: '던전 내 몬스터 처치 시 얻는 레벨업 경험치(EXP)가 레벨당 +25% 증가합니다.',
      effectPerLv: 25
    },
    {
      id: 'core_overdrive',
      name: '🌟 행운아 특성 (Lucky Feat - 마나 코어)',
      maxLv: 1,
      baseCost: 600,
      desc: '모든 클래스의 매 턴 기본 행동력/주문 마나(AP)가 영구적으로 +1 증가합니다!',
      effectPerLv: 1
    }
  ],

  // ==========================================================================
  // D&D 5E CARDS & SPELLS DATABASE (Across All 8 Classes)
  // ==========================================================================
  cards: {
    // --- 1. FIGHTER CARDS ---
    strike_ftr: {
      id: 'strike_ftr', name: '롱소드 베기', type: 'attack', rarity: 'basic', classId: 'fighter',
      cost: 1, damage: 6, upgradeDamage: 9, resourceGain: 1,
      desc: '피해를 {damage} 줍니다. 우위 주사위 +1.'
    },
    defend_ftr: {
      id: 'defend_ftr', name: '방패 올리기', type: 'skill', rarity: 'basic', classId: 'fighter',
      cost: 1, block: 5, upgradeBlock: 8,
      desc: '방어도를 {block} 얻습니다.'
    },
    cleave_maneuver: {
      id: 'cleave_maneuver', name: '전술: 휩쓸기 공격', type: 'attack', rarity: 'common', classId: 'fighter',
      cost: 1, damage: 8, upgradeDamage: 12, target: 'all', vuln: 1, upgradeVuln: 2, resourceGain: 1,
      desc: '적 전체에게 피해를 {damage} 주고 취약 {vuln}을 부여합니다. 주사위 +1.'
    },
    second_wind_ftr: {
      id: 'second_wind_ftr', name: '재기 (Second Wind)', type: 'skill', rarity: 'common', classId: 'fighter',
      cost: 1, block: 6, upgradeBlock: 9, healOnHit: 5, resourceGain: 2,
      desc: '방어도 {block}을 얻고 내 체력을 5 회복합니다. 우위 주사위 +2.'
    },
    riposte_stance: {
      id: 'riposte_stance', name: '전술: 응수 (Riposte)', type: 'attack', rarity: 'common', classId: 'fighter',
      cost: 1, damage: 9, upgradeDamage: 13, block: 6, upgradeBlock: 9, resourceGain: 2,
      desc: '피해를 {damage} 주고 방어도를 {block} 얻습니다. 주사위 +2.'
    },
    shield_slam_ftr: {
      id: 'shield_slam_ftr', name: '중장갑 방패 강타', type: 'attack', rarity: 'common', classId: 'fighter',
      cost: 2, damage: 12, upgradeDamage: 16, damagePerBlock: true,
      desc: '피해를 {damage} 줍니다. 현재 내 방어도만큼 추가 피해를 줍니다!'
    },
    precision_strike: {
      id: 'precision_strike', name: '전술: 정밀 타격', type: 'skill', rarity: 'uncommon', classId: 'fighter',
      cost: 0, strength: 2, upgradeStrength: 3, draw: 1, resourceGain: 2,
      desc: '0코스트! 힘 +{strength}, 카드 1장 드로우, 우위 주사위 +2.'
    },
    indomitable_guard: {
      id: 'indomitable_guard', name: '불굴 (Indomitable)', type: 'skill', rarity: 'uncommon', classId: 'fighter',
      cost: 1, block: 9, upgradeBlock: 13, doubleBlock: true,
      desc: '방어도를 {block} 얻은 뒤, 현재 방어도를 2배로 만듭니다!'
    },
    whirlwind_steel: {
      id: 'whirlwind_steel', name: '다중 공격 (Extra Attack x3)', type: 'attack', rarity: 'uncommon', classId: 'fighter',
      cost: 1, damage: 5, upgradeDamage: 7, hits: 3, resourceGain: 2,
      desc: '피해를 {damage}씩 3번 연속 줍니다. 우위 주사위 +2.'
    },
    echo_manifest: {
      id: 'echo_manifest', name: '잔상 구현 (Manifest Echo)', type: 'skill', rarity: 'uncommon', classId: 'fighter',
      cost: 1, summonHeal: 14, upgradeSummonHeal: 20, summonAtkBoost: 4, triggerSummonAttack: true,
      desc: '그림자 잔상 소환수 체력 +{summonHeal}, 공격력 +4 강화 후 즉시 협공!'
    },
    eldritch_weapon: {
      id: 'eldritch_weapon', name: '비전 무기 결속', type: 'attack', rarity: 'uncommon', classId: 'fighter',
      cost: 1, damage: 10, upgradeDamage: 14, addDrone: 1, triggerDronesNow: true,
      desc: '피해 {damage}, [비전 검기 오브] 1기 소환 후 즉시 일제 발사!'
    },
    action_surge_ftr: {
      id: 'action_surge_ftr', name: '행동 연쇄 (Action Surge)', type: 'skill', rarity: 'rare', classId: 'fighter',
      cost: 0, gainEnergy: 2, draw: 2, upgradeDraw: 3, strength: 2, exhaust: true,
      desc: '0코스트! 마나 +2, 힘 +2, 카드 {draw}장을 뽑습니다! (소멸)'
    },

    // --- 2. BARBARIAN CARDS ---
    strike_bar: {
      id: 'strike_bar', name: '그레이트액스 내려찍기', type: 'attack', rarity: 'basic', classId: 'barbarian',
      cost: 1, damage: 7, upgradeDamage: 10, resourceGain: 1,
      desc: '피해를 {damage} 줍니다. 격노 +1.'
    },
    defend_bar: {
      id: 'defend_bar', name: '야성의 근육 방어', type: 'skill', rarity: 'basic', classId: 'barbarian',
      cost: 1, block: 5, upgradeBlock: 8, resourceGain: 1,
      desc: '방어도를 {block} 얻습니다. 격노 +1.'
    },
    reckless_swing: {
      id: 'reckless_swing', name: '무모한 공격 (Reckless Attack)', type: 'attack', rarity: 'common', classId: 'barbarian',
      cost: 1, damage: 12, upgradeDamage: 17, vuln: 2, resourceGain: 2,
      desc: '피해를 {damage} 주고 대상에게 취약 2를 부여합니다. 격노 +2.'
    },
    enter_rage_bar: {
      id: 'enter_rage_bar', name: '격노 폭발 (Rage)', type: 'skill', rarity: 'common', classId: 'barbarian',
      cost: 0, selfDamage: 2, strength: 2, upgradeStrength: 4, block: 5, resourceGain: 3,
      desc: '0코스트! 체력 2 소모, 힘 +{strength}, 방어도 5, 격노 +3 획득!'
    },
    brutal_critical: {
      id: 'brutal_critical', name: '야만적인 치명타 (광기 태세)', type: 'attack', rarity: 'uncommon', classId: 'barbarian',
      cost: 1, damage: 10, upgradeDamage: 14, stance: 'wrath', resourceGain: 2,
      desc: '피해 {damage}를 주고 [광란(공격력 2배)] 태세에 돌입합니다!'
    },
    bear_totem_roar: {
      id: 'bear_totem_roar', name: '곰 토템의 포효', type: 'power', rarity: 'uncommon', classId: 'barbarian',
      cost: 1, strength: 3, upgradeStrength: 5, metallicize: 5,
      desc: '힘 +{strength} 및 매 턴 종료 시 방어도 +5를 자동으로 얻습니다.'
    },
    ancestral_spirits: {
      id: 'ancestral_spirits', name: '선조 수호령 강림', type: 'skill', rarity: 'uncommon', classId: 'barbarian',
      cost: 1, summonHeal: 16, upgradeSummonHeal: 22, weak: 2, target: 'all',
      desc: '선조 수호령 체력 +{summonHeal} 소환 및 적 전체에게 약화 2 부여!'
    },
    wild_magic_surge: {
      id: 'wild_magic_surge', name: '야생 마력 폭주', type: 'attack', rarity: 'uncommon', classId: 'barbarian',
      cost: 1, damage: 9, upgradeDamage: 13, target: 'all', addDrone: 1, draw: 1,
      desc: '적 전체 피해 {damage}, [야생 마력 오브] 1기 생성, 카드 1장 드로우!'
    },
    blood_frenzy_bar: {
      id: 'blood_frenzy_bar', name: '피의 갈증 도끼질', type: 'attack', rarity: 'uncommon', classId: 'barbarian',
      cost: 1, damage: 11, upgradeDamage: 15, healOnHit: 5,
      desc: '피해를 {damage} 주고 내 체력을 5 회복합니다.'
    },
    earthshaker_slam: {
      id: 'earthshaker_slam', name: '대지 분쇄 강타', type: 'attack', rarity: 'common', classId: 'barbarian',
      cost: 2, damage: 14, upgradeDamage: 19, target: 'all', vuln: 2,
      desc: '적 전체에게 피해를 {damage} 주고 취약 2를 부여합니다.'
    },
    relentless_endurance: {
      id: 'relentless_endurance', name: '굴하지 않는 인내', type: 'skill', rarity: 'common', classId: 'barbarian',
      cost: 1, block: 12, upgradeBlock: 16, draw: 1, stance: 'neutral',
      desc: '방어도 {block}, 카드 1장 드로우 후 평정 태세로 전환합니다.'
    },
    primal_cataclysm: {
      id: 'primal_cataclysm', name: '원시의 대재앙 (Primal Champion)', type: 'attack', rarity: 'rare', classId: 'barbarian',
      cost: 2, damage: 22, upgradeDamage: 30, target: 'all', consumeResourceAll: true, bonusPerResource: 4,
      desc: '적 전체에게 피해 {damage}! 모든 격노를 폭발시켜 1당 피해 +4!'
    },

    // --- 3. ROGUE CARDS ---
    strike_rog: {
      id: 'strike_rog', name: '독 묻은 단검 찌르기', type: 'attack', rarity: 'basic', classId: 'rogue',
      cost: 1, damage: 5, upgradeDamage: 8, poison: 2, upgradePoison: 3, resourceGain: 1,
      desc: '피해를 {damage} 주고 맹독 {poison}을 부여합니다. 급소 주사위 +1.'
    },
    defend_rog: {
      id: 'defend_rog', name: '그림자 회피 (Evasion)', type: 'skill', rarity: 'basic', classId: 'rogue',
      cost: 1, block: 5, upgradeBlock: 8, resourceGain: 1,
      desc: '방어도를 {block} 얻습니다. 급소 주사위 +1.'
    },
    sneak_attack_rog: {
      id: 'sneak_attack_rog', name: '급소 공격 (Sneak Attack)', type: 'attack', rarity: 'common', classId: 'rogue',
      cost: 1, damage: 9, upgradeDamage: 13, bonusPerResource: 2, resourceGain: 2,
      desc: '피해를 {damage} 줍니다. 보유한 급소 주사위 1당 피해 +2! (주사위 +2)'
    },
    cunning_dash: {
      id: 'cunning_dash', name: '교활한 행동 (Cunning Action)', type: 'skill', rarity: 'common', classId: 'rogue',
      cost: 0, block: 4, upgradeBlock: 7, draw: 2, resourceGain: 2,
      desc: '0코스트! 방어도 {block}, 카드 2장 드로우, 급소 주사위 +2.'
    },
    wyvern_poison: {
      id: 'wyvern_poison', name: '와이번 맹독 코팅', type: 'skill', rarity: 'common', classId: 'rogue',
      cost: 1, poison: 7, upgradePoison: 10, target: 'all', resourceGain: 2,
      desc: '적 전체에게 맹독 {poison}을 퍼뜨립니다. 급소 주사위 +2.'
    },
    uncanny_dodge: {
      id: 'uncanny_dodge', name: '기묘한 회피 (Uncanny Dodge)', type: 'skill', rarity: 'common', classId: 'rogue',
      cost: 1, block: 11, upgradeBlock: 15, weak: 2, target: 'all',
      desc: '방어도를 {block} 얻고 적 전체에게 약화 2를 부여합니다.'
    },
    assassinate_crit: {
      id: 'assassinate_crit', name: '암살 (Assassinate)', type: 'attack', rarity: 'rare', classId: 'rogue',
      cost: 1, damage: 12, upgradeDamage: 16, damagePerPoison: true, vuln: 2,
      desc: '피해 {damage} + 대상의 현재 맹독 수치만큼 추가 치명타 피해! 취약 2 부여.'
    },
    mage_hand_trick: {
      id: 'mage_hand_trick', name: '마법사의 손 교란', type: 'skill', rarity: 'uncommon', classId: 'rogue',
      cost: 1, addDrone: 1, block: 7, upgradeBlock: 10, draw: 1,
      desc: '방어도 {block}, [마법사의 손 오브] 1기 소환, 카드 1장 드로우!'
    },
    wails_from_grave: {
      id: 'wails_from_grave', name: '무덤에서 울리는 통곡', type: 'attack', rarity: 'uncommon', classId: 'rogue',
      cost: 1, damage: 8, upgradeDamage: 12, summonHeal: 10, triggerSummonAttack: true,
      desc: '피해 {damage}, 망령 소환수 체력 +10 및 즉시 망령 협공!'
    },
    fan_of_knives: {
      id: 'fan_of_knives', name: '단검 세례', type: 'attack', rarity: 'uncommon', classId: 'rogue',
      cost: 1, damage: 5, upgradeDamage: 7, hits: 2, poison: 4, target: 'all',
      desc: '적 전체에게 피해 {damage}x2 및 맹독 4를 부여합니다.'
    },
    crimson_alchemist: {
      id: 'crimson_alchemist', name: '맹독 촉매 폭발', type: 'skill', rarity: 'uncommon', classId: 'rogue',
      cost: 1, doublePoison: true, triggerPoisonNow: true, exhaust: true,
      desc: '대상의 맹독을 2배로 만들고 즉시 맹독 피해를 1회 격발합니다! (소멸)'
    },
    death_mark_assassinate: {
      id: 'death_mark_assassinate', name: '죽음의 일격 (Death Strike)', type: 'attack', rarity: 'rare', classId: 'rogue',
      cost: 2, damage: 20, upgradeDamage: 28, doublePoison: true, triggerPoisonNow: true,
      desc: '피해 {damage}를 주고 대상의 맹독을 2배로 증폭한 뒤 즉시 폭발시킵니다!'
    },

    // --- 4. RANGER CARDS ---
    strike_rng: {
      id: 'strike_rng', name: '장궁 사격 (Longbow)', type: 'attack', rarity: 'basic', classId: 'ranger',
      cost: 1, damage: 6, upgradeDamage: 9, resourceGain: 1,
      desc: '피해를 {damage} 줍니다. 사냥꾼의 징표 +1.'
    },
    defend_rng: {
      id: 'defend_rng', name: '자연의 위장막', type: 'skill', rarity: 'basic', classId: 'ranger',
      cost: 1, block: 5, upgradeBlock: 8, resourceGain: 1,
      desc: '방어도를 {block} 얻습니다. 사냥꾼의 징표 +1.'
    },
    hunters_mark_shot: {
      id: 'hunters_mark_shot', name: '사냥꾼의 징표 (Hunter Mark)', type: 'attack', rarity: 'common', classId: 'ranger',
      cost: 1, damage: 8, upgradeDamage: 12, vuln: 2, resourceGain: 2,
      desc: '피해를 {damage} 주고 취약 2를 부여합니다. 징표 +2.'
    },
    twin_scimitar: {
      id: 'twin_scimitar', name: '쌍시미터 회전격', type: 'attack', rarity: 'common', classId: 'ranger',
      cost: 1, damage: 4, upgradeDamage: 6, hits: 3, triggerSummonAttack: true,
      desc: '피해를 {damage}씩 3번 주고 야수 동료가 있다면 즉시 협공합니다!'
    },
    summon_panther: {
      id: 'summon_panther', name: '야수 동료: 흑표범 소환', type: 'skill', rarity: 'common', classId: 'ranger',
      cost: 1, summonHeal: 15, upgradeSummonHeal: 22, summonAtkBoost: 4, triggerSummonAttack: true,
      desc: '흑표범을 소환/체력 +{summonHeal}, 공격력 +4 강화 후 즉시 물어뜯기!'
    },
    colossus_slayer: {
      id: 'colossus_slayer', name: '거수 학살자 (Colossus Slayer)', type: 'power', rarity: 'uncommon', classId: 'ranger',
      cost: 1, strength: 3, upgradeStrength: 5, dexterity: 2,
      desc: '힘 +{strength} 및 민첩 +2를 영구적으로 얻습니다.'
    },
    dread_ambusher: {
      id: 'dread_ambusher', name: '공포의 매복자 (Gloom Ambush)', type: 'attack', rarity: 'uncommon', classId: 'ranger',
      cost: 0, damage: 9, upgradeDamage: 13, draw: 2, resourceGain: 2,
      desc: '0코스트! 피해 {damage}, 카드 2장 드로우, 사냥꾼의 징표 +2.'
    },
    fey_misty_step: {
      id: 'fey_misty_step', name: '안개 걸음 (Misty Step)', type: 'skill', rarity: 'common', classId: 'ranger',
      cost: 1, block: 10, upgradeBlock: 14, addDrone: 1, draw: 1,
      desc: '방어도 {block}, [요정 정령 오브] 1기 소환, 카드 1장 드로우.'
    },
    ensnaring_thorns: {
      id: 'ensnaring_thorns', name: '가시 덩굴 속박 (Spike Growth)', type: 'skill', rarity: 'uncommon', classId: 'ranger',
      cost: 1, poison: 6, upgradePoison: 9, weak: 2, target: 'all',
      desc: '적 전체에게 출혈(맹독) {poison}과 약화 2를 부여합니다.'
    },
    lightning_arrow: {
      id: 'lightning_arrow', name: '번개 화살 (Lightning Arrow)', type: 'attack', rarity: 'uncommon', classId: 'ranger',
      cost: 1, damage: 11, upgradeDamage: 15, target: 'all', bonusPerResource: 2,
      desc: '적 전체에게 피해 {damage} + 보유한 징표 1당 추가 피해 +2!'
    },
    steel_wind_strike: {
      id: 'steel_wind_strike', name: '강철 바람의 일격 (5레벨 주문)', type: 'attack', rarity: 'rare', classId: 'ranger',
      cost: 2, damage: 18, upgradeDamage: 25, target: 'all', triggerSummonAttack: true,
      desc: '순간이동하며 적 전체에게 피해 {damage}를 주고 야수 동료가 협공합니다!'
    },
    conjure_volley: {
      id: 'conjure_volley', name: '화살 폭풍 소환 (Conjure Volley)', type: 'attack', rarity: 'rare', classId: 'ranger',
      cost: 2, damage: 22, upgradeDamage: 30, target: 'all', consumeResourceAll: true, bonusPerResource: 3,
      desc: '적 전체에게 피해 {damage}! 모든 징표를 소모해 1당 피해 +3!'
    },

    // --- 5. WIZARD CARDS ---
    strike_wiz: {
      id: 'strike_wiz', name: '파이어 볼트 (Fire Bolt)', type: 'attack', rarity: 'basic', classId: 'wizard',
      cost: 1, damage: 6, upgradeDamage: 9, resourceGain: 1,
      desc: '화염 피해를 {damage} 줍니다. 비전 주문력 +1.'
    },
    defend_wiz: {
      id: 'defend_wiz', name: '마법사 갑옷 (Mage Armor)', type: 'skill', rarity: 'basic', classId: 'wizard',
      cost: 1, block: 5, upgradeBlock: 8, resourceGain: 1,
      desc: '방어도를 {block} 얻습니다. 비전 주문력 +1.'
    },
    magic_missile_wiz: {
      id: 'magic_missile_wiz', name: '매직 미사일 (Magic Missile)', type: 'attack', rarity: 'common', classId: 'wizard',
      cost: 1, damage: 4, upgradeDamage: 6, hits: 3, addDrone: 1,
      desc: '필중 마력탄으로 피해 {damage}x3을 주고 [비전 구체 오브] 1기를 생성합니다!'
    },
    shield_spell_wiz: {
      id: 'shield_spell_wiz', name: '실드 주문 (Shield)', type: 'skill', rarity: 'common', classId: 'wizard',
      cost: 1, block: 9, upgradeBlock: 13, blockPerDrone: 4, draw: 1,
      desc: '방어도 {block} + 비전 구체 1기당 방어도 +4 획득! 카드 1장 드로우.'
    },
    fireball_wiz: {
      id: 'fireball_wiz', name: '파이어볼 (3레벨 Fireball)', type: 'attack', rarity: 'common', classId: 'wizard',
      cost: 2, damage: 16, upgradeDamage: 22, target: 'all', resourceGain: 2,
      desc: '대폭발! 적 전체에게 화염 피해를 {damage} 줍니다. 주문력 +2.'
    },
    arcane_ward_abj: {
      id: 'arcane_ward_abj', name: '비전 수호막 & 구체 전개', type: 'skill', rarity: 'uncommon', classId: 'wizard',
      cost: 1, block: 12, upgradeBlock: 16, addDrone: 2,
      desc: '방어도 {block}을 얻고 [비전 구체 오브] 2기를 즉시 소환합니다!'
    },
    animate_dead_nec: {
      id: 'animate_dead_nec', name: '언데드 조종 (Animate Dead)', type: 'skill', rarity: 'uncommon', classId: 'wizard',
      cost: 1, summonHeal: 16, upgradeSummonHeal: 22, summonAtkBoost: 5, triggerSummonAttack: true,
      desc: '전방에 [해골 기사]를 소환/체력 +{summonHeal}, 공격력 +5 강화 후 즉시 공격!'
    },
    portent_dice_div: {
      id: 'portent_dice_div', name: '예지 주사위 (Portent)', type: 'skill', rarity: 'uncommon', classId: 'wizard',
      cost: 0, gainEnergy: 1, draw: 2, upgradeDraw: 3, resourceGain: 3,
      desc: '0코스트! 운명을 조작해 마나 +1, 주문력 +3, 카드를 {draw}장 뽑습니다!'
    },
    chain_lightning_wiz: {
      id: 'chain_lightning_wiz', name: '체인 라이트닝 (6레벨 주문)', type: 'attack', rarity: 'uncommon', classId: 'wizard',
      cost: 1, damage: 9, upgradeDamage: 13, target: 'all', triggerDronesNow: true,
      desc: '적 전체에게 피해 {damage}를 주고 모든 비전 구체가 즉시 일제 사격합니다!'
    },
    cone_of_cold: {
      id: 'cone_of_cold', name: '냉기 원뿔 (Cone of Cold)', type: 'attack', rarity: 'uncommon', classId: 'wizard',
      cost: 2, damage: 14, upgradeDamage: 19, target: 'all', weak: 2, vuln: 2,
      desc: '적 전체에게 냉기 피해 {damage} 및 약화 2, 취약 2를 부여합니다.'
    },
    haste_spell: {
      id: 'haste_spell', name: '가속 (Haste)', type: 'power', rarity: 'rare', classId: 'wizard',
      cost: 1, strength: 3, dexterity: 3, addDrone: 1, draw: 2,
      desc: '주문력(힘) +3, 민첩 +3, 비전 구체 +1기 소환, 카드 2장 드로우!'
    },
    meteor_swarm_wiz: {
      id: 'meteor_swarm_wiz', name: '메테오 스웜 (9레벨 궁극 주문)', type: 'attack', rarity: 'rare', classId: 'wizard',
      cost: 2, damage: 26, upgradeDamage: 35, target: 'all', consumeResourceAll: true, bonusPerResource: 3,
      desc: '9레벨 대마법! 적 전체 피해 {damage} + 모든 비전 주문력 1당 피해 +3!'
    },

    // --- 6. CLERIC CARDS ---
    strike_clr: {
      id: 'strike_clr', name: '신성한 불꽃 (Sacred Flame)', type: 'attack', rarity: 'basic', classId: 'cleric',
      cost: 1, damage: 6, upgradeDamage: 9, resourceGain: 1,
      desc: '광휘 피해를 {damage} 줍니다. 신성력 +1.'
    },
    defend_clr: {
      id: 'defend_clr', name: '신앙의 방패 (Shield of Faith)', type: 'skill', rarity: 'basic', classId: 'cleric',
      cost: 1, block: 6, upgradeBlock: 9, resourceGain: 1,
      desc: '방어도를 {block} 얻습니다. 신성력 +1.'
    },
    guiding_bolt: {
      id: 'guiding_bolt', name: '가이딩 볼트 (Guiding Bolt)', type: 'attack', rarity: 'common', classId: 'cleric',
      cost: 1, damage: 10, upgradeDamage: 14, vuln: 2, resourceGain: 2,
      desc: '광휘 피해 {damage}를 주고 다음 공격을 유도해 취약 2를 부여합니다! 신성력 +2.'
    },
    healing_word_clr: {
      id: 'healing_word_clr', name: '치유의 기원 (Mass Healing Word)', type: 'skill', rarity: 'common', classId: 'cleric',
      cost: 1, block: 8, upgradeBlock: 11, healOnHit: 6, summonHeal: 8, draw: 1,
      desc: '방어도 {block}, 내 체력 +6 회복, 소환수 체력 +8 회복, 카드 1장 드로우!'
    },
    spirit_guardians_clr: {
      id: 'spirit_guardians_clr', name: '영혼의 수호자 (Spirit Guardians)', type: 'skill', rarity: 'common', classId: 'cleric',
      cost: 1, addDrone: 1, block: 7, upgradeBlock: 10, triggerDronesNow: true,
      desc: '방어도 {block}, [천상의 수호령 오브] 1기 소환 후 즉시 광휘 폭격!'
    },
    radiance_of_dawn: {
      id: 'radiance_of_dawn', name: '여명의 광휘 (Channel Divinity)', type: 'attack', rarity: 'uncommon', classId: 'cleric',
      cost: 1, damage: 10, upgradeDamage: 14, target: 'all', weak: 2, poison: 4,
      desc: '적 전체에게 광휘 피해 {damage}, 화상(맹독) 4, 약화 2를 부여합니다!'
    },
    war_gods_blessing: {
      id: 'war_gods_blessing', name: '전쟁신의 축복 & 영체 무기', type: 'attack', rarity: 'uncommon', classId: 'cleric',
      cost: 1, damage: 9, upgradeDamage: 13, strength: 2, summonHeal: 12, triggerSummonAttack: true,
      desc: '피해 {damage}, 힘 +2, 영체 수호자 소환(+12) 및 즉시 협공!'
    },
    path_to_grave: {
      id: 'path_to_grave', name: '무덤으로 향하는 길 (저주)', type: 'skill', rarity: 'uncommon', classId: 'cleric',
      cost: 1, vuln: 3, stance: 'wrath', draw: 2, resourceGain: 3,
      desc: '대상에게 취약 3 부여, [심판(공격력 2배)] 태세 돌입, 카드 2장 드로우!'
    },
    spiritual_weapon: {
      id: 'spiritual_weapon', name: '영체 무기 (Spiritual Weapon)', type: 'attack', rarity: 'common', classId: 'cleric',
      cost: 0, damage: 7, upgradeDamage: 10, addDrone: 1,
      desc: '0코스트 보너스 행동! 피해 {damage}를 주고 수호령 오브 +1기를 소환합니다.'
    },
    flame_strike_clr: {
      id: 'flame_strike_clr', name: '플레임 스트라이크 (5레벨 주문)', type: 'attack', rarity: 'uncommon', classId: 'cleric',
      cost: 2, damage: 17, upgradeDamage: 23, target: 'all', triggerDronesNow: true,
      desc: '천상의 불기둥으로 적 전체에게 피해 {damage} 및 수호령 일제 공격!'
    },
    holy_aura_clr: {
      id: 'holy_aura_clr', name: '신성한 오라 (8레벨 Holy Aura)', type: 'power', rarity: 'rare', classId: 'cleric',
      cost: 1, strength: 3, dexterity: 3, metallicize: 5,
      desc: '힘 +3, 민첩 +3 및 매 턴 종료 시 방어도 +5를 영구 획득합니다.'
    },
    divine_intervention: {
      id: 'divine_intervention', name: '신성한 개입 (Divine Intervention)', type: 'attack', rarity: 'rare', classId: 'cleric',
      cost: 2, damage: 22, upgradeDamage: 30, target: 'all', healOnHit: 12, stance: 'divinity',
      desc: '신의 기적! 적 전체 피해 {damage}, 내 체력 +12 회복, [초월(피해 3배, 마나+2)] 돌입!'
    },

    // --- 7. PALADIN CARDS ---
    strike_pal: {
      id: 'strike_pal', name: '성검 베기', type: 'attack', rarity: 'basic', classId: 'paladin',
      cost: 1, damage: 6, upgradeDamage: 9, resourceGain: 1,
      desc: '피해를 {damage} 줍니다. 신성한 강타 +1.'
    },
    defend_pal: {
      id: 'defend_pal', name: '성기사의 방패', type: 'skill', rarity: 'basic', classId: 'paladin',
      cost: 1, block: 6, upgradeBlock: 9, resourceGain: 1,
      desc: '방어도를 {block} 얻습니다. 신성한 강타 +1.'
    },
    divine_smite_pal: {
      id: 'divine_smite_pal', name: '신성한 강타 (Divine Smite)', type: 'attack', rarity: 'common', classId: 'paladin',
      cost: 1, damage: 10, upgradeDamage: 14, bonusPerResource: 2, resourceGain: 2,
      desc: '피해 {damage} + 보유한 강타 충전 1당 추가 광휘 피해 +2! (강타 +2)'
    },
    lay_on_hands: {
      id: 'lay_on_hands', name: '안수 치료 (Lay on Hands)', type: 'skill', rarity: 'common', classId: 'paladin',
      cost: 1, block: 9, upgradeBlock: 13, healOnHit: 6, resourceGain: 2,
      desc: '방어도 {block}을 얻고 내 체력을 6 회복합니다. 강타 +2.'
    },
    sacred_weapon_dev: {
      id: 'sacred_weapon_dev', name: '신성한 무기 (Sacred Weapon)', type: 'power', rarity: 'uncommon', classId: 'paladin',
      cost: 1, strength: 3, upgradeStrength: 5, metallicize: 4,
      desc: '성검에 빛을 부여해 힘 +{strength} 및 매 턴 종료 시 방어도 +4를 얻습니다.'
    },
    vow_of_enmity: {
      id: 'vow_of_enmity', name: '적대의 맹세 (복수의 화신)', type: 'attack', rarity: 'uncommon', classId: 'paladin',
      cost: 1, damage: 9, upgradeDamage: 13, stance: 'wrath', vuln: 2,
      desc: '피해 {damage}, 대상에게 취약 2 부여 후 [복수(공격력 2배)] 태세 돌입!'
    },
    aura_of_conquest: {
      id: 'aura_of_conquest', name: '정복과 굴복의 오라', type: 'skill', rarity: 'common', classId: 'paladin',
      cost: 1, block: 11, upgradeBlock: 15, weak: 2, target: 'all', stance: 'calm',
      desc: '방어도 {block}, 적 전체 약화 2, [명경/신앙(해제 시 마나+2)] 태세 돌입!'
    },
    dread_lord_oathbreaker: {
      id: 'dread_lord_oathbreaker', name: '공포의 군주 (Dread Lord)', type: 'attack', rarity: 'rare', classId: 'paladin',
      cost: 2, damage: 16, upgradeDamage: 22, summonHeal: 15, poison: 6, triggerSummonAttack: true,
      desc: '피해 {damage}, 암흑 저주 6, 죽음의 기사 소환(+15) 및 즉시 협공!'
    },
    find_greater_steed: {
      id: 'find_greater_steed', name: '상급 군마 소환 (그리폰)', type: 'skill', rarity: 'uncommon', classId: 'paladin',
      cost: 1, summonHeal: 16, upgradeSummonHeal: 22, summonAtkBoost: 4, draw: 1,
      desc: '전방에 [천상의 그리폰]을 소환/체력 +{summonHeal}, 공격력 +4, 카드 1장 드로우!'
    },
    blinding_smite: {
      id: 'blinding_smite', name: '섬광의 강타 (Blinding Smite)', type: 'attack', rarity: 'uncommon', classId: 'paladin',
      cost: 1, damage: 11, upgradeDamage: 15, weak: 2, vuln: 2, resourceGain: 2,
      desc: '피해 {damage}를 주고 대상에게 실명(약화 2, 취약 2)을 부여합니다.'
    },
    circle_of_power: {
      id: 'circle_of_power', name: '권능의 원 (Circle of Power)', type: 'skill', rarity: 'uncommon', classId: 'paladin',
      cost: 1, block: 10, upgradeBlock: 14, doubleBlock: true,
      desc: '방어도를 {block} 얻고 현재 방어도를 2배로 증폭합니다!'
    },
    avenging_angel_smite: {
      id: 'avenging_angel_smite', name: '복수의 천사 강림 (20레벨 성기사)', type: 'attack', rarity: 'rare', classId: 'paladin',
      cost: 2, damage: 22, upgradeDamage: 30, target: 'all', stance: 'divinity',
      desc: '적 전체에게 광휘 피해 {damage}를 주고 [천상 강림(피해 3배, 마나+2)]에 돌입합니다!'
    },

    // --- 8. WARLOCK CARDS ---
    strike_warlock: {
      id: 'strike_warlock', name: '칠흑의 칼날', type: 'attack', rarity: 'basic', classId: 'warlock',
      cost: 1, damage: 6, upgradeDamage: 9, resourceGain: 1,
      desc: '피해를 {damage} 줍니다. 영혼 조각 +1.'
    },
    defend_warlock: {
      id: 'defend_warlock', name: '악마의 갑옷 (Fiendish Vigor)', type: 'skill', rarity: 'basic', classId: 'warlock',
      cost: 1, block: 5, upgradeBlock: 8, summonHeal: 3,
      desc: '방어도를 {block} 얻고 계약 악마 [핀드]의 체력을 3 회복합니다.'
    },
    eldritch_blast_wlk: {
      id: 'eldritch_blast_wlk', name: '섬뜩한 파열 (Eldritch Blast)', type: 'attack', rarity: 'common', classId: 'warlock',
      cost: 1, damage: 5, upgradeDamage: 7, hits: 2, triggerSummonAttack: true, resourceGain: 2,
      desc: '고통의 파열(Agonizing Blast)! 피해 {damage}x2를 주고 계약 악마가 즉시 협공합니다!'
    },
    hex_curse_wlk: {
      id: 'hex_curse_wlk', name: '주술 (Hex)', type: 'skill', rarity: 'common', classId: 'warlock',
      cost: 0, poison: 5, upgradePoison: 8, vuln: 1, draw: 1, resourceGain: 2,
      desc: '0코스트! 대상에게 주술(맹독) {poison}, 취약 1을 걸고 카드를 1장 뽑습니다.'
    },
    summon_fiend_wlk: {
      id: 'summon_fiend_wlk', name: '사슬의 계약: 지옥마신 진화', type: 'skill', rarity: 'common', classId: 'warlock',
      cost: 1, summonHeal: 15, upgradeSummonHeal: 22, summonAtkBoost: 4, resourceGain: 2,
      desc: '계약 악마 [지옥마신 핀드]의 체력 +{summonHeal}, 공격력을 +4 강화합니다!'
    },
    hexblade_wrath: {
      id: 'hexblade_wrath', name: '헥스블레이드의 저주받은 일격', type: 'attack', rarity: 'uncommon', classId: 'warlock',
      cost: 1, damage: 11, upgradeDamage: 15, poison: 5, healOnHit: 4,
      desc: '피해 {damage}, 저주 5를 부여하고 내 체력을 4 흡수합니다.'
    },
    awakened_mind_goo: {
      id: 'awakened_mind_goo', name: '각성한 정신 (크툴루의 속삭임)', type: 'skill', rarity: 'uncommon', classId: 'warlock',
      cost: 1, addDrone: 1, weak: 2, vuln: 2, target: 'all',
      desc: '[공허의 촉수 오브] 1기를 소환하고 적 전체에게 약화 2, 취약 2를 부여합니다!'
    },
    armor_of_agathys: {
      id: 'armor_of_agathys', name: '아가시스의 갑옷 (Armor of Agathys)', type: 'skill', rarity: 'common', classId: 'warlock',
      cost: 1, block: 10, upgradeBlock: 14, summonHeal: 10,
      desc: '내 냉기 방어도 +{block} 및 계약 악마의 체력을 +10 증가시킵니다.'
    },
    hunger_of_hadar: {
      id: 'hunger_of_hadar', name: '하다르의 굶주림 (Hunger of Hadar)', type: 'attack', rarity: 'uncommon', classId: 'warlock',
      cost: 2, damage: 13, upgradeDamage: 18, poison: 6, target: 'all', addDrone: 1,
      desc: '적 전체에게 암흑 피해 {damage}, 저주 6을 부여하고 촉수 오브 +1기를 소환합니다!'
    },
    lifedrinker_blade: {
      id: 'lifedrinker_blade', name: '생명 흡수자 (Lifedrinker)', type: 'attack', rarity: 'uncommon', classId: 'warlock',
      cost: 1, damage: 10, upgradeDamage: 14, healOnHit: 5, summonHeal: 5,
      desc: '피해 {damage}를 주고 워락과 계약 악마의 체력을 각각 5 회복합니다.'
    },
    dark_ones_blessing: {
      id: 'dark_ones_blessing', name: '어둠의 존재의 축복', type: 'power', rarity: 'rare', classId: 'warlock',
      cost: 1, strength: 3, summonHeal: 18, summonAtkBoost: 5,
      desc: '힘 +3, 계약 악마의 체력 +18 및 공격력 +5를 영구 증폭합니다!'
    },
    hurl_through_hell: {
      id: 'hurl_through_hell', name: '지옥으로 내던지기 (Hurl Through Hell)', type: 'attack', rarity: 'rare', classId: 'warlock',
      cost: 2, damage: 22, upgradeDamage: 30, damagePlusSummonHp: true, triggerSummonAttack: true,
      desc: '대상을 지옥 차원으로 내던져 피해 {damage} + 계약 악마 체력만큼 추가 피해 및 악마 협공!'
    }
  },

  mutations: [
    { id: 'rad_infused', name: '🧪 산성/맹독 룬 각인', desc: '이 카드 사용 시 대상에게 산성/맹독 +4 추가 부여', badgeColor: '#2ecc71' },
    { id: 'adrenaline_gene', name: '⚡ 가속(Haste) 룬 각인', desc: '이 카드 사용 시 카드를 1장 추가로 뽑고 클래스 자원 +2', badgeColor: '#00d2d3' },
    { id: 'chitin_coat', name: '🛡️ 방호(Abjuration) 룬 각인', desc: '이 카드 사용 시 방어도 +6 추가 획득', badgeColor: '#3498db' },
    { id: 'vampiric_cell', name: '🩸 흡혈(Vampiric) 룬 각인', desc: '이 카드 사용 시 내 체력을 3 회복하고 피해량 +4', badgeColor: '#e74c3c' }
  ],

  relics: {
    fighters_badge: {
      id: 'fighters_badge', name: '워터딥 검투사의 휘장', icon: '⚔️',
      desc: '전투 종료 시 체력을 6 회복하고 첫 턴 우위 주사위 +2를 얻습니다.'
    },
    totem_necklace: {
      id: 'totem_necklace', name: '우스가르드 야수 토템 목걸이', icon: '🐻',
      desc: '전투 시작 시 힘 +2 및 격노 +2를 얻습니다.'
    },
    thieves_tools: {
      id: 'thieves_tools', name: '젠타림 마스터 도적 도구', icon: '🗝️',
      desc: '전투 시작 시 모든 적에게 맹독 3과 취약 1을 부여하고 첫 턴 카드를 2장 더 뽑습니다.'
    },
    hunters_quiver: {
      id: 'hunters_quiver', name: '엘프 여왕의 마법 화살통', icon: '🏹',
      desc: '전투 시작 시 민첩 +2 및 사냥꾼의 징표 +3을 얻습니다.'
    },
    spellbook_of_mystra: {
      id: 'spellbook_of_mystra', name: '미스트라의 비전 마도서', icon: '📘',
      desc: '전투 시작 시 [비전 구체 오브] 1기를 소환하고 비전 주문력 +3을 얻습니다.'
    },
    holy_symbol_lathander: {
      id: 'holy_symbol_lathander', name: '라센더의 태양 성물', icon: '☀️',
      desc: '전투 시작 시 [천상의 수호령 오브] 1기를 소환하고 전투 후 체력을 5 회복합니다.'
    },
    holy_avenger_hilt: {
      id: 'holy_avenger_hilt', name: '티르의 성검 인장', icon: '⚜️',
      desc: '매 턴 종료 시 방어도 +4를 자동으로 얻으며 첫 턴 신성한 강타 +3을 얻습니다.'
    },
    rod_of_pact_keeper: {
      id: 'rod_of_pact_keeper', name: '계약 수호자의 마법봉 (+2)', icon: '🟣',
      desc: '전투 시작 시 전방에 [지옥마신 핀드]를 소환하며 매 턴 핀드가 체력을 4 회복합니다.'
    },
    Geiger_counter: {
      id: 'Geiger_counter', name: '오우거 힘의 건틀릿', icon: '🥊',
      desc: '전투 시작 시 영구적으로 공격력(힘) +2를 얻습니다.', price: 110
    },
    mutant_adrenal: {
      id: 'mutant_adrenal', name: '신속의 부츠 (Boots of Speed)', icon: '🥾',
      desc: '매 턴 시작 시 카드를 1장 더 뽑고 첫 턴 방어도 +8을 얻습니다.', price: 135
    },
    titanium_ribs: {
      id: 'titanium_ribs', name: '보호의 망토 (Cloak of Protection)', icon: '🛡️',
      desc: '민첩 +2 및 매 턴 종료 시 방어도 +4를 자동으로 얻습니다.', price: 125
    },
    fusion_cell: {
      id: 'fusion_cell', name: '이운 스톤 (Ioun Stone of Mastery)', icon: '💎',
      desc: '매 턴 최대 행동 마나(AP)가 +1 증가합니다!', price: 180
    },
    scavenger_goggles: {
      id: 'scavenger_goggles', name: '보물 감지의 랜턴', icon: '🏮',
      desc: '전투 승리 시 얻는 골드가 +35% 증가하고 최대 체력 +10.', price: 100
    }
  },

  potions: {
    rad_heal: {
      id: 'rad_heal', name: '상급 치유 물약 (Greater Healing)', icon: '🧪', price: 45,
      desc: '체력을 즉시 25 회복합니다.'
    },
    fury_stim: {
      id: 'fury_stim', name: '거인의 힘 물약 (Giant Strength)', icon: '💪', price: 50,
      desc: '이번 전투 동안 힘 +3 및 마나(AP) +2를 즉시 얻습니다.'
    },
    acid_bomb: {
      id: 'acid_bomb', name: '연금술사의 불 & 산성 플라스크', icon: '💣', price: 50,
      desc: '적 전체에게 피해 20과 산성 맹독 8을 부여합니다.'
    },
    shield_gel: {
      id: 'shield_gel', name: '영웅심의 물약 (Potion of Heroism)', icon: '📜', price: 40,
      desc: '즉시 임시 체력(방어도) 18을 얻고 카드를 2장 뽑습니다.'
    }
  },

  // ==========================================================================
  // D&D 5E MONSTER MANUAL across 5 Acts (Floors)
  // ==========================================================================
  enemies: {
    // --- ACT 1: GOBLIN KEEP & UNDERMOUNTAIN ENTRY ---
    goblin_skirmisher: {
      id: 'goblin_skirmisher', name: '고블린 매복병', maxHp: 32, type: 'normal', expReward: 40,
      svg: `<svg viewBox="0 0 100 100"><polygon points="20,40 35,20 65,20 80,40 70,82 30,82" fill="#1e5631" stroke="#2ecc71" stroke-width="3"/><circle cx="38" cy="48" r="6" fill="#ff3838"/><circle cx="62" cy="48" r="6" fill="#ff3838"/></svg>`,
      moves: [
        { name: '시미터 베기', intent: 'attack', dmg: 8, desc: '피해 8' },
        { name: '가죽 방패 엄폐', intent: 'defend_buff', block: 7, str: 1, desc: '방어도 7 + 힘 +1' },
        { name: '독화살 사격', intent: 'attack_debuff', dmg: 6, weak: 1, desc: '피해 6 + 약화 1' }
      ]
    },
    kobold_inventor: {
      id: 'kobold_inventor', name: '코볼트 함정꾼', maxHp: 30, type: 'normal', expReward: 40,
      svg: `<svg viewBox="0 0 100 100"><polygon points="30,82 25,35 50,18 75,35 70,82" fill="#78281f" stroke="#e67e22" stroke-width="3"/><circle cx="40" cy="45" r="5" fill="#ff0"/><circle cx="60" cy="45" r="5" fill="#ff0"/></svg>`,
      moves: [
        { name: '불항아리 투척', intent: 'attack_debuff', dmg: 7, vuln: 1, desc: '피해 7 + 취약 1' },
        { name: '무리 전술 찌르기', intent: 'multi_attack', dmg: 5, hits: 2, desc: '피해 5 x 2' }
      ]
    },
    skeleton_warrior: {
      id: 'skeleton_warrior', name: '고대 해골 병사', maxHp: 38, type: 'normal', expReward: 45,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="45" r="28" fill="#dfe6e9" stroke="#636e72" stroke-width="3"/><circle cx="40" cy="42" r="6" fill="#111"/><circle cx="60" cy="42" r="6" fill="#111"/><rect x="38" y="65" width="24" height="12" fill="#dfe6e9"/></svg>`,
      moves: [
        { name: '녹슨 롱소드', intent: 'attack', dmg: 10, desc: '피해 10' },
        { name: '뼈 방패 재조립', intent: 'defend_buff', block: 9, str: 2, desc: '방어도 9 + 힘 +2' }
      ]
    },
    orc_berserker: {
      id: 'orc_berserker', name: '그룸쉬의 오크 광전사', maxHp: 46, type: 'normal', expReward: 50,
      svg: `<svg viewBox="0 0 100 100"><polygon points="25,85 20,35 50,18 80,35 75,85" fill="#4a5d23" stroke="#a3cb38" stroke-width="3"/><circle cx="38" cy="46" r="6" fill="#ff3838"/><circle cx="62" cy="46" r="6" fill="#ff3838"/></svg>`,
      moves: [
        { name: '그레이트액스 강타', intent: 'attack', dmg: 12, desc: '피해 12' },
        { name: '전투의 포효', intent: 'defend_buff', block: 8, str: 2, desc: '방어도 8 + 힘 +2' }
      ]
    },
    owlbear_alpha: {
      id: 'owlbear_alpha', name: '🦉 [엘리트] 흉포한 아울베어', maxHp: 88, type: 'elite', expReward: 110,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="36" fill="#5c3c10" stroke="#fdcb6e" stroke-width="4"/><circle cx="38" cy="45" r="8" fill="#ff9f43"/><circle cx="62" cy="45" r="8" fill="#ff9f43"/><polygon points="50,52 44,64 56,64" fill="#ffeaa7"/></svg>`,
      moves: [
        { name: '부리와 발톱 다중공격', intent: 'multi_attack', dmg: 7, hits: 2, desc: '피해 7 x 2' },
        { name: '야수의 괴성', intent: 'defend_buff', block: 12, str: 3, desc: '방어도 12 + 힘 +3' },
        { name: '곰의 짓누르기', intent: 'attack_debuff', dmg: 16, vuln: 2, desc: '피해 16 + 취약 2' }
      ]
    },
    bugbear_chieftain: {
      id: 'bugbear_chieftain', name: '🔨 [엘리트] 버그베어 족장 클라그', maxHp: 95, type: 'elite', expReward: 115,
      svg: `<svg viewBox="0 0 100 100"><rect x="22" y="22" width="56" height="60" rx="12" fill="#4a2311" stroke="#e67e22" stroke-width="4"/><circle cx="38" cy="46" r="6" fill="#ff3838"/><circle cx="62" cy="46" r="6" fill="#ff3838"/></svg>`,
      moves: [
        { name: '모닝스타 기습 강타', intent: 'attack', dmg: 17, desc: '피해 17' },
        { name: '족장의 호령', intent: 'defend_buff', block: 14, str: 2, desc: '방어도 14 + 힘 +2' }
      ]
    },
    troll_warlord: {
      id: 'troll_warlord', name: '🩸 [1층 중간보스] 초재생 변이 트롤', maxHp: 125, type: 'elite', expReward: 150,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,15 85,40 75,88 25,88 15,40" fill="#1e5631" stroke="#00ff88" stroke-width="4"/><circle cx="38" cy="48" r="7" fill="#ff0"/><circle cx="62" cy="48" r="7" fill="#ff0"/></svg>`,
      moves: [
        { name: '초재생 피부 & 괴력', intent: 'defend_buff', block: 15, str: 3, desc: '방어도 15 + 힘 +3' },
        { name: '갈기갈기 찢기', intent: 'multi_attack', dmg: 7, hits: 3, desc: '피해 7 x 3' }
      ]
    },
    beholder_xanathar: {
      id: 'beholder_xanathar', name: '👁️ [1층 보스] 비홀더 군주 자나사르', maxHp: 175, type: 'boss', expReward: 250,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="65" r="38" fill="#4a154b" stroke="#e056fd" stroke-width="4"/><circle cx="60" cy="60" r="18" fill="#fff"/><circle cx="60" cy="60" r="8" fill="#ff0055"/><line x1="40" y1="30" x2="25" y2="12" stroke="#e056fd" stroke-width="4"/><circle cx="25" cy="12" r="6" fill="#00ff88"/><line x1="80" y1="30" x2="95" y2="12" stroke="#e056fd" stroke-width="4"/><circle cx="95" cy="12" r="6" fill="#ff3838"/></svg>`,
      moves: [
        { name: '분해 광선 & 석화 광선', intent: 'attack_debuff', dmg: 16, weak: 2, vuln: 2, desc: '피해 16 + 약화 2 + 취약 2' },
        { name: '반마법 원뿔 결계', intent: 'defend_buff', block: 18, str: 3, desc: '방어도 18 + 힘 +3' },
        { name: '10개의 눈 광선 난사', intent: 'multi_attack', dmg: 7, hits: 3, desc: '피해 7 x 3' },
        { name: '죽음의 광선 (Death Ray)', intent: 'attack', dmg: 24, desc: '피해 24' }
      ]
    },

    // --- ACT 2: UNDERDARK & DROW TEMPLE ---
    drow_assassin: {
      id: 'drow_assassin', name: '드로우 암살자', maxHp: 45, type: 'normal', expReward: 55,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#2c2c54" stroke="#a29bfe" stroke-width="3"/><circle cx="38" cy="48" r="5" fill="#ff3838"/><circle cx="62" cy="48" r="5" fill="#ff3838"/></svg>`,
      moves: [
        { name: '드로우 수면독 석궁', intent: 'attack_debuff', dmg: 10, weak: 2, desc: '피해 10 + 약화 2' },
        { name: '쌍단검 연격', intent: 'multi_attack', dmg: 6, hits: 2, desc: '피해 6 x 2' }
      ]
    },
    hook_horror: {
      id: 'hook_horror', name: '훅 호러 (갈고리 괴수)', maxHp: 56, type: 'normal', expReward: 60,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,15 85,45 70,85 30,85 15,45" fill="#2f3640" stroke="#74b9ff" stroke-width="3"/></svg>`,
      moves: [
        { name: '양손 갈고리 찍기', intent: 'multi_attack', dmg: 8, hits: 2, desc: '피해 8 x 2' },
        { name: '외골격 방어', intent: 'defend_buff', block: 12, str: 2, desc: '방어도 12 + 힘 +2' }
      ]
    },
    giant_phase_spider: {
      id: 'giant_phase_spider', name: '차원 이동 거대 거미', maxHp: 48, type: 'normal', expReward: 55,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="30" fill="#192a56" stroke="#00d2d3" stroke-width="3"/><circle cx="42" cy="45" r="5" fill="#00ff88"/><circle cx="58" cy="45" r="5" fill="#00ff88"/></svg>`,
      moves: [
        { name: '에테르 독니 물어뜯기', intent: 'attack_debuff', dmg: 12, vuln: 2, desc: '피해 12 + 취약 2' },
        { name: '거미줄 방어', intent: 'defend_buff', block: 10, str: 2, desc: '방어도 10 + 힘 +2' }
      ]
    },
    duergar_hammerer: {
      id: 'duergar_hammerer', name: '듀에르가 거대화 전사', maxHp: 54, type: 'normal', expReward: 60,
      svg: `<svg viewBox="0 0 100 100"><rect x="24" y="24" width="52" height="54" fill="#3d3d3d" stroke="#ff7675" stroke-width="3"/></svg>`,
      moves: [
        { name: '전쟁망치 강타', intent: 'attack', dmg: 14, desc: '피해 14' },
        { name: '거대화 (Enlarge)', intent: 'defend_buff', block: 10, str: 3, desc: '방어도 10 + 힘 +3' }
      ]
    },
    drider_champion: {
      id: 'drider_champion', name: '🕷️ [엘리트] 롤스의 저주받은 드라이다', maxHp: 110, type: 'elite', expReward: 130,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#3b1e54" stroke="#e056fd" stroke-width="4"/></svg>`,
      moves: [
        { name: '요정 불꽃 & 맹독 장궁', intent: 'attack_debuff', dmg: 16, vuln: 2, desc: '피해 16 + 취약 2' },
        { name: '거미 다리 난무', intent: 'multi_attack', dmg: 8, hits: 3, desc: '피해 8 x 3' }
      ]
    },
    umbeR_hulk: {
      id: 'umbeR_hulk', name: '🪲 [엘리트] 땅굴 파괴자 엄버 헐크', maxHp: 118, type: 'elite', expReward: 135,
      svg: `<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="12" fill="#4a3500" stroke="#fdcb6e" stroke-width="4"/></svg>`,
      moves: [
        { name: '혼란의 시선 & 집게발', intent: 'attack_debuff', dmg: 18, weak: 2, desc: '피해 18 + 약화 2' },
        { name: '갑충 껍질 경화', intent: 'defend_buff', block: 16, str: 3, desc: '방어도 16 + 힘 +3' }
      ]
    },
    drow_priestess: {
      id: 'drow_priestess', name: '🐍 [2층 중간보스] 드로우 대여사제', maxHp: 140, type: 'elite', expReward: 170,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,12 86,42 74,88 26,88 14,42" fill="#2c003e" stroke="#e056fd" stroke-width="4"/></svg>`,
      moves: [
        { name: '뱀 채찍 3연타', intent: 'multi_attack', dmg: 8, hits: 3, desc: '피해 8 x 3' },
        { name: '거미 여왕의 축복', intent: 'defend_buff', block: 18, str: 4, desc: '방어도 18 + 힘 +4' }
      ]
    },
    arachne_matron: {
      id: 'arachne_matron', name: '👑 [2층 보스] 롤스의 화신 아라크네 대모', maxHp: 210, type: 'boss', expReward: 300,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,10 105,38 92,98 60,112 28,98 15,38" fill="#2c001e" stroke="#ff0055" stroke-width="4"/><circle cx="45" cy="50" r="7" fill="#00ff88"/><circle cx="75" cy="50" r="7" fill="#00ff88"/></svg>`,
      moves: [
        { name: '심연의 거미줄 구속', intent: 'attack_debuff', dmg: 18, weak: 2, vuln: 2, desc: '피해 18 + 약화 2 + 취약 2' },
        { name: '여왕의 암흑 결계', intent: 'defend_buff', block: 22, str: 4, desc: '방어도 22 + 힘 +4' },
        { name: '맹독 송곳니 난타', intent: 'multi_attack', dmg: 9, hits: 3, desc: '피해 9 x 3' }
      ]
    },

    // --- ACT 3: MIND FLAYER COLONY ---
    intellect_devourer: {
      id: 'intellect_devourer', name: '지능 포식자 (뇌 괴수)', maxHp: 52, type: 'normal', expReward: 65,
      svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="52" rx="34" ry="24" fill="#b33771" stroke="#fd79a8" stroke-width="3"/></svg>`,
      moves: [
        { name: '정신 파열 (Mind Blast)', intent: 'attack_debuff', dmg: 13, vuln: 2, desc: '피해 13 + 취약 2' },
        { name: '발톱 2연타', intent: 'multi_attack', dmg: 7, hits: 2, desc: '피해 7 x 2' }
      ]
    },
    mind_flayer_arcanist: {
      id: 'mind_flayer_arcanist', name: '마인드 플레이어 비전술사', maxHp: 64, type: 'normal', expReward: 75,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="44" r="26" fill="#6c5ce7" stroke="#a29bfe" stroke-width="3"/><path d="M38 62 L32 88 M46 65 L44 90 M54 65 L56 90 M62 62 L68 88" stroke="#a29bfe" stroke-width="4"/></svg>`,
      moves: [
        { name: '정신 채찍 (Mind Whip)', intent: 'attack_debuff', dmg: 15, weak: 2, desc: '피해 15 + 약화 2' },
        { name: '염동력 방벽', intent: 'defend_buff', block: 14, str: 3, desc: '방어도 14 + 힘 +3' }
      ]
    },
    grimlock_brute: {
      id: 'grimlock_brute', name: '맹인 그림록 광전사', maxHp: 62, type: 'normal', expReward: 70,
      svg: `<svg viewBox="0 0 100 100"><rect x="24" y="24" width="52" height="54" rx="10" fill="#636e72" stroke="#dfe6e9" stroke-width="3"/></svg>`,
      moves: [
        { name: '가시 몽둥이 강타', intent: 'attack', dmg: 16, desc: '피해 16' },
        { name: '돌가죽 경화', intent: 'defend_buff', block: 12, str: 2, desc: '방어도 12 + 힘 +2' }
      ]
    },
    nothics_eye: {
      id: 'nothics_eye', name: '기괴한 외눈 노식(Nothic)', maxHp: 58, type: 'normal', expReward: 70,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="#1e272e" stroke="#00ff88" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="#00ff88"/></svg>`,
      moves: [
        { name: '부패의 시선', intent: 'attack_debuff', dmg: 14, vuln: 2, desc: '피해 14 + 취약 2' },
        { name: '발톱 할퀴기', intent: 'multi_attack', dmg: 8, hits: 2, desc: '피해 8 x 2' }
      ]
    },
    mind_flayer_inquisitor: {
      id: 'mind_flayer_inquisitor', name: '🐙 [엘리트] 일리시드 심문관', maxHp: 128, type: 'elite', expReward: 150,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="46" r="32" fill="#4834d4" stroke="#e056fd" stroke-width="4"/></svg>`,
      moves: [
        { name: '뇌 추출 (Extract Brain)', intent: 'attack', dmg: 22, desc: '피해 22' },
        { name: '사이오닉 폭풍', intent: 'attack_debuff', dmg: 16, weak: 2, vuln: 2, desc: '피해 16 + 약화 2 + 취약 2' }
      ]
    },
    githyanki_kithrak: {
      id: 'githyanki_kithrak', name: '⚔️ [엘리트] 기스양키 은검 기사장', maxHp: 135, type: 'elite', expReward: 155,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,12 85,45 70,88 30,88 15,45" fill="#b71540" stroke="#fad390" stroke-width="4"/></svg>`,
      moves: [
        { name: '아스트랄 은검 3연격', intent: 'multi_attack', dmg: 9, hits: 3, desc: '피해 9 x 3' },
        { name: '염력 갑주 전개', intent: 'defend_buff', block: 18, str: 3, desc: '방어도 18 + 힘 +3' }
      ]
    },
    ulitharid_lord: {
      id: 'ulitharid_lord', name: '🧠 [3층 중간보스] 고위 마인드 플레이어 울리사리드', maxHp: 160, type: 'elite', expReward: 190,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#30336b" stroke="#00d2d3" stroke-width="4"/></svg>`,
      moves: [
        { name: '정신 지배 파동', intent: 'attack_debuff', dmg: 19, weak: 2, vuln: 2, desc: '피해 19 + 약화 2 + 취약 2' },
        { name: '6개의 촉수 난타', intent: 'multi_attack', dmg: 9, hits: 3, desc: '피해 9 x 3' }
      ]
    },
    elder_brain_prime: {
      id: 'elder_brain_prime', name: '👑 [3층 보스] 군락의 지배자 엘더 브레인', maxHp: 245, type: 'boss', expReward: 350,
      svg: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="60" rx="48" ry="38" fill="#686de0" stroke="#ff7979" stroke-width="5"/></svg>`,
      moves: [
        { name: '초월 정신 폭발 (Psychic Blast)', intent: 'attack_debuff', dmg: 21, weak: 2, vuln: 2, desc: '피해 21 + 약화 2 + 취약 2' },
        { name: '사이오닉 절대 장벽', intent: 'defend_buff', block: 25, str: 4, desc: '방어도 25 + 힘 +4' },
        { name: '영혼 분쇄 촉수', intent: 'multi_attack', dmg: 10, hits: 3, desc: '피해 10 x 3' }
      ]
    },

    // --- ACT 4: SHADOWFELL & TOMB OF HORRORS ---
    wight_executioner: {
      id: 'wight_executioner', name: '생명력 흡수자 와이트(Wight)', maxHp: 68, type: 'normal', expReward: 80,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="#2f3640" stroke="#00cec9" stroke-width="3"/></svg>`,
      moves: [
        { name: '생명력 흡수 대검', intent: 'attack_debuff', dmg: 16, weak: 2, desc: '피해 16 + 약화 2' },
        { name: '사령 갑주', intent: 'defend_buff', block: 14, str: 3, desc: '방어도 14 + 힘 +3' }
      ]
    },
    wraith_stalker: {
      id: 'wraith_stalker', name: '심연의 망령 레이스(Wraith)', maxHp: 64, type: 'normal', expReward: 80,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,12 85,50 70,88 30,88 15,50" fill="#1e272e" stroke="#a29bfe" stroke-width="3"/></svg>`,
      moves: [
        { name: '영혼 부패 손길', intent: 'attack_debuff', dmg: 15, vuln: 2, desc: '피해 15 + 취약 2' },
        { name: '비물질화 방어', intent: 'defend_buff', block: 15, str: 2, desc: '방어도 15 + 힘 +2' }
      ]
    },
    flesh_golem: {
      id: 'flesh_golem', name: '누더기 살점 골렘', maxHp: 78, type: 'normal', expReward: 85,
      svg: `<svg viewBox="0 0 100 100"><rect x="22" y="22" width="56" height="56" fill="#6d214f" stroke="#55efc4" stroke-width="3"/></svg>`,
      moves: [
        { name: '괴력의 양손 강타', intent: 'multi_attack', dmg: 10, hits: 2, desc: '피해 10 x 2' },
        { name: '번개 흡수 재생', intent: 'defend_buff', block: 14, str: 3, desc: '방어도 14 + 힘 +3' }
      ]
    },
    vampire_spawn: {
      id: 'vampire_spawn', name: '뱀파이어 스폰 혈귀', maxHp: 72, type: 'normal', expReward: 85,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="#641e16" stroke="#ff4757" stroke-width="3"/></svg>`,
      moves: [
        { name: '흡혈 물어뜯기', intent: 'attack', dmg: 18, desc: '피해 18' },
        { name: '박쥐 안개 회피', intent: 'defend_buff', block: 14, str: 3, desc: '방어도 14 + 힘 +3' }
      ]
    },
    death_knight_general: {
      id: 'death_knight_general', name: '💀 [엘리트] 타락한 데스나이트 사령관', maxHp: 150, type: 'elite', expReward: 175,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,10 88,42 76,88 24,88 12,42" fill="#1e272e" stroke="#ff4757" stroke-width="4"/></svg>`,
      moves: [
        { name: '지옥불 구체 (Hellfire Orb)', intent: 'attack_debuff', dmg: 22, vuln: 2, desc: '피해 22 + 취약 2' },
        { name: '파멸의 마검 3연격', intent: 'multi_attack', dmg: 9, hits: 3, desc: '피해 9 x 3' }
      ]
    },
    iron_golem_sentinel: {
      id: 'iron_golem_sentinel', name: '🛡️ [엘리트] 무덤 수호자 아이언 골렘', maxHp: 162, type: 'elite', expReward: 180,
      svg: `<svg viewBox="0 0 100 100"><rect x="18" y="18" width="64" height="64" rx="10" fill="#2f3640" stroke="#00d2d3" stroke-width="4"/></svg>`,
      moves: [
        { name: '독가스 브레스', intent: 'attack_debuff', dmg: 19, weak: 2, vuln: 2, desc: '피해 19 + 약화 2 + 취약 2' },
        { name: '강철 거인의 철퇴', intent: 'attack', dmg: 25, desc: '피해 25' }
      ]
    },
    vampire_lord_strahd: {
      id: 'vampire_lord_strahd', name: '🦇 [4층 중간보스] 바로비아의 백작 스트라드', maxHp: 185, type: 'elite', expReward: 210,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#2c001e" stroke="#ff4757" stroke-width="4"/></svg>`,
      moves: [
        { name: '피의 귀족 흡혈격', intent: 'multi_attack', dmg: 10, hits: 3, desc: '피해 10 x 3' },
        { name: '레이븐로프트의 안개', intent: 'defend_buff', block: 22, str: 4, desc: '방어도 22 + 힘 +4' }
      ]
    },
    archlich_acererak: {
      id: 'archlich_acererak', name: '👑 [4층 보스] 영원한 아치리치 아세라락', maxHp: 280, type: 'boss', expReward: 400,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,8 104,38 92,98 60,112 28,98 16,38" fill="#130f40" stroke="#00ff88" stroke-width="4"/><circle cx="44" cy="52" r="8" fill="#00ff88"/><circle cx="76" cy="52" r="8" fill="#00ff88"/></svg>`,
      moves: [
        { name: '권능어: 고통 (Power Word Pain)', intent: 'attack_debuff', dmg: 23, weak: 2, vuln: 2, desc: '피해 23 + 약화 2 + 취약 2' },
        { name: '성물함의 불사 결계', intent: 'defend_buff', block: 28, str: 5, desc: '방어도 28 + 힘 +5' },
        { name: '영혼 수확의 지팡이', intent: 'multi_attack', dmg: 11, hits: 3, desc: '피해 11 x 3' }
      ]
    },

    // --- ACT 5: NINE HELLS AVERNUS & TIAMAT'S LAIR ---
    bearded_devil: {
      id: 'bearded_devil', name: '아베르누스 수염 악마', maxHp: 78, type: 'normal', expReward: 95,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#641e16" stroke="#e67e22" stroke-width="3"/></svg>`,
      moves: [
        { name: '지옥불 글레이브', intent: 'attack_debuff', dmg: 18, vuln: 2, desc: '피해 18 + 취약 2' },
        { name: '악마의 저항', intent: 'defend_buff', block: 16, str: 3, desc: '방어도 16 + 힘 +3' }
      ]
    },
    erinyes_valkyrie: {
      id: 'erinyes_valkyrie', name: '타락 천사 에리니에스', maxHp: 84, type: 'normal', expReward: 100,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,12 88,45 72,88 28,88 12,45" fill="#833471" stroke="#fdcb6e" stroke-width="3"/></svg>`,
      moves: [
        { name: '맹독 화살 3연사', intent: 'multi_attack', dmg: 8, hits: 3, desc: '피해 8 x 3' },
        { name: '지옥 갑주 패링', intent: 'defend_buff', block: 18, str: 3, desc: '방어도 18 + 힘 +3' }
      ]
    },
    red_abishai: {
      id: 'red_abishai', name: '티아마트의 적색 아비샤이', maxHp: 88, type: 'normal', expReward: 105,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,10 88,50 50,90 12,50" fill="#c0392b" stroke="#ffeaa7" stroke-width="3"/></svg>`,
      moves: [
        { name: '화염 용조 강타', intent: 'attack', dmg: 21, desc: '피해 21' },
        { name: '용의 위압감', intent: 'defend_buff', block: 16, str: 4, desc: '방어도 16 + 힘 +4' }
      ]
    },
    hellfire_engine: {
      id: 'hellfire_engine', name: '지옥불 공성 병기', maxHp: 94, type: 'normal', expReward: 110,
      svg: `<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="8" fill="#2d3436" stroke="#ff4757" stroke-width="4"/></svg>`,
      moves: [
        { name: '지옥불 화염방사기', intent: 'attack_debuff', dmg: 19, weak: 2, vuln: 2, desc: '피해 19 + 약화 2 + 취약 2' },
        { name: '지옥철 장갑', intent: 'defend_buff', block: 20, str: 3, desc: '방어도 20 + 힘 +3' }
      ]
    },
    pit_fiend_overlord: {
      id: 'pit_fiend_overlord', name: '😈 [엘리트] 나인 헬 군단장 핏 핀드', maxHp: 175, type: 'elite', expReward: 210,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#641e16" stroke="#ff0055" stroke-width="4"/></svg>`,
      moves: [
        { name: '지옥 철퇴 3연타', intent: 'multi_attack', dmg: 11, hits: 3, desc: '피해 11 x 3' },
        { name: '대악마의 공포 오라', intent: 'defend_buff', block: 24, str: 5, desc: '방어도 24 + 힘 +5' }
      ]
    },
    ancient_red_dragon: {
      id: 'ancient_red_dragon', name: '🐉 [엘리트] 에인션트 레드 드래곤 인페르노', maxHp: 190, type: 'elite', expReward: 230,
      svg: `<svg viewBox="0 0 100 100"><polygon points="50,8 90,42 75,90 25,90 10,42" fill="#900c3f" stroke="#fdcb6e" stroke-width="4"/></svg>`,
      moves: [
        { name: '고룡의 화염 브레스', intent: 'attack_debuff', dmg: 26, vuln: 2, desc: '피해 26 + 취약 2' },
        { name: '용린 각성', intent: 'defend_buff', block: 24, str: 5, desc: '방어도 24 + 힘 +5' }
      ]
    },
    zariel_archduke: {
      id: 'zariel_archduke', name: '⚔️ [5층 중간보스] 아베르누스의 대공 자리엘', maxHp: 220, type: 'elite', expReward: 260,
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#4a1c03" stroke="#ffeaa7" stroke-width="4"/></svg>`,
      moves: [
        { name: '타락 천사의 불꽃검 3연격', intent: 'multi_attack', dmg: 12, hits: 3, desc: '피해 12 x 3' },
        { name: '대공의 지옥 결계', intent: 'defend_buff', block: 26, str: 5, desc: '방어도 26 + 힘 +5' }
      ]
    },
    tiamat_dragon_queen: {
      id: 'tiamat_dragon_queen', name: '👑 [5층 보스] 오색룡의 여신 티아마트 (CR 30)', maxHp: 350, type: 'boss', expReward: 1000,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,6 110,36 95,102 60,115 25,102 10,36" fill="#2c001e" stroke="#fdcb6e" stroke-width="5"/><circle cx="32" cy="42" r="7" fill="#ff3838"/><circle cx="46" cy="32" r="7" fill="#00d2d3"/><circle cx="60" cy="26" r="8" fill="#2ecc71"/><circle cx="74" cy="32" r="7" fill="#dfe6e9"/><circle cx="88" cy="42" r="7" fill="#111"/></svg>`,
      moves: [
        { name: '5대 브레스: 화염·냉기·산성·번개·맹독', intent: 'attack_debuff', dmg: 26, weak: 2, vuln: 2, desc: '피해 26 + 약화 2 + 취약 2' },
        { name: '신성한 오색 비늘 재생', intent: 'defend_buff', block: 32, str: 6, desc: '방어도 32 + 힘 +6' },
        { name: '5개 용머리의 동시 물어뜯기', intent: 'multi_attack', dmg: 10, hits: 4, desc: '피해 10 x 4' },
        { name: '창세의 종말 브레스', intent: 'attack', dmg: 38, desc: '피해 38' }
      ]
    },

    // ========================================================================
    // ADDITIONAL 15 BOSSES (3 More Unique Bosses per Act -> 4 Bosses per Floor!)
    // ========================================================================

    // --- ACT 1 ADDITIONAL BOSSES ---
    young_green_dragon: {
      id: 'young_green_dragon', name: '🐉 [1층 보스] 영 그린 드래곤 베놈팽', maxHp: 180, type: 'boss', expReward: 250,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,10 105,40 90,100 60,112 30,100 15,40" fill="#0b3b24" stroke="#00ff88" stroke-width="4"/><circle cx="44" cy="50" r="8" fill="#ffeaa7"/><circle cx="76" cy="50" r="8" fill="#ffeaa7"/><path d="M40 78 Q60 92 80 78" stroke="#00ff88" stroke-width="4" fill="none"/></svg>`,
      moves: [
        { name: '맹독 가스 브레스 (Poison Breath)', intent: 'attack_debuff', dmg: 15, weak: 2, vuln: 2, desc: '피해 15 + 약화 2 + 취약 2' },
        { name: '교활한 비행 & 비늘 경화', intent: 'defend_buff', block: 18, str: 3, desc: '방어도 18 + 힘 +3' },
        { name: '물기 & 양발톱 3연타', intent: 'multi_attack', dmg: 7, hits: 3, desc: '피해 7 x 3' },
        { name: '꼬리 후려치기', intent: 'attack', dmg: 22, desc: '피해 22' }
      ]
    },
    ettin_king_gror: {
      id: 'ettin_king_gror', name: '🪓 [1층 보스] 쌍두 거인 왕 에틴 그로르', maxHp: 192, type: 'boss', expReward: 250,
      svg: `<svg viewBox="0 0 120 120"><rect x="20" y="25" width="80" height="75" rx="18" fill="#5c3c10" stroke="#e67e22" stroke-width="4"/><circle cx="42" cy="48" r="14" fill="#d35400"/><circle cx="78" cy="48" r="14" fill="#d35400"/><circle cx="38" cy="46" r="4" fill="#ff0"/><circle cx="82" cy="46" r="4" fill="#ff0"/></svg>`,
      moves: [
        { name: '양손 배틀액스 & 모닝스타 쌍타', intent: 'multi_attack', dmg: 10, hits: 2, desc: '피해 10 x 2' },
        { name: '두 머리의 각성 포효', intent: 'defend_buff', block: 16, str: 4, desc: '방어도 16 + 힘 +4' },
        { name: '대지 분쇄 내려찍기', intent: 'attack_debuff', dmg: 19, vuln: 2, desc: '피해 19 + 취약 2' }
      ]
    },
    goblin_shaman_king: {
      id: 'goblin_shaman_king', name: '👺 [1층 보스] 홉고블린 대장군 마그도르', maxHp: 170, type: 'boss', expReward: 250,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,12 100,38 88,98 32,98 20,38" fill="#641e16" stroke="#ff4757" stroke-width="4"/><rect x="38" y="46" width="44" height="10" fill="#fdcb6e"/></svg>`,
      moves: [
        { name: '군단 전술: 철벽 방진', intent: 'defend_buff', block: 20, str: 3, desc: '방어도 20 + 힘 +3' },
        { name: '마글루비예트의 피의 창', intent: 'attack_debuff', dmg: 17, weak: 2, vuln: 2, desc: '피해 17 + 약화 2 + 취약 2' },
        { name: '대장군의 롱소드 3연격', intent: 'multi_attack', dmg: 7, hits: 3, desc: '피해 7 x 3' }
      ]
    },

    // --- ACT 2 ADDITIONAL BOSSES ---
    aboleth_leviathan: {
      id: 'aboleth_leviathan', name: '🦑 [2층 보스] 태고의 심해 괴수 아볼레스', maxHp: 215, type: 'boss', expReward: 300,
      svg: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="60" rx="46" ry="34" fill="#0c2461" stroke="#00d2d3" stroke-width="4"/><circle cx="60" cy="45" r="7" fill="#ff3838"/><circle cx="60" cy="60" r="7" fill="#ff3838"/><circle cx="60" cy="75" r="7" fill="#ff3838"/></svg>`,
      moves: [
        { name: '정신 노예화 & 점액 질병', intent: 'attack_debuff', dmg: 18, weak: 2, vuln: 2, desc: '피해 18 + 약화 2 + 취약 2' },
        { name: '촉수 3연속 후려치기', intent: 'multi_attack', dmg: 9, hits: 3, desc: '피해 9 x 3' },
        { name: '심연의 점액 장막', intent: 'defend_buff', block: 22, str: 4, desc: '방어도 22 + 힘 +4' }
      ]
    },
    purple_worm_titan: {
      id: 'purple_worm_titan', name: '🪱 [2층 보스] 언더다크 대지포식자 퍼플 웜', maxHp: 235, type: 'boss', expReward: 300,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="#5f27cd" stroke="#e056fd" stroke-width="5"/><circle cx="60" cy="60" r="22" fill="#222" stroke="#fff" stroke-width="4" stroke-dasharray="6,4"/></svg>`,
      moves: [
        { name: '통째로 집어삼키기 (Bite & Swallow)', intent: 'attack', dmg: 26, desc: '피해 26' },
        { name: '꼬리 독침 찌르기', intent: 'attack_debuff', dmg: 19, vuln: 3, desc: '피해 19 + 취약 3' },
        { name: '암반 갑피 재생', intent: 'defend_buff', block: 22, str: 4, desc: '방어도 22 + 힘 +4' }
      ]
    },
    duergar_despot: {
      id: 'duergar_despot', name: '🔨 [2층 보스] 듀에르가 기계폭군 스틸비어드', maxHp: 205, type: 'boss', expReward: 300,
      svg: `<svg viewBox="0 0 120 120"><rect x="22" y="22" width="76" height="76" rx="12" fill="#2f3640" stroke="#ff7675" stroke-width="4"/><circle cx="45" cy="52" r="7" fill="#ff3838"/><circle cx="75" cy="52" r="7" fill="#ff3838"/></svg>`,
      moves: [
        { name: '사이오닉 초거대화 & 중장갑', intent: 'defend_buff', block: 24, str: 4, desc: '방어도 24 + 힘 +4' },
        { name: '화염 방사 & 철권 연타', intent: 'multi_attack', dmg: 9, hits: 3, desc: '피해 9 x 3' },
        { name: '공성 망치 대지 분쇄', intent: 'attack_debuff', dmg: 21, weak: 2, desc: '피해 21 + 약화 2' }
      ]
    },

    // --- ACT 3 ADDITIONAL BOSSES ---
    beholder_hive_mother: {
      id: 'beholder_hive_mother', name: '👁️‍🗨️ [3층 보스] 비홀더 군체 어미 하이브 마더', maxHp: 250, type: 'boss', expReward: 350,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="62" r="42" fill="#2c003e" stroke="#ff0055" stroke-width="5"/><circle cx="60" cy="58" r="18" fill="#00ff88"/><circle cx="60" cy="58" r="8" fill="#111"/></svg>`,
      moves: [
        { name: '궁극 분해 광선 & 지배 광선', intent: 'attack_debuff', dmg: 22, weak: 2, vuln: 2, desc: '피해 22 + 약화 2 + 취약 2' },
        { name: '군체 눈알 일제 사격', intent: 'multi_attack', dmg: 10, hits: 3, desc: '피해 10 x 3' },
        { name: '절대 반마법 역장', intent: 'defend_buff', block: 25, str: 4, desc: '방어도 25 + 힘 +4' }
      ]
    },
    githyanki_supreme: {
      id: 'githyanki_supreme', name: '⚔️ [3층 보스] 기스양키 최고 사령관 크스락', maxHp: 240, type: 'boss', expReward: 350,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,10 102,42 88,100 32,100 18,42" fill="#b71540" stroke="#ffeaa7" stroke-width="4"/><circle cx="46" cy="52" r="6" fill="#ffeaa7"/><circle cx="74" cy="52" r="6" fill="#ffeaa7"/></svg>`,
      moves: [
        { name: '전설의 아스트랄 은검 4연격', intent: 'multi_attack', dmg: 8, hits: 4, desc: '피해 8 x 4' },
        { name: '블라키스의 염력 장벽', intent: 'defend_buff', block: 24, str: 5, desc: '방어도 24 + 힘 +5' },
        { name: '차원 절단 일격', intent: 'attack_debuff', dmg: 24, vuln: 2, desc: '피해 24 + 취약 2' }
      ]
    },
    neothelid_leviathan: {
      id: 'neothelid_leviathan', name: '🐙 [3층 보스] 심연의 촉수 거수 네오텔리드', maxHp: 260, type: 'boss', expReward: 350,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="#4a154b" stroke="#00cec9" stroke-width="5"/><path d="M35 35 L85 85 M85 35 L35 85" stroke="#e056fd" stroke-width="5"/></svg>`,
      moves: [
        { name: '뇌 용해 산성 브레스', intent: 'attack_debuff', dmg: 21, weak: 3, vuln: 2, desc: '피해 21 + 약화 3 + 취약 2' },
        { name: '거대 촉수 3연속 압살', intent: 'multi_attack', dmg: 10, hits: 3, desc: '피해 10 x 3' },
        { name: '외계 재생 갑피', intent: 'defend_buff', block: 24, str: 4, desc: '방어도 24 + 힘 +4' }
      ]
    },

    // --- ACT 4 ADDITIONAL BOSSES ---
    dracolich_aurinax: {
      id: 'dracolich_aurinax', name: '🦴 [4층 보스] 고대 드라코리치 에본데스', maxHp: 290, type: 'boss', expReward: 400,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,8 106,38 92,100 60,112 28,100 14,38" fill="#1e272e" stroke="#00cec9" stroke-width="4"/><circle cx="44" cy="50" r="8" fill="#00cec9"/><circle cx="76" cy="50" r="8" fill="#00cec9"/></svg>`,
      moves: [
        { name: '죽음의 괴사 브레스', intent: 'attack_debuff', dmg: 24, weak: 2, vuln: 2, desc: '피해 24 + 약화 2 + 취약 2' },
        { name: '불사의 용골 재생', intent: 'defend_buff', block: 28, str: 5, desc: '방어도 28 + 힘 +5' },
        { name: '뼈 발톱 & 꼬리 3연격', intent: 'multi_attack', dmg: 11, hits: 3, desc: '피해 11 x 3' }
      ]
    },
    death_tyrant_beholder: {
      id: 'death_tyrant_beholder', name: '☠️ [4층 보스] 언데드 비홀더 데스 타이런트', maxHp: 275, type: 'boss', expReward: 400,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="42" fill="#111" stroke="#ff4757" stroke-width="4"/><circle cx="60" cy="58" r="16" fill="#ff4757"/></svg>`,
      moves: [
        { name: '부정의 적색 눈길 & 죽음의 광선', intent: 'attack_debuff', dmg: 23, weak: 2, vuln: 3, desc: '피해 23 + 약화 2 + 취약 3' },
        { name: '해골 눈알 광선 3연사', intent: 'multi_attack', dmg: 11, hits: 3, desc: '피해 11 x 3' },
        { name: '사령의 보호막', intent: 'defend_buff', block: 26, str: 5, desc: '방어도 26 + 힘 +5' }
      ]
    },
    lord_soth_deathknight: {
      id: 'lord_soth_deathknight', name: '🖤 [4층 보스] 흑장미의 데스나이트 군주 소쓰', maxHp: 285, type: 'boss', expReward: 400,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,8 102,40 90,100 30,100 18,40" fill="#1e272e" stroke="#ff3838" stroke-width="4"/><circle cx="46" cy="52" r="7" fill="#ff3838"/><circle cx="74" cy="52" r="7" fill="#ff3838"/></svg>`,
      moves: [
        { name: '심연의 지옥불 구체 (Hellfire Orb)', intent: 'attack_debuff', dmg: 25, vuln: 2, desc: '피해 25 + 취약 2' },
        { name: '불경한 성검 3연격', intent: 'multi_attack', dmg: 11, hits: 3, desc: '피해 11 x 3' },
        { name: '죽음의 군주 갑주', intent: 'defend_buff', block: 28, str: 5, desc: '방어도 28 + 힘 +5' }
      ]
    },

    // --- ACT 5 ADDITIONAL FINAL BOSSES ---
    asmodeus_lord_of_ninth: {
      id: 'asmodeus_lord_of_ninth', name: '😈 [5층 보스] 나인 헬의 절대신 아스모데우스 (CR 30)', maxHp: 360, type: 'boss', expReward: 1000,
      svg: `<svg viewBox="0 0 120 120"><polygon points="60,6 108,38 94,102 60,115 26,102 12,38" fill="#3b0000" stroke="#ff3838" stroke-width="5"/><polygon points="22,8 48,34 32,40" fill="#fdcb6e"/><polygon points="98,8 72,34 88,40" fill="#fdcb6e"/><circle cx="45" cy="54" r="8" fill="#ff0055"/><circle cx="75" cy="54" r="8" fill="#ff0055"/></svg>`,
      moves: [
        { name: '네수스의 루비 지팡이 심판', intent: 'attack_debuff', dmg: 27, weak: 2, vuln: 2, desc: '피해 27 + 약화 2 + 취약 2' },
        { name: '지옥 제9계층의 절대 군주 권능', intent: 'defend_buff', block: 34, str: 6, desc: '방어도 34 + 힘 +6' },
        { name: '지옥불 유성우 4연타', intent: 'multi_attack', dmg: 10, hits: 4, desc: '피해 10 x 4' },
        { name: '영혼 말살의 계약', intent: 'attack', dmg: 36, desc: '피해 36' }
      ]
    },
    demogorgon_prince: {
      id: 'demogorgon_prince', name: '👹 [5층 보스] 심연의 데몬 프린스 데모고르곤', maxHp: 355, type: 'boss', expReward: 1000,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="46" fill="#2c003e" stroke="#00ff88" stroke-width="5"/><circle cx="42" cy="48" r="14" fill="#641e16" stroke="#ff3838" stroke-width="3"/><circle cx="78" cy="48" r="14" fill="#641e16" stroke="#ff3838" stroke-width="3"/></svg>`,
      moves: [
        { name: '광기와 최면의 이중 시선', intent: 'attack_debuff', dmg: 25, weak: 3, vuln: 3, desc: '피해 25 + 약화 3 + 취약 3' },
        { name: '부패의 거대 촉수 4연타', intent: 'multi_attack', dmg: 10, hits: 4, desc: '피해 10 x 4' },
        { name: '어비스의 군주 포효', intent: 'defend_buff', block: 30, str: 6, desc: '방어도 30 + 힘 +6' }
      ]
    },
    halaster_mad_mage: {
      id: 'halaster_mad_mage', name: '🧙‍♂️ [5층 보스] 언더마운틴의 주인 매드 메이지 할라스터', maxHp: 340, type: 'boss', expReward: 1000,
      svg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="46" fill="#0c2461" stroke="#00d2d3" stroke-width="5"/><polygon points="60,8 90,46 30,46" fill="#192a56" stroke="#ffeaa7" stroke-width="3"/><circle cx="48" cy="62" r="7" fill="#00ff88"/><circle cx="72" cy="62" r="7" fill="#e056fd"/></svg>`,
      moves: [
        { name: '9레벨 주문: 메테오 스웜 & 정신 파열', intent: 'attack_debuff', dmg: 26, weak: 2, vuln: 2, desc: '피해 26 + 약화 2 + 취약 2' },
        { name: '시간 정지 & 무적의 구체 결계', intent: 'defend_buff', block: 34, str: 6, desc: '방어도 34 + 힘 +6' },
        { name: '비전 빅비의 손 & 연쇄 번개 4연타', intent: 'multi_attack', dmg: 10, hits: 4, desc: '피해 10 x 4' },
        { name: '9레벨 주문: 소원(Wish) 말살 광선', intent: 'attack', dmg: 38, desc: '피해 38' }
      ]
    }
  },

  // ==========================================================================
  // D&D 5E D20 DICE ROLL EVENTS
  // ==========================================================================
  events: [
    {
      id: 'mystra_shrine',
      title: '🎲 [D20 비전 판정] 미스트라와 오그마의 고대 제단',
      desc: '언더마운틴의 비밀 방에서 마법 여신 미스트라의 성소를 발견했습니다. D20 주사위를 굴리거나 원하는 축복을 선택하세요!',
      choices: [
        { label: '🎲 [D20 비전(Arcana) 판정: DC 10] 성공 시 카드 2장 강화(+)+룬 각인 & 경험치 +120 EXP!', effect: 'd20_arcana' },
        { label: '🙏 [여신의 치유 기도] 체력을 전부 회복하고 최대 체력 +12 증가', effect: 'full_heal_maxhp' },
        { label: '🗝️ [제단 보물함 해체] 골드 +120G 및 희귀 마법 물품(유물) 1개 획득 (함정 체력 -8)', effect: 'scrap_and_relic' }
      ]
    },
    {
      id: 'deck_of_many_things',
      title: '🃏 [D20 운명 판정] 매드 메이지 할라스터와 만물의 카드 덱',
      desc: '"크하하하! 내 지하미궁에 온 걸 환영한다 모험가여! 만물의 카드(Deck of Many Things)에서 한 장 뽑아보겠느냐?"',
      choices: [
        { label: '🎲 [태양(Sun) 카드 뽑기] 즉시 레벨업(EXP +150) & 스탯 포인트(SP) +2 및 차원 마석 +250개 획득!', effect: 'gain_exp_sp_gems' },
        { label: '⚔️ [기사(Knight) 카드 뽑기] 기본 카드 1장을 제거하고 클래스 희귀(Rare) 카드를 1장 획득', effect: 'remove_and_rare' },
        { label: '👑 [왕좌(Throne) 카드 뽑기] 영구 마법 유물 1개 무료 획득 및 체력 +20 회복', effect: 'free_relic' }
      ]
    }
  ]
};
