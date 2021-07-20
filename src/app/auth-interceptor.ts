
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    //const authToken = this.auth.getAuthorizationToken();

    
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    //const authReq = req.clone({
     // headers: req.headers.set('Authorization', "aaa")
    //});

    // send cloned request with header to the next handler.
    //return next.handle(authReq);

    return next.handle(req);
  }
}