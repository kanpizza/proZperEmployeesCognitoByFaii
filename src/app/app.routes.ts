import { Routes, RouterModule } from '@angular/router';
import { NgModule} from '@angular/core';
import ComponentOne from './component-one';
import ComponentTwo from './component-two';
import ComponentThree from './component-three';
import ComponentFour from './component-four';
import ComponentFive from './component-five';
export const routes: Routes = [
  { path: '', redirectTo: 'component-three', pathMatch: 'full' },
  { path: 'component-one', component: ComponentOne },
  { path: 'component-two', component: ComponentTwo},
  { path: 'component-three', component: ComponentThree},
  { path: 'component-four', component: ComponentFour},
  { path: 'component-five', component: ComponentFive}
  
];
@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports : [RouterModule]
 })
export class AppRoutingModule{}