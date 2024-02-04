import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {PersonStore} from "./store/person.store";
import {ActivatedRoute} from "@angular/router";
import { map, Subscription, tap} from "rxjs";

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgOptimizedImage,
    AsyncPipe
  ],
  templateUrl: './bio.component.html',
  styleUrl: './bio.component.scss',
  // providers:[PersonStore]
})
export class BioComponent implements OnInit{
  PersonState$ = this.personStore.PersonState$;
  // paramsSubscription: Ob;
  constructor(private readonly personStore: PersonStore,
              private activatedRoute: ActivatedRoute) {
    // this.paramsSubscription=
      this.activatedRoute.params.pipe(
      map((p) => p['username'] as string),
        tap(username=>{
          this.personStore.getInfo(username)
          this.personStore.getStats(username)
          console.log(username)
        })
      ).subscribe(
        value => {
          console.log(value)
        }
      );
  }

  ngOnInit(): void {
        this.PersonState$.subscribe(value => {
          console.log("PersonState$")
          console.log(value)
        })
    }

}
