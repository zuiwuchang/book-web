import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chapter } from 'src/app/core/protocol';

@Component({
  selector: 'app-edit-chapter',
  templateUrl: './edit-chapter.component.html',
  styleUrls: ['./edit-chapter.component.scss']
})
export class EditChapterComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EditChapterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chapter) { }

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
