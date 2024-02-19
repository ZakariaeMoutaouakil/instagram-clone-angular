import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Comment, PostInfo} from "./post-state.store";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostService {


  constructor(private httpClient: HttpClient) {
  }

  getComments(postId: number, pageNumber: number) {
    return this.httpClient
      .get<any>(environment.apiUrl + `posts/${postId}?pageNumber=${pageNumber}`)
      .pipe(
        map(response => response.comments.content as Comment[])
      )
  }

  getMetadata(postId: number): Observable<{ postInfo: PostInfo, totalPages: number }> {
    return this.httpClient
      .get<any>(environment.apiUrl + `posts/${postId}?pageNumber=0`)
      .pipe(
        map(response => {
            return {
              postInfo: {
                timeUntilNow: response.timeUntilNow as number,
                likesCount: response.likesCount as number,
                description: response.description as string,
                image: response.image as string,
                photo: response.photo as string,
                hashtags: response.hashtags as string[]
              },
              totalPages: response.comments.totalPages as number
            };
          }
        ))
  }
}
