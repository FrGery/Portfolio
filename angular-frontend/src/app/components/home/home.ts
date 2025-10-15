// path: src/app/components/home/home.component.ts
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import type { AnimationItem } from 'lottie-web';
import { CodeNameComponent } from '../code-name-component/code-name.component';
import {TechnologiesComponent} from '../technologies/technologies.component';
import { trigger, transition, style, animate } from '@angular/animations'; // 👈 NEW


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LottieComponent, CodeNameComponent,TechnologiesComponent],
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
export class HomeComponent implements OnDestroy {
  /** Background (full screen) */
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/background.json',
    loop: false,          // ⬅ we loop manually
    autoplay: false,      // ⬅ we start manually
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  /** Hex behind portrait */
  hexOptions: AnimationOptions<'svg'> = {
    path: 'assets/flash_bg.json',
    loop: false,          // ⬅ play once per cycle
    autoplay: false,      // ⬅ start after bg completes
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  };

  private bg?: AnimationItem;
  private hex?: AnimationItem;
  private reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  private cycleTimer: number | null = null;
  private starting = false;
  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/',
      svg: `M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88
          1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z`,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/FrGery',
      svg: `M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71
          -2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.13-1.5-1.13-1.5-.92-.64.07-.62.07-.62
          1.02.07 1.56 1.06 1.56 1.06.9 1.58 2.36 1.12 2.93.86.09-.67.35-1.12.64-1.38
          -2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75
          0 0 .84-.27 2.75 1.05.8-.23 1.66-.35 2.51-.35.85 0 1.71.12 2.51.35
          1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75
          0 3.95-2.35 4.82-4.58 5.07.36.32.69.94.69 1.9 0 1.37-.01 2.47-.01 2.81
          0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z`,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/',
      svg: `M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037
          -1.853 0-2.136 1.446-2.136 2.941v5.665H9.351V9h3.413v1.561h.048
          c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.269 2.37 4.269 5.455v6.288z
          M5.337 7.433a2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127z
          M7.119 20.452H3.554V9h3.565v11.452z`,
    },
    {
      name: 'Email',
      url: 'mailto:your.email@example.com',
      svg: `M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6
          c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z`,
    },
  ];

  /** Wire instances from template */
  onBgCreated = (a: AnimationItem) => { this.bg = a; this.tryStart(); };
  onHexCreated = (a: AnimationItem) => { this.hex = a; this.tryStart(); };

  ngOnDestroy(): void {
    if (this.cycleTimer) { clearTimeout(this.cycleTimer); this.cycleTimer = null; }
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
    this.runCycle().catch(() => {});
  }

  /** One full cycle: bg → hex → wait 3s → repeat */
  private async runCycle() {
    while (!this.reduce) {
      // reset both to frame 0
      this.bg?.stop();  this.bg?.goToAndStop(0, true);
      this.hex?.stop(); this.hex?.goToAndStop(0, true);

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

  // dummy for removeEventListener in ngOnDestroy
  private noop = () => {};
}
