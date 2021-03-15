import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev:boolean;

  constructor(private http:Http) {
    this.isDev = true;
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('user/register');
    return this.http.post(ep, user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('user/authenticate');
    return this.http.post(ep, user, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  getToken(){
    this.loadToken();
    return this.authToken;
  }

  loggedIn(){
    return tokenNotExpired();
  }

  is_instructor(){
    if(this.loggedIn()){
      let user = JSON.parse(localStorage.getItem('user'));
      return user.is_instructor;
    } else {
      return false;
    }
  }

  is_admin(){
    if(this.loggedIn()){
      let user = JSON.parse(localStorage.getItem('user'));
      return user.is_admin;
    } else {
      return false;
    }
  }

  isOwner(item_id){
    if(this.loggedIn()){
      let user = JSON.parse(localStorage.getItem('user'));
      return (user.id === item_id) ;
    } else {
      return false;
    }
  }

  getUserId(){
    if(this.loggedIn()){
      let user = JSON.parse(localStorage.getItem('user'));
      return user.id;
    } else {
      return null;
    }
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  editBiography(biography: string){
    let headers = new Headers();
    headers.append('Authorization', this.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('instructor/biography/');
    return this.http.put(ep, biography, {headers: headers})
      .map((res) => {
        if (res.json().success) {
            this.updateLocalBiography(res.json().biography);
        }
        return res.json()
      });
  }

  updateLocalBiography(biography: string){
    if(this.loggedIn()){
      let user = JSON.parse(localStorage.getItem('user'));
      user.biography = biography;
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
      return true;
    } else {
      return null;
    }
  }

  getBiography(){
    let user = JSON.parse(localStorage.getItem('user'));
    return user.biography;
  }

  prepEndpoint(ep){
    // if(this.isDev){
      // return ep;
    // } else {
      return 'http://localhost:8080/' + ep;
    // }
  }
}
