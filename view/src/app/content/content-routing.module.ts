import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LicenseComponent } from './license/license.component';
import { VersionComponent } from './version/version.component';
import { SessionGuard } from '../core/guard/session.guard';
const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'license',
    component: LicenseComponent,
  },
  {
    path: 'version',
    component: VersionComponent,
    canActivate: [SessionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
