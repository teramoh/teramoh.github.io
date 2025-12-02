import './style.css'
import { 
  pokemonData,
  getRandomPokemon, 
  getRandomCategoriesExcept,
  getRandomTypesExcept,
  getRandomPokemonExcept,
  getRandomPokemonForWeightCompare,
  getRandomPokemonForHeightCompare,
  getRandomEvolutionLine,
  getGeneration,
  getUniqueTypes,
  getUniqueAbilities,
  getPokemonById,
  starters,
  legendaryPokemon,
  evolutionLines
} from './data/pokemon.js';

// =====================================
// ゲーム状態
// =====================================
let currentQuestion = 0;
let score = 0;
let totalQuestions = 10;
let currentPokemon = null;
let currentQuestionData = null;
let answered = false;
let selectedQuizTypes = [];

// 問題タイプの定義
const QUIZ_TYPES = {
  CATEGORY: 'category',        // 分類クイズ
  TYPE: 'type',                // タイプ当てクイズ
  WEIGHT: 'weight',            // 重さ比較クイズ
  HEIGHT: 'height',            // 高さ比較クイズ
  EVOLUTION: 'evolution',      // 進化クイズ
  ABILITY: 'ability',          // 特性クイズ
  POKEDEX: 'pokedex',         // 図鑑番号クイズ
  GENERATION: 'generation',    // 世代・地方クイズ
  SILHOUETTE: 'silhouette',   // シルエットクイズ
  REVERSE: 'reverse',         // 逆引きクイズ（分類から名前）
};

// DOM要素
const app = document.getElementById('app');

// 画像URLを生成（PokeAPI公式アートワーク）
const getPokemonImageUrl = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

// =====================================
// HTML構造を初期化
// =====================================
const initializeApp = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🎮 ポケモンクイズ</h1>
        <p class="subtitle">いろんなクイズでポケモンマスターを目指そう！</p>
      </header>
      
      <div id="start-screen" class="screen">
        <div class="start-content">
          <div class="pokeball-icon">⚡</div>
          <h2>ポケモンクイズへようこそ！</h2>
          <p>様々な種類のクイズでポケモンの知識をテストしよう！</p>
          
          <div class="quiz-type-selector">
            <h3>出題タイプを選択</h3>
            <div class="quiz-types">
              <label class="quiz-type-option">
                <input type="checkbox" value="category" checked>
                <span class="quiz-type-label">📋 分類クイズ</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="type" checked>
                <span class="quiz-type-label">🔥 タイプ当て</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="silhouette" checked>
                <span class="quiz-type-label">👤 シルエット</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="weight" checked>
                <span class="quiz-type-label">⚖️ 重さ比較</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="height" checked>
                <span class="quiz-type-label">📏 高さ比較</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="evolution" checked>
                <span class="quiz-type-label">🔄 進化クイズ</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="ability" checked>
                <span class="quiz-type-label">✨ 特性クイズ</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="pokedex" checked>
                <span class="quiz-type-label">📖 図鑑番号</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="generation" checked>
                <span class="quiz-type-label">🗺️ 地方クイズ</span>
              </label>
              <label class="quiz-type-option">
                <input type="checkbox" value="reverse" checked>
                <span class="quiz-type-label">🔍 逆引き</span>
              </label>
            </div>
            <div class="select-buttons">
              <button id="select-all-btn" class="btn-small">全選択</button>
              <button id="deselect-all-btn" class="btn-small">全解除</button>
            </div>
          </div>
          
          <div class="question-count-selector">
            <label for="question-count">問題数を選択：</label>
            <select id="question-count">
              <option value="5">5問</option>
              <option value="10" selected>10問</option>
              <option value="15">15問</option>
              <option value="20">20問</option>
              <option value="30">30問</option>
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
          <span class="quiz-type-badge" id="quiz-type-badge">分類</span>
          <span class="score">スコア: <span id="score">0</span></span>
        </div>
        
        <div class="question-card">
          <div class="pokemon-display" id="pokemon-display">
            <img id="pokemon-image" src="" alt="ポケモン" class="pokemon-image" />
            <h2 id="pokemon-name" class="pokemon-name">ポケモン名</h2>
          </div>
          <p id="question-text" class="question-text">このポケモンの「ぶんるい」は？</p>
          <div id="choices" class="choices"></div>
        </div>
        
        <div id="feedback" class="feedback hidden">
          <div class="feedback-content">
            <span id="feedback-icon"></span>
            <p id="feedback-text"></p>
            <p id="feedback-detail" class="feedback-detail"></p>
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

