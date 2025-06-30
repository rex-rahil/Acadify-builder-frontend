import { Component, OnInit } from "@angular/core";
import { Course, CourseService } from "../services/course.service";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "app-course-management",
  templateUrl: "./course-management.component.html",
  styleUrls: ["./course-management.component.scss"],
  providers: [ConfirmationService],
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  showCourseForm = false;
  selectedCourse: Course | null = null;
  globalFilter = "";

  constructor(
    private courseService: CourseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading courses:", error);
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load courses",
        });
      },
    });
  }

  onAddCourse() {
    this.selectedCourse = null;
    this.showCourseForm = true;
  }

  onEditCourse(course: Course) {
    this.selectedCourse = course;
    this.showCourseForm = true;
  }

  onDeleteCourse(course: Course) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${course.name}?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.courseService.deleteCourse(course.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Course deleted successfully",
            });
            this.loadCourses();
          },
          error: (error) => {
            console.error("Error deleting course:", error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete course",
            });
          },
        });
      },
    });
  }

  onCourseFormClose() {
    this.showCourseForm = false;
    this.selectedCourse = null;
  }

  onCourseSaved() {
    this.showCourseForm = false;
    this.selectedCourse = null;
    this.loadCourses();
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "Course saved successfully",
    });
  }

  getStatusSeverity(status: string): string {
    return status === "active" ? "success" : "danger";
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
