import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MockedBackendService} from "../services/mocked-backend.service";
import {take} from "rxjs/operators";
import {FileDto} from "../file-explorer/file";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'new-file-bottom-sheet',
  templateUrl: './new-file-bottom-sheet.component.html',
  styleUrls: ['./new-file-bottom-sheet.component.scss']
})
export class NewFileBotomSheetComponent {

  currentId: string;

  @Output() fileCreated = new EventEmitter<any>();
  @Output() folderCreated = new EventEmitter<any>();

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private readonly backend: MockedBackendService,
              private bottomsheet: MatBottomSheetRef<NewFileBotomSheetComponent>) {
    this.currentId = this.data.currentId;
  }

  onFileCreated() {
    const newFile = this.generateNewFile();

    return this.backend.createFile(newFile).pipe(take(1)).subscribe((file: FileDto) => {
      this.bottomsheet.dismiss(file);
    });
  }

  onFolderCreated() {
    const newFolder = this.generateNewFolder();

    return this.backend.createFile(newFolder).pipe(take(1)).subscribe((file: FileDto) => {
      this.bottomsheet.dismiss(file);
    });
  }

  /** generates a new file  with the propert file iconLink and mimeType */
  private generateNewFile() {
    return {
      name: 'New file',
      mimeType: 'text/plain',
      parents: this.currentId === 'home' ? [] : [this.currentId],
      modifiedTime: new Date().toISOString(),
      webViewLink: "",
      webContentLink: "",
      iconLink: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESXgH8VLOVd03YSIPWULyyVDb8PvpW1iBeQ&usqp=CAU'
    };
  }

  /** generates a new folder with the proper folder iconLink and mimeType */
  private generateNewFolder() {
    return {
      name: 'New Folder',
      mimeType: 'application/vnd.google-apps.folder',
      parents: this.currentId === 'home' ? [] : [this.currentId],
      modifiedTime: new Date().toISOString(),
      webViewLink: "",
      webContentLink: "",
      iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder"
    };
  }
}

