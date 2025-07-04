import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/guards/auth.guard";
import {
  RoleGuard,
  AdminGuard,
  FacultyGuard,
  AdmissionOfficerGuard,
  AssetManagerGuard,
  LibrarianGuard,
} from "./auth/guards/role.guard";
import { UserRole, Permission } from "./auth/models/role.model";

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
    canActivate: [AuthGuard, AdminGuard],
    data: {
      roles: [UserRole.ADMIN],
      permissions: [Permission.MANAGE_USERS, Permission.SYSTEM_SETTINGS],
    },
  },
  {
    path: "admission",
    loadChildren: () =>
      import("./admission/admission.module").then((m) => m.AdmissionModule),
    // Public access for new applications, but some routes may require authentication
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN],
    },
  },
  {
    path: "library",
    loadChildren: () =>
      import("./library/library.module").then((m) => m.LibraryModule),
    canActivate: [AuthGuard, LibrarianGuard],
    data: {
      roles: [UserRole.LIBRARIAN, UserRole.ADMIN],
      permissions: [Permission.MANAGE_BOOKS],
    },
  },
  {
    path: "faculty",
    loadChildren: () =>
      import("./faculty/faculty.module").then((m) => m.FacultyModule),
    canActivate: [AuthGuard, FacultyGuard],
    data: {
      roles: [UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN],
      permissions: [Permission.MANAGE_CLASSES],
    },
  },
  {
    path: "admission-officer",
    loadChildren: () =>
      import("./admission-officer/admission-officer.module").then(
        (m) => m.AdmissionOfficerModule,
      ),
    canActivate: [AuthGuard, AdmissionOfficerGuard],
    data: {
      roles: [UserRole.ADMISSION_OFFICER, UserRole.ADMIN],
      permissions: [Permission.MANAGE_ADMISSIONS],
    },
  },
  {
    path: "asset-management",
    loadChildren: () =>
      import("./asset-management/asset-management.module").then(
        (m) => m.AssetManagementModule,
      ),
    canActivate: [AuthGuard, AssetManagerGuard],
    data: {
      roles: [UserRole.ASSET_MANAGER, UserRole.ADMIN],
      permissions: [Permission.MANAGE_ASSETS],
    },
  },
  {
    path: "unauthorized",
    loadChildren: () =>
      import("./shared/unauthorized/unauthorized.module").then(
        (m) => m.UnauthorizedModule,
      ),
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
