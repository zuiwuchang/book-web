import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionGuard } from './core/guard/session.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/view/home/0',
    pathMatch: 'full',
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then(m => m.ViewModule),
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then(m => m.EditModule),
    canActivate: [SessionGuard],
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
