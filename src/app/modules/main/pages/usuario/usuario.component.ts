import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable, map, of } from 'rxjs';
import { UsuarioSocket } from './providers/usuario.socket';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit, OnDestroy {

  @ViewChild('userModalForm') userModalForm!:TemplateRef<any>;

  public dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'label',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  public usuarios: Observable<any> = of([]);
  public roles: any;
  // public listRoles: Array<{}>;

  public _socket!: UsuarioSocket;

  constructor(private socket: UsuarioSocket, private modalService: NgbModal) {
    this.socket.connect();
    this._socket = this.socket;
  }

  ngOnInit(): void {
    this.socket.emit('findPaginated', {});
    this.socket.emit('filterData', null);
    this.usuarios = this.socket.fromEvent('_findPaginated').pipe(
      map((res: any) => ({
        ...res,
        data: res.data.map((d: any) => ({
          ...d,
          roles: d.roles.map((r: any) => r.label),
        })),
      }))
    ); 
  }

  openNewUserModal(){
    this.socket.fromEvent('_findRole').subscribe(res => this.roles = res )
    this.socket.emit('findRole');
    console.log(this.roles);
    
    this.modalService.open(this.userModalForm);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
