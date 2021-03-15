import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import { AboutComponent } from './components/extras/about/about.component';

import { AuthGuard } from './guards/auth.guard';
import { UnAuthGuard } from './guards/unAuth.guard';
import { AdminGuard } from './guards/admin.guard';
import { InstructorGuard } from './guards/instructor.guard';
import { TermsComponent } from './components/extras/terms/terms.component';
import { ContactMeComponent } from './components/extras/contact-me/contact-me.component';
import { TechSupportComponent } from './components/extras/tech-support/tech-support.component';

import { TestComponent } from './components/test/test.component';

const appRoutes: Routes = [
  { path:'register', component: RegisterComponent, canActivate:[UnAuthGuard] },
  { path:'login', component: LoginComponent, canActivate:[UnAuthGuard] },
  { path:'about', component: AboutComponent },
  { path:'terms', component: TermsComponent },
  { path:'support', component: TechSupportComponent },
  { path:'contact-me', component: ContactMeComponent },
  { path: 'test', component: TestComponent },
  { path:'instructor', loadChildren: './components/instructor/instructor.module#InstructorModule', canLoad:[InstructorGuard]},
  { path:'admin', loadChildren: './components/admin/admin.module#AdminModule', canLoad:[AdminGuard]},
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  providers: [
    AdminGuard,
    InstructorGuard
  ]
})

export class  AppRoutingModule{

}
