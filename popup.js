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
  const tabData = tabs.map(t => ({
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
      chrome.tabs.remove(tabs.map(t => t.id));
      window.close();
    });
  });
}