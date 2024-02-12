import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  preflight(){
    return this.http.get<JSON>('http://localhost:8080/login').pipe(
      catchError(error => {
        // Handle authentication error here
        return throwError(() => error);
      })
    )
  }

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.get<JSON>('http://localhost:8080/login', {headers}).pipe(
      catchError(error => {
        // Handle authentication error here
        return throwError(() => error);
      })
    )
  }
}
