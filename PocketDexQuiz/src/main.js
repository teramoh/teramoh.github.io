import './style.css'
import { getRandomPokemon, getRandomCategoriesExcept } from './data/pokemon.js';

// ゲーム状態
let currentQuestion = 0;
let score = 0;
let totalQuestions = 10;
let currentPokemon = null;
let answered = false;

// DOM要素
const app = document.getElementById('app');

// 画像URLを生成（公式図鑑の画像形式）
const getPokemonImageUrl = (id) => {
  const paddedId = String(id).padStart(4, '0');
  return `https://zukan.pokemon.co.jp/zukan-api/up/images/index/${paddedId}.png`;
};

// HTML構造を初期化
const initializeApp = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🎮 ポケモン分類クイズ</h1>
        <p class="subtitle">ポケモンの「ぶんるい」を当てよう！</p>
      </header>
      
      <div id="start-screen" class="screen">
        <div class="start-content">
          <div class="pokeball-icon">⚡</div>
          <h2>ポケモン分類クイズへようこそ！</h2>
          <p>ポケモンの名前を見て、正しい「ぶんるい」を選んでね！</p>
          <p class="example">例：ピカチュウ → ねずみポケモン</p>
          <div class="question-count-selector">
            <label for="question-count">問題数を選択：</label>
            <select id="question-count">
              <option value="5">5問</option>
              <option value="10" selected>10問</option>
              <option value="15">15問</option>
              <option value="20">20問</option>
            </select>
          </div>
          <button id="start-btn" class="btn btn-primary">クイズをはじめる！</button>
        </div>
      </div>
      
      <div id="quiz-screen" class="screen hidden">
        <div class="progress-bar">
          <div id="progress" class="progress"></div>
        </div>
        <div class="score-display">
          <span id="current-question">1</span> / <span id="total-questions">10</span>
          <span class="score">スコア: <span id="score">0</span></span>
        </div>
        
        <div class="question-card">
          <div class="pokemon-display">
            <img id="pokemon-image" src="" alt="ポケモン" class="pokemon-image" />
            <h2 id="pokemon-name" class="pokemon-name">ポケモン名</h2>
          </div>
          <p class="question-text">このポケモンの「ぶんるい」は？</p>
          <div id="choices" class="choices"></div>
        </div>
        
        <div id="feedback" class="feedback hidden">
          <div class="feedback-content">
            <span id="feedback-icon"></span>
            <p id="feedback-text"></p>
          </div>
        </div>
        
        <button id="next-btn" class="btn btn-secondary hidden">次の問題へ</button>
      </div>
      
      <div id="result-screen" class="screen hidden">
        <div class="result-content">
          <h2 id="result-title">結果発表！</h2>
          <div class="result-score">
            <span id="final-score">0</span> / <span id="final-total">10</span>
          </div>
          <p id="result-message"></p>
          <div id="result-stars" class="result-stars"></div>
          <button id="retry-btn" class="btn btn-primary">もう一度挑戦する</button>
        </div>
      </div>
      
      <footer>
        <p>ポケモンの情報は<a href="https://zukan.pokemon.co.jp/" target="_blank" rel="noopener">ポケモンずかん公式サイト</a>を参考にしています</p>
        <p class="copyright">©2025 Pokémon. ©1995-2025 Nintendo/Creatures Inc./GAME FREAK inc.</p>
      </footer>
    </div>
  `;
  
  setupEventListeners();
};

// イベントリスナーの設定
const setupEventListeners = () => {
  document.getElementById('start-btn').addEventListener('click', startQuiz);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('retry-btn').addEventListener('click', resetQuiz);
};

// クイズ開始
const startQuiz = () => {
  totalQuestions = parseInt(document.getElementById('question-count').value);
  currentQuestion = 0;
  score = 0;
  
  document.getElementById('total-questions').textContent = totalQuestions;
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  
  loadQuestion();
};

// 問題を読み込み
const loadQuestion = () => {
  answered = false;
  currentQuestion++;
  
  document.getElementById('current-question').textContent = currentQuestion;
  document.getElementById('score').textContent = score;
  
  // プログレスバー更新
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
  
  // ランダムなポケモンを選択
  currentPokemon = getRandomPokemon();
  
  // ポケモン情報を表示
  document.getElementById('pokemon-name').textContent = currentPokemon.name;
  
  // 画像を設定（エラー時はプレースホルダー）
  const pokemonImage = document.getElementById('pokemon-image');
  pokemonImage.src = getPokemonImageUrl(currentPokemon.id);
  pokemonImage.onerror = () => {
    pokemonImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">❓</text></svg>';
  };
  
  // 選択肢を生成
  const wrongCategories = getRandomCategoriesExcept(currentPokemon.category, 3);
  const allChoices = [currentPokemon.category, ...wrongCategories];
  const shuffledChoices = allChoices.sort(() => Math.random() - 0.5);
  
  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = shuffledChoices.map(choice => `
    <button class="choice-btn" data-category="${choice}">${choice}</button>
  `).join('');
  
  // 選択肢のクリックイベント
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.category));
  });
  
  // フィードバックと次へボタンを隠す
  document.getElementById('feedback').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
};

// 回答処理
const handleAnswer = (selectedCategory) => {
  if (answered) return;
  answered = true;
  
  const isCorrect = selectedCategory === currentPokemon.category;
  
  if (isCorrect) {
    score++;
    document.getElementById('score').textContent = score;
  }
  
  // 選択肢のスタイル更新
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.category === currentPokemon.category) {
      btn.classList.add('correct');
    } else if (btn.dataset.category === selectedCategory && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  // フィードバック表示
  const feedback = document.getElementById('feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  
  feedback.classList.remove('hidden');
  feedback.classList.remove('correct', 'incorrect');
  
  if (isCorrect) {
    feedback.classList.add('correct');
    feedbackIcon.textContent = '🎉';
    feedbackText.textContent = '正解！すごい！';
  } else {
    feedback.classList.add('incorrect');
    feedbackIcon.textContent = '😢';
    feedbackText.textContent = `残念... 正解は「${currentPokemon.category}」でした`;
  }
  
  // 次へボタンまたは結果画面へ
  if (currentQuestion < totalQuestions) {
    document.getElementById('next-btn').classList.remove('hidden');
  } else {
    setTimeout(showResult, 1500);
  }
};

// 次の問題へ
const nextQuestion = () => {
  loadQuestion();
};

// 結果表示
const showResult = () => {
  document.getElementById('quiz-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  
  const percentage = (score / totalQuestions) * 100;
  
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-total').textContent = totalQuestions;
  
  let message = '';
  let stars = 0;
  
  if (percentage === 100) {
    message = '完璧！ポケモン博士レベル！🏆';
    stars = 5;
  } else if (percentage >= 80) {
    message = 'すばらしい！ポケモンマスターに近づいてる！✨';
    stars = 4;
  } else if (percentage >= 60) {
    message = 'なかなかの成績！もっと頑張ろう！💪';
    stars = 3;
  } else if (percentage >= 40) {
    message = 'もう少し！ポケモン図鑑をチェックしよう！📖';
    stars = 2;
  } else {
    message = 'ポケモンの世界をもっと探検しよう！🌟';
    stars = 1;
  }
  
  document.getElementById('result-message').textContent = message;
  document.getElementById('result-stars').innerHTML = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
};

// リセット
const resetQuiz = () => {
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
};

// アプリ初期化
initializeApp();
