import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  constructor(private jwtHelperSrv: JwtHelperService) {
    const currentToken = localStorage.getItem('access_token') || '';
    this.currentTokenSubject = new BehaviorSubject<string>(currentToken);
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  get decodedToken(): any {
    return this.jwtHelperSrv.decodeToken(this.currentTokenValue);
  }

  get currentTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  set currentTokenValue(value: string) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('access_token', value);
    this.currentTokenSubject.next(value);
  }

  get isExpired(): boolean {
    const _jwt = this.jwtHelperSrv;
    const token = this.currentTokenValue;
    if (!this.currentTokenValue) return true;
    return _jwt.isTokenExpired(token);
  }
}
