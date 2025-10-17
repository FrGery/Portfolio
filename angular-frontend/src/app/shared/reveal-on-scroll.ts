// path: src/app/shared/reveal-on-scroll.directive.ts
import { Directive, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input('appRevealThreshold') threshold = 0.3;
  @Input('appRevealRootMargin') rootMargin = '0px';
  @Input('appRevealOnce') once = true;
  @Input('appRevealInitClass') initClass = 'will-reveal';
  @Input('appRevealInClass') inClass = 'in';

  private io?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.classList.add(this.initClass);

    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            node.classList.add(this.inClass);
            node.classList.remove(this.initClass);
            if (this.once) this.disconnect();
          } else if (!this.once) {
            node.classList.remove(this.inClass);
            node.classList.add(this.initClass);
          }
        }
      },
      { threshold: this.threshold, rootMargin: this.rootMargin }
    );

    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private disconnect() { this.io?.disconnect(); this.io = undefined; }
}
