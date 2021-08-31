import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FileExplorerListComponent} from "./file-explorer/list/file-explorer-list.component";
import {FileExplorerItemComponent} from "./file-explorer/item/file-explorer-item.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: FileExplorerListComponent,
    children: [
      {path: '**', component: FileExplorerListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
