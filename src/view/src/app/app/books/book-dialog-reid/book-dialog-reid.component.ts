import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  val: string;
}
@Component({
  selector: 'app-book-dialog-reid',
  templateUrl: './book-dialog-reid.component.html',
  styleUrls: ['./book-dialog-reid.component.css']
})
export class BookDialogReidComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<BookDialogReidComponent>,
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
