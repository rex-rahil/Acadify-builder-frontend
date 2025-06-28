import express, { Request, Response } from "express";

const router = express.Router();

// Mock data for demonstration
const mockBooks = [
  {
    id: "1",
    title: "Pharmaceutical Chemistry - I",
    author: "Dr. K.D. Tripathi",
    isbn: "978-8123917695",
    subject: "Pharmaceutical Chemistry",
    publisher: "Jaypee Brothers Medical Publishers",
    publishedYear: 2020,
    edition: "8th Edition",
    totalCopies: 5,
    availableCopies: 3,
    language: "English",
    pages: 720,
    description:
      "Comprehensive textbook covering fundamental concepts of pharmaceutical chemistry including organic chemistry, medicinal chemistry, and drug design principles.",
    location: {
      shelf: "A1",
      section: "Pharmacy",
    },
    tags: ["chemistry", "pharmaceutical", "medicinal", "organic"],
    addedDate: new Date("2023-01-15"),
    lastUpdated: new Date("2024-01-10"),
  },
  {
    id: "2",
    title: "Pharmacology and Pharmacotherapeutics",
    author: "Dr. R.S. Satoskar",
    isbn: "978-8123923465",
    subject: "Pharmacology",
    publisher: "Popular Prakashan",
    publishedYear: 2021,
    edition: "25th Edition",
    totalCopies: 4,
    availableCopies: 0,
    language: "English",
    pages: 956,
    description:
      "Standard reference book for pharmacology covering drug mechanisms, therapeutic uses, adverse effects, and clinical applications.",
    location: {
      shelf: "B2",
      section: "Pharmacy",
    },
    tags: ["pharmacology", "therapeutics", "drugs", "clinical"],
    addedDate: new Date("2023-02-20"),
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "3",
    title: "Pharmaceutics - The Science of Dosage Form Design",
    author: "Michael E. Aulton",
    isbn: "978-0702070327",
    subject: "Pharmaceutics",
    publisher: "Churchill Livingstone",
    publishedYear: 2019,
    edition: "5th Edition",
    totalCopies: 6,
    availableCopies: 4,
    language: "English",
    pages: 816,
    description:
      "Comprehensive guide to pharmaceutical formulation and drug delivery systems, covering all aspects of dosage form design.",
    location: {
      shelf: "C1",
      section: "Pharmacy",
    },
    tags: ["pharmaceutics", "formulation", "dosage", "design"],
    addedDate: new Date("2023-03-10"),
    lastUpdated: new Date("2024-01-20"),
  },
  {
    id: "4",
    title: "Pharmaceutical Microbiology",
    author: "Dr. W.B. Hugo",
    isbn: "978-8123917234",
    subject: "Microbiology",
    publisher: "Blackwell Publishing",
    publishedYear: 2020,
    edition: "8th Edition",
    totalCopies: 3,
    availableCopies: 2,
    language: "English",
    pages: 640,
    description:
      "Essential textbook covering pharmaceutical microbiology, sterilization, preservation, and quality control in pharmaceutical manufacturing.",
    location: {
      shelf: "D1",
      section: "Pharmacy",
    },
    tags: ["microbiology", "sterilization", "quality control"],
    addedDate: new Date("2023-04-05"),
    lastUpdated: new Date("2024-01-25"),
  },
  {
    id: "5",
    title: "Biochemistry for Pharmacy Students",
    author: "Dr. U. Satyanarayana",
    isbn: "978-8123918567",
    subject: "Biochemistry",
    publisher: "Books and Allied (P) Ltd",
    publishedYear: 2021,
    edition: "4th Edition",
    totalCopies: 5,
    availableCopies: 3,
    language: "English",
    pages: 680,
    description:
      "Comprehensive biochemistry textbook specifically designed for pharmacy students, covering metabolic pathways, enzymes, and molecular biology.",
    location: {
      shelf: "E1",
      section: "Basic Sciences",
    },
    tags: ["biochemistry", "metabolism", "enzymes", "molecular biology"],
    addedDate: new Date("2023-05-12"),
    lastUpdated: new Date("2024-02-01"),
  },
];

