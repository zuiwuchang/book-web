import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  val: string
}
@Component({
  selector: 'app-change-id',
  templateUrl: './change-id.component.html',
  styleUrls: ['./change-id.component.scss']
})
export class ChangeIdComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ChangeIdComponent>,
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
