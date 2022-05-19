const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const listEl = document.querySelector("#tasks");
let taskID = 0;
let taskList = {};

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
    new TaskItem(task);
    saveTask(task, taskID);
}

function saveTask(task, ID) {
    taskList[ID] = task;
    const jsonTaskList = JSON.stringify(taskList);
    localStorage.taskList = jsonTaskList;
}

function removeTask(id) {
    delete taskList[id];
    const jsonTaskList = JSON.stringify(taskList);
    localStorage.taskList = jsonTaskList;
}

function TaskItem (task) {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");

    taskEl.dataset.id = taskID;

    const taskContentEl = document.createElement("div");
    taskContentEl.classList.add("content");

    taskEl.appendChild(taskContentEl);
    
    const taskInputEl = document.createElement("input");
    taskInputEl.classList.add("text");
    taskInputEl.type = "text";
    taskInputEl.value = task;
    taskInputEl.setAttribute("readonly", "readonly");

    taskContentEl.appendChild(taskInputEl);

    const taskActionsEl = document.createElement("div");
    taskActionsEl.classList.add("actions");

    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.innerHTML = "Edit";

    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.innerHTML = "Delete";

    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);

    taskEl.appendChild(taskActionsEl);

    listEl.appendChild(taskEl);

    input.value = "";

    taskEditEl.addEventListener('click', () => {
        if (taskEditEl.innerText.toLowerCase() == "edit"){
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.innerText = "Save";
        } else {
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.innerText = "Edit";
            saveTask(taskInputEl.value, taskEl.dataset.id);
        }
    });

    taskDeleteEl.addEventListener('click', () => {
        const id = Number(taskEl.dataset.id);
        removeTask(id);
        listEl.removeChild(taskEl);
    })
}