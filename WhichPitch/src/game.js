import { playNote, playMelody, initAudio, resumeAudio } from './audio.js';

// Notes
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];
const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Level presets
const LEVEL_PRESETS = {
  kindergarten: {
    name: 'ようちえん',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], // ドレミファソラシ only
    octaves: [4],
    includeSharps: false,
    melodyLength: 3,
    description: 'ドレミファソラシ だけでれんしゅう！'
  },
  elementary: {
    name: '小学生',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'D#', 'F#', 'G#', 'A#'],
    octaves: [4],
    includeSharps: true,
    melodyLength: 4,
    description: '白い鍵盤と黒い鍵盤をつかって練習！'
  },
  adult: {
    name: '大人',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'D#', 'F#', 'G#', 'A#'],
    octaves: [3, 4, 5],
    includeSharps: true,
    melodyLength: 5,
    description: '全音域でチャレンジ！詳細設定も可能です。'
  }
};

// Japanese note names for kids
const NOTE_NAMES_JP = {
  'C': 'ド', 'C#': 'ド♯',
  'D': 'レ', 'D#': 'レ♯',
  'E': 'ミ',
  'F': 'ファ', 'F#': 'ファ♯',
  'G': 'ソ', 'G#': 'ソ♯',
  'A': 'ラ', 'A#': 'ラ♯',
  'B': 'シ'
};

// Game State
let gameState = {
  level: null, // 'kindergarten', 'elementary', 'adult'
  mode: null, // 'single' or 'melody'
  settings: {
    octaveRange: '4',
    melodyLength: 4,
    includeSharps: true
  },
  currentQuestion: null, // { note, octave } for single, array for melody
  currentMelodyIndex: 0,
  userAnswers: [],
  score: {
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0
  },
  isAnswered: false
};

// DOM Elements
const elements = {
  levelSelection: document.getElementById('level-selection'),
  modeSelection: document.getElementById('mode-selection'),
  settingsPanel: document.getElementById('settings-panel'),
  gamePanel: document.getElementById('game-panel'),
  resultPanel: document.getElementById('result-panel'),
  
  kindergartenBtn: document.getElementById('kindergarten-btn'),
  elementaryBtn: document.getElementById('elementary-btn'),
  adultBtn: document.getElementById('adult-btn'),
  backToLevelBtn: document.getElementById('back-to-level-btn'),
  
  modeTitle: document.getElementById('mode-title'),
  singleModeBtn: document.getElementById('single-mode-btn'),
  melodyModeBtn: document.getElementById('melody-mode-btn'),
  
  settingsTitle: document.getElementById('settings-title'),
  levelInfo: document.getElementById('level-info'),
  octaveRange: document.getElementById('octave-range'),
  melodyLength: document.getElementById('melody-length'),
  includeSharps: document.getElementById('include-sharps'),
  
  startGameBtn: document.getElementById('start-game-btn'),
  backBtn: document.getElementById('back-btn'),
  
  correctCount: document.getElementById('correct-count'),
  totalCount: document.getElementById('total-count'),
  streakCount: document.getElementById('streak-count'),
  
  playBtn: document.getElementById('play-btn'),
  melodyProgress: document.getElementById('melody-progress'),
  currentNoteIndex: document.getElementById('current-note-index'),
  totalNotes: document.getElementById('total-notes'),
  
  pianoKeys: document.getElementById('piano-keys'),
  
  quitBtn: document.getElementById('quit-btn'),
  
  finalPercentage: document.getElementById('final-percentage'),
  finalCorrect: document.getElementById('final-correct'),
  finalTotal: document.getElementById('final-total'),
  maxStreak: document.getElementById('max-streak'),
  
  retryBtn: document.getElementById('retry-btn'),
  homeBtn: document.getElementById('home-btn'),
  
  // Modal elements
  correctModal: document.getElementById('correct-modal'),
  modalAnswer: document.getElementById('modal-answer'),
  modalStreak: document.getElementById('modal-streak'),
  modalNextBtn: document.getElementById('modal-next-btn'),
  
  // Wrong modal elements
  wrongModal: document.getElementById('wrong-modal'),
  wrongModalAnswer: document.getElementById('wrong-modal-answer'),
  wrongModalNextBtn: document.getElementById('wrong-modal-next-btn')
};

// Show/Hide panels
function showPanel(panel) {
  [elements.levelSelection, elements.modeSelection, elements.settingsPanel, elements.gamePanel, elements.resultPanel]
    .forEach(p => p.classList.add('hidden'));
  panel.classList.remove('hidden');
}

// Get display name for note based on level
function getNoteName(note) {
  if (gameState.level === 'kindergarten' || gameState.level === 'elementary') {
    return NOTE_NAMES_JP[note] || note;
  }
  return note;
}

