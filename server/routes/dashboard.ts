import express, { Request, Response } from "express";

const router = express.Router();

// Mock dashboard data
const mockDashboardStats = {
  currentSemester: 4,
  totalSubjects: 8,
  overallAttendance: 82,
  pendingAssignments: 3,
  upcomingExams: 2,
  libraryBooks: 2,
  totalCredits: 160,
  earnedCredits: 120,
};

const mockActivities = [
  {
    id: "1",
    type: "attendance",
    title: "Pharmacology Lecture",
    description: "Attended today's lecture on Drug Metabolism",
    date: new Date(),
    status: "completed",
    icon: "pi pi-check-circle",
  },
  {
    id: "2",
    type: "assignment",
    title: "Chemistry Assignment Due",
    description: "Organic Chemistry assignment submission deadline approaching",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "pending",
    icon: "pi pi-file-edit",
  },
];

const mockAssignments = [
  {
    id: "1",
    title: "Pharmaceutical Analysis Report",
    subjectCode: "PC401",
    subjectName: "Pharmaceutical Analysis",
    description: "Analyze the given drug samples using spectrophotometry",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "pending",
    totalMarks: 50,
  },
];

const mockExams = [
  {
    id: "1",
    title: "Mid-Term Examination",
    subjectCode: "PC402",
    subjectName: "Pharmacology",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    duration: "3 hours",
    room: "Room 201",
    type: "mid-term",
    totalMarks: 100,
    status: "upcoming",
    syllabus: ["Drug Receptors", "Pharmacokinetics", "Enzyme Inhibition"],
  },
];

const mockAnnouncements = [
  {
    id: "1",
    title: "Library New Arrivals",
    content:
      "New pharmaceutical reference books have been added to the library collection. Students can check them out starting Monday.",
    category: "library",
    publishedBy: "Library Department",
    publishedDate: new Date(),
    priority: "medium",
  },
];

// Mock timetable data
const mockTimetable = [
  {
    timeSlot: "09:00 - 10:00",
    monday: {
      id: "1",
      subjectCode: "PC401",
      subjectName: "Pharmaceutical Analysis",
      faculty: "Dr. Smith",
      startTime: "09:00",
      endTime: "10:00",
      day: "Monday",
      room: "Lab 1",
      type: "practical",
      semester: 4,
      batch: "B.Pharm IV",
    },
    tuesday: {
      id: "2",
      subjectCode: "PC402",
      subjectName: "Pharmacology",
      faculty: "Dr. Johnson",
      startTime: "09:00",
      endTime: "10:00",
      day: "Tuesday",
      room: "Room 201",
      type: "lecture",
      semester: 4,
      batch: "B.Pharm IV",
    },
  },
  {
    timeSlot: "10:00 - 11:00",
    wednesday: {
      id: "3",
      subjectCode: "PC403",
      subjectName: "Pharmaceutical Chemistry",
      faculty: "Dr. Brown",
      startTime: "10:00",
      endTime: "11:00",
      day: "Wednesday",
      room: "Room 202",
      type: "lecture",
      semester: 4,
      batch: "B.Pharm IV",
    },
  },
];

// Mock attendance data
const mockAttendanceStats = [
  {
    subjectCode: "PC401",
    subjectName: "Pharmaceutical Analysis",
    totalClasses: 20,
    attendedClasses: 18,
    attendancePercentage: 90,
    requiredAttendance: 75,
    shortfall: 0,
    status: "good",
  },
  {
    subjectCode: "PC402",
    subjectName: "Pharmacology",
    totalClasses: 25,
    attendedClasses: 20,
    attendancePercentage: 80,
    requiredAttendance: 75,
    shortfall: 0,
    status: "good",
  },
  {
    subjectCode: "PC403",
    subjectName: "Pharmaceutical Chemistry",
    totalClasses: 22,
    attendedClasses: 15,
    attendancePercentage: 68,
    requiredAttendance: 75,
    shortfall: 2,
    status: "warning",
  },
];

// Mock student profile
const mockStudentProfile = {
  id: "OCP2024001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@ocp.edu",
  phone: "+91 9876543210",
  rollNumber: "OCP2024001",
  course: "B.Pharm",
  semester: 4,
  batch: "2021-2025",
  joiningDate: new Date("2021-09-01"),
  bloodGroup: "B+",
  address: {
    street: "123 College Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
  parentGuardian: {
    name: "Robert Doe",
    relation: "Father",
    phone: "+91 9876543211",
    email: "robert.doe@email.com",
  },
  status: "active",
};

// GET /api/dashboard/stats/:studentId
router.get("/stats/:studentId", (req: Request, res: Response) => {
  res.json(mockDashboardStats);
});

// GET /api/dashboard/activities/:studentId
router.get("/activities/:studentId", (req: Request, res: Response) => {
  res.json(mockActivities);
});

// GET /api/dashboard/assignments/:studentId
router.get("/assignments/:studentId", (req: Request, res: Response) => {
  const { status } = req.query;
  let filteredAssignments = mockAssignments;

  if (status) {
    filteredAssignments = mockAssignments.filter((a) => a.status === status);
  }

  res.json(filteredAssignments);
});

// GET /api/dashboard/exams/:studentId
router.get("/exams/:studentId", (req: Request, res: Response) => {
  res.json(mockExams);
});

// GET /api/dashboard/announcements
router.get("/announcements", (req: Request, res: Response) => {
  res.json(mockAnnouncements);
});

// GET /api/dashboard/timetable/:studentId
router.get("/timetable/:studentId", (req: Request, res: Response) => {
  res.json(mockTimetable);
});

// GET /api/dashboard/attendance/stats/:studentId
router.get("/attendance/stats/:studentId", (req: Request, res: Response) => {
  res.json(mockAttendanceStats);
});

// GET /api/dashboard/profile/:studentId
router.get("/profile/:studentId", (req: Request, res: Response) => {
  res.json(mockStudentProfile);
});

// PUT /api/dashboard/profile/:studentId
router.put("/profile/:studentId", (req: Request, res: Response) => {
  const updatedProfile = { ...mockStudentProfile, ...req.body };
  res.json(updatedProfile);
});

export default router;
