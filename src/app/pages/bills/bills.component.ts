import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bill, Bills } from 'src/app/models/bill.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillsService } from './bills.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'data',
    'numero',
    'anno',
    'importo',
    'stato',
    'cliente',
    'azioni',
  ];
  dataSource!: MatTableDataSource<Bill>;
  isLoading = false;
  admin = false;
  deletingBillId!: number | null;
  private routeSub!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private billsSrv: BillsService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.createBillsTable();
  }

  createBillsTable() {
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id'] != undefined) {
        this.getBillsByCustomer(params['id']);
      } else {
        this.getAllBills();
      }
    });
  }
  getAllBills() {
    this.isLoading = true;
    this.billsSrv.getAllBills().subscribe((res) => {
      this.billsSrv.formatDataBills(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  getBillsByCustomer(customerId: number) {
    this.isLoading = true;
    this.billsSrv.getBillsByCustomer(customerId).subscribe((res) => {
      this.billsSrv.formatDataBills(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  openDeleteDialog(billId: number): void {
    this.deletingBillId = billId;
    const dialogRef = this.dialog.open(BillDeleteDialog, {
      data: { id: this.deletingBillId },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.deletingBillId = null;
      this.getAllBills();
    });
  }

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.roles.includes('ROLE_ADMIN')) {
      this.admin = true;
    }
  }
}

@Component({
  selector: 'delete-bill-dialog',
  template: `
    <h1 mat-dialog-title>Elimina fattura</h1>
    <div *ngIf="!deleteInProgress" mat-dialog-content>
      Sei sicuro di voler eliminare questa fattura?
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
        (click)="deleteBill(data.id)"
      >
        Elimina
      </button>
      <button *ngIf="!deleteInProgress || error" mat-button mat-dialog-close>
        Annulla
      </button>
    </div>
  `,
})
export class BillDeleteDialog {
  constructor(
    private billSrv: BillsService,
    public dialogRef: MatDialogRef<BillDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}
  deleteInProgress = false;
  error!: any;

  deleteBill(id: number) {
    this.deleteInProgress = true;
    this.billSrv.deleteBill(id).subscribe(
      (res) => {
        this.dialogRef.close();
      },
      (error) => {
        this.error = error;
      }
    );
  }
}
