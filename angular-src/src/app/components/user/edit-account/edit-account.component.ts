import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service'

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  accountForm: FormGroup;

  constructor(
    private userService: UserService,
  ){ }

  ngOnInit() {
    this.accountForm = new FormGroup({
      'newPassword': new FormControl(null, [Validators.required]),
      'oldPassword': new FormControl(null, [Validators.required]),
      'oldPassword2': new FormControl(null, [Validators.required])
    });
  }

  onSubmit(){
    this.userService.editPassword(this.accountForm.value)
  }

}
