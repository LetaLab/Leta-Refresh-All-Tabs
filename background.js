// Service worker - keeps the toolbar icon in sync with the on/off state.
// No other responsibility: no alarms, no network calls, no tab monitoring.
// The reload itself happens entirely in popup.js, since the popup already
// has full access to chrome.tabs and there is no keyboard shortcut or any
// other trigger that would need this file to know about it too.

const ICONS_ON = {
  16: 'icons/icon-16.png',
  32: 'icons/icon-32.png',
  48: 'icons/icon-48.png',
  128: 'icons/icon-128.png'
};

const ICONS_OFF = {
  16: 'icons/icon-16-off.png',
  32: 'icons/icon-32-off.png',
  48: 'icons/icon-48-off.png',
  128: 'icons/icon-128-off.png'
};

function setIcon(enabled) {
  chrome.action.setIcon({ path: enabled ? ICONS_ON : ICONS_OFF });
}

async function refreshIcon() {
  const { enabled } = await chrome.storage.sync.get({ enabled: true });
  setIcon(enabled);
}

chrome.runtime.onInstalled.addListener(refreshIcon);
chrome.runtime.onStartup.addListener(refreshIcon);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    setIcon(changes.enabled.newValue);
  }
});
