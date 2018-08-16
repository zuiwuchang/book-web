import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  book: string;
  chapter: string;
}
@Component({
  selector: 'app-dialog-files',
  templateUrl: './dialog-files.component.html',
  styleUrls: ['./dialog-files.component.css']
})
export class DialogFilesComponent implements OnInit {
  disabled: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<DialogFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }
  onCancel(){
    this.dialogRef.close();
  }

}
