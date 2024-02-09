import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";

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
  emailFormControl: FormControl<string | null>;
  passwordFormControl: FormControl<string | null>;
  constructor() {
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.signIn = new FormGroup<{ email: FormControl, password: FormControl }>({
      'email': this.emailFormControl,
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
  }
}
