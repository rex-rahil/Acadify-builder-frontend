import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// PrimeNG Modules
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ChipModule } from "primeng/chip";
import { TagModule } from "primeng/tag";
import { BadgeModule } from "primeng/badge";
import { AvatarModule } from "primeng/avatar";
import { PanelModule } from "primeng/panel";
import { TabViewModule } from "primeng/tabview";
import { DividerModule } from "primeng/divider";
import { ToolbarModule } from "primeng/toolbar";
import { SplitButtonModule } from "primeng/splitbutton";
import { MultiSelectModule } from "primeng/multiselect";
import { ToggleButtonModule } from "primeng/togglebutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { ProgressBarModule } from "primeng/progressbar";
import { InputNumberModule } from "primeng/inputnumber";
import { FileUploadModule } from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { TimelineModule } from "primeng/timeline";
import { AccordionModule } from "primeng/accordion";
import { FieldsetModule } from "primeng/fieldset";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";

import { AdmissionOfficerRoutingModule } from "./admission-officer-routing.module";
import { OfficerDashboardComponent } from "./dashboard/officer-dashboard.component";
import { ApplicationReviewComponent } from "./review/application-review.component";
import { ApplicationDetailsComponent } from "./details/application-details.component";
import { PaymentManagementComponent } from "./payment/payment-management.component";

@NgModule({
  declarations: [
    OfficerDashboardComponent,
    ApplicationReviewComponent,
    ApplicationDetailsComponent,
    PaymentManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdmissionOfficerRoutingModule,
    // PrimeNG Modules
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ToastModule,
    ProgressSpinnerModule,
    ChipModule,
    TagModule,
    BadgeModule,
    AvatarModule,
    PanelModule,
    TabViewModule,
    DividerModule,
    ToolbarModule,
    SplitButtonModule,
    MultiSelectModule,
    ToggleButtonModule,
    SelectButtonModule,
    ProgressBarModule,
    InputNumberModule,
    FileUploadModule,
    ImageModule,
    TimelineModule,
    AccordionModule,
    FieldsetModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CheckboxModule,
  ],
})
export class AdmissionOfficerModule {}
