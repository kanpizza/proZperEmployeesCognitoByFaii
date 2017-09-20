import {Component} from '@angular/core';
import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
@Component({
  selector: 'component-one',
  template:  ` 
  <p id="username"></p>
  <h1>Sign Up Form</h1>
  <form>
    <label>Email</label>
    <input type="text" name="email" id="email-input">
    <label>Password</label>
    <input type="password" name="password" id="password-input"/>
    <br/>
    <input type="submit" id="signup-submit-button" />
  </form>
  `
})
export default class ComponentOne { 
  userPool;
  
  constructor (){
    
    var poolData = {
      UserPoolId : 'ap-southeast-1_I7DmqS84G',
      ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
    };
    this.userPool = new AWSCognito.CognitoUserPool(poolData);

    
    console.log(poolData);
    console.log(this.userPool);
    
  }
  title = 'app';
  ngOnInit() : void{
    this.signup();
  }
  signup(){
   var dataEmail;
    document.getElementById("signup-submit-button").addEventListener("click",(e) => {
      e.preventDefault();

      var email =(<HTMLInputElement>document.getElementById('email-input')).value;
      var password = (<HTMLInputElement>document.getElementById('password-input')).value;
      
      localStorage.setItem('email',email)
      localStorage.setItem('password',password)
      
      var attributeList = [];

      dataEmail = {
        Name : 'email',
        Value : email
      };
      
      var attributeEmail = new AWSCognito.CognitoUserAttribute(dataEmail);
      attributeList.push(dataEmail);
     console.log(dataEmail);
     console.log(attributeList);
      this.userPool.signUp(email,password ,attributeList,null,function(err,result){
        if(err) {
          alert(err);
          console.log("error");
          return;
        }
       
        var cognitoUser = result.user;
        console.log("UserRegistrationService: registered user is " + cognitoUser.getUsername());

      });
      
    })
  }
}