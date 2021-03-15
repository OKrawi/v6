import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstructorEditCourseComponent } from './instructor-course-management/instructor-edit-course/instructor-edit-course.component';
import { InstructorCourseManagementComponent } from './instructor-course-management/instructor-course-management.component';
import { InstructorCurriculumManagementComponent } from './instructor-course-management/instructor-curriculum-management/instructor-curriculum-management.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { InstructorNewCourseComponent } from './instructor-new-course/instructor-new-course.component';
import { InstructorCourseDeleteComponent } from './instructor-course-management/instructor-course-delete/instructor-course-delete.component';
import { InstructorAnnouncementsListComponent } from './instructor-course-management/instructor-announcements-list/instructor-announcements-list.component';
import { InstructorCourseGoalsComponent } from './instructor-course-management/instructor-course-goals/instructor-course-goals.component';
import { InstructorCourseInformationComponent } from './instructor-course-management/instructor-course-information/instructor-course-information.component';
import { InstructorCourseMediaComponent } from './instructor-course-management/instructor-course-media/instructor-course-media.component';
import { InstructorBiographyComponent } from './instructor-biography/instructor-biography.component';

// import { InstructorGuard } from '../../guards/instructor.guard';

const instructorRoutes: Routes = [
  { path:'', component: InstructorDashboardComponent},
  { path: 'new', component: InstructorNewCourseComponent},
  { path: 'biography', component: InstructorBiographyComponent},  
  { path: 'courses/:course_title_dashed', component: InstructorCourseManagementComponent, children: [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: InstructorCourseInformationComponent },
    { path: 'overview', component: InstructorEditCourseComponent },
    { path: 'goals', component: InstructorCourseGoalsComponent },
    { path: 'media', component: InstructorCourseMediaComponent },
    { path: 'curriculum', component: InstructorCurriculumManagementComponent },
    { path: 'announcements', component: InstructorAnnouncementsListComponent },
    { path: 'delete', component: InstructorCourseDeleteComponent }
  ] }
]

@NgModule({
  imports: [RouterModule.forChild(instructorRoutes)],
  exports: [RouterModule]
})

export class InstructorRoutingModule {

}
