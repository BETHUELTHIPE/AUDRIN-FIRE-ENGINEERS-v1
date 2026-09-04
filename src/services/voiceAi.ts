import { HOW_WE_WORK_STAGES } from '../data/initialData';

export interface VoicePlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  speechRate: number;
  volume: number;
  pitch: number;
  isMuted: boolean;
  highlightedWordIndex?: number;
}

export class VoiceAiEngine {
  private static instance: VoiceAiEngine;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<(state: VoicePlaybackState) => void> = new Set();

  private state: VoicePlaybackState = {
    isPlaying: false,
    isPaused: false,
    currentStepIndex: 0,
    speechRate: 1.0,
    volume: 1.0,
    pitch: 1.0,
    isMuted: false
  };

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public static getInstance(): VoiceAiEngine {
    if (!VoiceAiEngine.instance) {
      VoiceAiEngine.instance = new VoiceAiEngine();
    }
    return VoiceAiEngine.instance;
  }

  public subscribe(listener: (state: VoicePlaybackState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  public playAllFromStart() {
    this.state.currentStepIndex = 0;
    this.speakStep(0);
  }

  public playStep(stepIndex: number) {
    if (stepIndex < 0 || stepIndex >= HOW_WE_WORK_STAGES.length) return;
    this.state.currentStepIndex = stepIndex;
    this.speakStep(stepIndex);
  }

  private speakStep(index: number) {
    if (!this.synth) {
      // Fallback timer simulation if speech synthesis not available in iframe
      this.simulateSpeech(index);
      return;
    }

    this.synth.cancel();

    const stage = HOW_WE_WORK_STAGES[index];
    if (!stage) return;

    const utterance = new SpeechSynthesisUtterance(stage.narrationScript);
    utterance.rate = this.state.speechRate;
    utterance.pitch = this.state.pitch;
    utterance.volume = this.state.isMuted ? 0 : this.state.volume;

    // Pick English South Africa or general English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-ZA') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.state.currentStepIndex = index;
      this.notify();
    };

    utterance.onend = () => {
      if (this.state.currentStepIndex < HOW_WE_WORK_STAGES.length - 1 && this.state.isPlaying) {
        // Auto-advance to next stage
        setTimeout(() => {
          this.speakStep(this.state.currentStepIndex + 1);
        }, 600);
      } else {
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.notify();
      }
    };

    utterance.onerror = () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private simulateSpeech(index: number) {
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.state.currentStepIndex = index;
    this.notify();

    const stage = HOW_WE_WORK_STAGES[index];
    const duration = (stage ? stage.audioDurationSeconds : 10) * 1000;

    setTimeout(() => {
      if (this.state.isPlaying && this.state.currentStepIndex < HOW_WE_WORK_STAGES.length - 1) {
        this.simulateSpeech(this.state.currentStepIndex + 1);
      } else {
        this.state.isPlaying = false;
        this.notify();
      }
    }, duration);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
    this.state.isPaused = true;
    this.state.isPlaying = false;
    this.notify();
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.state.isPaused = false;
      this.state.isPlaying = true;
      this.notify();
    } else {
      this.speakStep(this.state.currentStepIndex);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.notify();
  }

  public nextStep() {
    if (this.state.currentStepIndex < HOW_WE_WORK_STAGES.length - 1) {
      this.playStep(this.state.currentStepIndex + 1);
    }
  }

  public prevStep() {
    if (this.state.currentStepIndex > 0) {
      this.playStep(this.state.currentStepIndex - 1);
    }
  }

  public setSpeed(rate: number) {
    this.state.speechRate = rate;
    this.notify();
    if (this.state.isPlaying) {
      this.speakStep(this.state.currentStepIndex);
    }
  }

  public setVolume(vol: number) {
    this.state.volume = vol;
    this.state.isMuted = vol === 0;
    this.notify();
  }

  public toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    this.notify();
  }
}