// Initialize piano keyboard
function createPianoKeys() {
  elements.pianoKeys.innerHTML = '';
  
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.position = 'relative';
  
  // Create white keys first
  WHITE_NOTES.forEach((note, index) => {
    const key = document.createElement('button');
    key.className = 'white-key';
    key.dataset.note = note;
    key.textContent = getNoteName(note);
    key.addEventListener('click', () => handleAnswer(note));
    container.appendChild(key);
  });
  
  // Create black keys with proper positioning (only if sharps are included)
  if (gameState.settings.includeSharps) {
    const blackKeyPositions = [0, 1, 3, 4, 5]; // Positions after C, D, F, G, A
    const blackNoteNames = ['C#', 'D#', 'F#', 'G#', 'A#'];
    
    blackKeyPositions.forEach((pos, i) => {
      const key = document.createElement('button');
      key.className = 'black-key';
      key.dataset.note = blackNoteNames[i];
      key.textContent = getNoteName(blackNoteNames[i]);
      key.style.left = `${(pos * 49) + 32}px`;
      key.addEventListener('click', () => handleAnswer(blackNoteNames[i]));
      container.appendChild(key);
    });
  }
  
  elements.pianoKeys.appendChild(container);
}

// Get available notes based on settings and level
function getAvailableNotes() {
  const preset = LEVEL_PRESETS[gameState.level];
  if (gameState.level === 'adult') {
    // Adult level uses custom settings
    return gameState.settings.includeSharps ? ALL_NOTES : WHITE_NOTES;
  }
  return gameState.settings.includeSharps ? preset.notes : WHITE_NOTES;
}

// Get octaves based on settings and level
function getOctaves() {
  if (gameState.level === 'adult') {
    const range = gameState.settings.octaveRange;
    if (range === '3-5') return [3, 4, 5];
    return [parseInt(range)];
  }
  return LEVEL_PRESETS[gameState.level].octaves;
}

// Generate random note
function generateRandomNote() {
  const notes = getAvailableNotes();
  const octaves = getOctaves();
  const note = notes[Math.floor(Math.random() * notes.length)];
  const octave = octaves[Math.floor(Math.random() * octaves.length)];
  return { note, octave };
}

// Generate melody
function generateMelody(length) {
  const melody = [];
  for (let i = 0; i < length; i++) {
    melody.push(generateRandomNote());
  }
  return melody;
}

// Start new question
function newQuestion() {
  gameState.isAnswered = false;
  gameState.userAnswers = [];
  gameState.currentMelodyIndex = 0;
  
  // Clear key states
  document.querySelectorAll('.white-key, .black-key').forEach(key => {
    key.classList.remove('correct', 'wrong');
  });
  
  // Hide modals
  hideModals();
  
  if (gameState.mode === 'single') {
    gameState.currentQuestion = generateRandomNote();
  } else {
    gameState.currentQuestion = generateMelody(gameState.settings.melodyLength);
    elements.totalNotes.textContent = gameState.settings.melodyLength;
    elements.currentNoteIndex.textContent = '1';
  }
  
  updateMelodyProgress();
}

// Update melody progress display
function updateMelodyProgress() {
  if (gameState.mode === 'melody') {
    elements.melodyProgress.classList.remove('hidden');
    elements.currentNoteIndex.textContent = gameState.currentMelodyIndex + 1;
  } else {
    elements.melodyProgress.classList.add('hidden');
  }
}

// Play current question
async function playCurrentQuestion() {
  await resumeAudio();
  
  if (gameState.mode === 'single') {
    const { note, octave } = gameState.currentQuestion;
    await playNote(note, octave);
  } else {
    await playMelody(gameState.currentQuestion);
  }
}

// Handle user answer
function handleAnswer(selectedNote) {
  if (gameState.isAnswered && gameState.mode === 'single') return;
  
  if (gameState.mode === 'single') {
    handleSingleAnswer(selectedNote);
  } else {
    handleMelodyAnswer(selectedNote);
  }
}

// Handle single note answer
function handleSingleAnswer(selectedNote) {
  gameState.isAnswered = true;
  gameState.score.total++;
  
  const correctNote = gameState.currentQuestion.note;
  const isCorrect = selectedNote === correctNote;
  
  // Update score
  if (isCorrect) {
    gameState.score.correct++;
    gameState.score.streak++;
    if (gameState.score.streak > gameState.score.maxStreak) {
      gameState.score.maxStreak = gameState.score.streak;
    }
  } else {
    gameState.score.streak = 0;
  }
  
  // Update UI
  updateScoreDisplay();
  highlightKeys(selectedNote, correctNote, isCorrect);
  
  // Play the selected note
  const octave = gameState.currentQuestion.octave;
  playNote(selectedNote, octave, 0.5);
  
  if (isCorrect) {
    // Show correct modal
    showCorrectModal(getNoteName(correctNote));
  } else {
    // Show wrong modal
    showWrongModal(getNoteName(correctNote));
  }
}

