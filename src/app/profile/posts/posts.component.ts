import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {PostsStore} from "./store/posts.store";
import {ActivatedRoute} from "@angular/router";
import {map, tap} from "rxjs";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatIcon,
    AsyncPipe
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [PostsStore]
})
export class PostsComponent implements OnInit {
  posts$ = this.postsStore.posts$;
  constructor(private readonly postsStore: PostsStore,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.pipe(
      map((p) => p['username'] as string),
      tap(username => {
        this.postsStore.getPosts(username)
      })
    ).subscribe();
    // document.querySelector( ":hover" );
  }

  ngOnInit(): void {
    this.posts$.subscribe();
  }
}
