import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {catchError, tap, throwError} from "rxjs";

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  const secureReq = req.clone({
    withCredentials: true // Ensure cookies are sent with the request
  })
  return next(secureReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Do something with the successful response
        console.log('HTTP response intercepted:', event);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle HTTP errors (status codes 4xx and 5xx)
      console.error('HTTP error intercepted:', error)
      if (error.status === 403) {
        // Handle 404 Not Found error
        console.log('Resource not found:', error)
        localStorage.removeItem(btoa("authenticated"))
      }
      // You can throw a custom error message or do other error handling here
      return throwError(() => error)
    }))
};
