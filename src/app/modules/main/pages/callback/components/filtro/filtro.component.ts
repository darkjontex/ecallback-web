import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { CallbackSocket } from '../../providers/incidencia.socket';

interface FieldsFilter {
  dataInicio: NgbDate | null,
  dataFim: NgbDate | null,
}

@Component({
  selector: 'callback-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  @Input() socket!: CallbackSocket;
  @Output() filtro = new EventEmitter();

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  form: FormGroup;

  fieldsFormFilter: FieldsFilter = {
    dataInicio: null,
    dataFim: null,
  }

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.form = this.fb.group({
      dataInicio: new FormControl(''),
      dataFim: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.fieldsFormFilter.dataInicio = this.fromDate;
    this.fieldsFormFilter.dataFim = this.toDate;
    this.onSubmit();
  }

  onSubmit(): void {
    let filter;

    const dtInicioString = new Date(
      this.fromDate?.year + '-' + this.fromDate?.month + '-' + this.fromDate?.day 
    );
    const dtFimString = new Date(
      this.toDate?.year + '-' + this.toDate?.month + '-' + this.toDate?.day + ' 23:59:59.99'
    );

    filter = {
      dataInicio: `$btw:${dtInicioString.toISOString()},${dtFimString.toISOString()}`
    }
    
    this.filtro.emit(filter);
    this.socket.emit('findPaginated', { filter });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
