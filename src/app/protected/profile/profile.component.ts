import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgOptimizedImage} from "@angular/common";
import {BioComponent} from "./bio/bio.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {PostsComponent} from "./posts/posts.component";
import {ReelsComponent} from "./reels/reels.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgOptimizedImage,
    BioComponent,
    MatTabGroup,
    MatTab,
    PostsComponent,
    ReelsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
