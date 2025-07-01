import { Component, OnInit } from "@angular/core";
import { AdminService, DashboardStats } from "../services/admin.service";

interface StatCard {
  id: string;
  label: string;
  value: number;
  detail: string;
  icon: string;
  iconClass: string;
  trend: string;
  trendIcon: string;
  trendClass: string;
  progress: number;
  progressText: string;
  progressClass: string;
}

interface QuickAction {
  label: string;
  icon: string;
  route: string;
  styleClass: string;
  description: string;
}

interface PerformanceMetric {
  label: string;
  value: string;
  percentage: number;
  status: string;
  description: string;
}

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalSubjects: 0,
    pendingAdmissions: 0,
    enrolledStudents: 0,
    facultyMembers: 0,
    admissionOfficers: 0,
  };

  recentActivities: any[] = [];
  systemHealth: any = {};
  loading = true;

  quickActions: QuickAction[] = [
    {
      label: "User Management",
      icon: "pi pi-users",
      route: "/admin/users",
      styleClass: "p-button-outlined action-users",
      description: "Manage system users and permissions",
    },
    {
      label: "Course Management",
      icon: "pi pi-book",
      route: "/admin/courses",
      styleClass: "p-button-outlined action-courses",
      description: "Manage academic courses and programs",
    },
    {
      label: "Subject Allocation",
      icon: "pi pi-sitemap",
      route: "/admin/subjects",
      styleClass: "p-button-outlined action-subjects",
      description: "Allocate subjects to courses",
    },
    {
      label: "System Reports",
      icon: "pi pi-chart-bar",
      route: "#",
      styleClass: "p-button-outlined action-reports",
      description: "View detailed system reports",
    },
  ];

  performanceMetrics: PerformanceMetric[] = [
    {
      label: "System Performance",
      value: "95%",
      percentage: 95,
      status: "excellent",
      description: "Overall system performance",
    },
    {
      label: "User Satisfaction",
      value: "87%",
      percentage: 87,
      status: "good",
      description: "Based on user feedback",
    },
    {
      label: "Data Integrity",
      value: "100%",
      percentage: 100,
      status: "excellent",
      description: "Database consistency check",
    },
    {
      label: "Security Score",
      value: "92%",
      percentage: 92,
      status: "excellent",
      description: "Security compliance rating",
    },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Load stats
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading stats:", error);
        this.loading = false;
      },
    });

    // Load recent activities
    this.adminService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error("Error loading activities:", error);
      },
    });

    // Load system health
    this.adminService.getSystemHealth().subscribe({
      next: (health) => {
        this.systemHealth = health;
      },
      error: (error) => {
        console.error("Error loading system health:", error);
      },
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case "user_created":
        return "pi pi-user-plus";
      case "user_deactivated":
        return "pi pi-user-minus";
      case "course_updated":
        return "pi pi-book";
      case "admission_approved":
        return "pi pi-check-circle";
      case "subject_allocated":
        return "pi pi-sitemap";
      default:
        return "pi pi-info-circle";
    }
  }

  getHealthIcon(status: string): string {
    return status === "healthy"
      ? "pi pi-check-circle"
      : "pi pi-exclamation-triangle";
  }

  getHealthSeverity(status: string): string {
    return status === "healthy" ? "success" : "danger";
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  trackByActivityId(index: number, activity: any): number {
    return activity.id;
  }
}
