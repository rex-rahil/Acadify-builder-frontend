import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, take, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { PermissionService } from "../services/permission.service";
import { UserRole, Permission } from "../models/role.model";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.checkAccess(route, state);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.checkAccess(route, state);
  }

  private checkAccess(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url },
          });
          return of(false);
        }

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          this.router.navigate(["/login"]);
          return of(false);
        }

        // Check role-based access
        const requiredRoles = route.data?.["roles"] as UserRole[];
        const requiredPermissions = route.data?.["permissions"] as Permission[];
        const routePath = state.url;

        // If no specific roles or permissions are required, allow access for authenticated users
        if (!requiredRoles && !requiredPermissions) {
          return this.permissionService.canAccessRoute(routePath);
        }

        // Check role access
        if (requiredRoles && requiredRoles.length > 0) {
          const userRole = currentUser.role as UserRole;
          if (!requiredRoles.includes(userRole)) {
            this.handleUnauthorizedAccess(currentUser.role);
            return of(false);
          }
        }

        // Check permission access
        if (requiredPermissions && requiredPermissions.length > 0) {
          return this.permissionService
            .hasAnyPermission(requiredPermissions)
            .pipe(
              map((hasPermission) => {
                if (!hasPermission) {
                  this.handleUnauthorizedAccess(currentUser.role);
                  return false;
                }
                return true;
              }),
            );
        }

        // Check general route access based on role
        return this.permissionService.canAccessRoute(routePath).pipe(
          map((canAccess) => {
            if (!canAccess) {
              this.handleUnauthorizedAccess(currentUser.role);
              return false;
            }
            return true;
          }),
        );
      }),
    );
  }

  private handleUnauthorizedAccess(userRole: string): void {
    // Redirect to appropriate dashboard based on user role
    switch (userRole) {
      case UserRole.ADMIN:
        this.router.navigate(["/admin"]);
        break;
      case UserRole.FACULTY:
      case UserRole.HOD:
        this.router.navigate(["/faculty"]);
        break;
      case UserRole.ADMISSION_OFFICER:
        this.router.navigate(["/admission-officer"]);
        break;
      case UserRole.STUDENT:
        this.router.navigate(["/dashboard"]);
        break;
      case UserRole.LIBRARIAN:
        this.router.navigate(["/library"]);
        break;
      case UserRole.ASSET_MANAGER:
        this.router.navigate(["/asset-management"]);
        break;
      default:
        this.router.navigate(["/login"]);
        break;
    }
  }
}

// Specific role guards for common use cases
@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private roleGuard: RoleGuard) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    route.data = { ...route.data, roles: [UserRole.ADMIN] };
    return this.roleGuard.canActivate(route, state);
  }
}

@Injectable({
  providedIn: "root",
})
export class FacultyGuard implements CanActivate {
  constructor(private roleGuard: RoleGuard) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    route.data = {
      ...route.data,
      roles: [UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN],
    };
    return this.roleGuard.canActivate(route, state);
  }
}

@Injectable({
  providedIn: "root",
})
export class AdmissionOfficerGuard implements CanActivate {
  constructor(private roleGuard: RoleGuard) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    route.data = {
      ...route.data,
      roles: [UserRole.ADMISSION_OFFICER, UserRole.ADMIN],
    };
    return this.roleGuard.canActivate(route, state);
  }
}

@Injectable({
  providedIn: "root",
})
export class AssetManagerGuard implements CanActivate {
  constructor(private roleGuard: RoleGuard) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    route.data = {
      ...route.data,
      roles: [UserRole.ASSET_MANAGER, UserRole.ADMIN],
    };
    return this.roleGuard.canActivate(route, state);
  }
}

@Injectable({
  providedIn: "root",
})
export class LibrarianGuard implements CanActivate {
  constructor(private roleGuard: RoleGuard) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    route.data = {
      ...route.data,
      roles: [UserRole.LIBRARIAN, UserRole.ADMIN],
    };
    return this.roleGuard.canActivate(route, state);
  }
}
