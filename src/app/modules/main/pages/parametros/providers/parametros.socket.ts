import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { TokenService } from '../../../../../services/token.service';

@Injectable()
export class ParametrosSocket extends Socket {
  constructor(tokenSrv: TokenService) {
    super({
      url: `${environment.api}`,
      options: {
        path: '/_parametros',
        extraHeaders: {
          Authorization: `Bearer ${tokenSrv.currentTokenValue}`,
        },
      },
    });
  }
}
