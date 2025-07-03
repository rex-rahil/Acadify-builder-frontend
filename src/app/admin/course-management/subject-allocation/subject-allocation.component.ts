import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Course, Subject, CourseService } from "../../services/course.service";
import { MessageService } from "primeng/api";

interface FacultyMember {
  id: string;
  name: string;
  department: string;
  email: string;
  specialization: string[];
}

interface SubjectFacultyAssignment {
  subjectId: string;
  facultyId: string;
  name: string;
  department: string;
}

@Component({
  selector: "app-subject-allocation",
  templateUrl: "./subject-allocation.component.html",
  styleUrls: ["./subject-allocation.component.scss"],
})
export class SubjectAllocationComponent implements OnInit {
  // Data properties
  courses: Course[] = [];
  subjects: Subject[] = [];
  selectedCourse: Course | null = null;
  availableSubjects: Subject[] = [];
  selectedSubjects: Subject[] = [];
  loading = false;

  // Filter and search properties
  courseSearchTerm = "";
  subjectSearchTerm = "";
  selectedDepartmentFilter = "";
  filteredCourses: Course[] = [];
  filteredAvailableSubjects: Subject[] = [];

  // View management
  currentView: "subjects" | "faculty" | "schedule" = "subjects";

  // Dialog states
  showCreateSubjectDialog = false;
  showBulkAddDialog = false;
  showFacultyDialog = false;

  // Forms
  subjectForm: FormGroup;

  // Bulk operations
  bulkSelectedSubjects: Subject[] = [];

  // Faculty assignment
  availableFaculty: FacultyMember[] = [
    {
      id: "1",
      name: "Dr. Rajesh Sharma",
      department: "Pharmacy",
      email: "rajesh.sharma@oriental.edu",
      specialization: ["Pharmaceutical Chemistry", "Drug Analysis"],
    },
    {
      id: "2",
      name: "Dr. Priya Patel",
      department: "Pharmacology",
      email: "priya.patel@oriental.edu",
      specialization: ["Clinical Pharmacology", "Toxicology"],
    },
    {
      id: "3",
      name: "Dr. Anil Kumar",
      department: "Pharmaceutics",
      email: "anil.kumar@oriental.edu",
      specialization: ["Drug Delivery", "Formulation Development"],
    },
    {
      id: "4",
      name: "Dr. Sunita Rao",
      department: "Pharmacy",
      email: "sunita.rao@oriental.edu",
      specialization: ["Pharmaceutical Analysis", "Quality Control"],
    },
    {
      id: "5",
      name: "Prof. Vikram Singh",
      department: "General",
      email: "vikram.singh@oriental.edu",
      specialization: ["Mathematics", "Statistics", "Computer Applications"],
    },
  ];

  subjectFacultyAssignments: { [subjectId: string]: SubjectFacultyAssignment } =
    {};
  selectedSubjectForFaculty: Subject | null = null;
  selectedFacultyId = "";

  constructor(
    private courseService: CourseService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
    this.subjectForm = this.fb.group({
      name: ["", Validators.required],
      code: ["", Validators.required],
      credits: [3, [Validators.required, Validators.min(1), Validators.max(8)]],
      department: ["", Validators.required],
      type: ["Theory", Validators.required],
      description: [""],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Use setTimeout to simulate async behavior and ensure loading state is visible
    setTimeout(() => {
      try {
        // Initialize with local data for now
        this.courses = this.initializeCourses();
        this.subjects = this.initializePharmacySubjects();
        this.filteredCourses = [...this.courses];
        this.loading = false;
      } catch (error) {
        console.error("Error loading data:", error);
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load data",
        });
      }
    }, 500);
  }

  private initializeCourses(): Course[] {
    return [
      {
        id: "1",
        name: "Bachelor of Pharmacy (B.Pharm)",
        code: "BPHARM",
        department: "Pharmacy",
        duration: 8,
        description: "4-year undergraduate program in pharmaceutical sciences",
        status: "active",
        subjects: [],
        createdDate: new Date("2023-01-15"),
        totalCredits: 160,
      },
      {
        id: "2",
        name: "Diploma in Pharmacy (D.Pharm)",
        code: "DPHARM",
        department: "Pharmacy",
        duration: 4,
        description: "2-year diploma program in pharmaceutical sciences",
        status: "active",
        subjects: [],
        createdDate: new Date("2023-01-20"),
        totalCredits: 80,
      },
      {
        id: "3",
        name: "Master of Pharmacy (M.Pharm)",
        code: "MPHARM",
        department: "Pharmacy",
        duration: 4,
        description: "2-year postgraduate program in pharmaceutical sciences",
        status: "active",
        subjects: [],
        createdDate: new Date("2023-02-01"),
        totalCredits: 64,
      },
    ];
  }

