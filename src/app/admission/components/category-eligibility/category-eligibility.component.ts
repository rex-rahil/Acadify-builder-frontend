import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-category-eligibility",
  templateUrl: "./category-eligibility.component.html",
  styleUrls: ["./category-eligibility.component.scss"],
})
export class CategoryEligibilityComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  categories = [
    { label: "Open", value: "Open" },
    { label: "SC", value: "SC" },
    { label: "ST", value: "ST" },
    { label: "OBC", value: "OBC" },
    { label: "VI", value: "VI" },
    { label: "DT", value: "DT" },
    { label: "NT1", value: "NT1" },
    { label: "NT2", value: "NT2" },
    { label: "NT3", value: "NT3" },
    { label: "Hindi-Speaking Minority", value: "Hindi-Speaking Minority" },
    { label: "Other", value: "Other" },
  ];

  physicallyHandicappedOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  maritalStatusOptions = [
    { label: "Married", value: "Married" },
    { label: "Unmarried", value: "Unmarried" },
  ];

  constructor() {}

  ngOnInit() {
    // Watch for changes in categories to show/hide "Other" specification field
    this.formGroup.get("categories")?.valueChanges.subscribe((categories) => {
      if (categories && categories.includes("Other")) {
        this.formGroup
          .get("otherCategorySpecify")
          ?.setValidators([this.requiredValidator]);
      } else {
        this.formGroup.get("otherCategorySpecify")?.clearValidators();
        this.formGroup.get("otherCategorySpecify")?.setValue("");
      }
      this.formGroup.get("otherCategorySpecify")?.updateValueAndValidity();
    });
  }

  private requiredValidator(control: any) {
    return !control.value || control.value.trim() === ""
      ? { required: true }
      : null;
  }

  isOtherCategorySelected(): boolean {
    const categories = this.formGroup.get("categories")?.value;
    return categories && categories.includes("Other");
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
      if (field.errors["requiredTrue"]) {
        return "You must agree to the eligibility requirements";
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      physicallyHandicapped: "Physically Handicapped status",
      maritalStatus: "Marital Status",
      otherCategorySpecify: "Other category specification",
      eligibilityAgreement: "Eligibility Agreement",
    };
    return labels[fieldName] || fieldName;
  }
}
