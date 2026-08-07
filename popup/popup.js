// popup.js
//
// Reads and writes the addon's settings, and runs the reload itself.
// This addon has no content script and no background logic that would
// need the same settings, so everything lives in this one file. Keeps
// one in-memory copy (currentSettings) and serializes writes through
// saveQueue so two quick toggle changes in a row can never race each
// other and silently drop one of them.

const enabledToggle = document.getElementById('enabled');
const activeWindowToggle = document.getElementById('reloadActiveWindow');
const inactiveWindowsToggle = document.getElementById('reloadInactiveWindows');
const bypassCacheToggle = document.getElementById('bypassCache');
const reloadButton = document.getElementById('reload');
const status = document.getElementById('status');

let statusTimer = null;

const DEFAULTS = {
  enabled: true,
  reloadActiveWindow: true,
  reloadInactiveWindows: true,
  bypassCache: false
};

let currentSettings = { ...DEFAULTS };
let saveQueue = Promise.resolve();

function showSaved() {
  status.classList.add('visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => status.classList.remove('visible'), 1500);
}

function render(s) {
  enabledToggle.checked = s.enabled;
  activeWindowToggle.checked = s.reloadActiveWindow;
  inactiveWindowsToggle.checked = s.reloadInactiveWindows;
  bypassCacheToggle.checked = s.bypassCache;
  reloadButton.disabled = !s.enabled;
}

function save(partial) {
  currentSettings = { ...currentSettings, ...partial };
  const next = currentSettings;
  saveQueue = saveQueue.then(() => new Promise((resolve) => {
    chrome.storage.sync.set(next, () => {
      showSaved();
      resolve();
    });
  }));
  return saveQueue;
}

chrome.storage.sync.get(DEFAULTS, (data) => {
  currentSettings = data;
  render(currentSettings);
});

enabledToggle.addEventListener('change', () => {
  reloadButton.disabled = !enabledToggle.checked;
  save({ enabled: enabledToggle.checked });
});

activeWindowToggle.addEventListener('change', () => {
  save({ reloadActiveWindow: activeWindowToggle.checked });
});

inactiveWindowsToggle.addEventListener('change', () => {
  save({ reloadInactiveWindows: inactiveWindowsToggle.checked });
});

bypassCacheToggle.addEventListener('change', () => {
  save({ bypassCache: bypassCacheToggle.checked });
});

// Reloads every tab in every window the current toggles allow. This is
// a one-off action, not a stored setting, so it does not go through the
// save queue above - it just reads whatever the queue has already
// written into currentSettings.
async function reloadAllTabs() {
  const settings = currentSettings;

  // getCurrent() resolves to the window the popup is attached to.
  // Chrome's own docs note this can, in rare cases, have no resolvable
  // window, so it is wrapped defensively rather than trusted outright.
  let currentWindow = null;
  try {
    currentWindow = (await chrome.windows.getCurrent()) || null;
  } catch (err) {
    currentWindow = null;
  }

  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (typeof tab.id !== 'number') {
      continue; // Devtools panels and similar have no reloadable tab id.
    }

    const allowed = currentWindow
      ? (tab.windowId === currentWindow.id ? settings.reloadActiveWindow : settings.reloadInactiveWindows)
      : (settings.reloadActiveWindow || settings.reloadInactiveWindows);

    if (!allowed) {
      continue;
    }

    try {
      await chrome.tabs.reload(tab.id, { bypassCache: settings.bypassCache });
    } catch (err) {
      // Tab most likely closed between query() and reload() - not worth
      // surfacing to the user.
    }
  }
}

reloadButton.addEventListener('click', async () => {
  // Disabled for the duration of the call so a second click mid-reload
  // can't fire a second pass while the first is still in flight.
  reloadButton.disabled = true;
  await reloadAllTabs();
  reloadButton.disabled = !currentSettings.enabled;
});
