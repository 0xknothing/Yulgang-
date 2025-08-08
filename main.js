// main.js
import * as ui from './ui.js';
import * as game from './game.js';
import * as web3 from './web3.js';
import { saveGame, loadGame, resetGame } from './saveManager.js';
import { initializeSettingsUI, setupSettingListeners } from './settingsController.js';
import { activeMonsters, lootOnGround } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const isGameLoaded = loadGame();

    initializeSettingsUI();
    setupSettingListeners();
    
    document.querySelectorAll('.draggable-window').forEach(ui.makeDraggable);
    
    if (!isGameLoaded) {
        // Initialize UI only if not loaded from save, as loadGame handles it
        ui.updateHUD();
        ui.updateInventoryUI();
        ui.updateBuffsUI();
        ui.updateQuestLogUI();
        ui.updateWalletUI({ address: null }, 0);
        ui.addLog("ygLight Bot Simulator Initialized.", "success");
        ui.addLog("Welcome! Press 'Start Bot' to begin.", "info");
    }
    
    // Render dynamic elements regardless
    ui.renderPlayer();
    ui.renderMonsters(activeMonsters);
    ui.renderLoot();
    ui.renderNPCs();

    // Setup button listeners
    document.getElementById('start-btn').addEventListener('click', game.startBot);
    document.getElementById('stop-btn').addEventListener('click', game.stopBot);
    document.getElementById('pause-btn').addEventListener('click', game.pauseBot);
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.getElementById('connect-wallet-btn').addEventListener('click', web3.connectWallet);
    document.getElementById('claim-knot-btn').addEventListener('click', web3.claimKnot);
    
    // Start Game Loop
    game.startGameLoop();
    
    // Setup Auto-save
    setInterval(saveGame, 60000);
});
