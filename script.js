// 1) Firebase 설정 - 본인 Firebase 콘솔에서 복사한 설정 넣기
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2) 관리자 비밀번호
const ADMIN_PASSWORD = "1234"; // 원하는 비밀번호로 바꾸세요

// 3) DOM 요소들
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

// 4) 로그인 함수
loginBtn.onclick = () => {
  if(adminPassInput.value === ADMIN_PASSWORD){
    isAdmin = true;
    loginSection.style.display = 'none';
    addSection.style.display = 'block';
    adminPassInput.value = '';
  } else {
    alert('비밀번호가 틀렸습니다.');
  }
};

// 5) 로그아웃 함수
logoutBtn.onclick = () => {
  isAdmin = false;
  addSection.style.display = 'none';
  loginSection.style.display = 'block';
};

// 6) D-day 계산 함수
function getDday(dateStr) {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y,m,d] = dateStr.split('-').map(Number);
  const target = new Date(y,m-1,d);
  const diff = Math.floor((target - t) / (1000*60*60*24));
  if(diff > 0) return `D-${diff}`;
  if(diff === 0) return `D-DAY`;
  return `D+${Math.abs(diff)}`;
}

// 7) 수행평가 추가 함수
addTaskBtn.onclick = () => {
  const title = taskTitleInput.value.trim();
  const subject = taskSubjectInput.value.trim();
  const date = taskDateInput.value;
  const color = taskColorInput.value;

  if(!title || !subject || !date){
    alert('모든 항목을 입력하세요.');
    return;
  }

  if(!isAdmin){
    alert('관리자만 추가할 수 있습니다.');
    return;
  }

  // 데이터 객체 생성
  const taskData = {
    title,
    subject,
    date,
    color
  };

  // Firebase Realtime DB에 저장 (push로 고유키 자동생성)
  db.ref('tasks').push(taskData);

  // 입력 초기화
  taskTitleInput.value = '';
  taskSubjectInput.value = '';
  taskDateInput.value = '';
  taskColorInput.value = '#4a90e2';
};

// 8) 실시간 수행평가 목록 불러오기 & 렌더링
db.ref('tasks').on('value', snapshot => {
  const data = snapshot.val();
  const arr = [];

  for(const key in data){
    arr.push({ id: key, ...data[key] });
  }

  // 날짜 오름차순 정렬
  arr.sort((a,b) => a.date.localeCompare(b.date));

  // 목록 렌더링
  taskListDiv.innerHTML = '';
  arr.forEach(item => {
    const div = document.createElement('div');
    div.className = 'task';
    div.style.backgroundColor = item.color || '#4a90e2';

    // 제목 + 과목 + 마감일 + D-day
    div.innerHTML = `
      <div>
        <strong>${item.title}</strong> [${item.subject}] - ${item.date} (${getDday(item.date)})
      </div>
    `;

    // 관리자면 삭제 버튼 추가
    if(isAdmin){
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = '삭제';
      delBtn.onclick = () => {
        if(confirm('정말 삭제할까요?')){
          db.ref('tasks/' + item.id).remove();
        }
      };
      div.appendChild(delBtn);
    }

    taskListDiv.appendChild(div);
  });
});
