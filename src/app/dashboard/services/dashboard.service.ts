import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  StudentProfile,
  TimetableEntry,
  AttendanceRecord,
  AttendanceStats,
  DashboardStats,
  RecentActivity,
  Assignment,
  Exam,
  Announcement,
} from "../models/dashboard.interface";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiUrl = "/api/dashboard";

  constructor(private http: HttpClient) {}

  // Dashboard overview
  getDashboardStats(studentId: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats/${studentId}`);
  }

  getRecentActivities(studentId: string): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(
      `${this.apiUrl}/activities/${studentId}`,
    );
  }

  // Profile management
  getStudentProfile(studentId: string): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/profile/${studentId}`);
  }

  updateStudentProfile(
    studentId: string,
    profile: Partial<StudentProfile>,
  ): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(
      `${this.apiUrl}/profile/${studentId}`,
      profile,
    );
  }

  uploadProfilePicture(studentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return this.http.post(
      `${this.apiUrl}/profile/${studentId}/picture`,
      formData,
    );
  }

  // Timetable
  getTimetable(
    studentId: string,
    semester?: number,
  ): Observable<TimetableEntry[]> {
    const params = semester ? { semester: semester.toString() } : {};
    return this.http.get<TimetableEntry[]>(
      `${this.apiUrl}/timetable/${studentId}`,
      { params },
    );
  }

  // Attendance
  getAttendanceStats(
    studentId: string,
    semester?: number,
  ): Observable<AttendanceStats[]> {
    const params = semester ? { semester: semester.toString() } : {};
    return this.http.get<AttendanceStats[]>(
      `${this.apiUrl}/attendance/stats/${studentId}`,
      { params },
    );
  }

  getAttendanceRecords(
    studentId: string,
    subjectCode?: string,
    fromDate?: Date,
    toDate?: Date,
  ): Observable<AttendanceRecord[]> {
    let params: any = {};
    if (subjectCode) params.subjectCode = subjectCode;
    if (fromDate) params.fromDate = fromDate.toISOString().split("T")[0];
    if (toDate) params.toDate = toDate.toISOString().split("T")[0];

    return this.http.get<AttendanceRecord[]>(
      `${this.apiUrl}/attendance/records/${studentId}`,
      { params },
    );
  }

  // Assignments
  getAssignments(studentId: string, status?: string): Observable<Assignment[]> {
    const params = status ? { status } : {};
    return this.http.get<Assignment[]>(
      `${this.apiUrl}/assignments/${studentId}`,
      { params },
    );
  }

  submitAssignment(
    assignmentId: string,
    file: File,
    notes?: string,
  ): Observable<any> {
    const formData = new FormData();
    formData.append("assignment", file);
    if (notes) formData.append("notes", notes);
    return this.http.post(
      `${this.apiUrl}/assignments/${assignmentId}/submit`,
      formData,
    );
  }

  // Exams
  getExams(studentId: string, upcoming: boolean = true): Observable<Exam[]> {
    const params = { upcoming: upcoming.toString() };
    return this.http.get<Exam[]>(`${this.apiUrl}/exams/${studentId}`, {
      params,
    });
  }

  // Announcements
  getAnnouncements(category?: string): Observable<Announcement[]> {
    const params = category ? { category } : {};
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`, {
      params,
    });
  }

  markAnnouncementRead(announcementId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/announcements/${announcementId}/read`,
      {},
    );
  }
}
