import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FeedPost, FeedState} from "./feed-state.store";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private httpClient: HttpClient) {
  }

  getPosts(number: number): Observable<FeedState> {
    return this.httpClient
      .get<any>(environment.apiUrl + `posts/feed?pageNumber=${number}`)
      .pipe(
        map(response => {
          const posts: FeedPost[] = [];
          for (let post of response.content) {
            posts.push({
              image: post.postFeedProjection.image,
              uploaderPhoto: post.postFeedProjection.uploaderPhoto,
              timeUntilNow: post.postFeedProjection.timeUntilNow,
              uploaderUsername: post.postFeedProjection.uploaderUsername,
              id: post.postFeedProjection.id,
              description: post.postFeedProjection.description,
              uploaderValidated: post.postFeedProjection.uploaderValidated,
              likesCount: post.likesCount,
              commentCounts: post.commentCounts,
              like: post.like
            })
          }
          return {
            posts: posts,
            number: response.number as number,
            last: response.last as boolean
          }
        })
      )
  }
}
