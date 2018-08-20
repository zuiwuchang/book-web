import { Injectable } from '@angular/core';
import { Subject, Subscription, PartialObserver } from 'rxjs';
import { Session } from './session';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import sha512 from 'crypto-js/sha512';
// 請求 返回 session
const URLRefresh = "/App/GetSession";
// 登入 返回 session
const URLLogin = "/App/Login";
// 登出
const URLLogout = "/App/Logout";
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private session: Session = null;
  private initSession: boolean = false; // 是否已經初始化過 session
  private isRequestSession: boolean = false; // 是否正在修改 session狀態
  private subjectSession = new Subject<Session>();
  constructor(private httpClient: HttpClient) { }
  isLogin(): boolean | Observable<boolean> {
    if (this.session) {
      return true;
    }
    if (!this.initSession) {
      const observable = new Subject<boolean>();
      
      this.subjectSession.subscribe(
        (session: Session) => {
          if(session){
            observable.next(true);
          }else{
            observable.next(false);
          }
        },
        (e) => {
          observable.next(false);
        }
      )
      return observable;
    }
    return false;
  }
  // 訂閱 用戶 狀態改變
  SubscribeSession(nextOrobserver?: (PartialObserver<Session>) | ((value: Session) => void), error?: (error: any) => void, complete?: () => void): Subscription {
    let subscription: Subscription;
    const observable = this.subjectSession.asObservable();
    const observer = nextOrobserver as PartialObserver<Session>;
    if (observer.next || observer.error || observer.complete) {
      subscription = observable.subscribe(observer);
    } else {
      const next = nextOrobserver as (value: Session) => void;
      subscription = observable.subscribe(next, error, complete);
    }
    this.requestSession();
    return subscription;
  }
  // 向服務器 刷新 session
  RefreshSession() {
    // 向服務器 初始化 用戶
    this.isRequestSession = true;
    this.httpClient.get(URLRefresh).subscribe(
      (v: Session) => {
        this.initSession = true;
        this.session = v;
        this.subjectSession.next(v);
      },
      (e) => {
        console.error("SessionService.RefreshSession", e);
        this.subjectSession.next(null);
        this.isRequestSession = false;
      },
      () => {
        this.isRequestSession = false;
      }
    );
    return;
  }
  private requestSession() {
    if (this.session != null) { // 已經獲取到 用戶 狀態
      this.subjectSession.next(this.session);
      return;
    } else if (this.isRequestSession) {
      // 正在請求 session 直接 返回
      return;
    } else if (this.initSession) {
      // 未登入 直接返回
      this.subjectSession.next(null);
      return;
    }

    // 向服務器 請求 初始化 用戶
    this.isRequestSession = true;
    this.httpClient.get(URLRefresh).subscribe(
      (v: Session) => {
        this.initSession = true;
        this.session = v;
        this.subjectSession.next(v);
      },
      (e) => {
        console.error("SessionService.requestSession", e);
        this.subjectSession.next(null);
        this.isRequestSession = false;
      },
      () => {
        this.isRequestSession = false;
      }
    );
    return;
  }
  // 登入
  Login(name: string, password: string, remember: boolean,
    nextOrobserver?: (PartialObserver<Session>) | ((value: Session) => void), error?: (error: any) => void, complete?: () => void
  ): Subscription {
    const observer = nextOrobserver as PartialObserver<Session>;
    let next: (value: Session) => void;
    if (observer.next || observer.error || observer.complete) {
      next = observer.next;
      error = observer.error;
      complete = observer.complete;
    } else {
      next = nextOrobserver as (value: Session) => void;
    }

    if (this.isRequestSession) {
      if (error) {
        error(null);
      }
      return null;
    }

    this.isRequestSession = true;
    password = sha512(password).toString();
    return this.httpClient.post<Session>(
      URLLogin,
      {
        Name: name,
        Password: password,
        Remember: remember,
      }
    ).subscribe(
      (v) => {
        if (next) {
          next(v);
        }
        if (v != this.session) {
          this.session = v;
          this.subjectSession.next(v);
        }
      },
      (e) => {
        if (error) {
          error(e);
        }
        this.isRequestSession = false;
      },
      () => {
        if (complete) {
          complete();
        }
        this.isRequestSession = false;
      }
    );
  }
  // 登出
  Logout(nextOrobserver?: (PartialObserver<null>) | ((value: null) => void), error?: (error: any) => void, complete?: () => void): Subscription {
    const observer = nextOrobserver as PartialObserver<null>;
    let next: (value: null) => void;
    if (observer.next || observer.error || observer.complete) {
      next = observer.next;
      error = observer.error;
      complete = observer.complete;
    } else {
      next = nextOrobserver as (value: Session) => void;
    }
    if (this.session == null) {
      console.log("SessionService.Logout session == null , ignore request");
      if (error) {
        error(null);
      }
      return;
    } else if (this.isRequestSession) {
      console.log("SessionService.Logout wait request complete, ignore request");
      if (error) {
        error(null);
      }
      return;
    }

    this.isRequestSession = true;
    return this.httpClient.get(URLLogout).subscribe(
      (v: null) => {
        if (next) {
          next(v);
        }
        this.session = null;
        this.subjectSession.next(null);
        //console.log("ok")
      },
      (e) => {
        if (error) {
          error(e);
        }
        this.isRequestSession = false;
      },
      () => {
        if (complete) {
          complete();
        }
        this.isRequestSession = false;
      }
    )
  }
}
