import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AssetDashboardComponent } from "./dashboard/asset-dashboard.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AssetDashboardComponent },
  {
    path: "assets",
    loadChildren: () =>
      import("./assets/asset-list/asset-list.component").then(
        (m) => m.AssetListComponent,
      ),
  },
  {
    path: "maintenance",
    loadChildren: () =>
      import("./maintenance/maintenance.component").then(
        (m) => m.MaintenanceComponent,
      ),
  },
  {
    path: "alerts",
    loadChildren: () =>
      import("./alerts/alert-list.component").then((m) => m.AlertListComponent),
  },
  {
    path: "inventory",
    loadChildren: () =>
      import("./inventory/inventory.component").then(
        (m) => m.InventoryComponent,
      ),
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.component").then((m) => m.ReportsComponent),
  },
  // Fallback route
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetManagementRoutingModule {}
