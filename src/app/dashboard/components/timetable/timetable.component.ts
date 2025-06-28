import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { TimetableEntry, Lecture } from "../../models/dashboard.interface";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.scss"],
  providers: [MessageService],
})
export class TimetableComponent implements OnInit {
  currentStudentId = "OCP2024001";

  timetableData: TimetableEntry[] = [];
  selectedSemester = 4;
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:15 - 12:15",
    "12:15 - 01:15",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:15 - 05:15",
  ];

  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadTimetable();
  }

  loadTimetable() {
    this.loading = true;

    this.dashboardService
      .getTimetable(this.currentStudentId, this.selectedSemester)
      .subscribe({
        next: (timetable) => {
          this.timetableData = timetable;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading timetable:", error);
          const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Failed to load timetable";
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
          });
          this.loading = false;
        },
      });
  }

  onSemesterChange() {
    this.loadTimetable();
  }

  getLectureForSlot(timeSlot: string, day: string): Lecture | null {
    const entry = this.timetableData.find((t) => t.timeSlot === timeSlot);
    if (!entry) return null;

    const dayKey = day.toLowerCase() as keyof TimetableEntry;
    return (entry[dayKey] as Lecture) || null;
  }

  getLectureTypeClass(type: string): string {
    switch (type) {
      case "lecture":
        return "lecture-type";
      case "practical":
        return "practical-type";
      case "tutorial":
        return "tutorial-type";
      default:
        return "";
    }
  }

  getCurrentDayClass(day: string): string {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return today === day ? "current-day" : "";
  }

  getCurrentTimeSlotClass(timeSlot: string): string {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const [startTime] = timeSlot.split(" - ");
    const [hours, minutes] = startTime.split(":").map(Number);
    const slotTime = hours * 100 + minutes;

    const slotEndTime = slotTime + 100; // Assuming 1-hour slots

    if (currentTime >= slotTime && currentTime < slotEndTime) {
      return "current-time-slot";
    }

    return "";
  }

  exportTimetable() {
    // Implementation for exporting timetable as PDF/image
    this.messageService.add({
      severity: "info",
      summary: "Export",
      detail: "Timetable export feature coming soon!",
    });
  }

  getTodayClassCount(): number {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const dayKey = today.toLowerCase() as keyof TimetableEntry;

    return this.timetableData.filter((entry) => entry[dayKey]).length;
  }

  getNextClass(): string {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    const dayKey = today.toLowerCase() as keyof TimetableEntry;

    for (const entry of this.timetableData) {
      const [startTime] = entry.timeSlot.split(" - ");
      const [hours, minutes] = startTime.split(":").map(Number);
      const slotTime = hours * 100 + minutes;

      if (slotTime > currentTime && entry[dayKey]) {
        const lecture = entry[dayKey] as Lecture;
        return `${lecture.subjectCode} at ${startTime}`;
      }
    }

    return "No more classes today";
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
