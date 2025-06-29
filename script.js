// ... (Classe Task - sem alterações) ...
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
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskListElement = document.getElementById('task-list');
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');

        // NOVO: Referências aos botões de filtro
        this.filterAllBtn = document.getElementById('filter-all-btn');
        this.filterActiveBtn = document.getElementById('filter-active-btn');
        this.filterCompletedBtn = document.getElementById('filter-completed-btn');

        this.tasks = [];
        this.currentFilter = 'all'; // NOVO: Estado do filtro atual (all, active, completed)

        this.loadTasks();
        this.loadTheme();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.addTask();
            }
        });
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

        // NOVO: Ouvintes de evento para os botões de filtro
        this.filterAllBtn.addEventListener('click', () => this.setFilter('all'));
        this.filterActiveBtn.addEventListener('click', () => this.setFilter('active'));
        this.filterCompletedBtn.addEventListener('click', () => this.setFilter('completed'));
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
        this.renderTasks(); // Renderiza com o filtro atual
        this.taskInput.value = '';
        this.taskInput.focus();
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks(); // Renderiza com o filtro atual
    }

    toggleTaskCompletion(id) {
        const taskToToggle = this.tasks.find(task => task.id === id);
        if (taskToToggle) {
            taskToToggle.toggleCompletion();
            this.saveTasks();
            this.renderTasks(); // Renderiza com o filtro atual
        }
    }

    // NOVO: Método para filtrar e renderizar as tarefas
    renderTasks() {
        this.taskListElement.innerHTML = '';

        let filteredTasks = [];
        if (this.currentFilter === 'all') {
            filteredTasks = this.tasks;
        } else if (this.currentFilter === 'active') {
            filteredTasks = this.tasks.filter(task => !task.isCompleted);
        } else if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(task => task.isCompleted);
        }

        // Se não houver tarefas no filtro, exibe uma mensagem
        if (filteredTasks.length === 0 && this.tasks.length > 0) {
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = `Nenhuma tarefa ${this.currentFilter === 'active' ? 'ativa' : 'concluída'} encontrada.`;
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.fontStyle = 'italic';
            noTasksMessage.style.color = 'var(--text-color)';
            noTasksMessage.style.padding = '20px';
            this.taskListElement.appendChild(noTasksMessage);
            return; // Sai da função após exibir a mensagem
        } else if (this.tasks.length === 0) {
             const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = "Adicione sua primeira tarefa!";
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.fontStyle = 'italic';
            noTasksMessage.style.color = 'var(--text-color)';
            noTasksMessage.style.padding = '20px';
            this.taskListElement.appendChild(noTasksMessage);
            return;
        }


        filteredTasks.forEach(task => { // Itera sobre as tarefas FILTRADAS
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
            editBtn.addEventListener('click', () => this.editTask(task.id));
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

    editTask(id) {
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
        this.renderTasks(); // Renderiza com o filtro atual
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasksFromStorage = localStorage.getItem('tasks');
        if (tasksFromStorage) {
            this.tasks = JSON.parse(tasksFromStorage).map(taskData => {
                const newTask = new Task(taskData.description);
                newTask.isCompleted = taskData.isCompleted;
                newTask.id = taskData.id;
                return newTask;
            });
            // Não renderiza aqui, pois renderTasks() será chamado no final do constructor
            // para garantir que o filtro inicial seja aplicado.
        }
    }

    // NOVO: Método para definir o filtro e atualizar a interface
    setFilter(filter) {
        this.currentFilter = filter; // Atualiza o estado do filtro
        this.updateFilterButtons(); // Atualiza a classe 'active' nos botões
        this.renderTasks(); // Renderiza as tarefas com o novo filtro
    }

    // NOVO: Método para atualizar o estilo dos botões de filtro
    updateFilterButtons() {
        this.filterAllBtn.classList.remove('active');
        this.filterActiveBtn.classList.remove('active');
        this.filterCompletedBtn.classList.remove('active');

        if (this.currentFilter === 'all') {
            this.filterAllBtn.classList.add('active');
        } else if (this.currentFilter === 'active') {
            this.filterActiveBtn.classList.add('active');
        } else if (this.currentFilter === 'completed') {
            this.filterCompletedBtn.classList.add('active');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.themeToggleBtn.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeToggleBtn.textContent = 'Modo Claro';
        } else {
            this.themeToggleBtn.textContent = 'Modo Escuro';
        }
    }
}

// --- Ponto de Entrada da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    new TaskListManager();
});