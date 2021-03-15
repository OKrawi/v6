import { Component, OnInit, OnDestroy, AfterViewInit  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../courses.service';
import { Course } from '../course.model';
import { Lecture } from '../lecture.model';
import { QuestionsService } from '../questions/questions.service';
import YouTubePlayer from 'youtube-player';
import * as Prism from "prismjs";

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit, AfterViewInit, OnDestroy {

  course: Course = new Course();
  lecture : Lecture = new Lecture();

  sub1: Subscription;
  sub2: Subscription;

  course_title_dashed : string;
  lecture_id : string;

  player: any;

  toPlayCountDown: string;
  toNextLectureCountDown: string;
  countDownInterval: any;

  previous_lecture_id: string;
  next_lecture_id: string;

  constructor(
              private coursesService : CoursesService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private questionsService : QuestionsService,
            ) { }

  ngOnInit() {

    this.questionsService.resetQuestions();

    this.course = this.coursesService.course;

    this.sub1 = this.coursesService.courseChanged
    .subscribe((course: Course) => {
      this.course = course;
      this.coursesService.getIndices();
    });

    this.route.parent.params.subscribe((params: Params) => {
      this.course_title_dashed = params['course_title_dashed'];
    });

    this.route.params.subscribe((params: Params) => {
      this.lecture_id = params['lecture_id'];
      this.onLoadLecture();
      clearInterval(this.countDownInterval);
    });
  }

  ngAfterViewInit() {
    this.player = YouTubePlayer('lectureIframe');

    this.player.on('stateChange', (event) => {
      if(event.data === 0 && this.coursesService.next_lecture_id ){
        this.startTimer(5, false);
      }
    });
  }

  onLoadLecture(){
    this.sub2 = this.coursesService.getLecture(this.course_title_dashed, this.lecture_id)
        .subscribe((data) => {
          if(data.success){
            this.lecture = data.lecture;
            this.previous_lecture_id = this.coursesService.previous_lecture_id;
            this.next_lecture_id = this.coursesService.next_lecture_id;
            this.loadVideo();
            setTimeout(Prism.highlightAll, 10);
          } else {}
          this.sub2.unsubscribe();
        });
  }

  loadVideo(){
    this.player.cueVideoById({
         videoId: this.lecture.videoId,
    });
    // console.log('message');
    // console.log(this.lecture.videoId);
    this.startTimer(3, true);
  }

  startTimer(duration: number, playCountDown: boolean) {
    let start = Date.now(),
        diff,
        seconds;
    let timer = function() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        seconds = (diff % 60) | 0;

        if (playCountDown) {
          this.toPlayCountDown = String(seconds);
        } else {
          this.toNextLectureCountDown = String(seconds);
        }

        if (seconds === 0) {
          clearInterval(this.countDownInterval);
          if (playCountDown) {
            this.toPlayCountDown = '';
            this.player.playVideo().catch((err) => {});
          } else {
            this.toNextLectureCountDown = '';
            this.coursesService.user_course_data.last_lecture_id = this.coursesService.next_lecture_id;
            this.router.navigate(['../' + this.coursesService.next_lecture_id], {relativeTo: this.route});
          }
        }

        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    };

    timer.bind(this)();
    this.countDownInterval = setInterval(timer.bind(this), 1000);
  }

  stopCountDown(){
    this.toPlayCountDown = '';
    this.toNextLectureCountDown = '';
    clearInterval(this.countDownInterval);
  }

  onToNext(){
    this.coursesService.user_course_data.last_lecture_id = this.coursesService.next_lecture_id;

    if(this.coursesService.user_course_data.watched_lectures_ids.indexOf(this.coursesService.next_lecture_id) == -1){
      this.coursesService.user_course_data.watched_lectures_ids.push(this.coursesService.next_lecture_id);
    }

  }

  onToPrevious(){
    this.coursesService.user_course_data.last_lecture_id = this.coursesService.previous_lecture_id;

    if(this.coursesService.user_course_data.watched_lectures_ids.indexOf(this.coursesService.previous_lecture_id) == -1){
      this.coursesService.user_course_data.watched_lectures_ids.push(this.coursesService.previous_lecture_id);
    }
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    clearInterval(this.countDownInterval);
    this.questionsService.resetQuestions();
  }
}
