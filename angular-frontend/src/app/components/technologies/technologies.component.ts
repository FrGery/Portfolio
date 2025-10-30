import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule],
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
    'PostgresSQL',
    'MySQL',
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
    'Bootstrap',
    'Swagger / OpenAPI',
    'Lottie',
    'Windows',
    'Unix',
    'Bash Scripting',
    'AWS (EC2, S3)',
    'Agile / Scrum',
    'Spring Security',
    'Maven',
    'Postman',
    'Flyway'
  ];
}
