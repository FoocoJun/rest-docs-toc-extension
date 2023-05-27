// 백그라운드 스크립트 (background.js)

chrome.runtime.onMessage.addListener((req, sender) => {
  if (sender.tab && req.docsDetected) {
    // onMessage with docsDetected set popup with colored icon.
    chrome.browserAction.setIcon({
      tabId: sender.tab.id,
      path: {
        16: `icons/16.png`,
        48: `icons/48.png`,
        128: `icons/128.png`,
      },
    });
    // onMessage with docsDetected set popup with enabled.html.
    // enabled.html "RestDoc is detected on this page."
    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: `enabled.html`,
    });
  }
});
