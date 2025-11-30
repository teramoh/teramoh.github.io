import './style.css';
import { questions, QUESTIONS_PER_QUIZ } from './questions.js';

// アプリの状態
let currentGrade = 1;
let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let results = [];

// DOM要素
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const gradeButtons = document.querySelectorAll('.grade-btn');
const currentGradeEl = document.getElementById('current-grade');
const questionCounterEl = document.getElementById('question-counter');
const scoreEl = document.getElementById('score');
const subjectBadgeEl = document.getElementById('subject-badge');
const questionTextEl = document.getElementById('question-text');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('result-feedback');
const resultIconEl = document.getElementById('result-icon');
const resultTextEl = document.getElementById('result-text');
const explanationEl = document.getElementById('explanation');
const nextBtn = document.getElementById('next-btn');

const finalScoreValueEl = document.getElementById('final-score-value');
const finalMessageEl = document.getElementById('final-message');
const resultDetailsEl = document.getElementById('result-details');
const retryBtn = document.getElementById('retry-btn');
const homeBtn = document.getElementById('home-btn');

// 画面切り替え
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// 配列をシャッフル
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// クイズを開始
function startQuiz(grade) {
  currentGrade = grade;
  currentQuestionIndex = 0;
  score = 0;
  results = [];
  
  // 問題をシャッフルして選択
  const gradeQuestions = questions[grade] || [];
  quizQuestions = shuffleArray(gradeQuestions).slice(0, QUESTIONS_PER_QUIZ);
  
  // UIを更新
  currentGradeEl.textContent = `${grade}年生`;
  scoreEl.textContent = '0';
  
  showScreen(quizScreen);
  displayQuestion();
}

// 問題を表示
function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  
  // カウンター更新
  questionCounterEl.textContent = `問題 ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
  
  // 教科バッジ
  subjectBadgeEl.textContent = question.subject;
  subjectBadgeEl.setAttribute('data-subject', question.subject);
  
  // 問題文
  questionTextEl.textContent = question.question;
  
  // 選択肢をシャッフルして表示
  const shuffledIndices = shuffleArray([0, 1, 2, 3]);
  
  choicesEl.innerHTML = '';
  shuffledIndices.forEach((originalIndex, displayIndex) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = question.choices[originalIndex];
    btn.dataset.index = originalIndex;
    btn.addEventListener('click', () => selectAnswer(originalIndex, btn));
    choicesEl.appendChild(btn);
  });
  
  // フィードバックを隠す
  feedbackEl.classList.add('hidden');
  feedbackEl.classList.remove('correct', 'incorrect');
}

// 回答を選択
function selectAnswer(selectedIndex, selectedBtn) {
  const question = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.answer;
  
  // すべてのボタンを無効化
  const allButtons = choicesEl.querySelectorAll('.choice-btn');
  allButtons.forEach(btn => {
    btn.disabled = true;
    const btnIndex = parseInt(btn.dataset.index);
    if (btnIndex === question.answer) {
      btn.classList.add('correct');
    } else if (btn === selectedBtn && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  // 結果を記録
  results.push({
    question: question.question,
    subject: question.subject,
    isCorrect,
    userAnswer: question.choices[selectedIndex],
    correctAnswer: question.choices[question.answer],
    explanation: question.explanation
  });
  
  // スコア更新
  if (isCorrect) {
    score++;
    scoreEl.textContent = score;
  }
  
  // フィードバック表示
  feedbackEl.classList.remove('hidden');
  feedbackEl.classList.add(isCorrect ? 'correct' : 'incorrect');
  resultIconEl.textContent = isCorrect ? '🎉' : '😢';
  resultTextEl.textContent = isCorrect ? '正解！' : '残念...';
  explanationEl.textContent = question.explanation;
  
  // 次のボタンのテキスト
  if (currentQuestionIndex === quizQuestions.length - 1) {
    nextBtn.textContent = '結果を見る';
  } else {
    nextBtn.textContent = '次の問題へ';
  }
}

// 次の問題へ
function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= quizQuestions.length) {
    showResults();
  } else {
    displayQuestion();
  }
}

// 結果を表示
function showResults() {
  showScreen(resultScreen);
  
  const percentage = Math.round((score / quizQuestions.length) * 100);
  finalScoreValueEl.textContent = `${score} / ${quizQuestions.length}`;
  
  // メッセージを設定
  let message = '';
  if (percentage === 100) {
    message = '🏆 パーフェクト！小学生レベル完璧です！';
  } else if (percentage >= 80) {
    message = '🌟 すばらしい！よく覚えていますね！';
  } else if (percentage >= 60) {
    message = '😊 まあまあですね！もう少しがんばろう！';
  } else if (percentage >= 40) {
    message = '😅 あれれ？意外と難しかった？';
  } else {
    message = '📚 小学校の復習が必要かも...';
  }
  finalMessageEl.textContent = message;
  
  // 詳細結果
  resultDetailsEl.innerHTML = '';
  results.forEach((result, index) => {
    const item = document.createElement('div');
    item.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
    item.innerHTML = `
      <span class="result-item-icon">${result.isCorrect ? '⭕' : '❌'}</span>
      <div class="result-item-text">
        <strong>Q${index + 1}.</strong> ${result.question}<br>
        ${result.isCorrect ? '' : `あなたの回答: ${result.userAnswer}<br>正解: ${result.correctAnswer}`}
      </div>
    `;
    resultDetailsEl.appendChild(item);
  });
}

// もう一度チャレンジ
function retryQuiz() {
  startQuiz(currentGrade);
}

// ホームに戻る
function goHome() {
  showScreen(startScreen);
}

// イベントリスナー
gradeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const grade = parseInt(btn.dataset.grade);
    startQuiz(grade);
  });
});

nextBtn.addEventListener('click', nextQuestion);
retryBtn.addEventListener('click', retryQuiz);
homeBtn.addEventListener('click', goHome);

// 初期化
showScreen(startScreen);
