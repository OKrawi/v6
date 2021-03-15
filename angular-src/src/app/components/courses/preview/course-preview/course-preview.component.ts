import { Component, OnInit, OnDestroy, AfterViewInit  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Course } from '../../course.model';
import { CoursesService } from '../../courses.service';
import { AuthService } from '../../../../services/auth.service'
import { Subscription } from 'rxjs/Subscription';
import YouTubePlayer from 'youtube-player';

declare var $: any;

@Component({
  selector: 'app-course-preview',
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.component.css']
})
export class CoursePreviewComponent implements OnInit, AfterViewInit, OnDestroy {

  lecture_title: string;
  player: any;
  course: Course;
  sub1: Subscription;

  constructor (
    private coursesService : CoursesService,
    private authService : AuthService,
    private router: Router,
    // private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.course = this.coursesService.course;

    this.sub1 = this.coursesService.courseChanged
    .subscribe((course: any) => {
        this.course = this.coursesService.course;
      });
  }

  ngAfterViewInit() {
    this.player = YouTubePlayer('previewIframe')
    $('.bd-preview-modal').on('hidden.bs.modal', (e) => {
      this.player.pauseVideo();
    });
  }

  onEnroll(){
    let course_title = this.coursesService.course.title_dashed;
    if(this.authService.loggedIn()){
      this.coursesService.enroll(course_title);
    } else {
      this.router.navigate(['/login'], {queryParams: { course: course_title }});
    }
  }

  setPreviewLecture(chapter_index: number, lecture_index: number){
    let lecture = this.coursesService.course.chapters[chapter_index].lectures[lecture_index];
    this.lecture_title = lecture.title;
    this.player.loadVideoById({
         videoId: lecture.videoId,
    });
  }

  ngOnDestroy(){
  }
}
