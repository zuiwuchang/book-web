import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  title: string;
  text:string;
}

@Component({
  selector: 'app-dialog-sure',
  templateUrl: './dialog-sure.component.html',
  styleUrls: ['./dialog-sure.component.css']
})
export class DialogSureComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogSureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSure() {
    this.dialogRef.close(true);
  }
}
