import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";

@Component({
  selector: "app-parent-guardian",
  templateUrl: "./parent-guardian.component.html",
  styleUrls: ["./parent-guardian.component.scss"],
})
export class ParentGuardianComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  constructor() {}

  ngOnInit() {}

  get fatherForm(): FormGroup {
    return this.formGroup.get("father") as FormGroup;
  }

  get motherForm(): FormGroup {
    return this.formGroup.get("mother") as FormGroup;
  }

  get referencesArray(): FormArray {
    return this.formGroup.get("references") as FormArray;
  }

  isFieldInvalid(parentType: string, fieldName: string): boolean {
    const parentForm = this.formGroup.get(parentType) as FormGroup;
    const field = parentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isReferenceFieldInvalid(index: number, fieldName: string): boolean {
    const referenceForm = this.referencesArray.at(index) as FormGroup;
    const field = referenceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(parentType: string, fieldName: string): string {
    const parentForm = this.formGroup.get(parentType) as FormGroup;
    const field = parentForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors["email"]) {
        return "Please enter a valid email address";
      }
    }
    return "";
  }

  getReferenceFieldError(index: number, fieldName: string): string {
    const referenceForm = this.referencesArray.at(index) as FormGroup;
    const field = referenceForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: "Name",
      occupation: "Occupation",
      designation: "Designation",
      pan: "PAN",
      aadhar: "Aadhar",
      officeAddress: "Office Address",
      city: "City",
      state: "State",
      pinCode: "Pin Code",
      annualIncomeFigure: "Annual Income (Figure)",
      annualIncomeWords: "Annual Income (Words)",
      telNo: "Tel. No.",
      cellNo: "Cell No.",
      email: "Email",
      address: "Address",
      profession: "Profession",
    };
    return labels[fieldName] || fieldName;
  }

  formatIncomeWords(parentType: string) {
    const parentForm = this.formGroup.get(parentType) as FormGroup;
    const figure = parentForm.get("annualIncomeFigure")?.value;

    if (figure) {
      const words = this.numberToWords(figure);
      parentForm.get("annualIncomeWords")?.setValue(words);
    }
  }

  private numberToWords(num: number): string {
    if (num === 0) return "Zero";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertHundreds = (n: number): string => {
      let result = "";
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        result += ones[n] + " ";
      }
      return result.trim();
    };

    let result = "";
    let crores = Math.floor(num / 10000000);
    if (crores > 0) {
      result += convertHundreds(crores) + " Crore ";
      num %= 10000000;
    }

    let lakhs = Math.floor(num / 100000);
    if (lakhs > 0) {
      result += convertHundreds(lakhs) + " Lakh ";
      num %= 100000;
    }

    let thousands = Math.floor(num / 1000);
    if (thousands > 0) {
      result += convertHundreds(thousands) + " Thousand ";
      num %= 1000;
    }

    if (num > 0) {
      result += convertHundreds(num);
    }

    return result.trim() + " Rupees Only";
  }
}
