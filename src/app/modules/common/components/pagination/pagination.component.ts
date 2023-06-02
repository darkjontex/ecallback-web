import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() socket!:any;
  @Input() meta:any = null;
  @Input() filter!:any;

  public selectedItemsPerPage = 15;

  private limit = 15;

  itemsPerPage(limit: number){
    this.limit = limit;
    this.socket.emit('findPaginated', {limit, filter: this.filter});
  }

  pageChange(page: number){
    this.socket.emit('findPaginated', {page, limit: this.limit, filter: this.filter});
  }
  
}
