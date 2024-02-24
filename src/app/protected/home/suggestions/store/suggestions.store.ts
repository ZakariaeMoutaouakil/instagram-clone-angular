import {Injectable} from "@angular/core";
import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {Suggestion, SuggestionsState} from "./suggestions-state.store";
import {exhaustMap} from "rxjs";
import {SuggestionsService} from "./suggestions.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SuggestionsStore extends ComponentStore<SuggestionsState> {
  // Updaters
  readonly addSuggestions = this.updater((state, suggestions: Suggestion[]) => ({
    suggestions: [...state.suggestions, ...suggestions]
  }));

  // Selectors
  readonly suggestionsState$ = this.selectSignal((state) => state);

  // Effects
  readonly getSuggestions = this.effect<void>(
    // The name of the source stream doesn't matter: `trigger$`, `source$` or `$` are good
    // names. We encourage to choose one of these and use them consistently in your codebase.
    (trigger$) => trigger$.pipe(
      exhaustMap(() =>
        this.suggestionsService.getSuggestions().pipe(
          tapResponse({
            next: (suggestions) => {
              console.log(suggestions)
              this.addSuggestions(suggestions)
            },
            error: (error: HttpErrorResponse) => console.log(error),
          })
        )
      )
    )
  );

  constructor(private readonly suggestionsService: SuggestionsService) {
    super({suggestions: []});
  }
}
