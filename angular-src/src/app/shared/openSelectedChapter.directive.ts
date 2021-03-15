import { Directive,  AfterViewInit, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[openSelectedChapter]'
})

export class OpenSelectedChapter implements AfterViewInit  {

  @Input() currentLecture: boolean;

  constructor ( private elementRef : ElementRef, private renderer: Renderer2 ){ }

  ngAfterViewInit(){
    let elem = this.elementRef.nativeElement;
    if (this.currentLecture) {
      this.renderer.addClass(elem.parentElement.parentElement.parentElement, 'show');
    }
  }
}
