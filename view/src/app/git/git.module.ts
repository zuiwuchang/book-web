import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GitRoutingModule } from './git-routing.module';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { GitComponent } from './git/git.component';


@NgModule({
  declarations: [GitComponent],
  imports: [
    CommonModule, FormsModule,
    MatProgressBarModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule,
    GitRoutingModule
  ]
})
export class GitModule { }
