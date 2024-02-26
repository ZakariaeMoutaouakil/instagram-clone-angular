import {Component, OnInit, signal, Signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
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
import {tap} from "rxjs";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {LoginService} from "../../auth/service/login/login.service";

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
export class PostComponent implements OnInit {
  protected readonly postState$: Signal<PostState> = this.postStore.postState$
  protected readonly defaultPhoto = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707048000&semt=sph"
  protected readonly addCommentLoadingEffect$ = signal<boolean>(false)
  protected readonly username: string = this.activatedRoute.snapshot.params["username"]
  protected readonly commentFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50)
  ])
  private readonly postId: number = +this.activatedRoute.snapshot.params["postId"]

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly postStore: PostStore,
              private readonly _snackBar: MatSnackBar,
              private readonly httpClient: HttpClient,
              public dialog: MatDialog,
              protected readonly loginService: LoginService) {
    this.postStore.getMetadata(this.postId)
  }

  openDialog(comment: Comment): void {
    const dialogRef = this.dialog.open(DialogComponent, {
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
}
