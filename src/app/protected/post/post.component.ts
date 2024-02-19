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
import {PostState} from "./store/post-state.store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {MatProgressBar} from "@angular/material/progress-bar";
import {environment} from "../../../environments/environment";

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
    MatProgressBar
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [PostStore]
})
export class PostComponent implements OnInit {
  postId: number = +this.activatedRoute.snapshot.params["postId"];
  username: string = this.activatedRoute.snapshot.params["username"];
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50)
  ]);
  postState$: Signal<PostState> = this.postStore.postState$;
  defaultPhoto = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707048000&semt=sph";
  addCommentLoadingEffect$ = signal<boolean>(false)

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly postStore: PostStore,
              private readonly _snackBar: MatSnackBar,
              private readonly httpClient: HttpClient) {
    this.postStore.getMetadata(this.postId);
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

  myActionMethod() {
    location.reload()
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
    console.log(this.emailFormControl)
    if (this.emailFormControl.status === "VALID") {
      this.addCommentLoadingEffect$.set(true)
      this.httpClient
        .post<{ comment: string, username: string }>(environment.apiUrl + `comments/${this.postId}`,
          {
            comment: this.emailFormControl.value,
            username: this.username
          }
        )
        .subscribe(
          {
            next: res => {
              this.openSnackBar("Your message has been successfully added.", "Reload", this.myActionMethod);
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
}
