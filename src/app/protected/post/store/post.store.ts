import {Injectable} from "@angular/core";
import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {Comment, PostInfo, PostState} from "./post-state.store";
import {Observable, switchMap} from "rxjs";
import {PostService} from "./post.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostStore extends ComponentStore<PostState> {
  // Updaters
  readonly addTotalPages = this.updater((state, totalPages: number) => ({
    postInfo: state.postInfo,
    comments: state.comments,
    commentMetadata: {
      pageNumber: state.commentMetadata.pageNumber,
      totalPages: totalPages
    }
  }));

  readonly addComments = this.updater((state, comments: Comment[]) => (
    {
      postInfo: state.postInfo,
      comments: [...state.comments, ...comments],
      commentMetadata: {
        pageNumber: state.commentMetadata.pageNumber + 1,
        totalPages: state.commentMetadata.totalPages
      }
    }
  ));

  readonly addPostInfo = this.updater((state, postInfo: PostInfo) => (
    {
      postInfo: postInfo,
      comments: state.comments,
      commentMetadata: state.commentMetadata
    }
  ));

  // selectors
  readonly postState$ = this.selectSignal(state => state);

  // effects
  readonly getMetadata = this.effect((postId$: Observable<number>) => {
    return postId$.pipe(
      switchMap((postId) =>
        this.postService.getMetadata(postId).pipe(
          tapResponse(
            (metadata) => {
              this.addTotalPages(metadata.totalPages)
              this.addPostInfo(metadata.postInfo)
            },
            (error: HttpErrorResponse) => console.log(error),
          ),
        )),
    );
  });

  readonly getComments = this.effect((params$: Observable<{ postId: number, pageNumber: number }>) => {
    return params$.pipe(
      switchMap((params) =>
        this.postService.getComments(params.postId, params.pageNumber).pipe(
          tapResponse(
            (comments) => {
              if (!!comments && (comments.length > 0)) {
                this.addComments(comments)
              }
            },
            (error: HttpErrorResponse) => console.log(error),
          ),
        )),
    );
  });

  constructor(private postService: PostService) {
    super({
      postInfo: {
        timeUntilNow: 0,
        likesCount: 0,
        description: "",
        image: "",
        photo: "",
        hashtags: []
      },
      comments: [],
      commentMetadata: {
        pageNumber: 0,
        totalPages: 1
      }
    });
  }
}
