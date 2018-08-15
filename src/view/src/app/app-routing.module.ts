import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LicenseComponent } from './app/license/license.component';
import { AboutComponent } from './app/about/about.component';
import { ViewComponent } from './app/view/view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/view/home/0',
    pathMatch: 'full'
  },
  {
    path: 'license',
    component: LicenseComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'view/:book/:chapter', 
    component: ViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
