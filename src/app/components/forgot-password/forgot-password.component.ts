import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

import { CognitoService } from '../../core/cognito.service';
import {EmployeeService} from '../../core/employeeService';
import { S3Service } from '../../core/s3.service';
import {DynamoDBService} from '../../core/dynamodb.service';

@Component({
  selector: 'forgot-password',
  styleUrls: ['../../app/app.component.css'],
  templateUrl:'forgot-password.component.html',
})
export default class ComponentFour {
  constructor() {
   
  }
  title = 'app';
  oldPassword:string =null;
  newPassword:string =null ;
  ngOnInit() : void{
     
  }
  callForgetPassword(){
    this.forgetPassword();
  }
  forgetPassword(){
    return new Promise((resolve,reject)=>{
        CognitoService.changePassword(this.oldPassword,this.newPassword).then(()=> resolve('succuss'));
      });

  }

 
}