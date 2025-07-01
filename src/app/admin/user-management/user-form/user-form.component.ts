import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User, UserService } from "../../services/user.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  @Input() visible = false;
  @Input() user: User | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() userSaved = new EventEmitter<void>();

  userForm!: FormGroup;
  loading = false;
  roles: any[] = [];
  departments: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadDropdownData();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: [
        "",
        [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)],
      ],
      role: ["", Validators.required],
      status: ["active", Validators.required],
      department: [""],
      studentId: [""],
    });

    // Watch role changes to show/hide relevant fields
    this.userForm.get("role")?.valueChanges.subscribe((role) => {
      this.updateFormValidation(role);
    });
  }

  loadDropdownData() {
    this.userService.getRoles().subscribe((roles) => {
      this.roles = roles.map((role) => ({
        label: this.formatRole(role),
        value: role,
      }));
    });

    this.userService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  updateFormValidation(role: string) {
    const departmentControl = this.userForm.get("department");
    const studentIdControl = this.userForm.get("studentId");

    // Reset validators
    departmentControl?.clearValidators();
    studentIdControl?.clearValidators();

    if (role === "student") {
      departmentControl?.setValidators([Validators.required]);
      studentIdControl?.setValidators([Validators.required]);
    } else if (
      role === "faculty" ||
      role === "admission_officer" ||
      role === "hod"
    ) {
      departmentControl?.setValidators([Validators.required]);
      studentIdControl?.setValue("");
    } else if (role === "admin") {
      departmentControl?.setValue("");
      studentIdControl?.setValue("");
    }

    // Update validity
    departmentControl?.updateValueAndValidity();
    studentIdControl?.updateValueAndValidity();
  }

  ngOnChanges() {
    if (this.visible && this.user) {
      // Edit mode
      this.userForm.patchValue(this.user);
      this.updateFormValidation(this.user.role);
    } else if (this.visible && !this.user) {
      // Add mode
      this.userForm.reset();
      this.userForm.patchValue({ status: "active" });
    }
  }

  onSave() {
    if (this.userForm.valid) {
      this.loading = true;
      const formValue = this.userForm.value;

      // Clean up unused fields based on role
      const userData = { ...formValue };
      if (userData.role !== "student") {
        delete userData.studentId;
      }

      if (userData.role === "admin") {
        delete userData.department;
      }

      const saveOperation = this.user
        ? this.userService.updateUser(this.user.id, userData)
        : this.userService.createUser(userData);

      saveOperation.subscribe({
        next: () => {
          this.loading = false;
          this.userSaved.emit();
          this.onCancel();
        },
        error: (error) => {
          console.error("Error saving user:", error);
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save user",
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
    this.userForm.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  formatRole(role: string): string {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors["email"]) {
        return "Please enter a valid email address";
      }
      if (control.errors["minlength"]) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors["minlength"].requiredLength} characters`;
      }
      if (control.errors["pattern"]) {
        return "Please enter a valid phone number";
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      role: "Role",
      status: "Status",
      department: "Department",
      employeeId: "Employee ID",
      studentId: "Student ID",
    };
    return labels[fieldName] || fieldName;
  }

  isFieldRequired(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return control?.hasError("required") === false && control?.valid === true;
  }

  shouldShowField(fieldName: string): boolean {
    const role = this.userForm.get("role")?.value;

    switch (fieldName) {
      case "department":
        return (
          role === "student" ||
          role === "faculty" ||
          role === "admission_officer" ||
          role === "hod"
        );
      case "studentId":
        return role === "student";
      default:
        return true;
    }
  }
}
