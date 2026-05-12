class SoundEngine {
  private context: AudioContext | null = null;
  private enabled = false;

  init(): void {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.context) {
      type WindowWithWebkit = Window & {
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioContextClass =
        (window.AudioContext as typeof AudioContext) ||
        ((window as WindowWithWebkit).webkitAudioContext as typeof AudioContext);

      if (!AudioContextClass) {
        return;
      }

      this.context = new AudioContextClass();
    }

    if (this.context.state === "suspended") {
      void this.context.resume();
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  playTone(frequency: number, type: OscillatorType, duration: number): void {
    this.playOscillator(frequency, type, duration, 0);
  }

  playComparison(barHeight: number, maxHeight: number): void {
    if (maxHeight <= 0) {
      return;
    }

    const normalized = Math.min(Math.max(barHeight / maxHeight, 0), 1);
    const frequency = 200 + normalized * 600;
    this.playOscillator(frequency, "sine", 0.08, 0);
  }

  playSwap(): void {
    this.playOscillator(400, "triangle", 0.1, 0);
  }

  playComplete(): void {
    this.playOscillator(523, "sine", 0.12, 0);
    this.playOscillator(659, "sine", 0.12, 0.15);
    this.playOscillator(784, "sine", 0.12, 0.3);
  }

  private playOscillator(
    frequency: number,
    type: OscillatorType,
    duration: number,
    delay: number
  ): void {
    if (!this.context || !this.enabled) {
      return;
    }

    const startTime = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.25, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }
}

export const soundEngine = new SoundEngine();
