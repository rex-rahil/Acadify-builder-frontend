import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

// PrimeNG Modules
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TagModule } from "primeng/tag";
import { ToggleButtonModule } from "primeng/togglebutton";
import { MultiSelectModule } from "primeng/multiselect";
import { DividerModule } from "primeng/divider";
import { ChipModule } from "primeng/chip";
import { PanelModule } from "primeng/panel";
import { TabViewModule } from "primeng/tabview";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { TooltipModule } from "primeng/tooltip";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { StepsModule } from "primeng/steps";
import { InputNumberModule } from "primeng/inputnumber";
import { FileUploadModule } from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { BadgeModule } from "primeng/badge";
import { KnobModule } from "primeng/knob";
import { ChartModule } from "primeng/chart";
import { TimelineModule } from "primeng/timeline";
import { AccordionModule } from "primeng/accordion";
import { SplitterModule } from "primeng/splitter";
import { FieldsetModule } from "primeng/fieldset";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ConfirmationService, MessageService } from "primeng/api";

// Routing
import { AssetManagementRoutingModule } from "./asset-management-routing.module";

// Components
import { AssetDashboardComponent } from "./dashboard/asset-dashboard.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";
import { AssetFormComponent } from "./assets/asset-form/asset-form.component";
import { AssetDetailsComponent } from "./assets/asset-details/asset-details.component";
import { MaintenanceRequestsComponent } from "./maintenance/maintenance-requests/maintenance-requests.component";
import { MaintenanceFormComponent } from "./maintenance/maintenance-form/maintenance-form.component";
import { MaintenanceHistoryComponent } from "./maintenance/maintenance-history/maintenance-history.component";
import { ProcurementDashboardComponent } from "./procurement/procurement-dashboard/procurement-dashboard.component";
import { RequisitionListComponent } from "./procurement/requisition-list/requisition-list.component";
import { RequisitionFormComponent } from "./procurement/requisition-form/requisition-form.component";
import { PurchaseOrderListComponent } from "./procurement/purchase-order-list/purchase-order-list.component";
import { PurchaseOrderFormComponent } from "./procurement/purchase-order-form/purchase-order-form.component";
import { InventoryListComponent } from "./inventory/inventory-list/inventory-list.component";
import { InventoryFormComponent } from "./inventory/inventory-form/inventory-form.component";
import { StockMovementComponent } from "./inventory/stock-movement/stock-movement.component";
import { ReportsComponent } from "./reports/reports.component";
import { AssetAllocationComponent } from "./allocation/asset-allocation.component";
import { AllocationFormComponent } from "./allocation/allocation-form/allocation-form.component";
import { DepreciationTrackingComponent } from "./depreciation/depreciation-tracking.component";
import { AlertsComponent } from "./alerts/alerts.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { SupplierFormComponent } from "./suppliers/supplier-form/supplier-form.component";

// Services
import { AssetService } from "./services/asset.service";
import { MaintenanceService } from "./services/maintenance.service";
import { ProcurementService } from "./services/procurement.service";
import { InventoryService } from "./services/inventory.service";
import { ReportService } from "./services/report.service";
import { AlertService } from "./services/alert.service";

@NgModule({
  declarations: [
    AssetDashboardComponent,
    AssetListComponent,
    AssetFormComponent,
    AssetDetailsComponent,
    MaintenanceRequestsComponent,
    MaintenanceFormComponent,
    MaintenanceHistoryComponent,
    ProcurementDashboardComponent,
    RequisitionListComponent,
    RequisitionFormComponent,
    PurchaseOrderListComponent,
    PurchaseOrderFormComponent,
    InventoryListComponent,
    InventoryFormComponent,
    StockMovementComponent,
    ReportsComponent,
    AssetAllocationComponent,
    AllocationFormComponent,
    DepreciationTrackingComponent,
    AlertsComponent,
    SuppliersComponent,
    SupplierFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AssetManagementRoutingModule,

    // PrimeNG
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TagModule,
    ToggleButtonModule,
    MultiSelectModule,
    DividerModule,
    ChipModule,
    PanelModule,
    TabViewModule,
    InputTextareaModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule,
    MessagesModule,
    StepsModule,
    InputNumberModule,
    FileUploadModule,
    ImageModule,
    BadgeModule,
    KnobModule,
    ChartModule,
    TimelineModule,
    AccordionModule,
    SplitterModule,
    FieldsetModule,
    OverlayPanelModule,
  ],
  providers: [
    AssetService,
    MaintenanceService,
    ProcurementService,
    InventoryService,
    ReportService,
    AlertService,
    ConfirmationService,
    MessageService,
  ],
})
export class AssetManagementModule {}
