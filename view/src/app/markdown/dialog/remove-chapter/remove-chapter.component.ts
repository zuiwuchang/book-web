import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chapter } from 'src/app/core/protocol';

@Component({
  selector: 'app-remove-chapter',
  templateUrl: './remove-chapter.component.html',
  styleUrls: ['./remove-chapter.component.scss']
})
export class RemoveChapterComponent implements OnInit {

  constructor(private readonly dialogRef: MatDialogRef<RemoveChapterComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: Chapter
  ) { }

  ngOnInit(): void {
  }
  onCancel() {
    this.dialogRef.close()
  }
  onSure() {
    this.dialogRef.close(true)
  }
}
