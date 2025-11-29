import { elements, categoryNames, quizTypes, shuffleArray } from './elements.js';
import './styles.css';

// ゲームの状態
let currentMode = 'learn';
let quizState = {
    score: 0,
    currentQuestion: 0,
    totalQuestions: 10,
    questions: [],
    answered: false
};
let flashcardState = {
    cards: [],
    currentIndex: 0,
    knownCount: 0,
    reviewCount: 0,
    isFlipped: false,
    mode: 'symbol' // 'symbol', 'number', 'position'
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initPeriodicTable();
    initModeSelector();
    initQuiz();
    initFlashcard();
});

// 周期表の初期化
function initPeriodicTable() {
    const table = document.getElementById('periodic-table');
    
    // 周期表のグリッドを作成（7行 + 2行のランタノイド/アクチノイド）
    // まず空のセルで埋める
    const grid = [];
    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 18; col++) {
            grid.push({ row, col, element: null });
        }
    }
    
    // 元素を配置
    elements.forEach(element => {
        const index = grid.findIndex(cell => cell.row === element.row && cell.col === element.col);
        if (index !== -1) {
            grid[index].element = element;
        }
    });
    
    // 情報パネルを最初に追加（グリッドの1-3行、3-12列に配置）
    const infoPanel = document.createElement('div');
    infoPanel.className = 'element-info-panel';
    infoPanel.id = 'element-info-panel';
    infoPanel.innerHTML = '<span class="placeholder-text">元素をクリックして詳細を表示</span>';
    table.appendChild(infoPanel);
    
    // HTMLを生成
    grid.forEach(cell => {
        // 8行目はスキップ（ランタノイドとアクチノイドの間のスペース用）
        if (cell.row === 8) {
            return;
        }
        
        // 1-3行目の3-12列はスキップ（情報パネルが占有）
        if (cell.row >= 1 && cell.row <= 3 && cell.col >= 3 && cell.col <= 12) {
            return;
        }
        
        if (cell.element) {
            const elementDiv = createElementDiv(cell.element);
            // グリッド位置を明示的に指定
            elementDiv.style.gridColumn = cell.col;
            elementDiv.style.gridRow = cell.row <= 7 ? cell.row : cell.row - 1;
            table.appendChild(elementDiv);
        } else {
            // ランタノイド/アクチノイドのプレースホルダー
            if ((cell.row === 6 && cell.col === 3) || (cell.row === 7 && cell.col === 3)) {
                const placeholder = document.createElement('div');
                placeholder.className = 'element';
                placeholder.style.background = cell.row === 6 ? 
                    'linear-gradient(135deg, #7cb342, #689f38)' : 
                    'linear-gradient(135deg, #ff7043, #f4511e)';
                placeholder.innerHTML = cell.row === 6 ? 
                    '<span class="symbol">*</span>' :
                    '<span class="symbol">**</span>';
                placeholder.style.opacity = '0.7';
                placeholder.style.cursor = 'default';
                placeholder.style.gridColumn = cell.col;
                placeholder.style.gridRow = cell.row;
                table.appendChild(placeholder);
            } else {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'element empty-cell';
                emptyDiv.style.gridColumn = cell.col;
                emptyDiv.style.gridRow = cell.row <= 7 ? cell.row : cell.row - 1;
                table.appendChild(emptyDiv);
            }
        }
    });
    
    // 凡例を追加
    addLegend();
}

// 元素のDOM要素を作成
function createElementDiv(element) {
    const div = document.createElement('div');
    div.className = `element ${element.category}`;
    div.innerHTML = `
        <span class="number">${element.number}</span>
        <span class="symbol">${element.symbol}</span>
        <span class="name">${element.name}</span>
    `;
    div.addEventListener('click', () => showElementInfo(element));
    return div;
}

// 元素情報を表示
function showElementInfo(element) {
    const info = document.getElementById('element-info-panel');
    info.className = 'element-info-panel has-element';
    info.innerHTML = `
        <div class="info-symbol">${element.symbol}</div>
        <div class="info-name">${element.name}</div>
        <div class="info-name-en">${element.nameEn}</div>
        <div class="info-details">
            <span>原子番号: ${element.number}</span>
            <span>原子量: ${element.mass}</span>
            <span>${categoryNames[element.category]}</span>
        </div>
        <div class="info-description">${element.description}</div>
    `;
}

