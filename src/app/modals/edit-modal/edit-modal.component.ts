import {Component, Inject} from '@angular/core';
import {FileDto} from "../../file-explorer/file";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent {

  lastModifiedDate: Date;
  title: string;
  file: Partial<FileDto>;
  initialFileValues: Partial<FileDto>;
  fileFormGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EditModalComponent>,
              formBuilder: FormBuilder) {

    this.lastModifiedDate = this.data.file.modifiedTime;
    this.title = this.data.title;
    const {modifiedTime, ...fileWithoutDate} = data.file;
    this.file = fileWithoutDate;

    // Clone to verify on modal submit if the file was indeed changed in the modal.
    this.initialFileValues = {...this.file};
    this.fileFormGroup = formBuilder.group({});

    this.addFormControlsDynamically(formBuilder);
  }

  /**
   * Compare initial file values with final form values (dirty is not enough). Example: FileName 1 -> FileName 2 -> FileName 1
   * When hitting the OK button, I'll first verify if there were any changes, to prevent from emiting events and prevent update properties in backend.
   * At the same time, it prevents frrom changing modified time.
   */
  onModalClose() {
    if (!this.fileFormGroup.valid) {
      return;
    }

    if (JSON.stringify(this.fileFormGroup.value) === JSON.stringify(this.initialFileValues)) {
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close(this.fileFormGroup.value);
  }

  private addFormControlsDynamically(formBuild: FormBuilder) {
    if (this.file.name != null) {
      this.fileFormGroup.addControl('name', formBuild.control(
        this.file.name, [Validators.required, Validators.minLength(2)]));
    }

    if (this.file.webViewLink != null) {
      this.fileFormGroup.addControl('webViewLink', formBuild.control(
        this.file.webViewLink, [Validators.required, EditModalComponent.hasWhitespaceCharacterInBetween, EditModalComponent.isLinkSecure]));
    }

    if (this.file.webContentLink != null) {
      this.fileFormGroup.addControl('webContentLink', formBuild.control(
        this.file.webContentLink, [Validators.required, EditModalComponent.hasWhitespaceCharacterInBetween, EditModalComponent.isLinkSecure]));
    }

    if (this.file.iconLink != null) {
      this.fileFormGroup.addControl('iconLink', formBuild.control(
        this.file.iconLink, [Validators.required, EditModalComponent.hasWhitespaceCharacterInBetween, EditModalComponent.isLinkSecure]));
    }
  }

  /**
   * Validate whether or not that there is a blank character in between a link string.
   * Example: '', 'abc', are valid. but 'a bc' isn't since it has a white space in between.
   */
  private static hasWhitespaceCharacterInBetween(control: FormControl): null | { "whitespace-between": boolean } {
    const valueWithoutWhiteSpaces = control.value.replace(/\s/g, "");
    const isValid = valueWithoutWhiteSpaces === control.value;
    return isValid ? null : {'whitespace-between': true};
  }

  private static isLinkSecure(control: FormControl): null | { "is-insecure": boolean } {
    return control.value.startsWith('https://') ? null : {'is-insecure': true};
  }
}
