function checkForValidUrl(tabId, changeInfo, tab) {
  // If this is a youtube user video page ..
  if (tab.url.match('/.*youtube.com\/user\/.+\/videos.*')) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);
