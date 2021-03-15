import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from './courses.component';
import { CourseComponent } from './course/course.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CoursesThumbnailsListComponent } from './courses-thumbnails-list/courses-thumbnails-list.component';
import { CourseOverViewComponent } from './course-details/course-over-view/course-over-view.component';
import { CourseContentComponent } from './course-details/course-content/course-content.component';
import { CourseAnnouncementsComponent } from './announcements/course-announcements/course-announcements.component';
import { CourseAnnouncementsListComponent } from './announcements/course-announcements/course-announcements-list/course-announcements-list.component';
import { CourseAnnouncementComponent } from './announcements/course-announcements/course-announcement/course-announcement.component';
import { LectureComponent } from './lecture/lecture.component';
import { CourseQuestionsComponent } from './questions/course-questions/course-questions.component';
import { QuestionFormComponent } from './questions/course-questions/question-form/question-form.component';
import { CourseQuestionsListComponent } from './questions/course-questions/course-questions-list/course-questions-list.component';
import { CourseQuestionComponent } from './questions/course-questions/course-question/course-question.component';
import { CoursePreviewComponent } from './preview/course-preview/course-preview.component';
import { LectureQuestionsListComponent } from './questions/course-questions/lecture-questions-list/lecture-questions-list.component';

import { CourseGuard } from '../../guards/course.guard';

const coursesRoutes: Routes = [
  { path: 'courses', component: CoursesComponent, children:[
    { path: '', component: CoursesThumbnailsListComponent },
    { path: ':course_title_dashed', component: CourseComponent, canActivate: [CourseGuard], children:[
      { path: '', component: CourseDetailsComponent, children:[
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview', component: CourseOverViewComponent },
        { path: 'content', component: CourseContentComponent },
        { path: 'questions', component: CourseQuestionsComponent, children:[
          { path: '', component: CourseQuestionsListComponent },
          { path: 'new', component: QuestionFormComponent },
          { path: ':question_id', component: CourseQuestionComponent }
        ]},
        { path: 'announcements', component: CourseAnnouncementsComponent, children:[
          { path: '', component: CourseAnnouncementsListComponent },
          { path: ':announcement_id', component: CourseAnnouncementComponent }
        ]},
      ]},
      { path: 'lectures/:lecture_id', component: LectureComponent, children:[
        { path: '', component: CourseContentComponent },
        { path: 'questions', component: CourseQuestionsComponent, children:[
          { path: '', component: LectureQuestionsListComponent },
          { path: 'new', component: QuestionFormComponent },
          { path: ':question_id', component: CourseQuestionComponent }
        ]}
      ]}
    ]},
    { path: ':course_title_dashed/preview', component: CoursePreviewComponent, canActivate: [CourseGuard]}
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(coursesRoutes)],
  exports: [RouterModule],
  providers: [CourseGuard]
})

export class CoursesRoutingModule {

}