  private initializePharmacySubjects(): Subject[] {
    return [
      // B.Pharm Semester 1
      {
        id: "1",
        name: "Human Anatomy and Physiology",
        code: "BP101T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Study of human body structure and functions",
      },
      {
        id: "2",
        name: "Pharmaceutical Analysis",
        code: "BP102T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Analytical methods in pharmaceutical sciences",
      },
      {
        id: "3",
        name: "Pharmaceutics",
        code: "BP103T",
        credits: 4,
        department: "Pharmaceutics",
        type: "Theory",
        description: "Basic principles of drug formulation",
      },
      {
        id: "4",
        name: "Pharmaceutical Inorganic Chemistry",
        code: "BP104T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Inorganic compounds in pharmacy",
      },
      {
        id: "5",
        name: "Communication Skills",
        code: "BP105T",
        credits: 2,
        department: "General",
        type: "Theory",
        description: "English language and communication",
      },

      // B.Pharm Semester 2
      {
        id: "6",
        name: "Human Anatomy and Physiology",
        code: "BP201T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Advanced anatomy and physiology",
      },
      {
        id: "7",
        name: "Pharmaceutical Organic Chemistry",
        code: "BP202T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Organic chemistry principles",
      },
      {
        id: "8",
        name: "Biochemistry",
        code: "BP203T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Biological chemistry processes",
      },
      {
        id: "9",
        name: "Pathophysiology",
        code: "BP204T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Disease mechanisms and pathology",
      },
      {
        id: "10",
        name: "Computer Applications in Pharmacy",
        code: "BP205T",
        credits: 2,
        department: "General",
        type: "Theory",
        description: "IT applications in pharmaceutical sciences",
      },

      // B.Pharm Semester 3
      {
        id: "11",
        name: "Pharmaceutical Organic Chemistry",
        code: "BP301T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Advanced organic chemistry",
      },
      {
        id: "12",
        name: "Physical Pharmaceutics",
        code: "BP302T",
        credits: 4,
        department: "Pharmaceutics",
        type: "Theory",
        description: "Physical principles in drug delivery",
      },
      {
        id: "13",
        name: "Pharmaceutical Microbiology",
        code: "BP303T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Microbiology in pharmaceutical sciences",
      },
      {
        id: "14",
        name: "Pharmaceutical Engineering",
        code: "BP304T",
        credits: 4,
        department: "Pharmaceutics",
        type: "Theory",
        description: "Engineering principles in pharmacy",
      },

      // B.Pharm Semester 4
      {
        id: "15",
        name: "Pharmaceutical Organic Chemistry",
        code: "BP401T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Medicinal organic chemistry",
      },
      {
        id: "16",
        name: "Biopharmaceutics and Pharmacokinetics",
        code: "BP402T",
        credits: 4,
        department: "Pharmaceutics",
        type: "Theory",
        description: "Drug absorption and disposition",
      },
      {
        id: "17",
        name: "Pharmaceutical Biotechnology",
        code: "BP403T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Biotechnology applications",
      },
      {
        id: "18",
        name: "Pharmaceutical Chemistry",
        code: "BP404T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Medicinal chemistry principles",
      },

      // B.Pharm Semester 5
      {
        id: "19",
        name: "Medicinal Chemistry",
        code: "BP501T",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Drug design and development",
      },
      {
        id: "20",
        name: "Industrial Pharmacy",
        code: "BP502T",
        credits: 4,
        department: "Pharmaceutics",
        type: "Theory",
        description: "Industrial pharmaceutical processes",
      },
      {
        id: "21",
        name: "Pharmacology",
        code: "BP503T",
        credits: 4,
        department: "Pharmacology",
        type: "Theory",
        description: "Drug action and therapeutic effects",
      },
      {
        id: "22",
        name: "Pharmacognosy and Phytochemistry",
        code: "BP504T",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Natural product chemistry",
      },

      // D.Pharm Subjects
      {
        id: "23",
        name: "Pharmaceutics I",
        code: "DP101",
        credits: 4,
        department: "Pharmaceutics",
        type: "Theory",
        description: "Basic pharmaceutics for diploma",
      },
      {
        id: "24",
        name: "Pharmaceutical Chemistry I",
        code: "DP102",
        credits: 4,
        department: "Pharmaceutical Chemistry",
        type: "Theory",
        description: "Basic pharmaceutical chemistry",
      },
      {
        id: "25",
        name: "Pharmacognosy",
        code: "DP103",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Natural drugs and products",
      },
      {
        id: "26",
        name: "Biochemistry and Clinical Pathology",
        code: "DP104",
        credits: 4,
        department: "Pharmacy",
        type: "Theory",
        description: "Clinical biochemistry",
      },

      // Practical Subjects
      {
        id: "27",
        name: "Human Anatomy and Physiology Lab",
        code: "BP106P",
        credits: 2,
        department: "Pharmacy",
        type: "Practical",
        description: "Practical anatomy and physiology",
      },
      {
        id: "28",
        name: "Pharmaceutical Analysis Lab",
        code: "BP107P",
        credits: 2,
        department: "Pharmaceutical Chemistry",
        type: "Practical",
        description: "Analytical techniques laboratory",
      },
      {
        id: "29",
        name: "Pharmaceutics Lab",
        code: "BP108P",
        credits: 2,
        department: "Pharmaceutics",
        type: "Practical",
        description: "Formulation laboratory work",
      },
      {
        id: "30",
        name: "Pharmacology Lab",
        code: "BP503P",
        credits: 2,
        department: "Pharmacology",
        type: "Practical",
        description: "Pharmacological experiments",
      },
    ];
  }

