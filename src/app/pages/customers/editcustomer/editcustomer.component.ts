import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comune, Provincia } from 'src/app/models/customer.model';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./editcustomer.component.scss'],
})
export class EditCustomerComponent {
  constructor(
    private customersSrv: CustomersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }
  isLoading = true;
  customerId!: number;
  private routeSub!: Subscription;

  customerForm!: FormGroup;
  comuneSedeOp!: FormGroup;
  provinciaSedeOp!: FormGroup;
  comuneSedeLeg!: FormGroup;
  provinciaSedeLeg!: FormGroup;

  province!: Provincia[];
  comuni!: Comune[];

  selectedProvinciaOp!: number | string;
  selectedProvinciaLeg!: number | string;

  noAddress = {
    id: 0,
    via: '',
    civico: '',
    cap: '',
    localita: '',
    comune: {
      id: 0,
      nome: '',
      provincia: {
        id: 0,
        nome: '',
        sigla: '',
      },
    },
  };

  createForm() {
    this.customersSrv.getAllProvince().subscribe((res) => {
      this.province = res;
    });
    this.customersSrv.getAllComuni().subscribe((res) => {
      this.comuni = res;
    });
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id'] != undefined) {
        this.isLoading = true;
        this.customersSrv.getCustomer(params['id']).subscribe((customer) => {
          //Form Precompilato per Modifica Cliente
          this.customerId = customer.id;
          if (!customer.indirizzoSedeOperativa) {
            customer.indirizzoSedeOperativa = this.noAddress;
          }
          if (!customer.indirizzoSedeLegale) {
            customer.indirizzoSedeLegale = this.noAddress;
          }
          this.customerForm = this.fb.group({
            // Azienda
            ragioneSociale: new FormControl(customer.ragioneSociale, [
              Validators.required,
            ]),
            partitaIva: new FormControl(customer.partitaIva, [
              Validators.required,
            ]),
            tipoCliente: new FormControl(customer.tipoCliente, [
              Validators.required,
            ]),
            email: new FormControl(customer.email, [Validators.email]),
            pec: new FormControl(customer.pec, [Validators.email]),
            telefono: new FormControl(customer.telefono),
            // Referente
            nomeContatto: new FormControl(customer.nomeContatto),
            cognomeContatto: new FormControl(customer.cognomeContatto),
            telefonoContatto: new FormControl(customer.telefonoContatto),
            emailContatto: new FormControl(customer.emailContatto, [
              Validators.required,
              Validators.email,
            ]),
            //Indirizzi
            indirizzoSedeOperativa: this.fb.group({
              via: new FormControl(
                this.testForNull(customer.indirizzoSedeOperativa.via)
              ),
              civico: new FormControl(
                this.testForNull(customer.indirizzoSedeOperativa.civico)
              ),
              cap: new FormControl(
                this.testForNull(customer.indirizzoSedeOperativa.cap)
              ),
              localita: new FormControl(
                this.testForNull(customer.indirizzoSedeOperativa.localita)
              ),
              comune: this.fb.group({
                id: new FormControl(
                  String(
                    this.testForNull(customer.indirizzoSedeOperativa.comune.id)
                  ),
                  [Validators.required]
                ),
                provincia: this.fb.group({
                  id: new FormControl(
                    String(
                      this.testForNull(
                        customer.indirizzoSedeOperativa.comune.provincia.id
                      )
                    ),
                    [Validators.required]
                  ),
                }),
              }),
            }),
            indirizzoSedeLegale: this.fb.group({
              via: new FormControl(
                this.testForNull(customer.indirizzoSedeLegale.via)
              ),
              civico: new FormControl(
                this.testForNull(customer.indirizzoSedeLegale.civico)
              ),
              cap: new FormControl(
                this.testForNull(customer.indirizzoSedeLegale.cap)
              ),
              localita: new FormControl(
                this.testForNull(customer.indirizzoSedeLegale.localita)
              ),
              comune: this.fb.group({
                id: new FormControl(
                  String(
                    this.testForNull(customer.indirizzoSedeLegale.comune.id)
                  ),
                  [Validators.required]
                ),
                provincia: this.fb.group({
                  id: new FormControl(
                    String(
                      this.testForNull(
                        customer.indirizzoSedeLegale.comune.provincia.id
                      )
                    ),
                    [Validators.required]
                  ),
                }),
              }),
            }),
          });

          this.isLoading = false;
          this.updateSelectedProvinciaOp(true);
          this.updateSelectedProvinciaLeg(true);
        });
      } else {
        //Form Vuoto per Nuovo Cliente
        this.customerForm = this.fb.group({
          id: new FormControl(null),
          // Azienda
          ragioneSociale: new FormControl('', [Validators.required]),
          partitaIva: new FormControl('', [Validators.required]),
          tipoCliente: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.email]),
          pec: new FormControl('', [Validators.email]),
          telefono: new FormControl(''),
          // Referente
          nomeContatto: new FormControl(''),
          cognomeContatto: new FormControl(''),
          telefonoContatto: new FormControl(''),
          emailContatto: new FormControl('', [
            Validators.required,
            Validators.email,
          ]),
          //Indirizzi
          indirizzoSedeOperativa: this.fb.group({
            via: new FormControl(''),
            civico: new FormControl(''),
            cap: new FormControl(''),
            localita: new FormControl(''),
            comune: this.fb.group({
              id: new FormControl('', [Validators.required]),
              nome: '',
              provincia: this.fb.group({
                id: new FormControl(''),
              }),
            }),
          }),
          indirizzoSedeLegale: this.fb.group({
            via: new FormControl(''),
            civico: new FormControl(''),
            cap: new FormControl(''),
            localita: new FormControl(''),
            comune: this.fb.group({
              id: new FormControl('', [Validators.required]),
              nome: '',
              provincia: this.fb.group({
                id: new FormControl(''),
              }),
            }),
          }),
        });
        this.isLoading = false;
        this.updateSelectedProvinciaOp(true);
        this.updateSelectedProvinciaLeg(true);
      }
    });
  }
  testForNull(value: any) {
    return value ? String(value) : '';
  }
  updateSelectedProvinciaOp(init?: boolean) {
    this.comuneSedeOp = (
      this.customerForm.controls['indirizzoSedeOperativa'] as FormGroup
    ).controls['comune'] as FormGroup;

    this.provinciaSedeOp = this.comuneSedeOp.controls['provincia'] as FormGroup;

    this.selectedProvinciaOp = this.provinciaSedeOp.controls['id'].value;

    this.selectedProvinciaOp
      ? this.comuneSedeOp.controls['id'].enable()
      : this.comuneSedeOp.controls['id'].disable();

    init ? null : this.comuneSedeOp.controls['id'].reset();
  }
  updateSelectedProvinciaLeg(init?: boolean) {
    this.comuneSedeLeg = (
      this.customerForm.controls['indirizzoSedeLegale'] as FormGroup
    ).controls['comune'] as FormGroup;
    this.provinciaSedeLeg = this.comuneSedeLeg.controls[
      'provincia'
    ] as FormGroup;
    this.selectedProvinciaLeg = this.provinciaSedeLeg.controls['id'].value;
    this.selectedProvinciaLeg
      ? this.comuneSedeLeg.controls['id'].enable()
      : this.comuneSedeLeg.controls['id'].disable();
    init ? null : this.comuneSedeLeg.controls['id'].reset();
  }
  getErrRagioneSociale() {
    return this.getErrMsg('ragioneSociale');
  }
  getErrPartitaIva() {
    return this.getErrMsg('partitaIva');
  }
  getErrTipoCliente() {
    return this.getErrMsg('tipoCliente');
  }
  getErrEmail() {
    return this.getErrMsg('email');
  }
  getErrPEC() {
    return this.getErrMsg('pec');
  }
  getErrEmailContatto() {
    return this.getErrMsg('emailContatto');
  }
  getErrProvinciaOp() {
    return this.provinciaSedeOp.controls['id'].hasError('required')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  getErrComuneOp() {
    return this.comuneSedeOp.controls['id'].hasError('required')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  getErrProvinciaLeg() {
    return this.provinciaSedeLeg.controls['id'].hasError('required')
      ? 'Il campo non può essere vuoto'
      : '';
  }
  getErrComuneLeg() {
    return this.comuneSedeLeg.controls['id'].hasError('required')
      ? 'Il campo non può essere vuoto'
      : '';
  }

  getErrMsg(path: string) {
    if (this.customerForm.hasError('required', path)) {
      return 'Il campo non può essere vuoto';
    }
    if (this.customerForm.hasError('email', path)) {
      return 'Email non Valida';
    }
    return;
  }
  onSubmit() {
    if (this.customerForm.invalid) {
      return;
    }
    this.isLoading=true;
    console.log(this.customerForm.value)
    if (!this.customerId) {
      this.customersSrv
        .addCustomer(this.customerForm.value)
        .subscribe((res) => {
          this.router.navigate(['/customers', { added: true }]);
        });
    } else {
      this.customersSrv
        .editCustomer(this.customerForm.value, this.customerId)
        .subscribe((res) => {
          this.router.navigate(['/customers', { edited: true }]);
        });
    }
  }
  checkForm() {
    console.clear();
    console.log(this.customerForm.value);
  }
}
