import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[uploadDragDrop]'
})
export class UploadDragDropDirective {

  @HostBinding('class.fileover-container') isFileOverContainer: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();

  @HostListener('dragover', ['$event'])
  public onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOverContainer = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOverContainer = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isFileOverContainer = false;
    let items = evt.dataTransfer?.items;
    if (items.length > 0) {
      this.fileDropped.emit(items);
    }
  }
}
