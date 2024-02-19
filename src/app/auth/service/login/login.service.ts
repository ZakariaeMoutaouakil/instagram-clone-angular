import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly httpClient: HttpClient) {
  }

  preflight() {
    return this.httpClient.get<any>(environment.apiUrl + 'test')
  }

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    return this.httpClient.get<JSON>(environment.apiUrl + 'login', {headers}).pipe(
      catchError(error => {
        // Handle authentication error here
        return throwError(() => error);
      })
    )
  }

}
