import express from "express";

const router = express.Router();

// Mock Data
const mockFacultyProfiles = [
  {
    id: "faculty_001",
    employeeId: "EMP001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@college.edu",
    phone: "+1234567890",
    department: "Computer Science",
    designation: "Associate Professor",
    joiningDate: "2020-06-15",
    qualifications: ["PhD Computer Science", "M.Tech Software Engineering"],
    avatar: null,
    isHOD: true,
  },
  {
    id: "faculty_002",
    employeeId: "EMP002",
    name: "Prof. Michael Smith",
    email: "michael.smith@college.edu",
    phone: "+1234567891",
    department: "Computer Science",
    designation: "Assistant Professor",
    joiningDate: "2019-08-20",
    qualifications: ["M.Tech Computer Science", "B.Tech CSE"],
    avatar: null,
    isHOD: false,
  },
];

const mockSubjects = [
  {
    id: "subject_001",
    name: "Data Structures and Algorithms",
    code: "CS201",
    departmentId: "dept_001",
    semester: 3,
    credits: 4,
    type: "theory",
    assignedFacultyId: "faculty_001",
    assignedFacultyName: "Dr. Sarah Johnson",
  },
  {
    id: "subject_002",
    name: "Database Management Systems",
    code: "CS301",
    departmentId: "dept_001",
    semester: 5,
    credits: 3,
    type: "theory",
    assignedFacultyId: "faculty_002",
    assignedFacultyName: "Prof. Michael Smith",
  },
  {
    id: "subject_003",
    name: "Operating Systems Lab",
    code: "CS302L",
    departmentId: "dept_001",
    semester: 5,
    credits: 2,
    type: "lab",
    assignedFacultyId: null,
    assignedFacultyName: null,
  },
];

const mockSchedule = [
  {
    id: "schedule_001",
    subjectId: "subject_001",
    subjectName: "Data Structures and Algorithms",
    subjectCode: "CS201",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    roomNumber: "A101",
    semester: 3,
    type: "lecture",
    studentCount: 60,
  },
  {
    id: "schedule_002",
    subjectId: "subject_001",
    subjectName: "Data Structures and Algorithms",
    subjectCode: "CS201",
    dayOfWeek: 3,
    startTime: "11:00",
    endTime: "12:00",
    roomNumber: "A101",
    semester: 3,
    type: "lecture",
    studentCount: 60,
  },
  {
    id: "schedule_003",
    subjectId: "subject_002",
    subjectName: "Database Management Systems",
    subjectCode: "CS301",
    dayOfWeek: 2,
    startTime: "14:00",
    endTime: "15:00",
    roomNumber: "B201",
    semester: 5,
    type: "lecture",
    studentCount: 45,
  },
];

const mockClassSessions = [
  {
    id: "session_001",
    subjectId: "subject_001",
    subjectName: "Data Structures and Algorithms",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "10:00",
    roomNumber: "A101",
    semester: 3,
    attendanceMarked: true,
    studentCount: 60,
    presentCount: 55,
    absentCount: 5,
  },
  {
    id: "session_002",
    subjectId: "subject_001",
    subjectName: "Data Structures and Algorithms",
    date: "2024-01-17",
    startTime: "11:00",
    endTime: "12:00",
    roomNumber: "A101",
    semester: 3,
    attendanceMarked: false,
    studentCount: 60,
    presentCount: null,
    absentCount: null,
  },
];

const mockFacultyAttendance = [
  {
    id: "att_001",
    facultyId: "faculty_001",
    date: "2024-01-15",
    checkInTime: "08:30:00",
    checkOutTime: "17:00:00",
    status: "present",
    workingHours: 8.5,
    remarks: null,
  },
  {
    id: "att_002",
    facultyId: "faculty_001",
    date: "2024-01-16",
    checkInTime: "09:15:00",
    checkOutTime: "17:30:00",
    status: "late",
    workingHours: 8.25,
    remarks: "Traffic delay",
  },
];

