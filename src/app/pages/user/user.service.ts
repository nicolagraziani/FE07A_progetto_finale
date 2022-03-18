import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs';
import { User, Users } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http
      .get<Users>(`${environment.pathApi}/api/users?sort=id&size=99999`)
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }

  deleteUser(userId: number) {
    return this.http.delete(`${environment.pathApi}/api/clienti/${userId}`);
  }
}
