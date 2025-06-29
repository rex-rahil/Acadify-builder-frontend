const http = require("http");

const testEndpoints = [
  "http://localhost:3001/facultyProfiles",
  "http://localhost:3001/departments",
  "http://localhost:3001/subjects",
  "http://localhost:3001/schedules",
  "http://localhost:3001/classSessions",
  "http://localhost:3001/facultyAttendance",
  "http://localhost:3001/leaveRequests",
  "http://localhost:3001/facultyAssignments",
  "http://localhost:3001/dashboardStats",
  "http://localhost:3001/leaveBalances",
  "http://localhost:3001/workloadSummaries",
  "http://localhost:3001/attendanceStats",
];

console.log("🧪 Testing JSON Server Endpoints...\n");

const testEndpoint = (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            console.log(
              `✅ ${url.split("/").pop()} - ${parsed.length || "OK"} records`,
            );
            resolve(parsed);
          } catch (e) {
            console.log(`❌ ${url.split("/").pop()} - Parse error`);
            reject(e);
          }
        });
      })
      .on("error", (err) => {
        console.log(`❌ ${url.split("/").pop()} - Connection error`);
        reject(err);
      });
  });
};

const runTests = async () => {
  for (const endpoint of testEndpoints) {
    try {
      await testEndpoint(endpoint);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
    } catch (error) {
      // Continue with other tests
    }
  }

  console.log("\n🚀 JSON Server is ready to serve faculty data!");
  console.log("\n📋 Available Endpoints:");
  testEndpoints.forEach((url) => {
    console.log(`   ${url}`);
  });

  console.log("\n🎯 Faculty Management Features:");
  console.log(
    "   📊 Dashboard: http://localhost:3001/dashboardStats?facultyId=faculty_001",
  );
  console.log(
    "   👤 Profile: http://localhost:3001/facultyProfiles/faculty_001",
  );
  console.log(
    "   📚 Subjects: http://localhost:3001/subjects?assignedFacultyId=faculty_001",
  );
  console.log(
    "   📅 Schedule: http://localhost:3001/schedules?facultyId=faculty_001",
  );
  console.log(
    "   ✅ Attendance: http://localhost:3001/facultyAttendance?facultyId=faculty_001",
  );
  console.log(
    "   🏖️  Leaves: http://localhost:3001/leaveRequests?facultyId=faculty_001",
  );
};

runTests();
