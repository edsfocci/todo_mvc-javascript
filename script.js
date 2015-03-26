var start = function() {
  var newTodoForm = document.getElementById("new-todo-form");
  addEvent(newTodoForm, "submit", submitNewTodo);

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

  addEvent(deleteSpan, "click", deleteTodo);

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
  if (deleteSpan.innerHTML === "✖") {
    deleteSpan.style.display = "inline";
  }
};

var hideDeleteSpan = function() {
  var deleteSpan = this.lastChild;
  if (deleteSpan.innerHTML === "✖") {
    deleteSpan.style.display = "none";
  }
};

var editTodo = function(event) {
  removeEvent(this, "dblclick", editTodo);

  this.removeChild(this.lastChild);
  this.removeChild(this.lastChild);
  var inputText = this.removeChild(this.lastChild);

  inputText.style.display = "inline";
  this.appendChild(inputText);
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
  var inputText = form.removeChild(form.lastChild);
  inputText.style.display = "none";

  var todoSpan = document.createElement("span");
  todoSpan.innerHTML = inputText.value;

  var deleteSpan = document.createElement("span");
  deleteSpan.setAttribute('class', "delete");
  deleteSpan.innerHTML = "✖";

  addEvent(deleteSpan, "click", deleteTodo);

  form.appendChild(inputText);
  form.appendChild(todoSpan);
  form.appendChild(deleteSpan);

  addEvent(form, "dblclick", editTodo);
};

var deleteTodo = function() {
  var form = this.parentNode;
  var index = parseInt(form.removeChild(form.firstChild).innerHTML);
  while(form.firstChild) form.removeChild(form.firstChild);

  var containingDiv = form.parentNode;
  containingDiv.removeChild(form);
  var section = containingDiv.parentNode;
  section.removeChild(containingDiv);

  var todos = localGetTodos();
  var newTodos = [];

  for (var i = 0; i < index; i++) newTodos.push(todos[i]);
  for (var i = index+1; i < todos.length; i++) newTodos.push(todos[i]);

  localSetTodos(newTodos);
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

