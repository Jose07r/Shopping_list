const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const ulList = document.getElementById('ul-list');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');
let itemsFromStorage = getItemsFromStorage();

let isEditing = true;

function addItem(e) {
  e.preventDefault();

  let inputValue = itemInput.value;
  //   Validate input
  if (inputValue === '') {
    itemForm.querySelector('.insert-item').classList.add('shown');
    return;
  } else {
    inputValue = inputValue[0].toUpperCase() + inputValue.slice(1);
    itemForm.querySelector('.insert-item').classList.remove('shown');
  }

  function checkDuplicateItem(item) {
    if (itemsFromStorage.includes(item)) {
      itemForm.querySelector('.item-doubled').classList.add('shown');
      return;
    } else {
      itemForm.querySelector('.item-doubled').classList.remove('shown');
      // Add items to localStorage
      addItemToStorage(inputValue);
      displayItems();

      resetUI();
    }
  }

  checkDuplicateItem(inputValue);
}

// Add items to LocalStorage
function addItemToStorage(item) {
  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function displayItems() {
  let items = '';
  for (let i = 0; i < itemsFromStorage.length; i++) {
    items += `
    <li class="list-item">
        <div class="item-display">
          <textarea readonly maxlength="25">${itemsFromStorage[i]}</textarea>
          <div class="item-controls">
            <button class="item-btn edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="item-btn remove-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="edit-controls">
          <button class="item-btn save-btn">
            <i class="fa-solid fa-check"></i>
          </button>

          <button class="item-btn cancel-btn">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </li>
    `;
  }

  ulList.innerHTML = items;

  ulList.addEventListener('click', removeItem);
  editItemListeners();
  resetUI();
}

function getItemsFromStorage() {
  let itemsFromStorage = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : [];

  return itemsFromStorage;
}

// Remove item from DOM
function removeItem(e) {
  if (e.target.classList.contains('remove-btn')) {
    const itemText = e.target
      .closest('li')
      .querySelector('.item-display textarea').value;
    const rmModal = document.querySelector('.modal-container');
    rmModal.innerHTML = `
    <div class="modal-content">
    <img src="./images/alert-icon.svg" alt="Exclamation circle" style="width: clamp(45px, 10vw, 80px);">
    <h2>Are you sure yo want to remove '${itemText}'?</h2>
    <div>
      <button class="remove-btn-confirm">Yes</button>
      <button class="remove-btn-cancel">Cancel</button>
    </div>
  </div>
    `;
    rmModal.style.display = 'flex';

    // To remove item
    rmModal
      .querySelector('.remove-btn-confirm')
      .addEventListener('click', () => {
        rmModal.style.display = 'none';
        setTimeout(() => {
          e.target.closest('li').remove();
          removeItemFromStorage(itemText);
        }, 600);
      });
    // To cancel
    rmModal
      .querySelector('.remove-btn-cancel')
      .addEventListener('click', () => {
        rmModal.style.display = 'none';
      });
  }
}

// Remove item from LocalStorage
function removeItemFromStorage(item) {
  itemsFromStorage = itemsFromStorage.filter((i) => i != item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Create an event listener for each 'edit-btn'
function editItemListeners() {
  const editBtns = document.querySelectorAll('.edit-btn');

  const itemControls = document.querySelectorAll('.item-controls');
  const editControls = document.querySelectorAll('.edit-controls');
  const textInput = document.querySelectorAll('.item-display textarea');

  editBtns.forEach((editBtn, index) => {
    editBtn.addEventListener('click', () => {
      if (isEditing) {
        itemControls[index].style.display = 'none';
        editControls[index].style.display = 'block';
        textInput[index].removeAttribute('readonly');

        isEditing = false;

        // Save button click function
        const saveBtn = editControls[index].querySelector('.save-btn');

        saveBtn.addEventListener('click', () => {
          itemsFromStorage.splice(index, 1, textInput[index].value);
          localStorage.setItem('items', JSON.stringify(itemsFromStorage));

          itemControls[index].style.display = 'flex';
          editControls[index].style.display = 'none';
          textInput[index].setAttribute('readonly', 'true');

          isEditing = true;
        });

        // Cancel button click function
        const cancelBtn = editControls[index].querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
          displayItems();
          isEditing = true;
        });
      }
    });
  });
}

// Clear all list items
function clearAll() {
  const rmModal = document.querySelector('.modal-container');
  rmModal.innerHTML = `
    <div class="modal-content">
    <img src="./images/alert-icon.svg" alt="Exclamation circle" style="width: clamp(45px, 10vw, 80px);">
    <h2>Are you sure yo want to <span style="color: #ff3561bf;">CLEAR ALL</span> the list?</h2>
    <div>
      <button class="remove-btn-confirm">Yes</button>
      <button class="remove-btn-cancel">Cancel</button>
    </div>
  </div>
    `;
  rmModal.style.display = 'flex';

  // To clear list
  rmModal.querySelector('.remove-btn-confirm').addEventListener('click', () => {
    rmModal.style.display = 'none';

    setTimeout(() => {
      while (ulList.firstChild) {
        ulList.removeChild(ulList.firstChild);
      }

      localStorage.removeItem('items');
      itemsFromStorage = getItemsFromStorage();
    }, 600);
    resetUI();
  });
  // To cancel
  rmModal.querySelector('.remove-btn-cancel').addEventListener('click', () => {
    rmModal.style.display = 'none';
  });
}

function resetUI() {
  const listItems = ulList.querySelectorAll('li');
  itemInput.value = '';

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
    const itemName = item
      .querySelector('.item-display textarea')
      .textContent.toLowerCase();

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
  clearBtn.addEventListener('click', clearAll);
  filterInput.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  resetUI();
}

init();
