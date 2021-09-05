import {Injectable} from '@angular/core';
import {Breadcrumb} from "../breadcrumb/breadcrumb";
import {MockedBackendService} from "./mocked-backend.service";
import {take} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  constructor(private readonly backend: MockedBackendService, private readonly router: Router) {
  }

  public handleNavigationEndEvent(breadCrumbIds: string[], breadcrumbList: Breadcrumb[]): Breadcrumb[] {
    const fileUrl = location.pathname.replace("/home", "");
    breadCrumbIds = fileUrl.split('/').filter(Boolean);
    if (breadCrumbIds.length === 0) {
      return [{id: "root", label: "My Drive"}];
    }

    breadCrumbIds.forEach(id => {
      const idExistsInBreadcrumb = breadcrumbList.findIndex(element => element.id === id);
      if (idExistsInBreadcrumb >= 0) {
        // Remove from the the clicked breadcrumb element, to the remaining ids / path
        return breadcrumbList.splice(idExistsInBreadcrumb + 1, breadcrumbList.length);
      }
      // There was no condition met to remove breadcrumb element. Then it means it was a navigate folder action.
      return this.addBreadcrumbElement(id, breadcrumbList);
    });

    return breadcrumbList;
  }

  /**
   * @param id of navigated folder to be added to breadcrumb list.
   * @param breadcrumbList contains all of the breadcrumb up until the current path.
   */
  private addBreadcrumbElement(id: string, breadcrumbList: Breadcrumb[]) {
    this.backend.getFile(id).pipe(take(1)).subscribe(file => {
      if (file == null) {
        this.router.navigate(['/home']);
        return;
      }
      breadcrumbList.push({id: file.id, label: file.name});
    });
  }
}


