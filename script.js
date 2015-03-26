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

var addTodo = function(event) {
  event.preventDefault();

  var newTodoText = document.getElementById("new-todo-text");
  if (newTodoText.value === "") return;

  var checkbox = document.createElement("input");
  checkbox.setAttribute('type', "checkbox");

  var inputText = document.createElement("input");
  inputText.setAttribute('type', "text");
  inputText.setAttribute('value', newTodoText.value);
  inputText.style.display = "none";

  addEvent(inputText, "blur", loseFocus);

  var todoSpan = document.createElement("span");
  todoSpan.innerHTML = newTodoText.value;

  var form = document.createElement("form");
  form.setAttribute('class', "table-cell-wrapper");
  form.appendChild(checkbox);
  form.appendChild(inputText);
  form.appendChild(todoSpan);

  addEvent(form, "dblclick", editTodo);
  addEvent(form, "submit", submitInEditMode);

  var divTableWrapper = document.createElement("div");
  divTableWrapper.setAttribute('class', "table-wrapper");
  divTableWrapper.appendChild(form);

  var section = document.getElementById("section");
  section.appendChild(divTableWrapper);

  newTodoText.value = "";
};

var editTodo = function(event) {
  removeEvent(this, "dblclick", editTodo);

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

  form.appendChild(inputText);
  form.appendChild(todoSpan);

  addEvent(form, "dblclick", editTodo);
};

addEvent(document.getElementById("new-todo-form"), "submit", addTodo);

