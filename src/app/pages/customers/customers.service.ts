import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Comuni,
  Customer,
  Customers,
  Province,
} from 'src/app/models/customer.model';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private http: HttpClient) {}

  getCustomer(customerId: number) {
    return this.http.get<Customer>(
      `${environment.pathApi}/api/clienti/${customerId}`
    );
  }
  getAllCustomers() {
    return this.http
      .get<Customers>(`${environment.pathApi}/api/clienti?sort=id&size=99999`)
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  getAllProvince() {
    return this.http
      .get<Province>(`${environment.pathApi}/api/province?sort=id&size=99999`)
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  getAllComuni() {
    return this.http
      .get<Comuni>(`${environment.pathApi}/api/comuni?sort=id&size=99999`)
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
  addCustomer(customer: Customer) {
    console.log(customer);
    return this.http
      .post<Customer>(`${environment.pathApi}/api/clienti/`, customer)
      .pipe(
        tap(() => {
          console.log(customer);
        })
      );
  }
  editCustomer(customer: Customer, customerId: number) {
    return this.http.put<Customer>(
      `${environment.pathApi}/api/clienti/${customerId}`,
      customer
    );
  }
  deleteCustomer(customerId: number) {
    return this.http.delete(`${environment.pathApi}/api/clienti/${customerId}`);
  }
}
