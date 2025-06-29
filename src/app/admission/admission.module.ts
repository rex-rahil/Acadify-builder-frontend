import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { AdmissionRoutingModule } from "./admission-routing.module";
import { AdmissionComponent } from "./admission.component";

// Step components
import { PersonalDetailsComponent } from "./components/personal-details/personal-details.component";
import { CategoryEligibilityComponent } from "./components/category-eligibility/category-eligibility.component";
import { AcademicQualificationsComponent } from "./components/academic-qualifications/academic-qualifications.component";
import { ParentGuardianComponent } from "./components/parent-guardian/parent-guardian.component";
import { DocumentsDeclarationComponent } from "./components/documents-declaration/documents-declaration.component";

// New components
import { ApplicationStatusComponent } from "./components/application-status/application-status.component";
import { FeePaymentComponent } from "./components/fee-payment/fee-payment.component";

// PrimeNG modules
import { StepsModule } from "primeng/steps";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputNumberModule } from "primeng/inputnumber";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { FieldsetModule } from "primeng/fieldset";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { DividerModule } from "primeng/divider";
import { PanelModule } from "primeng/panel";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TagModule } from "primeng/tag";

@NgModule({
  declarations: [
    AdmissionComponent,
    PersonalDetailsComponent,
    CategoryEligibilityComponent,
    AcademicQualificationsComponent,
    ParentGuardianComponent,
    DocumentsDeclarationComponent,
    ApplicationStatusComponent,
    FeePaymentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdmissionRoutingModule,

    // PrimeNG modules
    StepsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    MultiSelectModule,
    FileUploadModule,
    TableModule,
    FieldsetModule,
    ScrollPanelModule,
    DividerModule,
    PanelModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule,
  ],
})
export class AdmissionModule {}
