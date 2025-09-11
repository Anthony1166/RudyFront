import { Routes } from '@angular/router';
import {HomeComponent} from './components/home-component/home-component';
import {LoginComponent} from './components/testing/login.component/login.component';
import {AdminComponent} from './components/admin-component/admin-component';
import {RegisterComponent} from './components/testing/register.component/register.component';
import {Administracion} from './components/admin-component/administracion/administracion';

export const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'Home', component: HomeComponent },
  {path: 'Logintesting', component: LoginComponent},
  {path: 'login', component: AdminComponent},
  {path: 'administracion', component: Administracion},
];
