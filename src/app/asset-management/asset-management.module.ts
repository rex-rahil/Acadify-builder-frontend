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

// Services
import { AssetService } from "./services/asset.service";
import { MaintenanceService } from "./services/maintenance.service";
import { InventoryService } from "./services/inventory.service";
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
