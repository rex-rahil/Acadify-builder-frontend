import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Book } from "../../models/book.interface";

@Component({
  selector: "app-book-list",
  templateUrl: "./book-list.component.html",
  styleUrls: ["./book-list.component.scss"],
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Input() loading = false;
  @Output() issueBook = new EventEmitter<Book>();
  @Output() reserveBook = new EventEmitter<Book>();

  layout: "list" | "grid" = "grid";

  onIssueBook(book: Book) {
    this.issueBook.emit(book);
  }

  onReserveBook(book: Book) {
    this.reserveBook.emit(book);
  }

  getAvailabilityStatus(book: Book): string {
    if (book.availableCopies > 0) {
      return "Available";
    } else if (book.totalCopies > book.availableCopies) {
      return "Reserved";
    } else {
      return "Not Available";
    }
  }

  getAvailabilitySeverity(book: Book): string {
    if (book.availableCopies > 0) {
      return "success";
    } else if (book.totalCopies > book.availableCopies) {
      return "warning";
    } else {
      return "danger";
    }
  }

  getBookImage(book: Book): string {
    return (
      book.coverImage ||
      `https://via.placeholder.com/200x300/87ceeb/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`
    );
  }
}
