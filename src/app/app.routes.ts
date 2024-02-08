import { Routes } from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";
import {HomeComponent} from "./home/home.component";
import {PostComponent} from "./post/post.component";
import {LoginComponent} from "./auth/login/login.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: ":username",
    component: ProfileComponent
  },
  {
    path: ":username/:postId",
    component: PostComponent
  }
];
