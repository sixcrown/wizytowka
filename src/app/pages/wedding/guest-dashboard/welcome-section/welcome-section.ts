import { Component, input } from '@angular/core';

@Component({
  selector: 'app-welcome-section',
  imports: [],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.scss',
})
export class WelcomeSectionComponent {
  guestName = input<string>('Gościu');
}
