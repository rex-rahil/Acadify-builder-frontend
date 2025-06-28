import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import {
  AttendanceStats,
  AttendanceRecord,
} from "../../models/dashboard.interface";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
  providers: [MessageService],
})
export class AttendanceComponent implements OnInit {
  currentStudentId = "OCP2024001";

  attendanceStats: AttendanceStats[] = [];
  attendanceRecords: AttendanceRecord[] = [];
  selectedSubject = "";
  subjects: string[] = [];

  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadAttendanceData();
  }

  loadAttendanceData() {
    this.loading = true;

    this.dashboardService.getAttendanceStats(this.currentStudentId).subscribe({
      next: (stats) => {
        this.attendanceStats = stats;
        this.subjects = stats.map((s) => s.subjectCode);
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading attendance:", error);
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Failed to load attendance data";
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
        });
        this.loading = false;
      },
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case "good":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "danger";
      default:
        return "info";
    }
  }
}
