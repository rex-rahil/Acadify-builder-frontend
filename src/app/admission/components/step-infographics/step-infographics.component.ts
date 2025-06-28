import { Component, Input } from "@angular/core";

@Component({
  selector: "app-step-infographics",
  templateUrl: "./step-infographics.component.html",
  styleUrls: ["./step-infographics.component.scss"],
})
export class StepInfographicsComponent {
  @Input() stepIndex: number = 0;

  getStepInfo() {
    const stepInfos = [
      {
        title: "Personal Information",
        description:
          "Provide your basic personal details, contact information, and identification documents.",
        tips: [
          "Keep your documents ready",
          "Use your official name",
          "Double-check contact details",
        ],
        icon: "person",
      },
      {
        title: "Category & Eligibility",
        description:
          "Select your category and confirm eligibility criteria for B.Pharm admission.",
        tips: [
          "Check eligibility requirements",
          "Select correct category",
          "Read guidelines carefully",
        ],
        icon: "category",
      },
      {
        title: "Academic Records",
        description:
          "Enter your educational qualifications and academic achievements.",
        tips: [
          "Have mark sheets ready",
          "Calculate percentages accurately",
          "Include all semesters",
        ],
        icon: "academic",
      },
      {
        title: "Family Information",
        description: "Provide parent/guardian details and reference contacts.",
        tips: [
          "Get parent consent",
          "Verify contact numbers",
          "Choose reliable references",
        ],
        icon: "family",
      },
      {
        title: "Documents & Declaration",
        description:
          "Upload required documents and complete the admission declaration.",
        tips: [
          "Scan documents clearly",
          "Check file formats",
          "Read undertaking carefully",
        ],
        icon: "documents",
      },
    ];

    return stepInfos[this.stepIndex] || stepInfos[0];
  }
}
