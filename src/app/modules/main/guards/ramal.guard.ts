import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { MainService } from '../services/main.service';

@Injectable({
  providedIn: 'root',
})
export class RamalGuard implements CanActivate {
  constructor(private modalService: NgbModal, private mainSrv: MainService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!localStorage.getItem('RAMAL'))
      this.mainSrv.ramalModal.next(true);
    return true;
  }
}
