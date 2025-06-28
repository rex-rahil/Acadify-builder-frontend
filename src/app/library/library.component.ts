import { Component, OnInit } from "@angular/core";
import { LibraryService } from "./services/library.service";
import {
  Book,
  BookIssue,
  BookReservation,
  LibraryStats,
} from "./models/book.interface";
import { MessageService, ConfirmationService } from "primeng/api";

@Component({
  selector: "app-library",
  templateUrl: "./library.component.html",
  styleUrls: ["./library.component.scss"],
  providers: [MessageService, ConfirmationService],
})
export class LibraryComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  myIssues: BookIssue[] = [];
  myReservations: BookReservation[] = [];
  libraryStats: LibraryStats | null = null;

  selectedBook: Book | null = null;
  showIssueDialog = false;
  showReserveDialog = false;

  searchQuery = "";
  selectedSubject = "";
  subjects: string[] = [];

  activeTab = 0;

  currentStudentId = "OCP2024001"; // This would come from auth service

  loading = true;

  constructor(
    private libraryService: LibraryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.loadLibraryData();
  }

  loadLibraryData() {
    this.loading = true;

    // Load all books
    this.libraryService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = books;
        this.subjects = [...new Set(books.map((book) => book.subject))].sort();
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading books:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load library books",
        });
        this.loading = false;
      },
    });

    // Load student's current issues
    this.libraryService.getStudentIssues(this.currentStudentId).subscribe({
      next: (issues) => {
        this.myIssues = issues;
      },
      error: (error) => {
        console.error("Error loading issues:", error);
      },
    });

    // Load student's reservations
    this.libraryService
      .getStudentReservations(this.currentStudentId)
      .subscribe({
        next: (reservations) => {
          this.myReservations = reservations;
        },
        error: (error) => {
          console.error("Error loading reservations:", error);
        },
      });

    // Load library statistics
    this.libraryService.getLibraryStats().subscribe({
      next: (stats) => {
        this.libraryStats = stats;
      },
      error: (error) => {
        console.error("Error loading library stats:", error);
      },
    });
  }

  onSearch() {
    this.filterBooks();
  }

  onSubjectFilter() {
    this.filterBooks();
  }

  private filterBooks() {
    this.filteredBooks = this.books.filter((book) => {
      const matchesSearch =
        !this.searchQuery ||
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.isbn.includes(this.searchQuery);

      const matchesSubject =
        !this.selectedSubject || book.subject === this.selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }

  clearFilters() {
    this.searchQuery = "";
    this.selectedSubject = "";
    this.filteredBooks = this.books;
  }

  openIssueDialog(book: Book) {
    if (book.availableCopies === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Book Not Available",
        detail:
          "This book is currently not available for issue. You can reserve it instead.",
      });
      return;
    }

    this.selectedBook = book;
    this.showIssueDialog = true;
  }

  openReserveDialog(book: Book) {
    this.selectedBook = book;
    this.showReserveDialog = true;
  }

  onBookIssued() {
    this.showIssueDialog = false;
    this.selectedBook = null;
    this.loadLibraryData(); // Refresh data
    this.messageService.add({
      severity: "success",
      summary: "Book Issued",
      detail: "Book has been successfully issued",
    });
  }

  onBookReserved() {
    this.showReserveDialog = false;
    this.selectedBook = null;
    this.loadLibraryData(); // Refresh data
    this.messageService.add({
      severity: "success",
      summary: "Book Reserved",
      detail: "Book has been successfully reserved",
    });
  }

  renewBook(issue: BookIssue) {
    this.confirmationService.confirm({
      message: "Do you want to renew this book?",
      header: "Confirm Renewal",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.libraryService.renewBook(issue.id!).subscribe({
          next: (renewedIssue) => {
            this.loadLibraryData();
            this.messageService.add({
              severity: "success",
              summary: "Book Renewed",
              detail: `Book renewed until ${new Date(renewedIssue.dueDate).toLocaleDateString()}`,
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Renewal Failed",
              detail: error.error?.message || "Failed to renew book",
            });
          },
        });
      },
    });
  }

  cancelReservation(reservation: BookReservation) {
    this.confirmationService.confirm({
      message: "Do you want to cancel this reservation?",
      header: "Confirm Cancellation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.libraryService.cancelReservation(reservation.id!).subscribe({
          next: () => {
            this.loadLibraryData();
            this.messageService.add({
              severity: "success",
              summary: "Reservation Cancelled",
              detail: "Your reservation has been cancelled",
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Cancellation Failed",
              detail: "Failed to cancel reservation",
            });
          },
        });
      },
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case "issued":
        return "success";
      case "overdue":
        return "danger";
      case "active":
        return "info";
      case "expired":
        return "warning";
      default:
        return "secondary";
    }
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }

  getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
