import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../../../environments/environment';
import { TokenService } from '../../../../../services/token.service';

@Injectable()
export class AvisoSocket extends Socket {
  constructor(tokenSrv: TokenService) {
    super({
      url: `${environment.api}`,
      options: {
        path: '/_aviso',
        extraHeaders: {
          Authorization: `Bearer ${tokenSrv.currentTokenValue}`,
        },
      },
    });
  }
}
