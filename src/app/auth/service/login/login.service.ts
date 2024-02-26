import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  username = signal<string>("")

  constructor(private readonly httpClient: HttpClient) {
  }

  preflight(): Observable<string> {
    return this.httpClient.get<string>(environment.apiUrl + 'login')
      .pipe(
        tap(username => {
          console.log('preflight'+this.username())
          this.username.set(username)
          console.log('preflight'+this.username())
        })
      )
  }

  login(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    })

    return this.httpClient.get<string>(environment.apiUrl + 'login', {headers}).pipe(
      tap(username => this.username.set(username)),
      catchError(error => {
        // Handle authentication error here
        return throwError(() => error);
      })
    )
  }

  logout(){
    this.username.set("")
  }

}
