const html = document.documentElement;
const container = document.querySelector('.container');
const modeBtn = document.querySelector('.mode-btn');
const formInput = document.querySelector('.form__input');
const list = document.querySelector('.list');
const listContent = document.querySelector('.list__content');
const listFilter = document.getElementsByClassName('list__detail-filter');
const listQty = document.querySelector('.list__detail-qty');

const listClear = document.querySelector('.list__detail-clear');
const hint = document.querySelector('.hint');

const mql = window.matchMedia('(max-width: 600px)');

let todo = [];

// function used to change the position of the item filter component
const filterPos = () => {
  if (listFilter) {
    listFilter[0]?.parentNode.removeChild(listFilter[0]);
  }

  if (mql.matches) {
    hint.insertAdjacentHTML(
      'beforebegin',
      `
      <div class="list__detail-filter mt pd bs br">
        <button class="list__detail-filter-item list__detail-filter--all">All</button>
        <button class="list__detail-filter-item list__detail-filter--active">Active</button>
        <button class="list__detail-filter-item list__detail-filter--completed">Completed</button>
      </div>
      `
    );
  }

  if (!mql.matches) {
    listQty.insertAdjacentHTML(
      'afterend',
      `
    <div class="list__detail-filter">
            <button class="list__detail-filter-item list__detail-filter--all">All</button>
            <button class="list__detail-filter-item list__detail-filter--active">Active</button>
            <button class="list__detail-filter-item list__detail-filter--completed">Completed</button>
          </div>
    `
    );
  }
};

// Render the list items
const renderList = (todo) => {
  // clear list
  listContent.innerHTML = '';

  if (todo.length === 0) {
    const emptyHTML = `<p class="list__empty">list is empty!</p>`;

    listContent.insertAdjacentHTML('afterbegin', emptyHTML);
  } else {
    todo.forEach((item) => {
      const itemHTML = `
        <li class="list__item"  id=${item.id}>
          <button class="list__item-checkbox ${item.completed ? 'list__item-checkbox--completed' : ''}"></button>
          <span class="list__item-text ${item.completed ? 'list-text-completed' : ''}">${item.text}</span>
          <button class="list__item-delete">
            <img src="./images/icon-cross.svg" alt="delete icon" />
          </button>
        </li>
      `;

      listContent.insertAdjacentHTML('afterbegin', itemHTML);
    });
  }

  listQty.textContent = `${todo.length} items left`;
};

// complete list item
const completeListItem = (e) => {
  if (e.target.classList.contains('list__item-checkbox')) {
    const itemId = +e.target.closest('.list__item').id;

    // Find the item by id and toggle its completed status
    const todoItem = todo.find((item) => item.id === itemId);
    if (todoItem) {
      todoItem.completed = !todoItem.completed;
    }

    renderList(todo);
  }
};

// delete item
const deleteListItem = (e) => {
  if (e.target.closest('.list__item-delete')) {
    const deletedItemId = +e.target.closest('.list__item').id;
    const deletedItemIndex = todo.findIndex((item) => item.id === deletedItemId);
    todo.splice(deletedItemIndex, 1);
    renderList(todo);
  }
};

// filter todo list
const filterList = (e) => {
  const listAll = document.querySelector('.list__detail-filter--all');
  const listActive = document.querySelector('.list__detail-filter--active');
  const listCompleted = document.querySelector('.list__detail-filter--completed');

  // render all todo list items
  if (e.target === listAll) {
    renderList(todo);
  }

  // render active todo list items
  if (e.target === listActive) {
    const activeTodo = todo.filter((item) => !item.completed);
    renderList(activeTodo);
  }

  // render completed todo list items
  if (e.target === listCompleted) {
    const completedTodo = todo.filter((item) => item.completed);
    renderList(completedTodo);
  }
};

// clear list item
const clearList = () => {
  todo = [];
  renderList(todo);
};

// store input value into the todo list array
const storeInput = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const inputValue = formInput.value.trim();
    if (inputValue) {
      todo.push({ text: inputValue, completed: false, id: todo.length + 1 });
      formInput.value = '';
      renderList(todo);
      console.log(todo);
    }
  }
};

// toggle mode
const toggleMode = () => {
  html.classList.toggle('dark');
  const img = modeBtn.querySelector('img');
  if (html.classList.contains('dark')) {
    img.src = './images/icon-sun.svg';
    img.alt = 'sun icon';
  } else {
    img.src = './images/icon-moon.svg';
    img.alt = 'moon icon';
  }
};

// listen for the change event when the specific screen size change
mql.addEventListener('change', () => {
  filterPos();
});

// mode change
modeBtn.addEventListener('click', toggleMode);

// store input value into todo array when press enter
formInput.addEventListener('keydown', storeInput);

// complete item
listContent.addEventListener('click', completeListItem);

// delte list item
listContent.addEventListener('click', deleteListItem);

// filter list item depending on completed or not
container.addEventListener('click', filterList);

// clear list
listClear.addEventListener('click', clearList);

// initialization when the page loads
const init = () => {
  filterPos();
  renderList(todo);
};

init();
