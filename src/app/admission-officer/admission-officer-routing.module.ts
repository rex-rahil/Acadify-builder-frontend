import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { OfficerDashboardComponent } from "./dashboard/officer-dashboard.component";
import { ApplicationReviewComponent } from "./review/application-review.component";
import { ApplicationDetailsComponent } from "./details/application-details.component";
import { PaymentManagementComponent } from "./payment/payment-management.component";

const routes: Routes = [
  {
    path: "",
    component: OfficerDashboardComponent,
  },
  {
    path: "dashboard",
    component: OfficerDashboardComponent,
  },
  {
    path: "review",
    component: ApplicationReviewComponent,
  },
  {
    path: "application/:id",
    component: ApplicationDetailsComponent,
  },
  {
    path: "payments",
    component: PaymentManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmissionOfficerRoutingModule {}
