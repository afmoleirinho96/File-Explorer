import {Component, Inject, OnInit} from '@angular/core';
import {FileDto} from "../../file-explorer/file";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent {

  file: Partial<FileDto>;
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // Clone to verify later if during modal, the file was indeed changed.
    this.file = {...this.data.file};
    this.title = this.data.title;
  }

  /**
   * When hitting the OK button, I'll first verify if there were any changes, to prevent from emiting
   * and modified date to be changed.
   */
  onModalClose(file: Partial<FileDto>) {
    if (JSON.stringify(file) === JSON.stringify(this.data.file)) {
      return;
    }
    return file;
  }
}
