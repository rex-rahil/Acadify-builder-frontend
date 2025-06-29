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
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ChipModule } from "primeng/chip";
import { TagModule } from "primeng/tag";
import { BadgeModule } from "primeng/badge";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { PanelModule } from "primeng/panel";
import { AccordionModule } from "primeng/accordion";
import { TabViewModule } from "primeng/tabview";
import { FieldsetModule } from "primeng/fieldset";
import { DividerModule } from "primeng/divider";
import { SplitterModule } from "primeng/splitter";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { SidebarModule } from "primeng/sidebar";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { TieredMenuModule } from "primeng/tieredmenu";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { StepsModule } from "primeng/steps";
import { PaginatorModule } from "primeng/paginator";
import { ToolbarModule } from "primeng/toolbar";
import { SplitButtonModule } from "primeng/splitbutton";
import { MultiSelectModule } from "primeng/multiselect";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ToggleButtonModule } from "primeng/togglebutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { ProgressBarModule } from "primeng/progressbar";
import { InputNumberModule } from "primeng/inputnumber";
import { RatingModule } from "primeng/rating";
import { KnobModule } from "primeng/knob";
import { ColorPickerModule } from "primeng/colorpicker";

import { ImageModule } from "primeng/image";
import { GalleriaModule } from "primeng/galleria";
import { CarouselModule } from "primeng/carousel";
import { TimelineModule } from "primeng/timeline";
import { OrganizationChartModule } from "primeng/organizationchart";
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { DeferModule } from "primeng/defer";
import { InputSwitchModule } from "primeng/inputswitch";
import { SliderModule } from "primeng/slider";

import { FacultyRoutingModule } from "./faculty-routing.module";
import { FacultyDashboardComponent } from "./dashboard/faculty-dashboard.component";
import { CourseManagementComponent } from "./courses/course-management.component";
import { FacultyAssignmentComponent } from "./assignment/faculty-assignment.component";
import { FacultyAttendanceComponent } from "./attendance/faculty-attendance.component";
import { LeaveManagementComponent } from "./leaves/leave-management.component";

@NgModule({
  declarations: [
    FacultyDashboardComponent,
    CourseManagementComponent,
    FacultyAssignmentComponent,
    FacultyAttendanceComponent,
    LeaveManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FacultyRoutingModule,
    // PrimeNG Modules
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    FileUploadModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    ChipModule,
    TagModule,
    BadgeModule,
    AvatarModule,
    AvatarGroupModule,
    PanelModule,
    AccordionModule,
    TabViewModule,
    FieldsetModule,
    DividerModule,
    SplitterModule,
    ScrollPanelModule,
    OverlayPanelModule,
    SidebarModule,
    MenuModule,
    MenubarModule,
    TieredMenuModule,
    BreadcrumbModule,
    StepsModule,
    PaginatorModule,
    ToolbarModule,
    SplitButtonModule,
    MultiSelectModule,
    AutoCompleteModule,
    ToggleButtonModule,
    SelectButtonModule,
    SkeletonModule,
    ProgressBarModule,
    InputNumberModule,
    RatingModule,
    KnobModule,
    ColorPickerModule,
    ImageModule,
    GalleriaModule,
    CarouselModule,
    TimelineModule,
    OrganizationChartModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    DeferModule,
    InputSwitchModule,
    SliderModule,
  ],
})
export class FacultyModule {}
