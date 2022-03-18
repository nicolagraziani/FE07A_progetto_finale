import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';


// Component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { UserComponent } from './pages/user/user.component';
import { UserstableComponent } from './pages/user/userstable/userstable.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { EditCustomerComponent } from './pages/customers/editcustomer/editcustomer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BillDeleteDialog, BillsComponent } from './pages/bills/bills.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { SpinnerComponent } from './spinner/spinner.component';
import { CustomerDeleteDialog } from './pages/customers/customers.component';
import { DetailCustomerComponent } from './pages/customers/detailcustomer/detailcustomer.component';
import { EditBillComponent } from './pages/bills/editbill/editbill.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    UserComponent,
    UserstableComponent,
    CustomersComponent,
    EditCustomerComponent,
    NavbarComponent,
    BillsComponent,
    SpinnerComponent,
    CustomerDeleteDialog,
    DetailCustomerComponent,
    EditCustomerComponent,
    EditBillComponent,
    BillDeleteDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatExpansionModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
