import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { CourseManagementComponent } from "./course-management/course-management.component";
import { SubjectAllocationComponent } from "./course-management/subject-allocation/subject-allocation.component";
import { TimetableManagementComponent } from "./timetable-management/timetable-management.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    component: AdminDashboardComponent,
  },
  {
    path: "users",
    component: UserManagementComponent,
  },
  {
    path: "courses",
    component: CourseManagementComponent,
  },
  {
    path: "subjects",
    component: SubjectAllocationComponent,
  },
  {
    path: "timetable",
    component: TimetableManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
