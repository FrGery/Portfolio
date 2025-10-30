// path: src/app/components/home/home.component.ts
import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import type { AnimationItem } from 'lottie-web';
import { CodeNameComponent } from '../code-name-component/code-name.component';
import { TechnologiesComponent } from '../technologies/technologies.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { MyStoryComponent } from '../my-story/my-story.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/lottie.json',
    loop: false,
    autoplay: false,
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  hexOptions: AnimationOptions<'svg'> = {
    path: 'assets/flash_bg.json',
    loop: false,
    autoplay: false,
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  };

  private bg?: AnimationItem;
  private hex?: AnimationItem;
  private reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  private cycleTimer: number | null = null;
  private starting = false;
  private aosBooted = false;
  private killed = false;

  onBgCreated = (a: AnimationItem) => {
    this.bg = a;
    this.tryStart();
  };

  onHexCreated = (a: AnimationItem) => {
    this.hex = a;
    this.tryStart();
  };

  ngAfterViewInit(): void {
    // Delay the initial AOS setup slightly so Angular paints once first.
    setTimeout(() => {
      if (!this.aosBooted) {
        AOS.init({
          once: true,
          duration: 700,
          easing: 'ease-out',
          offset: 80,
          startEvent: 'DOMContentLoaded',
        });
        this.aosBooted = true;
      }
    }, 300);
  }

  ngOnDestroy(): void {
    this.killed = true;
    if (this.cycleTimer) {
      clearTimeout(this.cycleTimer);
      this.cycleTimer = null;
    }
    try {
      this.bg?.stop?.();
      this.bg?.destroy?.();
    } catch {}
    try {
      this.hex?.stop?.();
      this.hex?.destroy?.();
    } catch {}
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

    // Wait for the header Lotties to render, THEN refresh AOS
    setTimeout(() => {
      AOS.refreshHard();
    }, 900);

    this.runCycle().catch(() => {});
  }

  private async runCycle() {
    while (!this.reduce && !this.killed) {
      this.bg?.stop();
      this.bg?.goToAndStop(0, true);
      this.hex?.stop();
      this.hex?.goToAndStop(0, true);

      if (this.killed) break;
      await this.playOnce(this.bg!);
      if (this.killed) break;
      await this.playOnce(this.hex!);
      if (this.killed) break;
      await this.wait(2000);
    }
  }

  private playOnce(anim: AnimationItem): Promise<void> {
    return new Promise<void>((resolve) => {
      const handler = () => {
        anim.removeEventListener('complete', handler);
        resolve();
      };
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
