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
  /** Inputs */
  name = input<string>('Friedrich Gergő');
  cps = input<number>(45);            // characters per second
  startDelayMs = input<number>(2000); // start delay

  /** State */
  visibleTokens = signal<Token[]>([]);
  cursorVisible = signal(true);

  /** Internals */
  private stream: Token[] = [];
  private idx = 0;
  private typeTimer: number | null = null;
  private blinkTimer: number | null = null;

  ngOnInit(): void {
    this.stream = this.buildCharStream(this.name());

    // Handle "prefers reduced motion"
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      this.visibleTokens.set([...this.stream]);
      this.cursorVisible.set(false);
      return;
    }

    this.cursorVisible.set(false);
    setTimeout(() => {
      this.startTyping();

      // Start blinking cursor after typing begins
      this.cursorVisible.set(true);
      this.blinkTimer = window.setInterval(() => {
        this.cursorVisible.update(v => !v);
      }, 600);
    }, this.startDelayMs());
  }

  ngOnDestroy(): void {
    if (this.typeTimer) clearInterval(this.typeTimer);
    if (this.blinkTimer) clearInterval(this.blinkTimer);
  }

  /** Text for accessibility */
  plainText(): string {
    return this.stream.map(c => c.text).join('');
  }

  /** Build tokens -> flat char stream */
  private buildCharStream(n: string): Token[] {
    const toks: Token[] = [
      { text: 'class ', cls: 'kw' },
      { text: 'Developer', cls: 'type' },
      { text: '{\n', cls: 'punct' },
      { text: 'String ', cls: 'type' },
      { text: 'name ', cls: 'var' },
      { text: '= \n', cls: 'op' },
      { text: '"', cls: 'name-big' },
      { text: n, cls: 'name-big' },
      { text: '"\n', cls: 'name-big' },
      { text: '}', cls: 'punct' },
    ];

    const out: Token[] = [];
    for (const t of toks)
      for (const ch of t.text)
        out.push({ text: ch, cls: t.cls });
    return out;
  }

  /** Typing animation loop */
  private startTyping(): void {
    const stepMs = Math.max(10, Math.floor(1000 / this.cps()));
    this.visibleTokens.set([]);
    this.idx = 0;

    this.typeTimer = window.setInterval(() => {
      if (this.idx >= this.stream.length) {
        // done typing
        this.cursorVisible.set(false);
        if (this.typeTimer) clearInterval(this.typeTimer);
        if (this.blinkTimer) clearInterval(this.blinkTimer);
        return;
      }

      const nextChar = this.stream[this.idx++];
      // ❗ immutably append to trigger Angular re-render
      this.visibleTokens.set([...this.visibleTokens(), nextChar]);
    }, stepMs);
  }
}
