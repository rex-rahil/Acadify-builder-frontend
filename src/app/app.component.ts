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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
