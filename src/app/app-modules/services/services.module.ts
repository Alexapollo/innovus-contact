import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MessageService } from 'src/app/services/handle-error/message.service';
import { HttpErrorHandler } from 'src/app/services/handle-error/http-error-handler.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AuthGuardService } from 'src/app/services/auth-guard/auth-guard.service';
import { AuthorizationService } from 'src/app/services/auth-guard/authorization.service';
import { HeadersService } from 'src/app/services/http-headers/headers.service';
import { UserEditService } from 'src/app/services/user-edit/user-edit.service';
import { PaginationService } from 'src/app/services/pagination/pagination.service';

@NgModule({
  providers: [
    AuthGuardService,
    AuthorizationService,
    AuthenticationService,
    HttpErrorHandler,
    MessageService,
    HeadersService,
    UserEditService,
    PaginationService
  ]
})
export class ServicesModule {
  constructor(@Optional() @SkipSelf() core: ServicesModule) {
    if (core) {
      throw new Error('You must import ServicesModule only in AppModule!');
    }
  }
}
