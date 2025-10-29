import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

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
}
