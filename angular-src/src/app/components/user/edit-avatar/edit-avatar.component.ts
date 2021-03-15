import { Component, OnInit } from '@angular/core';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { AuthService } from '../../../services/auth.service'
import { UserService } from '../user.service'

const URL = 'http://localhost:8080/images/avatar/upload';

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './edit-avatar.component.html',
  styleUrls: ['./edit-avatar.component.css']
})
export class EditAvatarComponent implements OnInit {

  public hasBaseDropZoneOver:boolean = false;

  uploader:FileUploader;
  errorMessage: string;
  allowedMimeType = ['image/jpeg', "image/png", "image/jpg"];
  maxFileSize = 2 * 1024 * 1024;
  img_path: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ){
    this.uploader = new FileUploader({
        url: URL,
        allowedMimeType: this.allowedMimeType,
        authToken: this.authService.getToken(),
        maxFileSize: this.maxFileSize,
    });
    this.uploader.onAfterAddingFile = (item) => this.onAfterAddingFile(item);
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
  }

  ngOnInit() {
    this.img_path = this.userService.user.img_path;
  }

  onAfterAddingFile(item: any){
    if(this.uploader.queue[1]){
      this.uploader.queue[0].remove();
    }
    this.uploader.queue[0].onComplete = (response:string, status:number, headers:any) => {
      // this.userService.user.img_path = JSON.parse(response).img_path;
      console.log(response, status);
    }
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    switch (filter.name) {
        case 'fileSize':
            this.errorMessage = `Maximum upload size exceeded (${ Number(item.size / 1024 / 1024).toFixed(2) } MB of ${this.maxFileSize / 1024 / 1024} MB allowed)`;
            break;
        case 'mimeType':
            const allowedTypes = this.allowedMimeType.join();
            this.errorMessage = `Type "${item.type} is not allowed. Allowed types: "${allowedTypes}"`;
            break;
        default:
            this.errorMessage = `Unknown error (filter is ${filter.name})`;
    }
    console.log(this.errorMessage);
  }

  // public fileOverBase(e:any):void {
  //   this.hasBaseDropZoneOver = e;
  // }

}
