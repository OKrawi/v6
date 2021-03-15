import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InstructorBiographyService } from '../instructor-biography.service'

@Component({
  selector: 'app-instructor-biography',
  templateUrl: './instructor-biography.component.html',
  styleUrls: ['./instructor-biography.component.css']
})
export class InstructorBiographyComponent implements OnInit {

  biographyForm: FormGroup;
  loading: Boolean = true;

  constructor(
    private instructorBiographyService: InstructorBiographyService
  ) { }

  ngOnInit() {
    this.biographyForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'biography': new FormControl(null, [Validators.required])
    });
    let sub = this.instructorBiographyService.getBiography()
    .subscribe((data) => {
      if(data.success){
        this.biographyForm.setValue({
          'title' : data.title || "",
          'biography' : data.biography || ""
        });
        this.loading = false;
      }
      sub.unsubscribe();
    });
  }

  onSubmit() {
    let body = {
      title: this.biographyForm.value.title,
      biography: this.biographyForm.value.biography,
    }
    let sub = this.instructorBiographyService.editBiography(body)
    .subscribe((data) => {
      sub.unsubscribe();
    });
  }
}
