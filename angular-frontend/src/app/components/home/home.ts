import { AfterViewInit, Component, OnDestroy, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  // ✅ JAVÍTÁS: Nem adunk neki értéket azonnal, mert a window.matchMedia összeomlasztja a szervert
  private reduce = false;
  private cycleTimer: any = null; // number helyett any, mert a Node.js-ben a setTimeout objektumot ad vissza
  private starting = false;
  private killed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // ✅ JAVÍTÁS: Csak a böngészőben nézzük meg a matchMedia-t
    if (isPlatformBrowser(this.platformId)) {
      this.reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    }
  }

  onBgCreated = (a: AnimationItem) => { this.bg = a; this.tryStart(); };
  onHexCreated = (a: AnimationItem) => { this.hex = a; this.tryStart(); };

  ngAfterViewInit(): void {
    // ✅ JAVÍTÁS: AOS refresh csak böngészőben
    if (isPlatformBrowser(this.platformId)) {
      if ((window as any).__aosBooted) {
        setTimeout(() => AOS.refreshHard(), 0);
      }
    }
  }

  ngOnDestroy(): void {
    this.killed = true;

    if (this.cycleTimer) {
      // ✅ JAVÍTÁS: clearTimeout védelme
      if (isPlatformBrowser(this.platformId)) {
        clearTimeout(this.cycleTimer);
      }
      this.cycleTimer = null;
    }
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

    // Csak böngészőben indítjuk el a ciklust
    if (isPlatformBrowser(this.platformId)) {
      this.runCycle().catch(() => {});
    }
  }

  private async runCycle() {
    while (!this.reduce && !this.killed) {
      this.bg?.stop();  this.bg?.goToAndStop(0, true);
      this.hex?.stop(); this.hex?.goToAndStop(0, true);

      if (this.killed) break;
      await this.playOnce(this.bg!);

      if (this.killed) break;
      await this.playOnce(this.hex!);

      if (this.killed) break;
      await this.wait(500);
    }
  }

  private playOnce(anim: AnimationItem): Promise<void> {
    return new Promise<void>((resolve) => {
      const handler = () => { anim.removeEventListener('complete', handler); resolve(); };
      anim.addEventListener('complete', handler);
      anim.goToAndPlay(0, true);
    });
  }

  private wait(ms: number) {
    return new Promise<void>((res) => {
      // ✅ JAVÍTÁS: window.setTimeout helyett sima setTimeout és platform csekk
      if (isPlatformBrowser(this.platformId)) {
        this.cycleTimer = setTimeout(() => res(), ms);
      } else {
        res(); // Szerveren ne várjunk
      }
    });
  }
}
