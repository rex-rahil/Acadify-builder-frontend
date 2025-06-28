import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-documents-declaration",
  templateUrl: "./documents-declaration.component.html",
  styleUrls: ["./documents-declaration.component.scss"],
})
export class DocumentsDeclarationComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  documentsList = [
    {
      key: "passportPhoto",
      label: "Passport-size Photograph",
      required: true,
      description: "Recent passport-size photograph (JPG/PNG only)",
    },
    {
      key: "sscCertificate",
      label: "S.S.C Certificate",
      required: true,
      description: "10th standard certificate",
    },
    {
      key: "hscCertificate",
      label: "H.S.C Certificate",
      required: true,
      description: "12th standard certificate",
    },
    {
      key: "mhtCetScorecard",
      label: "MHT-CET Scorecard",
      required: false,
      description: "MHT-CET examination scorecard (if applicable)",
    },
    {
      key: "dpharmMarkLists",
      label: "D.Pharm Mark Lists",
      required: true,
      description: "D.Pharm Final Year mark lists",
    },
    {
      key: "collegeLeaving",
      label: "College Leaving/Transfer Certificate",
      required: true,
      description: "Transfer certificate from previous institution",
    },
    {
      key: "birthCertificate",
      label: "Birth Certificate",
      required: true,
      description: "Official birth certificate",
    },
    {
      key: "casteCertificate",
      label: "Caste Certificate / Non-Creamy Layer",
      required: false,
      description: "If applicable for reserved categories",
    },
    {
      key: "aadharCard",
      label: "Aadhar Card",
      required: true,
      description: "Copy of Aadhar card",
    },
    {
      key: "panCard",
      label: "PAN Card",
      required: false,
      description: "Copy of PAN card (if available)",
    },
    {
      key: "bankPassbook",
      label: "Bank Passbook",
      required: true,
      description: "First page of bank passbook",
    },
    {
      key: "physicalFitness",
      label: "Physical Fitness Certificate",
      required: true,
      description: "Medical fitness certificate from registered doctor",
    },
  ];

  undertakingText = `
I, the undersigned, hereby undertake and declare that:

1. All the information provided in this application form is true, complete, and accurate to the best of my knowledge.

2. I understand that any false or misleading information may result in the cancellation of my admission at any stage.

3. I will abide by all the rules, regulations, and policies of Oriental College of Pharmacy.

4. I will maintain discipline and uphold the reputation of the institution.

5. I will complete the course within the stipulated time frame and attend all classes regularly.

6. I will pay all fees and dues as per the fee structure of the institution.

7. I understand that the decision of the admission committee is final and binding.

8. I will not engage in any activity that may bring disrepute to the institution.

9. I will follow all academic and non-academic guidelines set by the institution.

10. I understand that my admission is provisional and subject to verification of documents and eligibility criteria.
  `;

  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  constructor() {}

  ngOnInit() {}

  get documentsFormGroup(): FormGroup {
    return this.formGroup.get("documents") as FormGroup;
  }

  onFileSelect(event: any, documentKey: string) {
    const file = event.files[0];
    if (file) {
      if (this.validateFile(file)) {
        this.documentsFormGroup.get(documentKey)?.setValue(file);
      } else {
        event.target.clear();
      }
    }
  }

  onFileRemove(documentKey: string) {
    this.documentsFormGroup.get(documentKey)?.setValue(null);
  }

  validateFile(file: File): boolean {
    if (file.size > this.maxFileSize) {
      alert("File size should not exceed 5MB");
      return false;
    }

    if (!this.allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and PDF files are allowed");
      return false;
    }

    return true;
  }

  isFileUploaded(documentKey: string): boolean {
    return !!this.documentsFormGroup.get(documentKey)?.value;
  }

  getUploadedFileName(documentKey: string): string {
    const file = this.documentsFormGroup.get(documentKey)?.value;
    return file ? file.name : "";
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
        return "You must agree to the undertaking before submitting";
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      applicantSignature: "Applicant's Signature",
      parentSignature: "Parent's Signature",
      declarationDate: "Declaration Date",
      undertakingAgreement: "Undertaking Agreement",
    };
    return labels[fieldName] || fieldName;
  }
}
