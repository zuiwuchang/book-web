import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerAPI } from '../core/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Completer } from 'king-node/dist/async/completer';
import { Mutex } from 'king-node/dist/async/sync';
import { isString, Exception } from 'king-node/dist/core';
export class Session {
  name: string
  nickname: string
  root = false
}
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private httpClient: HttpClient) {
    // 恢復 session
    this._restore();
  }
  private readonly mutex_ = new Mutex()
  private readonly subject_ = new BehaviorSubject<Session>(null)
  private readonly ready_ = new Completer<boolean>()
  get observable(): Observable<Session> {
    return this.subject_
  }
  get ready(): Promise<boolean> {
    return this.ready_.promise
  }
  private async _restore() {
    console.log('start session restore')
    await this.mutex_.lock()
    try {
      const response = await ServerAPI.v1.session.get<Session>(this.httpClient)
      if (response && isString(response.name)) {
        console.info(`session restore`, response)
        this.subject_.next(response)
      }
    } catch (e) {
      console.error(`restore error : `, e)
    } finally {
      this.mutex_.unlock()
      this.ready_.resolve(true)
    }
  }
  /**
  * 登入
  * @param name 
  * @param password 
  * @param keep 
  */
  async login(name: string, password: string, remember: boolean): Promise<Session> {
    await this.mutex_.lock()
    let result: Session
    try {
      const response = await ServerAPI.v1.session.post<Session>(this.httpClient, {
        name: name,
        password: password,
        remember: remember,
      })
      if (response) {
        console.info(`login success`, response)
        this.subject_.next(response)
      } else {
        console.warn(`login unknow result`, response)
        throw new Exception("login unknow result")
      }
    } finally {
      this.mutex_.unlock()
    }
    return result
  }

  /**
   * 登出
   */
  async logout() {
    await this.mutex_.lock()
    try {
      if (this.subject_.value == null) {
        return
      }
      await ServerAPI.v1.session.delete(this.httpClient)
      this.subject_.next(null)
    } finally {
      this.mutex_.unlock()
    }
  }
}
