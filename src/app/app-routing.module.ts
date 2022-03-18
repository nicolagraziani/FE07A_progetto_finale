import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { BillsComponent } from './pages/bills/bills.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './auth/auth.guard';
import { UserstableComponent } from './pages/user/userstable/userstable.component';
import { AdminGuard } from './guards/admin.guard';
import { EditCustomerComponent } from './pages/customers/editcustomer/editcustomer.component';
import { DetailCustomerComponent } from './pages/customers/detailcustomer/detailcustomer.component';
import { EditBillComponent } from './pages/bills/editbill/editbill.component';
const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full'},
  { path: 'customers', component: CustomersComponent, canActivate:[AuthGuard] },
  { path: 'customers/details/:id', component: DetailCustomerComponent, canActivate:[AuthGuard] },
  { path: 'customers/newCustomer', component: EditCustomerComponent,canActivate:[AuthGuard, AdminGuard]},
  { path: 'customers/editCustomer/:id',component:EditCustomerComponent,canActivate:[AuthGuard, AdminGuard]},
  { path: 'bills', component: BillsComponent, canActivate:[AuthGuard] },
  { path: 'customerbills/:id', component: BillsComponent, canActivate:[AuthGuard] },
  { path: 'bills/newBill', component: EditBillComponent,canActivate:[AuthGuard, AdminGuard]},
  { path: 'bills/editBill/:id',component:EditBillComponent,canActivate:[AuthGuard, AdminGuard]},
  { path: 'user', component: UserComponent, canActivate:[AuthGuard] },
  { path: 'user/users', component: UserstableComponent, canActivate:[AuthGuard, AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
