// game.js
import * as ui from './ui.js';
import * as bot from './bot.js';
import { activeMonsters } from './data.js';

let isBotRunning = false;
let isPaused = false;
let lastTickTime = 0;
const TICK_INTERVAL = 500; // Bot logic runs twice per second

let lastTime = 0; // For deltaTime calculation

export function startBot() {
    if (!isBotRunning) {
        isBotRunning = true;
        isPaused = false;
        ui.addLog("Bot started.", "success");
    }
}

export function stopBot() {
    if (isBotRunning) {
        isBotRunning = false;
        isPaused = false;
        bot.resetState();
        ui.addLog("Bot stopped.", "error");
    }
}

export function pauseBot() {
    if (!isBotRunning) return;
    isPaused = !isPaused;
    ui.addLog(isPaused ? "Bot paused." : "Bot resumed.", "info");
}

function checkRespawns() {
    const now = Date.now();
    activeMonsters.forEach(monster => {
        if (monster.isDead && now > monster.respawnTime) {
            monster.hp = monster.maxHp;
            monster.isDead = false;
            monster.respawnTime = 0;
            ui.addLog(`${monster.name} has respawned!`, "success");
        }
    });
}

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) || 0;
    lastTime = timestamp;

    if (isBotRunning && !isPaused) {
        bot.updateCharacterMovement(deltaTime);

        if (timestamp - lastTickTime > TICK_INTERVAL) {
            lastTickTime = timestamp;
            checkRespawns();
            bot.run();
        }
    }
    
    // Render UI every frame for smoothness
    ui.renderPlayer();
    ui.updateHUD();
    ui.renderMonsters(activeMonsters);
    ui.renderNPCs();
    ui.renderLoot();
    ui.updateBuffsUI();
    ui.updateQuestLogUI();
    
    requestAnimationFrame(gameLoop);
}

export function startGameLoop() {
    requestAnimationFrame(gameLoop);
}
