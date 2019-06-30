import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RoutingModule } from '../user/routing.module';
import { UsersViewComponent } from 'src/app/components/users-view/users-view.component';
import { UsersEditComponent } from 'src/app/components/users-edit/users-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { ContactComponent } from 'src/app/components/contact/contact.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule
  ],
  declarations: [
    UserComponent,
    UsersViewComponent,
    UsersEditComponent,
    PaginationComponent,
    ContactComponent
  ]
})
export class UserModule { }
