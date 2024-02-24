import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {info, stats} from "./person.state";
import {environment} from "../../../../../environments/environment";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) {
  }

  getInfo(username: string): Observable<info> {
    return this.httpClient.get<any>(environment.apiUrl + `persons/info/${username}`)
      .pipe(map(response => (JSON.parse(response)) as info))
  }

  getStats(username: string) {
    return this.httpClient.get<stats>(environment.apiUrl + `persons/stats/${username}`)
  }

  follow(username: string) {
    return this.httpClient.post(environment.apiUrl + `persons/follow/${username}`, null)
  }
}
