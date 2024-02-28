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
      headers: request.headers
        .append('X-XSRF-TOKEN', this.loginService.csrf())
        .append('X-Requested-With', 'XMLHttpRequest')
    })

    return next.handle(secureReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Do something with the successful response
          console.log('HTTP response intercepted:', event)
          // Access the XSRF-TOKEN cookie from the response headers
          const csrfTokenCookie = this.getCookie('XSRF-TOKEN', event.headers);
          this.loginService.csrf.set(csrfTokenCookie)
          // Use the CSRF token cookie value as needed
          console.log('CSRF Token Cookie:', csrfTokenCookie);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle HTTP errors (status codes 4xx and 5xx)
        console.error('HTTP error intercepted:', error)
        if (error.status === 403) {
          // Handle 404 Not Found error
          console.log('Resource not found:', error)
          console.log("logout")
          this.loginService.logout()
        }
        // You can throw a custom error message or do other error handling here
        return throwError(() => error)
      }))
  }

  // Function to extract a specific cookie value from the response headers
  private getCookie(name: string, headers: any): string {
    const cookies = headers.get('Set-Cookie');
    console.log("cookies" + cookies)
    if (!cookies) {
      return '';
    }

    const cookie = cookies.split(';').find((cookie: string) => cookie.trim().startsWith(name));

    return cookie ? cookie.split('=')[1] : '';
  }
}

export const cookieInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: CookieInterceptor,
  multi: true
}
