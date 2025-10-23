// path: src/app/components/home/home.component.ts
import {AfterViewInit, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import type {AnimationItem} from 'lottie-web';
import {CodeNameComponent} from '../code-name-component/code-name.component';
import {TechnologiesComponent} from '../technologies/technologies.component';
import {animate, style, transition, trigger} from '@angular/animations';
import {MyStoryComponent} from '../my-story/my-story.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LottieComponent, CodeNameComponent, TechnologiesComponent,MyStoryComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('heroFade', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(40px)'}),
        animate('900ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
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
    rendererSettings: {preserveAspectRatio: 'xMidYMid slice'},
  };

  hexOptions: AnimationOptions<'svg'> = {
    path: 'assets/flash_bg.json',
    loop: false,          // play once per cycle
    autoplay: false,      // start after bg completes
    renderer: 'svg',
    rendererSettings: {preserveAspectRatio: 'xMidYMid meet'},
  };

  private bg?: AnimationItem;
  private hex?: AnimationItem;
  private reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  private cycleTimer: number | null = null;
  private starting = false;

  /** Wire instances from template */
  onBgCreated = (a: AnimationItem) => {
    this.bg = a;
    this.tryStart();
  };
  onHexCreated = (a: AnimationItem) => {
    this.hex = a;
    this.tryStart();
  };

  ngAfterViewInit(): void {
    const box = document.getElementById('introBox');
    if (!box) return;

    const lines = Array.from(box.querySelectorAll<HTMLElement>('.reveal'));
    if (!lines.length) return;

    // If user prefers reduced motion → just show all instantly
    if (this.reduce) {
      lines.forEach(el => el.classList.add('shown'));
      return;
    }

    // IntersectionObserver reveals each line ONCE when it comes into view
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;

            // small stagger for natural flow
            const idx = Number(el.dataset['i'] ?? 0);
            const stagger = 60; // ms between lines

            setTimeout(() => {
              el.classList.add('shown');
            }, idx * stagger);

            io.unobserve(el); // reveal once only
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -25% 0px',
        threshold: 0.25
      }
    );

    // assign index for stagger timing
    lines.forEach((el, i) => {
      el.dataset['i'] = String(i);
      io.observe(el);
    });

    // Cleanup observer when component destroyed
    const prevDestroy = this.ngOnDestroy?.bind(this);
    this.ngOnDestroy = () => {
      io.disconnect();
      prevDestroy?.();
    };
  }

  ngOnDestroy(): void {
    if (this.cycleTimer) {
      clearTimeout(this.cycleTimer);
      this.cycleTimer = null;
    }
    // detach listeners (defensive)
    this.bg?.removeEventListener?.('complete', this.noop);
    this.hex?.removeEventListener?.('complete', this.noop);
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
    this.runCycle().catch(() => {
    });
  }

  /** One full cycle: bg → hex → wait 3s → repeat */
  private async runCycle() {
    while (!this.reduce) {
      // reset both to frame 0
      this.bg?.stop();
      this.bg?.goToAndStop(0, true);
      this.hex?.stop();
      this.hex?.goToAndStop(0, true);

      // play background, wait until complete
      await this.playOnce(this.bg!);

      // then play hex once, wait
      await this.playOnce(this.hex!);

      // pause 3s, then loop
      await this.wait(3000);
    }
  }

  /** Play an item from 0 and resolve on 'complete' */
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

  // dummy for removeEventListener in ngOnDestroy
  private noop = () => {
  };
}
