import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {PersonStore} from "./store/person.store";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Subscription, tap} from "rxjs";
import {LoginService} from "../../../auth/service/login/login.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteComponent} from "./dialog/delete/delete.component";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EditComponent} from "./dialog/edit/edit.component";

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgOptimizedImage,
    AsyncPipe
  ],
  templateUrl: './bio.component.html',
  styleUrl: './bio.component.scss'
})
export class BioComponent implements OnInit, OnDestroy {
  protected readonly personState$ = this.personStore.PersonState$;
  protected readonly defaultPhoto = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707048000&semt=sph";
  private deleteSubscription: Subscription | undefined
  private editSubscription: Subscription | undefined

  constructor(private readonly personStore: PersonStore,
              private readonly activatedRoute: ActivatedRoute,
              protected readonly loginService: LoginService,
              public readonly dialog: MatDialog,
              private readonly httpClient: HttpClient,
              private readonly router: Router,
              private readonly _snackBar: MatSnackBar) {
    this.activatedRoute.params.pipe(
      map((p) => p['username'] as string),
      tap(username => {
        this.personStore.getInfo(username)
        this.personStore.getStats(username)
        console.log(username)
      })
    ).subscribe(
      value => {
        console.log(value)
      }
    );
  }

  ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe()
    this.editSubscription?.unsubscribe()
  }

  ngOnInit(): void {
    this.personState$.subscribe(value => {
      console.log("PersonState$()")
      console.log(value)
    })
  }

  follow() {
    console.log(this.activatedRoute.snapshot.params['username'])
    this.personStore.follow(this.activatedRoute.snapshot.params['username'])
  }

  updateUser() {
    const dialogRef = this.dialog.open(EditComponent, {
      data: {
        username: "",
        photo: "",
        email: "",
        firstname: "",
        lastname: "",
        bio: ""
      },
    })

    dialogRef.afterClosed().subscribe(data => {
      this.editSubscription = this.httpClient.put(environment.apiUrl + "persons/", data).subscribe({
        next: () => {
          this.loginService.logout()
          this.router.navigate(["/login"])
        },
        error: err => this._snackBar.open(err.error, "Retry")
      })
    })
  }

  deleteUser() {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {confirmation: ""},
    })

    dialogRef.afterClosed().subscribe(confirmation => {
      if (confirmation === "delete account") {
        this.deleteSubscription = this.httpClient.delete(environment.apiUrl + "persons/").subscribe({
          next: () => this.router.navigate(["/login"]),
          error: err => this._snackBar.open(err.error, "Retry")
        })
      }
    })
  }
}
