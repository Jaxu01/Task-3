const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const listEl = document.querySelector("#tasks");
const doneListEl = document.querySelector("#done");
let taskID = 0;
let taskList = {};
const icon = {
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 8 8"><path d="M6.41 0l-.69.72-2.78 2.78-.81-.78-.72-.72-1.41 1.41.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72-1.44-1.41z" transform="translate(0 1)" /></svg>`,
    pencil: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 8 8"><path d="M6 0l-1 1 2 2 1-1-2-2zm-2 2l-4 4v2h2l4-4-2-2z" /></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 8 8"><path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" /></svg>`
}

if (localStorage.taskList) {
    taskList = JSON.parse(localStorage.taskList);
    for (const property in taskList) {
        taskID = Number(property);
        const task = taskList[property]
        new TaskItem(task) 
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = input.value;

    if (!task) return alert("Proszę wypełnij zadanie");

    createTaskItem(task);
});

function createTaskItem(task) {
    taskID++;
    const taskData = {'value': task, 'id': taskID};
    new TaskItem(taskData);
    saveTask(taskData);
}

function saveTask({value, id, done = false}) {
    taskList[id] = {value, done};
    const jsonTaskList = JSON.stringify(taskList);
    localStorage.taskList = jsonTaskList;
}

function removeTask(id) {
    delete taskList[id];
    const jsonTaskList = JSON.stringify(taskList);
    localStorage.taskList = jsonTaskList;
}

function TaskItem ({value, done = false}) {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");

    taskEl.dataset.id = taskID;
    taskEl.dataset.done = done;

    const taskContentEl = document.createElement("div");
    taskContentEl.classList.add("content");

    taskEl.appendChild(taskContentEl);
    
    const taskInputEl = document.createElement("input");
    taskInputEl.classList.add("text");
    taskInputEl.type = "text";
    taskInputEl.value = value;
    taskInputEl.setAttribute("readonly", "readonly");

    taskContentEl.appendChild(taskInputEl);

    const taskActionsEl = document.createElement("div");
    taskActionsEl.classList.add("actions");

    const taskDoneEl = document.createElement("button");
    taskDoneEl.classList.add("done");
    taskDoneEl.innerHTML = `<span class="label-icon done-icon">${icon.check}</span><span class="label">Wykonane</span>`;

    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.innerHTML = `<span class="label-icon edit-icon">${icon.pencil}</span><span class="label">Edytuj</span>`;

    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.innerHTML = `<span class="label-icon delete-icon">${icon.x}</span><span class="label">Usuń</span>`;

    taskActionsEl.appendChild(taskDoneEl);
    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);

    taskEl.appendChild(taskActionsEl);

    if (done) {
        doneListEl.appendChild(taskEl);
    }
    else {
        listEl.appendChild(taskEl);
    }

    input.value = "";

    taskEditEl.addEventListener('click', () => {
        if (taskEditEl.dataset.active !== 'true') {
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.innerHTML = `<span class="label-icon edit-icon">${icon.pencil}</span><span class="label">Zapisz</span>`;
            taskEditEl.dataset.active = 'true';
        } else {
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.innerHTML = `<span class="label-icon edit-icon">${icon.pencil}</span><span class="label">Edytuj</span>`;
            saveTask({'value': taskInputEl.value, 'id': taskEl.dataset.id});
            taskEditEl.dataset.active = 'false';
        }
    });

    taskDeleteEl.addEventListener('click', () => {
        const id = Number(taskEl.dataset.id);
        removeTask(id);
        if (taskEl.dataset.done === 'true') {
            doneListEl.removeChild(taskEl);
        }
        else {
            listEl.removeChild(taskEl);
        }
    })

    taskDoneEl.addEventListener('click', () => {
        saveTask({'value': taskInputEl.value, 'id': taskEl.dataset.id, 'done': true});
        listEl.removeChild(taskEl);
        doneListEl.appendChild(taskEl);
        taskEl.dataset.done = true;
    })
}