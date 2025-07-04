import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService, User } from "./auth.service";
import {
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  RolePermissions,
} from "../models/role.model";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  private userPermissionsSubject = new BehaviorSubject<Permission[]>([]);
  public userPermissions$ = this.userPermissionsSubject.asObservable();

  constructor(private authService: AuthService) {
    // Subscribe to user changes and update permissions
    this.authService.currentUser$.subscribe((user) => {
      this.updateUserPermissions(user);
    });
  }

  /**
   * Check if current user has a specific permission
   */
  hasPermission(permission: Permission): Observable<boolean> {
    return this.userPermissions$.pipe(
      map((permissions) => permissions.includes(permission)),
    );
  }

  /**
   * Check if current user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): Observable<boolean> {
    return this.userPermissions$.pipe(
      map((userPermissions) =>
        permissions.some((permission) => userPermissions.includes(permission)),
      ),
    );
  }

  /**
   * Check if current user has all specified permissions
   */
  hasAllPermissions(permissions: Permission[]): Observable<boolean> {
    return this.userPermissions$.pipe(
      map((userPermissions) =>
        permissions.every((permission) => userPermissions.includes(permission)),
      ),
    );
  }

  /**
   * Check if current user can access a specific route
   */
  canAccessRoute(route: string): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new BehaviorSubject(false).asObservable();
    }

    const rolePermissions = this.getRolePermissions(
      currentUser.role as UserRole,
    );
    const canAccess =
      rolePermissions?.routes.some((allowedRoute) =>
        route.startsWith(allowedRoute),
      ) || false;

    return new BehaviorSubject(canAccess).asObservable();
  }

  /**
   * Get all permissions for current user
   */
  getCurrentUserPermissions(): Permission[] {
    return this.userPermissionsSubject.value;
  }

  /**
   * Get role permissions configuration
   */
  getRolePermissions(role: UserRole): RolePermissions | undefined {
    return ROLE_PERMISSIONS.find((rp) => rp.role === role);
  }

  /**
   * Get allowed routes for current user
   */
  getAllowedRoutes(): string[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const rolePermissions = this.getRolePermissions(
      currentUser.role as UserRole,
    );
    return rolePermissions?.routes || [];
  }

  /**
   * Check if user has administrative privileges
   */
  isAdmin(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => user?.role === UserRole.ADMIN),
    );
  }

  /**
   * Check if user is faculty or higher
   */
  isFacultyOrHigher(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        const role = user?.role as UserRole;
        return [UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN].includes(role);
      }),
    );
  }

  /**
   * Check if user is HOD or higher
   */
  isHODOrHigher(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        const role = user?.role as UserRole;
        return [UserRole.HOD, UserRole.ADMIN].includes(role);
      }),
    );
  }

  /**
   * Get user role display name
   */
  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrator";
      case UserRole.FACULTY:
        return "Faculty Member";
      case UserRole.HOD:
        return "Head of Department";
      case UserRole.ADMISSION_OFFICER:
        return "Admission Officer";
      case UserRole.STUDENT:
        return "Student";
      case UserRole.LIBRARIAN:
        return "Librarian";
      case UserRole.ASSET_MANAGER:
        return "Asset Manager";
      case UserRole.GUEST:
        return "Guest";
      default:
        return "Unknown";
    }
  }

  /**
   * Check if user can perform specific operations
   */
  canManageUsers(): Observable<boolean> {
    return this.hasPermission(Permission.MANAGE_USERS);
  }

  canManageCourses(): Observable<boolean> {
    return this.hasPermission(Permission.MANAGE_COURSES);
  }

  canReviewApplications(): Observable<boolean> {
    return this.hasPermission(Permission.REVIEW_APPLICATIONS);
  }

  canManageAssets(): Observable<boolean> {
    return this.hasPermission(Permission.MANAGE_ASSETS);
  }

  canManageLibrary(): Observable<boolean> {
    return this.hasPermission(Permission.MANAGE_BOOKS);
  }

  /**
   * Update user permissions based on current user
   */
  private updateUserPermissions(user: User | null): void {
    if (!user) {
      this.userPermissionsSubject.next([]);
      return;
    }

    const rolePermissions = this.getRolePermissions(user.role as UserRole);
    const permissions = rolePermissions?.permissions || [];
    this.userPermissionsSubject.next(permissions);
  }

  /**
   * Get navigation menu items based on user permissions
   */
  getNavigationMenuItems(): Observable<any[]> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (!user) return [];

        const rolePermissions = this.getRolePermissions(user.role as UserRole);
        const allowedRoutes = rolePermissions?.routes || [];

        const menuItems = [];

        // Admin menu items
        if (allowedRoutes.includes("/admin")) {
          menuItems.push({
            label: "Administration",
            icon: "pi pi-shield",
            items: [
              {
                label: "Admin Dashboard",
                icon: "pi pi-home",
                route: "/admin",
              },
              {
                label: "User Management",
                icon: "pi pi-users",
                route: "/admin/users",
              },
              {
                label: "Course Management",
                icon: "pi pi-book",
                route: "/admin/courses",
              },
            ],
          });
        }

        // Faculty menu items
        if (allowedRoutes.includes("/faculty")) {
          menuItems.push({
            label: "Faculty Portal",
            icon: "pi pi-graduation-cap",
            items: [
              {
                label: "Faculty Dashboard",
                icon: "pi pi-home",
                route: "/faculty",
              },
              {
                label: "My Courses",
                icon: "pi pi-book",
                route: "/faculty/courses",
              },
              {
                label: "Attendance",
                icon: "pi pi-clock",
                route: "/faculty/attendance",
              },
            ],
          });
        }

        // Admission Officer menu items
        if (allowedRoutes.includes("/admission-officer")) {
          menuItems.push({
            label: "Admission Management",
            icon: "pi pi-file-check",
            items: [
              {
                label: "Dashboard",
                icon: "pi pi-home",
                route: "/admission-officer",
              },
              {
                label: "Review Applications",
                icon: "pi pi-file-check",
                route: "/admission-officer/review",
              },
              {
                label: "Payment Management",
                icon: "pi pi-credit-card",
                route: "/admission-officer/payment",
              },
            ],
          });
        }

        // Asset Management menu items
        if (allowedRoutes.includes("/asset-management")) {
          menuItems.push({
            label: "Asset Management",
            icon: "pi pi-box",
            items: [
              {
                label: "Dashboard",
                icon: "pi pi-home",
                route: "/asset-management",
              },
              {
                label: "Assets",
                icon: "pi pi-box",
                route: "/asset-management/assets",
              },
              {
                label: "Maintenance",
                icon: "pi pi-wrench",
                route: "/asset-management/maintenance",
              },
            ],
          });
        }

        // Library menu items
        if (allowedRoutes.includes("/library")) {
          menuItems.push({
            label: "Library Management",
            icon: "pi pi-database",
            items: [
              {
                label: "Library Dashboard",
                icon: "pi pi-home",
                route: "/library",
              },
              {
                label: "Manage Books",
                icon: "pi pi-book",
                route: "/library/books",
              },
              {
                label: "Issue Books",
                icon: "pi pi-share-alt",
                route: "/library/issue",
              },
            ],
          });
        }

        // Student dashboard
        if (allowedRoutes.includes("/dashboard")) {
          menuItems.push({
            label: "Student Portal",
            icon: "pi pi-user",
            items: [
              {
                label: "Dashboard",
                icon: "pi pi-home",
                route: "/dashboard",
              },
              {
                label: "Profile",
                icon: "pi pi-user",
                route: "/dashboard/profile",
              },
              {
                label: "Attendance",
                icon: "pi pi-calendar",
                route: "/dashboard/attendance",
              },
            ],
          });
        }

        return menuItems;
      }),
    );
  }
}
