// --- Definição da Classe Tarefa (Task) ---
class Task {
    constructor(description) {
        this.description = description;
        this.isCompleted = false;
        this.id = Date.now();
    }

    toggleCompletion() {
        this.isCompleted = !this.isCompleted;
    }
}

// --- Definição da Classe TaskListManager ---
class TaskListManager {
    constructor() {
        // Obter referências aos elementos HTML
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskListElement = document.getElementById('task-list');
        this.themeToggleBtn = document.getElementById('theme-toggle-btn'); // Referência ao botão de tema

        this.tasks = [];

        this.loadTasks();
        this.loadTheme(); // Carrega o tema salvo no localStorage
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.addTask();
            }
        });
        // Ouvinte de evento para o botão de tema
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    isTaskDuplicate(description) {
        return this.tasks.some(task => task.description.toLowerCase() === description.toLowerCase());
    }

    addTask() {
        const description = this.taskInput.value.trim();

        if (description === '') {
            alert('Por favor, digite uma tarefa!');
            return;
        }

        if (this.isTaskDuplicate(description)) {
            alert('Essa tarefa já existe na sua lista! Por favor, insira um nome diferente.');
            this.taskInput.focus();
            return;
        }

        const newTask = new Task(description);
        this.tasks.push(newTask);

        this.saveTasks();
        this.renderTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTaskCompletion(id) {
        const taskToToggle = this.tasks.find(task => task.id === id);
        if (taskToToggle) {
            taskToToggle.toggleCompletion();
            this.saveTasks();
            this.renderTasks();
        }
    }

    renderTasks() {
        this.taskListElement.innerHTML = '';

        this.tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');

            if (task.isCompleted) {
                listItem.classList.add('completed');
            }

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.description;
            listItem.appendChild(taskTextSpan);

            const buttonGroup = document.createElement('div');
            buttonGroup.classList.add('task-buttons');

            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.isCompleted ? 'Desfazer' : 'Completar';
            completeBtn.classList.add('complete-btn');
            completeBtn.addEventListener('click', () => this.toggleTaskCompletion(task.id));
            buttonGroup.appendChild(completeBtn);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => this.editTask(task.id)); // taskTextSpan não é necessário mais aqui
            buttonGroup.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => this.removeTask(task.id));
            buttonGroup.appendChild(deleteBtn);

            listItem.appendChild(buttonGroup);
            this.taskListElement.appendChild(listItem);
        });
    }

    // Método para editar uma tarefa
    editTask(id) { // Removido taskTextSpanElement do parâmetro
        const taskToEdit = this.tasks.find(task => task.id === id);
        if (!taskToEdit) return;

        let newDescription = prompt('Editar tarefa:', taskToEdit.description);

        if (newDescription === null) {
            return;
        }

        newDescription = newDescription.trim();

        if (newDescription === '') {
            alert('O nome da tarefa não pode ser vazio!');
            return;
        }

        const isDuplicate = this.tasks.some(task => 
            task.id !== id && task.description.toLowerCase() === newDescription.toLowerCase()
        );

        if (isDuplicate) {
            alert('Essa tarefa já existe na sua lista! Por favor, insira um nome diferente.');
            return;
        }

        taskToEdit.description = newDescription;
        this.saveTasks();
        this.renderTasks();
    }

    // MÉTODOS ABAIXO DEVEM ESTAR DENTRO DA CLASSE TaskListManager
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasksFromStorage = localStorage.getItem('tasks');
        if (tasksFromStorage) {
            this.tasks = JSON.parse(tasksFromStorage).map(task => {
                const newTask = new Task(task.description);
                newTask.isCompleted = task.isCompleted;
                newTask.id = task.id;
                return newTask;
            });
            this.renderTasks();
        }
    }

    // Método para alternar o tema
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.themeToggleBtn.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
    }

    // Carrega o tema salvo do localStorage ao iniciar
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeToggleBtn.textContent = 'Modo Claro';
        } else {
            this.themeToggleBtn.textContent = 'Modo Escuro';
        }
    }
} // <--- ESTA CHAVE ESTAVA FALTANDO OU ESTAVA NO LUGAR ERRADO!

// --- Ponto de Entrada da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    new TaskListManager();
});