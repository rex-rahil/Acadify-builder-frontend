import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacultyService } from "../services/faculty.service";
import {
  FacultyProfile,
  Subject,
  FacultyAssignment,
  WorkloadSummary,
  Department,
} from "../models/faculty.interface";

@Component({
  selector: "app-faculty-assignment",
  templateUrl: "./faculty-assignment.component.html",
  styleUrls: ["./faculty-assignment.component.scss"],
})
export class FacultyAssignmentComponent implements OnInit {
  hodId = "faculty_001"; // This would come from auth service
  departmentId = "dept_001"; // This would come from faculty profile
  loading = true;
  error: string | null = null;

  departmentFaculty: FacultyProfile[] = [];
  departmentSubjects: Subject[] = [];
  facultyAssignments: FacultyAssignment[] = [];
  workloadSummary: WorkloadSummary[] = [];
  department: Department | null = null;

  // Assignment Dialog
  showAssignmentDialog = false;
  selectedFaculty: FacultyProfile | null = null;
  selectedSubject: Subject | null = null;
  assignmentLoading = false;
  assignmentForm: FormGroup;

  // Filters
  selectedFacultyFilter: FacultyProfile | null = null;
  selectedSubjectFilter: Subject | null = null;

  // Form options
  academicYears = [
    { label: "2023-24", value: "2023-24" },
    { label: "2024-25", value: "2024-25" },
    { label: "2025-26", value: "2025-26" },
  ];

  constructor(
    private facultyService: FacultyService,
    private fb: FormBuilder,
  ) {
    this.assignmentForm = this.fb.group({
      facultyId: ["", Validators.required],
      subjectId: ["", Validators.required],
      academicYear: ["", Validators.required],
      notes: [""],
    });
  }

  ngOnInit(): void {
    this.loadAssignmentData();
  }

  private async loadAssignmentData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [department, faculty, subjects, assignments, workload] =
        await Promise.all([
          this.facultyService.getDepartment(this.departmentId).toPromise(),
          this.facultyService
            .getDepartmentFaculty(this.departmentId)
            .toPromise(),
          this.facultyService
            .getDepartmentSubjects(this.departmentId)
            .toPromise(),
          this.facultyService
            .getFacultyAssignments(this.departmentId)
            .toPromise(),
          this.facultyService.getWorkloadSummary(this.departmentId).toPromise(),
        ]);

      this.department = department || null;
      this.departmentFaculty = faculty || [];
      this.departmentSubjects = subjects || [];
      this.facultyAssignments = assignments || [];
      this.workloadSummary = workload || [];
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  getFilteredAssignments(): FacultyAssignment[] {
    let filtered = [...this.facultyAssignments];

    if (this.selectedFacultyFilter) {
      filtered = filtered.filter(
        (assignment) => assignment.facultyId === this.selectedFacultyFilter!.id,
      );
    }

    if (this.selectedSubjectFilter) {
      filtered = filtered.filter(
        (assignment) => assignment.subjectId === this.selectedSubjectFilter!.id,
      );
    }

    return filtered;
  }

  getUnassignedSubjects(): Subject[] {
    const assignedSubjectIds = this.facultyAssignments
      .filter((assignment) => assignment.status === "active")
      .map((assignment) => assignment.subjectId);

    return this.departmentSubjects.filter(
      (subject) => !assignedSubjectIds.includes(subject.id),
    );
  }

  getFacultyWorkload(facultyId: string): WorkloadSummary | null {
    return (
      this.workloadSummary.find(
        (workload) => workload.facultyId === facultyId,
      ) || null
    );
  }

  getWorkloadColor(percentage: number): string {
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    if (percentage >= 50) return "info";
    return "success";
  }

