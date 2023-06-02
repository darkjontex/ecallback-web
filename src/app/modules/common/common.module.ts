import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { COMPONENTS } from './components';
import { PIPES } from './pipes';


@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [NgCommonModule, NgbPagination, FormsModule  ],
  exports: [NgCommonModule, ...PIPES, ...COMPONENTS]
})
export class CommonModule {}
