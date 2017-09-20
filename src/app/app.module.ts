import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import ComponentOne from './component-one';
import ComponentTwo from './component-two';
import ComponentThree from './component-three';
import ComponentFour from './component-four';
import ComponentFive from './component-five';
import { CognitoService } from './cognito.service';
import { HttpModule } from '@angular/http';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DynamoDBService } from './dynamodb.service';
import { EmployeeService } from './employeeService';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import { CustomOption } from './custom-option';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { S3Service } from './s3.service';
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