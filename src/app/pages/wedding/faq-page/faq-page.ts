import { Component, OnInit, signal } from '@angular/core';
import { PageLayoutComponent } from '../guest-dashboard/page-layout/page-layout';
import { FaqSectionComponent } from '../guest-dashboard/faq-section/faq-section';
import { WeddingService, FAQItem } from '../../../services/wedding';

@Component({
  selector: 'app-faq-page',
  imports: [PageLayoutComponent, FaqSectionComponent],
  template: `
    <app-page-layout>
      <app-faq-section [faqs]="faqs()" />
    </app-page-layout>
  `,
})
export class FaqPageComponent implements OnInit {
  faqs = signal<FAQItem[]>([]);

  constructor(private weddingService: WeddingService) {}

  async ngOnInit() {
    await this.loadFAQs();
  }

  async loadFAQs() {
    try {
      const faqs = await this.weddingService.getFAQs();
      this.faqs.set(faqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  }
}
