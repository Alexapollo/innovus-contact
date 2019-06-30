import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public router: Router, public authorization: AuthorizationService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;

    if (!this.authorization.isAuthorized(expectedRole)) {
      this.router.navigate(['app-login']);
      return false;
    }
    return true;
  }
}
