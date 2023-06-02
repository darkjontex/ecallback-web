import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "src/environments/environment";
import { TokenService } from '../../../../../services/token.service';

@Injectable()
export class ComunicacaoProativaSocket extends Socket {
  constructor(tokenSrv: TokenService) {
    super({
      url: `${environment.api}`,
      options: {
        path: '/_comunicacao-proativa',
        extraHeaders: {
          Authorization: `Bearer ${tokenSrv.currentTokenValue}`,
        },
      },
    });
  }
}