import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms'

@Directive({
  selector: '[sharedValidatorBookFind]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorBookFindDirective, multi: true }],
})
export class ValidatorBookFindDirective {

  match = new RegExp("^[a-zA-Z][a-zA-Z0-9\-]*$")
  constructor() { }
  validate(control: AbstractControl): { [key: string]: any } {
    let val = control.value as string;
    if (val == null || val == "" || val == undefined) {
      return null;
    } else if (!this.match.test(val)) {
      return { 'errBookFind': { value: control.value } }
    }
    return null;
  }

}
