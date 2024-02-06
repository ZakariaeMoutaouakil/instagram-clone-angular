import {Component, OnInit, Signal} from '@angular/core';
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
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostStore} from "./store/post.store";
import {PostState} from "./store/post-state.store";

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
    MatButton
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [PostStore]
})
export class PostComponent implements OnInit {
  postId: number = +this.activatedRoute.snapshot.params["postId"];
  username: string = this.activatedRoute.snapshot.params["username"];
  emailFormControl = new FormControl('', [Validators.required]);
  postState$: Signal<PostState> = this.postStore.postState$;
  defaultPhoto = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707048000&semt=sph";

  constructor(private activatedRoute: ActivatedRoute,
              private readonly postStore: PostStore) {
    this.postStore.getMetadata(this.postId);
  }

  ngOnInit(): void {
    this.postStore.getComments(
      {postId: this.postId, pageNumber: this.postState$().commentMetadata.pageNumber}
    )
    setInterval(()=> console.log(this.postState$()),1000)
    // console.log()
    // let div = document.querySelector(".info");
    // setInterval(() => {
    //   console.log(document.querySelector<HTMLElement>(".info")!.offsetHeight)
    // }, 1000)
  }
}
