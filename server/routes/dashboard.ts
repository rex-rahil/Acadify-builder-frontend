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

export default router;
