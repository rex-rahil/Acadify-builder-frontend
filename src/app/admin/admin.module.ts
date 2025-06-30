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

// Routing
import { AdminRoutingModule } from "./admin-routing.module";

// Components
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { UserListComponent } from "./user-management/user-list/user-list.component";
import { UserFormComponent } from "./user-management/user-form/user-form.component";
import { CourseManagementComponent } from "./course-management/course-management.component";
import { CourseListComponent } from "./course-management/course-list/course-list.component";
import { CourseFormComponent } from "./course-management/course-form/course-form.component";
import { SubjectAllocationComponent } from "./course-management/subject-allocation/subject-allocation.component";

// Services
import { AdminService } from "./services/admin.service";
import { UserService } from "./services/user.service";
import { CourseService } from "./services/course.service";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    UserListComponent,
    UserFormComponent,
    CourseManagementComponent,
    CourseListComponent,
    CourseFormComponent,
    SubjectAllocationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,

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
  ],
  providers: [AdminService, UserService, CourseService],
})
export class AdminModule {}
