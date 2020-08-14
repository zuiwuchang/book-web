import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-file',
  templateUrl: './remove-file.component.html',
  styleUrls: ['./remove-file.component.scss']
})
export class RemoveFileComponent implements OnInit {
  constructor(private readonly dialogRef: MatDialogRef<RemoveFileComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: string
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
