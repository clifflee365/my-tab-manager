document.getElementById('saveTabs').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "getTabs"}, (response) => {
    saveTabs(response.tabs);
  });
});

document.getElementById('saveSelectedTabs').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "getTabs"}, (response) => {
    const selectedTabs = response.tabs.filter(tab => tab.highlighted);
    saveTabs(selectedTabs);
  });
});

function saveTabs(tabs) {
  chrome.runtime.sendMessage({
    action: "saveTabs",
    tabs: tabs
  }, () => {
    window.close(); // 关闭 popup
  });
}