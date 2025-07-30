const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// 날짜 차이 계산 함수
function getDday(dateStr) {
  const today = new Date();
  const targetDate = new Date(dateStr);
  const diffTime = targetDate - today;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  else if (diffDays === 0) return `D-DAY`;
  else return `D+${Math.abs(diffDays)}`;
}

// 로컬 스토리지에서 불러오기
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // 정렬
  savedTasks.forEach(task => addTask(task));
};

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const subject = document.getElementById('subject').value;
  const date = document.getElementById('date').value;

  const task = { title, subject, date };
  saveTask(task);
  renderTasks(); // 다시 그리기

  taskForm.reset();
});

function addTask(task) {
  const li = document.createElement('li');
  const dday = getDday(task.date);
  li.textContent = `${task.date} - [${task.subject}] ${task.title} (${dday})`;
  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 전체 리스트 다시 그리기
function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  taskList.innerHTML = ''; // 기존 리스트 비우기
  tasks.forEach(task => addTask(task));
}
