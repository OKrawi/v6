import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service'

@Injectable()
export class InstructorBiographyService {

  constructor(
    private http:Http,
    private authService: AuthService
) { }

  editBiography(body: any){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('');
    return this.http.put(ep, body, {headers: headers})
      .map(res => res.json());
  }

  getBiography(){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('');
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }

  prepEndpoint(ep){
    return 'http://localhost:8080/instructor/biography' + ep;
  }
}
