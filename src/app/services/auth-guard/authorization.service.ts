import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthorizationModel } from '../../models/authorization.models';
import { Roles } from '../../app-routing/roles-routes.module';

@Injectable()
export class AuthorizationService {
  private tObject: AuthorizationModel;
  private expectedRole: string;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.listenTotObject().subscribe(_ => {
      this.tObject = _;
    });
  }

  public isAuthorized(expectedRole: number): boolean {
    this.expectedRole = Roles[expectedRole];
    if (this.tObject == null) { return false; }

    if (!this.isCorrectRole() || this.authenticationService.isTokenExpired()) { return false; }

    return true;
  }

  private isCorrectRole(): boolean {
    if (this.tObject._role !== this.expectedRole) { return false; }

    return true;
  }
}
