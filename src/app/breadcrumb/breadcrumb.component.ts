import {Component, EventEmitter, Output} from '@angular/core';
import {BreadcrumbService} from "../services/breadcrumb.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {Breadcrumb} from "./breadcrumb";

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

  breadcrumbList: Breadcrumb[] = [{id: "root", label: "My Drive"}];
  breadcrumb: string[];

  @Output() navigateInBreadcrumb = new EventEmitter<string>();

  constructor(private readonly breadCrumbService: BreadcrumbService,
              readonly router: Router) {
    this.listenToRouteChange();
  }

  public listenToRouteChange() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbList = this.breadCrumbService.handleNavigationEndEvent(this.breadcrumb, this.breadcrumbList);
      }
    });
  }

  onBreadcrumbSelected(id: string) {
    if (id == null) {
      return;
    }
    this.navigateInBreadcrumb.emit(id);
  }

}
