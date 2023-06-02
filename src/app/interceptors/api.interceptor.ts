import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
console.log('ApiInterceptor');
    
    if (!/^(https?:\/\/)/.test(request.url)) {
      const httpRequest = new HttpRequest(
        <any>request.method,
        `${environment.api}${request.url}`,
        request.body
      );
      request = Object.assign(request, httpRequest);
    }
    return next.handle(request);
  }
}
