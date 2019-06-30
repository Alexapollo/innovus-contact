import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { Roles } from 'src/app/app-routing/roles-routes.module';
import { AuthGuardService } from 'src/app/services/auth-guard/auth-guard.service';
import { UsersViewComponent } from 'src/app/components/users-view/users-view.component';
import { UsersEditComponent } from 'src/app/components/users-edit/users-edit.component';
import { ContactComponent } from 'src/app/components/contact/contact.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        canActivate: [AuthGuardService],
        data: { expectedRole: Roles['AdminUser'] },
        children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'users', component: UsersViewComponent },
            { path: 'useredit/:id', component: UsersEditComponent },
            { path: 'contact', component: ContactComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }