import { Component, OnInit, OnDestroy } from '@angular/core';
import { Session, SessionService } from 'src/app/core/session/session.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';
import { sha512 } from 'js-sha512';
import { takeUntil, } from 'rxjs/operators';
import { Closed } from '../../core/core/utils';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public readonly sessionService: SessionService,
    public readonly matDialogRef: MatDialogRef<LoginComponent>,
    public readonly toasterService: ToasterService,
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
      const password = sha512(this.password).toString()
      this.disabled = true
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
