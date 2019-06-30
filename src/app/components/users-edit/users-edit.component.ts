import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserEditService } from 'src/app/services/user-edit/user-edit.service';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  id: number;

  private subscriptions: Array<Subscription> = [];
  private initialContact: Contact;

  constructor(
    private fb: FormBuilder,
    private contactsService: UserEditService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }

  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  ngOnInit() {
    this.initialContact = new Contact();
    this.form = this.fb.group({
      ContactId: this.fb.control(0),
      Name: this.fb.control(null, [Validators.required]),
      Email: this.fb.control(null, [Validators.required, Validators.pattern(this.emailPattern)]),
      Address: this.fb.control(null)
    });

    this.subscriptions.push(this.activateRoute.params.subscribe(param => {
      this.id = param['id'];
      if (this.id != 0) { this.contactsService.getContact(this.id); }

      this.setFields(this.initialContact);
    }));

    this.subscriptions.push(this.contactsService.readContact().subscribe(_ => {
      this.initialContact = _;
      this.setFields(_);
    }));
  }

  private setFields(contact: Contact) {
    this.form.get('ContactId').setValue(contact.ContactId);
    this.form.get('Name').setValue(contact.Name);
    this.form.get('Email').setValue(contact.Email);
    this.form.get('Address').setValue(contact.Address);
  }

  resetForm() {
    if (this.form != null) { this.form.reset(); }
    this.setFields(this.initialContact);
  }

  onSubmit() {
    if (!this.form.valid) { this.validateAllFormFields(this.form); return; }
    if (this.id == 0) {
      this.contactsService.postContact(this.form.value)
        .subscribe(_ => {
          this.resetForm();
          // this.router.navigate(['contact', _['ContactId']]);
        });
    } else {
      this.contactsService.putContact(this.form.value)
        .subscribe(_ => {
          this.router.navigate(['user/users']);
        });
    }
  }

  navigateTo(link: string) {
    if (this.isEquivalent(this.initialContact, this.form.value)) {
      this.router.navigate([link]);
    } else {
      const result = confirm('There is some changes without save. Are you absolutely sure you want to leave?');
      if (result) { this.router.navigate([link]); }
    }

  }

  private isEquivalent(a: object, b: object): boolean {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  deleteContact() {
    const result = confirm('You are going to delete this contact. Are you absolutely sure?');
    if (!result) { return; }

    if (this.id == null) { return; }
    this.contactsService.deleteContact(this.form.get('ContactId').value)
      .subscribe(_ => {
        this.router.navigate(['user/users']);
      });
  }

  /**
   * Validates all fields.
   * @param formGroup form group to run check.
   */
  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      if (!(formGroup.get(field) instanceof FormControl)) {
        this.validateAllFormFields(<FormGroup>formGroup.get(field));
      }
      const control = formGroup.get(field);
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
  }

}
