import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('ramalModal') ramalModal!:TemplateRef<any>;
  
  sidebarExpanded = true;
  form: FormGroup;
  
  private subscriptions: Array<Subscription> = [];
  
  constructor(private modalService: NgbModal, private fb: FormBuilder, private mainSrv: MainService) {
    this.form = this.fb.group({
      ramal: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }



  ngAfterViewInit(): void {
    this.subscriptions.push(this.mainSrv.ramalModal.subscribe(e => {
      if(e)
        this.modalService.open(this.ramalModal);
    }))
  }

  ngOnDestroy(): void {    
    this.subscriptions.forEach(e => e.unsubscribe());
  }

  onSubmit() {
    if (!this.form.valid) return;
    localStorage.setItem('RAMAL', this.form.get('ramal')?.value);
    this.form.reset();
    this.modalService.dismissAll();
  }

}
