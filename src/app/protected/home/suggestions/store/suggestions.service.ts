import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {Suggestion} from "./suggestions-state.store";

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  constructor(private httpClient: HttpClient) {
  }

  getSuggestions(): Observable<Suggestion[]> {
    return this.httpClient.get<Suggestion[]>(environment.apiUrl + 'persons/suggestions')
  }
}
