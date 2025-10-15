import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RevealOnScrollDirective} from '../../shared/reveal-on-scroll';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './technologies.html',
  styleUrls: ['./technologies.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TechnologiesComponent {
  main = [
    'Java',
    'Spring Boot',
    'REST APIs',
    'Angular',
    'TypeScript',
    'HTML',
    'SCSS',
    'PostgreSQL',
    'Git',
    'Docker'
  ];

  additional = [
    'JPA / Hibernate',
    'JWT / Auth',
    'WebSockets',
    'JUnit',
    'Flyway',
    'CI/CD (GitHub Actions)',
    'RxJS',
    'Bootstrap',
    'Swagger / OpenAPI',
    'Lottie'
  ];
}
