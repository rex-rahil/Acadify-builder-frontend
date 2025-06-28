import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FacultyDashboardComponent } from "./dashboard/faculty-dashboard.component";
import { CourseManagementComponent } from "./courses/course-management.component";
import { FacultyAssignmentComponent } from "./assignment/faculty-assignment.component";
import { FacultyAttendanceComponent } from "./attendance/faculty-attendance.component";
import { LeaveManagementComponent } from "./leaves/leave-management.component";

const routes: Routes = [
  {
    path: "",
    component: FacultyDashboardComponent,
  },
  {
    path: "dashboard",
    component: FacultyDashboardComponent,
  },
  {
    path: "courses",
    component: CourseManagementComponent,
  },
  {
    path: "assignment",
    component: FacultyAssignmentComponent,
  },
  {
    path: "attendance",
    component: FacultyAttendanceComponent,
  },
  {
    path: "leaves",
    component: LeaveManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacultyRoutingModule {}
