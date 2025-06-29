import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/admission/status",
    pathMatch: "full",
  },
  {
    path: "admission",
    loadChildren: () =>
      import("./admission/admission.module").then((m) => m.AdmissionModule),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "library",
    loadChildren: () =>
      import("./library/library.module").then((m) => m.LibraryModule),
  },
  {
    path: "faculty",
    loadChildren: () =>
      import("./faculty/faculty.module").then((m) => m.FacultyModule),
  },
  {
    path: "admission-officer",
    loadChildren: () =>
      import("./admission-officer/admission-officer.module").then(
        (m) => m.AdmissionOfficerModule,
      ),
  },
  {
    path: "**",
    redirectTo: "/admission/status",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
