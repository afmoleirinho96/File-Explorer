import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditModalComponent} from "../modals/edit-modal/edit-modal.component";
import {FileExplorerListComponent} from "./list/file-explorer-list.component";
import {FileExplorerItemComponent} from "./item/file-explorer-item.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UploadDragDropDirective} from "../directives/upload-drag-drop.directive";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HighlightDirective} from "../directives/highlight.directive";
import {NewFileComponent} from "./new-file/new-file.component";
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {NewFileBotomSheetComponent} from "../file-bottom-sheet/new-file-botom-sheet.component";

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatBottomSheetModule
  ],
  declarations: [
    FileExplorerListComponent,
    FileExplorerItemComponent,
    EditModalComponent,
    UploadDragDropDirective,
    FileUploadComponent,
    HighlightDirective,
    NewFileComponent,
    BreadcrumbComponent,
    NewFileBotomSheetComponent],
  exports: [FileExplorerListComponent],
  entryComponents: [EditModalComponent, NewFileBotomSheetComponent]
})
export class FileExplorerModule {
}
