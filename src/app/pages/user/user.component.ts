import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/pages/user/user.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private userSrv: UserService, private dialog: MatDialog) { }
  user!: any;
  admin = false;
  showTable = false;
  deletingUserId!: number | null;

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.user = userData;
    if (this.user.roles.includes('ROLE_ADMIN')){
      this.admin=true;
    }
    this.showTable = false;
  }
}
