import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  command?: () => void;
}

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
})
export class SideNavComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  studentName = "John Doe"; // This would come from auth service
  studentId = "OCP2024001"; // This would come from auth service

  menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      route: "/dashboard",
    },
    {
      label: "Timetable",
      icon: "pi pi-calendar",
      route: "/dashboard/timetable",
    },
    {
      label: "Attendance",
      icon: "pi pi-check-circle",
      route: "/dashboard/attendance",
    },
    {
      label: "Library",
      icon: "pi pi-book",
      route: "/library",
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      route: "/dashboard/profile",
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      route: "/settings",
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => this.logout(),
    },
  ];

  constructor(private router: Router) {}

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.onHide();
  }

  logout() {
    // Implement logout logic
    console.log("Logout clicked");
    this.onHide();
  }
}
