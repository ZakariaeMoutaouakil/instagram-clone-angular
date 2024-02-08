import {Injectable} from "@angular/core";
import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {FeedPost, FeedState} from "./feed-state.store";
import {FeedService} from "./feed.service";
import {Observable, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FeedStore extends ComponentStore<FeedState> {
  // Updaters
  readonly addPosts = this.updater((state, posts: FeedPost[]) => ({
    posts: [...state.posts, ...posts],
    number: state.number + 1,
    last: state.last
  }));

  readonly addLast = this.updater((state) => ({
    posts: state.posts,
    number: state.number,
    last: true
  }));

  // Selectors
  readonly feedState$ = this.selectSignal((state) => state);

  // Effects
  readonly getPosts = this.effect((params$: Observable<{ username: string, number: number }>) => {
    return params$.pipe(
      switchMap((params) =>
        this.feedService.getPosts(params.username, params.number)
          .pipe(
            tapResponse(
              (feedState) => {
                if (!!feedState && feedState.posts.length > 0) {
                  this.addPosts(feedState.posts)
                }
                if (feedState.last) {
                  this.addLast()
                }
              },
              (error: HttpErrorResponse) => console.log(error),
            )
          )
      ))
  });

  constructor(private feedService: FeedService) {
    super({posts: [], number: 0, last: false});
  }
}
