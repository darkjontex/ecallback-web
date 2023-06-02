import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { TokenService } from '../../../../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioGuard implements CanActivate {
  constructor(private tokenSrv: TokenService) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
  
  const roles = this.tokenSrv.decodedToken.roles;

  if(roles.includes('ADMIN') || roles.includes("ROOT")) return true;
  return false;
}
}
