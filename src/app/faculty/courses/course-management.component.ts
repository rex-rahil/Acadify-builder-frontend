import { Component, OnInit } from "@angular/core";
import { FacultyService } from "../services/faculty.service";
import {
  Subject,
  Schedule,
  ClassSession,
  StudentAttendance,
} from "../models/faculty.interface";

@Component({
  selector: "app-course-management",
  templateUrl: "./course-management.component.html",
  styleUrls: ["./course-management.component.scss"],
})
export class CourseManagementComponent implements OnInit {
  facultyId = "faculty_001"; // This would come from auth service
  loading = true;
  error: string | null = null;

  subjects: Subject[] = [];
  schedule: Schedule[] = [];
  classSessions: ClassSession[] = [];
  selectedSubject: Subject | null = null;
  selectedDate = new Date();

  // Attendance marking
  showAttendanceDialog = false;
  selectedSession: ClassSession | null = null;
  studentAttendance: StudentAttendance[] = [];
  attendanceLoading = false;

  // Filters
  filterDate = new Date();
  selectedSubjectFilter: Subject | null = null;

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.loadCourseData();
  }

  private async loadCourseData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [subjects, schedule, sessions] = await Promise.all([
        this.facultyService.getFacultySubjects(this.facultyId).toPromise(),
        this.facultyService.getFacultySchedule(this.facultyId).toPromise(),
        this.facultyService
          .getClassSessions(
            this.facultyId,
            this.selectedSubjectFilter?.id,
            this.filterDate.toISOString().split("T")[0],
          )
          .toPromise(),
      ]);

      this.subjects = subjects || [];
      this.schedule = schedule || [];
      this.classSessions = sessions || [];
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  onSubjectFilterChange(): void {
    this.loadClassSessions();
  }

  onDateFilterChange(): void {
    this.loadClassSessions();
  }

  private async loadClassSessions(): Promise<void> {
    try {
      const sessions = await this.facultyService
        .getClassSessions(
          this.facultyId,
          this.selectedSubjectFilter?.id,
          this.filterDate.toISOString().split("T")[0],
        )
        .toPromise();
      this.classSessions = sessions || [];
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  getSubjectTypeIcon(type: string): string {
    switch (type) {
      case "theory":
        return "pi pi-book";
      case "practical":
        return "pi pi-cog";
      case "lab":
        return "pi pi-desktop";
      default:
        return "pi pi-book";
    }
  }

  getSubjectTypeSeverity(type: string): string {
    switch (type) {
      case "theory":
        return "info";
      case "practical":
        return "warning";
      case "lab":
        return "success";
      default:
        return "info";
    }
  }

  getScheduleForDay(dayOfWeek: number): Schedule[] {
    return this.schedule
      .filter((item) => item.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getDayName(dayOfWeek: number): string {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek];
  }

  getSessionStatusSeverity(session: ClassSession): string {
    if (session.attendanceMarked) {
      return "success";
    }
    const sessionDate = new Date(session.date);
    const today = new Date();
    if (sessionDate < today) {
      return "danger";
    }
    return "warning";
  }

  getSessionStatusText(session: ClassSession): string {
    if (session.attendanceMarked) {
      return "Completed";
    }
    const sessionDate = new Date(session.date);
    const today = new Date();
    if (sessionDate < today) {
      return "Missed";
    }
    return "Pending";
  }

  openAttendanceDialog(session: ClassSession): void {
    this.selectedSession = session;
    this.generateStudentList();
    this.showAttendanceDialog = true;
  }

  private generateStudentList(): void {
    if (!this.selectedSession) return;

    // Generate mock student data for the session
    this.studentAttendance = [];
    for (let i = 1; i <= this.selectedSession.studentCount; i++) {
      this.studentAttendance.push({
        studentId: `student_${i.toString().padStart(3, "0")}`,
        studentName: `Student ${i}`,
        rollNumber: `${this.selectedSession.semester}${i
          .toString()
          .padStart(3, "0")}`,
        status: "present",
        remarks: "",
      });
    }
  }

  toggleStudentAttendance(student: StudentAttendance): void {
    const statuses: Array<"present" | "absent" | "late"> = [
      "present",
      "absent",
      "late",
    ];
    const currentIndex = statuses.indexOf(student.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    student.status = statuses[nextIndex];
  }

  getAttendanceStatusIcon(status: string): string {
    switch (status) {
      case "present":
        return "pi pi-check-circle";
      case "absent":
        return "pi pi-times-circle";
      case "late":
        return "pi pi-clock";
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
      case "late":
        return "warning";
      default:
        return "info";
    }
  }

  async saveAttendance(): Promise<void> {
    if (!this.selectedSession) return;

    this.attendanceLoading = true;
    try {
      await this.facultyService
        .markStudentAttendance(this.selectedSession.id, this.studentAttendance)
        .toPromise();

      // Update the session as completed
      this.selectedSession.attendanceMarked = true;
      this.selectedSession.presentCount = this.studentAttendance.filter(
        (s) => s.status === "present" || s.status === "late",
      ).length;
      this.selectedSession.absentCount = this.studentAttendance.filter(
        (s) => s.status === "absent",
      ).length;

      this.showAttendanceDialog = false;
      this.selectedSession = null;
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.attendanceLoading = false;
    }
  }

  closeAttendanceDialog(): void {
    this.showAttendanceDialog = false;
    this.selectedSession = null;
    this.studentAttendance = [];
  }

  markAllPresent(): void {
    this.studentAttendance.forEach((student) => {
      student.status = "present";
    });
  }

  markAllAbsent(): void {
    this.studentAttendance.forEach((student) => {
      student.status = "absent";
    });
  }

  getPresentCount(): number {
    return this.studentAttendance.filter(
      (s) => s.status === "present" || s.status === "late",
    ).length;
  }

  getAbsentCount(): number {
    return this.studentAttendance.filter((s) => s.status === "absent").length;
  }

  refreshData(): void {
    this.loadCourseData();
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
