import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../components/user/user.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private userService:UserService,
    private router:Router
  ){ }

  canActivate(){
    if(this.authService.loggedIn()){
      return this.userService.getUser();
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
