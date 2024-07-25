function renderTabGroups() {
  chrome.storage.local.get({tabGroups: []}).then((result) => {
      const tabGroupsElement = document.getElementById('tab-groups');
      tabGroupsElement.innerHTML = '';
      
      result.tabGroups.forEach((group, groupIndex) => {
          const groupElement = document.createElement('div');
          groupElement.className = 'tab-group';
          
          const headerElement = document.createElement('div');
          headerElement.className = 'tab-group-header';
          
          const titleElement = document.createElement('h2');
          titleElement.className = 'tab-group-title';
          titleElement.textContent = group.title;
          headerElement.appendChild(titleElement);
          
          const editButton = document.createElement('button');
          editButton.className = 'edit-button';
          editButton.textContent = 'Edit';
          editButton.onclick = () => editGroupTitle(groupIndex);
          headerElement.appendChild(editButton);
          
          groupElement.appendChild(headerElement);
          
          const tabListElement = document.createElement('div');
          tabListElement.className = 'tab-list';
          
          group.tabs.forEach(tab => {
              const tabElement = document.createElement('a');
              tabElement.className = 'tab-item';
              tabElement.href = tab.url;
              tabElement.textContent = tab.title;
              tabElement.target = '_blank';
              tabListElement.appendChild(tabElement);
          });
          
          groupElement.appendChild(tabListElement);
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