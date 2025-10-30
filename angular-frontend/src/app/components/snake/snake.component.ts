import { Component, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'], // keep empty or for Angular-only styles
  encapsulation: ViewEncapsulation.None,
})
export class SnakeComponent implements AfterViewInit, OnDestroy {
  private scriptEl?: HTMLScriptElement;
  private styleEl?: HTMLLinkElement;

  ngAfterViewInit(): void {
    // 1️⃣ Load your original CSS
    this.styleEl = document.createElement('link');
    this.styleEl.rel = 'stylesheet';
    this.styleEl.href = 'assets/snake/style.css'; // moved to assets (see below)
    document.head.appendChild(this.styleEl);

    // 2️⃣ Load your original JavaScript
    this.scriptEl = document.createElement('script');
    this.scriptEl.src = 'assets/snake/game.js';
    this.scriptEl.async = false;
    this.scriptEl.onload = () => {
      // manually trigger DOMContentLoaded
      const evt = new Event('DOMContentLoaded');
      document.dispatchEvent(evt);
    };
    document.body.appendChild(this.scriptEl);
  }

  ngOnDestroy(): void {
    // cleanup
    if (this.scriptEl?.parentNode) document.body.removeChild(this.scriptEl);
    if (this.styleEl?.parentNode) document.head.removeChild(this.styleEl);
  }
}
