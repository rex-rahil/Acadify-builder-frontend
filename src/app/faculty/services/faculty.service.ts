import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  FacultyProfile,
  Department,
  Subject,
  Schedule,
  FacultyAttendance,
  AttendanceStats,
  LeaveRequest,
  LeaveBalance,
  FacultyDashboardStats,
  ClassSession,
  StudentAttendance,
  FacultyAssignment,
  WorkloadSummary,
} from "../models/faculty.interface";

@Injectable({
  providedIn: "root",
})
export class FacultyService {
  private apiUrl = "http://localhost:3001";

  constructor(private http: HttpClient) {}

  // Dashboard APIs
  getDashboardStats(facultyId: string): Observable<FacultyDashboardStats> {
    return this.http
      .get<any[]>(`${this.apiUrl}/dashboardStats?facultyId=${facultyId}`)
      .pipe(
        map((stats: any[]) => stats[0] || {}),
        catchError(this.handleError),
      );
  }

  getFacultyProfile(facultyId: string): Observable<FacultyProfile> {
    return this.http
      .get<FacultyProfile>(`${this.apiUrl}/facultyProfiles/${facultyId}`)
      .pipe(catchError(this.handleError));
  }

  updateFacultyProfile(
    facultyId: string,
    profile: Partial<FacultyProfile>,
  ): Observable<FacultyProfile> {
    return this.http
      .put<FacultyProfile>(
        `${this.apiUrl}/facultyProfiles/${facultyId}`,
        profile,
      )
      .pipe(catchError(this.handleError));
  }

  // Subject and Schedule APIs
  getFacultySubjects(facultyId: string): Observable<Subject[]> {
    return this.http
      .get<Subject[]>(`${this.apiUrl}/subjects/${facultyId}`)
      .pipe(catchError(this.handleError));
  }

