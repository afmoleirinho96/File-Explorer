import { Injectable } from '@angular/core';
import {FileDto} from "../file-explorer/file";

@Injectable({
  providedIn: 'root'
})
export class FileExplorerService {

  constructor() { }

  public static isFolder(file: FileDto) {
    return file.mimeType.endsWith(".folder");
  }
}
