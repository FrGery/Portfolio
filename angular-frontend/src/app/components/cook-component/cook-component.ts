// path: src/app/components/cook-component/cook-component.ts
import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import {RouterLink} from '@angular/router';

type ChefImage = { src: string; alt: string; caption?: string };

@Component({
  selector: 'app-cook',
  standalone: true,
  imports: [CommonModule, LottieComponent, RouterLink],
  templateUrl: './cook-component.html',
  styleUrls: ['./cook-component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CookComponent {
  backgroundSpeed = 0.3;

  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/Fumaa.json',
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
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761856079/cook2012_oqgmii.jpg',
      alt: '2012',
      caption: '2012 - ' +
        'Everything has to start somewhere. I stepped into the world of hospitality quite early, and before I knew it, I was helping out at real catering events.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/farsang_kupa_cnhaab.jpg',
      alt: 'Farsang kupa',
      caption: '2015 — Carnival Cup, Tata\n' +
        'My first real dive into fine dining. I joined as a chef’s assistant, helping my mentor — a Master Chef — and working side by side with some of Hungary’s top chefs.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/magyarorszagetele_r3r8qa.jpg',
      alt: 'Magyarország étele',
      caption: '2018 — Food of Hungary\n' +
        'One of the first national competitions I participated in. I didn’t win gold, but making it into the national top 12 was already a huge milestone.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/okes1_uvqnx6.jpg',
      alt: 'OKÉS',
      caption: '2018- "OKÉS" competiton (National Public Catering Contest). This time national first place. On the side of my actual chef',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761772261/se%CC%81fba%CC%81l_nhk2vj.jpg',
      alt: 'ChefBAll',
      caption: '2020 — Chef’s Ball, Hotel Benczúr\n' +
        'This was a milestone for me — I officially became a Sous-Chef. It was my first Chef’s Ball, where I worked alongside around 40 renowned chefs. We cooked for three days straight to prepare for this incredible event.',
    },
    {
      src: 'https://res.cloudinary.com/df6cyiedk/image/upload/v1761856079/backendcook_enfwya.jpg',
      alt: 'Prep work',
      caption: '2022- Working on the backend. It’s not always fine dining for a cook — and I loved every part of it.',
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
