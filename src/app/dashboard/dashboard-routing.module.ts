import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { TimetableComponent } from "./components/timetable/timetable.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AdmissionGuard } from "../admission/guards/admission.guard";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AdmissionGuard],
  },
  {
    path: "timetable",
    component: TimetableComponent,
    canActivate: [AdmissionGuard],
  },
  {
    path: "attendance",
    component: AttendanceComponent,
    canActivate: [AdmissionGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AdmissionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
