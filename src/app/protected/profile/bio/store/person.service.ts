import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {info, stats} from "./person.state";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) {
  }

  getInfo(username: string) {
    return this.httpClient.get<info>(environment.apiUrl + `persons/info/${username}`)
  }

  getStats(username: string) {
    return this.httpClient.get<stats>(environment.apiUrl + `persons/stats/${username}`)
  }
}
