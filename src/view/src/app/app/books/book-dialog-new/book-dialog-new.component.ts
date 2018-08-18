import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  id: string;
  name:string;
}

@Component({
  selector: 'app-book-dialog-new',
  templateUrl: './book-dialog-new.component.html',
  styleUrls: ['./book-dialog-new.component.css']
})
export class BookDialogNewComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<BookDialogNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSure() {
    this.dialogRef.close(this.data);
  }
}
