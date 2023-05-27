console.log('Hello from contents.js!');

// sendMessage docsDetected is true to background.js.
chrome.runtime.sendMessage({
  docsDetected: true,
});
