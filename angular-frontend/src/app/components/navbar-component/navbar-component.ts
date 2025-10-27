// path: src/app/components/navbar/navbar.component.ts
import {Component, HostListener, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {Router, RouterModule} from '@angular/router';

type MenuItem =
  | { type: 'scroll'; label: string; target: string }
  | { type: 'route'; label: string; route: string };

type Social = { name: string; url: string; svg: string };

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, @Inject(DOCUMENT) private doc: Document) {
  }

  readonly emailAddress = 'f2gergo@gmail.com';
  showCopied = false;
  readonly THRESHOLD = 180;
  readonly STICKY_DELAY = 250;
  readonly MENU_STEP = 150;
  readonly SOCIAL_STEP = 500;

  scrolled = false;
  showSticky = false;
  menuOpen = false;
  private stickyTimer: number | null = null;

  // ✅ Your mixed scroll/route menu
  menu: MenuItem[] = [
    {type: 'scroll', label: 'Home', target: 'top'},
    {type: 'scroll', label: 'Technologies', target: 'technologies'},
    {type: 'scroll', label: 'My Story', target: 'my-story'},
    {type: 'route', label: 'Projects', route: '/projects'},
    {type: 'route', label: 'Chef Career', route: '/cook'},
  ];

  socials: Social[] = [
    {
      name: 'GitHub',
      url: 'https://github.com/FrGery',
      svg: 'M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.13-1.5-1.13-1.5-.92-.64.07-.62.07-.62 1.02.07 1.56 1.06 1.56 1.06.9 1.58 2.36 1.12 2.93.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05.8-.23 1.66-.35 2.51-.35.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.82-4.58 5.07.36.32.69.94.69 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gerg%C5%91-friedrich-74a82a290//',
      svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.941v5.665H9.351V9h3.413v1.561h.048c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.269 2.37 4.269 5.455v6.288zM5.337 7.433a2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127zM7.119 20.452H3.554V9h3.565v11.452z'
    },
    {
      name: 'Email',
      url: 'mailto:f2gergo@gmail.com',
      svg: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z'
    },
  ];

  // ⬇️ NEW: randomized delays per item (ms)
  menuDelays: number[] = [];
  socialDelays: number[] = [];

  ngOnInit(): void {
    // Build a random order, then assign step delays 200–300ms apart
    const randOrder = (n: number) => [...Array(n).keys()].sort(() => Math.random() - 0.5);

    const step = () => Math.floor(200 + Math.random() * 100); // 200–300
    const buildDelays = (n: number) => {
      const order = randOrder(n);
      const del = new Array(n).fill(0);
      let acc = 0;
      for (const idx of order) {
        acc += step();
        del[idx] = acc;
      }
      return del;
    };

    this.menuDelays = buildDelays(this.menu.length);
    this.socialDelays = buildDelays(this.socials.length);
  }

  // helpers for template
  getMenuDelay(i: number): number {
    return i * this.MENU_STEP;
  }

  getSocialDelay(i: number): number {
    const base = this.menu.length * this.MENU_STEP;
    return base + i * this.SOCIAL_STEP;
  }

  // ----- existing behavior unchanged below -----
  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const becameScrolled = !this.scrolled && y > this.THRESHOLD;
    const backToTop = this.scrolled && y <= this.THRESHOLD;

    this.scrolled = y > this.THRESHOLD;

    if (becameScrolled) {
      if (this.stickyTimer) clearTimeout(this.stickyTimer);
      this.stickyTimer = window.setTimeout(() => {
        this.showSticky = true;
      }, this.STICKY_DELAY);
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

  async onScrollClick(targetId: string) {
    const atHome =
      this.router.url === '/home' ||
      this.router.url === '/' ||
      this.router.url.startsWith('/home?') ||
      this.router.url.startsWith('/home#');

    const doScroll = () => {
      const el = this.doc.getElementById(targetId);
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    };

    if (atHome) {

      doScroll();
    } else {
      // go to /home first, then scroll when the view is rendered
      await this.router.navigate(['/home']);
      setTimeout(doScroll, 50); // small tick so DOM is ready
    }

    this.closeMenu();
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
