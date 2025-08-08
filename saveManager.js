// saveManager.js
import { character, activeMonsters, lootOnGround, settings } from './data.js';
import { simulatedWallet, claimableKnot } from './web3.js';
import * as ui from './ui.js';

const SAVE_KEY = 'yulgangSaveData_v2';

export function saveGame() {
    try {
        const saveData = {
            character,
            activeMonsters,
            lootOnGround,
            wallet: simulatedWallet,
            claimableKnot,
            settings,
            saveTimestamp: new Date().toISOString()
        };

        const jsonString = JSON.stringify(saveData);
        localStorage.setItem(SAVE_KEY, jsonString);
        ui.addLog('Game Saved!', 'success');

    } catch (error) {
        console.error("Failed to save game:", error);
        ui.addLog('Error: Could not save game.', 'error');
    }
}

export function loadGame() {
    const savedString = localStorage.getItem(SAVE_KEY);
    if (!savedString) {
        return false;
    }

    try {
        const savedData = JSON.parse(savedString);

        Object.assign(character, savedData.character);
        Object.assign(simulatedWallet, savedData.wallet);
        Object.assign(settings, savedData.settings);
        
        activeMonsters.length = 0;
        activeMonsters.push(...savedData.activeMonsters);

        lootOnGround.length = 0;
        lootOnGround.push(...savedData.lootOnGround);

        window.setClaimableKnot(savedData.claimableKnot);

        ui.updateWalletUI(simulatedWallet, savedData.claimableKnot);
        ui.addLog(`Game loaded from ${new Date(savedData.saveTimestamp).toLocaleString()}`, 'success');
        return true;

    } catch (error) {
        console.error("Failed to load game:", error);
        localStorage.removeItem(SAVE_KEY);
        ui.addLog('Error: Save file corrupted. Resetting.', 'error');
        return false;
    }
}

export function resetGame() {
    if (confirm("Are you sure you want to delete all saved data and start over?")) {
        localStorage.removeItem(SAVE_KEY);
        ui.addLog('Save data deleted. Reloading...', 'error');
        setTimeout(() => location.reload(), 500);
    }
}
