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
        li.className= "taskItem";
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