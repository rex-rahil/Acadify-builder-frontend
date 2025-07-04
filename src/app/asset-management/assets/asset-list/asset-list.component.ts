import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MessageService, ConfirmationService } from "primeng/api";
import { AssetService } from "../../services/asset.service";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrls: ["./asset-list.component.scss"],
})
export class AssetListComponent implements OnInit, OnDestroy {
  assets: any[] = [];
  filteredAssets: any[] = [];
  selectedAssets: any[] = [];

  loading = true;
  searchQuery = "";

  // Missing properties for template
  totalAssets = 0;
  currentView = "table";
  viewOptions = [
    { label: "Table View", value: "table" },
    { label: "Grid View", value: "grid" },
    { label: "Card View", value: "card" },
  ];

  // Filter options
  categories = [
    { label: "All Categories", value: null },
    { label: "Computer", value: "Computer" },
    { label: "Furniture", value: "Furniture" },
    { label: "Equipment", value: "Equipment" },
    { label: "Vehicle", value: "Vehicle" },
  ];

  statuses = [
    { label: "All Statuses", value: null },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Disposed", value: "Disposed" },
  ];

  conditions = [
    { label: "All Conditions", value: null },
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Poor", value: "Poor" },
  ];

  selectedCategory: string | null = null;
  selectedStatus: string | null = null;
  selectedCondition: string | null = null;
  selectedDepartment: string | null = null;
  selectedLocation: string | null = null;

  departments: string[] = [];
  locations: string[] = [];

  // Pagination
  first = 0;
  rows = 10;

  // Mock data for demonstration
  mockAssets = [
    {
      id: "1",
      assetTag: "COM001234",
      name: "Dell OptiPlex 7090",
      brand: "Dell",
      model: "OptiPlex 7090",
      serialNumber: "DL123456789",
      category: "Computer",
      status: "Active",
      condition: "Excellent",
      currentValue: 1200,
      purchaseValue: 1500,
      assignedTo: "John Doe",
      assignmentDate: new Date("2023-01-15"),
      location: "IT Department",
      department: "Information Technology",
    },
    {
      id: "2",
      assetTag: "FUR002345",
      name: "Executive Office Chair",
      brand: "Herman Miller",
      model: "Aeron",
      serialNumber: "HM987654321",
      category: "Furniture",
      status: "Active",
      condition: "Good",
      currentValue: 800,
      purchaseValue: 1000,
      assignedTo: "Jane Smith",
      assignmentDate: new Date("2023-02-20"),
      location: "Admin Office",
      department: "Administration",
    },
  ];

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
    // Using mock data for now
    setTimeout(() => {
      this.assets = this.mockAssets;
      this.filteredAssets = [...this.mockAssets];
      this.totalAssets = this.assets.length;
      this.extractFilterOptions();
      this.loading = false;
    }, 1000);
  }

  // New missing methods
  getTotalValue(): number {
    return this.filteredAssets.reduce(
      (total, asset) => total + asset.currentValue,
      0,
    );
  }

  getActiveAssetsCount(): number {
    return this.filteredAssets.filter((asset) => asset.status === "Active")
      .length;
  }

  getMaintenanceCount(): number {
    return this.filteredAssets.filter((asset) => asset.status === "Maintenance")
      .length;
  }

  saveCurrentView(): void {
    this.messageService.add({
      severity: "success",
      summary: "View Saved",
      detail: "Current view preferences have been saved",
      life: 2000,
    });
  }

  changeView(): void {
    this.messageService.add({
      severity: "info",
      summary: "View Changed",
      detail: `Switched to ${this.currentView} view`,
      life: 2000,
    });
  }

  getAssetIcon(category: string): string {
    switch (category) {
      case "Computer":
        return "pi pi-desktop";
      case "Furniture":
        return "pi pi-home";
      case "Equipment":
        return "pi pi-cog";
      case "Vehicle":
        return "pi pi-car";
      default:
        return "pi pi-box";
    }
  }

  getCategoryStyle(category: string): string {
    switch (category) {
      case "Computer":
        return "bg-blue-100 text-blue-700";
      case "Furniture":
        return "bg-green-100 text-green-700";
      case "Equipment":
        return "bg-yellow-100 text-yellow-700";
      case "Vehicle":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-700";
      case "Disposed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  getStatusIndicator(status: string): string {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-gray-500";
      case "Maintenance":
        return "bg-yellow-500";
      case "Disposed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  getConditionStyle(condition: string): string {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-700";
      case "Good":
        return "bg-blue-100 text-blue-700";
      case "Fair":
        return "bg-yellow-100 text-yellow-700";
      case "Poor":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  transferAsset(asset: any): void {
    this.messageService.add({
      severity: "info",
      summary: "Transfer Asset",
      detail: `Initiating transfer for ${asset.name}`,
      life: 2000,
    });
  }

  bulkTransfer(): void {
    this.messageService.add({
      severity: "info",
      summary: "Bulk Transfer",
      detail: `Transferring ${this.selectedAssets.length} assets`,
      life: 2000,
    });
  }

  bulkMaintenance(): void {
    this.messageService.add({
      severity: "info",
      summary: "Bulk Maintenance",
      detail: `Scheduling maintenance for ${this.selectedAssets.length} assets`,
      life: 2000,
    });
  }

  bulkExport(): void {
    this.messageService.add({
      severity: "success",
      summary: "Export Started",
      detail: `Exporting ${this.selectedAssets.length} selected assets`,
      life: 2000,
    });
  }

  clearSelection(): void {
    this.selectedAssets = [];
    this.messageService.add({
      severity: "info",
      summary: "Selection Cleared",
      detail: "Asset selection has been cleared",
      life: 2000,
    });
  }

  private extractFilterOptions() {
    this.departments = [
      ...new Set(this.assets.map((asset) => asset.department)),
    ];
    this.locations = [...new Set(this.assets.map((asset) => asset.location))];
  }

  applyFilters() {
    this.filteredAssets = this.assets.filter((asset: any) => {
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

  private matchesSearchQuery(asset: any, query: string): boolean {
    const searchText = query.toLowerCase();
    return !!(
      asset.name?.toLowerCase().includes(searchText) ||
      asset.assetTag?.toLowerCase().includes(searchText) ||
      asset.brand?.toLowerCase().includes(searchText) ||
      asset.model?.toLowerCase().includes(searchText) ||
      asset.serialNumber?.toLowerCase().includes(searchText) ||
      asset.assignedTo?.toLowerCase().includes(searchText)
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
