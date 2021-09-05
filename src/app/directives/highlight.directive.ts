import {Directive, ElementRef, HostBinding, HostListener} from "@angular/core";

@Directive({
  selector: `[fileHighlight]`
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }
  @HostBinding('class.clicked') isFileHighlighted: boolean = false;

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    this.isFileHighlighted = !!this.el.nativeElement.contains(event.target);
  }

}
