import { Directive, OnInit, ElementRef, Renderer2 , HostListener } from '@angular/core';

@Directive({
  selector: '[hideWhenSmall]'
})

export class HideWhenSmall implements OnInit {

  constructor (private elementRef : ElementRef, private renderer: Renderer2){}

  ngOnInit(){
    this.onReSize();
    this.renderer.listen(this.elementRef.nativeElement, 'transitionend', this.onReSize.bind(this));
  }

  onReSize(){
    if(this.elementRef.nativeElement.offsetWidth < 150){
      this.renderer.setStyle(this.elementRef.nativeElement.children[0], 'display', 'none');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement.children[0], 'display', 'inline-block');
    }
  }

  @HostListener( "window:resize", ["$event"]) onResize(event) {
    this.onReSize();
  }
}
