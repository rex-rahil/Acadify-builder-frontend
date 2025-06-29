import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  private sidebarVisibleSubject = new BehaviorSubject<boolean>(false);
  public sidebarVisible$ = this.sidebarVisibleSubject.asObservable();

  private sidebarEnabledSubject = new BehaviorSubject<boolean>(true);
  public sidebarEnabled$ = this.sidebarEnabledSubject.asObservable();

  constructor() {}

  toggleSidebar() {
    this.sidebarVisibleSubject.next(!this.sidebarVisibleSubject.value);
  }

  openSidebar() {
    this.sidebarVisibleSubject.next(true);
  }

  closeSidebar() {
    this.sidebarVisibleSubject.next(false);
  }

  setSidebarEnabled(enabled: boolean) {
    this.sidebarEnabledSubject.next(enabled);
    if (!enabled) {
      this.closeSidebar();
    }
  }

  isSidebarVisible(): boolean {
    return this.sidebarVisibleSubject.value;
  }

  isSidebarEnabled(): boolean {
    return this.sidebarEnabledSubject.value;
  }
}
