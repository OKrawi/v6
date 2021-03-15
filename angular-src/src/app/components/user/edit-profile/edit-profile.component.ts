import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username: string;

  constructor(
    private userService: UserService,
  ){ }

  ngOnInit() {
    this.username = this.userService.user.username;
  }

  onToEditProfile(){
    let body = {
      username: this.username
    }

    this.userService.editProfile(body);
  }
}
