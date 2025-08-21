document.addEventListener('DOMContentLoaded', function () {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const tasksLeft = document.getElementById('tasks-left');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const loadingSpinner = document.getElementById('loading-spinner');

  let todos = JSON.parse(localStorage.getItem('todos') || '[]');

  function showSpinner() {
    loadingSpinner.classList.remove('d-none');
  }
  function hideSpinner() {
    loadingSpinner.classList.add('d-none');
  }

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';
    let activeCount = 0;
    todos.forEach((todo, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center animate__animated animate__fadeInUp' + (todo.completed ? ' completed' : '');
      li.setAttribute('data-index', idx);
      li.tabIndex = 0;
      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input me-3';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => toggleComplete(idx));
      // Text
      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-outline-secondary btn-sm';
      editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
      editBtn.title = 'Edit';
      editBtn.addEventListener('click', () => editTodo(idx));
      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-outline-danger btn-sm';
      delBtn.innerHTML = '<i class="bi bi-trash"></i>';
      delBtn.title = 'Delete';
      delBtn.addEventListener('click', () => deleteTodo(idx));
      // Append
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
      todoList.appendChild(li);
      if (!todo.completed) activeCount++;
    });
    tasksLeft.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
    clearCompletedBtn.style.display = todos.some(t => t.completed) ? 'inline-block' : 'none';
  }

  function addTodo(text) {
    if (!text.trim()) return;
    showSpinner();
    setTimeout(() => {
      todos.unshift({ text: text.trim(), completed: false });
      saveTodos();
      renderTodos();
      hideSpinner();
    }, 400);
  }

  function toggleComplete(idx) {
    todos[idx].completed = !todos[idx].completed;
    saveTodos();
    renderTodos();
  }

  function deleteTodo(idx) {
    showSpinner();
    setTimeout(() => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
      hideSpinner();
    }, 300);
  }

  function editTodo(idx) {
    const li = todoList.querySelector(`[data-index='${idx}']`);
    const todo = todos[idx];
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'form-control form-control-sm';
    input.style.maxWidth = '70%';
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        finishEdit();
      } else if (e.key === 'Escape') {
        renderTodos();
      }
    });
    function finishEdit() {
      const val = input.value.trim();
      if (val) {
        todos[idx].text = val;
        saveTodos();
      }
      renderTodos();
    }
    li.querySelector('.todo-text').replaceWith(input);
    input.focus();
    input.select();
  }

  todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
  });

  clearCompletedBtn.addEventListener('click', function () {
    showSpinner();
    setTimeout(() => {
      todos = todos.filter(t => !t.completed);
      saveTodos();
      renderTodos();
      hideSpinner();
    }, 400);
  });

  // Initial render
  renderTodos();
});
