import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from "ng2-file-upload/file-upload/file-upload.module";

import { UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';

import { UserComponent } from './user.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditAvatarComponent } from './edit-avatar/edit-avatar.component';
import { UserNavBarComponent } from './user-nav-bar/user-nav-bar.component';

import { SharedModule } from '../shared/shared.module';
import { UserMyCoursesComponent } from './user-my-courses/user-my-courses.component';

@NgModule({
  declarations: [
    UserComponent,
    EditAccountComponent,
    EditProfileComponent,
    EditAvatarComponent,
    UserNavBarComponent,
    UserMyCoursesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
