import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenSrv: TokenService) {}

  getUserData(id: string): Observable<any> {
    return this.http.get(`/user/${id}`);
  }

  login(auth: { username: string; password: string }) {
    const { username, password } = auth;
    return this.http.post<any>(`/auth/login`, { username, password }).pipe(
      map((user) => {
        const token = user.access_token;
        this.tokenSrv.currentTokenValue = token;
        return user;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('access_token');
    this.tokenSrv.currentTokenValue = '';
  }
}
