// 亲子答题题库
const quizQuestions = [
    { q: "你最喜欢和爸爸妈妈做什么？", a: ["一起玩游戏", "一起看书", "一起做饭", "一起散步"] },
    { q: "你觉得家里谁最会讲故事？", a: ["爸爸", "妈妈", "爷爷奶奶", "其他"] },
    { q: "你遇到困难时会怎么做？", a: ["自己想办法", "找家人帮忙", "问老师", "不理会"] }
];
// 性格测评题库
const testQuestions = [
    { q: "你喜欢独自玩耍还是和小伙伴一起？", a: ["独自玩耍", "和小伙伴一起"] },
    { q: "遇到新朋友你会主动打招呼吗？", a: ["会", "不会"] },
    { q: "你喜欢尝试新事物吗？", a: ["喜欢", "不喜欢"] }
];

let quizIdx = 0, testIdx = 0, quizScore = 0, testScore = 0;

function showTab(tab) {
    document.getElementById('quizTab').style.display = tab === 'quiz' ? '' : 'none';
    document.getElementById('testTab').style.display = tab === 'test' ? '' : 'none';
    document.getElementById('puzzleTab').style.display = tab === 'puzzle' ? '' : 'none';
    document.getElementById('planeTab').style.display = tab === 'plane' ? '' : 'none';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[tab === 'quiz' ? 0 : tab === 'test' ? 1 : tab === 'puzzle' ? 2 : 3].classList.add('active');
}

function renderQuiz() {
    const area = document.getElementById('quizArea');
    const btn = document.getElementById('nextQuizBtn');
    const result = document.getElementById('quizResult');
    if (quizIdx >= quizQuestions.length) {
        area.innerHTML = '';
        btn.style.display = 'none';
        result.innerHTML = `<b>答题结束！感谢参与亲子互动！</b>`;
        return;
    }
    const q = quizQuestions[quizIdx];
    area.innerHTML = `<div><b>Q${quizIdx+1}：${q.q}</b></div>` +
        q.a.map((opt, i) => `<div><input type="radio" name="quizOpt" value="${i}"> ${opt}</div>`).join('');
    btn.style.display = '';
    result.innerHTML = '';
}
function nextQuiz() {
    const checked = document.querySelector('input[name=quizOpt]:checked');
    if (!checked) return alert('请选择一个答案');
    quizIdx++;
    renderQuiz();
}
document.getElementById('nextQuizBtn').onclick = nextQuiz;
renderQuiz();

// 性格测评
function renderTest() {
    const area = document.getElementById('testArea');
    const btn = document.getElementById('nextTestBtn');
    const result = document.getElementById('testResult');
    if (testIdx >= testQuestions.length) {
        area.innerHTML = '';
        btn.style.display = 'none';
        result.innerHTML = `<b>测评结束！你是一个${testScore >= 2 ? '外向' : '内向'}型小朋友！</b>`;
        return;
    }
    const q = testQuestions[testIdx];
    area.innerHTML = `<div><b>Q${testIdx+1}：${q.q}</b></div>` +
        q.a.map((opt, i) => `<div><input type="radio" name="testOpt" value="${i}"> ${opt}</div>`).join('');
    btn.style.display = '';
    result.innerHTML = '';
}
function nextTest() {
    const checked = document.querySelector('input[name=testOpt]:checked');
    if (!checked) return alert('请选择一个答案');
    if (checked.value == 1) testScore++; // 简单计分
    testIdx++;
    renderTest();
}
document.getElementById('nextTestBtn').onclick = nextTest;

document.getElementById('quizArea').onclick = function(e) {
    if (e.target.name === 'quizOpt') document.getElementById('nextQuizBtn').focus();
};
document.getElementById('testArea').onclick = function(e) {
    if (e.target.name === 'testOpt') document.getElementById('nextTestBtn').focus();
};

function resetQuiz() { quizIdx = 0; renderQuiz(); }
function resetTest() { testIdx = 0; testScore = 0; renderTest(); }

showTab('quiz');
renderTest();

// ===== 拼图游戏 =====
let puzzleSize = 3, puzzleArr = [], emptyIdx = null;
const puzzleImg = '/photo/img1.jpg'; // 这里用你static目录下的图片路径

function createPuzzle() {
  puzzleArr = Array.from({length: puzzleSize*puzzleSize}, (_,i)=>i);
  shuffle(puzzleArr);
  emptyIdx = puzzleArr.indexOf(puzzleSize*puzzleSize-1);
  renderPuzzle();
}

