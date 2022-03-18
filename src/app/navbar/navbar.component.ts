import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit,OnDestroy {
  constructor(private authSrv:AuthService) { }
  userLogged:boolean=false;
  userName!:string|undefined
  private userSub!: Subscription;
  logout(){
    this.authSrv.logout(false)
  }
  ngOnInit(): void {
    this.userSub = this.authSrv.user.subscribe(user=>{
      this.userLogged = user? true:false
      this.userName = user? this.authSrv.user.value?.username:''
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
