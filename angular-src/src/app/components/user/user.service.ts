import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { User } from './user.model'

@Injectable()
export class UserService {

  // loading : boolean = true;
  user : User = new User();

  constructor(
    private http: Http,
    private authService: AuthService,
    private router: Router,
  ) { }

  getUser(){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("user");
    return this.http.get(ep, {headers: headers})
      .map((res) => {

        if(res.json().success){

          this.user = res.json().user;

          // setTimeout(()=>{
          //   this.loading = false;
          // },1000);

          return true;
        }
        return false;
      });
  }

  editProfile(body: any){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("user/profile");
    let sub = this.http.put(ep, body, { headers: headers})
      .map((res) => {
        this.user.username = res.json().user.username;
        return res.json();
      })
      .subscribe(() => sub.unsubscribe());
  }

  editPassword(body: any){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("user/password");
    let sub = this.http.put(ep, body, { headers: headers})
      .map((res) => {
        return res.json();
      })
      .subscribe(() => sub.unsubscribe());
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
