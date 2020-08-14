import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditComponent } from './edit/edit.component';
import { SavedGuard } from './edit/saved.guard';
const routes: Routes = [
  {
    path: ':book/:chapter',
    component: EditComponent,
    canDeactivate: [SavedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