  getFacultySchedule(facultyId: string, date?: string): Observable<Schedule[]> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date);
    }
    return this.http
      .get<Schedule[]>(`${this.apiUrl}/schedule/${facultyId}`, { params })
      .pipe(catchError(this.handleError));
  }

  getClassSessions(
    facultyId: string,
    subjectId?: string,
    date?: string,
  ): Observable<ClassSession[]> {
    let params = new HttpParams();
    if (subjectId) {
      params = params.set("subjectId", subjectId);
    }
    if (date) {
      params = params.set("date", date);
    }
    return this.http
      .get<ClassSession[]>(`${this.apiUrl}/classes/${facultyId}`, { params })
      .pipe(catchError(this.handleError));
  }

  // Attendance APIs
  getFacultyAttendance(
    facultyId: string,
    startDate?: string,
    endDate?: string,
  ): Observable<FacultyAttendance[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set("startDate", startDate);
    }
    if (endDate) {
      params = params.set("endDate", endDate);
    }
    return this.http
      .get<
        FacultyAttendance[]
      >(`${this.apiUrl}/attendance/${facultyId}`, { params })
      .pipe(catchError(this.handleError));
  }

  getAttendanceStats(
    facultyId: string,
    month?: string,
    year?: string,
  ): Observable<AttendanceStats> {
    let params = new HttpParams();
    if (month) {
      params = params.set("month", month);
    }
    if (year) {
      params = params.set("year", year);
    }
    return this.http
      .get<AttendanceStats>(`${this.apiUrl}/attendance/stats/${facultyId}`, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  markAttendance(
    facultyId: string,
    attendanceData: Partial<FacultyAttendance>,
  ): Observable<FacultyAttendance> {
    return this.http
      .post<FacultyAttendance>(
        `${this.apiUrl}/attendance/${facultyId}`,
        attendanceData,
      )
      .pipe(catchError(this.handleError));
  }

  markStudentAttendance(
    classSessionId: string,
    attendanceList: StudentAttendance[],
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/classes/${classSessionId}/attendance`, {
        attendanceList,
      })
      .pipe(catchError(this.handleError));
  }

  // Leave Management APIs
  getLeaveRequests(
    facultyId: string,
    status?: string,
  ): Observable<LeaveRequest[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set("status", status);
    }
    return this.http
      .get<LeaveRequest[]>(`${this.apiUrl}/leaves/${facultyId}`, { params })
      .pipe(catchError(this.handleError));
  }

  getLeaveBalance(facultyId: string): Observable<LeaveBalance> {
    return this.http
      .get<LeaveBalance>(`${this.apiUrl}/leaves/balance/${facultyId}`)
      .pipe(catchError(this.handleError));
  }

  applyLeave(
    facultyId: string,
    leaveRequest: Partial<LeaveRequest>,
  ): Observable<LeaveRequest> {
    return this.http
      .post<LeaveRequest>(`${this.apiUrl}/leaves/${facultyId}`, leaveRequest)
      .pipe(catchError(this.handleError));
  }

  updateLeaveRequest(
    leaveId: string,
    updateData: Partial<LeaveRequest>,
  ): Observable<LeaveRequest> {
    return this.http
      .put<LeaveRequest>(`${this.apiUrl}/leaves/request/${leaveId}`, updateData)
      .pipe(catchError(this.handleError));
  }

  // HOD APIs
  getDepartmentFaculty(departmentId: string): Observable<FacultyProfile[]> {
    return this.http
      .get<
        FacultyProfile[]
      >(`${this.apiUrl}/hod/department/${departmentId}/faculty`)
      .pipe(catchError(this.handleError));
  }

  getDepartmentSubjects(departmentId: string): Observable<Subject[]> {
    return this.http
      .get<Subject[]>(`${this.apiUrl}/hod/department/${departmentId}/subjects`)
      .pipe(catchError(this.handleError));
  }

  getFacultyAssignments(departmentId: string): Observable<FacultyAssignment[]> {
    return this.http
      .get<
        FacultyAssignment[]
      >(`${this.apiUrl}/hod/department/${departmentId}/assignments`)
      .pipe(catchError(this.handleError));
  }

  assignFacultyToSubject(
    assignment: Partial<FacultyAssignment>,
  ): Observable<FacultyAssignment> {
    return this.http
      .post<FacultyAssignment>(`${this.apiUrl}/hod/assignments`, assignment)
      .pipe(catchError(this.handleError));
  }

  updateFacultyAssignment(
    assignmentId: string,
    updateData: Partial<FacultyAssignment>,
  ): Observable<FacultyAssignment> {
    return this.http
      .put<FacultyAssignment>(
        `${this.apiUrl}/hod/assignments/${assignmentId}`,
        updateData,
      )
      .pipe(catchError(this.handleError));
  }

  removeFacultyAssignment(assignmentId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/hod/assignments/${assignmentId}`)
      .pipe(catchError(this.handleError));
  }

  getWorkloadSummary(departmentId: string): Observable<WorkloadSummary[]> {
    return this.http
      .get<
        WorkloadSummary[]
      >(`${this.apiUrl}/hod/department/${departmentId}/workload`)
      .pipe(catchError(this.handleError));
  }

  getPendingLeaveRequests(departmentId: string): Observable<LeaveRequest[]> {
    return this.http
      .get<
        LeaveRequest[]
      >(`${this.apiUrl}/hod/department/${departmentId}/leaves/pending`)
      .pipe(catchError(this.handleError));
  }

  approveLeaveRequest(
    leaveId: string,
    remarks?: string,
  ): Observable<LeaveRequest> {
    return this.http
      .put<LeaveRequest>(`${this.apiUrl}/hod/leaves/${leaveId}/approve`, {
        remarks,
      })
      .pipe(catchError(this.handleError));
  }

  rejectLeaveRequest(
    leaveId: string,
    reason: string,
  ): Observable<LeaveRequest> {
    return this.http
      .put<LeaveRequest>(`${this.apiUrl}/hod/leaves/${leaveId}/reject`, {
        reason,
      })
      .pipe(catchError(this.handleError));
  }

  // Department APIs
  getDepartments(): Observable<Department[]> {
    return this.http
      .get<Department[]>(`${this.apiUrl}/departments`)
      .pipe(catchError(this.handleError));
  }

  getDepartment(departmentId: string): Observable<Department> {
    return this.http
      .get<Department>(`${this.apiUrl}/departments/${departmentId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
