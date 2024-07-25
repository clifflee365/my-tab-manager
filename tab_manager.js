function renderTabGroups() {
  chrome.storage.local.get({tabGroups: []}).then((result) => {
    const tabGroupsElement = document.getElementById('tab-groups');
    tabGroupsElement.innerHTML = '';
    
    result.tabGroups.forEach((group, groupIndex) => {
      const groupElement = document.createElement('div');
      groupElement.className = 'tab-group';
      
      const titleElement = document.createElement('h2');
      titleElement.textContent = group.title;
      groupElement.appendChild(titleElement);
      
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editGroupTitle(groupIndex);
      groupElement.appendChild(editButton);
      
      group.tabs.forEach(tab => {
        const tabElement = document.createElement('a');
        tabElement.href = tab.url;
        tabElement.textContent = tab.title;
        tabElement.target = '_blank';
        groupElement.appendChild(tabElement);
      });
      
      tabGroupsElement.appendChild(groupElement);
    });
  });
}

function editGroupTitle(groupIndex) {
  const newTitle = prompt('Enter new group title:');
  if (newTitle) {
    chrome.storage.local.get({tabGroups: []}).then((result) => {
      result.tabGroups[groupIndex].title = newTitle;
      chrome.storage.local.set({tabGroups: result.tabGroups}).then(renderTabGroups);
    });
  }
}

renderTabGroups();