import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User, Users } from 'src/app/models/user.model';

@Component({
  selector: 'app-userstable',
  templateUrl: './userstable.component.html',
  styleUrls: ['./userstable.component.scss'],
})
export class UserstableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'roles'];
  dataSource!: MatTableDataSource<User>;
  isLoading = false;
  admin = false;
  deletingUserId!: number | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userSrv: UserService, private dialog: MatDialog) {
    this.getAllUsers();
  }

  getAllUsers() {
    this.isLoading = true;
    this.userSrv.getAllUsers().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
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