const mockLeaveRequests = [
  {
    id: "leave_001",
    facultyId: "faculty_001",
    facultyName: "Dr. Sarah Johnson",
    leaveType: "casual",
    startDate: "2024-01-25",
    endDate: "2024-01-26",
    duration: 2,
    reason: "Personal work",
    status: "approved",
    appliedDate: "2024-01-20T10:00:00Z",
    approvedBy: "Dean Office",
    approvedDate: "2024-01-21T14:30:00Z",
    rejectionReason: null,
    documents: [],
  },
  {
    id: "leave_002",
    facultyId: "faculty_001",
    facultyName: "Dr. Sarah Johnson",
    leaveType: "sick",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    duration: 3,
    reason: "Medical treatment",
    status: "pending",
    appliedDate: "2024-02-08T09:00:00Z",
    approvedBy: null,
    approvedDate: null,
    rejectionReason: null,
    documents: ["medical_certificate.pdf"],
  },
];

const mockFacultyAssignments = [
  {
    id: "assign_001",
    facultyId: "faculty_001",
    facultyName: "Dr. Sarah Johnson",
    subjectId: "subject_001",
    subjectName: "Data Structures and Algorithms",
    subjectCode: "CS201",
    semester: 3,
    assignedDate: "2024-01-01T00:00:00Z",
    assignedBy: "faculty_001",
    workload: 4,
    status: "active",
  },
  {
    id: "assign_002",
    facultyId: "faculty_002",
    facultyName: "Prof. Michael Smith",
    subjectId: "subject_002",
    subjectName: "Database Management Systems",
    subjectCode: "CS301",
    semester: 5,
    assignedDate: "2024-01-01T00:00:00Z",
    assignedBy: "faculty_001",
    workload: 3,
    status: "active",
  },
];

// Dashboard APIs
router.get("/dashboard/stats/:facultyId", (req, res) => {
  const { facultyId } = req.params;

  const stats = {
    totalSubjects: 2,
    totalClasses: 6,
    todayClasses: 1,
    attendancePercentage: 95.5,
    leaveBalance: 8,
    pendingLeaves: 1,
  };

  res.json(stats);
});

router.get("/profile/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const profile = mockFacultyProfiles.find((f) => f.id === facultyId);

  if (!profile) {
    return res.status(404).json({ message: "Faculty not found" });
  }

  res.json(profile);
});

router.put("/profile/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const updates = req.body;

  const profileIndex = mockFacultyProfiles.findIndex((f) => f.id === facultyId);
  if (profileIndex === -1) {
    return res.status(404).json({ message: "Faculty not found" });
  }

  mockFacultyProfiles[profileIndex] = {
    ...mockFacultyProfiles[profileIndex],
    ...updates,
  };
  res.json(mockFacultyProfiles[profileIndex]);
});

// Subject and Schedule APIs
router.get("/subjects/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const subjects = mockSubjects.filter(
    (s) => s.assignedFacultyId === facultyId,
  );
  res.json(subjects);
});

router.get("/schedule/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const { date } = req.query;

  const facultySubjects = mockSubjects.filter(
    (s) => s.assignedFacultyId === facultyId,
  );
  const subjectIds = facultySubjects.map((s) => s.id);
  const schedule = mockSchedule.filter((s) => subjectIds.includes(s.subjectId));

  res.json(schedule);
});

router.get("/classes/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const { subjectId, date } = req.query;

  let sessions = [...mockClassSessions];

  if (subjectId) {
    sessions = sessions.filter((s) => s.subjectId === subjectId);
  }

  if (date) {
    sessions = sessions.filter((s) => s.date === date);
  }

  res.json(sessions);
});

// Attendance APIs
router.get("/attendance/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const { startDate, endDate } = req.query;

  let attendance = mockFacultyAttendance.filter(
    (a) => a.facultyId === facultyId,
  );

  if (startDate) {
    attendance = attendance.filter((a) => a.date >= startDate);
  }

  if (endDate) {
    attendance = attendance.filter((a) => a.date <= endDate);
  }

  res.json(attendance);
});

