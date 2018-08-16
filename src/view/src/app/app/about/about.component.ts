import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from "@angular/platform-browser";
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(private title: Title) { }

  ngOnInit() {
    
  }
  @ViewChild('title')
  private titleRef: ElementRef;
  ngAfterViewInit() {
    if (this.titleRef && this.titleRef.nativeElement && this.titleRef.nativeElement.innerText) {
      this.title.setTitle(this.titleRef.nativeElement.innerText)
    }
  }

}
