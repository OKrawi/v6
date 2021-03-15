import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../../services/validate.service'
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
    private flashMessage:FlashMessagesService,
  ) {
  }

  ngOnInit() { }

  onLoginSubmit(){
    const user = {
      email: this.email,
      password: this.password
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are now logged in', {
          cssClass: 'alert-success',
          timeout: 5000});
          if (this.route.snapshot.queryParams.course) {
            if (this.route.snapshot.queryParams.lecture) {
              this.router.navigate(['courses/' + this.route.snapshot.queryParams.course + '/lectures/' + this.route.snapshot.queryParams.lecture]);
            } else {
              this.router.navigate(['courses/' + this.route.snapshot.queryParams.course]);
            }
          } else {
            this.router.navigate(['user']);
          }

      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
        this.router.navigate(['login']);
      }
    });
  }

}
