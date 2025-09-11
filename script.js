console.log("js");

// Elements جميعها
//الادخال الرئيسي
const input = document.getElementById("taskInput");
//زر الادخال
const addBtn = document.getElementById("inputButton");
//تاسكات التي ستضاف على قوائم تاسك
const taskCont = document.getElementById("taskCont");
//عندما يكون الادخال خاطئا 
const errMsg = document.getElementById("inputError");
//زر يسمح لكامل تاسكات التي أدخلتها ان تظهر
const allButton = document.getElementById("allButton");
//زر انه يظهر التاسكات التي تم انهائها
const doneButton = document.getElementById("doneButton");
//زر يظهر التاسكات التي لم يتم انهائها بعد
const todoButton = document.getElementById("todoButton");
//زر الحذف للتاسكات التي تم انهائها فقط
const deleteDoneTasks = document.getElementById("deleteDoneTasks");
//زر الحذف لجميع التاسكات الموجودة
const deleteAllTasks = document.getElementById("deleteAllTasks");
//ايقونة التعديل الي على شكل قلم
const editModal = document.getElementById("editPopup");
//ماذا يدخل بايقونة التي عند القلم
const modalInput = document.getElementById("modalInput");
//متى يظهر خطأ عند الادخال باعادة تسمية 
const modalError = document.getElementById("modalError");
//زر الحفظ يحفظ كل متغير قمت به ما دام ليس به خطأ
const saveButton = document.getElementById("saveButton");
//زر عدم فعل شيء اذا بدي الغي العملية كلها
const cancelButton = document.getElementById("cancelButton");
//دع التاسكات تحفظ بحفظ محلي حتى يبقى محتفظ بكل تاسك قمت بادخاله سواء عند اعادة تحميل الصفحة او حتى لو تركته فارغا
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//الازرار التي لدي أنه تكون موحدة بالعمل كونها موجودة فيهن
let modalMode = ""; // "edit", "delete", "deleteDone", "deleteAll"
//لازم يكون المعرف تبع الموديلات كله مختلف وموحد بين المتشابهات
let modalTaskId = null;

// --- Add Task ---
const addTask = () => {
    //ادخال أي قيمة مهما كان نوعها
    const text = input.value.trim();

    // Validation
    if (!text) {
        //اذا لم يتم ادخال اي شيء ارسال رسالة
        errMsg.textContent = "Please enter a task!";
        return;
    }
    
    //اقل من 5 حروف ممنوع
    if (text.length < 5) {
        errMsg.textContent = "Task must be at least 5 characters long!";
        return;
    }
    //ممنوع البدء برقم
    if (/^\d/.test(text)) {
        errMsg.textContent = "Task cannot start with a number!";
        return;
    }
    //اختلاف رسالة الخطا حسب شو 

    errMsg.textContent = "";
    //const task = { ... }
    //انشاء كائن ثابت اسمه task
    //id: Date.now()
    //يعطي لكل مهمة معرّف (ID) فريد باستخدام عدد الميلي ثانية من وقت النظام.
//يعني مستحيل يتكرر إلا إذا ضفت مهمتين بالضبط بنفس الملي ثانية
//text: text
//هذا النص هو محتوى المهمة اللي كتبتها بالـ input.
//(القيمة جاية من متغير اسمه text).
//done: false
//حالة المهمة، إذا خلصت بتصير true، وإذا لسا ما خلصت بتضل false.
//(يعني بتفيدك لتمييز المهام المكتملة من غير المكتملة).
    const task = { id: Date.now(), text: text, done: false };
    tasks.push(task);//ادفع تاسكات مهما كانت تكون
    //localStorage: مساحة تخزين موجودة داخل المتصفح (زي Chrome, Firefox...)، بتخزن بياناتك حتى بعد ما تسكري الصفحة أو تعملي Refresh.
//(يعني لو سكرتي المتصفح ورجعتي، المهام بتضل موجودة).
//.setItem("tasks", ...)
//بتخزن قيمة (value) تحت اسم مفتاح (key).
//هنا المفتاح اسمه "tasks".
//JSON.stringify(tasks)
//مصفوفة tasks هي كائن (Array of Objects)، والمتصفح ما بقدر يخزن كائنات مباشرة، بس نصوص (Strings).
//عشان هيك بنحوّل المصفوفة إلى نص بصيغة JSON.
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //بنادي على فنشكن تاسكات الي بيعرض الي ادختله
    getTasks();
    //بخلي القيمة ادخل شو ما بدي عليها
    input.value = "";
};

