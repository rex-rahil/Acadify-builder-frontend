export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rollNumber: string;
  course: string;
  semester: number;
  batch: string;
  joiningDate: Date;
  bloodGroup: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  parentGuardian: {
    name: string;
    relation: string;
    phone: string;
    email?: string;
  };
  profilePicture?: string;
  status: "active" | "inactive" | "graduated";
}

export interface Lecture {
  id: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  startTime: string;
  endTime: string;
  day: string;
  room: string;
  type: "lecture" | "practical" | "tutorial";
  semester: number;
  batch: string;
}

export interface TimetableEntry {
  timeSlot: string;
  monday?: Lecture;
  tuesday?: Lecture;
  wednesday?: Lecture;
  thursday?: Lecture;
  friday?: Lecture;
  saturday?: Lecture;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectCode: string;
  subjectName: string;
  date: Date;
  status: "present" | "absent" | "late";
  lectureType: "lecture" | "practical" | "tutorial";
  faculty: string;
  remarks?: string;
}

export interface AttendanceStats {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  requiredAttendance: number;
  shortfall: number;
  status: "good" | "warning" | "critical";
}

export interface DashboardStats {
  currentSemester: number;
  totalSubjects: number;
  overallAttendance: number;
  pendingAssignments: number;
  upcomingExams: number;
  libraryBooks: number;
  totalCredits: number;
  earnedCredits: number;
}

export interface RecentActivity {
  id: string;
  type: "attendance" | "assignment" | "exam" | "library" | "announcement";
  title: string;
  description: string;
  date: Date;
  status: string;
  icon: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  dueDate: Date;
  status: "pending" | "submitted" | "graded";
  marks?: number;
  totalMarks: number;
  submissionDate?: Date;
}

export interface Exam {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  date: Date;
  time: string;
  duration: string;
  room: string;
  type: "mid-term" | "final" | "practical" | "viva";
  syllabus: string[];
  totalMarks: number;
  status: "upcoming" | "completed";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "academic" | "administrative" | "event" | "urgent";
  publishedBy: string;
  publishedDate: Date;
  priority: "low" | "medium" | "high";
  attachments?: string[];
}
