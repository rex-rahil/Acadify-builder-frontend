import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { SidebarService } from "./shared/services/sidebar.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Oriental College of Pharmacy";
  private destroy$ = new Subject<void>();
  sidebarVisible = false;
  showHeaderAndSidebar = true;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    // Subscribe to sidebar visibility changes
    this.sidebarService.sidebarVisible$
      .pipe(takeUntil(this.destroy$))
      .subscribe((visible) => {
        this.sidebarVisible = visible;
      });

    // Monitor route changes to hide header/sidebar on login page
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateHeaderVisibility(event.url);
        }
      });

    // Set initial state
    this.updateHeaderVisibility(this.router.url);
  }

  private updateHeaderVisibility(url: string) {
    this.showHeaderAndSidebar = !url.includes("/login");
    console.log(
      "Route changed to:",
      url,
      "Show header:",
      this.showHeaderAndSidebar,
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