  getAssignmentStatusSeverity(status: string): string {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "info";
    }
  }

  openAssignmentDialog(): void {
    this.selectedFaculty = null;
    this.selectedSubject = null;
    this.assignmentForm.reset();
    this.showAssignmentDialog = true;
  }

  closeAssignmentDialog(): void {
    this.showAssignmentDialog = false;
    this.selectedFaculty = null;
    this.selectedSubject = null;
  }

  async assignFaculty(): Promise<void> {
    if (this.assignmentForm.invalid) return;

    this.assignmentLoading = true;
    try {
      const formValue = this.assignmentForm.value;
      const selectedFaculty = this.departmentFaculty.find(
        (f) => f.id === formValue.facultyId,
      );
      const selectedSubject = this.departmentSubjects.find(
        (s) => s.id === formValue.subjectId,
      );

      if (!selectedFaculty || !selectedSubject) return;

      const assignmentData = {
        facultyId: selectedFaculty.id,
        facultyName: selectedFaculty.name,
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        subjectCode: selectedSubject.code,
        semester: selectedSubject.semester,
        assignedDate: new Date().toISOString(),
        assignedBy: this.hodId,
        workload: this.calculateSubjectWorkload(selectedSubject),
        status: "active" as const,
        academicYear: formValue.academicYear,
        notes: formValue.notes || "",
      };

      await this.facultyService
        .assignFacultyToSubject(assignmentData)
        .toPromise();

      await this.loadAssignmentData();
      this.closeAssignmentDialog();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.assignmentLoading = false;
    }
  }

  calculateSubjectWorkload(subject: Subject): number {
    // Calculate workload based on subject type and credits
    const baseHours = subject.credits * 2; // 2 hours per credit
    switch (subject.type) {
      case "practical":
        return baseHours * 1.5;
      case "lab":
        return baseHours * 2;
      default:
        return baseHours;
    }
  }

  async removeAssignment(assignment: FacultyAssignment): Promise<void> {
    try {
      await this.facultyService
        .removeFacultyAssignment(assignment.id)
        .toPromise();
      await this.loadAssignmentData();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  async toggleAssignmentStatus(assignment: FacultyAssignment): Promise<void> {
    try {
      const newStatus = assignment.status === "active" ? "inactive" : "active";
      await this.facultyService
        .updateFacultyAssignment(assignment.id, { status: newStatus })
        .toPromise();
      await this.loadAssignmentData();
    } catch (error: any) {
      this.error = this.extractErrorMessage(error);
    }
  }

  getAvailableFaculty(): FacultyProfile[] {
    if (!this.selectedSubject) return this.departmentFaculty;

    // Filter faculty who don't have too much workload
    return this.departmentFaculty.filter((faculty) => {
      const workload = this.getFacultyWorkload(faculty.id);
      return !workload || workload.workloadPercentage < 90;
    });
  }

  get availableSubjects(): Subject[] {
    return this.getUnassignedSubjects();
  }

  getAvailableSubjects(): Subject[] {
    return this.getUnassignedSubjects();
  }

  refreshData(): void {
    this.loadAssignmentData();
  }

  exportAssignments(): void {
    // Implementation for exporting assignments
    const data = this.getFilteredAssignments();
    const csvContent = this.convertToCSV(data);
    this.downloadCSV(csvContent, "faculty-assignments.csv");
  }

  private convertToCSV(data: FacultyAssignment[]): string {
    const headers = [
      "Faculty Name",
      "Subject Name",
      "Subject Code",
      "Semester",
      "Workload",
      "Status",
      "Assigned Date",
    ];

    const rows = data.map((assignment) => [
      assignment.facultyName,
      assignment.subjectName,
      assignment.subjectCode,
      assignment.semester.toString(),
      assignment.workload.toString(),
      assignment.status,
      new Date(assignment.assignedDate).toLocaleDateString(),
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  editAssignment(assignment: FacultyAssignment): void {
    // Open edit dialog or navigate to edit page
    console.log("Edit assignment:", assignment);
  }

  viewFacultyDetails(faculty: FacultyProfile): void {
    // Navigate to faculty details or open modal
    console.log("View faculty details:", faculty);
  }

  private extractErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred";
  }
}
