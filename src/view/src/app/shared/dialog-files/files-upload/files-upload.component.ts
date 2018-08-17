import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { FileUploader } from 'ng2-file-upload';
const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;
@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.css']
})
export class FilesUploadComponent implements OnInit {
  uploader: FileUploader = null;
  constructor(private shared: SharedService) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: "/book/upload/" + this.shared.book + "/" + this.shared.chapter,
    });
  }
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    console.log(e)
  }
  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
    console.log(e)
  }
  getSize(size: number) {
    if (size > GB){
      return (size / GB).toFixed(2) + " GB";
    }else if (size > MB){
      return (size / MB).toFixed(2) + " MB";
    }else if (size > KB){
      return (size / KB).toFixed(2) + " KB";
    }
    return size + " B";
  }
}
