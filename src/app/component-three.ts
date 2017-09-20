import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoService} from './cognito.service';
@Component({
  selector: 'component-three',
  template: `
  current user
  <p id="username"></p>
  <h1>sign in</h1>
  <form>
    <label>Email</label>
    <input type="text" name="email" id="login-email-input" [(ngModel)]="email" />
    <label>Password</label>
    <input type="password" name="password" id="login-password-input" [(ngModel)]="password"/>
    <br/>
    <button (click)="callSignin()">call</button>

    <input type="submit" id="logout-submit-button" />logout
    
    <input [routerLink]="['/component-five']"  type="submit" id="submit-button" />เข้าระบบ
    <br>
  </form>
  <router-outlet></router-outlet>
  `,
})
export default class ComponentThree {
  constructor(private route:Router) {
   
  }
  title = 'app';
  email:string = null;
  password:string = null;
  ngOnInit() : void{
  //  this.signin();
  //  this.session();
  
  }
  signin(){ 
    return new Promise((resolve,reject)=>{
      CognitoService.authenticate(this.email,this.password).then(()=> resolve('succuss'));
    })
   
    // return new Promise((resolve,reject)=>{
    //   var userPool;
    //       var authenticationData = {
    //           Username : this.email,
    //           Password : this.password
    //       };
    //       var authenticationDetails= new AWSCognito.AuthenticationDetails(authenticationData);

    //       var poolData = {
    //         UserPoolId : 'ap-southeast-1_I7DmqS84G',
    //         ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
    //       };
    //       userPool = new AWSCognito.CognitoUserPool(poolData);

    //       var userData = {
    //           Username : this.email,
    //           Pool : userPool
    //       };
    //       var cognitoUser = new AWSCognito.CognitoUser(userData);
    //       console.log(userData);
    //       cognitoUser.authenticateUser(authenticationDetails, {
    //           onSuccess: function (result){
                
    //               console.log('access token + ' + result.getAccessToken().getJwtToken());
    //               AWS.config.region = 'ap-southeast-1';
    //               AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //                 IdentityPoolId: 'ap-southeast-1:8c357bd7-505c-4004-8a87-c15ea83d829c',
    //                 Logins : {
    //                   'cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_I7DmqS84G':result.getIdToken().getJwtToken()
    //                 }
    //               });
    //               // AWS.config.credentials = credentials ;
    //               console.log("DynamoDBService: reading from DDB with creds - " + AWS.config.credentials);
    //               // this.route.navigate(['./component-five']);
    //               resolve();
    //           },
    //           onFailure : function(err){
    //               alert(err);
    //               reject();
    //           },
    //       });

    //   document.getElementById("logout-submit-button").addEventListener("click",(e)=> {
    //       e.preventDefault();
    //       var cognitoUser = userPool.getCurrentUser();
    //       if(cognitoUser){
    //           cognitoUser.signOut();
    //       }
    //   })
    // })
  }
  callSignin(){
    console.log('in');
    this.signin().then(data => {this.route.navigate(['/component-five']);});
  }
  session(){
    var userPool;
    var poolData = {
      UserPoolId : 'ap-southeast-1_I7DmqS84G',
      ClientId : 'l1rd23b9i4o2b7d6qusvnbjr3' 
    };
    userPool = new AWSCognito.CognitoUserPool(poolData);
    window.onload = function(){
      var cognitoUser = userPool.getCurrentUser();
      if (cognitoUser != null) {
        cognitoUser.getSession(function(err,session){
          if (err){
            alert(err);
            return;
          }
          if (session.isValid()){
            (<HTMLInputElement>document.getElementById('username')).value= cognitoUser.getUserName();
          };
        });
      }
    }
    
  }
  getEmployees(){
    console.log(AWS.config);
    var params;
    var dynamo = new AWS.DynamoDB({region : "ap-southeast-1"});
    var dynamoClient = new AWS.DynamoDB.DocumentClient({service:dynamo});
    console.log('dynamo');
    params = {
              TableName : 'EmployeesCognito',
              Item: {
              "id" : "testid",
        }
    };
    console.log(params);
      dynamoClient.put(params,function(err,data){
              if (err){
                if(err.code == "ConditionalCheckFailedException"){
                  console.log("that user already exists")
                }else{
                  console.log(err)
                }
              }
              else console.log(data);
            });
          }
}