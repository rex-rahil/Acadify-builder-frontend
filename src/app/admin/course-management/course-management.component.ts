import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";

interface Subject {
  name: string;
  type: "Theory" | "Practical" | "Lab" | "Elective";
  credits: number;
}

interface Semester {
  number: number;
  subjects: Subject[];
}

interface CourseData {
  id: string;
  name: string;
  code: string;
  duration: string;
  semesters: Semester[];
}

@Component({
  selector: "app-course-management",
  templateUrl: "./course-management.component.html",
  styleUrls: ["./course-management.component.scss"],
})
export class CourseManagementComponent implements OnInit {
  loading = false;
  showCurriculumModal = false;
  showCourseForm = false;
  selectedCourse: any = null;
  selectedCourseData: CourseData | null = null;
  saving = false;
  courseForm: FormGroup;

  // Real course data for Oriental College of Pharmacy
  courseData: CourseData[] = [
    {
      id: "bpharm",
      name: "Bachelor of Pharmacy",
      code: "B.PHARM",
      duration: "4 Years / 8 Semesters",
      semesters: [
        {
          number: 1,
          subjects: [
            {
              name: "Pharmaceutics‑I (General & Dispensing Pharmacy)",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmaceutical Analysis‑I", type: "Theory", credits: 4 },
            {
              name: "Inorganic Medicinal Chemistry",
              type: "Theory",
              credits: 4,
            },
            {
              name: "Remedial Mathematics & Biology",
              type: "Theory",
              credits: 3,
            },
            { name: "Mathematics & Statistics", type: "Theory", credits: 3 },
          ],
        },
        {
          number: 2,
          subjects: [
            {
              name: "Pharmaceutics‑II (Unit Operations)",
              type: "Theory",
              credits: 4,
            },
            { name: "Organic Chemistry", type: "Theory", credits: 4 },
            { name: "Computer Applications", type: "Practical", credits: 3 },
            { name: "Human Anatomy & Physiology", type: "Theory", credits: 4 },
            { name: "Human Pathophysiology", type: "Theory", credits: 3 },
          ],
        },
        {
          number: 3,
          subjects: [
            {
              name: "Pharmaceutics‑III (Physical Pharmaceutics)",
              type: "Theory",
              credits: 4,
            },
            { name: "Biochemistry", type: "Theory", credits: 4 },
            {
              name: "Heterocyclic & Natural Products Chemistry",
              type: "Theory",
              credits: 4,
            },
            {
              name: "Pharmacognosy & Natural Products‑I",
              type: "Theory",
              credits: 4,
            },
            { name: "Microbiology & Immunology", type: "Theory", credits: 3 },
          ],
        },
        {
          number: 4,
          subjects: [
            {
              name: "Pharmaceutics‑IV (Cosmeticology)",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmacology‑I", type: "Theory", credits: 4 },
            {
              name: "Pharmacognosy & Natural Products‑II",
              type: "Theory",
              credits: 4,
            },
          ],
        },
        {
          number: 5,
          subjects: [
            {
              name: "Pharmaceutics‑V (Biological Pharmacy)",
              type: "Theory",
              credits: 4,
            },
            { name: "Medicinal Chemistry‑I", type: "Theory", credits: 4 },
            {
              name: "Pharmacognosy & Natural Products‑III",
              type: "Theory",
              credits: 4,
            },
            {
              name: "Industrial Management & Pharmaceutical Marketing",
              type: "Theory",
              credits: 3,
            },
            { name: "Pharmaceutical Analysis‑II", type: "Theory", credits: 4 },
          ],
        },
        {
          number: 6,
          subjects: [
            {
              name: "Pharmaceutics‑VI (Pharmaceutical Technology I)",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmacology‑II", type: "Theory", credits: 4 },
            { name: "Hospital Pharmacy", type: "Theory", credits: 3 },
          ],
        },
        {
          number: 7,
          subjects: [
            {
              name: "Pharmaceutics‑VII (Pharmaceutical Technology II)",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmacology‑III", type: "Theory", credits: 4 },
            { name: "Medicinal Chemistry‑II", type: "Theory", credits: 4 },
            {
              name: "Molecular Biology, Genetics & Biotechnology",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmaceutical Analysis‑III", type: "Theory", credits: 4 },
          ],
        },
        {
          number: 8,
          subjects: [
            {
              name: "Pharmaceutics‑VIII (Biopharmaceutics & Pharmacokinetics)",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmacology‑IV", type: "Theory", credits: 4 },
            { name: "Forensic Pharmacy", type: "Theory", credits: 3 },
          ],
        },
      ],
    },
    {
      id: "dpharm",
      name: "Diploma in Pharmacy",
      code: "D.PHARM",
      duration: "2 Years / 4 Semesters",
      semesters: [
        {
          number: 1,
          subjects: [
            {
              name: "Biochemistry & Clinical Pathology",
              type: "Theory",
              credits: 4,
            },
            {
              name: "Human Anatomy & Physiology I",
              type: "Theory",
              credits: 4,
            },
            {
              name: "Health Education & Community Pharmacy I",
              type: "Theory",
              credits: 3,
            },
            { name: "Pharmacognosy I", type: "Theory", credits: 4 },
            { name: "Pharmaceutics I Lab", type: "Lab", credits: 2 },
            { name: "Pharmaceutical Chemistry I Lab", type: "Lab", credits: 2 },
          ],
        },
        {
          number: 2,
          subjects: [
            {
              name: "Hospital & Clinical Pharmacy",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmaceutical Chemistry I", type: "Theory", credits: 4 },
            { name: "Pharmacology & Toxicology", type: "Theory", credits: 4 },
            {
              name: "Drug Store & Business Management",
              type: "Theory",
              credits: 3,
            },
            { name: "Pharmaceutics II Lab", type: "Lab", credits: 2 },
            {
              name: "Pharmaceutical Chemistry II Lab",
              type: "Lab",
              credits: 2,
            },
          ],
        },
        {
          number: 3,
          subjects: [
            {
              name: "Advanced Pharmaceutical Chemistry",
              type: "Theory",
              credits: 4,
            },
            { name: "Advanced Pharmacology", type: "Theory", credits: 4 },
            { name: "Advanced Pharmaceutics", type: "Theory", credits: 4 },
            { name: "Research Methods", type: "Theory", credits: 3 },
          ],
        },
        {
          number: 4,
          subjects: [
            {
              name: "Clinical Pharmacy Practice",
              type: "Practical",
              credits: 4,
            },
            {
              name: "Pharmaceutical Quality Control",
              type: "Practical",
              credits: 4,
            },
            { name: "Industrial Training", type: "Practical", credits: 6 },
          ],
        },
      ],
    },
    {
      id: "mpharm",
      name: "Master of Pharmacy",
      code: "M.PHARM",
      duration: "2 Years / 4 Semesters",
      semesters: [
        {
          number: 1,
          subjects: [
            {
              name: "Advanced Pharmaceutical Chemistry",
              type: "Theory",
              credits: 4,
            },
            { name: "Pharmacology", type: "Theory", credits: 4 },
            { name: "Pharmaceutics", type: "Theory", credits: 4 },
            { name: "Pharmaceutical Analysis", type: "Theory", credits: 4 },
          ],
        },
        {
          number: 2,
          subjects: [
            { name: "Biopharmaceutics", type: "Theory", credits: 4 },
            { name: "Medicinal Chemistry", type: "Theory", credits: 4 },
            { name: "Clinical Pharmacy", type: "Theory", credits: 4 },
            { name: "Drug Delivery Systems", type: "Theory", credits: 4 },
          ],
        },
        {
          number: 3,
          subjects: [
            { name: "Drug Regulatory Affairs", type: "Theory", credits: 4 },
            { name: "Pharmacovigilance", type: "Theory", credits: 4 },
            { name: "Advanced Pharmacology", type: "Theory", credits: 4 },
            { name: "Industrial Pharmacy", type: "Theory", credits: 4 },
          ],
        },
        {
          number: 4,
          subjects: [
            { name: "Research Project", type: "Practical", credits: 8 },
            { name: "Clinical Research", type: "Elective", credits: 4 },
            { name: "Pharmaceutical Management", type: "Elective", credits: 4 },
          ],
        },
      ],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.courseForm = this.fb.group({
      name: ["", Validators.required],
      code: ["", Validators.required],
      durationYears: [1, [Validators.required, Validators.min(1)]],
      totalSemesters: [2, [Validators.required, Validators.min(2)]],
      description: [""],
      status: ["active", Validators.required],
    });
  }

  ngOnInit() {
    // Load courses data
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  refreshCourses() {
    this.loadCourses();
  }

  viewCurriculum(courseId: string) {
    this.selectedCourseData =
      this.courseData.find((c) => c.id === courseId) || null;
    this.showCurriculumModal = true;
  }

  closeCurriculumModal() {
    this.showCurriculumModal = false;
    this.selectedCourseData = null;
  }

  editCourse(courseId: string) {
    const course = this.courseData.find((c) => c.id === courseId);
    if (course) {
      this.selectedCourse = course;
      this.courseForm.patchValue({
        name: course.name,
        code: course.code,
        durationYears: parseInt(course.duration.split(" ")[0]),
        totalSemesters: course.semesters.length,
        description: `Professional ${course.name} program`,
        status: "active",
      });
      this.showCourseForm = true;
    }
  }

  openCourseDialog() {
    this.selectedCourse = null;
    this.courseForm.reset({
      name: "",
      code: "",
      durationYears: 1,
      totalSemesters: 2,
      description: "",
      status: "active",
    });
    this.showCourseForm = true;
  }

  closeCourseDialog() {
    this.showCourseForm = false;
    this.selectedCourse = null;
    this.courseForm.reset();
  }

  saveCourse() {
    if (this.courseForm.invalid) return;

    this.saving = true;

    // Simulate API call
    setTimeout(() => {
      this.saving = false;
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: `Course ${this.selectedCourse ? "updated" : "created"} successfully`,
      });
      this.closeCourseDialog();
      this.loadCourses();
    }, 1500);
  }
}
