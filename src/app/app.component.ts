import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {LoginService} from "./auth/service/login/login.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'instagram-clone';

  constructor(private readonly loginService: LoginService,
              private readonly router: Router) {
    this.loginService.preflight().subscribe({
      next: _username => {
      },
      error: () => {
        this.router.navigate(["/login"])
      }
    })
  }
}
