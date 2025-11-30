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

// Play a single note with realistic piano sound
export function playNote(note, octave, duration = 1.2) {
  return new Promise((resolve) => {
    initAudio();
    resumeAudio();

    const frequency = getFrequency(note, octave);
    const now = audioContext.currentTime;
    
    // Master gain for overall volume
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(audioContext.destination);
    
    // Piano harmonic structure (relative amplitudes)
    const harmonics = [
      { ratio: 1, amplitude: 1.0 },      // Fundamental
      { ratio: 2, amplitude: 0.5 },      // 2nd harmonic
      { ratio: 3, amplitude: 0.25 },     // 3rd harmonic
      { ratio: 4, amplitude: 0.15 },     // 4th harmonic
      { ratio: 5, amplitude: 0.08 },     // 5th harmonic
      { ratio: 6, amplitude: 0.05 },     // 6th harmonic
    ];
    
    const oscillators = [];
    const gains = [];
    
    // Create oscillators for each harmonic
    harmonics.forEach((harmonic, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      // Use sine waves for clean piano tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * harmonic.ratio, now);
      
      // Piano ADSR envelope - sharp attack, long decay
      const attackTime = 0.005;  // Very fast attack (hammer strike)
      const decayTime = 0.4;     // Medium decay
      const sustainLevel = harmonic.amplitude * 0.3;
      const releaseStart = duration - 0.2;
      
      gain.gain.setValueAtTime(0, now);
      // Sharp attack
      gain.gain.linearRampToValueAtTime(harmonic.amplitude, now + attackTime);
      // Natural decay curve (exponential for piano)
      gain.gain.exponentialRampToValueAtTime(
        Math.max(sustainLevel, 0.001), 
        now + attackTime + decayTime
      );
      // Gradual release
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now);
      osc.stop(now + duration + 0.1);
      
      oscillators.push(osc);
      gains.push(gain);
    });
    
    // Add a soft "thump" for the hammer attack
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.05, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.01));
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(frequency * 2, now);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(now);
    noiseSource.stop(now + 0.05);
    
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
