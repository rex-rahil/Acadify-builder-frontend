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
    if (book.coverImage && book.coverImage.trim() !== "") {
      return book.coverImage;
    }

    // Create a more readable title for placeholder
    const shortTitle =
      book.title.length > 25 ? book.title.substring(0, 22) + "..." : book.title;

    // Use a reliable placeholder service
    return `https://placehold.co/300x400/87ceeb/ffffff/png?text=${encodeURIComponent(shortTitle)}&font=roboto`;
  }
}
