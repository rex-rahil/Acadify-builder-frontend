import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// PrimeNG Modules
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { ChipModule } from "primeng/chip";
import { ProgressBarModule } from "primeng/progressbar";
import { TooltipModule } from "primeng/tooltip";
import { InputNumberModule } from "primeng/inputnumber";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { FileUploadModule } from "primeng/fileupload";
import { DividerModule } from "primeng/divider";
import { TabViewModule } from "primeng/tabview";
import { PanelModule } from "primeng/panel";
import { AccordionModule } from "primeng/accordion";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputTextareaModule } from "primeng/inputtextarea";

// Routing
import { FeesRoutingModule } from "./fees-routing.module";

// Components
import { FeeStructureComponent } from "./components/admin/fee-structure/fee-structure.component";
import { FeeReportsComponent } from "./components/admin/fee-reports/fee-reports.component";
import { RefundManagementComponent } from "./components/admin/refund-management/refund-management.component";
import { FeeBalanceComponent } from "./components/student/fee-balance/fee-balance.component";
import { PaymentHistoryComponent } from "./components/student/payment-history/payment-history.component";
import { MakePaymentComponent } from "./components/student/make-payment/make-payment.component";
import { CashPaymentsComponent } from "./components/accounting/cash-payments/cash-payments.component";
import { ScholarshipManagementComponent } from "./components/admin/scholarship-management/scholarship-management.component";
import { PaymentRemindersComponent } from "./components/admin/payment-reminders/payment-reminders.component";

@NgModule({
  declarations: [
    FeeStructureComponent,
    FeeReportsComponent,
    RefundManagementComponent,
    FeeBalanceComponent,
    PaymentHistoryComponent,
    MakePaymentComponent,
    CashPaymentsComponent,
    ScholarshipManagementComponent,
    PaymentRemindersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FeesRoutingModule,

    // PrimeNG
    ButtonModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    TagModule,
    ChipModule,
    ProgressBarModule,
    TooltipModule,
    InputNumberModule,
    RadioButtonModule,
    CheckboxModule,
    MultiSelectModule,
    FileUploadModule,
    DividerModule,
    TabViewModule,
    PanelModule,
    AccordionModule,
    ProgressSpinnerModule,
    InputTextareaModule,
  ],
})
export class FeesModule {}
