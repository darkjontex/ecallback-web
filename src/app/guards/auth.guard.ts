import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authSrv: AuthService,
    private tokenSrv: TokenService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expired = this.tokenSrv.isExpired;
    const token = this.tokenSrv.currentTokenValue;

    if (!expired) {
      // logged in so return true
      return true;
    } else if (expired && token !== '') {
      this.authSrv.logout();
    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    this.router.navigate(['/auth']);
    return false;
  }
  
}
