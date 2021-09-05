import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {NewFileBotomSheetComponent} from "../../file-bottom-sheet/new-file-botom-sheet.component";
import {FileDto} from "../file";
import {take} from "rxjs/operators";

@Component({
  selector: 'new-file',
  templateUrl: './new-file.component.html',
  styleUrls: ['./new-file.component.scss']
})
export class NewFileComponent {

  @Input() currentId: string;
  @Output() newItemCreated = new EventEmitter<FileDto>();

  constructor(private newFileBottomSheet: MatBottomSheet) {
  }

  /** Opens bottom sheet to create a file or folder */
  onAddButtonClicked() {
    const bottomSheetRef = this.newFileBottomSheet.open(NewFileBotomSheetComponent, {
      data: {currentId: this.currentId}
    });

    bottomSheetRef.afterDismissed().pipe(take(1)).subscribe(itemCreated => {
      if (itemCreated) {
        this.newItemCreated.emit(itemCreated);
      }
    });

  }
}
