// web3.js
import * as ui from './ui.js';

export let simulatedWallet = {
    address: null,
    knotBalance: 0,
    nfts: []
};
export let claimableKnot = 0;

window.setClaimableKnot = (value) => {
    claimableKnot = value;
};

export function connectWallet() {
    if (simulatedWallet.address) return;
    const pseudoAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    simulatedWallet.address = pseudoAddress;
    ui.addLog("Wallet connected (Simulated).", "web3");
    ui.updateWalletUI(simulatedWallet, claimableKnot);
}

export function simulateNftDrop(boss) {
    if (!simulatedWallet.address) {
        ui.addLog("NFT dropped, but no wallet connected!", "error");
        return;
    }
    const newNft = {
        id: `NFT-${Date.now()}`,
        name: `Helm of the ${boss.name}`,
        image: 'some_image_url.png'
    };
    simulatedWallet.nfts.push(newNft);
    ui.addLog(`💥 BOSS NFT DROPPED: ${newNft.name}!`, "web3");
    ui.updateWalletUI(simulatedWallet, claimableKnot);
}

export function calculateClaimableKnot(expGained) {
    claimableKnot += expGained / 100; // 100 EXP = 1 KNOT
    if (simulatedWallet.address) {
        ui.updateWalletUI(simulatedWallet, claimableKnot);
    }
}

export function claimKnot() {
    if (!simulatedWallet.address || claimableKnot <= 0) return;
    simulatedWallet.knotBalance += claimableKnot;
    ui.addLog(`Claimed ${claimableKnot.toFixed(2)} KNOT.`, "web3");
    claimableKnot = 0;
    ui.updateWalletUI(simulatedWallet, claimableKnot);
}
