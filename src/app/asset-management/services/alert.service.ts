import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import {
  MaintenanceAlert,
  AlertType,
  Asset,
  InventoryItem,
  AssetAllocation,
  AllocationStatus,
} from "../../shared/models/asset.interface";
import { AssetService } from "./asset.service";
import { InventoryService } from "./inventory.service";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  private apiUrl = "/json-api/maintenanceAlerts";
  private alertsSubject = new BehaviorSubject<MaintenanceAlert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private assetService: AssetService,
    private inventoryService: InventoryService,
  ) {
    this.generateSystemAlerts();
  }

  // Alert CRUD Operations
  getAlerts(): Observable<MaintenanceAlert[]> {
    return this.http.get<MaintenanceAlert[]>(this.apiUrl);
  }

  getAlert(id: string): Observable<MaintenanceAlert> {
    return this.http.get<MaintenanceAlert>(`${this.apiUrl}/${id}`);
  }

  createAlert(alert: Partial<MaintenanceAlert>): Observable<MaintenanceAlert> {
    const newAlert = {
      ...alert,
      id: this.generateId(),
      createdDate: new Date(),
      isRead: false,
      isResolved: false,
    };
    return this.http.post<MaintenanceAlert>(this.apiUrl, newAlert);
  }

  updateAlert(
    id: string,
    alert: Partial<MaintenanceAlert>,
  ): Observable<MaintenanceAlert> {
    return this.http.put<MaintenanceAlert>(`${this.apiUrl}/${id}`, alert);
  }

  deleteAlert(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Alert Management
  markAsRead(id: string): Observable<MaintenanceAlert> {
    return this.updateAlert(id, { isRead: true });
  }

  markAsResolved(id: string): Observable<MaintenanceAlert> {
    return this.updateAlert(id, {
      isResolved: true,
      resolvedDate: new Date(),
    });
  }

  assignAlert(id: string, assignedTo: string): Observable<MaintenanceAlert> {
    return this.updateAlert(id, { assignedTo });
  }

  // Active Alerts
  getActiveAlerts(): Observable<MaintenanceAlert[]> {
    return this.getAlerts().pipe(
      map((alerts) => alerts.filter((alert) => !alert.isResolved)),
    );
  }

  getUnreadAlerts(): Observable<MaintenanceAlert[]> {
    return this.getAlerts().pipe(
      map((alerts) =>
        alerts.filter((alert) => !alert.isRead && !alert.isResolved),
      ),
    );
  }

  getAlertsByType(alertType: AlertType): Observable<MaintenanceAlert[]> {
    return this.getAlerts().pipe(
      map((alerts) => alerts.filter((alert) => alert.alertType === alertType)),
    );
  }

  getAlertsByAsset(assetId: string): Observable<MaintenanceAlert[]> {
    return this.getAlerts().pipe(
      map((alerts) => alerts.filter((alert) => alert.assetId === assetId)),
    );
  }

  // System Alert Generation
  generateSystemAlerts(): void {
    combineLatest([
      this.assetService.getAssets(),
      this.inventoryService?.getInventoryItems() || [],
      this.assetService.getAllocations(),
    ]).subscribe(([assets, inventory, allocations]) => {
      this.generateMaintenanceDueAlerts(assets);
      this.generateWarrantyExpiryAlerts(assets);
      this.generateLowStockAlerts(inventory);
      this.generateOverdueReturnAlerts(allocations);
      this.generateInspectionDueAlerts(assets);
    });
  }

  private generateMaintenanceDueAlerts(assets: Asset[]): void {
    const today = new Date();
    const alertWindow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    assets.forEach((asset) => {
      if (
        asset.nextMaintenanceDate &&
        new Date(asset.nextMaintenanceDate) <= alertWindow
      ) {
        const alert: Partial<MaintenanceAlert> = {
          assetId: asset.id,
          assetName: asset.name,
          assetTag: asset.assetTag,
          alertType: AlertType.MAINTENANCE_DUE,
          message: `Maintenance is due for ${asset.name} (${asset.assetTag})`,
          dueDate: new Date(asset.nextMaintenanceDate),
        };

        this.createAlertIfNotExists(alert);
      }
    });
  }

  private generateWarrantyExpiryAlerts(assets: Asset[]): void {
    const today = new Date();
    const alertWindow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    assets.forEach((asset) => {
      if (
        asset.warrantyExpiry &&
        new Date(asset.warrantyExpiry) <= alertWindow &&
        new Date(asset.warrantyExpiry) >= today
      ) {
        const alert: Partial<MaintenanceAlert> = {
          assetId: asset.id,
          assetName: asset.name,
          assetTag: asset.assetTag,
          alertType: AlertType.WARRANTY_EXPIRY,
          message: `Warranty expires soon for ${asset.name} (${asset.assetTag})`,
          dueDate: new Date(asset.warrantyExpiry),
        };

        this.createAlertIfNotExists(alert);
      }
    });
  }

  private generateLowStockAlerts(inventory: InventoryItem[]): void {
    inventory.forEach((item) => {
      if (item.currentStock <= item.minimumStock) {
        const alert: Partial<MaintenanceAlert> = {
          assetId: item.id,
          assetName: item.name,
          assetTag: "INVENTORY",
          alertType: AlertType.LOW_STOCK,
          message: `Low stock alert: ${item.name} (${item.currentStock} remaining)`,
          dueDate: new Date(),
        };

        this.createAlertIfNotExists(alert);
      }
    });
  }

  private generateOverdueReturnAlerts(allocations: AssetAllocation[]): void {
    const today = new Date();

    allocations
      .filter(
        (allocation) =>
          allocation.status === AllocationStatus.ALLOCATED &&
          allocation.expectedReturnDate &&
          new Date(allocation.expectedReturnDate) < today,
      )
      .forEach((allocation) => {
        const alert: Partial<MaintenanceAlert> = {
          assetId: allocation.assetId,
          assetName: `Asset ${allocation.assetId}`,
          assetTag: "ALLOCATION",
          alertType: AlertType.OVERDUE_RETURN,
          message: `Overdue return: Asset should have been returned on ${allocation.expectedReturnDate}`,
          dueDate: new Date(allocation.expectedReturnDate!),
        };

        this.createAlertIfNotExists(alert);
      });
  }

  private generateInspectionDueAlerts(assets: Asset[]): void {
    const today = new Date();
    const alertWindow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

    assets.forEach((asset) => {
      const lastInspection = asset.lastMaintenanceDate
        ? new Date(asset.lastMaintenanceDate)
        : new Date(asset.purchaseDate);
      const nextInspection = new Date(
        lastInspection.getTime() + 180 * 24 * 60 * 60 * 1000,
      ); // 6 months

      if (nextInspection <= alertWindow) {
        const alert: Partial<MaintenanceAlert> = {
          assetId: asset.id,
          assetName: asset.name,
          assetTag: asset.assetTag,
          alertType: AlertType.INSPECTION_DUE,
          message: `Inspection is due for ${asset.name} (${asset.assetTag})`,
          dueDate: nextInspection,
        };

        this.createAlertIfNotExists(alert);
      }
    });
  }

  private createAlertIfNotExists(alert: Partial<MaintenanceAlert>): void {
    this.getAlerts()
      .pipe(
        map((alerts) =>
          alerts.find(
            (existingAlert) =>
              existingAlert.assetId === alert.assetId &&
              existingAlert.alertType === alert.alertType &&
              !existingAlert.isResolved,
          ),
        ),
      )
      .subscribe((existingAlert) => {
        if (!existingAlert) {
          this.createAlert(alert).subscribe();
        }
      });
  }

  // Alert Statistics
  getAlertStatistics(): Observable<any> {
    return this.getAlerts().pipe(
      map((alerts) => {
        const total = alerts.length;
        const active = alerts.filter((alert) => !alert.isResolved).length;
        const unread = alerts.filter(
          (alert) => !alert.isRead && !alert.isResolved,
        ).length;

        const byType = Object.values(AlertType).map((type) => ({
          type,
          count: alerts.filter(
            (alert) => alert.alertType === type && !alert.isResolved,
          ).length,
        }));

        const critical = alerts.filter(
          (alert) =>
            !alert.isResolved &&
            (alert.alertType === AlertType.LOW_STOCK ||
              alert.alertType === AlertType.OVERDUE_RETURN),
        ).length;

        return {
          total,
          active,
          unread,
          critical,
          byType,
        };
      }),
    );
  }

  // Bulk Operations
  markMultipleAsRead(alertIds: string[]): Observable<any> {
    const updates = alertIds.map((id) => this.markAsRead(id));
    return combineLatest(updates);
  }

  resolveMultipleAlerts(alertIds: string[]): Observable<any> {
    const updates = alertIds.map((id) => this.markAsResolved(id));
    return combineLatest(updates);
  }

  // Notification Settings
  private notificationSettings = {
    email: true,
    browser: true,
    sms: false,
  };

  getNotificationSettings(): any {
    return this.notificationSettings;
  }

  updateNotificationSettings(settings: any): void {
    this.notificationSettings = { ...this.notificationSettings, ...settings };
  }

  // Utility Methods
  private generateId(): string {
    return "alert_" + Math.random().toString(36).substring(2, 15);
  }

  formatAlertMessage(alert: MaintenanceAlert): string {
    const daysUntilDue = Math.ceil(
      (new Date(alert.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysUntilDue < 0) {
      return `${alert.message} (${Math.abs(daysUntilDue)} days overdue)`;
    } else if (daysUntilDue === 0) {
      return `${alert.message} (due today)`;
    } else {
      return `${alert.message} (due in ${daysUntilDue} days)`;
    }
  }

  getAlertPriority(alert: MaintenanceAlert): "low" | "medium" | "high" {
    const daysUntilDue = Math.ceil(
      (new Date(alert.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (
      daysUntilDue < 0 ||
      alert.alertType === AlertType.LOW_STOCK ||
      alert.alertType === AlertType.OVERDUE_RETURN
    ) {
      return "high";
    } else if (daysUntilDue <= 3) {
      return "medium";
    } else {
      return "low";
    }
  }
}
