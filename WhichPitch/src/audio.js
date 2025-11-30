// Audio using Tone.js Sampler with real piano samples
import * as Tone from 'tone';

let piano = null;
let isLoaded = false;
let isLoading = false;

// Initialize piano sampler with real piano samples
export async function initAudio() {
  if (piano && isLoaded) return piano;
  if (isLoading) {
    // Wait for loading to complete
    while (!isLoaded) {
      await new Promise(r => setTimeout(r, 100));
    }
    return piano;
  }
  
  isLoading = true;
  
  return new Promise((resolve) => {
    // Using Salamander Grand Piano samples (free, high quality)
    piano = new Tone.Sampler({
      urls: {
        'C4': 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        'A4': 'A4.mp3',
        'C5': 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        'A5': 'A5.mp3',
        'C3': 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        'A3': 'A3.mp3',
      },
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => {
        isLoaded = true;
        isLoading = false;
        console.log('🎹 Piano samples loaded!');
        resolve(piano);
      },
      onerror: (err) => {
        console.error('Failed to load piano samples:', err);
        isLoading = false;
        resolve(null);
      }
    }).toDestination();
    
    // Set volume
    piano.volume.value = 0; // 0 dB
  });
}

// Resume audio context (needed after user interaction)
export async function resumeAudio() {
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
}

// Convert note name to Tone.js format
function toToneNote(note, octave) {
  // Tone.js uses format like "C4", "D#4", etc.
  return `${note}${octave}`;
}

// Play a single note
export async function playNote(note, octave, duration = 1.0) {
  await initAudio();
  await resumeAudio();
  
  if (!piano || !isLoaded) {
    console.warn('Piano not loaded yet');
    return;
  }
  
  const toneNote = toToneNote(note, octave);
  
  return new Promise((resolve) => {
    // Trigger the note with attack and release
    piano.triggerAttackRelease(toneNote, duration);
    
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

// Check if audio is ready
export function isAudioReady() {
  return isLoaded;
}

// Preload audio (call this early to start loading samples)
export function preloadAudio() {
  initAudio();
}
