import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appHide]'
})
export class HideDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  @Input()
  set appHide(ok: boolean) {
    if (ok) {
      this.renderer.addClass(this.el.nativeElement, 'hide');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'hide');
    }
  }
}
