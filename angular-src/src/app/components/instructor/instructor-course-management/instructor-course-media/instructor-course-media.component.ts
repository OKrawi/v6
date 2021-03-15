import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { AuthService } from '../../../../services/auth.service';
import { Course } from '../../course.model';
import { InstructorCoursesService } from '../../instructor-courses.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

const URL = 'http://localhost:8080/images/courses/upload/';

@Component({
  selector: 'app-instructor-course-media',
  templateUrl: './instructor-course-media.component.html',
  styleUrls: ['./instructor-course-media.component.css']
})
export class InstructorCourseMediaComponent implements OnInit, OnDestroy {

  course = new Course();
  sub1: Subscription;

  public hasBaseDropZoneOver:boolean = false;

  uploader:FileUploader;
  errorMessage: string;
  allowedMimeType = ['image/jpeg', "image/png", "image/jpg"];
  maxFileSize = 2 * 1024 * 1024;

  constructor(
    private authService:AuthService,
    private instructorCoursesService: InstructorCoursesService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.parent.params.subscribe((params: Params) => {
      this.loadCourse(params['course_title_dashed']);
    });
  }

  private loadCourse(title_dashed: string){
    if(title_dashed === this.instructorCoursesService.course.title_dashed){
      this.course = this.instructorCoursesService.course;
      this.uploader.options.url = URL + this.instructorCoursesService.course.title_dashed;
    }

    this.sub1 = this.instructorCoursesService.courseChanged
    .subscribe((course: Course) => {
      this.course = this.instructorCoursesService.course;
      this.uploader.options.url = URL + this.instructorCoursesService.course.title_dashed;
    });
  }

  onAfterAddingFile(item: any){
    if(this.uploader.queue[1]){
      this.uploader.queue[0].remove();
    }
    this.uploader.queue[0].onComplete = (response:string, status:number, headers:any) => {
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

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    // this.sub2.unsubscribe();
    // this.sub4.unsubscribe();
  }

}
