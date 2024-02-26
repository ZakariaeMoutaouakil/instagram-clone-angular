import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {PostsStore} from "./store/posts.store";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {fromEvent, interval, Subscription, tap} from "rxjs";
import {MatFabButton} from "@angular/material/button";
import {LoginService} from "../../../auth/service/login/login.service";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatIcon,
    AsyncPipe,
    RouterLink,
    MatFabButton
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [PostsStore]
})
export class PostsComponent implements OnInit, OnDestroy {
  posts$ = this.postsStore.posts$;
  pageNumber$ = this.postsStore.pageNumber$;
  totalPages$ = this.postsStore.totalPages$;
  username: string = this.activatedRoute.snapshot.params["username"];
  reachBottom$ = fromEvent(window, 'Reached bottom')
    .pipe(tap(ev => {
      console.log("Reached bottom event " + ev + this.pageNumber$())
      if (this.pageNumber$() < this.totalPages$()) {
        this.postsStore.getPosts({username: this.username, pageNumber: this.pageNumber$()})
      } else {
        this.bottomSubscription?.unsubscribe()
      }
    }));
  postsSubscription: Subscription | undefined;
  bottomSubscription: Subscription | undefined;
  scrollSubscription: Subscription | undefined;
  interval$ = interval(1000).pipe(
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
  );

  constructor(private readonly postsStore: PostsStore,
              private activatedRoute: ActivatedRoute,
              protected readonly loginService:LoginService) {
    this.postsStore.getTotalPages(this.username);
    // document.querySelector( ":hover" );
  }

  ngOnDestroy(): void {
    this.postsSubscription?.unsubscribe()
    this.bottomSubscription?.unsubscribe()
    this.scrollSubscription?.unsubscribe()
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
}
