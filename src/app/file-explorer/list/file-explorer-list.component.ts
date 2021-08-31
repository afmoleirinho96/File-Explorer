import {Component, OnDestroy, OnInit} from '@angular/core';
import {Backend} from "../../../../server/backend";
import {FileDto} from "../file";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {filter, take} from "rxjs/operators";
import {Subscription} from 'rxjs';


@Component({
  selector: 'file-explorer-list',
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss']
})
export class FileExplorerListComponent implements OnInit, OnDestroy {

  private backEnd: Backend = new Backend();
  files: FileDto[] = [];
  breadCrumbPath = "My Drive";
  currentUrlId: string;
  private routeSubscription: Subscription = new Subscription();

  constructor(private router: Router) {
    this.listenToRouteChange();
  }

  ngOnInit() {
  }
  
  navigateToFolder(file: FileDto) {
    this.router.navigate([this.router.url, file.id]);
    this.updateBreadCrumb(file.name);
  }

  private getChildrenFiles(fileId: string) {
    this.backEnd.getFiles({"parents": [fileId]}).subscribe(res => {
      this.files = res;
    });
  }

  private updateBreadCrumb(folderName: string) {
    this.breadCrumbPath += ` > ${folderName}`;
    return this.breadCrumbPath;
  }

  /**
   *
   * @private
   */
  private listenToRouteChange() {
    this.routeSubscription.add(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationStart))
        .subscribe((event) => {
          if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
            const parentUrlId = event.url.split("/").pop();
            if (parentUrlId == null) {
              return;
            }
            this.reactOnNavigationEvent(parentUrlId);

          } else if (event instanceof NavigationEnd) {
            const parentUrlId = event.urlAfterRedirects.split("/").pop();
            /* Comparison between currentUrlId with parentUrlId prevents NavigationEnd trigger after NavigationStart.
             * Otherwise, after clicking on back button, would trigger both events. */
            if (parentUrlId == null || this.currentUrlId === parentUrlId) {
              return;
            }
            this.reactOnNavigationEvent(parentUrlId);
          }
        }));

  }

  /**
   * Based on parentUrlId, get either all root files or children for the given urlId.
   * @param parentUrlId parent Url to fetch childs from. Ex: home/123/645 parentUrlId will be 645.
   */
  private reactOnNavigationEvent(parentUrlId: string) {
    if (parentUrlId == null) {
      return;
    }
    parentUrlId === "home" ? this.getRootFiles() : this.getChildrenFiles(parentUrlId);
    this.currentUrlId = parentUrlId;
  }

  private getRootFiles() {
    this.backEnd.getFiles({"parents": []}).pipe(take(1)).subscribe(rootFiles => {
      this.files = rootFiles;
    });
  }

  updateFileProperties(fileUpdated: Partial<FileDto>) {
    if (fileUpdated.id == null) {
      return;
    }
    const {['id']: fileId, ...propertiesChanged} = fileUpdated;
    const requestProperties = JSON.parse(JSON.stringify(propertiesChanged));

    this.backEnd.updateFile(fileId, requestProperties).pipe(take(1)).subscribe((res: FileDto) => {
      const fileIndex = this.files.findIndex(file => file.id === res.id);
      this.files[fileIndex] = res;
    });
  }

  deleteFile(fileDeleted: Partial<FileDto>): void {
    if (fileDeleted.id == null) {
      return;
    }
    this.backEnd.deleteFile(fileDeleted.id).pipe(take(1)).subscribe((res: FileDto[]) => {
      this.files = this.files.filter(file => file.id !== res[0].id);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

  }
}
