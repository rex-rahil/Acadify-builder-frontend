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
import { AuthService, User } from "../../auth/services/auth.service";

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
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  menuSections: MenuSection[] = [
    {
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
    },
    {
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
    },
    {
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
        {
          label: "Admission Officer",
          icon: "pi pi-file-check",
          route: "/admission-officer",
        },
        {
          label: "Library Management",
          icon: "pi pi-database",
          route: "/library",
        },
      ],
    },
    {
      label: "Quick Actions",
      items: [
        {
          label: "Fee Payment",
          icon: "pi pi-credit-card",
          route: "/admission/payment",
        },
        {
          label: "Application Status",
          icon: "pi pi-info-circle",
          route: "/admission/status",
        },
      ],
    },
    {
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
    },
  ];

  constructor(public router: Router) {}

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
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

  logout() {
    // Implement logout logic
    console.log("Logout clicked");
    this.onHide();
  }
}
