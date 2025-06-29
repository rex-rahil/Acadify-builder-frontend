import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  ApplicationStatus,
  ApplicationReview,
  ApplicationOverview,
  DocumentReview,
  NotificationMessage,
  PaymentDetails,
  FeeStructure,
} from "../../shared/models/application.interface";

@Injectable({
  providedIn: "root",
})
export class AdmissionOfficerService {
  private apiUrl = "/json-api";

  constructor(private http: HttpClient) {}

  // Dashboard APIs
  getApplicationOverview(): Observable<ApplicationOverview> {
    return this.http.get<any[]>(`${this.apiUrl}/applicationOverview`).pipe(
      map((overview: any[]) => overview[0] || {}),
      catchError(this.handleError),
    );
  }

  // Application Management APIs
  getPendingApplications(): Observable<ApplicationStatus[]> {
    return this.http
      .get<
        ApplicationStatus[]
      >(`${this.apiUrl}/applicationStatuses?status=submitted`)
      .pipe(catchError(this.handleError));
  }

  getApplicationsByStatus(status: string): Observable<ApplicationStatus[]> {
    return this.http
      .get<
        ApplicationStatus[]
      >(`${this.apiUrl}/applicationStatuses?status=${status}`)
      .pipe(catchError(this.handleError));
  }

  getAllApplications(): Observable<ApplicationStatus[]> {
    return this.http
      .get<ApplicationStatus[]>(`${this.apiUrl}/applicationStatuses`)
      .pipe(catchError(this.handleError));
  }

  getApplicationDetails(applicationId: string): Observable<ApplicationStatus> {
    return this.http
      .get<ApplicationStatus>(
        `${this.apiUrl}/applicationStatuses/${applicationId}`,
      )
      .pipe(catchError(this.handleError));
  }

  // Review APIs
  submitApplicationReview(
    review: Partial<ApplicationReview>,
  ): Observable<ApplicationReview> {
    const newReview = {
      id: `review_${Date.now()}`,
      reviewDate: new Date().toISOString(),
      ...review,
    };
    return this.http
      .post<ApplicationReview>(`${this.apiUrl}/applicationReviews`, newReview)
      .pipe(catchError(this.handleError));
  }

  updateApplicationStatus(
    applicationId: string,
    status: string,
    rejectionReason?: string,
  ): Observable<ApplicationStatus> {
    return this.http
      .get<ApplicationStatus>(
        `${this.apiUrl}/applicationStatuses/${applicationId}`,
      )
      .pipe(
        map((application: ApplicationStatus) => {
          const updatedApplication = {
            ...application,
            status,
            reviewedDate: new Date().toISOString(),
            reviewedBy: "Officer_001", // This would come from auth
            rejectionReason: rejectionReason || undefined,
            lastUpdated: new Date().toISOString(),
          };

          // Update the application
          this.http
            .put<ApplicationStatus>(
              `${this.apiUrl}/applicationStatuses/${applicationId}`,
              updatedApplication,
            )
            .subscribe();

          return updatedApplication;
        }),
        catchError(this.handleError),
      );
  }

  // Document Management APIs
  getApplicationDocuments(applicationId: string): Observable<any[]> {
    return this.http
      .get<
        any[]
      >(`${this.apiUrl}/applicationDocuments?applicationId=${applicationId}`)
      .pipe(catchError(this.handleError));
  }

  updateDocumentStatus(
    documentId: string,
    status: "approved" | "rejected",
    rejectionReason?: string,
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/applicationDocuments/${documentId}`)
      .pipe(
        map((document: any) => {
          const updatedDocument = {
            ...document,
            status,
            rejectionReason: rejectionReason || undefined,
            reviewedDate: new Date().toISOString(),
          };

          this.http
            .put<any>(
              `${this.apiUrl}/applicationDocuments/${documentId}`,
              updatedDocument,
            )
            .subscribe();

          return updatedDocument;
        }),
        catchError(this.handleError),
      );
  }

  // Payment Management APIs
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

  updatePaymentStatus(
    paymentId: string,
    status: string,
    transactionId?: string,
  ): Observable<PaymentDetails> {
    return this.http
      .get<PaymentDetails>(`${this.apiUrl}/paymentDetails/${paymentId}`)
      .pipe(
        map((payment: PaymentDetails) => {
          const updatedPayment = {
            ...payment,
            status,
            transactionId: transactionId || payment.transactionId,
            paymentDate:
              status === "completed"
                ? new Date().toISOString()
                : payment.paymentDate,
          };

          this.http
            .put<PaymentDetails>(
              `${this.apiUrl}/paymentDetails/${paymentId}`,
              updatedPayment,
            )
            .subscribe();

          return updatedPayment;
        }),
        catchError(this.handleError),
      );
  }

  getFeeStructure(): Observable<FeeStructure[]> {
    return this.http
      .get<FeeStructure[]>(`${this.apiUrl}/feeStructure`)
      .pipe(catchError(this.handleError));
  }

  // Notification APIs
  sendNotification(
    notification: Partial<NotificationMessage>,
  ): Observable<NotificationMessage> {
    const newNotification = {
      id: `notification_${Date.now()}`,
      isRead: false,
      createdDate: new Date().toISOString(),
      ...notification,
    };
    return this.http
      .post<NotificationMessage>(
        `${this.apiUrl}/notifications`,
        newNotification,
      )
      .pipe(catchError(this.handleError));
  }

  getNotifications(recipientId: string): Observable<NotificationMessage[]> {
    return this.http
      .get<
        NotificationMessage[]
      >(`${this.apiUrl}/notifications?recipientId=${recipientId}`)
      .pipe(catchError(this.handleError));
  }

  // Bulk Operations
  bulkUpdateApplications(
    applicationIds: string[],
    status: string,
    rejectionReason?: string,
  ): Observable<any> {
    const promises = applicationIds.map((id) =>
      this.updateApplicationStatus(id, status, rejectionReason).toPromise(),
    );

    return new Observable((observer) => {
      Promise.all(promises)
        .then((results) => {
          observer.next(results);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // Statistics APIs
  getReviewStatistics(officerId: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/reviewStatistics?officerId=${officerId}`)
      .pipe(
        map((stats: any[]) => stats[0] || {}),
        catchError(this.handleError),
      );
  }

  getApplicationTrends(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/applicationTrends`)
      .pipe(catchError(this.handleError));
  }

  // Export Functions
  exportApplications(filters: any = {}): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/export/applications`, {
        params: filters,
        responseType: "blob",
      })
      .pipe(catchError(this.handleError));
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
