document.addEventListener("DOMContentLoaded", function () {
  const upcomingSections = document.querySelector(".upcoming-sections");
  if (upcomingSections) {
    // ... (existing upcoming code)
    return; // Prevent running Today page logic below
  }

  // --- TODAY PAGE LOGIC ---
  const addTaskBtn = document.getElementById("addTaskBtn");
  const tasksUl = document.getElementById("tasks");
  const mainTaskCount = document.getElementById("mainTaskCount");
  const todayCount = document.getElementById("todayCount");
  const taskDetailsPanel = document.getElementById("taskDetailsPanel");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskListType = document.getElementById("taskListType");
  const taskDueDate = document.getElementById("taskDueDate");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const addSubtaskBtn = document.getElementById("addSubtaskBtn");
  const subtasksUl = document.getElementById("subtasks");
  const closePanelBtn = document.getElementById("closePanelBtn");

  let tasks = [];
  let selectedTaskIndex = null;

  function updateTaskCount() {
    if (mainTaskCount) mainTaskCount.textContent = tasks.length;
    if (todayCount) todayCount.textContent = tasks.length;
  }

  function renderTasks() {
    if (!tasksUl) return;
    tasksUl.innerHTML = "";
    tasks.forEach((task, idx) => {
      const li = document.createElement("li");
      li.className = "task-row";

      let listTagHtml = "";
      if (task.list && task.list !== "None") {
        let colorClass = "";
        if (task.list === "Personal") {
          colorClass = "pink-badge";
        } else if (task.list === "Work") {
          colorClass = "blue-badge";
        } else if (task.list === "List 1") {
          colorClass = "yellow-badge";
        }
        listTagHtml = `<span class="task-tag list-tag ${colorClass}">${task.list}</span>`;
      }

      const subtasksCount = task.subtasks ? task.subtasks.length : 0;
      const dateTag = task.due
        ? `<span class="task-tag date-tag"><span class="icon">📅</span> ${task.due}</span>`
        : "";
      const subtasksTag =
        subtasksCount > 0
          ? `<span class="task-tag subtasks-tag"><span class="icon">🗂️</span> ${subtasksCount} Subtasks</span>`
          : "";

      li.innerHTML = `
              <div class="task-main">
                <input type="checkbox" class="task-checkbox" ${
                  task.completed ? "checked" : ""
                }/>
                <span class="task-title">${task.title}</span>
                <span class="task-arrow">&gt;</span>
              </div>
              <div class="task-tags">
                ${dateTag}
                ${subtasksTag}
                ${listTagHtml}
              </div>
            `;
      li.onclick = function (e) {
        if (e.target.tagName.toLowerCase() === "input") return;
        openTask(idx);
      };
      li.querySelector(".task-checkbox").addEventListener(
        "click",
        function (e) {
          e.stopPropagation();
          task.completed = this.checked;
        }
      );
      tasksUl.appendChild(li);
    });
    updateTaskCount();
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function () {
      const newTask = {
        title: "New Task",
        description: "",
        list: "None",
        due: "",
        tags: [],
        subtasks: [],
        completed: false,
      };
      tasks.push(newTask);
      renderTasks();
    });
  }

  function openTask(idx) {
    selectedTaskIndex = idx;
    const task = tasks[idx];
    if (!taskDetailsPanel) return;
    taskDetailsPanel.classList.add("open");
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskListType.value = task.list;
    taskDueDate.value = task.due;
    renderSubtasks(task.subtasks);
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      if (selectedTaskIndex === null) return;
      const task = tasks[selectedTaskIndex];
      task.title = taskTitle.value;
      task.description = taskDescription.value;
      task.list = taskListType.value;
      task.due = taskDueDate.value;
      renderTasks();
      taskDetailsPanel.classList.remove("open");
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (selectedTaskIndex === null) return;
      tasks.splice(selectedTaskIndex, 1);
      selectedTaskIndex = null;
      renderTasks();
      taskDetailsPanel.classList.remove("open");
    });
  }

  if (closePanelBtn) {
    closePanelBtn.addEventListener("click", function () {
      taskDetailsPanel.classList.remove("open");
    });
  }

  function renderSubtasks(subtasks) {
    if (!subtasksUl) return;
    subtasksUl.innerHTML = "";
    subtasks.forEach((st) => {
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" ${
        st.completed ? "checked" : ""
      }/> <input type="text" value="${st.title}" />`;
      li.querySelector("input[type='checkbox']").addEventListener(
        "change",
        function () {
          st.completed = this.checked;
        }
      );
      li.querySelector("input[type='text']").addEventListener(
        "input",
        function () {
          st.title = this.value;
        }
      );
      subtasksUl.appendChild(li);
    });
  }

  if (addSubtaskBtn) {
    addSubtaskBtn.addEventListener("click", function () {
      if (selectedTaskIndex === null) return;
      const task = tasks[selectedTaskIndex];
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push({ title: "Subtask", completed: false });
      renderSubtasks(task.subtasks);
    });
  }

  // Hide details panel when clicking outside
  document.body.addEventListener("click", function (e) {
    // Check if the click is outside the panel and not on a task row itself
    if (
      taskDetailsPanel &&
      taskDetailsPanel.classList.contains("open") &&
      !taskDetailsPanel.contains(e.target) &&
      !e.target.closest(".task-row")
    ) {
      taskDetailsPanel.classList.remove("open");
    }
  });

  // Initial render
  renderTasks();
});
