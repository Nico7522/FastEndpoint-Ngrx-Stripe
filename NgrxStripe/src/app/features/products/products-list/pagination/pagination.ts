import { Component, input, output } from '@angular/core';
import { PaginationState } from '../../models/paginated-response';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  paginationMetadata = input.required<PaginationState>();
  totalPagesArray = input.required<number[]>();

  onNextPage = output<void>();
  onPreviousPage = output<void>();
  onGoToPage = output<number>();

  nextPage() {
    this.onNextPage.emit();
  }

  previousPage() {
    this.onPreviousPage.emit();
  }

  goToPage(page: number) {
    this.onGoToPage.emit(page);
  }
}
