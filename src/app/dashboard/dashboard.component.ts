import { Component, OnInit } from "@angular/core";
import { DashboardService } from "./services/dashboard.service";
import {
  DashboardStats,
  RecentActivity,
  Assignment,
  Exam,
  Announcement,
} from "./models/dashboard.interface";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  currentStudentId = "OCP2024001"; // This would come from auth service

  dashboardStats: DashboardStats | null = null;
  recentActivities: RecentActivity[] = [];
  pendingAssignments: Assignment[] = [];
  upcomingExams: Exam[] = [];
  announcements: Announcement[] = [];

  loading = true;

  // Chart data for attendance
  attendanceChartData: any;
  attendanceChartOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
  ) {
    this.initializeChartOptions();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Load dashboard statistics
    this.dashboardService.getDashboardStats(this.currentStudentId).subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.updateAttendanceChart(stats.overallAttendance);
      },
      error: (error) => {
        console.error("Error loading dashboard stats:", error);
        this.showError("Failed to load dashboard statistics");
      },
    });

    // Load recent activities
    this.dashboardService.getRecentActivities(this.currentStudentId).subscribe({
      next: (activities) => {
        this.recentActivities = activities.slice(0, 5); // Show latest 5
      },
      error: (error) => {
        console.error("Error loading recent activities:", error);
      },
    });

    // Load pending assignments
    this.dashboardService
      .getAssignments(this.currentStudentId, "pending")
      .subscribe({
        next: (assignments) => {
          this.pendingAssignments = assignments.slice(0, 3); // Show 3 most urgent
        },
        error: (error) => {
          console.error("Error loading assignments:", error);
        },
      });

    // Load upcoming exams
    this.dashboardService.getExams(this.currentStudentId, true).subscribe({
      next: (exams) => {
        this.upcomingExams = exams.slice(0, 3); // Show next 3 exams
      },
      error: (error) => {
        console.error("Error loading exams:", error);
      },
    });

    // Load announcements
    this.dashboardService.getAnnouncements().subscribe({
      next: (announcements) => {
        this.announcements = announcements.slice(0, 4); // Show latest 4
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading announcements:", error);
        this.loading = false;
      },
    });
  }

  private initializeChartOptions() {
    this.attendanceChartOptions = {
      cutout: "60%",
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }

  private updateAttendanceChart(percentage: number) {
    this.attendanceChartData = {
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: ["#87CEEB", "#E5E5E5"],
          borderWidth: 0,
        },
      ],
    };
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      attendance: "pi pi-calendar",
      assignment: "pi pi-file-edit",
      exam: "pi pi-bookmark",
      library: "pi pi-book",
      announcement: "pi pi-megaphone",
    };
    return icons[type] || "pi pi-info-circle";
  }

  getActivitySeverity(status: string): string {
    switch (status.toLowerCase()) {
      case "urgent":
      case "overdue":
      case "critical":
        return "danger";
      case "warning":
      case "due soon":
        return "warning";
      case "completed":
      case "submitted":
        return "success";
      default:
        return "info";
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getDaysUntil(date: Date): number {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  markAnnouncementRead(announcement: Announcement) {
    this.dashboardService.markAnnouncementRead(announcement.id).subscribe({
      next: () => {
        // Update the announcement as read in the local array
        const index = this.announcements.findIndex(
          (a) => a.id === announcement.id,
        );
        if (index !== -1) {
          // You might want to add a 'read' property to the interface
          console.log("Announcement marked as read");
        }
      },
      error: (error) => {
        console.error("Error marking announcement as read:", error);
      },
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
