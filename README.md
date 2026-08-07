# Leta Refresh All Tabs

<p align="left">
<img src="https://github.com/user-attachments/assets/86829c26-63eb-42f4-80c5-861d47c3982e" alt="OG" width="15%">
</p>

---

<p align="center">
  <em>Hi, I'm Leta - the mascot of all projects under the LetaLab umbrella!</em><br><br>
  <em>Andrzej brought me to life using Inkscape! I am related to Tux!</em><br>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e6230a1e-3fbd-48f7-965c-fdb42e52d370" alt="icon-512" width="220">
</p>

---

**One big button. Every tab, every window, refreshed.**

Some moments call for reloading everything at once: your wifi reconnected, a local dev server
restarted, a browser setting changed, or a dozen tabs just went stale while you were away.
Closing and reopening them isn't the answer, and clicking reload on each one by hand doesn't
scale past a handful of tabs. This extension gives you one big button in the popup that reloads
every open tab in every open browser window in a single click, with three small toggles right
underneath it for the handful of cases that come up often enough to matter.

"Leta Refresh All Tabs" is a small, single-purpose extension for Chrome, Edge, Brave, and other
Chromium-based browsers, and it's part of the LetaLab family of projects - you can find the rest
of them at [https://LetaLab.eu](https://letalab.eu).

Website is created by me and I do everything that is in my limited power to make it [safe and private](https://www.ssllabs.com/ssltest/analyze.html?d=letalab.eu&hideResults=on&latest).

| SSLLabs Server testing results |
|---|
| <a href="https://github.com/user-attachments/assets/9fe4044b-92f6-4de6-9e65-5fbf79fb4df2"><img width="50%" alt="SSLLabs Server testing results" src="https://github.com/user-attachments/assets/9fe4044b-92f6-4de6-9e65-5fbf79fb4df2" /></a> |

![Manifest](https://img.shields.io/badge/Manifest-V3-blue)
![Browsers](https://img.shields.io/badge/Chrome%20%7C%20Edge%20%7C%20Brave%20%7C%20Chromium-supported-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of contents

- [Get the extension](#get-the-extension)
- [Features](#features)
- [How it works](#how-it-works)
- [Permissions](#permissions)
- [Privacy and security](#privacy-and-security)
- [Known issues and support](#known-issues-and-support)
- [Directory structure](#directory-structure)
- [License](#license)
- [Credits](#credits)

## Get the extension

Not yet published. Once the Chrome Web Store listing is live, the link goes here - until then,
you can load it unpacked from the `leta-refresh-all-tabs/` folder in this repo: open
`chrome://extensions`, turn on Developer mode, and choose "Load unpacked".

## Features

- One big button on the popup - click it, every tab in every open window reloads
- Three toggles right under the button: reload the window you're in, reload the other
  (unfocused) windows, and bypass cache for a harder reload, the same as Ctrl+Shift+R
- Nothing else to configure - no separate settings page, no accounts, no onboarding
- A simple ON/OFF toggle in the header lets you pause the extension without uninstalling
  anything - the toolbar icon changes color to match, so you can tell the state at a glance
- Every toggle is saved instantly through `chrome.storage.sync` and stays put - no
  re-prompting, no reset on browser restart
- A small link to letalab.eu at the bottom of the popup - just a plain link that opens in a
  new tab, nothing tracking it

## How it works

Reloading a tab does not require reading its content, so this addon needs no content script
and injects nothing into any page at all. The popup itself is already an extension page with
direct access to `chrome.tabs`, so `popup.js` queries every open tab and calls
`tabs.reload()` on the ones the three toggles allow, with no message passing needed.

```text
popup (user clicks the big button)
  -> chrome.storage.sync.get()      reads the three toggles
  -> chrome.tabs.query({})          every tab, every window
  -> chrome.tabs.reload(tab.id)     for each tab the toggles allow
```

`background.js` only keeps the toolbar icon in sync with the enabled/disabled state, the same
minimal pattern used by every other LetaLab addon - no alarms, no tab monitoring, no network
calls, and nothing to do with the reload itself.

## Permissions

| Permission | Why |
|---|---|
| `storage` | Remembers the four toggle states between sessions |

That's genuinely all of it - no `host_permissions`, no `tabs`, no `<all_urls>`, no `cookies`,
no `webRequest`, no `declarativeNetRequest`. Reading whether a tab belongs to the current
window, and reloading it, are both possible without any of those. If a future version ever
needs something new, this table gets updated in the same commit that adds it.

## Privacy and security

- No data collection of any kind - no analytics, no crash reporting, no telemetry, no
  update-check pings. The extension never contacts any server, including one of its own
- Only your own toggle states are ever stored, using the browser's own `chrome.storage.sync`
- No remote code loading - the full source ships inside the installed package, nothing is
  fetched or evaluated at runtime
- No cross-origin requests, and no content script on any page - the extension only reads
  which window a tab belongs to through the browser's own tabs API, never a tab's URL, title,
  or content
- Full details live in the [Privacy Policy](https://letalab.eu/LetaRefreshAllTabs/Privacy_Policy.html), also hosted at [https://LetaLab.eu](https://letalab.eu)

## Known issues and support

None known yet - this is a first release. If something doesn't behave the way it should, open
a thread in [Issues](https://github.com/LetaLab/Leta-Refresh-All-Tabs/issues) and include the
browser console output from the popup if you can, it makes tracking down the problem much
faster.

## Directory structure

```text
├── leta-refresh-all-tabs/
│   ├── manifest.json
│   ├── background.js       service worker - toggles the toolbar icon on enable/disable
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── icons/
│   │   ├── icon-16.png / icon-16-off.png
│   │   ├── icon-32.png / icon-32-off.png
│   │   ├── icon-48.png / icon-48-off.png
│   │   ├── icon-128.png / icon-128-off.png
│   │   ├── Favicon_LetaLab.png
│   │   └── reload-button.png
│   └── LICENSE
├── design/                 Inkscape sources and extra sizes, not shipped with the extension
├── Privacy_Policy.html     source for the page hosted at letalab.eu - not part of the extension
├── style.css               shared across every LetaLab Privacy_Policy.html, copied verbatim
└── README.md               this file - not part of the extension
```

## License

MIT - see [`LICENSE`](leta-refresh-all-tabs/LICENSE)

## Credits

Built by [LetaLab.eu](https://letalab.eu) - a small collection of tools built for actual daily use.
