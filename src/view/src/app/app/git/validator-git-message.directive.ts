import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms'
@Directive({
  selector: '[appValidatorGitMessage]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorGitMessageDirective, multi: true }],
})
export class ValidatorGitMessageDirective {
  match = /[\\\/\`\"\'\~\&\|]/
  constructor() { }
  validate(control: AbstractControl): { [key: string]: any } {
    let val = control.value as string;
    if (val == null || val == "" || val == undefined) {
      return { 'errGitMessage': { value: control.value } }
    } else if (this.match.test(val)) {
      return { 'errGitMessage': { value: control.value } }
    }
    return null;
  }
}
