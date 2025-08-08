// ui.js
import { character, npcs, quests, lootOnGround } from './data.js';

const gameWorld = document.getElementById('game-world');

export function updateHUD() {
    document.getElementById('char-name').innerText = character.name;
    document.getElementById('char-level').innerText = character.level;
    
    const hpPercent = (character.hp / character.maxHp) * 100;
    document.getElementById('hp-bar').style.width = `${hpPercent}%`;
    document.getElementById('hp-value').innerText = `${Math.round(character.hp)}/${character.maxHp}`;
    
    const mpPercent = (character.mp / character.maxMp) * 100;
    document.getElementById('mp-bar').style.width = `${mpPercent}%`;
    document.getElementById('mp-value').innerText = `${Math.round(character.mp)}/${character.maxMp}`;

    const expPercent = (character.exp / character.expToLevelUp) * 100;
    document.getElementById('exp-bar').style.width = `${expPercent}%`;
    document.getElementById('exp-value').innerText = `${expPercent.toFixed(1)}%`;
}

export function addLog(message, type = 'info') {
    const logContent = document.getElementById('log-content');
    const p = document.createElement('p');
    p.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
    p.className = `log-${type}`;
    logContent.appendChild(p);
    logContent.scrollTop = logContent.scrollHeight;
}

export function makeDraggable(windowElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = windowElement.querySelector(".window-header");
    if (header) header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        windowElement.style.top = `${windowElement.offsetTop - pos2}px`;
        windowElement.style.left = `${windowElement.offsetLeft - pos1}px`;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

export function renderPlayer() {
    const playerDiv = document.getElementById('player');
    if(playerDiv) {
        playerDiv.style.left = `${character.position.x}px`;
        playerDiv.style.top = `${character.position.y}px`;
    }
}

export function renderMonsters(monsters) {
    const existingMonsterIds = new Set(Array.from(gameWorld.querySelectorAll('.monster')).map(div => div.id));

    monsters.forEach(monster => {
        existingMonsterIds.delete(monster.id);

        if (monster.isDead) {
            document.getElementById(monster.id)?.remove();
            return;
        }

        let monsterDiv = document.getElementById(monster.id);
        if (!monsterDiv) {
            monsterDiv = document.createElement('div');
            monsterDiv.className = 'monster';
            monsterDiv.id = monster.id;
            const hpBarDiv = document.createElement('div');
            hpBarDiv.className = 'monster-hp';
            monsterDiv.appendChild(hpBarDiv);
            gameWorld.appendChild(monsterDiv);
        }
        
        monsterDiv.style.left = `${monster.position.x}px`;
        monsterDiv.style.top = `${monster.position.y}px`;
        
        const hpPercent = (monster.hp / monster.maxHp) * 100;
        monsterDiv.querySelector('.monster-hp').style.setProperty('--hp-percent', `${hpPercent}%`);
    });
    
    existingMonsterIds.forEach(id => document.getElementById(id)?.remove());
}

export function renderNPCs() {
    npcs.forEach(npc => {
        let npcDiv = document.getElementById(npc.id);
        if (!npcDiv) {
            npcDiv = document.createElement('div');
            npcDiv.id = npc.id;
            npcDiv.className = 'npc-marker';
            npcDiv.onclick = () => openNpcWindow(npc);
            gameWorld.appendChild(npcDiv);
        }
        npcDiv.style.left = `${npc.position.x}px`;
        npcDiv.style.top = `${npc.position.y}px`;
    });
}

export function renderLoot() {
    document.querySelectorAll('.loot-item').forEach(el => el.remove());
    lootOnGround.forEach(loot => {
        let lootDiv = document.getElementById(loot.id);
        if (!lootDiv) {
            lootDiv = document.createElement('div');
            lootDiv.id = loot.id;
            lootDiv.className = 'loot-item';
            gameWorld.appendChild(lootDiv);
        }
        lootDiv.style.left = `${loot.position.x}px`;
        lootDiv.style.top = `${loot.position.y}px`;
    });
}

export function showDamageText(text, position, isPlayerDamage = false) {
    const damageDiv = document.createElement('span');
    damageDiv.className = 'damage-text';
    if (isPlayerDamage) damageDiv.classList.add('player-damage');
    damageDiv.textContent = text;
    damageDiv.style.left = `${position.x + 15}px`;
    damageDiv.style.top = `${position.y}px`;
    gameWorld.appendChild(damageDiv);
    setTimeout(() => damageDiv.remove(), 1000);
}

export function updateInventoryUI() {
    const inventoryContent = document.getElementById('inventory-content');
    inventoryContent.innerHTML = '';
    for (const [itemName, count] of Object.entries(character.inventory)) {
        const p = document.createElement('p');
        p.textContent = `${itemName}: ${count}`;
        inventoryContent.appendChild(p);
    }
}

export function updateBuffsUI() {
    const buffsContent = document.getElementById('buffs-content');
    buffsContent.innerHTML = '';
    const now = Date.now();
    character.skills.forEach(skill => {
        const timeLeft = (skill.lastUsed + skill.duration) - now;
        if (timeLeft > 0) {
            const p = document.createElement('p');
            p.textContent = `${skill.name}: ${(timeLeft / 1000).toFixed(0)}s`;
            buffsContent.appendChild(p);
        }
    });
}

export function updateQuestLogUI() {
    const content = document.getElementById('quest-log-content');
    if (character.activeQuestId) {
        const quest = quests[character.activeQuestId];
        content.innerHTML = `<strong>${quest.title}</strong><p>${quest.objective.targetName}: ${character.questProgress.killCount} / ${quest.objective.amount}</p>`;
    } else {
        content.innerHTML = `<p>No active quest.</p>`;
    }
}

export function openNpcWindow(npc) {
    const windowEl = document.getElementById('npc-window');
    const header = document.getElementById('npc-window-header');
    const content = document.getElementById('npc-window-content');
    
    header.textContent = npc.name;
    content.innerHTML = '';

    if (npc.type === 'Quest') {
        const quest = Object.values(quests).find(q => q.npcId === npc.id);
        if (character.activeQuestId === null) {
            content.innerHTML = `<p>${quest.description}</p><button id="accept-quest-btn">Accept Quest</button>`;
            document.getElementById('accept-quest-btn').onclick = () => window.acceptQuest(quest);
        } else if (character.activeQuestId === quest.id) {
            if (character.questProgress.killCount >= quest.objective.amount) {
                content.innerHTML = `<p>Thank you for your help!</p><button id="complete-quest-btn">Complete Quest</button>`;
                document.getElementById('complete-quest-btn').onclick = () => window.completeQuest(quest);
            } else {
                content.innerHTML = `<p>You still need to defeat more monsters.</p>`;
            }
        }
    } else if (npc.type === 'Shop') {
        content.innerHTML = `<p>Welcome! Potions for sale. (Shop logic not implemented)</p>`;
    }
    windowEl.style.display = 'block';
}

export function updateWalletUI(wallet, claimable) {
    const infoDiv = document.getElementById('wallet-info');
    const connectBtn = document.getElementById('connect-wallet-btn');

    if (wallet.address) {
        infoDiv.style.display = 'block';
        connectBtn.style.display = 'none';
        document.getElementById('wallet-address').textContent = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;
        document.getElementById('knot-balance').textContent = wallet.knotBalance.toFixed(2);
        document.getElementById('claimable-knot').textContent = claimable.toFixed(2);
        
        const nftList = document.getElementById('nft-list');
        nftList.innerHTML = '';
        wallet.nfts.forEach(nft => {
            const div = document.createElement('div');
            div.className = 'nft-item';
            div.textContent = nft.name;
            nftList.appendChild(div);
        });
    } else {
        infoDiv.style.display = 'none';
        connectBtn.style.display = 'block';
    }
}
