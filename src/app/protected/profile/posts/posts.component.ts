import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {PostsStore} from "./store/posts.store";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {fromEvent, interval, Subscription, tap} from "rxjs";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {LoginService} from "../../../auth/service/login/login.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {DialogComponent} from "./dialog/dialog.component";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatIcon,
    AsyncPipe,
    RouterLink,
    MatFabButton,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [PostsStore]
})
export class PostsComponent implements OnInit, OnDestroy {
  postsSubscription: Subscription | undefined
  bottomSubscription: Subscription | undefined
  scrollSubscription: Subscription | undefined
  protected readonly posts$ = this.postsStore.posts$
  protected readonly pageNumber$ = this.postsStore.pageNumber$
  protected readonly totalPages$ = this.postsStore.totalPages$
  protected readonly username: string = this.activatedRoute.snapshot.params["username"]
  protected readonly reachBottom$ = fromEvent(window, 'Reached bottom')
    .pipe(tap(ev => {
      console.log("Reached bottom event " + ev + this.pageNumber$())
      if (this.pageNumber$() < this.totalPages$()) {
        this.postsStore.getPosts({username: this.username, pageNumber: this.pageNumber$()})
      } else {
        this.bottomSubscription?.unsubscribe()
      }
    }))
  protected readonly interval$ = interval(1000).pipe(
    tap(time => {
      const div = document.querySelector("body")!;
      const verticalScroll = div.scrollHeight > div.clientHeight;
      if (!verticalScroll && this.pageNumber$() < this.totalPages$()) {
        this.postsStore.getPosts({username: this.username, pageNumber: this.pageNumber$()})
      } else {
        this.scrollSubscription?.unsubscribe()
        console.log("scrollSubscription unsubscribed " + time)
      }
    })
  )
  private addPostSubscription: Subscription | undefined

  constructor(private readonly postsStore: PostsStore,
              private activatedRoute: ActivatedRoute,
              protected readonly loginService: LoginService,
              private readonly _snackBar: MatSnackBar,
              private readonly httpClient: HttpClient,
              public dialog: MatDialog) {
    this.postsStore.getTotalPages(this.username);
  }

  ngOnDestroy(): void {
    this.postsSubscription?.unsubscribe()
    this.bottomSubscription?.unsubscribe()
    this.scrollSubscription?.unsubscribe()
    this.addPostSubscription?.unsubscribe()
  }

  ngOnInit(): void {
    this.postsSubscription = this.posts$.subscribe();
    this.bottomSubscription = this.reachBottom$.subscribe();
    this.scrollSubscription = this.interval$.subscribe();
    onscroll = function (ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        console.log("you're at the bottom of the page " + ev);
        window.dispatchEvent(new Event("Reached bottom"))
      }
    };
  }

  openSnackBar(message: string, action: string, callback: () => void) {
    const snackBarRef = this._snackBar.open(message, action, {
      duration: 5000,
    });
    snackBarRef.onAction().subscribe(() => {
      if (callback) {
        callback();
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {description: "", hashtags: "", image: ""},
    })

    dialogRef.afterClosed().subscribe(result => {
      this.addPostSubscription = this.httpClient.post(environment.apiUrl + `posts/`, {
        description: result.description,
        hashtags: result.hashtags.split(","),
        image: result.image
      }).subscribe({
        next: () => {
          this.openSnackBar(
            "Your post was successfully added",
            "Refresh",
            () => location.reload()
          )
        },
        error: _err => this._snackBar.open(
          "An error occurred while trying to update your post",
          "Retry"
        )
      })
    })
  }
}
