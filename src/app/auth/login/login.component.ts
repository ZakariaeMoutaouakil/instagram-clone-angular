import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../service/login/login.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    NgOptimizedImage,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatError,
    RouterLink,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  signIn: FormGroup
  usernameFormControl: FormControl<string | null>;
  passwordFormControl: FormControl<string | null>;

  constructor(private readonly loginService: LoginService,
              private readonly _snackBar: MatSnackBar,
              private readonly router: Router) {
    this.usernameFormControl = new FormControl('', [Validators.required]);
    this.passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.signIn = new FormGroup<{ username: FormControl, password: FormControl }>({
      'username': this.usernameFormControl,
      'password': this.passwordFormControl
    })
  }

  OnSubmit() {
    this.loginService.login(this.signIn.value.username, this.signIn.value.password).subscribe({
        next: username => {
          localStorage.setItem(btoa("authenticated"), btoa(username))
          this._snackBar.open(
            "Your authentication has succeeded. You will be redirected soon to the home page.",
            "Got it",{
            duration: 2000
          })
          setTimeout(
            () => {
              this.router.navigate(["/"])
            }, 2000
          )
        },
        error: () => {
          this._snackBar.open('Authentication failed. Please check your credentials and try again.', 'Close');
        }
      }
    )
  }
}
