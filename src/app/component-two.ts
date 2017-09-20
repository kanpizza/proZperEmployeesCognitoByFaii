import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
@Component({
  selector: 'component-two',
  template: `
  <div>
  <p id="username"></p>
    <p>Confirmation Form</p>
    
    <form>
      <label>Email</label>
      <input type="text" name="email" id="confirmation-email-input"/>
      <label>Confirmation Code</label>
      <input type="text" name="confirmation" id="confirmation-code-input" />
      <input type="submit" id="confirmation-submit-button" />
    </form>
    </div>

  `,
})
export default class ComponentTwo {
  private id;
  cognitoUser;
  userPool;
  constructor() {
    var poolData = {
      UserPoolId : 'ap-southeast-1_I7DmqS84G',
      ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
    };
    this.userPool = new AWSCognito.CognitoUserPool(poolData);
    console.log(this.cognitoUser);
    
  }
  title = 'app';
  ngOnInit() : void{
    this.confirmEmail();
  }
  confirmEmail(){
    document.getElementById("confirmation-submit-button").addEventListener("click",(e)=>{
      e.preventDefault();
      console.log("in");
      var confirmationCode = (<HTMLInputElement>document.getElementById("confirmation-code-input")).value;
      var email = (<HTMLInputElement>document.getElementById("confirmation-email-input")).value;
      var userData = {
        Username : email,
        Pool : this.userPool
      };
      var cognitoUser = new AWSCognito.CognitoUser(userData);
      console.log(confirmationCode);
      console.log(email);
      cognitoUser.confirmRegistration(confirmationCode,true,function(err,result){
         
        if(err){
            alert(err);
            return;
          }
          
          var authenticationData = {
            Username : localStorage.getItem("email"),
            Password : localStorage.getItem("password")
          };
          localStorage.clear();
          var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);
      
            console.log('authen ' + authenticationData);
          cognitoUser.authenticateUser(this.authenticationDetails,{
            onSuccess: function (result){
              console.log('access token + ' + result.getAccessToken().getJwtToken());
            },
            onFailure : function(err){
              alert(err);
            }
          });
          console.log('call resullt ' + result);
        });
    })
  }
}