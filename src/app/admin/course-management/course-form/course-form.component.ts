import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Course, CourseService } from "../../services/course.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-course-form",
  templateUrl: "./course-form.component.html",
  styleUrls: ["./course-form.component.scss"],
})
export class CourseFormComponent implements OnInit {
  @Input() visible = false;
  @Input() course: Course | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() courseSaved = new EventEmitter<void>();

  courseForm!: FormGroup;
  loading = false;
  departments: string[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadDropdownData();
  }

  initializeForm() {
    this.courseForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      code: ["", [Validators.required, Validators.minLength(2)]],
      department: ["", Validators.required],
      duration: [
        8,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      description: ["", [Validators.required, Validators.minLength(10)]],
      status: ["active", Validators.required],
    });
  }

  loadDropdownData() {
    this.courseService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  ngOnChanges() {
    if (this.visible && this.course) {
      // Edit mode
      this.courseForm.patchValue(this.course);
    } else if (this.visible && !this.course) {
      // Add mode
      this.courseForm.reset();
      this.courseForm.patchValue({ status: "active", duration: 8 });
    }
  }

  onSave() {
    if (this.courseForm.valid) {
      this.loading = true;
      const formValue = this.courseForm.value;

      const saveOperation = this.course
        ? this.courseService.updateCourse(this.course.id, formValue)
        : this.courseService.createCourse(formValue);

      saveOperation.subscribe({
        next: () => {
          this.loading = false;
          this.courseSaved.emit();
          this.onCancel();
        },
        error: (error) => {
          console.error("Error saving course:", error);
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save course",
          });
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.courseForm.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.courseForm.controls).forEach((key) => {
      const control = this.courseForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.courseForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors["minlength"]) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors["minlength"].requiredLength} characters`;
      }
      if (control.errors["min"]) {
        return `Duration must be at least 1 semester`;
      }
      if (control.errors["max"]) {
        return `Duration cannot exceed 12 semesters`;
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: "Course Name",
      code: "Course Code",
      department: "Department",
      duration: "Duration",
      description: "Description",
      status: "Status",
    };
    return labels[fieldName] || fieldName;
  }
}
