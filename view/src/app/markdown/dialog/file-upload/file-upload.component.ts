import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpenedBook } from 'src/app/core/settings/settings.service';
import { FileUploader } from 'ng2-file-upload';
import { SessionService } from 'src/app/core/session/session.service';
const KB = 1024
const MB = KB * 1024
const GB = MB * 1024
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  uploader: FileUploader
  constructor(
    public readonly sessionService: SessionService,
    private readonly dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: OpenedBook
  ) {
  }
  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: "/api/v1/assets/upload/" + this.data.book + "/" + this.data.chapter,
      headers: [{
        name: 'token',
        value: this.sessionService.token(),
      }]
    })
  }
  onCancel() {
    this.dialogRef.close()
  }
  hasBaseDropZoneOver = false
  hasAnotherDropZoneOver = false

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e
    console.log(e)
  }
  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e
    console.log(e)
  }
  getSize(size: number) {
    if (size > GB) {
      return (size / GB).toFixed(2) + " GB"
    } else if (size > MB) {
      return (size / MB).toFixed(2) + " MB"
    } else if (size > KB) {
      return (size / KB).toFixed(2) + " KB"
    }
    return size + " B"
  }
}
