import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewComponent } from './app/view/view.component';
import { EditComponent } from './app/edit/edit.component';
import { SessionGuard } from './core/guard/session.guard';
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
    canActivate: [SessionGuard],
    // canDeactivate: [EditSavedGuard]
  },
  {
    path: 'content',
    loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
  },
  {
    path: 'git',
    loadChildren: () => import('./git/git.module').then(m => m.GitModule),
    canActivate: [SessionGuard],
  },
  {
    path: 'books',
    loadChildren: () => import('./books/books.module').then(m => m.BooksModule),
    canActivate: [SessionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
