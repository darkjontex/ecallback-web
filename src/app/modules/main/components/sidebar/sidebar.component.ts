import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TokenService } from '../../../../services/token.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
  localStorage = localStorage;
  username: any;
  roles: any;

  constructor(private mainSrv: MainService, private tokenSrv: TokenService){
    const {username, roles} = this.tokenSrv.decodedToken;
    this.username = username;
    this.roles = roles;
  }
  
  resetRamal(e: Event){
    e.preventDefault();
    localStorage.removeItem('RAMAL');
    this.mainSrv.ramalModal.next(true);
  }
}
