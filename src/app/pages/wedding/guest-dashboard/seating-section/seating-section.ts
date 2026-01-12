import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WeddingTable } from '../../../../services/wedding';

@Component({
  selector: 'app-seating-section',
  imports: [MatIconModule],
  templateUrl: './seating-section.html',
  styleUrl: './seating-section.scss',
})
export class SeatingSectionComponent {
  tables = input.required<WeddingTable[]>();
  guestTable = input<WeddingTable | null>(null);

  getTablesRange(start: number, end: number): WeddingTable[] {
    return this.tables().filter((t) => t.table_number >= start && t.table_number <= end);
  }

  getTablePosition(tableNumber: number): { top: number; right: number } {
    const positions: Record<number, { top: number; right: number }> = {
      0: { top: 49, right: 1.5 },
      1: { top: 3, right: 3 },
      2: { top: 18, right: 3 },
      3: { top: 33, right: 3 },
      4: { top: 64, right: 3 },
      5: { top: 79, right: 3 },
      6: { top: 79, right: 12 },
      7: { top: 79, right: 21 },
    };
    return positions[tableNumber] || { top: 50, right: 50 };
  }

  getBrideGroomTable(): WeddingTable | undefined {
    return this.tables().find((t) => t.is_bride_groom);
  }
}
