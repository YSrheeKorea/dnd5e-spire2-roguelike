// ============================================================================
// D&D 5E SPIRE II: TALES OF THE YAWNING PORTAL & UNDERMOUNTAIN
// - 8 Distinct Class Mechanics (Strict Name-to-Element Alignment!)
// - 352 Class Cards + Combat Token Cards (Shiv, Smite Wave)
// - Balanced to Authentic Slay the Spire 2 Difficulty
// ============================================================================

window.GAME_DATA = {
  "ranks": [
    "C",
    "B",
    "A",
    "S"
  ],
  "rankNames": {
    "C": "C급 (Tier 1: 로컬 히어로)",
    "B": "B급 (Tier 2: 왕국의 영웅)",
    "A": "A급 (Tier 3: 차원의 수호자)",
    "S": "S급 (Tier 4: 전설의 반신)"
  },
  "rankBonuses": {
    "C": {
      "hp": 0,
      "str": 0,
      "dex": 0,
      "resourceStart": 0,
      "unlockTier": "일반 + 고급 카드 풀",
      "desc": "기본 모험가 (일반·고급 카드 풀 해금)"
    },
    "B": {
      "hp": 6,
      "str": 1,
      "dex": 0,
      "resourceStart": 1,
      "unlockTier": "희귀(Rare) 카드 풀 해금 + B급 고유 유물",
      "desc": "체력 +6, 힘 +1, [희귀(Rare) 카드 풀] 영구 해금 + [B급 클래스 고유 유물] 장착 시작!"
    },
    "A": {
      "hp": 14,
      "str": 1,
      "dex": 1,
      "resourceStart": 1,
      "unlockTier": "전설(Legendary) 카드 풀 해금 + 각성 카드 시작 덱",
      "desc": "체력 +14, 힘/민첩 +1, [전설(Legendary) 카드 풀] 영구 해금 + 클래스 각성 카드 시작 덱 포함!"
    },
    "S": {
      "hp": 24,
      "str": 2,
      "dex": 2,
      "resourceStart": 2,
      "unlockTier": "S급 고유 신화 유물 + 각성 카드(+) 강화 시작",
      "desc": "체력 +24, 힘/민첩 +2, [S급 클래스 신화 유물] 추가 장착 + 각성 카드(+) 강화 시작!"
    }
  },
  "acts": [
    {
      "act": 1,
      "name": "제1계층: 언더마운틴 입구 & 고블린 성채",
      "subtitle": "워터딥 하품하는 포털 주점 지하의 첫 번째 미궁 (Stage 1 ~ 15)",
      "themeColor": "#27ae60",
      "normalPool": [
        "goblin_skirmisher",
        "kobold_inventor",
        "skeleton_warrior",
        "orc_berserker",
        "gelatinous_cube",
        "gnoll_pack_lord",
        "rust_monster",
        "carrion_crawler"
      ],
      "elitePool": [
        "owlbear_alpha",
        "bugbear_chieftain",
        "mimic_hunter"
      ],
      "midBossPool": [
        "troll_warlord",
        "manticore_ravager",
        "bugbear_chieftain"
      ],
      "bossPool": [
        "beholder_xanathar",
        "young_green_dragon",
        "ettin_king_gror",
        "goblin_shaman_king"
      ]
    },
    {
      "act": 2,
      "name": "제2계층: 언더다크 & 롤스의 거미 신전",
      "subtitle": "빛이 닿지 않는 지하 세계와 드로우 엘프들의 본거지 (Stage 1 ~ 15)",
      "themeColor": "#8e44ad",
      "normalPool": [
        "drow_assassin",
        "hook_horror",
        "giant_phase_spider",
        "duergar_hammerer",
        "displacer_beast",
        "basilisk_gazer",
        "ochre_jelly",
        "myconid_sovereign"
      ],
      "elitePool": [
        "drider_champion",
        "umbeR_hulk",
        "roper_ambusher"
      ],
      "midBossPool": [
        "drow_priestess",
        "cloaker_shadow",
        "roper_ambusher"
      ],
      "bossPool": [
        "arachne_matron",
        "aboleth_leviathan",
        "purple_worm_titan",
        "duergar_despot"
      ]
    },
    {
      "act": 3,
      "name": "제3계층: 일리시드(마인드 플레이어) 생체 군락",
      "subtitle": "정신을 지배하는 촉수 괴물들과 기스양키 사냥꾼들의 격전지 (Stage 1 ~ 15)",
      "themeColor": "#2980b9",
      "normalPool": [
        "intellect_devourer",
        "mind_flayer_arcanist",
        "grimlock_brute",
        "nothics_eye",
        "chuul_pincer",
        "grell_strangler",
        "otyugh_filth",
        "slaad_death"
      ],
      "elitePool": [
        "mind_flayer_inquisitor",
        "githyanki_kithrak",
        "beholder_zombie_elite"
      ],
      "midBossPool": [
        "ulitharid_lord",
        "mindwitness_overseer",
        "githyanki_kithrak"
      ],
      "bossPool": [
        "elder_brain_prime",
        "beholder_hive_mother",
        "githyanki_supreme",
        "neothelid_leviathan"
      ]
    },
    {
      "act": 4,
      "name": "제4계층: 섀도우펠 & 아세라락의 공포의 무덤",
      "subtitle": "죽음의 안개가 드리운 불사의 요새와 영혼 포식자 (Stage 1 ~ 15)",
      "themeColor": "#c0392b",
      "normalPool": [
        "wight_executioner",
        "wraith_stalker",
        "flesh_golem",
        "vampire_spawn",
        "banshee_wailer",
        "bone_naga",
        "mummy_guardian",
        "shadow_demon"
      ],
      "elitePool": [
        "death_knight_general",
        "iron_golem_sentinel",
        "skull_lord_elite"
      ],
      "midBossPool": [
        "vampire_lord_strahd",
        "nightwalker_titan",
        "skull_lord_elite"
      ],
      "bossPool": [
        "archlich_acererak",
        "dracolich_aurinax",
        "death_tyrant_beholder",
        "lord_soth_deathknight"
      ]
    },
    {
      "act": 5,
      "name": "제5계층: 나인 헬 아베르누스 & 티아마트의 신전",
      "subtitle": "타락한 천사와 고룡들이 지배하는 지옥의 심연 (Stage 1 ~ 15)",
      "themeColor": "#e67e22",
      "normalPool": [
        "bearded_devil",
        "erinyes_valkyrie",
        "red_abishai",
        "hellfire_engine",
        "chain_devil_kyton",
        "horned_devil_malebranche"
      ],
      "elitePool": [
        "pit_fiend_overlord",
        "ancient_red_dragon",
        "balor_abyssal_lord"
      ],
      "midBossPool": [
        "zariel_archduke",
        "balor_abyssal_lord",
        "ancient_red_dragon"
      ],
      "bossPool": [
        "tiamat_dragon_queen",
        "asmodeus_lord_of_ninth",
        "demogorgon_prince",
        "halaster_mad_mage"
      ]
    }
  ],
  "characters": {
    "fighter": {
      "id": "fighter",
      "name": "파이터 (Fighter)",
      "heroName": "가렌 스틸하트 (Garen Steelheart)",
      "title": "워터딥의 백전노장 검투사",
      "baseRank": "C",
      "primaryAbility": "STR / CON (근력 & 건강)",
      "color": "#e67e22",
      "accent": "#fab1a0",
      "maxHp": 86,
      "startEnergy": 3,
      "secondaryResourceName": "연격 콤보 & 우위 주사위",
      "secondaryResourceIcon": "⚔️",
      "secondaryResourceDesc": "【고유 시스템: 연격 콤보 & 파쇄/반격】 한 턴에 카드를 사용할 때마다 연격 콤보가 쌓여 공격 피해가 +(콤보×8%, 최대 5콤보) 증가하며, 4콤보 달성 시 턴당 1회 행동력(AP)+1을 얻습니다. 강타 계열은 [💥파쇄], 방패/응수 계열은 [🛡️반격]을 부여합니다.",
      "passiveName": "전장의 지배자 (연격 콤보 & 패링 반격)",
      "passiveDesc": "매 턴 4콤보 달성 시 AP+1 & 1드로우(턴당 1회) · 연격당 피해 +8%! 공격이 [💥파쇄]를 부여하고 방어가 [🛡️반격]을 쌓습니다.",
      "awakeningCard": "ftr_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#4a2311\" stroke=\"#e67e22\" stroke-width=\"4\"/>\n        <path d=\"M32 95 L28 48 L45 25 L60 32 L75 25 L92 48 L88 95 Z\" fill=\"#636e72\" stroke=\"#dfe6e9\" stroke-width=\"3\"/>\n        <rect x=\"42\" y=\"52\" width=\"36\" height=\"8\" fill=\"#fdcb6e\"/>\n        <line x1=\"60\" y1=\"25\" x2=\"60\" y2=\"85\" stroke=\"#2d3436\" stroke-width=\"4\"/>\n      </svg>",
      "startRelic": "fighters_badge",
      "starterDeck": [
        "ftr_sh_1",
        "ftr_sh_1",
        "ftr_sh_1",
        "ftr_sh_1",
        "ftr_sh_2",
        "ftr_sh_2",
        "ftr_sh_2",
        "ftr_sh_2",
        "ftr_sh_3"
      ],
      "cardPool": [
        "ftr_sh_1",
        "ftr_sh_2",
        "ftr_sh_3",
        "ftr_sh_4",
        "fighter_champion_1",
        "fighter_champion_2",
        "fighter_champion_3",
        "fighter_champion_4",
        "fighter_champion_5",
        "fighter_champion_6",
        "fighter_champion_7",
        "fighter_champion_8",
        "fighter_champion_9",
        "fighter_champion_10",
        "fighter_battlemaster_1",
        "fighter_battlemaster_2",
        "fighter_battlemaster_3",
        "fighter_battlemaster_4",
        "fighter_battlemaster_5",
        "fighter_battlemaster_6",
        "fighter_battlemaster_7",
        "fighter_battlemaster_8",
        "fighter_battlemaster_9",
        "fighter_battlemaster_10",
        "fighter_eldritch_knight_1",
        "fighter_eldritch_knight_2",
        "fighter_eldritch_knight_3",
        "fighter_eldritch_knight_4",
        "fighter_eldritch_knight_5",
        "fighter_eldritch_knight_6",
        "fighter_eldritch_knight_7",
        "fighter_eldritch_knight_8",
        "fighter_eldritch_knight_9",
        "fighter_eldritch_knight_10",
        "fighter_echo_knight_1",
        "fighter_echo_knight_2",
        "fighter_echo_knight_3",
        "fighter_echo_knight_4",
        "fighter_echo_knight_5",
        "fighter_echo_knight_6",
        "fighter_echo_knight_7",
        "fighter_echo_knight_8",
        "fighter_echo_knight_9",
        "fighter_echo_knight_10"
      ],
      "subclasses": [
        {
          "id": "champion",
          "name": "챔피언 (Champion)",
          "icon": "🏆",
          "desc": "순수 무력의 극치! 전투 시작 시 영구적으로 힘 +3 및 최대 체력 +12 증가, 모든 공격 적중 시 체력 1 회복.",
          "bonusCard": "fighter_champion_1",
          "cards": [
            "fighter_champion_1",
            "fighter_champion_2",
            "fighter_champion_3",
            "fighter_champion_4",
            "fighter_champion_5",
            "fighter_champion_6",
            "fighter_champion_7",
            "fighter_champion_8",
            "fighter_champion_9",
            "fighter_champion_10"
          ],
          "legendaryCard": "fighter_champion_10"
        },
        {
          "id": "battlemaster",
          "name": "배틀마스터 (Battle Master)",
          "icon": "🎲",
          "desc": "전술의 대가! 전투 시작 시 우위 주사위 +4, 매 턴 첫 공격 카드가 적에게 취약 1과 약화 1을 동시에 부여합니다.",
          "bonusCard": "fighter_battlemaster_1",
          "cards": [
            "fighter_battlemaster_1",
            "fighter_battlemaster_2",
            "fighter_battlemaster_3",
            "fighter_battlemaster_4",
            "fighter_battlemaster_5",
            "fighter_battlemaster_6",
            "fighter_battlemaster_7",
            "fighter_battlemaster_8",
            "fighter_battlemaster_9",
            "fighter_battlemaster_10"
          ],
          "legendaryCard": "fighter_battlemaster_10"
        },
        {
          "id": "eldritch_knight",
          "name": "엘드리치 나이트 (Eldritch Knight)",
          "icon": "🛡️",
          "desc": "마검사! 전투 시작 시 [비전 검기 오브] 1기를 소환하고 매 턴 종료 시 방어도 +4 및 적에게 마력 피해를 줍니다.",
          "bonusCard": "fighter_eldritch_knight_1",
          "cards": [
            "fighter_eldritch_knight_1",
            "fighter_eldritch_knight_2",
            "fighter_eldritch_knight_3",
            "fighter_eldritch_knight_4",
            "fighter_eldritch_knight_5",
            "fighter_eldritch_knight_6",
            "fighter_eldritch_knight_7",
            "fighter_eldritch_knight_8",
            "fighter_eldritch_knight_9",
            "fighter_eldritch_knight_10"
          ],
          "legendaryCard": "fighter_eldritch_knight_10"
        },
        {
          "id": "echo_knight",
          "name": "에코 나이트 (Echo Knight - 슬더스2 소환)",
          "icon": "👤",
          "desc": "던전맨시 시간선에서 [그림자 잔상(Echo)]을 전방에 소환합니다! 잔상이 피해를 대신 맞고 매 턴 협동 베기를 가합니다.",
          "bonusCard": "fighter_echo_knight_1",
          "cards": [
            "fighter_echo_knight_1",
            "fighter_echo_knight_2",
            "fighter_echo_knight_3",
            "fighter_echo_knight_4",
            "fighter_echo_knight_5",
            "fighter_echo_knight_6",
            "fighter_echo_knight_7",
            "fighter_echo_knight_8",
            "fighter_echo_knight_9",
            "fighter_echo_knight_10"
          ],
          "legendaryCard": "fighter_echo_knight_10"
        }
      ],
      "sharedCards": [
        "ftr_sh_1",
        "ftr_sh_2",
        "ftr_sh_3",
        "ftr_sh_4"
      ],
      "rankRelics": {
        "B": "ftr_rank_b",
        "S": "ftr_rank_s"
      },
      "uniqueStatusName": "💥 파쇄 (Sunder) & 🛡️ 반격 (Parry)"
    },
    "barbarian": {
      "id": "barbarian",
      "name": "바바리안 (Barbarian)",
      "heroName": "크로그 아이언터스크 (Krog Irontusk)",
      "title": "스파인 산맥의 반오크 파괴자",
      "baseRank": "B",
      "primaryAbility": "STR / CON (근력 & 야성)",
      "color": "#e74c3c",
      "accent": "#ff7675",
      "maxHp": 96,
      "startEnergy": 3,
      "secondaryResourceName": "격노 & 혈투 (Bloodlust)",
      "secondaryResourceIcon": "💢",
      "secondaryResourceDesc": "【고유 시스템: 혈투 광폭화 & 과다출혈】 잃은 체력 10%마다 공격 피해가 +6%씩 증폭되며, 체력 50% 이하 [🩸혈전] 상태에서는 공격 시 체력+1 흡혈! 도끼/혈기 공격이 [🩸출혈]을 쌓고 출혈 적 타격 시 추가 출혈 피해가 터집니다.",
      "passiveName": "피의 광전사 (잃은 체력 비례 공격력 증폭)",
      "passiveDesc": "잃은 체력 10%당 공격력 +4%(혈전 50%↓ 흡혈·방어 강화)! 공격이 [🩸출혈]을 부여하고 출혈 적 타격 시 추가 폭발 피해를 줍니다.",
      "awakeningCard": "bar_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#5c1212\" stroke=\"#ff4757\" stroke-width=\"4\"/>\n        <path d=\"M28 92 L32 42 L60 26 L88 42 L92 92 Z\" fill=\"#833471\" stroke=\"#ff7675\" stroke-width=\"3\"/>\n        <polygon points=\"38,52 54,58 38,62\" fill=\"#ff3838\"/>\n        <polygon points=\"82,52 66,58 82,62\" fill=\"#ff3838\"/>\n        <polygon points=\"42,78 47,66 52,78\" fill=\"#fff\"/>\n        <polygon points=\"68,78 73,66 78,78\" fill=\"#fff\"/>\n      </svg>",
      "startRelic": "totem_necklace",
      "starterDeck": [
        "bar_sh_1",
        "bar_sh_1",
        "bar_sh_1",
        "bar_sh_1",
        "bar_sh_2",
        "bar_sh_2",
        "bar_sh_2",
        "bar_sh_2",
        "bar_sh_3"
      ],
      "cardPool": [
        "bar_sh_1",
        "bar_sh_2",
        "bar_sh_3",
        "bar_sh_4",
        "barbarian_berserker_1",
        "barbarian_berserker_2",
        "barbarian_berserker_3",
        "barbarian_berserker_4",
        "barbarian_berserker_5",
        "barbarian_berserker_6",
        "barbarian_berserker_7",
        "barbarian_berserker_8",
        "barbarian_berserker_9",
        "barbarian_berserker_10",
        "barbarian_totem_warrior_1",
        "barbarian_totem_warrior_2",
        "barbarian_totem_warrior_3",
        "barbarian_totem_warrior_4",
        "barbarian_totem_warrior_5",
        "barbarian_totem_warrior_6",
        "barbarian_totem_warrior_7",
        "barbarian_totem_warrior_8",
        "barbarian_totem_warrior_9",
        "barbarian_totem_warrior_10",
        "barbarian_ancestral_guardian_1",
        "barbarian_ancestral_guardian_2",
        "barbarian_ancestral_guardian_3",
        "barbarian_ancestral_guardian_4",
        "barbarian_ancestral_guardian_5",
        "barbarian_ancestral_guardian_6",
        "barbarian_ancestral_guardian_7",
        "barbarian_ancestral_guardian_8",
        "barbarian_ancestral_guardian_9",
        "barbarian_ancestral_guardian_10",
        "barbarian_wild_magic_1",
        "barbarian_wild_magic_2",
        "barbarian_wild_magic_3",
        "barbarian_wild_magic_4",
        "barbarian_wild_magic_5",
        "barbarian_wild_magic_6",
        "barbarian_wild_magic_7",
        "barbarian_wild_magic_8",
        "barbarian_wild_magic_9",
        "barbarian_wild_magic_10"
      ],
      "subclasses": [
        {
          "id": "berserker",
          "name": "광전사의 길 (Path of the Berserker)",
          "icon": "🪓",
          "desc": "광란(Frenzy)! 전투 시작 시 힘 +3 및 [수라/광기 태세(공격력 2배)] 카드를 보유하고 매 턴 격노를 +2 추가로 얻습니다.",
          "bonusCard": "barbarian_berserker_1",
          "cards": [
            "barbarian_berserker_1",
            "barbarian_berserker_2",
            "barbarian_berserker_3",
            "barbarian_berserker_4",
            "barbarian_berserker_5",
            "barbarian_berserker_6",
            "barbarian_berserker_7",
            "barbarian_berserker_8",
            "barbarian_berserker_9",
            "barbarian_berserker_10"
          ],
          "legendaryCard": "barbarian_berserker_10"
        },
        {
          "id": "totem_warrior",
          "name": "토템 전사의 길 (곰의 토템)",
          "icon": "🐻",
          "desc": "곰의 영혼이 깃들어 최대 체력 +20 증가, 매 턴 시작 시 방어도 +6을 자동으로 얻습니다!",
          "bonusCard": "barbarian_totem_warrior_1",
          "cards": [
            "barbarian_totem_warrior_1",
            "barbarian_totem_warrior_2",
            "barbarian_totem_warrior_3",
            "barbarian_totem_warrior_4",
            "barbarian_totem_warrior_5",
            "barbarian_totem_warrior_6",
            "barbarian_totem_warrior_7",
            "barbarian_totem_warrior_8",
            "barbarian_totem_warrior_9",
            "barbarian_totem_warrior_10"
          ],
          "legendaryCard": "barbarian_totem_warrior_10"
        },
        {
          "id": "ancestral_guardian",
          "name": "선조의 수호자 (슬더스2 영령 소환)",
          "icon": "👻",
          "desc": "전방에 [고대 전사의 수호령]을 소환하여 적의 공격을 대신 막아내고 적에게 약화를 겁니다!",
          "bonusCard": "barbarian_ancestral_guardian_1",
          "cards": [
            "barbarian_ancestral_guardian_1",
            "barbarian_ancestral_guardian_2",
            "barbarian_ancestral_guardian_3",
            "barbarian_ancestral_guardian_4",
            "barbarian_ancestral_guardian_5",
            "barbarian_ancestral_guardian_6",
            "barbarian_ancestral_guardian_7",
            "barbarian_ancestral_guardian_8",
            "barbarian_ancestral_guardian_9",
            "barbarian_ancestral_guardian_10"
          ],
          "legendaryCard": "barbarian_ancestral_guardian_10"
        },
        {
          "id": "wild_magic",
          "name": "야생 마법의 길 (Path of Wild Magic)",
          "icon": "🌀",
          "desc": "격노와 비전 마법의 융합! 전투 시작 시 [야생 마력 오브] 1기를 생성하고 첫 턴 마나(AP) +1 및 카드 +2장을 뽑습니다.",
          "bonusCard": "barbarian_wild_magic_1",
          "cards": [
            "barbarian_wild_magic_1",
            "barbarian_wild_magic_2",
            "barbarian_wild_magic_3",
            "barbarian_wild_magic_4",
            "barbarian_wild_magic_5",
            "barbarian_wild_magic_6",
            "barbarian_wild_magic_7",
            "barbarian_wild_magic_8",
            "barbarian_wild_magic_9",
            "barbarian_wild_magic_10"
          ],
          "legendaryCard": "barbarian_wild_magic_10"
        }
      ],
      "sharedCards": [
        "bar_sh_1",
        "bar_sh_2",
        "bar_sh_3",
        "bar_sh_4"
      ],
      "rankRelics": {
        "B": "bar_rank_b",
        "S": "bar_rank_s"
      },
      "uniqueStatusName": "🩸 과다출혈 (Bleed) & 🔥 혈투 광폭화"
    },
    "rogue": {
      "id": "rogue",
      "name": "로그 (Rogue)",
      "heroName": "벨라 나이트셰이드 (Vella Nightshade)",
      "title": "발더스 게이트 도둑 길드의 그림자 칼날",
      "baseRank": "B",
      "primaryAbility": "DEX / INT (민첩 & 교활함)",
      "color": "#2ecc71",
      "accent": "#55efc4",
      "maxHp": 72,
      "startEnergy": 3,
      "secondaryResourceName": "연계 점수 (Combo 1~5) & 암기",
      "secondaryResourceIcon": "🗡️",
      "secondaryResourceDesc": "【고유 시스템: 투척 단검(Shiv) & 5연계 마무리】 암기/손놀림 스킬로 손패에 0코스트 [투척 단검]을 생성합니다! 공격으로 적에게 [⚪연계 점수(1~5)]를 쌓아 5연계 달성 시 [💀마무리 일격]이 폭발하며 턴당 1회 AP+1을 환급받습니다.",
      "passiveName": "그림자 암살술 (단검 생성 & 5연계 폭발)",
      "passiveDesc": "전투 시작 시 0코스트 [투척 단검] 1장 생성 & 적 맹독 +2! 5연계 달성 시 고정 마무리 일격 + 맹독 추가 폭발 + AP+1(1/턴)!",
      "awakeningCard": "rog_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#09331e\" stroke=\"#00ff88\" stroke-width=\"4\"/>\n        <path d=\"M26 92 Q28 22 60 22 Q92 22 94 92 Z\" fill=\"#1e272e\" stroke=\"#2ecc71\" stroke-width=\"3\"/>\n        <polygon points=\"42,56 54,58 40,62\" fill=\"#00ff88\"/>\n        <polygon points=\"78,56 66,58 80,62\" fill=\"#00ff88\"/>\n      </svg>",
      "startRelic": "thieves_tools",
      "starterDeck": [
        "rog_sh_1",
        "rog_sh_1",
        "rog_sh_1",
        "rog_sh_1",
        "rog_sh_2",
        "rog_sh_2",
        "rog_sh_2",
        "rog_sh_2",
        "rog_sh_3"
      ],
      "cardPool": [
        "rog_sh_1",
        "rog_sh_2",
        "rog_sh_3",
        "rog_sh_4",
        "rogue_thief_1",
        "rogue_thief_2",
        "rogue_thief_3",
        "rogue_thief_4",
        "rogue_thief_5",
        "rogue_thief_6",
        "rogue_thief_7",
        "rogue_thief_8",
        "rogue_thief_9",
        "rogue_thief_10",
        "rogue_assassin_1",
        "rogue_assassin_2",
        "rogue_assassin_3",
        "rogue_assassin_4",
        "rogue_assassin_5",
        "rogue_assassin_6",
        "rogue_assassin_7",
        "rogue_assassin_8",
        "rogue_assassin_9",
        "rogue_assassin_10",
        "rogue_arcane_trickster_1",
        "rogue_arcane_trickster_2",
        "rogue_arcane_trickster_3",
        "rogue_arcane_trickster_4",
        "rogue_arcane_trickster_5",
        "rogue_arcane_trickster_6",
        "rogue_arcane_trickster_7",
        "rogue_arcane_trickster_8",
        "rogue_arcane_trickster_9",
        "rogue_arcane_trickster_10",
        "rogue_phantom_1",
        "rogue_phantom_2",
        "rogue_phantom_3",
        "rogue_phantom_4",
        "rogue_phantom_5",
        "rogue_phantom_6",
        "rogue_phantom_7",
        "rogue_phantom_8",
        "rogue_phantom_9",
        "rogue_phantom_10"
      ],
      "subclasses": [
        {
          "id": "thief",
          "name": "시프 (Thief - 빠른 손놀림)",
          "icon": "🗝️",
          "desc": "매 전투 첫 턴 마나(AP) +1 및 카드 +2장 추가 드로우, 전투 승리 시 추가 골드 +25G 획득!",
          "bonusCard": "rogue_thief_1",
          "cards": [
            "rogue_thief_1",
            "rogue_thief_2",
            "rogue_thief_3",
            "rogue_thief_4",
            "rogue_thief_5",
            "rogue_thief_6",
            "rogue_thief_7",
            "rogue_thief_8",
            "rogue_thief_9",
            "rogue_thief_10"
          ],
          "legendaryCard": "rogue_thief_10"
        },
        {
          "id": "assassin",
          "name": "어쌔신 (Assassin - 암살자)",
          "icon": "💀",
          "desc": "전투 시작 시 모든 적에게 맹독 +6과 취약 +2를 즉시 부여하고 급소 공격 주사위 +4로 시작합니다!",
          "bonusCard": "rogue_assassin_1",
          "cards": [
            "rogue_assassin_1",
            "rogue_assassin_2",
            "rogue_assassin_3",
            "rogue_assassin_4",
            "rogue_assassin_5",
            "rogue_assassin_6",
            "rogue_assassin_7",
            "rogue_assassin_8",
            "rogue_assassin_9",
            "rogue_assassin_10"
          ],
          "legendaryCard": "rogue_assassin_10"
        },
        {
          "id": "arcane_trickster",
          "name": "아케인 트릭스터 (Arcane Trickster)",
          "icon": "🃏",
          "desc": "보이지 않는 마법사의 손(Mage Hand) 오브를 소환해 매 턴 자동으로 적을 교란하고 방어도를 훔쳐옵니다.",
          "bonusCard": "rogue_arcane_trickster_1",
          "cards": [
            "rogue_arcane_trickster_1",
            "rogue_arcane_trickster_2",
            "rogue_arcane_trickster_3",
            "rogue_arcane_trickster_4",
            "rogue_arcane_trickster_5",
            "rogue_arcane_trickster_6",
            "rogue_arcane_trickster_7",
            "rogue_arcane_trickster_8",
            "rogue_arcane_trickster_9",
            "rogue_arcane_trickster_10"
          ],
          "legendaryCard": "rogue_arcane_trickster_10"
        },
        {
          "id": "phantom",
          "name": "팬텀 (Phantom - 망자의 토큰)",
          "icon": "🕯️",
          "desc": "전방에 [원한의 망령]을 소환해 함께 싸우며, 공격할 때마다 주변 적에게 영혼 피해와 맹독을 전이시킵니다.",
          "bonusCard": "rogue_phantom_1",
          "cards": [
            "rogue_phantom_1",
            "rogue_phantom_2",
            "rogue_phantom_3",
            "rogue_phantom_4",
            "rogue_phantom_5",
            "rogue_phantom_6",
            "rogue_phantom_7",
            "rogue_phantom_8",
            "rogue_phantom_9",
            "rogue_phantom_10"
          ],
          "legendaryCard": "rogue_phantom_10"
        }
      ],
      "sharedCards": [
        "rog_sh_1",
        "rog_sh_2",
        "rog_sh_3",
        "rog_sh_4"
      ],
      "rankRelics": {
        "B": "rog_rank_b",
        "S": "rog_rank_s"
      },
      "uniqueStatusName": "⚪ 5연계 마무리 (Combo Points) & 🗡️ 단검(Shiv) 생성"
    },
    "ranger": {
      "id": "ranger",
      "name": "레인저 (Ranger)",
      "heroName": "드리즈트 실버보우 (Drizzt Silverbow)",
      "title": "미스트 숲과 언더다크의 숙련된 추적자",
      "baseRank": "A",
      "primaryAbility": "DEX / WIS (민첩 & 지혜)",
      "color": "#00b894",
      "accent": "#81ecec",
      "maxHp": 76,
      "startEnergy": 3,
      "secondaryResourceName": "사냥꾼의 징표 & 함정 매설",
      "secondaryResourceIcon": "🏹",
      "secondaryResourceDesc": "【고유 시스템: 전술 함정(Trap) & 표적(Quarry)】 함정/위장 스킬로 전장에 [🪤함정]을 매설하면 적이 공격할 때 먼저 터져 피해 6 및 공격력 -20% 감쇄! 사격/징표 카드가 [🎯표적]을 부여해 다음 타격 시 표적 관통 치명타를 입힙니다.",
      "passiveName": "올가미 함정술 & 흑표범 사냥",
      "passiveDesc": "전투 시작 시 [🪤함정 1개] & 야수 동료(포식 1.35배 / 호위 전환) 출격! 방어 카드가 함정을 매설하고 공격이 [🎯표적]을 격발합니다.",
      "awakeningCard": "rng_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#0b3b24\" stroke=\"#55efc4\" stroke-width=\"4\"/>\n        <path d=\"M90 18 Q112 60 90 102\" stroke=\"#fdcb6e\" stroke-width=\"4\" fill=\"none\"/>\n        <path d=\"M30 92 L36 32 L60 20 L84 32 L90 92 Z\" fill=\"#1e5631\" stroke=\"#55efc4\" stroke-width=\"3\"/>\n        <circle cx=\"48\" cy=\"54\" r=\"5\" fill=\"#ffeaa7\"/>\n        <circle cx=\"72\" cy=\"54\" r=\"5\" fill=\"#ffeaa7\"/>\n      </svg>",
      "startRelic": "hunters_quiver",
      "starterDeck": [
        "rng_sh_1",
        "rng_sh_1",
        "rng_sh_1",
        "rng_sh_1",
        "rng_sh_2",
        "rng_sh_2",
        "rng_sh_2",
        "rng_sh_2",
        "rng_sh_3"
      ],
      "cardPool": [
        "rng_sh_1",
        "rng_sh_2",
        "rng_sh_3",
        "rng_sh_4",
        "ranger_hunter_conclave_1",
        "ranger_hunter_conclave_2",
        "ranger_hunter_conclave_3",
        "ranger_hunter_conclave_4",
        "ranger_hunter_conclave_5",
        "ranger_hunter_conclave_6",
        "ranger_hunter_conclave_7",
        "ranger_hunter_conclave_8",
        "ranger_hunter_conclave_9",
        "ranger_hunter_conclave_10",
        "ranger_beast_master_1",
        "ranger_beast_master_2",
        "ranger_beast_master_3",
        "ranger_beast_master_4",
        "ranger_beast_master_5",
        "ranger_beast_master_6",
        "ranger_beast_master_7",
        "ranger_beast_master_8",
        "ranger_beast_master_9",
        "ranger_beast_master_10",
        "ranger_gloom_stalker_1",
        "ranger_gloom_stalker_2",
        "ranger_gloom_stalker_3",
        "ranger_gloom_stalker_4",
        "ranger_gloom_stalker_5",
        "ranger_gloom_stalker_6",
        "ranger_gloom_stalker_7",
        "ranger_gloom_stalker_8",
        "ranger_gloom_stalker_9",
        "ranger_gloom_stalker_10",
        "ranger_fey_wanderer_1",
        "ranger_fey_wanderer_2",
        "ranger_fey_wanderer_3",
        "ranger_fey_wanderer_4",
        "ranger_fey_wanderer_5",
        "ranger_fey_wanderer_6",
        "ranger_fey_wanderer_7",
        "ranger_fey_wanderer_8",
        "ranger_fey_wanderer_9",
        "ranger_fey_wanderer_10"
      ],
      "subclasses": [
        {
          "id": "hunter_conclave",
          "name": "헌터 (Hunter - 거수 학살자)",
          "icon": "🎯",
          "desc": "거수 학살자(Colossus Slayer)! 영구적으로 힘 +3 및 매 턴 종료 시 모든 적에게 관통 화살 피해를 가합니다.",
          "bonusCard": "ranger_hunter_conclave_1",
          "cards": [
            "ranger_hunter_conclave_1",
            "ranger_hunter_conclave_2",
            "ranger_hunter_conclave_3",
            "ranger_hunter_conclave_4",
            "ranger_hunter_conclave_5",
            "ranger_hunter_conclave_6",
            "ranger_hunter_conclave_7",
            "ranger_hunter_conclave_8",
            "ranger_hunter_conclave_9",
            "ranger_hunter_conclave_10"
          ],
          "legendaryCard": "ranger_hunter_conclave_10"
        },
        {
          "id": "beast_master",
          "name": "비스트 마스터 (슬더스2 흑표범 소환)",
          "icon": "🐆",
          "desc": "전투 시작 시 충직한 [아스트랄 흑표범 구엔위바]를 전방에 소환합니다! 흑표범이 대신 공격을 막고 매 턴 적을 물어뜯습니다.",
          "bonusCard": "ranger_beast_master_1",
          "cards": [
            "ranger_beast_master_1",
            "ranger_beast_master_2",
            "ranger_beast_master_3",
            "ranger_beast_master_4",
            "ranger_beast_master_5",
            "ranger_beast_master_6",
            "ranger_beast_master_7",
            "ranger_beast_master_8",
            "ranger_beast_master_9",
            "ranger_beast_master_10"
          ],
          "legendaryCard": "ranger_beast_master_10"
        },
        {
          "id": "gloom_stalker",
          "name": "글룸 스토커 (Gloom Stalker)",
          "icon": "🌑",
          "desc": "어둠의 기습자! 첫 턴 마나(AP) +1, 카드 +2장 드로우 및 첫 턴 [그림자 매복(피해 2배)] 효과를 얻습니다!",
          "bonusCard": "ranger_gloom_stalker_1",
          "cards": [
            "ranger_gloom_stalker_1",
            "ranger_gloom_stalker_2",
            "ranger_gloom_stalker_3",
            "ranger_gloom_stalker_4",
            "ranger_gloom_stalker_5",
            "ranger_gloom_stalker_6",
            "ranger_gloom_stalker_7",
            "ranger_gloom_stalker_8",
            "ranger_gloom_stalker_9",
            "ranger_gloom_stalker_10"
          ],
          "legendaryCard": "ranger_gloom_stalker_10"
        },
        {
          "id": "fey_wanderer",
          "name": "페이 방랑자 (Fey Wanderer)",
          "icon": "🦋",
          "desc": "요정계(Feywild)의 축복! 전투 시작 시 [요정 정령 오브] 1기를 소환하고 매 턴 적 전체에게 매혹(약화 1)을 부여합니다.",
          "bonusCard": "ranger_fey_wanderer_1",
          "cards": [
            "ranger_fey_wanderer_1",
            "ranger_fey_wanderer_2",
            "ranger_fey_wanderer_3",
            "ranger_fey_wanderer_4",
            "ranger_fey_wanderer_5",
            "ranger_fey_wanderer_6",
            "ranger_fey_wanderer_7",
            "ranger_fey_wanderer_8",
            "ranger_fey_wanderer_9",
            "ranger_fey_wanderer_10"
          ],
          "legendaryCard": "ranger_fey_wanderer_10"
        }
      ],
      "sharedCards": [
        "rng_sh_1",
        "rng_sh_2",
        "rng_sh_3",
        "rng_sh_4"
      ],
      "rankRelics": {
        "B": "rng_rank_b",
        "S": "rng_rank_s"
      },
      "uniqueStatusName": "🪤 전술 함정 (Traps) & 🎯 표적 관통 (Quarry)"
    },
    "wizard": {
      "id": "wizard",
      "name": "위저드 (Wizard)",
      "heroName": "엘민스터 오마르 (Elminster Aumar)",
      "title": "실버임과 캔들킵의 대마법사",
      "baseRank": "A",
      "primaryAbility": "INT (지능 & 비전 주문 슬롯)",
      "color": "#3498db",
      "accent": "#74b9ff",
      "maxHp": 68,
      "startEnergy": 3,
      "secondaryResourceName": "비전 주문력 & 3원소 구체 발현",
      "secondaryResourceIcon": "🔮",
      "secondaryResourceDesc": "【고유 시스템: 3원소 구체(🔥화염/❄️냉기/⚡번개) & 동상】 주문 속성에 맞는 원소 구체가 최대 4슬롯에 영창되며, 슬롯 초과 시 가장 앞 구체가 2배 위력으로 [발현(Evoke)]합니다! 냉기 주문은 적의 공격력을 깎는 [❄️동상](10중첩 시 빙결 -25%)을 부여합니다.",
      "passiveName": "원소 대마도사 (화염·냉기·번개 구체 & 빙결)",
      "passiveDesc": "전투 시작 시 [❄️냉기 구체 + ⚡번개 구체] 영창! 구체가 매 턴 발동(냉기는 방어+동상, 10중첩 시 빙결 -25%)하며 4개 초과 시 발현(Evoke)!",
      "awakeningCard": "wiz_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#0a1931\" stroke=\"#00d2d3\" stroke-width=\"4\"/>\n        <polygon points=\"60,10 86,46 34,46\" fill=\"#192a56\" stroke=\"#00d2d3\" stroke-width=\"3\"/>\n        <ellipse cx=\"60\" cy=\"46\" rx=\"36\" ry=\"7\" fill=\"#273c75\" stroke=\"#00d2d3\" stroke-width=\"2\"/>\n        <circle cx=\"49\" cy=\"62\" r=\"6\" fill=\"#00d2d3\"/>\n        <circle cx=\"71\" cy=\"62\" r=\"6\" fill=\"#00d2d3\"/>\n      </svg>",
      "startRelic": "spellbook_of_mystra",
      "starterDeck": [
        "wiz_sh_1",
        "wiz_sh_1",
        "wiz_sh_1",
        "wiz_sh_1",
        "wiz_sh_2",
        "wiz_sh_2",
        "wiz_sh_2",
        "wiz_sh_2",
        "wiz_sh_3"
      ],
      "cardPool": [
        "wiz_sh_1",
        "wiz_sh_2",
        "wiz_sh_3",
        "wiz_sh_4",
        "wizard_evocation_1",
        "wizard_evocation_2",
        "wizard_evocation_3",
        "wizard_evocation_4",
        "wizard_evocation_5",
        "wizard_evocation_6",
        "wizard_evocation_7",
        "wizard_evocation_8",
        "wizard_evocation_9",
        "wizard_evocation_10",
        "wizard_abjuration_1",
        "wizard_abjuration_2",
        "wizard_abjuration_3",
        "wizard_abjuration_4",
        "wizard_abjuration_5",
        "wizard_abjuration_6",
        "wizard_abjuration_7",
        "wizard_abjuration_8",
        "wizard_abjuration_9",
        "wizard_abjuration_10",
        "wizard_necromancy_1",
        "wizard_necromancy_2",
        "wizard_necromancy_3",
        "wizard_necromancy_4",
        "wizard_necromancy_5",
        "wizard_necromancy_6",
        "wizard_necromancy_7",
        "wizard_necromancy_8",
        "wizard_necromancy_9",
        "wizard_necromancy_10",
        "wizard_divination_1",
        "wizard_divination_2",
        "wizard_divination_3",
        "wizard_divination_4",
        "wizard_divination_5",
        "wizard_divination_6",
        "wizard_divination_7",
        "wizard_divination_8",
        "wizard_divination_9",
        "wizard_divination_10"
      ],
      "subclasses": [
        {
          "id": "evocation",
          "name": "방출학파 (School of Evocation)",
          "icon": "🔥",
          "desc": "파괴 주문 조각! 모든 주문 공격력(힘) +3 및 전투 시작 시 [화염 구체 오브] 2기를 소환한 채 시작합니다!",
          "bonusCard": "wizard_evocation_1",
          "cards": [
            "wizard_evocation_1",
            "wizard_evocation_2",
            "wizard_evocation_3",
            "wizard_evocation_4",
            "wizard_evocation_5",
            "wizard_evocation_6",
            "wizard_evocation_7",
            "wizard_evocation_8",
            "wizard_evocation_9",
            "wizard_evocation_10"
          ],
          "legendaryCard": "wizard_evocation_10"
        },
        {
          "id": "abjuration",
          "name": "방호학파 (School of Abjuration)",
          "icon": "💠",
          "desc": "비전 수호막(Arcane Ward)! 매 전투 첫 턴 방어도 +15 및 매 턴 종료 시 방어도 +6을 자동으로 얻습니다.",
          "bonusCard": "wizard_abjuration_1",
          "cards": [
            "wizard_abjuration_1",
            "wizard_abjuration_2",
            "wizard_abjuration_3",
            "wizard_abjuration_4",
            "wizard_abjuration_5",
            "wizard_abjuration_6",
            "wizard_abjuration_7",
            "wizard_abjuration_8",
            "wizard_abjuration_9",
            "wizard_abjuration_10"
          ],
          "legendaryCard": "wizard_abjuration_10"
        },
        {
          "id": "necromancy",
          "name": "사령학파 (슬더스2 해골 기사 소환)",
          "icon": "💀",
          "desc": "전투 시작 시 전방에 [언데드 해골 챔피언]을 소환합니다! 해골이 위저드 대신 공격을 막고 매 턴 적의 생명력을 흡수합니다.",
          "bonusCard": "wizard_necromancy_1",
          "cards": [
            "wizard_necromancy_1",
            "wizard_necromancy_2",
            "wizard_necromancy_3",
            "wizard_necromancy_4",
            "wizard_necromancy_5",
            "wizard_necromancy_6",
            "wizard_necromancy_7",
            "wizard_necromancy_8",
            "wizard_necromancy_9",
            "wizard_necromancy_10"
          ],
          "legendaryCard": "wizard_necromancy_10"
        },
        {
          "id": "divination",
          "name": "예지학파 (School of Divination - 운명 조작)",
          "icon": "👁️",
          "desc": "예지 주사위(Portent)! 매 턴 카드를 +1장 더 뽑고, 첫 턴 마나(AP) +1 및 모든 적에게 취약 2를 부여합니다.",
          "bonusCard": "wizard_divination_1",
          "cards": [
            "wizard_divination_1",
            "wizard_divination_2",
            "wizard_divination_3",
            "wizard_divination_4",
            "wizard_divination_5",
            "wizard_divination_6",
            "wizard_divination_7",
            "wizard_divination_8",
            "wizard_divination_9",
            "wizard_divination_10"
          ],
          "legendaryCard": "wizard_divination_10"
        }
      ],
      "sharedCards": [
        "wiz_sh_1",
        "wiz_sh_2",
        "wiz_sh_3",
        "wiz_sh_4"
      ],
      "rankRelics": {
        "B": "wiz_rank_b",
        "S": "wiz_rank_s"
      },
      "uniqueStatusName": "🔥❄️⚡ 3원소 구체 (Fire/Frost/Lightning) & 🧊 동상/빙결"
    },
    "cleric": {
      "id": "cleric",
      "name": "클레릭 (Cleric)",
      "heroName": "라이라 던브링어 (Lyra Dawnbringer)",
      "title": "태양신 라센더와 셀루네의 대사제",
      "baseRank": "A",
      "primaryAbility": "WIS / CHA (지혜 & 신성 권능)",
      "color": "#f1c40f",
      "accent": "#ffeaa7",
      "maxHp": 80,
      "startEnergy": 3,
      "secondaryResourceName": "신앙심 (10 도달 시 천상 기적!)",
      "secondaryResourceIcon": "☀️",
      "secondaryResourceDesc": "【고유 시스템: 초과치유 보호막 & 성스러운 낙인】 최대 체력을 초과한 치유량은 100% 방어도로 전환됩니다! 광휘 주문으로 적에게 [☀️성스러운 낙인]을 새기면, 치유/방어 스킬 사용 시(턴당 최대 3회) 낙인 수치만큼 광휘 심판 피해를 반사합니다.",
      "passiveName": "라센더의 축복 (초과치유 보호막 & 힐/방어 광휘 반사)",
      "passiveDesc": "전투 시작 시 적에게 [☀️성스러운 낙인 +1]! 치유 초과분은 방어도로 전환되며, 방어·치유 시 낙인이 광휘 반사! 신앙심 10 도달 시 천상 기적!",
      "awakeningCard": "clr_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#4a3500\" stroke=\"#ffeaa7\" stroke-width=\"4\"/>\n        <circle cx=\"60\" cy=\"50\" r=\"32\" fill=\"none\" stroke=\"#fdcb6e\" stroke-width=\"3\" stroke-dasharray=\"5,3\"/>\n        <path d=\"M32 94 L38 38 L60 24 L82 38 L88 94 Z\" fill=\"#dfe6e9\" stroke=\"#f1c40f\" stroke-width=\"3\"/>\n        <circle cx=\"48\" cy=\"56\" r=\"5\" fill=\"#f39c12\"/>\n        <circle cx=\"72\" cy=\"56\" r=\"5\" fill=\"#f39c12\"/>\n      </svg>",
      "startRelic": "holy_symbol_lathander",
      "starterDeck": [
        "clr_sh_1",
        "clr_sh_1",
        "clr_sh_1",
        "clr_sh_1",
        "clr_sh_2",
        "clr_sh_2",
        "clr_sh_2",
        "clr_sh_2",
        "clr_sh_3"
      ],
      "cardPool": [
        "clr_sh_1",
        "clr_sh_2",
        "clr_sh_3",
        "clr_sh_4",
        "cleric_life_domain_1",
        "cleric_life_domain_2",
        "cleric_life_domain_3",
        "cleric_life_domain_4",
        "cleric_life_domain_5",
        "cleric_life_domain_6",
        "cleric_life_domain_7",
        "cleric_life_domain_8",
        "cleric_life_domain_9",
        "cleric_life_domain_10",
        "cleric_light_domain_1",
        "cleric_light_domain_2",
        "cleric_light_domain_3",
        "cleric_light_domain_4",
        "cleric_light_domain_5",
        "cleric_light_domain_6",
        "cleric_light_domain_7",
        "cleric_light_domain_8",
        "cleric_light_domain_9",
        "cleric_light_domain_10",
        "cleric_war_domain_1",
        "cleric_war_domain_2",
        "cleric_war_domain_3",
        "cleric_war_domain_4",
        "cleric_war_domain_5",
        "cleric_war_domain_6",
        "cleric_war_domain_7",
        "cleric_war_domain_8",
        "cleric_war_domain_9",
        "cleric_war_domain_10",
        "cleric_grave_domain_1",
        "cleric_grave_domain_2",
        "cleric_grave_domain_3",
        "cleric_grave_domain_4",
        "cleric_grave_domain_5",
        "cleric_grave_domain_6",
        "cleric_grave_domain_7",
        "cleric_grave_domain_8",
        "cleric_grave_domain_9",
        "cleric_grave_domain_10"
      ],
      "subclasses": [
        {
          "id": "life_domain",
          "name": "생명 권역 (Life Domain)",
          "icon": "❤️‍🩹",
          "desc": "최고의 치유사! 최대 체력 +18, 매 턴 시작 시 내 체력을 3 회복하고 방어도 +4를 자동으로 얻습니다.",
          "bonusCard": "cleric_life_domain_1",
          "cards": [
            "cleric_life_domain_1",
            "cleric_life_domain_2",
            "cleric_life_domain_3",
            "cleric_life_domain_4",
            "cleric_life_domain_5",
            "cleric_life_domain_6",
            "cleric_life_domain_7",
            "cleric_life_domain_8",
            "cleric_life_domain_9",
            "cleric_life_domain_10"
          ],
          "legendaryCard": "cleric_life_domain_10"
        },
        {
          "id": "light_domain",
          "name": "빛 권역 (Light Domain)",
          "icon": "🌅",
          "desc": "여명의 광휘! 전투 시작 시 [태양 광휘 오브] 2기를 소환하고 모든 적에게 화상(맹독) 5와 약화 2를 부여합니다.",
          "bonusCard": "cleric_light_domain_1",
          "cards": [
            "cleric_light_domain_1",
            "cleric_light_domain_2",
            "cleric_light_domain_3",
            "cleric_light_domain_4",
            "cleric_light_domain_5",
            "cleric_light_domain_6",
            "cleric_light_domain_7",
            "cleric_light_domain_8",
            "cleric_light_domain_9",
            "cleric_light_domain_10"
          ],
          "legendaryCard": "cleric_light_domain_10"
        },
        {
          "id": "war_domain",
          "name": "전쟁 권역 (War Domain)",
          "icon": "🔨",
          "desc": "전쟁신의 사도! 전투 시작 시 힘 +3, 민첩 +2 및 전방에 [영체 대검 수호자]를 소환해 적을 함께 타격합니다.",
          "bonusCard": "cleric_war_domain_1",
          "cards": [
            "cleric_war_domain_1",
            "cleric_war_domain_2",
            "cleric_war_domain_3",
            "cleric_war_domain_4",
            "cleric_war_domain_5",
            "cleric_war_domain_6",
            "cleric_war_domain_7",
            "cleric_war_domain_8",
            "cleric_war_domain_9",
            "cleric_war_domain_10"
          ],
          "legendaryCard": "cleric_war_domain_10"
        },
        {
          "id": "grave_domain",
          "name": "무덤 권역 (Grave Domain - 죽음의 낙인)",
          "icon": "⚰️",
          "desc": "무덤의 길(Path to the Grave)! 전투 시작 시 [초월/심판 태세]에 쉽게 진입하며 모든 적에게 취약 3을 부여합니다!",
          "bonusCard": "cleric_grave_domain_1",
          "cards": [
            "cleric_grave_domain_1",
            "cleric_grave_domain_2",
            "cleric_grave_domain_3",
            "cleric_grave_domain_4",
            "cleric_grave_domain_5",
            "cleric_grave_domain_6",
            "cleric_grave_domain_7",
            "cleric_grave_domain_8",
            "cleric_grave_domain_9",
            "cleric_grave_domain_10"
          ],
          "legendaryCard": "cleric_grave_domain_10"
        }
      ],
      "sharedCards": [
        "clr_sh_1",
        "clr_sh_2",
        "clr_sh_3",
        "clr_sh_4"
      ],
      "rankRelics": {
        "B": "clr_rank_b",
        "S": "clr_rank_s"
      },
      "uniqueStatusName": "☀️ 성스러운 낙인 (Holy Brand) & 💛 초과치유 보호막 (Overheal)"
    },
    "paladin": {
      "id": "paladin",
      "name": "팔라딘 (Paladin)",
      "heroName": "티리온 실버핸드 (Tirion Silverhand)",
      "title": "정의의 신 티르를 섬기는 성기사단장",
      "baseRank": "S",
      "primaryAbility": "STR / CHA (근력 & 신성한 강타)",
      "color": "#f39c12",
      "accent": "#ffeaa7",
      "maxHp": 88,
      "startEnergy": 3,
      "secondaryResourceName": "신성한 강타 & 3대 오라 전환",
      "secondaryResourceIcon": "✨",
      "secondaryResourceDesc": "【고유 시스템: 3대 성기사 오라 & 문장 심판】 [🔥응보(반사)] ↔ [🛡️헌신(피해-15%/방어)] ↔ [⚔️성전(공격+15%)] 오라를 전환합니다! 일반 검격/축복으로 [⚖️심판의 문장]을 쌓고, [강타(Smite)] 카드로 폭발시켜 광휘 피해와 방어도를 동시에 얻습니다.",
      "passiveName": "성기사단장의 오라 & 문장 심판",
      "passiveDesc": "전투 시작 시 [🔥응보 오라(반사+4)] & 적 [⚖️심판 문장 +2]! 3대 오라(응보/헌신/성전) 실시간 전환 및 강타 카드로 문장 폭발!",
      "awakeningCard": "pal_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#2c2c54\" stroke=\"#f1c40f\" stroke-width=\"4\"/>\n        <path d=\"M30 95 L28 45 L60 22 L92 45 L90 95 Z\" fill=\"#dcdde1\" stroke=\"#f39c12\" stroke-width=\"3\"/>\n        <polygon points=\"60,32 66,52 84,52 68,62 74,80 60,68 46,80 52,62 36,52 54,52\" fill=\"#f1c40f\"/>\n      </svg>",
      "startRelic": "holy_avenger_hilt",
      "starterDeck": [
        "pal_sh_1",
        "pal_sh_1",
        "pal_sh_1",
        "pal_sh_1",
        "pal_sh_2",
        "pal_sh_2",
        "pal_sh_2",
        "pal_sh_2",
        "pal_sh_3"
      ],
      "cardPool": [
        "pal_sh_1",
        "pal_sh_2",
        "pal_sh_3",
        "pal_sh_4",
        "paladin_devotion_1",
        "paladin_devotion_2",
        "paladin_devotion_3",
        "paladin_devotion_4",
        "paladin_devotion_5",
        "paladin_devotion_6",
        "paladin_devotion_7",
        "paladin_devotion_8",
        "paladin_devotion_9",
        "paladin_devotion_10",
        "paladin_vengeance_1",
        "paladin_vengeance_2",
        "paladin_vengeance_3",
        "paladin_vengeance_4",
        "paladin_vengeance_5",
        "paladin_vengeance_6",
        "paladin_vengeance_7",
        "paladin_vengeance_8",
        "paladin_vengeance_9",
        "paladin_vengeance_10",
        "paladin_conquest_1",
        "paladin_conquest_2",
        "paladin_conquest_3",
        "paladin_conquest_4",
        "paladin_conquest_5",
        "paladin_conquest_6",
        "paladin_conquest_7",
        "paladin_conquest_8",
        "paladin_conquest_9",
        "paladin_conquest_10",
        "paladin_oathbreaker_1",
        "paladin_oathbreaker_2",
        "paladin_oathbreaker_3",
        "paladin_oathbreaker_4",
        "paladin_oathbreaker_5",
        "paladin_oathbreaker_6",
        "paladin_oathbreaker_7",
        "paladin_oathbreaker_8",
        "paladin_oathbreaker_9",
        "paladin_oathbreaker_10"
      ],
      "subclasses": [
        {
          "id": "devotion",
          "name": "헌신의 맹세 (Oath of Devotion)",
          "icon": "⚔️",
          "desc": "신성한 무기(Sacred Weapon)! 힘 +3, 민첩 +3 및 매 턴 종료 시 자동 방어도 +6을 얻습니다.",
          "bonusCard": "paladin_devotion_1",
          "cards": [
            "paladin_devotion_1",
            "paladin_devotion_2",
            "paladin_devotion_3",
            "paladin_devotion_4",
            "paladin_devotion_5",
            "paladin_devotion_6",
            "paladin_devotion_7",
            "paladin_devotion_8",
            "paladin_devotion_9",
            "paladin_devotion_10"
          ],
          "legendaryCard": "paladin_devotion_10"
        },
        {
          "id": "vengeance",
          "name": "복수의 맹세 (Oath of Vengeance)",
          "icon": "🔥",
          "desc": "적대의 맹세! 전투 시작 시 즉시 [복수의 화신(공격력 2배 태세)]에 돌입할 수 있으며 모든 적에게 취약 2를 부여합니다.",
          "bonusCard": "paladin_vengeance_1",
          "cards": [
            "paladin_vengeance_1",
            "paladin_vengeance_2",
            "paladin_vengeance_3",
            "paladin_vengeance_4",
            "paladin_vengeance_5",
            "paladin_vengeance_6",
            "paladin_vengeance_7",
            "paladin_vengeance_8",
            "paladin_vengeance_9",
            "paladin_vengeance_10"
          ],
          "legendaryCard": "paladin_vengeance_10"
        },
        {
          "id": "conquest",
          "name": "정복의 맹세 (Oath of Conquest)",
          "icon": "👑",
          "desc": "정복의 오라! 전방에 [천상의 그리폰 군마(Find Greater Steed)]를 소환해 공격을 대신 막고 적 전체에게 약화 2를 겁니다.",
          "bonusCard": "paladin_conquest_1",
          "cards": [
            "paladin_conquest_1",
            "paladin_conquest_2",
            "paladin_conquest_3",
            "paladin_conquest_4",
            "paladin_conquest_5",
            "paladin_conquest_6",
            "paladin_conquest_7",
            "paladin_conquest_8",
            "paladin_conquest_9",
            "paladin_conquest_10"
          ],
          "legendaryCard": "paladin_conquest_10"
        },
        {
          "id": "oathbreaker",
          "name": "맹세파기자 (Oathbreaker - 타락 성기사)",
          "icon": "🖤",
          "desc": "증오의 오라! 전방에 [죽음의 기사 소환수]를 거느리고 힘 +4를 얻으며, 공격 시 적에게 암흑 저주를 함께 부여합니다.",
          "bonusCard": "paladin_oathbreaker_1",
          "cards": [
            "paladin_oathbreaker_1",
            "paladin_oathbreaker_2",
            "paladin_oathbreaker_3",
            "paladin_oathbreaker_4",
            "paladin_oathbreaker_5",
            "paladin_oathbreaker_6",
            "paladin_oathbreaker_7",
            "paladin_oathbreaker_8",
            "paladin_oathbreaker_9",
            "paladin_oathbreaker_10"
          ],
          "legendaryCard": "paladin_oathbreaker_10"
        }
      ],
      "sharedCards": [
        "pal_sh_1",
        "pal_sh_2",
        "pal_sh_3",
        "pal_sh_4"
      ],
      "rankRelics": {
        "B": "pal_rank_b",
        "S": "pal_rank_s"
      },
      "uniqueStatusName": "⚜️ 3대 성기사 오라 (응보/헌신/성전) & ⚖️ 심판의 문장"
    },
    "warlock": {
      "id": "warlock",
      "name": "워락 (Warlock)",
      "heroName": "말라카이 섀도우본 (Malakai Shadowborn)",
      "title": "초월적 후원자와 피의 계약을 맺은 흑마법사",
      "baseRank": "S",
      "primaryAbility": "CHA (매력 & 섬뜩한 기원)",
      "color": "#9b59b6",
      "accent": "#e056fd",
      "maxHp": 74,
      "startEnergy": 3,
      "secondaryResourceName": "영혼 조각 & 사역마 혈맹 진화",
      "secondaryResourceIcon": "🟣",
      "secondaryResourceDesc": "【고유 시스템: 파멸의 저주(Doom) & 사역마 혈맹】 주술/지옥 주문으로 영구 축적되는 [💀파멸(Doom)]을 쌓습니다! 적 체력이 파멸 이하(보스는 체력 25% 이하 & 파멸 이하)가 되면 즉시 처형됩니다! 계약 악마의 체력을 바쳐 AP+1과 드로우를 얻을 수 있습니다.",
      "passiveName": "슬더스 2 네크로바인더: 파멸(Doom) 처형 & 계약 악마",
      "passiveDesc": "전투 시작 시 계약 사역마 소환 & 적 [💀파멸 +4]! 적 HP ≤ 파멸 시 즉시 처형(엘리트 HP 40%↓ / 보스 HP 25%↓ 제한)!",
      "awakeningCard": "wlk_sh_4",
      "avatarSvg": "<svg viewBox=\"0 0 120 120\" class=\"char-svg\">\n        <circle cx=\"60\" cy=\"60\" r=\"52\" fill=\"#1a0526\" stroke=\"#e056fd\" stroke-width=\"4\"/>\n        <path d=\"M30 94 L34 40 L47 22 L60 36 L73 22 L86 40 L90 94 Z\" fill=\"#130f40\" stroke=\"#be2edd\" stroke-width=\"3\"/>\n        <polygon points=\"40,54 55,58 53,64 38,59\" fill=\"#00cec9\"/>\n        <polygon points=\"80,54 65,58 67,64 82,59\" fill=\"#00cec9\"/>\n      </svg>",
      "startRelic": "rod_of_pact_keeper",
      "starterDeck": [
        "wlk_sh_1",
        "wlk_sh_1",
        "wlk_sh_1",
        "wlk_sh_1",
        "wlk_sh_2",
        "wlk_sh_2",
        "wlk_sh_2",
        "wlk_sh_2",
        "wlk_sh_3"
      ],
      "cardPool": [
        "wlk_sh_1",
        "wlk_sh_2",
        "wlk_sh_3",
        "wlk_sh_4",
        "warlock_fiend_patron_1",
        "warlock_fiend_patron_2",
        "warlock_fiend_patron_3",
        "warlock_fiend_patron_4",
        "warlock_fiend_patron_5",
        "warlock_fiend_patron_6",
        "warlock_fiend_patron_7",
        "warlock_fiend_patron_8",
        "warlock_fiend_patron_9",
        "warlock_fiend_patron_10",
        "warlock_hexblade_1",
        "warlock_hexblade_2",
        "warlock_hexblade_3",
        "warlock_hexblade_4",
        "warlock_hexblade_5",
        "warlock_hexblade_6",
        "warlock_hexblade_7",
        "warlock_hexblade_8",
        "warlock_hexblade_9",
        "warlock_hexblade_10",
        "warlock_great_old_one_1",
        "warlock_great_old_one_2",
        "warlock_great_old_one_3",
        "warlock_great_old_one_4",
        "warlock_great_old_one_5",
        "warlock_great_old_one_6",
        "warlock_great_old_one_7",
        "warlock_great_old_one_8",
        "warlock_great_old_one_9",
        "warlock_great_old_one_10",
        "warlock_archfey_chain_1",
        "warlock_archfey_chain_2",
        "warlock_archfey_chain_3",
        "warlock_archfey_chain_4",
        "warlock_archfey_chain_5",
        "warlock_archfey_chain_6",
        "warlock_archfey_chain_7",
        "warlock_archfey_chain_8",
        "warlock_archfey_chain_9",
        "warlock_archfey_chain_10"
      ],
      "subclasses": [
        {
          "id": "fiend_patron",
          "name": "마신 후원자 (The Fiend)",
          "icon": "😈",
          "desc": "어둠의 축복! 전방의 [지옥마신 핀드] 체력이 +15, 공격력이 +5 강화되며 전투 승리 시 내 체력을 8 회복합니다.",
          "bonusCard": "warlock_fiend_patron_1",
          "cards": [
            "warlock_fiend_patron_1",
            "warlock_fiend_patron_2",
            "warlock_fiend_patron_3",
            "warlock_fiend_patron_4",
            "warlock_fiend_patron_5",
            "warlock_fiend_patron_6",
            "warlock_fiend_patron_7",
            "warlock_fiend_patron_8",
            "warlock_fiend_patron_9",
            "warlock_fiend_patron_10"
          ],
          "legendaryCard": "warlock_fiend_patron_10"
        },
        {
          "id": "hexblade",
          "name": "헥스블레이드 (The Hexblade - 마검 워락)",
          "icon": "🗡️",
          "desc": "저주받은 마검! 힘 +4, 민첩 +2를 얻고 모든 공격이 대상에게 저주(맹독 +3)를 추가로 부여합니다.",
          "bonusCard": "warlock_hexblade_1",
          "cards": [
            "warlock_hexblade_1",
            "warlock_hexblade_2",
            "warlock_hexblade_3",
            "warlock_hexblade_4",
            "warlock_hexblade_5",
            "warlock_hexblade_6",
            "warlock_hexblade_7",
            "warlock_hexblade_8",
            "warlock_hexblade_9",
            "warlock_hexblade_10"
          ],
          "legendaryCard": "warlock_hexblade_10"
        },
        {
          "id": "great_old_one",
          "name": "그레이트 올드 원 (크툴루/고대신 후원자)",
          "icon": "🐙",
          "desc": "공허의 촉수! 전투 시작 시 [하다르의 촉수 오브] 2기를 소환하고 모든 적에게 정신 붕괴(약화 2, 취약 2)를 부여합니다.",
          "bonusCard": "warlock_great_old_one_1",
          "cards": [
            "warlock_great_old_one_1",
            "warlock_great_old_one_2",
            "warlock_great_old_one_3",
            "warlock_great_old_one_4",
            "warlock_great_old_one_5",
            "warlock_great_old_one_6",
            "warlock_great_old_one_7",
            "warlock_great_old_one_8",
            "warlock_great_old_one_9",
            "warlock_great_old_one_10"
          ],
          "legendaryCard": "warlock_great_old_one_10"
        },
        {
          "id": "archfey_chain",
          "name": "사슬의 군주 (Pact of the Chain Master)",
          "icon": "⛓️",
          "desc": "소환수 극대화! 전방 소환수의 체력이 2배가 되고, 매 턴 워락이 카드를 +1장 더 뽑으며 영혼 조각 +3을 얻습니다.",
          "bonusCard": "warlock_archfey_chain_1",
          "cards": [
            "warlock_archfey_chain_1",
            "warlock_archfey_chain_2",
            "warlock_archfey_chain_3",
            "warlock_archfey_chain_4",
            "warlock_archfey_chain_5",
            "warlock_archfey_chain_6",
            "warlock_archfey_chain_7",
            "warlock_archfey_chain_8",
            "warlock_archfey_chain_9",
            "warlock_archfey_chain_10"
          ],
          "legendaryCard": "warlock_archfey_chain_10"
        }
      ],
      "sharedCards": [
        "wlk_sh_1",
        "wlk_sh_2",
        "wlk_sh_3",
        "wlk_sh_4"
      ],
      "rankRelics": {
        "B": "wlk_rank_b",
        "S": "wlk_rank_s"
      },
      "uniqueStatusName": "💀 파멸의 저주 (Doom - 체력 이하 시 즉사!) & 🩸 사역마 혈맹"
    }
  },
  "equipment": {
    "c_dagger": {
      "id": "c_dagger",
      "name": "+1 강철 모험가 롱소드",
      "slot": "weapon",
      "rank": "C",
      "icon": "🗡️",
      "baseStr": 1,
      "strPerLv": 0.5,
      "desc": "전투 시작 시 공격력(힘) 증가",
      "unlockCost": 0
    },
    "b_greatsword": {
      "id": "b_greatsword",
      "name": "플레임 텅(Flame Tongue) 화염검",
      "slot": "weapon",
      "rank": "B",
      "icon": "🔥",
      "baseStr": 2,
      "strPerLv": 1,
      "desc": "전투 시작 시 힘 대폭 증가",
      "unlockCost": 150
    },
    "a_demon_bow": {
      "id": "a_demon_bow",
      "name": "선블레이드(Sun Blade) 광휘검",
      "slot": "weapon",
      "rank": "A",
      "icon": "☀️",
      "baseStr": 3,
      "strPerLv": 1,
      "resourceBonus": 2,
      "desc": "힘 증가 및 전투 시작 시 클래스 자원 +2",
      "unlockCost": 280
    },
    "s_kamish_wrath": {
      "id": "s_kamish_wrath",
      "name": "보팔 소드 & 홀리 어벤저 (S급 신화)",
      "slot": "weapon",
      "rank": "S",
      "icon": "⚜️",
      "baseStr": 5,
      "strPerLv": 1.5,
      "resourceBonus": 3,
      "desc": "D&D 최강의 전설 무기! 힘 및 시작 자원 대폭 증가",
      "unlockCost": 500
    },
    "c_vest": {
      "id": "c_vest",
      "name": "스터디드 레더 아머",
      "slot": "armor",
      "rank": "C",
      "icon": "🦺",
      "baseHp": 8,
      "hpPerLv": 4,
      "baseDex": 0,
      "desc": "최대 체력(HP) 증가",
      "unlockCost": 0
    },
    "b_mithril_mail": {
      "id": "b_mithril_mail",
      "name": "미스릴 하프 플레이트",
      "slot": "armor",
      "rank": "B",
      "icon": "🛡️",
      "baseHp": 16,
      "hpPerLv": 6,
      "baseDex": 1,
      "desc": "최대 체력 및 방어도(민첩) +1 증가",
      "unlockCost": 150
    },
    "a_shadow_coat": {
      "id": "a_shadow_coat",
      "name": "아다만틴 풀 플레이트 & 대마법사 로브",
      "slot": "armor",
      "rank": "A",
      "icon": "🧥",
      "baseHp": 25,
      "hpPerLv": 8,
      "baseDex": 2,
      "desc": "치명타 면역 갑주! 최대 체력 및 민첩 +2 증가",
      "unlockCost": 280
    },
    "s_dragon_scale": {
      "id": "s_dragon_scale",
      "name": "티아마트 고룡 비늘 갑주 (S급)",
      "slot": "armor",
      "rank": "S",
      "icon": "🐉",
      "baseHp": 42,
      "hpPerLv": 10,
      "baseDex": 3,
      "desc": "S급 신화 갑주! 최대 체력 및 민첩 +3 대폭 증가",
      "unlockCost": 500
    },
    "c_ring": {
      "id": "c_ring",
      "name": "보호의 반지 (Ring of Protection)",
      "slot": "accessory",
      "rank": "C",
      "icon": "💍",
      "baseBlock": 4,
      "blockPerLv": 2,
      "desc": "매 전투 첫 턴 임시 체력(방어도) 획득",
      "unlockCost": 0
    },
    "b_pendant": {
      "id": "b_pendant",
      "name": "건강의 목걸이 (Amulet of Health)",
      "slot": "accessory",
      "rank": "B",
      "icon": "📿",
      "baseBlock": 8,
      "blockPerLv": 3,
      "healAfterCombat": 3,
      "desc": "첫 턴 방어도 및 전투 승리 시 체력 +3 회복",
      "unlockCost": 150
    },
    "a_earring": {
      "id": "a_earring",
      "name": "변위의 망토 (Cloak of Displacement)",
      "slot": "accessory",
      "rank": "A",
      "icon": "💎",
      "baseBlock": 12,
      "blockPerLv": 4,
      "summonBoost": 5,
      "desc": "첫 턴 방어도 및 소환수/구체 위력 +5 강화",
      "unlockCost": 280
    },
    "s_monarch_heart": {
      "id": "s_monarch_heart",
      "name": "스톰 자이언트 힘의 벨트 (S급)",
      "slot": "accessory",
      "rank": "S",
      "icon": "👑",
      "baseBlock": 18,
      "blockPerLv": 5,
      "summonBoost": 10,
      "healAfterCombat": 6,
      "desc": "첫 턴 대규모 방어도, 소환수/구체 +10, 전투 후 체력 +6 회복",
      "unlockCost": 500
    }
  },
  "masteries": [
    {
      "id": "vitality_training",
      "name": "❤️ 강인함 특성 (Tough Feat)",
      "maxLv": 10,
      "baseCost": 80,
      "desc": "모든 클래스의 기본 최대 체력이 레벨당 +8 영구 증가합니다.",
      "effectPerLv": 8
    },
    {
      "id": "mana_circulation",
      "name": "⚔️ 대형 무기 / 주문 명사수 (GWM / Spell Sniper)",
      "maxLv": 5,
      "baseCost": 120,
      "desc": "전투 시작 시 모든 클래스가 공격력(힘) +1 및 고유 자원 +1을 레벨당 추가로 얻습니다.",
      "effectPerLv": 1
    },
    {
      "id": "tactical_intel",
      "name": "🎲 경계 특성 (Alert Feat)",
      "maxLv": 3,
      "baseCost": 180,
      "desc": "우선권 우위! 매 전투 첫 턴에 뽑는 카드 수가 레벨당 +1장 영구 증가합니다.",
      "effectPerLv": 1
    },
    {
      "id": "guild_funding",
      "name": "🪙 하퍼즈 & 워터딥 후원금",
      "maxLv": 5,
      "baseCost": 90,
      "desc": "언더마운틴 출격 시 시작 보유 골드가 레벨당 +45G 증가합니다.",
      "effectPerLv": 45
    },
    {
      "id": "exp_accelerator",
      "name": "📜 현자의 깨달음 (Epic Boon EXP)",
      "maxLv": 5,
      "baseCost": 100,
      "desc": "던전 내 몬스터 처치 시 얻는 레벨업 경험치(EXP)가 레벨당 +25% 증가합니다.",
      "effectPerLv": 25
    },
    {
      "id": "core_overdrive",
      "name": "🌟 행운아 특성 (Lucky Feat - 마나 코어)",
      "maxLv": 1,
      "baseCost": 600,
      "desc": "모든 클래스의 매 턴 기본 행동력/주문 마나(AP)가 영구적으로 +1 증가합니다!",
      "effectPerLv": 1
    }
  ],
  "cards": {
    "ftr_sh_1": {
      "id": "ftr_sh_1",
      "name": "롱소드 베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "desc": "적에게 피해를 {damage} 줍니다. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "shared",
      "sunder": 1
    },
    "ftr_sh_2": {
      "id": "ftr_sh_2",
      "name": "전투 방패 막기",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다. 🛡️반격 +1.",
      "classId": "fighter",
      "subclassId": "shared",
      "parry": 1
    },
    "ftr_sh_3": {
      "id": "ftr_sh_3",
      "name": "재기 (Second Wind)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 9,
      "healOnHit": 3,
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 내 체력을 3 회복합니다. 주사위 +1. (소멸)",
      "classId": "fighter",
      "subclassId": "shared",
      "exhaust": true
    },
    "ftr_sh_4": {
      "id": "ftr_sh_4",
      "name": "행동 연쇄 (Action Surge)",
      "type": "skill",
      "rarity": "rare",
      "cost": 0,
      "gainEnergy": 1,
      "draw": 1,
      "upgradeDraw": 2,
      "exhaust": true,
      "desc": "0코스트! 행동력(AP) +1, 카드를 {draw}장 뽑습니다! (소멸)",
      "classId": "fighter",
      "subclassId": "shared"
    },
    "fighter_champion_1": {
      "id": "fighter_champion_1",
      "name": "향상된 치명타 베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "resourceGain": 1,
      "desc": "피해를 {damage} 줍니다. 우위 주사위 +1. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "champion",
      "sunder": 1
    },
    "fighter_champion_2": {
      "id": "fighter_champion_2",
      "name": "강철 체력 단련",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "desc": "방어도 {block}을 얻고 🛡️반격 +2 획득.",
      "classId": "fighter",
      "subclassId": "champion",
      "parry": 2
    },
    "fighter_champion_3": {
      "id": "fighter_champion_3",
      "name": "글래디에이터 돌격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "block": 4,
      "upgradeBlock": 6,
      "desc": "피해 {damage}를 주고 방어도 {block}을 얻습니다.",
      "classId": "fighter",
      "subclassId": "champion"
    },
    "fighter_champion_4": {
      "id": "fighter_champion_4",
      "name": "양손 대검 휩쓸기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "target": "all",
      "desc": "적 전체에게 피해를 {damage} 줍니다. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "champion",
      "sunder": 1
    },
    "fighter_champion_5": {
      "id": "fighter_champion_5",
      "name": "뛰어난 운동능력 (Athlete)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 카드를 {draw}장 뽑고 주사위 +1를 얻습니다. (소멸)",
      "classId": "fighter",
      "subclassId": "champion",
      "exhaust": true
    },
    "fighter_champion_6": {
      "id": "fighter_champion_6",
      "name": "추가 공격 (Extra Attack x3)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 3,
      "upgradeDamage": 5,
      "hits": 3,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 3번 연속 가합니다. 주사위 +1.",
      "classId": "fighter",
      "subclassId": "champion"
    },
    "fighter_champion_7": {
      "id": "fighter_champion_7",
      "name": "불굴의 투지 (Indomitable)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "block": 8,
      "upgradeBlock": 11,
      "doubleBlock": true,
      "desc": "방어도 {block} 획득 후 현재 방어도를 2배로 증폭합니다! (소멸) 🛡️반격 +3.",
      "classId": "fighter",
      "subclassId": "champion",
      "exhaust": true,
      "parry": 3,
      "upgradeCost": 1
    },
    "fighter_champion_8": {
      "id": "fighter_champion_8",
      "name": "우월한 치명타 (18-20 Crit)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 14,
      "upgradeDamage": 19,
      "vuln": 2,
      "desc": "치명타 강타! 피해 {damage}를 주고 취약 2를 부여합니다. 💥파쇄 +2. (현재 콤보당 피해 +2)",
      "classId": "fighter",
      "subclassId": "champion",
      "sunder": 2,
      "comboScaling": true
    },
    "fighter_champion_9": {
      "id": "fighter_champion_9",
      "name": "생존자 (Survivor 재생)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "upgradeStrength": 3,
      "metallicize": 3,
      "desc": "힘 +{strength} 및 매 턴 종료 시 방어도 +3를 영구 획득합니다.",
      "classId": "fighter",
      "subclassId": "champion",
      "upgradeCost": 1
    },
    "fighter_champion_10": {
      "id": "fighter_champion_10",
      "name": "챔피언의 무쌍 난무 (4연격)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 6,
      "upgradeDamage": 8,
      "hits": 4,
      "healOnHit": 4,
      "desc": "[전설] 피해 {damage}x4 연속 공격 후 내 체력을 4 회복합니다! (소멸) (현재 콤보당 피해 +2)",
      "classId": "fighter",
      "subclassId": "champion",
      "exhaust": true,
      "comboScaling": true
    },
    "fighter_battlemaster_1": {
      "id": "fighter_battlemaster_1",
      "name": "전술: 응수 (Riposte)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "block": 5,
      "upgradeBlock": 7,
      "resourceGain": 1,
      "desc": "피해 {damage}, 방어도 {block}, 우위 주사위 +1. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "sunder": 1
    },
    "fighter_battlemaster_2": {
      "id": "fighter_battlemaster_2",
      "name": "전술: 무장 해제 타격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "weak": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}를 주고 대상에게 약화 2를 부여합니다. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "sunder": 1
    },
    "fighter_battlemaster_3": {
      "id": "fighter_battlemaster_3",
      "name": "전술: 다리 걸기 (Trip)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "vuln": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}를 주고 대상에게 취약 2를 부여합니다. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "sunder": 1
    },
    "fighter_battlemaster_4": {
      "id": "fighter_battlemaster_4",
      "name": "전술: 발놀림 회피",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "draw": 1,
      "desc": "방어도 {block}을 얻고 카드를 1장 뽑습니다. 🛡️반격 +2.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "parry": 2
    },
    "fighter_battlemaster_5": {
      "id": "fighter_battlemaster_5",
      "name": "전술: 정밀 공격",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "strength": 1,
      "upgradeStrength": 2,
      "resourceGain": 1,
      "desc": "0코스트! 힘 +{strength} 및 우위 주사위 +1 획득. (소멸)",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "exhaust": true
    },
    "fighter_battlemaster_6": {
      "id": "fighter_battlemaster_6",
      "name": "전술: 지휘관의 호령",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "draw": 1,
      "resourceGain": 1,
      "desc": "방어도 {block}, 카드 1장 드로우, 주사위 +1. 🛡️반격 +3.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "parry": 3
    },
    "fighter_battlemaster_7": {
      "id": "fighter_battlemaster_7",
      "name": "전술: 위협 공격 (Menacing)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "weak": 2,
      "desc": "적 전체에게 피해 {damage}와 약화 2를 부여합니다. 💥파쇄 +1.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "sunder": 1
    },
    "fighter_battlemaster_8": {
      "id": "fighter_battlemaster_8",
      "name": "적 파악 (Know Your Enemy)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "dexterity": 2,
      "upgradeDexterity": 3,
      "desc": "적의 약점을 간파해 힘 +2, 민첩 +{dexterity}를 얻습니다.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "upgradeCost": 1
    },
    "fighter_battlemaster_9": {
      "id": "fighter_battlemaster_9",
      "name": "전술: 폭풍 휩쓸기",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 14,
      "target": "all",
      "bonusPerResource": 2,
      "desc": "적 전체 피해 {damage} + 보유한 주사위 1당 추가 피해 +2! 💥파쇄 +2.",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "sunder": 2
    },
    "fighter_battlemaster_10": {
      "id": "fighter_battlemaster_10",
      "name": "배틀마스터의 절대 전술서",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "vuln": 3,
      "weak": 3,
      "consumeResourceAll": true,
      "bonusPerResource": 3,
      "desc": "[전설] 적 전체 피해 {damage}(주사위당 +3) 및 취약 3, 약화 3 부여! 💥파쇄 +2. (현재 콤보당 피해 +2)",
      "classId": "fighter",
      "subclassId": "battlemaster",
      "sunder": 2,
      "comboScaling": true
    },
    "fighter_eldritch_knight_1": {
      "id": "fighter_eldritch_knight_1",
      "name": "부밍 블레이드 (뇌전검)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "addDrone": 1,
      "desc": "피해 {damage}를 주고 [비전 검기 구체] 1기를 소환합니다!",
      "classId": "fighter",
      "subclassId": "eldritch_knight"
    },
    "fighter_eldritch_knight_2": {
      "id": "fighter_eldritch_knight_2",
      "name": "그린 플레임 블레이드",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "target": "all",
      "resourceGain": 1,
      "desc": "적 전체에게 화염 검기 피해 {damage}를 주고 주사위 +1.",
      "classId": "fighter",
      "subclassId": "eldritch_knight"
    },
    "fighter_eldritch_knight_3": {
      "id": "fighter_eldritch_knight_3",
      "name": "실드 주문 (비전 방패)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "blockPerDrone": 3,
      "desc": "방어도 {block} + 소환된 검기 구체 1기당 방어도 +3! 🛡️반격 +2.",
      "classId": "fighter",
      "subclassId": "eldritch_knight",
      "parry": 2
    },
    "fighter_eldritch_knight_4": {
      "id": "fighter_eldritch_knight_4",
      "name": "무기 귀환 결속",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "addDrone": 1,
      "desc": "0코스트! 카드 {draw}장 드로우 및 검기 구체 +1기 생성. (소멸)",
      "classId": "fighter",
      "subclassId": "eldritch_knight",
      "exhaust": true
    },
    "fighter_eldritch_knight_5": {
      "id": "fighter_eldritch_knight_5",
      "name": "원소 흡수 (Absorb Elements)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "strength": 1,
      "desc": "방어도 {block}을 얻고 원소 마력을 흡수해 힘 +1! (소멸)",
      "classId": "fighter",
      "subclassId": "eldritch_knight",
      "exhaust": true
    },
    "fighter_eldritch_knight_6": {
      "id": "fighter_eldritch_knight_6",
      "name": "전쟁 마법 (War Magic)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "triggerDronesNow": true,
      "draw": 1,
      "desc": "피해 {damage}, 모든 검기 구체 즉시 발사, 카드 1장 드로우!",
      "classId": "fighter",
      "subclassId": "eldritch_knight"
    },
    "fighter_eldritch_knight_7": {
      "id": "fighter_eldritch_knight_7",
      "name": "번개 찌르기 (Lightning Lure)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "vuln": 2,
      "addDrone": 1,
      "desc": "피해 {damage}, 취약 2 부여 및 검기 구체 +1기 소환.",
      "classId": "fighter",
      "subclassId": "eldritch_knight"
    },
    "fighter_eldritch_knight_8": {
      "id": "fighter_eldritch_knight_8",
      "name": "엘드리치 스트라이크",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 17,
      "weak": 2,
      "vuln": 2,
      "triggerDronesNow": true,
      "desc": "피해 {damage}, 약화 2, 취약 2 부여 후 검기 구체 일제 폭격!",
      "classId": "fighter",
      "subclassId": "eldritch_knight"
    },
    "fighter_eldritch_knight_9": {
      "id": "fighter_eldritch_knight_9",
      "name": "비전 돌격 (Arcane Charge)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 2,
      "strength": 2,
      "dexterity": 2,
      "desc": "검기 구체 2기 소환 및 힘 +2, 민첩 +2 영구 획득!",
      "classId": "fighter",
      "subclassId": "eldritch_knight",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "fighter_eldritch_knight_10": {
      "id": "fighter_eldritch_knight_10",
      "name": "마검사의 차원 섬멸검",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 18,
      "upgradeDamage": 24,
      "target": "all",
      "addDrone": 2,
      "triggerDronesNow": true,
      "desc": "[전설] 적 전체 피해 {damage}, 구체 2기 추가 소환 후 전체 구체 총공격! 💥파쇄 +2. (현재 콤보당 피해 +2)",
      "classId": "fighter",
      "subclassId": "eldritch_knight",
      "sunder": 2,
      "comboScaling": true,
      "upgradeCost": 2
    },
    "fighter_echo_knight_1": {
      "id": "fighter_echo_knight_1",
      "name": "잔상 구현 (Manifest Echo)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "전방에 [그림자 잔상]을 소환/체력 +{summonHeal}, 공격력 +2 강화!",
      "classId": "fighter",
      "subclassId": "echo_knight"
    },
    "fighter_echo_knight_2": {
      "id": "fighter_echo_knight_2",
      "name": "잔상 협동 베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}를 주고 [그림자 잔상]이 즉시 협동 공격합니다!",
      "classId": "fighter",
      "subclassId": "echo_knight"
    },
    "fighter_echo_knight_3": {
      "id": "fighter_echo_knight_3",
      "name": "위치 교대 회피 (Swap)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "summonHeal": 4,
      "draw": 1,
      "desc": "잔상과 위치를 바꿔 방어도 {block}, 잔상 체력 +4, 카드 1장 드로우. 🛡️반격 +2.",
      "classId": "fighter",
      "subclassId": "echo_knight",
      "parry": 2
    },
    "fighter_echo_knight_4": {
      "id": "fighter_echo_knight_4",
      "name": "시간선 찌르기",
      "type": "attack",
      "rarity": "common",
      "cost": 0,
      "damage": 4,
      "upgradeDamage": 6,
      "triggerSummonAttack": true,
      "desc": "0코스트! 피해 {damage}를 주고 그림자 잔상이 즉시 협공합니다.",
      "classId": "fighter",
      "subclassId": "echo_knight"
    },
    "fighter_echo_knight_5": {
      "id": "fighter_echo_knight_5",
      "name": "화신 해방 (Unleash Incarnation)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 7,
      "hits": 2,
      "triggerSummonAttack": true,
      "summonAtkBoost": 1,
      "desc": "피해 {damage}x2, 잔상 공격력 +1 및 즉시 잔상 협공!",
      "classId": "fighter",
      "subclassId": "echo_knight"
    },
    "fighter_echo_knight_6": {
      "id": "fighter_echo_knight_6",
      "name": "그림자 순교자 (Shadow Martyr)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "summonHeal": 8,
      "desc": "내 방어도 +{block} 및 그림자 잔상의 체력을 +8 회복합니다. 🛡️반격 +3.",
      "classId": "fighter",
      "subclassId": "echo_knight",
      "parry": 3
    },
    "fighter_echo_knight_7": {
      "id": "fighter_echo_knight_7",
      "name": "차원 잔상 난무",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "target": "all",
      "triggerSummonAttack": true,
      "desc": "적 전체에게 피해 {damage}를 주고 잔상이 대상을 추가 타격합니다!",
      "classId": "fighter",
      "subclassId": "echo_knight"
    },
    "fighter_echo_knight_8": {
      "id": "fighter_echo_knight_8",
      "name": "잔상 흡수 치유 (Reclaim)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "block": 8,
      "healOnHit": 4,
      "summonHeal": 7,
      "draw": 1,
      "desc": "방어도 8, 내 체력 +4 회복, 잔상 체력 +7, 카드 1장 드로우! (소멸)",
      "classId": "fighter",
      "subclassId": "echo_knight",
      "exhaust": true,
      "upgradeCost": 1,
      "upgradeBlock": 11
    },
    "fighter_echo_knight_9": {
      "id": "fighter_echo_knight_9",
      "name": "군단 오브 원 (Legion of One)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "두 개의 잔상! 힘 +2, 잔상 체력 +12 및 공격력 +3 영구 강화!",
      "classId": "fighter",
      "subclassId": "echo_knight",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "fighter_echo_knight_10": {
      "id": "fighter_echo_knight_10",
      "name": "던전맨시: 무한 시간선 일제 베기",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 14,
      "upgradeDamage": 19,
      "damagePlusSummonHp": true,
      "triggerSummonAttack": true,
      "desc": "[전설] 피해 {damage} + 잔상의 현재 체력만큼 추가 피해 후 잔상 협공! (현재 콤보당 피해 +2)",
      "classId": "fighter",
      "subclassId": "echo_knight",
      "comboScaling": true
    },
    "bar_sh_1": {
      "id": "bar_sh_1",
      "name": "그레이트액스 강타",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "desc": "적에게 피해를 {damage} 줍니다. 🩸출혈 +1.",
      "classId": "barbarian",
      "subclassId": "shared",
      "bleed": 1
    },
    "bar_sh_2": {
      "id": "bar_sh_2",
      "name": "비무장 근육 방어",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다.",
      "classId": "barbarian",
      "subclassId": "shared"
    },
    "bar_sh_3": {
      "id": "bar_sh_3",
      "name": "무모한 공격 (Reckless)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "vuln": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}를 주고 취약 2를 부여합니다. 격노 +1. 🩸출혈 +3 부여.",
      "classId": "barbarian",
      "subclassId": "shared",
      "bleed": 3
    },
    "bar_sh_4": {
      "id": "bar_sh_4",
      "name": "격노 폭발 (Rage)",
      "type": "skill",
      "rarity": "rare",
      "cost": 0,
      "selfDamage": 2,
      "strength": 1,
      "upgradeStrength": 2,
      "block": 5,
      "resourceGain": 1,
      "desc": "0코스트! 체력 2 소모, 힘 +{strength}, 방어도 5, 격노 +1! (소멸) (혈전 시 힘 +1 추가)",
      "classId": "barbarian",
      "subclassId": "shared",
      "exhaust": true,
      "enrageBoost": 1
    },
    "barbarian_berserker_1": {
      "id": "barbarian_berserker_1",
      "name": "광란의 도끼질 (Frenzy)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "resourceGain": 1,
      "desc": "피해를 {damage} 줍니다. 격노 +1. 🩸출혈 +2 부여.",
      "classId": "barbarian",
      "subclassId": "berserker",
      "bleed": 2
    },
    "barbarian_berserker_2": {
      "id": "barbarian_berserker_2",
      "name": "피의 포효",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "strength": 1,
      "resourceGain": 1,
      "desc": "방어도 {block}, 힘 +1, 격노 +1을 얻습니다. (소멸) (혈전 시 힘 +1 추가)",
      "classId": "barbarian",
      "subclassId": "berserker",
      "exhaust": true,
      "enrageBoost": 1
    },
    "barbarian_berserker_3": {
      "id": "barbarian_berserker_3",
      "name": "머리통 쪼개기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "vuln": 2,
      "desc": "피해를 {damage} 주고 취약 2를 부여합니다. 🩸출혈 +2 부여.",
      "classId": "barbarian",
      "subclassId": "berserker",
      "bleed": 2
    },
    "barbarian_berserker_4": {
      "id": "barbarian_berserker_4",
      "name": "무자비한 돌진",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "target": "all",
      "resourceGain": 1,
      "desc": "적 전체에게 피해를 {damage} 줍니다. 격노 +1. 🩸출혈 +2 부여.",
      "classId": "barbarian",
      "subclassId": "berserker",
      "bleed": 2
    },
    "barbarian_berserker_5": {
      "id": "barbarian_berserker_5",
      "name": "광기 태세 돌입 (Mindless Rage)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 8,
      "upgradeDamage": 11,
      "stance": "wrath",
      "resourceGain": 1,
      "desc": "피해 {damage}를 주고 [광란(피해 1.75배)] 태세에 돌입합니다!",
      "classId": "barbarian",
      "subclassId": "berserker",
      "upgradeCost": 1
    },
    "barbarian_berserker_6": {
      "id": "barbarian_berserker_6",
      "name": "피의 갈증 흡혈격",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "healOnHit": 3,
      "desc": "피해를 {damage} 주고 내 체력을 3 회복합니다. (소멸) 🩸출혈 +3 부여.",
      "classId": "barbarian",
      "subclassId": "berserker",
      "exhaust": true,
      "bleed": 3
    },
    "barbarian_berserker_7": {
      "id": "barbarian_berserker_7",
      "name": "보복 (Retaliation)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 7,
      "hits": 3,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 3번 연속 줍니다. 격노 +1. 🩸출혈 +3 부여.",
      "classId": "barbarian",
      "subclassId": "berserker",
      "bleed": 3
    },
    "barbarian_berserker_8": {
      "id": "barbarian_berserker_8",
      "name": "위압적인 존재감",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "weak": 3,
      "vuln": 3,
      "target": "all",
      "exhaust": true,
      "desc": "적 전체를 공포에 빠뜨려 약화 3과 취약 3을 부여합니다! (소멸)",
      "classId": "barbarian",
      "subclassId": "berserker",
      "upgradeCost": 1,
      "upgradeVuln": 4
    },
    "barbarian_berserker_9": {
      "id": "barbarian_berserker_9",
      "name": "야만적인 치명타 (Brutal Crit)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "bonusPerResource": 3,
      "desc": "피해 {damage} + 보유한 격노 1당 추가 피해 +3! 🩸출혈 +3 부여.",
      "classId": "barbarian",
      "subclassId": "berserker",
      "bleed": 3
    },
    "barbarian_berserker_10": {
      "id": "barbarian_berserker_10",
      "name": "원시의 대재앙 (Primal Champion)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 14,
      "upgradeDamage": 19,
      "target": "all",
      "stance": "divinity",
      "consumeResourceAll": true,
      "bonusPerResource": 4,
      "desc": "[전설] 적 전체 피해 {damage}(격노당 +4) 및 [천상 광란(2.25배)] 돌입! 🩸출혈 +3 부여. (소멸)",
      "classId": "barbarian",
      "subclassId": "berserker",
      "bleed": 3,
      "upgradeCost": 2,
      "exhaust": true
    },
    "barbarian_totem_warrior_1": {
      "id": "barbarian_totem_warrior_1",
      "name": "곰 토템의 철갑",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "resourceGain": 1,
      "desc": "곰의 인내로 방어도 {block}과 격노 +1을 얻습니다.",
      "classId": "barbarian",
      "subclassId": "totem_warrior"
    },
    "barbarian_totem_warrior_2": {
      "id": "barbarian_totem_warrior_2",
      "name": "독수리 토템의 질주",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "draw": 1,
      "desc": "피해를 {damage} 주고 카드를 1장 뽑습니다.",
      "classId": "barbarian",
      "subclassId": "totem_warrior"
    },
    "barbarian_totem_warrior_3": {
      "id": "barbarian_totem_warrior_3",
      "name": "늑대 토템의 사냥",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "vuln": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}, 대상에게 취약 2 부여, 격노 +1.",
      "classId": "barbarian",
      "subclassId": "totem_warrior"
    },
    "barbarian_totem_warrior_4": {
      "id": "barbarian_totem_warrior_4",
      "name": "호랑이 토템 도약",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 7,
      "block": 5,
      "upgradeBlock": 7,
      "desc": "피해 {damage}를 주고 방어도 {block}을 얻습니다.",
      "classId": "barbarian",
      "subclassId": "totem_warrior"
    },
    "barbarian_totem_warrior_5": {
      "id": "barbarian_totem_warrior_5",
      "name": "엘크 토템의 짓밟기",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 9,
      "upgradeDamage": 12,
      "damagePerBlock": true,
      "desc": "피해 {damage} + 현재 내 방어도만큼 추가 피해를 줍니다! 🩸출혈 +3 부여.",
      "classId": "barbarian",
      "subclassId": "totem_warrior",
      "bleed": 3
    },
    "barbarian_totem_warrior_6": {
      "id": "barbarian_totem_warrior_6",
      "name": "자연과의 교감 치유",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "healOnHit": 3,
      "stance": "calm",
      "desc": "방어도 {block}, 체력 +3 회복 및 [평온(해제 시 AP+1)] 돌입! (소멸)",
      "classId": "barbarian",
      "subclassId": "totem_warrior",
      "exhaust": true
    },
    "barbarian_totem_warrior_7": {
      "id": "barbarian_totem_warrior_7",
      "name": "야수의 상 (Aspect of Beast)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "block": 6,
      "upgradeBlock": 9,
      "doubleBlock": true,
      "desc": "방어도 {block}을 얻고 현재 방어도를 2배로 만듭니다! (소멸)",
      "classId": "barbarian",
      "subclassId": "totem_warrior",
      "exhaust": true,
      "upgradeCost": 1
    },
    "barbarian_totem_warrior_8": {
      "id": "barbarian_totem_warrior_8",
      "name": "곰 토템의 불사화신",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "dexterity": 2,
      "metallicize": 3,
      "desc": "힘 +2, 민첩 +2 및 매 턴 종료 시 방어도 +3을 얻습니다!",
      "classId": "barbarian",
      "subclassId": "totem_warrior",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "barbarian_totem_warrior_9": {
      "id": "barbarian_totem_warrior_9",
      "name": "무리 우두머리의 포효",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 18,
      "target": "all",
      "weak": 2,
      "healOnHit": 3,
      "desc": "적 전체 피해 {damage}, 약화 2 부여 및 체력 3 회복. (소멸)",
      "classId": "barbarian",
      "subclassId": "totem_warrior",
      "exhaust": true
    },
    "barbarian_totem_warrior_10": {
      "id": "barbarian_totem_warrior_10",
      "name": "오대 야수신 강림",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 17,
      "upgradeDamage": 22,
      "target": "all",
      "damagePerBlock": true,
      "block": 10,
      "desc": "[전설] 방어도 +10 획득 후 적 전체에게 피해 {damage} + 내 방어도만큼 추가 피해!",
      "classId": "barbarian",
      "subclassId": "totem_warrior"
    },
    "barbarian_ancestral_guardian_1": {
      "id": "barbarian_ancestral_guardian_1",
      "name": "선조 수호령 부르기",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "block": 4,
      "desc": "전방에 [선조 수호령] 체력 +{summonHeal} 소환 및 내 방어도 +4.",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian"
    },
    "barbarian_ancestral_guardian_2": {
      "id": "barbarian_ancestral_guardian_2",
      "name": "수호령 협동 도끼질",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}를 주고 선조 수호령이 즉시 협동 공격합니다! 🩸출혈 +2 부여.",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian",
      "bleed": 2
    },
    "barbarian_ancestral_guardian_3": {
      "id": "barbarian_ancestral_guardian_3",
      "name": "영혼 방패 (Spirit Shield)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "summonHeal": 5,
      "desc": "내 방어도 +{block} 및 선조 수호령의 체력을 +5 회복합니다.",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian"
    },
    "barbarian_ancestral_guardian_4": {
      "id": "barbarian_ancestral_guardian_4",
      "name": "선조의 교란",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "weak": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}를 주고 약화 2를 부여합니다. 격노 +1.",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian"
    },
    "barbarian_ancestral_guardian_5": {
      "id": "barbarian_ancestral_guardian_5",
      "name": "복수하는 영령들",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "summonAtkBoost": 2,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}, 수호령 공격력 +2 강화 후 즉시 수호령 협공!",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian"
    },
    "barbarian_ancestral_guardian_6": {
      "id": "barbarian_ancestral_guardian_6",
      "name": "영령들과의 상담 (Consult)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "summonHeal": 5,
      "resourceGain": 1,
      "desc": "0코스트! 카드 {draw}장 드로우, 수호령 체력 +5, 격노 +1. (소멸)",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian",
      "exhaust": true
    },
    "barbarian_ancestral_guardian_7": {
      "id": "barbarian_ancestral_guardian_7",
      "name": "조상의 분노 폭발",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "triggerSummonAttack": true,
      "desc": "적 전체에게 피해 {damage}를 주고 수호령이 추가 타격합니다.",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian"
    },
    "barbarian_ancestral_guardian_8": {
      "id": "barbarian_ancestral_guardian_8",
      "name": "불멸의 부족 수호신",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 선조 수호령 체력 +12 및 공격력 +3 영구 강화!",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "barbarian_ancestral_guardian_9": {
      "id": "barbarian_ancestral_guardian_9",
      "name": "영혼 결속 치유",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "block": 8,
      "healOnHit": 4,
      "summonHeal": 9,
      "desc": "방어도 8, 내 체력 +4 회복, 수호령 체력 +9 회복! (소멸)",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian",
      "exhaust": true,
      "upgradeCost": 1,
      "upgradeBlock": 11
    },
    "barbarian_ancestral_guardian_10": {
      "id": "barbarian_ancestral_guardian_10",
      "name": "발할라 선조 군단 총돌격",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "damagePlusSummonHp": true,
      "triggerSummonAttack": true,
      "desc": "[전설] 적 전체에게 피해 {damage} + 수호령 체력만큼 추가 피해 후 협공!",
      "classId": "barbarian",
      "subclassId": "ancestral_guardian"
    },
    "barbarian_wild_magic_1": {
      "id": "barbarian_wild_magic_1",
      "name": "야생 마력 방출",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "addDrone": 1,
      "desc": "피해 {damage}를 주고 [야생 마력 구체] 1기를 생성합니다!",
      "classId": "barbarian",
      "subclassId": "wild_magic"
    },
    "barbarian_wild_magic_2": {
      "id": "barbarian_wild_magic_2",
      "name": "불안정한 보호막",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "blockPerDrone": 3,
      "desc": "방어도 {block} + 야생 마력 구체 1기당 방어도 +3!",
      "classId": "barbarian",
      "subclassId": "wild_magic"
    },
    "barbarian_wild_magic_3": {
      "id": "barbarian_wild_magic_3",
      "name": "요정빛 도끼 (Pixie Axe)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "target": "all",
      "resourceGain": 1,
      "desc": "적 전체에게 마력 피해 {damage}를 주고 격노 +1. 🩸출혈 +2 부여.",
      "classId": "barbarian",
      "subclassId": "wild_magic",
      "bleed": 2
    },
    "barbarian_wild_magic_4": {
      "id": "barbarian_wild_magic_4",
      "name": "마력 감지 (Magic Awareness)",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 카드 {draw}장을 뽑고 격노 +1를 얻습니다. (소멸)",
      "classId": "barbarian",
      "subclassId": "wild_magic",
      "exhaust": true
    },
    "barbarian_wild_magic_5": {
      "id": "barbarian_wild_magic_5",
      "name": "강화 마력 (Bolstering Magic)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "gainEnergy": 1,
      "draw": 1,
      "exhaust": true,
      "desc": "0코스트! 행동력(AP) +1, 카드 1장 드로우 (소멸)",
      "classId": "barbarian",
      "subclassId": "wild_magic",
      "upgradeDraw": 2
    },
    "barbarian_wild_magic_6": {
      "id": "barbarian_wild_magic_6",
      "name": "순간이동 강타",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "triggerDronesNow": true,
      "block": 5,
      "desc": "피해 {damage}, 방어도 5, 모든 야생 마력 구체 즉시 발사!",
      "classId": "barbarian",
      "subclassId": "wild_magic"
    },
    "barbarian_wild_magic_7": {
      "id": "barbarian_wild_magic_7",
      "name": "그림자 촉수 폭발",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "target": "all",
      "weak": 2,
      "addDrone": 1,
      "desc": "적 전체 피해 {damage}, 약화 2 부여, 마력 구체 +1기 생성.",
      "classId": "barbarian",
      "subclassId": "wild_magic"
    },
    "barbarian_wild_magic_8": {
      "id": "barbarian_wild_magic_8",
      "name": "불안정한 역류 (Backlash)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 18,
      "target": "all",
      "triggerDronesNow": true,
      "desc": "적 전체에게 피해 {damage}를 주고 모든 구체가 일제 폭격합니다!",
      "classId": "barbarian",
      "subclassId": "wild_magic"
    },
    "barbarian_wild_magic_9": {
      "id": "barbarian_wild_magic_9",
      "name": "통제된 혼돈 (Controlled Chaos)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 2,
      "strength": 2,
      "dexterity": 2,
      "desc": "야생 마력 구체 2기 생성 및 힘 +2, 민첩 +2 영구 획득!",
      "classId": "barbarian",
      "subclassId": "wild_magic",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "barbarian_wild_magic_10": {
      "id": "barbarian_wild_magic_10",
      "name": "야생 마법 대폭발 아포칼립스",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 14,
      "upgradeDamage": 19,
      "target": "all",
      "addDrone": 2,
      "triggerDronesNow": true,
      "stance": "divinity",
      "desc": "[전설] 적 전체 피해 {damage}, 구체 2기 생성&폭격 및 [초월(2.25배)] 돌입! (소멸)",
      "classId": "barbarian",
      "subclassId": "wild_magic",
      "upgradeCost": 2,
      "exhaust": true
    },
    "rog_sh_1": {
      "id": "rog_sh_1",
      "name": "독 단검 찌르기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "poison": 2,
      "upgradePoison": 3,
      "desc": "적에게 피해를 {damage} 줍니다. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "shared",
      "comboPoint": 1
    },
    "rog_sh_2": {
      "id": "rog_sh_2",
      "name": "그림자 회피 (Evasion)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다.",
      "classId": "rogue",
      "subclassId": "shared"
    },
    "rog_sh_3": {
      "id": "rog_sh_3",
      "name": "교활한 행동 (Cunning Action)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "block": 4,
      "upgradeBlock": 7,
      "draw": 1,
      "resourceGain": 1,
      "desc": "0코스트! 방어도 {block}, 카드 1장 드로우, 급소 주사위 +1. (소멸) 🗡️[투척 단검] 1장 생성.",
      "classId": "rogue",
      "subclassId": "shared",
      "exhaust": true,
      "addShiv": 1
    },
    "rog_sh_4": {
      "id": "rog_sh_4",
      "name": "급소 공격 (Sneak Attack)",
      "type": "attack",
      "rarity": "rare",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "bonusPerResource": 2,
      "resourceGain": 1,
      "desc": "피해 {damage} + 보유한 급소 주사위 1당 추가 피해 +1! ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "shared",
      "comboPoint": 2
    },
    "rogue_thief_1": {
      "id": "rogue_thief_1",
      "name": "빠른 손놀림 (Fast Hands)",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "block": 3,
      "desc": "0코스트! 카드를 {draw}장 뽑고 방어도 3를 얻습니다. (소멸) 🗡️[투척 단검] 1장 생성.",
      "classId": "rogue",
      "subclassId": "thief",
      "exhaust": true,
      "addShiv": 1
    },
    "rogue_thief_2": {
      "id": "rogue_thief_2",
      "name": "소매치기 단검",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "draw": 1,
      "resourceGain": 1,
      "desc": "피해를 {damage} 주고 카드를 1장 뽑습니다. 주사위 +1. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "thief",
      "comboPoint": 1
    },
    "rogue_thief_3": {
      "id": "rogue_thief_3",
      "name": "지붕 위 곡예 (Second-Story)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "dexterity": 1,
      "desc": "방어도 {block}을 얻고 민첩 +1을 얻습니다. (소멸)",
      "classId": "rogue",
      "subclassId": "thief",
      "exhaust": true
    },
    "rogue_thief_4": {
      "id": "rogue_thief_4",
      "name": "연막탄 투척",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "weak": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체에게 약화 2를 부여합니다.",
      "classId": "rogue",
      "subclassId": "thief"
    },
    "rogue_thief_5": {
      "id": "rogue_thief_5",
      "name": "최고의 은신 (Supreme Sneak)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "stance": "calm",
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 [은신/명경(해제 시 AP+1)] 태세에 돌입!",
      "classId": "rogue",
      "subclassId": "thief"
    },
    "rogue_thief_6": {
      "id": "rogue_thief_6",
      "name": "산성 플라스크 연사",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 2,
      "poison": 3,
      "target": "all",
      "desc": "적 전체에게 피해 {damage}x2와 산성 맹독 3를 부여합니다. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "thief",
      "comboPoint": 1
    },
    "rogue_thief_7": {
      "id": "rogue_thief_7",
      "name": "마법 장치 사용 (Use Magic Device)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "gainEnergy": 1,
      "draw": 1,
      "resourceGain": 1,
      "exhaust": true,
      "desc": "0코스트! 행동력 +1, 카드 1장 드로우, 주사위 +1 (소멸)",
      "classId": "rogue",
      "subclassId": "thief",
      "upgradeDraw": 2
    },
    "rogue_thief_8": {
      "id": "rogue_thief_8",
      "name": "도둑의 반사신경 (2회 턴)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "dexterity": 2,
      "strength": 2,
      "draw": 1,
      "desc": "민첩 +2, 힘 +2를 영구 획득하고 즉시 카드를 1장 뽑습니다!",
      "classId": "rogue",
      "subclassId": "thief",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "rogue_thief_9": {
      "id": "rogue_thief_9",
      "name": "비장의 연속 암기 투척",
      "type": "attack",
      "rarity": "rare",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 4,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 4번 연속 가합니다! 주사위 +1. ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "thief",
      "comboPoint": 2
    },
    "rogue_thief_10": {
      "id": "rogue_thief_10",
      "name": "젠타림 길드마스터의 총공격",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 14,
      "upgradeDamage": 19,
      "target": "all",
      "gainEnergy": 2,
      "draw": 1,
      "desc": "[전설] 적 전체 피해 {damage} 후 행동력(AP) +2 및 카드 1장 드로우! ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "thief",
      "comboPoint": 2
    },
    "rogue_assassin_1": {
      "id": "rogue_assassin_1",
      "name": "와이번 맹독 바르기",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "poison": 5,
      "upgradePoison": 7,
      "resourceGain": 1,
      "desc": "대상에게 와이번 맹독 {poison}을 부여합니다. 주사위 +1.",
      "classId": "rogue",
      "subclassId": "assassin"
    },
    "rogue_assassin_2": {
      "id": "rogue_assassin_2",
      "name": "암살자의 표적",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "vuln": 2,
      "poison": 2,
      "desc": "피해 {damage}, 취약 2 및 맹독 2을 부여합니다. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "assassin",
      "comboPoint": 1
    },
    "rogue_assassin_3": {
      "id": "rogue_assassin_3",
      "name": "독침 바람총",
      "type": "attack",
      "rarity": "common",
      "cost": 0,
      "damage": 4,
      "upgradeDamage": 6,
      "poison": 2,
      "resourceGain": 1,
      "desc": "0코스트! 피해 {damage}와 맹독 2를 부여합니다. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "assassin",
      "comboPoint": 1
    },
    "rogue_assassin_4": {
      "id": "rogue_assassin_4",
      "name": "그림자 망토 은폐",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "resourceGain": 1,
      "desc": "방어도 {block}과 급소 주사위 +1를 얻습니다.",
      "classId": "rogue",
      "subclassId": "assassin"
    },
    "rogue_assassin_5": {
      "id": "rogue_assassin_5",
      "name": "맹독 가스 확산",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "poison": 6,
      "upgradePoison": 8,
      "weak": 2,
      "target": "all",
      "desc": "적 전체에게 맹독 {poison}과 약화 2를 퍼뜨립니다!",
      "classId": "rogue",
      "subclassId": "assassin"
    },
    "rogue_assassin_6": {
      "id": "rogue_assassin_6",
      "name": "암살 (Assassinate 치명타)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "damagePerPoison": true,
      "desc": "피해 {damage} + 대상의 현재 맹독 수치만큼 추가 피해를 줍니다! ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "assassin",
      "comboPoint": 1
    },
    "rogue_assassin_7": {
      "id": "rogue_assassin_7",
      "name": "신경독 촉매제 (Catalyst)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "doublePoison": true,
      "triggerPoisonNow": true,
      "exhaust": true,
      "desc": "대상의 맹독을 2배로 증폭하고 즉시 맹독 피해를 터뜨립니다! (소멸)",
      "classId": "rogue",
      "subclassId": "assassin",
      "upgradeCost": 0
    },
    "rogue_assassin_8": {
      "id": "rogue_assassin_8",
      "name": "잠입 전문가의 독무",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "dexterity": 2,
      "poison": 4,
      "target": "all",
      "desc": "힘 +2, 민첩 +2을 얻고 적 전체에게 맹독 4을 부여합니다.",
      "classId": "rogue",
      "subclassId": "assassin",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "rogue_assassin_9": {
      "id": "rogue_assassin_9",
      "name": "보라 벌레 독 (Purple Worm Poison)",
      "type": "skill",
      "rarity": "rare",
      "cost": 1,
      "poison": 10,
      "upgradePoison": 14,
      "vuln": 2,
      "desc": "D&D 최강의 맹독! 대상에게 맹독 {poison}과 취약 2를 부여합니다.",
      "classId": "rogue",
      "subclassId": "assassin"
    },
    "rogue_assassin_10": {
      "id": "rogue_assassin_10",
      "name": "죽음의 일격 (Death Strike)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "doublePoison": true,
      "triggerPoisonNow": true,
      "desc": "[전설] 피해 {damage}를 주고 대상의 맹독을 2배로 증폭한 뒤 즉시 격발! (소멸) ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "assassin",
      "exhaust": true,
      "comboPoint": 2
    },
    "rogue_arcane_trickster_1": {
      "id": "rogue_arcane_trickster_1",
      "name": "마법사의 손 레저더메인",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "addDrone": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도 {block}을 얻고 [마법사의 손 구체] 1기를 소환합니다!",
      "classId": "rogue",
      "subclassId": "arcane_trickster"
    },
    "rogue_arcane_trickster_2": {
      "id": "rogue_arcane_trickster_2",
      "name": "환영 단검 투척",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "triggerDronesNow": true,
      "desc": "피해 {damage}를 주고 마법사의 손 구체가 즉시 협공합니다! ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "comboPoint": 1
    },
    "rogue_arcane_trickster_3": {
      "id": "rogue_arcane_trickster_3",
      "name": "거울 분신 (Mirror Image)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "blockPerDrone": 3,
      "desc": "방어도 {block} + 소환된 구체 1기당 방어도 +3 획득!",
      "classId": "rogue",
      "subclassId": "arcane_trickster"
    },
    "rogue_arcane_trickster_4": {
      "id": "rogue_arcane_trickster_4",
      "name": "비전 소매치기",
      "type": "attack",
      "rarity": "common",
      "cost": 0,
      "damage": 4,
      "upgradeDamage": 6,
      "draw": 1,
      "resourceGain": 1,
      "desc": "0코스트! 피해 {damage}, 카드 1장 드로우, 주사위 +1. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "comboPoint": 1
    },
    "rogue_arcane_trickster_5": {
      "id": "rogue_arcane_trickster_5",
      "name": "마법적 매복 (Magical Ambush)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "weak": 2,
      "addDrone": 1,
      "desc": "적 전체 피해 {damage}, 약화 2 부여, 구체 +1기 소환! ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "comboPoint": 1
    },
    "rogue_arcane_trickster_6": {
      "id": "rogue_arcane_trickster_6",
      "name": "타샤의 포복절도 (Hideous Laughter)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "vuln": 2,
      "weak": 2,
      "draw": 2,
      "resourceGain": 1,
      "desc": "대상에게 취약 2, 약화 2를 걸고 카드를 2장 뽑습니다.",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "upgradeCost": 1,
      "upgradeDraw": 3
    },
    "rogue_arcane_trickster_7": {
      "id": "rogue_arcane_trickster_7",
      "name": "그림자 칼날 (Shadow Blade)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "hits": 2,
      "triggerDronesNow": true,
      "desc": "피해 {damage}x2를 주고 모든 마법사의 손 구체가 일제 타격! ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "comboPoint": 1
    },
    "rogue_arcane_trickster_8": {
      "id": "rogue_arcane_trickster_8",
      "name": "다재다능한 속임수",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 2,
      "dexterity": 2,
      "strength": 2,
      "desc": "마법사의 손 구체 2기 소환 및 민첩 +2, 힘 +2 획득!",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "rogue_arcane_trickster_9": {
      "id": "rogue_arcane_trickster_9",
      "name": "상급 투명화 (Greater Invisibility)",
      "type": "skill",
      "rarity": "rare",
      "cost": 1,
      "block": 10,
      "upgradeBlock": 12,
      "stance": "calm",
      "draw": 1,
      "desc": "방어도 {block}, 카드 1장 드로우 및 [투명화/명경(AP+1)] 돌입!",
      "classId": "rogue",
      "subclassId": "arcane_trickster"
    },
    "rogue_arcane_trickster_10": {
      "id": "rogue_arcane_trickster_10",
      "name": "주문 도둑 (Spell Thief)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 17,
      "upgradeDamage": 22,
      "target": "all",
      "gainEnergy": 2,
      "triggerDronesNow": true,
      "desc": "[전설] 적의 마력을 훔쳐 전체 피해 {damage}, 행동력 +2 및 구체 총공격! ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "arcane_trickster",
      "comboPoint": 2
    },
    "rogue_phantom_1": {
      "id": "rogue_phantom_1",
      "name": "무덤에서 울리는 통곡",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}를 주고 전방의 [원한의 망령]이 즉시 협공합니다! ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "phantom",
      "comboPoint": 1
    },
    "rogue_phantom_2": {
      "id": "rogue_phantom_2",
      "name": "망자의 토큰 소환",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "block": 5,
      "desc": "[원한의 망령] 체력 +{summonHeal} 소환 및 내 방어도 +5.",
      "classId": "rogue",
      "subclassId": "phantom"
    },
    "rogue_phantom_3": {
      "id": "rogue_phantom_3",
      "name": "영혼 베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "poison": 2,
      "summonHeal": 4,
      "desc": "피해 {damage}, 영혼 저주 2 부여, 망령 체력 +4 회복. ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "phantom",
      "comboPoint": 1
    },
    "rogue_phantom_4": {
      "id": "rogue_phantom_4",
      "name": "죽음의 속삭임",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 망자의 지혜로 카드를 {draw}장 뽑고 주사위 +1. (소멸) 🗡️[투척 단검] 1장 생성.",
      "classId": "rogue",
      "subclassId": "phantom",
      "exhaust": true,
      "addShiv": 1
    },
    "rogue_phantom_5": {
      "id": "rogue_phantom_5",
      "name": "유령 걸음 (Ghost Walk)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "summonHeal": 7,
      "draw": 1,
      "desc": "비물질화! 내 방어도 +{block}, 망령 체력 +10, 카드 1장 드로우.",
      "classId": "rogue",
      "subclassId": "phantom"
    },
    "rogue_phantom_6": {
      "id": "rogue_phantom_6",
      "name": "생명력 착취 단검",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "healOnHit": 2,
      "summonHeal": 4,
      "desc": "피해 {damage}를 주고 내 체력 2, 망령 체력 6을 회복합니다. (소멸) ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "phantom",
      "exhaust": true,
      "comboPoint": 1
    },
    "rogue_phantom_7": {
      "id": "rogue_phantom_7",
      "name": "원령의 연쇄 저주",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "poison": 4,
      "target": "all",
      "triggerSummonAttack": true,
      "desc": "적 전체 피해 {damage} 및 저주 4 부여 후 망령 협공! ⚪연계 +1점.",
      "classId": "rogue",
      "subclassId": "phantom",
      "comboPoint": 1
    },
    "rogue_phantom_8": {
      "id": "rogue_phantom_8",
      "name": "영혼 장신구 공명",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 10,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 원한의 망령 체력 +16 및 공격력 +3 영구 강화!",
      "classId": "rogue",
      "subclassId": "phantom",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "rogue_phantom_9": {
      "id": "rogue_phantom_9",
      "name": "죽음의 조종자",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 15,
      "damagePlusSummonHp": true,
      "desc": "피해 {damage} + 원한의 망령 현재 체력만큼 추가 피해! ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "phantom",
      "comboPoint": 2
    },
    "rogue_phantom_10": {
      "id": "rogue_phantom_10",
      "name": "죽음의 친구 (Death Knell)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "poison": 5,
      "triggerSummonAttack": true,
      "healOnHit": 4,
      "desc": "[전설] 적 전체 피해 {damage}, 저주 5 부여, 내 체력 +4 및 망령 협공! (소멸) ⚪연계 +2점.",
      "classId": "rogue",
      "subclassId": "phantom",
      "exhaust": true,
      "comboPoint": 2
    },
    "rng_sh_1": {
      "id": "rng_sh_1",
      "name": "장궁 사격 (Longbow)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "desc": "적에게 피해를 {damage} 줍니다. 🎯표적 +1.",
      "classId": "ranger",
      "subclassId": "shared",
      "quarry": 1
    },
    "rng_sh_2": {
      "id": "rng_sh_2",
      "name": "자연의 위장막",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다. 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "shared",
      "placeTrap": 1
    },
    "rng_sh_3": {
      "id": "rng_sh_3",
      "name": "사냥꾼의 징표 (Hunter Mark)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "vuln": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}, 대상에게 취약 2 부여, 사냥꾼의 징표 +1. 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "shared",
      "quarry": 3
    },
    "rng_sh_4": {
      "id": "rng_sh_4",
      "name": "굿베리 치유 (Goodberry)",
      "type": "skill",
      "rarity": "rare",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "healOnHit": 4,
      "draw": 1,
      "desc": "방어도 {block}, 내 체력 +4 회복, 카드 1장 드로우! (소멸)",
      "classId": "ranger",
      "subclassId": "shared",
      "exhaust": true
    },
    "ranger_hunter_conclave_1": {
      "id": "ranger_hunter_conclave_1",
      "name": "거수 학살자 사격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "resourceGain": 1,
      "desc": "거인 사냥용 강사! 피해를 {damage} 줍니다. 징표 +1. 🎯표적 +2.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "quarry": 2
    },
    "ranger_hunter_conclave_2": {
      "id": "ranger_hunter_conclave_2",
      "name": "무리 파괴자 (Horde Breaker)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "target": "all",
      "resourceGain": 1,
      "desc": "적 전체에게 동시에 화살을 쏘아 피해 {damage}를 줍니다.",
      "classId": "ranger",
      "subclassId": "hunter_conclave"
    },
    "ranger_hunter_conclave_3": {
      "id": "ranger_hunter_conclave_3",
      "name": "다중 공격 회피 (Multiattack Def)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "weak": 1,
      "desc": "방어도 {block}을 얻고 대상에게 약화 1을 부여합니다. 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "placeTrap": 1
    },
    "ranger_hunter_conclave_4": {
      "id": "ranger_hunter_conclave_4",
      "name": "쌍시미터 회전베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 2,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 2번 주고 징표 +1를 얻습니다.",
      "classId": "ranger",
      "subclassId": "hunter_conclave"
    },
    "ranger_hunter_conclave_5": {
      "id": "ranger_hunter_conclave_5",
      "name": "일제 사격 (Volley)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "bonusPerResource": 2,
      "desc": "적 전체 피해 {damage} + 보유한 징표 1당 추가 피해 +2! 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "quarry": 3
    },
    "ranger_hunter_conclave_6": {
      "id": "ranger_hunter_conclave_6",
      "name": "회오리 칼날 (Whirlwind)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 3,
      "target": "all",
      "desc": "적 전체에게 피해 {damage}씩 3번 연속 폭풍 참격을 가합니다!",
      "classId": "ranger",
      "subclassId": "hunter_conclave"
    },
    "ranger_hunter_conclave_7": {
      "id": "ranger_hunter_conclave_7",
      "name": "조류 역행 (Stand Against Tide)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "vuln": 2,
      "desc": "방어도 {block}을 얻고 적의 공격을 흘려 취약 2를 부여합니다. 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "placeTrap": 1
    },
    "ranger_hunter_conclave_8": {
      "id": "ranger_hunter_conclave_8",
      "name": "거수 학살자의 각성",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "upgradeStrength": 3,
      "dexterity": 2,
      "desc": "영구적으로 힘 +{strength} 및 민첩 +2를 얻습니다.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "upgradeCost": 1
    },
    "ranger_hunter_conclave_9": {
      "id": "ranger_hunter_conclave_9",
      "name": "번개 화살 (Lightning Arrow)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 17,
      "target": "all",
      "vuln": 2,
      "desc": "적 전체에게 뇌전 화살 피해 {damage}와 취약 2를 부여합니다! 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "quarry": 3
    },
    "ranger_hunter_conclave_10": {
      "id": "ranger_hunter_conclave_10",
      "name": "화살 폭풍 소환 (Conjure Volley)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 17,
      "upgradeDamage": 22,
      "target": "all",
      "consumeResourceAll": true,
      "bonusPerResource": 4,
      "desc": "[전설] 하늘을 뒤덮는 화살비! 적 전체 피해 {damage}(징표 1당 +4)! 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "hunter_conclave",
      "quarry": 3
    },
    "ranger_beast_master_1": {
      "id": "ranger_beast_master_1",
      "name": "흑표범 구엔위바 호출",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "전방에 [흑표범 동료] 체력 +{summonHeal}, 공격력 +2 강화!",
      "classId": "ranger",
      "subclassId": "beast_master"
    },
    "ranger_beast_master_2": {
      "id": "ranger_beast_master_2",
      "name": "야수 협동 사격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}를 주고 흑표범이 즉시 적을 물어뜯습니다! 🎯표적 +2.",
      "classId": "ranger",
      "subclassId": "beast_master",
      "quarry": 2
    },
    "ranger_beast_master_3": {
      "id": "ranger_beast_master_3",
      "name": "동물 우정 치유",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "summonHeal": 5,
      "desc": "내 방어도 +{block} 및 흑표범의 체력을 +5 회복합니다.",
      "classId": "ranger",
      "subclassId": "beast_master"
    },
    "ranger_beast_master_4": {
      "id": "ranger_beast_master_4",
      "name": "원시의 발톱 명령",
      "type": "attack",
      "rarity": "common",
      "cost": 0,
      "damage": 4,
      "upgradeDamage": 6,
      "triggerSummonAttack": true,
      "desc": "0코스트! 피해 {damage}를 주고 흑표범이 즉시 협공합니다.",
      "classId": "ranger",
      "subclassId": "beast_master"
    },
    "ranger_beast_master_5": {
      "id": "ranger_beast_master_5",
      "name": "야수의 분노 (Bestial Fury)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "summonAtkBoost": 2,
      "triggerSummonAttack": true,
      "draw": 1,
      "desc": "피해 {damage}, 흑표범 공격력 +2 후 협공, 카드 1장 드로우!",
      "classId": "ranger",
      "subclassId": "beast_master"
    },
    "ranger_beast_master_6": {
      "id": "ranger_beast_master_6",
      "name": "가시 갑피 부여 (Barkskin)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "summonHeal": 8,
      "desc": "나무껍질 피부로 내 방어도 +{block} 및 흑표범 체력 +8! 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "beast_master",
      "placeTrap": 1
    },
    "ranger_beast_master_7": {
      "id": "ranger_beast_master_7",
      "name": "사냥감 물어뜯기",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "vuln": 2,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}, 취약 2 부여 후 흑표범이 치명타 협공!",
      "classId": "ranger",
      "subclassId": "beast_master"
    },
    "ranger_beast_master_8": {
      "id": "ranger_beast_master_8",
      "name": "주문 공유 (Share Spells)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "block": 8,
      "healOnHit": 3,
      "summonHeal": 8,
      "draw": 1,
      "desc": "방어도 8, 레인저 체력 +3, 흑표범 체력 +8, 카드 1장 드로우! (소멸)",
      "classId": "ranger",
      "subclassId": "beast_master",
      "exhaust": true,
      "upgradeCost": 1,
      "upgradeBlock": 11
    },
    "ranger_beast_master_9": {
      "id": "ranger_beast_master_9",
      "name": "원시 야수 군주 각성",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 흑표범의 체력 +12 및 공격력 +3 영구 강화!",
      "classId": "ranger",
      "subclassId": "beast_master",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "ranger_beast_master_10": {
      "id": "ranger_beast_master_10",
      "name": "동물 군단 소환 (Conjure Animals)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "damagePlusSummonHp": true,
      "triggerSummonAttack": true,
      "desc": "[전설] 적 전체 피해 {damage} + 야수 체력만큼 추가 피해 후 흑표범 협공!",
      "classId": "ranger",
      "subclassId": "beast_master"
    },
    "ranger_gloom_stalker_1": {
      "id": "ranger_gloom_stalker_1",
      "name": "공포의 매복자 (Dread Ambusher)",
      "type": "attack",
      "rarity": "common",
      "cost": 0,
      "damage": 5,
      "upgradeDamage": 8,
      "draw": 1,
      "resourceGain": 1,
      "desc": "0코스트 기습! 피해 {damage}, 카드 1장 드로우, 징표 +1. 🎯표적 +2.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "quarry": 2
    },
    "ranger_gloom_stalker_2": {
      "id": "ranger_gloom_stalker_2",
      "name": "암흑 시야 사격 (Umbral Sight)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "vuln": 1,
      "resourceGain": 1,
      "desc": "어둠 속에서 저격해 피해 {damage}와 취약 1을 부여합니다. 🎯표적 +2.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "quarry": 2
    },
    "ranger_gloom_stalker_3": {
      "id": "ranger_gloom_stalker_3",
      "name": "그림자 로프 은신",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 사냥꾼의 징표 +1를 얻습니다. 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "placeTrap": 1
    },
    "ranger_gloom_stalker_4": {
      "id": "ranger_gloom_stalker_4",
      "name": "흔적 없는 걸음 (Pass w/o Trace)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "draw": 1,
      "desc": "방어도 {block}을 얻고 카드를 1장 뽑습니다. 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "placeTrap": 1
    },
    "ranger_gloom_stalker_5": {
      "id": "ranger_gloom_stalker_5",
      "name": "강철 정신 (Iron Mind)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "stance": "calm",
      "draw": 1,
      "desc": "방어도 {block}, 카드 1장 드로우 및 [어둠 매복(해제 시 AP+1)] 돌입!",
      "classId": "ranger",
      "subclassId": "gloom_stalker"
    },
    "ranger_gloom_stalker_6": {
      "id": "ranger_gloom_stalker_6",
      "name": "추적자의 연사 (Stalker Flurry)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 3,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 3번 연속 퍼붓습니다! 징표 +1. 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "quarry": 3
    },
    "ranger_gloom_stalker_7": {
      "id": "ranger_gloom_stalker_7",
      "name": "그림자 회피 (Shadowy Dodge)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "weak": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체에게 약화 2를 부여합니다. 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "placeTrap": 1
    },
    "ranger_gloom_stalker_8": {
      "id": "ranger_gloom_stalker_8",
      "name": "어둠의 학살자 태세",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 8,
      "upgradeDamage": 11,
      "stance": "wrath",
      "draw": 1,
      "desc": "피해 {damage}, 카드 1장 드로우 및 [광기/학살(피해 1.75배)] 돌입! 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "quarry": 3,
      "upgradeCost": 1
    },
    "ranger_gloom_stalker_9": {
      "id": "ranger_gloom_stalker_9",
      "name": "강철 바람의 일격 (Steel Wind)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 13,
      "upgradeDamage": 18,
      "target": "all",
      "resourceGain": 1,
      "desc": "순간이동 참격! 적 전체에게 피해 {damage}를 주고 징표 +1.",
      "classId": "ranger",
      "subclassId": "gloom_stalker"
    },
    "ranger_gloom_stalker_10": {
      "id": "ranger_gloom_stalker_10",
      "name": "언더다크의 유령 (Gloom Mastery)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 13,
      "upgradeDamage": 18,
      "target": "all",
      "stance": "divinity",
      "draw": 1,
      "desc": "[전설] 적 전체 피해 {damage}, 카드 1장 드로우 및 [초월(2.25배)] 돌입! (소멸)",
      "classId": "ranger",
      "subclassId": "gloom_stalker",
      "upgradeCost": 2,
      "exhaust": true
    },
    "ranger_fey_wanderer_1": {
      "id": "ranger_fey_wanderer_1",
      "name": "무서운 타격 (Dreadful Strikes)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "addDrone": 1,
      "desc": "정신 피해 {damage}를 주고 [요정계 정령 구체] 1기를 소환합니다!",
      "classId": "ranger",
      "subclassId": "fey_wanderer"
    },
    "ranger_fey_wanderer_2": {
      "id": "ranger_fey_wanderer_2",
      "name": "안개 걸음 (Misty Step)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "draw": 1,
      "addDrone": 1,
      "desc": "방어도 {block}, 카드 1장 드로우, 요정 정령 구체 +1기 소환! 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "placeTrap": 1
    },
    "ranger_fey_wanderer_3": {
      "id": "ranger_fey_wanderer_3",
      "name": "매혹의 미소 (Otherworldly Glamour)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "weak": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체를 매혹해 약화 2를 부여합니다.",
      "classId": "ranger",
      "subclassId": "fey_wanderer"
    },
    "ranger_fey_wanderer_4": {
      "id": "ranger_fey_wanderer_4",
      "name": "가시 덩굴 화살",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 7,
      "poison": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}와 맹독 2을 부여합니다. 징표 +1. 🎯표적 +2.",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "quarry": 2
    },
    "ranger_fey_wanderer_5": {
      "id": "ranger_fey_wanderer_5",
      "name": "기망의 왜곡 (Beguiling Twist)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "weak": 2,
      "vuln": 2,
      "poison": 4,
      "target": "all",
      "desc": "적 전체에게 공포를 반사해 약화 2, 취약 2, 맹독 4 부여! 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "placeTrap": 1,
      "upgradeCost": 1,
      "upgradePoison": 6
    },
    "ranger_fey_wanderer_6": {
      "id": "ranger_fey_wanderer_6",
      "name": "요정 정령 일제 사격",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "triggerDronesNow": true,
      "draw": 1,
      "desc": "피해 {damage}, 모든 요정 정령 구체 즉시 공격, 카드 1장 드로우! 🎯표적 +3.",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "quarry": 3
    },
    "ranger_fey_wanderer_7": {
      "id": "ranger_fey_wanderer_7",
      "name": "가시 밭 증식 (Spike Growth)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "blockPerDrone": 4,
      "desc": "방어도 {block} + 소환된 요정 정령 구체 1기당 방어도 +4! 🪤전술 함정 +1 매설.",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "placeTrap": 1
    },
    "ranger_fey_wanderer_8": {
      "id": "ranger_fey_wanderer_8",
      "name": "페이와일드 보강 (Fey Reinforce)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 2,
      "strength": 2,
      "dexterity": 2,
      "desc": "요정 정령 구체 2기 즉시 소환 및 힘 +2, 민첩 +2 획득!",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "ranger_fey_wanderer_9": {
      "id": "ranger_fey_wanderer_9",
      "name": "안개 속의 방랑자",
      "type": "skill",
      "rarity": "rare",
      "cost": 0,
      "gainEnergy": 1,
      "draw": 1,
      "exhaust": true,
      "desc": "0코스트! 행동력 +1, 카드 1장 드로우,(소멸)",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "upgradeDraw": 2
    },
    "ranger_fey_wanderer_10": {
      "id": "ranger_fey_wanderer_10",
      "name": "여름 여왕 티타니아의 심판",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 16,
      "upgradeDamage": 21,
      "target": "all",
      "addDrone": 2,
      "triggerDronesNow": true,
      "healOnHit": 4,
      "desc": "[전설] 적 전체 피해 {damage}, 내 체력 +4, 요정 구체 2기 소환 및 총공격! (소멸)",
      "classId": "ranger",
      "subclassId": "fey_wanderer",
      "exhaust": true,
      "upgradeCost": 2
    },
    "wiz_sh_1": {
      "id": "wiz_sh_1",
      "name": "파이어 볼트 (Fire Bolt)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "desc": "화염 피해를 {damage} 줍니다. 비전 주문력 +1.",
      "classId": "wizard",
      "subclassId": "shared",
      "resourceGain": 1
    },
    "wiz_sh_2": {
      "id": "wiz_sh_2",
      "name": "마법사 갑옷 (Mage Armor)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다.",
      "classId": "wizard",
      "subclassId": "shared"
    },
    "wiz_sh_3": {
      "id": "wiz_sh_3",
      "name": "매직 미사일 (Magic Missile)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 3,
      "upgradeDamage": 5,
      "hits": 3,
      "addDrone": 1,
      "desc": "필중 마력탄 피해 {damage}x3 및 [비전 구체] 1기를 생성합니다!",
      "classId": "wizard",
      "subclassId": "shared",
      "orbType": "lightning"
    },
    "wiz_sh_4": {
      "id": "wiz_sh_4",
      "name": "실드 주문 (Shield)",
      "type": "skill",
      "rarity": "rare",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "blockPerDrone": 3,
      "draw": 1,
      "desc": "방어도 {block} + 비전 구체 1기당 방어도 +3! 카드 1장 드로우.",
      "classId": "wizard",
      "subclassId": "shared"
    },
    "wizard_evocation_1": {
      "id": "wizard_evocation_1",
      "name": "타오르는 손길 (Burning Hands)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "target": "all",
      "resourceGain": 1,
      "desc": "적 전체에게 화염 피해를 {damage} 줍니다. 주문력 +1. 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "fire"
    },
    "wizard_evocation_2": {
      "id": "wizard_evocation_2",
      "name": "색채 보주 (Chromatic Orb)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "addDrone": 1,
      "desc": "원소 구체를 던져 피해 {damage}를 주고 비전 구체 +1기 생성!",
      "classId": "wizard",
      "subclassId": "evocation",
      "orbType": "lightning"
    },
    "wizard_evocation_3": {
      "id": "wizard_evocation_3",
      "name": "작열 광선 (Scorching Ray)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 3,
      "upgradeDamage": 5,
      "hits": 3,
      "resourceGain": 1,
      "desc": "화염 광선 3줄기로 피해 {damage}x3을 줍니다. 주문력 +1. 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "fire"
    },
    "wizard_evocation_4": {
      "id": "wizard_evocation_4",
      "name": "화염 방패 (Fire Shield)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 비전 주문력 +1를 충전합니다. 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "orbType": "fire",
      "addDrone": 1
    },
    "wizard_evocation_5": {
      "id": "wizard_evocation_5",
      "name": "파이어볼 (3레벨 Fireball)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 15,
      "target": "all",
      "resourceGain": 1,
      "desc": "대폭발! 적 전체에게 화염 피해를 {damage} 줍니다. 주문력 +1. 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "fire"
    },
    "wizard_evocation_6": {
      "id": "wizard_evocation_6",
      "name": "라이트닝 볼트 (Lightning Bolt)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "triggerDronesNow": true,
      "desc": "적 전체 뇌전 피해 {damage} 및 모든 비전 구체 즉시 발사!",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "lightning"
    },
    "wizard_evocation_7": {
      "id": "wizard_evocation_7",
      "name": "냉기 원뿔 (Cone of Cold)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 10,
      "upgradeDamage": 13,
      "target": "all",
      "weak": 2,
      "vuln": 2,
      "desc": "적 전체 냉기 피해 {damage} 및 약화 2, 취약 2 부여! ❄️동상 +3 & [냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "frost",
      "frostbite": 3
    },
    "wizard_evocation_8": {
      "id": "wizard_evocation_8",
      "name": "강화된 방출 (Empowered Evocation)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "upgradeStrength": 3,
      "addDrone": 2,
      "desc": "주문 공격력(힘) +{strength} 및 비전 구체 2기 즉시 생성! 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "orbType": "fire",
      "upgradeCost": 1
    },
    "wizard_evocation_9": {
      "id": "wizard_evocation_9",
      "name": "과채널링 (Overchannel)",
      "type": "attack",
      "rarity": "rare",
      "cost": 1,
      "damage": 12,
      "upgradeDamage": 17,
      "bonusPerResource": 2,
      "desc": "최대 위력 주문! 피해 {damage} + 보유한 주문력 1당 피해 +2! 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "fire"
    },
    "wizard_evocation_10": {
      "id": "wizard_evocation_10",
      "name": "메테오 스웜 (9레벨 궁극 주문)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 18,
      "upgradeDamage": 24,
      "target": "all",
      "consumeResourceAll": true,
      "bonusPerResource": 3,
      "triggerDronesNow": true,
      "desc": "[전설] 적 전체 운석 폭격 {damage}(주문력당 +3) 및 모든 구체 일제 발사! 🔥[화염 구체] 영창.",
      "classId": "wizard",
      "subclassId": "evocation",
      "addDrone": 1,
      "orbType": "fire"
    },
    "wizard_abjuration_1": {
      "id": "wizard_abjuration_1",
      "name": "비전 수호막 (Arcane Ward)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "addDrone": 1,
      "desc": "방어도 {block}을 얻고 수호 구체 +1기를 생성합니다. ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "orbType": "frost"
    },
    "wizard_abjuration_2": {
      "id": "wizard_abjuration_2",
      "name": "마법 무효화 (Counterspell)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "weak": 2,
      "desc": "적의 주문을 차단해 방어도 {block}과 약화 2를 부여합니다. ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost"
    },
    "wizard_abjuration_3": {
      "id": "wizard_abjuration_3",
      "name": "방호의 문양 (Glyph of Warding)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "block": 5,
      "upgradeBlock": 7,
      "desc": "폭발 문양으로 피해 {damage}와 방어도 {block}을 동시에 얻습니다. ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost"
    },
    "wizard_abjuration_4": {
      "id": "wizard_abjuration_4",
      "name": "마력 흡수 방벽",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "resourceGain": 1,
      "draw": 1,
      "desc": "방어도 {block}, 주문력 +1, 카드 1장 드로우. ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost"
    },
    "wizard_abjuration_5": {
      "id": "wizard_abjuration_5",
      "name": "투사된 수호막 (Projected Ward)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "block": 8,
      "upgradeBlock": 11,
      "doubleBlock": true,
      "desc": "방어도 {block}을 얻은 뒤 현재 방어도를 2배로 증폭합니다! (소멸) ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "exhaust": true,
      "addDrone": 1,
      "orbType": "frost",
      "upgradeCost": 1
    },
    "wizard_abjuration_6": {
      "id": "wizard_abjuration_6",
      "name": "수호막 반사 충격파",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 8,
      "upgradeDamage": 11,
      "damagePerBlock": true,
      "desc": "피해 {damage} + 현재 내 방어도만큼 추가 반사 피해를 줍니다! ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost"
    },
    "wizard_abjuration_7": {
      "id": "wizard_abjuration_7",
      "name": "추방 (Banishment)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "weak": 3,
      "vuln": 2,
      "block": 6,
      "exhaust": true,
      "desc": "대상을 이차원으로 추방해 약화 3, 취약 2 부여 및 방어도 6 (소멸) ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost",
      "upgradeCost": 1,
      "upgradeBlock": 9
    },
    "wizard_abjuration_8": {
      "id": "wizard_abjuration_8",
      "name": "주문 저항 (Spell Resistance)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "dexterity": 2,
      "upgradeDexterity": 3,
      "metallicize": 3,
      "desc": "민첩 +{dexterity} 및 매 턴 종료 시 방어도 +3를 영구 획득합니다! ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost",
      "upgradeCost": 1
    },
    "wizard_abjuration_9": {
      "id": "wizard_abjuration_9",
      "name": "무적의 구체 (Globe of Invulnerability)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "block": 15,
      "upgradeBlock": 20,
      "draw": 1,
      "stance": "calm",
      "desc": "방어도 {block}, 카드 1장 드로우 및 [명경(해제 시 AP+1)] 돌입! ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "frost"
    },
    "wizard_abjuration_10": {
      "id": "wizard_abjuration_10",
      "name": "프리즈매틱 월 (9레벨 무지개 성벽)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "block": 12,
      "weak": 3,
      "vuln": 3,
      "desc": "[전설] 방어도 +12 획득 및 적 전체에게 7색 광선 피해 {damage}, 약화 3, 취약 3! ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "abjuration",
      "addDrone": 1,
      "orbType": "lightning",
      "upgradeCost": 2
    },
    "wizard_necromancy_1": {
      "id": "wizard_necromancy_1",
      "name": "언데드 조종 (Animate Dead)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "전방에 [해골 기사]를 소환/체력 +{summonHeal}, 공격력 +2 강화!",
      "classId": "wizard",
      "subclassId": "necromancy"
    },
    "wizard_necromancy_2": {
      "id": "wizard_necromancy_2",
      "name": "칠 터치 (Chill Touch)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "triggerSummonAttack": true,
      "desc": "사령의 손길로 피해 {damage}를 주고 해골 기사가 즉시 협공합니다!",
      "classId": "wizard",
      "subclassId": "necromancy"
    },
    "wizard_necromancy_3": {
      "id": "wizard_necromancy_3",
      "name": "도리깨 종소리 (Toll the Dead)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "poison": 2,
      "desc": "사령의 종소리로 피해 {damage}와 부패 2을 부여합니다.",
      "classId": "wizard",
      "subclassId": "necromancy"
    },
    "wizard_necromancy_4": {
      "id": "wizard_necromancy_4",
      "name": "가짜 생명 (False Life)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "summonHeal": 5,
      "desc": "내 방어도 +{block} 및 해골 기사의 체력을 +5 회복합니다.",
      "classId": "wizard",
      "subclassId": "necromancy"
    },
    "wizard_necromancy_5": {
      "id": "wizard_necromancy_5",
      "name": "흡혈의 손길 (Vampiric Touch)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "healOnHit": 2,
      "summonHeal": 4,
      "desc": "피해 {damage}를 주고 내 체력 2, 해골 기사 체력 4을 회복합니다! (소멸)",
      "classId": "wizard",
      "subclassId": "necromancy",
      "exhaust": true
    },
    "wizard_necromancy_6": {
      "id": "wizard_necromancy_6",
      "name": "약화의 광선 (Ray of Enfeeblement)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "weak": 3,
      "poison": 4,
      "target": "all",
      "desc": "적 전체의 근력을 앗아가 약화 3과 부패 4을 부여합니다.",
      "classId": "wizard",
      "subclassId": "necromancy",
      "upgradeCost": 0,
      "upgradePoison": 6
    },
    "wizard_necromancy_7": {
      "id": "wizard_necromancy_7",
      "name": "죽음의 무도 (Danse Macabre)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "summonAtkBoost": 2,
      "triggerSummonAttack": true,
      "draw": 1,
      "desc": "피해 {damage}, 해골 기사 공격력 +2 후 즉시 협공, 카드 1장 드로우!",
      "classId": "wizard",
      "subclassId": "necromancy"
    },
    "wizard_necromancy_8": {
      "id": "wizard_necromancy_8",
      "name": "그림 하베스트 (Grim Harvest)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "주문력 +2, 해골 기사 체력 +12 및 공격력 +3 영구 강화!",
      "classId": "wizard",
      "subclassId": "necromancy",
      "resourceGain": 2,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "wizard_necromancy_9": {
      "id": "wizard_necromancy_9",
      "name": "죽음의 원 (Circle of Death)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 16,
      "target": "all",
      "poison": 4,
      "triggerSummonAttack": true,
      "desc": "적 전체에게 사령 피해 {damage}, 부패 4 부여 및 해골 기사 협공!",
      "classId": "wizard",
      "subclassId": "necromancy"
    },
    "wizard_necromancy_10": {
      "id": "wizard_necromancy_10",
      "name": "권능어: 죽음 (9레벨 Power Word Kill)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 19,
      "upgradeDamage": 26,
      "damagePlusSummonHp": true,
      "healOnHit": 5,
      "desc": "[전설] 피해 {damage} + 해골 기사 체력만큼 즉사급 피해 및 내 체력 +5 회복! (소멸)",
      "classId": "wizard",
      "subclassId": "necromancy",
      "exhaust": true
    },
    "wizard_divination_1": {
      "id": "wizard_divination_1",
      "name": "예지 주사위 (Portent)",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 미래를 엿보아 카드 {draw}장을 뽑고 주문력 +1. (소멸) ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "exhaust": true,
      "addDrone": 1,
      "orbType": "lightning"
    },
    "wizard_divination_2": {
      "id": "wizard_divination_2",
      "name": "정신 쐐기 (Mind Spike)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "vuln": 1,
      "draw": 1,
      "desc": "피해 {damage}, 취약 1 부여 후 카드를 1장 뽑습니다. ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "lightning"
    },
    "wizard_divination_3": {
      "id": "wizard_divination_3",
      "name": "예지자의 방벽",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "draw": 1,
      "resourceGain": 1,
      "desc": "방어도 {block}, 카드 1장 드로우, 주문력 +1. ❄️[냉기 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "frost"
    },
    "wizard_divination_4": {
      "id": "wizard_divination_4",
      "name": "진실의 시선 (True Strike)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "vuln": 2,
      "resourceGain": 1,
      "desc": "약점을 꿰뚫어 피해 {damage}와 취약 2를 부여합니다. 주문력 +1. ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "lightning"
    },
    "wizard_divination_5": {
      "id": "wizard_divination_5",
      "name": "제3의 눈 개안 (Third Eye)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "block": 8,
      "upgradeBlock": 11,
      "stance": "calm",
      "draw": 1,
      "desc": "방어도 {block}, 카드 1장 드로우 및 [예지/명경(해제 시 AP+1)] 돌입! ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "lightning",
      "upgradeCost": 1
    },
    "wizard_divination_6": {
      "id": "wizard_divination_6",
      "name": "전문 예지 (Expert Divination)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "gainEnergy": 1,
      "draw": 1,
      "resourceGain": 1,
      "exhaust": true,
      "desc": "0코스트! 주문 슬롯을 회수해 행동력 +1, 카드 1장 드로우, 주문력 +1 (소멸)",
      "classId": "wizard",
      "subclassId": "divination",
      "upgradeDraw": 2
    },
    "wizard_divination_7": {
      "id": "wizard_divination_7",
      "name": "운명 왜곡 광선",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "weak": 2,
      "vuln": 2,
      "desc": "피해 {damage}를 주고 대상의 운명을 비틀어 약화 2, 취약 2 부여! ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "lightning"
    },
    "wizard_divination_8": {
      "id": "wizard_divination_8",
      "name": "가속 (Haste)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "dexterity": 2,
      "addDrone": 1,
      "draw": 1,
      "desc": "힘 +2, 민첩 +2, 비전 구체 +1기 생성 및 카드 1장 드로우!",
      "classId": "wizard",
      "subclassId": "divination",
      "orbType": "lightning",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "wizard_divination_9": {
      "id": "wizard_divination_9",
      "name": "선견지명 (9레벨 Foresight)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "stance": "calm",
      "block": 8,
      "draw": 1,
      "desc": "미래를 예측해 방어도 {block}, 카드 1장 드로우 및 [명경(해제 시 AP+1)] 돌입! (소멸) ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "lightning",
      "upgradeCost": 1,
      "upgradeBlock": 11,
      "exhaust": true
    },
    "wizard_divination_10": {
      "id": "wizard_divination_10",
      "name": "시간 정지 (9레벨 Time Stop)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "gainEnergy": 2,
      "draw": 1,
      "desc": "[전설] 시간을 멈춰 적 전체 피해 {damage} 후 행동력(AP) +2 및 카드 1장 드로우! ⚡[번개 구체] 영창.",
      "classId": "wizard",
      "subclassId": "divination",
      "addDrone": 1,
      "orbType": "lightning"
    },
    "clr_sh_1": {
      "id": "clr_sh_1",
      "name": "신성한 불꽃 (Sacred Flame)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "desc": "적에게 피해를 {damage} 줍니다. ☀️낙인 +1, 신앙심 +1.",
      "classId": "cleric",
      "subclassId": "shared",
      "devotionGain": 1,
      "holyBrand": 1
    },
    "clr_sh_2": {
      "id": "clr_sh_2",
      "name": "신앙의 방패 (Shield of Faith)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "shared",
      "devotionGain": 1
    },
    "clr_sh_3": {
      "id": "clr_sh_3",
      "name": "가이딩 볼트 (Guiding Bolt)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "vuln": 2,
      "resourceGain": 1,
      "desc": "광휘 피해 {damage}를 주고 취약 2를 부여합니다! 신성력 +1. ☀️성스러운 낙인 +2 (신앙심 +1).",
      "classId": "cleric",
      "subclassId": "shared",
      "devotionGain": 1,
      "holyBrand": 2
    },
    "clr_sh_4": {
      "id": "clr_sh_4",
      "name": "영혼의 수호자 (Spirit Guardians)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 1,
      "block": 5,
      "upgradeBlock": 8,
      "triggerDronesNow": true,
      "desc": "방어도 {block}, [천상의 수호령 구체] 1기 소환 및 즉시 광휘 타격! (💛초과치유 시 방어도 전환, 신앙심 +2)",
      "classId": "cleric",
      "subclassId": "shared",
      "healOnHit": 5,
      "devotionGain": 2,
      "upgradeCost": 1
    },
    "cleric_life_domain_1": {
      "id": "cleric_life_domain_1",
      "name": "치유의 기원 (Healing Word)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 내 체력을 3 회복, 신성력 +1. (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "healOnHit": 3,
      "devotionGain": 1
    },
    "cleric_life_domain_2": {
      "id": "cleric_life_domain_2",
      "name": "생명의 사도 타격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "desc": "광휘 피해 {damage}를 주고 내 체력을 3 회복합니다. (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "devotionGain": 1,
      "healOnHit": 3
    },
    "cleric_life_domain_3": {
      "id": "cleric_life_domain_3",
      "name": "축복 (Bless)",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "strength": 1,
      "upgradeStrength": 2,
      "block": 3,
      "draw": 1,
      "desc": "0코스트! 힘 +{strength}, 방어도 3, 카드 1장 드로우. (소멸) (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "exhaust": true,
      "devotionGain": 1
    },
    "cleric_life_domain_4": {
      "id": "cleric_life_domain_4",
      "name": "수호의 유대 (Warding Bond)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 신성력 +1를 얻습니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "devotionGain": 1
    },
    "cleric_life_domain_5": {
      "id": "cleric_life_domain_5",
      "name": "생명 보존 (Preserve Life)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "healOnHit": 5,
      "summonHeal": 7,
      "desc": "신성력 전달! 방어도 {block}, 내 체력 +5, 소환수 체력 +7 회복! (소멸) (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "exhaust": true,
      "devotionGain": 1
    },
    "cleric_life_domain_6": {
      "id": "cleric_life_domain_6",
      "name": "대규모 치유의 단어",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "healOnHit": 3,
      "draw": 1,
      "desc": "방어도 {block}, 내 체력 +3 회복 및 카드 1장 드로우! (소멸) (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "exhaust": true,
      "devotionGain": 1
    },
    "cleric_life_domain_7": {
      "id": "cleric_life_domain_7",
      "name": "희망의 등불 (Beacon of Hope)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "stance": "calm",
      "resourceGain": 1,
      "desc": "방어도 {block}, 신성력 +1 및 [은총/명경(해제 시 AP+1)] 돌입! (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "devotionGain": 1
    },
    "cleric_life_domain_8": {
      "id": "cleric_life_domain_8",
      "name": "축복받은 치유사 (Blessed Healer)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "dexterity": 2,
      "strength": 2,
      "metallicize": 3,
      "desc": "민첩 +2, 힘 +2 및 매 턴 종료 시 방어도 +3를 영구 획득합니다! (신앙심 +2)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "devotionGain": 2,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "cleric_life_domain_9": {
      "id": "cleric_life_domain_9",
      "name": "신성한 강타 심판",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 15,
      "damagePerBlock": true,
      "desc": "피해 {damage} + 현재 내 방어도만큼 추가 광휘 피해를 줍니다! ☀️성스러운 낙인 +2 (신앙심 +2).",
      "classId": "cleric",
      "subclassId": "life_domain",
      "devotionGain": 2,
      "holyBrand": 2
    },
    "cleric_life_domain_10": {
      "id": "cleric_life_domain_10",
      "name": "최고의 치유 (9레벨 Mass Heal)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "target": "all",
      "healOnHit": 9,
      "block": 10,
      "desc": "[전설] 내 체력 +9 회복, 방어도 +10 및 적 전체에게 정화의 빛 {damage} 피해! (소멸) (💛초과치유 시 방어도 전환, 신앙심 +2)",
      "classId": "cleric",
      "subclassId": "life_domain",
      "exhaust": true,
      "devotionGain": 2
    },
    "cleric_light_domain_1": {
      "id": "cleric_light_domain_1",
      "name": "수호의 섬광 (Warding Flare)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "weak": 2,
      "desc": "눈부신 섬광으로 방어도 {block}을 얻고 적에게 약화 2를 부여합니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1
    },
    "cleric_light_domain_2": {
      "id": "cleric_light_domain_2",
      "name": "타오르는 빛줄기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "poison": 2,
      "addDrone": 1,
      "desc": "피해 {damage}, 화상 2 부여 및 [태양 광휘 구체] 1기 소환! ☀️성스러운 낙인 +2 (신앙심 +1).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1,
      "holyBrand": 2
    },
    "cleric_light_domain_3": {
      "id": "cleric_light_domain_3",
      "name": "요정 불꽃 (Faerie Fire)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "vuln": 2,
      "target": "all",
      "draw": 1,
      "resourceGain": 1,
      "desc": "적 전체를 빛으로 감싸 취약 2를 부여하고 카드를 1장 뽑습니다. ☀️성스러운 낙인 +2 (신앙심 +1).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1,
      "holyBrand": 2,
      "upgradeCost": 0,
      "upgradeDraw": 2
    },
    "cleric_light_domain_4": {
      "id": "cleric_light_domain_4",
      "name": "낮빛 구체 (Daylight)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "blockPerDrone": 3,
      "desc": "방어도 {block} + 소환된 광휘 구체 1기당 방어도 +3! ☀️성스러운 낙인 +2 (신앙심 +1).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1,
      "holyBrand": 2
    },
    "cleric_light_domain_5": {
      "id": "cleric_light_domain_5",
      "name": "여명의 광휘 (Radiance of Dawn)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "poison": 3,
      "weak": 2,
      "desc": "어둠을 걷어내는 태양빛! 적 전체 피해 {damage}, 화상 3, 약화 2! ☀️성스러운 낙인 +2 (신앙심 +1).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1,
      "holyBrand": 2
    },
    "cleric_light_domain_6": {
      "id": "cleric_light_domain_6",
      "name": "라센더의 파이어볼",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 15,
      "target": "all",
      "triggerDronesNow": true,
      "desc": "적 전체에게 태양 화염 피해 {damage}를 주고 모든 광휘 구체 발사! (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1
    },
    "cleric_light_domain_7": {
      "id": "cleric_light_domain_7",
      "name": "화염 장벽 (Wall of Fire)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "poison": 4,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체에게 화상 4을 부여합니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 1
    },
    "cleric_light_domain_8": {
      "id": "cleric_light_domain_8",
      "name": "플레임 스트라이크 (5레벨 주문)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 18,
      "target": "all",
      "vuln": 2,
      "triggerDronesNow": true,
      "desc": "천상의 불기둥! 적 전체 피해 {damage}, 취약 2 및 구체 일제 폭격! ☀️성스러운 낙인 +2 (신앙심 +2).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 2,
      "holyBrand": 2
    },
    "cleric_light_domain_9": {
      "id": "cleric_light_domain_9",
      "name": "빛의 코로나 (Corona of Light)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 2,
      "strength": 2,
      "dexterity": 2,
      "desc": "태양 광휘 구체 2기 소환 및 힘 +2, 민첩 +2 영구 획득! ☀️성스러운 낙인 +2 (신앙심 +2).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 2,
      "holyBrand": 2,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "cleric_light_domain_10": {
      "id": "cleric_light_domain_10",
      "name": "선버스트 (8레벨 태양 대폭발)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 18,
      "upgradeDamage": 24,
      "target": "all",
      "poison": 5,
      "weak": 3,
      "triggerDronesNow": true,
      "desc": "[전설] 적 전체 태양 폭발 피해 {damage}, 화상 5, 실명(약화 3) 및 구체 총공격! ☀️성스러운 낙인 +2 (신앙심 +2).",
      "classId": "cleric",
      "subclassId": "light_domain",
      "devotionGain": 2,
      "holyBrand": 2
    },
    "cleric_war_domain_1": {
      "id": "cleric_war_domain_1",
      "name": "전쟁 사제의 연격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 2,
      "resourceGain": 1,
      "desc": "전쟁망치로 피해 {damage}x2를 주고 신성력 +1를 얻습니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 1
    },
    "cleric_war_domain_2": {
      "id": "cleric_war_domain_2",
      "name": "영체 대검 수호자 소환",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "전방에 [영체 대검 수호자] 체력 +{summonHeal}, 공격력 +2 소환! (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "healOnHit": 3,
      "devotionGain": 1
    },
    "cleric_war_domain_3": {
      "id": "cleric_war_domain_3",
      "name": "전쟁신의 일격 (Guided Strike)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "triggerSummonAttack": true,
      "desc": "명중률 보정! 피해 {damage}를 주고 영체 수호자가 즉시 협공합니다! (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 1
    },
    "cleric_war_domain_4": {
      "id": "cleric_war_domain_4",
      "name": "신성한 갑주 무장",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "summonHeal": 4,
      "desc": "내 방어도 +{block} 및 영체 수호자의 체력을 +4 회복합니다. (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "healOnHit": 3,
      "devotionGain": 1
    },
    "cleric_war_domain_5": {
      "id": "cleric_war_domain_5",
      "name": "십자군의 망토 (Crusader Mantle)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "strength": 1,
      "summonAtkBoost": 2,
      "block": 6,
      "desc": "방어도 6, 내 힘 +1 및 영체 수호자 공격력을 +2 강화합니다! (소멸) (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "exhaust": true,
      "healOnHit": 3,
      "devotionGain": 1,
      "upgradeCost": 0,
      "upgradeBlock": 9
    },
    "cleric_war_domain_6": {
      "id": "cleric_war_domain_6",
      "name": "전쟁신의 축복 협공",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "vuln": 2,
      "triggerSummonAttack": true,
      "draw": 1,
      "desc": "피해 {damage}, 취약 2 부여, 수호자 협공 및 카드 1장 드로우! (💛초과치유 시 방어도 전환, 신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 1
    },
    "cleric_war_domain_7": {
      "id": "cleric_war_domain_7",
      "name": "스피리추얼 웨폰 (0코스트)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 0,
      "damage": 5,
      "upgradeDamage": 7,
      "triggerSummonAttack": true,
      "desc": "0코스트 보너스 행동! 피해 {damage} 및 영체 수호자 즉시 협공! (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 1
    },
    "cleric_war_domain_8": {
      "id": "cleric_war_domain_8",
      "name": "전투의 화신 (Avatar of Battle)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 영체 수호자의 체력 +12 및 공격력 +3 영구 강화! (신앙심 +2)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 2,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "cleric_war_domain_9": {
      "id": "cleric_war_domain_9",
      "name": "신성한 강타 철퇴",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 17,
      "damagePlusSummonHp": true,
      "desc": "피해 {damage} + 영체 수호자의 현재 체력만큼 추가 피해! (신앙심 +2)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 2
    },
    "cleric_war_domain_10": {
      "id": "cleric_war_domain_10",
      "name": "템푸스의 전쟁신 강림",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 13,
      "upgradeDamage": 18,
      "target": "all",
      "stance": "divinity",
      "triggerSummonAttack": true,
      "desc": "[전설] 적 전체 피해 {damage}, 영체 수호자 협공 및 [천상 강림(2.25배)] 돌입! (신앙심 +2) (소멸)",
      "classId": "cleric",
      "subclassId": "war_domain",
      "devotionGain": 2,
      "upgradeCost": 2,
      "exhaust": true
    },
    "cleric_grave_domain_1": {
      "id": "cleric_grave_domain_1",
      "name": "사멸의 원 (Circle of Mortality)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "poison": 2,
      "resourceGain": 1,
      "desc": "피해 {damage}와 사령 저주(맹독) 3을 부여합니다. 신성력 +1. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 1
    },
    "cleric_grave_domain_2": {
      "id": "cleric_grave_domain_2",
      "name": "무덤의 눈길 (Eyes of Grave)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "vuln": 2,
      "desc": "방어도 {block}을 얻고 죽음의 그림자를 읽어 취약 2를 부여합니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 1
    },
    "cleric_grave_domain_3": {
      "id": "cleric_grave_domain_3",
      "name": "부패의 저주 (Bane)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "weak": 2,
      "poison": 3,
      "target": "all",
      "desc": "적 전체에게 약화 2와 사령 저주 3를 부여합니다. (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 1,
      "upgradeCost": 0,
      "upgradePoison": 5
    },
    "cleric_grave_domain_4": {
      "id": "cleric_grave_domain_4",
      "name": "영혼 인도의 등불",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 카드를 {draw}장 뽑고 신성력 +1를 얻습니다. (소멸) (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "exhaust": true,
      "devotionGain": 1
    },
    "cleric_grave_domain_5": {
      "id": "cleric_grave_domain_5",
      "name": "무덤으로 향하는 길 (Path to Grave)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "vuln": 3,
      "stance": "wrath",
      "draw": 2,
      "desc": "대상에게 취약 3 부여, [심판(피해 1.75배)] 태세 돌입, 카드 2장 드로우! (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 1,
      "upgradeCost": 1,
      "upgradeDraw": 3
    },
    "cleric_grave_domain_6": {
      "id": "cleric_grave_domain_6",
      "name": "죽음의 문턱 파수꾼 (Sentinel)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "healOnHit": 3,
      "stance": "calm",
      "desc": "적의 치명타를 무효화해 방어도 {block}, 체력 +3, [명경(AP+1)] 돌입! (소멸) (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "exhaust": true,
      "devotionGain": 1
    },
    "cleric_grave_domain_7": {
      "id": "cleric_grave_domain_7",
      "name": "생명력 수확 (Blight)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "damagePerPoison": true,
      "desc": "피해 {damage} + 대상의 현재 저주(맹독) 수치만큼 추가 피해! (신앙심 +1)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 1
    },
    "cleric_grave_domain_8": {
      "id": "cleric_grave_domain_8",
      "name": "강력한 주문시전 (Potent Casting)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "dexterity": 2,
      "resourceGain": 1,
      "desc": "힘 +2, 민첩 +2을 영구 획득하고 즉시 신성력 +1을 얻습니다! (신앙심 +2)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 2,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "cleric_grave_domain_9": {
      "id": "cleric_grave_domain_9",
      "name": "영혼의 수호자 (Keeper of Souls)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 17,
      "healOnHit": 5,
      "doublePoison": true,
      "desc": "피해 {damage}, 대상의 저주(맹독) 2배 증폭 및 내 체력 +5 회복! (소멸) (신앙심 +2)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "exhaust": true,
      "devotionGain": 2
    },
    "cleric_grave_domain_10": {
      "id": "cleric_grave_domain_10",
      "name": "케렘보르의 최후 심판 (Divine Intervention)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 13,
      "upgradeDamage": 18,
      "target": "all",
      "stance": "divinity",
      "triggerPoisonNow": true,
      "desc": "[전설] 적 전체 피해 {damage}, 모든 저주 즉시 폭발 및 [초월(2.25배)] 돌입! (신앙심 +2) (소멸)",
      "classId": "cleric",
      "subclassId": "grave_domain",
      "devotionGain": 2,
      "upgradeCost": 2,
      "exhaust": true
    },
    "pal_sh_1": {
      "id": "pal_sh_1",
      "name": "성검 베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "desc": "적에게 피해를 {damage} 줍니다. ⚖️심판 문장 +1.",
      "classId": "paladin",
      "subclassId": "shared",
      "seal": 1
    },
    "pal_sh_2": {
      "id": "pal_sh_2",
      "name": "성기사의 방패",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "desc": "방어도를 {block} 얻습니다.",
      "classId": "paladin",
      "subclassId": "shared"
    },
    "pal_sh_3": {
      "id": "pal_sh_3",
      "name": "신성한 강타 (Divine Smite)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 9,
      "upgradeDamage": 12,
      "bonusPerResource": 2,
      "resourceGain": 1,
      "desc": "피해 {damage} + 보유한 강타 충전 1당 추가 광휘 피해 +1! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "shared",
      "detonateSeal": true
    },
    "pal_sh_4": {
      "id": "pal_sh_4",
      "name": "안수 치료 (Lay on Hands)",
      "type": "skill",
      "rarity": "rare",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "healOnHit": 4,
      "resourceGain": 1,
      "desc": "방어도 {block}을 얻고 내 체력을 4 회복합니다. 강타 +1. (소멸)",
      "classId": "paladin",
      "subclassId": "shared",
      "exhaust": true
    },
    "paladin_devotion_1": {
      "id": "paladin_devotion_1",
      "name": "천둥의 강타 (Thunderous Smite)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "vuln": 1,
      "resourceGain": 1,
      "desc": "피해 {damage}를 주고 취약 1을 부여합니다. 강타 +1. ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "devotion",
      "detonateSeal": true
    },
    "paladin_devotion_2": {
      "id": "paladin_devotion_2",
      "name": "헌신의 성역 (Sanctuary)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "resourceGain": 1,
      "desc": "방어도 {block}과 신성한 강타 +1를 얻습니다. ⚜️적 전체 문장 +2 & 오라 위력 +1.",
      "classId": "paladin",
      "subclassId": "devotion",
      "sealAll": 2,
      "auraBoost": 1
    },
    "paladin_devotion_3": {
      "id": "paladin_devotion_3",
      "name": "불경한 자 퇴치 (Turn Unholy)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "weak": 2,
      "target": "all",
      "block": 5,
      "desc": "방어도 5을 얻고 적 전체에게 약화 2를 부여합니다.",
      "classId": "paladin",
      "subclassId": "devotion",
      "upgradeCost": 0,
      "upgradeBlock": 8
    },
    "paladin_devotion_4": {
      "id": "paladin_devotion_4",
      "name": "성검 연속 베기",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 2,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 2번 주고 신성한 강타 +1. ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "devotion",
      "seal": 2
    },
    "paladin_devotion_5": {
      "id": "paladin_devotion_5",
      "name": "신성한 무기 (Sacred Weapon)",
      "type": "power",
      "rarity": "uncommon",
      "cost": 1,
      "strength": 2,
      "upgradeStrength": 3,
      "metallicize": 3,
      "desc": "성검에 빛을 부여해 힘 +{strength} 및 매 턴 종료 시 방어도 +3! ⚜️적 전체 문장 +2 & 오라 위력 +1.",
      "classId": "paladin",
      "subclassId": "devotion",
      "sealAll": 2,
      "auraBoost": 1
    },
    "paladin_devotion_6": {
      "id": "paladin_devotion_6",
      "name": "헌신의 오라 (Aura of Devotion)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 2,
      "block": 8,
      "upgradeBlock": 11,
      "doubleBlock": true,
      "desc": "방어도 {block}을 얻고 현재 방어도를 2배로 증폭합니다! (소멸) ⚜️적 전체 문장 +2 & 오라 위력 +1.",
      "classId": "paladin",
      "subclassId": "devotion",
      "exhaust": true,
      "sealAll": 2,
      "auraBoost": 1,
      "upgradeCost": 1
    },
    "paladin_devotion_7": {
      "id": "paladin_devotion_7",
      "name": "섬광의 강타 (Blinding Smite)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "weak": 2,
      "vuln": 2,
      "desc": "피해 {damage}를 주고 대상에게 실명(약화 2, 취약 2)을 부여합니다. ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "devotion",
      "detonateSeal": true
    },
    "paladin_devotion_8": {
      "id": "paladin_devotion_8",
      "name": "영혼의 순수함 (Purity of Spirit)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "block": 8,
      "healOnHit": 4,
      "draw": 1,
      "stance": "calm",
      "desc": "방어도 8, 체력 +4 회복, 1드로우 및 [헌신/명경(AP+1)] 돌입! (소멸)",
      "classId": "paladin",
      "subclassId": "devotion",
      "exhaust": true,
      "upgradeCost": 1,
      "upgradeBlock": 11
    },
    "paladin_devotion_9": {
      "id": "paladin_devotion_9",
      "name": "방패와 성검의 심판",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 15,
      "damagePerBlock": true,
      "desc": "피해 {damage} + 현재 내 방어도만큼 추가 광휘 피해! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "devotion",
      "detonateSeal": true
    },
    "paladin_devotion_10": {
      "id": "paladin_devotion_10",
      "name": "신성한 후광 (20레벨 Holy Nimbus)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 13,
      "upgradeDamage": 18,
      "target": "all",
      "block": 11,
      "stance": "divinity",
      "desc": "[전설] 태양의 후광! 방어도 +11, 적 전체 피해 {damage} 및 [천상 강림(2.25배)]! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)! (소멸)",
      "classId": "paladin",
      "subclassId": "devotion",
      "detonateSeal": true,
      "upgradeCost": 2,
      "exhaust": true
    },
    "paladin_vengeance_1": {
      "id": "paladin_vengeance_1",
      "name": "분노의 강타 (Wrathful Smite)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "resourceGain": 1,
      "desc": "피해를 {damage} 주고 신성한 강타 +1를 얻습니다. ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "vengeance",
      "detonateSeal": true
    },
    "paladin_vengeance_2": {
      "id": "paladin_vengeance_2",
      "name": "사냥꾼의 징표 추격",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "vuln": 2,
      "desc": "피해를 {damage} 주고 대상에게 취약 2를 부여합니다. ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "vengeance",
      "seal": 2
    },
    "paladin_vengeance_3": {
      "id": "paladin_vengeance_3",
      "name": "안개 걸음 추격",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 카드를 {draw}장 뽑고 강타 +1를 얻습니다. (소멸)",
      "classId": "paladin",
      "subclassId": "vengeance",
      "exhaust": true
    },
    "paladin_vengeance_4": {
      "id": "paladin_vengeance_4",
      "name": "심판관의 패링",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "strength": 1,
      "desc": "방어도 {block}과 힘 +1을 얻습니다. (소멸)",
      "classId": "paladin",
      "subclassId": "vengeance",
      "exhaust": true
    },
    "paladin_vengeance_5": {
      "id": "paladin_vengeance_5",
      "name": "적대의 맹세 (Vow of Enmity)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 8,
      "upgradeDamage": 11,
      "stance": "wrath",
      "vuln": 2,
      "desc": "피해 {damage}, 취약 2 부여 후 [복수(피해 1.75배)] 태세 돌입! ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "vengeance",
      "seal": 2,
      "upgradeCost": 1
    },
    "paladin_vengeance_6": {
      "id": "paladin_vengeance_6",
      "name": "가차없는 추격자 (Relentless)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 3,
      "resourceGain": 1,
      "desc": "피해를 {damage}씩 3번 연속 가합니다! 강타 +1. ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "vengeance",
      "seal": 2
    },
    "paladin_vengeance_7": {
      "id": "paladin_vengeance_7",
      "name": "가속 추격 (Haste)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "gainEnergy": 1,
      "draw": 1,
      "exhaust": true,
      "desc": "0코스트! 행동력 +1, 카드 1장 드로우 (소멸)",
      "classId": "paladin",
      "subclassId": "vengeance",
      "upgradeStrength": 2
    },
    "paladin_vengeance_8": {
      "id": "paladin_vengeance_8",
      "name": "복수의 영혼 (Soul of Vengeance)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "upgradeStrength": 3,
      "dexterity": 2,
      "desc": "영구적으로 힘 +{strength} 및 민첩 +2를 획득합니다!",
      "classId": "paladin",
      "subclassId": "vengeance",
      "upgradeCost": 1
    },
    "paladin_vengeance_9": {
      "id": "paladin_vengeance_9",
      "name": "추방의 강타 (5레벨 Banishing Smite)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 15,
      "upgradeDamage": 20,
      "bonusPerResource": 3,
      "desc": "5레벨 최강 강타! 피해 {damage} + 보유한 강타 1당 피해 +3! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "vengeance",
      "detonateSeal": true
    },
    "paladin_vengeance_10": {
      "id": "paladin_vengeance_10",
      "name": "복수의 천사 (20레벨 Avenging Angel)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 14,
      "upgradeDamage": 19,
      "target": "all",
      "stance": "divinity",
      "consumeResourceAll": true,
      "bonusPerResource": 3,
      "desc": "[전설] 천사의 날개 개방! 적 전체 피해 {damage}(강타당 +3) 및 [초월(2.25배)]! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)! (소멸)",
      "classId": "paladin",
      "subclassId": "vengeance",
      "detonateSeal": true,
      "upgradeCost": 2,
      "exhaust": true
    },
    "paladin_conquest_1": {
      "id": "paladin_conquest_1",
      "name": "상급 군마 소환 (그리폰)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "전방에 [천상의 그리폰]을 소환/체력 +{summonHeal}, 공격력 +2 강화!",
      "classId": "paladin",
      "subclassId": "conquest"
    },
    "paladin_conquest_2": {
      "id": "paladin_conquest_2",
      "name": "기마 돌격 강타",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}를 주고 그리폰 군마가 즉시 협동 타격합니다! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "conquest",
      "detonateSeal": true
    },
    "paladin_conquest_3": {
      "id": "paladin_conquest_3",
      "name": "정복의 현존 (Conquering Presence)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "weak": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체를 위압해 약화 2를 부여합니다.",
      "classId": "paladin",
      "subclassId": "conquest"
    },
    "paladin_conquest_4": {
      "id": "paladin_conquest_4",
      "name": "강철 군마 갑주",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "summonHeal": 5,
      "desc": "내 방어도 +{block} 및 그리폰 군마의 체력을 +5 회복합니다.",
      "classId": "paladin",
      "subclassId": "conquest"
    },
    "paladin_conquest_5": {
      "id": "paladin_conquest_5",
      "name": "정복의 오라 (Aura of Conquest)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "target": "all",
      "weak": 2,
      "triggerSummonAttack": true,
      "desc": "적 전체 피해 {damage}, 약화 2 부여 후 그리폰 군마가 협공합니다! ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "conquest",
      "seal": 2
    },
    "paladin_conquest_6": {
      "id": "paladin_conquest_6",
      "name": "인도된 일격 (Guided Strike)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "summonAtkBoost": 2,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}, 그리폰 공격력 +2 강화 후 즉시 그리폰 협공! ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "conquest",
      "seal": 2
    },
    "paladin_conquest_7": {
      "id": "paladin_conquest_7",
      "name": "경멸의 질책 (Scornful Rebuke)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "summonHeal": 7,
      "draw": 1,
      "desc": "내 방어도 +{block}, 그리폰 체력 +7, 카드 1장 드로우!",
      "classId": "paladin",
      "subclassId": "conquest"
    },
    "paladin_conquest_8": {
      "id": "paladin_conquest_8",
      "name": "권능의 원 (Circle of Power)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 천상의 그리폰 체력 +12 및 공격력 +3 영구 강화! ⚜️적 전체 문장 +2 & 오라 위력 +1.",
      "classId": "paladin",
      "subclassId": "conquest",
      "sealAll": 2,
      "auraBoost": 1,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "paladin_conquest_9": {
      "id": "paladin_conquest_9",
      "name": "지배자의 철권",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 17,
      "damagePlusSummonHp": true,
      "desc": "피해 {damage} + 그리폰 군마의 현재 체력만큼 추가 피해! ⚖️심판의 문장 +3 부여.",
      "classId": "paladin",
      "subclassId": "conquest",
      "seal": 3
    },
    "paladin_conquest_10": {
      "id": "paladin_conquest_10",
      "name": "무적의 정복자 (20레벨 Conqueror)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 17,
      "upgradeDamage": 22,
      "target": "all",
      "triggerSummonAttack": true,
      "healOnHit": 5,
      "block": 10,
      "desc": "[전설] 적 전체 피해 {damage}, 방어도 +10, 내 체력 +5 및 그리폰 협공! (소멸) ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "conquest",
      "exhaust": true,
      "detonateSeal": true
    },
    "paladin_oathbreaker_1": {
      "id": "paladin_oathbreaker_1",
      "name": "타락 데스나이트 지배",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "전방에 [타락 데스나이트] 체력 +{summonHeal}, 공격력 +2 소환!",
      "classId": "paladin",
      "subclassId": "oathbreaker"
    },
    "paladin_oathbreaker_2": {
      "id": "paladin_oathbreaker_2",
      "name": "지옥의 질책 (Hellish Rebuke)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "poison": 2,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}, 암흑 저주 2 부여 후 데스나이트가 즉시 협공! ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "seal": 2
    },
    "paladin_oathbreaker_3": {
      "id": "paladin_oathbreaker_3",
      "name": "끔찍한 외형 (Dreadful Aspect)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "vuln": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체에게 공포(취약 2)를 부여합니다.",
      "classId": "paladin",
      "subclassId": "oathbreaker"
    },
    "paladin_oathbreaker_4": {
      "id": "paladin_oathbreaker_4",
      "name": "치명적 상처 부여 (Inflict Wounds)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "poison": 3,
      "desc": "암흑 에너지를 꽂아 피해 {damage}와 부패 저주 3를 부여합니다. ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "seal": 2
    },
    "paladin_oathbreaker_5": {
      "id": "paladin_oathbreaker_5",
      "name": "증오의 오라 (Aura of Hate)",
      "type": "power",
      "rarity": "uncommon",
      "cost": 1,
      "strength": 2,
      "upgradeStrength": 3,
      "summonAtkBoost": 3,
      "desc": "내 힘 +{strength} 및 데스나이트 소환수의 공격력을 +3 영구 증폭! ⚜️적 전체 문장 +2 & 오라 위력 +1.",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "sealAll": 2,
      "auraBoost": 1
    },
    "paladin_oathbreaker_6": {
      "id": "paladin_oathbreaker_6",
      "name": "암흑의 흡혈 마검",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "healOnHit": 2,
      "summonHeal": 4,
      "desc": "피해 {damage}를 주고 내 체력 2, 데스나이트 체력 4을 회복합니다. (소멸) ⚖️심판의 문장 +2 부여.",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "exhaust": true,
      "seal": 2
    },
    "paladin_oathbreaker_7": {
      "id": "paladin_oathbreaker_7",
      "name": "원한 서린 강타",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "damagePerPoison": true,
      "triggerSummonAttack": true,
      "desc": "피해 {damage} + 대상의 현재 저주 수치만큼 추가 피해 후 데스나이트 협공! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "detonateSeal": true
    },
    "paladin_oathbreaker_8": {
      "id": "paladin_oathbreaker_8",
      "name": "어둠의 군단 각성",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "poison": 6,
      "target": "all",
      "summonHeal": 10,
      "draw": 2,
      "desc": "적 전체 암흑 저주 6 부여, 데스나이트 체력 +10, 카드 2장 드로우!",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "upgradeCost": 1,
      "upgradeDraw": 3
    },
    "paladin_oathbreaker_9": {
      "id": "paladin_oathbreaker_9",
      "name": "파멸의 물결 (5레벨 Destructive Wave)",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 13,
      "upgradeDamage": 18,
      "target": "all",
      "vuln": 2,
      "triggerSummonAttack": true,
      "desc": "적 전체에게 암흑 충격파 피해 {damage}, 취약 2 및 데스나이트 협공! ⚖️심판의 문장 +3 부여.",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "seal": 3
    },
    "paladin_oathbreaker_10": {
      "id": "paladin_oathbreaker_10",
      "name": "공포의 군주 (20레벨 Dread Lord)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 18,
      "upgradeDamage": 24,
      "target": "all",
      "damagePlusSummonHp": true,
      "triggerSummonAttack": true,
      "desc": "[전설] 적 전체 피해 {damage} + 데스나이트 체력만큼 추가 피해 및 협공! ⚖️[심판의 문장] 폭발(문장당 광휘 피해+3, 방어도+1)!",
      "classId": "paladin",
      "subclassId": "oathbreaker",
      "detonateSeal": true
    },
    "wlk_sh_1": {
      "id": "wlk_sh_1",
      "name": "섬뜩한 파열 (Eldritch Blast)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 3,
      "upgradeDamage": 5,
      "hits": 2,
      "desc": "적에게 마력탄 피해를 {damage}씩 2회 줍니다. 💀파멸(Doom) +1.",
      "classId": "warlock",
      "subclassId": "shared",
      "doom": 1
    },
    "wlk_sh_2": {
      "id": "wlk_sh_2",
      "name": "악마의 갑옷 (Fiendish Vigor)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 5,
      "upgradeBlock": 8,
      "summonHeal": 3,
      "desc": "방어도를 {block} 얻습니다.",
      "classId": "warlock",
      "subclassId": "shared"
    },
    "wlk_sh_3": {
      "id": "wlk_sh_3",
      "name": "주술 (Hex)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "poison": 2,
      "upgradePoison": 3,
      "vuln": 1,
      "draw": 1,
      "resourceGain": 1,
      "desc": "0코스트! 대상에게 주술(저주) {poison}, 취약 1 부여 및 1장 드로우. 💀파멸(Doom) +3.",
      "classId": "warlock",
      "subclassId": "shared",
      "doom": 3
    },
    "wlk_sh_4": {
      "id": "wlk_sh_4",
      "name": "아가시스의 갑옷 (Armor of Agathys)",
      "type": "skill",
      "rarity": "rare",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "summonHeal": 7,
      "resourceGain": 1,
      "desc": "내 냉기 방어도 +{block} 및 계약 악마 체력 +10!",
      "classId": "warlock",
      "subclassId": "shared"
    },
    "warlock_fiend_patron_1": {
      "id": "warlock_fiend_patron_1",
      "name": "어둠의 존재의 축복",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "block": 3,
      "desc": "피해 {damage}를 주고 내 체력 +3 회복 및 방어도 3를 얻습니다.",
      "classId": "warlock",
      "subclassId": "fiend_patron"
    },
    "warlock_fiend_patron_2": {
      "id": "warlock_fiend_patron_2",
      "name": "지옥불 타오르는 손길",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "target": "all",
      "resourceGain": 1,
      "desc": "적 전체에게 지옥불 피해 {damage}를 줍니다. 영혼 조각 +1. 💀적 전체 파멸(Doom) +3.",
      "classId": "warlock",
      "subclassId": "fiend_patron",
      "doomAll": 3
    },
    "warlock_fiend_patron_3": {
      "id": "warlock_fiend_patron_3",
      "name": "지옥마신 핀드 강화",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 11,
      "summonAtkBoost": 2,
      "desc": "계약 악마 [지옥마신 핀드] 체력 +{summonHeal}, 공격력 +2 강화!",
      "classId": "warlock",
      "subclassId": "fiend_patron"
    },
    "warlock_fiend_patron_4": {
      "id": "warlock_fiend_patron_4",
      "name": "고통의 파열 협공",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}를 주고 지옥마신 핀드가 즉시 화염 협공을 가합니다! 💀파멸(Doom) +4.",
      "classId": "warlock",
      "subclassId": "fiend_patron",
      "doom": 4
    },
    "warlock_fiend_patron_5": {
      "id": "warlock_fiend_patron_5",
      "name": "마신의 파이어볼 (Fiend Fireball)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 11,
      "upgradeDamage": 14,
      "target": "all",
      "poison": 3,
      "triggerSummonAttack": true,
      "desc": "적 전체 화염 피해 {damage}, 화상 3 부여 및 핀드 협공!",
      "classId": "warlock",
      "subclassId": "fiend_patron"
    },
    "warlock_fiend_patron_6": {
      "id": "warlock_fiend_patron_6",
      "name": "어둠의 존재의 행운",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "summonHeal": 5,
      "resourceGain": 1,
      "desc": "0코스트! 카드 {draw}장 드로우, 핀드 체력 +5, 영혼 조각 +1. (소멸)",
      "classId": "warlock",
      "subclassId": "fiend_patron",
      "exhaust": true
    },
    "warlock_fiend_patron_7": {
      "id": "warlock_fiend_patron_7",
      "name": "화염 방패 & 지옥의 질책",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "poison": 4,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체에게 지옥불 화상 4을 부여합니다.",
      "classId": "warlock",
      "subclassId": "fiend_patron"
    },
    "warlock_fiend_patron_8": {
      "id": "warlock_fiend_patron_8",
      "name": "마신의 저항력 (Fiendish Resilience)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 10,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 지옥마신 핀드의 체력 +10 및 공격력 +3 영구 강화!",
      "classId": "warlock",
      "subclassId": "fiend_patron",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "warlock_fiend_patron_9": {
      "id": "warlock_fiend_patron_9",
      "name": "아베르누스 불기둥",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 18,
      "bonusPerResource": 3,
      "healOnHit": 3,
      "desc": "피해 {damage}(영혼 조각당 +3) 및 내 체력을 3 회복합니다! (소멸) 💀파멸(Doom) +9.",
      "classId": "warlock",
      "subclassId": "fiend_patron",
      "exhaust": true,
      "doom": 9
    },
    "warlock_fiend_patron_10": {
      "id": "warlock_fiend_patron_10",
      "name": "지옥으로 내던지기 (Hurl Through Hell)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 18,
      "upgradeDamage": 24,
      "damagePlusSummonHp": true,
      "triggerSummonAttack": true,
      "healOnHit": 5,
      "desc": "[전설] 지옥 차원 추방! 피해 {damage} + 핀드 체력만큼 추가 피해 및 체력 +8! (소멸) 💀파멸(Doom) +9.",
      "classId": "warlock",
      "subclassId": "fiend_patron",
      "exhaust": true,
      "doom": 9
    },
    "warlock_hexblade_1": {
      "id": "warlock_hexblade_1",
      "name": "헥스블레이드의 저주",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "poison": 2,
      "upgradePoison": 3,
      "vuln": 1,
      "resourceGain": 1,
      "desc": "0코스트! 대상에게 저주 {poison}과 취약 1를 부여합니다. 조각 +1. 💀파멸(Doom) +3.",
      "classId": "warlock",
      "subclassId": "hexblade",
      "doom": 3
    },
    "warlock_hexblade_2": {
      "id": "warlock_hexblade_2",
      "name": "마검 베기 (Pact of the Blade)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "poison": 2,
      "desc": "저주받은 마검으로 피해 {damage}와 저주 2을 부여합니다. 💀파멸(Doom) +4.",
      "classId": "warlock",
      "subclassId": "hexblade",
      "doom": 4
    },
    "warlock_hexblade_3": {
      "id": "warlock_hexblade_3",
      "name": "중장갑 방패 주문",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 7,
      "upgradeBlock": 10,
      "resourceGain": 1,
      "desc": "방어도를 {block} 얻습니다. 영혼 조각 +1.",
      "classId": "warlock",
      "subclassId": "hexblade"
    },
    "warlock_hexblade_4": {
      "id": "warlock_hexblade_4",
      "name": "갈증 나는 칼날 (Thirsting Blade)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 4,
      "upgradeDamage": 5,
      "hits": 2,
      "resourceGain": 1,
      "desc": "마검으로 2회 연속 베어 피해 {damage}x2를 줍니다. 조각 +1.",
      "classId": "warlock",
      "subclassId": "hexblade"
    },
    "warlock_hexblade_5": {
      "id": "warlock_hexblade_5",
      "name": "분노의 강타 (Wrathful Smite)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "weak": 2,
      "poison": 3,
      "desc": "피해 {damage}를 주고 공포(약화 2)와 저주 3를 부여합니다.",
      "classId": "warlock",
      "subclassId": "hexblade"
    },
    "warlock_hexblade_6": {
      "id": "warlock_hexblade_6",
      "name": "저주받은 망령 (Accursed Specter)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "summonHeal": 8,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}, 망령 소환수 체력 +8 및 즉시 망령 협공! 💀파멸(Doom) +6.",
      "classId": "warlock",
      "subclassId": "hexblade",
      "doom": 6
    },
    "warlock_hexblade_7": {
      "id": "warlock_hexblade_7",
      "name": "육각의 갑주 (Armor of Hexes)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "doublePoison": true,
      "desc": "방어도 {block}을 얻고 대상의 저주(맹독)를 2배로 증폭합니다! (소멸)",
      "classId": "warlock",
      "subclassId": "hexblade",
      "exhaust": true
    },
    "warlock_hexblade_8": {
      "id": "warlock_hexblade_8",
      "name": "생명 흡수자 (Lifedrinker)",
      "type": "attack",
      "rarity": "rare",
      "cost": 1,
      "damage": 8,
      "upgradeDamage": 11,
      "damagePerPoison": true,
      "healOnHit": 3,
      "desc": "피해 {damage} + 대상의 현재 저주 수치만큼 추가 피해 및 체력 +3 회복! (소멸)",
      "classId": "warlock",
      "subclassId": "hexblade",
      "exhaust": true
    },
    "warlock_hexblade_9": {
      "id": "warlock_hexblade_9",
      "name": "그림자 마검의 각성",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "upgradeStrength": 3,
      "dexterity": 2,
      "desc": "마검과 일체화하여 힘 +{strength} 및 민첩 +2를 영구 획득합니다! 💀파멸(Doom) +6.",
      "classId": "warlock",
      "subclassId": "hexblade",
      "doom": 6,
      "upgradeCost": 1
    },
    "warlock_hexblade_10": {
      "id": "warlock_hexblade_10",
      "name": "마스터 오브 헥스 (Master of Hexes)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 17,
      "upgradeDamage": 22,
      "target": "all",
      "doublePoison": true,
      "triggerPoisonNow": true,
      "desc": "[전설] 적 전체 피해 {damage} 후 모든 적의 저주를 2배로 증폭하고 즉시 폭발! (소멸) 💀적 전체 파멸(Doom) +5.",
      "classId": "warlock",
      "subclassId": "hexblade",
      "exhaust": true,
      "doomAll": 5
    },
    "warlock_great_old_one_1": {
      "id": "warlock_great_old_one_1",
      "name": "각성한 정신 (Awakened Mind)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "addDrone": 1,
      "desc": "정신 충격 피해 {damage}를 주고 [공허의 촉수 구체] 1기를 소환합니다!",
      "classId": "warlock",
      "subclassId": "great_old_one"
    },
    "warlock_great_old_one_2": {
      "id": "warlock_great_old_one_2",
      "name": "불협화음의 속삭임 (Dissonant)",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 6,
      "upgradeDamage": 9,
      "weak": 2,
      "resourceGain": 1,
      "desc": "광기의 속삭임으로 피해 {damage}와 약화 2를 부여합니다. 💀파멸(Doom) +4.",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "doom": 4
    },
    "warlock_great_old_one_3": {
      "id": "warlock_great_old_one_3",
      "name": "엔트로피 방패 (Entropic Ward)",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "blockPerDrone": 3,
      "desc": "방어도 {block} + 소환된 촉수 구체 1기당 방어도 +3!",
      "classId": "warlock",
      "subclassId": "great_old_one"
    },
    "warlock_great_old_one_4": {
      "id": "warlock_great_old_one_4",
      "name": "심연의 시선",
      "type": "skill",
      "rarity": "common",
      "cost": 0,
      "draw": 1,
      "upgradeDraw": 2,
      "resourceGain": 1,
      "desc": "0코스트! 카드를 {draw}장 뽑고 영혼 조각 +1를 얻습니다. (소멸)",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "exhaust": true
    },
    "warlock_great_old_one_5": {
      "id": "warlock_great_old_one_5",
      "name": "하다르의 팔 (Arms of Hadar)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "target": "all",
      "triggerDronesNow": true,
      "desc": "적 전체 피해 {damage}를 주고 모든 공허의 촉수 구체가 일제 타격! 💀적 전체 파멸(Doom) +5.",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "doomAll": 5
    },
    "warlock_great_old_one_6": {
      "id": "warlock_great_old_one_6",
      "name": "하다르의 굶주림 (Hunger of Hadar)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 2,
      "damage": 10,
      "upgradeDamage": 13,
      "poison": 4,
      "weak": 2,
      "target": "all",
      "addDrone": 1,
      "desc": "적 전체 피해 {damage}, 저주 4, 약화 2 부여 및 촉수 구체 +1기 소환! 💀적 전체 파멸(Doom) +5.",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "doomAll": 5
    },
    "warlock_great_old_one_7": {
      "id": "warlock_great_old_one_7",
      "name": "사고 방패 (Thought Shield)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "vuln": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 정신 파동을 반사해 적 전체에 취약 2 부여!",
      "classId": "warlock",
      "subclassId": "great_old_one"
    },
    "warlock_great_old_one_8": {
      "id": "warlock_great_old_one_8",
      "name": "에바드의 검은 촉수 (Black Tentacles)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "addDrone": 2,
      "strength": 2,
      "dexterity": 2,
      "desc": "공허의 촉수 구체 2기 소환 및 힘 +2, 민첩 +2 영구 획득! 💀파멸(Doom) +6.",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "doom": 6,
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "warlock_great_old_one_9": {
      "id": "warlock_great_old_one_9",
      "name": "정신 노예화 (Create Thrall)",
      "type": "skill",
      "rarity": "rare",
      "cost": 2,
      "weak": 3,
      "vuln": 3,
      "target": "all",
      "stance": "calm",
      "draw": 2,
      "desc": "적 전체 약화 3, 취약 3, 카드 2장 드로우 및 [명경(AP+1)] 돌입!",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "upgradeCost": 1,
      "upgradeDraw": 3
    },
    "warlock_great_old_one_10": {
      "id": "warlock_great_old_one_10",
      "name": "크툴루 고대신의 강림 (Psychic Crush)",
      "type": "attack",
      "rarity": "legendary",
      "cost": 3,
      "damage": 14,
      "upgradeDamage": 19,
      "target": "all",
      "addDrone": 2,
      "triggerDronesNow": true,
      "stance": "divinity",
      "desc": "[전설] 적 전체 정신 붕괴 피해 {damage}, 촉수 2기 소환&폭격 및 [초월(2.25배)]! 💀적 전체 파멸(Doom) +7. (소멸)",
      "classId": "warlock",
      "subclassId": "great_old_one",
      "doomAll": 7,
      "upgradeCost": 2,
      "exhaust": true
    },
    "warlock_archfey_chain_1": {
      "id": "warlock_archfey_chain_1",
      "name": "사슬의 계약: 임프/드래곤 진화",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "summonHeal": 8,
      "upgradeSummonHeal": 12,
      "summonAtkBoost": 2,
      "desc": "전방 사역마의 체력 +{summonHeal}, 공격력을 +2 강화합니다!",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_2": {
      "id": "warlock_archfey_chain_2",
      "name": "사슬 군주의 명령",
      "type": "attack",
      "rarity": "common",
      "cost": 1,
      "damage": 5,
      "upgradeDamage": 8,
      "triggerSummonAttack": true,
      "draw": 1,
      "desc": "피해 {damage}, 사역마 즉시 협공 및 카드 1장 드로우!",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_3": {
      "id": "warlock_archfey_chain_3",
      "name": "사역마의 투명화 엄폐",
      "type": "skill",
      "rarity": "common",
      "cost": 1,
      "block": 6,
      "upgradeBlock": 8,
      "summonHeal": 5,
      "desc": "내 방어도 +{block} 및 사역마의 체력을 +5 회복합니다.",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_4": {
      "id": "warlock_archfey_chain_4",
      "name": "맹독 침 사역마 협공",
      "type": "attack",
      "rarity": "common",
      "cost": 0,
      "damage": 4,
      "upgradeDamage": 6,
      "poison": 2,
      "triggerSummonAttack": true,
      "desc": "0코스트! 피해 {damage}, 맹독 2 부여 후 사역마 즉시 협공!",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_5": {
      "id": "warlock_archfey_chain_5",
      "name": "살아있는 사슬의 선물 (Gift of Ever-Living)",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "healOnHit": 4,
      "summonHeal": 8,
      "desc": "사역마가 있을 때 최대 회복! 방어도 8, 내 체력 +4, 사역마 체력 +8! (소멸)",
      "classId": "warlock",
      "subclassId": "archfey_chain",
      "exhaust": true,
      "upgradeCost": 0,
      "upgradeBlock": 11
    },
    "warlock_archfey_chain_6": {
      "id": "warlock_archfey_chain_6",
      "name": "사역마 투자 (Investment of Chain)",
      "type": "attack",
      "rarity": "uncommon",
      "cost": 1,
      "damage": 7,
      "upgradeDamage": 10,
      "summonAtkBoost": 2,
      "weak": 2,
      "triggerSummonAttack": true,
      "desc": "피해 {damage}, 약화 2, 사역마 공격력 +2 강화 후 즉시 협공!",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_7": {
      "id": "warlock_archfey_chain_7",
      "name": "요정의 매혹 안개",
      "type": "skill",
      "rarity": "uncommon",
      "cost": 1,
      "block": 8,
      "upgradeBlock": 11,
      "weak": 2,
      "vuln": 2,
      "target": "all",
      "desc": "방어도 {block}을 얻고 적 전체에게 약화 2, 취약 2를 부여합니다.",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_8": {
      "id": "warlock_archfey_chain_8",
      "name": "사슬 마스터의 지배 (Chains of Carceri)",
      "type": "power",
      "rarity": "rare",
      "cost": 2,
      "strength": 2,
      "summonHeal": 12,
      "summonAtkBoost": 3,
      "desc": "힘 +2, 사역마의 체력 +12 및 공격력 +3 영구 초월 강화!",
      "classId": "warlock",
      "subclassId": "archfey_chain",
      "upgradeCost": 1,
      "upgradeStrength": 3
    },
    "warlock_archfey_chain_9": {
      "id": "warlock_archfey_chain_9",
      "name": "영혼 결속 폭발",
      "type": "attack",
      "rarity": "rare",
      "cost": 2,
      "damage": 12,
      "upgradeDamage": 17,
      "damagePlusSummonHp": true,
      "desc": "피해 {damage} + 사역마의 현재 체력만큼 추가 피해를 줍니다!",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "warlock_archfey_chain_10": {
      "id": "warlock_archfey_chain_10",
      "name": "심연 사역마 군단 총진격",
      "type": "attack",
      "rarity": "legendary",
      "cost": 2,
      "damage": 16,
      "upgradeDamage": 21,
      "target": "all",
      "damagePlusSummonHp": true,
      "triggerSummonAttack": true,
      "draw": 1,
      "desc": "[전설] 적 전체 피해 {damage} + 사역마 체력만큼 추가 피해, 협공 및 1드로우!",
      "classId": "warlock",
      "subclassId": "archfey_chain"
    },
    "status_slimed": {
      "id": "status_slimed",
      "name": "🟢 점액 투성이 (Slimed)",
      "type": "status",
      "rarity": "common",
      "cost": 1,
      "exhaust": true,
      "desc": "[상태이상] 행동력 1을 소모하여 닦아냅니다. 사용 시 소멸(Exhaust)."
    },
    "status_burn": {
      "id": "status_burn",
      "name": "🔥 지옥 화상 (Burn)",
      "type": "status",
      "rarity": "common",
      "cost": 1,
      "selfDamage": 2,
      "exhaust": true,
      "endTurnBurn": 4,
      "desc": "[상태이상] 턴 종료 시 손에 남아있으면 화염 피해를 4 입습니다! (사용 시 체력 -2 소모 후 소멸)"
    },
    "status_dazed": {
      "id": "status_dazed",
      "name": "💫 정신 혼란 (Dazed)",
      "type": "status",
      "rarity": "common",
      "cost": 1,
      "exhaust": true,
      "ethereal": true,
      "desc": "[상태이상 · 휘발성] 턴 종료 시 손에서 자동으로 소멸합니다. (직접 사용 시 소멸)"
    },
    "status_wound": {
      "id": "status_wound",
      "name": "🩸 깊은 열상 (Wound)",
      "type": "status",
      "rarity": "common",
      "cost": 1,
      "selfDamage": 3,
      "exhaust": true,
      "desc": "[상태이상] 붕대 감기: 체력을 3 소모하고 이 카드를 소멸시킵니다."
    },
    "curse_pain": {
      "id": "curse_pain",
      "name": "☠️ 심연의 저주 (Curse)",
      "type": "curse",
      "rarity": "common",
      "cost": 2,
      "selfDamage": 5,
      "exhaust": true,
      "endTurnBurn": 3,
      "desc": "[저주] 턴 종료 시 손에 있으면 암흑 피해 3을 입습니다. (상점 카드 제거로 영구 정화 가능)"
    },
    "token_shiv": {
      "id": "token_shiv",
      "name": "투척 단검 (Shiv)",
      "type": "attack",
      "rarity": "common",
      "classId": "rogue",
      "subclassId": "shared",
      "cost": 0,
      "damage": 4,
      "upgradeDamage": 6,
      "comboPoint": 1,
      "exhaust": true,
      "desc": "0코스트 암기 토큰! 피해 {damage}, 연계 점수 +1점 획득. (소멸)"
    },
    "token_smite_wave": {
      "id": "token_smite_wave",
      "name": "빛의 심판 파동",
      "type": "attack",
      "rarity": "common",
      "classId": "paladin",
      "subclassId": "shared",
      "cost": 0,
      "damage": 5,
      "upgradeDamage": 8,
      "detonateSeal": true,
      "exhaust": true,
      "desc": "0코스트 성검 토큰! 피해 {damage}를 주고 대상의 [⚖️심판의 문장]을 즉시 폭발시킵니다. (소멸)"
    }
  },
  "mutations": [
    {
      "id": "rad_infused",
      "name": "🧪 산성/맹독 룬 각인",
      "desc": "이 카드 사용 시 대상에게 산성/맹독 +2 추가 부여",
      "badgeColor": "#2ecc71"
    },
    {
      "id": "adrenaline_gene",
      "name": "⚡ 집중 룬 각인",
      "desc": "이 카드 사용 시 클래스 고유 자원 +1 추가 획득",
      "badgeColor": "#00d2d3"
    },
    {
      "id": "chitin_coat",
      "name": "🛡️ 방호(Abjuration) 룬 각인",
      "desc": "이 카드 사용 시 방어도 +3 추가 획득",
      "badgeColor": "#3498db"
    },
    {
      "id": "vampiric_cell",
      "name": "🗡️ 예리함 룬 각인",
      "desc": "이 공격 카드의 기본 피해량 +3 증가",
      "badgeColor": "#e74c3c"
    }
  ],
  "relics": {
    "fighters_badge": {
      "id": "fighters_badge",
      "name": "워터딥 검투사의 휘장",
      "icon": "⚔️",
      "desc": "전투 종료 시 체력을 6 회복하고 첫 턴 우위 주사위 +2를 얻습니다."
    },
    "totem_necklace": {
      "id": "totem_necklace",
      "name": "우스가르드 야수 토템 목걸이",
      "icon": "🐻",
      "desc": "전투 시작 시 격노 +1 및 첫 턴 방어도 +3을 얻습니다."
    },
    "thieves_tools": {
      "id": "thieves_tools",
      "name": "젠타림 마스터 도적 도구",
      "icon": "🗝️",
      "desc": "전투 시작 시 모든 적에게 맹독 +1을 부여하고 첫 턴 카드를 1장 더 뽑습니다."
    },
    "hunters_quiver": {
      "id": "hunters_quiver",
      "name": "엘프 여왕의 마법 화살통",
      "icon": "🏹",
      "desc": "전투 시작 시 사냥꾼의 징표 +1 및 모든 적에게 표적 +1을 부여합니다."
    },
    "spellbook_of_mystra": {
      "id": "spellbook_of_mystra",
      "name": "미스트라의 비전 마도서",
      "icon": "📘",
      "desc": "전투 시작 시 비전 주문력 +1을 얻습니다."
    },
    "holy_symbol_lathander": {
      "id": "holy_symbol_lathander",
      "name": "라센더의 태양 성물",
      "icon": "☀️",
      "desc": "전투 시작 시 [천상의 수호령 오브] 1기를 소환하고 전투 후 체력을 5 회복합니다."
    },
    "holy_avenger_hilt": {
      "id": "holy_avenger_hilt",
      "name": "티르의 성검 인장",
      "icon": "⚜️",
      "desc": "매 턴 종료 시 방어도 +2를 자동으로 얻으며 첫 턴 신성한 강타 +1을 얻습니다."
    },
    "rod_of_pact_keeper": {
      "id": "rod_of_pact_keeper",
      "name": "계약 수호자의 마법봉 (+2)",
      "icon": "🟣",
      "desc": "전투 시작 시 전방에 [지옥마신 핀드]를 소환하며 매 턴 핀드가 체력을 4 회복합니다."
    },
    "Geiger_counter": {
      "id": "Geiger_counter",
      "name": "오우거 힘의 건틀릿",
      "icon": "🥊",
      "desc": "전투 시작 시 영구적으로 공격력(힘) +2를 얻습니다.",
      "price": 110
    },
    "mutant_adrenal": {
      "id": "mutant_adrenal",
      "name": "신속의 부츠 (Boots of Speed)",
      "icon": "🥾",
      "desc": "매 턴 시작 시 카드를 1장 더 뽑고 첫 턴 방어도 +8을 얻습니다.",
      "price": 135
    },
    "titanium_ribs": {
      "id": "titanium_ribs",
      "name": "보호의 망토 (Cloak of Protection)",
      "icon": "🛡️",
      "desc": "민첩 +2 및 매 턴 종료 시 방어도 +4를 자동으로 얻습니다.",
      "price": 125
    },
    "fusion_cell": {
      "id": "fusion_cell",
      "name": "이운 스톤 (Ioun Stone of Mastery)",
      "icon": "💎",
      "desc": "매 턴 최대 행동 마나(AP)가 +1 증가합니다!",
      "price": 180
    },
    "scavenger_goggles": {
      "id": "scavenger_goggles",
      "name": "보물 감지의 랜턴",
      "icon": "🏮",
      "desc": "전투 승리 시 얻는 골드가 +35% 증가하고 최대 체력 +10.",
      "price": 100
    },
    "cursed_key": {
      "id": "cursed_key",
      "name": "🗝️ 저주받은 열쇠 (Cursed Key)",
      "icon": "🗝️",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 보물상자나 이벤트에서 유물을 얻을 때마다 덱에 [☠️심연의 저주]가 1장 추가됩니다."
    },
    "velvet_choker": {
      "id": "velvet_choker",
      "name": "📿 벨벳 초커 (Velvet Choker)",
      "icon": "📿",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 한 턴에 카드를 최대 6장까지만 사용할 수 있습니다."
    },
    "coffee_dripper": {
      "id": "coffee_dripper",
      "name": "☕ 드워프 커피 드리퍼 (Coffee Dripper)",
      "icon": "☕",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 모닥불 휴식처(야영지)에서 [휴식(체력 회복)]을 할 수 없습니다!"
    },
    "fusion_hammer": {
      "id": "fusion_hammer",
      "name": "🔨 융합 해머 (Fusion Hammer)",
      "icon": "🔨",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 모닥불 휴식처(야영지)에서 [단련(카드 강화)]을 할 수 없습니다!"
    },
    "philosophers_stone": {
      "id": "philosophers_stone",
      "name": "🩸 현자의 돌 (Philosopher's Stone)",
      "icon": "🩸",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 모든 적들이 전투 시작 시 힘 +1을 얻은 채로 시작합니다!"
    },
    "sozu_brew": {
      "id": "sozu_brew",
      "name": "🍶 봉인의 호리병 (Sozu)",
      "icon": "🍶",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 더 이상 전투나 상점/이벤트에서 새로운 물약을 획득할 수 없습니다!"
    },
    "ectoplasm_slime": {
      "id": "ectoplasm_slime",
      "name": "🟢 엑토플라즘 (Ectoplasm)",
      "icon": "🟢",
      "isBossRelic": true,
      "bonusEnergy": 1,
      "desc": "[보스 유물] 매 턴 최대 행동력(AP) +1. 단, 더 이상 전투나 이벤트에서 금화(GP)를 획득할 수 없습니다!"
    },
    "snecko_eye": {
      "id": "snecko_eye",
      "name": "🐍 비홀더 스네코의 눈 (Snecko Eye)",
      "icon": "🐍",
      "isBossRelic": true,
      "desc": "[보스 유물] 매 턴 카드를 2장 더 뽑습니다! 단, 혼란에 걸려 카드를 뽑을 때마다 코스트가 0~3 사이로 무작위 변경됩니다."
    },
    "black_star": {
      "id": "black_star",
      "name": "🌠 검은 별 (Black Star)",
      "icon": "🌠",
      "isBossRelic": true,
      "desc": "[보스 유물] 엘리트 몬스터를 토벌할 때마다 유물을 1개 더(총 2개) 획득하고 최대 체력이 +8 증가합니다!"
    },
    "vajra_relic": {
      "id": "vajra_relic",
      "name": "🔱 금강저 (Vajra)",
      "icon": "🔱",
      "price": 120,
      "desc": "전투 시작 시 힘 +1을 얻습니다."
    },
    "oddly_smooth_stone": {
      "id": "oddly_smooth_stone",
      "name": "🪨 매끄러운 돌 (Smooth Stone)",
      "icon": "🪨",
      "price": 120,
      "desc": "전투 시작 시 민첩 +1을 얻습니다."
    },
    "anchor_relic": {
      "id": "anchor_relic",
      "name": "⚓ 고대 철제 닻 (Anchor)",
      "icon": "⚓",
      "price": 125,
      "desc": "매 전투 첫 번째 턴 시작 시 방어도 +10을 얻습니다."
    },
    "lantern_relic": {
      "id": "lantern_relic",
      "name": "🕯️ 안내자의 등불 (Lantern)",
      "icon": "🕯️",
      "price": 130,
      "desc": "매 전투 첫 번째 턴 시작 시 행동력(AP) +1을 얻습니다."
    },
    "orichalcum_relic": {
      "id": "orichalcum_relic",
      "name": "🪙 오리할콘 광석 (Orichalcum)",
      "icon": "🪙",
      "price": 135,
      "desc": "내 턴 종료 시 방어도가 0이라면 자동으로 방어도 +6을 얻습니다."
    },
    "bag_of_prep": {
      "id": "bag_of_prep",
      "name": "🎒 준비된 자의 배낭 (Bag of Preparation)",
      "icon": "🎒",
      "price": 135,
      "desc": "매 전투 첫 번째 턴에 카드를 2장 더 뽑습니다."
    },
    "pen_nib_relic": {
      "id": "pen_nib_relic",
      "name": "✒️ 만년필 촉 (Pen Nib)",
      "icon": "✒️",
      "price": 145,
      "desc": "공격 카드를 7장 사용할 때마다 다음 공격 카드가 2배 피해를 줍니다!"
    },
    "ftr_rank_b": {
      "id": "ftr_rank_b",
      "name": "⚔️ [파이터 B급] 백전노장의 검술 교본",
      "icon": "📘",
      "classRelic": "fighter",
      "rankReq": "B",
      "desc": "[파이터 고유] 매 전투 1턴 시작 시 방어도 +6 및 우위 주사위 +1 획득."
    },
    "ftr_rank_s": {
      "id": "ftr_rank_s",
      "name": "👑 [파이터 S급] 아레스의 전장 지휘봉",
      "icon": "🏆",
      "classRelic": "fighter",
      "rankReq": "S",
      "desc": "[파이터 신화] 매 턴 첫 번째 공격 카드 사용 시 방어도 +5 및 우위 주사위 +1 추가 획득!"
    },
    "bar_rank_b": {
      "id": "bar_rank_b",
      "name": "🪓 [바바리안 B급] 피에 젖은 전쟁 문신",
      "icon": "🩸",
      "classRelic": "barbarian",
      "rankReq": "B",
      "desc": "[바바리안 고유] 전투 중 내 체력이 60% 이하일 때 매 턴 시작 시 힘 +1 추가 획득."
    },
    "bar_rank_s": {
      "id": "bar_rank_s",
      "name": "👑 [바바리안 S급] 원시 타이탄의 심장",
      "icon": "❤️‍🔥",
      "classRelic": "barbarian",
      "rankReq": "S",
      "desc": "[바바리안 신화] 전투 시작 시 힘 +2 및 최대 체력 +12 영구 증가!"
    },
    "rog_rank_b": {
      "id": "rog_rank_b",
      "name": "🗡️ [로그 B급] 암살자 길드의 맹독 약병",
      "icon": "🧪",
      "classRelic": "rogue",
      "rankReq": "B",
      "desc": "[로그 고유] 전투 시작 시 모든 적에게 맹독 +3 추가 부여 및 첫 턴 카드 +1장 드로우."
    },
    "rog_rank_s": {
      "id": "rog_rank_s",
      "name": "👑 [로그 S급] 그림자 군주의 단검",
      "icon": "🌑",
      "classRelic": "rogue",
      "rankReq": "S",
      "desc": "[로그 신화] 매 턴 첫 공격 시 대상에게 취약 1과 맹독 +2를 자동 부여!"
    },
    "rng_rank_b": {
      "id": "rng_rank_b",
      "name": "🏹 [레인저 B급] 실버문 정찰대의 나침반",
      "icon": "🧭",
      "classRelic": "ranger",
      "rankReq": "B",
      "desc": "[레인저 고유] 전투 시작 시 민첩 +1 및 첫 턴 행동력(AP) +1 획득."
    },
    "rng_rank_s": {
      "id": "rng_rank_s",
      "name": "👑 [레인저 S급] 야수왕의 뿔피리",
      "icon": "📯",
      "classRelic": "ranger",
      "rankReq": "S",
      "desc": "[레인저 신화] 전투 시작 시 [🐆 흑표범 구엔위바]를 즉시 소환(체력 16 / 공격력 7)한 채 시작!"
    },
    "wiz_rank_b": {
      "id": "wiz_rank_b",
      "name": "🔮 [위저드 B급] 워터딥 마탑의 비전 수정",
      "icon": "💠",
      "classRelic": "wizard",
      "rankReq": "B",
      "desc": "[위저드 고유] 전투 시작 시 비전 구체 +1기 추가 소환 및 비전 주문력 +1."
    },
    "wiz_rank_s": {
      "id": "wiz_rank_s",
      "name": "👑 [위저드 S급] 대마법사의 아크메이지 로브",
      "icon": "🧙",
      "classRelic": "wizard",
      "rankReq": "S",
      "desc": "[위저드 신화] 매 턴 종료 시 비전 구체들의 공격력이 +3 증가하고 첫 턴 AP +1 획득!"
    },
    "clr_rank_b": {
      "id": "clr_rank_b",
      "name": "☀️ [클레릭 B급] 새벽의 성배",
      "icon": "🏺",
      "classRelic": "cleric",
      "rankReq": "B",
      "desc": "[클레릭 고유] 매 전투 종료 후 체력을 +4 추가 회복하고 전투 시작 시 수호령 구체 +1기 소환."
    },
    "clr_rank_s": {
      "id": "clr_rank_s",
      "name": "👑 [클레릭 S급] 태양신 라센더의 면류관",
      "icon": "👑",
      "classRelic": "cleric",
      "rankReq": "S",
      "desc": "[클레릭 신화] 전투 시작 시 방어도 +10 및 매 턴 종료 시 내 체력을 +2 회복!"
    },
    "pal_rank_b": {
      "id": "pal_rank_b",
      "name": "🛡️ [팔라딘 B급] 은빛 성기사의 맹세 인장",
      "icon": "⚜️",
      "classRelic": "paladin",
      "rankReq": "B",
      "desc": "[팔라딘 고유] 전투 시작 시 매 턴 종료 방어도(수호오라) +3 영구 획득."
    },
    "pal_rank_s": {
      "id": "pal_rank_s",
      "name": "👑 [팔라딘 S급] 천상의 심판 대검",
      "icon": "⚡",
      "classRelic": "paladin",
      "rankReq": "S",
      "desc": "[팔라딘 신화] 전투 시작 시 힘 +2, 방어도 +8 및 신성한 강타 자원 +2 획득!"
    },
    "wlk_rank_b": {
      "id": "wlk_rank_b",
      "name": "🟣 [워락 B급] 심연의 계약서 사본",
      "icon": "📜",
      "classRelic": "warlock",
      "rankReq": "B",
      "desc": "[워락 고유] 계약 악마 소환수의 시작 체력 +10 및 공격력 +3 증가!"
    },
    "wlk_rank_s": {
      "id": "wlk_rank_s",
      "name": "👑 [워락 S급] 아스모데우스의 흑요석 인장",
      "icon": "👁️",
      "classRelic": "warlock",
      "rankReq": "S",
      "desc": "[워락 신화] 매 턴 시작 시 계약 악마가 체력을 +5 회복하고 공격력이 +1 영구 상승!"
    }
  },
  "potions": {
    "rad_heal": {
      "id": "rad_heal",
      "name": "상급 치유 물약 (Greater Healing)",
      "icon": "🧪",
      "price": 45,
      "desc": "체력을 즉시 25 회복합니다."
    },
    "fury_stim": {
      "id": "fury_stim",
      "name": "거인의 힘 물약 (Giant Strength)",
      "icon": "💪",
      "price": 50,
      "desc": "이번 전투 동안 힘 +3 및 마나(AP) +2를 즉시 얻습니다."
    },
    "acid_bomb": {
      "id": "acid_bomb",
      "name": "연금술사의 불 & 산성 플라스크",
      "icon": "💣",
      "price": 50,
      "desc": "적 전체에게 피해 20과 산성 맹독 8을 부여합니다."
    },
    "shield_gel": {
      "id": "shield_gel",
      "name": "영웅심의 물약 (Potion of Heroism)",
      "icon": "📜",
      "price": 40,
      "desc": "즉시 임시 체력(방어도) 18을 얻고 카드를 2장 뽑습니다."
    }
  },
  "enemies": {
    "goblin_skirmisher": {
      "id": "goblin_skirmisher",
      "name": "고블린 매복병",
      "maxHp": 38,
      "type": "normal",
      "expReward": 40,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"20,40 35,20 65,20 80,40 70,82 30,82\" fill=\"#1e5631\" stroke=\"#2ecc71\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"48\" r=\"6\" fill=\"#ff3838\"/><circle cx=\"62\" cy=\"48\" r=\"6\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "시미터 베기",
          "intent": "attack",
          "dmg": 11,
          "desc": "피해 11"
        },
        {
          "name": "가죽 방패 엄폐",
          "intent": "defend_buff",
          "block": 9,
          "str": 2,
          "desc": "방어도 9 + 힘 +2"
        },
        {
          "name": "독화살 사격",
          "intent": "attack_debuff",
          "dmg": 8,
          "weak": 1,
          "desc": "피해 8 + 약화 1 + [정신] 1장",
          "addStatus": "status_dazed",
          "statusCount": 1
        }
      ],
      "curlUp": 7
    },
    "kobold_inventor": {
      "id": "kobold_inventor",
      "name": "코볼트 함정꾼",
      "maxHp": 36,
      "type": "normal",
      "expReward": 40,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"30,82 25,35 50,18 75,35 70,82\" fill=\"#78281f\" stroke=\"#e67e22\" stroke-width=\"3\"/><circle cx=\"40\" cy=\"45\" r=\"5\" fill=\"#ff0\"/><circle cx=\"60\" cy=\"45\" r=\"5\" fill=\"#ff0\"/></svg>",
      "moves": [
        {
          "name": "불항아리 투척",
          "intent": "attack_debuff",
          "dmg": 9,
          "vuln": 1,
          "desc": "피해 9 + 취약 1"
        },
        {
          "name": "무리 전술 찌르기",
          "intent": "multi_attack",
          "dmg": 7,
          "hits": 2,
          "desc": "피해 7 x 2"
        }
      ],
      "thorns": 2
    },
    "skeleton_warrior": {
      "id": "skeleton_warrior",
      "name": "고대 해골 병사",
      "maxHp": 46,
      "type": "normal",
      "expReward": 45,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"45\" r=\"28\" fill=\"#dfe6e9\" stroke=\"#636e72\" stroke-width=\"3\"/><circle cx=\"40\" cy=\"42\" r=\"6\" fill=\"#111\"/><circle cx=\"60\" cy=\"42\" r=\"6\" fill=\"#111\"/><rect x=\"38\" y=\"65\" width=\"24\" height=\"12\" fill=\"#dfe6e9\"/></svg>",
      "moves": [
        {
          "name": "녹슨 롱소드",
          "intent": "attack",
          "dmg": 13,
          "desc": "피해 13"
        },
        {
          "name": "뼈 방패 재조립",
          "intent": "defend_buff",
          "block": 12,
          "str": 3,
          "desc": "방어도 12 + 힘 +3"
        }
      ],
      "metallicize": 4
    },
    "orc_berserker": {
      "id": "orc_berserker",
      "name": "그룸쉬의 오크 광전사",
      "maxHp": 55,
      "type": "normal",
      "expReward": 50,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"25,85 20,35 50,18 80,35 75,85\" fill=\"#4a5d23\" stroke=\"#a3cb38\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"46\" r=\"6\" fill=\"#ff3838\"/><circle cx=\"62\" cy=\"46\" r=\"6\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "그레이트액스 강타",
          "intent": "attack",
          "dmg": 16,
          "desc": "피해 16"
        },
        {
          "name": "전투의 포효",
          "intent": "defend_buff",
          "block": 10,
          "str": 3,
          "desc": "방어도 10 + 힘 +3"
        }
      ],
      "regen": 4,
      "skillEnrage": 1
    },
    "owlbear_alpha": {
      "id": "owlbear_alpha",
      "name": "🦉 [엘리트] 흉포한 아울베어",
      "maxHp": 106,
      "type": "elite",
      "expReward": 110,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"52\" r=\"36\" fill=\"#5c3c10\" stroke=\"#fdcb6e\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"45\" r=\"8\" fill=\"#ff9f43\"/><circle cx=\"62\" cy=\"45\" r=\"8\" fill=\"#ff9f43\"/><polygon points=\"50,52 44,64 56,64\" fill=\"#ffeaa7\"/></svg>",
      "moves": [
        {
          "name": "부리와 발톱 다중공격",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 2,
          "desc": "피해 9 x 2"
        },
        {
          "name": "야수의 괴성",
          "intent": "defend_buff",
          "block": 16,
          "str": 4,
          "desc": "방어도 16 + 힘 +4"
        },
        {
          "name": "곰의 짓누르기",
          "intent": "attack_debuff",
          "dmg": 21,
          "vuln": 2,
          "desc": "피해 21 + 취약 2 + 손상 2 + [정신] 1장",
          "addStatus": "status_dazed",
          "statusCount": 1,
          "frail": 2
        }
      ],
      "thorns": 3
    },
    "bugbear_chieftain": {
      "id": "bugbear_chieftain",
      "name": "🔨 [엘리트] 버그베어 족장 클라그",
      "maxHp": 114,
      "type": "elite",
      "expReward": 115,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"22\" y=\"22\" width=\"56\" height=\"60\" rx=\"12\" fill=\"#4a2311\" stroke=\"#e67e22\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"46\" r=\"6\" fill=\"#ff3838\"/><circle cx=\"62\" cy=\"46\" r=\"6\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "모닝스타 기습 강타",
          "intent": "attack",
          "dmg": 22,
          "desc": "피해 22"
        },
        {
          "name": "족장의 호령",
          "intent": "defend_buff",
          "block": 18,
          "str": 3,
          "desc": "방어도 18 + 힘 +3"
        }
      ],
      "artifact": 1,
      "metallicize": 5,
      "skillEnrage": 2
    },
    "troll_warlord": {
      "id": "troll_warlord",
      "name": "🩸 [1층 중간보스] 초재생 변이 트롤",
      "maxHp": 150,
      "type": "elite",
      "expReward": 150,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,15 85,40 75,88 25,88 15,40\" fill=\"#1e5631\" stroke=\"#00ff88\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"48\" r=\"7\" fill=\"#ff0\"/><circle cx=\"62\" cy=\"48\" r=\"7\" fill=\"#ff0\"/></svg>",
      "moves": [
        {
          "name": "초재생 피부 & 괴력",
          "intent": "defend_buff",
          "block": 20,
          "str": 4,
          "desc": "방어도 20 + 힘 +4"
        },
        {
          "name": "갈기갈기 찢기",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 3,
          "desc": "피해 9 x 3"
        }
      ],
      "regen": 11
    },
    "beholder_xanathar": {
      "id": "beholder_xanathar",
      "name": "👁️ [1층 보스] 비홀더 군주 자나사르",
      "maxHp": 210,
      "type": "boss",
      "expReward": 250,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"65\" r=\"38\" fill=\"#4a154b\" stroke=\"#e056fd\" stroke-width=\"4\"/><circle cx=\"60\" cy=\"60\" r=\"18\" fill=\"#fff\"/><circle cx=\"60\" cy=\"60\" r=\"8\" fill=\"#ff0055\"/><line x1=\"40\" y1=\"30\" x2=\"25\" y2=\"12\" stroke=\"#e056fd\" stroke-width=\"4\"/><circle cx=\"25\" cy=\"12\" r=\"6\" fill=\"#00ff88\"/><line x1=\"80\" y1=\"30\" x2=\"95\" y2=\"12\" stroke=\"#e056fd\" stroke-width=\"4\"/><circle cx=\"95\" cy=\"12\" r=\"6\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "분해 광선 & 석화 광선",
          "intent": "attack_debuff",
          "dmg": 21,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 21 + 약화 2 + 취약 2 + [정신] 2장",
          "addStatus": "status_dazed",
          "statusCount": 2
        },
        {
          "name": "반마법 원뿔 결계",
          "intent": "defend_buff",
          "block": 23,
          "str": 4,
          "desc": "방어도 23 + 힘 +4"
        },
        {
          "name": "10개의 눈 광선 난사",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 3,
          "desc": "피해 9 x 3"
        },
        {
          "name": "죽음의 광선 (Death Ray)",
          "intent": "attack",
          "dmg": 32,
          "desc": "피해 32"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "drow_assassin": {
      "id": "drow_assassin",
      "name": "드로우 암살자",
      "maxHp": 54,
      "type": "normal",
      "expReward": 55,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"34\" fill=\"#2c2c54\" stroke=\"#a29bfe\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"48\" r=\"5\" fill=\"#ff3838\"/><circle cx=\"62\" cy=\"48\" r=\"5\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "드로우 수면독 석궁",
          "intent": "attack_debuff",
          "dmg": 13,
          "weak": 2,
          "desc": "피해 13 + 약화 2 + [점액] 1장",
          "addStatus": "status_slimed",
          "statusCount": 1
        },
        {
          "name": "쌍단검 연격",
          "intent": "multi_attack",
          "dmg": 8,
          "hits": 2,
          "desc": "피해 8 x 2"
        }
      ],
      "curlUp": 7
    },
    "hook_horror": {
      "id": "hook_horror",
      "name": "훅 호러 (갈고리 괴수)",
      "maxHp": 67,
      "type": "normal",
      "expReward": 60,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,15 85,45 70,85 30,85 15,45\" fill=\"#2f3640\" stroke=\"#74b9ff\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "양손 갈고리 찍기",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 2,
          "desc": "피해 11 x 2"
        },
        {
          "name": "외골격 방어",
          "intent": "defend_buff",
          "block": 16,
          "str": 3,
          "desc": "방어도 16 + 힘 +3"
        }
      ],
      "thorns": 2
    },
    "giant_phase_spider": {
      "id": "giant_phase_spider",
      "name": "차원 이동 거대 거미",
      "maxHp": 58,
      "type": "normal",
      "expReward": 55,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"52\" r=\"30\" fill=\"#192a56\" stroke=\"#00d2d3\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"45\" r=\"5\" fill=\"#00ff88\"/><circle cx=\"58\" cy=\"45\" r=\"5\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "에테르 독니 물어뜯기",
          "intent": "attack_debuff",
          "dmg": 16,
          "vuln": 2,
          "desc": "피해 16 + 취약 2 + [정신] 1장",
          "addStatus": "status_dazed",
          "statusCount": 1
        },
        {
          "name": "거미줄 방어",
          "intent": "defend_buff",
          "block": 13,
          "str": 3,
          "desc": "방어도 13 + 힘 +3"
        }
      ],
      "metallicize": 4
    },
    "duergar_hammerer": {
      "id": "duergar_hammerer",
      "name": "듀에르가 거대화 전사",
      "maxHp": 65,
      "type": "normal",
      "expReward": 60,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"24\" y=\"24\" width=\"52\" height=\"54\" fill=\"#3d3d3d\" stroke=\"#ff7675\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "전쟁망치 강타",
          "intent": "attack",
          "dmg": 18,
          "desc": "피해 18"
        },
        {
          "name": "거대화 (Enlarge)",
          "intent": "defend_buff",
          "block": 13,
          "str": 4,
          "desc": "방어도 13 + 힘 +4"
        }
      ],
      "regen": 4,
      "skillEnrage": 1
    },
    "drider_champion": {
      "id": "drider_champion",
      "name": "🕷️ [엘리트] 롤스의 저주받은 드라이다",
      "maxHp": 132,
      "type": "elite",
      "expReward": 130,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"#3b1e54\" stroke=\"#e056fd\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "요정 불꽃 & 맹독 장궁",
          "intent": "attack_debuff",
          "dmg": 21,
          "vuln": 2,
          "desc": "피해 21 + 취약 2 + 손상 2 + [점액] 1장",
          "addStatus": "status_slimed",
          "frail": 2
        },
        {
          "name": "거미 다리 난무",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 3,
          "desc": "피해 11 x 3"
        }
      ],
      "artifact": 1,
      "metallicize": 5
    },
    "umbeR_hulk": {
      "id": "umbeR_hulk",
      "name": "🪲 [엘리트] 땅굴 파괴자 엄버 헐크",
      "maxHp": 142,
      "type": "elite",
      "expReward": 135,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" rx=\"12\" fill=\"#4a3500\" stroke=\"#fdcb6e\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "혼란의 시선 & 집게발",
          "intent": "attack_debuff",
          "dmg": 24,
          "weak": 2,
          "desc": "피해 24 + 약화 2 + [깊은] 1장 + 플레이어 힘 -1",
          "addStatus": "status_wound",
          "statusCount": 1,
          "strDown": 1
        },
        {
          "name": "갑충 껍질 경화",
          "intent": "defend_buff",
          "block": 21,
          "str": 4,
          "desc": "방어도 21 + 힘 +4"
        }
      ],
      "metallicize": 8
    },
    "drow_priestess": {
      "id": "drow_priestess",
      "name": "🐍 [2층 중간보스] 드로우 대여사제",
      "maxHp": 168,
      "type": "elite",
      "expReward": 170,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,12 86,42 74,88 26,88 14,42\" fill=\"#2c003e\" stroke=\"#e056fd\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "뱀 채찍 3연타",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 3,
          "desc": "피해 11 x 3"
        },
        {
          "name": "거미 여왕의 축복",
          "intent": "defend_buff",
          "block": 23,
          "str": 5,
          "desc": "방어도 23 + 힘 +5"
        }
      ],
      "artifact": 1,
      "metallicize": 5
    },
    "arachne_matron": {
      "id": "arachne_matron",
      "name": "👑 [2층 보스] 롤스의 화신 아라크네 대모",
      "maxHp": 252,
      "type": "boss",
      "expReward": 300,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,10 105,38 92,98 60,112 28,98 15,38\" fill=\"#2c001e\" stroke=\"#ff0055\" stroke-width=\"4\"/><circle cx=\"45\" cy=\"50\" r=\"7\" fill=\"#00ff88\"/><circle cx=\"75\" cy=\"50\" r=\"7\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "심연의 거미줄 구속",
          "intent": "attack_debuff",
          "dmg": 24,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 24 + 약화 2 + 취약 2 + 손상 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2,
          "frail": 2
        },
        {
          "name": "여왕의 암흑 결계",
          "intent": "defend_buff",
          "block": 29,
          "str": 5,
          "desc": "방어도 29 + 힘 +5"
        },
        {
          "name": "맹독 송곳니 난타",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "desc": "피해 12 x 3"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "intellect_devourer": {
      "id": "intellect_devourer",
      "name": "지능 포식자 (뇌 괴수)",
      "maxHp": 62,
      "type": "normal",
      "expReward": 65,
      "svg": "<svg viewBox=\"0 0 100 100\"><ellipse cx=\"50\" cy=\"52\" rx=\"34\" ry=\"24\" fill=\"#b33771\" stroke=\"#fd79a8\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "정신 파열 (Mind Blast)",
          "intent": "attack_debuff",
          "dmg": 17,
          "vuln": 2,
          "desc": "피해 17 + 취약 2 + [점액] 1장",
          "addStatus": "status_slimed",
          "statusCount": 1
        },
        {
          "name": "발톱 2연타",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 2,
          "desc": "피해 9 x 2"
        }
      ],
      "curlUp": 7
    },
    "mind_flayer_arcanist": {
      "id": "mind_flayer_arcanist",
      "name": "마인드 플레이어 비전술사",
      "maxHp": 77,
      "type": "normal",
      "expReward": 75,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"44\" r=\"26\" fill=\"#6c5ce7\" stroke=\"#a29bfe\" stroke-width=\"3\"/><path d=\"M38 62 L32 88 M46 65 L44 90 M54 65 L56 90 M62 62 L68 88\" stroke=\"#a29bfe\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "정신 채찍 (Mind Whip)",
          "intent": "attack_debuff",
          "dmg": 20,
          "weak": 2,
          "desc": "피해 20 + 약화 2"
        },
        {
          "name": "염동력 방벽",
          "intent": "defend_buff",
          "block": 18,
          "str": 4,
          "desc": "방어도 18 + 힘 +4"
        }
      ],
      "thorns": 2
    },
    "grimlock_brute": {
      "id": "grimlock_brute",
      "name": "맹인 그림록 광전사",
      "maxHp": 74,
      "type": "normal",
      "expReward": 70,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"24\" y=\"24\" width=\"52\" height=\"54\" rx=\"10\" fill=\"#636e72\" stroke=\"#dfe6e9\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "가시 몽둥이 강타",
          "intent": "attack",
          "dmg": 21,
          "desc": "피해 21"
        },
        {
          "name": "돌가죽 경화",
          "intent": "defend_buff",
          "block": 16,
          "str": 3,
          "desc": "방어도 16 + 힘 +3"
        }
      ],
      "metallicize": 4,
      "skillEnrage": 1
    },
    "nothics_eye": {
      "id": "nothics_eye",
      "name": "기괴한 외눈 노식(Nothic)",
      "maxHp": 70,
      "type": "normal",
      "expReward": 70,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"32\" fill=\"#1e272e\" stroke=\"#00ff88\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"50\" r=\"14\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "부패의 시선",
          "intent": "attack_debuff",
          "dmg": 18,
          "vuln": 2,
          "desc": "피해 18 + 취약 2"
        },
        {
          "name": "발톱 할퀴기",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 2,
          "desc": "피해 11 x 2"
        }
      ],
      "regen": 4
    },
    "mind_flayer_inquisitor": {
      "id": "mind_flayer_inquisitor",
      "name": "🐙 [엘리트] 일리시드 심문관",
      "maxHp": 154,
      "type": "elite",
      "expReward": 150,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"46\" r=\"32\" fill=\"#4834d4\" stroke=\"#e056fd\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "뇌 추출 (Extract Brain)",
          "intent": "attack",
          "dmg": 29,
          "desc": "피해 29 + [정신] 1장 + 플레이어 힘 -1",
          "addStatus": "status_dazed",
          "strDown": 1
        },
        {
          "name": "사이오닉 폭풍",
          "intent": "attack_debuff",
          "dmg": 21,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 21 + 약화 2 + 취약 2 + 손상 2 + [정신] 1장",
          "addStatus": "status_dazed",
          "statusCount": 1,
          "frail": 2
        }
      ],
      "artifact": 2
    },
    "githyanki_kithrak": {
      "id": "githyanki_kithrak",
      "name": "⚔️ [엘리트] 기스양키 은검 기사장",
      "maxHp": 162,
      "type": "elite",
      "expReward": 155,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,12 85,45 70,88 30,88 15,45\" fill=\"#b71540\" stroke=\"#fad390\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "아스트랄 은검 3연격",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "desc": "피해 12 x 3"
        },
        {
          "name": "염력 갑주 전개",
          "intent": "defend_buff",
          "block": 23,
          "str": 4,
          "desc": "방어도 23 + 힘 +4"
        }
      ],
      "artifact": 1,
      "metallicize": 5,
      "skillEnrage": 2
    },
    "ulitharid_lord": {
      "id": "ulitharid_lord",
      "name": "🧠 [3층 중간보스] 고위 마인드 플레이어 울리사리드",
      "maxHp": 192,
      "type": "elite",
      "expReward": 190,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"#30336b\" stroke=\"#00d2d3\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "정신 지배 파동",
          "intent": "attack_debuff",
          "dmg": 25,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 25 + 약화 2 + 취약 2 + [정신] 1장",
          "addStatus": "status_dazed",
          "statusCount": 1
        },
        {
          "name": "6개의 촉수 난타",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "desc": "피해 12 x 3"
        }
      ],
      "artifact": 1,
      "metallicize": 5
    },
    "elder_brain_prime": {
      "id": "elder_brain_prime",
      "name": "👑 [3층 보스] 군락의 지배자 엘더 브레인",
      "maxHp": 294,
      "type": "boss",
      "expReward": 350,
      "svg": "<svg viewBox=\"0 0 120 120\"><ellipse cx=\"60\" cy=\"60\" rx=\"48\" ry=\"38\" fill=\"#686de0\" stroke=\"#ff7979\" stroke-width=\"5\"/></svg>",
      "moves": [
        {
          "name": "초월 정신 폭발 (Psychic Blast)",
          "intent": "attack_debuff",
          "dmg": 28,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 28 + 약화 2 + 취약 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        },
        {
          "name": "사이오닉 절대 장벽",
          "intent": "defend_buff",
          "block": 33,
          "str": 5,
          "desc": "방어도 33 + 힘 +5"
        },
        {
          "name": "영혼 분쇄 촉수",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 3,
          "desc": "피해 13 x 3"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "wight_executioner": {
      "id": "wight_executioner",
      "name": "생명력 흡수자 와이트(Wight)",
      "maxHp": 82,
      "type": "normal",
      "expReward": 80,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"32\" fill=\"#2f3640\" stroke=\"#00cec9\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "생명력 흡수 대검",
          "intent": "attack_debuff",
          "dmg": 21,
          "weak": 2,
          "desc": "피해 21 + 약화 2 + 손상 2 + [점액] 1장 + 플레이어 힘 -1",
          "addStatus": "status_slimed",
          "statusCount": 1,
          "frail": 2,
          "strDown": 1
        },
        {
          "name": "사령 갑주",
          "intent": "defend_buff",
          "block": 18,
          "str": 4,
          "desc": "방어도 18 + 힘 +4"
        }
      ],
      "curlUp": 7
    },
    "wraith_stalker": {
      "id": "wraith_stalker",
      "name": "심연의 망령 레이스(Wraith)",
      "maxHp": 77,
      "type": "normal",
      "expReward": 80,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,12 85,50 70,88 30,88 15,50\" fill=\"#1e272e\" stroke=\"#a29bfe\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "영혼 부패 손길",
          "intent": "attack_debuff",
          "dmg": 20,
          "vuln": 2,
          "desc": "피해 20 + 취약 2 + 플레이어 힘 -1",
          "strDown": 1
        },
        {
          "name": "비물질화 방어",
          "intent": "defend_buff",
          "block": 20,
          "str": 3,
          "desc": "방어도 20 + 힘 +3"
        }
      ],
      "thorns": 2
    },
    "flesh_golem": {
      "id": "flesh_golem",
      "name": "누더기 살점 골렘",
      "maxHp": 94,
      "type": "normal",
      "expReward": 85,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"22\" y=\"22\" width=\"56\" height=\"56\" fill=\"#6d214f\" stroke=\"#55efc4\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "괴력의 양손 강타",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 2,
          "desc": "피해 13 x 2"
        },
        {
          "name": "번개 흡수 재생",
          "intent": "defend_buff",
          "block": 18,
          "str": 4,
          "desc": "방어도 18 + 힘 +4"
        }
      ],
      "metallicize": 4
    },
    "vampire_spawn": {
      "id": "vampire_spawn",
      "name": "뱀파이어 스폰 혈귀",
      "maxHp": 86,
      "type": "normal",
      "expReward": 85,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"32\" fill=\"#641e16\" stroke=\"#ff4757\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "흡혈 물어뜯기",
          "intent": "attack",
          "dmg": 24,
          "desc": "피해 24"
        },
        {
          "name": "박쥐 안개 회피",
          "intent": "defend_buff",
          "block": 18,
          "str": 4,
          "desc": "방어도 18 + 힘 +4"
        }
      ],
      "regen": 4
    },
    "death_knight_general": {
      "id": "death_knight_general",
      "name": "💀 [엘리트] 타락한 데스나이트 사령관",
      "maxHp": 180,
      "type": "elite",
      "expReward": 175,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,10 88,42 76,88 24,88 12,42\" fill=\"#1e272e\" stroke=\"#ff4757\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "지옥불 구체 (Hellfire Orb)",
          "intent": "attack_debuff",
          "dmg": 29,
          "vuln": 2,
          "desc": "피해 29 + 취약 2 + [점액] 1장",
          "addStatus": "status_slimed",
          "statusCount": 1
        },
        {
          "name": "파멸의 마검 3연격",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "desc": "피해 12 x 3"
        }
      ],
      "artifact": 1,
      "metallicize": 5,
      "skillEnrage": 2
    },
    "iron_golem_sentinel": {
      "id": "iron_golem_sentinel",
      "name": "🛡️ [엘리트] 무덤 수호자 아이언 골렘",
      "maxHp": 194,
      "type": "elite",
      "expReward": 180,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"18\" y=\"18\" width=\"64\" height=\"64\" rx=\"10\" fill=\"#2f3640\" stroke=\"#00d2d3\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "독가스 브레스",
          "intent": "attack_debuff",
          "dmg": 25,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 25 + 약화 2 + 취약 2 + [깊은] 1장",
          "addStatus": "status_wound",
          "statusCount": 1
        },
        {
          "name": "강철 거인의 철퇴",
          "intent": "attack",
          "dmg": 33,
          "desc": "피해 33"
        }
      ],
      "metallicize": 14,
      "artifact": 2
    },
    "vampire_lord_strahd": {
      "id": "vampire_lord_strahd",
      "name": "🦇 [4층 중간보스] 바로비아의 백작 스트라드",
      "maxHp": 222,
      "type": "elite",
      "expReward": 210,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"#2c001e\" stroke=\"#ff4757\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "피의 귀족 흡혈격",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 3,
          "desc": "흡혈 피해 13 x 3 + 플레이어 힘 -1",
          "lifesteal": true,
          "strDown": 1
        },
        {
          "name": "레이븐로프트의 안개",
          "intent": "defend_buff",
          "block": 29,
          "str": 5,
          "desc": "방어도 29 + 힘 +5"
        }
      ],
      "regen": 14
    },
    "archlich_acererak": {
      "id": "archlich_acererak",
      "name": "👑 [4층 보스] 영원한 아치리치 아세라락",
      "maxHp": 336,
      "type": "boss",
      "expReward": 400,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,8 104,38 92,98 60,112 28,98 16,38\" fill=\"#130f40\" stroke=\"#00ff88\" stroke-width=\"4\"/><circle cx=\"44\" cy=\"52\" r=\"8\" fill=\"#00ff88\"/><circle cx=\"76\" cy=\"52\" r=\"8\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "권능어: 고통 (Power Word Pain)",
          "intent": "attack_debuff",
          "dmg": 30,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 30 + 약화 2 + 취약 2 + [지옥] 2장 + 플레이어 힘 -1",
          "addStatus": "status_burn",
          "statusCount": 2,
          "strDown": 1
        },
        {
          "name": "성물함의 불사 결계",
          "intent": "defend_buff",
          "block": 36,
          "str": 7,
          "desc": "방어도 36 + 힘 +7"
        },
        {
          "name": "영혼 수확의 지팡이",
          "intent": "multi_attack",
          "dmg": 15,
          "hits": 3,
          "desc": "피해 15 x 3"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "bearded_devil": {
      "id": "bearded_devil",
      "name": "아베르누스 수염 악마",
      "maxHp": 94,
      "type": "normal",
      "expReward": 95,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"34\" fill=\"#641e16\" stroke=\"#e67e22\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "지옥불 글레이브",
          "intent": "attack_debuff",
          "dmg": 24,
          "vuln": 2,
          "desc": "피해 24 + 취약 2 + [지옥] 1장",
          "addStatus": "status_burn",
          "statusCount": 1
        },
        {
          "name": "악마의 저항",
          "intent": "defend_buff",
          "block": 21,
          "str": 4,
          "desc": "방어도 21 + 힘 +4"
        }
      ],
      "curlUp": 7
    },
    "erinyes_valkyrie": {
      "id": "erinyes_valkyrie",
      "name": "타락 천사 에리니에스",
      "maxHp": 101,
      "type": "normal",
      "expReward": 100,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,12 88,45 72,88 28,88 12,45\" fill=\"#833471\" stroke=\"#fdcb6e\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "맹독 화살 3연사",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 3,
          "desc": "피해 11 x 3"
        },
        {
          "name": "지옥 갑주 패링",
          "intent": "defend_buff",
          "block": 23,
          "str": 4,
          "desc": "방어도 23 + 힘 +4"
        }
      ],
      "thorns": 2
    },
    "red_abishai": {
      "id": "red_abishai",
      "name": "티아마트의 적색 아비샤이",
      "maxHp": 106,
      "type": "normal",
      "expReward": 105,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,10 88,50 50,90 12,50\" fill=\"#c0392b\" stroke=\"#ffeaa7\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "화염 용조 강타",
          "intent": "attack",
          "dmg": 28,
          "desc": "피해 28"
        },
        {
          "name": "용의 위압감",
          "intent": "defend_buff",
          "block": 21,
          "str": 5,
          "desc": "방어도 21 + 힘 +5"
        }
      ],
      "metallicize": 4
    },
    "hellfire_engine": {
      "id": "hellfire_engine",
      "name": "지옥불 공성 병기",
      "maxHp": 113,
      "type": "normal",
      "expReward": 110,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" rx=\"8\" fill=\"#2d3436\" stroke=\"#ff4757\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "지옥불 화염방사기",
          "intent": "attack_debuff",
          "dmg": 25,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 25 + 약화 2 + 취약 2"
        },
        {
          "name": "지옥철 장갑",
          "intent": "defend_buff",
          "block": 26,
          "str": 4,
          "desc": "방어도 26 + 힘 +4"
        }
      ],
      "regen": 4
    },
    "pit_fiend_overlord": {
      "id": "pit_fiend_overlord",
      "name": "😈 [엘리트] 나인 헬 군단장 핏 핀드",
      "maxHp": 210,
      "type": "elite",
      "expReward": 210,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"#641e16\" stroke=\"#ff0055\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "지옥 철퇴 3연타",
          "intent": "multi_attack",
          "dmg": 15,
          "hits": 3,
          "desc": "피해 15 x 3"
        },
        {
          "name": "대악마의 공포 오라",
          "intent": "defend_buff",
          "block": 31,
          "str": 7,
          "desc": "방어도 31 + 힘 +7"
        }
      ],
      "artifact": 1,
      "metallicize": 5,
      "skillEnrage": 2
    },
    "ancient_red_dragon": {
      "id": "ancient_red_dragon",
      "name": "🐉 [엘리트] 에인션트 레드 드래곤 인페르노",
      "maxHp": 228,
      "type": "elite",
      "expReward": 230,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,8 90,42 75,90 25,90 10,42\" fill=\"#900c3f\" stroke=\"#fdcb6e\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "고룡의 화염 브레스",
          "intent": "attack_debuff",
          "dmg": 34,
          "vuln": 2,
          "desc": "피해 34 + 취약 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        },
        {
          "name": "용린 각성",
          "intent": "defend_buff",
          "block": 31,
          "str": 7,
          "desc": "방어도 31 + 힘 +7"
        }
      ],
      "thorns": 4
    },
    "zariel_archduke": {
      "id": "zariel_archduke",
      "name": "⚔️ [5층 중간보스] 아베르누스의 대공 자리엘",
      "maxHp": 264,
      "type": "elite",
      "expReward": 260,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#4a1c03\" stroke=\"#ffeaa7\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "타락 천사의 불꽃검 3연격",
          "intent": "multi_attack",
          "dmg": 16,
          "hits": 3,
          "desc": "피해 16 x 3"
        },
        {
          "name": "대공의 지옥 결계",
          "intent": "defend_buff",
          "block": 34,
          "str": 7,
          "desc": "방어도 34 + 힘 +7"
        }
      ],
      "artifact": 1,
      "metallicize": 5
    },
    "tiamat_dragon_queen": {
      "id": "tiamat_dragon_queen",
      "name": "👑 [5층 보스] 오색룡의 여신 티아마트 (CR 30)",
      "maxHp": 420,
      "type": "boss",
      "expReward": 1000,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,6 110,36 95,102 60,115 25,102 10,36\" fill=\"#2c001e\" stroke=\"#fdcb6e\" stroke-width=\"5\"/><circle cx=\"32\" cy=\"42\" r=\"7\" fill=\"#ff3838\"/><circle cx=\"46\" cy=\"32\" r=\"7\" fill=\"#00d2d3\"/><circle cx=\"60\" cy=\"26\" r=\"8\" fill=\"#2ecc71\"/><circle cx=\"74\" cy=\"32\" r=\"7\" fill=\"#dfe6e9\"/><circle cx=\"88\" cy=\"42\" r=\"7\" fill=\"#111\"/></svg>",
      "moves": [
        {
          "name": "5대 브레스: 화염·냉기·산성·번개·맹독",
          "intent": "attack_debuff",
          "dmg": 34,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 34 + 약화 2 + 취약 2 + 손상 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2,
          "frail": 2
        },
        {
          "name": "신성한 오색 비늘 재생",
          "intent": "defend_buff",
          "block": 42,
          "str": 8,
          "desc": "방어도 42 + 힘 +8"
        },
        {
          "name": "5개 용머리의 동시 물어뜯기",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 4,
          "desc": "피해 13 x 4"
        },
        {
          "name": "창세의 종말 브레스",
          "intent": "attack",
          "dmg": 50,
          "desc": "피해 50"
        }
      ],
      "artifact": 3,
      "regen": 16
    },
    "young_green_dragon": {
      "id": "young_green_dragon",
      "name": "🐉 [1층 보스] 영 그린 드래곤 베놈팽",
      "maxHp": 216,
      "type": "boss",
      "expReward": 250,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,10 105,40 90,100 60,112 30,100 15,40\" fill=\"#0b3b24\" stroke=\"#00ff88\" stroke-width=\"4\"/><circle cx=\"44\" cy=\"50\" r=\"8\" fill=\"#ffeaa7\"/><circle cx=\"76\" cy=\"50\" r=\"8\" fill=\"#ffeaa7\"/><path d=\"M40 78 Q60 92 80 78\" stroke=\"#00ff88\" stroke-width=\"4\" fill=\"none\"/></svg>",
      "moves": [
        {
          "name": "맹독 가스 브레스 (Poison Breath)",
          "intent": "attack_debuff",
          "dmg": 20,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 20 + 약화 2 + 취약 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        },
        {
          "name": "교활한 비행 & 비늘 경화",
          "intent": "defend_buff",
          "block": 23,
          "str": 4,
          "desc": "방어도 23 + 힘 +4"
        },
        {
          "name": "물기 & 양발톱 3연타",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 3,
          "desc": "피해 9 x 3"
        },
        {
          "name": "꼬리 후려치기",
          "intent": "attack",
          "dmg": 29,
          "desc": "피해 29"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "ettin_king_gror": {
      "id": "ettin_king_gror",
      "name": "🪓 [1층 보스] 쌍두 거인 왕 에틴 그로르",
      "maxHp": 230,
      "type": "boss",
      "expReward": 250,
      "svg": "<svg viewBox=\"0 0 120 120\"><rect x=\"20\" y=\"25\" width=\"80\" height=\"75\" rx=\"18\" fill=\"#5c3c10\" stroke=\"#e67e22\" stroke-width=\"4\"/><circle cx=\"42\" cy=\"48\" r=\"14\" fill=\"#d35400\"/><circle cx=\"78\" cy=\"48\" r=\"14\" fill=\"#d35400\"/><circle cx=\"38\" cy=\"46\" r=\"4\" fill=\"#ff0\"/><circle cx=\"82\" cy=\"46\" r=\"4\" fill=\"#ff0\"/></svg>",
      "moves": [
        {
          "name": "양손 배틀액스 & 모닝스타 쌍타",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 2,
          "desc": "피해 13 x 2"
        },
        {
          "name": "두 머리의 각성 포효",
          "intent": "defend_buff",
          "block": 21,
          "str": 5,
          "desc": "방어도 21 + 힘 +5"
        },
        {
          "name": "대지 분쇄 내려찍기",
          "intent": "attack_debuff",
          "dmg": 25,
          "vuln": 2,
          "desc": "피해 25 + 취약 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "goblin_shaman_king": {
      "id": "goblin_shaman_king",
      "name": "👺 [1층 보스] 홉고블린 대장군 마그도르",
      "maxHp": 204,
      "type": "boss",
      "expReward": 250,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,12 100,38 88,98 32,98 20,38\" fill=\"#641e16\" stroke=\"#ff4757\" stroke-width=\"4\"/><rect x=\"38\" y=\"46\" width=\"44\" height=\"10\" fill=\"#fdcb6e\"/></svg>",
      "moves": [
        {
          "name": "군단 전술: 철벽 방진",
          "intent": "defend_buff",
          "block": 26,
          "str": 4,
          "desc": "방어도 26 + 힘 +4"
        },
        {
          "name": "마글루비예트의 피의 창",
          "intent": "attack_debuff",
          "dmg": 22,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 22 + 약화 2 + 취약 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        },
        {
          "name": "대장군의 롱소드 3연격",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 3,
          "desc": "피해 9 x 3"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "aboleth_leviathan": {
      "id": "aboleth_leviathan",
      "name": "🦑 [2층 보스] 태고의 심해 괴수 아볼레스",
      "maxHp": 258,
      "type": "boss",
      "expReward": 300,
      "svg": "<svg viewBox=\"0 0 120 120\"><ellipse cx=\"60\" cy=\"60\" rx=\"46\" ry=\"34\" fill=\"#0c2461\" stroke=\"#00d2d3\" stroke-width=\"4\"/><circle cx=\"60\" cy=\"45\" r=\"7\" fill=\"#ff3838\"/><circle cx=\"60\" cy=\"60\" r=\"7\" fill=\"#ff3838\"/><circle cx=\"60\" cy=\"75\" r=\"7\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "정신 노예화 & 점액 질병",
          "intent": "attack_debuff",
          "dmg": 24,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 24 + 약화 2 + 취약 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        },
        {
          "name": "촉수 3연속 후려치기",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "desc": "피해 12 x 3"
        },
        {
          "name": "심연의 점액 장막",
          "intent": "defend_buff",
          "block": 29,
          "str": 5,
          "desc": "방어도 29 + 힘 +5"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "purple_worm_titan": {
      "id": "purple_worm_titan",
      "name": "🪱 [2층 보스] 언더다크 대지포식자 퍼플 웜",
      "maxHp": 282,
      "type": "boss",
      "expReward": 300,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"44\" fill=\"#5f27cd\" stroke=\"#e056fd\" stroke-width=\"5\"/><circle cx=\"60\" cy=\"60\" r=\"22\" fill=\"#222\" stroke=\"#fff\" stroke-width=\"4\" stroke-dasharray=\"6,4\"/></svg>",
      "moves": [
        {
          "name": "통째로 집어삼키기 (Bite & Swallow)",
          "intent": "attack",
          "dmg": 34,
          "desc": "피해 34"
        },
        {
          "name": "꼬리 독침 찌르기",
          "intent": "attack_debuff",
          "dmg": 25,
          "vuln": 3,
          "desc": "피해 25 + 취약 3 + 손상 2 + [깊은] 2장",
          "addStatus": "status_wound",
          "statusCount": 2,
          "frail": 2
        },
        {
          "name": "암반 갑피 재생",
          "intent": "defend_buff",
          "block": 29,
          "str": 5,
          "desc": "방어도 29 + 힘 +5"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "duergar_despot": {
      "id": "duergar_despot",
      "name": "🔨 [2층 보스] 듀에르가 기계폭군 스틸비어드",
      "maxHp": 246,
      "type": "boss",
      "expReward": 300,
      "svg": "<svg viewBox=\"0 0 120 120\"><rect x=\"22\" y=\"22\" width=\"76\" height=\"76\" rx=\"12\" fill=\"#2f3640\" stroke=\"#ff7675\" stroke-width=\"4\"/><circle cx=\"45\" cy=\"52\" r=\"7\" fill=\"#ff3838\"/><circle cx=\"75\" cy=\"52\" r=\"7\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "사이오닉 초거대화 & 중장갑",
          "intent": "defend_buff",
          "block": 31,
          "str": 5,
          "desc": "방어도 31 + 힘 +5"
        },
        {
          "name": "화염 방사 & 철권 연타",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "desc": "피해 12 x 3"
        },
        {
          "name": "공성 망치 대지 분쇄",
          "intent": "attack_debuff",
          "dmg": 28,
          "weak": 2,
          "desc": "피해 28 + 약화 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "beholder_hive_mother": {
      "id": "beholder_hive_mother",
      "name": "👁️‍🗨️ [3층 보스] 비홀더 군체 어미 하이브 마더",
      "maxHp": 300,
      "type": "boss",
      "expReward": 350,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"62\" r=\"42\" fill=\"#2c003e\" stroke=\"#ff0055\" stroke-width=\"5\"/><circle cx=\"60\" cy=\"58\" r=\"18\" fill=\"#00ff88\"/><circle cx=\"60\" cy=\"58\" r=\"8\" fill=\"#111\"/></svg>",
      "moves": [
        {
          "name": "궁극 분해 광선 & 지배 광선",
          "intent": "attack_debuff",
          "dmg": 29,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 29 + 약화 2 + 취약 2 + [정신] 2장",
          "addStatus": "status_dazed",
          "statusCount": 2
        },
        {
          "name": "군체 눈알 일제 사격",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 3,
          "desc": "피해 13 x 3"
        },
        {
          "name": "절대 반마법 역장",
          "intent": "defend_buff",
          "block": 33,
          "str": 5,
          "desc": "방어도 33 + 힘 +5"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "githyanki_supreme": {
      "id": "githyanki_supreme",
      "name": "⚔️ [3층 보스] 기스양키 최고 사령관 크스락",
      "maxHp": 288,
      "type": "boss",
      "expReward": 350,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,10 102,42 88,100 32,100 18,42\" fill=\"#b71540\" stroke=\"#ffeaa7\" stroke-width=\"4\"/><circle cx=\"46\" cy=\"52\" r=\"6\" fill=\"#ffeaa7\"/><circle cx=\"74\" cy=\"52\" r=\"6\" fill=\"#ffeaa7\"/></svg>",
      "moves": [
        {
          "name": "전설의 아스트랄 은검 4연격",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 4,
          "desc": "피해 11 x 4"
        },
        {
          "name": "블라키스의 염력 장벽",
          "intent": "defend_buff",
          "block": 31,
          "str": 7,
          "desc": "방어도 31 + 힘 +7"
        },
        {
          "name": "차원 절단 일격",
          "intent": "attack_debuff",
          "dmg": 32,
          "vuln": 2,
          "desc": "피해 32 + 취약 2 + [깊은] 2장",
          "addStatus": "status_wound",
          "statusCount": 2
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "neothelid_leviathan": {
      "id": "neothelid_leviathan",
      "name": "🐙 [3층 보스] 심연의 촉수 거수 네오텔리드",
      "maxHp": 312,
      "type": "boss",
      "expReward": 350,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"44\" fill=\"#4a154b\" stroke=\"#00cec9\" stroke-width=\"5\"/><path d=\"M35 35 L85 85 M85 35 L35 85\" stroke=\"#e056fd\" stroke-width=\"5\"/></svg>",
      "moves": [
        {
          "name": "뇌 용해 산성 브레스",
          "intent": "attack_debuff",
          "dmg": 28,
          "weak": 3,
          "vuln": 2,
          "desc": "피해 28 + 약화 3 + 취약 2 + 손상 2 + [점액] 2장",
          "addStatus": "status_slimed",
          "statusCount": 2,
          "frail": 2
        },
        {
          "name": "거대 촉수 3연속 압살",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 3,
          "desc": "피해 13 x 3"
        },
        {
          "name": "외계 재생 갑피",
          "intent": "defend_buff",
          "block": 31,
          "str": 5,
          "desc": "방어도 31 + 힘 +5"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "dracolich_aurinax": {
      "id": "dracolich_aurinax",
      "name": "🦴 [4층 보스] 고대 드라코리치 에본데스",
      "maxHp": 348,
      "type": "boss",
      "expReward": 400,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,8 106,38 92,100 60,112 28,100 14,38\" fill=\"#1e272e\" stroke=\"#00cec9\" stroke-width=\"4\"/><circle cx=\"44\" cy=\"50\" r=\"8\" fill=\"#00cec9\"/><circle cx=\"76\" cy=\"50\" r=\"8\" fill=\"#00cec9\"/></svg>",
      "moves": [
        {
          "name": "죽음의 괴사 브레스",
          "intent": "attack_debuff",
          "dmg": 32,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 32 + 약화 2 + 취약 2 + [깊은] 2장",
          "addStatus": "status_wound",
          "statusCount": 2
        },
        {
          "name": "불사의 용골 재생",
          "intent": "defend_buff",
          "block": 36,
          "str": 7,
          "desc": "방어도 36 + 힘 +7"
        },
        {
          "name": "뼈 발톱 & 꼬리 3연격",
          "intent": "multi_attack",
          "dmg": 15,
          "hits": 3,
          "desc": "피해 15 x 3"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "death_tyrant_beholder": {
      "id": "death_tyrant_beholder",
      "name": "☠️ [4층 보스] 언데드 비홀더 데스 타이런트",
      "maxHp": 330,
      "type": "boss",
      "expReward": 400,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"42\" fill=\"#111\" stroke=\"#ff4757\" stroke-width=\"4\"/><circle cx=\"60\" cy=\"58\" r=\"16\" fill=\"#ff4757\"/></svg>",
      "moves": [
        {
          "name": "부정의 적색 눈길 & 죽음의 광선",
          "intent": "attack_debuff",
          "dmg": 30,
          "weak": 2,
          "vuln": 3,
          "desc": "피해 30 + 약화 2 + 취약 3 + [정신] 2장",
          "addStatus": "status_dazed",
          "statusCount": 2
        },
        {
          "name": "해골 눈알 광선 3연사",
          "intent": "multi_attack",
          "dmg": 15,
          "hits": 3,
          "desc": "피해 15 x 3"
        },
        {
          "name": "사령의 보호막",
          "intent": "defend_buff",
          "block": 34,
          "str": 7,
          "desc": "방어도 34 + 힘 +7"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "lord_soth_deathknight": {
      "id": "lord_soth_deathknight",
      "name": "🖤 [4층 보스] 흑장미의 데스나이트 군주 소쓰",
      "maxHp": 342,
      "type": "boss",
      "expReward": 400,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,8 102,40 90,100 30,100 18,40\" fill=\"#1e272e\" stroke=\"#ff3838\" stroke-width=\"4\"/><circle cx=\"46\" cy=\"52\" r=\"7\" fill=\"#ff3838\"/><circle cx=\"74\" cy=\"52\" r=\"7\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "심연의 지옥불 구체 (Hellfire Orb)",
          "intent": "attack_debuff",
          "dmg": 33,
          "vuln": 2,
          "desc": "피해 33 + 취약 2 + 손상 2 + [지옥] 2장",
          "addStatus": "status_burn",
          "statusCount": 2,
          "frail": 2
        },
        {
          "name": "불경한 성검 3연격",
          "intent": "multi_attack",
          "dmg": 15,
          "hits": 3,
          "desc": "피해 15 x 3"
        },
        {
          "name": "죽음의 군주 갑주",
          "intent": "defend_buff",
          "block": 36,
          "str": 7,
          "desc": "방어도 36 + 힘 +7"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "asmodeus_lord_of_ninth": {
      "id": "asmodeus_lord_of_ninth",
      "name": "😈 [5층 보스] 나인 헬의 절대신 아스모데우스 (CR 30)",
      "maxHp": 432,
      "type": "boss",
      "expReward": 1000,
      "svg": "<svg viewBox=\"0 0 120 120\"><polygon points=\"60,6 108,38 94,102 60,115 26,102 12,38\" fill=\"#3b0000\" stroke=\"#ff3838\" stroke-width=\"5\"/><polygon points=\"22,8 48,34 32,40\" fill=\"#fdcb6e\"/><polygon points=\"98,8 72,34 88,40\" fill=\"#fdcb6e\"/><circle cx=\"45\" cy=\"54\" r=\"8\" fill=\"#ff0055\"/><circle cx=\"75\" cy=\"54\" r=\"8\" fill=\"#ff0055\"/></svg>",
      "moves": [
        {
          "name": "네수스의 루비 지팡이 심판",
          "intent": "attack_debuff",
          "dmg": 36,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 36 + 약화 2 + 취약 2 + [점액] 2장",
          "addStatus": "status_slimed",
          "statusCount": 2
        },
        {
          "name": "지옥 제9계층의 절대 군주 권능",
          "intent": "defend_buff",
          "block": 44,
          "str": 8,
          "desc": "방어도 44 + 힘 +8"
        },
        {
          "name": "지옥불 유성우 4연타",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 4,
          "desc": "피해 13 x 4"
        },
        {
          "name": "영혼 말살의 계약",
          "intent": "attack",
          "dmg": 48,
          "desc": "피해 48"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "demogorgon_prince": {
      "id": "demogorgon_prince",
      "name": "👹 [5층 보스] 심연의 데몬 프린스 데모고르곤",
      "maxHp": 426,
      "type": "boss",
      "expReward": 1000,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"46\" fill=\"#2c003e\" stroke=\"#00ff88\" stroke-width=\"5\"/><circle cx=\"42\" cy=\"48\" r=\"14\" fill=\"#641e16\" stroke=\"#ff3838\" stroke-width=\"3\"/><circle cx=\"78\" cy=\"48\" r=\"14\" fill=\"#641e16\" stroke=\"#ff3838\" stroke-width=\"3\"/></svg>",
      "moves": [
        {
          "name": "광기와 최면의 이중 시선",
          "intent": "attack_debuff",
          "dmg": 33,
          "weak": 3,
          "vuln": 3,
          "desc": "피해 33 + 약화 3 + 취약 3 + [깊은] 2장",
          "addStatus": "status_wound",
          "statusCount": 2
        },
        {
          "name": "부패의 거대 촉수 4연타",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 4,
          "desc": "피해 13 x 4"
        },
        {
          "name": "어비스의 군주 포효",
          "intent": "defend_buff",
          "block": 39,
          "str": 8,
          "desc": "방어도 39 + 힘 +8"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "halaster_mad_mage": {
      "id": "halaster_mad_mage",
      "name": "🧙‍♂️ [5층 보스] 언더마운틴의 주인 매드 메이지 할라스터",
      "maxHp": 408,
      "type": "boss",
      "expReward": 1000,
      "svg": "<svg viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"46\" fill=\"#0c2461\" stroke=\"#00d2d3\" stroke-width=\"5\"/><polygon points=\"60,8 90,46 30,46\" fill=\"#192a56\" stroke=\"#ffeaa7\" stroke-width=\"3\"/><circle cx=\"48\" cy=\"62\" r=\"7\" fill=\"#00ff88\"/><circle cx=\"72\" cy=\"62\" r=\"7\" fill=\"#e056fd\"/></svg>",
      "moves": [
        {
          "name": "9레벨 주문: 메테오 스웜 & 정신 파열",
          "intent": "attack_debuff",
          "dmg": 34,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 34 + 약화 2 + 취약 2 + 손상 2 + [정신] 2장",
          "addStatus": "status_dazed",
          "statusCount": 2,
          "frail": 2
        },
        {
          "name": "시간 정지 & 무적의 구체 결계",
          "intent": "defend_buff",
          "block": 44,
          "str": 8,
          "desc": "방어도 44 + 힘 +8"
        },
        {
          "name": "비전 빅비의 손 & 연쇄 번개 4연타",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 4,
          "desc": "피해 13 x 4"
        },
        {
          "name": "9레벨 주문: 소원(Wish) 말살 광선",
          "intent": "attack",
          "dmg": 50,
          "desc": "피해 50"
        }
      ],
      "artifact": 2,
      "metallicize": 8,
      "thorns": 2
    },
    "gelatinous_cube": {
      "id": "gelatinous_cube",
      "name": "🟩 젤라티너스 큐브 (산성 점액)",
      "maxHp": 53,
      "type": "normal",
      "expReward": 48,
      "curlUp": 11,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"18\" y=\"18\" width=\"64\" height=\"64\" rx=\"10\" fill=\"rgba(46, 204, 113, 0.45)\" stroke=\"#00ff88\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"45\" r=\"7\" fill=\"#fff\" opacity=\"0.7\"/><polygon points=\"55,60 70,52 65,72\" fill=\"#ffeaa7\" opacity=\"0.8\"/></svg>",
      "moves": [
        {
          "name": "산성 점액 삼키기",
          "intent": "attack_debuff",
          "dmg": 11,
          "addStatus": "status_slimed",
          "statusCount": 1,
          "desc": "피해 11 + [점액] 1장"
        },
        {
          "name": "투명 큐브 응집",
          "intent": "defend_buff",
          "block": 12,
          "str": 3,
          "desc": "방어도 12 + 힘 +3"
        },
        {
          "name": "소화액 분출",
          "intent": "attack_debuff",
          "dmg": 13,
          "vuln": 1,
          "desc": "피해 13 + 취약 1 + 손상 2",
          "frail": 2
        }
      ]
    },
    "gnoll_pack_lord": {
      "id": "gnoll_pack_lord",
      "name": "🐺 놀 하이에나 무리우두머리",
      "maxHp": 48,
      "type": "normal",
      "expReward": 46,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"22,35 38,14 62,14 78,35 72,82 28,82\" fill=\"#784212\" stroke=\"#f39c12\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"45\" r=\"6\" fill=\"#ff3838\"/><circle cx=\"62\" cy=\"45\" r=\"6\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "피의 광란 물어뜯기 2연타",
          "intent": "multi_attack",
          "dmg": 7,
          "hits": 2,
          "desc": "피해 7 x 2"
        },
        {
          "name": "예노구우의 피의 포효",
          "intent": "defend_buff",
          "block": 8,
          "str": 4,
          "desc": "방어도 8 + 힘 +4"
        },
        {
          "name": "톱니 창 찌르기",
          "intent": "attack_debuff",
          "dmg": 12,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 12 + [깊은] 1장"
        }
      ],
      "curlUp": 7,
      "skillEnrage": 1
    },
    "rust_monster": {
      "id": "rust_monster",
      "name": "🦗 부식 괴수 러스트 몬스터",
      "maxHp": 43,
      "type": "normal",
      "expReward": 45,
      "curlUp": 14,
      "thorns": 3,
      "svg": "<svg viewBox=\"0 0 100 100\"><ellipse cx=\"50\" cy=\"54\" rx=\"34\" ry=\"24\" fill=\"#a04000\" stroke=\"#e67e22\" stroke-width=\"3\"/><path d=\"M30,36 Q15,15 28,12\" stroke=\"#f39c12\" stroke-width=\"3\" fill=\"none\"/><path d=\"M70,36 Q85,15 72,12\" stroke=\"#f39c12\" stroke-width=\"3\" fill=\"none\"/></svg>",
      "moves": [
        {
          "name": "갑주 부식 더듬이",
          "intent": "attack_debuff",
          "dmg": 9,
          "vuln": 2,
          "desc": "피해 9 + 취약 2 + 손상 2",
          "frail": 2
        },
        {
          "name": "철갑 껍질 웅크리기",
          "intent": "defend_buff",
          "block": 13,
          "str": 3,
          "desc": "방어도 13 + 힘 +3"
        },
        {
          "name": "꼬리 프로펠러 타격",
          "intent": "attack",
          "dmg": 15,
          "desc": "피해 15"
        }
      ]
    },
    "carrion_crawler": {
      "id": "carrion_crawler",
      "name": "🐛 시체 포식자 캐리언 크롤러",
      "maxHp": 50,
      "type": "normal",
      "expReward": 48,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"32\" fill=\"#145a32\" stroke=\"#58d68d\" stroke-width=\"3\"/><circle cx=\"40\" cy=\"40\" r=\"5\" fill=\"#ff0055\"/><circle cx=\"60\" cy=\"40\" r=\"5\" fill=\"#ff0055\"/></svg>",
      "moves": [
        {
          "name": "마비 독 촉수 3연타",
          "intent": "multi_attack",
          "dmg": 4,
          "hits": 3,
          "desc": "피해 4 x 3"
        },
        {
          "name": "신경독 점액 분사",
          "intent": "attack_debuff",
          "dmg": 9,
          "weak": 2,
          "addStatus": "status_slimed",
          "statusCount": 1,
          "desc": "피해 9 + 약화 2 + [점액] 1장"
        }
      ],
      "metallicize": 4
    },
    "mimic_hunter": {
      "id": "mimic_hunter",
      "name": "📦 [엘리트] 탐욕의 보물상자 미믹",
      "maxHp": 110,
      "type": "elite",
      "expReward": 115,
      "curlUp": 19,
      "thorns": 3,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"18\" y=\"28\" width=\"64\" height=\"50\" rx=\"6\" fill=\"#5d4037\" stroke=\"#f1c40f\" stroke-width=\"4\"/><polygon points=\"24,52 32,64 40,52 48,64 56,52 64,64 72,52\" fill=\"#fff\"/><circle cx=\"42\" cy=\"40\" r=\"5\" fill=\"#ff0055\"/><circle cx=\"62\" cy=\"40\" r=\"5\" fill=\"#ff0055\"/></svg>",
      "moves": [
        {
          "name": "접착 위족 휘감기",
          "intent": "attack_debuff",
          "dmg": 17,
          "weak": 1,
          "addStatus": "status_slimed",
          "statusCount": 1,
          "desc": "피해 17 + 약화 1 + [점액] 1장"
        },
        {
          "name": "보물상자 송곳니 깨물기",
          "intent": "attack",
          "dmg": 24,
          "lifesteal": true,
          "desc": "흡혈 피해 24"
        },
        {
          "name": "강철 자물쇠 경화",
          "intent": "defend_buff",
          "block": 18,
          "str": 4,
          "desc": "방어도 18 + 힘 +4"
        }
      ]
    },
    "manticore_ravager": {
      "id": "manticore_ravager",
      "name": "🦁 [1층 중간보스] 가시꼬리 만티코어",
      "maxHp": 146,
      "type": "elite",
      "expReward": 150,
      "thorns": 4,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,12 88,38 74,86 26,86 12,38\" fill=\"#6e2c00\" stroke=\"#e74c3c\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"46\" r=\"6\" fill=\"#f1c40f\"/><circle cx=\"62\" cy=\"46\" r=\"6\" fill=\"#f1c40f\"/></svg>",
      "moves": [
        {
          "name": "강철 꼬리 가시 3연사",
          "intent": "multi_attack",
          "dmg": 8,
          "hits": 3,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 8 x 3 + [깊은] 1장"
        },
        {
          "name": "날개 돌풍 & 가시 방어",
          "intent": "defend_buff",
          "block": 20,
          "str": 4,
          "desc": "방어도 20 + 힘 +4"
        },
        {
          "name": "맹수 급강하 덮치기",
          "intent": "attack_debuff",
          "dmg": 22,
          "vuln": 2,
          "desc": "피해 22 + 취약 2 + [정신] 1장",
          "addStatus": "status_dazed",
          "statusCount": 1
        }
      ]
    },
    "displacer_beast": {
      "id": "displacer_beast",
      "name": "🐆 환영 흑표범 디스플레이서 비스트",
      "maxHp": 62,
      "type": "normal",
      "expReward": 58,
      "artifact": 1,
      "curlUp": 14,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"20,30 50,14 80,30 72,82 28,82\" fill=\"#1b1464\" stroke=\"#00d2d3\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"46\" r=\"6\" fill=\"#00ff88\"/><circle cx=\"62\" cy=\"46\" r=\"6\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "가시 촉수 채찍 2연타",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 2,
          "desc": "피해 9 x 2"
        },
        {
          "name": "환영 왜곡 (Displacement)",
          "intent": "defend_buff",
          "block": 17,
          "str": 3,
          "desc": "방어도 17 + 힘 +3"
        },
        {
          "name": "착란의 기습",
          "intent": "attack_debuff",
          "dmg": 15,
          "addStatus": "status_dazed",
          "statusCount": 1,
          "desc": "피해 15 + 손상 2 + [정신] 1장",
          "frail": 2
        }
      ]
    },
    "basilisk_gazer": {
      "id": "basilisk_gazer",
      "name": "🦎 석화의 마수 바실리스크",
      "maxHp": 70,
      "type": "normal",
      "expReward": 62,
      "metallicize": 7,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"18\" y=\"24\" width=\"64\" height=\"52\" rx=\"14\" fill=\"#1e8449\" stroke=\"#a3e4d7\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"48\" r=\"7\" fill=\"#f1c40f\"/><circle cx=\"62\" cy=\"48\" r=\"7\" fill=\"#f1c40f\"/></svg>",
      "moves": [
        {
          "name": "석화의 응시 (Petrifying Gaze)",
          "intent": "attack_debuff",
          "dmg": 13,
          "weak": 2,
          "addStatus": "status_dazed",
          "statusCount": 1,
          "desc": "피해 13 + 약화 2 + [정신] 1장"
        },
        {
          "name": "맹독 송곳니 깨물기",
          "intent": "attack_debuff",
          "dmg": 18,
          "vuln": 1,
          "desc": "피해 18 + 취약 1 + 손상 2",
          "frail": 2
        },
        {
          "name": "바위 비늘 경화",
          "intent": "defend_buff",
          "block": 16,
          "str": 4,
          "desc": "방어도 16 + 힘 +4"
        }
      ]
    },
    "ochre_jelly": {
      "id": "ochre_jelly",
      "name": "🟨 분열하는 황토 슬라임 (오커 젤리)",
      "maxHp": 72,
      "type": "normal",
      "expReward": 60,
      "regen": 7,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"54\" r=\"32\" fill=\"#d68910\" stroke=\"#f9e79f\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"48\" r=\"6\" fill=\"#4a235a\"/><circle cx=\"62\" cy=\"48\" r=\"6\" fill=\"#4a235a\"/></svg>",
      "moves": [
        {
          "name": "끈적한 산성 위족",
          "intent": "attack_debuff",
          "dmg": 15,
          "addStatus": "status_slimed",
          "statusCount": 2,
          "desc": "피해 15 + 손상 2 + [점액] 2장",
          "frail": 2
        },
        {
          "name": "세포 분열 증식",
          "intent": "defend_buff",
          "block": 14,
          "str": 4,
          "desc": "방어도 14 + 힘 +4"
        }
      ]
    },
    "myconid_sovereign": {
      "id": "myconid_sovereign",
      "name": "🍄 언더다크 맹독 포자 군주 (마이코니드)",
      "maxHp": 65,
      "type": "normal",
      "expReward": 58,
      "thorns": 3,
      "svg": "<svg viewBox=\"0 0 100 100\"><path d=\"M18,50 Q50,10 82,50 Z\" fill=\"#8e44ad\" stroke=\"#e056fd\" stroke-width=\"3\"/><rect x=\"38\" y=\"50\" width=\"24\" height=\"34\" fill=\"#d2b4de\"/><circle cx=\"44\" cy=\"62\" r=\"4\" fill=\"#00ff88\"/><circle cx=\"56\" cy=\"62\" r=\"4\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "환각 포자 구름",
          "intent": "attack_debuff",
          "dmg": 12,
          "weak": 2,
          "addStatus": "status_dazed",
          "statusCount": 1,
          "desc": "피해 12 + 약화 2 + [정신] 1장"
        },
        {
          "name": "균사체 재생 방벽",
          "intent": "defend_buff",
          "block": 16,
          "str": 3,
          "desc": "방어도 16 + 힘 +3"
        },
        {
          "name": "부패 포자 폭발",
          "intent": "attack",
          "dmg": 20,
          "desc": "피해 20"
        }
      ]
    },
    "roper_ambusher": {
      "id": "roper_ambusher",
      "name": "🪨 [엘리트] 종유석 괴수 로퍼(Roper)",
      "maxHp": 149,
      "type": "elite",
      "expReward": 138,
      "metallicize": 11,
      "thorns": 4,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,10 82,85 18,85\" fill=\"#566573\" stroke=\"#abb2b9\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"42\" r=\"10\" fill=\"#ff3838\"/><polygon points=\"35,66 65,66 50,76\" fill=\"#fff\"/></svg>",
      "moves": [
        {
          "name": "접착 촉수 4연속 포박",
          "intent": "multi_attack",
          "dmg": 7,
          "hits": 4,
          "addStatus": "status_slimed",
          "statusCount": 1,
          "desc": "피해 7 x 4 + [점액] 1장"
        },
        {
          "name": "암석 외피 & 끌어당기기",
          "intent": "defend_buff",
          "block": 23,
          "str": 4,
          "desc": "방어도 23 + 힘 +4"
        },
        {
          "name": "분쇄의 아가리",
          "intent": "attack_debuff",
          "dmg": 28,
          "vuln": 2,
          "desc": "피해 28 + 취약 2 + [지옥] 1장",
          "addStatus": "status_burn",
          "statusCount": 1
        }
      ]
    },
    "cloaker_shadow": {
      "id": "cloaker_shadow",
      "name": "🦇 [2층 중간보스] 심연의 그림자 클로커",
      "maxHp": 174,
      "type": "elite",
      "expReward": 175,
      "artifact": 1,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"10,25 50,15 90,25 75,88 50,72 25,88\" fill=\"#1c2833\" stroke=\"#9b59b6\" stroke-width=\"4\"/><circle cx=\"40\" cy=\"42\" r=\"6\" fill=\"#ff0055\"/><circle cx=\"60\" cy=\"42\" r=\"6\" fill=\"#ff0055\"/></svg>",
      "moves": [
        {
          "name": "공포의 초음파 비명",
          "intent": "attack_debuff",
          "dmg": 18,
          "weak": 2,
          "vuln": 2,
          "addStatus": "status_dazed",
          "statusCount": 1,
          "desc": "피해 18 + 약화 2 + 취약 2 + 손상 2 + [정신] 1장",
          "frail": 2
        },
        {
          "name": "거울 환영 분신",
          "intent": "defend_buff",
          "block": 23,
          "str": 5,
          "desc": "방어도 23 + 힘 +5"
        },
        {
          "name": "질식의 망토 휘감기",
          "intent": "attack",
          "dmg": 29,
          "lifesteal": true,
          "desc": "흡혈 피해 29"
        }
      ]
    },
    "chuul_pincer": {
      "id": "chuul_pincer",
      "name": "🦞 고대 일리시드 갑각괴수 추울(Chuul)",
      "maxHp": 82,
      "type": "normal",
      "expReward": 74,
      "metallicize": 8,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"20\" y=\"22\" width=\"60\" height=\"56\" rx=\"12\" fill=\"#117864\" stroke=\"#48c9b0\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"44\" r=\"6\" fill=\"#f1c40f\"/><circle cx=\"62\" cy=\"44\" r=\"6\" fill=\"#f1c40f\"/></svg>",
      "moves": [
        {
          "name": "거대 집게발 2연타",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 2,
          "desc": "피해 12 x 2"
        },
        {
          "name": "마비 촉수 주입",
          "intent": "attack_debuff",
          "dmg": 17,
          "weak": 2,
          "addStatus": "status_dazed",
          "statusCount": 1,
          "desc": "피해 17 + 약화 2 + [정신] 1장"
        },
        {
          "name": "키틴질 갑각 방어",
          "intent": "defend_buff",
          "block": 20,
          "str": 4,
          "desc": "방어도 20 + 힘 +4"
        }
      ]
    },
    "grell_strangler": {
      "id": "grell_strangler",
      "name": "🧠 공중 부유 뇌괴수 그렐(Grell)",
      "maxHp": 72,
      "type": "normal",
      "expReward": 70,
      "artifact": 1,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"42\" r=\"26\" fill=\"#ad1457\" stroke=\"#f48fb1\" stroke-width=\"3\"/><path d=\"M35,68 L30,90 M50,68 L50,92 M65,68 L70,90\" stroke=\"#f48fb1\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "전격 촉수 3연타",
          "intent": "multi_attack",
          "dmg": 8,
          "hits": 3,
          "desc": "피해 8 x 3"
        },
        {
          "name": "신경 마비 부리",
          "intent": "attack_debuff",
          "dmg": 18,
          "vuln": 2,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 18 + 취약 2 + 손상 2 + [깊은] 1장",
          "frail": 2
        }
      ]
    },
    "otyugh_filth": {
      "id": "otyugh_filth",
      "name": "Tentacle 오물 포식자 오티우그(Otyugh)",
      "maxHp": 86,
      "type": "normal",
      "expReward": 75,
      "regen": 8,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"54\" r=\"32\" fill=\"#4d5656\" stroke=\"#a3e4d7\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"34\" r=\"7\" fill=\"#ff3838\"/><circle cx=\"36\" cy=\"52\" r=\"5\" fill=\"#ff3838\"/><circle cx=\"64\" cy=\"52\" r=\"5\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "역병 촉수 강타",
          "intent": "attack_debuff",
          "dmg": 18,
          "addStatus": "status_slimed",
          "statusCount": 2,
          "desc": "피해 18 + 손상 2 + [점액] 2장",
          "frail": 2
        },
        {
          "name": "오물 구덩이 재생",
          "intent": "defend_buff",
          "block": 18,
          "str": 4,
          "desc": "방어도 18 + 힘 +4"
        },
        {
          "name": "세균 아가리 물어뜯기",
          "intent": "attack_debuff",
          "dmg": 22,
          "weak": 2,
          "desc": "피해 22 + 약화 2"
        }
      ]
    },
    "slaad_death": {
      "id": "slaad_death",
      "name": "🐸 혼돈의 차원 괴수 데스 슬라드",
      "maxHp": 79,
      "type": "normal",
      "expReward": 76,
      "regen": 9,
      "artifact": 1,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"20,40 35,18 65,18 80,40 72,84 28,84\" fill=\"#4a235a\" stroke=\"#00ff88\" stroke-width=\"3\"/><circle cx=\"36\" cy=\"42\" r=\"7\" fill=\"#00ff88\"/><circle cx=\"64\" cy=\"42\" r=\"7\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "혼돈의 발톱 2연타",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 2,
          "desc": "피해 12 x 2"
        },
        {
          "name": "림보의 혼돈 파동",
          "intent": "attack_debuff",
          "dmg": 20,
          "addStatus": "status_dazed",
          "statusCount": 2,
          "desc": "피해 20 + [정신] 2장"
        },
        {
          "name": "제어석 재생 각성",
          "intent": "defend_buff",
          "block": 18,
          "str": 5,
          "desc": "방어도 18 + 힘 +5"
        }
      ]
    },
    "beholder_zombie_elite": {
      "id": "beholder_zombie_elite",
      "name": "👁️ [엘리트] 부패한 비홀더 좀비",
      "maxHp": 166,
      "type": "elite",
      "expReward": 158,
      "artifact": 2,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"52\" r=\"34\" fill=\"#1e8449\" stroke=\"#a9dfbf\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"52\" r=\"14\" fill=\"#f9e79f\"/><circle cx=\"50\" cy=\"52\" r=\"6\" fill=\"#c0392b\"/></svg>",
      "moves": [
        {
          "name": "분해 광선 (Disintegration Ray)",
          "intent": "attack_debuff",
          "dmg": 29,
          "vuln": 2,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 29 + 취약 2 + [깊은] 1장"
        },
        {
          "name": "마비 & 공포 광선 난사",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 3,
          "addStatus": "status_dazed",
          "statusCount": 1,
          "desc": "피해 11 x 3 + [정신] 1장"
        },
        {
          "name": "언데드 반마법 역장",
          "intent": "defend_buff",
          "block": 23,
          "str": 5,
          "desc": "방어도 23 + 힘 +5"
        }
      ]
    },
    "mindwitness_overseer": {
      "id": "mindwitness_overseer",
      "name": "🐙 [3층 중간보스] 일리시드 변이 비홀더 마인드위트니스",
      "maxHp": 202,
      "type": "elite",
      "expReward": 195,
      "artifact": 2,
      "metallicize": 8,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"#2c003e\" stroke=\"#00d2d3\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"46\" r=\"14\" fill=\"#00ff88\"/><path d=\"M35,72 L30,94 M50,74 L50,96 M65,72 L70,94\" stroke=\"#e056fd\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "사이오닉 정신 파열 광선",
          "intent": "attack_debuff",
          "dmg": 25,
          "weak": 2,
          "addStatus": "status_dazed",
          "statusCount": 2,
          "desc": "피해 25 + 약화 2 + 손상 2 + [정신] 2장",
          "frail": 2
        },
        {
          "name": "촉수 광선 4연사",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 4,
          "desc": "피해 9 x 4"
        },
        {
          "name": "텔레파시 방벽 증폭",
          "intent": "defend_buff",
          "block": 26,
          "str": 5,
          "desc": "방어도 26 + 힘 +5"
        }
      ]
    },
    "banshee_wailer": {
      "id": "banshee_wailer",
      "name": "👻 통곡의 원령 밴시(Banshee)",
      "maxHp": 82,
      "type": "normal",
      "expReward": 82,
      "artifact": 1,
      "svg": "<svg viewBox=\"0 0 100 100\"><path d=\"M22,84 Q20,20 50,16 Q80,20 78,84 Z\" fill=\"#1b2631\" stroke=\"#00d2d3\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"46\" r=\"6\" fill=\"#00ff88\"/><circle cx=\"62\" cy=\"46\" r=\"6\" fill=\"#00ff88\"/></svg>",
      "moves": [
        {
          "name": "죽음의 통곡 (Wail of Death)",
          "intent": "attack_debuff",
          "dmg": 21,
          "weak": 2,
          "vuln": 2,
          "addStatus": "curse_pain",
          "statusCount": 1,
          "desc": "피해 21 + 약화 2 + 취약 2 + [심연의] 1장 + 플레이어 힘 -1",
          "strDown": 1
        },
        {
          "name": "영체화 (Incorporeal)",
          "intent": "defend_buff",
          "block": 23,
          "str": 4,
          "desc": "방어도 23 + 힘 +4"
        },
        {
          "name": "영혼 동결 손길",
          "intent": "attack",
          "dmg": 25,
          "desc": "피해 25"
        }
      ]
    },
    "bone_naga": {
      "id": "bone_naga",
      "name": "🐍 고대 해골 뱀 본 나가(Bone Naga)",
      "maxHp": 89,
      "type": "normal",
      "expReward": 84,
      "thorns": 4,
      "svg": "<svg viewBox=\"0 0 100 100\"><path d=\"M25,80 Q15,40 50,20 Q85,40 75,80\" fill=\"none\" stroke=\"#dfe6e9\" stroke-width=\"10\"/><circle cx=\"44\" cy=\"30\" r=\"5\" fill=\"#ff3838\"/><circle cx=\"56\" cy=\"30\" r=\"5\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "사령 번개 & 독니 2연타",
          "intent": "multi_attack",
          "dmg": 13,
          "hits": 2,
          "desc": "피해 13 x 2"
        },
        {
          "name": "저주의 비전 주문",
          "intent": "attack_debuff",
          "dmg": 20,
          "addStatus": "status_burn",
          "statusCount": 1,
          "desc": "피해 20 + 손상 2 + [지옥] 1장",
          "frail": 2
        },
        {
          "name": "해골 가시 진형",
          "intent": "defend_buff",
          "block": 21,
          "str": 5,
          "desc": "방어도 21 + 힘 +5"
        }
      ]
    },
    "mummy_guardian": {
      "id": "mummy_guardian",
      "name": " bandages 고대 무덤 수호 미라",
      "maxHp": 96,
      "type": "normal",
      "expReward": 86,
      "metallicize": 8,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"24\" y=\"18\" width=\"52\" height=\"66\" rx=\"10\" fill=\"#7e5109\" stroke=\"#f7dc6f\" stroke-width=\"3\"/><circle cx=\"40\" cy=\"44\" r=\"6\" fill=\"#ff3838\"/><circle cx=\"60\" cy=\"44\" r=\"6\" fill=\"#ff3838\"/></svg>",
      "moves": [
        {
          "name": "썩어가는 주먹 (Mummy Rot)",
          "intent": "attack_debuff",
          "dmg": 22,
          "vuln": 2,
          "addStatus": "curse_pain",
          "statusCount": 1,
          "desc": "피해 22 + 취약 2 + 손상 2 + [심연의] 1장",
          "frail": 2
        },
        {
          "name": "공포의 눈빛 (Dreadful Glare)",
          "intent": "defend_buff",
          "block": 21,
          "str": 5,
          "desc": "방어도 21 + 힘 +5"
        },
        {
          "name": "붕대 연타",
          "intent": "multi_attack",
          "dmg": 15,
          "hits": 2,
          "desc": "피해 15 x 2"
        }
      ]
    },
    "shadow_demon": {
      "id": "shadow_demon",
      "name": "🌑 심연의 그림자 악마 (섀도우 데몬)",
      "maxHp": 86,
      "type": "normal",
      "expReward": 84,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,12 86,38 72,86 28,86 14,38\" fill=\"#17202a\" stroke=\"#e056fd\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"48\" r=\"6\" fill=\"#e056fd\"/><circle cx=\"62\" cy=\"48\" r=\"6\" fill=\"#e056fd\"/></svg>",
      "moves": [
        {
          "name": "정신 암흑 발톱 3연타",
          "intent": "multi_attack",
          "dmg": 9,
          "hits": 3,
          "desc": "피해 9 x 3"
        },
        {
          "name": "그림자 잠복 & 기습",
          "intent": "defend_buff",
          "block": 22,
          "str": 5,
          "desc": "방어도 22 + 힘 +5"
        },
        {
          "name": "악몽의 침식",
          "intent": "attack_debuff",
          "dmg": 21,
          "addStatus": "status_dazed",
          "statusCount": 2,
          "desc": "피해 21 + 손상 2 + [정신] 2장",
          "frail": 2
        }
      ],
      "curlUp": 7
    },
    "skull_lord_elite": {
      "id": "skull_lord_elite",
      "name": "💀💀💀 [엘리트] 삼두 해골 군주 스컬 로드",
      "maxHp": 190,
      "type": "elite",
      "expReward": 180,
      "regen": 11,
      "artifact": 2,
      "svg": "<svg viewBox=\"0 0 100 100\"><circle cx=\"30\" cy=\"44\" r=\"16\" fill=\"#2c3e50\" stroke=\"#00ff88\" stroke-width=\"3\"/><circle cx=\"70\" cy=\"44\" r=\"16\" fill=\"#2c3e50\" stroke=\"#00ff88\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"36\" r=\"18\" fill=\"#1a252f\" stroke=\"#ff3838\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "뼈 지팡이 & 사령 광선 3연타",
          "intent": "multi_attack",
          "dmg": 12,
          "hits": 3,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 12 x 3 + [깊은] 1장"
        },
        {
          "name": "언데드 군단 소환 결계",
          "intent": "defend_buff",
          "block": 29,
          "str": 7,
          "desc": "방어도 29 + 힘 +7"
        },
        {
          "name": "죽음의 손가락 (Finger of Death)",
          "intent": "attack_debuff",
          "dmg": 33,
          "lifesteal": true,
          "addStatus": "curse_pain",
          "statusCount": 1,
          "desc": "흡혈 피해 33 + [심연의] 1장"
        }
      ]
    },
    "nightwalker_titan": {
      "id": "nightwalker_titan",
      "name": "🌌 [4층 중간보스] 네거티브 차원의 거신 나이트워커",
      "maxHp": 234,
      "type": "elite",
      "expReward": 215,
      "thorns": 5,
      "metallicize": 11,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,8 88,36 76,90 24,90 12,36\" fill=\"#0b0d14\" stroke=\"#00d2d3\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"44\" r=\"7\" fill=\"#00d2d3\"/><circle cx=\"62\" cy=\"44\" r=\"7\" fill=\"#00d2d3\"/></svg>",
      "moves": [
        {
          "name": "소멸의 오라 & 파멸의 주먹",
          "intent": "attack_debuff",
          "dmg": 30,
          "vuln": 2,
          "addStatus": "curse_pain",
          "statusCount": 1,
          "desc": "피해 30 + 취약 2 + 손상 2 + [심연의] 1장 + 플레이어 힘 -1",
          "frail": 2,
          "strDown": 1
        },
        {
          "name": "생명력 말살 광선 2연타",
          "intent": "multi_attack",
          "dmg": 17,
          "hits": 2,
          "lifesteal": true,
          "desc": "흡혈 피해 17 x 2"
        },
        {
          "name": "공허의 장막",
          "intent": "defend_buff",
          "block": 31,
          "str": 7,
          "desc": "방어도 31 + 힘 +7"
        }
      ]
    },
    "chain_devil_kyton": {
      "id": "chain_devil_kyton",
      "name": "⛓️ 나인 헬 사슬 악마 (체인 데블)",
      "maxHp": 103,
      "type": "normal",
      "expReward": 100,
      "thorns": 5,
      "metallicize": 9,
      "svg": "<svg viewBox=\"0 0 100 100\"><rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" rx=\"10\" fill=\"#2c3e50\" stroke=\"#e74c3c\" stroke-width=\"3\"/><line x1=\"15\" y1=\"30\" x2=\"85\" y2=\"70\" stroke=\"#bdc3c7\" stroke-width=\"4\"/><line x1=\"85\" y1=\"30\" x2=\"15\" y2=\"70\" stroke=\"#bdc3c7\" stroke-width=\"4\"/></svg>",
      "moves": [
        {
          "name": "살아있는 가시 사슬 3연타",
          "intent": "multi_attack",
          "dmg": 11,
          "hits": 3,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 11 x 3 + [깊은] 1장"
        },
        {
          "name": "지옥 사슬 갑주",
          "intent": "defend_buff",
          "block": 23,
          "str": 5,
          "desc": "방어도 23 + 힘 +5"
        },
        {
          "name": "고통의 결박",
          "intent": "attack_debuff",
          "dmg": 25,
          "weak": 2,
          "vuln": 2,
          "desc": "피해 25 + 약화 2 + 취약 2 + 손상 2",
          "frail": 2
        }
      ]
    },
    "horned_devil_malebranche": {
      "id": "horned_devil_malebranche",
      "name": "🔱 뿔 달린 상급 악마 (혼드 데블)",
      "maxHp": 110,
      "type": "normal",
      "expReward": 105,
      "regen": 9,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,14 86,40 72,86 28,86 14,40\" fill=\"#78281f\" stroke=\"#f39c12\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"48\" r=\"6\" fill=\"#f1c40f\"/><circle cx=\"62\" cy=\"48\" r=\"6\" fill=\"#f1c40f\"/></svg>",
      "moves": [
        {
          "name": "지옥 삼지창 & 꼬리 2연타",
          "intent": "multi_attack",
          "dmg": 16,
          "hits": 2,
          "addStatus": "status_burn",
          "statusCount": 1,
          "desc": "피해 16 x 2 + [지옥] 1장"
        },
        {
          "name": "지옥불 투척 (Hurl Flame)",
          "intent": "attack_debuff",
          "dmg": 26,
          "addStatus": "status_burn",
          "statusCount": 2,
          "desc": "피해 26 + 손상 2 + [지옥] 2장",
          "frail": 2
        },
        {
          "name": "아베르누스의 날개 방어",
          "intent": "defend_buff",
          "block": 26,
          "str": 7,
          "desc": "방어도 26 + 힘 +7"
        }
      ]
    },
    "balor_abyssal_lord": {
      "id": "balor_abyssal_lord",
      "name": "🔥 [엘리트] 심연의 화염 군주 발로르(Balor)",
      "maxHp": 222,
      "type": "elite",
      "expReward": 225,
      "thorns": 6,
      "artifact": 2,
      "svg": "<svg viewBox=\"0 0 100 100\"><polygon points=\"50,8 92,38 78,90 22,90 8,38\" fill=\"#641e16\" stroke=\"#ff3838\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"46\" r=\"7\" fill=\"#ffeaa7\"/><circle cx=\"62\" cy=\"46\" r=\"7\" fill=\"#ffeaa7\"/></svg>",
      "moves": [
        {
          "name": "번개 대검 & 화염 채찍 2연타",
          "intent": "multi_attack",
          "dmg": 18,
          "hits": 2,
          "addStatus": "status_burn",
          "statusCount": 2,
          "desc": "피해 18 x 2 + [지옥] 2장"
        },
        {
          "name": "심연의 화염 폭풍 오라",
          "intent": "defend_buff",
          "block": 31,
          "str": 7,
          "desc": "방어도 31 + 힘 +7"
        },
        {
          "name": "참수의 일격 (Vorpal Blade)",
          "intent": "attack_debuff",
          "dmg": 37,
          "vuln": 2,
          "addStatus": "status_wound",
          "statusCount": 1,
          "desc": "피해 37 + 취약 2 + [깊은] 1장"
        }
      ],
      "skillEnrage": 2
    }
  },
  "events": [
    {
      "id": "halaster_rune_altar",
      "title": "🎲 할라스터의 광기 어린 비전 제단",
      "desc": "미친 대마법사 할라스터의 보랏빛 마법진이 맥동합니다. 주사위(D20)로 비전을 해독하거나 피의 대가로 힘을 얻을 수 있습니다.",
      "choices": [
        {
          "label": "🧙 [위자드 전용] 비전 학식 완벽 해독 — 판정 없이 카드 1장 강화(+) & 비전 룬 각인!",
          "effect": "class_free_mutate",
          "requiredClass": "wizard"
        },
        {
          "label": "🎲 [D20 비전 판정 DC 12] 성공 시 카드 1장 강화+룬 각인 / 실패 시 HP -12 & 저주 획득",
          "effect": "d20_arcana"
        },
        {
          "label": "🩸 피의 서약 — HP -12, 최대 체력 +8 및 무작위 카드 1장 강화(+)",
          "effect": "blood_sacrifice_maxhp"
        },
        {
          "label": "🚶 조용히 물러나 짧은 숨 고르기 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "xanathar_smuggler_cache",
      "title": "👁️ 자나타 길드의 비밀 밀수 창고",
      "desc": "비홀더 자나타의 부하들이 숨겨둔 황금 궤짝과 독극물 함정이 보입니다.",
      "choices": [
        {
          "label": "🗡️ [로그 전용] 도적 도구로 함정 완벽 해제 — 피해 없이 +110 GP & 무작위 유물 획득!",
          "effect": "class_rogue_heist",
          "requiredClass": "rogue"
        },
        {
          "label": "💰 함정을 감수하고 털기 — +95 GP & 무작위 유물 획득 (HP -15 & 심연의 저주 1장)",
          "effect": "scrap_and_relic"
        },
        {
          "label": "🎲 [D20 손재주 판정 DC 11] 성공 시 +85 GP / 실패 시 HP -10",
          "effect": "d20_gold_heist"
        },
        {
          "label": "🚶 흔적을 남기지 않고 통과 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "lathander_sun_shrine",
      "title": "☀️ 라센더의 버려진 태양 성소",
      "desc": "어둠 속 지하 미궁 한가운데 따뜻한 황금빛이 쏟아지는 고대 성소가 남아 있습니다.",
      "choices": [
        {
          "label": "☀️ [클레릭 전용] 태양신의 정화 기도 — 저주 전부 제거 & HP 35% 회복 & +40 GP!",
          "effect": "class_cleric_purify",
          "requiredClass": "cleric"
        },
        {
          "label": "⚜️ [성기사 전용] 신성한 서약 갱신 — 최대 체력 +10 및 카드 1장 강화(+)",
          "effect": "class_paladin_oath",
          "requiredClass": "paladin"
        },
        {
          "label": "🪙 성소에 50 GP 봉헌 — 저주 또는 일반 카드 1장 영구 제거",
          "effect": "event_paid_remove"
        },
        {
          "label": "✨ 축복만 받고 떠나기 — HP +12 회복",
          "effect": "heal_medium"
        }
      ]
    },
    {
      "id": "underdark_blacksmith_ghost",
      "title": "⚒️ 드워프 대장장이의 원령",
      "desc": "미스릴 모루 앞에서 망치를 두드리는 고대 드워프 장인의 영혼이 당신의 무기를 살펴봅니다.",
      "choices": [
        {
          "label": "⚔️ [파이터 전용] 무기 달인의 교감 — 덱의 카드 2장 무료 단련(+)!",
          "effect": "class_fighter_forge",
          "requiredClass": "fighter"
        },
        {
          "label": "⚒️ 60 GP로 무기 벼리기 — 무작위 미강화 카드 2장 강화(+)",
          "effect": "paid_double_upgrade"
        },
        {
          "label": "🩸 생명력을 불어넣어 단련 — HP -10, 카드 1장 강화(+) + 룬 각인",
          "effect": "blood_mutate"
        },
        {
          "label": "🚶 정중히 예를 갖추고 이동 — EXP +45",
          "effect": "gain_small_exp"
        }
      ]
    },
    {
      "id": "abyssal_whisper_mirror",
      "title": "🟣 심연의 거울 (Mirror of the Abyss)",
      "desc": "검은 흑요석 거울 너머로 악마 군주의 목소리가 거래를 제안합니다.",
      "choices": [
        {
          "label": "🟣 [워락 전용] 심연의 주인과 동등한 계약 — 저주 없이 무작위 유물 1개 & EXP +80!",
          "effect": "class_warlock_pact",
          "requiredClass": "warlock"
        },
        {
          "label": "☠️ 금단의 거래 — 심연의 저주 1장 추가 대신 무작위 마법 유물 1개 즉시 획득",
          "effect": "cursed_relic"
        },
        {
          "label": "📖 금단의 지식 흡수 — 최대 HP -8, EXP +95 & 등반 마석 +120",
          "effect": "gain_exp_sp_gems"
        },
        {
          "label": "🚶 거울을 깨뜨리고 전진 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "giant_iron_gate",
      "title": "🪨 고대 아다만틴 봉인문",
      "desc": "거대한 강철 문이 보물실을 막고 있습니다. 자물쇠는 녹슬어 부서져 있습니다.",
      "choices": [
        {
          "label": "🪓 [바바리안 전용] 괴력으로 문짝 박살! — 피해 없이 무작위 유물 & +60 GP!",
          "effect": "class_barbarian_smash",
          "requiredClass": "barbarian"
        },
        {
          "label": "🎲 [D20 근력 판정 DC 13] 성공 시 무작위 유물 획득 / 실패 시 HP -12",
          "effect": "d20_str_relic"
        },
        {
          "label": "🪙 틈새로 굴러나온 금화만 줍기 — +45 GP",
          "effect": "gain_gold_small"
        },
        {
          "label": "🚶 힘을 아끼고 우회 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "feywild_mushroom_ring",
      "title": "🍄 페이와일드 요정 버섯 고리",
      "desc": "형광빛 버섯이 원형으로 자라난 곳에서 요정들의 웃음소리가 들려옵니다.",
      "choices": [
        {
          "label": "🏹 [레인저 전용] 자연의 친화력 — HP +20 회복, 물약 1개 & 고급/희귀 카드 1장 획득!",
          "effect": "class_ranger_fey",
          "requiredClass": "ranger"
        },
        {
          "label": "🧪 신비한 이슬 채취 — HP -10, EXP +60 및 무작위 물약 1개 획득",
          "effect": "potion_and_exp"
        },
        {
          "label": "🎴 요정과 카드 교환 — HP -12, 일반 카드 1장 제거 후 희귀/전설급 카드 1장 획득",
          "effect": "remove_and_rare"
        },
        {
          "label": "🚶 고리를 밟지 않고 지나가기 — HP +8 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "mindflayer_brain_jar",
      "title": "🧠 일리시드의 보존된 지식 저장소",
      "desc": "푸른 용액 속에 떠 있는 고대 현자의 기억 수정체가 당신의 정신에 공명합니다.",
      "choices": [
        {
          "label": "🎲 [D20 지능 판정 DC 12] 성공 시 SP +1 & EXP +70 / 실패 시 HP -12",
          "effect": "d20_int_sp"
        },
        {
          "label": "🔥 저장소 파괴 — +75 GP & 등반 마석 +80",
          "effect": "gain_gold_gems"
        },
        {
          "label": "🚶 정신 오염을 피해 이탈 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "wounded_harper_scout",
      "title": "🩹 부상당한 하퍼즈 정찰병",
      "desc": "워터딥 하퍼즈 소속 정찰병이 벽에 기대어 도움을 청하고 있습니다.",
      "choices": [
        {
          "label": "🪙 40 GP 치료비 지원 — 무작위 유물 1개 보답 획득!",
          "effect": "paid_relic_help"
        },
        {
          "label": "❤️‍🩹 내 체력 10을 나눠 응급 처치 — 카드 1장 강화(+) & +55 GP",
          "effect": "hp_for_upgrade_gold"
        },
        {
          "label": "🗺️ 지도 정보만 공유받기 — EXP +55",
          "effect": "gain_small_exp"
        }
      ]
    },
    {
      "id": "drow_poison_lab",
      "title": "🕷️ 드로우 암살단의 독극물 실험실",
      "desc": "롤스 여신의 거미 문양이 새겨진 실험대에 진귀한 비약과 주문서가 놓여 있습니다.",
      "choices": [
        {
          "label": "🧪 독성 시약 강탈 — 무작위 물약 2개 획득 (HP -10)",
          "effect": "double_potion_risk"
        },
        {
          "label": "🔥 실험실 소각 — 덱의 저주/일반 카드 1장 제거 & EXP +45",
          "effect": "free_cleanse_card"
        },
        {
          "label": "🚶 조용히 빠져나오기 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "dragon_hoard_echo",
      "title": "🐉 고룡의 메아리가 깃든 보물 더미",
      "desc": "옛 레드 드래곤이 잠들었던 자리에 뜨거운 금화와 용린 조각이 빛납니다.",
      "choices": [
        {
          "label": "🎲 [D20 은신 판정 DC 13] 성공 시 +140 GP / 실패 시 화염 숨결(HP -16)",
          "effect": "d20_dragon_gold"
        },
        {
          "label": "🛡️ 용린 조각 1개만 챙기기 — 최대 체력 +6 & HP +6",
          "effect": "gain_maxhp_small"
        },
        {
          "label": "🚶 욕심내지 않고 통과 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "deck_of_many_things",
      "title": "🃏 운명의 덱 (Deck of Many Things)",
      "desc": "전설의 마법 카드 뭉치가 공중에 떠 있습니다. 한 장 뽑으면 운명이 극적으로 뒤바뀝니다!",
      "choices": [
        {
          "label": "🎲 [운명의 카드 뽑기 (D20)] 15+: 유물+SP+1 / 8~14: +90 GP / 7↓: 저주+HP-12",
          "effect": "d20_deck_of_many"
        },
        {
          "label": "🎴 덱의 카드 1장 변이 — 무작위 카드 1장 강화(+) + 룬 각인 (HP -8)",
          "effect": "blood_mutate"
        },
        {
          "label": "🚶 전설의 저주를 피해 후퇴 — HP +8 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "ancient_training_dummy",
      "title": "🥋 언더마운틴 고대 무투장",
      "desc": "마법으로 움직이는 자동 인형이 모험가의 전투 기술을 시험하려 합니다.",
      "choices": [
        {
          "label": "⚔️ 대련에 응한다 — HP -10, SP +1 & 무작위 카드 1장 강화(+)",
          "effect": "spar_for_sp"
        },
        {
          "label": "👁️ 동작을 관찰하며 연구 — EXP +65",
          "effect": "gain_small_exp"
        },
        {
          "label": "🚶 휴식을 취하며 지나가기 — HP +10 회복",
          "effect": "heal_medium"
        }
      ]
    },
    {
      "id": "cursed_fountain",
      "title": "⛲ 피와 황금의 분수",
      "desc": "두 갈래로 나뉜 신비한 분수에서 붉은 생명수와 황금 액체가 흐릅니다.",
      "choices": [
        {
          "label": "❤️ 생명수를 마신다 — HP 30% 회복 (단, 50 GP 소모)",
          "effect": "paid_heal_30"
        },
        {
          "label": "🪙 황금 액체를 담는다 — +80 GP (HP -10)",
          "effect": "blood_for_gold"
        },
        {
          "label": "🚶 손을 씻고 지나간다 — HP +6 회복",
          "effect": "safe_leave"
        }
      ]
    },
    {
      "id": "celestial_librarian",
      "title": "📚 천상의 서기관 아스트랄 도서관",
      "desc": "별빛이 흐르는 서고에서 고대의 고급/희귀 주문서를 열람할 수 있습니다.",
      "choices": [
        {
          "label": "📖 비전 서적 필사 — 고급/희귀/전설 카드 보상 1회 즉시 선택! (HP -8)",
          "effect": "hp_for_rare_draft"
        },
        {
          "label": "🗑️ 불필요한 기초 주문서 소각 — 덱의 일반 카드 1장 무료 제거",
          "effect": "free_cleanse_card"
        },
        {
          "label": "💎 등반 마석 +90 & EXP +40 획득",
          "effect": "gain_gems_exp"
        }
      ]
    },
    {
      "id": "githyanki_astral_cache",
      "title": "🌠 기스양키 아스트랄 보급소",
      "desc": "차원 이동 중 버려진 은검 부대의 비상 보급 상자를 발견했습니다.",
      "choices": [
        {
          "label": "🎲 [D20 생존 판정 DC 11] 성공 시 물약 1개 + 70 GP / 실패 시 HP -10",
          "effect": "d20_astral_supply"
        },
        {
          "label": "⚒️ 은검 숫돌로 카드 연마 — 무작위 카드 1장 무료 강화(+)",
          "effect": "free_upgrade_one"
        },
        {
          "label": "🚶 조용히 지나가기 — HP +8 회복",
          "effect": "safe_leave"
        }
      ]
    }
  ],
  "neowBlessings": [
    {
      "id": "neow_maxhp",
      "label": "🐋 [니오우의 축복: 생명력] 최대 체력 +10 증가 및 체력 완전 회복",
      "desc": "안정적으로 첨탑 등반을 시작합니다."
    },
    {
      "id": "neow_first3_1hp",
      "label": "🗡️ [니오우의 애가 (Neow's Lament)] 처음 3번의 전투에서 모든 적의 체력이 1이 됩니다!",
      "desc": "슬레이 더 스파이어 1의 명물! 초반 3번의 교전을 즉시 돌파합니다."
    },
    {
      "id": "neow_upgrade_random",
      "label": "⚒️ [고대인의 지혜] 시작 덱의 카드 2장을 무작위로 강화(+)하고 골드 +50 GP 획득",
      "desc": "초반 공방 효율이 크게 상승합니다."
    },
    {
      "id": "neow_curse_for_boss_relic",
      "label": "👑 [하이리스크 거래] 덱에 [☠️심연의 저주] 1장을 얻는 대신 무작위 [보스 유물(+1 AP 등)] 1개 즉시 획득!",
      "desc": "위험을 감수하고 1층부터 강력한 보스 유물로 시작합니다."
    }
  ]
};
