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
      .get<Subject[]>(`${this.apiUrl}/subjects?assignedFacultyId=${facultyId}`)
      .pipe(catchError(this.handleError));
  }

  getFacultySchedule(facultyId: string, date?: string): Observable<Schedule[]> {
    return this.http
      .get<Schedule[]>(`${this.apiUrl}/schedules?facultyId=${facultyId}`)
      .pipe(catchError(this.handleError));
  }

  getClassSessions(
    facultyId: string,
    subjectId?: string,
    date?: string,
  ): Observable<ClassSession[]> {
    let url = `${this.apiUrl}/classSessions?facultyId=${facultyId}`;
    if (subjectId) {
      url += `&subjectId=${subjectId}`;
    }
    if (date) {
      url += `&date=${date}`;
    }
    return this.http
      .get<ClassSession[]>(url)
      .pipe(catchError(this.handleError));
  }

  // Attendance APIs
  getFacultyAttendance(
    facultyId: string,
    startDate?: string,
    endDate?: string,
  ): Observable<FacultyAttendance[]> {
    return this.http
      .get<
        FacultyAttendance[]
      >(`${this.apiUrl}/facultyAttendance?facultyId=${facultyId}`)
      .pipe(catchError(this.handleError));
  }

  getAttendanceStats(
    facultyId: string,
    month?: string,
    year?: string,
  ): Observable<AttendanceStats> {
    let url = `${this.apiUrl}/attendanceStats?facultyId=${facultyId}`;
    if (month) {
      url += `&month=${month}`;
    }
    if (year) {
      url += `&year=${year}`;
    }
    return this.http.get<any[]>(url).pipe(
      map((stats: any[]) => stats[0] || {}),
      catchError(this.handleError),
    );
  }

  markAttendance(
    facultyId: string,
    attendanceData: Partial<FacultyAttendance>,
  ): Observable<FacultyAttendance> {
    const newAttendance = {
      id: `att_${Date.now()}`,
      facultyId,
      ...attendanceData,
    };
    return this.http
      .post<FacultyAttendance>(
        `${this.apiUrl}/facultyAttendance`,
        newAttendance,
      )
      .pipe(catchError(this.handleError));
  }

  markStudentAttendance(
    classSessionId: string,
    attendanceList: StudentAttendance[],
  ): Observable<any> {
    // Update the class session to mark attendance as completed
    return this.http
      .get<ClassSession>(`${this.apiUrl}/classSessions/${classSessionId}`)
      .pipe(
        switchMap((session: ClassSession) => {
          const updatedSession = {
            ...session,
            attendanceMarked: true,
            presentCount: attendanceList.filter(
              (s) => s.status === "present" || s.status === "late",
            ).length,
            absentCount: attendanceList.filter((s) => s.status === "absent")
              .length,
          };
          return this.http.put(
            `${this.apiUrl}/classSessions/${classSessionId}`,
            updatedSession,
          );
        }),
        catchError(this.handleError),
      );
  }

  // Leave Management APIs
  getLeaveRequests(
    facultyId: string,
    status?: string,
  ): Observable<LeaveRequest[]> {
    let url = `${this.apiUrl}/leaveRequests?facultyId=${facultyId}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http
      .get<LeaveRequest[]>(url)
      .pipe(catchError(this.handleError));
  }

  getLeaveBalance(facultyId: string): Observable<LeaveBalance> {
    return this.http
      .get<any[]>(`${this.apiUrl}/leaveBalances?facultyId=${facultyId}`)
      .pipe(
        map((balances: any[]) => balances[0] || {}),
        catchError(this.handleError),
      );
  }

  applyLeave(
    facultyId: string,
    leaveRequest: Partial<LeaveRequest>,
  ): Observable<LeaveRequest> {
    const newLeave = {
      id: `leave_${Date.now()}`,
      facultyId,
      facultyName: "Current Faculty", // This would be fetched from profile
      ...leaveRequest,
    };
    return this.http
      .post<LeaveRequest>(`${this.apiUrl}/leaveRequests`, newLeave)
      .pipe(catchError(this.handleError));
  }

  updateLeaveRequest(
    leaveId: string,
    updateData: Partial<LeaveRequest>,
  ): Observable<LeaveRequest> {
    return this.http
      .put<LeaveRequest>(`${this.apiUrl}/leaveRequests/${leaveId}`, updateData)
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
