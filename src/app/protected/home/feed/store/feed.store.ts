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

  readonly likePost = this.updater((state, params: { postId: number, like: boolean }) => {
    const indexToUpdate = state.posts.findIndex(post => post.id === params.postId);
    const updatedPosts = indexToUpdate !== -1 ?
      state.posts.map((post, index) => index === indexToUpdate ?
        { ...post, like: params.like, likesCount: params.like ? post.likesCount + 1 : post.likesCount - 1 } :
        post
      ) :
      state.posts;

    return { ...state, posts: updatedPosts };
  });

  // Selectors
  readonly feedState$ = this.selectSignal((state) => state);

  // Effects
  readonly getPosts = this.effect((pageNumber$: Observable<number>) => {
    return pageNumber$.pipe(
      switchMap((pageNumber) =>
        this.feedService.getPosts(pageNumber)
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

  constructor(private readonly feedService: FeedService) {
    super({posts: [], number: 0, last: false});
  }
}
