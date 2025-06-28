import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-personal-details",
  templateUrl: "./personal-details.component.html",
  styleUrls: ["./personal-details.component.scss"],
})
export class PersonalDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  bloodGroups = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  constructor() {}

  ngOnInit() {
    // Watch for changes in sameAsResidential checkbox
    this.formGroup.get("sameAsResidential")?.valueChanges.subscribe((value) => {
      if (value) {
        this.copyResidentialToPermanent();
      } else {
        this.clearPermanentAddress();
      }
    });
  }

  copyResidentialToPermanent() {
    const residential = {
      permanentAddress: this.formGroup.get("residentialAddress")?.value,
      permanentCity: this.formGroup.get("residentialCity")?.value,
      permanentState: this.formGroup.get("residentialState")?.value,
      permanentPinCode: this.formGroup.get("residentialPinCode")?.value,
    };
    this.formGroup.patchValue(residential);
  }

  clearPermanentAddress() {
    this.formGroup.patchValue({
      permanentAddress: "",
      permanentCity: "",
      permanentState: "",
      permanentPinCode: "",
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.formGroup.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors["email"]) {
        return "Please enter a valid email address";
      }
      if (field.errors["pattern"]) {
        if (fieldName === "panCardNo") {
          return "PAN Card format: ABCDE1234F";
        }
        if (fieldName === "aadharCardNo") {
          return "Aadhar Card should be 12 digits";
        }
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      lastName: "Last Name",
      firstName: "First Name",
      fatherHusbandName: "Father/Husband's Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      nationality: "Nationality",
      domicile: "Domicile",
      residentialAddress: "Residential Address",
      residentialCity: "City",
      residentialState: "State",
      residentialPinCode: "Pin Code",
      cellNo: "Cell No.",
      email: "Email",
    };
    return labels[fieldName] || fieldName;
  }
}
