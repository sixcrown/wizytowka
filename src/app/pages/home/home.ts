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
  name = 'Bartosz Kawałkiewicz';
  title = 'Angular/.NET developer';
  email = 'bartoszkawalkiewicz@gmail.com';
  phone = '+48 665 819 026';
  location = 'Gliwice, Poland';
  linkedin = 'https://www.linkedin.com/in/bartosz-kawałkiewicz-0688771b4/';

  about = 'Fullstack developer proficient in Angular with 5 years of experience in building web apps. I graduated from Silesian University of Technology.';

  skillGroups = [
    {
      category: 'Frontend',
      skills: ['Angular 11-19', 'TypeScript', 'JavaScript', 'Angular Material', 'ng-bootstrap', 'RxJS', 'NGXS', 'NGRX', 'HTML5', 'CSS/LESS/SCSS/SASS', 'Stripe Elements', 'Leaflet']
    },
    {
      category: 'Backend',
      skills: ['C#', 'ASP.NET', '.NET Framework', '.NET Core', '.NET 5+', 'Web API', 'Entity Framework', 'Dapper', 'MediatR']
    },
    {
      category: 'Databases',
      skills: ['MSSQL', 'TSQL']
    },
    {
      category: 'Infrastructure & DevOps',
      skills: ['Azure Portal', 'Azure Functions', 'Azure Service Bus', 'Azure DevOps', 'Azure AD B2C', 'KeyVault', 'Blob Storage', 'Docker', 'RabbitMQ', 'Web Socket']
    },
    {
      category: 'Testing',
      skills: ['NUnit', 'XUnit', 'Jasmine', 'Jest']
    },
    {
      category: 'Tools & Methodology',
      skills: ['Git', 'Jira', 'Azure DevOps', 'Confluence', 'Agile/Scrum', 'Open API 3.0']
    }
  ];

  experience = [
    {
      title: 'Frontend Developer',
      company: 'bolttech Poland',
      period: '02.2024 - present',
      description: 'Lead frontend developer for Angular-based customer portals (Orange Smart Care, Naprawa Plus). Tech stack: Angular (v12→v16→v19), .NET 8, NGRX Signal Store, Azure, Redis, Docker. Mentoring junior developers.',
      projects: [
        'Customer Portals - Orange Smart Care, Naprawa Plus & Others',
        'Play - Courier Label App with MSAL & Microsoft Graph',
        'Grading App for Device Assessment with dynamic Excel-based forms'
      ]
    },
    {
      title: 'Angular/.NET Developer',
      company: 'Software Interactive S.A',
      period: '06.2022 - 01.2024',
      description: 'Full-stack development including YouBega ecommerce platform, Camel PoC for hospitals, and Flir Systems infrared training platform. Frontend architecture design, code reviews, Azure CI/CD.',
      projects: [
        'YouBega - Ecommerce Platform (SPA with real-time chat, payments)',
        'Camel - PoC of quality registries for hospitals',
        'Flir Systems - Infrared Training Centre'
      ]
    },
    {
      title: 'Frontend Developer',
      company: 'Comarch S.A',
      period: '07.2020 - 06.2022',
      description: 'Frontend development for BNP PARIBAS factoring app. Developing new features, helping with technical documentation, UI/UX mockups, client demos, code reviews.',
      projects: []
    }
  ];

  education = {
    degree: 'Bachelor of Engineering',
    field: 'Computer Science',
    university: 'Silesian University of Technology',
    period: '2016-2021'
  };

  getSkillIcon(category: string): string {
    const icons: Record<string, string> = {
      'Frontend': 'web',
      'Backend': 'dns',
      'Databases': 'storage',
      'Infrastructure & DevOps': 'cloud',
      'Testing': 'bug_report',
      'Tools & Methodology': 'build'
    };
    return icons[category] || 'code';
  }
}
