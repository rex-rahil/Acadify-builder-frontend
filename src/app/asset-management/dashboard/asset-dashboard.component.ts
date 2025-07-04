import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MessageService } from "primeng/api";
import { AssetService } from "../services/asset.service";
import { MaintenanceService } from "../services/maintenance.service";
import { AlertService } from "../services/alert.service";

@Component({
  selector: "app-asset-dashboard",
  templateUrl: "./asset-dashboard.component.html",
  styleUrls: ["./asset-dashboard.component.scss"],
  providers: [MessageService],
})
export class AssetDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentTime = new Date();

  assetStats: any = {
    total: 25,
    totalValue: 150000,
    maintenanceDue: 3,
    warrantyExpiring: 2,
    activeAllocations: 18,
    allocationRate: 72,
  };

  assetCategories = {
    computer: 8,
    furniture: 12,
    equipment: 3,
    vehicle: 2,
  };

  maintenanceStats: any = {
    pending: 5,
    inProgress: 3,
    completed: 12,
    overdue: 1,
  };

  criticalAlerts: any[] = [
    {
      id: 1,
      assetName: "Dell OptiPlex 7090",
      message: "Scheduled maintenance is overdue",
      dueDate: new Date(Date.now() - 86400000), // Yesterday
      alertType: "MAINTENANCE_DUE",
      priority: "High",
    },
    {
      id: 2,
      assetName: "HP LaserJet Pro",
      message: "Warranty expires in 7 days",
      dueDate: new Date(Date.now() + 7 * 86400000), // 7 days from now
      alertType: "WARRANTY_EXPIRY",
      priority: "Medium",
    },
    {
      id: 3,
      assetName: "Office Chair Set",
      message: "Inspection required for safety compliance",
      dueDate: new Date(Date.now() + 3 * 86400000), // 3 days from now
      alertType: "INSPECTION_DUE",
      priority: "Medium",
    },
  ];

  recentActivities: any[] = [
    {
      id: 1,
      type: "allocation",
      title: "Asset Allocated",
      description: "Dell OptiPlex 7090 assigned to John Doe (IT Department)",
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      status: "Completed",
    },
    {
      id: 2,
      type: "maintenance",
      title: "Maintenance Completed",
      description: "Routine cleaning and inspection of HP LaserJet Pro",
      timestamp: new Date(Date.now() - 4 * 3600000), // 4 hours ago
      status: "Completed",
    },
    {
      id: 3,
      type: "acquisition",
      title: "New Asset Added",
      description: "MacBook Pro 16-inch added to inventory",
      timestamp: new Date(Date.now() - 6 * 3600000), // 6 hours ago
      status: "Pending Review",
    },
    {
      id: 4,
      type: "repair",
      title: "Repair Request",
      description: "Office chair hydraulic system needs replacement",
      timestamp: new Date(Date.now() - 8 * 3600000), // 8 hours ago
      status: "In Progress",
    },
  ];

  loading = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private assetService: AssetService,
    private maintenanceService: MaintenanceService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.startTimeUpdate();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTimeUpdate() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentTime = new Date();
      });
  }

  private loadDashboardData() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  navigateToAssets() {
    // Navigation logic will be implemented
  }

  navigateToMaintenance() {
    // Navigation logic will be implemented
  }

  navigateToAlerts() {
    // Navigation logic will be implemented
  }

  getAlertSeverityColor(alertType: string): string {
    switch (alertType) {
      case "MAINTENANCE_DUE":
        return "warning";
      case "WARRANTY_EXPIRY":
        return "info";
      case "LOW_STOCK":
        return "danger";
      case "OVERDUE_RETURN":
        return "danger";
      case "INSPECTION_DUE":
        return "warning";
      default:
        return "info";
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }
}
