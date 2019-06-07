'use strict';

/* const STORE = [
  {id: cuid(), name: 'apples', checked: false},
  {id: cuid(), name: 'oranges', checked: false},
  {id: cuid(), name: 'milk', checked: true},
  {id: cuid(), name: 'bread', checked: false}
]; */

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false}
  ],
  hideChecked: false,
  search: ''
};

function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <form id="edit-item-form">
          <label for="edit-item-entry">Edit this item</label>
          <input type="text" name="edit-item-entry" class = "js-edit-item-entry">
          <button type="submit">Edit item</button>
        </form>
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

{/* <form id="js-shopping-list-form">
<label for="shopping-list-entry">Add an item</label>
<input type="text" name="shopping-list-entry" class="js-shopping-list-entry" placeholder="e.g., broccoli">
<button type="submit">Add item</button>
</form> */}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join('');
}

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let filteredItems = STORE.items;
  if (STORE.hideChecked) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  console.log(Boolean(STORE.search));
  if (STORE.search) {
    filteredItems = filteredItems.filter(function(item) {
      return item.name.includes(STORE.search);
    }); 
  }
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log('Toggling checked property for item with id ' + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
    console.log('`handleDeleteItemClicked` ran');
    //access item to be deleted
    const id = getItemIdFromElement(event.currentTarget);
    deleteItem(id);
    // find that item within the data source
    // detele that thang from the data source
    renderShoppingList();
  });
}

//deletes item passed in from STORE.items 
function deleteItem(idNum){
  for (let i = 0; i < STORE.items.length; i++){
    if (STORE.items[i].id === idNum){
      STORE.items.splice(i, 1);
    }
  }
}

//Toggles the STORE.hideChecked property
function toggleHideFilter() {
  STORE.hideChecked = !STORE.hideChecked;
}
  
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    console.log('hide clicked!');
    toggleHideFilter();
    renderShoppingList();
  });
}

//listens for a search term to be typed into search bar
//calls filter function
//renders shopping list

function handleSearch() {
  $('#js-shopping-list-search').submit(function(event) {
    event.preventDefault();
    const searchCrit = $('.js-search-entry').val();
    $('.js-search-entry').val('');
    itemSearch(searchCrit);
    renderShoppingList(); 
  });
}

function itemSearch(crit) {
  STORE.search = crit;
}

function handleClearSearch() {
  $('#js-shopping-list-search').on('click', '.js-clear', function() {
    console.log('clear the search!!!');
    event.preventDefault();
    clearSearch();
    renderShoppingList();
  });
}

function clearSearch() {
  STORE.search = undefined;
}

function handleItemEdit(){
$('#edit-item-form').submit(function(event) {
  event.preventDefault();
  const newName = $('.js-edit-item-entry').val();
  console.log(newName);
  $('.js-edit-item-entry').val('');
  const id = getItemIdFromElement(event.currentTarget);
  console.log(id);
  itemEdit(id, newName);
  renderShoppingList();
//call itemEdit with form input
//render shoppingList()
});
}

function itemEdit(itemID, newName) {
  for (let i = 0; i < STORE.items.length; i++){
    if (STORE.items[i].id === itemID){
      STORE.items[i].name = newName;
    }
  }
}
// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleSearch();
  handleClearSearch();
  handleItemEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);