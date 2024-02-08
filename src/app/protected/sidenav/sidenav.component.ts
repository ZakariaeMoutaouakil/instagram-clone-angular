import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

}
