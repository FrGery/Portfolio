import { Component, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SnakeComponent implements AfterViewInit, OnDestroy {
  private scriptEl?: HTMLScriptElement;
  private styleEl?: HTMLLinkElement;

  ngAfterViewInit(): void {
    this.styleEl = document.createElement('link');
    this.styleEl.rel = 'stylesheet';
    this.styleEl.href = 'assets/snake/style.css';
    document.head.appendChild(this.styleEl);

    this.scriptEl = document.createElement('script');
    this.scriptEl.src = 'assets/snake/game.js';
    this.scriptEl.async = false;
    this.scriptEl.onload = () => {
      const evt = new Event('DOMContentLoaded');
      document.dispatchEvent(evt);
    };
    document.body.appendChild(this.scriptEl);
  }

  ngOnDestroy(): void {
    if (this.scriptEl?.parentNode) document.body.removeChild(this.scriptEl);
    if (this.styleEl?.parentNode) document.head.removeChild(this.styleEl);
  }
}
