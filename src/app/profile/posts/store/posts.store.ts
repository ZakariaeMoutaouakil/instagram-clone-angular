import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {Injectable} from "@angular/core";
import {Post, PostsState} from "./posts-state";
import {Observable, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {PostsService} from "./posts.service";

@Injectable()
export class PostsStore extends ComponentStore<PostsState> {

  readonly addPosts = this.updater((state, posts: Post[]) => ({
    posts: [...state.posts, ...posts]
  }));

  readonly posts$: Observable<Post[]> = this.select(state => state.posts);

  readonly getPosts = this.effect((username$: Observable<string>) => {
    return username$.pipe(switchMap((username) => this.postsService.getPosts(username).pipe(
      tapResponse((posts) => {
          if (!!posts) {
            this.addPosts(posts)
          }
        }, (error: HttpErrorResponse) => {
          console.log(error)
        }
      ))))
  });

  constructor(private postsService: PostsService) {
    super({posts: []});
  }
}
