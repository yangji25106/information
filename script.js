const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

let isAdmin = false;
const ADMIN_PASSWORD = "1234"; // 원하는 비밀번호로 바꿔도 됩니다

// 날짜 차이 계산
function getDday(dateStr) {
  const today = new Date();
  const targetDate = new Date(dateStr);
  const diffTime = targetDate - today;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `D-${diffDays}`;
  else if (diffDays === 0) return `D-DAY`;
  else return `D+${Math.abs(diffDays)}`;
}

// 관리자 로그인
function login() {
  const input = document.getElementById("adminPass").value;
  if (input === ADMIN_PASSWORD) {
    isAdmin = true;
    taskForm.style.display = "flex";
    alert("관리자 로그인 성공!");
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
}

// 저장된 목록 불러오기
window.onload = renderTasks;

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!isAdmin) return;

  const title = document.getElementById('title').value;
  const subject = document.getElementById('subject').value;
  const date = document.getElementById('date').value;

  const task = { title, subject, date };
  saveTask(task);
  renderTasks();
  taskForm.reset();
});

// 리스트 그리기
function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const dday = getDday(task.date);
    li.innerHTML = `
      ${task.date} - [${task.subject}] ${task.title} (${dday})
      ${isAdmin ? `<button class="delete-btn" onclick="deleteTask(${index})">❌</button>` : ''}
    `;
    taskList.appendChild(li);
  });
}

// 저장
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 삭제
function deleteTask(index) {
  if (!isAdmin) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

