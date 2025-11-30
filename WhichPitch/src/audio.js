// Audio Context and Sound Generation
let audioContext = null;

// Note frequencies (A4 = 440Hz)
const NOTE_FREQUENCIES = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

// Get frequency for a specific note and octave
export function getFrequency(note, octave) {
  const baseFreq = NOTE_FREQUENCIES[note];
  const octaveDiff = octave - 4; // Base frequencies are for octave 4
  return baseFreq * Math.pow(2, octaveDiff);
}

// Initialize audio context
export function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Resume audio context (needed after user interaction)
export async function resumeAudio() {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}

// Play a single note
export function playNote(note, octave, duration = 0.8) {
  return new Promise((resolve) => {
    initAudio();
    resumeAudio();

    const frequency = getFrequency(note, octave);
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Set up oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Add some harmonics for a more piano-like sound
    const oscillator2 = audioContext.createOscillator();
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
    
    const gainNode2 = audioContext.createGain();
    gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime);
    
    // ADSR envelope
    const now = audioContext.currentTime;
    const attackTime = 0.02;
    const decayTime = 0.1;
    const sustainLevel = 0.5;
    const releaseTime = 0.3;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(sustainLevel * 0.5, now + attackTime + decayTime);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);
    
    // Connect nodes
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode2);
    gainNode2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and stop
    oscillator.start(now);
    oscillator2.start(now);
    oscillator.stop(now + duration);
    oscillator2.stop(now + duration);
    
    setTimeout(() => {
      resolve();
    }, duration * 1000);
  });
}

// Play a melody (array of {note, octave} objects)
export async function playMelody(notes, noteDuration = 0.6, gap = 0.15) {
  for (const noteObj of notes) {
    await playNote(noteObj.note, noteObj.octave, noteDuration);
    await new Promise(r => setTimeout(r, gap * 1000));
  }
}
