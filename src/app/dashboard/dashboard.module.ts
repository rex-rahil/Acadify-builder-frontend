import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { TimetableComponent } from "./components/timetable/timetable.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { ProfileComponent } from "./components/profile/profile.component";

// PrimeNG modules
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { TagModule } from "primeng/tag";
import { BadgeModule } from "primeng/badge";
import { DialogModule } from "primeng/dialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CalendarModule } from "primeng/calendar";
import { ToastModule } from "primeng/toast";
import { TabViewModule } from "primeng/tabview";
import { ProgressBarModule } from "primeng/progressbar";
import { DividerModule } from "primeng/divider";
import { ToolbarModule } from "primeng/toolbar";
import { ChipModule } from "primeng/chip";
import { AvatarModule } from "primeng/avatar";
import { PanelModule } from "primeng/panel";
import { FieldsetModule } from "primeng/fieldset";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { CheckboxModule } from "primeng/checkbox";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { KnobModule } from "primeng/knob";
import { ChartModule } from "primeng/chart";
import { TimelineModule } from "primeng/timeline";
import { ImageModule } from "primeng/image";
import { FileUploadModule } from "primeng/fileupload";

@NgModule({
  declarations: [
    DashboardComponent,
    TimetableComponent,
    AttendanceComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,

    // PrimeNG modules
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    BadgeModule,
    DialogModule,
    InputTextareaModule,
    CalendarModule,
    ToastModule,
    TabViewModule,
    ProgressBarModule,
    DividerModule,
    ToolbarModule,
    ChipModule,
    AvatarModule,
    PanelModule,
    FieldsetModule,
    MessageModule,
    MessagesModule,
    CheckboxModule,
    ProgressSpinnerModule,
    KnobModule,
    ChartModule,
    TimelineModule,
    ImageModule,
    FileUploadModule,
  ],
})
export class DashboardModule {}
