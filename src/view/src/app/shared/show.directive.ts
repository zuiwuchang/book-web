import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appShow]'
})
export class ShowDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  @Input()
  set appShow(ok: boolean) {
    if (ok) {
      this.renderer.removeClass(this.el.nativeElement, 'hide');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'hide');
    }
  }

}
