export interface FacultyProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  qualifications: string[];
  avatar?: string;
  isHOD?: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodId: string;
  facultyCount: number;
  subjectCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: number;
  credits: number;
  type: "theory" | "practical" | "lab";
  assignedFacultyId?: string;
  assignedFacultyName?: string;
}

export interface Schedule {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  roomNumber: string;
  semester: number;
  type: "lecture" | "practical" | "lab";
  studentCount?: number;
}

export interface FacultyAttendance {
  id: string;
  facultyId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "present" | "absent" | "half-day" | "late" | "on-leave";
  workingHours?: number;
  remarks?: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  attendancePercentage: number;
  averageWorkingHours: number;
}

export interface LeaveRequest {
  id: string;
  facultyId: string;
  facultyName: string;
  leaveType: "casual" | "sick" | "earned" | "maternity" | "emergency";
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  documents?: string[];
}

export interface LeaveBalance {
  casual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  earned: { total: number; used: number; remaining: number };
  maternity: { total: number; used: number; remaining: number };
}

export interface FacultyDashboardStats {
  totalSubjects: number;
  totalClasses: number;
  todayClasses: number;
  attendancePercentage: number;
  leaveBalance: number;
  pendingLeaves: number;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  semester: number;
  attendanceMarked: boolean;
  studentCount: number;
  presentCount?: number;
  absentCount?: number;
}

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface FacultyAssignment {
  id: string;
  facultyId: string;
  facultyName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  assignedDate: string;
  assignedBy: string; // HOD ID
  workload: number; // hours per week
  status: "active" | "inactive";
}

export interface WorkloadSummary {
  facultyId: string;
  facultyName: string;
  totalSubjects: number;
  totalHours: number;
  theoryHours: number;
  practicalHours: number;
  labHours: number;
  maxWorkload: number;
  workloadPercentage: number;
}
