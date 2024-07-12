document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    // Fetch tasks from API
    fetchTasks();
  
    // Add task event
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = taskInput.value;
      await createTask(title);
      taskInput.value = '';
      fetchTasks();
    });
  
    // Fetch tasks
    async function fetchTasks() {
      const res = await fetch('/api/tasks');
      const tasks = await res.json();
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title;
        if (task.completed) li.classList.add('completed');
        li.addEventListener('click', async () => {
          await updateTask(task._id, { completed: !task.completed });
          fetchTasks();
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
          await deleteTask(task._id);
          fetchTasks();
        });
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    }
  
    // Create task
    async function createTask(title) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
    }
  
    // Update task
    async function updateTask(id, updates) {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    }
  
    // Delete task
    async function deleteTask(id) {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
    }
  });
  