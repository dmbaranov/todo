//if input is empty then button Add should be disabled
//make sort up/down

(function () {
  var ToDo = function () {

    this.model = [];

    this.form = document.querySelector('.task-form');
    this.inputField = document.querySelector('.task-form__text');
    this.todoList = document.querySelector('.table__body');

    this.init();
  }

  ToDo.prototype.init = function() {
    this.form.addEventListener('submit', this.addItem.bind(this), false);
    this.todoList.addEventListener('click', this.onItemClick.bind(this), false);
    this.inputField.addEventListener('keypress', this.changeInputState.bind(this), false);

    document.querySelector('#panel-body__submit').disabled = true;
    this.loadFromStorage();
    this.render();
  }

  ToDo.prototype.addItem = function(e) {
    e.preventDefault();

    var todoText = this.inputField.value;
    var todoItem = {
      'text': todoText
    };

    this.model.push(todoItem);
    this.inputField.value = '';
    this.updateStorage();
    this.render();
  }

  ToDo.prototype.onItemClick = function(e) {
    if(e.target.dataset.type == 'remove') {
      var index = e.target.dataset.index - 1;

      this.model.splice(index, 1);
      this.updateStorage();
      this.render();
    }
    else if(e.target.dataset.type =='up') {
      var index = e.target.dataset.index - 1;
      var nextIndex = index - 1;

      var temp = this.model[index];
      this.model[index] = this.model[nextIndex];
      this.model[nextIndex] = temp;
      this.updateStorage();
      this.render();
    }
    else if(e.target.dataset.type == 'down') {
      var index = e.target.dataset.index - 1;
      var nextIndex = index + 1;

      var temp = this.model[index];
      this.model[index] = this.model[nextIndex];
      this.model[nextIndex] = temp;
      this.updateStorage();
      this.render();
    }
  }

  ToDo.prototype.getItemHtml = function(index, item) {
    var isDisabledUp = '', isDisabledDown = '';

    if(index == 1) {
      isDisabledDown = 'disabled';
    }
    if(index == this.model.length) {
      isDisabledUp = 'disabled'
    }

    var tmpl = '<tr><th>{{index}}</th><td>{{text}}</td><td><button type="button" data-type="down" data-index={{index}} class="btn btn-info" {{disUp}}>&#8595;</button></td><td><button type="button" data-type="up"  data-index={{index}} class="btn btn-info" {{disDown}}>&#8593;</button></td><td><button type="button" data-type="remove" data-index={{index}} class="btn btn-danger">x</button></td></tr>'

    return tmpl.replace(/{{index}}/g, index).replace(/{{text}}/g, item).replace(/{{disUp}}/g, isDisabledUp).replace(/{{disDown}}/g, isDisabledDown);
  }

  ToDo.prototype.changeInputState = function() {
    if(this.inputField.value.length < 0) {
      document.querySelector('#panel-body__submit').disabled = true;
    }
    else {
      document.querySelector('#panel-body__submit').disabled = false;
    }
  }

  ToDo.prototype.render = function() {
    var todoHtml = '';
    for(var i = 0; i < this.model.length; i++) {
      todoHtml += this.getItemHtml(i + 1, this.model[i].text);
    }

    this.todoList.innerHTML = todoHtml;
  }

  ToDo.prototype.loadFromStorage = function() {
    if(typeof(Storage) !== 'undefined') {
      var temp = '';
      for(var i = 0; i < localStorage.length; i++) {
        this.model.push({
          'text': String(localStorage['todoText' + i])
        });
      }
    }
  }

  ToDo.prototype.updateStorage = function() {
    localStorage.clear();
    for(var i = 0; i < this.model.length; i++) {
      localStorage.setItem(('todoText' + i), this.model[i].text);
    }
  }

  window.todo = new ToDo();
})()