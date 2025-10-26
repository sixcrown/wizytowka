import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  skills = ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'];

  experience = [
    {
      title: 'Senior Developer',
      company: 'Tech Company',
      period: '2020 - Present',
      description: 'Leading development of enterprise applications',
    },
    {
      title: 'Developer',
      company: 'Software House',
      period: '2018 - 2020',
      description: 'Full-stack web development',
    },
  ];
}
