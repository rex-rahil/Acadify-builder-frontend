import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AssetDashboardComponent } from "./dashboard/asset-dashboard.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";
import { AssetFormComponent } from "./assets/asset-form/asset-form.component";
import { AssetDetailsComponent } from "./assets/asset-details/asset-details.component";
import { MaintenanceRequestsComponent } from "./maintenance/maintenance-requests/maintenance-requests.component";
import { MaintenanceHistoryComponent } from "./maintenance/maintenance-history/maintenance-history.component";
import { ProcurementDashboardComponent } from "./procurement/procurement-dashboard/procurement-dashboard.component";
import { RequisitionListComponent } from "./procurement/requisition-list/requisition-list.component";
import { PurchaseOrderListComponent } from "./procurement/purchase-order-list/purchase-order-list.component";
import { InventoryListComponent } from "./inventory/inventory-list/inventory-list.component";
import { ReportsComponent } from "./reports/reports.component";
import { AssetAllocationComponent } from "./allocation/asset-allocation.component";
import { DepreciationTrackingComponent } from "./depreciation/depreciation-tracking.component";
import { AlertsComponent } from "./alerts/alerts.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AssetDashboardComponent },
  { path: "assets", component: AssetListComponent },
  { path: "assets/new", component: AssetFormComponent },
  { path: "assets/:id/edit", component: AssetFormComponent },
  { path: "assets/:id", component: AssetDetailsComponent },
  { path: "maintenance", component: MaintenanceRequestsComponent },
  { path: "maintenance/history", component: MaintenanceHistoryComponent },
  { path: "procurement", component: ProcurementDashboardComponent },
  { path: "procurement/requisitions", component: RequisitionListComponent },
  { path: "procurement/orders", component: PurchaseOrderListComponent },
  { path: "inventory", component: InventoryListComponent },
  { path: "allocation", component: AssetAllocationComponent },
  { path: "depreciation", component: DepreciationTrackingComponent },
  { path: "reports", component: ReportsComponent },
  { path: "alerts", component: AlertsComponent },
  { path: "suppliers", component: SuppliersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetManagementRoutingModule {}
