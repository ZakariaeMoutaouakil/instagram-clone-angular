import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {info, stats} from "./person-state";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) {
  }

  getInfo(username: string) {
    return this.httpClient.get<info>(`http://localhost:8080/persons/info/${username}`)
  }

  getStats(username: string) {
    return this.httpClient.get<stats>(`http://localhost:8080/persons/stats/${username}`)
  }
}
