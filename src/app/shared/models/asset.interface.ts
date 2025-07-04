export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  description: string;
  category: AssetCategory;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  condition: AssetCondition;
  status: AssetStatus;
  location: string;
  department: string;
  assignedTo?: string;
  warrantyExpiry?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
  images?: string[];
  specifications?: AssetSpecification[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetSpecification {
  name: string;
  value: string;
}

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  requestType: MaintenanceType;
  priority: MaintenancePriority;
  description: string;
  reportedBy: string;
  reportedDate: Date;
  assignedTo?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  status: MaintenanceStatus;
  cost?: number;
  serviceProvider?: string;
  notes?: string;
  attachments?: string[];
  resolution?: string;
}

export interface PurchaseRequisition {
  id: string;
  requestNumber: string;
  requestedBy: string;
  department: string;
  requestDate: Date;
  requiredBy: Date;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  totalAmount: number;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  items: RequisitionItem[];
  notes?: string;
}

export interface RequisitionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  estimatedPrice: number;
  specification?: string;
  justification?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  requisitionId?: string;
  supplier: Supplier;
  orderDate: Date;
  expectedDelivery: Date;
  status: PurchaseOrderStatus;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  items: PurchaseOrderItem[];
  createdBy: string;
  approvedBy?: string;
  receivedDate?: Date;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  received?: number;
  receivedDate?: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
  currentStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: Date;
  expiryDate?: Date;
  notes?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  performedBy: string;
  performedDate: Date;
  reference?: string;
  notes?: string;
}

export interface AssetAllocation {
  id: string;
  assetId: string;
  allocatedTo: string;
  allocatedBy: string;
  department: string;
  allocationDate: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  status: AllocationStatus;
  purpose: string;
  condition: AssetCondition;
  notes?: string;
}

export interface AssetReport {
  id: string;
  title: string;
  type: ReportType;
  generatedBy: string;
  generatedDate: Date;
  period: ReportPeriod;
  filters: any;
  data: any[];
  summary: ReportSummary;
}

export interface ReportSummary {
  totalAssets: number;
  totalValue: number;
  maintenanceCost: number;
  utilizationRate: number;
  byCategory: CategorySummary[];
  byDepartment: DepartmentSummary[];
}

export interface CategorySummary {
  category: string;
  count: number;
  value: number;
}

export interface DepartmentSummary {
  department: string;
  count: number;
  value: number;
}

export interface MaintenanceAlert {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  alertType: AlertType;
  message: string;
  dueDate: Date;
  createdDate: Date;
  isRead: boolean;
  isResolved: boolean;
  resolvedDate?: Date;
  assignedTo?: string;
}

// Enums
export enum AssetCategory {
  COMPUTER = "Computer",
  FURNITURE = "Furniture",
  VEHICLE = "Vehicle",
  EQUIPMENT = "Equipment",
  ELECTRICAL = "Electrical",
  LABORATORY = "Laboratory",
  BUILDING = "Building",
  OTHER = "Other",
}

export enum AssetCondition {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
  OUT_OF_ORDER = "Out of Order",
}

export enum AssetStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  MAINTENANCE = "Under Maintenance",
  DISPOSED = "Disposed",
  LOST = "Lost",
  STOLEN = "Stolen",
}

export enum MaintenanceType {
  PREVENTIVE = "Preventive",
  CORRECTIVE = "Corrective",
  EMERGENCY = "Emergency",
  INSPECTION = "Inspection",
}

export enum MaintenancePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export enum MaintenanceStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  ON_HOLD = "On Hold",
}

export enum RequisitionStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  ORDERED = "Ordered",
  RECEIVED = "Received",
}

export enum RequisitionPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

export enum PurchaseOrderStatus {
  DRAFT = "Draft",
  SENT = "Sent",
  CONFIRMED = "Confirmed",
  PARTIALLY_RECEIVED = "Partially Received",
  RECEIVED = "Received",
  CANCELLED = "Cancelled",
}

export enum StockMovementType {
  IN = "Stock In",
  OUT = "Stock Out",
  ADJUSTMENT = "Adjustment",
  TRANSFER = "Transfer",
}

export enum AllocationStatus {
  ALLOCATED = "Allocated",
  RETURNED = "Returned",
  OVERDUE = "Overdue",
  LOST = "Lost",
}

export enum ReportType {
  ASSET_INVENTORY = "Asset Inventory",
  MAINTENANCE_HISTORY = "Maintenance History",
  DEPRECIATION = "Depreciation",
  UTILIZATION = "Utilization",
  COST_ANALYSIS = "Cost Analysis",
}

export enum ReportPeriod {
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  YEARLY = "Yearly",
  CUSTOM = "Custom",
}

export enum AlertType {
  MAINTENANCE_DUE = "Maintenance Due",
  WARRANTY_EXPIRY = "Warranty Expiry",
  LOW_STOCK = "Low Stock",
  OVERDUE_RETURN = "Overdue Return",
  INSPECTION_DUE = "Inspection Due",
}