// Handle melody answer
function handleMelodyAnswer(selectedNote) {
  const currentIndex = gameState.currentMelodyIndex;
  const correctNote = gameState.currentQuestion[currentIndex].note;
  const isCorrect = selectedNote === correctNote;
  
  gameState.userAnswers.push(selectedNote);
  
  // Visual feedback
  const key = document.querySelector(`[data-note="${selectedNote}"]`);
  if (key) {
    key.classList.add(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => key.classList.remove('correct', 'wrong'), 300);
  }
  
  // Play the selected note
  const octave = gameState.currentQuestion[currentIndex].octave;
  playNote(selectedNote, octave, 0.3);
  
  if (!isCorrect) {
    // Wrong answer - end melody
    gameState.isAnswered = true;
    gameState.score.total++;
    gameState.score.streak = 0;
    
    const correctNotes = gameState.currentQuestion.map(n => getNoteName(n.note)).join(' → ');
    showWrongModal(correctNotes);
    updateScoreDisplay();
    return;
  }
  
  gameState.currentMelodyIndex++;
  updateMelodyProgress();
  
  if (gameState.currentMelodyIndex >= gameState.currentQuestion.length) {
    // Completed melody correctly
    gameState.isAnswered = true;
    gameState.score.total++;
    gameState.score.correct++;
    gameState.score.streak++;
    if (gameState.score.streak > gameState.score.maxStreak) {
      gameState.score.maxStreak = gameState.score.streak;
    }
    
    updateScoreDisplay();
    // Show correct modal for melody
    const correctNotes = gameState.currentQuestion.map(n => getNoteName(n.note)).join(' → ');
    showCorrectModal(correctNotes);
  }
}

// Highlight piano keys
function highlightKeys(selectedNote, correctNote, isCorrect) {
  const selectedKey = document.querySelector(`[data-note="${selectedNote}"]`);
  const correctKey = document.querySelector(`[data-note="${correctNote}"]`);
  
  if (selectedKey) {
    selectedKey.classList.add(isCorrect ? 'correct' : 'wrong');
  }
  
  if (!isCorrect && correctKey) {
    correctKey.classList.add('correct');
  }
}

// Update score display
function updateScoreDisplay() {
  elements.correctCount.textContent = gameState.score.correct;
  elements.totalCount.textContent = gameState.score.total;
  elements.streakCount.textContent = gameState.score.streak;
}

// Show correct modal
function showCorrectModal(answer) {
  const isKidsMode = gameState.level === 'kindergarten' || gameState.level === 'elementary';
  
  elements.modalAnswer.textContent = answer;
  elements.modalStreak.textContent = gameState.score.streak;
  
  // Update button text based on level
  elements.modalNextBtn.textContent = isKidsMode ? '✨ つぎのもんだい ✨' : '✨ 次の問題 ✨';
  
  elements.correctModal.classList.remove('hidden');
}

// Show wrong modal
function showWrongModal(answer) {
  const isKidsMode = gameState.level === 'kindergarten' || gameState.level === 'elementary';
  
  elements.wrongModalAnswer.textContent = answer;
  
  // Update button text based on level
  elements.wrongModalNextBtn.textContent = isKidsMode ? '✨ つぎのもんだい ✨' : '✨ 次の問題 ✨';
  
  elements.wrongModal.classList.remove('hidden');
}

// Hide modals
function hideModals() {
  elements.correctModal.classList.add('hidden');
  elements.wrongModal.classList.add('hidden');
}

// Show final results
function showFinalResults() {
  const percentage = gameState.score.total > 0 
    ? Math.round((gameState.score.correct / gameState.score.total) * 100) 
    : 0;
  
  elements.finalPercentage.textContent = percentage;
  elements.finalCorrect.textContent = gameState.score.correct;
  elements.finalTotal.textContent = gameState.score.total;
  elements.maxStreak.textContent = gameState.score.maxStreak;
  
  showPanel(elements.resultPanel);
}

// Reset game
function resetGame() {
  gameState.score = {
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0
  };
  gameState.currentQuestion = null;
  gameState.currentMelodyIndex = 0;
  gameState.userAnswers = [];
  gameState.isAnswered = false;
}

// Apply level preset
function applyLevelPreset(level) {
  gameState.level = level;
  const preset = LEVEL_PRESETS[level];
  
  gameState.settings.includeSharps = preset.includeSharps;
  gameState.settings.melodyLength = preset.melodyLength;
  gameState.settings.octaveRange = preset.octaves.length > 1 ? '3-5' : String(preset.octaves[0]);
  
  // Update settings UI
  elements.includeSharps.checked = preset.includeSharps;
  elements.melodyLength.value = String(preset.melodyLength);
  elements.octaveRange.value = gameState.settings.octaveRange;
}

