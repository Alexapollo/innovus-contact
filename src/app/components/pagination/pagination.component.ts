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
  @Input() pagesToDisplay: number;

  private totalPages: Array<number> = [];
  viewPages: Array<PaginationBag> = [];
  currentPage: number;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private paginationService: PaginationService
  ) {
    this.subscriptions.push(
      this.paginationService.readTotalPages().
        subscribe(_ => {
          this.setPaginationArray(_);
        }));
  }

  ngOnInit() {
    console.log(this.pagesToDisplay)
    this.paginationService.getPage(1, this.targetEndpoint);
    this.currentPage = 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getPage(page: number) {
    if (page == 0) { return; }
    this.paginationService.getPage(page, this.targetEndpoint);
    this.currentPage = page;
  }

  rollPage(step: number) {
    let page = this.currentPage + step;
    if (page < 1 || page > this.totalPages.length) { return; }

    this.currentPage = page;
    this.getPage(this.currentPage);
  }

  private setPaginationArray(pages: number) {
    this.totalPages = new Array<number>();
    for (let i = 1; i <= pages; i++) {
      this.totalPages.push(i);
    }
    
    let output = new Array<PaginationBag>();
    let halfDisplay = Math.floor((this.pagesToDisplay - 1) / 2);
    this.dotDown(output, halfDisplay);
    output.push(new PaginationBag(this.currentPage.toString(), this.currentPage));
    this.dotUp(output, halfDisplay);
    this.viewPages = output;
  }

  private dotDown(output: PaginationBag[], offset: number) {
    let counter = offset;
    for (var i = this.currentPage - 1; i >= 1; i--) {
      if (counter > 0 || i == 1) {
        output.push(new PaginationBag(i.toString(), i));
      } else if (counter == 0) {
        output.push(new PaginationBag('...', 0));
      }
      counter--;
    }
    return output.reverse();
  }

  private dotUp(output: PaginationBag[], offset: number) {
    let counter = offset;
    for (var i = this.currentPage + 1; i <= this.totalPages.length; i++) {
      if (counter > 0 || i == this.totalPages.length) {
        output.push(new PaginationBag(i.toString(), i));
      } else if (counter == 0) {
        output.push(new PaginationBag('...', 0));
      }
      counter--;
    }
    return output;
  }

}

class PaginationBag {
  label: string;
  value: number;
  constructor(label: string, value: number) {
    this.label = label;
    this.value = value;
  }
}
