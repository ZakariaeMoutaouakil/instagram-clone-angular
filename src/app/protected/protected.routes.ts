import {Routes} from "@angular/router";
import {ProfileComponent} from "./profile/profile.component";
import {PostComponent} from "./post/post.component";
import {HomeComponent} from "./home/home.component";
import {ProtectedComponent} from "./protected.component";

export const PROTECTED_ROUTES: Routes = [
  {
    path: "",
    component: ProtectedComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: ":username",
        component: ProfileComponent
      },
      {
        path: ":username/:postId",
        component: PostComponent
      }
    ]
  }
];
