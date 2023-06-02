import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable, of } from 'rxjs';
import { IncidenciaSocket } from '../../providers/incidencia.socket';

@Component({
  selector: 'incidencia-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  @Input() socket!: IncidenciaSocket;
  @Output() filtro = new EventEmitter();

  form: FormGroup;
  filterData: Observable<any> = of([]);
  filterTitle: string | null = '';

  // Campos de filtro preenchido
  selectedNumero: any = '';
  selectedDataInicio: NgbDate | null = null;
  selectedLastCallbackCreatedAt: NgbDate | null = null;
  selectedDepartamento: any[] = [];
  selectedGerencia: any[] = [];
  selectedMunicipio: any[] = [];
  selectedLastCallbackRetorno: any[] = [];
  selectedEstado: any[] = [];
  selectedDistribuidora: any[] = [];
  selectedAlimentador: any[] = [];
  selectedUc: any = '';

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    allowSearchFilter: true,
  };

  constructor(private fb: FormBuilder, public formatter: NgbDateParserFormatter) {
    this.form = this.fb.group({
      numero: new FormControl(''),
      dataInicio: new FormControl(''),
      lastCallbackCreatedAt: new FormControl(''),
      departamento: new FormControl(''),
      gerencia: new FormControl(''),
      municipio: new FormControl(''),
      lastCallbackRetorno: new FormControl(''),
      estado: new FormControl(''),
      distribuidora: new FormControl(''),
      alimentador: new FormControl(''),
      uc: new FormControl(''),
    });
  }  

  ngOnInit(): void {
    this.filterData = this.socket.fromEvent('_filterData');
    this.loadLocalStorageParams();
  }

  onSubmit() {
    this.clearLocalStorageParams();

    let filter = Object.keys(this.form.value).reduce(
      (acc: any, key: string) => {
        let valueInput = this.form.get(key)?.value;

        if (valueInput) {
          switch (key) {
            case 'numero':
            case 'uc':
              acc[key] = `$eq:${valueInput}`;
              break;
            case 'dataInicio':
            case 'lastCallbackCreatedAt':
              let newDate = new Date(
                valueInput.year + '-' + valueInput.month + '-' + valueInput.day
              );
              acc[key] = `$gte:${newDate.toISOString()}`;
              break;
            default:
              if (valueInput.length > 0) {
                acc[key] = `$in:${valueInput.join(',')}`;
              }
              break;
          }
        }
        return acc;
      },
      {}
    );

    if (Object.keys(filter).length > 0) 
      localStorage.setItem('filtro_incidencia', JSON.stringify(filter))
    else 
      localStorage.removeItem('filtro_incidencia');

    this.filtro.emit(filter);
    this.socket.emit('findPaginated', { filter });
    this.setFilterTitle();
  }

  onClear() {
    this.filterTitle = '';
    this.clearLocalStorageParams();
    this.filtro.emit({});
    this.socket.emit('findPaginated', {});
  }

  maskFilled(event: any) {
    if (!event) return;

    let inputValue = event;
    inputValue = event.replace(/\D/g, '');

    // Limit the input value to a maximum of 10 digits
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }

    if (inputValue.length > 1) {
      inputValue =
        inputValue.slice(0, inputValue.length - 1) +
        '-' +
        inputValue.slice(inputValue.length - 1);
    }

    this.selectedNumero = inputValue;
  }

  clearLocalStorageParams() {
    localStorage.removeItem('filtro_incidencia');
  }

  loadLocalStorageParams() {
    if (!localStorage.getItem('filtro_incidencia')) return;

    let filterCache = JSON.parse(localStorage.getItem('filtro_incidencia') || '');

    this.selectedNumero = filterCache.numero ? this.purifyParamValue(filterCache.numero) : '';

    if (filterCache.dataInicio) {
      let newDate = this.purifyParamValue(filterCache.dataInicio); 
      this.selectedDataInicio = new NgbDate(parseInt(newDate.slice(0,4)), parseInt(newDate.slice(5,7)), parseInt(newDate.slice(8,10)));
    } else {
      this.selectedDataInicio = null;
    }

    if (filterCache.lastCallbackCreatedAt) {
      let newDate = this.purifyParamValue(filterCache.lastCallbackCreatedAt); 
      this.selectedLastCallbackCreatedAt = new NgbDate(parseInt(newDate.slice(0,4)), parseInt(newDate.slice(5,7)), parseInt(newDate.slice(8,10)));      
    } else {
      this.selectedLastCallbackCreatedAt = null;
    }

    this.selectedUc = filterCache.uc ? this.purifyParamValue(filterCache.uc) : '';

    if (filterCache.departamento)
      this.selectedDepartamento.push(...this.purifyParamValue(filterCache.departamento).split(','));

    if (filterCache.gerencia)
      this.selectedGerencia.push(...this.purifyParamValue(filterCache.gerencia).split(','));

    if (filterCache.municipio)
      this.selectedMunicipio.push(...this.purifyParamValue(filterCache.municipio).split(','));

    if (filterCache.lastCallbackRetorno)
      this.selectedLastCallbackRetorno.push(...this.purifyParamValue(filterCache.lastCallbackRetorno).split(','));

    if (filterCache.estado)
      this.selectedEstado.push(...this.purifyParamValue(filterCache.estado).split(','));

    if (filterCache.distribuidora)
      this.selectedDistribuidora.push(...this.purifyParamValue(filterCache.distribuidora).split(','));

    if (filterCache.alimentador)
      this.selectedAlimentador.push(...this.purifyParamValue(filterCache.alimentador).split(','));

    // Filtrar
    this.socket.emit('findPaginated', { filter: filterCache });
    this.filtro.emit(filterCache);
    this.setFilterTitle();
  }

  purifyParamValue(paramValue: string) {
    return paramValue?.slice(paramValue.indexOf(':') + 1, paramValue.length);
  }

  setFilterTitle(): void {
    if (localStorage.getItem('filtro_incidencia')) {

      let params = '';
      this.filterTitle = '';

      if (this.selectedNumero) {
        params = `Numero: ${this.selectedNumero}`;
        this.filterTitle = params;
      }

      if (this.selectedDataInicio) {
        params = 'Data início: ' + this.formatNgbDate(this.selectedDataInicio);
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedLastCallbackCreatedAt) {
        params = 'Data do último callback: ' + this.formatNgbDate(this.selectedLastCallbackCreatedAt);
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedDepartamento?.length > 0) {
        params = (this.selectedDepartamento.length == 1)
          ? `Departamento: ${this.selectedDepartamento[0]}`
          : `Departamentos: ${this.selectedDepartamento[0]}(+)`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedGerencia?.length > 0) {
        params = (this.selectedGerencia.length == 1)
          ? `Gerência: ${this.selectedGerencia[0]}`
          : `Gerências: ${this.selectedGerencia[0]}(+)`;
          this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedMunicipio?.length > 0) {
        params = (this.selectedMunicipio.length == 1)
          ? `Município: ${this.selectedMunicipio[0]}`
          : `Municípios: ${this.selectedMunicipio[0]}(+)`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedLastCallbackRetorno?.length > 0) {
        params = (this.selectedLastCallbackRetorno.length == 1)
          ? `Último retorno: ${this.selectedLastCallbackRetorno[0]}`
          : `Últimos retornos: ${this.selectedLastCallbackRetorno[0]}(+)`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedEstado?.length > 0) {
        this.selectedEstado;
        params = (this.selectedEstado.length == 1)
          ? `Estado: ${this.selectedEstado[0]}`
          : `Estados: ${this.selectedEstado[0]}(+)`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedDistribuidora?.length > 0) {
        params = (this.selectedDistribuidora.length == 1)
          ? `Distribuidora: ${this.selectedDistribuidora[0]}`
          : `Distribuidoras: ${this.selectedDistribuidora[0]}(+)`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedAlimentador?.length > 0) {
        params = (this.selectedAlimentador.length == 1)
          ? `Alimentador: ${this.selectedAlimentador[0]}`
          : `Alimentadores: ${this.selectedAlimentador[0]}(+)`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      if (this.selectedUc) {
        params = `Numero: ${this.selectedUc}`;
        this.filterTitle = this.filterTitle ? this.filterTitle + ' | ' + params : params;
      }

      this.filterTitle = ` (${this.filterTitle})`;
    } else {
      this.filterTitle = '';
    }
  }

  formatNgbDate(data: NgbDate): string {
    return `${data.year}-${data.month.toString().padStart(2, '0')}-${data.day.toString().padStart(2, '0')}`;
  }
}
