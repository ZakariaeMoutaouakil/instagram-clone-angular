import {Component, ViewEncapsulation} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCard,
    NgOptimizedImage,
    RouterLink,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatError
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  firstNameFormControl = new FormControl('', [Validators.required])
  lastNameFormControl = new FormControl('', [Validators.required])
  userNameFormControl = new FormControl('', [Validators.required])
  passwordFormControl = new FormControl('', [Validators.required])


  signUp = new FormGroup({
    'firstname': this.firstNameFormControl,
    'lastname': this.lastNameFormControl,
    'email': this.emailFormControl,
    'username': this.userNameFormControl,
    'password': this.passwordFormControl,
  })

  constructor(private readonly httpClient: HttpClient,
              private readonly _snackBar: MatSnackBar,
              private readonly router: Router) {
  }

  OnSubmit() {
    this.httpClient.post('http://localhost:8080/persons/register', this.signUp.value).subscribe(
      {
        next: () => {
          this._snackBar.open(
            "Your registration has succeeded. You will be redirected soon to the login page.",
            "Got it",{
            duration: 2000
            })
          setTimeout(
            ()=>{
              this.router.navigate(["/login"])
            },2000
          )
        },
        error: () => {
          this._snackBar.open("Your authentification failed. Please retry with different credentials", "Retry")
        },
      }
    )
  }
}
