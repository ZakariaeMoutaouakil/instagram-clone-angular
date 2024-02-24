import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

}
