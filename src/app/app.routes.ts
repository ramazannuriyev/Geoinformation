import { Routes } from '@angular/router';
import { Cities } from '../app/pages/cities/cities/cities';
import { Countries } from '../app/pages/countries/countries/countries';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
  {
    path: 'countries',
    component: Countries,
  },
  {
    path: 'cities',
    component: Cities,
  },
  {
    path: '**',
    redirectTo: 'countries',
  },
];