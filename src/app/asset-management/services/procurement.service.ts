import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import {
  PurchaseRequisition,
  PurchaseOrder,
  Supplier,
  RequisitionStatus,
  PurchaseOrderStatus,
  RequisitionPriority,
} from "../../shared/models/asset.interface";

@Injectable({
  providedIn: "root",
})
export class ProcurementService {
  private requisitionsUrl = "/json-api/purchaseRequisitions";
  private ordersUrl = "/json-api/purchaseOrders";
  private suppliersUrl = "/json-api/suppliers";

  constructor(private http: HttpClient) {}

  // Purchase Requisitions
  getRequisitions(): Observable<PurchaseRequisition[]> {
    return this.http.get<PurchaseRequisition[]>(this.requisitionsUrl);
  }

  getRequisition(id: string): Observable<PurchaseRequisition> {
    return this.http.get<PurchaseRequisition>(`${this.requisitionsUrl}/${id}`);
  }

  createRequisition(
    requisition: Partial<PurchaseRequisition>,
  ): Observable<PurchaseRequisition> {
    const newRequisition = {
      ...requisition,
      id: this.generateId("REQ"),
      requestNumber: this.generateRequestNumber(),
      requestDate: new Date(),
      status: RequisitionStatus.DRAFT,
    };
    return this.http.post<PurchaseRequisition>(
      this.requisitionsUrl,
      newRequisition,
    );
  }

  updateRequisition(
    id: string,
    requisition: Partial<PurchaseRequisition>,
  ): Observable<PurchaseRequisition> {
    return this.http.put<PurchaseRequisition>(
      `${this.requisitionsUrl}/${id}`,
      requisition,
    );
  }

  // Requisition Status Management
  submitRequisition(id: string): Observable<PurchaseRequisition> {
    return this.updateRequisition(id, {
      status: RequisitionStatus.SUBMITTED,
    });
  }

  approveRequisition(
    id: string,
    approvedBy: string,
  ): Observable<PurchaseRequisition> {
    return this.updateRequisition(id, {
      status: RequisitionStatus.APPROVED,
      approvedBy,
      approvedDate: new Date(),
    });
  }

  rejectRequisition(
    id: string,
    rejectionReason: string,
  ): Observable<PurchaseRequisition> {
    return this.updateRequisition(id, {
      status: RequisitionStatus.REJECTED,
      rejectionReason,
    });
  }

