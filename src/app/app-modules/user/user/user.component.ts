import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  navbarOpen: boolean;

  constructor() { }

  ngOnInit() {
    this.navbarOpen = false;
  }

  toggleNavbar() {    
    this.navbarOpen = !this.navbarOpen;
  }

}
