import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import {
  InventoryItem,
  StockMovement,
  StockMovementType,
} from "../../shared/models/asset.interface";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  private apiUrl = "/json-api/inventoryItems";
  private movementsUrl = "/json-api/stockMovements";
  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  public inventory$ = this.inventorySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInventory();
  }

  // Inventory CRUD Operations
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  getInventoryItem(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
  }

  createInventoryItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
    const newItem = {
      ...item,
      id: this.generateId(),
      lastRestocked: new Date(),
    };
    return this.http.post<InventoryItem>(this.apiUrl, newItem);
  }

  updateInventoryItem(
    id: string,
    item: Partial<InventoryItem>,
  ): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, item);
  }

  deleteInventoryItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Stock Movement Operations
  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(this.movementsUrl);
  }

  getStockMovementsByItem(itemId: string): Observable<StockMovement[]> {
    return this.getStockMovements().pipe(
      map((movements) => movements.filter((m) => m.itemId === itemId)),
    );
  }

  recordStockMovement(
    movement: Partial<StockMovement>,
  ): Observable<StockMovement> {
    const newMovement = {
      ...movement,
      id: this.generateId(),
      performedDate: new Date(),
    };

    // Update inventory item stock
    this.updateItemStock(movement.itemId!, movement.quantity!, movement.type!);

    return this.http.post<StockMovement>(this.movementsUrl, newMovement);
  }

  // Stock Operations
  stockIn(
    itemId: string,
    quantity: number,
    reason: string,
    performedBy: string,
    reference?: string,
  ): Observable<StockMovement> {
    return this.recordStockMovement({
      itemId,
      type: StockMovementType.IN,
      quantity,
      reason,
      performedBy,
      reference,
    });
  }

  stockOut(
    itemId: string,
    quantity: number,
    reason: string,
    performedBy: string,
    reference?: string,
  ): Observable<StockMovement> {
    return this.recordStockMovement({
      itemId,
      type: StockMovementType.OUT,
      quantity: -quantity, // Negative for stock out
      reason,
      performedBy,
      reference,
    });
  }

  adjustStock(
    itemId: string,
    newQuantity: number,
    reason: string,
    performedBy: string,
  ): Observable<StockMovement> {
    return this.getInventoryItem(itemId).pipe(
      map((item) => {
        const adjustment = newQuantity - item.currentStock;
        this.recordStockMovement({
          itemId,
          type: StockMovementType.ADJUSTMENT,
          quantity: adjustment,
          reason,
          performedBy,
        }).subscribe();
        return {
          id: this.generateId(),
          itemId,
          type: StockMovementType.ADJUSTMENT,
          quantity: adjustment,
          reason,
          performedBy,
          performedDate: new Date(),
        };
      }),
    );
  }

  transferStock(
    itemId: string,
    quantity: number,
    fromLocation: string,
    toLocation: string,
    performedBy: string,
  ): Observable<StockMovement[]> {
    const outMovement = this.recordStockMovement({
      itemId,
      type: StockMovementType.TRANSFER,
      quantity: -quantity,
      reason: `Transfer from ${fromLocation} to ${toLocation}`,
      performedBy,
      reference: `Transfer to ${toLocation}`,
    });

    const inMovement = this.recordStockMovement({
      itemId,
      type: StockMovementType.TRANSFER,
      quantity: quantity,
      reason: `Transfer from ${fromLocation} to ${toLocation}`,
      performedBy,
      reference: `Transfer from ${fromLocation}`,
    });

    return new Observable((observer) => {
      Promise.all([outMovement.toPromise(), inMovement.toPromise()])
        .then((movements) => {
          observer.next(movements as StockMovement[]);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // Search and Filter
  searchInventory(query: string): Observable<InventoryItem[]> {
    return this.getInventoryItems().pipe(
      map((items) =>
        items.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }

  filterInventory(filters: {
    category?: string;
    location?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
  }): Observable<InventoryItem[]> {
    return this.getInventoryItems().pipe(
      map((items) =>
        items.filter((item) => {
          if (filters.category && item.category !== filters.category)
            return false;
          if (filters.location && item.location !== filters.location)
            return false;
          if (filters.lowStock && item.currentStock > item.minimumStock)
            return false;
          if (filters.outOfStock && item.currentStock > 0) return false;
          return true;
        }),
      ),
    );
  }

  // Analytics and Reports
  getInventoryStatistics(): Observable<any> {
    return this.getInventoryItems().pipe(
      map((items) => {
        const total = items.length;
        const totalValue = items.reduce(
          (sum, item) => sum + item.currentStock * item.unitPrice,
          0,
        );
        const lowStock = items.filter(
          (item) => item.currentStock <= item.minimumStock,
        ).length;
        const outOfStock = items.filter(
          (item) => item.currentStock === 0,
        ).length;

        const categories = [...new Set(items.map((item) => item.category))];
        const byCategory = categories.map((category) => {
          const categoryItems = items.filter(
            (item) => item.category === category,
          );
          return {
            category,
            count: categoryItems.length,
            value: categoryItems.reduce(
              (sum, item) => sum + item.currentStock * item.unitPrice,
              0,
            ),
            stock: categoryItems.reduce(
              (sum, item) => sum + item.currentStock,
              0,
            ),
          };
        });

        const locations = [...new Set(items.map((item) => item.location))];
        const byLocation = locations.map((location) => {
          const locationItems = items.filter(
            (item) => item.location === location,
          );
          return {
            location,
            count: locationItems.length,
            value: locationItems.reduce(
              (sum, item) => sum + item.currentStock * item.unitPrice,
              0,
            ),
          };
        });

        return {
          total,
          totalValue,
          lowStock,
          outOfStock,
          byCategory,
          byLocation,
        };
      }),
    );
  }

  getStockMovementSummary(
    dateFrom: Date,
    dateTo: Date,
  ): Observable<StockMovement[]> {
    return this.getStockMovements().pipe(
      map((movements) =>
        movements.filter(
          (movement) =>
            new Date(movement.performedDate) >= dateFrom &&
            new Date(movement.performedDate) <= dateTo,
        ),
      ),
    );
  }

  getTopMovingItems(limit: number = 10): Observable<any[]> {
    return this.getStockMovements().pipe(
      map((movements) => {
        const itemMovements = new Map<string, number>();

        movements.forEach((movement) => {
          const currentTotal = itemMovements.get(movement.itemId) || 0;
          itemMovements.set(
            movement.itemId,
            currentTotal + Math.abs(movement.quantity),
          );
        });

        return Array.from(itemMovements.entries())
          .map(([itemId, totalMovement]) => ({ itemId, totalMovement }))
          .sort((a, b) => b.totalMovement - a.totalMovement)
          .slice(0, limit);
      }),
    );
  }

  // Reorder Suggestions
  getReorderSuggestions(): Observable<InventoryItem[]> {
    return this.getInventoryItems().pipe(
      map((items) =>
        items.filter((item) => item.currentStock <= item.minimumStock),
      ),
    );
  }

  calculateReorderQuantity(item: InventoryItem): number {
    // Simple reorder quantity calculation
    // In a real system, this would consider lead time, demand forecast, etc.
    const safetyStock = Math.ceil(item.minimumStock * 0.2);
    const reorderQuantity = item.minimumStock * 2 + safetyStock;
    return Math.max(reorderQuantity - item.currentStock, 0);
  }

  // Expiry Management
  getExpiringItems(daysAhead: number = 30): Observable<InventoryItem[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return this.getInventoryItems().pipe(
      map((items) =>
        items.filter(
          (item) => item.expiryDate && new Date(item.expiryDate) <= cutoffDate,
        ),
      ),
    );
  }

  getExpiredItems(): Observable<InventoryItem[]> {
    const today = new Date();
    return this.getInventoryItems().pipe(
      map((items) =>
        items.filter(
          (item) => item.expiryDate && new Date(item.expiryDate) < today,
        ),
      ),
    );
  }

  // Utility Methods
  private loadInventory(): void {
    this.getInventoryItems().subscribe((items) => {
      this.inventorySubject.next(items);
    });
  }

  private updateItemStock(
    itemId: string,
    quantity: number,
    type: StockMovementType,
  ): void {
    this.getInventoryItem(itemId).subscribe((item) => {
      let newStock = item.currentStock;

      switch (type) {
        case StockMovementType.IN:
        case StockMovementType.ADJUSTMENT:
          newStock += quantity;
          break;
        case StockMovementType.OUT:
          newStock += quantity; // quantity is already negative for stock out
          break;
        case StockMovementType.TRANSFER:
          newStock += quantity; // can be positive or negative
          break;
      }

      newStock = Math.max(0, newStock); // Ensure stock doesn't go negative

      const updatedItem = {
        ...item,
        currentStock: newStock,
        lastRestocked:
          type === StockMovementType.IN ? new Date() : item.lastRestocked,
      };

      this.updateInventoryItem(itemId, updatedItem).subscribe();
    });
  }

  private generateId(): string {
    return "inv_" + Math.random().toString(36).substring(2, 15);
  }

  // Validation
  validateStockOperation(
    itemId: string,
    quantity: number,
    type: StockMovementType,
  ): Observable<{ valid: boolean; message?: string }> {
    return this.getInventoryItem(itemId).pipe(
      map((item) => {
        if (
          type === StockMovementType.OUT &&
          Math.abs(quantity) > item.currentStock
        ) {
          return {
            valid: false,
            message: `Insufficient stock. Available: ${item.currentStock}, Required: ${Math.abs(quantity)}`,
          };
        }

        if (quantity === 0) {
          return {
            valid: false,
            message: "Quantity cannot be zero",
          };
        }

        return { valid: true };
      }),
    );
  }
}
