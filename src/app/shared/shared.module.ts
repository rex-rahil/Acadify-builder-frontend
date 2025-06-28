import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

// PrimeNG modules
import { SidebarModule } from "primeng/sidebar";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { AvatarModule } from "primeng/avatar";
import { RippleModule } from "primeng/ripple";

import { SideNavComponent } from "./components/side-nav/side-nav.component";

@NgModule({
  declarations: [SideNavComponent],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    RippleModule,
  ],
  exports: [SideNavComponent],
})
export class SharedModule {}
