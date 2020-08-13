import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarkdownHeader } from '../markdown';

@Component({
  selector: 'markdown-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
  @Input()
  items: Array<MarkdownHeader>
  @Output() valChange = new EventEmitter<string>()
  constructor() { }

  ngOnInit(): void {
  }
  onClick(id: string) {
    this.valChange.emit(id)
  }
}
