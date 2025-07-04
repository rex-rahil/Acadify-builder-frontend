import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { AuthService, User } from "../../../auth/services/auth.service";
import { PermissionService } from "../../../auth/services/permission.service";
import { UserRole, Permission } from "../../../auth/models/role.model";

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  command?: () => void;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
  animations: [
    trigger("slideInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        style({ transform: "translateX(-100%)" }),
        animate(400, style({ transform: "translateX(0)" })),
      ]),
      transition("* => void", [
        animate(400, style({ transform: "translateX(-100%)" })),
      ]),
    ]),
    trigger("fadeInOut", [
      state("in", style({ opacity: 1 })),
      transition("void => *", [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
      transition("* => void", [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  currentUser: User | null = null;
  menuSections: MenuSection[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    private authService: AuthService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        this.currentUser = user;
        this.loadMenuSections();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMenuSections(): void {
    if (!this.currentUser) {
      this.menuSections = [];
      return;
    }

    const userRole = this.currentUser.role as UserRole;
    this.menuSections = [];

    // Admin sections
    if (this.hasRole([UserRole.ADMIN])) {
      this.menuSections.push({
        label: "Administration",
        items: [
          {
            label: "Admin Dashboard",
            icon: "pi pi-shield",
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
          {
            label: "Subject Allocation",
            icon: "pi pi-sitemap",
            route: "/admin/subjects",
          },
        ],
      });
    }

    // Faculty sections
    if (this.hasRole([UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN])) {
      this.menuSections.push({
        label: "Faculty Portal",
        items: [
          {
            label: "Faculty Dashboard",
            icon: "pi pi-th-large",
            route: "/faculty",
          },
          {
            label: "My Courses",
            icon: "pi pi-book",
            route: "/faculty/courses",
          },
          {
            label: "Faculty Assignment",
            icon: "pi pi-users",
            route: "/faculty/assignment",
          },
          {
            label: "My Attendance",
            icon: "pi pi-clock",
            route: "/faculty/attendance",
          },
          {
            label: "Leave Management",
            icon: "pi pi-calendar-times",
            route: "/faculty/leaves",
          },
        ],
      });
    }

    // Student sections
    if (
      this.hasRole([
        UserRole.STUDENT,
        UserRole.FACULTY,
        UserRole.HOD,
        UserRole.ADMIN,
      ])
    ) {
      this.menuSections.push({
        label: "Student Portal",
        items: [
          {
            label: "Student Dashboard",
            icon: "pi pi-home",
            route: "/dashboard",
          },
          {
            label: "Timetable",
            icon: "pi pi-calendar",
            route: "/dashboard/timetable",
          },
          {
            label: "Attendance",
            icon: "pi pi-check-circle",
            route: "/dashboard/attendance",
          },
          {
            label: "Profile",
            icon: "pi pi-user",
            route: "/dashboard/profile",
          },
        ],
      });
    }

    // Admission Officer sections
    if (this.hasRole([UserRole.ADMISSION_OFFICER, UserRole.ADMIN])) {
      this.menuSections.push({
        label: "Admission Management",
        items: [
          {
            label: "Admission Dashboard",
            icon: "pi pi-file-check",
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

    // Library sections
    if (this.hasRole([UserRole.LIBRARIAN, UserRole.ADMIN])) {
      this.menuSections.push({
        label: "Library Management",
        items: [
          {
            label: "Library Dashboard",
            icon: "pi pi-database",
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

    // Asset Management sections
    if (this.hasRole([UserRole.ASSET_MANAGER, UserRole.ADMIN])) {
      this.menuSections.push({
        label: "Asset Management",
        items: [
          {
            label: "Asset Dashboard",
            icon: "pi pi-box",
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
          {
            label: "Procurement",
            icon: "pi pi-shopping-cart",
            route: "/asset-management/procurement",
          },
        ],
      });
    }

    // Account section (always visible for authenticated users)
    this.menuSections.push({
      label: "Account",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          route: "/settings",
        },
        {
          label: "Help & Support",
          icon: "pi pi-question-circle",
          route: "/help",
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => this.onLogout(),
        },
      ],
    });
  }

  onLogout() {
    this.authService.logout();
    this.onHide();
  }

  getUserRole(): string {
    if (this.currentUser) {
      return this.currentUser.role.toUpperCase();
    }
    return "EMPLOYEE";
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    // Always close sidebar after navigation on mobile
    this.onHide();
  }

  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.onHide();
  }

  getFilteredMenuSections() {
    return this.menuSections;
  }

  private hasRole(roles: UserRole[]): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role as UserRole);
  }

  private hasPermission(permission: Permission): boolean {
    if (!this.currentUser) return false;
    return this.permissionService
      .getCurrentUserPermissions()
      .includes(permission);
  }

  logout() {
    this.authService.logout();
    this.onHide();
  }
}
