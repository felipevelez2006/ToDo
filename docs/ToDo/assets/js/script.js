// Variables globales
let tasks = [];
let score = 0;

// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const taskList = document.getElementById('taskList');
const scoreElement = document.getElementById('score');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Cargar tareas guardadas en localStorage si existen
  const savedTasks = localStorage.getItem('tasks');
  const savedScore = localStorage.getItem('score');
  
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks(tasks);
  }
  
  if (savedScore) {
    score = parseInt(savedScore);
    scoreElement.textContent = score;
  }
  
  // Event listeners
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  searchBtn.addEventListener('click', searchTasks);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchTasks();
  });
  searchInput.addEventListener('input', (e) => {
    if (e.target.value === '') renderTasks(tasks);
  });
});

// Función para agregar una nueva tarea
function addTask() {
  const taskText = taskInput.value.trim();
  
  if (taskText === '') return;
  
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    date: new Date().toLocaleString()
  };
  
  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks(tasks);
  
  // Limpiar el input
  taskInput.value = '';
  taskInput.focus();
}

// Función para renderizar las tareas en la lista
function renderTasks(tasksToRender) {
  taskList.innerHTML = '';
  
  if (tasksToRender.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'No hay tareas pendientes';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '20px';
    emptyMessage.style.color = '#7f8c8d';
    taskList.appendChild(emptyMessage);
    return;
  }
  
  tasksToRender.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    
    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = task.text;
    
    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');
    
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.addEventListener('click', () => completeTask(task.id));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(deleteBtn);
    
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskActions);
    
    taskList.appendChild(taskItem);
  });
}

// Función para marcar una tarea como completada
function completeTask(id) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1) {
    // Si la tarea no estaba completada, incrementar el puntaje
    if (!tasks[taskIndex].completed) {
      score += 10;
      scoreElement.textContent = score;
      localStorage.setItem('score', score);
      
      // Animación del puntaje
      scoreElement.classList.add('score-animation');
      setTimeout(() => {
        scoreElement.classList.remove('score-animation');
      }, 500);
    }
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasksToLocalStorage();
    renderTasks(tasks);
  }
}

// Función para eliminar una tarea
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToLocalStorage();
  renderTasks(tasks);
}

// Función para buscar tareas
function searchTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  if (searchTerm === '') {
    renderTasks(tasks);
    return;
  }
  
  const filteredTasks = tasks.filter(task => 
    task.text.toLowerCase().includes(searchTerm)
  );
  
  renderTasks(filteredTasks);
}

// Función para guardar tareas en localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}