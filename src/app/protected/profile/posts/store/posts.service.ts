import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "./posts-state";
import {map} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) {
  }

  getPosts(username: string, pageNumber: number) {
    return this.httpClient
      .get<any>(environment.apiUrl + `posts/preview/${username}?pageNumber=${pageNumber}`)
      .pipe(
        map(response => response.content as Post[])
      )
  }

  getTotalPages(username: string) {
    return this.httpClient.get<any>(environment.apiUrl + `posts/preview/${username}?pageNumber=0`)
      .pipe(
        map(response => response.totalPages as number)
      )
  }
}
