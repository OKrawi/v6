import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() loading: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
