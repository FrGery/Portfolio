import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {register} from 'swiper/element/bundle';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Project = {
  title: string;
  description: string;
  images: string[];
};

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectsComponent implements AfterViewInit {
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/lottie.json',
    loop: true,
    autoplay: true,
    renderer: 'svg',
    rendererSettings: {preserveAspectRatio: 'xMidYMid slice'},
  };

  openSnakeGame() {
    window.open('assets/snake/index.html', '_blank');
  }

  featured: Project = {
    title: 'Feedback App – Real, Ongoing projects',
    description: `
      This is my most important experience so far — the Feedback Application built for our bootcamp.
  It’s a full-featured platform where students and mentors can communicate about their experience,
  check the schedule, access lecture information, and provide feedback on both individual sessions and the program overall.

      <br/><br/>
      I worked on this project as part of a team of four in a <strong>Scrum</strong> team.
  My main contribution was integrating <strong>Cloudinary</strong> for image storage —
  allowing the backend to store only image references instead of files.
  This feature is used in multiple places, such as avatar uploads and our team’s
  Useful Links component — <strong>collaboration</strong> really mattered here.
      <br/><br/>
I also prepared the <strong>OAuth2 GitHub</strong> login feature
  for AWS deployment, ensuring it can work seamlessly
  from the server environment — not just locally.       <br/><br/>
Finally, I handled several <strong>bug tickets</strong> throughout development —
  it’s not something I can show with screenshots, but I’d be happy to walk you through the details in person.    `,
    images: [
      'https://res.cloudinary.com/df6cyiedk/image/upload/v1761652463/Screenshot_2025-10-28_at_12.50.44_fj2bb6.png',
      'https://res.cloudinary.com/df6cyiedk/image/upload/v1761652462/Screenshot_2025-10-28_at_12.49.01_irmlwr.png',
      'https://res.cloudinary.com/df6cyiedk/image/upload/v1761652463/Screenshot_2025-10-28_at_12.49.13_b8gl5y.png',
      'https://res.cloudinary.com/df6cyiedk/image/upload/v1761652463/Screenshot_2025-10-28_at_12.49.21_xbvpdq.png',
      'https://res.cloudinary.com/df6cyiedk/image/upload/v1761652462/Screenshot_2025-10-28_at_12.53.35_ymlq3r.png',
    ],
  };

  // 2) Exam-prep intro blurb
  examIntro = `
   The following projects were created as part of exam preparation exercises. Each was a timed challenge —
   I had only 6 hours to build a complete web application from scratch. While they may not look like fully polished
    professional products, they are functional, responsive, and written with clean, maintainable code, featuring practical,
    user-friendly UI.
  `;

  examProjects: Project[] = [
    {
      title: 'Budget Calculator',
      description: `
        A lightweight app to manage personal expenses: create categories, add expenses, browse a detailed itemized list,
        and view a cumulative pie chart for quick visual insight. <br/><br/>
        In the backend, the application features multi-layered
        validation built with Spring Boot and a logically structured MySQL database with properly connected relational
        tables.
      `,
      images: [
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1761645626/Screenshot_2025-10-28_at_11.00.17_r7905c.png',
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760823675/Screenshot_2025-10-18_at_23.37.55_l3m6cx.png',
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760823676/Screenshot_2025-10-18_at_23.38.14_l5nrvv.png',
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760823675/Screenshot_2025-10-18_at_23.38.05_rakjmr.png ',
      ],
    },
    {
      title: 'Art Gallery',
      description: `
        Art Gallery is a web application for browsing and showcasing artwork — like a digital version of a real-world gallery.
Users can create and categorize their own Techniques and Art pieces, all of which are stored locally in the database.
<br/><br/>
The main focus of this project was image file handling and responsive layout management — primarily implemented with Flexbox,
later enhanced using complementary CSS methods for a more dynamic and adaptive design.
<br/><br/>
(Right — it might look a bit funny at the moment, since it’s currently using mock images for demonstration.)
      `,
      images: [
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760824642/Screenshot_2025-10-18_at_23.56.02_uxfugf.png',
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760824643/Screenshot_2025-10-18_at_23.56.40_pzo1db.png',
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760824642/Screenshot_2025-10-18_at_23.56.30_azhepv.png',
        'https://res.cloudinary.com/df6cyiedk/image/upload/v1760824643/Screenshot_2025-10-18_at_23.56.17_yorfrp.png',
      ],
    },
  ];

  ngAfterViewInit(): void {
    register();

    setTimeout(() => {
      AOS.init({
        once: true,
        duration: 700,
        easing: 'ease-out',
        offset: 100,
      });
      AOS.refreshHard();
    }, 0);
  }
}
