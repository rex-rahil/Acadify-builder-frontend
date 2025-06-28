import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Oriental College of Pharmacy - B.Pharm Admission";
  sideNavVisible = false;

  constructor(private router: Router) {}

  toggleSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }

  isLibraryRoute(): boolean {
    return this.router.url.includes("/library");
  }
}
