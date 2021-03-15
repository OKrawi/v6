import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { InstructorCurriculumService } from '../../../../instructor-curriculum.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor-lecture',
  templateUrl: './instructor-lecture.component.html',
  styleUrls: ['./instructor-lecture.component.css']
})
export class InstructorLectureComponent implements OnInit, OnDestroy {

  @Input() index: number;
  @Input() chapter_index: number;
  @Input() lecture: any;

  editingLectureActive: boolean = false;
  lectureForm: FormGroup;
  videoDuration: string;

  constructor(private instructorCurriculumService : InstructorCurriculumService,
              private route: ActivatedRoute
            ) {}

  ngOnInit() {
    this.videoDuration = this.lecture.videoDuration;
    this.initForm();
  }

  private initForm() {
    this.lectureForm = new FormGroup({
      'title': new FormControl(this.lecture.title, Validators.required),
      'videoId': new FormControl(this.lecture.videoId),
      'isPreview': new FormControl(this.lecture.isPreview),
      'isPublished': new FormControl(this.lecture.isPublished),
      'body': new FormControl(this.lecture.body)
    });
  }

  onToEditLecture(){
    this.editingLectureActive = true;
  }

  onCancelEditLecture(){
    this.editingLectureActive = false;
  }

  onEditLecture(){
    if (this.lectureForm.value.videoId) {
      let youtubeAPIsub = this.instructorCurriculumService.getVideoContentDetails(this.lectureForm.value.videoId)
      .subscribe(data => {

        if(data.success){
          this.videoDuration = data.videoDuration;
          this.onSubmitLecture();
        } else {
          console.log('Error wrong lecture Id');
        }
        youtubeAPIsub.unsubscribe();
      });
    } else {
      this.videoDuration = '';
      this.onSubmitLecture();
    }
  }

  onSubmitLecture(){
    let sub = this.instructorCurriculumService.editLecture(
      this.lecture._id,
      this.lectureForm.value,
      this.index,
      this.chapter_index,
      this.videoDuration
    )
    .subscribe(data => {
      if(data.success) {
        if(this.lectureForm.value.isPublished && (this.lectureForm.value.isPublished != data.lecture.isPublished)){
          console.log("The chapter containing this lecture is not publish; to publish this lecture please set the parent chapter to published.");
        }
        this.onCancelEditLecture();
      }
      sub.unsubscribe();
    });
  }

  onDeleteLecture(){
    if(confirm("You are about to delete a lecture, continue?")) {
      let sub = this.instructorCurriculumService.deleteLecture(this.lecture._id, this.index, this.chapter_index)
        .subscribe(data => {
          if(data.success) {

          }
          sub.unsubscribe();
      });
    }
  }

  ngOnDestroy(){
  }

}
