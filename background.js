// 函数：打开 Tab Manager 页面
function openTabManager() {
  chrome.tabs.create({ url: 'tab_manager.html' });
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTabs") {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      sendResponse({tabs: tabs});
    });
    return true; // 表示会异步发送响应
  } else if (request.action === "saveTabs") {
    const tabsToClose = request.tabs;
    const tabData = tabsToClose.map(t => ({
      url: t.url,
      title: t.title,
      lastAccessed: Date.now() // 添加 lastAccessed 时间戳
    }));
    
    chrome.storage.local.get({tabGroups: []}).then((result) => {
      const tabGroups = result.tabGroups;
      console.log('---tabGroups:', tabGroups);
      tabGroups.push({
        title: new Date().toLocaleString(),
        tabs: tabData,
        lastModified: Date.now() // 添加 lastModified 时间戳
      });

      // 按 lastModified 时间戳排序标签组
      tabGroups.sort((a, b) => b.lastModified - a.lastModified);

      chrome.storage.local.set({tabGroups: tabGroups}).then(() => {
        chrome.tabs.remove(tabsToClose.map(t => t.id), () => {
          // 在关闭标签页后打开 Tab Manager
          openTabManager();
        });
      });
    });
    return true;
  }
});

// 添加右键菜单项
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openTabManager",
    title: "Open Tab Manager",
    contexts: ["action"]
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openTabManager") {
    openTabManager();
  }
});

// 添加点击扩展图标事件监听
chrome.action.onClicked.addListener((tab) => {
  openTabManager();
});

// // 添加标签页更新监听器
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     updateTabAccessTime(tabId);
//   }
// });

// // 添加标签页激活监听器
// chrome.tabs.onActivated.addListener((activeInfo) => {
//   updateTabAccessTime(activeInfo.tabId);
// });

// // 更新标签页访问时间的函数
// function updateTabAccessTime(tabId) {
//   chrome.storage.local.get({tabGroups: []}).then((result) => {
//     let tabGroups = result.tabGroups;
//     let updated = false;

//     for (let group of tabGroups) {
//       for (let tab of group.tabs) {
//         if (tab.id === tabId) {
//           tab.lastAccessed = Date.now();
//           group.lastModified = Date.now();
//           updated = true;
//           break;
//         }
//       }
//       if (updated) break;
//     }

//     if (updated) {
//       // 重新排序标签组
//       tabGroups.sort((a, b) => b.lastModified - a.lastModified);
//       chrome.storage.local.set({tabGroups: tabGroups});
//     }
//   });
// }