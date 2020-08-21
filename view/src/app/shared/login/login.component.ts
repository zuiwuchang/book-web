import { Component, OnInit, OnDestroy } from '@angular/core';
import { Session, SessionService } from 'src/app/core/session/session.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';

import { takeUntil, } from 'rxjs/operators';
import { Closed, requireDynamic } from '../../core/core/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private readonly sessionService: SessionService,
    private readonly matDialogRef: MatDialogRef<LoginComponent>,
    private readonly toasterService: ToasterService,
  ) { }
  ready = false
  session: Session
  disabled = false

  name: string
  password: string
  remember = true
  visibility = false

  private closed_ = new Closed()
  ngOnInit(): void {
    this.sessionService.ready.then((ok) => {
      this.ready = ok
    })
    this.sessionService.observable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((data) => {
      this.session = data
    })
  }
  ngOnDestroy() {
    this.closed_.close()
  }
  onClose() {
    this.matDialogRef.close()
  }
  async onSubmit() {
    try {
      this.disabled = true

      const sha512 = await requireDynamic('sha512')
      const password = sha512(this.password).toString()
      await this.sessionService.login(this.name, password, this.remember)
    } catch (e) {
      this.toasterService.pop('error',
        undefined,
        e,
      )
    } finally {
      this.disabled = false
    }
  }
}
