document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const picture = document.querySelector(".picture-thinking");
    const todosContainer = document.querySelector(".todos-container");
    const progressBar = document.getElementById("progress");
    const progressNumber = document.getElementById("numbers");

    const togglePictureState = () => {
        picture.style.display = taskList.children.length === 0 ? "block" : "none";
        todosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll(
            ".task-checkbox:checked",
        ).length;

        progressBar.style.width = totalTasks
            ? `${(completedTasks / totalTasks) * 100}%`
            : "0%";
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;
        
        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    const saveTasksLocal = () => {
        const tasks = Array.from(taskList.children).map((li) => ({
            text: li.querySelector(".task-text").textContent,
            completed: li.querySelector(".task-checkbox").checked,
        }))
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    const loadTasksLocal = () => {
        const saveTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        saveTasks.forEach((task) => addTask(task.text, task.completed, false));
        togglePictureState();
        updateProgress();
    };

    // Function to add a new task
    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""} />
        <span class="task-text">${taskText}</span>
        <div class="task-buttons">
            <button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector(".task-checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed) {
            li.classList.add("completed");
            editBtn.disabled = true;
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            updateProgress();
            saveTasksLocal();
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector(".task-text").textContent;
                taskInput.focus();
                taskInput.selectionStart = taskInput.selectionEnd =
                    taskInput.value.length;
                li.remove();
                togglePictureState();
                updateProgress(false);
                saveTasksLocal();
            }
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            togglePictureState();
            updateProgress();
            saveTasksLocal();
        });

        taskList.appendChild(li);
        taskInput.value = "";
        togglePictureState();
        updateProgress(checkCompletion);
    };

    addTaskButton.addEventListener("click", () => addTask());
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    loadTasksLocal();
});

const Confetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            }),
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};
