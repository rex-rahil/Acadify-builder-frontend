import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { AdmissionStatusService } from "../../services/admission-status.service";
import {
  ApplicationStatus,
  PaymentDetails,
  FeeStructure,
  InstallmentOption,
} from "../../../shared/models/application.interface";

@Component({
  selector: "app-fee-payment",
  templateUrl: "./fee-payment.component.html",
  styleUrls: ["./fee-payment.component.scss"],
})
export class FeePaymentComponent implements OnInit {
  applicationId: string = "";
  applicationStatus: ApplicationStatus | null = null;
  paymentDetails: PaymentDetails | null = null;
  feeStructure: FeeStructure[] = [];
  selectedFeeStructure: FeeStructure | null = null;

  paymentForm: FormGroup;
  loading = true;
  processing = false;

  // Payment options
  paymentMethods = [
    { label: "UPI", value: "upi", icon: "pi-mobile" },
    { label: "Credit Card", value: "credit_card", icon: "pi-credit-card" },
    { label: "Debit Card", value: "debit_card", icon: "pi-credit-card" },
    { label: "Net Banking", value: "net_banking", icon: "pi-globe" },
    { label: "Bank Transfer", value: "bank_transfer", icon: "pi-building" },
  ];

  selectedInstallmentPlan: InstallmentOption | null = null;
  showInstallmentOptions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private admissionStatusService: AdmissionStatusService,
    private messageService: MessageService,
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ["", Validators.required],
      installmentPlan: [""],
      agreeToTerms: [false, Validators.requiredTrue],
    });
  }

  async ngOnInit() {
    this.applicationId = this.route.snapshot.queryParams["applicationId"];

    if (!this.applicationId) {
      this.showError("Application ID not provided");
      this.router.navigate(["/admission/status"]);
      return;
    }

    await this.loadPaymentData();
  }

  async loadPaymentData() {
    try {
      this.loading = true;

      const [application, payment, feeStructures] = await Promise.all([
        this.admissionStatusService
          .getApplicationDetails(this.applicationId)
          .toPromise(),
        this.admissionStatusService
          .getPaymentDetails(this.applicationId)
          .toPromise(),
        this.admissionStatusService.getFeeStructure().toPromise(),
      ]);

      this.applicationStatus = application || null;
      this.paymentDetails = payment || null;
      this.feeStructure = feeStructures || [];

      // Set default fee structure (first one or B.Pharm)
      if (feeStructures && feeStructures.length > 0) {
        this.selectedFeeStructure =
          feeStructures.find((f) => f.programName === "B.Pharm") ||
          feeStructures[0];
      }

      // Check if application is eligible for payment
      if (
        !application ||
        (application.status !== "payment_pending" &&
          application.status !== "approved")
      ) {
        this.showError("Application is not eligible for payment");
        this.router.navigate(["/admission/status"]);
        return;
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.showError("Failed to load payment information");
    }
  }

  onPaymentMethodChange() {
    const method = this.paymentForm.get("paymentMethod")?.value;
    this.showInstallmentOptions = [
      "credit_card",
      "debit_card",
      "net_banking",
    ].includes(method);

    if (!this.showInstallmentOptions) {
      this.paymentForm.patchValue({ installmentPlan: "" });
      this.selectedInstallmentPlan = null;
    }
  }

  onInstallmentPlanChange() {
    const planId = this.paymentForm.get("installmentPlan")?.value;
    if (planId && this.selectedFeeStructure) {
      this.selectedInstallmentPlan =
        this.selectedFeeStructure.installmentOptions.find(
          (plan) => plan.id === planId,
        ) || null;
    } else {
      this.selectedInstallmentPlan = null;
    }
  }

  getPaymentAmount(): number {
    if (!this.selectedFeeStructure) return 0;

    if (this.selectedInstallmentPlan) {
      return (
        this.selectedInstallmentPlan.firstInstallmentAmount +
        this.selectedInstallmentPlan.processingFee
      );
    }

    return this.selectedFeeStructure.totalFee;
  }

  getTotalFeeWithProcessing(): number {
    if (!this.selectedFeeStructure) return 0;

    if (this.selectedInstallmentPlan) {
      return (
        this.selectedFeeStructure.totalFee +
        this.selectedInstallmentPlan.processingFee
      );
    }

    return this.selectedFeeStructure.totalFee;
  }

  async processPayment() {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      this.showError("Please fill all required fields");
      return;
    }

    this.processing = true;

    try {
      const paymentData = {
        applicationId: this.applicationId,
        amount: this.getPaymentAmount(),
        paymentMethod: this.paymentForm.value.paymentMethod,
        installmentPlan: this.paymentForm.value.installmentPlan || undefined,
      };

      await this.admissionStatusService.processPayment(paymentData).toPromise();

      this.showSuccess("Payment processed successfully!");

      // Redirect to status page after successful payment
      setTimeout(() => {
        this.router.navigate(["/admission/status"]);
      }, 2000);
    } catch (error) {
      this.showError("Payment processing failed. Please try again.");
    } finally {
      this.processing = false;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  goBackToStatus() {
    this.router.navigate(["/admission/status"]);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }
}
