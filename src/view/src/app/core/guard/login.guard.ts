import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { SessionService } from '../session/session.service';
import { ToasterService } from 'angular2-toaster';
import { isBoolean } from 'util';
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private sessionService: SessionService,
    private toasterService: ToasterService,
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let rs = this.sessionService.isLogin();
    if (isBoolean(rs)) {
      if (!rs) {
        this.toasterService.pop('error', '', 'Permission denied');
      }
      return rs;
    } else if (rs instanceof Observable) {
      let s: Subscription;
      const observable = new Subject<boolean>();
      s = rs.subscribe(
        (ok: boolean) => {
          if (s) {
            s.unsubscribe();
          }
          if (!ok) {
            this.toasterService.pop('error', '', 'Permission denied');
          }
          observable.next(ok);
        },
        (e) => {
          if (s) {
            s.unsubscribe();
          }
          this.toasterService.pop('error', '', 'Permission denied');
          observable.next(false);
        }
      )
      return observable;
    }
    return rs;
  }
}