let mockIssues: any[] = [
  {
    id: "issue1",
    studentId: "OCP2024001",
    studentName: "John Doe",
    bookId: "1",
    bookTitle: "Pharmaceutical Chemistry - I",
    issueDate: new Date("2024-01-15"),
    dueDate: new Date("2024-01-29"),
    status: "issued",
    renewalCount: 0,
    fineAmount: 0,
  },
];

let mockReservations: any[] = [
  {
    id: "res1",
    studentId: "OCP2024001",
    studentName: "John Doe",
    bookId: "2",
    bookTitle: "Pharmacology and Pharmacotherapeutics",
    reservationDate: new Date("2024-01-20"),
    expiryDate: new Date("2024-02-20"),
    status: "active",
    position: 1,
  },
];

// GET /api/library/books - Get all books
router.get("/books", (req: Request, res: Response) => {
  res.json(mockBooks);
});

// GET /api/library/books/:id - Get book by ID
router.get("/books/:id", (req: Request, res: Response) => {
  const book = mockBooks.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

// GET /api/library/books/search - Search books
router.get("/books/search", (req: Request, res: Response) => {
  const { search, subject } = req.query;
  let filteredBooks = mockBooks;

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.includes(searchTerm),
    );
  }

  if (subject) {
    filteredBooks = filteredBooks.filter((book) => book.subject === subject);
  }

  res.json(filteredBooks);
});

// GET /api/library/books/subject/:subject - Get books by subject
router.get("/books/subject/:subject", (req: Request, res: Response) => {
  const books = mockBooks.filter((book) => book.subject === req.params.subject);
  res.json(books);
});

// POST /api/library/issue - Issue a book
router.post("/issue", (req: Request, res: Response) => {
  const { studentId, bookId } = req.body;

  // Find the book
  const book = mockBooks.find((b) => b.id === bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if book is available
  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: "Book is not available for issue" });
  }

  // Check if student already has this book
  const existingIssue = mockIssues.find(
    (issue) =>
      issue.studentId === studentId &&
      issue.bookId === bookId &&
      issue.status === "issued",
  );

  if (existingIssue) {
    return res
      .status(400)
      .json({ message: "You already have this book issued" });
  }

  // Create new issue
  const newIssue = {
    id: `issue${Date.now()}`,
    studentId,
    studentName: "John Doe", // This would come from student database
    bookId,
    bookTitle: book.title,
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: "issued",
    renewalCount: 0,
    fineAmount: 0,
  };

  mockIssues.push(newIssue);

  // Update book availability
  book.availableCopies--;

  res.status(201).json(newIssue);
});

// POST /api/library/return - Return a book
router.post("/return", (req: Request, res: Response) => {
  const { issueId } = req.body;

  const issueIndex = mockIssues.findIndex((issue) => issue.id === issueId);
  if (issueIndex === -1) {
    return res.status(404).json({ message: "Issue record not found" });
  }

  const issue = mockIssues[issueIndex];
  const book = mockBooks.find((b) => b.id === issue.bookId);

  if (book) {
    book.availableCopies++;
  }

  // Update issue status
  issue.status = "returned";
  issue.returnDate = new Date();

  res.json({ message: "Book returned successfully", issue });
});

// POST /api/library/renew - Renew a book
router.post("/renew", (req: Request, res: Response) => {
  const { issueId } = req.body;

  const issue = mockIssues.find((issue) => issue.id === issueId);
  if (!issue) {
    return res.status(404).json({ message: "Issue record not found" });
  }

  if (issue.renewalCount >= 3) {
    return res
      .status(400)
      .json({ message: "Maximum renewal limit reached (3 renewals)" });
  }

  // Check if book is overdue
  if (new Date(issue.dueDate) < new Date()) {
    return res
      .status(400)
      .json({ message: "Cannot renew overdue book. Please pay fine first." });
  }

  // Extend due date by 14 days
  issue.dueDate = new Date(
    new Date(issue.dueDate).getTime() + 14 * 24 * 60 * 60 * 1000,
  );
  issue.renewalCount++;

  res.json(issue);
});

