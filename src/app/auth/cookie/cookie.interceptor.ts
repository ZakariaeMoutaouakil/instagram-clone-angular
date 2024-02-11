import {HttpInterceptorFn} from '@angular/common/http';

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  const secureReq = req.clone({
    withCredentials: true // Ensure cookies are sent with the request
  })
  console.log(secureReq)
  return next(secureReq)
};
