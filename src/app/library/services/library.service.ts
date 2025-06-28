import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Book,
  BookIssue,
  BookReservation,
  LibraryStats,
} from "../models/book.interface";

@Injectable({
  providedIn: "root",
})
export class LibraryService {
  private apiUrl = "/api/library";

  constructor(private http: HttpClient) {}

  // Book operations
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  searchBooks(query: string, filters?: any): Observable<Book[]> {
    let params = { search: query };
    if (filters) {
      params = { ...params, ...filters };
    }
    return this.http.get<Book[]>(`${this.apiUrl}/books/search`, { params });
  }

  getBooksBySubject(subject: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/subject/${subject}`);
  }

  // Issue operations
  issueBook(studentId: string, bookId: string): Observable<BookIssue> {
    return this.http.post<BookIssue>(`${this.apiUrl}/issue`, {
      studentId,
      bookId,
    });
  }

  returnBook(issueId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/return`, { issueId });
  }

  renewBook(issueId: string): Observable<BookIssue> {
    return this.http.post<BookIssue>(`${this.apiUrl}/renew`, { issueId });
  }

  getStudentIssues(studentId: string): Observable<BookIssue[]> {
    return this.http.get<BookIssue[]>(
      `${this.apiUrl}/issues/student/${studentId}`,
    );
  }

  // Reservation operations
  reserveBook(studentId: string, bookId: string): Observable<BookReservation> {
    return this.http.post<BookReservation>(`${this.apiUrl}/reserve`, {
      studentId,
      bookId,
    });
  }

  cancelReservation(reservationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${reservationId}`);
  }

  getStudentReservations(studentId: string): Observable<BookReservation[]> {
    return this.http.get<BookReservation[]>(
      `${this.apiUrl}/reservations/student/${studentId}`,
    );
  }

  // Library statistics
  getLibraryStats(): Observable<LibraryStats> {
    return this.http.get<LibraryStats>(`${this.apiUrl}/stats`);
  }

  // Student library history
  getStudentLibraryHistory(studentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/student/${studentId}`);
  }
}
