import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { TimetableComponent } from "./components/timetable/timetable.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { ProfileComponent } from "./components/profile/profile.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "timetable",
    component: TimetableComponent,
  },
  {
    path: "attendance",
    component: AttendanceComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
