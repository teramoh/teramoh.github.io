// ポケモンタイプ相性データ
const types = [
    'ノーマル', 'ほのお', 'みず', 'くさ', 'でんき', 'こおり',
    'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
    'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
];

const typeClasses = {
    'ノーマル': 'type-normal',
    'ほのお': 'type-fire',
    'みず': 'type-water',
    'でんき': 'type-electric',
    'くさ': 'type-grass',
    'こおり': 'type-ice',
    'かくとう': 'type-fighting',
    'どく': 'type-poison',
    'じめん': 'type-ground',
    'ひこう': 'type-flying',
    'エスパー': 'type-psychic',
    'むし': 'type-bug',
    'いわ': 'type-rock',
    'ゴースト': 'type-ghost',
    'ドラゴン': 'type-dragon',
    'あく': 'type-dark',
    'はがね': 'type-steel',
    'フェアリー': 'type-fairy'
};

// タイプ相性表 (攻撃タイプ -> 防御タイプ -> 倍率)
// 1 = 等倍, 2 = 効果抜群, 0.5 = いまひとつ, 0 = 効果なし
const typeChart = {
    'ノーマル': { 'いわ': 0.5, 'ゴースト': 0, 'はがね': 0.5 },
    'ほのお': { 'ほのお': 0.5, 'みず': 0.5, 'くさ': 2, 'こおり': 2, 'むし': 2, 'いわ': 0.5, 'ドラゴン': 0.5, 'はがね': 2 },
    'みず': { 'ほのお': 2, 'みず': 0.5, 'くさ': 0.5, 'じめん': 2, 'いわ': 2, 'ドラゴン': 0.5 },
    'でんき': { 'みず': 2, 'でんき': 0.5, 'くさ': 0.5, 'じめん': 0, 'ひこう': 2, 'ドラゴン': 0.5 },
    'くさ': { 'ほのお': 0.5, 'みず': 2, 'くさ': 0.5, 'どく': 0.5, 'じめん': 2, 'ひこう': 0.5, 'むし': 0.5, 'いわ': 2, 'ドラゴン': 0.5, 'はがね': 0.5 },
    'こおり': { 'ほのお': 0.5, 'みず': 0.5, 'くさ': 2, 'こおり': 0.5, 'じめん': 2, 'ひこう': 2, 'ドラゴン': 2, 'はがね': 0.5 },
    'かくとう': { 'ノーマル': 2, 'こおり': 2, 'どく': 0.5, 'ひこう': 0.5, 'エスパー': 0.5, 'むし': 0.5, 'いわ': 2, 'ゴースト': 0, 'あく': 2, 'はがね': 2, 'フェアリー': 0.5 },
    'どく': { 'くさ': 2, 'どく': 0.5, 'じめん': 0.5, 'いわ': 0.5, 'ゴースト': 0.5, 'はがね': 0, 'フェアリー': 2 },
    'じめん': { 'ほのお': 2, 'でんき': 2, 'くさ': 0.5, 'どく': 2, 'ひこう': 0, 'むし': 0.5, 'いわ': 2, 'はがね': 2 },
    'ひこう': { 'でんき': 0.5, 'くさ': 2, 'かくとう': 2, 'むし': 2, 'いわ': 0.5, 'はがね': 0.5 },
    'エスパー': { 'かくとう': 2, 'どく': 2, 'エスパー': 0.5, 'あく': 0, 'はがね': 0.5 },
    'むし': { 'ほのお': 0.5, 'くさ': 2, 'かくとう': 0.5, 'どく': 0.5, 'ひこう': 0.5, 'エスパー': 2, 'ゴースト': 0.5, 'あく': 2, 'はがね': 0.5, 'フェアリー': 0.5 },
    'いわ': { 'ほのお': 2, 'こおり': 2, 'かくとう': 0.5, 'じめん': 0.5, 'ひこう': 2, 'むし': 2, 'はがね': 0.5 },
    'ゴースト': { 'ノーマル': 0, 'エスパー': 2, 'ゴースト': 2, 'あく': 0.5 },
    'ドラゴン': { 'ドラゴン': 2, 'はがね': 0.5, 'フェアリー': 0 },
    'あく': { 'かくとう': 0.5, 'エスパー': 2, 'ゴースト': 2, 'あく': 0.5, 'フェアリー': 0.5 },
    'はがね': { 'ほのお': 0.5, 'みず': 0.5, 'でんき': 0.5, 'こおり': 2, 'いわ': 2, 'はがね': 0.5, 'フェアリー': 2 },
    'フェアリー': { 'ほのお': 0.5, 'かくとう': 2, 'どく': 0.5, 'ドラゴン': 2, 'あく': 2, 'はがね': 0.5 }
};

