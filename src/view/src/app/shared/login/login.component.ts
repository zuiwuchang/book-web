import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { SessionService } from '../../core/session/session.service';
import { Session } from '../../core/session/session';
import { Utils } from '../../core/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isInit: boolean = false;
  isIgnore: boolean = false;
  session: Session = null;
  name: string;
  password: string;
  remember: boolean = true;
  disabled: boolean = false;
  error: any = null;
  private subscription: Subscription = null
  constructor(private sessionService: SessionService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    this.subscription = this.sessionService.SubscribeSession(
      (v: Session) => {
        if (!this.isInit) {
          this.isInit = true;
        }
        if (this.session != v) {
          this.session = v;
        }
      }
    )
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.disabled) {
      console.log("disabled ignore onSubmit")
      return;
    }
    this.disabled = true;
    this.isIgnore = false;
    this.error = null;
    this.sessionService.Login(this.name, this.password, this.remember,
      (v: Session) => {
        if (this.session != v) {
          this.session = v;
        }
      },
      (e) => {
        if (e == null) {
          this.isIgnore = true;
        } else {
          this.error = Utils.ResolveError(e)
        }
        this.disabled = false;
      },
      () => {
        this.disabled = false;
        this.dialogRef.close();
      }
    );
  }
}
