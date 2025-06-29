import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdmissionOfficerService } from "../services/admission-officer.service";
import { ApplicationStatus } from "../../shared/models/application.interface";

@Component({
  selector: "app-application-review",
  templateUrl: "./application-review.component.html",
  styleUrls: ["./application-review.component.scss"],
})
export class ApplicationReviewComponent implements OnInit {
  loading = true;
  error: string | null = null;

  applications: ApplicationStatus[] = [];
  filteredApplications: ApplicationStatus[] = [];
  selectedStatus = "all";
  searchTerm = "";

  statusOptions = [
    { label: "All Applications", value: "all" },
    { label: "Pending Review", value: "submitted" },
    { label: "Under Review", value: "under_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Payment Pending", value: "payment_pending" },
  ];

  constructor(
    private admissionService: AdmissionOfficerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  private async loadApplications(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.applications =
        (await this.admissionService.getAllApplications().toPromise()) || [];
      this.applyFilters();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    let filtered = [...this.applications];

    if (this.selectedStatus !== "all") {
      filtered = filtered.filter((app) => app.status === this.selectedStatus);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicationId
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          app.studentId.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    this.filteredApplications = filtered;
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

  viewApplication(applicationId: string): void {
    this.router.navigate(["/admission-officer/application", applicationId]);
  }

  async quickApprove(applicationId: string): Promise<void> {
    try {
      await this.admissionService
        .updateApplicationStatus(applicationId, "approved")
        .toPromise();
      await this.loadApplications();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  showRejectDialog(applicationId: string): void {
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
      await this.loadApplications();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  refreshData(): void {
    this.loadApplications();
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
