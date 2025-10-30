// path: src/app/components/cook-component/cook-component.ts
import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

type ChefImage = { src: string; alt: string; caption?: string };

@Component({
  selector: 'app-cook',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './cook-component.html',
  styleUrls: ['./cook-component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CookComponent {
  // Allow easy future tweaks for background speed
  backgroundSpeed = 0.5;

  // Lottie background specific for the Cook page
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/chef-background.json',
    loop: true,
    autoplay: true,
    renderer: 'svg',
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  onLottieCreated(animation: AnimationItem) {
    animation.setSpeed(this.backgroundSpeed);
  }

  // 👇 Lightbox data (kept your links)
  images: ChefImage[] = [
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/se%CC%81fba%CC%81l_nhk2vj.jpg',
      alt: 'Plating in service',
      caption: 'Plating during service — timing, precision, teamwork.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/okes1_uvqnx6.jpg',
      alt: 'Competition dish',
      caption: 'Competition dish — focus on detail and consistency.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/farsang_kupa_cnhaab.jpg',
      alt: 'Hot pass',
      caption: 'Hot pass — communication under pressure.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/magyarorszagetele_r3r8qa.jpg',
      alt: 'Prep work',
      caption: 'Prep work — mise en place and clean execution.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/magyarorszagetele_r3r8qa.jpg',
      alt: 'Prep work',
      caption: 'Prep work — mise en place and clean execution.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/magyarorszagetele_r3r8qa.jpg',
      alt: 'Prep work',
      caption: 'Prep work — mise en place and clean execution.',
    },
  ];

  // Lightbox state
  lightboxOpen = false;
  currentIndex = 0;

  openLightbox(i: number) {
    this.currentIndex = i;
    this.lightboxOpen = true;
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    // (optional) pre-load neighbors for snappier next/prev
    this.preload(this.currentIndex + 1);
    this.preload(this.currentIndex - 1);
  }

  closeLightbox() {
    this.lightboxOpen = false;
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.preload(this.currentIndex + 1);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.preload(this.currentIndex - 1);
  }

  private preload(i: number) {
    const idx = (i + this.images.length) % this.images.length;
    const src = this.images[idx]?.src;
    if (!src) return;
    const img = new Image();
    img.src = src;
  }

  // Keyboard accessibility
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    else if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
  }
}
