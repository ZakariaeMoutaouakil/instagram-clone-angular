import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable, Provider} from "@angular/core";
import {catchError, tap, throwError} from "rxjs";
import {LoginService} from "../service/login/login.service";


@Injectable()
export class CookieInterceptor implements HttpInterceptor {

  constructor(private readonly loginService: LoginService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const secureReq = request.clone({
      withCredentials: true, // Ensure cookies are sent with the request
      headers: request.headers.append('X-Requested-With', 'XMLHttpRequest')
    })

    return next.handle(secureReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Do something with the successful response
          console.log('HTTP response intercepted:', event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle HTTP errors (status codes 4xx and 5xx)
        console.error('HTTP error intercepted:', error)
        if (error.status === 401) {
          // Handle 404 Not Found error
          console.log('Resource not found:', error)
          console.log("logout")
          this.loginService.logout()
        }
        // You can throw a custom error message or do other error handling here
        return throwError(() => error)
      }))
  }
}

export const cookieInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: CookieInterceptor,
  multi: true
}