// GET /api/library/issues/student/:studentId - Get student's issues
router.get("/issues/student/:studentId", (req: Request, res: Response) => {
  const studentIssues = mockIssues.filter(
    (issue) =>
      issue.studentId === req.params.studentId &&
      (issue.status === "issued" || issue.status === "overdue"),
  );

  // Update overdue status
  studentIssues.forEach((issue) => {
    if (new Date(issue.dueDate) < new Date() && issue.status === "issued") {
      issue.status = "overdue";
      const overdueDays = Math.floor(
        (new Date().getTime() - new Date(issue.dueDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      issue.fineAmount = overdueDays * 2; // ₹2 per day fine
    }
  });

  res.json(studentIssues);
});

// POST /api/library/reserve - Reserve a book
router.post("/reserve", (req: Request, res: Response) => {
  const { studentId, bookId } = req.body;

  // Find the book
  const book = mockBooks.find((b) => b.id === bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if book is available (no need to reserve if available)
  if (book.availableCopies > 0) {
    return res
      .status(400)
      .json({ message: "Book is available for immediate issue" });
  }

  // Check if student already has a reservation for this book
  const existingReservation = mockReservations.find(
    (res) =>
      res.studentId === studentId &&
      res.bookId === bookId &&
      res.status === "active",
  );

  if (existingReservation) {
    return res
      .status(400)
      .json({ message: "You already have a reservation for this book" });
  }

  // Calculate position in queue
  const activeReservations = mockReservations.filter(
    (res) => res.bookId === bookId && res.status === "active",
  );
  const position = activeReservations.length + 1;

  // Create new reservation
  const newReservation = {
    id: `res${Date.now()}`,
    studentId,
    studentName: "John Doe", // This would come from student database
    bookId,
    bookTitle: book.title,
    reservationDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "active",
    position,
  };

  mockReservations.push(newReservation);

  res.status(201).json(newReservation);
});

// DELETE /api/library/reservations/:id - Cancel reservation
router.delete("/reservations/:id", (req: Request, res: Response) => {
  const reservationIndex = mockReservations.findIndex(
    (res) => res.id === req.params.id,
  );

  if (reservationIndex === -1) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  mockReservations[reservationIndex].status = "cancelled";

  res.json({ message: "Reservation cancelled successfully" });
});

// GET /api/library/reservations/student/:studentId - Get student's reservations
router.get(
  "/reservations/student/:studentId",
  (req: Request, res: Response) => {
    const studentReservations = mockReservations.filter(
      (res) =>
        res.studentId === req.params.studentId &&
        (res.status === "active" || res.status === "fulfilled"),
    );

    res.json(studentReservations);
  },
);

// GET /api/library/stats - Get library statistics
router.get("/stats", (req: Request, res: Response) => {
  const totalBooks = mockBooks.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = mockBooks.reduce(
    (sum, book) => sum + book.availableCopies,
    0,
  );
  const issuedBooks = totalBooks - availableBooks;
  const activeReservations = mockReservations.filter(
    (res) => res.status === "active",
  ).length;
  const activeIssues = mockIssues.filter(
    (issue) => issue.status === "issued" || issue.status === "overdue",
  ).length;
  const overdueBooks = mockIssues.filter(
    (issue) => issue.status === "overdue",
  ).length;

  const stats = {
    totalBooks: mockBooks.length,
    availableBooks,
    issuedBooks,
    reservedBooks: activeReservations,
    overdueBooks,
    totalStudents: 150, // Mock data
    activeIssues,
    activeReservations,
  };

  res.json(stats);
});

// GET /api/library/history/student/:studentId - Get student's library history
router.get("/history/student/:studentId", (req: Request, res: Response) => {
  const studentHistory = {
    issues: mockIssues.filter(
      (issue) => issue.studentId === req.params.studentId,
    ),
    reservations: mockReservations.filter(
      (res) => res.studentId === req.params.studentId,
    ),
  };

  res.json(studentHistory);
});

export default router;
