// src/app/components/my-story/my-story.component.ts
import {Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import {RevealOnScrollDirective} from '../../shared/reveal-on-scroll';

@Component({
  selector: 'app-my-story',
  standalone: true,
  imports: [CommonModule,RevealOnScrollDirective],
  templateUrl: './my-story.component.html',
  styleUrls: ['./my-story.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,

})
export class MyStoryComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // define <swiper-container> & <swiper-slide>
    register();
  }
}
