import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  // return !!localStorage.getItem(btoa("username"));
  const isAuthenticated = !!localStorage.getItem(btoa("authenticated"));
  if (!isAuthenticated) {
    // User is not authenticated, redirect to default URL
    inject(Router).navigate(['/login']); // Replace 'default-url' with your default URL
    return false;
  }
  return true;
};
