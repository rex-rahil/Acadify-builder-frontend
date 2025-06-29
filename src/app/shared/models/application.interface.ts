export interface ApplicationStatus {
  id: string;
  applicationId: string;
  studentId: string;
  status:
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "resubmitted"
    | "payment_pending"
    | "payment_completed"
    | "enrolled";
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  resubmissionCount: number;
  lastUpdated: string;
  documents: DocumentStatus[];
  paymentDetails?: PaymentDetails;
}

export interface DocumentStatus {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isRequired: boolean;
}

export interface PaymentDetails {
  id: string;
  applicationId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  dueDate: string;
}

export interface ApplicationReview {
  id: string;
  applicationId: string;
  reviewerId: string;
  reviewerName: string;
  reviewDate: string;
  overallStatus: "approved" | "rejected";
  documentReviews: DocumentReview[];
  generalComments?: string;
  nextSteps?: string;
}

export interface DocumentReview {
  documentId: string;
  documentType: string;
  status: "approved" | "rejected";
  comments?: string;
  rejectionReason?: string;
}

export interface AdmissionOfficer {
  id: string;
  name: string;
  email: string;
  role: "senior_officer" | "admission_officer" | "document_verifier";
  department: string;
  assignedApplications: string[];
}

export interface ApplicationOverview {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  paymentPending: number;
  enrolled: number;
  todaySubmissions: number;
  avgReviewTime: number; // in hours
}

export interface NotificationMessage {
  id: string;
  recipientId: string;
  recipientType: "student" | "officer";
  title: string;
  message: string;
  type:
    | "application_submitted"
    | "application_approved"
    | "application_rejected"
    | "payment_due"
    | "resubmission_required";
  isRead: boolean;
  createdDate: string;
  applicationId?: string;
}

export interface FeeStructure {
  id: string;
  programName: string;
  academicYear: string;
  tuitionFee: number;
  admissionFee: number;
  laboratoryFee: number;
  libraryFee: number;
  developmentFee: number;
  totalFee: number;
  paymentDeadline: string;
  installmentOptions: InstallmentOption[];
}

export interface InstallmentOption {
  id: string;
  planName: string;
  numberOfInstallments: number;
  firstInstallmentAmount: number;
  subsequentInstallmentAmount: number;
  installmentDates: string[];
  processingFee: number;
}
