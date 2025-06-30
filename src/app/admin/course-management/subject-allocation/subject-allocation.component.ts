import { Component, OnInit } from "@angular/core";
import { Course, Subject, CourseService } from "../../services/course.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-subject-allocation",
  templateUrl: "./subject-allocation.component.html",
  styleUrls: ["./subject-allocation.component.scss"],
})
export class SubjectAllocationComponent implements OnInit {
  courses: Course[] = [];
  subjects: Subject[] = [];
  selectedCourse: Course | null = null;
  availableSubjects: Subject[] = [];
  selectedSubjects: Subject[] = [];
  loading = false;

  constructor(
    private courseService: CourseService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    Promise.all([
      this.courseService.getCourses().toPromise(),
      this.courseService.getSubjects().toPromise(),
    ])
      .then(([courses, subjects]) => {
        this.courses = courses || [];
        this.subjects = subjects || [];
        this.loading = false;
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load data",
        });
      });
  }

  onCourseSelect(course: Course) {
    this.selectedCourse = course;
    this.selectedSubjects = [...course.subjects];
    this.updateAvailableSubjects();
  }

  updateAvailableSubjects() {
    if (this.selectedCourse) {
      // Filter subjects by department if needed
      const departmentSubjects = this.subjects.filter(
        (subject) =>
          subject.department === this.selectedCourse?.department ||
          subject.department === "Mathematics" || // Common subjects
          subject.department === "English",
      );

      // Remove already selected subjects
      this.availableSubjects = departmentSubjects.filter(
        (subject) =>
          !this.selectedSubjects.some((selected) => selected.id === subject.id),
      );
    }
  }

  addSubject(subject: Subject) {
    this.selectedSubjects.push(subject);
    this.updateAvailableSubjects();
  }

  removeSubject(subject: Subject) {
    this.selectedSubjects = this.selectedSubjects.filter(
      (s) => s.id !== subject.id,
    );
    this.updateAvailableSubjects();
  }

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

  getTotalCredits(): number {
    return this.selectedSubjects.reduce(
      (total, subject) => total + subject.credits,
      0,
    );
  }

  getSubjectsByDepartment(department: string): Subject[] {
    return this.availableSubjects.filter((s) => s.department === department);
  }

  getUniqueDepartments(): string[] {
    return [...new Set(this.availableSubjects.map((s) => s.department))];
  }
}
