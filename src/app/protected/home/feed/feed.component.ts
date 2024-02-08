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
  reachBottom$ = fromEvent(window, 'Reached bottom')
    .pipe(tap(ev => {
      if (!this.feedState$().last) {
        this.feedStore.getPosts({username: this.username, number: this.feedState$().number})
      } else {
        this.bottomSubscription?.unsubscribe()
      }
    }))
  bottomSubscription: Subscription | undefined
  scrollSubscription: Subscription | undefined
  interval$ = interval(1000).pipe(
    tap(time => {
      const div = document.querySelector("body")!;
      const verticalScroll = div.scrollHeight > div.clientHeight;
      if (!verticalScroll && !this.feedState$().last) {
        this.feedStore.getPosts({username: this.username, number: this.feedState$().number})
      } else {
        this.scrollSubscription?.unsubscribe()
      }
    })
  );

  constructor(private readonly feedStore: FeedStore) {
    this.feedStore.getPosts({username: this.username, number: this.feedState$().number});
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
}
