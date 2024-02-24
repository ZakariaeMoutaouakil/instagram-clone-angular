import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {SuggestionsStore} from "./store/suggestions.store";
import {RouterLink} from "@angular/router";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    RouterLink,
    MatCardAvatar,
    NgStyle
  ],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss',
  providers: [SuggestionsStore]
})
export class SuggestionsComponent implements OnInit {
  protected readonly suggestionsState$ = this.suggestionsStore.suggestionsState$

  constructor(private readonly suggestionsStore: SuggestionsStore) {
  }

  ngOnInit(): void {
    this.suggestionsStore.getSuggestions()
    console.log(this.suggestionsState$())
  }
}
