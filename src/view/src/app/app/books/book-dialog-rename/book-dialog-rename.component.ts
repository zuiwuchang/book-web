import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  val: string;
}
@Component({
  selector: 'app-book-dialog-rename',
  templateUrl: './book-dialog-rename.component.html',
  styleUrls: ['./book-dialog-rename.component.css']
})
export class BookDialogRenameComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<BookDialogRenameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSure() {
    this.dialogRef.close(this.data.val);
  }

}
