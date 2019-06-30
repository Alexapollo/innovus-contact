import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RoutingModule } from './routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
