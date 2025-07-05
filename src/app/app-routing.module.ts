import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: "faculty",
    loadChildren: () =>
      import("./faculty/faculty.module").then((m) => m.FacultyModule),
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: "admission",
    loadChildren: () =>
      import("./admission/admission.module").then((m) => m.AdmissionModule),
    // Note: Admission route should be open for prospective students
  },
  {
    path: "admission-officer",
    loadChildren: () =>
      import("./admission-officer/admission-officer.module").then(
        (m) => m.AdmissionOfficerModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "library",
    loadChildren: () =>
      import("./library/library.module").then((m) => m.LibraryModule),
    canActivate: [AuthGuard],
  },
  {
    path: "asset-management",
    loadChildren: () =>
      import("./asset-management/asset-management.module").then(
        (m) => m.AssetManagementModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    redirectTo: "/login",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
