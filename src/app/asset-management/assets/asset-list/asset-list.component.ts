import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MessageService, ConfirmationService } from "primeng/api";
import { AssetService } from "../../services/asset.service";
import {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetCondition,
} from "../../../shared/models/asset.interface";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrls: ["./asset-list.component.scss"],
})
export class AssetListComponent implements OnInit, OnDestroy {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  selectedAssets: Asset[] = [];

  loading = true;
  searchQuery = "";

  // Filter options
  categories = Object.values(AssetCategory);
  statuses = Object.values(AssetStatus);
  conditions = Object.values(AssetCondition);

  selectedCategory: AssetCategory | null = null;
  selectedStatus: AssetStatus | null = null;
  selectedCondition: AssetCondition | null = null;
  selectedDepartment: string | null = null;
  selectedLocation: string | null = null;

  departments: string[] = [];
  locations: string[] = [];

  // Pagination
  first = 0;
  rows = 10;

  private destroy$ = new Subject<void>();

  constructor(
    private assetService: AssetService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.loadAssets();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAssets() {
    this.loading = true;
    this.assetService
      .getAssets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assets) => {
          this.assets = assets;
          this.filteredAssets = [...assets];
          this.extractFilterOptions();
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to load assets",
          });
          this.loading = false;
        },
      });
  }

  private extractFilterOptions() {
    this.departments = [
      ...new Set(this.assets.map((asset) => asset.department)),
    ];
    this.locations = [...new Set(this.assets.map((asset) => asset.location))];
  }

  applyFilters() {
    this.filteredAssets = this.assets.filter((asset) => {
      // Search query filter
      if (
        this.searchQuery &&
        !this.matchesSearchQuery(asset, this.searchQuery)
      ) {
        return false;
      }

      // Category filter
      if (this.selectedCategory && asset.category !== this.selectedCategory) {
        return false;
      }

      // Status filter
      if (this.selectedStatus && asset.status !== this.selectedStatus) {
        return false;
      }

      // Condition filter
      if (
        this.selectedCondition &&
        asset.condition !== this.selectedCondition
      ) {
        return false;
      }

      // Department filter
      if (
        this.selectedDepartment &&
        asset.department !== this.selectedDepartment
      ) {
        return false;
      }

      // Location filter
      if (this.selectedLocation && asset.location !== this.selectedLocation) {
        return false;
      }

      return true;
    });

    this.first = 0; // Reset pagination
  }

  private matchesSearchQuery(asset: Asset, query: string): boolean {
    const searchText = query.toLowerCase();
    return (
      asset.name.toLowerCase().includes(searchText) ||
      asset.assetTag.toLowerCase().includes(searchText) ||
      asset.description.toLowerCase().includes(searchText) ||
      asset.brand.toLowerCase().includes(searchText) ||
      asset.model.toLowerCase().includes(searchText) ||
      (asset.serialNumber &&
        asset.serialNumber.toLowerCase().includes(searchText)) ||
      (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchText))
    );
  }

  clearFilters() {
    this.searchQuery = "";
    this.selectedCategory = null;
    this.selectedStatus = null;
    this.selectedCondition = null;
    this.selectedDepartment = null;
    this.selectedLocation = null;
    this.applyFilters();
  }

  onSearchInput() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  createAsset() {
    this.router.navigate(["/asset-management/assets/new"]);
  }

  editAsset(asset: Asset) {
    this.router.navigate([`/asset-management/assets/${asset.id}/edit`]);
  }

  viewAsset(asset: Asset) {
    this.router.navigate([`/asset-management/assets/${asset.id}`]);
  }

  deleteAsset(asset: Asset) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete asset "${asset.name}" (${asset.assetTag})?`,
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.assetService
          .deleteAsset(asset.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Asset deleted successfully",
              });
              this.loadAssets();
            },
            error: () => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete asset",
              });
            },
          });
      },
    });
  }

  deleteSelectedAssets() {
    if (this.selectedAssets.length === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select assets to delete",
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedAssets.length} selected asset(s)?`,
      header: "Confirm Bulk Deletion",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const deletePromises = this.selectedAssets.map((asset) =>
          this.assetService.deleteAsset(asset.id).toPromise(),
        );

        Promise.all(deletePromises)
          .then(() => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: `${this.selectedAssets.length} asset(s) deleted successfully`,
            });
            this.selectedAssets = [];
            this.loadAssets();
          })
          .catch(() => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete some assets",
            });
          });
      },
    });
  }

  createMaintenanceRequest(asset: Asset) {
    // Navigate to maintenance request form with asset pre-selected
    this.router.navigate(["/asset-management/maintenance"], {
      queryParams: { assetId: asset.id },
    });
  }

  getStatusSeverity(status: AssetStatus): string {
    switch (status) {
      case AssetStatus.ACTIVE:
        return "success";
      case AssetStatus.MAINTENANCE:
        return "warning";
      case AssetStatus.DISPOSED:
      case AssetStatus.LOST:
      case AssetStatus.STOLEN:
        return "danger";
      case AssetStatus.INACTIVE:
        return "secondary";
      default:
        return "info";
    }
  }

  getConditionSeverity(condition: AssetCondition): string {
    switch (condition) {
      case AssetCondition.EXCELLENT:
        return "success";
      case AssetCondition.GOOD:
        return "info";
      case AssetCondition.FAIR:
        return "warning";
      case AssetCondition.POOR:
      case AssetCondition.OUT_OF_ORDER:
        return "danger";
      default:
        return "secondary";
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  calculateDepreciation(asset: Asset): number {
    return this.assetService.calculateDepreciation(asset);
  }

  exportAssets() {
    // Export functionality would be implemented here
    this.messageService.add({
      severity: "info",
      summary: "Export",
      detail: "Export functionality to be implemented",
    });
  }

  importAssets() {
    // Import functionality would be implemented here
    this.messageService.add({
      severity: "info",
      summary: "Import",
      detail: "Import functionality to be implemented",
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onSelectionChange() {
    // Handle selection change if needed
  }

  refreshData() {
    this.loadAssets();
  }

  getMaintenanceStatus(asset: Asset): string {
    if (!asset.nextMaintenanceDate) return "";

    const nextMaintenance = new Date(asset.nextMaintenanceDate);
    const today = new Date();
    const daysUntilMaintenance = Math.ceil(
      (nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilMaintenance < 0) {
      return "Overdue";
    } else if (daysUntilMaintenance <= 7) {
      return "Due Soon";
    } else {
      return "Scheduled";
    }
  }

  getMaintenanceStatusSeverity(asset: Asset): string {
    const status = this.getMaintenanceStatus(asset);
    switch (status) {
      case "Overdue":
        return "danger";
      case "Due Soon":
        return "warning";
      case "Scheduled":
        return "success";
      default:
        return "info";
    }
  }
}
