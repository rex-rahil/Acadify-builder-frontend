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

  // Navigation Methods
  navigateToAssets() {
    this.router.navigate(["/asset-management/assets"]);
  }

  navigateToMaintenance() {
    this.router.navigate(["/asset-management/maintenance"]);
  }

  navigateToAlerts() {
    this.router.navigate(["/asset-management/alerts"]);
  }

  // Quick Action Methods
  quickScan() {
    this.messageService.add({
      severity: "info",
      summary: "QR Scanner",
      detail: "QR Code scanner activated. Point camera at asset QR code.",
      life: 3000,
    });
  }

  refreshData() {
    this.loading = true;
    this.loadDashboardData();
    this.messageService.add({
      severity: "success",
      summary: "Data Refreshed",
      detail: "Dashboard data has been updated successfully.",
      life: 2000,
    });
  }

  addNewAsset() {
    this.router.navigate(["/asset-management/assets/new"]);
  }

  createMaintenanceRequest() {
    this.messageService.add({
      severity: "info",
      summary: "Maintenance Request",
      detail: "Opening maintenance request form...",
      life: 2000,
    });
    this.router.navigate(["/asset-management/maintenance/new"]);
  }

  trackAsset() {
    this.messageService.add({
      severity: "info",
      summary: "Asset Tracking",
      detail: "Opening real-time asset tracking system...",
      life: 2000,
    });
  }

  generateReport() {
    this.messageService.add({
      severity: "info",
      summary: "Report Generation",
      detail: "Generating comprehensive asset report...",
      life: 3000,
    });
  }

  exportData() {
    this.messageService.add({
      severity: "success",
      summary: "Export Started",
      detail:
        "Asset data export has been initiated. Download will start shortly.",
      life: 3000,
    });
  }

  openMaintenanceScheduler() {
    this.messageService.add({
      severity: "info",
      summary: "Maintenance Scheduler",
      detail: "Opening maintenance scheduling interface...",
      life: 2000,
    });
  }

  // Filter and View Methods
  filterByCategory(category: string) {
    this.messageService.add({
      severity: "info",
      summary: "Filter Applied",
      detail: `Showing assets in category: ${category}`,
      life: 2000,
    });
    this.router.navigate(["/asset-management/assets"], {
      queryParams: { category: category.toLowerCase() },
    });
  }

  viewAlertDetails(alert: any) {
    this.messageService.add({
      severity: "info",
      summary: "Alert Details",
      detail: `Viewing details for: ${alert.assetName}`,
      life: 2000,
    });
  }

  // UI Helper Methods
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

  getAlertCardClass(alertType: string): string {
    switch (alertType) {
      case "MAINTENANCE_DUE":
        return "bg-yellow-50 border-yellow-400";
      case "WARRANTY_EXPIRY":
        return "bg-blue-50 border-blue-400";
      case "INSPECTION_DUE":
        return "bg-orange-50 border-orange-400";
      case "LOW_STOCK":
        return "bg-red-50 border-red-400";
      default:
        return "bg-gray-50 border-gray-400";
    }
  }

  getAlertIcon(alertType: string): string {
    switch (alertType) {
      case "MAINTENANCE_DUE":
        return "pi pi-wrench text-yellow-600";
      case "WARRANTY_EXPIRY":
        return "pi pi-shield text-blue-600";
      case "INSPECTION_DUE":
        return "pi pi-search text-orange-600";
      case "LOW_STOCK":
        return "pi pi-exclamation-triangle text-red-600";
      default:
        return "pi pi-info-circle text-gray-600";
    }
  }

  getAlertPriority(alertType: string): string {
    switch (alertType) {
      case "MAINTENANCE_DUE":
        return "High";
      case "WARRANTY_EXPIRY":
        return "Medium";
      case "INSPECTION_DUE":
        return "Medium";
      case "LOW_STOCK":
        return "High";
      default:
        return "Low";
    }
  }

  getAlertPriorityClass(alertType: string): string {
    const priority = this.getAlertPriority(alertType);
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case "allocation":
        return "pi pi-users";
      case "maintenance":
        return "pi pi-wrench";
      case "acquisition":
        return "pi pi-plus";
      case "repair":
        return "pi pi-cog";
      default:
        return "pi pi-info-circle";
    }
  }

  getActivityIconClass(type: string): string {
    switch (type) {
      case "allocation":
        return "bg-blue-500";
      case "maintenance":
        return "bg-yellow-500";
      case "acquisition":
        return "bg-green-500";
      case "repair":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  getActivityStatusClass(status: string): string {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Pending Review":
        return "bg-blue-100 text-blue-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
