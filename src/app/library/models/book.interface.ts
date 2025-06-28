export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  subject: string;
  publisher: string;
  publishedYear: number;
  edition: string;
  totalCopies: number;
  availableCopies: number;
  language: string;
  pages: number;
  description?: string;
  coverImage?: string;
  location: {
    shelf: string;
    section: string;
  };
  tags: string[];
  addedDate: Date;
  lastUpdated: Date;
}

export interface BookIssue {
  id?: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "issued" | "returned" | "overdue";
  renewalCount: number;
  fineAmount?: number;
}

export interface BookReservation {
  id?: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
  reservationDate: Date;
  expiryDate: Date;
  status: "active" | "fulfilled" | "expired" | "cancelled";
  position: number;
}

export interface LibraryTransaction {
  id: string;
  studentId: string;
  bookId: string;
  type: "issue" | "return" | "reserve" | "cancel_reservation";
  date: Date;
  dueDate?: Date;
  fineAmount?: number;
  notes?: string;
}

export interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  reservedBooks: number;
  overdueBooks: number;
  totalStudents: number;
  activeIssues: number;
  activeReservations: number;
}
