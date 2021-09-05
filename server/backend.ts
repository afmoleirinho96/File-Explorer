import {catchError, delay, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import baseData from './dzejson.json';

export class ResponseFile {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
  webContentLink?: string;
  webViewLink: string;
  iconLink: string;
  modifiedTime: string;
  size?: string;
}

export class Backend {

  private serverFiles: ResponseFile[] = baseData.files;

  constructor() {
  }

  getFile(id: string): Observable<ResponseFile> {
    return of(this.serverFiles).pipe(delay(500), map(x => x.filter(y => y.id === id)[0]));
  }

  getFiles(fieldsFilter: Partial<ResponseFile>): Observable<ResponseFile[]> {
    return of(this.serverFiles).pipe(delay(500), map(x => x.filter(y => {
      let isSuccess = true;
      if (fieldsFilter.iconLink) {
        isSuccess = fieldsFilter.iconLink === y.iconLink;
      }
      if (fieldsFilter.id) {
        isSuccess = fieldsFilter.id === y.id;
      }
      if (fieldsFilter.mimeType) {
        isSuccess = fieldsFilter.mimeType === y.mimeType;
      }
      if (fieldsFilter.modifiedTime) {
        isSuccess = fieldsFilter.modifiedTime === y.modifiedTime;

      }
      if (fieldsFilter.name) {
        isSuccess = fieldsFilter.name === y.name;
      }
      if (fieldsFilter.parents) {
        isSuccess = this.compareArrays(fieldsFilter.parents, y.parents);
      }
      if (fieldsFilter.size) {
        isSuccess = fieldsFilter.size === y.size;
      }
      if (fieldsFilter.webContentLink) {
        isSuccess = fieldsFilter.webContentLink === y.webContentLink;
      }
      if (fieldsFilter.webViewLink) {
        isSuccess = fieldsFilter.webViewLink === y.webViewLink;
      }
      return isSuccess;
    })),catchError(err => {
      console.log('Handling error locally and rethrowing it...', err);
      return throwError(err);
    }));
  }

  deleteFile(id: string): Observable<ResponseFile[]> {
    return of(this.serverFiles.splice(this.serverFiles.findIndex(x => x.id === id), 1)).pipe(delay(500));
  }

  updateFile(id: string, fieldsUpdate: Partial<ResponseFile>): Observable<ResponseFile> {
    const file = Object.assign({}, this.serverFiles.find(x => x.id === id));
    if (fieldsUpdate.iconLink) {
      file.iconLink = fieldsUpdate.iconLink;
    }
    if (fieldsUpdate.mimeType) {
      file.mimeType = fieldsUpdate.mimeType;
    }
    if (fieldsUpdate.modifiedTime) {
      file.modifiedTime = fieldsUpdate.modifiedTime;
    }
    if (fieldsUpdate.name) {
      file.name = fieldsUpdate.name;
    }
    if (fieldsUpdate.parents) {
      file.parents = fieldsUpdate.parents;
    }
    if (fieldsUpdate.size) {
      file.size = fieldsUpdate.size;
    }
    if (fieldsUpdate.webContentLink) {
      file.webContentLink = fieldsUpdate.webContentLink;
    }
    if (fieldsUpdate.webViewLink) {
      file.webViewLink = fieldsUpdate.webViewLink;
    }

    this.serverFiles = [...this.serverFiles.filter(x => x.id !== id), file];
    return of(file).pipe(delay(500));
  }

  createFile(input: Omit<ResponseFile, 'id'>) {
    const newFile = {...input, id: this.getUniqueId(2)};
    this.serverFiles = [...this.serverFiles, newFile];
    return of(newFile).pipe(delay(500));
  }

  private compareArrays(array1: any, array2: any): boolean {
    // if the other array is a falsy value, return
    if (!array1) {
      return false;

    }

    // compare lengths - can save a lot of time
    if (array2.length !== array1.length) {

      return false;
    }

    for (let i = 0, l = array2.length; i < l; i++) {
      // Check if we have nested arrays
      if (array2[i] instanceof Array && array1[i] instanceof Array) {
        // recurse into the nested arrays
        if (!array2[i].equals(array1[i])) {
          return false;

        }
      } else if (array2[i] !== array1[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }

  getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }
}
