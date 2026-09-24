const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const priority = document.querySelector("#priorityInput");
const list = document.querySelector("#taskList");
const empty = document.querySelector("#emptyState");
const filters = document.querySelectorAll(".filter-button");
let tasks = JSON.parse(localStorage.getItem("donecuy-tasks") || "[]");
let currentFilter = "all";

const today = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long" });
const fullDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
document.querySelector("#todayLabel").textContent = today.format(new Date());
document.querySelector("#fullDate").textContent = fullDate.format(new Date());

function save() { localStorage.setItem("donecuy-tasks", JSON.stringify(tasks)); }
function render() {
    const visible = tasks.filter((task) => currentFilter === "all" || (currentFilter === "done" ? task.done : !task.done));
    list.innerHTML = visible.map((task) => `<article class="task-item ${task.done ? "done" : ""}"><button class="check-button" data-action="toggle" data-id="${task.id}" aria-label="Tandai tugas">${task.done ? "✓" : ""}</button><span class="priority ${task.priority}"></span><div class="task-content"><p class="task-title"></p></div><button class="delete-button" data-action="delete" data-id="${task.id}" aria-label="Hapus tugas">Hapus</button></article>`).join("");
    visible.forEach((task, index) => { const title = list.querySelectorAll(".task-title")[index]; title.textContent = task.title; });
    empty.hidden = visible.length > 0;
    updateStats();
}
function updateStats() {
    const done = tasks.filter((task) => task.done).length;
    const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0;
    document.querySelector("#totalCount").textContent = tasks.length;
    document.querySelector("#doneCount").textContent = done;
    document.querySelector("#leftCount").textContent = tasks.length - done;
    document.querySelector("#progressPercent").textContent = `${percent}%`;
    document.querySelector(".progress-orbit").style.background = `conic-gradient(var(--mint-strong) ${percent * 3.6}deg, var(--line) ${percent * 3.6}deg)`;
}
form.addEventListener("submit", (event) => { event.preventDefault(); const title = input.value.trim(); if (!title) return; tasks.unshift({ id: Date.now(), title, priority: priority.value, done: false }); save(); input.value = ""; currentFilter = "all"; filters.forEach((button) => button.classList.toggle("active", button.dataset.filter === "all")); render(); input.focus(); });
list.addEventListener("click", (event) => { const button = event.target.closest("button[data-action]"); if (!button) return; const id = Number(button.dataset.id); if (button.dataset.action === "toggle") tasks = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task); else tasks = tasks.filter((task) => task.id !== id); save(); render(); });
filters.forEach((button) => button.addEventListener("click", () => { currentFilter = button.dataset.filter; filters.forEach((item) => item.classList.toggle("active", item === button)); render(); }));
document.querySelector("#clearDone").addEventListener("click", () => { tasks = tasks.filter((task) => !task.done); save(); render(); });
document.querySelector("#themeToggle").addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("donecuy-theme", document.body.classList.contains("dark") ? "dark" : "light"); });
if (localStorage.getItem("donecuy-theme") === "dark") document.body.classList.add("dark");
render();
