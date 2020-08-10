import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewComponent } from './app/view/view.component';
import { EditComponent } from './app/edit/edit.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/view/home/0',
    pathMatch: 'full',
  },
  {
    path: 'view/:book/:chapter',
    component: ViewComponent,
  },
  {
    path: 'edit/:book/:chapter',
    component: EditComponent,
    // canActivate: [LoginGuard],
    // canDeactivate: [EditSavedGuard]
  },
  {
    path: 'content',
    loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
