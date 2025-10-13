// path: src/app/components/home/home.component.ts
import {Component, OnDestroy, OnInit, signal, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeNameComponent } from '../code-name-component/code-name.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CodeNameComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  lastFrameUrl = signal<string | null>(null);
  private v!: HTMLVideoElement;
  private reverseInterval?: number;
  private timers: number[] = [];


  ngOnInit(): void {
    this.v = document.querySelector<HTMLVideoElement>('#bgvid')!;
    if (!this.v) return;
    this.v.muted = true;
    (this.v as any).playsInline = true;

    this.startCycle();
  }

  private startCycle() {
    this.lastFrameUrl.set(null);              // show video, hide snapshot
    this.v.classList.remove('hidden');        // fade-in video if hidden
    this.v.currentTime = 0;
    this.v.play().catch(() => {});
    this.v.onended = () => this.holdLastFrame();
  }

  private holdLastFrame() {
    const eps = 0.03;
    const target = Math.max(0, this.v.duration - eps);

    const onSeeked = async () => {
      this.v.removeEventListener('seeked', onSeeked);
      this.v.pause();

      // 1) Make snapshot first (prevents white flash)
      await this.snapshotToImage();

      // 2) On next frame, fade video out (keeps stacking; no layout jump)
      requestAnimationFrame(() => this.v.classList.add('hidden'));

      // 3) Hold 60s, then reverse
      this.timers.push(window.setTimeout(() => this.reversePhase(), 60_000));
    };

    this.v.addEventListener('seeked', onSeeked);
    this.v.currentTime = target;
  }

  private async snapshotToImage() {
    // Why: ensure we have something visible before hiding video
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.v.videoWidth || 1280;
    const h = this.v.videoHeight || 720;

    const c = document.createElement('canvas');
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);

    const ctx = c.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(this.v, 0, 0, c.width, c.height);
    // PNG avoids blocky artifacts on gradients
    const url = c.toDataURL('image/png');
    this.lastFrameUrl.set(url);
  }

  private reversePhase() {
    // Bring video back (on top), hide snapshot
    this.lastFrameUrl.set(null);
    this.v.classList.remove('hidden');

    const step = 1 / 30; // 30 FPS
    this.reverseInterval = window.setInterval(() => {
      this.v.currentTime = Math.max(0, this.v.currentTime - step);
      if (this.v.currentTime <= 0) {
        window.clearInterval(this.reverseInterval);
        // After reverse reaches start: wait 5s, loop
        this.timers.push(window.setTimeout(() => this.startCycle(), 5_000));
      }
    }, 33);
  }

  ngOnDestroy(): void {
    if (this.reverseInterval) window.clearInterval(this.reverseInterval);
    this.timers.forEach(clearTimeout);
  }
}
