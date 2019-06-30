import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { RoleRouting, Roles } from '../../app-routing/roles-routes.module';
import { AuthorizationModel } from '../../models/authorization.models';
import * as decode from 'jwt-decode';

import { Observable, Subject, BehaviorSubject, timer, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../handle-error/http-error-handler.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {
  private authenticationUrl: string = environment.authenticationEndpoint;
  private handleError: HandleError;

  private subjectIsLoginSuccess: Subject<boolean> = new Subject<boolean>();
  private subjectIsRecoverSuccess: Subject<boolean> = new Subject<boolean>();
  private subjectIsRecoverUpdateSuccess: Subject<boolean> = new Subject<boolean>();

  private subjectIsLogged = new BehaviorSubject({ isLogged: false, username: '' });
  private subject_tObject = new BehaviorSubject(null);

  private subscriptionExpiration: Subscription;
  private subscriptionExpirationAlert: Subscription;

  private subjectIsExpirationAlert = new BehaviorSubject(false);

  private tObject: AuthorizationModel;

  constructor(private http: HttpClient, handleErrorHandler: HttpErrorHandler, private router: Router) {
    this.handleError = handleErrorHandler.createHandleError('AuthenticationService');
    this.logRouteHandler();
  }

  listenTotObject(): Observable<AuthorizationModel> {
    return this.subject_tObject.asObservable();
  }

  // #region Login
  login(username: string, password: string): Observable<boolean> {
    this.loginCall(username, password).subscribe(_ => {
      this.subjectIsLoginSuccess.next(true);
      if (_ != null) {
        this.saveToStorage(_);
        this.logRouteHandler();
      } else {
        this.subjectIsLoginSuccess.next(false);
      }
    });
    return this.subjectIsLoginSuccess;
  }

  private loginCall(username: string, password: string) {
    const url = [this.authenticationUrl, 'Login'].join('/');
    return this.http.post(url, { Username: username, Password: password })
      .pipe(
        catchError(
          this.handleError('postLogin', null)
        ));
  }
  // #endregion

  logout(): void {
    if (this.tObject != null || localStorage.getItem('tObject') != null) {
      localStorage.clear();
      this.tObject = null;
      this.subjectIsLogged.next({ isLogged: false, username: '' });
      this.subjectIsExpirationAlert.next(false);
      this.subscriptionExpiration.unsubscribe();
      this.subscriptionExpirationAlert.unsubscribe();
      this.navigateTo();
    }
  }

  readIsLogged(): Observable<Object> {
    return this.subjectIsLogged.asObservable();
  }

  readIsAlerted(): Observable<boolean> {
    return this.subjectIsExpirationAlert.asObservable();
  }
  // #region Recover

  recover(username: string) {
    this.recoverCall(username).subscribe(_ => {
      this.subjectIsRecoverSuccess.next(true);
      if (_ != null) {
      } else {
        this.subjectIsRecoverSuccess.next(false);
      }
    });
    return this.subjectIsRecoverSuccess;
  }

  private recoverCall(username: string) {
    const url = [this.authenticationUrl, 'Recover'].join('');
    return this.http.post(url, { Username: username }, { observe: 'response' })
      .pipe(
        catchError(
          this.handleError('postRecover', null)
        ));
  }
  // #endregion

  // #region Handle Recover
  recoverUpdate(obj: object) {
    this.recoverUpdateCall(obj).subscribe(_ => {
      this.subjectIsRecoverUpdateSuccess.next(true);
      if (_ != null) {
        /*Do nothing*/
      } else {
        this.subjectIsRecoverUpdateSuccess.next(false);
      }
    });
    return this.subjectIsRecoverUpdateSuccess;
  }

  private recoverUpdateCall(obj: object) {
    const url = [this.authenticationUrl, 'Recover/Update'].join('');
    return this.http.post(url, obj, { observe: 'response' })
      .pipe(
        catchError(
          this.handleError('postRecoverUpdate', null)
        ));
  }

  cancelRecover(guid: string): void {
    this.cancelRecoverCall(guid).subscribe(_ => {
      if (_ != null) { }      
    })
  }

  private cancelRecoverCall(guid: string) {
    const url = [this.authenticationUrl, 'Recover/Cancel/',guid].join('');
    return this.http.get(url)
      .pipe(catchError(
        this.handleError('getRecoverCancel', null)
      ));

  }
  // #endregion

  refreshToken(): void {
    this.refreshTokenCall().subscribe(_ => {
      if (_ != null) {
        this.saveToStorage(_);
        this.tObject = this.obtainDecodedToken(_);
        this.subject_tObject.next(this.tObject);
        this.subjectIsLogged.next({ isLogged: true, username: this.tObject._username });
        this.subjectIsExpirationAlert.next(false);
        this.setTokenTimers();
      }
    });
  }

  private refreshTokenCall() {
    const url = [this.authenticationUrl, 'RefreshToken'].join('');
    return this.http.get(url, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.tObject._token),
    })
      .pipe(catchError(
        this.handleError('getRefreshToken', null)
      ));
  }

  /**
  *  Checks if token is expired */
  isTokenExpired(): boolean {
    const current_time = Date.now().valueOf() / 1000;
    if ((this.tObject != null)
      && (this.tObject._expiration != null)
      && (this.tObject._expiration < current_time)) {
      console.warn('Expired token!');
      return true;
    }

    return false;
  }

  /**
   * returns the access token. If not exists return null.
   */
  getAccessToken(): string {
    if (this.isTokenExpired()) {
      return null;
    }
    return this.tObject._token;

  }

  /**
   *  Check if is logged and and navigate to correct role view */
  private logRouteHandler() {
    const _token = this.getFromStorage();
    if ((_token != null) && (_token.length > 0)) {
      this.tObject = this.obtainDecodedToken(_token);
      if ((this.tObject === null) || (this.isTokenExpired()) || (Roles[this.tObject._role] === undefined)) {
        localStorage.clear();
        this.subjectIsLogged.next({ isLogged: false, username: '' });
      } else {
        this.subject_tObject.next(this.tObject);
        this.subjectIsLogged.next({ isLogged: true, username: this.tObject._username });
        this.navigateTo();
        this.setTokenTimers();
      }
    }
  }

  private setTokenTimers(): void {
    const expiration_mins = Math.floor(this.tObject._expiration - (Date.now().valueOf() / 1000));

    if ((this.subscriptionExpiration !== undefined) && (this.subscriptionExpirationAlert !== undefined)) {
      this.subscriptionExpiration.unsubscribe();
      this.subscriptionExpirationAlert.unsubscribe();
    }

    this.subscriptionExpirationAlert = timer(this.calculateAlertMinutes(expiration_mins) * 1000)
      .subscribe(_ => {
        this.subjectIsExpirationAlert.next(true);
      });

    this.subscriptionExpiration = timer(expiration_mins * 1000)
      .subscribe(_ => {
        console.warn('Token expired');
        this.logout();
      });
  }

  private calculateAlertMinutes(mins: number): number {
    const minutes = Math.floor(mins / 60);
    if (minutes >= 10) {
      return ((minutes - 5) * 60);
    }
    return 0;
  }

  private obtainDecodedToken(_token: string): AuthorizationModel {
    const _tObject = new AuthorizationModel();
    try {
      const tokenPayload = decode(_token);
      _tObject._token = _token;
      _tObject._username = tokenPayload['unique_name'];
      _tObject._expiration = tokenPayload['exp'];
      _tObject._role = tokenPayload['role'];
    } catch {
      console.warn('Unexpeted token');
      return null;
    }
    return _tObject;
  }

  private navigateTo(): void {
    if (this.tObject != null) {
      this.router.navigate([RoleRouting.getRoute(this.tObject._role)]);
    } else {
      this.router.navigate(['app-login']);
    }

  }

  private getFromStorage(): string {
    const _token = localStorage.getItem('_token');
    return _token;
  }

  private saveToStorage(token: string): void {
    localStorage.setItem('_token', token);
  }

}
