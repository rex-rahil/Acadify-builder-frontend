import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import {
  MaintenanceRequest,
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from "../../shared/models/asset.interface";

@Injectable({
  providedIn: "root",
})
export class MaintenanceService {
  private apiUrl = "/json-api/maintenanceRequests";
  private maintenanceSubject = new BehaviorSubject<MaintenanceRequest[]>([]);
  public maintenance$ = this.maintenanceSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMaintenanceRequests();
  }

  // Maintenance Request CRUD Operations
  getMaintenanceRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl);
  }

  getMaintenanceRequest(id: string): Observable<MaintenanceRequest> {
    return this.http.get<MaintenanceRequest>(`${this.apiUrl}/${id}`);
  }

  createMaintenanceRequest(
    request: Partial<MaintenanceRequest>,
  ): Observable<MaintenanceRequest> {
    const newRequest = {
      ...request,
      id: this.generateId(),
      reportedDate: new Date(),
      status: MaintenanceStatus.PENDING,
    };
    return this.http.post<MaintenanceRequest>(this.apiUrl, newRequest);
  }

  updateMaintenanceRequest(
    id: string,
    request: Partial<MaintenanceRequest>,
  ): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.apiUrl}/${id}`, request);
  }

  deleteMaintenanceRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Status Management
  assignMaintenance(
    id: string,
    assignedTo: string,
    scheduledDate?: Date,
  ): Observable<MaintenanceRequest> {
    return this.updateMaintenanceRequest(id, {
      assignedTo,
      scheduledDate,
      status: MaintenanceStatus.IN_PROGRESS,
    });
  }

  startMaintenance(id: string): Observable<MaintenanceRequest> {
    return this.updateMaintenanceRequest(id, {
      status: MaintenanceStatus.IN_PROGRESS,
    });
  }

  completeMaintenance(
    id: string,
    cost: number,
    serviceProvider?: string,
    resolution?: string,
    notes?: string,
  ): Observable<MaintenanceRequest> {
    return this.updateMaintenanceRequest(id, {
      status: MaintenanceStatus.COMPLETED,
      completedDate: new Date(),
      cost,
      serviceProvider,
      resolution,
      notes,
    });
  }

  cancelMaintenance(
    id: string,
    reason: string,
  ): Observable<MaintenanceRequest> {
    return this.updateMaintenanceRequest(id, {
      status: MaintenanceStatus.CANCELLED,
      notes: reason,
    });
  }

  holdMaintenance(id: string, reason: string): Observable<MaintenanceRequest> {
    return this.updateMaintenanceRequest(id, {
      status: MaintenanceStatus.ON_HOLD,
      notes: reason,
    });
  }

  // Search and Filter
  filterMaintenanceRequests(filters: {
    status?: MaintenanceStatus;
    priority?: MaintenancePriority;
    type?: MaintenanceType;
    assetId?: string;
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Observable<MaintenanceRequest[]> {
    return this.getMaintenanceRequests().pipe(
      map((requests) =>
        requests.filter((request) => {
          if (filters.status && request.status !== filters.status) return false;
          if (filters.priority && request.priority !== filters.priority)
            return false;
          if (filters.type && request.requestType !== filters.type)
            return false;
          if (filters.assetId && request.assetId !== filters.assetId)
            return false;
          if (filters.assignedTo && request.assignedTo !== filters.assignedTo)
            return false;
          if (
            filters.dateFrom &&
            new Date(request.reportedDate) < filters.dateFrom
          )
            return false;
          if (filters.dateTo && new Date(request.reportedDate) > filters.dateTo)
            return false;
          return true;
        }),
      ),
    );
  }

  // Statistics
  getMaintenanceStatistics(): Observable<any> {
    return this.getMaintenanceRequests().pipe(
      map((requests) => {
        const total = requests.length;
        const pending = requests.filter(
          (req) => req.status === MaintenanceStatus.PENDING,
        ).length;
        const inProgress = requests.filter(
          (req) => req.status === MaintenanceStatus.IN_PROGRESS,
        ).length;
        const completed = requests.filter(
          (req) => req.status === MaintenanceStatus.COMPLETED,
        ).length;
        const overdue = requests.filter(
          (req) =>
            req.scheduledDate &&
            new Date(req.scheduledDate) < new Date() &&
            req.status !== MaintenanceStatus.COMPLETED,
        ).length;

        const totalCost = requests
          .filter((req) => req.cost)
          .reduce((sum, req) => sum + (req.cost || 0), 0);

        const byPriority = Object.values(MaintenancePriority).map(
          (priority) => ({
            priority,
            count: requests.filter((req) => req.priority === priority).length,
          }),
        );

        const byType = Object.values(MaintenanceType).map((type) => ({
          type,
          count: requests.filter((req) => req.requestType === type).length,
        }));

        const avgCompletionTime = this.calculateAverageCompletionTime(requests);

        return {
          total,
          pending,
          inProgress,
          completed,
          overdue,
          totalCost,
          byPriority,
          byType,
          avgCompletionTime,
        };
      }),
    );
  }

  // Asset Maintenance History
  getAssetMaintenanceHistory(
    assetId: string,
  ): Observable<MaintenanceRequest[]> {
    return this.getMaintenanceRequests().pipe(
      map((requests) =>
        requests
          .filter((req) => req.assetId === assetId)
          .sort(
            (a, b) =>
              new Date(b.reportedDate).getTime() -
              new Date(a.reportedDate).getTime(),
          ),
      ),
    );
  }

  // Scheduling
  getScheduledMaintenances(
    dateFrom: Date,
    dateTo: Date,
  ): Observable<MaintenanceRequest[]> {
    return this.getMaintenanceRequests().pipe(
      map((requests) =>
        requests.filter(
          (req) =>
            req.scheduledDate &&
            new Date(req.scheduledDate) >= dateFrom &&
            new Date(req.scheduledDate) <= dateTo,
        ),
      ),
    );
  }

  // Cost Analysis
  getMaintenanceCostByAsset(): Observable<any[]> {
    return this.getMaintenanceRequests().pipe(
      map((requests) => {
        const costByAsset = new Map<string, number>();
        requests
          .filter(
            (req) => req.cost && req.status === MaintenanceStatus.COMPLETED,
          )
          .forEach((req) => {
            const currentCost = costByAsset.get(req.assetId) || 0;
            costByAsset.set(req.assetId, currentCost + (req.cost || 0));
          });

        return Array.from(costByAsset.entries()).map(([assetId, cost]) => ({
          assetId,
          cost,
        }));
      }),
    );
  }

  getMaintenanceCostByPeriod(
    period: "month" | "quarter" | "year",
  ): Observable<any[]> {
    return this.getMaintenanceRequests().pipe(
      map((requests) => {
        const costByPeriod = new Map<string, number>();

        requests
          .filter((req) => req.cost && req.completedDate)
          .forEach((req) => {
            const date = new Date(req.completedDate!);
            let periodKey: string;

            switch (period) {
              case "month":
                periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                break;
              case "quarter":
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                periodKey = `${date.getFullYear()}-Q${quarter}`;
                break;
              case "year":
                periodKey = date.getFullYear().toString();
                break;
            }

            const currentCost = costByPeriod.get(periodKey) || 0;
            costByPeriod.set(periodKey, currentCost + (req.cost || 0));
          });

        return Array.from(costByPeriod.entries())
          .map(([period, cost]) => ({ period, cost }))
          .sort((a, b) => a.period.localeCompare(b.period));
      }),
    );
  }

  // Utility Methods
  private loadMaintenanceRequests(): void {
    this.getMaintenanceRequests().subscribe((requests) => {
      this.maintenanceSubject.next(requests);
    });
  }

  private generateId(): string {
    return "maint_" + Math.random().toString(36).substring(2, 15);
  }

  private calculateAverageCompletionTime(
    requests: MaintenanceRequest[],
  ): number {
    const completedRequests = requests.filter(
      (req) =>
        req.status === MaintenanceStatus.COMPLETED &&
        req.completedDate &&
        req.reportedDate,
    );

    if (completedRequests.length === 0) return 0;

    const totalDays = completedRequests.reduce((sum, req) => {
      const reported = new Date(req.reportedDate);
      const completed = new Date(req.completedDate!);
      const days = Math.ceil(
        (completed.getTime() - reported.getTime()) / (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);

    return Math.round(totalDays / completedRequests.length);
  }

  // Preventive Maintenance Scheduling
  schedulePreventiveMaintenance(
    assetId: string,
    assetName: string,
    assetTag: string,
    intervalDays: number,
    assignedTo?: string,
  ): Observable<MaintenanceRequest> {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + intervalDays);

    const request: Partial<MaintenanceRequest> = {
      assetId,
      assetName,
      assetTag,
      requestType: MaintenanceType.PREVENTIVE,
      priority: MaintenancePriority.MEDIUM,
      description: `Scheduled preventive maintenance for ${assetName}`,
      reportedBy: "System",
      assignedTo,
      scheduledDate,
      status: MaintenanceStatus.PENDING,
    };

    return this.createMaintenanceRequest(request);
  }
}
