console.log("js");
const input= document.getElementById("taskInput");
const addBtn=document.getElementById("inputButton");
const list=document.getElementById("list");
const errMsg=document.getElementById("inputError");

const allButton = document.getElementById('allButton');
const doneButton = document.getElementById('doneButton');
const todoButton = document.getElementById('todoButton');

const deleteDoneTasks = document.getElementById('deleteDoneTasks');
const deleteAllTasks = document.getElementById('deleteAllTasks');

let tasks=JSON.parse(localStorage.getItem('tasks')) || []; //to display them from localStorage



//add task function
const addTask = ()=>{
    const text= input.value.trim();
    if (!text) {
        errMsg.textContent= "Please enter a task!";
        return;
    }
    errMsg.textContent=""; // if there is no error make it empty

    const task={id:Date.now(), text:text, done:false};
    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    getTasks();
    input.value = '';

};

const getTasks= ()=>{
    taskCont.innerHTML="";
    tasks.forEach(task => {
        const li= document.createElement('li');
        li.className= task.done ? "taskItem completed": "taskItem";
        li.dataset.id = task.id;
        li.innerHTML=`
        <span>${task.text}</span>
        <div>
        <input type="checkbox" ${task.done? 'checked': ''} />
                
                <i class="fa-solid fa-pencil edit-btn"></i>
                <i class="fa-solid fa-trash delete-btn"></i></div>
           
        `;
        taskCont.appendChild(li);
        
    });

};

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e)=>{
    if(e.key == 'Enter') addTask();
});

getTasks(); //calling the function


//eventListener foe checkbox on the task
taskCont.addEventListener('change', (e) => {
    if(e.target.type=='checkbox'){
        const li = e.target.closest('li');
        const taskId = Number(li.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        task.done = e.target.checked; // update task's done status

        // adding completed class(to modify the css when it added becomes red and line through)
        if (task.done) {
            
             li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    
});

//This shows all tasks
allButton.addEventListener('click', () => getTasks());

// Show only done tasks => only checked tasks
doneButton.addEventListener('click', () => {
    taskCont.innerHTML = "";
    tasks.forEach(task => {
        if (task.done) {
            const li = document.createElement('li');
            li.className = "taskItem completed"; // add completed class
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <input type="checkbox" checked />
                    <i class="fa-solid fa-pencil edit-btn"></i>
                    <i class="fa-solid fa-trash delete-btn"></i>
                </div>
            `;
            taskCont.appendChild(li);
        }
    });
});

// Show only todo tasks (not done tasks)=> not checked
todoButton.addEventListener('click', () => {
    taskCont.innerHTML = "";
    tasks.forEach(task => {
        if (!task.done) {
            const li = document.createElement('li');
            li.className = "taskItem"; // not completed
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <input type="checkbox" />
                    <i class="fa-solid fa-pencil edit-btn"></i>
                    <i class="fa-solid fa-trash delete-btn"></i>
                </div>
            `;
            taskCont.appendChild(li);
        }
    });
});

//delete done tasks button
deleteDoneTasks.addEventListener('click', () => {
    // Optional: confirm before deleting
    if (!confirm("Are you sure you want to delete all done tasks?")) return;

    // Remove tasks that are done
    tasks = tasks.filter(task => !task.done);

    // Update localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Re-render list
    getTasks();
});

