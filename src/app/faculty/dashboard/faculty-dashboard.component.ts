import { Component, OnInit } from "@angular/core";
import { FacultyService } from "../services/faculty.service";
import {
  FacultyDashboardStats,
  FacultyProfile,
  Schedule,
  ClassSession,
  LeaveRequest,
} from "../models/faculty.interface";

@Component({
  selector: "app-faculty-dashboard",
  templateUrl: "./faculty-dashboard.component.html",
  styleUrls: ["./faculty-dashboard.component.scss"],
})
export class FacultyDashboardComponent implements OnInit {
  facultyId = "faculty_001"; // This would come from auth service
  loading = true;
  error: string | null = null;

  dashboardStats: FacultyDashboardStats | null = null;
  facultyProfile: FacultyProfile | null = null;
  todaySchedule: Schedule[] = [];
  upcomingClasses: ClassSession[] = [];
  recentLeaves: LeaveRequest[] = [];

  currentTime = new Date();
  greeting = "";

  constructor(private facultyService: FacultyService) {}

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
      const [stats, profile, schedule, classes, leaves] = await Promise.all([
        this.facultyService.getDashboardStats(this.facultyId).toPromise(),
        this.facultyService.getFacultyProfile(this.facultyId).toPromise(),
        this.facultyService
          .getFacultySchedule(
            this.facultyId,
            this.currentTime.toISOString().split("T")[0],
          )
          .toPromise(),
        this.facultyService
          .getClassSessions(
            this.facultyId,
            undefined,
            this.currentTime.toISOString().split("T")[0],
          )
          .toPromise(),
        this.facultyService.getLeaveRequests(this.facultyId).toPromise(),
      ]);

      this.dashboardStats = stats || null;
      this.facultyProfile = profile || null;
      this.todaySchedule = schedule || [];
      this.upcomingClasses = (classes || []).slice(0, 3);
      this.recentLeaves = (leaves || [])
        .filter((leave) => leave.status === "pending")
        .slice(0, 3);
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  getCurrentClass(): Schedule | null {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTimeStr = now.toTimeString().slice(0, 5);

    return (
      this.todaySchedule.find((schedule) => {
        return (
          schedule.dayOfWeek === currentDay &&
          schedule.startTime <= currentTimeStr &&
          schedule.endTime >= currentTimeStr
        );
      }) || null
    );
  }

  getNextClass(): Schedule | null {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTimeStr = now.toTimeString().slice(0, 5);

    const todayClasses = this.todaySchedule
      .filter(
        (schedule) =>
          schedule.dayOfWeek === currentDay &&
          schedule.startTime > currentTimeStr,
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return todayClasses.length > 0 ? todayClasses[0] : null;
  }

  getAttendanceStatusColor(percentage: number): string {
    if (percentage >= 90) return "success";
    if (percentage >= 75) return "warning";
    return "danger";
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

  getClassTypeIcon(type: string): string {
    switch (type) {
      case "lecture":
        return "pi pi-book";
      case "practical":
        return "pi pi-cog";
      case "lab":
        return "pi pi-desktop";
      default:
        return "pi pi-calendar";
    }
  }

  markAttendance(): void {
    const attendanceData = {
      date: this.currentTime.toISOString().split("T")[0],
      checkInTime: this.currentTime.toTimeString().slice(0, 8),
      status: "present" as const,
    };

    this.facultyService
      .markAttendance(this.facultyId, attendanceData)
      .subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (error) => {
          this.error = this.extractErrorMessage(error);
        },
      });
  }

  navigateToSchedule(): void {
    // Navigation logic would be implemented here
  }

  navigateToAttendance(): void {
    // Navigation logic would be implemented here
  }

  navigateToLeaves(): void {
    // Navigation logic would be implemented here
  }

  navigateToCourses(): void {
    // Navigation logic would be implemented here
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

  refreshData(): void {
    this.loadDashboardData();
  }
}
