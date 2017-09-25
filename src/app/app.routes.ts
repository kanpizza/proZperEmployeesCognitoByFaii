import { Routes, RouterModule } from '@angular/router';
import { NgModule} from '@angular/core';

import ComponentOne from './components/signup/signup.component';
import ComponentTwo from './components/verify-user/verify-user.component';
import ComponentThree from './components/login/signin.component';
import ComponentFour from './components/forgot-password/forgot-password.component';
import ComponentFive from './components/employee/employee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signup', component: ComponentOne },
  { path: 'verify-user', component: ComponentTwo},
  { path: 'signin', component: ComponentThree},
  { path: 'forgot-password', component: ComponentFour},
  { path: 'employee', component: ComponentFive}
  
];
@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports : [RouterModule]
 })
export class AppRoutingModule{}