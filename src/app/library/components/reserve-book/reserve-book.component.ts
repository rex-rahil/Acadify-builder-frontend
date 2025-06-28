import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LibraryService } from "../../services/library.service";
import { Book } from "../../models/book.interface";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-reserve-book",
  templateUrl: "./reserve-book.component.html",
  styleUrls: ["./reserve-book.component.scss"],
})
export class ReserveBookComponent implements OnInit {
  @Input() visible = false;
  @Input() book: Book | null = null;
  @Input() studentId: string = "";
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() bookReserved = new EventEmitter<void>();

  reserveForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private messageService: MessageService,
  ) {
    this.reserveForm = this.fb.group({
      priority: ["normal", Validators.required],
      notificationMethod: ["email", Validators.required],
      studentNote: [""],
      acknowledgement: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {}

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  onSubmit() {
    if (this.reserveForm.valid && this.book) {
      this.loading = true;

      this.libraryService.reserveBook(this.studentId, this.book.id).subscribe({
        next: (reservation) => {
          this.loading = false;
          this.bookReserved.emit();
          this.onHide();
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Reservation Failed",
            detail: error.error?.message || "Failed to reserve book",
          });
        },
      });
    }
  }

  private resetForm() {
    this.reserveForm.reset();
    this.reserveForm.patchValue({
      priority: "normal",
      notificationMethod: "email",
      acknowledgement: false,
    });
  }

  getExpiryDate(): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from today
    return expiryDate;
  }

  getEstimatedWaitTime(): string {
    if (!this.book) return "Unknown";

    const issuedCopies = this.book.totalCopies - this.book.availableCopies;
    const averageReturnTime = 14; // days
    const estimatedDays = Math.ceil(
      (issuedCopies * averageReturnTime) / this.book.totalCopies,
    );

    return `${estimatedDays}-${estimatedDays + 7} days`;
  }

  getPriorityOptions() {
    return [
      { label: "Normal", value: "normal" },
      { label: "High (Academic Project)", value: "high" },
      { label: "Urgent (Exam)", value: "urgent" },
    ];
  }

  getNotificationOptions() {
    return [
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
      { label: "Both", value: "both" },
    ];
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getBookImageUrl(book: any): string {
    return (
      book.coverImage ||
      `https://via.placeholder.com/150x200/87ceeb/ffffff?text=${encodeURIComponent(book.title.substring(0, 15))}`
    );
  }
}
