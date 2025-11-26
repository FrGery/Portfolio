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
export class HomeComponent implements AfterViewInit, OnDestroy {
  // Background: loop and autoplay (we control only speed)
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/circuit.json',
    loop: true,
    autoplay: true,
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  // Hex: play bursts every 2s, managed by a timer
  hexOptions: AnimationOptions<'svg'> = {
    path: 'assets/flash_bg.json',
    loop: false,
    autoplay: false,
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  };

  private bg?: AnimationItem;
  private hex?: AnimationItem;
  private hexTimer: number | null = null;

  private reduce =
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  // Wire instances from template
  onBgCreated = (a: AnimationItem) => {
    this.bg = a;
    if (this.reduce) {
      a.goToAndStop(0, true);
      return;
    }
    // 0.5x slow motion, always playing
    try {
      a.setSpeed(0.1);
    } catch {}
    // If autoplay somehow hasn’t started yet, ensure it runs
    a.play?.();
  };

  onHexCreated = (a: AnimationItem) => {
    this.hex = a;
    if (this.reduce) {
      a.goToAndStop(0, true);
      return;
    }

    const playHex = () => {
      try {
        a.stop?.();
        a.goToAndPlay(0, true);
      } catch {}
    };

    // fire immediately once, then every 2s
    playHex();
    this.clearHexTimer();
    this.hexTimer = window.setInterval(playHex, 8000);
  };

  ngAfterViewInit(): void {
    // If AOS already booted elsewhere, just refresh for layout correctness
    if ((window as any).__aosBooted) {
      setTimeout(() => AOS.refreshHard(), 0);
    }
  }

  ngOnDestroy(): void {
    this.clearHexTimer();
    try { this.bg?.stop?.();  this.bg?.destroy?.(); } catch {}
    try { this.hex?.stop?.(); this.hex?.destroy?.(); } catch {}
  }

  private clearHexTimer() {
    if (this.hexTimer) {
      clearInterval(this.hexTimer);
      this.hexTimer = null;
    }
  }
}
