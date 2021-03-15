import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service'

@Injectable()
export class AdminService {

  constructor(
    private http:Http,
    private authService: AuthService
  ) { }

  prepEndpoint(ep){
      return 'http://localhost:8080/admin/' + ep;
  }
}
