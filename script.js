var start = function() {
  var newTodoForm = document.getElementById("new-todo-form");
  addEvent(newTodoForm, "submit", submitNewTodo);

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
  hiddenSpan.setAttribute('class', "hidden");
  hiddenSpan.innerHTML = index;

  var checkbox = document.createElement("input");
  checkbox.setAttribute('type', "checkbox");

  addEvent(checkbox, "change", toggleCompletedState);

  var inputText = document.createElement("input");
  inputText.setAttribute('type', "text");
  inputText.setAttribute('value', todoText);
  inputText.style.display = "none";

  addEvent(inputText, "blur", loseFocus);

  var todoSpan = document.createElement("span");
  todoSpan.innerHTML = todoText;

  if (isCompleted) {
    checkbox.setAttribute('checked', "checked");
    todoSpan.className = "completed";
  }

  var deleteSpan = document.createElement("span");
  deleteSpan.setAttribute('class', "delete");
  deleteSpan.innerHTML = "✖";

  addEvent(deleteSpan, "click", submitDelete);

  var form = document.createElement("form");
  form.setAttribute('class', "table-cell-wrapper");
  form.appendChild(hiddenSpan);
  form.appendChild(checkbox);
  form.appendChild(inputText);
  form.appendChild(todoSpan);
  form.appendChild(deleteSpan);

  addEvent(form, "dblclick", editTodo);
  addEvent(form, "submit", submitInEditMode);
  addEvent(form, "mouseover", showDeleteSpan);
  addEvent(form, "mouseout", hideDeleteSpan);

  var divTableWrapper = document.createElement("div");
  divTableWrapper.setAttribute('class', "table-wrapper");
  divTableWrapper.setAttribute('draggable', "true");

  addEvent(divTableWrapper, "dragstart", dragStart);
  addEvent(divTableWrapper, "dragover", dragOver);
  addEvent(divTableWrapper, "drop", dragDrop);

  divTableWrapper.appendChild(form);

  var section = document.getElementById("section");
  section.appendChild(divTableWrapper);
};

var toggleCompletedState = function() {
  var index = this.parentNode.firstChild.innerHTML;
  var todoText = this.parentNode.children[3];

  var todos = localGetTodos();
  todos[index].isCompleted = !todos[index].isCompleted;
  if (todos[index].isCompleted) {
    todoText.className = "completed";
  } else {
    todoText.className = "";
  }

  localSetTodos(todos);

  updateFooter();
}

var showDeleteSpan = function() {
  var deleteSpan = this.lastChild;
  if (this.className === "table-cell-wrapper edit-mode") {
    deleteSpan.style.display = "none";
  } else {
    deleteSpan.style.display = "inline";
  }
};

var hideDeleteSpan = function() {
  var deleteSpan = this.lastChild;
  deleteSpan.style.display = "none";
};

var editTodo = function(event) {
  removeEvent(this, "dblclick", editTodo);

  this.children[4].style.display = "none";
  this.children[3].style.display = "none";
  var inputText = this.children[2];

  inputText.style.display = "inline";
  this.className = this.className + " edit-mode";
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
  form.className = "table-cell-wrapper";
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
  var containingDiv = section.children[index];
  var form = containingDiv.children[0];

  while(form.firstChild) form.removeChild(form.firstChild);
  containingDiv.removeChild(form);
  section.removeChild(containingDiv);

  var todos = localGetTodos();
  for (var i = index+1; i < todos.length; i++) {
    section.children[i-1].children[0].children[0].innerHTML = (i-1);
  }
};

var deleteCompleted = function() {
  var section = document.getElementById("section");
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
    return localStorage.setItem("todosArray", JSON.stringify(todosArray));
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
};

var showAll = function() {
  var section = document.getElementById("section");
  var todos = localGetTodos() || [];

  for (var i = 0; i < todos.length; i++)
  {
    section.children[i].style.display = "table";
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
      section.children[i].style.display = "table";
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
      section.children[i].style.display = "table";
    } else {
      section.children[i].style.display = "none";
    }

  document.getElementById("show-all").className = "";
  document.getElementById("show-active").className = "";
  document.getElementById("show-completed").className = "active";
};

var dragStart = function(event) {
  event.dataTransfer.setData("index", this.children[0].children[0].innerHTML);
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
  var destIndex = this.children[0].children[0].innerHTML;
/*
  var sourceText = todos[sourceIndex].text;
  var destText = todos[destIndex].text;
  var source = document.getElementById("section").children[sourceIndex];

  source.children[0].children[2].setAttribute('value', destText);
  source.children[0].children[3].innerHTML = destText;

  this.children[0].children[2].setAttribute('value', sourceText);
  this.children[0].children[3].innerHTML = sourceText;
*/
  sourceTodo = todos[sourceIndex];
  todos[sourceIndex] = todos[destIndex];
  todos[destIndex] = sourceTodo;

  localSetTodos(todos);

  updateTodoDiv(sourceIndex);
  updateTodoDiv(destIndex);
};

var updateTodoDiv = function(index) {
  var todos = localGetTodos();
  var todoText = todos[index].text;

  var form = document.getElementById("section").children[index].children[0];
  var checkbox = form.children[1];
  var inputText = form.children[2];
  var spanText = form.children[3];

  checkbox.checked = todos[index].isCompleted;
  inputText.setAttribute('value', todoText);
  spanText.innerHTML = todoText;
  if (todos[index].isCompleted){
    spanText.className = "completed";
  } else {
    spanText.className = "";
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

