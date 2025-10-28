import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {register} from 'swiper/element/bundle';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Project = {
  title: string;
  description: string; // allow basic <strong> etc.
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
  // Lottie background (same vibe as Home)
  lottieOptions: AnimationOptions<'svg'> = {
    path: 'assets/lottie.json',
    loop: true,
    autoplay: true,
    renderer: 'svg',
    rendererSettings: {preserveAspectRatio: 'xMidYMid slice'},
  };

  // 1) Featured real-life project
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
    Below are two fast, focused projects built in ~6 hours each to sharpen problem-solving under time pressure.
    The goal wasn’t pixel-perfect UI, but <strong>clarity of logic</strong>, <strong>data flow</strong>, and <strong>clean code</strong>.
  `;

  // 3) Exam-prep projects
  examProjects: Project[] = [
    {
      title: 'Budget Calculator – 6-hour Exam Prep',
      description: `
        Track expenses and income with live totals. Emphasis on state management,
        form handling, and edge cases. Built with <strong>Angular</strong>.
      `,
      images: [
        'https://res.cloudinary.com/demo/image/upload/w_1400,q_auto,f_auto/sample.jpg',
        'https://res.cloudinary.com/demo/image/upload/w_1400,q_auto,f_auto/sample.jpg',
      ],
    },
    {
      title: 'Art Gallery – 6-hour Exam Prep',
      description: `
        A minimalist gallery browsing experience. Efficient lists, keyboard nav,
        and a11y-friendly layout. Built with <strong>Angular</strong> + utility CSS.
      `,
      images: [
        'https://res.cloudinary.com/demo/image/upload/w_1400,q_auto,f_auto/sample.jpg',
        'https://res.cloudinary.com/demo/image/upload/w_1400,q_auto,f_auto/sample.jpg',
      ],
    },
  ];

  ngAfterViewInit(): void {
    // Enable <swiper-container>/<swiper-slide>
    register();

    // Animate on Scroll
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
