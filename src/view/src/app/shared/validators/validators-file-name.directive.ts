import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms'
@Directive({
  selector: '[appValidatorsFileName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorsFileNameDirective, multi: true }],
})
export class ValidatorsFileNameDirective {

  constructor() {
  }
  validate(control: AbstractControl): { [key: string]: any } {
    let val = control.value as string;
    if (val == null || val == "" || val == undefined) {
      return { 'errFileName': { value: control.value } }
    } else if (val == "." ||
      val.indexOf("..") != -1 ||
      val.indexOf("/") != -1 ||
      val.indexOf("\\") != -1) {
      return { 'errFileName': { value: control.value } }
    }
    val = val.trim();
    if (val == "" || val == ".") {
      return { 'errFileName': { value: control.value } }
    }
    return null;
  }
}
