import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user.model';
import { CustomersService } from './customers.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Customer } from 'src/app/models/customer.model';
import { BillsService } from '../bills/bills.service';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'ragioneSociale',
    'email',
    'partitaIva',
    'azioni',
  ];
  dataSource!: MatTableDataSource<Customer>;
  isLoading = false;
  admin = false;
  deletingUserId!: number | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerSrv: CustomersService,
    private dialog: MatDialog
  ) {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.isLoading = true;
    this.customerSrv.getAllCustomers().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  openDeleteDialog(clientId: number): void {
    this.deletingUserId = clientId;
    const dialogRef = this.dialog.open(CustomerDeleteDialog, {
      data: { id: this.deletingUserId },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.deletingUserId = null;
      this.getAllCustomers();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.roles.includes('ROLE_ADMIN')) {
      this.admin = true;
    }
  }
}

@Component({
  selector: 'delete-customer-dialog',
  template: `
    <h1 mat-dialog-title>Elimina cliente</h1>
    <div *ngIf="!deleteInProgress" mat-dialog-content>
      <p>
        Eliminando questo cliente, eliminerai anche tutte le sue fatture.
        <br />
        Sei sicuro di voler eliminare questo cliente?
      </p>
    </div>
    <div *ngIf="deleteInProgress && !error" class="text-center">
      <app-spinner></app-spinner>
    </div>
    <span *ngIf="error" class="text-danger">
      {{ error.error.status }} - {{ error.error.error }}
    </span>
    <div mat-dialog-actions>
      <button
        *ngIf="!deleteInProgress && !error"
        mat-button
        color="warn"
        (click)="deleteCustomer(data.id)"
      >
        Elimina
      </button>
      <button *ngIf="!deleteInProgress || error" mat-button mat-dialog-close>
        Annulla
      </button>
    </div>
  `,
})
export class CustomerDeleteDialog {
  constructor(
    private customerSrv: CustomersService,
    public dialogRef: MatDialogRef<CustomerDeleteDialog>,
    private billsSrv: BillsService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}
  deleteInProgress = false;
  error!: any;

  deleteCustomer(id: number) {
    this.deleteInProgress = true;
    this.billsSrv.deleteBillsByUserId(id).subscribe(
      (res) => {
        this.billsSrv.getBillsByCustomer(id).subscribe(async res => {
          const response = await res;
          if (response.length === 0) {
            this.customerSrv.deleteCustomer(id).subscribe(
              (res) => {
                this.dialogRef.close();
              },
              (error) => {
                this.error = error;
              }
            );
          }
        })
      },
      (error) => {
        this.error = error;
      }
    );

  }
}