router.get("/attendance/stats/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const { month, year } = req.query;

  const stats = {
    totalDays: 22,
    presentDays: 20,
    absentDays: 1,
    halfDays: 1,
    leaveDays: 0,
    attendancePercentage: 95.5,
    averageWorkingHours: 8.2,
  };

  res.json(stats);
});

router.post("/attendance/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const attendanceData = req.body;

  const newAttendance = {
    id: `att_${Date.now()}`,
    facultyId,
    ...attendanceData,
  };

  mockFacultyAttendance.push(newAttendance);
  res.json(newAttendance);
});

router.post("/classes/:classSessionId/attendance", (req, res) => {
  const { classSessionId } = req.params;
  const { attendanceList } = req.body;

  // Update session as completed
  const sessionIndex = mockClassSessions.findIndex(
    (s) => s.id === classSessionId,
  );
  if (sessionIndex !== -1) {
    mockClassSessions[sessionIndex].attendanceMarked = true;
    mockClassSessions[sessionIndex].presentCount = attendanceList.filter(
      (s: any) => s.status === "present" || s.status === "late",
    ).length;
    mockClassSessions[sessionIndex].absentCount = attendanceList.filter(
      (s: any) => s.status === "absent",
    ).length;
  }

  res.json({ message: "Attendance marked successfully" });
});

// Leave Management APIs
router.get("/leaves/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const { status } = req.query;

  let leaves = mockLeaveRequests.filter((l) => l.facultyId === facultyId);

  if (status) {
    leaves = leaves.filter((l) => l.status === status);
  }

  res.json(leaves);
});

router.get("/leaves/balance/:facultyId", (req, res) => {
  const { facultyId } = req.params;

  const balance = {
    casual: { total: 12, used: 4, remaining: 8 },
    sick: { total: 12, used: 2, remaining: 10 },
    earned: { total: 20, used: 5, remaining: 15 },
    maternity: { total: 90, used: 0, remaining: 90 },
  };

  res.json(balance);
});

router.post("/leaves/:facultyId", (req, res) => {
  const { facultyId } = req.params;
  const leaveData = req.body;

  const newLeave = {
    id: `leave_${Date.now()}`,
    facultyId,
    facultyName:
      mockFacultyProfiles.find((f) => f.id === facultyId)?.name || "Unknown",
    ...leaveData,
  };

  mockLeaveRequests.push(newLeave);
  res.json(newLeave);
});

router.put("/leaves/request/:leaveId", (req, res) => {
  const { leaveId } = req.params;
  const updates = req.body;

  const leaveIndex = mockLeaveRequests.findIndex((l) => l.id === leaveId);
  if (leaveIndex === -1) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  mockLeaveRequests[leaveIndex] = {
    ...mockLeaveRequests[leaveIndex],
    ...updates,
  };
  res.json(mockLeaveRequests[leaveIndex]);
});

// HOD APIs
router.get("/hod/department/:departmentId/faculty", (req, res) => {
  const { departmentId } = req.params;
  const faculty = mockFacultyProfiles.filter(
    (f) => f.department === "Computer Science",
  );
  res.json(faculty);
});

router.get("/hod/department/:departmentId/subjects", (req, res) => {
  const { departmentId } = req.params;
  const subjects = mockSubjects.filter((s) => s.departmentId === departmentId);
  res.json(subjects);
});

router.get("/hod/department/:departmentId/assignments", (req, res) => {
  const { departmentId } = req.params;
  res.json(mockFacultyAssignments);
});

router.post("/hod/assignments", (req, res) => {
  const assignmentData = req.body;

  const newAssignment = {
    id: `assign_${Date.now()}`,
    ...assignmentData,
  };

  mockFacultyAssignments.push(newAssignment);

  // Update subject assignment
  const subjectIndex = mockSubjects.findIndex(
    (s) => s.id === assignmentData.subjectId,
  );
  if (subjectIndex !== -1) {
    mockSubjects[subjectIndex].assignedFacultyId = assignmentData.facultyId;
    mockSubjects[subjectIndex].assignedFacultyName = assignmentData.facultyName;
  }

  res.json(newAssignment);
});