// Update level info display
function updateLevelInfo() {
  const preset = LEVEL_PRESETS[gameState.level];
  elements.levelInfo.innerHTML = `
    <span class="level-badge ${gameState.level}">${preset.name}</span>
    <p>${preset.description}</p>
  `;
}

// Update mode selection UI based on level
function updateModeSelectionUI() {
  const isKids = gameState.level === 'kindergarten';
  
  if (isKids) {
    elements.modeTitle.textContent = '🌸 れんしゅうモードをえらんでね！ 🌸';
    document.querySelector('#single-mode-btn .mode-title').textContent = 'たんおんモード';
    document.querySelector('#single-mode-btn .mode-desc').textContent = '1つのおとをあてよう 🎵';
    document.querySelector('#melody-mode-btn .mode-title').textContent = 'メロディモード';
    document.querySelector('#melody-mode-btn .mode-desc').textContent = 'おとをじゅんばんにあてよう 🎶';
  } else {
    elements.modeTitle.textContent = '🎀 れんしゅうモード 🎀';
    document.querySelector('#single-mode-btn .mode-title').textContent = '単音モード';
    document.querySelector('#single-mode-btn .mode-desc').textContent = '1つの音を聴いて当てる';
    document.querySelector('#melody-mode-btn .mode-title').textContent = 'メロディモード';
    document.querySelector('#melody-mode-btn .mode-desc').textContent = '複数の音を順番に当てる';
  }
}

// Start game
function startGame() {
  resetGame();
  createPianoKeys();
  updateScoreDisplay();
  newQuestion();
  showPanel(elements.gamePanel);
}

// Event Listeners

// Level selection
elements.kindergartenBtn.addEventListener('click', () => {
  applyLevelPreset('kindergarten');
  updateModeSelectionUI();
  showPanel(elements.modeSelection);
});

elements.elementaryBtn.addEventListener('click', () => {
  applyLevelPreset('elementary');
  updateModeSelectionUI();
  showPanel(elements.modeSelection);
});

elements.adultBtn.addEventListener('click', () => {
  applyLevelPreset('adult');
  updateModeSelectionUI();
  showPanel(elements.modeSelection);
});

elements.backToLevelBtn.addEventListener('click', () => {
  showPanel(elements.levelSelection);
});

elements.singleModeBtn.addEventListener('click', () => {
  gameState.mode = 'single';
  document.querySelectorAll('.melody-only').forEach(el => el.style.display = 'none');
  
  // Show/hide advanced settings based on level
  const isAdvanced = gameState.level === 'adult';
  document.querySelectorAll('.advanced-only').forEach(el => {
    el.style.display = isAdvanced ? 'flex' : 'none';
  });
  
  updateLevelInfo();
  showPanel(elements.settingsPanel);
});

elements.melodyModeBtn.addEventListener('click', () => {
  gameState.mode = 'melody';
  document.querySelectorAll('.melody-only').forEach(el => el.style.display = 'flex');
  
  // Show/hide advanced settings based on level
  const isAdvanced = gameState.level === 'adult';
  document.querySelectorAll('.advanced-only').forEach(el => {
    el.style.display = isAdvanced ? 'flex' : 'none';
  });
  
  updateLevelInfo();
  showPanel(elements.settingsPanel);
});

elements.backBtn.addEventListener('click', () => {
  showPanel(elements.modeSelection);
});

elements.startGameBtn.addEventListener('click', () => {
  // Read settings (only if adult level allows custom settings)
  if (gameState.level === 'adult') {
    gameState.settings.octaveRange = elements.octaveRange.value;
    gameState.settings.melodyLength = parseInt(elements.melodyLength.value);
    gameState.settings.includeSharps = elements.includeSharps.checked;
  }
  
  // Initialize audio on user interaction
  initAudio();
  
  startGame();
});

elements.playBtn.addEventListener('click', async () => {
  elements.playBtn.disabled = true;
  await playCurrentQuestion();
  elements.playBtn.disabled = false;
});

elements.modalNextBtn.addEventListener('click', () => {
  hideModals();
  newQuestion();
});

elements.wrongModalNextBtn.addEventListener('click', () => {
  hideModals();
  newQuestion();
});

elements.quitBtn.addEventListener('click', () => {
  hideModals();
  showFinalResults();
});

elements.retryBtn.addEventListener('click', () => {
  startGame();
});

elements.homeBtn.addEventListener('click', () => {
  showPanel(elements.levelSelection);
});

// Initialize
showPanel(elements.levelSelection);
