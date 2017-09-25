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
  styleUrls: ['../../app.component.css'],
  template: `
  <p id="username"></p>
  <h1>Forget Password</h1>
  <form>
    <label>Email</label>
    <input type="text" name="email" id="forget-email-input">
    request<input type="submit" id="request-reset-button" />
    <label>old password</label>
    <input type="password" name="password"  [(ngModel)]="oldPassword" id="reset-code-input"/>
    new password<input [(ngModel)]="newPassword"type="password" id="new-password-input" />
    <input type="submit" id="forget-submit-button" />
    
  `,
})
export default class ComponentFour {
  constructor() {
   
  }
  title = 'app';
  oldPassword:string ;
  newPassword:string ;
  ngOnInit() : void{
      this.forgetPassword();
  }
  forgetPassword(){
      CognitoService.changePassword(this.oldPassword,this.newPassword);
  }

 
}