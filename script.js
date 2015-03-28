var start = function() {
  var newTodoForm = document.getElementById("new-todo-form");
  addEvent(newTodoForm, "submit", submitNewTodo);

  var allCompletedBox = document.getElementById("all-completed");
  addEvent(allCompletedBox, "change", toggleAllCompleted);

  var showAllLink = document.getElementById("show-all");
  addEvent(showAllLink, "click", showAll);

  var showActiveLink = document.getElementById("show-active");
  addEvent(showActiveLink, "click", showActive);

  var showCompletedLink = document.getElementById("show-completed");
  addEvent(showCompletedLink, "click", showCompleted);

  var clearCompletedLink = document.getElementById("clear-completed");
  addEvent(clearCompletedLink, "click", deleteCompleted);

  var todos = localGetTodos() || [];
  var todo;
  for (var idx = 0; idx < todos.length; idx++) {
    todo = todos[idx];
    addTodoDiv(todo.text, todo.isCompleted, idx);
  }

  updateFooter();
};

var updateAllCompletedBox = function() {
  var allCompletedBox = document.getElementById("all-completed");

  var todos = localGetTodos() || [];
  var isAllCompleted = true;

  if (todos.length === 0) isAllCompleted = false;
  for (var idx = 0; idx < todos.length; idx++) {
    if (!todos[idx].isCompleted) {
      isAllCompleted = false;
      break;
    }
  }

  if (isAllCompleted) {
    allCompletedBox.checked = true;
  } else {
    allCompletedBox.checked = false;
  }
};

var submitNewTodo = function(event) {
  event.preventDefault();

  var newTodoText = document.getElementById("new-todo-text");
  if (newTodoText.value !== "") {
    var todos = localGetTodos() || [];

    addTodoDiv(newTodoText.value, false, todos.length);

    todos.push({ text: newTodoText.value, isCompleted: false });
    localSetTodos(todos);

    newTodoText.value = "";
    updateFooter();
  }
}

var addTodoDiv = function(todoText, isCompleted, index) {
  var hiddenSpan = document.createElement("span");
  hiddenSpan.className = "hidden";
  hiddenSpan.innerHTML = index;

  var checkbox = document.createElement("input");
  checkbox.setAttribute('type', "checkbox");

  addEvent(checkbox, "change", submitToggleCompletedState);

  var inputText = document.createElement("input");
  inputText.setAttribute('type', "text");
  inputText.setAttribute('value', todoText);
  inputText.style.display = "none";

  addEvent(inputText, "blur", loseFocus);

  var todoSpan = document.createElement("span");
  todoSpan.innerHTML = todoText;
  todoSpan.className = "todo-text vertical-center";

  if (isCompleted) {
    checkbox.setAttribute('checked', "checked");
    todoSpan.className = todoSpan.className + " completed";
  }

  var deleteLink = document.createElement("a");
  deleteLink.innerHTML = "✖";

  var deleteSpan = document.createElement("span");
  deleteSpan.className = "todo-delete vertical-center";
  deleteSpan.appendChild(deleteLink);

  addEvent(deleteSpan, "click", submitDelete);

  var form = document.createElement("form");
  form.setAttribute('draggable', "true");
  form.appendChild(hiddenSpan);
  form.appendChild(checkbox);
  form.appendChild(inputText);
  form.appendChild(todoSpan);
  form.appendChild(deleteSpan);

  addEvent(form, "dblclick", editTodo);
  addEvent(form, "submit", submitInEditMode);
  addEvent(form, "mouseover", showDeleteSpan);
  addEvent(form, "mouseout", hideDeleteSpan);
  addEvent(form, "dragstart", dragStart);
  addEvent(form, "dragover", dragOver);
  addEvent(form, "drop", dragDrop);
  var section = document.getElementById("section");
  section.appendChild(form);
};

var toggleAllCompleted = function() {
  var allCompletedBox = document.getElementById("all-completed");
  var todos = localGetTodos() || [];

  if (allCompletedBox.checked) {
    for (var i = 0; i < todos.length; i++) {
      if (!todos[i].isCompleted) toggleCompletedState(i);
    }
  } else {
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].isCompleted) toggleCompletedState(i);
    }
  }
};

var submitToggleCompletedState = function() {
  toggleCompletedState(this.parentNode.firstChild.innerHTML);
};

var toggleCompletedState = function(index) {
  var form = document.getElementById("section").children[index];
  var checkbox = form.children[1];
  var todoText = form.children[3];

  var todos = localGetTodos();
  todos[index].isCompleted = !todos[index].isCompleted;
  if (todos[index].isCompleted) {
    todoText.className = todoText.className + " completed";
    checkbox.checked = true;
  } else {
    todoText.className = "todo-text vertical-center";
    checkbox.checked = false;
  }

  localSetTodos(todos);

  updateFooter();
}

var showDeleteSpan = function() {
  var deleteSpan = this.lastChild;
  if (this.className === "edit-mode") {
    deleteSpan.style.display = "none";
  } else {
    deleteSpan.style.display = "inline";
  }
};

var hideDeleteSpan = function() {
  var deleteSpan = this.lastChild;
  deleteSpan.style.display = "none";
};

var editTodo = function() {
  removeEvent(this, "dblclick", editTodo);
  this.setAttribute('draggable', "false");

  this.children[4].style.display = "none";
  this.children[3].style.display = "none";
  var inputText = this.children[2];

  inputText.style.display = "inline";
  this.className = "edit-mode";
  inputText.focus();
};

var submitInEditMode = function(event) {
  event.preventDefault();
  saveChanges(this);
};

var loseFocus = function() {
  saveChanges(this.parentNode);
};

