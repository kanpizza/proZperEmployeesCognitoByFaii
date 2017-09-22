import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoService } from './cognito.service';
@Component({
  selector: 'component-four',
  template: `
  <p id="username"></p>
  <h1>Change Password</h1>
  <form>
    <label>old password</label>
    <input type="password" name="email" id="forget-email-input" [(ngModel)]="oldPassword">
        request<input type="submit" id="request-reset-button" />
    <label>Reset code</label>
    <input type="password" name="password" id="reset-code-input"/>
    new password<input type="password" id="new-password-input" [(ngModel)]="newPassword"/>
    <input type="submit" id="forget-submit-button" />
    
  `,
})
export default class ComponentFour {
 oldPassword:string=null;
 newPassword:string=null;
  constructor() {
   
  }
  title = 'app';
  ngOnInit() : void{
     CognitoService.changePassword(this.oldPassword,this.newPassword);
  }
//   forgetPassword(){
//       var email;
//       document.getElementById("request-reset-button").addEventListener("click",(e) =>{
//           e.preventDefault();
//         email =  (<HTMLInputElement>document.getElementById('forget-email-input')).value;
//           var poolData = {
//             UserPoolId : 'ap-southeast-1_I7DmqS84G',
//             ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
//           };
//           var userPool = new AWSCognito.CognitoUserPool(poolData);
//           console.log(userPool);
//           var userData = {
//               Username : email,
//               Pool :userPool
//           }
        
//         var cognitoUser = new AWSCognito.CognitoUser(userData);
//         console.log('forgrt = ' +userData);
//         cognitoUser.forgotPassword({
//             onSuccess : function () {
//                 console.log("Password Reset Initiates")
//             },
//             onFailure : function(err){
//                 alert(err);
//             }
//         });
//     })
//     document.getElementById("forget-submit-button").addEventListener("click",(e)=>{
//         e.preventDefault();
//         email =  (<HTMLInputElement>document.getElementById('forget-email-input')).value;
//         var verificationCode =  (<HTMLInputElement>document.getElementById("reset-code-input")).value;
//         var newPassword =(<HTMLInputElement>document.getElementById("new-password-input")).value;
//         console.log(verificationCode,newPassword);
//         var poolData = {
//             UserPoolId : 'ap-southeast-1_I7DmqS84G',
//             ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
//           };
//           var userPool = new AWSCognito.CognitoUserPool(poolData);
//         var userData = {
//             Username : email,
//             Pool :userPool
//         }
      
//       var cognitoUser = new AWSCognito.CognitoUser(userData);
//         cognitoUser.confirmPassword(verificationCode,newPassword,{
//             onSuccess:()=>{
//                 console.log("Success");
//             },
//             onFailure: (err) => {
//                 console.log(err);
//             }
//         });
//     });
//   }

 
}