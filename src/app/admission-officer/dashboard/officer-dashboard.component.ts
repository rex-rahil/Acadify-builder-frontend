import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdmissionOfficerService } from "../services/admission-officer.service";
import {
  ApplicationOverview,
  ApplicationStatus,
  NotificationMessage,
} from "../../shared/models/application.interface";

@Component({
  selector: "app-officer-dashboard",
  templateUrl: "./officer-dashboard.component.html",
  styleUrls: ["./officer-dashboard.component.scss"],
})
export class OfficerDashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;

  overview: ApplicationOverview | null = null;
  recentApplications: ApplicationStatus[] = [];
  notifications: NotificationMessage[] = [];

  // Statistics
  currentTime = new Date();
  greeting = "";

  constructor(
    private admissionService: AdmissionOfficerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setGreeting();
    this.loadDashboardData();
    this.updateTime();
  }

  private setGreeting(): void {
    const hour = this.currentTime.getHours();
    if (hour < 12) {
      this.greeting = "Good Morning";
    } else if (hour < 17) {
      this.greeting = "Good Afternoon";
    } else {
      this.greeting = "Good Evening";
    }
  }

  private updateTime(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  private async loadDashboardData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [overview, applications, notifications] = await Promise.all([
        this.admissionService.getApplicationOverview().toPromise(),
        this.admissionService.getPendingApplications().toPromise(),
        this.admissionService.getNotifications("officer_001").toPromise(),
      ]);

      this.overview = overview || null;
      this.recentApplications = (applications || []).slice(0, 5);
      this.notifications = (notifications || []).slice(0, 5);
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case "submitted":
      case "under_review":
        return "warning";
      case "approved":
      case "payment_completed":
      case "enrolled":
        return "success";
      case "rejected":
        return "danger";
      case "payment_pending":
        return "info";
      default:
        return "secondary";
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case "application_submitted":
        return "pi pi-file-plus";
      case "application_approved":
        return "pi pi-check-circle";
      case "application_rejected":
        return "pi pi-times-circle";
      case "payment_due":
        return "pi pi-credit-card";
      case "resubmission_required":
        return "pi pi-refresh";
      default:
        return "pi pi-info-circle";
    }
  }

  getNotificationSeverity(type: string): string {
    switch (type) {
      case "application_submitted":
        return "info";
      case "application_approved":
        return "success";
      case "application_rejected":
        return "danger";
      case "payment_due":
        return "warning";
      case "resubmission_required":
        return "warning";
      default:
        return "secondary";
    }
  }

  navigateToReview(): void {
    this.router.navigate(["/admission-officer/review"]);
  }

  navigateToPayments(): void {
    this.router.navigate(["/admission-officer/payments"]);
  }

  viewApplication(applicationId: string): void {
    this.router.navigate(["/admission-officer/application", applicationId]);
  }

  async quickApprove(applicationId: string): Promise<void> {
    try {
      await this.admissionService
        .updateApplicationStatus(applicationId, "approved")
        .toPromise();
      await this.loadDashboardData();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  showRejectDialog(applicationId: string): void {
    // This would open a dialog for rejection reason
    // For now, using a simple prompt
    const reason = prompt("Please provide rejection reason:");
    if (reason) {
      this.quickReject(applicationId, reason);
    }
  }

  async quickReject(applicationId: string, reason: string): Promise<void> {
    try {
      await this.admissionService
        .updateApplicationStatus(applicationId, "rejected", reason)
        .toPromise();
      await this.loadDashboardData();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  private extractErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred";
  }
}