function renderPuzzle() {
  const board = document.getElementById('puzzleBoard');
  board.innerHTML = '';
  for(let i=0;i<puzzleArr.length;i++) {
    const idx = puzzleArr[i];
    const tile = document.createElement('div');
    tile.style.background = idx === puzzleSize*puzzleSize-1 ? '#eee' : `url(${puzzleImg})`;
    tile.style.backgroundSize = `${puzzleSize*100}px ${puzzleSize*100}px`;
    tile.style.backgroundPosition = idx === puzzleSize*puzzleSize-1 ? '' :
      `-${(idx%puzzleSize)*100}px -${Math.floor(idx/puzzleSize)*100}px`;
    tile.style.width = tile.style.height = '100px';
    tile.style.cursor = idx === puzzleSize*puzzleSize-1 ? 'default' : 'pointer';
    tile.onclick = ()=>movePuzzle(i);
    board.appendChild(tile);
  }
}

function movePuzzle(i) {
  if(isNeighbor(i, emptyIdx)) {
    [puzzleArr[i], puzzleArr[emptyIdx]] = [puzzleArr[emptyIdx], puzzleArr[i]];
    emptyIdx = i;
    renderPuzzle();
    if(isSolved()) document.getElementById('puzzleMsg').innerText = '拼图成功！';
    else document.getElementById('puzzleMsg').innerText = '';
  }
}

function isNeighbor(i, j) {
  const x1 = i%puzzleSize, y1 = Math.floor(i/puzzleSize);
  const x2 = j%puzzleSize, y2 = Math.floor(j/puzzleSize);
  return (Math.abs(x1-x2)+Math.abs(y1-y2))===1;
}

function isSolved() {
  return puzzleArr.every((v,i)=>v===i);
}

function shuffle(arr) {
  for(let i=arr.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function resetPuzzle() {
  document.getElementById('puzzleMsg').innerText = '';
  createPuzzle();
}

// 初始化
if(document.getElementById('puzzleBoard')) resetPuzzle();

// ===== 打飞机游戏 =====
let planeGame, planeCtx, plane, bullets, enemies, score, planeTimer, planeOver;

function startPlaneGame() {
  planeGame = document.getElementById('planeGame');
  planeCtx = planeGame.getContext('2d');
  plane = { x: 140, y: 400, w: 40, h: 40 };
  bullets = [];
  enemies = [];
  score = 0;
  planeOver = false;
  document.getElementById('planeScore').innerText = '得分: 0';
  document.getElementById('planeMsg').innerText = '';
  if (planeTimer) clearInterval(planeTimer);
  planeTimer = setInterval(planeLoop, 20);
  document.activeElement.blur(); // 让按钮失去焦点
}

function planeLoop() {
  // 移动子弹
  bullets.forEach(b => b.y -= 8);
  bullets = bullets.filter(b => b.y > -10);

  // 生成敌机
  if (Math.random() < 0.04) {
    enemies.push({ x: Math.random() * 280, y: -40, w: 40, h: 40, speed: 2 + Math.random() * 2 });
  }
  // 移动敌机
  enemies.forEach(e => e.y += e.speed);
  enemies = enemies.filter(e => e.y < 500);

  // 碰撞检测
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    // 子弹打中敌机
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (b.x < e.x + e.w && b.x + 6 > e.x && b.y < e.y + e.h && b.y + 12 > e.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        document.getElementById('planeScore').innerText = '得分: ' + score;
        break;
      }
    }
    // 敌机撞到飞机
    if (e.x < plane.x + plane.w && e.x + e.w > plane.x && e.y < plane.y + plane.h && e.y + e.h > plane.y) {
      gameOver();
      return;
    }
  }

  // 绘制
  planeCtx.clearRect(0, 0, 320, 480);
  // 飞机
  planeCtx.fillStyle = '#0ff';
  planeCtx.fillRect(plane.x, plane.y, plane.w, plane.h);
  // 子弹
  planeCtx.fillStyle = '#ff0';
  bullets.forEach(b => planeCtx.fillRect(b.x, b.y, 6, 12));
  // 敌机
  planeCtx.fillStyle = '#f44';
  enemies.forEach(e => planeCtx.fillRect(e.x, e.y, e.w, e.h));
}

function gameOver() {
  clearInterval(planeTimer);
  planeOver = true;
  document.getElementById('planeMsg').innerText = '游戏结束！最终得分：' + score;
}

// 键盘控制
document.addEventListener('keydown', function(e) {
  if (!planeGame || planeOver) return;
  if (e.key === 'ArrowLeft' && plane.x > 0) plane.x -= 20;
  if (e.key === 'ArrowRight' && plane.x < 280) plane.x += 20;
  if (e.key === 'ArrowUp' && plane.y > 0) plane.y -= 20;
  if (e.key === 'ArrowDown' && plane.y < 440) plane.y += 20;
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    bullets.push({ x: plane.x + 17, y: plane.y - 10 });
  }
});