// ゲーム状態
let gameState = {
    difficulty: 'easy',
    totalQuestions: 10,
    currentQuestion: 0,
    score: 0,
    questions: [],
    answered: false
};

// DOM要素
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const attackType = document.getElementById('attack-type');
const defenseType = document.getElementById('defense-type');
const answerBtns = document.querySelectorAll('.answer-btn');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackModalContent = feedbackModal.querySelector('.feedback-modal-content');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const homeBtn = document.getElementById('home-btn');
const showChartBtn = document.getElementById('show-chart-btn');
const closeChartBtn = document.getElementById('close-chart-btn');
const typeChartModal = document.getElementById('type-chart-modal');

// 相性を取得
function getEffectiveness(attackType, defenseType) {
    if (typeChart[attackType] && typeChart[attackType][defenseType] !== undefined) {
        return typeChart[attackType][defenseType];
    }
    return 1; // デフォルトは等倍
}

// 問題を生成
function generateQuestions(count) {
    const questions = [];
    const usedCombinations = new Set();

    // 特徴的な相性を優先的に含める
    const specialCombinations = [];
    
    for (const atk of types) {
        for (const def of types) {
            const effect = getEffectiveness(atk, def);
            if (effect !== 1) {
                specialCombinations.push({ attack: atk, defense: def, effect: effect });
            }
        }
    }

    // シャッフル
    shuffleArray(specialCombinations);

    // 特徴的な相性から問題を追加
    for (const combo of specialCombinations) {
        if (questions.length >= count) break;
        const key = `${combo.attack}-${combo.defense}`;
        if (!usedCombinations.has(key)) {
            questions.push(combo);
            usedCombinations.add(key);
        }
    }

    // 足りない場合はランダムで追加（等倍も含む）
    while (questions.length < count) {
        const atk = types[Math.floor(Math.random() * types.length)];
        const def = types[Math.floor(Math.random() * types.length)];
        const key = `${atk}-${def}`;
        
        if (!usedCombinations.has(key)) {
            questions.push({
                attack: atk,
                defense: def,
                effect: getEffectiveness(atk, def)
            });
            usedCombinations.add(key);
        }
    }

    shuffleArray(questions);
    return questions;
}

// 配列をシャッフル
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 画面切り替え
function showScreen(screen) {
    startScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    screen.classList.add('active');
}

// ゲーム開始
function startGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.totalQuestions = difficulty === 'easy' ? 10 : difficulty === 'normal' ? 15 : 20;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.questions = generateQuestions(gameState.totalQuestions);
    gameState.answered = false;

    document.getElementById('total-questions').textContent = gameState.totalQuestions;
    document.getElementById('max-score').textContent = gameState.totalQuestions;
    
    showScreen(quizScreen);
    showQuestion();
}

// 問題を表示
function showQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    
    // タイプバッジを更新
    attackType.textContent = question.attack;
    attackType.className = `type-badge ${typeClasses[question.attack]}`;
    
    defenseType.textContent = question.defense;
    defenseType.className = `type-badge ${typeClasses[question.defense]}`;
    
    // UI更新
    document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
    document.getElementById('current-score').textContent = gameState.score;
    
    // プログレスバー更新
    const progress = (gameState.currentQuestion / gameState.totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // ボタンをリセット
    answerBtns.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // フィードバックモーダルを非表示
    feedbackModal.classList.add('hidden');
    gameState.answered = false;
}

