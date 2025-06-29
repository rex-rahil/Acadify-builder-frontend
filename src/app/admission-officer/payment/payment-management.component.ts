import { Component } from "@angular/core";

@Component({
  selector: "app-payment-management",
  template: `
    <div class="payment-management">
      <h2>Payment Management</h2>
      <p>This component will handle fee payment verification and tracking.</p>
    </div>
  `,
  styles: [
    `
      .payment-management {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class PaymentManagementComponent {}