// =====================================
// イベントリスナーの設定
// =====================================
const setupEventListeners = () => {
  document.getElementById('start-btn').addEventListener('click', startQuiz);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('retry-btn').addEventListener('click', resetQuiz);
  
  // 全選択・全解除ボタン
  document.getElementById('select-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.quiz-type-option input').forEach(cb => cb.checked = true);
  });
  document.getElementById('deselect-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.quiz-type-option input').forEach(cb => cb.checked = false);
  });
};

// =====================================
// クイズ開始
// =====================================
const startQuiz = () => {
  // 選択されたクイズタイプを取得
  selectedQuizTypes = Array.from(document.querySelectorAll('.quiz-type-option input:checked'))
    .map(cb => cb.value);
  
  if (selectedQuizTypes.length === 0) {
    alert('少なくとも1つのクイズタイプを選択してください！');
    return;
  }
  
  totalQuestions = parseInt(document.getElementById('question-count').value);
  currentQuestion = 0;
  score = 0;
  
  document.getElementById('total-questions').textContent = totalQuestions;
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  
  loadQuestion();
};

// =====================================
// 問題生成関数
// =====================================

// ランダムなクイズタイプを選択
const getRandomQuizType = () => {
  return selectedQuizTypes[Math.floor(Math.random() * selectedQuizTypes.length)];
};

// 分類クイズを生成
const generateCategoryQuestion = () => {
  const pokemon = getRandomPokemon();
  const wrongChoices = getRandomCategoriesExcept(pokemon.category, 3);
  const choices = [pokemon.category, ...wrongChoices].sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.CATEGORY,
    typeName: '分類クイズ',
    pokemon,
    question: `「${pokemon.name}」の「ぶんるい」は？`,
    choices,
    correctAnswer: pokemon.category,
    showImage: true,
    showName: true,
    silhouette: false,
    detail: `${pokemon.name}は「${pokemon.category}」です！`
  };
};

// タイプ当てクイズを生成
const generateTypeQuestion = () => {
  const pokemon = getRandomPokemon();
  const correctType = pokemon.types[0]; // メインタイプ
  const wrongChoices = getRandomTypesExcept(pokemon.types, 3);
  const choices = [correctType, ...wrongChoices].sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.TYPE,
    typeName: 'タイプ当て',
    pokemon,
    question: `「${pokemon.name}」のタイプは？${pokemon.types.length > 1 ? '（メインタイプ）' : ''}`,
    choices,
    correctAnswer: correctType,
    showImage: true,
    showName: true,
    silhouette: false,
    detail: `${pokemon.name}のタイプは「${pokemon.types.join('・')}」です！`
  };
};

// シルエットクイズを生成
const generateSilhouetteQuestion = () => {
  const pokemon = getRandomPokemon();
  const wrongPokemon = getRandomPokemonExcept(pokemon.id, 3);
  const choices = [pokemon.name, ...wrongPokemon.map(p => p.name)].sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.SILHOUETTE,
    typeName: 'シルエット',
    pokemon,
    question: 'このシルエットのポケモンは？',
    choices,
    correctAnswer: pokemon.name,
    showImage: true,
    showName: false,
    silhouette: true,
    detail: `正解は「${pokemon.name}」でした！`
  };
};

