import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bill, Bills } from 'src/app/models/bill.model';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private http: HttpClient) {}

  getAllBills() {
    return this.http
      .get<Bills>(`${environment.pathApi}/api/fatture?size=99999&sort=id`)
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }

  getBillById(billId: number) {
    return this.http.get<Bill>(
      `${environment.pathApi}/api/fatture/${billId}?sort=id&size=99999}`
    );
  }

  getBillsByCustomer(customerId: number) {
    return this.http
      .get<Bills>(
        `${environment.pathApi}/api/fatture/cliente/${customerId}?sort=id&size=99999}`
      )
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }

  addBill(bill: Bill) {
    console.log(bill);
    return this.http
      .post<Bill>(`${environment.pathApi}/api/fatture/`, bill)
      .pipe(
        tap(() => {
          console.log(bill);
        })
      );
  }
  editBill(bill: Bill, billId: number) {
    return this.http.put<Bill>(
      `${environment.pathApi}/api/fatture/${billId}`,
      bill
    );
  }
  deleteBill(billId: number) {
    return this.http.delete(`${environment.pathApi}/api/fatture/${billId}`);
  }

  deleteBillsByUserId(userId: number) {
    return this.http.delete(
      `${environment.pathApi}/api/fatture/cliente/${userId}`
    );
  }

  formatDataBills(bills: Bill[]) {
    for (let bill of bills) {
      let billYear = bill.data.slice(0, 4);
      let billMonth = bill.data.slice(5, 7);
      let billDate = bill.data.slice(8, 10);
      bill.data = `${billYear}-${billMonth}-${billDate}`;
    }
  }

  formatDataBill(bill: Bill) {
    let billYear = bill.data.slice(0, 4);
    let billMonth = bill.data.slice(5, 7);
    let billDate = bill.data.slice(8, 10);
    bill.data = `${billYear}-${billMonth}-${billDate}`;
  }
}