// 凡例を追加
function addLegend() {
    const container = document.getElementById('learn-mode');
    const legend = document.createElement('div');
    legend.className = 'legend';
    
    const categories = [
        { class: 'alkali-metal', name: 'アルカリ金属' },
        { class: 'alkaline-earth', name: 'アルカリ土類金属' },
        { class: 'transition-metal', name: '遷移金属' },
        { class: 'post-transition', name: '卑金属' },
        { class: 'metalloid', name: '半金属' },
        { class: 'nonmetal', name: '非金属' },
        { class: 'halogen', name: 'ハロゲン' },
        { class: 'noble-gas', name: '希ガス' },
        { class: 'lanthanide', name: 'ランタノイド' },
        { class: 'actinide', name: 'アクチノイド' }
    ];
    
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-color ${cat.class}"></div>
            <span>${cat.name}</span>
        `;
        legend.appendChild(item);
    });
    
    container.appendChild(legend);
}

// モード選択の初期化
function initModeSelector() {
    const buttons = document.querySelectorAll('.mode-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
            
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// モード切り替え
function switchMode(mode) {
    currentMode = mode;
    
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(`${mode}-mode`).classList.add('active');
}

// クイズの初期化
function initQuiz() {
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
}

// クイズ開始
function startQuiz() {
    quizState = {
        score: 0,
        currentQuestion: 0,
        totalQuestions: 10,
        questions: generateQuizQuestions(10),
        answered: false
    };
    
    updateQuizUI();
    showQuestion();
}

// クイズ問題を生成
function generateQuizQuestions(count) {
    const questions = [];
    const usedElements = new Set();
    
    // よく知られた元素を優先（原子番号1-36を中心に）
    const commonElements = elements.filter(e => e.number <= 36);
    
    for (let i = 0; i < count; i++) {
        const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
        
        let element;
        do {
            const elementPool = Math.random() < 0.7 ? commonElements : elements;
            element = elementPool[Math.floor(Math.random() * elementPool.length)];
        } while (usedElements.has(element.number));
        
        usedElements.add(element.number);
        
        questions.push({
            element,
            type: quizType,
            question: quizType.question(element),
            answer: quizType.answer(element),
            options: quizType.options(element, elements)
        });
    }
    
    return questions;
}

// 問題を表示
function showQuestion() {
    if (quizState.currentQuestion >= quizState.totalQuestions) {
        showQuizResult();
        return;
    }
    
    const q = quizState.questions[quizState.currentQuestion];
    quizState.answered = false;
    
    document.getElementById('quiz-question').innerHTML = `
        <h2>${q.question}</h2>
        <p class="hint">ヒント: ${q.element.description}</p>
    `;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option, q.answer, btn));
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('quiz-feedback').className = 'quiz-feedback';
    document.getElementById('quiz-feedback').textContent = '';
}

// 回答をチェック
function checkAnswer(selected, correct, button) {
    if (quizState.answered) return;
    quizState.answered = true;
    
    const feedback = document.getElementById('quiz-feedback');
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(opt => {
        opt.disabled = true;
        if (opt.textContent === correct) {
            opt.classList.add('correct');
        }
    });
    
    if (selected === correct) {
        quizState.score += 10;
        button.classList.add('correct');
        feedback.className = 'quiz-feedback show correct';
        feedback.textContent = '🎉 正解！';
    } else {
        button.classList.add('wrong');
        feedback.className = 'quiz-feedback show wrong';
        feedback.textContent = `❌ 不正解... 正解は「${correct}」でした`;
    }
    
    updateQuizUI();
    
    // 次の問題へ
    setTimeout(() => {
        quizState.currentQuestion++;
        showQuestion();
    }, 2000);
}

// クイズUIを更新
function updateQuizUI() {
    document.getElementById('quiz-score').textContent = quizState.score;
    document.getElementById('current-question').textContent = Math.min(quizState.currentQuestion + 1, quizState.totalQuestions);
}

// クイズ結果を表示
function showQuizResult() {
    const percentage = (quizState.score / (quizState.totalQuestions * 10)) * 100;
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = '完璧！あなたは元素マスターです！';
        emoji = '🏆';
    } else if (percentage >= 80) {
        message = '素晴らしい！元素にとても詳しいですね！';
        emoji = '🌟';
    } else if (percentage >= 60) {
        message = 'よくできました！もう少しで上級者です！';
        emoji = '👍';
    } else if (percentage >= 40) {
        message = 'まだまだ伸びしろがあります！';
        emoji = '📚';
    } else {
        message = '元素の勉強を続けましょう！';
        emoji = '💪';
    }
    
    document.getElementById('quiz-question').innerHTML = `
        <div class="result-screen">
            <h2>${emoji} クイズ終了！</h2>
            <div class="final-score">${quizState.score} / ${quizState.totalQuestions * 10}</div>
            <p class="message">${message}</p>
        </div>
    `;
    
    document.getElementById('quiz-options').innerHTML = `
        <button class="start-quiz-btn" onclick="startQuiz()">🔄 もう一度挑戦</button>
    `;
    
    document.getElementById('quiz-feedback').className = 'quiz-feedback';
}

// 暗記カードの初期化
function initFlashcard() {
    // モード選択ボタンにイベントリスナーを追加
    document.querySelectorAll('.mode-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.flashcardMode;
            startFlashcard(mode);
        });
    });
    
    // モード選択に戻るボタン
    document.getElementById('back-to-mode-btn').addEventListener('click', backToModeSelect);
}

// 暗記カード開始
function startFlashcard(mode) {
    // 全118元素をシャッフル
    const allElements = shuffleArray([...elements]);
    
    flashcardState = {
        cards: allElements,
        currentIndex: 0,
        knownCount: 0,
        reviewCount: 0,
        isFlipped: false,
        mode: mode
    };
    
    // モード選択画面を非表示、ゲーム画面を表示
    document.getElementById('flashcard-mode-select').style.display = 'none';
    document.getElementById('flashcard-game').style.display = 'flex';
    
    // カードにイベントリスナーを追加
    const flashcard = document.getElementById('flashcard');
    flashcard.removeEventListener('click', flipFlashcard);
    flashcard.addEventListener('click', flipFlashcard);
    
    updateFlashcardUI();
    showCurrentCard();
    showFlashcardControls();
}

// 周期と族を取得
function getRowCol(element) {
    // 主要な元素の周期と族
    const row = element.row <= 7 ? element.row : (element.row === 9 ? 6 : 7);
    let col = element.col;
    
    // ランタノイド・アクチノイドは特別扱い
    if (element.row === 9) {
        col = element.col - 3 + 3; // 3-17列 → ランタノイド
    } else if (element.row === 10) {
        col = element.col - 3 + 3; // 3-17列 → アクチノイド
    }
    
    return { period: row, group: col };
}

// 現在のカードを表示
function showCurrentCard() {
    const card = flashcardState.cards[flashcardState.currentIndex];
    const flashcard = document.getElementById('flashcard');
    const flashcardInner = flashcard.querySelector('.flashcard-inner');
    const { period, group } = getRowCol(card);
    
    // アニメーションなしでリセット
    flashcard.classList.add('no-transition');
    flashcard.classList.remove('flipped');
    flashcardState.isFlipped = false;
    
    // 表面の内容をモードに応じて設定
    const front = flashcardInner.querySelector('.flashcard-front');
    let frontContent = '';
    
    switch (flashcardState.mode) {
        case 'symbol':
            frontContent = `
                <span class="flashcard-symbol">${card.symbol}</span>
                <span class="flashcard-hint">この元素名は？</span>
            `;
            break;
        case 'number':
            frontContent = `
                <span class="flashcard-symbol">${card.number}</span>
                <span class="flashcard-hint">原子番号${card.number}の元素は？</span>
            `;
            break;
        case 'position':
            frontContent = `
                <span class="flashcard-symbol position-mode">${period}周期 ${group}族</span>
                <span class="flashcard-hint">この位置の元素は？</span>
            `;
            break;
    }
    front.innerHTML = frontContent;
    
    // 裏面（詳細情報）を設定
    const back = flashcardInner.querySelector('.flashcard-back');
    back.innerHTML = `
        <span class="flashcard-name">${card.symbol} ${card.name}</span>
        <span class="flashcard-details">
            ${card.nameEn}<br>
            原子番号: ${card.number} | 原子量: ${card.mass}<br>
            ${period}周期 ${group}族 | ${categoryNames[card.category]}
        </span>
    `;
    
    // 次のフレームでtransitionを有効に戻す
    requestAnimationFrame(() => {
        flashcard.classList.remove('no-transition');
    });
}

// カードをめくる
function flipFlashcard() {
    if (flashcardState.cards.length === 0) return;
    
    const flashcard = document.getElementById('flashcard');
    if (flashcard.classList.contains('transitioning')) return;
    
    if (flashcardState.isFlipped) {
        // 裏面の時にクリックしたら次のカードへ
        goToNextCard();
    } else {
        // 表面の時にクリックしたらめくる
        flashcard.classList.add('flipped');
        flashcardState.isFlipped = true;
    }
}

// 「覚えた」ボタン
function markAsKnown() {
    flashcardState.knownCount++;
    goToNextCard();
}

// 「もう一度」ボタン
function markForReview() {
    flashcardState.reviewCount++;
    // カードを最後に追加
    const currentCard = flashcardState.cards[flashcardState.currentIndex];
    flashcardState.cards.push(currentCard);
    goToNextCard();
}

// 次のカードへ（アニメーション対応）
function goToNextCard() {
    const flashcard = document.getElementById('flashcard');
    
    if (flashcardState.isFlipped) {
        // カードがめくれている場合は、まず戻してから次へ
        flashcard.classList.add('transitioning');
        flashcard.classList.remove('flipped');
        flashcardState.isFlipped = false;
        
        // アニメーション完了後に次のカードを表示
        setTimeout(() => {
            flashcard.classList.remove('transitioning');
            proceedToNextCard();
        }, 500);
    } else {
        proceedToNextCard();
    }
}

// 次のカードへ進む
function proceedToNextCard() {
    flashcardState.currentIndex++;
    updateFlashcardUI();
    
    if (flashcardState.currentIndex >= flashcardState.cards.length) {
        showFlashcardResult();
    } else {
        showCurrentCard();
    }
}

// 暗記カードUIを更新
function updateFlashcardUI() {
    document.getElementById('flashcard-current').textContent = Math.min(flashcardState.currentIndex + 1, flashcardState.cards.length);
    document.getElementById('flashcard-total').textContent = flashcardState.cards.length;
}

// 操作ボタンを表示
function showFlashcardControls() {
    document.getElementById('flashcard-controls').innerHTML = `
        <p class="flashcard-instruction">カードをクリックしてめくる → もう一度クリックで次へ</p>
    `;
}

// 暗記カード結果を表示
function showFlashcardResult() {
    document.getElementById('flashcard-area').innerHTML = `
        <div class="result-screen">
            <h2>🎉 完了！</h2>
            <div class="final-score">118枚</div>
            <p class="message">全ての元素カードを見ました！</p>
        </div>
    `;
    
    document.getElementById('flashcard-controls').innerHTML = `
        <button class="flashcard-btn back" onclick="backToModeSelect()">← モード選択</button>
        <button class="start-flashcard-btn" onclick="restartFlashcard()">🔄 もう一度</button>
    `;
}

// モード選択に戻る
function backToModeSelect() {
    document.getElementById('flashcard-mode-select').style.display = 'block';
    document.getElementById('flashcard-game').style.display = 'none';
    
    // flashcard-areaをリセット
    document.getElementById('flashcard-area').innerHTML = `
        <div class="flashcard" id="flashcard">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <span class="flashcard-symbol">?</span>
                    <span class="flashcard-hint">クリックでめくる</span>
                </div>
                <div class="flashcard-back">
                    <span class="flashcard-name"></span>
                    <span class="flashcard-details"></span>
                </div>
            </div>
        </div>
    `;
}

// 暗記カードを再開（同じモードで）
function restartFlashcard() {
    // flashcard-areaをリセット
    document.getElementById('flashcard-area').innerHTML = `
        <div class="flashcard" id="flashcard">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <span class="flashcard-symbol">?</span>
                    <span class="flashcard-hint">クリックでめくる</span>
                </div>
                <div class="flashcard-back">
                    <span class="flashcard-name"></span>
                    <span class="flashcard-details"></span>
                </div>
            </div>
        </div>
    `;
    startFlashcard(flashcardState.mode);
}

// グローバルに関数を公開
window.startQuiz = startQuiz;
window.markAsKnown = markAsKnown;
window.markForReview = markForReview;
window.restartFlashcard = restartFlashcard;
window.backToModeSelect = backToModeSelect;
