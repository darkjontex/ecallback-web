import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime',
})
export class SecondsToTimePipe implements PipeTransform {
  transform(_seconds: number): string {
    if (_seconds > 0) {
      let sec_num = _seconds;
      let hours = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - hours * 3600) / 60);
      let seconds = sec_num - hours * 3600 - minutes * 60;

      let h = `${hours}`;
      let m = `${minutes}`;
      let s = `${seconds}`;

      if (hours < 10) h = '0' + hours;
      if (minutes < 10) m = '0' + minutes;
      if (seconds < 10) s = '0' + seconds;

      return h + 'h:' + m + 'm:' + s + 's';
    }

    return '';
  }
}
