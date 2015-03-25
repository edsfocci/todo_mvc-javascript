var addTodo = function(event) {
  event.preventDefault();

  var checkbox = document.createElement("input");
  checkbox.setAttribute('type', "checkbox");

  var inputText = document.createElement("input");
  inputText.setAttribute('type', "text");
  inputText.setAttribute('value', newTodoText.value);
  inputText.style.display = "none";

  var todoSpan = document.createElement("span");
  todoSpan.innerHTML = newTodoText.value;

  var form = document.createElement("form");
  form.setAttribute('class', "table-cell-wrapper");
  form.appendChild(checkbox);
  form.appendChild(inputText);
  form.appendChild(todoSpan);

  if (form.addEventListener) {
    form.addEventListener("dblclick", editTodo);
    form.addEventListener("submit", saveChanges);
  } else if (form.attachEvent) {
    form.attachEvent("ondblclick", editTodo);
    form.attachEvent("onsubmit", saveChanges);
  }

  var divTW = document.createElement("div");
  divTW.setAttribute('class', "table-wrapper");
  divTW.appendChild(form);

  section.appendChild(divTW);

  newTodoText.value = "";
};

var editTodo = function(event) {
  if (this.removeEventListener) {
    this.removeEventListener("dblclick", editTodo);
  } else if (this.detachEvent) {
    this.detachEvent("ondblclick", editTodo);
  }

  this.removeChild(this.lastChild);
  var inputText = this.removeChild(this.lastChild);

  inputText.style.display = "inline";
  this.appendChild(inputText);
  inputText.focus();
}

var saveChanges = function(event) {
  event.preventDefault();

  var inputText = this.removeChild(this.lastChild);
  inputText.style.display = "none";

  var todoSpan = document.createElement("span");
  todoSpan.innerHTML = inputText.value;

  this.appendChild(inputText);
  this.appendChild(todoSpan);

  if (this.addEventListener) {
    this.addEventListener("dblclick", editTodo);
  } else if (this.attachEvent) {
    this.attachEvent("ondblclick", editTodo);
  }
}

var newTodoForm = document.getElementById("new-todo-form");
var newTodoText = document.getElementById("new-todo-text");
var section = document.getElementById("section");

if (newTodoForm.addEventListener) {
  newTodoForm.addEventListener("submit", addTodo);
} else if (newTodoForm.attachEvent) {
  newTodoForm.attachEvent("onsubmit", addTodo);
}
