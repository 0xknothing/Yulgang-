// bot.js
import * as ui from './ui.js';
import * as web3 from './web3.js';
import { settings, lootOnGround, quests, character, npcs, activeMonsters, mapGrid, GRID_SIZE } from './data.js';

let botState = 'IDLE';
let currentTarget = null;

const grid = new PF.Grid(mapGrid);
const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });

function calculatePath(startPos, endPos) {
    const startNode = { x: Math.floor(startPos.x / GRID_SIZE), y: Math.floor(startPos.y / GRID_SIZE) };
    const endNode = { x: Math.floor(endPos.x / GRID_SIZE), y: Math.floor(endPos.y / GRID_SIZE) };
    const gridClone = grid.clone();
    const path = finder.findPath(startNode.x, startNode.y, endNode.x, endNode.y, gridClone);
    return path.map(p => ({ x: p[0] * GRID_SIZE + GRID_SIZE / 2, y: p[1] * GRID_SIZE + GRID_SIZE / 2 }));
}

export function updateCharacterMovement(deltaTime) {
    if (character.path.length === 0) return;
    const targetPos = character.path[0];
    const distance = getDistance(character.position, targetPos);
    
    if (distance < 5) {
        character.path.shift();
        if (character.path.length === 0) {
            if (botState === 'MOVING_TO_ATTACK') botState = 'ATTACKING';
            if (botState === 'MOVING_TO_LOOT') botState = 'LOOTING';
        }
        return;
    }

    const direction = { x: targetPos.x - character.position.x, y: targetPos.y - character.position.y };
    const normalizedDir = { x: direction.x / distance, y: direction.y / distance };
    const moveAmount = character.speed * (deltaTime / 1000);
    character.position.x += normalizedDir.x * moveAmount;
    character.position.y += normalizedDir.y * moveAmount;
}

function useItem(itemName) {
    if (character.inventory[itemName] > 0) {
        character.inventory[itemName]--;
        if (itemName === 'HP Potion') character.hp = Math.min(character.maxHp, character.hp + 50);
        if (itemName === 'MP Potion') character.mp = Math.min(character.maxMp, character.mp + 30);
        ui.addLog(`Used ${itemName}.`, 'info');
        ui.updateInventoryUI();
        return true;
    }
    return false;
}

function castBuff(skill) {
    if (character.mp >= skill.mpCost) {
        character.mp -= skill.mpCost;
        skill.lastUsed = Date.now();
        ui.addLog(`Casting ${skill.name}.`, 'info');
        return true;
    }
    return false;
}

function generateLoot(monster) {
    monster.drops.forEach(drop => {
        if (Math.random() < drop.chance) {
            if (drop.itemName === 'RARE_NFT_DROP') {
                web3.simulateNftDrop(monster);
            } else {
                lootOnGround.push({ id: `loot-${Date.now()}-${Math.random()}`, itemName: drop.itemName, position: { ...monster.position } });
                ui.addLog(`${monster.name} dropped ${drop.itemName}.`, 'item');
            }
        }
    });
}

function pickupLoot(loot) {
    if (character.inventory[loot.itemName]) character.inventory[loot.itemName]++;
    else character.inventory[loot.itemName] = 1;
    
    const lootIndex = lootOnGround.findIndex(item => item.id === loot.id);
    if (lootIndex > -1) lootOnGround.splice(lootIndex, 1);
    
    ui.addLog(`Picked up ${loot.itemName}.`, 'item');
    ui.updateInventoryUI();
}

