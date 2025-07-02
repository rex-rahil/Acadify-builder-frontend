import { Component, OnInit } from "@angular/core";
import { FacultyService } from "../services/faculty.service";
import {
  FacultyAttendance,
  AttendanceStats,
  FacultyProfile,
} from "../models/faculty.interface";

@Component({
  selector: "app-faculty-attendance",
  templateUrl: "./faculty-attendance.component.html",
  styleUrls: ["./faculty-attendance.component.scss"],
})
export class FacultyAttendanceComponent implements OnInit {
  facultyId = "faculty_001"; // This would come from auth service
  loading = true;
  error: string | null = null;

  facultyProfile: FacultyProfile | null = null;
  attendanceRecords: FacultyAttendance[] = [];
  attendanceStats: AttendanceStats | null = null;

  // Date filters
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
  endDate = new Date(this.selectedYear, this.selectedMonth, 0);

  // Quick attendance marking
  showQuickMarkDialog = false;
  quickMarkLoading = false;
  checkInTime = new Date();
  checkOutTime = new Date();
  checkInTimeString = "";
  checkOutTimeString = "";
  attendanceStatus: "present" | "half-day" | "late" = "present";
  remarks = "";

  // Calendar data
  calendarData: any[] = [];
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  months = Array.from({ length: 12 }, (_, i) => ({
    label: this.monthNames[i],
    value: i + 1,
  }));

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.loadAttendanceData();
    this.loadFacultyProfile();
  }

  private async loadFacultyProfile(): Promise<void> {
    try {
      this.facultyProfile =
        (await this.facultyService
          .getFacultyProfile(this.facultyId)
          .toPromise()) || null;
    } catch (error: any) {
      // Profile loading error is not critical
      console.error("Failed to load faculty profile:", error);
    }
  }

  private async loadAttendanceData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [records, stats] = await Promise.all([
        this.facultyService
          .getFacultyAttendance(
            this.facultyId,
            this.startDate.toISOString().split("T")[0],
            this.endDate.toISOString().split("T")[0],
          )
          .toPromise(),
        this.facultyService
          .getAttendanceStats(
            this.facultyId,
            this.selectedMonth.toString(),
            this.selectedYear.toString(),
          )
          .toPromise(),
      ]);

      this.attendanceRecords = records || [];
      this.attendanceStats = stats || null;
      this.generateCalendarData();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  onMonthYearChange(): void {
    this.startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.endDate = new Date(this.selectedYear, this.selectedMonth, 0);
    this.loadAttendanceData();
  }

  private generateCalendarData(): void {
    this.calendarData = [];
    const daysInMonth = this.endDate.getDate();
    const firstDay = this.startDate.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      this.calendarData.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.selectedYear, this.selectedMonth - 1, day);
      const dateStr = date.toISOString().split("T")[0];
      const attendance = this.attendanceRecords.find(
        (record) => record.date === dateStr,
      );

      this.calendarData.push({
        day,
        date: dateStr,
        attendance,
        isToday: this.isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getAttendanceStatusClass(status: string): string {
    switch (status) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "half-day":
        return "status-half-day";
      case "late":
        return "status-late";
      case "on-leave":
        return "status-leave";
      default:
        return "status-default";
    }
  }

  getAttendanceStatusIcon(status: string): string {
    switch (status) {
      case "present":
        return "pi pi-check-circle";
      case "absent":
        return "pi pi-times-circle";
      case "half-day":
        return "pi pi-clock";
      case "late":
        return "pi pi-exclamation-triangle";
      case "on-leave":
        return "pi pi-calendar-times";
      default:
        return "pi pi-question-circle";
    }
  }

  getAttendanceStatusColor(status: string): string {
    switch (status) {
      case "present":
        return "success";
      case "absent":
        return "danger";
      case "half-day":
        return "warning";
      case "late":
        return "warning";
      case "on-leave":
        return "info";
      default:
        return "secondary";
    }
  }

  openQuickMarkDialog(): void {
    const now = new Date();
    this.checkInTime = now;
    this.checkOutTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours later
    this.attendanceStatus = "present";
    this.remarks = "";
    this.showQuickMarkDialog = true;
  }

  closeQuickMarkDialog(): void {
    this.showQuickMarkDialog = false;
    this.quickMarkLoading = false;
  }

  async markAttendance(): Promise<void> {
    this.quickMarkLoading = true;
    try {
      const attendanceData = {
        date: new Date().toISOString().split("T")[0],
        checkInTime: this.formatTime(this.checkInTime),
        checkOutTime: this.formatTime(this.checkOutTime),
        status: this.attendanceStatus,
        workingHours: this.calculateWorkingHours(),
        remarks: this.remarks,
      };

      await this.facultyService
        .markAttendance(this.facultyId, attendanceData)
        .toPromise();

      await this.loadAttendanceData();
      this.closeQuickMarkDialog();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.quickMarkLoading = false;
    }
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 8);
  }

  calculateWorkingHours(): number {
    const diff = this.checkOutTime.getTime() - this.checkInTime.getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getDayName(dayIndex: number): string {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayIndex];
  }

  getStatsColor(percentage: number): string {
    if (percentage >= 90) return "success";
    if (percentage >= 75) return "warning";
    return "danger";
  }

  exportAttendance(): void {
    const csvContent = this.convertToCSV(this.attendanceRecords);
    this.downloadCSV(
      csvContent,
      `attendance-${this.selectedMonth}-${this.selectedYear}.csv`,
    );
  }

  private convertToCSV(data: FacultyAttendance[]): string {
    const headers = [
      "Date",
      "Check In",
      "Check Out",
      "Status",
      "Working Hours",
      "Remarks",
    ];

    const rows = data.map((record) => [
      record.date,
      record.checkInTime || "",
      record.checkOutTime || "",
      record.status,
      record.workingHours?.toString() || "",
      record.remarks || "",
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
    this.loadAttendanceData();
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
