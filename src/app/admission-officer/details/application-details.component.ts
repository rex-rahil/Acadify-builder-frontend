import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-application-details",
  templateUrl: "./application-details.component.html",
  styleUrls: ["./application-details.component.scss"],
})
export class ApplicationDetailsComponent implements OnInit {
  applicationId: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.params["id"];
  }
}
