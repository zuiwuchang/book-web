import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../session/session.service';
import { ToasterService } from 'angular2-toaster';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  constructor(private sessionService: SessionService,
    private toasterService: ToasterService,
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise<boolean>((resolve) => {
      this.sessionService.ready.then(() => {
        this.sessionService.observable.pipe(
          first()
        ).subscribe((data) => {
          if (data) {
            resolve(true)
          } else {
            resolve(false)
            this.toasterService.pop('error', undefined, 'Permission denied');
          }
        })
      })
    })
  }

}
