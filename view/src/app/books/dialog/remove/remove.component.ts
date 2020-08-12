import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/core/protocol';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})
export class RemoveComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<RemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book) { }

  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close()
  }
  onSure() {
    this.dialogRef.close(true)
  }
}
