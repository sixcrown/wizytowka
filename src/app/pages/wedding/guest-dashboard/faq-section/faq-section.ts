import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FAQItem } from '../../../../services/wedding';

@Component({
  selector: 'app-faq-section',
  imports: [MatExpansionModule, MatIconModule],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
})
export class FaqSectionComponent {
  faqs = input.required<FAQItem[]>();
}
