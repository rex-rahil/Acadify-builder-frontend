import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AssetDashboardComponent } from "./dashboard/asset-dashboard.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AssetDashboardComponent },
  { path: "assets", component: AssetListComponent },
  // Fallback route
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetManagementRoutingModule {}
