import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PermissionService } from "../../auth/services/permission.service";
import { AuthService, User } from "../../auth/services/auth.service";
import { Permission, UserRole } from "../../auth/models/role.model";

@Directive({
  selector: "[appHasPermission]",
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() set appHasPermission(permission: Permission | Permission[]) {
    this.checkPermission(permission);
  }

  @Input() set appHasRole(role: UserRole | UserRole[]) {
    this.checkRole(role);
  }

  @Input() appHasPermissionElse?: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Initial check will be done when inputs are set
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkPermission(permission: Permission | Permission[]): void {
    const permissions = Array.isArray(permission) ? permission : [permission];

    this.permissionService
      .hasAnyPermission(permissions)
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasPermission) => {
        this.updateView(hasPermission);
      });
  }

  private checkRole(role: UserRole | UserRole[]): void {
    const roles = Array.isArray(role) ? role : [role];

    this.permissionService
      .getCurrentUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        const hasRole = user ? roles.includes(user.role as UserRole) : false;
        this.updateView(hasRole);
      });
  }

  private updateView(show: boolean): void {
    if (show && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!show && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;

      // Show else template if available
      if (this.appHasPermissionElse) {
        this.viewContainer.createEmbeddedView(this.appHasPermissionElse);
      }
    }
  }
}

@Directive({
  selector: "[appHasRole]",
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() set appHasRole(role: UserRole | UserRole[]) {
    this.checkRole(role);
  }

  @Input() appHasRoleElse?: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    // Initial check will be done when input is set
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkRole(role: UserRole | UserRole[]): void {
    const roles = Array.isArray(role) ? role : [role];

    this.permissionService
      .getCurrentUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        const hasRole = user ? roles.includes(user.role as UserRole) : false;
        this.updateView(hasRole);
      });
  }

  private updateView(show: boolean): void {
    if (show && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!show && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;

      // Show else template if available
      if (this.appHasRoleElse) {
        this.viewContainer.createEmbeddedView(this.appHasRoleElse);
      }
    }
  }
}
