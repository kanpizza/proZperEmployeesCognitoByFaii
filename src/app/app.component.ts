import {Component} from '@angular/core';
import { Router } from '@angular/router';
// import * as AWS from 'aws-sdk';
// import * as AWSCognito from 'amazon-cognito-identity-js';
// import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { DynamoDBService } from './dynamodb.service';
@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  template: `
  current user 1
  <p id="username"></p>
    <nav>
      <a [routerLink]="['/component-one']">Component One</a>
      <a [routerLink]="['/component-two']">Component Two</a>
      <a [routerLink]="['/component-three']">Component Three</a>
      <a [routerLink]="['/component-four']">Component Four</a>
    </nav>

    <div style="color: green; margin-top: 1rem;">Outlet:</div>
    <div style="border: 2px solid green; padding: 1rem;">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor (){
    // DynamoDBService.createItem();
  }
  ngOnInit() : void{
    // this.session();
    // this.dynamoDB();
  }

  dynamoDB(){
    // var params;
    // var credentials;
    // var poolData = {
    //   UserPoolId : 'ap-southeast-1_I7DmqS84G',
    //   ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
    // };
    // console.log('gset');
    // var userPool = new AWSCognito.CognitoUserPool(poolData);
    //   var cognitoUser = userPool.getCurrentUser();

    //   if (cognitoUser != null){
    //     cognitoUser.getSession(function(err,session){
    //       if (err){
    //         alert(err);
    //         return;
    //       }
    //       if(session.isValid()){
    //         // document.getElementById('username').innerHTML = cognitoUser.getUsername();
    //         AWS.config.region = 'ap-southeast-1';
    //         var credentials = new AWS.CognitoIdentityCredentials({
    //           IdentityPoolId: 'ap-southeast-1:8c357bd7-505c-4004-8a87-c15ea83d829c',
    //           Logins : {
    //             'cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_I7DmqS84G':session.getIdToken().getJwtTokent()
    //           }
    //         });

    //         AWS.config.credentials = credentials ;
    //         console.log("DynamoDBService: reading from DDB with creds - " + AWS.config.credentials);


    //         var dynamoClient = new AWS.DynamoDB.DocumentClient();
    //         console.log('dynamo');
        
            
    //         params = {
    //           TableName : 'EmployeesCognito',
    //           Item: {
    //           "id" : "testid",
    //           }
    //         };
    //         console.log(params);
    //         dynamoClient.put(params,function(err,data){
    //           if (err){
    //             if(err.code == "ConditionalCheckFailedException"){
    //               console.log("that user already exists")
    //             }else{
    //               console.log(err)
    //             }
    //           }
    //           else console.log(data);
    //         });
    //       }
    //     })
    //   }

  }
}