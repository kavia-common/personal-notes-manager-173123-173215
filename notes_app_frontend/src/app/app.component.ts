import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component hosting the notes application and router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // PUBLIC_INTERFACE
  title = 'Personal Notes';
}
