import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AssetService } from "../services/asset.service";
import { MaintenanceService } from "../services/maintenance.service";
import { AlertService } from "../services/alert.service";

@Component({
  selector: "app-asset-dashboard",
  templateUrl: "./asset-dashboard.component.html",
  styleUrls: ["./asset-dashboard.component.scss"],
})
export class AssetDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  assetStats: any = {
    total: 25,
    totalValue: 150000,
    maintenanceDue: 3,
    warrantyExpiring: 2,
  };
  maintenanceStats: any = {
    pending: 5,
    inProgress: 3,
    completed: 12,
    overdue: 1,
  };
  alerts: any[] = [
    {
      assetName: "Dell OptiPlex 7090",
      message: "Maintenance due",
      dueDate: new Date(),
      alertType: "MAINTENANCE_DUE",
    },
  ];
  loading = false;

  constructor(
    private assetService: AssetService,
    private maintenanceService: MaintenanceService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    // Simplified for now - using mock data
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChartData() {
    // Asset by Category Chart
    this.chartData.assetsByCategory = {
      labels: this.assetStats.byCategory?.map((cat: any) => cat.category) || [],
      datasets: [
        {
          data: this.assetStats.byCategory?.map((cat: any) => cat.count) || [],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#C9CBCF",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#C9CBCF",
          ],
        },
      ],
    };

    // Asset by Status Chart
    this.chartData.assetsByStatus = {
      labels:
        this.assetStats.byStatus?.map((status: any) => status.status) || [],
      datasets: [
        {
          data:
            this.assetStats.byStatus?.map((status: any) => status.count) || [],
          backgroundColor: [
            "#36A2EB",
            "#4BC0C0",
            "#FFCE56",
            "#FF6384",
            "#9966FF",
          ],
        },
      ],
    };

    // Maintenance by Priority Chart
    this.chartData.maintenanceByPriority = {
      labels:
        this.maintenanceStats.byPriority?.map((p: any) => p.priority) || [],
      datasets: [
        {
          data:
            this.maintenanceStats.byPriority?.map((p: any) => p.count) || [],
          backgroundColor: ["#4BC0C0", "#FFCE56", "#FF9F40", "#FF6384"],
        },
      ],
    };
  }

  private initializeCharts() {
    this.chartOptions = {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
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
