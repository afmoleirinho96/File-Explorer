import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FileDto} from "../file";
import {MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {EditModalComponent} from "../../modals/edit-modal/edit-modal.component";
import {take} from "rxjs/operators";
import {MockedBackendService} from "../../services/mocked-backend.service";
import {FileExplorerService} from "../../services/file-explorer.service";

@Component({
  selector: 'file-explorer-item',
  templateUrl: './file-explorer-item.component.html',
  styleUrls: ['./file-explorer-item.component.scss']
})
export class FileExplorerItemComponent {

  fileMenuPosition = {x: '0px', y: '0px', offSetX: 0, offsetY: 0};
  toggleTile: boolean;

  @Input() file: FileDto;

  @Output() openFolder = new EventEmitter<string>();
  @Output() fileEdited = new EventEmitter<Partial<FileDto>>();
  @Output() fileDeleted = new EventEmitter<Partial<FileDto>>();
  @Output() fileDuplicated = new EventEmitter<FileDto>();

  /** Menu for right click options for a certain tile */
  @ViewChild(MatMenuTrigger, {static: false})
  fileMenu: MatMenuTrigger;

  constructor(public modal: MatDialog, private readonly backend: MockedBackendService) {
  }

  onFileMenuOpened(event: MouseEvent) {
    event.preventDefault();
    this.fileMenuPosition.x = event.clientX + this.fileMenuPosition.offSetX + 'px';
    this.fileMenuPosition.y = event.clientY + this.fileMenuPosition.offsetY + 'px';
    this.fileMenu.openMenu();
  }

  /** Listens to modal when renaming */
  renameFile() {
    const renameModal = this.modal.open(EditModalComponent, this.initRenameModal());
    renameModal.afterClosed().pipe(take(1)).subscribe(fileChanged => {
      if (fileChanged) {
        this.onFileRenamed(fileChanged);
      }
    });
  }

  /** Listens to modal when editing links */
  editFileLinks() {
    const editModal = this.modal.open(EditModalComponent, this.initLinkModal());
    editModal.afterClosed().pipe(take(1)).subscribe(fileChanged => {
      if (fileChanged) {
        this.onFileLinksEdited(fileChanged);
      }
    });
  }

  /** If it is a folder, we can open it on double click. Otherwise, it is a normal file, open in new tab */
  onFileSelected(file: FileDto) {
    FileExplorerService.isFolder(file) ? this.openFolder.emit(file.id) : this.openInNewTab(file.webViewLink);
  }

  onFileDeleted() {
    if (this.file.id == null) {
      return;
    }

    this.fileDeleted.emit({
      id: this.file.id
    });
  }

  onFileDuplicated() {
    return this.backend.createFile(this.generateFileCopy()).pipe(take(1)).subscribe((file: FileDto) => {
      if (file) {
        this.fileDuplicated.emit(file);
      }
    });
  }

  /** open download link in new tab */
  downloadFile(webContentLink: string) {
    window.open(webContentLink, "_blank");
  }

  /** open view browser link in new tab */
  openInNewTab(webLink: string) {
    window.open(webLink, "_blank");
  }

  /** close menu if mouse leave its content */
  mouseLeaveMenu() {
    if (this.fileMenu?.menuOpened) {
      this.fileMenu.closeMenu();
    }
  }

  /** Updates, if file changed, file that had links changed */
  private onFileLinksEdited(fileChanged: FileDto) {
    this.file.webContentLink = fileChanged.webContentLink;
    this.file.webViewLink = fileChanged.webViewLink;
    this.file.modifiedTime = new Date().toISOString();
    this.file.iconLink = fileChanged.iconLink;

    this.fileEdited.emit({
      id: this.file.id,
      webContentLink: this.file.webContentLink,
      webViewLink: this.file.webViewLink,
      iconLink: this.file.iconLink,
      modifiedTime: this.file.modifiedTime
    });
  }

  /** Updates, if file changed, file that was renamed */
  private onFileRenamed(fileChanged: FileDto) {
    this.file.name = fileChanged.name;
    this.file.modifiedTime = new Date().toISOString();

    this.fileEdited.emit({
      id: this.file.id,
      name: this.file.name,
      modifiedTime: this.file.modifiedTime
    });
  }

  private initLinkModal() {
    return {
      width: '100%', maxWidth: '800px', maxHeight: '900px', hasBackdrop: true, panelClass: 'link-dialog-container',
      data: {
        title: 'Edit File links',
        file: {
          webViewLink: this.file.webViewLink,
          webContentLink: this.file.webContentLink,
          iconLink: this.file.iconLink,
          modifiedTime: this.file.modifiedTime
        }
      }
    };
  }

  private initRenameModal() {
    return {
      width: '100%', maxWidth: '800px', maxHeight: '300px', hasBackdrop: true,
      data: {
        title: 'Rename File',
        file: {
          name: this.file.name,
          modifiedTime: this.file.modifiedTime
        }
      }
    };
  }

  private generateFileCopy() {
    return {
      ...this.file,
      name: `${this.file?.name} - Copy`,
      modifiedTime: new Date().toISOString()
    };
  }
}
