const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const ulList = document.getElementById('list-item');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));

  resetUI();
}

function addItem(e) {
  e.preventDefault();

  const inputValue = itemInput.value;

  //   Validate input
  if (inputValue === '') {
    alert('Please insert item');
    return;
  }

  // Display items in the DOM
  addItemToDOM(inputValue);

  // Add items to localStorage
  addItemToStorage(inputValue);

  resetUI();
}

// To add items in the DOM
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  ulList.appendChild(li);
  itemInput.value = '';
}

function createButton(btnClasses) {
  const button = document.createElement('button');
  button.className = btnClasses;

  function createIcon(iconClasses) {
    const icon = document.createElement('i');
    icon.className = iconClasses;

    button.appendChild(icon);
  }

  createIcon('fa-solid fa-xmark');
  return button;
}

// Add items to LocalStorage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

// Remove item from list
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  }

  resetUI();
}

// Remove item from DOM
function removeItem(item) {
  if (confirm(`Are you sure you want to remove '${item.innerText}'?`)) {
    item.remove();
  }

  removeItemFromStorage(item.innerText);
}

// Remove item from localStorage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i != item);

  // Convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Clear all list items
function clearAll(e) {
  if (
    confirm('Are you sure you want to remove ALL your shopping list items?')
  ) {
    while (ulList.firstChild) {
      ulList.removeChild(ulList.firstChild);
    }

    localStorage.removeItem('items');
  }

  resetUI();
}

function resetUI() {
  const listItems = ulList.querySelectorAll('li');
  if (listItems.length === 0) {
    filterInput.parentElement.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    filterInput.parentElement.style.display = 'block';
    clearBtn.style.display = 'block';
  }
}

// Filter list items
function filterItems(e) {
  const inputText = e.target.value.toLowerCase();
  const listItems = ulList.querySelectorAll('li');

  const filterNoResults = document.getElementById('filterNoResults');
  filterNoResults.style.display = 'none';
  let hasResult = false;

  for (item of listItems) {
    const itemName = item.innerText.toLowerCase();

    if (itemName.includes(inputText)) {
      item.style.display = 'flex';
      hasResult = true;
    } else {
      item.style.display = 'none';
    }
  }

  if (!hasResult) {
    filterNoResults.style.display = 'block';
  }
}

function init() {
  // Event Listeners
  itemForm.addEventListener('submit', addItem);
  ulList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearAll);
  filterInput.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  resetUI();
}

init();
