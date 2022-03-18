import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { BillsService } from '../bills.service';

@Component({
  templateUrl: './editbill.component.html',
  styleUrls: ['./editbill.component.scss'],
})
export class EditBillComponent {
  constructor(
    private billsSrv: BillsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerSrv: CustomersService
  ) {
    this.createForm();
  }
  isLoading = true;
  billId!: number;
  private routeSub!: Subscription;
  customers!: Customer[];

  billForm!: FormGroup;

  createForm() {
    console.log(this.billId)
      this.isLoading = true;
      this.customerSrv.getAllCustomers().subscribe((res) => {
        this.customers=res;
      });
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id'] != undefined) {
        this.billsSrv.getBillById(params['id']).subscribe((bill) => {
          this.billId = bill.id;
          this.billsSrv.formatDataBill(bill);
          this.billForm = this.fb.group({
            data: new FormControl(bill.data, [Validators.required]),
            numero: new FormControl(bill.numero, [Validators.required]),
            anno: new FormControl(bill.anno, [Validators.required]),
            importo: new FormControl(bill.importo, [Validators.required]),
            stato: new FormControl(String(bill.stato.id), [Validators.required]),
            cliente: new FormControl(String(bill.cliente.id), [Validators.required])
          })
          console.log(this.billForm.value)
          this.isLoading = false;
        });
      } else {
        this.billForm = this.fb.group({
          id: new FormControl(null),
          data: new FormControl('', [Validators.required]),
          numero: new FormControl('', [Validators.required]),
          anno: new FormControl('', [Validators.required]),
          importo: new FormControl('', [Validators.required]),
          stato: new FormControl('', [Validators.required]),
          cliente: new FormControl('', [Validators.required])
        })
        this.isLoading = false;
      }
    });
  }

  getErrCliente() {
    return this.getErrMsg('cliente');
  }
  getErrData() {
    return this.getErrMsg('data');
  }
  getErrNumero() {
    return this.getErrMsg('numero');
  }
  getErrAnno() {
    return this.getErrMsg('numero');
  }
  getErrImporto() {
    return this.getErrMsg('importo');
  }
  getErrStato() {
    return this.getErrMsg('stato');
  }

  getErrMsg(path: string) {
    if (this.billForm.hasError('required', path)) {
      return 'Il campo non può essere vuoto';
    }
    return;
  }
  onSubmit() {
    if (this.billForm.invalid) {
      return;
    }
    this.isLoading=true;
    console.log(this.billForm.value);
    this.formatStatus(this.billForm.value.stato);
    this.formatCustomer(this.billForm.value.cliente);
    console.log(this.billForm.value);

    if (!this.billId) {
      console.log("ciao!")
      this.billsSrv
        .addBill(this.billForm.value)
        .subscribe((res) => {
          this.router.navigate(['/bills', { added: true }]);
        });
    } else {
      this.billsSrv
        .editBill(this.billForm.value, this.billId)
        .subscribe((res) => {
          this.router.navigate(['/bills', { edited: true }]);
        });
    }
  }

  formatStatus(status: string){
    let statusValue = +status;
    if (statusValue === 1) {
      this.billForm.value.stato = {
        id: 1,
        nome: "PAGATA"
      };
    } else if ( statusValue === 2) {
      this.billForm.value.stato = {
        id: 2,
        nome: "NON PAGATA"
      };
    }
  }

  formatCustomer(customer: string){
    let customerId = +customer;
    this.billForm.value.cliente = {
      id: customerId
    };
  }

  checkForm() {
    console.clear();
    console.log(this.billForm.value);
  }
}