var saveChanges = function(form) {
  var inputText = form.children[2]
  inputText.style.display = "none";

  var index = form.firstChild.innerHTML;
  var todos = localGetTodos();
  todos[index].text = inputText.value;
  localSetTodos(todos);

  form.children[4].style.display = "inline";

  var todoSpan =  form.children[3]
  todoSpan.innerHTML = inputText.value;
  todoSpan.style.display = "inline";

  addEvent(form, "dblclick", editTodo);
  form.className = "";
  form.setAttribute('draggable', "true");
};

var submitDelete = function() {
  var index = parseInt(this.parentNode.firstChild.innerHTML);

  deleteTodoDiv(index);
  localDeleteTodo(index);
  updateFooter();
};

var deleteTodoDiv = function(idx) {
  var index = parseInt(idx);
  var section = document.getElementById("section");
  var form = section.children[index];

  while(form.firstChild) form.removeChild(form.firstChild);
  section.removeChild(form);

  var todos = localGetTodos();
  for (var i = index+1; i < todos.length; i++) {
    section.children[i-1].children[0].innerHTML = (i-1);
  }
};

var deleteCompleted = function() {
  var todos = localGetTodos();

  for (var i = 0; i < todos.length; i++) {
    if (todos[i].isCompleted) {
      deleteTodoDiv(i);
      localDeleteTodo(i);
      todos = localGetTodos();
      i--;
    }
  }
};

var localSetTodos = function(todosArray) {
  if (typeof(Storage) !== "undefined") {
    return localStorage.todosArray = JSON.stringify(todosArray);
  }
};

var localGetTodos = function() {
  if (typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem("todosArray"));
  }
};

var localDeleteTodo = function(idx) {
  var index = parseInt(idx);
  var todos = localGetTodos();
  var newTodos = [];

  for (var i = 0; i < index; i++) newTodos.push(todos[i]);
  for (var i = index+1; i < todos.length; i++) {
    newTodos.push(todos[i]);
  }

  localSetTodos(newTodos);
};

var updateFooter = function() {
  var itemCountSpan = document.getElementById("item-count");
  var clearCompletedSpan = document.getElementById("clear-completed");
  var todos = localGetTodos() || [];
  var completedCount = 0;

  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i];
    if (todo.isCompleted === true) completedCount++;
  }

  if (completedCount === 0) {
    clearCompletedSpan.style.display = "none";
  } else {
    clearCompletedSpan.style.display = "inline";
  }

  var itemCount = (todos.length - completedCount);
  if (itemCount === 1) {
    itemCountSpan.innerHTML = itemCount.toString() + " item left";
  } else {
    itemCountSpan.innerHTML = itemCount.toString() + " items left";
  }

  updateAllCompletedBox();
};

var showAll = function() {
  var section = document.getElementById("section");
  var todos = localGetTodos() || [];

  for (var i = 0; i < todos.length; i++)
  {
    section.children[i].style.display = "block";
  }

  document.getElementById("show-all").className = "active";
  document.getElementById("show-active").className = "";
  document.getElementById("show-completed").className = "";
};

var showActive = function() {
  var section = document.getElementById("section");
  var todos = localGetTodos() || [];

  for (var i = 0; i < todos.length; i++)
    if (todos[i].isCompleted) {
      section.children[i].style.display = "none";
    } else {
      section.children[i].style.display = "block";
    }

  document.getElementById("show-all").className = "";
  document.getElementById("show-active").className = "active";
  document.getElementById("show-completed").className = "";
};

var showCompleted = function() {
  var section = document.getElementById("section");
  var todos = localGetTodos() || [];

  for (var i = 0; i < todos.length; i++)
    if (todos[i].isCompleted) {
      section.children[i].style.display = "block";
    } else {
      section.children[i].style.display = "none";
    }

  document.getElementById("show-all").className = "";
  document.getElementById("show-active").className = "";
  document.getElementById("show-completed").className = "active";
};

var dragStart = function(event) {
  event.dataTransfer.setData("index", this.children[0].innerHTML);
  event.dataTransfer.effectAllowed = "move";
};

var dragOver = function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

var dragDrop = function(event) {
  event.preventDefault();

  var todos = localGetTodos();

  var sourceIndex = event.dataTransfer.getData("index");
  var destIndex = this.children[0].innerHTML;

  sourceTodo = todos[sourceIndex];
  todos[sourceIndex] = todos[destIndex];
  todos[destIndex] = sourceTodo;

  localSetTodos(todos);

  updateTodoDivOrder(sourceIndex);
  updateTodoDivOrder(destIndex);
};

var updateTodoDivOrder = function(index) {
  var todos = localGetTodos();
  var todoText = todos[index].text;

  var form = document.getElementById("section").children[index];
  var checkbox = form.children[1];
  var inputText = form.children[2];
  var spanText = form.children[3];

  checkbox.checked = todos[index].isCompleted;
  inputText.setAttribute('value', todoText);
  spanText.innerHTML = todoText;
  spanText.className = "todo-text vertical-center";
  if (todos[index].isCompleted) {
    spanText.className = spanText.className + " completed";
  }
};

// Generic helper functions

var addEvent = function(element, event, listener, useCapture) {
  var capture = useCapture || false;

  if (element.addEventListener) {
    element.addEventListener(event, listener, useCapture);
  } else if (element.attachEvent) {
    element.attachEvent("on" + event, listener);
  }
};

var removeEvent = function(element, event, listener, useCapture) {
  var capture = useCapture || false;

  if (element.removeEventListener) {
    element.removeEventListener(event, listener, useCapture);
  } else if (element.detachEvent) {
    element.detachEvent("on" + event, listener);
  }
};

start();

