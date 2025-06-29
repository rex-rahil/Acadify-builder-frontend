import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleAdmissionSubmission,
  getApplicationStatus,
  listApplications,
} from "./routes/admissions";
import libraryRoutes from "./routes/library";
import dashboardRoutes from "./routes/dashboard";
import facultyRoutes from "./routes/faculty";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // API Routes
  app.get("/api/ping", (req, res) => {
    res.json({ message: "Server is running!" });
  });

  app.get("/api/demo", handleDemo);

  // Admission routes
  app.post("/api/admissions", handleAdmissionSubmission);
  app.get("/api/admissions/:applicationId", getApplicationStatus);
  app.get("/api/admin/applications", listApplications);

  // Library routes
  app.use("/api/library", libraryRoutes);

  // Dashboard routes
  app.use("/api/dashboard", dashboardRoutes);

  // Health check
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Oriental College Admission System",
    });
  });

  return app;
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`Oriental College Admission Server running on port ${PORT}`);
  });
}
