import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

import { CognitoService } from '../../core/cognito.service';
import {EmployeeService} from '../../core/employeeService';
import { S3Service } from '../../core/s3.service';
import {DynamoDBService} from '../../core/dynamodb.service';
@Component({
  selector: 'signin',
  styleUrls: ['../../app/app.component.css'],
  templateUrl:'signin.component.html',
})
export default class ComponentThree {
  constructor(private route:Router) {
   
  }
  title = 'app';
  email:string = null;
  password:string = null;
  
  signin(){ 
    return new Promise((resolve,reject)=>{
      CognitoService.authenticate(this.email,this.password).then(()=> resolve('succuss'));
    })
  }
  callSignin(){
    console.log('in');
    this.signin().then(data => {this.route.navigate(['/employee']);});
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "400px";
  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  openOrganMenu(){
    var organMenu = document.getElementById('nav-organSubMenu');
    if (organMenu.style.display === 'none') {
        organMenu.style.display = 'block';
    } else {
        organMenu.style.display = 'none';
    }
  }

  openEmployeeMenu(){
    var emMenu = document.getElementById('nav-emSubMenu');
    if (emMenu.style.display === 'none') {
        emMenu.style.display = 'block';
    } else {
        emMenu.style.display = 'none';
    }
  }
}