router.put("/hod/assignments/:assignmentId", (req, res) => {
  const { assignmentId } = req.params;
  const updates = req.body;

  const assignmentIndex = mockFacultyAssignments.findIndex(
    (a) => a.id === assignmentId,
  );
  if (assignmentIndex === -1) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  mockFacultyAssignments[assignmentIndex] = {
    ...mockFacultyAssignments[assignmentIndex],
    ...updates,
  };
  res.json(mockFacultyAssignments[assignmentIndex]);
});

router.delete("/hod/assignments/:assignmentId", (req, res) => {
  const { assignmentId } = req.params;

  const assignmentIndex = mockFacultyAssignments.findIndex(
    (a) => a.id === assignmentId,
  );
  if (assignmentIndex === -1) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  const assignment = mockFacultyAssignments[assignmentIndex];
  mockFacultyAssignments.splice(assignmentIndex, 1);

  // Remove subject assignment
  const subjectIndex = mockSubjects.findIndex(
    (s) => s.id === assignment.subjectId,
  );
  if (subjectIndex !== -1) {
    mockSubjects[subjectIndex].assignedFacultyId = null;
    mockSubjects[subjectIndex].assignedFacultyName = null;
  }

  res.json({ message: "Assignment removed successfully" });
});

router.get("/hod/department/:departmentId/workload", (req, res) => {
  const { departmentId } = req.params;

  const workloadSummary = [
    {
      facultyId: "faculty_001",
      facultyName: "Dr. Sarah Johnson",
      totalSubjects: 2,
      totalHours: 7,
      theoryHours: 4,
      practicalHours: 0,
      labHours: 3,
      maxWorkload: 18,
      workloadPercentage: 38.9,
    },
    {
      facultyId: "faculty_002",
      facultyName: "Prof. Michael Smith",
      totalSubjects: 1,
      totalHours: 3,
      theoryHours: 3,
      practicalHours: 0,
      labHours: 0,
      maxWorkload: 18,
      workloadPercentage: 16.7,
    },
  ];

  res.json(workloadSummary);
});

router.get("/hod/department/:departmentId/leaves/pending", (req, res) => {
  const { departmentId } = req.params;
  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === "pending");
  res.json(pendingLeaves);
});

router.put("/hod/leaves/:leaveId/approve", (req, res) => {
  const { leaveId } = req.params;
  const { remarks } = req.body;

  const leaveIndex = mockLeaveRequests.findIndex((l) => l.id === leaveId);
  if (leaveIndex === -1) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  mockLeaveRequests[leaveIndex].status = "approved";
  mockLeaveRequests[leaveIndex].approvedBy = "HOD";
  mockLeaveRequests[leaveIndex].approvedDate = new Date().toISOString();

  res.json(mockLeaveRequests[leaveIndex]);
});

router.put("/hod/leaves/:leaveId/reject", (req, res) => {
  const { leaveId } = req.params;
  const { reason } = req.body;

  const leaveIndex = mockLeaveRequests.findIndex((l) => l.id === leaveId);
  if (leaveIndex === -1) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  mockLeaveRequests[leaveIndex].status = "rejected";
  mockLeaveRequests[leaveIndex].approvedBy = "HOD";
  mockLeaveRequests[leaveIndex].approvedDate = new Date().toISOString();
  mockLeaveRequests[leaveIndex].rejectionReason = reason;

  res.json(mockLeaveRequests[leaveIndex]);
});

// Department APIs
router.get("/departments", (req, res) => {
  const departments = [
    {
      id: "dept_001",
      name: "Computer Science",
      code: "CS",
      hodId: "faculty_001",
      facultyCount: 2,
      subjectCount: 3,
    },
  ];

  res.json(departments);
});

router.get("/departments/:departmentId", (req, res) => {
  const { departmentId } = req.params;

  const department = {
    id: departmentId,
    name: "Computer Science",
    code: "CS",
    hodId: "faculty_001",
    facultyCount: 2,
    subjectCount: 3,
  };

  res.json(department);
});

export default router;
