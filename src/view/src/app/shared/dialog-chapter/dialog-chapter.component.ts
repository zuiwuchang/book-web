import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  id: string;
  name: string;
  title: string;
}

@Component({
  selector: 'app-dialog-chapter',
  templateUrl: './dialog-chapter.component.html',
  styleUrls: ['./dialog-chapter.component.css']
})
export class DialogChapterComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogChapterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {
  }
  onCancel(){
    this.dialogRef.close();
  }
  onSure(form){
    if(form.invalid){
      return;
    }
    this.dialogRef.close({
      id:this.data.id,
      name:this.data.name,
    });
  }
}
