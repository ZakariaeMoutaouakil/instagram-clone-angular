import { Routes } from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";
import {HomeComponent} from "./home/home.component";
import {PostComponent} from "./post/post.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
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
