import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { InstructorCurriculumService } from '../../../instructor-curriculum.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor-chapter',
  templateUrl: './instructor-chapter.component.html',
  styleUrls: ['./instructor-chapter.component.css']
})
export class InstructorChapterComponent implements OnInit, OnDestroy {

  @Input() chapter: any;
  @Input() lectures: string[];
  @Input() chapter_index: number;

  sub1: Subscription;
  sub3: Subscription;
  sub4: Subscription;

  editingChapterActive: Boolean = false;
  addingLectureActive: Boolean = false;

  chapterForm: FormGroup;
  lectureForm: FormGroup;
  course_title_dashed: string = "";

  constructor(private instructorCurriculumService : InstructorCurriculumService,
              private route: ActivatedRoute,
            ) {}

  ngOnInit() {
  this.sub1 = this.route.parent.params
    .subscribe( (params : Params) => {
      this.course_title_dashed = params['course_title_dashed'];
    });
    this.initForm();
  }

  private initForm() {
    this.chapterForm = new FormGroup({
      'chapter_title': new FormControl(this.chapter.title, Validators.required),
      'isPublished': new FormControl(this.chapter.isPublished, Validators.required)
    });

    this.lectureForm = new FormGroup({
      'lecture_title': new FormControl(null, Validators.required)
    });
  }

  onToEditChapter(){
    this.editingChapterActive = true;
  }

  onCancelEditChapter(){
    this.editingChapterActive = false;
  }

  onEditChapter(){
    let sub = this.instructorCurriculumService.editChapter(this.chapterForm.value, this.chapter._id, this.chapter_index)
      .subscribe(data => {
        if(data.success) {
          this.onCancelEditChapter();
        }
        sub.unsubscribe();
    });
  }

  onDeleteChapter(){
    if(confirm("You are about to delete a chapter, continue?")) {
      this.sub3 = this.instructorCurriculumService.deleteChapter(this.course_title_dashed, this.chapter._id, this.chapter_index)
      .subscribe(data => {
        if(data.success) {

        }
        this.sub3.unsubscribe();
      });
    }
  }

  onAddLecture(){
    this.addingLectureActive = true;
  }

  onCancelAddLecture(){
    this.lectureForm.reset();
    this.addingLectureActive = false;
  }

  onCreateLecture(){
    this.sub4 = this.instructorCurriculumService.newLecture(this.chapter._id, this.lectureForm.value, this.chapter_index)
      .subscribe(data => {
        if(data.success) {
          this.onCancelAddLecture();
        }
        this.sub4.unsubscribe();
    });
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

}
