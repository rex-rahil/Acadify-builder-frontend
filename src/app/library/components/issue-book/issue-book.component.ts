import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LibraryService } from "../../services/library.service";
import { Book } from "../../models/book.interface";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-issue-book",
  templateUrl: "./issue-book.component.html",
  styleUrls: ["./issue-book.component.scss"],
})
export class IssueBookComponent implements OnInit {
  @Input() visible = false;
  @Input() book: Book | null = null;
  @Input() studentId: string = "";
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() bookIssued = new EventEmitter<void>();

  issueForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private messageService: MessageService,
  ) {
    this.issueForm = this.fb.group({
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
    if (this.issueForm.valid && this.book) {
      this.loading = true;

      this.libraryService.issueBook(this.studentId, this.book.id).subscribe({
        next: (issue) => {
          this.loading = false;
          this.bookIssued.emit();
          this.onHide();
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Issue Failed",
            detail: error.error?.message || "Failed to issue book",
          });
        },
      });
    }
  }

  private resetForm() {
    this.issueForm.reset();
    this.issueForm.patchValue({
      acknowledgement: false,
    });
  }

  getDueDate(): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from today
    return dueDate;
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getBookImageUrl(book: any): string {
    if (book.coverImage && book.coverImage.trim() !== "") {
      return book.coverImage;
    }

    // Create a more readable title for placeholder
    const shortTitle =
      book.title.length > 20 ? book.title.substring(0, 18) + "..." : book.title;

    // Use a reliable placeholder service
    return `https://placehold.co/200x280/87ceeb/ffffff/png?text=${encodeURIComponent(shortTitle)}&font=roboto`;
  }
}
