import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GitRoutingModule } from './git-routing.module';
import { GitComponent } from './git/git.component';


@NgModule({
  declarations: [GitComponent],
  imports: [
    CommonModule,
    GitRoutingModule
  ]
})
export class GitModule { }