// 重さ比較クイズを生成
const generateWeightQuestion = () => {
  const pokemon = getRandomPokemon();
  const comparePokemon = getRandomPokemonForWeightCompare(pokemon);
  
  // 最も重いポケモンを見つける
  const allPokemon = [pokemon, ...comparePokemon];
  const heaviest = allPokemon.reduce((max, p) => p.weight > max.weight ? p : max);
  const choices = allPokemon.map(p => p.name).sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.WEIGHT,
    typeName: '重さ比較',
    pokemon: heaviest,
    question: 'この中で一番重いポケモンは？',
    choices,
    correctAnswer: heaviest.name,
    showImage: false,
    showName: false,
    silhouette: false,
    customDisplay: allPokemon.map(p => ({ id: p.id, name: p.name, weight: p.weight })),
    detail: `${heaviest.name}の重さは ${heaviest.weight}kg です！\n${allPokemon.map(p => `${p.name}: ${p.weight}kg`).join(' / ')}`
  };
};

// 高さ比較クイズを生成
const generateHeightQuestion = () => {
  const pokemon = getRandomPokemon();
  const comparePokemon = getRandomPokemonForHeightCompare(pokemon);
  
  // 最も高いポケモンを見つける
  const allPokemon = [pokemon, ...comparePokemon];
  const tallest = allPokemon.reduce((max, p) => p.height > max.height ? p : max);
  const choices = allPokemon.map(p => p.name).sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.HEIGHT,
    typeName: '高さ比較',
    pokemon: tallest,
    question: 'この中で一番背が高いポケモンは？',
    choices,
    correctAnswer: tallest.name,
    showImage: false,
    showName: false,
    silhouette: false,
    customDisplay: allPokemon.map(p => ({ id: p.id, name: p.name, height: p.height })),
    detail: `${tallest.name}の高さは ${tallest.height}m です！\n${allPokemon.map(p => `${p.name}: ${p.height}m`).join(' / ')}`
  };
};

// 進化クイズを生成
const generateEvolutionQuestion = () => {
  const evolutionLine = getRandomEvolutionLine();
  const baseId = evolutionLine.base;
  const basePokemon = getPokemonById(baseId);
  
  // 最終進化形を取得
  const finalId = evolutionLine.evolved[evolutionLine.evolved.length - 1];
  const finalPokemon = getPokemonById(finalId);
  
  if (!basePokemon || !finalPokemon) {
    return generateCategoryQuestion(); // フォールバック
  }
  
  // 誤答用のポケモン
  const wrongPokemon = getRandomPokemonExcept(finalId, 3)
    .filter(p => !evolutionLine.evolved.includes(p.id) && p.id !== baseId);
  
  const choices = [finalPokemon.name, ...wrongPokemon.slice(0, 3).map(p => p.name)]
    .sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.EVOLUTION,
    typeName: '進化クイズ',
    pokemon: basePokemon,
    question: `「${basePokemon.name}」の最終進化形は？`,
    choices,
    correctAnswer: finalPokemon.name,
    showImage: true,
    showName: true,
    silhouette: false,
    detail: `進化ライン: ${evolutionLine.names.join(' → ')}`
  };
};

// 特性クイズを生成
const generateAbilityQuestion = () => {
  const pokemon = getRandomPokemon();
  const correctAbility = pokemon.abilities[0];
  
  // 他のポケモンの特性から誤答を生成
  const allAbilities = getUniqueAbilities();
  const wrongAbilities = allAbilities
    .filter(a => !pokemon.abilities.includes(a))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const choices = [correctAbility, ...wrongAbilities].sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.ABILITY,
    typeName: '特性クイズ',
    pokemon,
    question: `「${pokemon.name}」の特性は？`,
    choices,
    correctAnswer: correctAbility,
    showImage: true,
    showName: true,
    silhouette: false,
    detail: `${pokemon.name}の特性は「${pokemon.abilities.join('」または「')}」です！`
  };
};

