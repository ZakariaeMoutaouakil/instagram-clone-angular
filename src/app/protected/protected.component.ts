import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SidenavComponent} from "./sidenav/sidenav.component";

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [
    RouterOutlet,
    SidenavComponent
  ],
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss'
})
export class ProtectedComponent {

}
