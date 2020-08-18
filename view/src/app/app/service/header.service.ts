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
    console.log(req.url)
    if (!headers.has('token')) {
      const token = this.sessionService.token()
      console.log(token)
      if (isString(token)) {
        headers = headers.set('token', token)
      }
    }
    return next.handle(req.clone({
      headers: headers,
    }))
  }
}
