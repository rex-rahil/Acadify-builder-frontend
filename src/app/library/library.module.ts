import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { LibraryRoutingModule } from "./library-routing.module";
import { LibraryComponent } from "./library.component";
import { BookListComponent } from "./components/book-list/book-list.component";
import { IssueBookComponent } from "./components/issue-book/issue-book.component";
import { ReserveBookComponent } from "./components/reserve-book/reserve-book.component";

// PrimeNG modules
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { TagModule } from "primeng/tag";
import { BadgeModule } from "primeng/badge";
import { DialogModule } from "primeng/dialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CalendarModule } from "primeng/calendar";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TabViewModule } from "primeng/tabview";
import { ProgressBarModule } from "primeng/progressbar";
import { DividerModule } from "primeng/divider";
import { ToolbarModule } from "primeng/toolbar";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuModule } from "primeng/menu";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ChipModule } from "primeng/chip";
import { AvatarModule } from "primeng/avatar";
import { PanelModule } from "primeng/panel";
import { FieldsetModule } from "primeng/fieldset";
import { DataViewModule } from "primeng/dataview";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";

@NgModule({
  declarations: [
    LibraryComponent,
    BookListComponent,
    IssueBookComponent,
    ReserveBookComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LibraryRoutingModule,

    // PrimeNG modules
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    BadgeModule,
    DialogModule,
    InputTextareaModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    ProgressBarModule,
    DividerModule,
    ToolbarModule,
    SplitButtonModule,
    MenuModule,
    OverlayPanelModule,
    ChipModule,
    AvatarModule,
    PanelModule,
    FieldsetModule,
    DataViewModule,
    RatingModule,
    ImageModule,
  ],
})
export class LibraryModule {}
