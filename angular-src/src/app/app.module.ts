import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AppComponent } from './app.component';

import { CoreModule } from './components/core/core.module';
import { HomeModule } from './components/home/home.module';
import { CoursesModule } from './components/courses/courses.module';
import { AuthModule } from './components/auth/auth.module';
import { SharedCourseThumbnailListModule } from './shared/shared-course-thumbnail-list.module';
import { SharedModule } from './components/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/extras/about/about.component';
import { TermsComponent } from './components/extras/terms/terms.component';
import { ContactMeComponent } from './components/extras/contact-me/contact-me.component';
import { TechSupportComponent } from './components/extras/tech-support/tech-support.component';
import { TestComponent } from './components/test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    TermsComponent,
    ContactMeComponent,
    TechSupportComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FlashMessagesModule,
    CoreModule,
    SharedModule,
    SharedCourseThumbnailListModule,
    HomeModule,
    CoursesModule,
    AuthModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// TODO : add tech support page
// TODO : add contact page
// TODO : add terms and conditions page

// TODO : sanitize!!!!
// TODO : refactor app
// TODO : comment
// TODO : check subscriptions
// TODO : user should recieve notifications when announcements are made

// TODO : connect to aws for images
// TODO : email
// TODO : email preference for users
// TODO : protect keys (youtube...)
// TODO : fix css replication
// TODO : create propper design for everything: including proper cards
// TODO : Create loading div for when lecture/ question / course are loading

// TODO : deal with isdev before deployment
// TODO : Fix if/else in prepEndpoint

// TODO : add search to main nav bar
// TODO : add reviews and rank
// TODO : add blog!
// TODO : add answered/ pinned to questions
// TODO : add one-to-one chat
