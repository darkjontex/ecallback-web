import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription, first } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { TokenService } from '../../../../services/token.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('ramalModal') ramalModal!: any;

  form: FormGroup;

  submitted = false;
  loading = false;
  error = false;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private tokenSrv: TokenService,
    private router: Router,
    private jwtHelperSrv: JwtHelperService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    const token = this.tokenSrv.currentTokenValue;
    const expired = this.jwtHelperSrv.isTokenExpired(token);
    if (!expired) this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  // convenience getter for easy access to form fields
  get _f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authSrv
      .login(this.form.value)
      .pipe(first())
      .subscribe({
        next: (data) => {
          var decoded: any = this.jwtHelperSrv.decodeToken(data.access_token);
          this.subscriptions.push(
            this.authSrv.getUserData(decoded.sub).subscribe((user: any) => {
              localStorage.setItem('username', user.username);
              localStorage.setItem('name', user.name);
            })
          );
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
