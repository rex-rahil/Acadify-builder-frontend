import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { SidebarService } from "../../services/sidebar.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showMenuButton = true;
  currentRoute = "";

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Monitor route changes to hide menu button on admission status page
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
          this.updateMenuButtonVisibility();
        }
      });

    // Set initial state
    this.currentRoute = this.router.url;
    this.updateMenuButtonVisibility();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateMenuButtonVisibility() {
    // Hide menu button on admission status page and new admission form (for unadmitted students)
    const hideMenuRoutes = ["/admission/status", "/admission"];
    const shouldHideMenu = hideMenuRoutes.some((route) =>
      this.currentRoute.startsWith(route),
    );

    this.showMenuButton = !shouldHideMenu;
    this.sidebarService.setSidebarEnabled(this.showMenuButton);
  }

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
    };

    // Find the most specific matching route
    const matchingRoute = Object.keys(routeTitles)
      .sort((a, b) => b.length - a.length) // Sort by length descending for most specific match
      .find((route) => this.currentRoute.startsWith(route));

    return matchingRoute ? routeTitles[matchingRoute] : "Oriental College";
  }
}
