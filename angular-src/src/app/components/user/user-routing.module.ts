import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserGuard } from '../../guards/user.guard';
import { UserComponent } from './user.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditAvatarComponent } from './edit-avatar/edit-avatar.component';
import { UserMyCoursesComponent } from './user-my-courses/user-my-courses.component';

const userRoutes: Routes = [
  { path: 'user', component: UserComponent, canActivate: [UserGuard], children:[
    { path: '', component: EditProfileComponent },
    { path: 'my-courses', component: UserMyCoursesComponent },
    { path: 'account', component: EditAccountComponent },
    { path: 'photo', component: EditAvatarComponent },
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
  providers: [
    UserGuard
  ]
})

export class UserRoutingModule { }
