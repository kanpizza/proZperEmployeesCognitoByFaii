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
  styleUrls: ['../../app.component.css'],
  template: `
          <body>
          <div class="title-bar w3-container">
          <button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons" (click)="openNav()">menu</i></button>
          <img src="assets/Images/proZper.png">
          </div>
        <div id="mySidenav"style="opacity:1.0;filter:alpha(opacity=200)" class="w3-sidebar w3-bar-block w3-animate-left" (mouseleave)="closeNav()">
        <div class="sidenav-menu-header w3-container">
          </div>
          <a [routerLink]="['/signup']"class="w3-bar-item w3-button "><i class="material-icons nav-icon">priority_high</i>สมัครสมาชิก</a>
          <a [routerLink]="['/forgot-password']"class="w3-bar-item w3-button "><i class="material-icons nav-icon">priority_high</i>ลืมรหัสผ่าน</a>
          <a  [routerLink]="['/verify-user']" class="w3-bar-item w3-button"><i class="material-icons nav-icon">verified_user</i>ป้อนรหัสยืนยัน</a>
          <a href="#" class="w3-bar-item w3-button" ><i class="material-icons nav-icon">info</i>เกี่ยวกับ</a>
        </div>
        <div class="signin-card">
        <form class="w3-container nav-toolbar w3-padding">
          <div>
            <label class="pzl-signin-label">ชื่อผู้ใช้</label>
            <input type="text" name="email" id="login-email-input" [(ngModel)]="email" />
          </div>
          <div>
            <label>รหัสผ่าน</label>
            <input type="password" name="password" id="login-password-input" [(ngModel)]="password"/>
          </div>
            <br/>
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"  (click)="callSignin()" id="sendLink"><i class="material-icons">lock_open</i></button>
            <br>
          </form>
          <router-outlet></router-outlet>
        
        </div>
        </body>
 
  `,
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