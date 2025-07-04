import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import {
  Asset,
  AssetAllocation,
  AssetCategory,
  AssetCondition,
  AssetStatus,
  AllocationStatus,
} from "../../shared/models/asset.interface";

@Injectable({
  providedIn: "root",
})
export class AssetService {
  private apiUrl = "/json-api/assets";
  private allocationsUrl = "/json-api/assetAllocations";
  private assetsSubject = new BehaviorSubject<Asset[]>([]);
  public assets$ = this.assetsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAssets();
  }

  // Asset CRUD Operations
  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  getAsset(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/${id}`);
  }

  createAsset(asset: Partial<Asset>): Observable<Asset> {
    const newAsset = {
      ...asset,
      id: this.generateId(),
      assetTag: this.generateAssetTag(asset.category!),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.http.post<Asset>(this.apiUrl, newAsset);
  }

  updateAsset(id: string, asset: Partial<Asset>): Observable<Asset> {
    const updatedAsset = {
      ...asset,
      updatedAt: new Date(),
    };
    return this.http.put<Asset>(`${this.apiUrl}/${id}`, updatedAsset);
  }

  deleteAsset(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Asset Allocation
  getAllocations(): Observable<AssetAllocation[]> {
    return this.http.get<AssetAllocation[]>(this.allocationsUrl);
  }

  allocateAsset(
    allocation: Partial<AssetAllocation>,
  ): Observable<AssetAllocation> {
    const newAllocation = {
      ...allocation,
      id: this.generateId(),
      allocationDate: new Date(),
      status: AllocationStatus.ALLOCATED,
    };
    return this.http.post<AssetAllocation>(this.allocationsUrl, newAllocation);
  }

  returnAsset(
    allocationId: string,
    condition: AssetCondition,
    notes?: string,
  ): Observable<AssetAllocation> {
    return this.http.patch<AssetAllocation>(
      `${this.allocationsUrl}/${allocationId}`,
      {
        actualReturnDate: new Date(),
        status: AllocationStatus.RETURNED,
        condition,
        notes,
      },
    );
  }

  // Search and Filter
  searchAssets(query: string): Observable<Asset[]> {
    return this.getAssets().pipe(
      map((assets) =>
        assets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(query.toLowerCase()) ||
            asset.assetTag.toLowerCase().includes(query.toLowerCase()) ||
            asset.description.toLowerCase().includes(query.toLowerCase()) ||
            asset.serialNumber?.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }

  filterAssets(filters: {
    category?: AssetCategory;
    status?: AssetStatus;
    condition?: AssetCondition;
    department?: string;
    location?: string;
  }): Observable<Asset[]> {
    return this.getAssets().pipe(
      map((assets) =>
        assets.filter((asset) => {
          if (filters.category && asset.category !== filters.category)
            return false;
          if (filters.status && asset.status !== filters.status) return false;
          if (filters.condition && asset.condition !== filters.condition)
            return false;
          if (filters.department && asset.department !== filters.department)
            return false;
          if (filters.location && asset.location !== filters.location)
            return false;
          return true;
        }),
      ),
    );
  }

  // Statistics
  getAssetStatistics(): Observable<any> {
    return this.getAssets().pipe(
      map((assets) => {
        const total = assets.length;
        const totalValue = assets.reduce(
          (sum, asset) => sum + asset.currentValue,
          0,
        );

        const byCategory = Object.values(AssetCategory).map((category) => ({
          category,
          count: assets.filter((asset) => asset.category === category).length,
          value: assets
            .filter((asset) => asset.category === category)
            .reduce((sum, asset) => sum + asset.currentValue, 0),
        }));

        const byStatus = Object.values(AssetStatus).map((status) => ({
          status,
          count: assets.filter((asset) => asset.status === status).length,
        }));

        const byCondition = Object.values(AssetCondition).map((condition) => ({
          condition,
          count: assets.filter((asset) => asset.condition === condition).length,
        }));

        const maintenanceDue = assets.filter(
          (asset) =>
            asset.nextMaintenanceDate &&
            new Date(asset.nextMaintenanceDate) <= new Date(),
        ).length;

        const warrantyExpiring = assets.filter(
          (asset) =>
            asset.warrantyExpiry &&
            new Date(asset.warrantyExpiry) <=
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ).length;

        return {
          total,
          totalValue,
          byCategory,
          byStatus,
          byCondition,
          maintenanceDue,
          warrantyExpiring,
        };
      }),
    );
  }

  // Depreciation Calculation
  calculateDepreciation(asset: Asset): number {
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    const yearsOwned =
      (currentDate.getTime() - purchaseDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365.25);
    const depreciatedValue =
      asset.purchasePrice *
      Math.pow(1 - asset.depreciationRate / 100, yearsOwned);
    return Math.max(0, depreciatedValue);
  }

  // Utility Methods
  private loadAssets(): void {
    this.getAssets().subscribe((assets) => {
      this.assetsSubject.next(assets);
    });
  }

  private generateId(): string {
    return "asset_" + Math.random().toString(36).substring(2, 15);
  }

  private generateAssetTag(category: AssetCategory): string {
    const categoryCode = category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${categoryCode}${timestamp}`;
  }

  // Asset Validation
  validateAssetTag(assetTag: string, excludeId?: string): Observable<boolean> {
    return this.getAssets().pipe(
      map((assets) => {
        const existingAsset = assets.find(
          (asset) => asset.assetTag === assetTag && asset.id !== excludeId,
        );
        return !existingAsset;
      }),
    );
  }

  validateSerialNumber(
    serialNumber: string,
    excludeId?: string,
  ): Observable<boolean> {
    return this.getAssets().pipe(
      map((assets) => {
        const existingAsset = assets.find(
          (asset) =>
            asset.serialNumber === serialNumber && asset.id !== excludeId,
        );
        return !existingAsset;
      }),
    );
  }
}
