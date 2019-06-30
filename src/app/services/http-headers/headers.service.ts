import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class HeadersService {

  constructor(private authenticationService: AuthenticationService) { }

  getHttpHeaders(): Object {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Authorization': this.getAuthorization(),
          'Content-Type': this.getContentType()
        })
    };

    return httpOptions;
  }

  private getContentType(): string {
    const contentType = 'application/json; charset=utf-8';

    return contentType;
  }

  private getAuthorization(): string {
    const authorization = ['Bearer '];
    authorization.push(this.authenticationService.getAccessToken());

    return authorization.join('');
  }
}
