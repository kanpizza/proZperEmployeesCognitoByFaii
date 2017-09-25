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
    <label>Reset code</label>
    <input type="password" name="password" id="reset-code-input"/>
    new password<input type="password" id="new-password-input" />
    <input type="submit" id="forget-submit-button" />
    
  `,
})
export default class ComponentFour {
  constructor() {
   
  }
  title = 'app';
  ngOnInit() : void{
      this.forgetPassword();
  }
  forgetPassword(){
      var email;
      document.getElementById("request-reset-button").addEventListener("click",(e) =>{
          e.preventDefault();
        email =  (<HTMLInputElement>document.getElementById('forget-email-input')).value;
          var poolData = {
            UserPoolId : 'ap-southeast-1_I7DmqS84G',
            ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
          };
          var userPool = new AWSCognito.CognitoUserPool(poolData);
          console.log(userPool);
          var userData = {
              Username : email,
              Pool :userPool
          }
        
        var cognitoUser = new AWSCognito.CognitoUser(userData);
        console.log('forgrt = ' +userData);
        cognitoUser.forgotPassword({
            onSuccess : function () {
                console.log("Password Reset Initiates")
            },
            onFailure : function(err){
                alert(err);
            }
        });
    })
    document.getElementById("forget-submit-button").addEventListener("click",(e)=>{
        e.preventDefault();
        email =  (<HTMLInputElement>document.getElementById('forget-email-input')).value;
        var verificationCode =  (<HTMLInputElement>document.getElementById("reset-code-input")).value;
        var newPassword =(<HTMLInputElement>document.getElementById("new-password-input")).value;
        console.log(verificationCode,newPassword);
        var poolData = {
            UserPoolId : 'ap-southeast-1_I7DmqS84G',
            ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
          };
          var userPool = new AWSCognito.CognitoUserPool(poolData);
        var userData = {
            Username : email,
            Pool :userPool
        }
      
      var cognitoUser = new AWSCognito.CognitoUser(userData);
        cognitoUser.confirmPassword(verificationCode,newPassword,{
            onSuccess:()=>{
                console.log("Success");
            },
            onFailure: (err) => {
                console.log(err);
            }
        });
    });
  }

 
}