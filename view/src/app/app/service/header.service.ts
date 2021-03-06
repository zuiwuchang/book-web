import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';
import { SessionService } from '../../core/session/session.service';
import { isString } from 'king-node/dist/core';
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(public readonly sessionService: SessionService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers
    if (req.method == "GET" || req.method == "HEAD") {
      headers = headers.set('ngsw-bypass', '')
    }
    const token = this.sessionService.token()
    if (isString(token) && !headers.has('token')) {
      headers = headers.set('token', token)
    }
    return next.handle(req.clone({
      headers: headers,
    }))
  }
}
