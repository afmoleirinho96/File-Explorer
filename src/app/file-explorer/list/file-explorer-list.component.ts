import {Component, OnDestroy} from '@angular/core';
import {FileDto} from "../file";
import {NavigationEnd, Router} from "@angular/router";
import {filter, take} from "rxjs/operators";
import {Subscription} from 'rxjs';
import {MockedBackendService} from "../../services/mocked-backend.service";
import {FileExplorerService} from "../../services/file-explorer.service";


@Component({
  selector: 'file-explorer-list',
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss']
})
export class FileExplorerListComponent implements OnDestroy {

  files: FileDto[] = [];
  currentUrlId: string;

  private routeSubscription: Subscription = new Subscription();

  constructor(private router: Router, private readonly backendService: MockedBackendService) {
    this.listenToRouteChange();
  }

  /** Triggered on folder double click */
  navigateToFolder(id: string) {
    this.router.navigate([this.router.url, id]);
  }

  /** Triggered when breadcrum item is clicked */
  navigateToPreviousFolder(urlId: string) {
    if (urlId === "root") {
      this.router.navigate(["/home"]);
    } else {
      // First part of url until item clicked.
      const pathUntilPreviousFolder = this.router.url.split(urlId)[0];
      this.router.navigate([pathUntilPreviousFolder, urlId]);
    }

  }

  /** Updates file properties updates files list */
  updateFileProperties(fileUpdated: Partial<FileDto>) {
    if (fileUpdated.id == null) {
      return;
    }

    const {['id']: fileId, ...propertiesChanged} = fileUpdated;
    const requestProperties = JSON.parse(JSON.stringify(propertiesChanged));

    this.backendService.updateFile(fileId, requestProperties).pipe(take(1)).subscribe((res: FileDto) => {
      const fileIndex = this.files.findIndex(file => file.id === res.id);
      this.files[fileIndex] = res;
    });
  }

  /** Deletes file and updates files list */
  deleteFile(fileDeleted: Partial<FileDto>): void {
    if (fileDeleted.id == null) {
      return;
    }
    this.backendService.deleteFile(fileDeleted.id).pipe(take(1)).subscribe((res: FileDto[]) => {
      this.files = this.files.filter(file => file.id !== res[0].id);
    });
  }

  getFolders(files: FileDto[]) {
    return files.filter(file => FileExplorerService.isFolder(file));
  }

  getFiles(files: FileDto[]) {
    return files.filter(file => !FileExplorerService.isFolder(file));
  }

  createFileUploaded(fileUploaded: any) {
    return this.backendService.createFile(this.genereteFileUploaded(fileUploaded)).pipe(take(1)).subscribe((res: FileDto) => {
      this.files.push(res);
    });
  }

  refreshPage(): void {
    location.reload();
  }

  addNewItem(file: FileDto) {
    this.files.push(file);
  }

  private listenToRouteChange() {
    this.routeSubscription.add(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event) => {
          // Event that is triggered when navigation of routing change effectively ends.
          if (event instanceof NavigationEnd) {
            const parentUrlId = event.urlAfterRedirects.split("/").pop();

            if (parentUrlId == null) {
              return;
            }
            this.reactOnNavigationEvent(parentUrlId);
          }
        }));
  }

  /**
   * Based on parentUrlId, get either all root files or children for the given urlId.
   * @param parentUrlId parent Url to fetch childs from. Eg: home/123/645 parentUrlId will be 645.
   */
  private reactOnNavigationEvent(parentUrlId: string) {
    if (parentUrlId == null) {
      return;
    }
    parentUrlId === "home" ? this.getRootFiles() : this.getChildrenFiles(parentUrlId);
    this.currentUrlId = parentUrlId;
  }


  private getRootFiles() {
    this.backendService.getFiles({"parents": []}).pipe(take(1)).subscribe(rootFiles => {
      this.files = rootFiles;
    });
  }

  private getChildrenFiles(fileId: string) {
    this.backendService.getFiles({"parents": [fileId]}).pipe(take(1)).subscribe(res => {
      this.files = res;
    });
  }

  private genereteFileUploaded(fileUploaded: any) {
    return {
      name: fileUploaded.name,
      mimeType: fileUploaded.type,
      parents: this.currentUrlId === 'home' ? [] : [this.currentUrlId],
      modifiedTime: new Date().toISOString(),
      webViewLink: '',
      webContentLink: '',
      iconLink: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESXgH8VLOVd03YSIPWULyyVDb8PvpW1iBeQ&usqp=CAU'
    };
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
