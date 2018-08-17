import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms'
@Directive({
  selector: '[appValidatorsId]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorsIdDirective, multi: true }],
})
export class ValidatorsIdDirective {
  match = new RegExp("^[a-zA-Z][a-zA-Z0-9\-]*$")
  constructor() { }
  validate(control: AbstractControl): { [key: string]: any } {
    let val = control.value as string;
    if (val == null || val == "" || val == undefined) {
      return { 'errID': { value: control.value } }
    } else if (!this.match.test(val)) {
      return { 'errID': { value: control.value } }
    }
    return null;
  }
}
