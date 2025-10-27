// path: src/app/components/navbar/navbar.component.ts
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type MenuItem = { label: string; link: string };
type Social = { name: string; url: string; svg: string };

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  readonly emailAddress = 'f2gergo@gmail.com';
  showCopied = false;
  readonly THRESHOLD = 180;     // px: when banner hides
  readonly STICKY_DELAY = 250;  // ms: delay before sticky shows

  scrolled = false;
  showSticky = false;
  menuOpen = false;
  private stickyTimer: number | null = null;

  menu: MenuItem[] = [
    { label: 'Home',          link: '/' },
    { label: 'Technologies',  link: '/technologies' },
    { label: 'My Story',  link: '/mystory' },
    { label: 'Projects',      link: '/projects' },
    { label: 'Chef Career',   link: '/chef' },
  ];

  socials: Social[] = [
   // { name: 'Facebook', url: 'https://facebook.com/', svg: 'M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z' },
    { name: 'GitHub',   url: 'https://github.com/FrGery', svg: 'M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.13-1.5-1.13-1.5-.92-.64.07-.62.07-.62 1.02.07 1.56 1.06 1.56 1.06.9 1.58 2.36 1.12 2.93.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05.8-.23 1.66-.35 2.51-.35.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.82-4.58 5.07.36.32.69.94.69 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gerg%C5%91-friedrich-74a82a290//', svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.941v5.665H9.351V9h3.413v1.561h.048c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.269 2.37 4.269 5.455v6.288zM5.337 7.433a2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127zM7.119 20.452H3.554V9h3.565v11.452z' },
    { name: 'Email',    url: 'mailto:f2gergo@gmail.com', svg: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const becameScrolled = !this.scrolled && y > this.THRESHOLD;
    const backToTop     =  this.scrolled && y <= this.THRESHOLD;

    this.scrolled = y > this.THRESHOLD;

    if (becameScrolled) {
      if (this.stickyTimer) clearTimeout(this.stickyTimer);
      this.stickyTimer = window.setTimeout(() => { this.showSticky = true; }, this.STICKY_DELAY);
    } else if (backToTop) {
      if (this.stickyTimer) clearTimeout(this.stickyTimer);
      this.showSticky = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.documentElement.classList.toggle('no-scroll', this.menuOpen);
    document.body.classList.toggle('no-scroll', this.menuOpen);
  }
  closeMenu(): void {
    this.menuOpen = false;
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }
  copyEmail(): void {
    const btn = document.querySelector<HTMLButtonElement>('.email-btn');
    navigator.clipboard.writeText(this.emailAddress).then(() => {
      if (btn) {
        btn.classList.add('flash');
        setTimeout(() => btn.classList.remove('flash'), 600);
      }

      this.showCopied = true;
      setTimeout(() => (this.showCopied = false), 2500);
    });
  }
}