  refreshData() {
    this.loadData();
  }

  // Course management
  onCourseSelect(course: Course) {
    this.selectedCourse = course;
    this.selectedSubjects = [...course.subjects];
    this.updateAvailableSubjects();
    this.currentView = "subjects";
  }

  filterCourses() {
    if (!this.courseSearchTerm.trim()) {
      this.filteredCourses = [...this.courses];
    } else {
      const searchTerm = this.courseSearchTerm.toLowerCase();
      this.filteredCourses = this.courses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm) ||
          course.code.toLowerCase().includes(searchTerm) ||
          course.department.toLowerCase().includes(searchTerm),
      );
    }
  }

  // Subject management
  updateAvailableSubjects() {
    if (this.selectedCourse) {
      // Get subjects relevant to the course
      let relevantSubjects = this.subjects.filter((subject) => {
        // Include subjects from same department or general subjects
        return (
          subject.department === this.selectedCourse?.department ||
          subject.department === "General" ||
          (this.selectedCourse?.department === "Pharmacy" &&
            [
              "Pharmaceutical Chemistry",
              "Pharmaceutics",
              "Pharmacology",
            ].includes(subject.department))
        );
      });

      // Remove already selected subjects
      this.availableSubjects = relevantSubjects.filter(
        (subject) =>
          !this.selectedSubjects.some((selected) => selected.id === subject.id),
      );

      this.filterSubjects();
    }
  }

  filterSubjects() {
    let filtered = [...this.availableSubjects];

    // Apply search filter
    if (this.subjectSearchTerm.trim()) {
      const searchTerm = this.subjectSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm) ||
          subject.code.toLowerCase().includes(searchTerm) ||
          subject.department.toLowerCase().includes(searchTerm),
      );
    }

    // Apply department filter
    if (this.selectedDepartmentFilter) {
      filtered = filtered.filter(
        (subject) => subject.department === this.selectedDepartmentFilter,
      );
    }

    this.filteredAvailableSubjects = filtered;
  }

  addSubject(subject: Subject) {
    this.selectedSubjects.push(subject);
    this.updateAvailableSubjects();

    this.messageService.add({
      severity: "success",
      summary: "Subject Added",
      detail: `${subject.name} has been added to the course`,
    });
  }

  removeSubject(subject: Subject) {
    this.selectedSubjects = this.selectedSubjects.filter(
      (s) => s.id !== subject.id,
    );
    this.updateAvailableSubjects();

    // Remove faculty assignment if exists
    delete this.subjectFacultyAssignments[subject.id];

    this.messageService.add({
      severity: "info",
      summary: "Subject Removed",
      detail: `${subject.name} has been removed from the course`,
    });
  }

  clearAllSubjects() {
    this.selectedSubjects = [];
    this.subjectFacultyAssignments = {};
    this.updateAvailableSubjects();

    this.messageService.add({
      severity: "info",
      summary: "All Subjects Cleared",
      detail: "All subjects have been removed from the course",
    });
  }

  moveSubjectUp(index: number) {
    if (index > 0) {
      [this.selectedSubjects[index], this.selectedSubjects[index - 1]] = [
        this.selectedSubjects[index - 1],
        this.selectedSubjects[index],
      ];
    }
  }

  moveSubjectDown(index: number) {
    if (index < this.selectedSubjects.length - 1) {
      [this.selectedSubjects[index], this.selectedSubjects[index + 1]] = [
        this.selectedSubjects[index + 1],
        this.selectedSubjects[index],
      ];
    }
  }

  // View management
  toggleView(view: "subjects" | "faculty" | "schedule") {
    this.currentView = view;
  }

  // Create subject functionality
  createSubject() {
    if (this.subjectForm.valid) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...this.subjectForm.value,
      };

      this.courseService.createSubject(newSubject).subscribe({
        next: (createdSubject) => {
          this.subjects.push(createdSubject);
          this.updateAvailableSubjects();
          this.showCreateSubjectDialog = false;
          this.subjectForm.reset({
            credits: 3,
            type: "Theory",
          });

          this.messageService.add({
            severity: "success",
            summary: "Subject Created",
            detail: `${createdSubject.name} has been created successfully`,
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create subject",
          });
        },
      });
    }
  }

  // Bulk operations
  bulkAddSubjects() {
    this.bulkSelectedSubjects = [];
    this.showBulkAddDialog = true;
  }

  onBulkSubjectToggle(subject: Subject, event: any) {
    if (event.target.checked) {
      this.bulkSelectedSubjects.push(subject);
    } else {
      this.bulkSelectedSubjects = this.bulkSelectedSubjects.filter(
        (s) => s.id !== subject.id,
      );
    }
  }

  confirmBulkAdd() {
    this.bulkSelectedSubjects.forEach((subject) => {
      this.selectedSubjects.push(subject);
    });

    this.updateAvailableSubjects();
    this.showBulkAddDialog = false;
    this.bulkSelectedSubjects = [];

    this.messageService.add({
      severity: "success",
      summary: "Subjects Added",
      detail: `${this.bulkSelectedSubjects.length} subjects have been added to the course`,
    });
  }

  // Faculty assignment
  assignFaculty(subject: Subject) {
    this.selectedSubjectForFaculty = subject;
    this.selectedFacultyId =
      this.subjectFacultyAssignments[subject.id]?.facultyId || "";
    this.showFacultyDialog = true;
  }

  confirmFacultyAssignment() {
    if (this.selectedSubjectForFaculty && this.selectedFacultyId) {
      const faculty = this.availableFaculty.find(
        (f) => f.id === this.selectedFacultyId,
      );
      if (faculty) {
        const subjectName = this.selectedSubjectForFaculty.name;

        this.subjectFacultyAssignments[this.selectedSubjectForFaculty.id] = {
          subjectId: this.selectedSubjectForFaculty.id,
          facultyId: faculty.id,
          name: faculty.name,
          department: faculty.department,
        };

        this.showFacultyDialog = false;
        this.selectedSubjectForFaculty = null;
        this.selectedFacultyId = "";

        this.messageService.add({
          severity: "success",
          summary: "Faculty Assigned",
          detail: `${faculty.name} has been assigned to ${subjectName}`,
        });
      }
    }
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  // Save allocation
  saveAllocation() {
    if (!this.selectedCourse) return;

    this.loading = true;
    const subjectIds = this.selectedSubjects.map((s) => s.id);

    this.courseService
      .allocateSubjectsToCourse(this.selectedCourse.id, subjectIds)
      .subscribe({
        next: (updatedCourse) => {
          this.loading = false;
          // Update the course in the local array
          const courseIndex = this.courses.findIndex(
            (c) => c.id === updatedCourse.id,
          );
          if (courseIndex !== -1) {
            this.courses[courseIndex] = updatedCourse;
          }

          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Subject allocation saved successfully",
          });
        },
        error: (error) => {
          console.error("Error saving allocation:", error);
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save subject allocation",
          });
        },
      });
  }

  // Helper methods
  getTotalCredits(): number {
    return this.selectedSubjects.reduce(
      (total, subject) => total + subject.credits,
      0,
    );
  }

  getTheorySubjectsCount(): number {
    return this.selectedSubjects.filter((s) => s.type === "Theory").length;
  }

  getPracticalSubjectsCount(): number {
    return this.selectedSubjects.filter(
      (s) => s.type === "Practical" || s.type === "Lab",
    ).length;
  }

  getSubjectsByDepartment(department: string): Subject[] {
    return this.availableSubjects.filter((s) => s.department === department);
  }

  getUniqueDepartments(): string[] {
    return [...new Set(this.availableSubjects.map((s) => s.department))];
  }
}
