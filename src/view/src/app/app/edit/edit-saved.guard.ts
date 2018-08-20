import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EditComponent } from './edit.component';
@Injectable({
  providedIn: 'root'
})

export class EditSavedGuard implements CanDeactivate<EditComponent> {
  constructor() { }

  canDeactivate(
    component: EditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.saved();
  }
}
