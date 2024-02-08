import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {PersonStore} from "./store/person.store";
import {ActivatedRoute} from "@angular/router";
import {map, tap} from "rxjs";

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
export class BioComponent implements OnInit {
  PersonState$ = this.personStore.PersonState$;
  defaultPhoto = "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707048000&semt=sph";

  constructor(private readonly personStore: PersonStore,
              private activatedRoute: ActivatedRoute) {
    // this.paramsSubscription=
    this.activatedRoute.params.pipe(
      map((p) => p['username'] as string),
      tap(username => {
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
