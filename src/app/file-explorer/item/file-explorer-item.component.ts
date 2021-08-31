import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FileDto} from "../file";
import {MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {EditModalComponent} from "../../modals/edit-modal/edit-modal.component";

@Component({
  selector: 'file-explorer-item',
  templateUrl: './file-explorer-item.component.html',
  styleUrls: ['./file-explorer-item.component.scss']
})
export class FileExplorerItemComponent {


  @Input() file: FileDto;
  @Output() openFolder = new EventEmitter<FileDto>();
  @Output() fileEdited = new EventEmitter<Partial<FileDto>>();
  @Output() fileDeleted = new EventEmitter<Partial<FileDto>>();

  @ViewChild(MatMenuTrigger, {static: false})
  fileMenu: MatMenuTrigger; 


  /**  -40 **/
  fileMenuPosition = {x: '0px', y: '0px', offSetX: +40, offsetY: +40};

  constructor(public modal: MatDialog) {
  }

  onFileMenuOpened(event: MouseEvent) {
    event.preventDefault();
    this.fileMenuPosition.x = event.clientX + this.fileMenuPosition.offSetX + 'px';
    this.fileMenuPosition.y = event.clientY + this.fileMenuPosition.offsetY + 'px';
    //this.fileMenu.menu.focusFirstItem("touch");

    this.fileMenu.openMenu();
    //this.fileMenu.menu.resetActiveItem;

  }


  onClick(file: FileDto) {
    if (this.isFolder(file)) {
      this.openFolder.emit(file);
    }
  }

  private isFolder(file: FileDto) {
    return file.mimeType.endsWith(".folder");
  }

  renameFile() {
    const renameModal = this.modal.open(EditModalComponent, {
      width: '100%',
      maxWidth: '800px',
      height: '100%',
      maxHeight: '400px',
      hasBackdrop: true,
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Rename File',
        file: {
          name: this.file.name,
          modifiedTime: this.file.modifiedTime
        }
      }
    });
    renameModal.afterClosed().subscribe(fileChanged => {
      if (fileChanged) {
        this.file.name = fileChanged.name;
        this.file.modifiedTime = new Date().toISOString();

        this.fileEdited.emit({
          id: this.file.id,
          name: this.file.name,
          modifiedTime: this.file.modifiedTime
        });
      }
    });

  }

  deleteFile() {
    this.fileDeleted.emit({
      id: this.file.id
    });
  }

  downloadFile(webContentLink: string) {
    window.open(webContentLink, "_blank");

  }

  openInNewTab(webLink: string) {
    window.open(webLink, "_blank");
  }

  mouseLeaveMenu() {
    if (this.fileMenu.menuOpened) {
      console.log("menuLeave");
      this.fileMenu.closeMenu();
    }
  }

  editFile() {
    const editModal = this.modal.open(EditModalComponent, {
      width: '100%',
      maxWidth: '800px',
      height: '400px',
      maxHeight: '800px',
      hasBackdrop: true,
      data: {
        title: 'Edit File links',
        file: {
          webContentLink: this.file.webContentLink,
          webViewLink: this.file.webViewLink,
          modifiedTime: this.file.modifiedTime

        }
      }
    });

    editModal.afterClosed().subscribe(fileChanged => {
      if (fileChanged) {
        this.file.webContentLink = fileChanged.webContentLink;
        this.file.webViewLink = fileChanged.webViewLink;
        this.file.modifiedTime = new Date().toDateString();
        console.log(fileChanged);
        this.fileEdited.emit({
          id: this.file.id,
          webContentLink: this.file.webContentLink,
          webViewLink: this.file.webViewLink,
          modifiedTime: this.file.modifiedTime
        });
      }
    });
  }
}
