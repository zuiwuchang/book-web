import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedService } from './shared.service';
export interface DialogData {
  book: string;
  chapter: string;
}
@Component({
  selector: 'app-dialog-files',
  templateUrl: './dialog-files.component.html',
  styleUrls: ['./dialog-files.component.css'],
  providers: [SharedService],
})
export class DialogFilesComponent implements OnInit {
  constructor(
    public shared:SharedService,
    private dialogRef: MatDialogRef<DialogFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 
    this.shared.book = this.data.book;
    this.shared.chapter = this.data.chapter;
  }

  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close();
  }
}
