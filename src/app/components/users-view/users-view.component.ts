import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationService } from 'src/app/services/pagination/pagination.service';
import { Contact } from 'src/app/models/contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  contactList: Array<Contact> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(private paginationService: PaginationService) {
    this.subscriptions.push(this.paginationService.readPaginateList<Contact>()
      .subscribe(_ => { this.contactList = _ }));
  }

  ngOnInit() {
  }

}
