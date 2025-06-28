import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

export interface AdmissionFormData {
  personalDetails: any;
  categoryEligibility: any;
  academicQualifications: any;
  parentGuardian: any;
  documentsDeclaration: any;
}

@Injectable({
  providedIn: "root",
})
export class FormService {
  private formData: Partial<AdmissionFormData> = {};

  constructor(private fb: FormBuilder) {}

  // Personal Details Form
  createPersonalDetailsForm(): FormGroup {
    return this.fb.group({
      lastName: ["", Validators.required],
      firstName: ["", Validators.required],
      fatherHusbandName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      bloodGroup: [""],
      gender: ["", Validators.required],
      panCardNo: ["", Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
      aadharCardNo: ["", Validators.pattern(/^\d{12}$/)],
      identificationMark: [""],
      nationality: ["", Validators.required],
      domicile: ["", Validators.required],
      residentialAddress: ["", Validators.required],
      residentialCity: ["", Validators.required],
      residentialState: ["", Validators.required],
      residentialPinCode: ["", Validators.required],
      sameAsResidential: [false],
      permanentAddress: [""],
      permanentCity: [""],
      permanentState: [""],
      permanentPinCode: [""],
      telNo: [""],
      cellNo: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  // Category & Eligibility Form
  createCategoryEligibilityForm(): FormGroup {
    return this.fb.group({
      categories: [[]],
      otherCategorySpecify: [""],
      physicallyHandicapped: ["", Validators.required],
      majorIllness: [""],
      maritalStatus: ["", Validators.required],
      eligibilityAgreement: [false, Validators.requiredTrue],
    });
  }

  // Academic Qualifications Form
  createAcademicQualificationsForm(): FormGroup {
    return this.fb.group({
      qualifications: this.fb.array([
        this.createQualificationRow("S.S.C"),
        this.createQualificationRow("H.S.C"),
        this.createQualificationRow("D.Pharm Final Year"),
        this.createQualificationRow("Semester I"),
        this.createQualificationRow("Semester II"),
        this.createQualificationRow("Semester III"),
        this.createQualificationRow("Semester IV"),
        this.createQualificationRow("Semester V"),
        this.createQualificationRow("Semester VI"),
      ]),
      mhtCetMarks: [null],
      extraCurricularAchievements: [""],
      studentGoalSelf: [""],
      studentGoalInstitute: [""],
      whyThisInstitute: [""],
    });
  }

  private createQualificationRow(examName: string): FormGroup {
    return this.fb.group({
      examName: [examName],
      boardUniversity: [""],
      monthYearPassing: [""],
      marksPercentage: [null, [Validators.min(0), Validators.max(100)]],
      class: [""],
    });
  }

  // Parent/Guardian Form
  createParentGuardianForm(): FormGroup {
    return this.fb.group({
      father: this.createParentDetailsGroup(),
      mother: this.createParentDetailsGroup(),
      references: this.fb.array([
        this.createReferenceGroup(),
        this.createReferenceGroup(),
      ]),
    });
  }

  private createParentDetailsGroup(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      occupation: [""],
      designation: [""],
      pan: [""],
      aadhar: [""],
      officeAddress: [""],
      city: [""],
      state: [""],
      pinCode: [""],
      annualIncomeFigure: [null],
      annualIncomeWords: [""],
      telNo: [""],
      cellNo: [""],
      email: ["", Validators.email],
    });
  }

  private createReferenceGroup(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      cellNo: ["", Validators.required],
      address: ["", Validators.required],
      profession: ["", Validators.required],
    });
  }

  // Documents & Declaration Form
  createDocumentsDeclarationForm(): FormGroup {
    return this.fb.group({
      documents: this.fb.group({
        passportPhoto: [null],
        sscCertificate: [null],
        hscCertificate: [null],
        mhtCetScorecard: [null],
        dpharmMarkLists: [null],
        collegeLeaving: [null],
        birthCertificate: [null],
        casteCertificate: [null],
        aadharCard: [null],
        panCard: [null],
        bankPassbook: [null],
        physicalFitness: [null],
      }),
      undertakingAgreement: [false, Validators.requiredTrue],
      applicantSignature: ["", Validators.required],
      parentSignature: ["", Validators.required],
      declarationDate: ["", Validators.required],
    });
  }

  // Save form data
  saveFormData(step: keyof AdmissionFormData, data: any): void {
    this.formData[step] = data;
  }

  // Get form data
  getFormData(): Partial<AdmissionFormData> {
    return this.formData;
  }

  // Get specific step data
  getStepData(step: keyof AdmissionFormData): any {
    return this.formData[step];
  }

  // Submit complete application
  async submitApplication(): Promise<any> {
    try {
      const formData = new FormData();

      // Append form data
      formData.append("applicationData", JSON.stringify(this.formData));

      // Append files if any
      if (this.formData.documentsDeclaration?.documents) {
        Object.keys(this.formData.documentsDeclaration.documents).forEach(
          (key) => {
            const file = this.formData.documentsDeclaration.documents[key];
            if (file) {
              formData.append(key, file);
            }
          },
        );
      }

      const response = await fetch("/api/admissions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
