import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "student" | "faculty" | "admin" | "admission_officer" | "hod";
  status: "active" | "inactive" | "pending";
  createdDate: Date;
  lastLogin?: Date;
  department?: string;
  employeeId?: string;
  studentId?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@college.edu",
      phone: "+1-555-0101",
      role: "admin",
      status: "active",
      createdDate: new Date("2023-01-15"),
      lastLogin: new Date("2024-01-10T09:30:00"),
      employeeId: "EMP001",
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@college.edu",
      phone: "+1-555-0102",
      role: "faculty",
      status: "active",
      createdDate: new Date("2023-02-20"),
      lastLogin: new Date("2024-01-09T14:20:00"),
      department: "Computer Science",
      employeeId: "EMP002",
    },
    {
      id: "3",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@student.college.edu",
      phone: "+1-555-0103",
      role: "student",
      status: "active",
      createdDate: new Date("2023-08-15"),
      lastLogin: new Date("2024-01-10T11:45:00"),
      department: "Engineering",
      studentId: "STU006",
    },
    {
      id: "4",
      firstName: "Emily",
      lastName: "Brown",
      email: "emily.brown@college.edu",
      phone: "+1-555-0104",
      role: "admission_officer",
      status: "active",
      createdDate: new Date("2023-03-10"),
      lastLogin: new Date("2024-01-08T16:10:00"),
      employeeId: "EMP003",
    },
    {
      id: "5",
      firstName: "Michael",
      lastName: "Davis",
      email: "michael.davis@student.college.edu",
      phone: "+1-555-0105",
      role: "student",
      status: "inactive",
      createdDate: new Date("2023-09-01"),
      department: "Business",
      studentId: "STU007",
    },
  ]);

  constructor() {}

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable().pipe(delay(500));
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.usersSubject.pipe(
      map((users) => users.find((user) => user.id === id)),
      delay(300),
    );
  }

  createUser(user: Omit<User, "id" | "createdDate">): Observable<User> {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdDate: new Date(),
    };

    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, newUser]);

    return of(newUser).pipe(delay(800));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const updatedUser = { ...currentUsers[userIndex], ...updates };
      const updatedUsers = [...currentUsers];
      updatedUsers[userIndex] = updatedUser;
      this.usersSubject.next(updatedUsers);
      return of(updatedUser).pipe(delay(600));
    }

    throw new Error("User not found");
  }

  deleteUser(id: string): Observable<void> {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter((user) => user.id !== id);
    this.usersSubject.next(filteredUsers);

    return of(void 0).pipe(delay(500));
  }

  toggleUserStatus(id: string): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const user = currentUsers[userIndex];
      const newStatus = user.status === "active" ? "inactive" : "active";
      return this.updateUser(id, { status: newStatus });
    }

    throw new Error("User not found");
  }

  getRoles(): Observable<string[]> {
    return of(["student", "faculty", "admin", "admission_officer"]).pipe(
      delay(200),
    );
  }

  getDepartments(): Observable<string[]> {
    return of([
      "Computer Science",
      "Engineering",
      "Business",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Psychology",
    ]).pipe(delay(200));
  }
}
