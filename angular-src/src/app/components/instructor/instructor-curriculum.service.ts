
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service'

@Injectable()
export class InstructorCurriculumService {

  chapters : any[];
  lectures : any[][];
  chaptersChanged = new Subject<string[]>();
  lecturesChanged = new Subject<string[][]>();

  constructor(
    private http:Http,
    private authService: AuthService
  ) { }

  // Get the curriculum of a course
  getCurriculum(course_title_dashed: string){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let params: URLSearchParams = new URLSearchParams();
    params.set('course_title_dashed', course_title_dashed);
    let ep = this.prepEndpoint('chapters/curriculum');
    return this.http.get(ep, {headers: headers, search: params})
      .map((res) => {
        if(res.json().success){
          this.chapters = [];
          this.lectures = [];

          for(let i = 0 ; i < res.json().chapters.length; i++){
            this.chapters.push(res.json().chapters[i]);
            this.lectures[i] = res.json().chapters[i].lectures;
          }

          this.chaptersChanged.next(this.chapters.slice());
          this.lecturesChanged.next(this.lectures.slice());

        }

        return res.json();
      });
  }

  // Post a new chapter
  newChapter(course_title_dashed:string, form: any){
    let body = {
      course_title_dashed: course_title_dashed,
      chapter_title: form.chapter_title
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('chapters');
    return this.http.post(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){

          this.chapters.push(res.json().chapter);
          this.chaptersChanged.next(this.chapters.slice());

          this.lectures.push([]);
          this.lecturesChanged.next(this.lectures.slice());

        }
        return res.json();
      });
  }

  // Update a chapter
  editChapter(form: any, chapter_id: string, index: number){
    let body = {
      chapter_title: form.chapter_title,
      isPublished: form.isPublished,
      chapter_id: chapter_id,
      chapter_isPublished: this.chapters[index].isPublished,
      published_lectures_count: 0
    }

    if(!body.isPublished && body.chapter_isPublished){
      this.lectures[index].map((lecture) => {
        if(lecture.isPublished){
          body.published_lectures_count++;
        }
      });
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('chapters');
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {

        if(res.json().success){
          this.chapters[index].title = res.json().chapter.title;
          this.chapters[index].isPublished = res.json().chapter.isPublished;

          if(res.json().results){
            for(let lecture of this.lectures[index]){
              lecture.isPublished = false;
            }
          }

          this.chaptersChanged.next(this.chapters.slice());
          this.lecturesChanged.next(this.lectures.slice());
        }
        return res.json();
      });
  }

  // Delete a chapter
  deleteChapter(course_title_dashed:string, chapter_id: string, index: number){
    let body = {
      course_title_dashed: course_title_dashed,
      chapter_id: chapter_id,
      index: index,
      total_lectures_count: this.chapters[index].lectures.length,
      published_lectures_count: 0
    }

    if(this.chapters[index].isPublished){
      this.lectures[index].map((lecture) => {
        if(lecture.isPublished){
          body.published_lectures_count++;
        }
      });
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('chapters');
    return this.http.delete(ep, {headers: headers, body: body})
      .map((res) => {
        if(res.json().success){
          this.chapters.splice(index, 1);
          this.chaptersChanged.next(this.chapters.slice());

          this.lectures.splice(index, 1);
          this.lecturesChanged.next(this.lectures.slice());
        }
        return res.json();
      });
  }

  reorderChapters(course_title_dashed: string, from_index: number, to_index: number){
    let body = {
      course_title_dashed: course_title_dashed,
      from_index: from_index,
      to_index: to_index
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('chapters');
    return this.http.put(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.chapters.splice(to_index, 0, this.chapters.splice(from_index, 1)[0]);
          this.lectures.splice(to_index, 0, this.lectures.splice(from_index, 1)[0]);
          this.lecturesChanged.next(this.lectures.slice());
          this.chaptersChanged.next(this.chapters.slice());
        }
        return res.json();
      });
  }

  // Post a new lecture
  newLecture(chapter_id:string, form: any, index: number){
    let body = {
      chapter_id: chapter_id,
      lecture_title: form.lecture_title,
      index: index
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('lectures');
    return this.http.post(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){

          if(!this.lectures[index]){
            this.lectures[index] = [];
          }

          this.lectures[index].push(res.json().lecture);
          this.lecturesChanged.next(this.lectures.slice());
        }
        return res.json();
      });
  }

  // Update a lecture
  editLecture(lecture_id: string, form: any, lecture_index: number, chapter_index: number, videoDuration: string){
    let body = {
      lecture_id: lecture_id,
      title: form.title,
      videoId: form.videoId,
      isPreview: form.isPreview,
      isPublished: form.isPublished,
      lecture_isPublished: this.lectures[chapter_index][lecture_index].isPublished,
      body: form.body,
      chapter_id: this.chapters[chapter_index]._id,
      chapter_isPublished: this.chapters[chapter_index].isPublished,
      videoDuration: videoDuration
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('lectures');
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.lectures[chapter_index][lecture_index] = res.json().lecture;
          this.lecturesChanged.next(this.lectures.slice());
        }
        return res.json();
      });
  }

  getVideoContentDetails(videoId: string){
    let ep = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId
    + '&key=AIzaSyAMCuhc3udxTFZ4_k2It76IfLaDJ94rIhs&part=contentDetails';
    return this.http.get(ep)
      .map((res) => {

        if (res.json().items && res.json().items.length > 0) {
          let duration = res.json().items[0].contentDetails.duration;

          let regex = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/
          let matches = duration.match(regex);
          let minutes = matches[14] || '00';
          let seconds = matches[16] || '00';

          minutes = minutes.length > 1 ? minutes : '0' + minutes;
          seconds = seconds.length > 1 ? seconds : '0' + seconds;

          return { success: true, videoDuration: minutes + ":" + seconds};
        }
        return { success: false, videoDuration: null };
      });
  }

//   minutesFromIsoDuration(duration) {
//
// }

  // Delete a lecture
  deleteLecture(lecture_id: string, lecture_index: number, chapter_index: number){
    let body = {
      lecture_id: lecture_id,
      lecture_isPublished: this.lectures[chapter_index][lecture_index].isPublished,
      chapter_id: this.chapters[chapter_index]._id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('lectures');
    return this.http.delete(ep, {headers: headers, body: body})
      .map((res) => {

        if(res.json().success){
          this.lectures[chapter_index].splice(lecture_index, 1);
          this.lecturesChanged.next(this.lectures.slice());
        }

        return res.json();
      });
  }

  reorderLectures(
    from_chapter_id:string,
    to_chapter_id :string,
    from_chapter_index:number,
    to_chapter_index:number,
    from_lecture_index: number,
    to_lecture_index: number){

    let body = {
      from_chapter_id: from_chapter_id,
      to_chapter_id: to_chapter_id,
      from_lecture_index: from_lecture_index,
      to_lecture_index: to_lecture_index,
      lecture_isPublished: this.lectures[from_chapter_index][from_lecture_index].isPublished
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('lectures');
    return this.http.put(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){

          let lecture = this.lectures[from_chapter_index].splice(from_lecture_index, 1);
          this.lectures[to_chapter_index].splice(to_lecture_index, 0, lecture[0]);

          if(!this.chapters[to_chapter_index].isPublished){
            this.lectures[to_chapter_index][to_lecture_index].isPublished = false;
          }

          this.lecturesChanged.next(this.lectures.slice());
        }
        return res.json();
      });
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
