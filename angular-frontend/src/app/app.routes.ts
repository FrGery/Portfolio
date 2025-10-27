import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home';
import {CookComponent} from './components/cook-component/cook-component';
import {ProjectsComponent} from './components/projects/projects.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home' , pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'cook', component: CookComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: '**', redirectTo: 'home'}

];
