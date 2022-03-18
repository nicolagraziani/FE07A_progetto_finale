import { Customer } from './customer.model';

export interface Bill {
  id: number;
  data: string;
  numero: number;
  anno: number;
  importo: number;
  stato: {
    id: number;
    nome: string;
  };
  cliente: Customer;
}

export interface Bills {
  content: Bill[]
}
