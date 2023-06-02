import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'resultCode' })
export class ResultCodePipe implements PipeTransform {
  transform(value: number): string {
    // export enum ResultCode {
    //     ATENDIDO_SEM_ENERGIA = 1001,
    //     ATENDIDO_COM_ENERGIA = 1002,
    //     NAO_ATENDIDO = 1003,
    //  }
    if (value === 1001) return 'Sem energia';
    if (value === 1002) return 'Com energia';
    if (value === 1003) return 'Não atendido';
    return '';
  }
}
