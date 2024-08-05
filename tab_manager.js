function renderTabGroups() {
  chrome.storage.local.get({ tabGroups: [] }).then((result) => {
    const tabGroupsElement = document.getElementById("tab-groups")
    tabGroupsElement.innerHTML = ""

    result.tabGroups.forEach((group, groupIndex) => {
      const groupElement = document.createElement("div")
      groupElement.className = "tab-group"

      const headerElement = document.createElement("div")
      headerElement.className = "tab-group-header"

      const titleElement = document.createElement("h2")
      titleElement.className = "tab-group-title"
      titleElement.textContent = group.title
      headerElement.appendChild(titleElement)

      const editButton = document.createElement("button")
      editButton.className = "edit-button"
      editButton.textContent = "Edit"
      editButton.onclick = () => editGroupTitle(titleElement, groupIndex)
      headerElement.appendChild(editButton)

      groupElement.appendChild(headerElement)

      const tabListElement = document.createElement("div")
      tabListElement.className = "tab-list"

      group.tabs.forEach((tab, tabIndex) => {
        const tabElement = document.createElement("div")
        tabElement.className = "tab-item"

        const tabLink = document.createElement("a")
        tabLink.href = tab.url
        tabLink.textContent = tab.title
        tabLink.target = "_blank"
        tabElement.appendChild(tabLink)

        const deleteButton = document.createElement("button")
        deleteButton.className = "delete-tab-button"
        deleteButton.textContent = "×"
        deleteButton.onclick = (e) => {
          e.preventDefault()
          deleteTab(groupIndex, tabIndex)
        }
        tabElement.appendChild(deleteButton)

        tabListElement.appendChild(tabElement)
      })

      groupElement.appendChild(tabListElement)
      tabGroupsElement.appendChild(groupElement)
    })
  })
}

function editGroupTitle(titleElement, groupIndex) {
  const currentTitle = titleElement.textContent
  const input = document.createElement("input")
  input.type = "text"
  input.value = currentTitle
  input.className = "edit-title-input"

  titleElement.textContent = ""
  titleElement.appendChild(input)
  input.focus()

  function saveTitle() {
    const newTitle = input.value.trim()
    if (newTitle && newTitle !== currentTitle) {
      chrome.storage.local.get({ tabGroups: [] }).then((result) => {
        result.tabGroups[groupIndex].title = newTitle
        chrome.storage.local.set({ tabGroups: result.tabGroups }).then(() => {
          titleElement.textContent = newTitle
        })
      })
    } else {
      titleElement.textContent = currentTitle
    }
  }

  input.onblur = saveTitle
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      saveTitle()
      input.blur()
    } else if (e.key === "Escape") {
      titleElement.textContent = currentTitle
    }
  }
}

// delete tab
function deleteTab(groupIndex, tabIndex) {
  chrome.storage.local.get({ tabGroups: [] }).then((result) => {
    result.tabGroups[groupIndex].tabs.splice(tabIndex, 1)
    if (result.tabGroups[groupIndex].tabs.length === 0) {
      result.tabGroups.splice(groupIndex, 1)
    }
    chrome.storage.local
      .set({ tabGroups: result.tabGroups })
      .then(renderTabGroups)
  })
}

renderTabGroups()
