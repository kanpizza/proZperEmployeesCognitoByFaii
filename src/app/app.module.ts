import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { FormsModule } from '@angular/forms';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import { CustomOption } from './core/custom-option';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { AppComponent } from './app/app.component';
import ComponentOne from './components/signup/signup.component';
import ComponentTwo from './components/verify-user/verify-user.component';
import ComponentThree from './components/login/signin.component';
import ComponentFour from './components/forgot-password/forgot-password.component';
import ComponentFive from './components/employee/employee.component';

import {proZperCoreModule} from './core/core.module';
import { CognitoService } from './core/cognito.service';
import { DynamoDBService } from './core/dynamodb.service';
import { EmployeeService } from './core/employeeService';
import { S3Service } from './core/s3.service';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ComponentOne,
    ComponentTwo,
    ComponentThree,
    ComponentFour,
    ComponentFive
  ],
  providers: [
    proZperCoreModule,
    CognitoService,
    DynamoDBService,
    EmployeeService,
    S3Service,
    {provide: ToastOptions, useClass: CustomOption}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}