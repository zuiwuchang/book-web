import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarkdownHeader } from '../markdown';
@Component({
  selector: 'app-markdown-bar',
  templateUrl: './markdown-bar.component.html',
  styleUrls: ['./markdown-bar.component.css']
})
export class MarkdownBarComponent implements OnInit {
  @Input()
  items: Array<MarkdownHeader>
  @Output() valChange = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  onClick(id: string) {
    this.valChange.emit(id);
  }
}
