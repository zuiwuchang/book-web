import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Chapter } from 'src/app/core/protocol';
@Component({
  selector: 'app-new-chapter',
  templateUrl: './new-chapter.component.html',
  styleUrls: ['./new-chapter.component.scss']
})
export class NewChapterComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<NewChapterComponent>,
  ) { }
  data: Chapter = {
    id: '',
    name: '',
  }
  ngOnInit(): void {
  }
  onCancel() {
    this.dialogRef.close()
  }
  onSure() {
    this.dialogRef.close({
      id: this.data.id,
      name: this.data.name,
    })
  }
}
