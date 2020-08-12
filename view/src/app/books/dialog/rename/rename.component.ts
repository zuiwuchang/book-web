import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  val: string;
}
@Component({
  selector: 'app-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.scss']
})
export class RenameComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RenameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close()
  }
  onSure() {
    this.dialogRef.close(this.data.val)
  }

}