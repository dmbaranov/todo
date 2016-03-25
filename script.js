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
    if(e.target.classList.contains('btn-danger')) {
      var index = e.target.dataset.index - 1;

      this.model.splice(index, 1);
      this.updateStorage();
      this.render();
    }
    else if(e.target.classList.contains('btn-info')) {
      var index = e.target.dataset.index - 1;

      var element = this.model[0];
      this.model[0] = this.model[index];
      this.model[index] = element;
      this.updateStorage();
      this.render();
    }
  }

  ToDo.prototype.getItemHtml = function(index, item) {
    var tmpl = '<tr><th>{{index}}</th><td>{{text}}</td><td><button type="button" data-index={{index}} class="btn btn-info">&#8593;</button></td><td><button type="button" data-index={{index}} class="btn btn-danger">x</button></td></tr>'

    return tmpl.replace(/{{index}}/g, index).replace(/{{text}}/g, item);
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