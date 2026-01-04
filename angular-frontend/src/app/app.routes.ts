import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home';
import {CookComponent} from './components/cook-component/cook-component';
import {ProjectsComponent} from './components/projects/projects.component';
import {SnakeComponent} from './components/snake/snake.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent},
  {path: 'cook', component: CookComponent, data: { navbarTheme: 'chef' }},
  {path: 'projects', component: ProjectsComponent},
  {path: 'snake', component: SnakeComponent },
  {path: '**', redirectTo: 'home'}

];