export function run() {
    if (character.hp === 0) { botState = 'DEAD'; return; }
    if (character.hp / character.maxHp < settings.autoPot.hpThreshold) if (useItem('HP Potion')) return;
    if (character.mp / character.maxMp < settings.autoPot.mpThreshold) if (useItem('MP Potion')) return;
    
    if (settings.autoBuff.enabled) {
        const now = Date.now();
        for (const skill of character.skills) if (now - skill.lastUsed > skill.duration) if (castBuff(skill)) return;
    }

    switch (botState) {
        case 'IDLE':
            if (settings.autoPickup.enabled) {
                const loot = findNearestLoot(character, lootOnGround);
                if (loot) { currentTarget = loot; character.path = calculatePath(character.position, loot.position); botState = 'MOVING_TO_LOOT'; break; }
            }
            const monster = findNearestMonster(character, activeMonsters);
            if (monster) { currentTarget = monster; character.path = calculatePath(character.position, monster.position); botState = 'MOVING_TO_ATTACK'; break; }
            break;

        case 'MOVING_TO_ATTACK':
        case 'MOVING_TO_LOOT':
            if (!currentTarget || (currentTarget.isDead && botState === 'MOVING_TO_ATTACK')) resetState();
            break;

        case 'ATTACKING':
            if (!currentTarget || currentTarget.hp <= 0) { resetState(); break; }
            if (getDistance(character.position, currentTarget.position) <= character.attackRange) {
                const damage = 15;
                currentTarget.hp -= damage;
                ui.showDamageText(damage, currentTarget.position);
                if (currentTarget.hp <= 0) {
                    currentTarget.isDead = true;
                    currentTarget.respawnTime = Date.now() + currentTarget.respawnDelay;
                    ui.addLog(`${currentTarget.name} will respawn in ${currentTarget.respawnDelay / 1000}s.`, 'info');
                    character.exp += currentTarget.exp;
                    web3.calculateClaimableKnot(currentTarget.exp);
                    if (character.activeQuestId && quests[character.activeQuestId].objective.targetName === currentTarget.name) { character.questProgress.killCount++; ui.updateQuestLogUI(); }
                    generateLoot(currentTarget);
                    resetState();
                }
            } else { character.path = calculatePath(character.position, currentTarget.position); botState = 'MOVING_TO_ATTACK'; }
            break;

        case 'LOOTING':
            if (currentTarget) pickupLoot(currentTarget);
            resetState();
            break;
    }

    activeMonsters.forEach(m => {
        if (!m.isDead && getDistance(character.position, m.position) < 150) {
            character.hp -= m.attack * (500 / 1000); // Damage per tick
            if (character.hp < 0) character.hp = 0;
            ui.showDamageText(m.attack, character.position, true);
        }
    });
}

export function resetState() {
    botState = 'IDLE';
    currentTarget = null;
    character.path = [];
}

function getDistance(pos1, pos2) { const dx = pos1.x - pos2.x, dy = pos1.y - pos2.y; return Math.sqrt(dx * dx + dy * dy); }
function findNearestLoot(char, loots) { return loots.reduce((nearest, loot) => { const dist = getDistance(char.position, loot.position); return dist < 50 && dist < nearest.dist ? { item: loot, dist } : nearest; }, { item: null, dist: Infinity }).item; }
function findNearestMonster(char, monsters) { return monsters.filter(m => !m.isDead).reduce((nearest, monster) => { const dist = getDistance(char.position, monster.position); return dist < (char.attackRange + 150) && dist < nearest.dist ? { item: monster, dist } : nearest; }, { item: null, dist: Infinity }).item; }

window.acceptQuest = (quest) => { character.activeQuestId = quest.id; character.questProgress.killCount = 0; ui.addLog(`Quest accepted: ${quest.title}`, 'success'); document.getElementById('npc-window').style.display = 'none'; ui.updateQuestLogUI(); };
window.completeQuest = (quest) => { character.exp += quest.rewards.exp; character.inventory.Gold += quest.rewards.gold; character.activeQuestId = null; ui.addLog(`Quest completed! Gained ${quest.rewards.exp} EXP & ${quest.rewards.gold} Gold.`, 'success'); document.getElementById('npc-window').style.display = 'none'; ui.updateQuestLogUI(); };
