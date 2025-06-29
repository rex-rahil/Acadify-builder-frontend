import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-application-details",
  template: `
    <div class="application-details">
      <h2>Application Details</h2>
      <p>Application ID: {{ applicationId }}</p>
      <p>This component will show detailed application review interface.</p>
    </div>
  `,
  styles: [
    `
      .application-details {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class ApplicationDetailsComponent implements OnInit {
  applicationId: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.params["id"];
  }
}
