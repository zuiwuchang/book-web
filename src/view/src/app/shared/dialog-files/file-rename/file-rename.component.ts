import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  val: string;
}

@Component({
  selector: 'app-file-rename',
  templateUrl: './file-rename.component.html',
  styleUrls: ['./file-rename.component.css']
})
export class FileRenameComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FileRenameComponent>,
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
