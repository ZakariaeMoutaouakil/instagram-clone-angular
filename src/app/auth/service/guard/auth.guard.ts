import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../login/login.service";

export const authGuard: CanActivateChildFn = (_childRoute, _state) => {
  const isAuthenticated = inject(LoginService).username() !== ""
  if (!isAuthenticated) {
    // User is not authenticated, redirect to log-in URL
    inject(Router).navigate(['/login']).then(inject(LoginService).logout)
    return false
  }
  return true
}
