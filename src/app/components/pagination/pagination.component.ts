import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PaginationService } from 'src/app/services/pagination/pagination.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnDestroy {

  @Input() targetEndpoint: string;
  totalPages: Array<number> = [];
  currentPage: number;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private paginationService: PaginationService
  ) {
    this.subscriptions.push(
      this.paginationService.readTotalPages().
        subscribe(_ => {
          this.toArray(_);
        }));
  }

  ngOnInit() {
    console.log(this.targetEndpoint)
    this.paginationService.getPage(1, this.targetEndpoint);
    this.currentPage = 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getPage(page: number) {
    this.paginationService.getPage(page, this.targetEndpoint);
    this.currentPage = page;
  }

  rollPage(step: number) {
    let page = this.currentPage + step;
    if (page < 1 || page > this.totalPages.length) { return; }

    this.currentPage = page;
    this.getPage(this.currentPage);
  }

  private toArray(pages: number) {
    this.totalPages = new Array<number>();
    for (let i = 1; i <= pages; i++) {
      this.totalPages.push(i);
    }
  }

}
