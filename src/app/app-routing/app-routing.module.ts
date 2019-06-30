import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: '../app-modules/login/login.module#LoginModule'
  },
  {
    path: 'user',
    loadChildren: '../app-modules/user/user.module#UserModule'
  },
  { path: '**', redirectTo: 'login' }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
