import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private router : Router, private authSrv: AuthService){}

  ngOnInit(): void {
    this.authSrv.logout();
    this.router.navigate(['/']);
  }

}
