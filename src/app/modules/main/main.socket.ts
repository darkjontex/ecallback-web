import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class MainSocket extends Socket {  
  constructor() {
    super({
      url: `${environment.api}`,
      options: {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    });
  }
}
