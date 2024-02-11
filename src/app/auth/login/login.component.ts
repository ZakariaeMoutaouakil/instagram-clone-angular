import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, throwError} from "rxjs";

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
export class LoginComponent implements OnInit {
  signIn: FormGroup
  usernameFormControl: FormControl<string | null>;
  passwordFormControl: FormControl<string | null>;

  constructor(private readonly httpClient: HttpClient,
              private readonly _snackBar: MatSnackBar,
              private readonly router: Router) {
    this.usernameFormControl = new FormControl('', [Validators.required]);
    this.passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.signIn = new FormGroup<{ username: FormControl, password: FormControl }>({
      'username': this.usernameFormControl,
      'password': this.passwordFormControl
    })
  }

  ngOnInit(): void {
    console.log(this.signIn)
  }

  OnSubmit() {
    // console.log(this.signIn)
    console.log("errors")
    console.log(this.signIn.valid)

    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.signIn.value.username + ':' + this.signIn.value.password),
    })

    this.httpClient.get("http://localhost:8080/login", {headers})
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      )
      .subscribe(
        res => {
          console.log(res)
          this.router.navigate(["/"])
        },
        error => {
          console.error('Authentication failed:', error)
          this._snackBar.open('Authentication failed. Please check your credentials and try again.', 'Close');
        }
      )
  }
}
