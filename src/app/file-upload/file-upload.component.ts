import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  errorMessageDuration = 5000;

  @Output() fileUploaded = new EventEmitter<any>();

  @ViewChild("fileDragDropReference", {static: false}) fileDropEl: ElementRef;
  files: DataTransferItem[] = [];

  constructor(private uploadSnackBarError: MatSnackBar) {
  }

  onFileBrowsed(event: any) {
    if (event == null) {
      return;
    }

    const file = event.files[0] as File;
    if (file == null) {
      this.displayError("There was a problem converting the file.");
      return;
    }
    this.uploadFile(file);
  }

  /**
   * Handler that Validates for each file in the selected drag and dropped if it is a folder or a file and upload the latest.
   * Also displays error if folder was drag and dropped, but will still upload the valid files.
   * Eg: 10 Files ( 2 are folders ) - displays error for 1 of the folders but uploads 8 files
   * @param dataItemList contains file(s) drag and dropped
   */
  onFileDropped(dataItemList: DataTransferItemList) {
    if (dataItemList == null) {
      return;
    }
    // Iterate over selected files drag and dropped and upload them
    for (let i = 0; i < dataItemList.length; i++) {
      if (FileUploadComponent.isFileAFolder(dataItemList[i])) {
        this.displayError(`Currently folder upload is not supported - Eg. (${dataItemList[i].getAsFile()?.name}).
          However, you can zip it before uploading!`);
        continue;
      }

      const file = dataItemList[i].getAsFile();
      if (file == null) {
        this.displayError("There was a problem converting the file.");
        return;
      }

      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    this.fileDropEl.nativeElement.value = "";
    this.fileUploaded.emit(file);
  }

  private displayError(errorMessage: string) {
    this.uploadSnackBarError.open(errorMessage, 'Dismiss', {
      duration: this.errorMessageDuration
    });
  }

  private static isFileAFolder(dataItem: DataTransferItem): boolean {
    return dataItem.webkitGetAsEntry()?.isDirectory;
  }

}
