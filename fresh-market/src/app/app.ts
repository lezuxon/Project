import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { NotificationComponent } from './notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NotificationComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('fresh-market');
}
