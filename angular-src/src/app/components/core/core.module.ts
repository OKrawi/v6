import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { UserModule } from '../../components/user/user.module';
import { CoursesModule } from '../../components/courses/courses.module';
import { HomeModule } from '../../components/home/home.module';

import { AppRoutingModule } from '../../app-routing.module';

import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavbarComponent,
    NotFoundComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    CoursesModule,
    UserModule,
    HomeModule,
    AppRoutingModule,
    SharedModule
  ],
  exports: [
    NavbarComponent,
    NotFoundComponent,
    FooterComponent,
    AppRoutingModule,
  ],
  providers: [
  ]
})
export class CoreModule { }
