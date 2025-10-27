// path: src/app/components/home/home.component.ts
import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import type { AnimationItem } from 'lottie-web';
import { CodeNameComponent } from '../code-name-component/code-name.component';
import { TechnologiesComponent } from '../technologies/technologies.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { MyStoryComponent } from '../my-story/my-story.component';

// ⬇️ NEW: AOS
import AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LottieComponent, CodeNameComponent, TechnologiesComponent, MyStoryComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('heroFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('900ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnDestroy, AfterViewInit {
  /** Background (full screen) */
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/lottie.json',
    loop: false,          // we loop manually
    autoplay: false,      // we start manually
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  /** Hex behind portrait */
  hexOptions: AnimationOptions<'svg'> = {
    path: 'assets/flash_bg.json',
    loop: false,          // play once per cycle
    autoplay: false,      // start after bg completes
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  };

  private bg?: AnimationItem;
  private hex?: AnimationItem;
  private reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  private cycleTimer: number | null = null;
  private starting = false;

  /** NEW: guard to stop the loop during destroy */
  private killed = false;

  /** Wire instances from template */
  onBgCreated = (a: AnimationItem) => { this.bg = a; this.tryStart(); };
  onHexCreated = (a: AnimationItem) => { this.hex = a; this.tryStart(); };

  ngAfterViewInit(): void {
    // ⬇️ Init AOS after the view is ready.
    // We use a tiny timeout so Angular finishes its first paint before AOS grabs positions.
    setTimeout(() => {
      AOS.init({
        once: true,            // animate only the first time
        duration: 700,         // ms
        easing: 'ease-out',
        offset: 80,            // start a bit earlier than default
        startEvent: 'DOMContentLoaded',
      });
      // One more refresh in the next microtask to cover Lottie sizing/layout shifts
      setTimeout(() => AOS.refreshHard(), 0);
    }, 0);
  }

  // UPDATED: safe teardown
  ngOnDestroy(): void {
    this.killed = true;
    if (this.cycleTimer) { clearTimeout(this.cycleTimer); this.cycleTimer = null; }
    try { this.bg?.stop?.();  this.bg?.destroy?.(); } catch {}
    try { this.hex?.stop?.(); this.hex?.destroy?.(); } catch {}
  }

  /** Start once both animations are ready */
  private tryStart() {
    if (this.starting || !this.bg || !this.hex) return;
    this.starting = true;

    if (this.reduce) {
      this.bg.goToAndStop(0, true);
      this.hex.goToAndStop(0, true);
      return;
    }

    // kick off the loop
    this.runCycle().catch(() => {});
  }

  /** One full cycle: bg → hex → wait 2s → repeat */
  private async runCycle() {
    while (!this.reduce && !this.killed) {
      this.bg?.stop();  this.bg?.goToAndStop(0, true);
      this.hex?.stop(); this.hex?.goToAndStop(0, true);

      if (this.killed) break;
      await this.playOnce(this.bg!);

      if (this.killed) break;
      await this.playOnce(this.hex!);

      if (this.killed) break;
      await this.wait(2000);
    }
  }

  /** Play an item from 0 and resolve on 'complete' */
  private playOnce(anim: AnimationItem): Promise<void> {
    return new Promise<void>((resolve) => {
      const handler = () => { anim.removeEventListener('complete', handler); resolve(); };
      anim.addEventListener('complete', handler);
      anim.goToAndPlay(0, true);
    });
  }

  private wait(ms: number) {
    return new Promise<void>((res) => {
      this.cycleTimer = window.setTimeout(() => res(), ms);
    });
  }

  private noop = () => {};
}
