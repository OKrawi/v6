import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ReportsService {

  constructor(private http:Http) {
  }

  prepEndpoint(ep){
    return 'http://localhost:8080/' + ep;
  }
}
