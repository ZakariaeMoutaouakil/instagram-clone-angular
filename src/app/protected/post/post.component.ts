import {Component, OnDestroy, OnInit, signal, Signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatError, MatFormField, MatHint} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostStore} from "./store/post.store";
import {Comment, PostState} from "./store/post-state.store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {MatProgressBar} from "@angular/material/progress-bar";
import {environment} from "../../../environments/environment";
import {Subscription, tap} from "rxjs";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {CommentDialogComponent} from "./dialog/comment/comment-dialog.component";
import {LoginService} from "../../auth/service/login/login.service";
import {PostDialogComponent} from "./dialog/post/post-dialog.component";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatIcon,
    MatIconButton,
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardImage,
    MatCardAvatar,
    MatCardContent,
    MatCardActions,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatHint,
    MatError,
    MatFabButton,
    MatButton,
    FormsModule,
    MatProgressBar,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [PostStore]
})
export class PostComponent implements OnInit, OnDestroy {
  protected readonly postState$: Signal<PostState> = this.postStore.postState$
  protected readonly defaultPhoto = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707048000&semt=sph"
  protected readonly addCommentLoadingEffect$ = signal<boolean>(false)
  protected readonly username: string = this.activatedRoute.snapshot.params["username"]
  protected readonly commentFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50)
  ])
  private readonly postId: number = +this.activatedRoute.snapshot.params["postId"]
  private deletePostSubscription: Subscription | undefined
  private updatePostSubscription: Subscription | undefined

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly postStore: PostStore,
              private readonly _snackBar: MatSnackBar,
              private readonly httpClient: HttpClient,
              public dialog: MatDialog,
              protected readonly loginService: LoginService,
              private readonly router: Router) {
    this.postStore.getMetadata(this.postId)
  }

  ngOnDestroy(): void {
    this.deletePostSubscription?.unsubscribe()
    this.updatePostSubscription?.unsubscribe()
  }

  openCommentDialog(comment: Comment): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      data: {comment: comment.comment}
    });

    dialogRef.afterClosed().subscribe(updatedComment => {
      if (!!updatedComment) {
        this.postStore.updateComments({commentId: comment.id, comment: updatedComment})
      }
    });
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

  ngOnInit(): void {
    this.postStore.getComments(
      {postId: this.postId, pageNumber: this.postState$().commentMetadata.pageNumber}
    )
  }

  addComments() {
    if (this.postState$().commentMetadata.pageNumber < this.postState$().commentMetadata.totalPages) {
      this.postStore.getComments(
        {postId: this.postId, pageNumber: this.postState$().commentMetadata.pageNumber})
    }
  }

  OnSubmit() {
    console.log(this.commentFormControl)
    if (this.commentFormControl.status === "VALID") {
      this.addCommentLoadingEffect$.set(true)
      this.httpClient
        .post<string>(environment.apiUrl + `comments/${this.postId}`, this.commentFormControl.value)
        .subscribe(
          {
            next: _res => {
              this.openSnackBar(
                "Your message has been successfully added.",
                "Reload",
                () => location.reload()
              )
              this.addCommentLoadingEffect$.set(false)
            },
            error: err => {
              console.log(err)
              this.addCommentLoadingEffect$.set(false)
              this._snackBar.open("There was an error when trying to save your message.", "Start over")
            }
          }
        )
    }
  }

  likePost() {
    this.httpClient.post<any>(environment.apiUrl + 'posts/like/' + this.postId, null)
      .pipe(tap(() => this.postStore.getMetadata(this.postId)))
      .subscribe({
        next: res => console.log(res),
        error: err => console.log(err)
      })
  }

  deleteComment(comment: Comment) {
    console.log(comment)
    this.postStore.deleteComments(comment.id)
    console.log(this.postState$())
  }

  openPostDialog() {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      data: {description: "", hashtags: "", image: ""},
    })

    dialogRef.afterClosed().subscribe(result => {
      this.updatePostSubscription = this.httpClient.put(environment.apiUrl + `posts/${this.postId}`, {
        description: result.description,
        hashtags: result.hashtags.split(","),
        image: result.image
      }).subscribe({
        next: () => {
          this.openSnackBar(
            "Your post was successfully updated",
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

  deletePost() {
    this.deletePostSubscription = this.httpClient
      .delete(environment.apiUrl + 'posts/' + this.postId)
      .subscribe({
        next: res => {
          console.log(res)
          this.router.navigate([`/${this.username}`])
            .catch(() => {
              this.router.navigate(["/"]).catch(console.log)
            })
        },
        error: () => {
          this._snackBar.open("Your post couldn't be deleted", "Retry")
        }
      })
  }
}
