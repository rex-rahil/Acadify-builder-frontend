import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  ApplicationStatus,
  PaymentDetails,
  FeeStructure,
  NotificationMessage,
} from "../../shared/models/application.interface";

export interface StudentApplicationData {
  applicationStatus: ApplicationStatus | null;
  canAccessDashboard: boolean;
  hasActiveApplication: boolean;
  isAdmitted: boolean;
  hasPaidMinimumFees: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AdmissionStatusService {
  private apiUrl = "/json-api";
  private currentStudentId = "student_006"; // This would come from auth service

  // Subject to track current application status
  private applicationStatusSubject =
    new BehaviorSubject<StudentApplicationData>({
      applicationStatus: null,
      canAccessDashboard: false,
      hasActiveApplication: false,
      isAdmitted: false,
      hasPaidMinimumFees: false,
    });

  public applicationStatus$ = this.applicationStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStudentApplicationStatus();
  }

  // Load and set current student's application status
  private async loadStudentApplicationStatus(): Promise<void> {
    try {
      const status = await this.getStudentApplicationStatus().toPromise();
      const studentData: StudentApplicationData = {
        applicationStatus: status || null,
        hasActiveApplication: !!status,
        isAdmitted: status?.status === "enrolled",
        hasPaidMinimumFees:
          status?.status === "payment_completed" ||
          status?.status === "enrolled",
        canAccessDashboard: status?.status === "enrolled",
      };
      this.applicationStatusSubject.next(studentData);
    } catch (error) {
      // Student has no application yet
      const studentData: StudentApplicationData = {
        applicationStatus: null,
        canAccessDashboard: false,
        hasActiveApplication: false,
        isAdmitted: false,
        hasPaidMinimumFees: false,
      };
      this.applicationStatusSubject.next(studentData);
    }
  }

  // Get current student's application status
  getStudentApplicationStatus(): Observable<ApplicationStatus> {
    return this.http
      .get<
        ApplicationStatus[]
      >(`${this.apiUrl}/applicationStatuses?studentId=${this.currentStudentId}`)
      .pipe(
        map((applications: ApplicationStatus[]) => {
          // Get the most recent application
          if (applications.length === 0) {
            throw new Error("No application found");
          }
          return applications.sort(
            (a, b) =>
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime(),
          )[0];
        }),
        catchError(this.handleError),
      );
  }

  // Get application details by ID
  getApplicationDetails(applicationId: string): Observable<ApplicationStatus> {
    return this.http
      .get<ApplicationStatus>(
        `${this.apiUrl}/applicationStatuses/${applicationId}`,
      )
      .pipe(catchError(this.handleError));
  }

  // Get student notifications
  getStudentNotifications(): Observable<NotificationMessage[]> {
    return this.http
      .get<
        NotificationMessage[]
      >(`${this.apiUrl}/notifications?recipientId=${this.currentStudentId}&recipientType=student`)
      .pipe(catchError(this.handleError));
  }

  // Mark notification as read
  markNotificationRead(
    notificationId: string,
  ): Observable<NotificationMessage> {
    return this.http
      .get<NotificationMessage>(
        `${this.apiUrl}/notifications/${notificationId}`,
      )
      .pipe(
        map((notification: NotificationMessage) => {
          const updatedNotification = { ...notification, isRead: true };
          this.http
            .put(
              `${this.apiUrl}/notifications/${notificationId}`,
              updatedNotification,
            )
            .subscribe();
          return updatedNotification;
        }),
        catchError(this.handleError),
      );
  }

  // Get payment details for application
  getPaymentDetails(applicationId: string): Observable<PaymentDetails> {
    return this.http
      .get<
        PaymentDetails[]
      >(`${this.apiUrl}/paymentDetails?applicationId=${applicationId}`)
      .pipe(
        map((payments: PaymentDetails[]) => payments[0] || null),
        catchError(this.handleError),
      );
  }

  // Get fee structure
  getFeeStructure(): Observable<FeeStructure[]> {
    return this.http
      .get<FeeStructure[]>(`${this.apiUrl}/feeStructure`)
      .pipe(catchError(this.handleError));
  }

  // Process payment
  processPayment(paymentData: {
    applicationId: string;
    amount: number;
    paymentMethod: string;
    installmentPlan?: string;
  }): Observable<PaymentDetails> {
    return this.http
      .get<
        PaymentDetails[]
      >(`${this.apiUrl}/paymentDetails?applicationId=${paymentData.applicationId}`)
      .pipe(
        map((payments: PaymentDetails[]) => {
          const payment = payments[0];
          if (!payment) {
            throw new Error("Payment record not found");
          }

          const updatedPayment: PaymentDetails = {
            ...payment,
            paymentMethod: paymentData.paymentMethod,
            transactionId: `TXN_${Date.now()}`,
            paymentDate: new Date().toISOString(),
            status: "completed",
          };

          // Update payment status
          this.http
            .put(`${this.apiUrl}/paymentDetails/${payment.id}`, updatedPayment)
            .subscribe();

          // Update application status to payment_completed
          this.updateApplicationStatus(
            paymentData.applicationId,
            "payment_completed",
          ).subscribe();

          return updatedPayment;
        }),
        catchError(this.handleError),
      );
  }

  // Update application status
  private updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus["status"],
  ): Observable<ApplicationStatus> {
    return this.http
      .get<ApplicationStatus>(
        `${this.apiUrl}/applicationStatuses/${applicationId}`,
      )
      .pipe(
        map((application: ApplicationStatus) => {
          const updatedApplication: ApplicationStatus = {
            ...application,
            status,
            lastUpdated: new Date().toISOString(),
          };

          this.http
            .put(
              `${this.apiUrl}/applicationStatuses/${applicationId}`,
              updatedApplication,
            )
            .subscribe();

          // Refresh application status
          this.loadStudentApplicationStatus();

          return updatedApplication;
        }),
        catchError(this.handleError),
      );
  }

  // Resubmit application (for rejected applications)
  resubmitApplication(
    applicationId: string,
    updatedData: any,
  ): Observable<ApplicationStatus> {
    return this.http
      .get<ApplicationStatus>(
        `${this.apiUrl}/applicationStatuses/${applicationId}`,
      )
      .pipe(
        map((application: ApplicationStatus) => {
          const updatedApplication: ApplicationStatus = {
            ...application,
            status: "resubmitted",
            resubmissionCount: application.resubmissionCount + 1,
            lastUpdated: new Date().toISOString(),
            rejectionReason: undefined, // Clear rejection reason
          };

          this.http
            .put(
              `${this.apiUrl}/applicationStatuses/${applicationId}`,
              updatedApplication,
            )
            .subscribe();

          // Refresh application status
          this.loadStudentApplicationStatus();

          return updatedApplication;
        }),
        catchError(this.handleError),
      );
  }

  // Check if student can access dashboard
  canAccessDashboard(): Observable<boolean> {
    return this.applicationStatus$.pipe(
      map((data: StudentApplicationData) => data.canAccessDashboard),
    );
  }

  // Get current student data
  getCurrentStudentData(): StudentApplicationData {
    return this.applicationStatusSubject.value;
  }

  // Manually refresh application status
  refreshApplicationStatus(): void {
    this.loadStudentApplicationStatus();
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
