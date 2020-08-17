import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers
    if (req.method == "GET" || req.method == "HEAD") {
      headers = headers.set('ngsw-bypass', '')
    }
    return next.handle(req.clone({
      headers: headers,
    }))
  }
}