// 図鑑番号クイズを生成
const generatePokedexQuestion = () => {
  const pokemon = getRandomPokemon();
  
  // 近い番号を誤答に
  const wrongIds = [];
  const offset = [10, -10, 25, -25, 50, -50];
  for (const o of offset) {
    const wrongId = pokemon.id + o;
    if (wrongId >= 1 && wrongId <= 386 && wrongIds.length < 3) {
      wrongIds.push(wrongId);
    }
  }
  
  const choices = [pokemon.id, ...wrongIds]
    .map(id => `No.${String(id).padStart(3, '0')}`)
    .sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.POKEDEX,
    typeName: '図鑑番号',
    pokemon,
    question: `「${pokemon.name}」の図鑑番号は？`,
    choices,
    correctAnswer: `No.${String(pokemon.id).padStart(3, '0')}`,
    showImage: true,
    showName: true,
    silhouette: false,
    detail: `${pokemon.name}の図鑑番号は No.${String(pokemon.id).padStart(3, '0')} です！`
  };
};

// 世代・地方クイズを生成
const generateGenerationQuestion = () => {
  const pokemon = getRandomPokemon();
  const genInfo = getGeneration(pokemon.id);
  
  const regions = ['カントー', 'ジョウト', 'ホウエン'];
  const choices = regions.sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.GENERATION,
    typeName: '地方クイズ',
    pokemon,
    question: `「${pokemon.name}」が登場した地方は？`,
    choices,
    correctAnswer: genInfo.region,
    showImage: true,
    showName: true,
    silhouette: false,
    detail: `${pokemon.name}は第${genInfo.gen}世代（${genInfo.region}地方）のポケモンです！`
  };
};

// 逆引きクイズを生成（分類から名前を当てる）
const generateReverseQuestion = () => {
  const pokemon = getRandomPokemon();
  const wrongPokemon = getRandomPokemonExcept(pokemon.id, 3);
  const choices = [pokemon.name, ...wrongPokemon.map(p => p.name)].sort(() => Math.random() - 0.5);
  
  return {
    type: QUIZ_TYPES.REVERSE,
    typeName: '逆引き',
    pokemon,
    question: `「${pokemon.category}」といえば、どのポケモン？`,
    choices,
    correctAnswer: pokemon.name,
    showImage: false,
    showName: false,
    silhouette: false,
    categoryDisplay: pokemon.category,
    detail: `「${pokemon.category}」は${pokemon.name}です！`
  };
};

// 問題を生成
const generateQuestion = (type) => {
  switch (type) {
    case QUIZ_TYPES.CATEGORY:
      return generateCategoryQuestion();
    case QUIZ_TYPES.TYPE:
      return generateTypeQuestion();
    case QUIZ_TYPES.SILHOUETTE:
      return generateSilhouetteQuestion();
    case QUIZ_TYPES.WEIGHT:
      return generateWeightQuestion();
    case QUIZ_TYPES.HEIGHT:
      return generateHeightQuestion();
    case QUIZ_TYPES.EVOLUTION:
      return generateEvolutionQuestion();
    case QUIZ_TYPES.ABILITY:
      return generateAbilityQuestion();
    case QUIZ_TYPES.POKEDEX:
      return generatePokedexQuestion();
    case QUIZ_TYPES.GENERATION:
      return generateGenerationQuestion();
    case QUIZ_TYPES.REVERSE:
      return generateReverseQuestion();
    default:
      return generateCategoryQuestion();
  }
};

