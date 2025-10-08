// path: src/app/components/code-name/code-name.component.ts
import { Component, OnDestroy, OnInit, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

type Token = { text: string; cls: string };

@Component({
  selector: 'app-code-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-name.component.html',
  styleUrls: ['./code-name.component.scss'],
})
export class CodeNameComponent implements OnInit, OnDestroy {
  name = input<string>('Friedrich Gergő');
  role = input<string>('Full Stack Developer');
  cps = input<number>(45);
  pauseMs = input<number>(200);

  private full: Token[] = [];
  private animId: number | null = null;
  private idxToken = 0;
  private idxChar = 0;
  private lastTs = 0;

  visibleTokens = signal<Token[]>([]);
  cursorVisible = signal(true);
  copiedMsg = signal('');

  ngOnInit(): void {
    this.full = this.buildJavaLine(this.name());

    // Respect reduced motion: render instantly
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      this.visibleTokens.set([...this.full]);
      this.cursorVisible.set(false);
    } else {
      const START_DELAY_MS = 3000; // ⏱ delay whole animation
      this.cursorVisible.set(false); // no blink before start

      setTimeout(() => {
        this.startTyping();

        // start cursor blink only after typing begins
        this.cursorVisible.set(true);
        const blink = () => {
          this.cursorVisible.set(!this.cursorVisible());
          setTimeout(blink, 600);
        };
        setTimeout(blink, 600);
      }, START_DELAY_MS);
    }

    // keep your copied-msg auto-clear
    effect(() => {
      if (this.copiedMsg()) setTimeout(() => this.copiedMsg.set(''), 1200);
    });
  }

  ngOnDestroy(): void { if (this.animId) cancelAnimationFrame(this.animId); }

  plainText(): string { return this.full.map(t => t.text).join(''); }


  // REPLACE ONLY this function in code-name.component.ts
  private buildJavaLine(n: string): Token[] {
    return [
      // line 1: classDeveloper{
      { text: 'class ', cls: 'kw' },
      { text: 'Developer', cls: 'type' },
      { text: '{\n', cls: 'punct' },

      // line 2: Stringname=
      { text: 'String ', cls: 'type' },
      { text: 'name ', cls: 'var' },
      { text: '= \n', cls: 'op' },

      // line 3: “Friedrich Gergő”
      { text: '“', cls: 'quote' },
      { text: n, cls: 'name-big' },   // BIG green name
      { text: '”\n', cls: 'quote' },

      // line 4: }
      { text: '}', cls: 'punct' },
    ];
  }

  private startTyping(): void {
    this.visibleTokens.set([]);
    this.idxToken = 0; this.idxChar = 0; this.lastTs = performance.now();
    const step = (ts: number) => {
      const elapsed = ts - this.lastTs;
      const chars = Math.max(1, Math.floor((elapsed / 1000) * this.cps()));
      this.lastTs = ts;
      let remaining = chars;

      while (remaining-- > 0 && this.idxToken < this.full.length) {
        const t = this.full[this.idxToken];
        const parts = this.visibleTokens();
        const current = parts[this.idxToken]?.text ?? '';
        const nextChar = t.text.charAt(this.idxChar);
        if (!parts[this.idxToken]) parts.push({ text: nextChar, cls: t.cls });
        else parts[this.idxToken] = { text: current + nextChar, cls: t.cls };
        this.visibleTokens.set(parts);
        this.idxChar++;

        if (this.idxChar >= t.text.length) {
          this.idxToken++; this.idxChar = 0;
          if (this.idxToken < this.full.length && this.pauseMs() > 0) {
            this.animId = requestAnimationFrame(() => {
              setTimeout(() => { this.lastTs = performance.now(); this.animId = requestAnimationFrame(step); }, this.pauseMs());
            });
            return;
          }
        }
      }

      if (this.idxToken < this.full.length) this.animId = requestAnimationFrame(step);
      else this.cursorVisible.set(false);
    };
    this.animId = requestAnimationFrame(step);
  }
}
