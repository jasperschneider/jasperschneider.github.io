let selectedColor = '#b0b0b0'; // Startfarbe (grau)

document.addEventListener('DOMContentLoaded', () => {
    loadTasks(); // Aufgaben beim Laden der Seite laden
});

function toggleDropdown() {
    document.getElementById('dropdown-content').style.display = 
        document.getElementById('dropdown-content').style.display === 'block' ? 'none' : 'block';
}

function toggleColorDropdown() {
    document.getElementById('color-dropdown-content').style.display = 
        document.getElementById('color-dropdown-content').style.display === 'block' ? 'none' : 'block';
}

function setColor(color) {
    selectedColor = color;
    document.getElementById('color-button').style.backgroundColor = color;
    toggleColorDropdown();
}

function addTask() {
    const taskInput = document.getElementById('task-input').value;
    const dateInput = document.getElementById('date-input').value;

    if (taskInput === '') {
        alert('Bitte gib eine Aufgabe ein!');
        return;
    }

    const task = {
        name: taskInput,
        date: dateInput,
        color: selectedColor
    };

    saveTask(task); // Aufgabe speichern
    renderTask(task); // Aufgabe anzeigen
    sortTasks(); // Aufgaben sortieren

    // Felder zurücksetzen
    document.getElementById('task-input').value = '';
    document.getElementById('date-input').value = '';
}

function calculateDaysLeft(dateString) {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    const timeDiff = selectedDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft > 0 ? `In ${daysLeft} Tagen` : 'Heute';
}

function renderTask(task) {
    const taskList = document.getElementById('task-list');
    const listItem = document.createElement('li');
    listItem.style.backgroundColor = '#555';

    const taskText = document.createElement('span');
    taskText.textContent = task.name;
    
    const taskDate = document.createElement('span');
    taskDate.textContent = calculateDaysLeft(task.date);
    taskDate.classList.add('date');

    const colorCircle = document.createElement('span');
    colorCircle.classList.add('color-btn');
    colorCircle.style.backgroundColor = task.color;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function() {
        deleteTask(task);
        taskList.removeChild(listItem);
    };

    listItem.appendChild(taskText);
    listItem.appendChild(taskDate);
    listItem.appendChild(colorCircle);
    listItem.appendChild(deleteBtn);

    taskList.appendChild(listItem);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
    sortTasks();
}

function deleteTask(taskToDelete) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskToDelete.name || task.date !== taskToDelete.date || task.color !== taskToDelete.color);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function sortTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
        const dateA = a.querySelector('.date').textContent;
        const dateB = b.querySelector('.date').textContent;

        const daysA = parseInt(dateA.replace(/\D/g, '')) || 0;
        const daysB = parseInt(dateB.replace(/\D/g, '')) || 0;

        return daysA - daysB;
    });

    taskList.innerHTML = '';
    tasks.forEach(task => taskList.insertBefore(task, taskList.firstChild)); // Umkehren der Reihenfolge
}
