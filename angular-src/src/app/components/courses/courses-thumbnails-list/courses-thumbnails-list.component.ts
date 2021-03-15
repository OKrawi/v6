import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Course } from '../course.model';
import { Subscription } from 'rxjs/Subscription';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-courses-thumbnails-list',
  templateUrl: './courses-thumbnails-list.component.html',
  styleUrls: ['./courses-thumbnails-list.component.css']
})
export class CoursesThumbnailsListComponent implements OnInit, OnDestroy {

  courses : Course[] = [];
  // loading: boolean = false;

  sub1: Subscription;

  constructor(
              private http: Http,
              private router: Router,
              private route: ActivatedRoute
              ) { }

  ngOnInit() {
    this.route.params
      .subscribe( (params: Params) => {
        this.courses = [];
        this.onLoadCourses(params['category_title_dashed']);
      });
  }

  onLoadCourses(category_title_dashed: string){
    let params = {
      category_title_dashed: category_title_dashed,
    }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('courses');
    this.sub1 = this.http.get(ep, {headers: headers, params: params})
      .map(res => res.json())
      .subscribe(data => {
        if(data.success) {
          for(let course of data.courses){
            this.courses.push(course);
          }
          // this.loading = !this.loading;
        } else{
          console.log("Error!");
        }
      });
  }

  onViewCourseDetails(course_title_dashed: string){
    console.log(1);
    this.router.navigate(['courses/' + course_title_dashed]);
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }

}
