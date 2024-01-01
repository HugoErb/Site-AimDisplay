import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importez votre component Home

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirection vers 'home'
  { path: 'home', component: HomeComponent }, // Route pour 'home'
];
