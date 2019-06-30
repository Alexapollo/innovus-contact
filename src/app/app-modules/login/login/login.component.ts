import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  tokenPayload: string;
  isRecoverMode: boolean;

  annotationBoxTitle: string;
  annotationBoxMessage: string;
  annotationBoxStyleClass: string;

  annotationBoxKeeper = {
    Title: {
      recoverEmailSent: 'Check your inbox',
      invalidCredentials: 'Please try again',
      genericFail: 'Please try again'
    },
    Message: {
      recoverEmailSent: 'Follow the instructions sent to you',
      invalidCredentials: 'Email or password are incorrect.',
      genericFail: 'Oop! Something went wrong..'
    },
    StyleClass: {
      recoverEmailSent: 'check-mail',
      invalidCredentials: '',
      genericFail: ''
    }
  };

  constructor(
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.isRecoverMode = false;
  }

  /**
   *  Toggle recover mode */
  recoverPasswordAction() {
    this.isRecoverMode = !this.isRecoverMode;
    this.setAnnotationToast('clear');
  }

  /**
   *  Ignite by submit button from form */
  loginAction() {
    this.loading = true;
    if (!this.isRecoverMode) {
      this.loginCall();
    } else {
      this.recoverCall();
    }

  }

  /**
   *  Calls login service */
  loginCall() {
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        _ => {
          if (!_) {
            this.setAnnotationToast('invalidCredentials');
          }
          this.loading = false;
        });
  }

  /**
   *  Calls recover service */
  recoverCall() {
    this.authenticationService.recover(this.model.username)
      .subscribe(
        _ => {
          if (_) {
            this.setAnnotationToast('recoverEmailSent');
          } else {
            this.setAnnotationToast('genericFail');
          }
          this.loading = false;
        });
  }

  /**
   *  Set annotation for login with title, message, style based on type, if type==clear then cleans annotation box */
  setAnnotationToast(type: string) {
    if (type === 'clear') {
      this.annotationBoxTitle = null;
      this.annotationBoxMessage = null;
      this.annotationBoxMessage = null;
    } else {
      this.annotationBoxTitle = this.annotationBoxKeeper['Title'][type];
      this.annotationBoxMessage = this.annotationBoxKeeper['Message'][type];
      this.annotationBoxStyleClass = this.annotationBoxKeeper['StyleClass'][type];
    }
  }
}

