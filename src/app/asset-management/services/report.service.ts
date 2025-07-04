import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import {
  AssetReport,
  ReportType,
  ReportPeriod,
  Asset,
  MaintenanceRequest,
  PurchaseOrder,
  InventoryItem,
} from "../../shared/models/asset.interface";
import { AssetService } from "./asset.service";
import { MaintenanceService } from "./maintenance.service";
import { ProcurementService } from "./procurement.service";
import { InventoryService } from "./inventory.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private apiUrl = "/json-api/assetReports";

  constructor(
    private http: HttpClient,
    private assetService: AssetService,
    private maintenanceService: MaintenanceService,
    private procurementService: ProcurementService,
    private inventoryService: InventoryService,
  ) {}

  // Report CRUD Operations
  getReports(): Observable<AssetReport[]> {
    return this.http.get<AssetReport[]>(this.apiUrl);
  }

  getReport(id: string): Observable<AssetReport> {
    return this.http.get<AssetReport>(`${this.apiUrl}/${id}`);
  }

  saveReport(report: AssetReport): Observable<AssetReport> {
    return this.http.post<AssetReport>(this.apiUrl, report);
  }

  deleteReport(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Asset Inventory Report
  generateAssetInventoryReport(filters: {
    category?: string;
    department?: string;
    location?: string;
    condition?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Observable<AssetReport> {
    return this.assetService.getAssets().pipe(
      map((assets) => {
        let filteredAssets = assets;

        // Apply filters
        if (filters.category) {
          filteredAssets = filteredAssets.filter(
            (asset) => asset.category === filters.category,
          );
        }
        if (filters.department) {
          filteredAssets = filteredAssets.filter(
            (asset) => asset.department === filters.department,
          );
        }
        if (filters.location) {
          filteredAssets = filteredAssets.filter(
            (asset) => asset.location === filters.location,
          );
        }
        if (filters.condition) {
          filteredAssets = filteredAssets.filter(
            (asset) => asset.condition === filters.condition,
          );
        }
        if (filters.dateFrom) {
          filteredAssets = filteredAssets.filter(
            (asset) => new Date(asset.purchaseDate) >= filters.dateFrom!,
          );
        }
        if (filters.dateTo) {
          filteredAssets = filteredAssets.filter(
            (asset) => new Date(asset.purchaseDate) <= filters.dateTo!,
          );
        }

        const report: AssetReport = {
          id: this.generateId(),
          title: "Asset Inventory Report",
          type: ReportType.ASSET_INVENTORY,
          generatedBy: "System", // Should be current user
          generatedDate: new Date(),
          period: ReportPeriod.CUSTOM,
          filters,
          data: filteredAssets.map((asset) => ({
            assetTag: asset.assetTag,
            name: asset.name,
            category: asset.category,
            department: asset.department,
            location: asset.location,
            condition: asset.condition,
            status: asset.status,
            purchaseDate: asset.purchaseDate,
            purchasePrice: asset.purchasePrice,
            currentValue: asset.currentValue,
            depreciatedValue: this.assetService.calculateDepreciation(asset),
            assignedTo: asset.assignedTo,
            lastMaintenance: asset.lastMaintenanceDate,
            nextMaintenance: asset.nextMaintenanceDate,
            warrantyExpiry: asset.warrantyExpiry,
          })),
          summary: this.calculateAssetSummary(filteredAssets),
        };

        return report;
      }),
    );
  }

  // Maintenance History Report
  generateMaintenanceHistoryReport(filters: {
    assetId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    status?: string;
    type?: string;
  }): Observable<AssetReport> {
    return combineLatest([
      this.maintenanceService.getMaintenanceRequests(),
      this.assetService.getAssets(),
    ]).pipe(
      map(([maintenanceRequests, assets]) => {
        let filteredRequests = maintenanceRequests;

        // Apply filters
        if (filters.assetId) {
          filteredRequests = filteredRequests.filter(
            (req) => req.assetId === filters.assetId,
          );
        }
        if (filters.dateFrom) {
          filteredRequests = filteredRequests.filter(
            (req) => new Date(req.reportedDate) >= filters.dateFrom!,
          );
        }
        if (filters.dateTo) {
          filteredRequests = filteredRequests.filter(
            (req) => new Date(req.reportedDate) <= filters.dateTo!,
          );
        }
        if (filters.status) {
          filteredRequests = filteredRequests.filter(
            (req) => req.status === filters.status,
          );
        }
        if (filters.type) {
          filteredRequests = filteredRequests.filter(
            (req) => req.requestType === filters.type,
          );
        }

        const report: AssetReport = {
          id: this.generateId(),
          title: "Maintenance History Report",
          type: ReportType.MAINTENANCE_HISTORY,
          generatedBy: "System",
          generatedDate: new Date(),
          period: ReportPeriod.CUSTOM,
          filters,
          data: filteredRequests.map((req) => {
            const asset = assets.find((a) => a.id === req.assetId);
            return {
              assetTag: req.assetTag,
              assetName: req.assetName,
              assetCategory: asset?.category,
              assetDepartment: asset?.department,
              requestType: req.requestType,
              priority: req.priority,
              status: req.status,
              reportedDate: req.reportedDate,
              reportedBy: req.reportedBy,
              assignedTo: req.assignedTo,
              scheduledDate: req.scheduledDate,
              completedDate: req.completedDate,
              cost: req.cost,
              serviceProvider: req.serviceProvider,
              description: req.description,
              resolution: req.resolution,
              downtime: this.calculateDowntime(req),
            };
          }),
          summary: this.calculateMaintenanceSummary(filteredRequests),
        };

        return report;
      }),
    );
  }

  // Depreciation Report
  generateDepreciationReport(filters: {
    category?: string;
    department?: string;
    year?: number;
  }): Observable<AssetReport> {
    return this.assetService.getAssets().pipe(
      map((assets) => {
        let filteredAssets = assets;

        if (filters.category) {
          filteredAssets = filteredAssets.filter(
            (asset) => asset.category === filters.category,
          );
        }
        if (filters.department) {
          filteredAssets = filteredAssets.filter(
            (asset) => asset.department === filters.department,
          );
        }
        if (filters.year) {
          filteredAssets = filteredAssets.filter(
            (asset) =>
              new Date(asset.purchaseDate).getFullYear() === filters.year,
          );
        }

        const report: AssetReport = {
          id: this.generateId(),
          title: "Asset Depreciation Report",
          type: ReportType.DEPRECIATION,
          generatedBy: "System",
          generatedDate: new Date(),
          period: ReportPeriod.YEARLY,
          filters,
          data: filteredAssets.map((asset) => {
            const depreciatedValue =
              this.assetService.calculateDepreciation(asset);
            const depreciationAmount = asset.purchasePrice - depreciatedValue;
            const depreciationPercentage =
              (depreciationAmount / asset.purchasePrice) * 100;

            return {
              assetTag: asset.assetTag,
              name: asset.name,
              category: asset.category,
              department: asset.department,
              purchaseDate: asset.purchaseDate,
              purchasePrice: asset.purchasePrice,
              currentValue: asset.currentValue,
              depreciatedValue,
              depreciationAmount,
              depreciationPercentage,
              depreciationRate: asset.depreciationRate,
              ageInYears: this.calculateAssetAge(asset),
            };
          }),
          summary: this.calculateDepreciationSummary(filteredAssets),
        };

        return report;
      }),
    );
  }

  // Asset Utilization Report
  generateUtilizationReport(period: ReportPeriod): Observable<AssetReport> {
    return combineLatest([
      this.assetService.getAssets(),
      this.assetService.getAllocations(),
    ]).pipe(
      map(([assets, allocations]) => {
        const utilizationData = assets.map((asset) => {
          const assetAllocations = allocations.filter(
            (alloc) => alloc.assetId === asset.id,
          );

          const totalDays = this.getPeriodDays(period);
          const allocatedDays = this.calculateAllocatedDays(
            assetAllocations,
            period,
          );
          const utilizationRate = (allocatedDays / totalDays) * 100;

          return {
            assetTag: asset.assetTag,
            name: asset.name,
            category: asset.category,
            department: asset.department,
            status: asset.status,
            totalAllocations: assetAllocations.length,
            allocatedDays,
            totalDays,
            utilizationRate,
            currentlyAllocated: assetAllocations.some(
              (alloc) => !alloc.actualReturnDate,
            ),
          };
        });

        const report: AssetReport = {
          id: this.generateId(),
          title: "Asset Utilization Report",
          type: ReportType.UTILIZATION,
          generatedBy: "System",
          generatedDate: new Date(),
          period,
          filters: {},
          data: utilizationData,
          summary: this.calculateUtilizationSummary(utilizationData),
        };

        return report;
      }),
    );
  }

  // Cost Analysis Report
  generateCostAnalysisReport(filters: {
    dateFrom?: Date;
    dateTo?: Date;
    department?: string;
  }): Observable<AssetReport> {
    return combineLatest([
      this.maintenanceService.getMaintenanceRequests(),
      this.procurementService.getPurchaseOrders(),
      this.assetService.getAssets(),
    ]).pipe(
      map(([maintenanceRequests, purchaseOrders, assets]) => {
        const dateFrom =
          filters.dateFrom || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        const dateTo = filters.dateTo || new Date();

        // Filter maintenance costs
        const maintenanceCosts = maintenanceRequests
          .filter(
            (req) =>
              req.cost &&
              req.completedDate &&
              new Date(req.completedDate) >= dateFrom &&
              new Date(req.completedDate) <= dateTo,
          )
          .reduce((sum, req) => sum + (req.cost || 0), 0);

        // Filter procurement costs
        const procurementCosts = purchaseOrders
          .filter(
            (order) =>
              new Date(order.orderDate) >= dateFrom &&
              new Date(order.orderDate) <= dateTo,
          )
          .reduce((sum, order) => sum + order.totalAmount, 0);

        // Calculate depreciation costs
        const depreciationCosts = assets.reduce((sum, asset) => {
          if (filters.department && asset.department !== filters.department) {
            return sum;
          }
          const annualDepreciation =
            (asset.purchasePrice * asset.depreciationRate) / 100;
          return sum + annualDepreciation;
        }, 0);

        const costBreakdown = {
          maintenance: maintenanceCosts,
          procurement: procurementCosts,
          depreciation: depreciationCosts,
          total: maintenanceCosts + procurementCosts + depreciationCosts,
        };

        const report: AssetReport = {
          id: this.generateId(),
          title: "Cost Analysis Report",
          type: ReportType.COST_ANALYSIS,
          generatedBy: "System",
          generatedDate: new Date(),
          period: ReportPeriod.CUSTOM,
          filters,
          data: [costBreakdown],
          summary: {
            totalAssets: assets.length,
            totalValue: assets.reduce(
              (sum, asset) => sum + asset.currentValue,
              0,
            ),
            maintenanceCost: maintenanceCosts,
            utilizationRate: 0,
            byCategory: [],
            byDepartment: [],
          },
        };

        return report;
      }),
    );
  }

  // Export Reports
  exportToPDF(report: AssetReport): Observable<Blob> {
    // This would integrate with a PDF generation library
    const reportContent = this.formatReportForPDF(report);
    const blob = new Blob([reportContent], { type: "application/pdf" });
    return new Observable((observer) => {
      observer.next(blob);
      observer.complete();
    });
  }

  exportToExcel(report: AssetReport): Observable<Blob> {
    // This would integrate with an Excel generation library
    const reportContent = this.formatReportForExcel(report);
    const blob = new Blob([reportContent], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return new Observable((observer) => {
      observer.next(blob);
      observer.complete();
    });
  }

  exportToCSV(report: AssetReport): Observable<Blob> {
    const csvContent = this.formatReportForCSV(report);
    const blob = new Blob([csvContent], { type: "text/csv" });
    return new Observable((observer) => {
      observer.next(blob);
      observer.complete();
    });
  }

  // Scheduled Reports
  scheduleReport(
    reportConfig: {
      type: ReportType;
      filters: any;
      frequency: "daily" | "weekly" | "monthly";
      recipients: string[];
    },
    startDate: Date,
  ): Observable<any> {
    // This would integrate with a job scheduling system
    return new Observable((observer) => {
      observer.next({ success: true, scheduleId: this.generateId() });
      observer.complete();
    });
  }

  getScheduledReports(): Observable<any[]> {
    // Return scheduled reports
    return new Observable((observer) => {
      observer.next([]);
      observer.complete();
    });
  }

  // Helper Methods
  private calculateAssetSummary(assets: Asset[]): any {
    const totalAssets = assets.length;
    const totalValue = assets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0,
    );

    const byCategory = this.groupByField(assets, "category");
    const byDepartment = this.groupByField(assets, "department");

    return {
      totalAssets,
      totalValue,
      maintenanceCost: 0,
      utilizationRate: 0,
      byCategory,
      byDepartment,
    };
  }

  private calculateMaintenanceSummary(requests: MaintenanceRequest[]): any {
    const totalRequests = requests.length;
    const totalCost = requests.reduce((sum, req) => sum + (req.cost || 0), 0);
    const avgCost = totalRequests > 0 ? totalCost / totalRequests : 0;

    return {
      totalRequests,
      totalCost,
      avgCost,
      byType: this.groupByField(requests, "requestType"),
      byStatus: this.groupByField(requests, "status"),
    };
  }

  private calculateDepreciationSummary(assets: Asset[]): any {
    const totalPurchaseValue = assets.reduce(
      (sum, asset) => sum + asset.purchasePrice,
      0,
    );
    const totalCurrentValue = assets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0,
    );
    const totalDepreciation = totalPurchaseValue - totalCurrentValue;

    return {
      totalAssets: assets.length,
      totalPurchaseValue,
      totalCurrentValue,
      totalDepreciation,
      avgDepreciationRate:
        assets.reduce((sum, asset) => sum + asset.depreciationRate, 0) /
        assets.length,
    };
  }

  private calculateUtilizationSummary(utilizationData: any[]): any {
    const avgUtilization =
      utilizationData.reduce((sum, item) => sum + item.utilizationRate, 0) /
      utilizationData.length;

    const highUtilization = utilizationData.filter(
      (item) => item.utilizationRate > 80,
    ).length;
    const lowUtilization = utilizationData.filter(
      (item) => item.utilizationRate < 20,
    ).length;

    return {
      totalAssets: utilizationData.length,
      avgUtilization,
      highUtilization,
      lowUtilization,
    };
  }

  private groupByField(items: any[], field: string): any[] {
    const groups = new Map();
    items.forEach((item) => {
      const key = item[field];
      const group = groups.get(key) || { [field]: key, count: 0, items: [] };
      group.count++;
      group.items.push(item);
      groups.set(key, group);
    });
    return Array.from(groups.values());
  }

  private calculateDowntime(request: MaintenanceRequest): number {
    if (!request.completedDate || !request.reportedDate) return 0;
    const start = new Date(request.reportedDate);
    const end = new Date(request.completedDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculateAssetAge(asset: Asset): number {
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    return (
      (currentDate.getTime() - purchaseDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
    );
  }

  private getPeriodDays(period: ReportPeriod): number {
    switch (period) {
      case ReportPeriod.WEEKLY:
        return 7;
      case ReportPeriod.MONTHLY:
        return 30;
      case ReportPeriod.QUARTERLY:
        return 90;
      case ReportPeriod.YEARLY:
        return 365;
      default:
        return 30;
    }
  }

  private calculateAllocatedDays(
    allocations: any[],
    period: ReportPeriod,
  ): number {
    // Simplified calculation - would need more complex logic for real scenarios
    return allocations.length * 30; // Assume 30 days per allocation
  }

  private formatReportForPDF(report: AssetReport): string {
    return `PDF Report: ${report.title}\nGenerated: ${report.generatedDate}\n\nData: ${JSON.stringify(report.data, null, 2)}`;
  }

  private formatReportForExcel(report: AssetReport): string {
    return `Excel Report: ${report.title}`;
  }

  private formatReportForCSV(report: AssetReport): string {
    if (!report.data || report.data.length === 0) return "";

    const headers = Object.keys(report.data[0]);
    const csvHeaders = headers.join(",");
    const csvRows = report.data
      .map((row) => headers.map((header) => row[header] || "").join(","))
      .join("\n");

    return `${csvHeaders}\n${csvRows}`;
  }

  private generateId(): string {
    return "report_" + Math.random().toString(36).substring(2, 15);
  }
}
