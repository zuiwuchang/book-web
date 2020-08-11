import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GitComponent } from './git/git.component';
const routes: Routes = [
  {
    path: '',
    component: GitComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GitRoutingModule { }
