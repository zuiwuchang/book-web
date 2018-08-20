import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LicenseComponent } from './app/license/license.component';
import { AboutComponent } from './app/about/about.component';
import { ViewComponent } from './app/view/view.component';
import { EditComponent } from './app/edit/edit.component';
import { EditSavedGuard } from './app/edit/edit-saved.guard';
import { BooksComponent } from './app/books/books.component';
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
  {
    path: 'edit/:book/:chapter',
    component: EditComponent,
    canDeactivate: [EditSavedGuard]
  },
  {
    path: 'books',
    component: BooksComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
