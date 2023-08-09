const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const listItem = document.getElementById('item-list');

function addItem(e) {
  e.preventDefault();

  const inputValue = itemInput.value;

  //   Validate input
  if (inputValue === '') {
    alert('Please insert item');
    return;
  }

  const li = document.createElement('li');
  li.appendChild(document.createTextNode(inputValue));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  listItem.appendChild(li);
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

// Event Listeners
itemForm.addEventListener('submit', addItem);
