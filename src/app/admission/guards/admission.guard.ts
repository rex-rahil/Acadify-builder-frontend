import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AdmissionStatusService } from "../services/admission-status.service";

@Injectable({
  providedIn: "root",
})
export class AdmissionGuard implements CanActivate {
  constructor(
    private admissionStatusService: AdmissionStatusService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.admissionStatusService.canAccessDashboard().pipe(
      map((canAccess: boolean) => {
        if (!canAccess) {
          // Redirect to admission status page if not enrolled
          this.router.navigate(["/admission/status"]);
          return false;
        }
        return true;
      }),
    );
  }
}
