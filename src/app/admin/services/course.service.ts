import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  description?: string;
  prerequisites?: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  duration: number; // in semesters
  description: string;
  status: "active" | "inactive";
  subjects: Subject[];
  createdDate: Date;
  totalCredits: number;
}

@Injectable({
  providedIn: "root",
})
export class CourseService {
  private subjectsSubject = new BehaviorSubject<Subject[]>([
    {
      id: "1",
      name: "Introduction to Programming",
      code: "CS101",
      credits: 4,
      department: "Computer Science",
      description: "Basic programming concepts using Python",
      prerequisites: [],
    },
    {
      id: "2",
      name: "Data Structures and Algorithms",
      code: "CS201",
      credits: 4,
      department: "Computer Science",
      description: "Fundamental data structures and algorithms",
      prerequisites: ["CS101"],
    },
    {
      id: "3",
      name: "Database Systems",
      code: "CS301",
      credits: 3,
      department: "Computer Science",
      description: "Relational database design and SQL",
      prerequisites: ["CS101"],
    },
    {
      id: "4",
      name: "Calculus I",
      code: "MATH101",
      credits: 4,
      department: "Mathematics",
      description: "Differential and integral calculus",
      prerequisites: [],
    },
    {
      id: "5",
      name: "Linear Algebra",
      code: "MATH201",
      credits: 3,
      department: "Mathematics",
      description: "Vector spaces and linear transformations",
      prerequisites: ["MATH101"],
    },
    {
      id: "6",
      name: "Physics I",
      code: "PHYS101",
      credits: 4,
      department: "Physics",
      description: "Mechanics and thermodynamics",
      prerequisites: ["MATH101"],
    },
    {
      id: "7",
      name: "Business Ethics",
      code: "BUS201",
      credits: 2,
      department: "Business",
      description: "Ethical considerations in business",
      prerequisites: [],
    },
    {
      id: "8",
      name: "Financial Accounting",
      code: "BUS101",
      credits: 3,
      department: "Business",
      description: "Principles of financial accounting",
      prerequisites: [],
    },
  ]);

  private coursesSubject = new BehaviorSubject<Course[]>([
    {
      id: "1",
      name: "Bachelor of Computer Science",
      code: "BCS",
      department: "Computer Science",
      duration: 8,
      description:
        "Comprehensive computer science program covering programming, algorithms, and software engineering",
      status: "active",
      subjects: [],
      createdDate: new Date("2023-01-15"),
      totalCredits: 120,
    },
    {
      id: "2",
      name: "Bachelor of Business Administration",
      code: "BBA",
      department: "Business",
      duration: 8,
      description:
        "Business administration program focusing on management and entrepreneurship",
      status: "active",
      subjects: [],
      createdDate: new Date("2023-01-20"),
      totalCredits: 120,
    },
    {
      id: "3",
      name: "Bachelor of Mathematics",
      code: "BSc Math",
      department: "Mathematics",
      duration: 6,
      description: "Pure and applied mathematics program",
      status: "active",
      subjects: [],
      createdDate: new Date("2023-02-01"),
      totalCredits: 90,
    },
    {
      id: "4",
      name: "Bachelor of Physics",
      code: "BSc Physics",
      department: "Physics",
      duration: 6,
      description: "Comprehensive physics program with laboratory work",
      status: "inactive",
      subjects: [],
      createdDate: new Date("2023-03-15"),
      totalCredits: 90,
    },
  ]);

  constructor() {
    // Initialize courses with some subjects
    this.initializeCoursesWithSubjects();
  }