//مهمام العرض
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
//زر الاضافة عند تحريك الحدث عليه والمفتاح المستخدم هو 
//click وتفعيل فكنشن
//addTask المسؤول عن الاضافة
addBtn.addEventListener("click", addTask);
//ادخال واضافة الحدث عند
//1. input.addEventListener("keypress", ...)
//هذا بضيف مستمع حدث (Event Listener) على عنصر الإدخال input (اللي هو صندوق كتابة المهمة).
//الحدث هو "keypress" → يعني بيسمع لما المستخدم يضغط أي مفتاح في الكيبورد وهو داخل الـ input.
//2. (e) => { ... }: 
//هذا دالة callback بتننفذ لما يصير الحدث.
//e هو كائن الحدث (event object)، فيه تفاصيل عن الزر اللي انضغط.
//3. if (e.key === "Enter")
//بيفحص: هل المفتاح اللي انضغط هو مفتاح Enter؟
//لو نعم → ينفذ الكود اللي بعده.
//لو لا → ما يعمل شيء.
//4. addTask();
//إذا المستخدم ضغط Enter، يتم استدعاء الدالة addTask()، يعني يضيف المهمة كأن المستخدم كبس على زر Add new task.
//هذا السطر بخلي المستخدم يقدر يضيف مهمة جديدة بالضغط على Enter من الكيبورد بدل ما يضغط على زر Add new task.
//ممكن نستبدل "keypress" بـ "keydown"
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
//هذا حدث مشترك لجميع الازرار التي تحمل هذا الاسماء ان تقوم بنفس الوظيفة أينما كانت
// Save / Confirm in modal
saveButton.onclick = () => {
    //زر الحفظ وكذلك تفعيل النقر وتنفيذ الفنكشن
    //شغلات داخلة بالشروط 
    //edit: انه زر الحدث يساوي تعديل 
    if (modalMode === "edit") {
        //الشغلات التي تتنفذ عندما يساوي الحدث بكلمة تعديل
        //نجيب فنكشن newTask الي هو ثابت
        //ويساوي modalInput 
        //الي هو يساوي الادخال والي هو موجود ب rename 
        //value: يدخل أي قيمة بدي اياها بأي نوعية 
        //trim():
        //هذه دالة في JavaScript وظيفتها تشيل المسافات الفاضية من بداية ونهاية النص.
        //يخزن النتيجة (النص بعد تنظيفه من المسافات) داخل متغير اسمه newText.
        const newText = modalInput.value.trim();
        //بفعل الشرط انه لا يساوي newTask
        if (!newText) {
            //بفعل الخطأ ب rename 
            //اذا ما دخلت النص المطلوب يعني فاضي مثلا ببعت هاي الرسالة
            modalError.textContent = "Task cannot be empty!";
            //برجع قيمة هاد الفنكشن
            return;
        }
        //الشرط newTask 
        //عندما طولها اقل من 5 يتم تنفيذ الشرط
        if (newText.length < 5) {
            //تفعيل modalError 
            //جعل النص يساوي المكتوب في حال اقل من 5 حروف طلع
            modalError.textContent = "Task must be at least 5 characters long!";
            //نقوم باستدعاء
            return;
        }
        // /^\d/
        //هذا Regular Expression (regex) معناه:
//^ → بداية النص.
// \d → أي رقم (من 0 إلى 9).
//يعني الشرط هذا بيفحص: هل النص يبدأ برقم؟
//.test(newText): 
//الدالة test() تفحص النص (newText) وتشوف إذا بيطابق الـ regex.
//لو النص يبدأ برقم → ترجع true.
//لو النص ما يبدأ برقم → ترجع false.
//if (...) { ... }
//إذا الشرط تحقق (النص يبدأ برقم):
//يظهر رسالة خطأ في المودال
//ويرجع من الدالة (return) → يعني يوقف التنفيذ وما يكمل التعديل/الإضافة.
        if (/^\d/.test(newText)) {
            modalError.textContent = "Task cannot start with a number!";
            return;
        }
        //زر الحذف
        //تاسكات يبحث عن المعرف للتاسك الي دخلته وصار يحمل معرف 
        //.text=انه الي بدي ادخله هو نص
        //newTask: بصير يساوي هاد الفنكشن
        tasks.find(t => t.id === modalTaskId).text = newText;
        //الشرط الاخر هو عندما المودال يساوي الحذف نوعا وقيمة
    } else if (modalMode === "delete") {
        //بوقتها تاسكات تصبح تساوي تساكات مفلترة من خلال انه التاسك صاحبة المعرف التالي لا تساوي
        //معرف المودال هذا 
        tasks = tasks.filter(t => t.id !== modalTaskId);
        //الشرط الاخر انه المودال يساوي نوعا وقيمة حذف التاسكات المنتهية
    } else if (modalMode === "deleteDone") {
        //تاسكات تساوي تاسكات المفلترة الغير منتهية 
        tasks = tasks.filter(t => !t.done);
        //الشرط الاخر 
        //modalMode=deleteAll مودال يساوي كل النوع والقيم مهما كان داخل بالاقواس
    } else if (modalMode === "deleteAll") {
        tasks = [];
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //استدعاء الاغلاق
    closeModal();
    //استدعاء عرض التاسكات
    getTasks();
};


// Cancel modal
//فنكشن زر عدم تنفيذ والذي عندما أنقر عليه ويساوي ف
//closeModal: الذي كان وظيفته فقط اغلاق النافذة المفتوحة
cancelButton.onclick = closeModal;

// Filter buttons
//allButton: استدعاء هاد الفنكشن
//وهاد الحدث عند النقر اختار مفتاح اسمه
//click ويبدأ تنفيذ فنكشن الخاص بعرض المهام بس بروح على جهة 
//all انه يعرض كلشي دخلته سواء كنت منهيه او لا
allButton.addEventListener("click", () => getTasks("all"));
//doneButton: استدعاء فنكشن انهاء المهام
//انه يتم تنفيذ عن النقر ويكون في مفتاح 
//click ويتم تنفيذ الفنكشن تبع عرض المهام الذي يسمى ب
//done انه انهاء المهام
doneButton.addEventListener("click", () => getTasks("done"));
//todoButton: استدعاء فنكشن التنفيذ الحالي
//انه يتم تنفيذ هاد الفنكشن من خلال المفتاح 
//click ويتم تنفيذ الفنشكن الخاص بعرض المهام الذي يسمى ب
//todo
todoButton.addEventListener("click", () => getTasks("todo"));

// Delete done tasks
//بنادي على حذف القيم التي انهائها عند ضغط الحدث يتم اعتبار 
//click هو المفتاح للفنشكن وتنفيذ الفنكشن بعدها
deleteDoneTasks.addEventListener("click", () => {
    //يفعل if شرطية 
    //اذا كانت تاسكات لا تساوي التاسكات كلها وبعض منها يكون منتهي
    //هي القيمة المرجعة التي انتهت
    if (!tasks.some(t => t.done)) return;
    //بنادي على فنكشن openModel 
    //واكتب النص التالي delete Done
    openModal("deleteDone");
});

// Delete all tasks
//حذف كل التاسكات كاملة عند ضغط عليها يعمل الحدث واسم المفتاح هو 
//click
//يبدأ تنفيذ الفنكشن 
deleteAllTasks.addEventListener("click", () => {
    //اذا طول التاسكات يساوي صفر نوعا وقيمة
    //يتم استدعاء فنكشن getTasks()
    //ثم return حسب شو القيم الي بتطلع عندي
    if (tasks.length === 0) { getTasks(); return; }
    //يتم تفعيل فنكشن openModal الذي يحتوي على كلمة delete All
    openModal("deleteAll");
});
//يبدأ من جديد عبر منادته لفنكشن تاسكات انه يعرضها
// Initial render
getTasks();
