import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comune, Customer, Provincia } from 'src/app/models/customer.model';
import { CustomersService } from '../customers.service';

@Component({
  templateUrl: './detailcustomer.component.html',
  styleUrls: ['./detailcustomer.component.scss'],
})
export class DetailCustomerComponent implements OnInit{
  constructor(
    private customersSrv: CustomersService,
    private route: ActivatedRoute,
  ) {
    this.getCustomer();
  }
  isLoading = false;
  customerDetails!: Customer;
  private routeSub!: Subscription;
  admin = false;

  getCustomer() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.customersSrv.getCustomer(params['id']).subscribe((customer) => {
        this.customerDetails = customer;
        this.isLoading = false;
      });
    });
  }

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.roles.includes('ROLE_ADMIN')) {
      this.admin = true;
    }
  }
}
