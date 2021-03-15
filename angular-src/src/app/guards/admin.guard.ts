import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Http, Headers } from '@angular/http';


@Injectable()
export class AdminGuard implements CanLoad {
  constructor(
    private authService:AuthService,
    private router:Router,
    private http:Http){ }

  canLoad(){
    if(!this.authService.loggedIn()){
      this.router.navigate(['/login']);
      return false;
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('admin');
    return this.http.get(ep, {headers: headers})
      .map((res) => {
        if(res.json().success){
          return true;
        } else {
          this.router.navigate(['/user']);
          return false;
        }
      });
    }

  prepEndpoint(ep){
    return 'http://localhost:8080/user/' + ep;
  }
}
