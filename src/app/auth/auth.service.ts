import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthData, User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User|null>(null);
  userId!: number;
  userName!:string;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    let userData: User = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!isNaN(userData.id)) {
      this.userId = userData.id;
      this.userName = userData.username;
    }
  }

  signup(user: any) {
    this.user.next(user)
    return this.http.post<AuthData>(environment.pathApi + '/api/auth/signup', user).pipe(
      tap((response) => {
        this.handleAuthentication(
          response.id,
          response.username,
          response.email,
          response.roles,
          response.accessToken,
          3600
        );
        this.logout(true);
      })
    );
  }
  login(user: any) {
    this.user.next(user)
    console.log(user)
    return this.http.post<AuthData>(environment.pathApi + '/api/auth/login', user).pipe(
      tap((response) => {
        console.log(response);
        this.handleAuthentication(
          response.id,
          response.username,
          response.email,
          response.roles,
          response.accessToken,
          3600
        );
        let userData: User = JSON.parse(localStorage.getItem('userData') || '');
        this.userId = userData.id;
        this.userName = userData.username;
      })
    );
  }
  logout(forced: boolean) {
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    console.clear();
    if (forced) {
      console.info('Utente sloggato su richiesta del sistema');
    } else {
      console.info("Utente sloggato su richiesta dell'utente");
    }
    this.userId = -1;
    this.user.next(null);
    this.router.navigate(['/auth'])
  }
  autoLogin() {
    let userData: {
      id:number;
      username: string;
      email: string;
      roles: string[];
      _token: string;
      _tokenEx: Date;
    };
    let loadedUser;
    const storagePath = localStorage.getItem('userData');
    if (storagePath) {
      userData = JSON.parse(storagePath);
      loadedUser = new User(
        userData.id,
        userData.username,
        userData.email,
        userData.roles,
        userData._token,
        new Date(userData._tokenEx)
      );
      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration =
          new Date(userData._tokenEx).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    } else {
      return;
    }
  }
  autoLogout(expirationDuration: number) {
    console.info(
      'Logout automatico tra ' + expirationDuration / 1000 + ' secondi.'
    );
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout(true);
    }, expirationDuration);
  }
  private handleAuthentication(
    id: number,
    username: string,
    email: string,
    roles: string[],
    token: string,
    tokenEx: number
  ) {
    const expirationDate = new Date(new Date().getTime() + tokenEx * 1000);
    const user = new User(id,username, email, roles, token, expirationDate);
    this.user.next(user);
    this.autoLogout(tokenEx * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
