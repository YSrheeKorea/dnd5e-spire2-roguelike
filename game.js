// ============================================================================
// D&D 5E SPIRE II: TALES OF UNDERMOUNTAIN - CORE ENGINE (game.js)
// - 8 Core Classes x 4 Subclasses each (32 Subclass Build Paths!)
// - 5 Acts (Floors) x 30 Stages per Floor (150 Stages Total!)
// - C / B / A / S Rank Promotion + D&D 6 Ability Scores + Feats + Magic Gear
// ============================================================================

const Game = {
  meta: {
    gems: 300, // Balanced starter gems (enough for 3 pulls; earn more by conquering stages!)
    selectedCharId: 'fighter',
    // Selected Subclass ID for each of the 8 classes
    selectedSubclasses: {
      fighter: 'champion',
      barbarian: 'berserker',
      rogue: 'assassin',
      ranger: 'beast_master',
      wizard: 'evocation',
      cleric: 'life_domain',
      paladin: 'devotion',
      warlock: 'fiend_patron'
    },
    unlocked: {
      fighter: true,
      barbarian: true,
      rogue: true,
      ranger: false,
      wizard: true,
      cleric: false,
      paladin: false,
      warlock: false
    },
    ranks: {
      fighter: 'C',
      barbarian: 'C',
      rogue: 'C',
      ranger: 'B',
      wizard: 'B',
      cleric: 'B',
      paladin: 'A',
      warlock: 'A'
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
    shards: {
      fighter: 10,
      barbarian: 5,
      rogue: 5,
      ranger: 0,
      wizard: 5,
      cleric: 0,
      paladin: 0,
      warlock: 0
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
    this.loadMeta();
    this.updateTopHud();
    this.renderHub();
  },

  loadMeta() {
    try {
      const saved = localStorage.getItem('DND5E_SPIRE_2_META');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.meta = Object.assign(this.meta, parsed);
      }
    } catch (e) {
      console.warn('Meta load skipped:', e);
    }
  },

  saveMeta() {
    try {
      localStorage.setItem('DND5E_SPIRE_2_META', JSON.stringify(this.meta));
    } catch (e) { }
    this.updateTopHud();
  },

  switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    this.updateTopHud();
  },

  showHub() {
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

    let bonusHp = rankBonus.hp + (hunterLv - 1) * 3;
    let bonusStr = rankBonus.str + Math.floor(hunterLv / 5);
    let bonusDex = rankBonus.dex + Math.floor(hunterLv / 6);
    let bonusResourceStart = rankBonus.resourceStart;
    let firstTurnBlock = 0;
    let healAfterCombat = 0;
    let summonBoost = 0;

    // Equipped Magic Gear
    const wId = this.meta.equipped.weapon;
    if (wId && GAME_DATA.equipment[wId]) {
      const w = GAME_DATA.equipment[wId];
      const lv = this.meta.gearLevels[wId] || 0;
      bonusStr += Math.round(w.baseStr + lv * w.strPerLv);
      if (w.resourceBonus) bonusResourceStart += w.resourceBonus;
    }

    const aId = this.meta.equipped.armor;
    if (aId && GAME_DATA.equipment[aId]) {
      const a = GAME_DATA.equipment[aId];
      const lv = this.meta.gearLevels[aId] || 0;
      bonusHp += Math.round(a.baseHp + lv * a.hpPerLv);
      bonusDex += a.baseDex || 0;
    }

    const accId = this.meta.equipped.accessory;
    if (accId && GAME_DATA.equipment[accId]) {
      const acc = GAME_DATA.equipment[accId];
      const lv = this.meta.gearLevels[accId] || 0;
      firstTurnBlock += Math.round(acc.baseBlock + lv * acc.blockPerLv);
      healAfterCombat += acc.healAfterCombat || 0;
      summonBoost += acc.summonBoost || 0;
    }

    // Feats / Masteries
    const m = this.meta.masteryLevels;
    bonusHp += (m.vitality_training || 0) * 8;
    bonusStr += m.mana_circulation || 0;
    bonusResourceStart += m.mana_circulation || 0;
    const bonusDrawFirstTurn = m.tactical_intel || 0;
    const bonusGoldStart = (m.guild_funding || 0) * 45;
    const expMultPct = (m.exp_accelerator || 0) * 25;
    const bonusMaxEnergy = m.core_overdrive || 0;

    return {
      currentRank,
      hunterLv,
      subId,
      subObj,
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
      bonusMaxEnergy
    };
  },

  // --------------------------------------------------------------------------
  // HUB: 8 CLASSES GRID & 4 SUBCLASSES PICKER
  // --------------------------------------------------------------------------
  renderHub() {
    const grid = document.getElementById('hub-char-grid');
    grid.innerHTML = '';

    Object.values(GAME_DATA.characters).forEach(ch => {
      const isUnlocked = this.meta.unlocked[ch.id];
      const stats = this.getHunterTotalBonuses(ch.id);
      const shards = this.meta.shards[ch.id] || 0;
      const isSelected = this.meta.selectedCharId === ch.id;

      const card = document.createElement('div');
      card.className = `char-roster-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
      card.onclick = () => {
        this.meta.selectedCharId = ch.id;
        this.renderHub();
      };

      card.innerHTML = `
        <span class="char-rarity-badge rank-badge rank-${stats.currentRank}">${stats.currentRank}급</span>
        <span class="char-star-badge">${isUnlocked ? `Lv.${stats.hunterLv}` : '🔒 미소환'}</span>
        <div class="char-avatar-wrap">${ch.avatarSvg}</div>
        <h3>${ch.name.split(' ')[0]}</h3>
        <div class="char-archetype">${stats.subObj.icon} ${stats.subObj.name.split(' ')[0]}</div>
        <div style="font-size:0.7rem; color:#dfe6e9;">
          ❤️${stats.totalMaxHp} | ⚔️+${stats.bonusStr}
        </div>
        <div style="font-size:0.68rem; color:#fdcb6e; margin-top:2px;">
          🧩 조각 ${shards}
        </div>
      `;
      grid.appendChild(card);
    });

    this.renderSelectedCharPanel();
  },

  selectSubclass(charId, subId) {
    this.meta.selectedSubclasses[charId] = subId;
    this.saveMeta();
    this.renderHub();
  },

  renderSelectedCharPanel() {
    const panel = document.getElementById('hub-selected-panel');
    const ch = GAME_DATA.characters[this.meta.selectedCharId];
    const isUnlocked = this.meta.unlocked[ch.id];
    const stats = this.getHunterTotalBonuses(ch.id);
    const shards = this.meta.shards[ch.id] || 0;

    const lvCost = stats.hunterLv * 50;
    const nextRankMap = { C: 'B', B: 'A', A: 'S', S: null };
    const nextRank = nextRankMap[stats.currentRank];
    const rankShardCost = stats.currentRank === 'C' ? 10 : stats.currentRank === 'B' ? 20 : 30;
    const rankGemCost = stats.currentRank === 'C' ? 120 : stats.currentRank === 'B' ? 220 : 350;

    const wObj = GAME_DATA.equipment[this.meta.equipped.weapon];
    const aObj = GAME_DATA.equipment[this.meta.equipped.armor];
    const accObj = GAME_DATA.equipment[this.meta.equipped.accessory];

    const subCardsHtml = ch.subclasses
      .map(sub => {
        const isActive = sub.id === stats.subId;
        const bCard = GAME_DATA.cards[sub.bonusCard];
        const lCard = GAME_DATA.cards[sub.legendaryCard];
        return `
          <div class="subclass-card ${isActive ? 'active' : ''}" onclick="Game.selectSubclass('${ch.id}', '${sub.id}')">
            <h4>
              <span>${sub.icon} ${sub.name} <span style="font-size:0.7rem; color:#00d2d3;">(전용카드 10종)</span></span>
              <span style="font-size:0.68rem; color:${isActive ? '#00ff88' : '#a4b0be'}">${isActive ? '✔ 선택됨' : '클릭 선택'}</span>
            </h4>
            <p>${sub.desc}</p>
            <div style="font-size:0.68rem; color:#fdcb6e; margin-top:3px;">
              🎴 시작: [${bCard ? bCard.name : ''}] | 🌟 전설: [${lCard ? lCard.name : ''}]
            </div>
          </div>
        `;
      })
      .join('');

    panel.innerHTML = `
      <div class="selected-info-left">
        <h2>
          <span class="rank-badge rank-${stats.currentRank}">${stats.currentRank}급</span>
          <span style="color:${ch.accent}">${ch.name}</span>
          <span style="font-size:0.86rem; color:#dfe6e9;">— ${ch.heroName}</span>
          <button class="hud-btn" style="font-size:0.74rem; padding:4px 9px; border-color:#fdcb6e; color:#ffeaa7;" onclick="Game.openClassCompendium('${ch.id}')">
            📖 ${ch.name.split(' ')[0]} 카드 도감 (44종: 공용 4 + 하위직업 40)
          </button>
        </h2>
        <div class="subclass-picker-title">
          🔱 하위 직업 (Subclass) 4종 선택 — 선택한 하위 직업의 전용 카드 10종(일반4·고급3·희귀2·전설1) + 클래스 공용 4종으로 덱이 구성됩니다!
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
        <div style="font-size:0.74rem; color:#dfe6e9; background:rgba(0,0,0,0.3); padding:6px 8px; border-radius:8px;">
          ${ch.secondaryResourceIcon} <strong>${ch.secondaryResourceName}:</strong> ${ch.secondaryResourceDesc}
        </div>
        <div class="growth-stat-row" style="color:#a4b0be; font-size:0.74rem;">
          <span>무구: ${wObj.icon}+${this.meta.gearLevels[wObj.id] || 0} | ${aObj.icon}+${this.meta.gearLevels[aObj.id] || 0} | ${accObj.icon}+${this.meta.gearLevels[accObj.id] || 0}</span>
          <span>🧩 승급 조각: <strong style="color:#ffeaa7">${shards}개</strong></span>
        </div>
        <div class="growth-btn-row">
          <button class="btn-growth-action" onclick="Game.levelUpHunter('${ch.id}')">
            ⬆️ 클래스 레벨업 (Lv.${stats.hunterLv}→${stats.hunterLv + 1})<br/>
            <span style="color:#00d2d3">💎 ${lvCost} 마석</span>
          </button>
          ${nextRank
        ? `<button class="btn-growth-action reawaken" onclick="Game.promoteHunterRank('${ch.id}')">
                  🌟 ${stats.currentRank}급 ➔ ${nextRank}급 티어 승급!<br/>
                  <span style="color:#ffeaa7">🧩${rankShardCost}조각 또는 💎${rankGemCost}마석</span>
                </button>`
        : `<button class="btn-growth-action reawaken" disabled>👑 최고 등급 [S급 반신] 달성!</button>`
      }
        </div>
      </div>

      <div>
        ${isUnlocked
        ? `<button class="btn-start-run" onclick="Game.startNewRun('${ch.id}')">
                🏰 언더마운틴 출격 ➔<br/>
                <span style="font-size:0.75rem; font-weight:600; color:#ffeaa7;">[${stats.subObj.name.split(' ')[0]} 빌드]</span>
              </button>`
        : `<button class="btn-gacha-banner" onclick="Game.openGachaModal()">🎲 가챠로 이 클래스 소환</button>`
      }
      </div>
    `;
  },

  levelUpHunter(charId) {
    if (!this.meta.unlocked[charId]) {
      alert('먼저 가챠로 해당 클래스를 소환해야 합니다!');
      return;
    }
    const curLv = this.meta.levels[charId] || 1;
    const cost = curLv * 50;
    if (this.meta.gems < cost) {
      alert(`마석이 부족합니다! (필요: ${cost}, 보유: ${this.meta.gems})`);
      return;
    }
    this.meta.gems -= cost;
    this.meta.levels[charId] = curLv + 1;
    this.saveMeta();
    this.renderHub();
  },

  promoteHunterRank(charId) {
    if (!this.meta.unlocked[charId]) {
      alert('먼저 가챠로 해당 클래스를 소환해야 합니다!');
      return;
    }
    const curRank = this.meta.ranks[charId] || GAME_DATA.characters[charId].baseRank;
    const nextRankMap = { C: 'B', B: 'A', A: 'S', S: null };
    const nextRank = nextRankMap[curRank];
    if (!nextRank) return;

    const shardCost = curRank === 'C' ? 10 : curRank === 'B' ? 20 : 30;
    const gemCost = curRank === 'C' ? 120 : curRank === 'B' ? 220 : 350;
    const curShards = this.meta.shards[charId] || 0;

    if (curShards >= shardCost) {
      this.meta.shards[charId] -= shardCost;
    } else if (this.meta.gems >= gemCost) {
      this.meta.gems -= gemCost;
    } else {
      alert(`승급 재료가 부족합니다!\n필요: 🧩 조각 ${shardCost}개 또는 💎 ${gemCost} 마석`);
      return;
    }

    this.meta.ranks[charId] = nextRank;
    this.saveMeta();
    this.renderHub();
    alert(`🌟 축하합니다! [${GAME_DATA.characters[charId].name}] 클래스가 [${GAME_DATA.rankNames[nextRank]}] 등급으로 승급했습니다!\n(${GAME_DATA.rankBonuses[nextRank].desc})`);
  },

  // --------------------------------------------------------------------------
  // GACHA, MAGIC GEAR & FEATS
  // --------------------------------------------------------------------------
  openGachaModal() {
    document.getElementById('modal-gacha').classList.remove('hidden');
  },

  closeGachaModal() {
    document.getElementById('modal-gacha').classList.add('hidden');
    this.renderHub();
  },

  grantFreeGems() {
    this.meta.gems += 600;
    this.saveMeta();
    const grid = document.getElementById('gacha-results-grid');
    grid.innerHTML = `<div class="gacha-placeholder" style="color:#55efc4; font-weight:800;">🎁 워터딥 길드 후원금 +600 마석이 지급되었습니다! (현재 ${this.meta.gems} 마석)</div>`;
  },

  pullGacha(count) {
    const cost = count === 5 ? 450 : 100;
    if (this.meta.gems < cost) {
      alert('마석이 부족합니다! 우측의 [워터딥 길드 후원금] 버튼을 눌러 무료로 충전하세요.');
      return;
    }

    this.meta.gems -= cost;
    const charIds = Object.keys(GAME_DATA.characters);
    const results = [];

    for (let i = 0; i < count; i++) {
      const lockedIds = charIds.filter(id => !this.meta.unlocked[id]);
      let pickedId;
      if (count === 5 && i === 0 && lockedIds.length > 0) {
        pickedId = lockedIds[Math.floor(Math.random() * lockedIds.length)];
      } else {
        pickedId = charIds[Math.floor(Math.random() * charIds.length)];
      }

      const ch = GAME_DATA.characters[pickedId];
      const wasUnlocked = this.meta.unlocked[pickedId];
      this.meta.unlocked[pickedId] = true;
      if (!this.meta.ranks[pickedId]) this.meta.ranks[pickedId] = ch.baseRank;
      this.meta.shards[pickedId] = (this.meta.shards[pickedId] || 0) + (wasUnlocked ? 10 : 5);
      this.meta.selectedCharId = pickedId;

      results.push({
        char: ch,
        rank: this.meta.ranks[pickedId],
        isNew: !wasUnlocked,
        shardsTotal: this.meta.shards[pickedId]
      });
    }

    this.saveMeta();
    this.renderHub();

    const grid = document.getElementById('gacha-results-grid');
    grid.innerHTML = '';
    results.forEach(r => {
      const box = document.createElement('div');
      box.className = 'gacha-pull-card';
      box.style.borderColor = r.char.color;
      box.innerHTML = `
        <div style="margin-bottom:6px;">
          <span class="rank-badge rank-${r.rank}">${r.rank}급</span>
          <span style="font-size:0.75rem; font-weight:900; color:${r.char.accent}; margin-left:4px;">
            ${r.isNew ? '🌟 NEW 클래스!' : '🧩 조각 +10'}
          </span>
        </div>
        <div style="width:70px; height:70px; margin:0 auto 6px;">${r.char.avatarSvg}</div>
        <div style="font-weight:900; font-size:0.92rem;">${r.char.name}</div>
        <div style="font-size:0.72rem; color:#dfe6e9; margin-top:2px;">${r.char.heroName}</div>
        <div style="font-size:0.72rem; color:#fdcb6e; margin-top:5px;">보유 조각: ${r.shardsTotal}개</div>
      `;
      grid.appendChild(box);
    });
  },

  openGearModal() {
    document.getElementById('modal-gear').classList.remove('hidden');
    this.renderGearModal();
  },

  closeGearModal() {
    document.getElementById('modal-gear').classList.add('hidden');
    this.renderHub();
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
      alert('마석이 부족합니다!');
      return;
    }
    this.meta.gems -= item.unlockCost;
    this.meta.gearUnlocked[gearId] = true;
    this.meta.gearLevels[gearId] = 0;
    this.meta.equipped[item.slot] = gearId;
    this.saveMeta();
    this.renderGearModal();
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
      alert('마석이 부족합니다!');
      return;
    }
    this.meta.gems -= cost;
    this.meta.gearLevels[gearId] = lv + 1;
    this.saveMeta();
    this.renderGearModal();
  },

  openMasteryModal() {
    document.getElementById('modal-mastery').classList.remove('hidden');
    this.renderMasteryModal();
  },

  closeMasteryModal() {
    document.getElementById('modal-mastery').classList.add('hidden');
    this.renderHub();
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
      alert('마석이 부족합니다!');
      return;
    }
    this.meta.gems -= cost;
    this.meta.masteryLevels[mId] = lv + 1;
    this.saveMeta();
    this.renderMasteryModal();
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

    // Rank A / S adds the 4th Shared Rare Card to the starter deck
    if (stats.currentRank === 'A' || stats.currentRank === 'S') {
      const awkCard = this.createCardInstance(ch.awakeningCard, 98);
      if (stats.currentRank === 'S') awkCard.upgraded = true;
      deck.push(awkCard);
    }

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
      runNextExp: 120,
      sp: 0, // Earn SP by leveling up in combat (D&D Lv.1 -> Lv.20 cap)
      allocatedStats: {
        str: 0,
        dex: 0,
        vit: 0,
        mana: 0
      },
      permStats: stats,
      maxHp: stats.totalMaxHp,
      hp: stats.totalMaxHp,
      gold: 99 + stats.bonusGoldStart,
      act: 1, // Act 1 ~ 5 (총 5개 층)
      maxActs: 5,
      stage: 1, // Stage 1 ~ 30 per Act (1개 층당 30개 스테이지)
      stagesPerAct: 30,
      selectedBosses,
      selectedMidBosses,
      deck,
      relics: [ch.startRelic],
      potions: ['rad_heal'],
      actMap: null
    };
    this.run.actMap = this.generate30StageActMap(1);

    this.switchScreen('screen-map');
    this.renderMap();
  },

  // Generates 30 Stages of encounters/choices for the given Act (1..5)
  generate30StageActMap(actNum) {
    const stages = [];
    const bossId = this.run && this.run.selectedBosses ? this.run.selectedBosses[actNum] : GAME_DATA.acts[actNum - 1].bossPool[0];
    const midBossId =
      this.run && this.run.selectedMidBosses ? this.run.selectedMidBosses[actNum] : GAME_DATA.acts[actNum - 1].midBossPool[0];
    const bossObj = GAME_DATA.enemies[bossId];
    const midObj = GAME_DATA.enemies[midBossId];

    for (let s = 1; s <= 30; s++) {
      let nodes = [];
      if (s === 30) {
        nodes = [
          {
            id: `a${actNum}_s30_boss`,
            type: 'boss',
            label: `👑 [Stage 30 계층 보스] ${bossObj ? bossObj.name : '계층 지배자'}`
          }
        ];
      } else if (s === 15) {
        nodes = [
          {
            id: `a${actNum}_s15_midboss`,
            type: 'midboss',
            label: `🩸 [Stage 15 중간보스] ${midObj ? midObj.name : '수문장'}`
          },
          {
            id: `a${actNum}_s15_rest`,
            type: 'rest',
            label: `🏕️ 비밀 우회로 야영지 (긴 휴식 & 룬 각인)`
          }
        ];
      } else if (s === 29 || s === 14) {
        nodes = [
          { id: `a${actNum}_s${s}_rest`, type: 'rest', label: `🏕️ 보스전 직전 야영지 (긴 휴식 & 카드 단련)` },
          { id: `a${actNum}_s${s}_shop`, type: 'shop', label: `💰 방랑 마법 상점 (주문서 & 물약 보급)` }
        ];
      } else if (s % 5 === 0) {
        nodes = [
          { id: `a${actNum}_s${s}_shop`, type: 'shop', label: `💰 워터딥 방랑 마법 상점` },
          { id: `a${actNum}_s${s}_rest`, type: 'rest', label: `🏕️ 안전한 야영지 (긴 휴식 & 룬 각인)` },
          { id: `a${actNum}_s${s}_event`, type: 'event', label: `🎲 D20 주사위 판정 성소` }
        ];
      } else if (s % 4 === 0) {
        nodes = [
          { id: `a${actNum}_s${s}_elite`, type: 'elite', label: `🔥 엘리트 몬스터 토벌 (유물 & 대량 EXP)` },
          { id: `a${actNum}_s${s}_event`, type: 'event', label: `🎲 D20 운명 판정 이벤트` },
          { id: `a${actNum}_s${s}_combat`, type: 'combat', label: `⚔️ 일반 몬스터 순찰대` }
        ];
      } else {
        nodes = [
          { id: `a${actNum}_s${s}_c1`, type: 'combat', label: `⚔️ 미궁 몬스터 교전 (전투)` },
          {
            id: `a${actNum}_s${s}_c2`,
            type: s % 2 === 0 ? 'event' : 'combat',
            label: s % 2 === 0 ? `🎲 D20 기이한 조우 (선택지)` : `⚔️ 몬스터 매복 돌파 (전투)`
          },
          {
            id: `a${actNum}_s${s}_c3`,
            type: s % 3 === 0 ? 'rest' : 'elite',
            label: s % 3 === 0 ? `🏕️ 짧은 야영지 & 마법부여` : `🔥 위험 구역: 엘리트 강적`
          }
        ];
      }

      stages.push({
        stage: s,
        completed: false,
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

    document.getElementById('map-act-title').textContent = `🏰 ${actInfo.name} (Stage ${this.run.stage} / 30)`;
    document.getElementById('map-act-subtitle').innerHTML = `${actInfo.subtitle} — <strong style="color:#ff7675">이번 층의 30스테이지 보스 예고: ${currentBossObj ? currentBossObj.name : ''
      }</strong> (4종 중 무작위 배정됨)`;

    const spCountEl = document.getElementById('map-sp-count');
    if (spCountEl) spCountEl.textContent = this.run.sp;

    // Render 5-Act Top Progress Bar
    const actBar = document.getElementById('map-act-progress-bar');
    actBar.innerHTML = GAME_DATA.acts
      .map(a => {
        const cls = a.act === this.run.act ? 'active-act' : a.act < this.run.act ? 'cleared-act' : '';
        return `
          <div class="act-pill ${cls}">
            ${a.act < this.run.act ? '✔ ' : a.act === this.run.act ? '📍 ' : ''}제${a.act}계층 (30 스테이지)
          </div>
        `;
      })
      .join('');

    const wrap = document.getElementById('map-nodes-wrapper');
    wrap.innerHTML = '';

    this.run.actMap.forEach(row => {
      const isCurrent = row.stage === this.run.stage;
      const rowEl = document.createElement('div');
      rowEl.className = `map-floor-row ${isCurrent ? 'current-floor' : ''}`;
      if (isCurrent) rowEl.id = 'current-stage-row';

      const nodesHtml = row.nodes
        .map(n => {
          const stateClass = isCurrent ? 'available' : row.completed ? 'completed' : '';
          return `
            <button class="map-node-btn ${stateClass}" ${isCurrent ? `onclick="Game.enterMapNode('${n.id}', '${n.type}')"` : ''
            }>
              ${n.label}
            </button>
          `;
        })
        .join('');

      rowEl.innerHTML = `
        <div class="floor-label">${this.run.act}층 - STAGE ${row.stage}/30</div>
        <div class="floor-nodes-group">${nodesHtml}</div>
      `;
      wrap.appendChild(rowEl);
    });

    // Auto-scroll to current stage row inside the 30-stage list
    setTimeout(() => {
      const curEl = document.getElementById('current-stage-row');
      if (curEl) curEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);

    this.updateTopHud();
  },

  enterMapNode(nodeId, type) {
    if (type === 'combat' || type === 'elite' || type === 'midboss' || type === 'boss') {
      this.startCombat(type);
    } else if (type === 'rest') {
      this.switchScreen('screen-rest');
    } else if (type === 'shop') {
      this.openShopScreen();
    } else if (type === 'event') {
      this.openEventScreen();
    }
  },

  leaveNodeToMap() {
    if (!this.run) return;
    const currentRow = this.run.actMap.find(r => r.stage === this.run.stage);
    if (currentRow) currentRow.completed = true;

    if (this.run.stage < this.run.stagesPerAct) {
      this.run.stage += 1;
      this.switchScreen('screen-map');
      this.renderMap();
    } else {
      // Completed Stage 30 Boss of current Act! Advance to next Act (1..5)
      if (this.run.act < this.run.maxActs) {
        this.run.act += 1;
        this.run.stage = 1;
        // Slay the Spire style: Heal 60% of missing HP between Acts (instead of 100% free full heal)
        const missingHp = this.run.maxHp - this.run.hp;
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + Math.round(missingHp * 0.6));
        this.run.actMap = this.generate30StageActMap(this.run.act);
        alert(
          `🎉 제${this.run.act - 1}계층(30 스테이지) 보스를 토벌했습니다!\n잃은 체력의 60%를 회복하며 더 위험한 다음 계층 [${
            GAME_DATA.acts[this.run.act - 1].name
          }] (Stage 1/30)으로 진입합니다!`
        );
        this.switchScreen('screen-map');
        this.renderMap();
      } else {
        this.showGameOverModal(true);
      }
    }
  },

  // --------------------------------------------------------------------------
  // IN-RUN EXP & D&D ABILITY SCORE IMPROVEMENT (SP - Capped at D&D Lv.20)
  // --------------------------------------------------------------------------
  gainRunExp(rawExp) {
    if (!this.run) return { gained: 0, leveledUp: 0 };
    const mult = 1 + (this.run.permStats.expMultPct || 0) / 100;
    const gained = Math.round(rawExp * mult);
    this.run.runExp += gained;

    let leveledUp = 0;
    while (this.run.runExp >= this.run.runNextExp && this.run.runLv < 20) {
      this.run.runExp -= this.run.runNextExp;
      this.run.runLv += 1;
      this.run.sp += 1; // +1 SP per Level (D&D 5e Lv.1 -> Lv.20 curve across 150 stages)
      this.run.maxHp += 3;
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 5);
      this.run.runNextExp = Math.round(this.run.runNextExp * 1.28 + 30);
      leveledUp += 1;
    }
    this.updateTopHud();
    return { gained, leveledUp };
  },

  openRunStatModal() {
    if (!this.run) return;
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
    document.getElementById('hud-floor').textContent = `${this.run.act}층 - ${this.run.stage}/30`;
    document.getElementById('hud-deck-count').textContent = this.run.deck.length;

    const relicsBox = document.getElementById('hud-relics');
    relicsBox.innerHTML = this.run.relics
      .map(rid => {
        const r = GAME_DATA.relics[rid];
        return r ? `<div class="relic-chip" title="${r.name}: ${r.desc}">${r.icon}</div>` : '';
      })
      .join('');

    const potionsBox = document.getElementById('hud-potions');
    potionsBox.innerHTML = this.run.potions
      .map((pid, idx) => {
        const p = GAME_DATA.potions[pid];
        return p
          ? `<div class="potion-chip" onclick="Game.usePotion(${idx})" title="[클릭하여 사용] ${p.name}: ${p.desc}">${p.icon}</div>`
          : '';
      })
      .join('');
  },

  usePotion(idx) {
    if (!this.run) return;
    const pid = this.run.potions[idx];
    const p = GAME_DATA.potions[pid];
    if (!p) return;

    const inCombat = document.getElementById('screen-combat').classList.contains('active') && this.combat;

    if (pid === 'rad_heal') {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 25);
      this.logCombat(`🧪 [${p.name}] 사용! 체력을 25 회복했습니다.`);
    } else if (!inCombat) {
      alert('이 물약은 전투 중에만 사용할 수 있습니다!');
      return;
    } else if (pid === 'fury_stim') {
      this.combat.player.strength += 3;
      this.combat.energy += 2;
      this.logCombat(`💪 [${p.name}] 사용! 힘 +3, 행동력 +2 획득!`);
    } else if (pid === 'acid_bomb') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) {
          this.dealDamageToEnemy(en, 20, true);
          en.poison += 8;
        }
      });
      this.logCombat(`💣 [${p.name}] 투척! 적 전체 피해 20 및 산성 맹독 8 부여!`);
    } else if (pid === 'shield_gel') {
      this.combat.player.block += 18;
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
    const hasFusionCell = this.run.relics.includes('fusion_cell');
    const maxEnergy = ch.startEnergy + (hasFusionCell ? 1 : 0) + (pStats.bonusMaxEnergy || 0);

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
      // From Act 2+, Elites can appear with a minion guard for STS2 tactical pressure!
      enemyTemplates = this.run.act >= 2 && this.run.stage >= 12 ? [GAME_DATA.enemies[eId], GAME_DATA.enemies[guardId]] : [GAME_DATA.enemies[eId]];
    } else {
      const pool = actInfo.normalPool;
      const e1 = GAME_DATA.enemies[pool[this.run.stage % pool.length]];
      const e2 = GAME_DATA.enemies[pool[(this.run.stage + 1) % pool.length]];
      const e3 = GAME_DATA.enemies[pool[(this.run.stage + 2) % pool.length]];
      if (this.run.stage <= 2 && this.run.act === 1) {
        enemyTemplates = [e1]; // Easy first 2 stages of Act 1
      } else if (this.run.stage >= 20 && this.run.stage % 4 === 2) {
        enemyTemplates = [e1, e2, e3]; // 3-enemy encounter late in the floor!
      } else {
        enemyTemplates = [e1, e2];
      }
    }

    // Slay the Spire 2 Difficulty Scaling across 5 Acts x 30 Stages:
    // Both Enemy HP AND Enemy Damage/Block scale progressively with Act & Stage!
    const hpScale = 1 + (this.run.act - 1) * 0.42 + (this.run.stage - 1) * 0.024;
    const dmgScale = 1 + (this.run.act - 1) * 0.28 + (this.run.stage - 1) * 0.016;
    const enragePerTurn = encounterType === 'boss' ? Math.max(1, Math.floor(this.run.act * 0.8)) : encounterType === 'elite' || encounterType === 'midboss' ? 1 : 0;

    const enemies = enemyTemplates.map((t, i) => {
      const scaledMoves = t.moves.map(m => {
        const sm = { ...m };
        if (sm.dmg) sm.dmg = Math.round(sm.dmg * dmgScale);
        if (sm.block) sm.block = Math.round(sm.block * dmgScale);
        if (sm.str) sm.str = Math.max(1, Math.round(sm.str * (1 + (this.run.act - 1) * 0.2)));
        return sm;
      });

      return {
        uid: `en_${i}`,
        id: t.id,
        name: t.name,
        isBoss: encounterType === 'boss',
        isElite: encounterType === 'elite' || encounterType === 'midboss',
        enragePerTurn,
        maxHp: Math.round(t.maxHp * hpScale),
        hp: Math.round(t.maxHp * hpScale),
        expReward: t.expReward || 50,
        block: encounterType === 'boss' ? this.run.act * 6 : 0,
        strength: 0,
        weak: 0,
        vuln: 0,
        poison: 0,
        svg: t.svg,
        moves: scaledMoves,
        moveIndex: i % scaledMoves.length
      };
    });

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
      player: {
        block: pStats.firstTurnBlock || 0,
        strength: pStats.bonusStr + rStats.str,
        dexterity: pStats.bonusDex + rStats.dex,
        metallicize: 0,
        weak: 0,
        vuln: 0
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
      log: `[${ch.name} - ${this.run.subclassObj.name}] 전투 개시!`
    };

    this.applyStartOfCombatEffects();
    this.switchScreen('screen-combat');
    this.startPlayerTurn(true);
  },

  applyStartOfCombatEffects() {
    const cid = this.run.charId;
    const subId = this.run.subclassId;
    const relics = this.run.relics;
    const pStats = this.run.permStats;
    const rStats = this.run.allocatedStats;

    // Class base passives
    if (cid === 'fighter') this.combat.secondaryResource += 2;
    if (cid === 'barbarian') {
      this.combat.player.strength += 2;
      this.combat.secondaryResource += 2;
    }
    if (cid === 'rogue') {
      this.combat.enemies.forEach(en => {
        en.poison += 3;
        en.vuln += 1;
      });
    }
    if (cid === 'ranger') {
      this.combat.secondaryResource += 3;
      this.combat.player.dexterity += 2;
    }
    if (cid === 'wizard') {
      this.combat.drones += 1;
      this.combat.secondaryResource += 3;
    }
    if (cid === 'cleric') {
      this.combat.drones += 1;
      this.combat.secondaryResource += 2;
    }
    if (cid === 'paladin') {
      this.combat.player.metallicize += 4;
      this.combat.secondaryResource += 3;
    }
    if (cid === 'warlock') {
      this.summonOrBuffCompanion(18 + pStats.summonBoost, 7 + pStats.summonBoost + rStats.mana * 3);
    }

    // Dynamic Archetype Synergy: Count how many cards of each subclass archetype are in the player's current deck!
    const deckSubCounts = {};
    this.run.deck.forEach(c => {
      const tpl = GAME_DATA.cards[c.id];
      if (tpl && tpl.subclassId && tpl.subclassId !== 'shared') {
        deckSubCounts[tpl.subclassId] = (deckSubCounts[tpl.subclassId] || 0) + 1;
      }
    });
    // Identify dominant archetype if player has collected 3+ cards from that subclass route
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

    // Relics
    if (relics.includes('Geiger_counter')) this.combat.player.strength += 2;
    if (relics.includes('mutant_adrenal')) this.combat.player.block += 8;
    if (relics.includes('titanium_ribs')) {
      this.combat.player.dexterity += 2;
      this.combat.player.metallicize += 4;
    }
  },

  summonOrBuffCompanion(healAmt, atkBoost = 0) {
    const s = this.combat.summon;
    const cap = s.maxHpCap || 45;
    const atkCap = 22 + (this.run ? this.run.act * 5 : 5);
    if (!s.active) {
      s.active = true;
      s.maxHp = Math.min(cap, Math.max(16, healAmt));
      s.hp = Math.min(s.maxHp, healAmt);
      s.atk = Math.min(atkCap, Math.max(6, atkBoost));
    } else {
      s.maxHp = Math.min(cap, s.maxHp + Math.round(healAmt * 0.25));
      s.hp = Math.min(s.maxHp, s.hp + Math.round(healAmt * 0.75));
      s.atk = Math.min(atkCap, s.atk + Math.ceil(atkBoost * 0.6));
    }
  },

  startPlayerTurn(isFirstTurn = false) {
    if (!this.combat) return;
    const subId = this.run.subclassId;
    this.combat.firstAttackUsedThisTurn = false;
    this.combat.burstUsedThisTurn = false;

    if (!isFirstTurn) {
      this.combat.turn += 1;
      this.combat.player.block = subId === 'totem_warrior' ? 4 : subId === 'life_domain' ? 3 : 0;
      this.combat.energy = this.combat.maxEnergy;
      if (this.combat.stance === 'divinity') this.combat.stance = 'neutral';
      if (subId === 'life_domain') {
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + 2);
      }
      if (subId === 'berserker') {
        this.combat.secondaryResource += 1;
      }
      if (this.run.relics.includes('rod_of_pact_keeper') && this.combat.summon.active) {
        this.combat.summon.hp = Math.min(this.combat.summon.maxHp, this.combat.summon.hp + 3);
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
      if (subId === 'thief' || subId === 'gloom_stalker' || subId === 'wild_magic') drawCount += 1;
      drawCount += this.run.permStats.bonusDrawFirstTurn || 0;
    }
    if (subId === 'divination' || subId === 'archfey_chain') drawCount += 1;
    if (this.run.relics.includes('mutant_adrenal')) drawCount += 1;

    this.drawCards(drawCount);
    this.renderCombat();
  },

  drawCards(count) {
    for (let i = 0; i < count; i++) {
      if (this.combat.hand.length >= 10) break;
      if (this.combat.drawPile.length === 0) {
        if (this.combat.discardPile.length === 0) break;
        this.combat.drawPile = this.combat.discardPile.splice(0);
        this.shuffleArray(this.combat.drawPile);
      }
      const card = this.combat.drawPile.pop();
      if (card) this.combat.hand.push(card);
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

        if (this.combat.stance === 'wrath') baseDamage = Math.round(baseDamage * 2);
        if (this.combat.stance === 'divinity') baseDamage = Math.round(baseDamage * 3);
      }
      if (baseBlock > 0) {
        baseBlock += this.combat.player.dexterity;
        if (tpl.blockPerDrone) baseBlock += this.combat.drones * tpl.blockPerDrone;
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

  playCardFromHand(handIdx) {
    if (!this.combat) return;
    const cardInst = this.combat.hand[handIdx];
    if (!cardInst) return;
    const tpl = GAME_DATA.cards[cardInst.id];

    if (this.combat.energy < tpl.cost) {
      this.logCombat('⚠️ 행동력(AP)이 부족합니다!');
      return;
    }

    let target = this.combat.enemies[this.combat.targetIndex];
    if (!target || target.hp <= 0) {
      target = this.combat.enemies.find(e => e.hp > 0);
      this.combat.targetIndex = this.combat.enemies.indexOf(target);
    }
    if (!target) return;

    this.combat.energy -= tpl.cost;
    const stats = this.computeCardStats(cardInst);
    const subId = this.run.subclassId;

    if (tpl.selfDamage) this.run.hp = Math.max(1, this.run.hp - tpl.selfDamage);
    if (tpl.gainEnergy) this.combat.energy += tpl.gainEnergy;
    if (stats.block > 0) this.combat.player.block += stats.block;
    if (tpl.doubleBlock) this.combat.player.block *= 2;
    if (stats.strength > 0) this.combat.player.strength += stats.strength;
    if (stats.dexterity > 0) this.combat.player.dexterity += stats.dexterity;
    if (tpl.metallicize) this.combat.player.metallicize += tpl.metallicize;
    if (tpl.stance) this.changeStance(tpl.stance);

    if (stats.summonHeal > 0 || stats.summonAtkBoost > 0) {
      this.summonOrBuffCompanion(stats.summonHeal, stats.summonAtkBoost);
    }
    if (tpl.addDrone) {
      const cap = this.combat.maxDrones || 3;
      this.combat.drones = Math.min(cap, this.combat.drones + tpl.addDrone);
    }

    const targets = tpl.target === 'all' ? this.combat.enemies.filter(e => e.hp > 0) : [target];
    const hits = tpl.hits || 1;

    if (stats.damage > 0 || tpl.damagePerPoison) {
      // Subclass Per-Attack Triggers
      if (subId === 'champion') {
        this.run.hp = Math.min(this.run.maxHp, this.run.hp + 1);
      }
      if (subId === 'battlemaster' && !this.combat.firstAttackUsedThisTurn) {
        this.combat.firstAttackUsedThisTurn = true;
        target.vuln += 1;
        target.weak += 1;
      }
      if (subId === 'hexblade' || subId === 'oathbreaker' || subId === 'phantom') {
        target.poison += 3;
      }

      for (let h = 0; h < hits; h++) {
        targets.forEach(en => {
          if (en.hp > 0) {
            let dmg = stats.damage;
            if (tpl.damagePerPoison) dmg += en.poison;
            if (subId === 'gloom_stalker' && this.combat.turn === 1) dmg = Math.round(dmg * 1.4);
            this.dealDamageToEnemy(en, dmg);
          }
        });
      }
    }

    targets.forEach(en => {
      if (en.hp <= 0) return;
      if (stats.poison > 0) en.poison += stats.poison;
      if (stats.vuln > 0) en.vuln += stats.vuln;
      if (stats.weak > 0) en.weak += stats.weak;
      if (tpl.doublePoison) en.poison *= 2;
      if (tpl.triggerPoisonNow && en.poison > 0) {
        this.dealDamageToEnemy(en, en.poison, true);
      }
    });

    if (tpl.healOnHit) this.run.hp = Math.min(this.run.maxHp, this.run.hp + tpl.healOnHit);
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
    this.checkCombatEnd();
    this.renderCombat();
  },

  applyCardMutationEffect(mutId, target) {
    if (mutId === 'rad_infused' && target && target.hp > 0) {
      target.poison += 4;
    } else if (mutId === 'adrenaline_gene') {
      this.drawCards(1);
      this.gainSecondaryResource(2);
    } else if (mutId === 'chitin_coat') {
      this.combat.player.block += 6;
    } else if (mutId === 'vampiric_cell') {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 3);
    }
  },

  changeStance(newStance) {
    const oldStance = this.combat.stance;
    if (oldStance === newStance) return;
    if (oldStance === 'calm') {
      this.combat.energy += 2;
      this.logCombat('☯️ [명경/신앙 태세] 해제! 행동력(AP) +2 획득!');
    }
    if (newStance === 'divinity') {
      this.combat.energy += 2;
      this.logCombat('🌟 [초월/천상 강림] 개방! 모든 피해 3배 및 AP +2!');
    }
    this.combat.stance = newStance;
  },

  gainSecondaryResource(amt) {
    this.combat.secondaryResource += amt;
  },

  triggerSecondaryBurst() {
    if (!this.combat) return;
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
    const cid = this.run.charId;

    if (cid === 'fighter') {
      this.combat.energy += 1;
      this.combat.player.strength += 1;
      this.drawCards(2);
      this.logCombat('⚔️ [행동 연쇄(Action Surge) 개방] 행동력 +1, 힘 +1, 카드 2장 드로우!');
    } else if (cid === 'barbarian') {
      this.combat.player.strength += 2;
      this.combat.player.block += 8;
      this.logCombat('💢 [광란의 격노 폭발] 힘 +2 및 방어도 +8 획득!');
    } else if (cid === 'rogue') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) {
          en.poison += 4;
          this.dealDamageToEnemy(en, en.poison, true);
        }
      });
      this.drawCards(1);
      this.logCombat('🗡️ [급소 맹독 격발] 모든 적에게 맹독 +4 부여 및 즉시 맹독 피해 폭발!');
    } else if (cid === 'ranger') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) this.dealDamageToEnemy(en, 11 + this.combat.player.strength, true);
      });
      const target = this.combat.enemies.find(e => e.hp > 0);
      if (target && this.combat.summon.active) this.triggerSummonCoopAttack(target);
      this.logCombat('🏹 [사냥꾼의 일제 사격] 적 전체 관통 화살 및 야수 동료 협공!');
    } else if (cid === 'wizard') {
      this.combat.energy += 1;
      this.combat.drones = Math.min(this.combat.maxDrones || 4, this.combat.drones + 1);
      this.triggerDronesAction();
      this.logCombat('🔮 [비전 회복(Arcane Recovery)] 행동력 +1, 비전 구체 소환 및 일제 폭격!');
    } else if (cid === 'cleric') {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 6);
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) this.dealDamageToEnemy(en, 13, true);
      });
      this.logCombat('☀️ [신성력 전달(Channel Divinity)] 내 체력 +6 회복 및 적 전체에 광휘 심판 13 피해!');
    } else if (cid === 'paladin') {
      this.combat.player.strength += 1;
      this.combat.player.block += 10;
      const target = this.combat.enemies.find(e => e.hp > 0);
      if (target) this.dealDamageToEnemy(target, 15 + this.combat.player.strength, true);
      this.logCombat('✨ [천벌의 신성한 강타] 힘 +1, 방어도 +10 및 적에게 심판의 성검 강타!');
    } else if (cid === 'warlock') {
      this.summonOrBuffCompanion(10, 3);
      const target = this.combat.enemies.find(e => e.hp > 0);
      if (target) this.triggerSummonCoopAttack(target);
      this.logCombat('🟣 [후원자의 권능 개방] 계약 악마 강화 및 즉시 협공!');
    }

    this.checkCombatEnd();
    this.renderCombat();
  },

  triggerSummonCoopAttack(target) {
    if (!this.combat.summon.active) return;
    const t = target && target.hp > 0 ? target : this.combat.enemies.find(e => e.hp > 0);
    if (!t) return;
    this.dealDamageToEnemy(t, this.combat.summon.atk, true);
    this.logCombat(`${this.combat.summon.name} 협동 공격! (${this.combat.summon.atk} 피해)`);
  },

  triggerDronesAction() {
    if (this.combat.drones <= 0) return;
    const alive = this.combat.enemies.filter(e => e.hp > 0);
    if (alive.length === 0) return;

    const dmgPerDrone = 5 + Math.max(0, this.combat.player.strength) + (this.run.permStats.summonBoost || 0);
    const blockPerDrone = 3;

    for (let i = 0; i < this.combat.drones; i++) {
      const t = alive[i % alive.length];
      this.dealDamageToEnemy(t, dmgPerDrone, true);
      this.combat.player.block += blockPerDrone;
    }
  },

  dealDamageToEnemy(enemy, rawDmg, ignoreWeak = false) {
    let dmg = rawDmg;
    if (!ignoreWeak && this.combat.player.weak > 0) dmg = Math.floor(dmg * 0.75);
    if (enemy.vuln > 0) dmg = Math.floor(dmg * 1.5);
    if (enemy.block > 0) {
      const absorbed = Math.min(enemy.block, dmg);
      enemy.block -= absorbed;
      dmg -= absorbed;
    }
    enemy.hp = Math.max(0, enemy.hp - dmg);
  },

  endPlayerTurn() {
    if (!this.combat) return;
    const subId = this.run.subclassId;

    while (this.combat.hand.length > 0) {
      this.combat.discardPile.push(this.combat.hand.pop());
    }

    if (this.combat.player.metallicize > 0) {
      this.combat.player.block += this.combat.player.metallicize;
    }
    if (subId === 'hunter_conclave') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) this.dealDamageToEnemy(en, 6 + this.combat.player.strength, true);
      });
    }
    if (subId === 'fey_wanderer') {
      this.combat.enemies.forEach(en => {
        if (en.hp > 0) en.weak += 1;
      });
    }
    if (this.combat.summon.active) {
      const firstAlive = this.combat.enemies.find(e => e.hp > 0);
      if (firstAlive) this.triggerSummonCoopAttack(firstAlive);
    }
    if (this.combat.drones > 0) {
      this.triggerDronesAction();
    }

    if (this.checkCombatEnd()) return;

    this.combat.enemies.forEach(en => {
      if (en.hp <= 0) return;
      en.block = 0;

      if (en.poison > 0) {
        en.hp = Math.max(0, en.hp - en.poison);
        en.poison = Math.max(0, en.poison - 1);
      }
      if (en.hp <= 0) return;

      const move = en.moves[en.moveIndex % en.moves.length];
      en.moveIndex += 1;

      if (move.intent === 'attack' || move.intent === 'attack_debuff' || move.intent === 'multi_attack') {
        const hits = move.hits || 1;
        // Bosses/Elites using attack_debuff (Breath / AoE) cleave both Summon AND Hunter!
        const isCleaveBreath = (en.isBoss || en.isElite) && move.intent === 'attack_debuff';
        for (let h = 0; h < hits; h++) {
          let dmg = move.dmg + en.strength;
          if (en.weak > 0) dmg = Math.floor(dmg * 0.75);
          if (this.combat.player.vuln > 0) dmg = Math.floor(dmg * 1.5);
          if (this.combat.stance === 'wrath') dmg = Math.floor(dmg * 2);
          this.applyEnemyDamageToPlayerOrSummon(dmg, isCleaveBreath);
        }
      }

      if (move.block) en.block += move.block;
      if (move.str) en.strength += move.str;
      if (move.weak) this.combat.player.weak += move.weak;
      if (move.vuln) this.combat.player.vuln += move.vuln;

      // Slay the Spire 2 Escalation: Bosses and Elites gain Enrage Strength every turn!
      if (en.enragePerTurn > 0) {
        en.strength += en.enragePerTurn;
      }

      if (en.weak > 0) en.weak -= 1;
      if (en.vuln > 0) en.vuln -= 1;
    });

    if (this.combat.player.weak > 0) this.combat.player.weak -= 1;
    if (this.combat.player.vuln > 0) this.combat.player.vuln -= 1;

    if (this.checkCombatEnd()) return;
    this.startPlayerTurn(false);
  },

  applyEnemyDamageToPlayerOrSummon(dmg, isCleaveBreath = false) {
    let remaining = dmg;
    if (this.combat.player.block > 0) {
      const blocked = Math.min(this.combat.player.block, remaining);
      this.combat.player.block -= blocked;
      remaining -= blocked;
    }
    if (remaining > 0 && this.combat.summon.active && this.combat.summon.hp > 0) {
      if (isCleaveBreath) {
        // Boss Breath / AoE cleaves: Summon absorbs 50%, Player takes 50%!
        const summonShare = Math.ceil(remaining * 0.5);
        const playerShare = Math.floor(remaining * 0.5);
        this.combat.summon.hp = Math.max(0, this.combat.summon.hp - summonShare);
        if (this.combat.summon.hp <= 0) {
          this.combat.summon.active = false;
          this.logCombat(`💥 보스의 광역 공격에 [${this.combat.summon.name}] 소환수가 소멸했습니다!`);
        }
        remaining = playerShare;
      } else {
        const tanked = Math.min(this.combat.summon.hp, remaining);
        this.combat.summon.hp -= tanked;
        remaining -= tanked;
        if (this.combat.summon.hp <= 0) {
          this.combat.summon.active = false;
          this.logCombat(`💥 [${this.combat.summon.name}] 소환수가 대신 치명타를 막아내고 소멸했습니다!`);
        }
      }
    }
    if (remaining > 0) {
      this.run.hp = Math.max(0, this.run.hp - remaining);
    }
  },

  checkCombatEnd() {
    if (!this.combat) return true;
    if (this.run.hp <= 0) {
      this.showGameOverModal(false);
      return true;
    }
    const anyAlive = this.combat.enemies.some(e => e.hp > 0);
    if (!anyAlive) {
      this.handleCombatVictory();
      return true;
    }
    return false;
  },

  handleCombatVictory() {
    const type = this.combat.encounterType;

    let healAmt = this.run.permStats.healAfterCombat || 0;
    if (this.run.charId === 'fighter' || this.run.relics.includes('fighters_badge')) healAmt += 6;
    if (this.run.charId === 'cleric' || this.run.relics.includes('holy_symbol_lathander')) healAmt += 5;
    if (healAmt > 0) {
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + healAmt);
    }

    const rawExp = this.combat.enemies.reduce((acc, e) => acc + (e.expReward || 50), 0);
    const expRes = this.gainRunExp(rawExp);

    // Final Act 5 Stage 30 Boss (Tiamat) defeated!
    if (type === 'boss' && this.run.act >= this.run.maxActs) {
      this.meta.gems += 800;
      this.meta.shards[this.run.charId] = (this.meta.shards[this.run.charId] || 0) + 25;
      this.saveMeta();
      this.showGameOverModal(true);
      return;
    }

    let goldEarned = type === 'boss' ? 120 : type === 'elite' || type === 'midboss' ? 70 : 38;
    if (this.run.subclassId === 'thief') goldEarned += 25;
    if (this.run.relics.includes('scavenger_goggles')) goldEarned = Math.round(goldEarned * 1.35);
    this.run.gold += goldEarned;

    const gemsEarned = type === 'boss' ? 150 : type === 'elite' || type === 'midboss' ? 65 : 28;
    this.meta.gems += gemsEarned;
    this.meta.shards[this.run.charId] =
      (this.meta.shards[this.run.charId] || 0) + (type === 'boss' ? 10 : type === 'elite' ? 4 : 2);

    let bonusText = `⭐ 경험치 +${expRes.gained} EXP ${expRes.leveledUp > 0 ? `(🆙 레벨업! SP +${expRes.leveledUp * 2} 획득!)` : ''
      } | 🪙 +${goldEarned} GP | 💎 마석 +${gemsEarned}`;

    if (type === 'elite' || type === 'midboss' || type === 'boss') {
      const relicGranted = this.grantRandomRelic();
      if (relicGranted) bonusText += ` | 🏆 마법 유물 획득: [${relicGranted.name}]`;
    }

    this.saveMeta();
    this.openRewardModal(bonusText);
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
      stanceEl.textContent = '☯️ 태세: 신앙/명경 (해제 시 AP+2)';
    } else if (this.combat.stance === 'wrath') {
      stanceEl.classList.add('stance-wrath');
      stanceEl.textContent = '🔥 태세: 광란/복수 (공격력 2배)';
    } else if (this.combat.stance === 'divinity') {
      stanceEl.classList.add('stance-divinity');
      stanceEl.textContent = '🌟 태세: 천상 강림 (공격력 3배!)';
    } else {
      stanceEl.textContent = `${this.run.subclassObj.icon} ${this.run.subclassObj.name.split(' ')[0]}`;
    }

    document.getElementById('player-avatar-box').innerHTML = ch.avatarSvg;
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
    if (this.combat.player.strength > 0) pBuffs.push(`⚔️ 힘 +${this.combat.player.strength}`);
    if (this.combat.player.dexterity > 0) pBuffs.push(`🛡️ 민첩 +${this.combat.player.dexterity}`);
    if (this.combat.player.metallicize > 0) pBuffs.push(`✨ 수호오라 +${this.combat.player.metallicize}`);
    if (this.combat.player.weak > 0) pBuffs.push(`💫 약화 ${this.combat.player.weak}`);
    if (this.combat.player.vuln > 0) pBuffs.push(`💔 취약 ${this.combat.player.vuln}`);
    document.getElementById('player-buffs-row').innerHTML = pBuffs
      .map(b => `<span class="buff-pill">${b}</span>`)
      .join('');

    const compZone = document.getElementById('companion-zone');
    let compHtml = '';
    if (this.combat.summon.active) {
      const s = this.combat.summon;
      const sPct = Math.round((s.hp / s.maxHp) * 100);
      compHtml += `
        <div class="summon-unit-card" title="슬더스 2 소환수 시스템: 플레이어가 받을 피해를 대신 방어하고 매 턴 종료 시 적을 자동 공격합니다!">
          <div class="summon-title">${s.name}</div>
          <div style="font-size:0.75rem; color:#dfe6e9; margin-bottom:5px;">⚔️ 협공 위력: ${s.atk} | 🛡️ 피해 대신 흡수</div>
          <div class="hp-bar-outer" style="height:15px;">
            <div class="hp-bar-fill" style="width:${sPct}%; background:linear-gradient(90deg, #9b59b6, #e056fd);"></div>
            <span class="hp-bar-text">${s.hp} / ${s.maxHp}</span>
          </div>
        </div>
      `;
    }
    if (this.combat.drones > 0) {
      const dmgPerDrone = 5 + Math.max(0, this.combat.player.strength) + (this.run.permStats.summonBoost || 0);
      compHtml += `<div class="drone-orbs-container">`;
      for (let i = 0; i < this.combat.drones; i++) {
        compHtml += `
          <div class="drone-orb-chip">
            🔮 비전/수호령 구체 #${i + 1} (⚡${dmgPerDrone} / 🛡️3)
          </div>
        `;
      }
      compHtml += `</div>`;
    }
    compZone.innerHTML = compHtml;

    const enZone = document.getElementById('enemies-zone');
    enZone.innerHTML = '';
    this.combat.enemies.forEach((en, idx) => {
      if (en.hp <= 0) return;
      const isTargeted = idx === this.combat.targetIndex;
      const move = en.moves[en.moveIndex % en.moves.length];
      const enPct = Math.max(0, Math.min(100, (en.hp / en.maxHp) * 100));

      const enBuffs = [];
      if (en.enragePerTurn > 0) enBuffs.push(`💢 격노 +${en.enragePerTurn}/턴`);
      if (en.strength > 0) enBuffs.push(`⚔️ 힘 +${en.strength}`);
      if (en.poison > 0) enBuffs.push(`🧪 맹독/저주 ${en.poison}`);
      if (en.weak > 0) enBuffs.push(`💫 약화 ${en.weak}`);
      if (en.vuln > 0) enBuffs.push(`💔 취약 ${en.vuln}`);

      // Compute Live Scaled Intent Text (STS2 style accurate damage prediction!)
      let liveIntentDesc = move.desc;
      if (move.dmg) {
        let calcDmg = move.dmg + en.strength;
        if (en.weak > 0) calcDmg = Math.floor(calcDmg * 0.75);
        if (this.combat.player.vuln > 0) calcDmg = Math.floor(calcDmg * 1.5);
        if (this.combat.stance === 'wrath') calcDmg = Math.floor(calcDmg * 2);
        const hitsStr = move.hits ? ` x ${move.hits}` : '';
        const debuffPart = move.desc.includes('+') ? ' + ' + move.desc.split('+').slice(1).join('+').trim() : '';
        liveIntentDesc = `⚔️ 피해 ${calcDmg}${hitsStr}${debuffPart}`;
      } else if (move.block) {
        liveIntentDesc = `🛡️ 방어도 ${move.block}${move.str ? ` + 힘 +${move.str}` : ''}`;
      }

      const enCard = document.createElement('div');
      enCard.className = `unit-card enemy-unit ${isTargeted ? 'targeted' : ''}`;
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
      enZone.appendChild(enCard);
    });

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
    handEl.innerHTML = '';
    this.combat.hand.forEach((cardInst, idx) => {
      const cardEl = this.createCardElement(cardInst, () => this.playCardFromHand(idx));
      const tpl = GAME_DATA.cards[cardInst.id];
      if (this.combat.energy < tpl.cost) {
        cardEl.classList.add('unplayable');
      }
      handEl.appendChild(cardEl);
    });

    this.updateTopHud();
  },

  createCardElement(cardInst, onClickFn) {
    const tpl = GAME_DATA.cards[cardInst.id];
    const rarity = tpl.rarity || 'common';
    const el = document.createElement('div');
    el.className = `game-card type-${tpl.type} rarity-${rarity} ${cardInst.upgraded ? 'upgraded' : ''}`;
    if (onClickFn) el.onclick = onClickFn;

    const rarityLabels = {
      basic: '일반',
      common: '일반',
      uncommon: '고급',
      rare: '희귀',
      legendary: '전설'
    };
    const rarityKor = rarityLabels[rarity] || '일반';

    const typeKor = tpl.type === 'attack' ? '⚔️공격' : tpl.type === 'skill' ? '🛡️스킬' : '⚡지속';
    const iconArt =
      rarity === 'legendary'
        ? '👑'
        : tpl.type === 'attack'
        ? '⚔️'
        : tpl.addDrone
        ? '🔮'
        : tpl.summonHeal
        ? '🐾'
        : tpl.stance
        ? '✨'
        : '🛡️';

    // Show whether card is Shared (공용 4종) or Subclass Exclusive (하위직업 10종)
    let originLabel = '공용 카드';
    if (tpl.subclassId && tpl.subclassId !== 'shared') {
      const ch = GAME_DATA.characters[tpl.classId];
      const subObj = ch && ch.subclasses ? ch.subclasses.find(s => s.id === tpl.subclassId) : null;
      originLabel = subObj ? `${subObj.icon} ${subObj.name.split(' ')[0]} 전용` : '하위직업 전용';
    } else {
      originLabel = '💠 클래스 공용';
    }

    let mutHtml = '';
    if (cardInst.mutation) {
      const mutObj = GAME_DATA.mutations.find(m => m.id === cardInst.mutation);
      if (mutObj) {
        mutHtml = `<div class="card-mutation-badge" style="border-color:${mutObj.badgeColor}">${mutObj.name}</div>`;
      }
    }

    el.innerHTML = `
      <div>
        <div class="card-top-row">
          <div class="card-cost-orb">${tpl.cost}</div>
          <span class="rarity-pill r-${rarity}">${rarityKor}</span>
          <span class="card-type-tag">${typeKor}</span>
        </div>
        <div class="card-title">${tpl.name}${cardInst.upgraded ? ' +' : ''}</div>
        <div class="card-art-banner">${iconArt}</div>
      </div>
      <div class="card-desc">${this.formatCardDesc(cardInst)}</div>
      <div class="card-subclass-origin">${originLabel}</div>
      ${mutHtml}
    `;
    return el;
  },

  logCombat(msg) {
    if (this.combat) this.combat.log = msg;
  },

  // --------------------------------------------------------------------------
  // POST-COMBAT REWARDS, REST, SHOP & D20 EVENTS
  // Filters rewards by the active Subclass's 10 cards + Class's 4 shared cards
  // and weights by Rarity: 일반(common), 고급(uncommon), 희귀(rare), 전설(legendary)
  // --------------------------------------------------------------------------
  pickRewardCards(count = 3, encounterType = 'combat') {
    const activePool = this.getActiveSubclassCardPool(this.run.charId, this.run.subclassId);
    const byRarity = {
      common: activePool.filter(id => GAME_DATA.cards[id].rarity === 'common'),
      uncommon: activePool.filter(id => GAME_DATA.cards[id].rarity === 'uncommon'),
      rare: activePool.filter(id => GAME_DATA.cards[id].rarity === 'rare'),
      legendary: activePool.filter(id => GAME_DATA.cards[id].rarity === 'legendary')
    };

    const pickedIds = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      let targetPool = byRarity.common;

      if (encounterType === 'boss') {
        // Boss rewards guarantee Legendary or Rare!
        targetPool = i === 0 || roll < 45 ? byRarity.legendary : byRarity.rare;
      } else if (encounterType === 'elite' || encounterType === 'midboss') {
        if (roll < 18) targetPool = byRarity.legendary;
        else if (roll < 55) targetPool = byRarity.rare;
        else targetPool = byRarity.uncommon;
      } else {
        // Normal combat: Slay the Spire 2 style rarity distribution
        const stageBonus = this.run.stage * 0.4 + (this.run.act - 1) * 3;
        if (roll < 4 + stageBonus * 0.25) targetPool = byRarity.legendary;
        else if (roll < 18 + stageBonus * 0.6) targetPool = byRarity.rare;
        else if (roll < 55 + stageBonus * 0.5) targetPool = byRarity.uncommon;
        else targetPool = byRarity.common;
      }

      const available = targetPool.filter(id => !pickedIds.includes(id));
      const poolToUse = available.length > 0 ? available : activePool.filter(id => !pickedIds.includes(id));
      if (poolToUse.length > 0) {
        const chosen = poolToUse[Math.floor(Math.random() * poolToUse.length)];
        pickedIds.push(chosen);
      }
    }
    return pickedIds.map(cid => this.createCardInstance(cid));
  },

  openRewardModal(summaryText) {
    const modal = document.getElementById('modal-reward');
    document.getElementById('reward-summary-text').textContent = summaryText;

    const encType = this.combat ? this.combat.encounterType : 'combat';
    const choices = this.pickRewardCards(3, encType);

    const row = document.getElementById('reward-cards-row');
    row.innerHTML = '';
    choices.forEach(cInst => {
      const cardEl = this.createCardElement(cInst, () => {
        this.run.deck.push(cInst);
        modal.classList.add('hidden');
        this.leaveNodeToMap();
      });
      row.appendChild(cardEl);
    });

    modal.classList.remove('hidden');
  },

  skipCardReward() {
    this.run.gold += 25;
    document.getElementById('modal-reward').classList.add('hidden');
    this.leaveNodeToMap();
  },

  doRestHeal() {
    const heal = Math.round(this.run.maxHp * 0.35);
    this.run.hp = Math.min(this.run.maxHp, this.run.hp + heal);
    this.gainRunExp(60);
    this.leaveNodeToMap();
  },

  openUpgradeModal(isMutation = false) {
    this.deckModalMode = isMutation ? 'mutate' : 'upgrade';
    this.openDeckModal(this.deckModalMode);
  },

  openRemoveCardModal(cost = 0) {
    if (cost > 0 && this.run.gold < cost) {
      alert('금화(GP)가 부족합니다!');
      return;
    }
    this.pendingShopCost = cost;
    this.openDeckModal('remove');
  },

  shopMutateService(cost = 55) {
    if (this.run.gold < cost) {
      alert('금화(GP)가 부족합니다!');
      return;
    }
    this.pendingShopCost = cost;
    this.openDeckModal('shop_mutate');
  },

  openDeckModal(mode = 'all') {
    if (!this.run) return;
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
      titleEl.textContent = '🔮 고대 비전 룬을 각인할 카드를 선택하세요';
      subEl.textContent = '선택한 카드에 [산성/가속/방호/흡혈] 룬 속성과 강화(+)가 동시에 부여됩니다!';
    } else if (mode === 'remove') {
      titleEl.textContent = '🗑️ 덱에서 영구 제거할 카드를 선택하세요';
      subEl.textContent = '기본 타격/방어 카드를 제거하면 핵심 카드를 더 자주 뽑을 수 있습니다.';
    } else {
      titleEl.textContent = `🎴 카드 목록 (${cardsToShow.length}장)`;
      subEl.textContent = '현재 보유 중인 카드와 강화/룬 각인 상태를 확인합니다.';
    }

    cardsToShow.forEach((cInst, idx) => {
      const cardEl = this.createCardElement(cInst, () => {
        if (mode === 'upgrade') {
          cInst.upgraded = true;
          modal.classList.add('hidden');
          this.leaveNodeToMap();
        } else if (mode === 'mutate') {
          const muts = GAME_DATA.mutations;
          cInst.mutation = muts[Math.floor(Math.random() * muts.length)].id;
          cInst.upgraded = true;
          modal.classList.add('hidden');
          this.leaveNodeToMap();
        } else if (mode === 'shop_mutate') {
          this.run.gold -= this.pendingShopCost;
          const muts = GAME_DATA.mutations;
          cInst.mutation = muts[Math.floor(Math.random() * muts.length)].id;
          cInst.upgraded = true;
          modal.classList.add('hidden');
          this.updateTopHud();
        } else if (mode === 'remove') {
          if (this.run.deck.length <= 5) {
            alert('덱에는 최소 5장의 카드가 남아있어야 합니다!');
            return;
          }
          if (this.pendingShopCost > 0) this.run.gold -= this.pendingShopCost;
          this.run.deck.splice(idx, 1);
          modal.classList.add('hidden');
          this.updateTopHud();
        }
      });
      grid.appendChild(cardEl);
    });

    modal.classList.remove('hidden');
  },

  closeDeckModal() {
    document.getElementById('modal-deck').classList.add('hidden');
  },

  openShopScreen() {
    this.switchScreen('screen-shop');
    const activePool = this.getActiveSubclassCardPool(this.run.charId, this.run.subclassId);
    const pool = [...activePool];
    this.shuffleArray(pool);

    const cardsRow = document.getElementById('shop-cards-row');
    cardsRow.innerHTML = '';

    pool.slice(0, 4).forEach(cid => {
      const cInst = this.createCardInstance(cid);
      const tpl = GAME_DATA.cards[cid];
      const price =
        tpl.rarity === 'legendary' ? 140 : tpl.rarity === 'rare' ? 95 : tpl.rarity === 'uncommon' ? 65 : 45;

      const wrap = document.createElement('div');
      wrap.className = 'shop-item-wrap';
      const cardEl = this.createCardElement(cInst, null);

      const btn = document.createElement('button');
      btn.className = 'shop-buy-btn';
      btn.textContent = `🪙 ${price} GP 구매`;
      btn.onclick = () => {
        if (this.run.gold < price) {
          alert('금화(GP)가 부족합니다!');
          return;
        }
        this.run.gold -= price;
        this.run.deck.push(cInst);
        btn.disabled = true;
        btn.textContent = '✔ 구매 완료';
        this.updateTopHud();
      };

      wrap.appendChild(cardEl);
      wrap.appendChild(btn);
      cardsRow.appendChild(wrap);
    });

    const itemsRow = document.getElementById('shop-items-row');
    itemsRow.innerHTML = '';

    const shopRelics = Object.values(GAME_DATA.relics)
      .filter(r => r.price && !this.run.relics.includes(r.id))
      .slice(0, 2);

    shopRelics.forEach(r => {
      const box = document.createElement('div');
      box.className = 'mech-box';
      box.style.width = '220px';
      box.innerHTML = `
        <h4>${r.icon} ${r.name}</h4>
        <p style="margin-bottom:8px;">${r.desc}</p>
        <button class="shop-buy-btn">🪙 ${r.price} GP 구매</button>
      `;
      itemsRow.appendChild(box);
      box.querySelector('button').onclick = e => {
        if (this.run.gold < r.price) {
          alert('금화(GP)가 부족합니다!');
          return;
        }
        this.run.gold -= r.price;
        this.run.relics.push(r.id);
        e.target.disabled = true;
        e.target.textContent = '✔ 장착 완료';
        this.updateTopHud();
      };
    });

    Object.values(GAME_DATA.potions)
      .slice(0, 2)
      .forEach(p => {
        const box = document.createElement('div');
        box.className = 'mech-box';
        box.style.width = '200px';
        box.innerHTML = `
          <h4>${p.icon} ${p.name}</h4>
          <p style="margin-bottom:8px;">${p.desc}</p>
          <button class="shop-buy-btn">🪙 ${p.price} GP 구매</button>
        `;
        itemsRow.appendChild(box);
        box.querySelector('button').onclick = e => {
          if (this.run.gold < p.price) {
            alert('금화(GP)가 부족합니다!');
            return;
          }
          this.run.gold -= p.price;
          this.run.potions.push(p.id);
          e.target.disabled = true;
          e.target.textContent = '✔ 획득 완료';
          this.updateTopHud();
        };
      });
  },

  openEventScreen() {
    this.switchScreen('screen-event');
    const ev = GAME_DATA.events[this.run.stage % GAME_DATA.events.length];
    document.getElementById('event-title').textContent = ev.title;
    document.getElementById('event-desc').textContent = ev.desc;

    const choicesBox = document.getElementById('event-choices');
    choicesBox.innerHTML = '';

    ev.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'event-choice-btn';
      btn.textContent = ch.label;
      btn.onclick = () => this.resolveEventChoice(ch.effect);
      choicesBox.appendChild(btn);
    });
  },

  resolveEventChoice(effect) {
    if (effect === 'd20_arcana') {
      const roll = Math.floor(Math.random() * 20) + 1 + 4; // D20 + proficiency
      const muts = GAME_DATA.mutations;
      for (let i = 0; i < Math.min(2, this.run.deck.length); i++) {
        const card = this.run.deck[this.run.deck.length - 1 - i];
        card.upgraded = true;
        card.mutation = muts[i % muts.length].id;
      }
      this.gainRunExp(120);
      alert(`🎲 D20 비전 판정 결과: [${roll}] (대성공!)\n덱의 카드 2장에 강화(+)+룬 각인이 부여되고 경험치 +120 EXP를 획득했습니다!`);
    } else if (effect === 'full_heal_maxhp') {
      this.run.maxHp += 12;
      this.run.hp = this.run.maxHp;
    } else if (effect === 'scrap_and_relic') {
      this.run.gold += 120;
      this.run.hp = Math.max(1, this.run.hp - 8);
      this.grantRandomRelic();
    } else if (effect === 'gain_exp_sp_gems') {
      this.gainRunExp(150);
      this.run.sp += 2;
      this.meta.gems += 250;
      this.saveMeta();
    } else if (effect === 'remove_and_rare') {
      const basicIdx = this.run.deck.findIndex(c => GAME_DATA.cards[c.id].rarity === 'common');
      if (basicIdx >= 0) this.run.deck.splice(basicIdx, 1);
      const activePool = this.getActiveSubclassCardPool(this.run.charId, this.run.subclassId);
      const rareOrLeg = activePool.filter(
        id => GAME_DATA.cards[id].rarity === 'rare' || GAME_DATA.cards[id].rarity === 'legendary'
      );
      const rareCardId = rareOrLeg.length > 0 ? rareOrLeg[0] : activePool[activePool.length - 1];
      this.run.deck.push(this.createCardInstance(rareCardId));
    } else if (effect === 'free_relic') {
      this.grantRandomRelic();
      this.run.hp = Math.min(this.run.maxHp, this.run.hp + 20);
    }

    this.leaveNodeToMap();
  },

  showGameOverModal(isVictory) {
    const modal = document.getElementById('modal-gameover');
    const title = document.getElementById('gameover-title');
    const desc = document.getElementById('gameover-desc');

    if (isVictory) {
      title.textContent = '👑 언더마운틴 5계층(150 스테이지) & 오색룡의 여신 티아마트 토벌 완료!';
      desc.textContent =
        '포가튼 렐름의 전설이 되었습니다! 클리어 보상으로 차원 마석 +800개와 승급 조각 +25개가 지급되었습니다. 다른 클래스와 32가지 하위 직업 빌드로 새로운 모험에 도전해보세요!';
    } else {
      title.textContent = `💀 모험 실패 (제${this.run.act}계층 Stage ${this.run.stage}/30)`;
      desc.textContent =
        '미궁에서 쓰러졌지만 원정 보상으로 마석 +150개와 승급 조각 +5개를 획득했습니다! 워터딥 주점 로비에서 클래스 레벨업, C→B→A→S 티어 승급, 마법 무구(+강화), D&D 특성(Feat)을 강화해 재도전하세요!';
      this.meta.gems += 150;
      this.meta.shards[this.run.charId] = (this.meta.shards[this.run.charId] || 0) + 5;
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