  private initializeCoursesWithSubjects() {
    const subjects = this.subjectsSubject.value;
    const courses = this.coursesSubject.value;

    const updatedCourses = courses.map((course) => {
      switch (course.code) {
        case "BCS":
          course.subjects = subjects.filter(
            (s) =>
              s.department === "Computer Science" ||
              s.department === "Mathematics",
          );
          break;
        case "BBA":
          course.subjects = subjects.filter((s) => s.department === "Business");
          break;
        case "BSc Math":
          course.subjects = subjects.filter(
            (s) => s.department === "Mathematics",
          );
          break;
        case "BSc Physics":
          course.subjects = subjects.filter(
            (s) => s.department === "Physics" || s.department === "Mathematics",
          );
          break;
      }
      return course;
    });

    this.coursesSubject.next(updatedCourses);
  }

  // Course methods
  getCourses(): Observable<Course[]> {
    return this.coursesSubject.asObservable().pipe(delay(500));
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.coursesSubject.pipe(
      map((courses) => courses.find((course) => course.id === id)),
      delay(300),
    );
  }

  createCourse(
    course: Omit<Course, "id" | "createdDate" | "subjects" | "totalCredits">,
  ): Observable<Course> {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdDate: new Date(),
      subjects: [],
      totalCredits: 0,
    };

    const currentCourses = this.coursesSubject.value;
    this.coursesSubject.next([...currentCourses, newCourse]);

    return of(newCourse).pipe(delay(800));
  }

  updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
    const currentCourses = this.coursesSubject.value;
    const courseIndex = currentCourses.findIndex((course) => course.id === id);

    if (courseIndex !== -1) {
      const updatedCourse = { ...currentCourses[courseIndex], ...updates };
      const updatedCourses = [...currentCourses];
      updatedCourses[courseIndex] = updatedCourse;
      this.coursesSubject.next(updatedCourses);
      return of(updatedCourse).pipe(delay(600));
    }

    throw new Error("Course not found");
  }

  deleteCourse(id: string): Observable<void> {
    const currentCourses = this.coursesSubject.value;
    const filteredCourses = currentCourses.filter((course) => course.id !== id);
    this.coursesSubject.next(filteredCourses);

    return of(void 0).pipe(delay(500));
  }

  // Subject methods
  getSubjects(): Observable<Subject[]> {
    return this.subjectsSubject.asObservable().pipe(delay(400));
  }

  getSubjectById(id: string): Observable<Subject | undefined> {
    return this.subjectsSubject.pipe(
      map((subjects) => subjects.find((subject) => subject.id === id)),
      delay(300),
    );
  }

  createSubject(subject: Omit<Subject, "id">): Observable<Subject> {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
    };

    const currentSubjects = this.subjectsSubject.value;
    this.subjectsSubject.next([...currentSubjects, newSubject]);

    return of(newSubject).pipe(delay(800));
  }

  updateSubject(id: string, updates: Partial<Subject>): Observable<Subject> {
    const currentSubjects = this.subjectsSubject.value;
    const subjectIndex = currentSubjects.findIndex(
      (subject) => subject.id === id,
    );

    if (subjectIndex !== -1) {
      const updatedSubject = { ...currentSubjects[subjectIndex], ...updates };
      const updatedSubjects = [...currentSubjects];
      updatedSubjects[subjectIndex] = updatedSubject;
      this.subjectsSubject.next(updatedSubjects);
      return of(updatedSubject).pipe(delay(600));
    }

    throw new Error("Subject not found");
  }

  deleteSubject(id: string): Observable<void> {
    const currentSubjects = this.subjectsSubject.value;
    const filteredSubjects = currentSubjects.filter(
      (subject) => subject.id !== id,
    );
    this.subjectsSubject.next(filteredSubjects);

    return of(void 0).pipe(delay(500));
  }

  // Subject allocation methods
  allocateSubjectsToCourse(
    courseId: string,
    subjectIds: string[],
  ): Observable<Course> {
    const subjects = this.subjectsSubject.value;
    const selectedSubjects = subjects.filter((s) => subjectIds.includes(s.id));
    const totalCredits = selectedSubjects.reduce(
      (sum, s) => sum + s.credits,
      0,
    );

    return this.updateCourse(courseId, {
      subjects: selectedSubjects,
      totalCredits,
    });
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
