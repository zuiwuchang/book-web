import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms'
@Directive({
  selector: '[sharedValidatorId]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorIdDirective, multi: true }],
})
export class ValidatorIdDirective {
  match = new RegExp("^[a-zA-Z][a-zA-Z0-9\-]*$")
  constructor() { }
  @Input("sharedValidatorId")
  allowEmpty: boolean | string | undefined = false// 是否允許爲空
  validate(control: AbstractControl): { [key: string]: any } {
    let val = control.value as string;
    if (val == null || val == "" || val == undefined) {
      if (this.allowEmpty) {
        return null
      } else {
        return { 'errID': { value: control.value } }
      }
    } else if (!this.match.test(val)) {
      return { 'errID': { value: control.value } }
    }
    return null
  }
}
