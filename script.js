var addText = function(event) {
  event.preventDefault();

  var checkbox = document.createElement("input");
  checkbox.setAttribute('type', "checkbox");

  var inputText = document.createElement("input");
  inputText.setAttribute('type', "text");
  inputText.setAttribute('class', "todo-text");
  inputText.setAttribute('value', newTodoText.value);
  inputText.setAttribute('readonly', "readonly");

  if (inputText.addEventListener) { 
    // For all major browsers, except IE 8 and earlier
    inputText.addEventListener("dblclick", editTodo);
//    inputText.addEventListener("focus", function() { this.blur(); });
  } else if (inputText.attachEvent) {
    // For IE 8 and earlier versions
    inputText.attachEvent("ondblclick", editTodo);
//    inputText.attachEvent("onfocus", function() { this.blur(); });
  }

  var form = document.createElement("form");
  form.appendChild(checkbox);
  form.appendChild(inputText);

  var div = document.createElement("div");
  div.appendChild(form);

  section.appendChild(div);
  
/*  section.innerHTML = section.innerHTML +
    '<div><input type="checkbox" /><input class="todo-text" value="' +
    newTodoText.value + '" disabled /></div>';*/
    newTodoText.value = "";
};

var editTodo = function(event) {
/*  if (this.addEventListener) { 
    // For all major browsers, except IE 8 and earlier
    this.removeEventListener("focus", function() { this.blur(); });
  } else if (this.attachEvent) {
    // For IE 8 and earlier versions
    this.detachEvent("onfocus", function() { this.blur(); });
  }
*/
  this.readOnly = false;
}

var newTodoForm = document.getElementById("new-todo-form");
var newTodoText = document.getElementById("new-todo-text");
var section = document.getElementById("section");

if (newTodoForm.addEventListener) { 
  // For all major browsers, except IE 8 and earlier
  newTodoForm.addEventListener("submit", addText);
} else if (newTodoForm.attachEvent) {
  // For IE 8 and earlier versions
  newTodoForm.attachEvent("onsubmit", addText);
}
