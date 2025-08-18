// --------- 반드시 여기에 본인 Firebase 설정값을 넣으세요 ----------
const firebaseConfig = {
  apiKey: "AIzaSyCRijo9_v_ABQA3EteU31FujiHcBhFe8EQ",
  authDomain: "information-58761.firebaseapp.com",
  databaseURL: "https://information-58761-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "information-58761",
  storageBucket: "information-58761.firebasestorage.app",
  messagingSenderId: "272228978862",
  appId: "1:272228978862:web:1984e9f18ff8ff03901d3f",
  measurementId: "G-NB6HKYBD2N"
};
// -----------------------------------------------------------------

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 관리자 비밀번호 (원하는 값으로 바꿔주세요)
const ADMIN_PASSWORD = "yangji106!";

// DOM 요소
const loginSection = document.getElementById('login-section');
const addSection = document.getElementById('add-section');
const adminPassInput = document.getElementById('adminPass');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const taskTitleInput = document.getElementById('taskTitle');
const taskSubjectInput = document.getElementById('taskSubject');
const taskDateInput = document.getElementById('taskDate');
const taskColorInput = document.getElementById('taskColor');
const addTaskBtn = document.getElementById('addTaskBtn');

const taskListDiv = document.getElementById('taskList');

let isAdmin = false;

// 로그인
loginBtn.onclick = () => {
  if (adminPassInput.value === ADMIN_PASSWORD) {
    isAdmin = true;
    loginSection.style.display = 'none';
    addSection.style.display = 'block';
    adminPassInput.value = '';
    // 강제 리렌더링: (실시간 리스너가 DOM을 다시 그림)
  } else {
    alert('비밀번호가 틀렸습니다.');
  }
};

// 로그아웃
logoutBtn.onclick = () => {
  isAdmin = false;
  addSection.style.display = 'none';
  loginSection.style.display = 'block';
};

// D-day 계산
function getDday(dateStr) {
  if (!dateStr) return '';
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const diff = Math.floor((target - t) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return `D-DAY`;
  return `D+${Math.abs(diff)}`;
}

// 추가 버튼
addTaskBtn.onclick = () => {
  const title = taskTitleInput.value.trim();
  const subject = taskSubjectInput.value.trim();
  const date = taskDateInput.value;
  const color = taskColorInput.value;

  if (!title || !subject || !date) {
    alert('모든 항목을 입력하세요.');
    return;
  }
  if (!isAdmin) {
    alert('관리자로 로그인해야 합니다.');
    return;
  }

  const taskData = { title, subject, date, color };
  db.ref('tasks').push(taskData);

  // 초기화
  taskTitleInput.value = '';
  taskSubjectInput.value = '';
  taskDateInput.value = '';
  taskColorInput.value = '#4a90e2';
};

// 실시간 리스너: tasks 전체
db.ref('tasks').on('value', snapshot => {
  const data = snapshot.val() || {};
  const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
  // 날짜 오름차순 정렬 (YYYY-MM-DD 양식이라 localeCompare 사용 가능)
  arr.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  // 렌더링
  taskListDiv.innerHTML = '';
  arr.forEach(item => {
    const div = document.createElement('div');
    div.className = 'task';
    div.style.backgroundColor = item.color || '#4a90e2';

    const left = document.createElement('div');
    left.innerHTML = `<strong>${escapeHtml(item.title)}</strong> [${escapeHtml(item.subject)}] - ${escapeHtml(item.date)} <span class="dd">(${getDday(item.date)})</span>`;
    div.appendChild(left);

    if (isAdmin) {
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = '삭제';
      delBtn.onclick = () => {
        if (confirm('정말 삭제할까요?')) {
          db.ref('tasks/' + item.id).remove();
        }
      };
      div.appendChild(delBtn);
    }

    taskListDiv.appendChild(div);
  });
});

// 간단한 HTML 이스케이프(보안차원)
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