// 回答をチェック
function checkAnswer(selectedEffect) {
    if (gameState.answered) return;
    gameState.answered = true;

    const question = gameState.questions[gameState.currentQuestion];
    const correctEffect = question.effect;
    const isCorrect = parseFloat(selectedEffect) === correctEffect;

    // ボタンの状態を更新
    answerBtns.forEach(btn => {
        btn.disabled = true;
        const btnEffect = parseFloat(btn.dataset.effect);
        
        if (btnEffect === correctEffect) {
            btn.classList.add('correct');
        } else if (btnEffect === parseFloat(selectedEffect) && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // スコア更新
    if (isCorrect) {
        gameState.score++;
        document.getElementById('current-score').textContent = gameState.score;
    }

    // フィードバック表示
    showFeedback(isCorrect, correctEffect);
}

// フィードバックをモーダルで表示
function showFeedback(isCorrect, correctEffect) {
    feedbackModalContent.classList.remove('correct', 'wrong');
    feedbackModalContent.classList.add(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
        feedbackIcon.textContent = '🎉';
        feedbackText.textContent = '正解！すばらしい！';
    } else {
        feedbackIcon.textContent = '😢';
        const effectText = getEffectText(correctEffect);
        feedbackText.textContent = `残念... 正解は「${effectText}」でした`;
    }

    // 最後の問題かどうかでボタンテキストを変更
    if (gameState.currentQuestion >= gameState.totalQuestions - 1) {
        nextBtn.textContent = '結果を見る →';
    } else {
        nextBtn.textContent = '次の問題 →';
    }

    // モーダルを表示
    feedbackModal.classList.remove('hidden');
}

// 効果テキストを取得
function getEffectText(effect) {
    switch (effect) {
        case 2: return '効果はばつぐん！（2倍）';
        case 1: return '普通（1倍）';
        case 0.5: return '効果はいまひとつ（0.5倍）';
        case 0: return '効果がない（0倍）';
        default: return '普通（1倍）';
    }
}

// 次の問題へ
function nextQuestion() {
    // フィードバックモーダルを閉じる
    feedbackModal.classList.add('hidden');
    
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        showResult();
    } else {
        showQuestion();
    }
}

// 結果を表示
function showResult() {
    showScreen(resultScreen);
    
    const percentage = Math.round((gameState.score / gameState.totalQuestions) * 100);
    
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('result-percentage').textContent = `${percentage}%`;
    
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    if (percentage === 100) {
        resultIcon.textContent = '🏆';
        resultTitle.textContent = 'パーフェクト！';
        resultMessage.textContent = '君はタイプ相性マスターだ！';
    } else if (percentage >= 80) {
        resultIcon.textContent = '🌟';
        resultTitle.textContent = 'すばらしい！';
        resultMessage.textContent = 'タイプ相性をよく理解しているね！';
    } else if (percentage >= 60) {
        resultIcon.textContent = '😊';
        resultTitle.textContent = 'なかなか！';
        resultMessage.textContent = 'もう少しでマスターになれるよ！';
    } else if (percentage >= 40) {
        resultIcon.textContent = '🤔';
        resultTitle.textContent = 'もう少し！';
        resultMessage.textContent = 'タイプ相性表を確認してみよう！';
    } else {
        resultIcon.textContent = '📚';
        resultTitle.textContent = 'がんばろう！';
        resultMessage.textContent = 'タイプ相性表で勉強してみよう！';
    }
}

// タイプ相性表を生成
function generateTypeChart() {
    const table = document.getElementById('type-chart');
    let html = '<tr><th></th>';
    
    // ヘッダー行（防御タイプ）
    types.forEach(type => {
        html += `<th class="type-header">${type}</th>`;
    });
    html += '</tr>';
    
    // データ行（攻撃タイプ）
    types.forEach(atkType => {
        html += `<tr><th>${atkType}</th>`;
        types.forEach(defType => {
            const effect = getEffectiveness(atkType, defType);
            let cellClass = '';
            let cellText = '○';
            
            if (effect === 2) {
                cellClass = 'super';
                cellText = '◎';
            } else if (effect === 0.5) {
                cellClass = 'not-very';
                cellText = '△';
            } else if (effect === 0) {
                cellClass = 'no-effect';
                cellText = '✕';
            }
            
            html += `<td class="${cellClass}">${cellText}</td>`;
        });
        html += '</tr>';
    });
    
    table.innerHTML = html;
}

// イベントリスナー
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        startGame(btn.dataset.difficulty);
    });
});

answerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        checkAnswer(btn.dataset.effect);
    });
});

nextBtn.addEventListener('click', nextQuestion);

retryBtn.addEventListener('click', () => {
    startGame(gameState.difficulty);
});

homeBtn.addEventListener('click', () => {
    showScreen(startScreen);
});

showChartBtn.addEventListener('click', () => {
    typeChartModal.classList.remove('hidden');
});

closeChartBtn.addEventListener('click', () => {
    typeChartModal.classList.add('hidden');
});

typeChartModal.addEventListener('click', (e) => {
    if (e.target === typeChartModal) {
        typeChartModal.classList.add('hidden');
    }
});

// 初期化
generateTypeChart();
