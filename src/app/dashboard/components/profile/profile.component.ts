import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DashboardService } from "../../services/dashboard.service";
import { StudentProfile } from "../../models/dashboard.interface";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  currentStudentId = "OCP2024001";

  profileForm: FormGroup;
  studentProfile: StudentProfile | null = null;
  loading = true;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private messageService: MessageService,
  ) {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;

    this.dashboardService.getStudentProfile(this.currentStudentId).subscribe({
      next: (profile) => {
        this.studentProfile = profile;
        this.profileForm.patchValue(profile);
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading profile:", error);
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Failed to load profile data";
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
        });
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.saving = true;

      this.dashboardService
        .updateStudentProfile(this.currentStudentId, this.profileForm.value)
        .subscribe({
          next: (profile) => {
            this.studentProfile = profile;
            this.saving = false;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Profile updated successfully",
            });
          },
          error: (error) => {
            this.saving = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to update profile",
            });
          },
        });
    }
  }
}