  // Purchase Orders
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.ordersUrl);
  }

  getPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.ordersUrl}/${id}`);
  }

  createPurchaseOrder(
    order: Partial<PurchaseOrder>,
  ): Observable<PurchaseOrder> {
    const newOrder = {
      ...order,
      id: this.generateId("PO"),
      orderNumber: this.generateOrderNumber(),
      orderDate: new Date(),
      status: PurchaseOrderStatus.DRAFT,
    };
    return this.http.post<PurchaseOrder>(this.ordersUrl, newOrder);
  }

  createPurchaseOrderFromRequisition(
    requisitionId: string,
    supplier: Supplier,
  ): Observable<PurchaseOrder> {
    return this.getRequisition(requisitionId).pipe(
      map((requisition) => {
        const purchaseOrder: Partial<PurchaseOrder> = {
          requisitionId,
          supplier,
          items: requisition.items.map((item) => ({
            id: this.generateId("POI"),
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.estimatedPrice,
            totalPrice: item.quantity * item.estimatedPrice,
          })),
          totalAmount: requisition.totalAmount,
          taxAmount: requisition.totalAmount * 0.1, // 10% tax
          discountAmount: 0,
          shippingCost: 0,
          expectedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          createdBy: requisition.requestedBy,
        };

        return this.createPurchaseOrder(purchaseOrder);
      }),
    );
  }

  updatePurchaseOrder(
    id: string,
    order: Partial<PurchaseOrder>,
  ): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.ordersUrl}/${id}`, order);
  }

  // Purchase Order Status Management
  sendPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.updatePurchaseOrder(id, {
      status: PurchaseOrderStatus.SENT,
    });
  }

  confirmPurchaseOrder(
    id: string,
    approvedBy: string,
  ): Observable<PurchaseOrder> {
    return this.updatePurchaseOrder(id, {
      status: PurchaseOrderStatus.CONFIRMED,
      approvedBy,
    });
  }

  receivePurchaseOrder(
    id: string,
    receivedItems: any[],
  ): Observable<PurchaseOrder> {
    return this.getPurchaseOrder(id).pipe(
      map((order) => {
        const updatedItems = order.items.map((item) => {
          const receivedItem = receivedItems.find((ri) => ri.id === item.id);
          if (receivedItem) {
            return {
              ...item,
              received: receivedItem.quantity,
              receivedDate: new Date(),
            };
          }
          return item;
        });

        const allReceived = updatedItems.every(
          (item) => (item.received || 0) >= item.quantity,
        );
        const partiallyReceived = updatedItems.some(
          (item) => (item.received || 0) > 0,
        );

        let status = order.status;
        if (allReceived) {
          status = PurchaseOrderStatus.RECEIVED;
        } else if (partiallyReceived) {
          status = PurchaseOrderStatus.PARTIALLY_RECEIVED;
        }

        return this.updatePurchaseOrder(id, {
          items: updatedItems,
          status,
          receivedDate: allReceived ? new Date() : undefined,
        });
      }),
    );
  }

  cancelPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.updatePurchaseOrder(id, {
      status: PurchaseOrderStatus.CANCELLED,
    });
  }

  // Suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.suppliersUrl);
  }

  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.suppliersUrl}/${id}`);
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    const newSupplier = {
      ...supplier,
      id: this.generateId("SUP"),
      rating: 0,
      isActive: true,
    };
    return this.http.post<Supplier>(this.suppliersUrl, newSupplier);
  }

  updateSupplier(
    id: string,
    supplier: Partial<Supplier>,
  ): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.suppliersUrl}/${id}`, supplier);
  }

  // Analytics and Reports
  getProcurementStatistics(): Observable<any> {
    return Promise.all([
      this.getRequisitions().toPromise(),
      this.getPurchaseOrders().toPromise(),
    ]).then(([requisitions = [], orders = []]) => {
      const totalRequisitions = requisitions.length;
      const pendingRequisitions = requisitions.filter(
        (req) => req.status === RequisitionStatus.SUBMITTED,
      ).length;
      const approvedRequisitions = requisitions.filter(
        (req) => req.status === RequisitionStatus.APPROVED,
      ).length;

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (order) => order.status === PurchaseOrderStatus.SENT,
      ).length;
      const completedOrders = orders.filter(
        (order) => order.status === PurchaseOrderStatus.RECEIVED,
      ).length;

      const totalSpend = orders
        .filter((order) => order.status === PurchaseOrderStatus.RECEIVED)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const byPriority = Object.values(RequisitionPriority).map((priority) => ({
        priority,
        count: requisitions.filter((req) => req.priority === priority).length,
      }));

      const recentActivity = [
        ...requisitions.slice(-5).map((req) => ({
          type: "Requisition",
          title: `Requisition ${req.requestNumber}`,
          status: req.status,
          date: req.requestDate,
          amount: req.totalAmount,
        })),
        ...orders.slice(-5).map((order) => ({
          type: "Purchase Order",
          title: `Order ${order.orderNumber}`,
          status: order.status,
          date: order.orderDate,
          amount: order.totalAmount,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        totalRequisitions,
        pendingRequisitions,
        approvedRequisitions,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSpend,
        byPriority,
        recentActivity: recentActivity.slice(0, 10),
      };
    });
  }

  getSpendingByCategory(dateFrom: Date, dateTo: Date): Observable<any[]> {
    return this.getPurchaseOrders().pipe(
      map((orders) => {
        const categorySpending = new Map<string, number>();

        orders
          .filter(
            (order) =>
              order.status === PurchaseOrderStatus.RECEIVED &&
              new Date(order.orderDate) >= dateFrom &&
              new Date(order.orderDate) <= dateTo,
          )
          .forEach((order) => {
            order.items.forEach((item) => {
              // Assuming category is derived from item description or a separate field
              const category = this.categorizeItem(item.name);
              const currentSpending = categorySpending.get(category) || 0;
              categorySpending.set(category, currentSpending + item.totalPrice);
            });
          });

        return Array.from(categorySpending.entries()).map(
          ([category, amount]) => ({
            category,
            amount,
          }),
        );
      }),
    );
  }

  getSupplierPerformance(): Observable<any[]> {
    return this.getPurchaseOrders().pipe(
      map((orders) => {
        const supplierPerformance = new Map<string, any>();

        orders.forEach((order) => {
          const supplierId = order.supplier.id;
          const performance = supplierPerformance.get(supplierId) || {
            supplier: order.supplier,
            totalOrders: 0,
            completedOrders: 0,
            totalValue: 0,
            avgDeliveryTime: 0,
            onTimeDelivery: 0,
          };

          performance.totalOrders++;
          performance.totalValue += order.totalAmount;

          if (order.status === PurchaseOrderStatus.RECEIVED) {
            performance.completedOrders++;
            if (
              order.receivedDate &&
              new Date(order.receivedDate) <= new Date(order.expectedDelivery)
            ) {
              performance.onTimeDelivery++;
            }
          }

          supplierPerformance.set(supplierId, performance);
        });

        return Array.from(supplierPerformance.values()).map((perf) => ({
          ...perf,
          completionRate: (perf.completedOrders / perf.totalOrders) * 100,
          onTimeRate: (perf.onTimeDelivery / perf.completedOrders) * 100,
        }));
      }),
    );
  }

  // Search and Filter
  searchRequisitions(query: string): Observable<PurchaseRequisition[]> {
    return this.getRequisitions().pipe(
      map((requisitions) =>
        requisitions.filter(
          (req) =>
            req.requestNumber.toLowerCase().includes(query.toLowerCase()) ||
            req.requestedBy.toLowerCase().includes(query.toLowerCase()) ||
            req.department.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }

  filterRequisitions(filters: {
    status?: RequisitionStatus;
    priority?: RequisitionPriority;
    department?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Observable<PurchaseRequisition[]> {
    return this.getRequisitions().pipe(
      map((requisitions) =>
        requisitions.filter((req) => {
          if (filters.status && req.status !== filters.status) return false;
          if (filters.priority && req.priority !== filters.priority)
            return false;
          if (filters.department && req.department !== filters.department)
            return false;
          if (filters.dateFrom && new Date(req.requestDate) < filters.dateFrom)
            return false;
          if (filters.dateTo && new Date(req.requestDate) > filters.dateTo)
            return false;
          return true;
        }),
      ),
    );
  }

  // Utility Methods
  private generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateRequestNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `REQ${timestamp}`;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `PO${timestamp}`;
  }

  private categorizeItem(itemName: string): string {
    const name = itemName.toLowerCase();
    if (name.includes("computer") || name.includes("laptop")) return "IT";
    if (name.includes("furniture") || name.includes("chair"))
      return "Furniture";
    if (name.includes("stationery") || name.includes("paper"))
      return "Office Supplies";
    if (name.includes("equipment") || name.includes("machine"))
      return "Equipment";
    return "Other";
  }

  // Approval Workflow
  getRequisitionsForApproval(
    approverId: string,
  ): Observable<PurchaseRequisition[]> {
    return this.getRequisitions().pipe(
      map((requisitions) =>
        requisitions.filter(
          (req) =>
            req.status === RequisitionStatus.SUBMITTED &&
            this.canApprove(req, approverId),
        ),
      ),
    );
  }

  private canApprove(
    requisition: PurchaseRequisition,
    approverId: string,
  ): boolean {
    // Implement approval logic based on amount, department, user role, etc.
    return true; // Simplified for now
  }

  // Budget Management
  checkBudgetAvailability(
    department: string,
    amount: number,
  ): Observable<{ available: boolean; remaining: number }> {
    // This would integrate with a budget management system
    return new Observable((observer) => {
      // Simplified budget check
      const mockBudget = 100000;
      const available = amount <= mockBudget;
      observer.next({
        available,
        remaining: mockBudget - amount,
      });
      observer.complete();
    });
  }
}
