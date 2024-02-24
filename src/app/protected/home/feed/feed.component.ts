import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {FeedStore} from "./store/feed.store";
import {fromEvent, interval, Subscription, tap} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {FeedPost} from "./store/feed-state.store";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatCardImage,
    MatButton,
    MatIcon,
    MatIconButton,
    MatCardAvatar,
    RouterLink
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
  providers: [FeedStore]
})
export class FeedComponent implements OnInit, OnDestroy {
  feedState$ = this.feedStore.feedState$
  username = "john_doe"
  bottomSubscription: Subscription | undefined
  reachBottom$ = fromEvent(window, 'Reached bottom')
    .pipe(tap(_ev => {
      if (!this.feedState$().last) {
        this.feedStore.getPosts(this.feedState$().number)
      } else {
        this.bottomSubscription?.unsubscribe()
      }
    }))
  scrollSubscription: Subscription | undefined
  interval$ = interval(1000).pipe(
    tap(_time => {
      const div = document.querySelector("body")!;
      const verticalScroll = div.scrollHeight > div.clientHeight;
      if (!verticalScroll && !this.feedState$().last) {
        this.feedStore.getPosts(this.feedState$().number)
      } else {
        this.scrollSubscription?.unsubscribe()
      }
    })
  );

  constructor(private readonly feedStore: FeedStore,
              private readonly httpClient: HttpClient) {
    this.feedStore.getPosts(this.feedState$().number);
  }

  ngOnDestroy(): void {
    this.bottomSubscription?.unsubscribe()
    this.scrollSubscription?.unsubscribe()
  }

  ngOnInit(): void {
    this.bottomSubscription = this.reachBottom$.subscribe()
    this.scrollSubscription = this.interval$.subscribe()
    onscroll = function (ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        console.log("you're at the bottom of the page " + ev);
        window.dispatchEvent(new Event("Reached bottom"))
      }
    };
  }

  likePost(post: FeedPost) {
    this.httpClient.post<any>(environment.apiUrl + 'posts/like/' + post.id, null)
      // .pipe(tap(() => this.postStore.getMetadata(this.postId)))
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.feedStore.likePost({postId:post.id, like:!post.like})
          console.log(this.feedState$())
          // Handle successful response
          console.log('Response:', response);
          console.log('Status code:', response.status); // Status code of the response
        },
        error: (error: HttpErrorResponse) => {
          // Handle error response
          console.error('Error:', error);
          console.log('Status code:', error.status); // Status code of the error response
        }
      })
  }
}
