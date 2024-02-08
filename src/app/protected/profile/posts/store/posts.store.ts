import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {Injectable, Signal} from "@angular/core";
import {Post, PostsState} from "./posts-state";
import {Observable, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {PostsService} from "./posts.service";

@Injectable()
export class PostsStore extends ComponentStore<PostsState> {

  readonly addPosts = this.updater((state, posts: Post[]) => ({
    posts: [...state.posts, ...posts],
    metadata: state.metadata
  }));

  readonly addTotalPages = this.updater((state, totalPages: number) => ({
    posts: state.posts,
    metadata: {
      pageNumber: state.metadata.pageNumber,
      totalPages: totalPages
    }
  }));

  readonly addPageNumber = this.updater((state) => ({
    posts: state.posts,
    metadata: {
      pageNumber: state.metadata.pageNumber + 1,
      totalPages: state.metadata.totalPages
    }
  }));

  readonly posts$: Observable<Post[]> = this.select(state => state.posts);

  readonly totalPages$: Signal<number> = this.selectSignal((state) => state.metadata.totalPages);

  readonly pageNumber$: Signal<number> = this.selectSignal((state) => state.metadata.pageNumber);

  readonly getTotalPages = this.effect((username$: Observable<string>) => {
    return username$.pipe(
      switchMap((username) => this.postsService.getTotalPages(username).pipe(
        tapResponse((totalPages) => {
            if (!!totalPages) {
              this.addTotalPages(totalPages)
            }
          }, (error: HttpErrorResponse) => {
            console.log(error)
          }
        ))))
  });

  readonly getPosts = this.effect((params$: Observable<{ username: string, pageNumber: number }>) => {
    return params$.pipe(
      switchMap(
      params=>
        this.postsService.getPosts(params.username, params.pageNumber).pipe(
          tapResponse((posts) => {
              if (!!posts) {
                this.addPosts(posts)
                this.addPageNumber()
                console.log("fetch posts")
              }
            }, (error: HttpErrorResponse) => {
              console.log(error)
            }
          ))))
  });

  constructor(private postsService: PostsService) {
    super({
      posts: [],
      metadata: {
        pageNumber: 0,
        totalPages: 1
      }
    });
  }
}
