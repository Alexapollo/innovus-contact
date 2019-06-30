import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FriendlyName } from '../vocabulary.enum';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {
  @Input() form: FormGroup;
  errors: string[] = [];

  constructor() { }

  ngOnInit() {
    this.form.statusChanges.subscribe(_ => {
      this.resetErrorMessages();
      this.checkErrorMessages(this.form);
    });
  }

  private resetErrorMessages(): void {
    this.errors.length = 0;
  }

  private checkErrorMessages(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(_ => {
      if (formGroup.get(_) instanceof FormGroup) {
        this.checkErrorMessages(<FormGroup>formGroup.get(_));
      }
      const control = formGroup.get(_);
      const errors = control.errors;

      if (((!control.valid && control.dirty) && !control.pristine)) {

        if (((errors === null) || (errors.count === 0))) { return; }

        let fName = `"${_}"`;
        if (FriendlyName[_] !== undefined) {
          fName = FriendlyName[_];
        }
        // Handle the 'required' case
        if (errors.required) {
          this.errors.push(`${fName} is required`);
        }
        // Handle the 'pattern' case
        if (errors.pattern) {
          this.errors.push(`${fName} not valid format`);
        }
        // Handle the 'minLength' case
        if (errors.minlength) {
          this.errors.push(`${fName} minimum length is ${errors.minlength.requiredLength}`);
        }
        // Handle the 'maxLength' case
        if (errors.maxlength) {
          this.errors.push(`${fName} maximum length is ${errors.maxlength.requiredLength}`);
        }
      }

    });

    return;
  }

}
