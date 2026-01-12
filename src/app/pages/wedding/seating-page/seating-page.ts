import { Component, OnInit, signal } from '@angular/core';
import { PageLayoutComponent } from '../guest-dashboard/page-layout/page-layout';
import { SeatingSectionComponent } from '../guest-dashboard/seating-section/seating-section';
import { WeddingService, WeddingTable } from '../../../services/wedding';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-seating-page',
  imports: [PageLayoutComponent, SeatingSectionComponent],
  template: `
    <app-page-layout>
      <app-seating-section [tables]="tables()" [guestTable]="guestTable()" />
    </app-page-layout>
  `,
})
export class SeatingPageComponent implements OnInit {
  tables = signal<WeddingTable[]>([]);
  guestTable = signal<WeddingTable | null>(null);

  constructor(
    private weddingService: WeddingService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadTables();
    await this.loadGuestTable();
  }

  async loadTables() {
    try {
      const tables = await this.weddingService.getTables();
      this.tables.set(tables);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  }

  async loadGuestTable() {
    const guestId = this.authService.currentGuest()?.id;
    if (!guestId) return;

    try {
      const table = await this.weddingService.getGuestTable(guestId);
      this.guestTable.set(table);
    } catch (error) {
      console.error('Error loading guest table:', error);
    }
  }
}
