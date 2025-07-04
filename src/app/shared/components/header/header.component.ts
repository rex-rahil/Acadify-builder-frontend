import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { SidebarService } from "../../services/sidebar.service";

interface Breadcrumb {
  label: string;
  url?: string;
}

interface SearchCategory {
  title: string;
  items: SearchItem[];
}

interface SearchItem {
  title: string;
  description: string;
  url: string;
  icon: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("searchInput") searchInput!: ElementRef;

  private destroy$ = new Subject<void>();
  showMenuButton = true;
  currentRoute = "";

  // UI State
  showUserMenu = false;
  showSearch = false;
  showNotifications = false;
  isLoading = false;

  // User Data
  currentUser: any = null; // This would come from auth service
  notificationCount = 3; // Mock data

  // Search
  searchQuery = "";
  searchResults: SearchCategory[] = [];

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
  ) {
    // Mock user data - replace with actual auth service
    this.currentUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@college.edu",
      role: "Student",
      employeeId: "STU2024001",
    };
  }

  ngOnInit() {
    // Monitor route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
          this.updateMenuButtonVisibility();
          this.closeAllMenus();
        }
      });

    // Set initial state
    this.currentRoute = this.router.url;
    this.updateMenuButtonVisibility();

    // Close menus on outside click
    document.addEventListener("click", this.closeAllMenus.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener("click", this.closeAllMenus.bind(this));
  }

  private updateMenuButtonVisibility() {
    // Hide menu button on admission status page and new admission form
    const hideMenuRoutes = ["/admission/status", "/admission"];
    const shouldHideMenu = hideMenuRoutes.some((route) =>
      this.currentRoute.startsWith(route),
    );

    this.showMenuButton = !shouldHideMenu;
    this.sidebarService.setSidebarEnabled(this.showMenuButton);
  }

  // Navigation Methods
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  getPageTitle(): string {
    const routeTitles: { [key: string]: string } = {
      "/dashboard": "Student Dashboard",
      "/faculty": "Faculty Dashboard",
      "/faculty/courses": "Course Management",
      "/faculty/assignment": "Faculty Assignment",
      "/faculty/attendance": "Faculty Attendance",
      "/faculty/leaves": "Leave Management",
      "/admission-officer": "Admission Officer",
      "/admission-officer/review": "Application Review",
      "/admission-officer/payment": "Payment Management",
      "/library": "Library Management",
      "/admission": "Admission Application",
      "/admission/payment": "Fee Payment",
      "/admission/status": "Application Status",
      "/admin": "Admin Dashboard",
      "/admin/users": "User Management",
      "/admin/courses": "Course Management",
    };

    // Find the most specific matching route
    const matchingRoute = Object.keys(routeTitles)
      .sort((a, b) => b.length - a.length)
      .find((route) => this.currentRoute.startsWith(route));

    return matchingRoute ? routeTitles[matchingRoute] : "Oriental College";
  }

  getBreadcrumbs(): Breadcrumb[] {
    const path = this.currentRoute;
    const segments = path.split("/").filter((segment) => segment);

    if (segments.length <= 1) return [];

    const breadcrumbs: Breadcrumb[] = [{ label: "Home", url: "/" }];

    let currentPath = "";

    const segmentLabels: { [key: string]: string } = {
      dashboard: "Dashboard",
      faculty: "Faculty",
      courses: "Courses",
      assignment: "Assignment",
      attendance: "Attendance",
      leaves: "Leave Management",
      admission: "Admission",
      "admission-officer": "Admission Officer",
      library: "Library",
      admin: "Administration",
      users: "Users",
      review: "Review",
      payment: "Payment",
      status: "Status",
    };

    segments.forEach((segment, index) => {
      currentPath += "/" + segment;
      const label = segmentLabels[segment] || segment;
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        label,
        url: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  }

  // User Methods
  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return "User";
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`;
    }
    return "U";
  }

  getUserRole(): string {
    return this.currentUser?.role || "User";
  }

  getUserEmail(): string {
    return this.currentUser?.email || "user@college.edu";
  }

  // UI Actions
  openSearch() {
    this.showSearch = true;
    this.closeOtherMenus("search");
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 100);
  }

  closeSearch() {
    this.showSearch = false;
    this.searchQuery = "";
    this.searchResults = [];
  }

  openUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.closeOtherMenus("user");
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  openNotifications() {
    this.showNotifications = !this.showNotifications;
    this.closeOtherMenus("notifications");
  }

  openQuickSettings() {
    // Implement quick settings modal
    console.log("Opening quick settings...");
  }

  private closeOtherMenus(except?: string) {
    if (except !== "user") this.showUserMenu = false;
    if (except !== "search") this.showSearch = false;
    if (except !== "notifications") this.showNotifications = false;
  }

  private closeAllMenus() {
    this.showUserMenu = false;
    this.showSearch = false;
    this.showNotifications = false;
  }

  // Search Methods
  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    // Mock search results - replace with actual search service
    this.searchResults = [
      {
        title: "Books",
        items: [
          {
            title: "Pharmacology Handbook",
            description: "Available in Library",
            url: "/library",
            icon: "pi pi-book",
          },
          {
            title: "Organic Chemistry",
            description: "2 copies available",
            url: "/library",
            icon: "pi pi-book",
          },
        ],
      },
      {
        title: "Quick Actions",
        items: [
          {
            title: "View Dashboard",
            description: "Go to main dashboard",
            url: "/dashboard",
            icon: "pi pi-home",
          },
          {
            title: "Library Management",
            description: "Manage books and resources",
            url: "/library",
            icon: "pi pi-database",
          },
        ],
      },
    ];
  }

  clearSearch() {
    this.searchQuery = "";
    this.searchResults = [];
  }

  // Navigation Actions
  navigateToProfile() {
    this.router.navigate(["/profile"]);
    this.closeUserMenu();
  }

  navigateToSettings() {
    this.router.navigate(["/settings"]);
    this.closeUserMenu();
  }

  navigateToHelp() {
    this.router.navigate(["/help"]);
    this.closeUserMenu();
  }

  logout() {
    // Implement logout logic
    console.log("Logging out...");
    this.router.navigate(["/login"]);
    this.closeUserMenu();
  }
}
