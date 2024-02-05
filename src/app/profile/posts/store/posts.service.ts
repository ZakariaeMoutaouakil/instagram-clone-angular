import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {stats} from "../../bio/store/person.state";
import {Post, PostsState} from "./posts-state";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient:HttpClient) { }

  getPosts(username:string){
    return this.httpClient.get<Post[]>(`http://localhost:8080/posts/preview/${username}`)
  }
}
