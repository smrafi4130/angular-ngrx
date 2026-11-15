import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<header class="topbar"><strong>NgRx Tasks</strong></header><main class="container"><router-outlet /></main>`,
})
export class AppComponent {}
