import {Routes} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {authGuard} from "./auth/service/guard/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "",
    loadChildren: () => import('./protected/protected.routes').then(mod => mod.PROTECTED_ROUTES),
    canActivateChild: [authGuard]
  },
];
