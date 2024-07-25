chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({currentWindow: true}, (tabs) => {
    const tabsToClose = tabs.filter(t => t.highlighted);
    const tabData = tabsToClose.map(t => ({
      url: t.url,
      title: t.title
    }));
    
    chrome.storage.local.get({tabGroups: []}).then((result) => {
      const tabGroups = result.tabGroups;
      tabGroups.push({
        title: new Date().toLocaleString(),
        tabs: tabData
      });
      chrome.storage.local.set({tabGroups: tabGroups}).then(() => {
        chrome.tabs.remove(tabsToClose.map(t => t.id));
      });
    });
  });
});

// 监听来自 popup 或 tab_manager 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTabs") {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      sendResponse({tabs: tabs});
    });
    return true; // 表示会异步发送响应
  }
});