// =====================================
// 問題を読み込み
// =====================================
const loadQuestion = () => {
  answered = false;
  currentQuestion++;
  
  document.getElementById('current-question').textContent = currentQuestion;
  document.getElementById('score').textContent = score;
  
  // プログレスバー更新
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
  
  // ランダムなクイズタイプで問題を生成
  const quizType = getRandomQuizType();
  currentQuestionData = generateQuestion(quizType);
  currentPokemon = currentQuestionData.pokemon;
  
  // クイズタイプバッジを更新
  document.getElementById('quiz-type-badge').textContent = currentQuestionData.typeName;
  
  // 表示を更新
  const pokemonDisplay = document.getElementById('pokemon-display');
  const pokemonImage = document.getElementById('pokemon-image');
  const pokemonName = document.getElementById('pokemon-name');
  
  // カスタム表示（重さ・高さ比較）
  if (currentQuestionData.customDisplay) {
    pokemonDisplay.innerHTML = `
      <div class="compare-grid">
        ${currentQuestionData.customDisplay.map(p => `
          <div class="compare-item">
            <img src="${getPokemonImageUrl(p.id)}" alt="${p.name}" class="compare-image" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><text y=\\'.9em\\' font-size=\\'90\\'>❓</text></svg>'">
            <span class="compare-name">${p.name}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  // 逆引きクイズ（分類を大きく表示）
  else if (currentQuestionData.categoryDisplay) {
    pokemonDisplay.innerHTML = `
      <div class="category-display">
        <span class="category-label">${currentQuestionData.categoryDisplay}</span>
      </div>
    `;
  }
  // 通常表示
  else {
    pokemonDisplay.innerHTML = `
      <img id="pokemon-image" src="" alt="ポケモン" class="pokemon-image ${currentQuestionData.silhouette ? 'silhouette' : ''}" />
      <h2 id="pokemon-name" class="pokemon-name">${currentQuestionData.showName ? currentPokemon.name : '???'}</h2>
    `;
    
    const newImage = document.getElementById('pokemon-image');
    if (currentQuestionData.showImage) {
      newImage.src = getPokemonImageUrl(currentPokemon.id);
      newImage.onerror = () => {
        newImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">❓</text></svg>';
      };
    }
  }
  
  // 問題文を設定
  document.getElementById('question-text').textContent = currentQuestionData.question;
  
  // 選択肢を生成
  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = currentQuestionData.choices.map(choice => `
    <button class="choice-btn" data-answer="${choice}">${choice}</button>
  `).join('');
  
  // 選択肢のクリックイベント
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
  });
  
  // フィードバックと次へボタンを隠す
  document.getElementById('feedback').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
};

// =====================================
// 回答処理
// =====================================
const handleAnswer = (selectedAnswer) => {
  if (answered) return;
  answered = true;
  
  const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
  
  if (isCorrect) {
    score++;
    document.getElementById('score').textContent = score;
  }
  
  // シルエットの場合、正解時に画像を表示
  if (currentQuestionData.silhouette) {
    const silhouetteImage = document.querySelector('.silhouette');
    if (silhouetteImage) {
      silhouetteImage.classList.remove('silhouette');
    }
    const nameElement = document.getElementById('pokemon-name');
    if (nameElement) {
      nameElement.textContent = currentPokemon.name;
    }
  }
  
  // 選択肢のスタイル更新
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.answer === currentQuestionData.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  // フィードバック表示
  const feedback = document.getElementById('feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackDetail = document.getElementById('feedback-detail');
  
  feedback.classList.remove('hidden');
  feedback.classList.remove('correct', 'incorrect');
  
  if (isCorrect) {
    feedback.classList.add('correct');
    feedbackIcon.textContent = '🎉';
    feedbackText.textContent = '正解！すごい！';
  } else {
    feedback.classList.add('incorrect');
    feedbackIcon.textContent = '😢';
    feedbackText.textContent = `残念... 正解は「${currentQuestionData.correctAnswer}」でした`;
  }
  
  feedbackDetail.textContent = currentQuestionData.detail || '';
  
  // 次へボタンまたは結果画面へ
  if (currentQuestion < totalQuestions) {
    document.getElementById('next-btn').classList.remove('hidden');
  } else {
    setTimeout(showResult, 1500);
  }
};

// =====================================
// 次の問題へ
// =====================================
const nextQuestion = () => {
  loadQuestion();
};

// =====================================
// 結果表示
// =====================================
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

// =====================================
// リセット
// =====================================
const resetQuiz = () => {
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
};

// アプリ初期化
initializeApp();
