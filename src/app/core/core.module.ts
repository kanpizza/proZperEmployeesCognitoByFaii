import { NgModule } from '@angular/core';

import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';

import { CognitoService } from './cognito.service';
import { CustomOption } from './custom-option'; 
import { DynamoDBService } from './dynamodb.service';
import { EmployeeService } from './employeeService';

@NgModule({
    imports: [ 
      ToastModule.forRoot()
    ],
    providers: [
        CognitoService,
        CustomOption,
        DynamoDBService,
        EmployeeService,
      { provide: ToastOptions, useClass: CustomOption }
    ]
  })
  export class proZperCoreModule { 
    }