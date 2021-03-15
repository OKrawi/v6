import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CoursesComponent } from '../../components/courses/courses.component';
import { CourseDetailsComponent } from '../../components/courses/course-details/course-details.component';

import { CoursesRoutingModule } from './courses-routing.module';

import { FormsModule } from '@angular/forms';
import { CourseOverViewComponent } from './course-details/course-over-view/course-over-view.component';
import { CourseQuestionsComponent } from './questions/course-questions/course-questions.component';
import { CourseContentComponent } from './course-details/course-content/course-content.component';
import { LectureComponent } from './lecture/lecture.component';
import { CourseAnnouncementsListComponent } from './announcements/course-announcements/course-announcements-list/course-announcements-list.component';
import { QuestionFormComponent } from './questions/course-questions/question-form/question-form.component';
import { CourseComponent } from './course/course.component';

import { HideWhenSmall } from '../../shared/hideWhenSmall.directive';
import { OpenSelectedChapter } from '../../shared/openSelectedChapter.directive';

import { CourseQuestionsListComponent } from './questions/course-questions/course-questions-list/course-questions-list.component';
import { CourseQuestionComponent } from './questions/course-questions/course-question/course-question.component';
import { ResponseComponent } from './questions/course-questions/response/response.component';

import { QuestionsService } from './questions/questions.service';
import { AnnouncementsService } from './announcements/announcements.service';
import { ReportsService } from './report/reports.service';
import { CoursesService } from './courses.service';

import { CourseAnnouncementComponent } from './announcements/course-announcements/course-announcement/course-announcement.component';
import { CoursesCommentComponent } from './announcements/comments/courses-comment/courses-comment.component';
import { CoursesReportModalComponent } from './report/courses-report-modal/courses-report-modal.component';
import { CourseAnnouncementsComponent } from './announcements/course-announcements/course-announcements.component';

// import { TruncatePipe } from '../../pipes/truncate.pipe';
import { RemoveHTMLPipe } from '../../pipes/removeHTML.pipe';
import { CoursePreviewComponent } from './preview/course-preview/course-preview.component';

import { SharedModule } from '../shared/shared.module';

import { TinymceModule } from 'angular2-tinymce';

import 'assets/tinymce/plugins/image/plugin.js';
import 'assets/tinymce/plugins/codesample/plugin.js';
import 'assets/tinymce/plugins/paste/plugin.js';
import 'assets/tinymce/plugins/autoresize/plugin.min.js';
import { LectureQuestionsListComponent } from './questions/course-questions/lecture-questions-list/lecture-questions-list.component';

let TinymceModuleConfig = {
  plugins: ['image', 'codesample', 'paste', 'autoresize', 'link'],
  menubar: "",
  toolbar: 'link image codesample',
  codesample_languages: [
    {text: 'HTML/XML', value: 'markup'},
    {text: 'JavaScript', value: 'javascript'},
    {text: 'CSS', value: 'css'},
    {text: 'TypeScript', value: 'typescript'},
    {text: 'JSON', value: 'json'}
  ],
  // language: 'ar',
  default_link_target: "_blank",
  paste_data_images: true,
  statusbar: false,
  auto_focus: false
};

@NgModule({
  declarations: [
    CoursesComponent,
    CourseDetailsComponent,
    CourseOverViewComponent,
    CourseAnnouncementsListComponent,
    CourseQuestionsComponent,
    CourseContentComponent,
    LectureComponent,
    QuestionFormComponent,
    CourseComponent,
    HideWhenSmall,
    CourseQuestionsListComponent,
    CourseQuestionComponent,
    ResponseComponent,
    CourseAnnouncementComponent,
    CoursesCommentComponent,
    CoursesReportModalComponent,
    CourseAnnouncementsComponent,
    // TruncatePipe,
    RemoveHTMLPipe,
    CoursePreviewComponent,
    OpenSelectedChapter,
    LectureQuestionsListComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoursesRoutingModule,
    SharedModule,
    TinymceModule.withConfig(TinymceModuleConfig)
  ],
  providers: [
    CoursesService,
    QuestionsService,
    AnnouncementsService,
    ReportsService
  ]
})
export class CoursesModule { }

// <app-tinymce [(ngModel)]='content'></app-tinymce>
// <div [innerHTML]="content"></div>
// <div>{{content}}</div>
