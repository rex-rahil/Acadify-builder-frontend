import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacultyService } from "../services/faculty.service";
import {
  LeaveRequest,
  LeaveBalance,
  FacultyProfile,
} from "../models/faculty.interface";

@Component({
  selector: "app-leave-management",
  templateUrl: "./leave-management.component.html",
  styleUrls: ["./leave-management.component.scss"],
})
export class LeaveManagementComponent implements OnInit {
  facultyId = "faculty_001"; // This would come from auth service
  loading = true;
  error: string | null = null;

  facultyProfile: FacultyProfile | null = null;
  leaveRequests: LeaveRequest[] = [];
  leaveBalance: LeaveBalance | null = null;
  pendingApprovals: LeaveRequest[] = []; // For HOD

  // Leave Application
  showApplyDialog = false;
  leaveForm: FormGroup;
  applyLoading = false;

  // Filters
  selectedStatus = "all";
  selectedYear = new Date().getFullYear();

  // Leave Types
  leaveTypes = [
    { label: "Casual Leave", value: "casual" },
    { label: "Sick Leave", value: "sick" },
    { label: "Earned Leave", value: "earned" },
    { label: "Maternity Leave", value: "maternity" },
    { label: "Emergency Leave", value: "emergency" },
  ];

  statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  constructor(
    private facultyService: FacultyService,
    private fb: FormBuilder,
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      reason: ["", [Validators.required, Validators.minLength(10)]],
      documents: [null],
    });
  }

  ngOnInit(): void {
    this.loadLeaveData();
    this.loadFacultyProfile();
  }

  private async loadFacultyProfile(): Promise<void> {
    try {
      this.facultyProfile = await this.facultyService
        .getFacultyProfile(this.facultyId)
        .toPromise();

      // If user is HOD, load pending approvals
      if (this.facultyProfile?.isHOD) {
        this.loadPendingApprovals();
      }
    } catch (error: any) {
      console.error("Failed to load faculty profile:", error);
    }
  }

  private async loadLeaveData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [requests, balance] = await Promise.all([
        this.facultyService.getLeaveRequests(this.facultyId).toPromise(),
        this.facultyService.getLeaveBalance(this.facultyId).toPromise(),
      ]);

      this.leaveRequests = requests || [];
      this.leaveBalance = balance || null;
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPendingApprovals(): Promise<void> {
    if (!this.facultyProfile?.isHOD) return;

    try {
      const departmentId = "dept_001"; // This would come from faculty profile
      this.pendingApprovals = await this.facultyService
        .getPendingLeaveRequests(departmentId)
        .toPromise();
    } catch (error: any) {
      console.error("Failed to load pending approvals:", error);
    }
  }

  getFilteredRequests(): LeaveRequest[] {
    let filtered = [...this.leaveRequests];

    if (this.selectedStatus !== "all") {
      filtered = filtered.filter(
        (request) => request.status === this.selectedStatus,
      );
    }

    filtered = filtered.filter((request) => {
      const requestYear = new Date(request.appliedDate).getFullYear();
      return requestYear === this.selectedYear;
    });

    return filtered.sort(
      (a, b) =>
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime(),
    );
  }

  openApplyDialog(): void {
    this.leaveForm.reset();
    this.showApplyDialog = true;
  }

  closeApplyDialog(): void {
    this.showApplyDialog = false;
    this.applyLoading = false;
  }

  calculateLeaveDuration(): number {
    const startDate = this.leaveForm.get("startDate")?.value;
    const endDate = this.leaveForm.get("endDate")?.value;

    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  }

  async applyLeave(): Promise<void> {
    if (this.leaveForm.invalid) return;

    this.applyLoading = true;
    try {
      const formValue = this.leaveForm.value;
      const leaveData = {
        leaveType: formValue.leaveType,
        startDate: formValue.startDate.toISOString().split("T")[0],
        endDate: formValue.endDate.toISOString().split("T")[0],
        duration: this.calculateLeaveDuration(),
        reason: formValue.reason,
        appliedDate: new Date().toISOString(),
        status: "pending" as const,
        documents: formValue.documents ? [formValue.documents] : [],
      };

      await this.facultyService
        .applyLeave(this.facultyId, leaveData)
        .toPromise();

      await this.loadLeaveData();
      this.closeApplyDialog();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.applyLoading = false;
    }
  }

  async approveLeave(leaveRequest: LeaveRequest): Promise<void> {
    try {
      await this.facultyService
        .approveLeaveRequest(leaveRequest.id)
        .toPromise();
      await this.loadPendingApprovals();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  async rejectLeave(leaveRequest: LeaveRequest, reason: string): Promise<void> {
    try {
      await this.facultyService
        .rejectLeaveRequest(leaveRequest.id, reason)
        .toPromise();
      await this.loadPendingApprovals();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  getLeaveStatusSeverity(status: string): string {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  }

  getLeaveTypeColor(type: string): string {
    switch (type) {
      case "casual":
        return "info";
      case "sick":
        return "warning";
      case "earned":
        return "success";
      case "maternity":
        return "secondary";
      case "emergency":
        return "danger";
      default:
        return "info";
    }
  }

  getBalanceStatusColor(balance: number, total: number): string {
    const percentage = (balance / total) * 100;
    if (percentage >= 60) return "success";
    if (percentage >= 30) return "warning";
    return "danger";
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.leaveForm.patchValue({
        documents: file.name,
      });
    }
  }

  downloadDocument(documentUrl: string): void {
    // Implementation for downloading document
    window.open(documentUrl, "_blank");
  }

  exportLeaves(): void {
    const csvContent = this.convertToCSV(this.getFilteredRequests());
    this.downloadCSV(csvContent, `leaves-${this.selectedYear}.csv`);
  }

  private convertToCSV(data: LeaveRequest[]): string {
    const headers = [
      "Type",
      "Start Date",
      "End Date",
      "Duration",
      "Reason",
      "Status",
      "Applied Date",
      "Approved By",
      "Approved Date",
    ];

    const rows = data.map((leave) => [
      leave.leaveType,
      leave.startDate,
      leave.endDate,
      leave.duration.toString(),
      leave.reason,
      leave.status,
      new Date(leave.appliedDate).toLocaleDateString(),
      leave.approvedBy || "",
      leave.approvedDate
        ? new Date(leave.approvedDate).toLocaleDateString()
        : "",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  refreshData(): void {
    this.loadLeaveData();
    if (this.facultyProfile?.isHOD) {
      this.loadPendingApprovals();
    }
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
