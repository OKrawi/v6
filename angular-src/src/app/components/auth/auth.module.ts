import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { ValidateService} from '../../services/validate.service';
import { AuthService} from '../../services/auth.service';

import { AuthGuard } from '../../guards/auth.guard';
import { UnAuthGuard } from '../../guards/unAuth.guard';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    UnAuthGuard
  ]
})
export class AuthModule { }
