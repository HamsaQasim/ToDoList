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
let modalTaskIndex = null;

// --- Functions ---

// Add task
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
    saveTasks();
    input.value = "";
};

// Render tasks
const renderTasks = (filter = "all") => {
    taskCont.innerHTML = "";

    let filteredTasks = tasks;
    if (filter === "done") filteredTasks = tasks.filter(t => t.done);
    if (filter === "todo") filteredTasks = tasks.filter(t => !t.done);

    if (filteredTasks.length === 0) {
        taskCont.innerHTML = "<li class='no-tasks'>No tasks</li>";
        return;
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.done ? "taskItem completed" : "taskItem";
        li.dataset.id = task.id;
        li.dataset.index = index;
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

// Save tasks
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
};

// Open modal
const openModal = (mode, index = null) => {
    modalMode = mode;
    modalTaskIndex = index;

    modalInput.style.display = "none"; // hide input by default
    modalInput.value = "";
    modalError.textContent = "";

    // Reset buttons colors
    saveButton.style.backgroundColor = "#6c757d"; // confirm gray default
    cancelButton.style.backgroundColor = "#dc3545"; // cancel red

    if (mode === "edit") {
        modalInput.style.display = "block";
        modalInput.value = tasks[index].text;
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

// Close modal
const closeModal = () => {
    editModal.style.display = "none";
};

// --- Event Listeners ---

// Add task
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

// Task interactions
taskCont.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li || li.classList.contains("no-tasks")) return;
    const index = Number(li.dataset.index);
    const task = tasks[index];

    // Toggle checkbox
    if (e.target.type === "checkbox") {
        task.done = e.target.checked;
        li.classList.toggle("completed", task.done);
        saveTasks();
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
        openModal("edit", index);
    }

    // Delete
    if (e.target.classList.contains("delete-btn")) {
        openModal("delete", index);
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
        tasks[modalTaskIndex].text = newText;
    } else if (modalMode === "delete") {
        tasks.splice(modalTaskIndex, 1);
    } else if (modalMode === "deleteDone") {
        tasks = tasks.filter(t => !t.done);
    } else if (modalMode === "deleteAll") {
        tasks = [];
    }
    closeModal();
    saveTasks();
};

// Cancel modal
cancelButton.onclick = closeModal;

// Filter buttons
allButton.addEventListener("click", () => renderTasks("all"));
doneButton.addEventListener("click", () => renderTasks("done"));
todoButton.addEventListener("click", () => renderTasks("todo"));

// Delete done tasks
deleteDoneTasks.addEventListener("click", () => {
    if (!tasks.some(t => t.done)) return;
    openModal("deleteDone");
});

// Delete all tasks
deleteAllTasks.addEventListener("click", () => {
    if (tasks.length === 0) {
        renderTasks();
        return;
    }
    openModal("deleteAll");
});

// Initial render
renderTasks();
