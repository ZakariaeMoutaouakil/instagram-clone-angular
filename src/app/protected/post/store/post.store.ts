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
  }))

  readonly addComments = this.updater((state, comments: Comment[]) => (
    {
      postInfo: state.postInfo,
      comments: [...state.comments, ...comments],
      commentMetadata: {
        pageNumber: state.commentMetadata.pageNumber + 1,
        totalPages: state.commentMetadata.totalPages
      }
    }
  ))

  readonly addPostInfo = this.updater((state, postInfo: PostInfo) => (
    {
      postInfo: postInfo,
      comments: state.comments,
      commentMetadata: state.commentMetadata
    }
  ))

  readonly updateComment = this.updater((state, params: { commentId: number, comment: string }) => {
    return {
      ...state,
      comments: state.comments.map((comment, _) => {
        if (comment.id === params.commentId) {
          return {...comment, comment: params.comment};
        }
        return comment;
      }),
    }
  })

  readonly deleteComment = this.updater((state, commentId: number) => {
    return {
      ...state,
      comments: state.comments.filter((comment, _) => comment.id !== commentId),
    }
  })

  // selectors
  readonly postState$ = this.selectSignal(state => state)

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
  })

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
  })

  readonly updateComments = this.effect((params$: Observable<{ commentId: number, comment: string }>) => {
    return params$.pipe(
      switchMap((params) =>
        this.postService.updateComment(params.commentId, params.comment).pipe(
          tapResponse(
            () => {
              this.updateComment({commentId: params.commentId, comment: params.comment})
            },
            (error: HttpErrorResponse) => console.log(error),
          ),
        )),
    );
  })

  readonly deleteComments = this.effect((commentId$: Observable<number>) => {
    return commentId$.pipe(
      switchMap((commentId) =>
        this.postService.deleteComment(commentId).pipe(
          tapResponse(
            () => {
              this.deleteComment(commentId)
              console.log(this.postState$())
            },
            (error: HttpErrorResponse) => console.log(error),
          ),
        )),
    );
  })

  constructor(private postService: PostService) {
    super({
      postInfo: {
        timeUntilNow: 0,
        likesCount: 0,
        description: "",
        image: "",
        photo: "",
        hashtags: [],
        like: false
      },
      comments: [],
      commentMetadata: {
        pageNumber: 0,
        totalPages: 1
      }
    });
  }
}
