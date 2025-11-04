import {AfterViewInit, Component, ElementRef, input, OnDestroy, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
// @ts-ignore
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-code-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-name.component.html',
  styleUrls: ['./code-name.component.scss'],
})
export class CodeNameComponent implements AfterViewInit, OnDestroy {
  name = input<string>('Friedrich Gergő');
  startDelayMs = input<number>(2000);
  typeDelayMs = input<number>(22);
  cursor = input<string>('▌');

  @ViewChild('tw', {static: true}) twRef!: ElementRef<HTMLDivElement>;
  private tw: Typewriter | null = null;

  ngAfterViewInit(): void {
    const html = this.buildHtml(this.name());


    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      this.twRef.nativeElement.innerHTML = html;
      this.twRef.nativeElement.classList.add('no-cursor');
      return;
    }

    this.tw = new Typewriter(this.twRef.nativeElement, {
      delay: this.typeDelayMs(),
      cursor: this.cursor(),
    });

    this.tw
      .pauseFor(this.startDelayMs())
      .typeString(html)
      .start();
  }

  ngOnDestroy(): void {

    if (this.tw) {
      this.tw.stop();
      this.tw = null;
    }
  }

  private buildHtml(n: string): string {

    return [
      `<span class="kw">class</span> <span class="type">Developer</span><span class="punct">{</span>`,
      `<br><span class="type">String</span> <span class="var">name</span> <span class="op">=</span>`,
      `<br><span class="name-big">“${this.escape(n)}”</span>`,
      `<br><span class="punct">}</span>`,
    ].join('');
  }

  private escape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
}
