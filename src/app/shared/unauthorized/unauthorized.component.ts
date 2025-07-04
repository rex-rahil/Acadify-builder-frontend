import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, User } from "../../auth/services/auth.service";
import { PermissionService } from "../../auth/services/permission.service";
import { UserRole } from "../../auth/models/role.model";

@Component({
  selector: "app-unauthorized",
  templateUrl: "./unauthorized.component.html",
  styleUrls: ["./unauthorized.component.scss"],
})
export class UnauthorizedComponent implements OnInit {
  currentUser: User | null = null;
  allowedRoutes: string[] = [];

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.allowedRoutes = this.permissionService.getAllowedRoutes();
  }

  goToAllowedPage(): void {
    if (this.allowedRoutes.length > 0) {
      this.router.navigate([this.allowedRoutes[0]]);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getRoleDisplayName(): string {
    if (!this.currentUser) return "Unknown";
    return this.permissionService.getRoleDisplayName(
      this.currentUser.role as UserRole,
    );
  }
}
