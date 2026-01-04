import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'angular-frontend';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      AOS.init();
    }
  }
}
