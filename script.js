console.log("js");

// Elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("inputButton");
const taskCont = document.getElementById("taskCont");
const errMsg = document.getElementById("inputError");

const allButton = document.getElementById("allButton");
const doneButton = document.getElementById("doneButton");
const todoButton = document.getElementById("todoButton");

const deleteDoneTasks = document.getElementById("deleteDoneTasks");
const deleteAllTasks = document.getElementById("deleteAllTasks");

const editModal = document.getElementById("editPopup");
const modalInput = document.getElementById("modalInput");
const modalError = document.getElementById("modalError");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let modalMode = ""; // "edit", "delete", "deleteDone", "deleteAll"
let modalTaskId = null;

// --- Add Task ---
const addTask = () => {
    const text = input.value.trim();

    // Validation
    if (!text) {
        errMsg.textContent = "Please enter a task!";
        return;
    }
    if (text.length < 5) {
        errMsg.textContent = "Task must be at least 5 characters long!";
        return;
    }
    if (/[a-zA-Z]/.test(text) && /\d/.test(text)) {
        errMsg.textContent = "Task cannot contain letters and numbers together!";
        return;
    }

    errMsg.textContent = "";

    const task = { id: Date.now(), text: text, done: false };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    getTasks();
    input.value = "";
};

// --- Render Tasks ---
const getTasks = (filter = "all") => {
    taskCont.innerHTML = "";

    let filteredTasks = tasks;
    if (filter === "done") filteredTasks = tasks.filter(t => t.done);
    if (filter === "todo") filteredTasks = tasks.filter(t => !t.done);

    if (filteredTasks.length === 0) {
        taskCont.innerHTML = "<li class='no-tasks'>No tasks</li>";
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.done ? "taskItem completed" : "taskItem";
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <input type="checkbox" ${task.done ? "checked" : ""} />
                <i class="fa-solid fa-pencil edit-btn"></i>
                <i class="fa-solid fa-trash delete-btn"></i>
            </div>
        `;
        taskCont.appendChild(li);
    });
};

// --- Modal Functions ---
const openModal = (mode, taskId = null) => {
    modalMode = mode;
    modalTaskId = taskId;
    modalInput.style.display = "none";
    modalInput.value = "";
    modalError.textContent = "";
    saveButton.style.backgroundColor = "#6c757d"; // confirm gray
    cancelButton.style.backgroundColor = "#dc3545"; // cancel red

    if (mode === "edit") {
        modalInput.style.display = "block";
        modalInput.value = tasks.find(t => t.id === taskId).text;
        editModal.querySelector("h2").textContent = "Rename Task";
        saveButton.textContent = "Save";
    } else if (mode === "delete") {
        editModal.querySelector("h2").textContent = "Delete Task";
        modalError.textContent = "Are you sure you want to delete this task?";
        saveButton.textContent = "Confirm";
    } else if (mode === "deleteDone") {
        editModal.querySelector("h2").textContent = "Delete Done Tasks";
        modalError.textContent = "Are you sure you want to delete all completed tasks?";
        saveButton.textContent = "Confirm";
    } else if (mode === "deleteAll") {
        editModal.querySelector("h2").textContent = "Delete All Tasks";
        modalError.textContent = "Are you sure you want to delete all tasks?";
        saveButton.textContent = "Confirm";
    }

    editModal.style.display = "flex";
};

const closeModal = () => {
    editModal.style.display = "none";
};

// --- Event Listeners ---
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });

// Task interactions
taskCont.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li || li.classList.contains("no-tasks")) return;
    const taskId = Number(li.dataset.id);
    const task = tasks.find(t => t.id === taskId);

    // Toggle checkbox
    if (e.target.type === "checkbox") {
        task.done = e.target.checked;
        li.classList.toggle("completed", task.done);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
        openModal("edit", taskId);
    }

    // Delete single
    if (e.target.classList.contains("delete-btn")) {
        openModal("delete", taskId);
    }
});

// Save / Confirm in modal
saveButton.onclick = () => {
    if (modalMode === "edit") {
        const newText = modalInput.value.trim();
        if (!newText) {
            modalError.textContent = "Task cannot be empty!";
            return;
        }
        if (newText.length < 5) {
            modalError.textContent = "Task must be at least 5 characters long!";
            return;
        }
        if (/[a-zA-Z]/.test(newText) && /\d/.test(newText)) {
            modalError.textContent = "Task cannot contain letters and numbers together!";
            return;
        }
        tasks.find(t => t.id === modalTaskId).text = newText;
    } else if (modalMode === "delete") {
        tasks = tasks.filter(t => t.id !== modalTaskId);
    } else if (modalMode === "deleteDone") {
        tasks = tasks.filter(t => !t.done);
    } else if (modalMode === "deleteAll") {
        tasks = [];
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    closeModal();
    getTasks();
};

// Cancel modal
cancelButton.onclick = closeModal;

// Filter buttons
allButton.addEventListener("click", () => getTasks("all"));
doneButton.addEventListener("click", () => getTasks("done"));
todoButton.addEventListener("click", () => getTasks("todo"));

// Delete done tasks
deleteDoneTasks.addEventListener("click", () => {
    if (!tasks.some(t => t.done)) return;
    openModal("deleteDone");
});

// Delete all tasks
deleteAllTasks.addEventListener("click", () => {
    if (tasks.length === 0) { getTasks(); return; }
    openModal("deleteAll");
});

// Initial render
getTasks();
