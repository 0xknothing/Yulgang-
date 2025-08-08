// settingsController.js
import { settings } from './data.js';

const autoBuffCheckbox = document.getElementById('setting-auto-buff');
const autoPickupCheckbox = document.getElementById('setting-auto-pickup');
const hpPotSlider = document.getElementById('setting-hp-pot');
const mpPotSlider = document.getElementById('setting-mp-pot');
const hpPotValueSpan = document.getElementById('hp-pot-value');
const mpPotValueSpan = document.getElementById('mp-pot-value');

export function initializeSettingsUI() {
    autoBuffCheckbox.checked = settings.autoBuff.enabled;
    autoPickupCheckbox.checked = settings.autoPickup.enabled;

    const hpThresholdPercent = settings.autoPot.hpThreshold * 100;
    const mpThresholdPercent = settings.autoPot.mpThreshold * 100;

    hpPotSlider.value = hpThresholdPercent;
    hpPotValueSpan.textContent = Math.round(hpThresholdPercent);

    mpPotSlider.value = mpThresholdPercent;
    mpPotValueSpan.textContent = Math.round(mpThresholdPercent);
}

export function setupSettingListeners() {
    autoBuffCheckbox.addEventListener('change', (e) => {
        settings.autoBuff.enabled = e.target.checked;
    });

    autoPickupCheckbox.addEventListener('change', (e) => {
        settings.autoPickup.enabled = e.target.checked;
    });

    hpPotSlider.addEventListener('input', (e) => {
        const percentage = parseInt(e.target.value);
        hpPotValueSpan.textContent = percentage;
        settings.autoPot.hpThreshold = percentage / 100;
    });

    mpPotSlider.addEventListener('input', (e) => {
        const percentage = parseInt(e.target.value);
        mpPotValueSpan.textContent = percentage;
        settings.autoPot.mpThreshold = percentage / 100;
    });
}
