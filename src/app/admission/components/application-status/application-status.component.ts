import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AdmissionStatusService } from "../../services/admission-status.service";
import { FormService } from "../../services/form.service";
import {
  ApplicationStatus,
  NotificationMessage,
  PaymentDetails,
} from "../../../shared/models/application.interface";

@Component({
  selector: "app-application-status",
  templateUrl: "./application-status.component.html",
  styleUrls: ["./application-status.component.scss"],
})
export class ApplicationStatusComponent implements OnInit {
  applicationStatus: ApplicationStatus | null = null;
  notifications: NotificationMessage[] = [];
  paymentDetails: PaymentDetails | null = null;
  loading = true;

  // Status display properties
  statusSteps = [
    { label: "Submitted", value: "submitted", icon: "pi-check" },
    { label: "Under Review", value: "under_review", icon: "pi-clock" },
    {
      label: "Document Verification",
      value: "document_review",
      icon: "pi-file",
    },
    { label: "Approved", value: "approved", icon: "pi-thumbs-up" },
    {
      label: "Payment Pending",
      value: "payment_pending",
      icon: "pi-credit-card",
    },
    { label: "Enrolled", value: "enrolled", icon: "pi-graduation-cap" },
  ];

  constructor(
    private admissionStatusService: AdmissionStatusService,
    private formService: FormService,
    private messageService: MessageService,
    public router: Router,
  ) {}

  async ngOnInit() {
    await this.loadApplicationData();
  }

  async loadApplicationData() {
    try {
      this.loading = true;

      const [status, notifications] = await Promise.all([
        this.admissionStatusService.getStudentApplicationStatus().toPromise(),
        this.admissionStatusService.getStudentNotifications().toPromise(),
      ]);

      this.applicationStatus = status || null;
      this.notifications = (notifications || []).sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      );

      // Load payment details if application is approved or payment pending
      if (
        status &&
        [
          "approved",
          "payment_pending",
          "payment_completed",
          "enrolled",
        ].includes(status.status)
      ) {
        const paymentResult = await this.admissionStatusService
          .getPaymentDetails(status.applicationId)
          .toPromise();
        this.paymentDetails = paymentResult || null;
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.showError("Failed to load application status");
    }
  }

  getStatusIndex(): number {
    if (!this.applicationStatus) return -1;

    const statusMap: { [key: string]: number } = {
      submitted: 0,
      resubmitted: 0,
      under_review: 1,
      document_review: 2,
      approved: 3,
      rejected: -1, // Special case
      payment_pending: 4,
      payment_completed: 5,
      enrolled: 5,
    };

    return statusMap[this.applicationStatus.status] ?? -1;
  }

  getStatusColor(): string {
    if (!this.applicationStatus) return "gray";

    const colorMap: { [key: string]: string } = {
      submitted: "blue",
      resubmitted: "blue",
      under_review: "orange",
      approved: "green",
      rejected: "red",
      payment_pending: "purple",
      payment_completed: "green",
      enrolled: "green",
    };

    return colorMap[this.applicationStatus.status] || "gray";
  }

  isRejected(): boolean {
    return this.applicationStatus?.status === "rejected";
  }

  canEditApplication(): boolean {
    return this.isRejected();
  }

  canMakePayment(): boolean {
    return this.applicationStatus?.status === "payment_pending";
  }

  isEnrolled(): boolean {
    return this.applicationStatus?.status === "enrolled";
  }

  editApplication() {
    if (this.canEditApplication()) {
      // Load the rejected application data for editing
      const savedData = this.formService.getFormData();
      // Navigate to admission form with edit mode
      this.router.navigate(["/admission"], {
        queryParams: {
          edit: true,
          applicationId: this.applicationStatus?.applicationId,
        },
      });
    }
  }

  proceedToPayment() {
    if (this.canMakePayment()) {
      this.router.navigate(["/admission/payment"], {
        queryParams: { applicationId: this.applicationStatus?.applicationId },
      });
    }
  }

  accessDashboard() {
    if (this.isEnrolled()) {
      this.router.navigate(["/dashboard"]);
    }
  }

  async markNotificationRead(notification: NotificationMessage) {
    try {
      await this.admissionStatusService
        .markNotificationRead(notification.id)
        .toPromise();

      // Update local notification
      const index = this.notifications.findIndex(
        (n) => n.id === notification.id,
      );
      if (index !== -1) {
        this.notifications[index].isRead = true;
      }
    } catch (error) {
      this.showError("Failed to mark notification as read");
    }
  }

  getNotificationIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      application_submitted: "pi-check",
      application_approved: "pi-thumbs-up",
      application_rejected: "pi-times",
      payment_due: "pi-credit-card",
      resubmission_required: "pi-refresh",
    };
    return iconMap[type] || "pi-bell";
  }

  getNotificationSeverity(type: string): string {
    const severityMap: { [key: string]: string } = {
      application_submitted: "info",
      application_approved: "success",
      application_rejected: "error",
      payment_due: "warn",
      resubmission_required: "warn",
    };
    return severityMap[type] || "info";
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  refreshStatus() {
    this.admissionStatusService.refreshApplicationStatus();
    this.loadApplicationData();
    this.showSuccess("Status refreshed successfully");
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }
}
