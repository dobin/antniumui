
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { ApiService } from './api.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private apiService: ApiService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.apiService.getAdminApiKey();

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}