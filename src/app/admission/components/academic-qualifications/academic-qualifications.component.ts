import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";

@Component({
  selector: "app-academic-qualifications",
  templateUrl: "./academic-qualifications.component.html",
  styleUrls: ["./academic-qualifications.component.scss"],
})
export class AcademicQualificationsComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  constructor() {}

  ngOnInit() {}

  get qualificationsArray(): FormArray {
    return this.formGroup.get("qualifications") as FormArray;
  }

  isFieldInvalid(fieldName: string, index?: number): boolean {
    let field;
    if (index !== undefined) {
      field = this.qualificationsArray.at(index).get(fieldName);
    } else {
      field = this.formGroup.get(fieldName);
    }
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, index?: number): string {
    let field;
    if (index !== undefined) {
      field = this.qualificationsArray.at(index).get(fieldName);
    } else {
      field = this.formGroup.get(fieldName);
    }

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors["min"]) {
        return `${this.getFieldLabel(fieldName)} cannot be less than ${field.errors["min"].min}`;
      }
      if (field.errors["max"]) {
        return `${this.getFieldLabel(fieldName)} cannot be greater than ${field.errors["max"].max}`;
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      boardUniversity: "Board/University",
      monthYearPassing: "Month & Year of Passing",
      marksPercentage: "Marks (%)",
      class: "Class",
      mhtCetMarks: "MHT-CET Marks",
      extraCurricularAchievements: "Extra-Curricular Achievements",
      studentGoalSelf: "Student's Goal for Self",
      studentGoalInstitute: "Student's Goal for Institute",
      whyThisInstitute: "Why this Institute?",
    };
    return labels[fieldName] || fieldName;
  }

  getExamDisplayName(examName: string): string {
    const displayNames: { [key: string]: string } = {
      "S.S.C": "S.S.C (10th)",
      "H.S.C": "H.S.C (12th)",
      "D.Pharm Final Year": "D.Pharm Final Year",
      "Semester I": "Semester I",
      "Semester II": "Semester II",
      "Semester III": "Semester III",
      "Semester IV": "Semester IV",
      "Semester V": "Semester V",
      "Semester VI": "Semester VI",
    };
    return displayNames[examName] || examName;
  }

  isDpharmSemester(examName: string): boolean {
    return examName.startsWith("Semester");
  }
}
