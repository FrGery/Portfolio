import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {register} from 'swiper/element/bundle';

@Component({
  selector: 'app-my-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-story.component.html',
  styleUrls: ['./my-story.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,

})
export class MyStoryComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    register();
  }
}
