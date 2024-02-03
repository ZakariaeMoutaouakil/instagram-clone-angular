import { Component } from '@angular/core';
import {FeedComponent} from "./feed/feed.component";
import {SuggestionsComponent} from "./suggestions/suggestions.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FeedComponent,
    SuggestionsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
