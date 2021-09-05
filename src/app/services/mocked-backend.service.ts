import {Injectable} from '@angular/core';
import {FileDto} from "../file-explorer/file";
import {Backend} from "../../../server/backend";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MockedBackendService {

  backend = new Backend();

  constructor() {
  }

  getFile(id: string): Observable<FileDto> {
    return this.backend.getFile(id);
  }

  createFile(fileInfo: Omit<FileDto, 'id'>): Observable<FileDto> {
    return this.backend.createFile(fileInfo);
  }

  getFiles(fields: Partial<FileDto>): Observable<FileDto[]> {
    return this.backend.getFiles(fields);
  }

  deleteFile(id: string): Observable<FileDto[]> {
    return this.backend.deleteFile(id);
  }

  updateFile(id: string, fileProperties: Partial<FileDto>): Observable<FileDto> {
    return this.backend.updateFile(id, fileProperties);
  }
}
