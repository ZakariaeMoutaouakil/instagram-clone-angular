import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {Injectable} from "@angular/core";
import {info, PersonState, stats} from "./person.state";
import {Observable, switchMap} from "rxjs";
import {PersonService} from "./person.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PersonStore extends ComponentStore<PersonState> {

  readonly PersonState$: Observable<PersonState> = this.select(state => state);

  readonly addInfo = this.updater((state, info: info) => ({
    info: info, stats: state.stats
  }));

  readonly addStats = this.updater((state, stats: stats) => ({
    info: state.info, stats: stats
  }));

  readonly getInfo = this.effect((username$: Observable<string>) => {
    return username$.pipe(switchMap((username) => this.personService.getInfo(username).pipe(
      tapResponse((info) => {
        if(!!info){
          this.addInfo(info)
        }
        console.log(info)
      }, (error: HttpErrorResponse) => {
        console.log("httperror")
        console.log(error)
    },))))
  });

  readonly getStats = this.effect((username$: Observable<string>) => {
    return username$.pipe(switchMap((username) => this.personService.getStats(username).pipe(
      tapResponse((stats) => {
        if(!!stats) {
          this.addStats(stats)
        }
        console.log(stats)
      }, (error: HttpErrorResponse) => {
        console.log("httperror")
        console.log(error)
    },))))
  })

  constructor(private personService: PersonService) {
    super({
      info: {
        username: "", firstname: "", lastname: "", bio: "", validated: false, photo: ""
      }, stats: {
        followers: 0, followings: 0, posts: 0
      }
    });
  }

}
