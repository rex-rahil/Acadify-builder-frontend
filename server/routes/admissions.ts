import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/admissions";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and PDF files are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Handle multiple file uploads
const uploadFields = upload.fields([
  { name: "passportPhoto", maxCount: 1 },
  { name: "sscCertificate", maxCount: 1 },
  { name: "hscCertificate", maxCount: 1 },
  { name: "mhtCetScorecard", maxCount: 1 },
  { name: "dpharmMarkLists", maxCount: 1 },
  { name: "collegeLeaving", maxCount: 1 },
  { name: "birthCertificate", maxCount: 1 },
  { name: "casteCertificate", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "bankPassbook", maxCount: 1 },
  { name: "physicalFitness", maxCount: 1 },
]);

interface AdmissionApplication {
  id: string;
  applicationData: any;
  documents: { [key: string]: string };
  submittedAt: Date;
  status: "submitted" | "under_review" | "approved" | "rejected";
}

// In-memory storage for demo (in production, use a database)
const applications: AdmissionApplication[] = [];

export const handleAdmissionSubmission: RequestHandler = (req, res) => {
  uploadFields(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "File too large",
            message: "File size should not exceed 5MB",
          });
        }
      }
      return res.status(400).json({
        error: "File upload error",
        message: err.message,
      });
    }

    try {
      // Parse application data
      const applicationData = JSON.parse(req.body.applicationData);

      // Generate application ID
      const applicationId = `OCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Process uploaded files
      const documents: { [key: string]: string } = {};
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files) {
        Object.keys(files).forEach((fieldName) => {
          if (files[fieldName] && files[fieldName][0]) {
            documents[fieldName] = files[fieldName][0].path;
          }
        });
      }

      // Validate required documents
      const requiredDocuments = [
        "passportPhoto",
        "sscCertificate",
        "hscCertificate",
        "dpharmMarkLists",
        "collegeLeaving",
        "birthCertificate",
        "aadharCard",
        "bankPassbook",
        "physicalFitness",
      ];

      const missingDocuments = requiredDocuments.filter(
        (doc) => !documents[doc],
      );

      if (missingDocuments.length > 0) {
        return res.status(400).json({
          error: "Missing required documents",
          missingDocuments,
          message: `Please upload the following required documents: ${missingDocuments.join(", ")}`,
        });
      }

      // Validate application data
      const validationErrors = validateApplicationData(applicationData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          validationErrors,
          message: "Please correct the validation errors and try again",
        });
      }

      // Create application record
      const application: AdmissionApplication = {
        id: applicationId,
        applicationData,
        documents,
        submittedAt: new Date(),
        status: "submitted",
      };

      // Save application (in production, save to database)
      applications.push(application);

      // Send confirmation email (implement email service)
      // await sendConfirmationEmail(applicationData.personalDetails.email, applicationId);

      res.status(201).json({
        success: true,
        applicationId,
        message: "Application submitted successfully",
        submittedAt: application.submittedAt,
      });
    } catch (error) {
      console.error("Error processing admission application:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to process application. Please try again.",
      });
    }
  });
};

// Get application status
export const getApplicationStatus: RequestHandler = (req, res) => {
  const { applicationId } = req.params;

  const application = applications.find((app) => app.id === applicationId);

  if (!application) {
    return res.status(404).json({
      error: "Application not found",
      message: "No application found with the provided ID",
    });
  }

  res.json({
    applicationId: application.id,
    status: application.status,
    submittedAt: application.submittedAt,
    personalDetails: {
      name: `${application.applicationData.personalDetails.firstName} ${application.applicationData.personalDetails.lastName}`,
      email: application.applicationData.personalDetails.email,
    },
  });
};

// List all applications (admin endpoint)
export const listApplications: RequestHandler = (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;

  let filteredApplications = applications;

  if (status) {
    filteredApplications = applications.filter((app) => app.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    endIndex,
  );

  const result = paginatedApplications.map((app) => ({
    id: app.id,
    name: `${app.applicationData.personalDetails.firstName} ${app.applicationData.personalDetails.lastName}`,
    email: app.applicationData.personalDetails.email,
    submittedAt: app.submittedAt,
    status: app.status,
  }));

  res.json({
    applications: result,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredApplications.length / limit),
      totalApplications: filteredApplications.length,
      hasNext: endIndex < filteredApplications.length,
      hasPrev: startIndex > 0,
    },
  });
};

function validateApplicationData(data: any): string[] {
  const errors: string[] = [];

  // Validate personal details
  if (!data.personalDetails) {
    errors.push("Personal details are required");
  } else {
    const personal = data.personalDetails;
    if (!personal.firstName?.trim()) errors.push("First name is required");
    if (!personal.lastName?.trim()) errors.push("Last name is required");
    if (!personal.fatherHusbandName?.trim())
      errors.push("Father/Husband name is required");
    if (!personal.dateOfBirth) errors.push("Date of birth is required");
    if (!personal.gender) errors.push("Gender is required");
    if (!personal.email?.trim()) errors.push("Email is required");
    if (!personal.cellNo?.trim()) errors.push("Cell number is required");
    if (!personal.nationality?.trim()) errors.push("Nationality is required");
    if (!personal.domicile?.trim()) errors.push("Domicile is required");
    if (!personal.residentialAddress?.trim())
      errors.push("Residential address is required");

    // Email validation
    if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
      errors.push("Invalid email format");
    }

    // PAN validation
    if (
      personal.panCardNo &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(personal.panCardNo)
    ) {
      errors.push("Invalid PAN card format");
    }

    // Aadhar validation
    if (personal.aadharCardNo && !/^\d{12}$/.test(personal.aadharCardNo)) {
      errors.push("Invalid Aadhar card format");
    }
  }

  // Validate category & eligibility
  if (!data.categoryEligibility) {
    errors.push("Category & eligibility details are required");
  } else {
    const category = data.categoryEligibility;
    if (!category.physicallyHandicapped)
      errors.push("Physically handicapped status is required");
    if (!category.maritalStatus) errors.push("Marital status is required");
    if (!category.eligibilityAgreement)
      errors.push("Eligibility agreement is required");
  }

  // Validate parent/guardian details
  if (!data.parentGuardian) {
    errors.push("Parent/Guardian details are required");
  } else {
    const parents = data.parentGuardian;
    if (!parents.father?.name?.trim()) errors.push("Father's name is required");
    if (!parents.mother?.name?.trim()) errors.push("Mother's name is required");

    // Validate references
    if (!parents.references || parents.references.length < 2) {
      errors.push("Two references are required");
    } else {
      parents.references.forEach((ref: any, index: number) => {
        if (!ref.name?.trim())
          errors.push(`Reference ${index + 1} name is required`);
        if (!ref.cellNo?.trim())
          errors.push(`Reference ${index + 1} cell number is required`);
        if (!ref.address?.trim())
          errors.push(`Reference ${index + 1} address is required`);
        if (!ref.profession?.trim())
          errors.push(`Reference ${index + 1} profession is required`);
      });
    }
  }

  // Validate documents & declaration
  if (!data.documentsDeclaration) {
    errors.push("Documents & declaration details are required");
  } else {
    const docs = data.documentsDeclaration;
    if (!docs.undertakingAgreement)
      errors.push("Undertaking agreement is required");
    if (!docs.applicantSignature?.trim())
      errors.push("Applicant signature is required");
    if (!docs.parentSignature?.trim())
      errors.push("Parent signature is required");
    if (!docs.declarationDate) errors.push("Declaration date is required");
  }

  return errors;
}
