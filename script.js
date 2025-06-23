// --- Definição da Classe Tarefa (Task) ---
// Esta classe representa uma única tarefa com suas propriedades e métodos.
class Task {
    constructor(description) {
        this.description = description;
        this.isCompleted = false; // Por padrão, uma nova tarefa não está completa
        this.id = Date.now(); // Um ID único simples para cada tarefa (útil para gerenciar)
    }

    // Método para marcar a tarefa como concluída ou não concluída
    toggleCompletion() {
        this.isCompleted = !this.isCompleted; // Inverte o estado (true vira false, false vira true)
    }
}

// --- Definição da Classe TaskListManager ---
// Esta classe é responsável por gerenciar todas as tarefas, interagir com o HTML
// e lidar com a lógica de adicionar, remover e atualizar.
class TaskListManager {
    constructor() {
        // Obter referências aos elementos HTML DENTRO DA CLASSE
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskListElement = document.getElementById('task-list');

        // Array para armazenar todos os objetos Task
        this.tasks = []; 

        // Configura os ouvintes de evento ao inicializar a classe
        this.setupEventListeners(); 
    }

    // Configura os ouvintes de evento para os botões e inputs
    setupEventListeners() {
        // Ouve o clique do botão "Adicionar"
        // Usamos uma arrow function para garantir que 'this' se refira à instância de TaskListManager
        this.addTaskBtn.addEventListener('click', () => this.addTask()); 

        // Ouve a tecla 'Enter' no campo de input
        this.taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.addTask(); // Chama o método addTask da própria classe
            }
        });
    }

    // Verifica se uma tarefa com a mesma descrição já existe no array 'tasks'
    isTaskDuplicate(description) {
        return this.tasks.some(task => task.description.toLowerCase() === description.toLowerCase());
    }

    // Método para adicionar uma nova tarefa
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

        // Cria uma nova instância da classe Task
        const newTask = new Task(description); 
        // Adiciona a nova tarefa ao array de tarefas gerenciado pela classe
        this.tasks.push(newTask); 

        // Chama o método para renderizar (atualizar) a lista no HTML
        this.renderTasks(); 
        // Limpa o input e coloca o foco de volta
        this.taskInput.value = ''; 
        this.taskInput.focus(); 
    }

    // Método para remover uma tarefa pelo seu ID único
    removeTask(id) {
        // Filtra o array, mantendo apenas as tarefas cujo ID NÃO é o que queremos remover
        this.tasks = this.tasks.filter(task => task.id !== id);
        // Renderiza a lista novamente após a remoção
        this.renderTasks(); 
    }

    // Método para alternar o status de conclusão de uma tarefa pelo seu ID
    toggleTaskCompletion(id) {
        // Encontra a tarefa específica no array pelo seu ID
        const taskToToggle = this.tasks.find(task => task.id === id);
        if (taskToToggle) {
            // Chama o método 'toggleCompletion' da instância da Task
            taskToToggle.toggleCompletion(); 
            // Renderiza para atualizar a visualização (aplicar/remover a classe 'completed')
            this.renderTasks(); 
        }
    }

    // Método para renderizar (desenhar) todas as tarefas no HTML
    renderTasks() {
        // Limpa a lista HTML atual antes de redesenhar
        this.taskListElement.innerHTML = ''; 

        // Percorre cada tarefa no array 'this.tasks'
        this.tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item'); 

            // Adiciona a classe 'completed' se a tarefa estiver marcada como concluída
            if (task.isCompleted) {
                listItem.classList.add('completed'); 
            }

            // Cria um span para o texto da tarefa
            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.description;
            // Adiciona ouvinte de clique ao texto da tarefa para alternar a conclusão
            taskTextSpan.addEventListener('click', () => this.toggleTaskCompletion(task.id));
            listItem.appendChild(taskTextSpan);

            // Cria o botão de exclusão
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('delete-btn');
            // Adiciona ouvinte de clique ao botão de exclusão para remover a tarefa
            deleteBtn.addEventListener('click', () => this.removeTask(task.id)); 
            listItem.appendChild(deleteBtn);

            // Adiciona o item completo à lista no HTML
            this.taskListElement.appendChild(listItem);
        });
    }
}

// --- Ponto de Entrada da Aplicação ---
// Esta linha cria uma nova instância de TaskListManager quando todo o HTML estiver carregado.
// É AQUI que sua aplicação de tarefas começa a funcionar!
document.addEventListener('DOMContentLoaded', () => {
    new TaskListManager(); 
});